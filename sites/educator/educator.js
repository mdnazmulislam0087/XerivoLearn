const state = {
  token: localStorage.getItem("xerivo_educator_token") || "",
  user: null,
  videos: []
};

const homeLink = document.getElementById("home-link");
const adminLink = document.getElementById("admin-link");
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const logoutBtn = document.getElementById("logout-btn");
const authStatus = document.getElementById("auth-status");
const videoList = document.getElementById("video-list");

const remembered = localStorage.getItem("xerivo_educator_email") || "";
emailInput.value = remembered;

const host = window.location.hostname.toLowerCase();
const isEducatorDomain = host.startsWith("educator.");
if (!isEducatorDomain) {
  homeLink.href = "/";
  adminLink.href = "/admin/";
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loginEducator();
});

logoutBtn.addEventListener("click", () => {
  clearSession();
  updateUi();
});

bootstrap();

async function bootstrap() {
  updateUi();
  if (!state.token) {
    return;
  }

  try {
    await refreshSession();
    await loadVideos();
    updateUi();
  } catch {
    clearSession();
    updateUi();
  }
}

async function loginEducator() {
  authStatus.textContent = "";
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  if (!email || !password) {
    authStatus.textContent = "Email and password are required.";
    return;
  }

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Login failed.");
    }
    if (!data.user || data.user.role !== "educator") {
      throw new Error("This account is not an educator account.");
    }

    state.token = data.token;
    state.user = data.user;
    localStorage.setItem("xerivo_educator_token", state.token);
    localStorage.setItem("xerivo_educator_email", data.user.email || "");
    passwordInput.value = "";
    await loadVideos();
    updateUi();
  } catch (error) {
    authStatus.textContent = error.message;
  }
}

async function refreshSession() {
  const response = await authFetch("/api/educator/me", { method: "GET" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Session validation failed.");
  }

  state.user = data.user;
  if (!state.user || state.user.role !== "educator") {
    throw new Error("This account is not an educator account.");
  }
}

async function loadVideos() {
  videoList.innerHTML = "<p>Loading videos...</p>";
  const response = await authFetch("/api/educator/videos", { method: "GET" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Could not load videos.");
  }

  state.videos = Array.isArray(data) ? data : [];
  renderVideos();
}

function renderVideos() {
  if (!state.user) {
    videoList.innerHTML = "<p>Sign in as educator to load the video library.</p>";
    return;
  }
  if (state.videos.length === 0) {
    videoList.innerHTML = "<p>No published videos available yet.</p>";
    return;
  }

  videoList.innerHTML = state.videos
    .map(
      (video) => `
      <article class="video-item">
        <img class="video-thumb" src="${escapeHtml(getThumbnail(video))}" alt="${escapeHtml(video.title)}" />
        <div>
          <h3>${escapeHtml(video.title)}</h3>
          <p>${escapeHtml(video.category || "General")} | Age ${escapeHtml(video.ageGroup || "All")}</p>
          <p>${escapeHtml(video.description || "")}</p>
        </div>
      </article>
    `
    )
    .join("");
}

function updateUi() {
  const loggedIn = Boolean(state.user);
  logoutBtn.classList.toggle("hidden", !loggedIn);

  if (loggedIn) {
    authStatus.textContent = `Signed in as ${state.user.email}`;
    renderVideos();
  } else {
    authStatus.textContent = "Sign in with your educator account.";
    videoList.innerHTML = "<p>Sign in as educator to load the video library.</p>";
  }
}

function clearSession() {
  state.token = "";
  state.user = null;
  state.videos = [];
  localStorage.removeItem("xerivo_educator_token");
}

async function authFetch(url, options = {}) {
  if (!state.token) {
    throw new Error("Please sign in first.");
  }

  const headers = Object.assign({}, options.headers || {}, {
    Authorization: `Bearer ${state.token}`
  });
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 || response.status === 403) {
    clearSession();
    updateUi();
  }
  return response;
}

function getThumbnail(video) {
  if (video.thumbnailUrl && String(video.thumbnailUrl).trim()) {
    return video.thumbnailUrl;
  }
  return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80";
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
