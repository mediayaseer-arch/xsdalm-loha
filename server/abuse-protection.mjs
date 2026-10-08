const WINDOW_MS = 60_000;
const CLEANUP_INTERVAL_MS = 30_000;
const MAX_BUCKETS = 20_000;
const MAX_STREAMS_PER_IP = 20;
const MAX_OPEN_STREAMS = 500;
const DEFAULT_LIMITS = Object.freeze({
  read: 1200,
  write: 600,
  status: 600,
  location: 100,
  stream: 300,
});

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function getClientKey(req) {
  return req.ip || req.socket?.remoteAddress || "unknown";
}

function getCategory(req) {
  const pathname = (req.originalUrl || req.url || req.path || "").split("?")[0];
  if (pathname.endsWith("/stream")) return "stream";
  if (pathname === "/api/location" || pathname === "/location") return "location";
  if (pathname.endsWith("/status")) return "status";
  return WRITE_METHODS.has(req.method) ? "write" : "read";
}

function setRateHeaders(res, limit, remaining, resetAt, now) {
  const resetSeconds = Math.max(0, Math.ceil((resetAt - now) / 1000));
  res.set("RateLimit-Limit", String(limit));
  res.set("RateLimit-Remaining", String(remaining));
  res.set("RateLimit-Reset", String(resetSeconds));
  res.set("X-RateLimit-Limit", String(limit));
  res.set("X-RateLimit-Remaining", String(remaining));
}

function rejectRequest(res, limit, resetAt, now) {
  const retryAfter = Math.max(1, Math.ceil((resetAt - now) / 1000));
  res.set("Retry-After", String(retryAfter));
  return res.status(429).json({
    error: "Too many requests",
    retryAfterSeconds: retryAfter,
  });
}

export function createAbuseProtection({
  windowMs = WINDOW_MS,
  limits = DEFAULT_LIMITS,
  maxBuckets = MAX_BUCKETS,
  maxStreamsPerIp = MAX_STREAMS_PER_IP,
  maxOpenStreams = MAX_OPEN_STREAMS,
  now = Date.now,
} = {}) {
  const buckets = new Map();
  const activeStreams = new Map();
  let activeStreamCount = 0;
  let lastPruneAt = 0;

  function pruneExpired(currentTime) {
    const interval =
      buckets.size >= maxBuckets ? 1_000 : CLEANUP_INTERVAL_MS;
    if (currentTime - lastPruneAt < interval) return;

    for (const [key, bucket] of buckets) {
      if (currentTime - bucket.startedAt >= windowMs) buckets.delete(key);
    }
    lastPruneAt = currentTime;
  }

  return function abuseProtection(req, res, next) {
    const currentTime = now();
    pruneExpired(currentTime);

    const clientKey = getClientKey(req);
    const category = getCategory(req);
    const limit = limits[category] ?? limits.read;
    const bucketKey = `${clientKey}:${category}`;
    let bucket = buckets.get(bucketKey);

    if (!bucket) {
      if (buckets.size >= maxBuckets) {
        const resetAt = currentTime + windowMs;
        setRateHeaders(res, limit, 0, resetAt, currentTime);
        return rejectRequest(res, limit, resetAt, currentTime);
      }
      bucket = { startedAt: currentTime, count: 0 };
      buckets.set(bucketKey, bucket);
    }

    if (currentTime - bucket.startedAt >= windowMs) {
      bucket.startedAt = currentTime;
      bucket.count = 0;
    }

    bucket.count += 1;
    const remaining = Math.max(0, limit - bucket.count);
    const resetAt = bucket.startedAt + windowMs;
    setRateHeaders(res, limit, remaining, resetAt, currentTime);

    if (bucket.count > limit) {
      return rejectRequest(res, limit, resetAt, currentTime);
    }

    if (category === "stream") {
      const openForClient = activeStreams.get(clientKey) || 0;
      if (openForClient >= maxStreamsPerIp || activeStreamCount >= maxOpenStreams) {
        return rejectRequest(res, limit, resetAt, currentTime);
      }

      activeStreams.set(clientKey, openForClient + 1);
      activeStreamCount += 1;
      let released = false;
      const releaseStream = () => {
        if (released) return;
        released = true;

        const remainingForClient = (activeStreams.get(clientKey) || 1) - 1;
        if (remainingForClient === 0) activeStreams.delete(clientKey);
        else activeStreams.set(clientKey, remainingForClient);
        activeStreamCount -= 1;
      };

      res.once("close", releaseStream);
      res.once("finish", releaseStream);
    }

    return next();
  };
}

export const abuseProtection = createAbuseProtection();