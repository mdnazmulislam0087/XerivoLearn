const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");
let Pool = null;
try {
  ({ Pool } = require("pg"));
} catch (error) {
  if ((process.env.DATABASE_URL || "").trim()) {
    throw error;
  }
}
let nodemailer = null;
try {
  nodemailer = require("nodemailer");
} catch {
  nodemailer = null;
}

const ROOT_DIR = path.resolve(__dirname, "..");
loadDotEnv(path.join(ROOT_DIR, ".env"));

const NODE_ENV = envString("NODE_ENV", "");
const IS_PRODUCTION = NODE_ENV === "production";
const PORT = envNumber("PORT", 8080);
const ADMIN_TOKEN = envString("ADMIN_TOKEN", "");
const ADMIN_EMAIL = envString("ADMIN_EMAIL", "admin@xerivolearn.com").toLowerCase();
const ADMIN_PASSWORD = envString("ADMIN_PASSWORD", "Admin123!change");
const EDUCATOR_EMAIL = envString("EDUCATOR_EMAIL", "educator@xerivolearn.com").toLowerCase();
const EDUCATOR_PASSWORD = envString("EDUCATOR_PASSWORD", "Educator123!change");
const EDUCATOR_NAME = envString("EDUCATOR_NAME", "Xerivo Educator");
const JWT_SECRET = envString("JWT_SECRET", ADMIN_TOKEN || "change-this-jwt-secret");
const JWT_TTL_SECONDS = envNumber("JWT_TTL_SECONDS", 60 * 60 * 24 * 7);

const APP_BASE_URL = envString("APP_BASE_URL", "");
const PASSWORD_RESET_TTL_MINUTES = envNumber("PASSWORD_RESET_TTL_MINUTES", 30);
const PASSWORD_RESET_DEBUG = envBoolean("PASSWORD_RESET_DEBUG", false);
const PASSWORD_RESET_WEBHOOK_URL = envString("PASSWORD_RESET_WEBHOOK_URL", "");
const PASSWORD_RESET_FROM_EMAIL = envString("PASSWORD_RESET_FROM_EMAIL", "");
const RESEND_API_KEY = envString("RESEND_API_KEY", "");
const CAPTCHA_TTL_MINUTES = envNumber("CAPTCHA_TTL_MINUTES", 10);
const DATABASE_URL = envString("DATABASE_URL", "");
const REQUIRE_POSTGRES = envBoolean("REQUIRE_POSTGRES", IS_PRODUCTION);
const PG_SSL = envBoolean("PG_SSL", IS_PRODUCTION);
const SMTP_HOST = envString("SMTP_HOST", "");
const SMTP_PORT = envNumber("SMTP_PORT", 587);
const SMTP_USER = envString("SMTP_USER", "");
const SMTP_PASS = envString("SMTP_PASS", "");
const SMTP_SECURE = envBoolean("SMTP_SECURE", SMTP_PORT === 465);
const SMTP_FROM_EMAIL = envString("SMTP_FROM_EMAIL", PASSWORD_RESET_FROM_EMAIL || SMTP_USER);
const USE_POSTGRES = Boolean(DATABASE_URL);

if (DATABASE_URL.includes("${{")) {
  throw new Error(
    "DATABASE_URL appears unresolved (contains '${{...}}'). In Railway, set DATABASE_URL as a Reference to Postgres.DATABASE_URL."
  );
}

if (REQUIRE_POSTGRES && !USE_POSTGRES) {
  throw new Error(
    "DATABASE_URL is required when REQUIRE_POSTGRES=true. Add Railway Postgres and set DATABASE_URL."
  );
}

const DATA_DIR = path.join(__dirname, "data");
const VIDEOS_FILE = path.join(DATA_DIR, "videos.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const FAVORITES_FILE = path.join(DATA_DIR, "favorites.json");
const CHILDREN_FILE = path.join(DATA_DIR, "children.json");
const PASSWORD_RESETS_FILE = path.join(DATA_DIR, "password_resets.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const SITES_DIR = path.join(ROOT_DIR, "sites");

const ALLOWED_CHILD_AVATARS = new Set(["rocket", "star", "whale", "panda", "owl", "fox"]);
const ALLOWED_AGE_GROUPS = new Set(["3-5", "4-7", "7+"]);
const CAPTCHA_STORE = new Map();
const pool = USE_POSTGRES && Pool
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl: PG_SSL ? { rejectUnauthorized: false } : false
    })
  : null;
let smtpTransporter = null;

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

bootstrapServer();

async function bootstrapServer() {
  try {
    await initializeStorage();
    await ensureDefaultSettings();
    await ensureDefaultAdminUser();
    await ensureDefaultEducatorUser();
    logPasswordResetConfig();

    server.listen(PORT, () => {
      console.log(`XerivoLearn starter running on http://localhost:${PORT}`);
      console.log("Local routes:");
      console.log(`- Marketing: http://localhost:${PORT}/`);
      console.log(`- App:       http://localhost:${PORT}/app/`);
      console.log(`- Educator:  http://localhost:${PORT}/educator/`);
      console.log(`- Admin:     http://localhost:${PORT}/admin/`);
    });
  } catch (error) {
    console.error("Failed to bootstrap server:", error);
    process.exitCode = 1;
  }
}

