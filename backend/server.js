const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const ROOT_DIR = path.resolve(__dirname, "..");
loadDotEnv(path.join(ROOT_DIR, ".env"));

const PORT = Number(process.env.PORT || 8080);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@xerivolearn.com").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123!change";
const EDUCATOR_EMAIL = (process.env.EDUCATOR_EMAIL || "educator@xerivolearn.com").toLowerCase();
const EDUCATOR_PASSWORD = process.env.EDUCATOR_PASSWORD || "Educator123!change";
const EDUCATOR_NAME = process.env.EDUCATOR_NAME || "Xerivo Educator";
const JWT_SECRET = process.env.JWT_SECRET || ADMIN_TOKEN || "change-this-jwt-secret";
const JWT_TTL_SECONDS = Number(process.env.JWT_TTL_SECONDS || 60 * 60 * 24 * 7);

const APP_BASE_URL = (process.env.APP_BASE_URL || "").trim();
const PASSWORD_RESET_TTL_MINUTES = Number(process.env.PASSWORD_RESET_TTL_MINUTES || 30);
const PASSWORD_RESET_DEBUG = String(process.env.PASSWORD_RESET_DEBUG || "true").toLowerCase() !== "false";
const PASSWORD_RESET_WEBHOOK_URL = (process.env.PASSWORD_RESET_WEBHOOK_URL || "").trim();

const DATA_DIR = path.join(__dirname, "data");
const VIDEOS_FILE = path.join(DATA_DIR, "videos.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const FAVORITES_FILE = path.join(DATA_DIR, "favorites.json");
const CHILDREN_FILE = path.join(DATA_DIR, "children.json");
const PASSWORD_RESETS_FILE = path.join(DATA_DIR, "password_resets.json");
const SITES_DIR = path.join(ROOT_DIR, "sites");

const ALLOWED_CHILD_AVATARS = new Set(["rocket", "star", "whale", "panda", "owl", "fox"]);
const ALLOWED_AGE_GROUPS = new Set(["3-5", "4-7", "7+"]);

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token",
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
ensureDefaultAdminUser();
ensureDefaultEducatorUser();

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
  console.log(`- Educator:  http://localhost:${PORT}/educator/`);
  console.log(`- Admin:     http://localhost:${PORT}/admin/`);
});

