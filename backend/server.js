const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const ROOT_DIR = path.resolve(__dirname, "..");
loadDotEnv(path.join(ROOT_DIR, ".env"));

const PORT = Number(process.env.PORT || 8080);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "change-this-in-production";
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "videos.json");
const SITES_DIR = path.join(ROOT_DIR, "sites");

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
};

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

ensureDataStore();

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const { pathname, searchParams } = requestUrl;

  try {
    if (pathname.startsWith("/api/")) {
      if (req.method === "OPTIONS") {
        res.writeHead(204, JSON_HEADERS);
        res.end();
        return;
      }

      await handleApi(req, res, pathname, searchParams);
      return;
    }

    const host = req.headers.host || "";
    const target = resolveSite(host, pathname);
    serveStaticFile(res, target.site, target.path);
  } catch (error) {
    console.error("Unhandled server error:", error);
    sendJson(res, 500, { error: "Internal server error." });
  }
});

server.listen(PORT, () => {
  console.log(`XerivoLearn starter running on http://localhost:${PORT}`);
  console.log("Local routes:");
  console.log(`- Marketing: http://localhost:${PORT}/`);
  console.log(`- App:       http://localhost:${PORT}/app/`);
  console.log(`- Admin:     http://localhost:${PORT}/admin/`);
});

async function handleApi(req, res, pathname, searchParams) {
  if (req.method === "GET" && pathname === "/api/health") {
    sendJson(res, 200, { ok: true, service: "xerivolearn-api" });
    return;
  }

  if (req.method === "GET" && pathname === "/api/videos") {
    let videos = loadVideos().filter((video) => video.isPublished);

    const age = (searchParams.get("age") || "").trim();
    const category = (searchParams.get("category") || "").trim().toLowerCase();
    const search = (searchParams.get("search") || "").trim().toLowerCase();

    if (age) {
      videos = videos.filter((video) => video.ageGroup === age);
    }
    if (category) {
      videos = videos.filter((video) => video.category.toLowerCase().includes(category));
    }
    if (search) {
      videos = videos.filter((video) =>
        `${video.title} ${video.description}`.toLowerCase().includes(search)
      );
    }

    sendJson(res, 200, videos.sort(sortByNewest));
    return;
  }

  const adminMatch = pathname.match(/^\/api\/admin\/videos\/([^/]+)$/);

  if (pathname.startsWith("/api/admin/")) {
    if (!isAuthorized(req)) {
      sendJson(res, 401, { error: "Unauthorized. Invalid admin token." });
      return;
    }
  }

  if (req.method === "GET" && pathname === "/api/admin/videos") {
    sendJson(res, 200, loadVideos().sort(sortByNewest));
    return;
  }

  if (req.method === "POST" && pathname === "/api/admin/videos") {
    const payload = await readBodyJson(req, res);
    if (!payload) {
      return;
    }

    const validation = validateVideoInput(payload, { creating: true });
    if (!validation.ok) {
      sendJson(res, 400, { error: validation.error });
      return;
    }

    const now = new Date().toISOString();
    const newVideo = {
      id: crypto.randomUUID(),
      title: payload.title.trim(),
      description: (payload.description || "").trim(),
      category: (payload.category || "General").trim(),
      ageGroup: (payload.ageGroup || "4-7").trim(),
      duration: (payload.duration || "").trim(),
      thumbnailUrl: (payload.thumbnailUrl || "").trim(),
      videoUrl: payload.videoUrl.trim(),
      isPublished: payload.isPublished !== false,
      createdAt: now,
      updatedAt: now
    };

    const videos = loadVideos();
    videos.push(newVideo);
    saveVideos(videos);
    sendJson(res, 201, newVideo);
    return;
  }

  if (adminMatch && req.method === "PUT") {
    const videoId = adminMatch[1];
    const payload = await readBodyJson(req, res);
    if (!payload) {
      return;
    }

    const validation = validateVideoInput(payload, { creating: false });
    if (!validation.ok) {
      sendJson(res, 400, { error: validation.error });
      return;
    }

    const videos = loadVideos();
    const index = videos.findIndex((video) => video.id === videoId);
    if (index === -1) {
      sendJson(res, 404, { error: "Video not found." });
      return;
    }

    const current = videos[index];
    const updated = {
      ...current,
      title: payload.title.trim(),
      description: (payload.description || "").trim(),
      category: (payload.category || "General").trim(),
      ageGroup: (payload.ageGroup || "4-7").trim(),
      duration: (payload.duration || "").trim(),
      thumbnailUrl: (payload.thumbnailUrl || "").trim(),
      videoUrl: payload.videoUrl.trim(),
      isPublished: payload.isPublished !== false,
      updatedAt: new Date().toISOString()
    };

    videos[index] = updated;
    saveVideos(videos);
    sendJson(res, 200, updated);
    return;
  }

  if (adminMatch && req.method === "DELETE") {
    const videoId = adminMatch[1];
    const videos = loadVideos();
    const nextVideos = videos.filter((video) => video.id !== videoId);
    if (nextVideos.length === videos.length) {
      sendJson(res, 404, { error: "Video not found." });
      return;
    }

    saveVideos(nextVideos);
    sendJson(res, 200, { success: true });
    return;
  }

  sendJson(res, 404, { error: "Route not found." });
}