async function handleApi(req, res, pathname, searchParams) {
  if (req.method === "GET" && pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      service: "xerivolearn-api",
      storage: USE_POSTGRES ? "postgres" : "json",
      requirePostgres: REQUIRE_POSTGRES,
      passwordResetProviders: getPasswordResetProviderFlags()
    });
    return;
  }

  if (req.method === "GET" && pathname === "/api/public/settings") {
    const settings = await loadSettings();
    sendJson(res, 200, {
      termsAndConditions: settings.termsAndConditions || "",
      termsUpdatedAt: settings.termsUpdatedAt || null
    });
    return;
  }

  if (req.method === "GET" && pathname === "/api/auth/captcha") {
    clearExpiredCaptchas();
    const challenge = createCaptchaChallenge();
    sendJson(res, 200, challenge);
    return;
  }

  if (req.method === "POST" && pathname === "/api/auth/register") {
    const payload = await readBodyJson(req, res);
    if (!payload) {
      return;
    }

    const settings = await loadSettings();
    const validation = validateRegistrationInput(payload, settings);
    if (!validation.ok) {
      sendJson(res, 400, { error: validation.error });
      return;
    }

    const email = normalizeEmail(payload.email);
    const users = await loadUsers();
    if (users.some((user) => user.email === email)) {
      sendJson(res, 409, { error: "Email already registered." });
      return;
    }

    if (!consumeCaptcha(payload.captchaId, payload.captchaAnswer)) {
      sendJson(res, 400, { error: "Captcha verification failed. Please try again." });
      return;
    }

    const now = new Date().toISOString();
    const passwordData = hashPassword(payload.password);
    const user = {
      id: crypto.randomUUID(),
      name: payload.name.trim(),
      email,
      role: "parent",
      acceptedTermsAt: now,
      termsVersionAccepted: settings.termsUpdatedAt || now,
      passwordHash: passwordData.hash,
      passwordSalt: passwordData.salt,
      passwordIterations: passwordData.iterations,
      createdAt: now,
      updatedAt: now
    };

    users.push(user);
    try {
      await saveUsers(users);
    } catch (error) {
      if (isDatabaseUniqueViolation(error)) {
        sendJson(res, 409, { error: "Email already registered." });
        return;
      }
      throw error;
    }

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

    const users = await loadUsers();
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

    const resetMessage = getPasswordResetPublicMessage();
    const email = normalizeEmail(payload.email || "");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      sendJson(res, 200, {
        success: true,
        message: resetMessage
      });
      return;
    }

    const users = await loadUsers();
    const user = users.find((item) => item.email === email);
    let debugResetUrl = "";
    let debugDelivery = null;

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashResetToken(token);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + PASSWORD_RESET_TTL_MINUTES * 60 * 1000).toISOString();

      const resets = (await loadPasswordResets()).filter((item) => {
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
      await savePasswordResets(resets);

      const resetUrl = buildPasswordResetUrl(req, token);
      const delivery = await dispatchPasswordReset(user, resetUrl);
      if (PASSWORD_RESET_DEBUG) {
        debugResetUrl = resetUrl;
        debugDelivery = delivery;
      }
    }

    sendJson(res, 200, {
      success: true,
      message: resetMessage,
      ...(PASSWORD_RESET_DEBUG ? { debugResetUrl, debugDelivery } : {})
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
    const resets = await loadPasswordResets();
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
    const users = await loadUsers();
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
    await saveUsers(users);

    resets[resetIndex] = {
      ...resetRecord,
      usedAt: new Date().toISOString()
    };
    await savePasswordResets(resets);

    sendJson(res, 200, { success: true, message: "Password updated. You can sign in now." });
    return;
  }

  if (req.method === "GET" && pathname === "/api/auth/me") {
    const authUser = await requireAuth(req, res);
    if (!authUser) {
      return;
    }
    sendJson(res, 200, { user: toPublicUser(authUser) });
    return;
  }

  if (req.method === "GET" && pathname === "/api/videos") {
    const authUser = await requireAuth(req, res, ["parent"]);
    if (!authUser) {
      return;
    }

    let videos = (await loadVideos()).filter((video) => video.isPublished);

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
    const authUser = await requireAuth(req, res, ["parent"]);
    if (!authUser) {
      return;
    }

    const favorites = await loadFavorites();
    const videoIds = Array.isArray(favorites[authUser.id]) ? favorites[authUser.id] : [];
    sendJson(res, 200, { videoIds });
    return;
  }

  const parentFavoriteMatch = pathname.match(/^\/api\/parent\/favorites\/([^/]+)$/);
  if (req.method === "POST" && parentFavoriteMatch) {
    const authUser = await requireAuth(req, res, ["parent"]);
    if (!authUser) {
      return;
    }

    const videoId = parentFavoriteMatch[1];
    const videos = (await loadVideos()).filter((video) => video.isPublished);
    if (!videos.some((video) => video.id === videoId)) {
      sendJson(res, 404, { error: "Video not found." });
      return;
    }

    const favorites = await loadFavorites();
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
    await saveFavorites(favorites);
    sendJson(res, 200, { isFavorite, videoIds: favorites[authUser.id] });
    return;
  }

  if (req.method === "GET" && pathname === "/api/parent/children") {
    const authUser = await requireAuth(req, res, ["parent"]);
    if (!authUser) {
      return;
    }

    const children = (await loadChildren())
      .filter((child) => child.parentUserId === authUser.id)
      .sort(sortByNewest);
    sendJson(res, 200, children);
    return;
  }

  if (req.method === "POST" && pathname === "/api/parent/children") {
    const authUser = await requireAuth(req, res, ["parent"]);
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

    const children = await loadChildren();
    children.push(child);
    await saveChildren(children);
    sendJson(res, 201, child);
    return;
  }

  const parentChildMatch = pathname.match(/^\/api\/parent\/children\/([^/]+)$/);
  if (parentChildMatch && req.method === "PUT") {
    const authUser = await requireAuth(req, res, ["parent"]);
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

    const children = await loadChildren();
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
    await saveChildren(children);
    sendJson(res, 200, children[index]);
    return;
  }

  if (parentChildMatch && req.method === "DELETE") {
    const authUser = await requireAuth(req, res, ["parent"]);
    if (!authUser) {
      return;
    }

    const childId = parentChildMatch[1];
    const children = await loadChildren();
    const nextChildren = children.filter(
      (child) => !(child.id === childId && child.parentUserId === authUser.id)
    );

    if (nextChildren.length === children.length) {
      sendJson(res, 404, { error: "Child profile not found." });
      return;
    }

    await saveChildren(nextChildren);
    sendJson(res, 200, { success: true });
    return;
  }

  if (req.method === "GET" && pathname === "/api/educator/me") {
    const authUser = await requireAuth(req, res, ["educator"]);
    if (!authUser) {
      return;
    }
    sendJson(res, 200, { user: toPublicUser(authUser) });
    return;
  }

  if (req.method === "GET" && pathname === "/api/educator/videos") {
    const authUser = await requireAuth(req, res, ["educator"]);
    if (!authUser) {
      return;
    }

    const videos = (await loadVideos()).filter((video) => video.isPublished).sort(sortByNewest);
    sendJson(res, 200, videos);
    return;
  }

  if (req.method === "GET" && pathname === "/api/admin/me") {
    const authUser = await requireAuth(req, res, ["admin"]);
    if (!authUser) {
      return;
    }
    sendJson(res, 200, { user: toPublicUser(authUser) });
    return;
  }

  const adminVideoMatch = pathname.match(/^\/api\/admin\/videos\/([^/]+)$/);

  if (pathname.startsWith("/api/admin/")) {
    const authUser = await requireAuth(req, res, ["admin"]);
    if (!authUser) {
      return;
    }
  }

  if (req.method === "GET" && pathname === "/api/admin/settings") {
    const settings = await loadSettings();
    sendJson(res, 200, settings);
    return;
  }

  if (req.method === "PUT" && pathname === "/api/admin/settings/terms") {
    const payload = await readBodyJson(req, res);
    if (!payload) {
      return;
    }

    const termsAndConditions =
      typeof payload.termsAndConditions === "string" ? payload.termsAndConditions.trim() : "";
    if (!termsAndConditions || termsAndConditions.length < 40) {
      sendJson(res, 400, { error: "Terms and Conditions must be at least 40 characters." });
      return;
    }

    const current = await loadSettings();
    const next = {
      ...current,
      termsAndConditions,
      termsUpdatedAt: new Date().toISOString()
    };
    await saveSettings(next);
    sendJson(res, 200, next);
    return;
  }

  if (req.method === "GET" && pathname === "/api/admin/videos") {
    sendJson(res, 200, (await loadVideos()).sort(sortByNewest));
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

    const videos = await loadVideos();
    videos.push(newVideo);
    await saveVideos(videos);
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

    const videos = await loadVideos();
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
    await saveVideos(videos);
    sendJson(res, 200, updated);
    return;
  }

  if (adminVideoMatch && req.method === "DELETE") {
    const videoId = adminVideoMatch[1];
    const videos = await loadVideos();
    const nextVideos = videos.filter((video) => video.id !== videoId);
    if (nextVideos.length === videos.length) {
      sendJson(res, 404, { error: "Video not found." });
      return;
    }

    await saveVideos(nextVideos);
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
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, "{}", "utf8");
  }
}