async function handleApi(req, res, pathname, searchParams) {
  if (req.method === "GET" && pathname === "/api/health") {
    sendJson(res, 200, { ok: true, service: "xerivolearn-api" });
    return;
  }

  if (req.method === "POST" && pathname === "/api/auth/register") {
    const payload = await readBodyJson(req, res);
    if (!payload) {
      return;
    }

    const validation = validateRegistrationInput(payload);
    if (!validation.ok) {
      sendJson(res, 400, { error: validation.error });
      return;
    }

    const email = normalizeEmail(payload.email);
    const users = loadUsers();
    if (users.some((user) => user.email === email)) {
      sendJson(res, 409, { error: "Email already exists." });
      return;
    }

    const now = new Date().toISOString();
    const passwordData = hashPassword(payload.password);
    const user = {
      id: crypto.randomUUID(),
      name: payload.name.trim(),
      email,
      role: "parent",
      passwordHash: passwordData.hash,
      passwordSalt: passwordData.salt,
      passwordIterations: passwordData.iterations,
      createdAt: now,
      updatedAt: now
    };

    users.push(user);
    saveUsers(users);

    const token = createAuthToken(user);
    sendJson(res, 201, { token, user: toPublicUser(user) });
    return;
  }

  if (req.method === "POST" && pathname === "/api/auth/login") {
    const payload = await readBodyJson(req, res);
    if (!payload) {
      return;
    }

    const email = normalizeEmail(payload.email || "");
    const password = typeof payload.password === "string" ? payload.password : "";
    if (!email || !password) {
      sendJson(res, 400, { error: "Email and password are required." });
      return;
    }

    const users = loadUsers();
    const user = users.find((item) => item.email === email);
    if (!user || !verifyPassword(password, user)) {
      sendJson(res, 401, { error: "Invalid email or password." });
      return;
    }

    const token = createAuthToken(user);
    sendJson(res, 200, { token, user: toPublicUser(user) });
    return;
  }

  if (req.method === "POST" && pathname === "/api/auth/forgot-password") {
    const payload = await readBodyJson(req, res);
    if (!payload) {
      return;
    }

    const email = normalizeEmail(payload.email || "");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      sendJson(res, 200, {
        success: true,
        message: "If an account exists, a reset link has been sent."
      });
      return;
    }

    const users = loadUsers();
    const user = users.find((item) => item.email === email);
    let debugResetUrl = "";

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashResetToken(token);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + PASSWORD_RESET_TTL_MINUTES * 60 * 1000).toISOString();

      const resets = loadPasswordResets().filter((item) => {
        if (item.usedAt) {
          return true;
        }
        const expiryTime = new Date(item.expiresAt).getTime();
        return Number.isFinite(expiryTime) && expiryTime > Date.now() - 60_000;
      });

      const resetRecord = {
        id: crypto.randomUUID(),
        userId: user.id,
        tokenHash,
        createdAt: now.toISOString(),
        expiresAt,
        usedAt: null
      };
      resets.push(resetRecord);
      savePasswordResets(resets);

      const resetUrl = buildPasswordResetUrl(req, token);
      await dispatchPasswordReset(user, resetUrl);
      if (PASSWORD_RESET_DEBUG) {
        debugResetUrl = resetUrl;
      }
    }

    sendJson(res, 200, {
      success: true,
      message: "If an account exists, a reset link has been sent.",
      ...(PASSWORD_RESET_DEBUG ? { debugResetUrl } : {})
    });
    return;
  }

  if (req.method === "POST" && pathname === "/api/auth/reset-password") {
    const payload = await readBodyJson(req, res);
    if (!payload) {
      return;
    }

    const token = typeof payload.token === "string" ? payload.token.trim() : "";
    const newPassword = typeof payload.newPassword === "string" ? payload.newPassword : "";
    if (!token) {
      sendJson(res, 400, { error: "Reset token is required." });
      return;
    }
    if (!isStrongPassword(newPassword)) {
      sendJson(res, 400, {
        error: "Password must be at least 8 chars with letters and numbers."
      });
      return;
    }

    const tokenHash = hashResetToken(token);
    const resets = loadPasswordResets();
    const nowMs = Date.now();
    const resetIndex = resets.findIndex((item) => {
      if (item.tokenHash !== tokenHash || item.usedAt) {
        return false;
      }
      const expiryMs = new Date(item.expiresAt).getTime();
      return Number.isFinite(expiryMs) && expiryMs >= nowMs;
    });

    if (resetIndex === -1) {
      sendJson(res, 400, { error: "Invalid or expired reset token." });
      return;
    }

    const resetRecord = resets[resetIndex];
    const users = loadUsers();
    const userIndex = users.findIndex((user) => user.id === resetRecord.userId);
    if (userIndex === -1) {
      sendJson(res, 400, { error: "Invalid reset token." });
      return;
    }

    const passwordData = hashPassword(newPassword);
    users[userIndex] = {
      ...users[userIndex],
      passwordHash: passwordData.hash,
      passwordSalt: passwordData.salt,
      passwordIterations: passwordData.iterations,
      updatedAt: new Date().toISOString()
    };
    saveUsers(users);

    resets[resetIndex] = {
      ...resetRecord,
      usedAt: new Date().toISOString()
    };
    savePasswordResets(resets);

    sendJson(res, 200, { success: true, message: "Password updated. You can sign in now." });
    return;
  }

  if (req.method === "GET" && pathname === "/api/auth/me") {
    const authUser = requireAuth(req, res);
    if (!authUser) {
      return;
    }
    sendJson(res, 200, { user: toPublicUser(authUser) });
    return;
  }

  if (req.method === "GET" && pathname === "/api/videos") {
    const authUser = requireAuth(req, res, ["parent"]);
    if (!authUser) {
      return;
    }

    let videos = loadVideos().filter((video) => video.isPublished);

    const age = (searchParams.get("age") || "").trim();
    const category = (searchParams.get("category") || "").trim().toLowerCase();
    const search = (searchParams.get("search") || "").trim().toLowerCase();

    if (age) {
      videos = videos.filter((video) => video.ageGroup === age);
    }
    if (category) {
      videos = videos.filter((video) => (video.category || "").toLowerCase().includes(category));
    }
    if (search) {
      videos = videos.filter((video) =>
        `${video.title} ${video.description}`.toLowerCase().includes(search)
      );
    }

    sendJson(res, 200, videos.sort(sortByNewest));
    return;
  }

  if (req.method === "GET" && pathname === "/api/parent/favorites") {
    const authUser = requireAuth(req, res, ["parent"]);
    if (!authUser) {
      return;
    }

    const favorites = loadFavorites();
    const videoIds = Array.isArray(favorites[authUser.id]) ? favorites[authUser.id] : [];
    sendJson(res, 200, { videoIds });
    return;
  }

  const parentFavoriteMatch = pathname.match(/^\/api\/parent\/favorites\/([^/]+)$/);
  if (req.method === "POST" && parentFavoriteMatch) {
    const authUser = requireAuth(req, res, ["parent"]);
    if (!authUser) {
      return;
    }

    const videoId = parentFavoriteMatch[1];
    const videos = loadVideos().filter((video) => video.isPublished);
    if (!videos.some((video) => video.id === videoId)) {
      sendJson(res, 404, { error: "Video not found." });
      return;
    }

    const favorites = loadFavorites();
    const current = new Set(Array.isArray(favorites[authUser.id]) ? favorites[authUser.id] : []);
    let isFavorite = false;

    if (current.has(videoId)) {
      current.delete(videoId);
      isFavorite = false;
    } else {
      current.add(videoId);
      isFavorite = true;
    }

    favorites[authUser.id] = Array.from(current);
    saveFavorites(favorites);
    sendJson(res, 200, { isFavorite, videoIds: favorites[authUser.id] });
    return;
  }

  if (req.method === "GET" && pathname === "/api/parent/children") {
    const authUser = requireAuth(req, res, ["parent"]);
    if (!authUser) {
      return;
    }

    const children = loadChildren()
      .filter((child) => child.parentUserId === authUser.id)
      .sort(sortByNewest);
    sendJson(res, 200, children);
    return;
  }

  if (req.method === "POST" && pathname === "/api/parent/children") {
    const authUser = requireAuth(req, res, ["parent"]);
    if (!authUser) {
      return;
    }

    const payload = await readBodyJson(req, res);
    if (!payload) {
      return;
    }

    const validation = validateChildInput(payload);
    if (!validation.ok) {
      sendJson(res, 400, { error: validation.error });
      return;
    }

    const now = new Date().toISOString();
    const child = {
      id: crypto.randomUUID(),
      parentUserId: authUser.id,
      name: payload.name.trim(),
      ageGroup: payload.ageGroup || "4-7",
      avatar: payload.avatar || "rocket",
      createdAt: now,
      updatedAt: now
    };

    const children = loadChildren();
    children.push(child);
    saveChildren(children);
    sendJson(res, 201, child);
    return;
  }

  const parentChildMatch = pathname.match(/^\/api\/parent\/children\/([^/]+)$/);
  if (parentChildMatch && req.method === "PUT") {
    const authUser = requireAuth(req, res, ["parent"]);
    if (!authUser) {
      return;
    }

    const childId = parentChildMatch[1];
    const payload = await readBodyJson(req, res);
    if (!payload) {
      return;
    }

    const validation = validateChildInput(payload);
    if (!validation.ok) {
      sendJson(res, 400, { error: validation.error });
      return;
    }

    const children = loadChildren();
    const index = children.findIndex(
      (child) => child.id === childId && child.parentUserId === authUser.id
    );
    if (index === -1) {
      sendJson(res, 404, { error: "Child profile not found." });
      return;
    }

    children[index] = {
      ...children[index],
      name: payload.name.trim(),
      ageGroup: payload.ageGroup || "4-7",
      avatar: payload.avatar || "rocket",
      updatedAt: new Date().toISOString()
    };
    saveChildren(children);
    sendJson(res, 200, children[index]);
    return;
  }

  if (parentChildMatch && req.method === "DELETE") {
    const authUser = requireAuth(req, res, ["parent"]);
    if (!authUser) {
      return;
    }

    const childId = parentChildMatch[1];
    const children = loadChildren();
    const nextChildren = children.filter(
      (child) => !(child.id === childId && child.parentUserId === authUser.id)
    );

    if (nextChildren.length === children.length) {
      sendJson(res, 404, { error: "Child profile not found." });
      return;
    }

    saveChildren(nextChildren);
    sendJson(res, 200, { success: true });
    return;
  }

  if (req.method === "GET" && pathname === "/api/educator/me") {
    const authUser = requireAuth(req, res, ["educator"]);
    if (!authUser) {
      return;
    }
    sendJson(res, 200, { user: toPublicUser(authUser) });
    return;
  }

  if (req.method === "GET" && pathname === "/api/educator/videos") {
    const authUser = requireAuth(req, res, ["educator"]);
    if (!authUser) {
      return;
    }

    const videos = loadVideos().filter((video) => video.isPublished).sort(sortByNewest);
    sendJson(res, 200, videos);
    return;
  }

  if (req.method === "GET" && pathname === "/api/admin/me") {
    const authUser = requireAuth(req, res, ["admin"]);
    if (!authUser) {
      return;
    }
    sendJson(res, 200, { user: toPublicUser(authUser) });
    return;
  }

  const adminVideoMatch = pathname.match(/^\/api\/admin\/videos\/([^/]+)$/);

  if (pathname.startsWith("/api/admin/")) {
    const authUser = requireAuth(req, res, ["admin"]);
    if (!authUser) {
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

  if (adminVideoMatch && req.method === "PUT") {
    const videoId = adminVideoMatch[1];
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

  if (adminVideoMatch && req.method === "DELETE") {
    const videoId = adminVideoMatch[1];
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
  const isAppPath = pathname === "/app" || pathname.startsWith("/app/");
  const isEducatorPath = pathname === "/educator" || pathname.startsWith("/educator/");
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");

  if (host.startsWith("admin.")) {
    return { site: "admin", path: pathname };
  }

  if (host.startsWith("educator.")) {
    return { site: "educator", path: pathname };
  }

  if (host.startsWith("app.")) {
    if (isAdminPath) {
      return { site: "admin", path: pathname.replace(/^\/admin/, "") || "/" };
    }
    if (isEducatorPath) {
      return { site: "educator", path: pathname.replace(/^\/educator/, "") || "/" };
    }
    return { site: "app", path: pathname };
  }

  // Path-based fallback for single-host deployments like Railway free domains.
  if (isAppPath) {
    return { site: "app", path: pathname.replace(/^\/app/, "") || "/" };
  }
  if (isEducatorPath) {
    return { site: "educator", path: pathname.replace(/^\/educator/, "") || "/" };
  }
  if (isAdminPath) {
    return { site: "admin", path: pathname.replace(/^\/admin/, "") || "/" };
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

  if (!fs.existsSync(VIDEOS_FILE)) {
    fs.writeFileSync(VIDEOS_FILE, "[]", "utf8");
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf8");
  }
  if (!fs.existsSync(FAVORITES_FILE)) {
    fs.writeFileSync(FAVORITES_FILE, "{}", "utf8");
  }
  if (!fs.existsSync(CHILDREN_FILE)) {
    fs.writeFileSync(CHILDREN_FILE, "[]", "utf8");
  }
  if (!fs.existsSync(PASSWORD_RESETS_FILE)) {
    fs.writeFileSync(PASSWORD_RESETS_FILE, "[]", "utf8");
  }
}

function ensureDefaultAdminUser() {
  const users = loadUsers();
  const existingAdmin = users.find((user) => user.role === "admin" && user.email === ADMIN_EMAIL);
  if (existingAdmin) {
    return;
  }

  const now = new Date().toISOString();
  const passwordData = hashPassword(ADMIN_PASSWORD);
  users.push({
    id: crypto.randomUUID(),
    name: "Xerivo Admin",
    email: ADMIN_EMAIL,
    role: "admin",
    passwordHash: passwordData.hash,
    passwordSalt: passwordData.salt,
    passwordIterations: passwordData.iterations,
    createdAt: now,
    updatedAt: now
  });

  saveUsers(users);

  if (ADMIN_PASSWORD === "Admin123!change") {
    console.warn("Default admin password is active. Set ADMIN_PASSWORD in .env or Railway variables.");
  }
}

function ensureDefaultEducatorUser() {
  const users = loadUsers();
  const existingEducator = users.find(
    (user) => user.role === "educator" && user.email === EDUCATOR_EMAIL
  );
  if (existingEducator) {
    return;
  }

  const now = new Date().toISOString();
  const passwordData = hashPassword(EDUCATOR_PASSWORD);
  users.push({
    id: crypto.randomUUID(),
    name: EDUCATOR_NAME,
    email: EDUCATOR_EMAIL,
    role: "educator",
    passwordHash: passwordData.hash,
    passwordSalt: passwordData.salt,
    passwordIterations: passwordData.iterations,
    createdAt: now,
    updatedAt: now
  });

  saveUsers(users);

  if (EDUCATOR_PASSWORD === "Educator123!change") {
    console.warn(
      "Default educator password is active. Set EDUCATOR_PASSWORD in .env or Railway variables."
    );
  }
}

function loadVideos() {
  return readJsonArray(VIDEOS_FILE, "videos");
}

function saveVideos(videos) {
  fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2), "utf8");
}

function loadUsers() {
  return readJsonArray(USERS_FILE, "users");
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function loadChildren() {
  return readJsonArray(CHILDREN_FILE, "children");
}

function saveChildren(children) {
  fs.writeFileSync(CHILDREN_FILE, JSON.stringify(children, null, 2), "utf8");
}

function loadPasswordResets() {
  return readJsonArray(PASSWORD_RESETS_FILE, "password resets");
}

function savePasswordResets(resets) {
  fs.writeFileSync(PASSWORD_RESETS_FILE, JSON.stringify(resets, null, 2), "utf8");
}

function loadFavorites() {
  try {
    const raw = fs.readFileSync(FAVORITES_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    console.error("Failed to read favorites data, using empty set:", error);
    return {};
  }
}

function saveFavorites(favorites) {
  fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2), "utf8");
}

function readJsonArray(filePath, label) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Failed to read ${label} data, using empty set:`, error);
    return [];
  }
}

function requireAuth(req, res, roles) {
  if (roles && roles.includes("admin") && isLegacyAdminToken(req)) {
    return {
      id: "legacy-admin-token",
      name: "Legacy Admin",
      email: "legacy@xerivolearn.com",
      role: "admin"
    };
  }

  const token = getBearerToken(req);
  if (!token) {
    sendJson(res, 401, { error: "Unauthorized. Missing bearer token." });
    return null;
  }

  const payload = verifyJwt(token, JWT_SECRET);
  if (!payload || typeof payload.sub !== "string") {
    sendJson(res, 401, { error: "Unauthorized. Invalid or expired session." });
    return null;
  }

  const users = loadUsers();
  const user = users.find((item) => item.id === payload.sub);
  if (!user) {
    sendJson(res, 401, { error: "Unauthorized. User not found." });
    return null;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    sendJson(res, 403, { error: "Forbidden. Insufficient role." });
    return null;
  }

  return user;
}

function isLegacyAdminToken(req) {
  if (!ADMIN_TOKEN) {
    return false;
  }
  const token = req.headers["x-admin-token"];
  return typeof token === "string" && token === ADMIN_TOKEN;
}

function getBearerToken(req) {
  const authorization = req.headers.authorization;
  if (typeof authorization !== "string") {
    return "";
  }
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const iterations = 120000;
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, "sha512").toString("hex");
  return { salt, iterations, hash };
}

function verifyPassword(password, user) {
  const iterations = Number(user.passwordIterations || 120000);
  const salt = String(user.passwordSalt || "");
  const hash = String(user.passwordHash || "");
  if (!salt || !hash) {
    return false;
  }
  const computed = crypto.pbkdf2Sync(password, salt, iterations, 64, "sha512").toString("hex");
  return safeEqualHex(computed, hash);
}

function safeEqualHex(a, b) {
  const aBuf = Buffer.from(String(a), "hex");
  const bBuf = Buffer.from(String(b), "hex");
  if (aBuf.length === 0 || bBuf.length === 0 || aBuf.length !== bBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function createAuthToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    iat: now,
    exp: now + JWT_TTL_SECONDS
  };
  return signJwt(payload, JWT_SECRET);
}

function signJwt(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJwt(token, secret) {
  const parts = String(token).split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");

  if (!safeEqualText(signature, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== "number" || payload.exp < now) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function safeEqualText(a, b) {
  const aBuf = Buffer.from(String(a), "utf8");
  const bBuf = Buffer.from(String(b), "utf8");
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function encodeBase64Url(value) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function hashResetToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function buildPasswordResetUrl(req, token) {
  const host = req.headers.host || "localhost";
  const protoHeader = req.headers["x-forwarded-proto"];
  const proto = typeof protoHeader === "string" && protoHeader ? protoHeader : "http";
  const baseUrl = APP_BASE_URL || `${proto}://${host}`;
  const safeBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${safeBase}/app/?reset=${encodeURIComponent(token)}`;
}

async function dispatchPasswordReset(user, resetUrl) {
  const payload = {
    event: "password_reset",
    to: user.email,
    subject: "Reset your XerivoLearn password",
    message: `Use this link to reset your password: ${resetUrl}`,
    resetUrl
  };

  if (PASSWORD_RESET_WEBHOOK_URL) {
    try {
      if (typeof fetch !== "function") {
        throw new Error("Global fetch is not available in this Node runtime.");
      }
      await fetch(PASSWORD_RESET_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error("Password reset webhook failed:", error);
    }
  }

  // Default fallback for development.
  console.log(`[PasswordReset] ${user.email} -> ${resetUrl}`);
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
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

function validateRegistrationInput(payload) {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, error: "Payload must be an object." };
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = normalizeEmail(payload.email || "");
  const password = typeof payload.password === "string" ? payload.password : "";

  if (name.length < 2) {
    return { ok: false, error: "Name is required (min 2 chars)." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Valid email is required." };
  }
  if (!isStrongPassword(password)) {
    return {
      ok: false,
      error: "Password must be at least 8 chars with letters and numbers."
    };
  }

  return { ok: true };
}

function validateChildInput(payload) {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, error: "Payload must be an object." };
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const ageGroup = typeof payload.ageGroup === "string" ? payload.ageGroup.trim() : "";
  const avatar = typeof payload.avatar === "string" ? payload.avatar.trim() : "";

  if (name.length < 2) {
    return { ok: false, error: "Child name is required (min 2 chars)." };
  }
  if (!ALLOWED_AGE_GROUPS.has(ageGroup)) {
    return { ok: false, error: "Age group must be one of: 3-5, 4-7, 7+." };
  }
  if (!ALLOWED_CHILD_AVATARS.has(avatar)) {
    return { ok: false, error: "Invalid avatar selection." };
  }

  return { ok: true };
}

function isStrongPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    /\d/.test(password) &&
    /[A-Za-z]/.test(password)
  );
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
