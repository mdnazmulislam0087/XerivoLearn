const AVATARS = [
  { key: "rocket", label: "Rocket", src: "./assets/avatars/rocket.svg" },
  { key: "star", label: "Star", src: "./assets/avatars/star.svg" },
  { key: "whale", label: "Whale", src: "./assets/avatars/whale.svg" },
  { key: "panda", label: "Panda", src: "./assets/avatars/panda.svg" },
  { key: "owl", label: "Owl", src: "./assets/avatars/owl.svg" },
  { key: "fox", label: "Fox", src: "./assets/avatars/fox.svg" }
];

const state = {
  videos: [],
  isLoadingVideos: false,
  search: "",
  age: "",
  category: "",
  token: localStorage.getItem("xerivo_parent_token") || "",
  user: null,
  favoriteIds: new Set(),
  favoritesOnly: false,
  children: [],
  selectedChildId: "",
  editingChildId: "",
  selectedAvatar: "rocket"
};

const grid = document.getElementById("videos-grid");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const ageFilter = document.getElementById("age-filter");
const categoryChips = document.getElementById("category-chips");
const resultCount = document.getElementById("result-count");
const brandLink = document.getElementById("brand-link");
const adminLink = document.getElementById("admin-link");
const educatorLink = document.getElementById("educator-link");
const favoritesOnlyBtn = document.getElementById("favorites-only-btn");
const parentPill = document.getElementById("parent-pill");
const authStatusLine = document.getElementById("auth-status-line");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const resetForm = document.getElementById("reset-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const registerName = document.getElementById("register-name");
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const resetTokenInput = document.getElementById("reset-token");
const resetNewPasswordInput = document.getElementById("reset-new-password");
const resetStatus = document.getElementById("reset-status");
const forgotPasswordBtn = document.getElementById("forgot-password-btn");
const forgotStatus = document.getElementById("forgot-status");
const logoutBtn = document.getElementById("logout-btn");

const childStatus = document.getElementById("child-status");
const childForm = document.getElementById("child-form");
const childNameInput = document.getElementById("child-name");
const childAgeGroupInput = document.getElementById("child-age-group");
const avatarOptions = document.getElementById("avatar-options");
const childSaveBtn = document.getElementById("child-save-btn");
const childCancelBtn = document.getElementById("child-cancel-btn");
const childList = document.getElementById("child-list");

const rememberedEmail = localStorage.getItem("xerivo_parent_email") || "";
loginEmail.value = rememberedEmail;
registerEmail.value = rememberedEmail;

const resetTokenFromQuery = new URLSearchParams(window.location.search).get("reset");
if (resetTokenFromQuery) {
  resetTokenInput.value = resetTokenFromQuery;
}

const host = window.location.hostname.toLowerCase();
const isProdAppDomain = host === "app.xerivolearn.com";
if (!isProdAppDomain) {
  adminLink.href = "/admin/";
  if (educatorLink) {
    educatorLink.href = "/educator/";
  }
  if (brandLink) {
    brandLink.href = "/";
  }
}

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value.trim().toLowerCase();
  render();
});

ageFilter.addEventListener("change", (event) => {
  state.age = event.target.value;
  render();
});

categoryChips.addEventListener("click", (event) => {
  const target = event.target.closest("button[data-category]");
  if (!target) {
    return;
  }

  state.category = target.dataset.category || "";
  renderCategoryChips();
  render();
});

favoritesOnlyBtn.addEventListener("click", () => {
  state.favoritesOnly = !state.favoritesOnly;
  updateFavoritesToggle();
  render();
});

grid.addEventListener("click", async (event) => {
  const target = event.target.closest("button[data-fav-id]");
  if (!target) {
    return;
  }

  const videoId = target.dataset.favId;
  if (!videoId) {
    return;
  }

  if (!state.token || !state.user || state.user.role !== "parent") {
    authStatusLine.textContent = "Sign in as a parent to save favorites.";
    return;
  }

  await toggleFavorite(videoId);
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await handleLogin();
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await handleRegister();
});

resetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await handleResetPassword();
});

forgotPasswordBtn.addEventListener("click", async () => {
  await handleForgotPassword();
});

logoutBtn.addEventListener("click", () => {
  clearSession();
  updateAuthUi();
  render();
});

childForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveChildProfile();
});

childCancelBtn.addEventListener("click", () => {
  resetChildForm();
});