async function initializeStorage() {
  ensureDataStore();
  if (!USE_POSTGRES) {
    console.log("Storage mode: JSON files");
    if (IS_PRODUCTION) {
      console.warn(
        "Production is running without DATABASE_URL. Data will be file-based and may not persist on Railway restarts."
      );
    }
    return;
  }

  await initializePostgresSchema();
  await seedPostgresFromJsonIfEmpty();
  console.log("Storage mode: PostgreSQL (Railway compatible)");
}

async function initializePostgresSchema() {
  if (!pool) {
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL UNIQUE,
      role text NOT NULL,
      accepted_terms_at timestamptz NULL,
      terms_version_accepted timestamptz NULL,
      password_hash text NOT NULL,
      password_salt text NOT NULL,
      password_iterations integer NOT NULL,
      created_at timestamptz NOT NULL,
      updated_at timestamptz NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS videos (
      id uuid PRIMARY KEY,
      title text NOT NULL,
      description text NOT NULL DEFAULT '',
      category text NOT NULL DEFAULT 'General',
      age_group text NOT NULL DEFAULT '4-7',
      duration text NOT NULL DEFAULT '',
      thumbnail_url text NOT NULL DEFAULT '',
      video_url text NOT NULL,
      is_published boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL,
      updated_at timestamptz NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS children (
      id uuid PRIMARY KEY,
      parent_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name text NOT NULL,
      age_group text NOT NULL,
      avatar text NOT NULL,
      created_at timestamptz NOT NULL,
      updated_at timestamptz NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      parent_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
      created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (parent_user_id, video_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id uuid PRIMARY KEY,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash text NOT NULL,
      created_at timestamptz NOT NULL,
      expires_at timestamptz NOT NULL,
      used_at timestamptz NULL
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_password_resets_token_hash ON password_resets(token_hash)`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      terms_and_conditions text NOT NULL DEFAULT '',
      terms_updated_at timestamptz NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function seedPostgresFromJsonIfEmpty() {
  if (!USE_POSTGRES || !pool) {
    return;
  }

  const usersCount = await dbCountRows("users");
  const videosCount = await dbCountRows("videos");
  const childrenCount = await dbCountRows("children");
  const favoritesCount = await dbCountRows("favorites");
  const resetsCount = await dbCountRows("password_resets");
  const settingsCount = await dbCountRows("settings");
  const hasAnyData =
    usersCount > 0 || videosCount > 0 || childrenCount > 0 || favoritesCount > 0 || resetsCount > 0 || settingsCount > 0;

  if (hasAnyData) {
    return;
  }

  const users = readJsonArray(USERS_FILE, "users");
  const videos = readJsonArray(VIDEOS_FILE, "videos");
  const children = readJsonArray(CHILDREN_FILE, "children");
  const resets = readJsonArray(PASSWORD_RESETS_FILE, "password resets");
  const favorites = readJsonObject(FAVORITES_FILE, "favorites");
  const settings = readJsonObject(SETTINGS_FILE, "settings");

  if (users.length) {
    await saveUsers(users);
  }
  if (videos.length) {
    await saveVideos(videos);
  }
  if (children.length) {
    await saveChildren(children);
  }
  if (resets.length) {
    await savePasswordResets(resets);
  }
  if (Object.keys(favorites).length) {
    await saveFavorites(favorites);
  }
  if (Object.keys(settings).length) {
    await saveSettings(settings);
  }
}

async function dbCountRows(tableName) {
  const result = await pool.query(`SELECT COUNT(*)::int AS count FROM ${tableName}`);
  return Number(result.rows[0]?.count || 0);
}

async function ensureDefaultSettings() {
  const settings = await loadSettings();
  if (settings.termsAndConditions && settings.termsUpdatedAt) {
    return;
  }

  const now = new Date().toISOString();
  const next = {
    termsAndConditions: defaultTermsAndConditions(),
    termsUpdatedAt: now,
    createdAt: settings.createdAt || now
  };
  await saveSettings(next);
}

async function ensureDefaultAdminUser() {
  const users = await loadUsers();
  const existingEmail = users.find((user) => normalizeEmail(user.email) === ADMIN_EMAIL);
  if (existingEmail) {
    if (existingEmail.role !== "admin") {
      console.warn(
        `ADMIN_EMAIL (${ADMIN_EMAIL}) already belongs to role '${existingEmail.role}'. Skipping default admin creation to preserve unique emails.`
      );
    }
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

  await saveUsers(users);

  if (ADMIN_PASSWORD === "Admin123!change") {
    console.warn("Default admin password is active. Set ADMIN_PASSWORD in .env or Railway variables.");
  }
}

async function ensureDefaultEducatorUser() {
  const users = await loadUsers();
  const existingEmail = users.find((user) => normalizeEmail(user.email) === EDUCATOR_EMAIL);
  if (existingEmail) {
    if (existingEmail.role !== "educator") {
      console.warn(
        `EDUCATOR_EMAIL (${EDUCATOR_EMAIL}) already belongs to role '${existingEmail.role}'. Skipping default educator creation to preserve unique emails.`
      );
    }
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

  await saveUsers(users);

  if (EDUCATOR_PASSWORD === "Educator123!change") {
    console.warn(
      "Default educator password is active. Set EDUCATOR_PASSWORD in .env or Railway variables."
    );
  }
}

async function loadVideos() {
  if (!USE_POSTGRES || !pool) {
    return readJsonArray(VIDEOS_FILE, "videos");
  }
  const result = await pool.query(`
    SELECT
      id,
      title,
      description,
      category,
      age_group AS "ageGroup",
      duration,
      thumbnail_url AS "thumbnailUrl",
      video_url AS "videoUrl",
      is_published AS "isPublished",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM videos
  `);
  return result.rows;
}

async function saveVideos(videos) {
  if (!USE_POSTGRES || !pool) {
    fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2), "utf8");
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const video of videos) {
      await client.query(
        `
          INSERT INTO videos
            (id, title, description, category, age_group, duration, thumbnail_url, video_url, is_published, created_at, updated_at)
          VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            category = EXCLUDED.category,
            age_group = EXCLUDED.age_group,
            duration = EXCLUDED.duration,
            thumbnail_url = EXCLUDED.thumbnail_url,
            video_url = EXCLUDED.video_url,
            is_published = EXCLUDED.is_published,
            created_at = EXCLUDED.created_at,
            updated_at = EXCLUDED.updated_at
        `,
        [
          video.id,
          video.title || "",
          video.description || "",
          video.category || "General",
          video.ageGroup || "4-7",
          video.duration || "",
          video.thumbnailUrl || "",
          video.videoUrl || "",
          video.isPublished !== false,
          video.createdAt || new Date().toISOString(),
          video.updatedAt || new Date().toISOString()
        ]
      );
    }

    if (videos.length > 0) {
      await client.query("DELETE FROM videos WHERE id <> ALL($1::uuid[])", [videos.map((video) => video.id)]);
    } else {
      await client.query("DELETE FROM videos");
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function loadUsers() {
  if (!USE_POSTGRES || !pool) {
    return readJsonArray(USERS_FILE, "users");
  }
  const result = await pool.query(`
    SELECT
      id,
      name,
      email,
      role,
      accepted_terms_at AS "acceptedTermsAt",
      terms_version_accepted AS "termsVersionAccepted",
      password_hash AS "passwordHash",
      password_salt AS "passwordSalt",
      password_iterations AS "passwordIterations",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM users
  `);
  return result.rows;
}

async function saveUsers(users) {
  if (!USE_POSTGRES || !pool) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const user of users) {
      await client.query(
        `
          INSERT INTO users
            (id, name, email, role, accepted_terms_at, terms_version_accepted, password_hash, password_salt, password_iterations, created_at, updated_at)
          VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            role = EXCLUDED.role,
            accepted_terms_at = EXCLUDED.accepted_terms_at,
            terms_version_accepted = EXCLUDED.terms_version_accepted,
            password_hash = EXCLUDED.password_hash,
            password_salt = EXCLUDED.password_salt,
            password_iterations = EXCLUDED.password_iterations,
            created_at = EXCLUDED.created_at,
            updated_at = EXCLUDED.updated_at
        `,
        [
          user.id,
          user.name || "",
          normalizeEmail(user.email),
          user.role || "parent",
          user.acceptedTermsAt || null,
          user.termsVersionAccepted || null,
          user.passwordHash || "",
          user.passwordSalt || "",
          Number(user.passwordIterations || 120000),
          user.createdAt || new Date().toISOString(),
          user.updatedAt || new Date().toISOString()
        ]
      );
    }

    if (users.length > 0) {
      await client.query("DELETE FROM users WHERE id <> ALL($1::uuid[])", [users.map((user) => user.id)]);
    } else {
      await client.query("DELETE FROM users");
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function loadChildren() {
  if (!USE_POSTGRES || !pool) {
    return readJsonArray(CHILDREN_FILE, "children");
  }
  const result = await pool.query(`
    SELECT
      id,
      parent_user_id AS "parentUserId",
      name,
      age_group AS "ageGroup",
      avatar,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM children
  `);
  return result.rows;
}

async function saveChildren(children) {
  if (!USE_POSTGRES || !pool) {
    fs.writeFileSync(CHILDREN_FILE, JSON.stringify(children, null, 2), "utf8");
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const child of children) {
      await client.query(
        `
          INSERT INTO children
            (id, parent_user_id, name, age_group, avatar, created_at, updated_at)
          VALUES
            ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            parent_user_id = EXCLUDED.parent_user_id,
            name = EXCLUDED.name,
            age_group = EXCLUDED.age_group,
            avatar = EXCLUDED.avatar,
            created_at = EXCLUDED.created_at,
            updated_at = EXCLUDED.updated_at
        `,
        [
          child.id,
          child.parentUserId,
          child.name || "",
          child.ageGroup || "4-7",
          child.avatar || "rocket",
          child.createdAt || new Date().toISOString(),
          child.updatedAt || new Date().toISOString()
        ]
      );
    }

    if (children.length > 0) {
      await client.query("DELETE FROM children WHERE id <> ALL($1::uuid[])", [
        children.map((child) => child.id)
      ]);
    } else {
      await client.query("DELETE FROM children");
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function loadPasswordResets() {
  if (!USE_POSTGRES || !pool) {
    return readJsonArray(PASSWORD_RESETS_FILE, "password resets");
  }
  const result = await pool.query(`
    SELECT
      id,
      user_id AS "userId",
      token_hash AS "tokenHash",
      created_at AS "createdAt",
      expires_at AS "expiresAt",
      used_at AS "usedAt"
    FROM password_resets
  `);
  return result.rows;
}

async function savePasswordResets(resets) {
  if (!USE_POSTGRES || !pool) {
    fs.writeFileSync(PASSWORD_RESETS_FILE, JSON.stringify(resets, null, 2), "utf8");
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const reset of resets) {
      await client.query(
        `
          INSERT INTO password_resets
            (id, user_id, token_hash, created_at, expires_at, used_at)
          VALUES
            ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO UPDATE SET
            user_id = EXCLUDED.user_id,
            token_hash = EXCLUDED.token_hash,
            created_at = EXCLUDED.created_at,
            expires_at = EXCLUDED.expires_at,
            used_at = EXCLUDED.used_at
        `,
        [
          reset.id,
          reset.userId,
          reset.tokenHash || "",
          reset.createdAt || new Date().toISOString(),
          reset.expiresAt || new Date().toISOString(),
          reset.usedAt || null
        ]
      );
    }

    if (resets.length > 0) {
      await client.query("DELETE FROM password_resets WHERE id <> ALL($1::uuid[])", [
        resets.map((reset) => reset.id)
      ]);
    } else {
      await client.query("DELETE FROM password_resets");
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function loadSettings() {
  if (!USE_POSTGRES || !pool) {
    return readJsonObject(SETTINGS_FILE, "settings");
  }
  const result = await pool.query(`
    SELECT
      terms_and_conditions AS "termsAndConditions",
      terms_updated_at AS "termsUpdatedAt",
      created_at AS "createdAt"
    FROM settings
    WHERE id = 1
  `);
  return result.rows[0] || {};
}

async function saveSettings(settings) {
  if (!USE_POSTGRES || !pool) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf8");
    return;
  }

  const termsAndConditions = String(settings.termsAndConditions || "");
  const termsUpdatedAt = settings.termsUpdatedAt || null;
  const createdAt = settings.createdAt || new Date().toISOString();

  await pool.query(
    `
      INSERT INTO settings (id, terms_and_conditions, terms_updated_at, created_at)
      VALUES (1, $1, $2, $3)
      ON CONFLICT (id) DO UPDATE SET
        terms_and_conditions = EXCLUDED.terms_and_conditions,
        terms_updated_at = EXCLUDED.terms_updated_at,
        created_at = COALESCE(settings.created_at, EXCLUDED.created_at)
    `,
    [termsAndConditions, termsUpdatedAt, createdAt]
  );
}

async function loadFavorites() {
  if (!USE_POSTGRES || !pool) {
    return readJsonObject(FAVORITES_FILE, "favorites");
  }

  const result = await pool.query(`
    SELECT
      parent_user_id AS "parentUserId",
      video_id AS "videoId"
    FROM favorites
  `);

  const favorites = {};
  for (const row of result.rows) {
    const parentUserId = String(row.parentUserId || "");
    const videoId = String(row.videoId || "");
    if (!parentUserId || !videoId) {
      continue;
    }
    if (!Array.isArray(favorites[parentUserId])) {
      favorites[parentUserId] = [];
    }
    favorites[parentUserId].push(videoId);
  }
  return favorites;
}

async function saveFavorites(favorites) {
  if (!USE_POSTGRES || !pool) {
    fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2), "utf8");
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM favorites");
    const userResult = await client.query("SELECT id FROM users");
    const videoResult = await client.query("SELECT id FROM videos");
    const validUserIds = new Set(userResult.rows.map((row) => row.id));
    const validVideoIds = new Set(videoResult.rows.map((row) => row.id));

    for (const [parentUserId, videoIds] of Object.entries(favorites || {})) {
      if (!Array.isArray(videoIds)) {
        continue;
      }
      if (!validUserIds.has(parentUserId)) {
        continue;
      }
      for (const videoId of videoIds) {
        if (!validVideoIds.has(videoId)) {
          continue;
        }
        await client.query(
          `
            INSERT INTO favorites (parent_user_id, video_id, created_at)
            VALUES ($1, $2, now())
            ON CONFLICT (parent_user_id, video_id) DO NOTHING
          `,
          [parentUserId, videoId]
        );
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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

function readJsonObject(filePath, label) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    console.error(`Failed to read ${label} data, using empty object:`, error);
    return {};
  }
}

async function requireAuth(req, res, roles) {
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

  const users = await loadUsers();
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

  const attempts = [];

  if (hasSmtpPasswordResetProvider()) {
    try {
      const transporter = getSmtpTransporter();
      await transporter.sendMail({
        from: SMTP_FROM_EMAIL,
        to: user.email,
        subject: payload.subject,
        text: payload.message,
        html: buildPasswordResetEmailHtml(resetUrl)
      });
      attempts.push({ provider: "smtp", ok: true });
      return { sent: true, provider: "smtp", attempts };
    } catch (error) {
      attempts.push({ provider: "smtp", ok: false, error: toErrorMessage(error) });
      console.error("Password reset email via SMTP failed:", error);
    }
  }

  if (hasResendPasswordResetProvider()) {
    try {
      const response = await postJson(
        "https://api.resend.com/emails",
        {
          from: PASSWORD_RESET_FROM_EMAIL,
          to: [user.email],
          subject: payload.subject,
          text: payload.message,
          html: buildPasswordResetEmailHtml(resetUrl)
        },
        {
          Authorization: `Bearer ${RESEND_API_KEY}`
        }
      );

      if (!response.ok) {
        throw new Error(`Resend responded with ${response.statusCode}: ${response.body}`);
      }

      attempts.push({ provider: "resend", ok: true });
      return { sent: true, provider: "resend", attempts };
    } catch (error) {
      attempts.push({ provider: "resend", ok: false, error: toErrorMessage(error) });
      console.error("Password reset email via Resend failed:", error);
    }
  }

  if (hasWebhookPasswordResetProvider()) {
    try {
      const response = await postJson(PASSWORD_RESET_WEBHOOK_URL, payload);
      if (!response.ok) {
        throw new Error(`Webhook responded with ${response.statusCode}: ${response.body}`);
      }

      attempts.push({ provider: "webhook", ok: true });
      return { sent: true, provider: "webhook", attempts };
    } catch (error) {
      attempts.push({ provider: "webhook", ok: false, error: toErrorMessage(error) });
      console.error("Password reset webhook failed:", error);
    }
  }

  // Fallback for development and misconfigured environments.
  console.log(`[PasswordReset] ${user.email} -> ${resetUrl}`);
  if (!hasAnyPasswordResetProvider()) {
    console.warn(
      "Password reset provider not configured. Configure SMTP or RESEND in Railway Variables."
    );
  } else {
    console.warn("Password reset providers are configured but all delivery attempts failed. Check logs.");
  }

  return {
    sent: false,
    provider: "console",
    attempts
  };
}

function buildPasswordResetEmailHtml(resetUrl) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1a2e5f">
      <h2 style="margin-bottom:8px">Reset your XerivoLearn password</h2>
      <p style="margin-top:0">Click the button below to reset your password.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block;padding:10px 14px;background:#1f9bdd;color:#fff;text-decoration:none;border-radius:8px">
          Reset Password
        </a>
      </p>
      <p style="font-size:13px;color:#4b5f89">If you did not request this, you can ignore this email.</p>
    </div>
  `;
}

function getSmtpTransporter() {
  if (smtpTransporter) {
    return smtpTransporter;
  }
  if (!nodemailer) {
    throw new Error("SMTP is configured but nodemailer is not installed.");
  }

  const auth =
    SMTP_USER || SMTP_PASS
      ? {
          user: SMTP_USER,
          pass: SMTP_PASS
        }
      : undefined;

  smtpTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    ...(auth ? { auth } : {})
  });

  return smtpTransporter;
}

function hasSmtpPasswordResetProvider() {
  if (!SMTP_HOST || !SMTP_FROM_EMAIL) {
    return false;
  }
  if (!SMTP_USER && !SMTP_PASS) {
    return true;
  }
  return Boolean(SMTP_USER && SMTP_PASS);
}

function hasResendPasswordResetProvider() {
  return Boolean(RESEND_API_KEY && PASSWORD_RESET_FROM_EMAIL);
}

function hasWebhookPasswordResetProvider() {
  return Boolean(PASSWORD_RESET_WEBHOOK_URL);
}

function hasAnyPasswordResetProvider() {
  return (
    hasSmtpPasswordResetProvider() ||
    hasResendPasswordResetProvider() ||
    hasWebhookPasswordResetProvider()
  );
}

function getPasswordResetPublicMessage() {
  if (hasAnyPasswordResetProvider()) {
    return "If an account exists, a reset link has been sent.";
  }
  return "Password reset email is not configured yet. Contact support to reset your password.";
}

function getPasswordResetProviderFlags() {
  return {
    smtp: hasSmtpPasswordResetProvider(),
    resend: hasResendPasswordResetProvider(),
    webhook: hasWebhookPasswordResetProvider()
  };
}

function logPasswordResetConfig() {
  const providers = getPasswordResetProviderFlags();
  const enabled = Object.entries(providers)
    .filter(([, value]) => value)
    .map(([key]) => key);

  if (enabled.length === 0) {
    console.warn(
      "Password reset delivery providers: none. Reset links will be logged in server console only."
    );
    return;
  }

  console.log(`Password reset delivery providers: ${enabled.join(", ")}`);

  if (SMTP_HOST && !nodemailer) {
    console.warn("SMTP host is set but nodemailer dependency is missing.");
  }
}

function postJson(url, payload, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    let target = null;
    try {
      target = new URL(url);
    } catch (error) {
      reject(new Error(`Invalid URL: ${url}`));
      return;
    }

    const transport = target.protocol === "https:" ? https : target.protocol === "http:" ? http : null;
    if (!transport) {
      reject(new Error(`Unsupported protocol for ${url}`));
      return;
    }

    const body = JSON.stringify(payload || {});
    const request = transport.request(
      {
        method: "POST",
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port || (target.protocol === "https:" ? 443 : 80),
        path: `${target.pathname}${target.search}`,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          ...extraHeaders
        },
        timeout: 15000
      },
      (response) => {
        let raw = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          raw += chunk;
        });
        response.on("end", () => {
          resolve({
            ok: Number(response.statusCode) >= 200 && Number(response.statusCode) < 300,
            statusCode: Number(response.statusCode || 0),
            body: raw
          });
        });
      }
    );

    request.on("timeout", () => {
      request.destroy(new Error(`Request timed out for ${url}`));
    });

    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

