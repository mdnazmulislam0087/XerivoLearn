const LANGUAGE_STORAGE_KEY = "xerivo_lang";
const LEGACY_LANGUAGE_STORAGE_KEY = "xerivo_app_lang";
const LANGUAGE_QUERY_KEY = "lang";
const SUPPORTED_LANGUAGES = new Set(["en", "bn"]);

const TRANSLATIONS = {
  en: {
    document_title: "XerivoLearn Admin | Video CMS",
    eyebrow: "XerivoLearn Studio",
    page_title: "Video CMS Dashboard",
    nav_parents: "Parents",
    nav_educators: "Educators",
    nav_admin: "Admin CMS",

    auth_title: "Admin Access",
    auth_subtitle: "Sign in with your admin account to access video publication controls.",
    ph_admin_email: "Admin email",
    ph_admin_password: "Admin password",
    btn_sign_in: "Sign In",
    btn_logout: "Logout",

    stats_title: "Library Snapshot",
    stats_total: "Total Videos",
    stats_published: "Published",
    stats_drafts: "Drafts",

    tips_title: "Publishing Tips",
    tip_1: "Keep titles short and clear for parents.",
    tip_2: "Use category + age labels for easy discovery.",
    tip_3: "Add strong thumbnails to increase watch clicks.",

    form_add_title: "Add New Video",
    form_edit_title: "Edit Video",
    label_title: "Title",
    label_description: "Description",
    label_category: "Category",
    label_age_group: "Age Group",
    label_duration: "Duration",
    label_thumbnail_url: "Thumbnail URL",
    label_video_url: "Video URL",
    label_published: "Published",
    btn_save_video: "Save Video",
    btn_update_video: "Update Video",
    btn_cancel_edit: "Cancel Edit",
    ph_category: "Learning, Math, Story, etc.",
    ph_duration: "2:30",
    ph_thumbnail_url: "https://...",
    ph_video_url: "https://...",

    library_title: "Video Library",
    ph_search_videos: "Search videos...",

    status_signin_to_manage: "Sign in to manage your video library.",
    status_signin_to_load: "Sign in to load your CMS video library.",
    status_session_expired: "Session expired. Please sign in again.",
    status_email_password_required: "Email and password are required.",
    status_login_failed: "Login failed.",
    status_invalid_email_password: "Invalid email or password.",
    status_not_admin_account: "This account is not an admin account.",
    status_logged_out: "Logged out.",
    status_authenticated: "Authenticated.",
    status_logged_in: "Logged in.",
    status_logged_in_as: "Logged in as {name} ({email})",
    status_could_not_validate_session: "Could not validate admin session.",
    status_current_not_admin: "Current account is not an admin.",
    status_loading_videos: "Loading videos...",
    status_could_not_load_videos: "Could not load videos.",
    status_could_not_save_video: "Could not save video.",
    status_video_created: "Video created.",
    status_video_updated: "Video updated.",
    status_video_deleted: "Video deleted.",
    status_delete_failed: "Delete failed.",
    status_update_failed: "Update failed.",
    status_no_videos_match: "No videos match this search.",
    status_no_videos: "No videos yet. Add your first video above.",
    status_signin_first_admin: "Please sign in as admin first.",

    label_general: "General",
    label_age: "Age {age}",
    label_all: "All",
    label_short: "Short",
    label_published_badge: "Published",
    label_draft_badge: "Draft",
    link_preview_video: "Preview video link",
    btn_edit: "Edit",
    btn_publish: "Publish",
    btn_unpublish: "Unpublish",
    btn_delete: "Delete",
    confirm_delete_video: "Delete this video?"
  },
  bn: {
    document_title: "XerivoLearn অ্যাডমিন | ভিডিও সিএমএস",
    eyebrow: "XerivoLearn স্টুডিও",
    page_title: "ভিডিও সিএমএস ড্যাশবোর্ড",
    nav_parents: "প্যারেন্টস",
    nav_educators: "এডুকেটরস",
    nav_admin: "অ্যাডমিন সিএমএস",

    auth_title: "অ্যাডমিন অ্যাক্সেস",
    auth_subtitle: "ভিডিও পাবলিকেশন কন্ট্রোল ব্যবহার করতে অ্যাডমিন অ্যাকাউন্টে সাইন ইন করুন।",
    ph_admin_email: "অ্যাডমিন ইমেইল",
    ph_admin_password: "অ্যাডমিন পাসওয়ার্ড",
    btn_sign_in: "সাইন ইন",
    btn_logout: "লগআউট",

    stats_title: "লাইব্রেরি সারাংশ",
    stats_total: "মোট ভিডিও",
    stats_published: "পাবলিশড",
    stats_drafts: "ড্রাফট",

    tips_title: "পাবলিশিং টিপস",
    tip_1: "প্যারেন্টদের জন্য শিরোনাম ছোট ও পরিষ্কার রাখুন।",
    tip_2: "সহজ খোঁজার জন্য ক্যাটাগরি + বয়স লেবেল ব্যবহার করুন।",
    tip_3: "ক্লিক বাড়াতে ভালো থাম্বনেইল ব্যবহার করুন।",

    form_add_title: "নতুন ভিডিও যোগ করুন",
    form_edit_title: "ভিডিও এডিট করুন",
    label_title: "শিরোনাম",
    label_description: "বিবরণ",
    label_category: "ক্যাটাগরি",
    label_age_group: "বয়স গ্রুপ",
    label_duration: "সময়কাল",
    label_thumbnail_url: "থাম্বনেইল URL",
    label_video_url: "ভিডিও URL",
    label_published: "পাবলিশড",
    btn_save_video: "ভিডিও সেভ করুন",
    btn_update_video: "ভিডিও আপডেট করুন",
    btn_cancel_edit: "এডিট বাতিল",
    ph_category: "লার্নিং, ম্যাথ, স্টোরি ইত্যাদি",
    ph_duration: "২:৩০",
    ph_thumbnail_url: "https://...",
    ph_video_url: "https://...",

    library_title: "ভিডিও লাইব্রেরি",
    ph_search_videos: "ভিডিও খুঁজুন...",

    status_signin_to_manage: "ভিডিও লাইব্রেরি ম্যানেজ করতে সাইন ইন করুন।",
    status_signin_to_load: "সিএমএস ভিডিও লাইব্রেরি লোড করতে সাইন ইন করুন।",
    status_session_expired: "সেশন শেষ হয়েছে। আবার সাইন ইন করুন।",
    status_email_password_required: "ইমেইল এবং পাসওয়ার্ড প্রয়োজন।",
    status_login_failed: "লগইন ব্যর্থ হয়েছে।",
    status_invalid_email_password: "ইমেইল বা পাসওয়ার্ড ভুল।",
    status_not_admin_account: "এই অ্যাকাউন্টটি অ্যাডমিন অ্যাকাউন্ট নয়।",
    status_logged_out: "লগআউট হয়েছে।",
    status_authenticated: "অথেন্টিকেটেড।",
    status_logged_in: "লগইন করা হয়েছে।",
    status_logged_in_as: "লগইন: {name} ({email})",
    status_could_not_validate_session: "অ্যাডমিন সেশন যাচাই করা যায়নি।",
    status_current_not_admin: "বর্তমান অ্যাকাউন্টটি অ্যাডমিন নয়।",
    status_loading_videos: "ভিডিও লোড হচ্ছে...",
    status_could_not_load_videos: "ভিডিও লোড করা যায়নি।",
    status_could_not_save_video: "ভিডিও সেভ করা যায়নি।",
    status_video_created: "ভিডিও তৈরি হয়েছে।",
    status_video_updated: "ভিডিও আপডেট হয়েছে।",
    status_video_deleted: "ভিডিও ডিলিট হয়েছে।",
    status_delete_failed: "ডিলিট ব্যর্থ হয়েছে।",
    status_update_failed: "আপডেট ব্যর্থ হয়েছে।",
    status_no_videos_match: "এই সার্চে কোনো ভিডিও মেলেনি।",
    status_no_videos: "এখনো কোনো ভিডিও নেই। প্রথম ভিডিও যোগ করুন।",
    status_signin_first_admin: "আগে অ্যাডমিন হিসেবে সাইন ইন করুন।",

    label_general: "সাধারণ",
    label_age: "বয়স {age}",
    label_all: "সব",
    label_short: "ছোট",
    label_published_badge: "পাবলিশড",
    label_draft_badge: "ড্রাফট",
    link_preview_video: "ভিডিও লিংক প্রিভিউ",
    btn_edit: "এডিট",
    btn_publish: "পাবলিশ",
    btn_unpublish: "আনপাবলিশ",
    btn_delete: "ডিলিট",
    confirm_delete_video: "এই ভিডিওটি ডিলিট করবেন?"
  }
};