avatarOptions.addEventListener("click", (event) => {
  const target = event.target.closest("button[data-avatar]");
  if (!target) {
    return;
  }
  state.selectedAvatar = target.dataset.avatar || "rocket";
  renderAvatarOptions();
});

childList.addEventListener("click", async (event) => {
  const target = event.target.closest("button[data-action][data-child-id]");
  if (!target) {
    return;
  }
  const childId = target.dataset.childId || "";
  const action = target.dataset.action || "";
  const child = state.children.find((item) => item.id === childId);
  if (!child) {
    return;
  }

  if (action === "select") {
    selectChild(child.id, { syncAgeFilter: true });
    return;
  }
  if (action === "edit") {
    beginChildEdit(child);
    return;
  }
  if (action === "delete") {
    await deleteChildProfile(child.id);
  }
});

bootstrap();

async function bootstrap() {
  renderAvatarOptions();
  updateFavoritesToggle();
  updateAuthUi();
  render();

  if (!state.token) {
    return;
  }

  try {
    await refreshSession();
    await Promise.all([loadVideos(), loadFavorites(), loadChildren()]);
    updateAuthUi();
    render();
  } catch {
    clearSession();
    updateAuthUi();
    render();
  }
}

async function loadVideos() {
  if (!state.token || !state.user || state.user.role !== "parent") {
    state.videos = [];
    state.isLoadingVideos = false;
    renderCategoryChips();
    render();
    return;
  }

  state.isLoadingVideos = true;
  render();

  try {
    const response = await authenticatedFetch("/api/videos", { method: "GET" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to load videos.");
    }
    state.videos = Array.isArray(data) ? data : [];
    renderCategoryChips();
  } catch (error) {
    state.videos = [];
    renderCategoryChips();
    authStatusLine.textContent = error.message || "Could not load videos.";
  } finally {
    state.isLoadingVideos = false;
    render();
  }
}

async function handleLogin() {
  authStatusLine.textContent = "";
  forgotStatus.textContent = "";
  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value;
  if (!email || !password) {
    authStatusLine.textContent = "Email and password are required.";
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

    if (!data.user || data.user.role !== "parent") {
      throw new Error(
        "This portal is for parent accounts only. Educators should use the Educator portal."
      );
    }

    state.token = data.token;
    state.user = data.user;
    localStorage.setItem("xerivo_parent_token", state.token);
    localStorage.setItem("xerivo_parent_email", data.user.email || "");
    loginPassword.value = "";
    await Promise.all([loadVideos(), loadFavorites(), loadChildren()]);
    updateAuthUi();
    render();
  } catch (error) {
    authStatusLine.textContent = error.message;
  }
}

async function handleRegister() {
  authStatusLine.textContent = "";
  forgotStatus.textContent = "";
  const payload = {
    name: registerName.value.trim(),
    email: registerEmail.value.trim().toLowerCase(),
    password: registerPassword.value
  };

  if (!payload.name || !payload.email || !payload.password) {
    authStatusLine.textContent = "Name, email, and password are required.";
    return;
  }

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Registration failed.");
    }
    if (!data.user || data.user.role !== "parent") {
      throw new Error("Only parent accounts can be created from this app.");
    }

    state.token = data.token;
    state.user = data.user;
    localStorage.setItem("xerivo_parent_token", state.token);
    localStorage.setItem("xerivo_parent_email", data.user.email || "");
    registerPassword.value = "";
    await Promise.all([loadVideos(), loadFavorites(), loadChildren()]);
    updateAuthUi();
    render();
  } catch (error) {
    authStatusLine.textContent = error.message;
  }
}

async function handleForgotPassword() {
  forgotStatus.textContent = "";
  resetStatus.textContent = "";
  const email = loginEmail.value.trim().toLowerCase();
  if (!email) {
    forgotStatus.textContent = "Enter your email in Sign In first.";
    return;
  }

  try {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Could not request password reset.");
    }

    forgotStatus.textContent = data.message || "Reset instructions sent.";
    if (data.debugResetUrl) {
      const url = new URL(data.debugResetUrl);
      const token = url.searchParams.get("reset");
      if (token) {
        resetTokenInput.value = token;
        resetStatus.textContent = "Debug token auto-filled in Reset Password form.";
      }
    }
  } catch (error) {
    forgotStatus.textContent = error.message;
  }
}