function toErrorMessage(error) {
  if (!error) {
    return "Unknown error";
  }
  if (typeof error.message === "string" && error.message.trim()) {
    return error.message.trim();
  }
  return String(error);
}

function isDatabaseUniqueViolation(error) {
  const code = String(error?.code || "");
  const message = String(error?.message || "");
  return code === "23505" || /duplicate key value/i.test(message);
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function defaultTermsAndConditions() {
  return [
    "XerivoLearn Terms and Conditions",
    "",
    "1. Parent Account Responsibility",
    "Parent accounts are for adults only. Parents are responsible for supervising children while using the platform.",
    "",
    "2. Child Safety and Appropriate Use",
    "You agree to use XerivoLearn for educational purposes and to avoid uploading or sharing harmful content.",
    "",
    "3. Account Security",
    "You are responsible for keeping your email and password secure. Do not share login credentials.",
    "",
    "4. Subscription and Access",
    "Access to videos and features depends on an active parent subscription and compliance with platform rules.",
    "",
    "5. Content Availability",
    "Video content may be updated, removed, or reorganized over time to improve learning quality.",
    "",
    "6. Privacy",
    "We store only required account and usage data needed to operate the service and improve child learning experience.",
    "",
    "7. Policy Updates",
    "Terms may change from time to time. Continued use after updates means you accept the revised terms."
  ].join("\n");
}

function clearExpiredCaptchas() {
  const now = Date.now();
  for (const [id, captcha] of CAPTCHA_STORE.entries()) {
    const expiryMs = new Date(captcha.expiresAt || 0).getTime();
    if (!Number.isFinite(expiryMs) || expiryMs < now || captcha.used) {
      CAPTCHA_STORE.delete(id);
    }
  }
}

function createCaptchaChallenge() {
  const a = 1 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 9);
  const id = crypto.randomUUID();
  const now = Date.now();
  const expiresAt = new Date(now + CAPTCHA_TTL_MINUTES * 60 * 1000).toISOString();

  CAPTCHA_STORE.set(id, {
    answer: String(a + b),
    createdAt: new Date(now).toISOString(),
    expiresAt,
    used: false
  });

  return {
    captchaId: id,
    question: `${a} + ${b} = ?`,
    expiresAt
  };
}