const API_MESSAGE_KEY_MAP = {
  "Invalid email or password.": "status_invalid_email_password",
  "This account is not an admin account.": "status_not_admin_account",
  "Could not validate admin session.": "status_could_not_validate_session",
  "Current account is not an admin.": "status_current_not_admin",
  "Could not load videos.": "status_could_not_load_videos",
  "Could not save video.": "status_could_not_save_video",
  "Delete failed.": "status_delete_failed",
  "Update failed.": "status_update_failed",
  "Unauthorized. Missing bearer token.": "status_signin_first_admin",
  "Unauthorized. Invalid or expired session.": "status_session_expired",
  "Unauthorized. User not found.": "status_session_expired",
  "Forbidden. Insufficient role.": "status_not_admin_account"
};

const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authLoginBtn = document.getElementById("auth-login-btn");
const authLogoutBtn = document.getElementById("auth-logout-btn");
const authStatus = document.getElementById("auth-status");
const authUser = document.getElementById("auth-user");
const navParentsLink = document.getElementById("nav-parents");
const navEducatorsLink = document.getElementById("nav-educators");
const navAdminLink = document.getElementById("nav-admin");
const langEnButton = document.getElementById("lang-en");
const langBnButton = document.getElementById("lang-bn");

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
  searchQuery: "",
  lang: "en"
};

