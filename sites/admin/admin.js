const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authLoginBtn = document.getElementById("auth-login-btn");
const authLogoutBtn = document.getElementById("auth-logout-btn");
const authStatus = document.getElementById("auth-status");
const authUser = document.getElementById("auth-user");
const openAppLink = document.getElementById("open-app-link");

const formTitle = document.getElementById("form-title");
const videoForm = document.getElementById("video-form");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formStatus = document.getElementById("form-status");
const videoList = document.getElementById("video-list");
const librarySearch = document.getElementById("library-search");

const statTotal = document.getElementById("stat-total");
const statPublished = document.getElementById("stat-published");
const statDrafts = document.getElementById("stat-drafts");
const authSections = Array.from(document.querySelectorAll(".requires-auth"));

const fields = {
  title: document.getElementById("title"),
  description: document.getElementById("description"),
  category: document.getElementById("category"),
  ageGroup: document.getElementById("ageGroup"),
  duration: document.getElementById("duration"),
  thumbnailUrl: document.getElementById("thumbnailUrl"),
  videoUrl: document.getElementById("videoUrl"),
  isPublished: document.getElementById("isPublished")
};

const state = {
  token: localStorage.getItem("xerivo_auth_token") || "",
  user: null,
  editingId: null,
  videos: [],
  searchQuery: ""
};

authEmail.value = localStorage.getItem("xerivo_admin_email") || "";

const host = window.location.hostname.toLowerCase();
const isProdAdminDomain = host === "admin.xerivolearn.com";
if (!isProdAdminDomain && openAppLink) {
  openAppLink.href = "/app/";
}

librarySearch.addEventListener("input", (event) => {
  state.searchQuery = event.target.value.trim().toLowerCase();
  renderList();
});

authLoginBtn.addEventListener("click", loginAdmin);
authLogoutBtn.addEventListener("click", logoutAdmin);

videoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  const payload = {
    title: fields.title.value.trim(),
    description: fields.description.value.trim(),
    category: fields.category.value.trim(),
    ageGroup: fields.ageGroup.value,
    duration: fields.duration.value.trim(),
    thumbnailUrl: fields.thumbnailUrl.value.trim(),
    videoUrl: fields.videoUrl.value.trim(),
    isPublished: fields.isPublished.checked
  };

  try {
    assertAuthenticated();
    const isEditing = Boolean(state.editingId);
    const endpoint = isEditing
      ? `/api/admin/videos/${state.editingId}`
      : "/api/admin/videos";
    const method = isEditing ? "PUT" : "POST";

    const response = await adminFetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Could not save video.");
    }

    formStatus.textContent = isEditing ? "Video updated." : "Video created.";
    resetForm();
    await loadVideos();
  } catch (error) {
    formStatus.textContent = error.message;
  }
});

cancelBtn.addEventListener("click", () => {
  resetForm();
});

bootstrap();

async function bootstrap() {
  setCmsEnabled(false);
  if (!state.token) {
    showLoggedOut("Sign in to manage your video library.");
    return;
  }

  try {
    await refreshAdminSession();
    await loadVideos();
  } catch (error) {
    clearSession();
    showLoggedOut(error.message || "Your session expired. Sign in again.");
  }
}

async function loginAdmin() {
  authStatus.textContent = "";
  const email = authEmail.value.trim().toLowerCase();
  const password = authPassword.value;
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

    if (!data.user || data.user.role !== "admin") {
      throw new Error("This account is not an admin account.");
    }

    state.token = data.token;
    state.user = data.user;
    localStorage.setItem("xerivo_auth_token", state.token);
    localStorage.setItem("xerivo_admin_email", data.user.email || "");

    authPassword.value = "";
    showLoggedIn();
    await loadVideos();
  } catch (error) {
    clearSession();
    showLoggedOut(error.message);
  }
}

function logoutAdmin() {
  clearSession();
  resetForm();
  showLoggedOut("Logged out.");
}

