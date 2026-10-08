import { createServer } from "node:http";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";
import { registerDataRoutes } from "./server/data-routes.mjs";
import { abuseProtection } from "./server/abuse-protection.mjs";

const port = Number(process.env.PORT || 3000);
const root = fileURLToPath(new URL(".", import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

async function getLocation() {
  const apiKey = process.env.IPDATA_API_KEY || "";
  if (!apiKey) return { country: "Unknown" };

  try {
    const response = await fetch(
      `https://api.ipdata.co/country_name?api-key=${apiKey}`,
    );
    if (!response.ok) return { country: "Unknown" };
    return { country: await response.text() };
  } catch {
    return { country: "Unknown" };
  }
}

function sendJson(res, status, body) {
  res
    .status(status)
    .set("Cache-Control", "no-store")
    .json(body);
}

const vite = isProduction
  ? null
  : await createViteServer({
      root,
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });

const app = express();
app.set("trust proxy", 1);

app.disable("x-powered-by");
app.use((_req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });
  next();
});

app.use("/api", abuseProtection);
app.use(express.json({ limit: "32kb", strict: false }));
app.use(express.text({ limit: "32kb", type: ["text/*", "text/plain"] }));
registerDataRoutes(app);

app.get("/api/location", async (_req, res) => {
  try {
    sendJson(res, 200, await getLocation());
  } catch (error) {
    console.error("[location]", error);
    sendJson(res, 500, { error: "Unable to determine location" });
  }
});

if (vite) {
  app.use(vite.middlewares);
} else {
  app.use(express.static(join(root, "dist")));
  app.use((_req, res) => {
    res.sendFile(join(root, "dist", "index.html"));
  });
}

const server = createServer(app);

server.listen(port, "0.0.0.0", () => {
  console.log(`Vite React server listening on port ${port}`);
});