function consumeCaptcha(captchaId, captchaAnswer) {
  clearExpiredCaptchas();
  const id = String(captchaId || "").trim();
  const answer = String(captchaAnswer || "").trim();
  if (!id || !answer) {
    return false;
  }

  const captcha = CAPTCHA_STORE.get(id);
  if (!captcha || captcha.used) {
    return false;
  }

  const expiryMs = new Date(captcha.expiresAt || 0).getTime();
  if (!Number.isFinite(expiryMs) || expiryMs < Date.now()) {
    CAPTCHA_STORE.delete(id);
    return false;
  }

  const ok = answer === captcha.answer;
  CAPTCHA_STORE.delete(id);
  return ok;
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

function validateRegistrationInput(payload, settings = {}) {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, error: "Payload must be an object." };
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = normalizeEmail(payload.email || "");
  const password = typeof payload.password === "string" ? payload.password : "";
  const acceptedTerms = payload.acceptedTerms === true;
  const captchaId = typeof payload.captchaId === "string" ? payload.captchaId.trim() : "";
  const captchaAnswer =
    typeof payload.captchaAnswer === "string" || typeof payload.captchaAnswer === "number"
      ? String(payload.captchaAnswer).trim()
      : "";

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
  if (!acceptedTerms) {
    return { ok: false, error: "You must accept Terms and Conditions." };
  }
  if (!settings.termsAndConditions || !settings.termsUpdatedAt) {
    return { ok: false, error: "Terms and Conditions are unavailable. Please try again shortly." };
  }
  if (!captchaId || !captchaAnswer) {
    return { ok: false, error: "Captcha verification is required." };
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

function envString(key, fallback = "") {
  if (!(key in process.env)) {
    return String(fallback);
  }
  return normalizeEnvValue(process.env[key], String(fallback));
}

function envNumber(key, fallback) {
  const raw = envString(key, "");
  if (!raw) {
    return fallback;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function envBoolean(key, fallback = false) {
  const raw = envString(key, "");
  if (!raw) {
    return fallback;
  }
  const normalized = raw.toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on") {
    return true;
  }
  if (normalized === "false" || normalized === "0" || normalized === "no" || normalized === "off") {
    return false;
  }
  return fallback;
}

function normalizeEnvValue(value, fallback = "") {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return fallback;
  }

  const hasDoubleQuotes = raw.startsWith('"') && raw.endsWith('"') && raw.length >= 2;
  const hasSingleQuotes = raw.startsWith("'") && raw.endsWith("'") && raw.length >= 2;
  if (hasDoubleQuotes || hasSingleQuotes) {
    return raw.slice(1, -1).trim();
  }

  return raw;
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