function resolveSite(hostHeader, pathname) {
  const host = (hostHeader || "").split(":")[0].toLowerCase();
  const isLocalHost =
    host === "" ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".localhost");

  if (isLocalHost) {
    if (pathname === "/app" || pathname.startsWith("/app/")) {
      return { site: "app", path: pathname.replace(/^\/app/, "") || "/" };
    }
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      return { site: "admin", path: pathname.replace(/^\/admin/, "") || "/" };
    }
    return { site: "marketing", path: pathname };
  }

  if (host.startsWith("app.")) {
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      return { site: "admin", path: pathname.replace(/^\/admin/, "") || "/" };
    }
    return { site: "app", path: pathname };
  }

  if (host.startsWith("admin.")) {
    return { site: "admin", path: pathname };
  }

  return { site: "marketing", path: pathname };
}

function serveStaticFile(res, siteName, rawPath) {
  const siteDir = path.join(SITES_DIR, siteName);
  const safePath = decodeURIComponent(rawPath || "/");
  const requestPath = safePath.endsWith("/") ? `${safePath}index.html` : safePath;
  const normalizedPath = path.normalize(path.join(siteDir, requestPath));

  if (!normalizedPath.startsWith(siteDir)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  let filePath = normalizedPath;
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(siteDir, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPES[extension] || "application/octet-stream";
  const content = fs.readFileSync(filePath);
  res.writeHead(200, { "Content-Type": contentType });
  res.end(content);
}

function ensureDataStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
  }
}

function loadVideos() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read videos data, using empty set:", error);
    return [];
  }
}

function saveVideos(videos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(videos, null, 2), "utf8");
}

function isAuthorized(req) {
  const token = req.headers["x-admin-token"];
  return typeof token === "string" && token === ADMIN_TOKEN;
}

function sendJson(res, status, payload) {
  res.writeHead(status, JSON_HEADERS);
  res.end(JSON.stringify(payload));
}

async function readBodyJson(req, res) {
  try {
    const raw = await readBody(req);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw);
  } catch (error) {
    sendJson(res, 400, { error: "Invalid JSON payload." });
    return null;
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function validateVideoInput(payload, { creating }) {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, error: "Payload must be an object." };
  }
  if (!payload.title || typeof payload.title !== "string" || payload.title.trim().length < 2) {
    return { ok: false, error: "Title is required (min 2 chars)." };
  }
  if (!payload.videoUrl || typeof payload.videoUrl !== "string") {
    return { ok: false, error: "Video URL is required." };
  }

  if (creating && typeof payload.isPublished === "undefined") {
    payload.isPublished = true;
  }

  return { ok: true };
}

function sortByNewest(a, b) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex < 1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}
