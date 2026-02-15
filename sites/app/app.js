const state = {
  videos: [],
  search: "",
  age: ""
};

const grid = document.getElementById("videos-grid");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const ageFilter = document.getElementById("age-filter");
const brandLink = document.getElementById("brand-link");

const adminLink = document.getElementById("admin-link");
const host = window.location.hostname.toLowerCase();
const isProdAppDomain = host === "app.xerivolearn.com";
if (!isProdAppDomain) {
  adminLink.href = "/admin/";
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

loadVideos();

async function loadVideos() {
  try {
    const response = await fetch("/api/videos");
    if (!response.ok) {
      throw new Error("Failed to load videos.");
    }
    state.videos = await response.json();
    render();
  } catch (error) {
    grid.innerHTML = `<p>Could not load videos. ${error.message}</p>`;
    emptyState.classList.add("hidden");
  }
}

function render() {
  const filtered = state.videos.filter((video) => {
    const ageMatch = !state.age || video.ageGroup === state.age;
    const text = `${video.title} ${video.description}`.toLowerCase();
    const searchMatch = !state.search || text.includes(state.search);
    return ageMatch && searchMatch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  grid.innerHTML = filtered
    .map(
      (video) => `
      <article class="video-card">
        <img class="video-thumb" src="${escapeHtml(video.thumbnailUrl || "")}" alt="${escapeHtml(
        video.title
      )}" />
        <div class="video-body">
          <h2 class="video-title">${escapeHtml(video.title)}</h2>
          <div class="video-meta">
            <span class="pill">${escapeHtml(video.category || "General")}</span>
            <span class="pill">Age ${escapeHtml(video.ageGroup || "All")}</span>
            <span class="pill">${escapeHtml(video.duration || "Short")}</span>
          </div>
          <p class="video-desc">${escapeHtml(video.description || "")}</p>
          <a class="watch-btn" href="${escapeHtml(video.videoUrl)}" target="_blank" rel="noreferrer">
            Watch Video
          </a>
        </div>
      </article>
    `
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