async function refreshAdminSession() {
  assertAuthenticated();
  const response = await adminFetch("/api/admin/me", { method: "GET" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Could not validate admin session.");
  }

  state.user = data.user;
  if (!state.user || state.user.role !== "admin") {
    throw new Error("Current account is not an admin.");
  }

  authEmail.value = state.user.email || "";
  showLoggedIn();
}

async function loadVideos() {
  videoList.innerHTML = "<p>Loading videos...</p>";

  if (!state.token) {
    state.videos = [];
    updateStats();
    videoList.innerHTML = "<p>Sign in to load your CMS video library.</p>";
    return;
  }

  try {
    const response = await adminFetch("/api/admin/videos", { method: "GET" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Could not load videos.");
    }

    state.videos = data;
    updateStats();
    renderList();
  } catch (error) {
    state.videos = [];
    updateStats();
    videoList.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
  }
}

function updateStats() {
  const total = state.videos.length;
  const published = state.videos.filter((video) => video.isPublished).length;
  const drafts = total - published;

  statTotal.textContent = String(total);
  statPublished.textContent = String(published);
  statDrafts.textContent = String(drafts);
}

function renderList() {
  const filtered = state.videos.filter((video) => {
    if (!state.searchQuery) {
      return true;
    }
    const text =
      `${video.title} ${video.description} ${video.category} ${video.ageGroup}`.toLowerCase();
    return text.includes(state.searchQuery);
  });

  if (filtered.length === 0) {
    videoList.innerHTML = state.videos.length
      ? "<p>No videos match this search.</p>"
      : "<p>No videos yet. Add your first video above.</p>";
    return;
  }

  videoList.innerHTML = filtered
    .map(
      (video) => `
      <article class="video-item">
        <img class="video-thumb" src="${escapeHtml(getThumbnail(video))}" alt="${escapeHtml(video.title)}" />
        <div>
          <h3>${escapeHtml(video.title)}</h3>
          <p class="meta">
            <span class="badge">${escapeHtml(video.category || "General")}</span>
            <span class="badge">Age ${escapeHtml(video.ageGroup || "All")}</span>
            <span class="badge">${escapeHtml(video.duration || "Short")}</span>
            <span class="badge ${video.isPublished ? "live" : "draft"}">
              ${video.isPublished ? "Published" : "Draft"}
            </span>
          </p>
          <p>${escapeHtml(video.description || "")}</p>
          <a class="video-link" href="${escapeHtml(video.videoUrl || "#")}" target="_blank" rel="noreferrer">
            Preview video link
          </a>
        </div>
        <div class="video-actions">
          <button type="button" data-action="edit" data-id="${video.id}">Edit</button>
          <button type="button" class="toggle" data-action="toggle" data-id="${video.id}">
            ${video.isPublished ? "Unpublish" : "Publish"}
          </button>
          <button class="danger" type="button" data-action="delete" data-id="${video.id}">
            Delete
          </button>
        </div>
      </article>
    `
    )
    .join("");

  videoList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => handleListAction(button.dataset.action, button.dataset.id));
  });
}

async function handleListAction(action, id) {
  const video = state.videos.find((item) => item.id === id);
  if (!video) {
    return;
  }

  if (action === "edit") {
    beginEdit(video);
    return;
  }

  if (action === "toggle") {
    await updateVideo(id, { ...video, isPublished: !video.isPublished });
    return;
  }

  if (action === "delete") {
    if (!window.confirm("Delete this video?")) {
      return;
    }
    try {
      assertAuthenticated();
      const response = await adminFetch(`/api/admin/videos/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Delete failed.");
      }

      formStatus.textContent = "Video deleted.";
      await loadVideos();
    } catch (error) {
      formStatus.textContent = error.message;
    }
  }
}

async function updateVideo(id, payload) {
  try {
    assertAuthenticated();
    const response = await adminFetch(`/api/admin/videos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Update failed.");
    }

    formStatus.textContent = "Video updated.";
    await loadVideos();
  } catch (error) {
    formStatus.textContent = error.message;
  }
}

function beginEdit(video) {
  state.editingId = video.id;
  formTitle.textContent = "Edit Video";
  saveBtn.textContent = "Update Video";
  cancelBtn.classList.remove("hidden");

  fields.title.value = video.title || "";
  fields.description.value = video.description || "";
  fields.category.value = video.category || "";
  fields.ageGroup.value = video.ageGroup || "4-7";
  fields.duration.value = video.duration || "";
  fields.thumbnailUrl.value = video.thumbnailUrl || "";
  fields.videoUrl.value = video.videoUrl || "";
  fields.isPublished.checked = Boolean(video.isPublished);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  state.editingId = null;
  formTitle.textContent = "Add New Video";
  saveBtn.textContent = "Save Video";
  cancelBtn.classList.add("hidden");
  videoForm.reset();
  fields.isPublished.checked = true;
}

function showLoggedIn() {
  setCmsEnabled(true);
  authStatus.textContent = "Authenticated.";
  authUser.textContent = state.user
    ? `Logged in as ${state.user.name} (${state.user.email})`
    : "Logged in.";
  authLogoutBtn.classList.remove("hidden");
}

function showLoggedOut(message) {
  setCmsEnabled(false);
  authStatus.textContent = message || "";
  authUser.textContent = "";
  authLogoutBtn.classList.add("hidden");
  state.videos = [];
  updateStats();
  videoList.innerHTML = "<p>Sign in to load your CMS video library.</p>";
}

function setCmsEnabled(enabled) {
  authSections.forEach((section) => {
    section.classList.toggle("hidden", !enabled);
  });
  Object.values(fields).forEach((field) => {
    field.disabled = !enabled;
  });
  saveBtn.disabled = !enabled;
  cancelBtn.disabled = !enabled;
  librarySearch.disabled = !enabled;
}

function clearSession() {
  state.token = "";
  state.user = null;
  localStorage.removeItem("xerivo_auth_token");
}

function assertAuthenticated() {
  if (!state.token) {
    throw new Error("Please sign in as admin first.");
  }
}

async function adminFetch(url, options = {}) {
  assertAuthenticated();
  const headers = Object.assign({}, options.headers || {}, {
    Authorization: `Bearer ${state.token}`
  });
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 || response.status === 403) {
    clearSession();
    showLoggedOut("Session expired. Please sign in again.");
  }
  return response;
}

function getThumbnail(video) {
  if (video.thumbnailUrl && String(video.thumbnailUrl).trim()) {
    return video.thumbnailUrl;
  }
  return "https://images.unsplash.com/photo-1535572290543-960a8046f5af?auto=format&fit=crop&w=900&q=80";
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