authEmail.value = localStorage.getItem("xerivo_admin_email") || "";

const host = window.location.hostname.toLowerCase();

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
    const endpoint = isEditing ? `/api/admin/videos/${state.editingId}` : "/api/admin/videos";
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
      throw new Error(localizeApiMessage(data.error, "status_could_not_save_video"));
    }

    formStatus.textContent = isEditing ? t("status_video_updated") : t("status_video_created");
    resetForm();
    await loadVideos();
  } catch (error) {
    formStatus.textContent = localizeApiMessage(error.message, "status_could_not_save_video");
  }
});

cancelBtn.addEventListener("click", () => {
  resetForm();
});

if (langEnButton) {
  langEnButton.addEventListener("click", () => applyLanguage("en"));
}
if (langBnButton) {
  langBnButton.addEventListener("click", () => applyLanguage("bn"));
}

applyLanguage(loadLanguagePreference(), { persist: false });
bootstrap();

async function bootstrap() {
  setCmsEnabled(false);
  if (!state.token) {
    showLoggedOut(t("status_signin_to_manage"));
    return;
  }

  try {
    await refreshAdminSession();
    await loadVideos();
  } catch (error) {
    clearSession();
    showLoggedOut(localizeApiMessage(error.message, "status_session_expired"));
  }
}

async function loginAdmin() {
  authStatus.textContent = "";
  const email = authEmail.value.trim().toLowerCase();
  const password = authPassword.value;
  if (!email || !password) {
    authStatus.textContent = t("status_email_password_required");
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
      throw new Error(localizeApiMessage(data.error, "status_login_failed"));
    }

    if (!data.user || data.user.role !== "admin") {
      throw new Error(t("status_not_admin_account"));
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
    showLoggedOut(localizeApiMessage(error.message, "status_login_failed"));
  }
}

function logoutAdmin() {
  clearSession();
  resetForm();
  showLoggedOut(t("status_logged_out"));
}