async function handleResetPassword() {
  resetStatus.textContent = "";
  const token = resetTokenInput.value.trim();
  const newPassword = resetNewPasswordInput.value;
  if (!token || !newPassword) {
    resetStatus.textContent = "Token and new password are required.";
    return;
  }

  try {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token, newPassword })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Password reset failed.");
    }

    resetStatus.textContent = data.message || "Password updated.";
    resetNewPasswordInput.value = "";
    clearResetTokenFromQuery();
  } catch (error) {
    resetStatus.textContent = error.message;
  }
}

function clearResetTokenFromQuery() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("reset")) {
    return;
  }
  url.searchParams.delete("reset");
  const suffix = url.search ? url.search : "";
  window.history.replaceState({}, "", `${url.pathname}${suffix}`);
}

async function refreshSession() {
  const response = await authenticatedFetch("/api/auth/me", { method: "GET" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Session validation failed.");
  }

  state.user = data.user;
  if (!state.user || state.user.role !== "parent") {
    throw new Error("Parent account required for this app.");
  }
}

async function loadFavorites() {
  if (!state.token) {
    state.favoriteIds = new Set();
    return;
  }

  const response = await authenticatedFetch("/api/parent/favorites", { method: "GET" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Could not load favorites.");
  }

  state.favoriteIds = new Set(Array.isArray(data.videoIds) ? data.videoIds : []);
}

async function toggleFavorite(videoId) {
  try {
    const response = await authenticatedFetch(`/api/parent/favorites/${videoId}`, {
      method: "POST"
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Could not update favorite.");
    }

    state.favoriteIds = new Set(Array.isArray(data.videoIds) ? data.videoIds : []);
    render();
  } catch (error) {
    authStatusLine.textContent = error.message;
  }
}

async function loadChildren() {
  if (!state.token) {
    state.children = [];
    state.selectedChildId = "";
    renderChildList();
    return;
  }

  const response = await authenticatedFetch("/api/parent/children", { method: "GET" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Could not load child profiles.");
  }

  state.children = Array.isArray(data) ? data : [];
  if (!state.selectedChildId || !state.children.some((child) => child.id === state.selectedChildId)) {
    state.selectedChildId = state.children.length ? state.children[0].id : "";
  }
  renderChildList();
}

async function saveChildProfile() {
  childStatus.textContent = "";
  if (!state.token) {
    childStatus.textContent = "Sign in to manage child profiles.";
    return;
  }

  const payload = {
    name: childNameInput.value.trim(),
    ageGroup: childAgeGroupInput.value,
    avatar: state.selectedAvatar
  };

  if (!payload.name) {
    childStatus.textContent = "Child name is required.";
    return;
  }

  try {
    const isEditing = Boolean(state.editingChildId);
    const endpoint = isEditing
      ? `/api/parent/children/${state.editingChildId}`
      : "/api/parent/children";
    const method = isEditing ? "PUT" : "POST";

    const response = await authenticatedFetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Could not save child profile.");
    }

    childStatus.textContent = isEditing ? "Child profile updated." : "Child profile created.";
    resetChildForm();
    await loadChildren();
    if (!state.selectedChildId) {
      state.selectedChildId = data.id;
    }
    render();
  } catch (error) {
    childStatus.textContent = error.message;
  }
}

async function deleteChildProfile(childId) {
  if (!state.token) {
    childStatus.textContent = "Sign in to manage child profiles.";
    return;
  }
  if (!window.confirm("Delete this child profile?")) {
    return;
  }

  try {
    const response = await authenticatedFetch(`/api/parent/children/${childId}`, {
      method: "DELETE"
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Could not delete child profile.");
    }

    childStatus.textContent = "Child profile deleted.";
    if (state.selectedChildId === childId) {
      state.selectedChildId = "";
    }
    await loadChildren();
    render();
  } catch (error) {
    childStatus.textContent = error.message;
  }
}

function beginChildEdit(child) {
  state.editingChildId = child.id;
  state.selectedAvatar = child.avatar || "rocket";
  childNameInput.value = child.name || "";
  childAgeGroupInput.value = child.ageGroup || "4-7";
  childSaveBtn.textContent = "Update Child";
  childCancelBtn.classList.remove("hidden");
  renderAvatarOptions();
}

function resetChildForm() {
  state.editingChildId = "";
  state.selectedAvatar = "rocket";
  childForm.reset();
  childAgeGroupInput.value = "4-7";
  childSaveBtn.textContent = "Save Child";
  childCancelBtn.classList.add("hidden");
  renderAvatarOptions();
}

function selectChild(childId, options = {}) {
  state.selectedChildId = childId;
  renderChildList();
  const selectedChild = getSelectedChild();
  if (selectedChild && options.syncAgeFilter) {
    state.age = selectedChild.ageGroup || "";
    ageFilter.value = state.age;
  }
  render();
}

function getSelectedChild() {
  return state.children.find((child) => child.id === state.selectedChildId) || null;
}

function renderChildList() {
  if (!state.user) {
    childList.innerHTML = "<p class=\"mini-status\">Sign in to create child profiles.</p>";
    return;
  }
  if (state.children.length === 0) {
    childList.innerHTML = "<p class=\"mini-status\">No child profiles yet. Create your first profile.</p>";
    return;
  }

  childList.innerHTML = state.children
    .map((child) => {
      const avatarSrc = getAvatarSrc(child.avatar);
      const active = child.id === state.selectedChildId;
      return `
        <article class="child-card">
          <img class="child-avatar" src="${escapeHtml(avatarSrc)}" alt="${escapeHtml(child.name)} avatar" />
          <div>
            <p class="child-name">${escapeHtml(child.name)}</p>
            <p class="child-meta">Age ${escapeHtml(child.ageGroup || "4-7")}${active ? " | Active" : ""}</p>
          </div>
          <div class="child-actions">
            <button type="button" class="tiny-btn select" data-action="select" data-child-id="${escapeHtml(
              child.id
            )}">Select</button>
            <button type="button" class="tiny-btn edit" data-action="edit" data-child-id="${escapeHtml(
              child.id
            )}">Edit</button>
            <button type="button" class="tiny-btn delete" data-action="delete" data-child-id="${escapeHtml(
              child.id
            )}">Delete</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderAvatarOptions() {
  avatarOptions.innerHTML = AVATARS.map((avatar) => {
    const activeClass = avatar.key === state.selectedAvatar ? "active" : "";
    return `
      <button type="button" class="avatar-option ${activeClass}" data-avatar="${avatar.key}" aria-label="${avatar.label}">
        <img src="${avatar.src}" alt="${avatar.label} avatar" />
      </button>
    `;
  }).join("");
}

function render() {
  if (state.isLoadingVideos && state.user && state.user.role === "parent") {
    grid.innerHTML = "<p>Loading videos...</p>";
    emptyState.classList.add("hidden");
    resultCount.textContent = "";
    return;
  }

  if (!state.user || state.user.role !== "parent") {
    grid.innerHTML = "";
    categoryChips.innerHTML = "";
    resultCount.textContent = "";
    emptyState.classList.remove("hidden");
    emptyState.textContent = "Parent login required to watch videos.";
    return;
  }

  const filtered = state.videos.filter((video) => {
    const ageMatch = !state.age || video.ageGroup === state.age;
    const categoryMatch =
      !state.category || (video.category || "").toLowerCase() === state.category.toLowerCase();
    const text = `${video.title} ${video.description}`.toLowerCase();
    const searchMatch = !state.search || text.includes(state.search);
    const favoriteMatch = !state.favoritesOnly || state.favoriteIds.has(video.id);
    return ageMatch && categoryMatch && searchMatch && favoriteMatch;
  });

  const label = filtered.length === 1 ? "video" : "videos";
  const selectedChild = getSelectedChild();
  resultCount.textContent = `${filtered.length} ${label} found${
    selectedChild ? ` for ${selectedChild.name}` : ""
  }`;

  if (filtered.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    if (state.favoritesOnly && !state.token) {
      emptyState.textContent = "Sign in to use favorites-only filter.";
    } else if (state.favoritesOnly) {
      emptyState.textContent = "No favorite videos yet. Save some videos first.";
    } else {
      emptyState.textContent = "No videos match your filters yet.";
    }
    return;
  }

  emptyState.classList.add("hidden");
  grid.innerHTML = filtered
    .map((video) => {
      const isFavorite = state.favoriteIds.has(video.id);
      return `
      <article class="video-card">
        <img class="video-thumb" src="${escapeHtml(getThumbnail(video))}" alt="${escapeHtml(video.title)}" />
        <div class="video-body">
          <h2 class="video-title">${escapeHtml(video.title)}</h2>
          <div class="video-meta">
            <span class="pill">${escapeHtml(video.category || "General")}</span>
            <span class="pill">Age ${escapeHtml(video.ageGroup || "All")}</span>
            <span class="pill">${escapeHtml(video.duration || "Short")}</span>
          </div>
          <p class="video-desc">${escapeHtml(video.description || "")}</p>
          <div class="card-actions">
            <a class="watch-btn" href="${escapeHtml(video.videoUrl)}" target="_blank" rel="noreferrer">
              Watch Video
            </a>
            <button type="button" class="favorite-btn ${isFavorite ? "active" : ""}" data-fav-id="${escapeHtml(
        video.id
      )}">
              ${isFavorite ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </article>
    `;
    })
    .join("");
}

function renderCategoryChips() {
  if (!state.user || state.user.role !== "parent") {
    categoryChips.innerHTML = "";
    return;
  }

  const categories = [...new Set(state.videos.map((video) => (video.category || "General").trim()))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  const items = [{ label: "All topics", value: "" }].concat(
    categories.map((category) => ({ label: category, value: category }))
  );

  categoryChips.innerHTML = items
    .map((item) => {
      const activeClass = item.value === state.category ? "active" : "";
      return `<button type="button" class="category-chip ${activeClass}" data-category="${escapeHtml(
        item.value
      )}">${escapeHtml(item.label)}</button>`;
    })
    .join("");
}

function updateAuthUi() {
  const loggedIn = Boolean(state.user && state.user.role === "parent");
  if (loggedIn) {
    parentPill.textContent = `Parent: ${state.user.name}`;
    parentPill.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
    resetForm.classList.add("hidden");
    authStatusLine.textContent = `Signed in as ${state.user.email}`;
    loginEmail.value = state.user.email || "";
    registerEmail.value = state.user.email || "";
    childStatus.textContent = "Create profiles and select one to focus age filtering.";
  } else {
    parentPill.textContent = "";
    parentPill.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    loginForm.classList.remove("hidden");
    registerForm.classList.remove("hidden");
    resetForm.classList.remove("hidden");
    authStatusLine.textContent =
      "Parents plan: BDT 99/month. Sign in to watch videos and save favorites.";
    state.favoriteIds = new Set();
    state.favoritesOnly = false;
    state.videos = [];
    state.isLoadingVideos = false;
    state.search = "";
    state.age = "";
    state.category = "";
    searchInput.value = "";
    ageFilter.value = "";
    state.children = [];
    state.selectedChildId = "";
    state.editingChildId = "";
    resetChildForm();
    childStatus.textContent = "Sign in to create child profiles.";
    renderChildList();
  }

  setChildSectionEnabled(loggedIn);
  setLibraryControlsEnabled(loggedIn);
  updateFavoritesToggle();
}

function setChildSectionEnabled(enabled) {
  childNameInput.disabled = !enabled;
  childAgeGroupInput.disabled = !enabled;
  childSaveBtn.disabled = !enabled;
  childCancelBtn.disabled = !enabled;
  avatarOptions.querySelectorAll("button").forEach((button) => {
    button.disabled = !enabled;
  });
}

function updateFavoritesToggle() {
  favoritesOnlyBtn.classList.toggle("active", state.favoritesOnly);
  favoritesOnlyBtn.textContent = state.favoritesOnly ? "Showing favorites" : "Favorites only";
}

function setLibraryControlsEnabled(enabled) {
  searchInput.disabled = !enabled;
  ageFilter.disabled = !enabled;
  favoritesOnlyBtn.disabled = !enabled;
  categoryChips.querySelectorAll("button").forEach((button) => {
    button.disabled = !enabled;
  });
}

function clearSession() {
  state.token = "";
  state.user = null;
  state.videos = [];
  state.isLoadingVideos = false;
  localStorage.removeItem("xerivo_parent_token");
}

async function authenticatedFetch(url, options = {}) {
  if (!state.token) {
    throw new Error("Please sign in first.");
  }

  const headers = Object.assign({}, options.headers || {}, {
    Authorization: `Bearer ${state.token}`
  });

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 || response.status === 403) {
    let message =
      response.status === 403
        ? "Parent account required. Please sign in with a parent account."
        : "Session expired. Please sign in again.";
    try {
      const body = await response.clone().json();
      if (body && typeof body.error === "string" && body.error.trim()) {
        message = body.error;
      }
    } catch {}
    clearSession();
    updateAuthUi();
    throw new Error(message);
  }
  return response;
}

function getThumbnail(video) {
  if (video.thumbnailUrl && String(video.thumbnailUrl).trim()) {
    return video.thumbnailUrl;
  }
  return "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=900&q=80";
}

function getAvatarSrc(avatarKey) {
  const avatar = AVATARS.find((item) => item.key === avatarKey) || AVATARS[0];
  return avatar.src;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
