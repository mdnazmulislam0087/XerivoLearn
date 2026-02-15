const tokenInput = document.getElementById("token-input");
const saveTokenBtn = document.getElementById("save-token-btn");
const tokenStatus = document.getElementById("token-status");
const openAppLink = document.getElementById("open-app-link");

const formTitle = document.getElementById("form-title");
const videoForm = document.getElementById("video-form");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formStatus = document.getElementById("form-status");
const videoList = document.getElementById("video-list");

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
  token: localStorage.getItem("xerivo_admin_token") || "",
  editingId: null,
  videos: []
};

const host = window.location.hostname.toLowerCase();
const isProdAdminDomain = host === "admin.xerivolearn.com";
if (!isProdAdminDomain && openAppLink) {
  openAppLink.href = "/app/";
}

tokenInput.value = state.token;
if (state.token) {
  tokenStatus.textContent = "Token loaded from browser storage.";
}

saveTokenBtn.addEventListener("click", () => {
  const token = tokenInput.value.trim();
  state.token = token;
  localStorage.setItem("xerivo_admin_token", token);
  tokenStatus.textContent = token ? "Token saved." : "Token cleared.";
  loadVideos();
});

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
    assertToken();
    const isEditing = Boolean(state.editingId);
    const endpoint = isEditing
      ? `/api/admin/videos/${state.editingId}`
      : "/api/admin/videos";
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Token": state.token
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

loadVideos();

async function loadVideos() {
  videoList.innerHTML = "<p>Loading videos...</p>";

  if (!state.token) {
    videoList.innerHTML = "<p>Add your admin token to load CMS data.</p>";
    return;
  }

  try {
    const response = await fetch("/api/admin/videos", {
      headers: {
        "X-Admin-Token": state.token
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Could not load videos.");
    }

    state.videos = data;
    renderList();
  } catch (error) {
    videoList.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
  }
}

function renderList() {
  if (state.videos.length === 0) {
    videoList.innerHTML = "<p>No videos yet. Add your first video above.</p>";
    return;
  }

  videoList.innerHTML = state.videos
    .map(
      (video) => `
      <article class="video-item">
        <div>
          <h3>${escapeHtml(video.title)}</h3>
          <p>${escapeHtml(video.category)} | Age ${escapeHtml(video.ageGroup)} | ${escapeHtml(
        video.duration || "Short"
      )}</p>
          <p>${escapeHtml(video.description || "")}</p>
          <p><strong>Published:</strong> ${video.isPublished ? "Yes" : "No"}</p>
        </div>
        <div class="video-actions">
          <button type="button" data-action="edit" data-id="${video.id}">Edit</button>
          <button type="button" data-action="toggle" data-id="${video.id}">
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
      assertToken();
      const response = await fetch(`/api/admin/videos/${id}`, {
        method: "DELETE",
        headers: {
          "X-Admin-Token": state.token
        }
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
    assertToken();
    const response = await fetch(`/api/admin/videos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Token": state.token
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

function assertToken() {
  if (!state.token) {
    throw new Error("Please save your admin token first.");
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
