import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { createAbuseProtection } from "./abuse-protection.mjs";

const limits = { read: 2, write: 1, location: 1, stream: 10 };

function makeResponse() {
  const response = new EventEmitter();
  response.headers = {};
  response.statusCode = 200;
  response.set = (name, value) => {
    response.headers[name.toLowerCase()] = value;
    return response;
  };
  response.status = (statusCode) => {
    response.statusCode = statusCode;
    return response;
  };
  response.json = (body) => {
    response.body = body;
    return response;
  };
  return response;
}

function request(middleware, {
  ip = "203.0.113.1",
  method = "GET",
  path = "/api/visitors/visitor-1",
} = {}) {
  const response = makeResponse();
  let nextCalled = false;
  middleware(
    { ip, method, originalUrl: path, path, socket: { remoteAddress: ip } },
    response,
    () => {
      nextCalled = true;
    },
  );
  return { response, nextCalled };
}

test("limits requests by client and category and returns retry headers", () => {
  let currentTime = 10_000;
  const middleware = createAbuseProtection({
    limits,
    now: () => currentTime,
  });

  assert.equal(request(middleware).nextCalled, true);
  assert.equal(request(middleware).nextCalled, true);
  const blocked = request(middleware);
  assert.equal(blocked.response.statusCode, 429);
  assert.equal(blocked.response.headers["retry-after"], "60");
  assert.equal(blocked.response.headers["ratelimit-limit"], "2");
  assert.equal(blocked.nextCalled, false);

  assert.equal(
    request(middleware, { method: "POST" }).nextCalled,
    true,
    "write requests use a separate category",
  );
  currentTime += 60_000;
  assert.equal(request(middleware).nextCalled, true, "expired windows reset");
});

test("applies a dedicated limit to the paid location endpoint", () => {
  const middleware = createAbuseProtection({
    limits,
    now: () => 20_000,
  });

  assert.equal(request(middleware, { path: "/api/location" }).nextCalled, true);
  assert.equal(request(middleware, { path: "/api/location" }).response.statusCode, 429);
  assert.equal(request(middleware).nextCalled, true);
});

test("caps concurrent streams per client and releases slots when they close", () => {
  const middleware = createAbuseProtection({
    limits,
    maxStreamsPerIp: 1,
    maxOpenStreams: 2,
    now: () => 30_000,
  });

  const first = request(middleware, { path: "/api/visitors/visitor-1/stream" });
  assert.equal(first.nextCalled, true);
  const blocked = request(middleware, { path: "/api/visitors/visitor-2/stream" });
  assert.equal(blocked.response.statusCode, 429);

  first.response.emit("close");
  assert.equal(
    request(middleware, { path: "/api/visitors/visitor-3/stream" }).nextCalled,
    true,
  );
});

test("bounds rate-limit state and reclaims expired client buckets", () => {
  let currentTime = 40_000;
  const middleware = createAbuseProtection({
    windowMs: 1_000,
    limits,
    maxBuckets: 1,
    now: () => currentTime,
  });

  assert.equal(request(middleware, { ip: "203.0.113.1" }).nextCalled, true);
  assert.equal(
    request(middleware, { ip: "203.0.113.2" }).response.statusCode,
    429,
  );

  currentTime += 1_001;
  assert.equal(request(middleware, { ip: "203.0.113.2" }).nextCalled, true);
});