async function refreshAdminSession() {
  assertAuthenticated();
  const response = await adminFetch("/api/admin/me", { method: "GET" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(localizeApiMessage(data.error, "status_could_not_validate_session"));
  }

  state.user = data.user;
  if (!state.user || state.user.role !== "admin") {
    throw new Error(t("status_current_not_admin"));
  }

  authEmail.value = state.user.email || "";
  showLoggedIn();
}

async function loadVideos() {
  videoList.innerHTML = `<p>${escapeHtml(t("status_loading_videos"))}</p>`;

  if (!state.token) {
    state.videos = [];
    updateStats();
    videoList.innerHTML = `<p>${escapeHtml(t("status_signin_to_load"))}</p>`;
    return;
  }

  try {
    const response = await adminFetch("/api/admin/videos", { method: "GET" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(localizeApiMessage(data.error, "status_could_not_load_videos"));
    }

    state.videos = Array.isArray(data) ? data : [];
    updateStats();
    renderList();
  } catch (error) {
    state.videos = [];
    updateStats();
    videoList.innerHTML = `<p>${escapeHtml(localizeApiMessage(error.message, "status_could_not_load_videos"))}</p>`;
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
    const text = `${video.title} ${video.description} ${video.category} ${video.ageGroup}`.toLowerCase();
    return text.includes(state.searchQuery);
  });

  if (filtered.length === 0) {
    videoList.innerHTML = state.videos.length
      ? `<p>${escapeHtml(t("status_no_videos_match"))}</p>`
      : `<p>${escapeHtml(t("status_no_videos"))}</p>`;
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
            <span class="badge">${escapeHtml(video.category || t("label_general"))}</span>
            <span class="badge">${escapeHtml(t("label_age", { age: video.ageGroup || t("label_all") }))}</span>
            <span class="badge">${escapeHtml(video.duration || t("label_short"))}</span>
            <span class="badge ${video.isPublished ? "live" : "draft"}">
              ${video.isPublished ? escapeHtml(t("label_published_badge")) : escapeHtml(t("label_draft_badge"))}
            </span>
          </p>
          <p>${escapeHtml(video.description || "")}</p>
          <a class="video-link" href="${escapeHtml(video.videoUrl || "#")}" target="_blank" rel="noreferrer">
            ${escapeHtml(t("link_preview_video"))}
          </a>
        </div>
        <div class="video-actions">
          <button type="button" data-action="edit" data-id="${video.id}">${escapeHtml(t("btn_edit"))}</button>
          <button type="button" class="toggle" data-action="toggle" data-id="${video.id}">
            ${video.isPublished ? escapeHtml(t("btn_unpublish")) : escapeHtml(t("btn_publish"))}
          </button>
          <button class="danger" type="button" data-action="delete" data-id="${video.id}">
            ${escapeHtml(t("btn_delete"))}
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
    if (!window.confirm(t("confirm_delete_video"))) {
      return;
    }
    try {
      assertAuthenticated();
      const response = await adminFetch(`/api/admin/videos/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(localizeApiMessage(data.error, "status_delete_failed"));
      }

      formStatus.textContent = t("status_video_deleted");
      await loadVideos();
    } catch (error) {
      formStatus.textContent = localizeApiMessage(error.message, "status_delete_failed");
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
      throw new Error(localizeApiMessage(data.error, "status_update_failed"));
    }

    formStatus.textContent = t("status_video_updated");
    await loadVideos();
  } catch (error) {
    formStatus.textContent = localizeApiMessage(error.message, "status_update_failed");
  }
}

function beginEdit(video) {
  state.editingId = video.id;
  formTitle.textContent = t("form_edit_title");
  saveBtn.textContent = t("btn_update_video");
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
  formTitle.textContent = t("form_add_title");
  saveBtn.textContent = t("btn_save_video");
  cancelBtn.classList.add("hidden");
  videoForm.reset();
  fields.isPublished.checked = true;
}

function showLoggedIn() {
  setCmsEnabled(true);
  authStatus.textContent = t("status_authenticated");
  authUser.textContent = state.user
    ? t("status_logged_in_as", { name: state.user.name || "Admin", email: state.user.email || "" })
    : t("status_logged_in");
  authLogoutBtn.classList.remove("hidden");
}

function showLoggedOut(message) {
  setCmsEnabled(false);
  authStatus.textContent = message || "";
  authUser.textContent = "";
  authLogoutBtn.classList.add("hidden");
  state.videos = [];
  updateStats();
  videoList.innerHTML = `<p>${escapeHtml(t("status_signin_to_load"))}</p>`;
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
    throw new Error(t("status_signin_first_admin"));
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
    showLoggedOut(t("status_session_expired"));
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

function interpolate(template, values = {}) {
  return Object.entries(values).reduce(
    (output, [key, value]) => output.replaceAll(`{${key}}`, String(value)),
    template
  );
}

function t(key, values = {}) {
  const current = TRANSLATIONS[state.lang] || TRANSLATIONS.en;
  const source = current[key] || TRANSLATIONS.en[key] || key;
  return interpolate(source, values);
}

function localizeApiMessage(message, fallbackKey = "") {
  const raw = typeof message === "string" ? message.trim() : "";
  if (!raw) {
    return fallbackKey ? t(fallbackKey) : "";
  }

  const mappedKey = API_MESSAGE_KEY_MAP[raw];
  if (mappedKey) {
    return t(mappedKey);
  }

  if (state.lang === "bn" && fallbackKey) {
    return t(fallbackKey);
  }

  return raw;
}

function getLanguageFromQuery() {
  const value = (new URLSearchParams(window.location.search).get(LANGUAGE_QUERY_KEY) || "").toLowerCase();
  return SUPPORTED_LANGUAGES.has(value) ? value : "";
}

function loadLanguagePreference() {
  const queryLang = getLanguageFromQuery();
  if (queryLang) {
    return queryLang;
  }

  try {
    const value =
      localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY) || "en";
    return SUPPORTED_LANGUAGES.has(value) ? value : "en";
  } catch {
    return "en";
  }
}

function saveLanguagePreference(lang) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    localStorage.setItem(LEGACY_LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // Ignore persistence failures.
  }
}

function setLanguageInUrl(lang) {
  const url = new URL(window.location.href);
  url.searchParams.set(LANGUAGE_QUERY_KEY, lang);
  const suffix = url.search ? url.search : "";
  window.history.replaceState({}, "", `${url.pathname}${suffix}`);
}

function withLanguageParam(url, lang) {
  try {
    const resolved = new URL(url, window.location.origin);
    resolved.searchParams.set(LANGUAGE_QUERY_KEY, lang);
    return resolved.toString();
  } catch {
    return url;
  }
}

function setActiveLanguageButton(lang) {
  if (langEnButton) {
    langEnButton.classList.toggle("active", lang === "en");
  }
  if (langBnButton) {
    langBnButton.classList.toggle("active", lang === "bn");
  }
}

function applyLanguage(lang, options = {}) {
  const targetLang = SUPPORTED_LANGUAGES.has(lang) ? lang : "en";
  state.lang = targetLang;
  document.documentElement.lang = targetLang;
  document.title = t("document_title");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (!key) {
      return;
    }
    node.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    if (!key) {
      return;
    }
    node.setAttribute("placeholder", t(key));
  });

  if (options.persist !== false) {
    saveLanguagePreference(targetLang);
  }
  if (options.updateUrl !== false) {
    setLanguageInUrl(targetLang);
  }

  setActiveLanguageButton(targetLang);
  configurePortalLinks(targetLang);

  if (state.editingId) {
    formTitle.textContent = t("form_edit_title");
    saveBtn.textContent = t("btn_update_video");
  } else {
    formTitle.textContent = t("form_add_title");
    saveBtn.textContent = t("btn_save_video");
  }

  renderList();

  if (!state.user && !state.token && !authStatus.textContent) {
    authStatus.textContent = t("status_signin_to_manage");
  }
}

function configurePortalLinks(lang = state.lang) {
  if (!navParentsLink || !navEducatorsLink || !navAdminLink) {
    return;
  }

  const onCustomSubdomain =
    host === "admin.xerivolearn.com" || host === "app.xerivolearn.com" || host === "educator.xerivolearn.com";

  if (onCustomSubdomain) {
    navParentsLink.href = withLanguageParam("https://app.xerivolearn.com/", lang);
    navEducatorsLink.href = withLanguageParam("https://educator.xerivolearn.com/", lang);
    navAdminLink.href = withLanguageParam("https://admin.xerivolearn.com/", lang);
    return;
  }

  navParentsLink.href = withLanguageParam("/app/", lang);
  navEducatorsLink.href = withLanguageParam("/educator/", lang);
  navAdminLink.href = withLanguageParam("/admin/", lang);
}
