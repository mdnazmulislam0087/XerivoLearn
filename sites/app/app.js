const AVATARS = [
  { key: "rocket", label: "Rocket", src: "./assets/avatars/rocket.svg" },
  { key: "star", label: "Star", src: "./assets/avatars/star.svg" },
  { key: "whale", label: "Whale", src: "./assets/avatars/whale.svg" },
  { key: "panda", label: "Panda", src: "./assets/avatars/panda.svg" },
  { key: "owl", label: "Owl", src: "./assets/avatars/owl.svg" },
  { key: "fox", label: "Fox", src: "./assets/avatars/fox.svg" }
];

const LANGUAGE_STORAGE_KEY = "xerivo_lang";
const LEGACY_LANGUAGE_STORAGE_KEY = "xerivo_app_lang";
const LANGUAGE_QUERY_KEY = "lang";
const WATCH_ANALYTICS_STORAGE_KEY = "xerivo_watch_analytics";
const SUPPORTED_LANGUAGES = new Set(["en", "bn"]);

const TRANSLATIONS = {
  en: {
    page_title: "XerivoLearn App | Kids Video Library",
    hero_eyebrow: "Kids Video Library",
    hero_title: "Find your child's next favorite learning adventure.",
    hero_text:
      "Play stories, songs, and skill-building cartoons in one clean library designed for children and easy for parents to supervise.",
    trust_title: "Parent Friendly",
    trust_1: "Age-focused filtering",
    trust_2: "Simple category browsing",
    trust_3: "Fast access to safe learning content",
    parent_account_title: "Parent Account",
    auth_status_default: "Parents plan: BDT 99/month. Sign in to watch videos and save favorites.",
    login_title: "Sign In",
    register_title: "Create Parent Account",
    reset_title: "Reset Password",
    btn_sign_in: "Sign In",
    btn_forgot_password: "Forgot password?",
    btn_create_account: "Create Account",
    btn_update_password: "Update Password",
    btn_logout: "Logout",
    child_profiles_title: "Child Profiles",
    child_status_signed_out: "Sign in to create child profiles.",
    btn_save_child: "Save Child",
    btn_update_child: "Update Child",
    btn_cancel_edit: "Cancel Edit",
    ph_email: "Email",
    ph_password: "Password",
    ph_full_name: "Full name",
    ph_password_min8: "Password (min 8 chars)",
    ph_reset_token: "Reset token",
    ph_new_password_min8: "New password (min 8 chars)",
    ph_child_name: "Child name",
    ph_search: "Search title or topic...",
    age_all: "All ages",
    favorites_only: "Favorites only",
    favorites_showing: "Showing favorites",
    status_signin_parent_favorites: "Sign in as a parent to save favorites.",
    error_email_password_required: "Email and password are required.",
    error_login_failed: "Login failed.",
    error_portal_parent_only:
      "This portal is for parent accounts only. Educators should use the Educator portal.",
    error_name_email_password_required: "Name, email, and password are required.",
    error_registration_failed: "Registration failed.",
    error_parent_only_create: "Only parent accounts can be created from this app.",
    error_enter_email_first: "Enter your email in Sign In first.",
    error_request_reset_failed: "Could not request password reset.",
    reset_sent: "Reset instructions sent.",
    reset_debug_token_filled: "Debug token auto-filled in Reset Password form.",
    error_token_new_password_required: "Token and new password are required.",
    error_reset_failed: "Password reset failed.",
    reset_success: "Password updated.",
    error_session_validation_failed: "Session validation failed.",
    error_parent_account_required: "Parent account required for this app.",
    error_load_videos: "Could not load videos.",
    error_load_favorites: "Could not load favorites.",
    error_update_favorite: "Could not update favorite.",
    error_load_children: "Could not load child profiles.",
    error_signin_manage_children: "Sign in to manage child profiles.",
    error_child_name_required: "Child name is required.",
    error_save_child: "Could not save child profile.",
    child_updated: "Child profile updated.",
    child_created: "Child profile created.",
    confirm_delete_child: "Delete this child profile?",
    error_delete_child: "Could not delete child profile.",
    child_deleted: "Child profile deleted.",
    child_status_focus_age: "Create profiles and select one to focus age filtering.",
    child_list_signin: "Sign in to create child profiles.",
    child_list_empty: "No child profiles yet. Create your first profile.",
    age_label: "Age {age}",
    active_label: "Active",
    btn_select: "Select",
    btn_edit: "Edit",
    btn_delete: "Delete",
    loading_videos: "Loading videos...",
    empty_parent_login_required: "Parent login required to watch videos.",
    empty_signin_favorites_only: "Sign in to use favorites-only filter.",
    empty_no_favorites: "No favorite videos yet. Save some videos first.",
    empty_no_match: "No videos match your filters yet.",
    result_found: "{count} {label} found{suffix}",
    result_suffix_child: " for {name}",
    video_single: "video",
    video_plural: "videos",
    all_label: "All",
    watch_video: "Watch Video",
    save_video: "Save",
    saved_video: "Saved",
    all_topics: "All topics",
    general_category: "General",
    short_duration: "Short",
    parent_pill: "Parent: {name}",
    signed_in_as: "Signed in as {email}",
    btn_student_profile: "Create Student Profile",
    btn_close: "Close",
    analytics_title: "Student Analytics",
    analytics_subtitle_no_child: "Select a student profile to view watch insights.",
    analytics_subtitle_with_child: "Showing watch insights for {name}.",
    analytics_empty: "No watch history yet for this student.",
    analytics_unique_videos: "Unique Videos",
    analytics_total_views: "Total Views",
    analytics_total_time: "Watch Time",
    analytics_top_topic: "Top Topic",
    analytics_count: "Views: {count}",
    analytics_last: "Last watched: {value}",
    analytics_unassigned: "Unassigned",
    analytics_not_available: "N/A",
    analytics_minutes: "{count} min",
    player_close: "Close",
    player_prev: "Previous",
    player_next: "Next",
    player_open_external: "Open Original Video",
    error_signin_first: "Please sign in first.",
    error_parent_required_signin: "Parent account required. Please sign in with a parent account.",
    error_session_expired: "Session expired. Please sign in again."
  },
  bn: {
    page_title: "XerivoLearn অ্যাপ | শিশুদের ভিডিও লাইব্রেরি",
    hero_eyebrow: "শিশুদের ভিডিও লাইব্রেরি",
    hero_title: "আপনার সন্তানের পরের প্রিয় শেখার অ্যাডভেঞ্চার খুঁজে নিন।",
    hero_text:
      "গল্প, গান ও স্কিল-বিল্ডিং কার্টুন ভিডিও এক জায়গায় দেখুন। শিশুদের জন্য সহজ এবং অভিভাবকদের জন্য নিরাপদ অভিজ্ঞতা।",
    trust_title: "অভিভাবক-বান্ধব",
    trust_1: "বয়সভিত্তিক ফিল্টারিং",
    trust_2: "সহজ ক্যাটাগরি ব্রাউজিং",
    trust_3: "নিরাপদ লার্নিং কনটেন্টে দ্রুত অ্যাক্সেস",
    parent_account_title: "প্যারেন্ট অ্যাকাউন্ট",
    auth_status_default: "প্যারেন্টস প্ল্যান: ৳৯৯/মাস। ভিডিও দেখতে ও ফেভারিটস রাখতে সাইন ইন করুন।",
    login_title: "সাইন ইন",
    register_title: "প্যারেন্ট অ্যাকাউন্ট তৈরি করুন",
    reset_title: "পাসওয়ার্ড রিসেট",
    btn_sign_in: "সাইন ইন",
    btn_forgot_password: "পাসওয়ার্ড ভুলে গেছেন?",
    btn_create_account: "অ্যাকাউন্ট তৈরি করুন",
    btn_update_password: "পাসওয়ার্ড আপডেট করুন",
    btn_logout: "লগআউট",
    btn_student_profile: "স্টুডেন্ট প্রোফাইল",
    btn_close: "বন্ধ করুন",
    child_profiles_title: "চাইল্ড প্রোফাইল",
    analytics_title: "স্টুডেন্ট অ্যানালিটিক্স",
    analytics_subtitle_no_child: "ওয়াচ ইনসাইট দেখতে একটি স্টুডেন্ট প্রোফাইল নির্বাচন করুন।",
    analytics_subtitle_with_child: "{name} এর জন্য ওয়াচ ইনসাইট দেখানো হচ্ছে।",
    analytics_empty: "এই স্টুডেন্টের এখনো কোনো ওয়াচ হিস্টোরি নেই।",
    analytics_unique_videos: "ইউনিক ভিডিও",
    analytics_total_views: "মোট ভিউ",
    analytics_total_time: "ওয়াচ টাইম",
    analytics_top_topic: "টপ টপিক",
    analytics_count: "ভিউ: {count}",
    analytics_last: "শেষ দেখা: {value}",
    analytics_unassigned: "অনির্ধারিত",
    analytics_not_available: "N/A",
    analytics_minutes: "{count} মিনিট",
    player_close: "বন্ধ করুন",
    player_prev: "আগেরটি",
    player_next: "পরেরটি",
    player_open_external: "মূল ভিডিও খুলুন",
    child_status_signed_out: "চাইল্ড প্রোফাইল তৈরি করতে সাইন ইন করুন।",
    btn_save_child: "চাইল্ড সেভ করুন",
    btn_update_child: "চাইল্ড আপডেট করুন",
    btn_cancel_edit: "এডিট বাতিল",
    ph_email: "ইমেইল",
    ph_password: "পাসওয়ার্ড",
    ph_full_name: "পূর্ণ নাম",
    ph_password_min8: "পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)",
    ph_reset_token: "রিসেট টোকেন",
    ph_new_password_min8: "নতুন পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)",
    ph_child_name: "শিশুর নাম",
    ph_search: "শিরোনাম বা টপিক খুঁজুন...",
    age_all: "সব বয়স",
    favorites_only: "শুধু ফেভারিটস",
    favorites_showing: "ফেভারিটস দেখানো হচ্ছে",
    status_signin_parent_favorites: "ফেভারিটস সেভ করতে প্যারেন্ট হিসেবে সাইন ইন করুন।",
    error_email_password_required: "ইমেইল এবং পাসওয়ার্ড প্রয়োজন।",
    error_login_failed: "লগইন ব্যর্থ হয়েছে।",
    error_portal_parent_only:
      "এই পোর্টাল শুধু প্যারেন্ট অ্যাকাউন্টের জন্য। এডুকেটররা Educator পোর্টাল ব্যবহার করুন।",
    error_name_email_password_required: "নাম, ইমেইল এবং পাসওয়ার্ড প্রয়োজন।",
    error_registration_failed: "রেজিস্ট্রেশন ব্যর্থ হয়েছে।",
    error_parent_only_create: "এই অ্যাপ থেকে শুধু প্যারেন্ট অ্যাকাউন্ট তৈরি করা যাবে।",
    error_enter_email_first: "আগে Sign In অংশে আপনার ইমেইল দিন।",
    error_request_reset_failed: "পাসওয়ার্ড রিসেট অনুরোধ করা যায়নি।",
    reset_sent: "রিসেট নির্দেশনা পাঠানো হয়েছে।",
    reset_debug_token_filled: "ডিবাগ টোকেন Reset Password ফর্মে বসানো হয়েছে।",
    error_token_new_password_required: "টোকেন এবং নতুন পাসওয়ার্ড প্রয়োজন।",
    error_reset_failed: "পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।",
    reset_success: "পাসওয়ার্ড আপডেট হয়েছে।",
    error_session_validation_failed: "সেশন যাচাই ব্যর্থ হয়েছে।",
    error_parent_account_required: "এই অ্যাপে প্যারেন্ট অ্যাকাউন্ট প্রয়োজন।",
    error_load_videos: "ভিডিও লোড করা যায়নি।",
    error_load_favorites: "ফেভারিটস লোড করা যায়নি।",
    error_update_favorite: "ফেভারিট আপডেট করা যায়নি।",
    error_load_children: "চাইল্ড প্রোফাইল লোড করা যায়নি।",
    error_signin_manage_children: "চাইল্ড প্রোফাইল ম্যানেজ করতে সাইন ইন করুন।",
    error_child_name_required: "শিশুর নাম প্রয়োজন।",
    error_save_child: "চাইল্ড প্রোফাইল সেভ করা যায়নি।",
    child_updated: "চাইল্ড প্রোফাইল আপডেট হয়েছে।",
    child_created: "চাইল্ড প্রোফাইল তৈরি হয়েছে।",
    confirm_delete_child: "এই চাইল্ড প্রোফাইল ডিলিট করবেন?",
    error_delete_child: "চাইল্ড প্রোফাইল ডিলিট করা যায়নি।",
    child_deleted: "চাইল্ড প্রোফাইল ডিলিট হয়েছে।",
    child_status_focus_age: "প্রোফাইল তৈরি করে একটি নির্বাচন করুন, তাহলে বয়স ফিল্টার দ্রুত কাজ করবে।",
    child_list_signin: "চাইল্ড প্রোফাইল তৈরি করতে সাইন ইন করুন।",
    child_list_empty: "এখনও কোনো চাইল্ড প্রোফাইল নেই। প্রথম প্রোফাইল তৈরি করুন।",
    age_label: "বয়স {age}",
    active_label: "সক্রিয়",
    btn_select: "নির্বাচন",
    btn_edit: "এডিট",
    btn_delete: "ডিলিট",
    loading_videos: "ভিডিও লোড হচ্ছে...",
    empty_parent_login_required: "ভিডিও দেখতে প্যারেন্ট লগইন প্রয়োজন।",
    empty_signin_favorites_only: "শুধু ফেভারিটস ফিল্টার ব্যবহার করতে সাইন ইন করুন।",
    empty_no_favorites: "এখনও কোনো ফেভারিট ভিডিও নেই। আগে কিছু ভিডিও সেভ করুন।",
    empty_no_match: "আপনার ফিল্টারের সাথে মিলে এমন ভিডিও নেই।",
    result_found: "{count}টি {label} পাওয়া গেছে{suffix}",
    result_suffix_child: " ({name} এর জন্য)",
    video_single: "ভিডিও",
    video_plural: "ভিডিও",
    all_label: "সব",
    watch_video: "ভিডিও দেখুন",
    save_video: "সেভ",
    saved_video: "সেভড",
    all_topics: "সব টপিক",
    general_category: "সাধারণ",
    short_duration: "ছোট",
    parent_pill: "প্যারেন্ট: {name}",
    signed_in_as: "{email} হিসাবে সাইন ইন করা আছে",
    error_signin_first: "আগে সাইন ইন করুন।",
    error_parent_required_signin: "প্যারেন্ট অ্যাকাউন্ট প্রয়োজন। প্যারেন্ট হিসেবে সাইন ইন করুন।",
    error_session_expired: "সেশন শেষ হয়েছে। আবার সাইন ইন করুন।"
  }
};

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
  selectedAvatar: "rocket",
  lang: "en",
  studentPanelOpen: false,
  player: {
    isOpen: false,
    queue: [],
    index: -1
  }
};

const grid = document.getElementById("videos-grid");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const ageFilter = document.getElementById("age-filter");
const categoryChips = document.getElementById("category-chips");
const resultCount = document.getElementById("result-count");
const brandLink = document.getElementById("brand-link");
const favoritesOnlyBtn = document.getElementById("favorites-only-btn");
const parentPill = document.getElementById("parent-pill");
const authStatusLine = document.getElementById("auth-status-line");
const langEnButton = document.getElementById("lang-en");
const langBnButton = document.getElementById("lang-bn");
const heroPanel = document.getElementById("hero-panel");
const parentAuthSection = document.getElementById("parent-auth-section");
const studentProfileBtn = document.getElementById("student-profile-btn");
const logoutTopBtn = document.getElementById("logout-top-btn");
const studentPanel = document.getElementById("student-panel");
const studentPanelClose = document.getElementById("student-panel-close");
const analyticsSubtitle = document.getElementById("analytics-subtitle");
const analyticsSummary = document.getElementById("analytics-summary");
const analyticsList = document.getElementById("analytics-list");
const playerModal = document.getElementById("player-modal");
const playerBackdrop = document.getElementById("player-backdrop");
const playerShell = playerModal ? playerModal.querySelector(".player-shell") : null;
const playerStage = document.getElementById("player-stage");
const playerTitle = document.getElementById("player-title");
const playerCloseBtn = document.getElementById("player-close-btn");
const playerPrevBtn = document.getElementById("player-prev-btn");
const playerNextBtn = document.getElementById("player-next-btn");
const playerExternalLink = document.getElementById("player-external-link");

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

const playerSwipeState = {
  startX: 0,
  startY: 0,
  isTracking: false
};

function getLanguageFromQuery() {
  const value = (new URLSearchParams(window.location.search).get(LANGUAGE_QUERY_KEY) || "").toLowerCase();
  return SUPPORTED_LANGUAGES.has(value) ? value : "";
}

const host = window.location.hostname.toLowerCase();
const isProdAppDomain = host === "app.xerivolearn.com";
if (!isProdAppDomain) {
  if (brandLink) {
    brandLink.href = "/";
  }
}

function loadLanguagePreference() {
  const fromQuery = getLanguageFromQuery();
  if (fromQuery) {
    return fromQuery;
  }

  try {
    const value =
      localStorage.getItem(LANGUAGE_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY) ||
      "en";
    return SUPPORTED_LANGUAGES.has(value) ? value : "en";
  } catch {
    return "en";
  }
}

function saveLanguagePreference(lang) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    localStorage.setItem(LEGACY_LANGUAGE_STORAGE_KEY, lang);
  } catch {}
}

function setLanguageInUrl(lang) {
  const url = new URL(window.location.href);
  url.searchParams.set(LANGUAGE_QUERY_KEY, lang);
  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) {
    window.history.replaceState({}, "", next);
  }
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

function updateLanguageAwareLinks(lang) {
  if (!brandLink) {
    return;
  }
  const homeUrl = isProdAppDomain ? "https://xerivolearn.com" : "/";
  brandLink.href = withLanguageParam(homeUrl, lang);
}

function interpolate(template, values) {
  return Object.entries(values || {}).reduce(
    (output, [key, value]) => output.replaceAll(`{${key}}`, String(value)),
    template
  );
}

function t(key, values = {}) {
  const current = TRANSLATIONS[state.lang] || TRANSLATIONS.en;
  const source = current[key] || TRANSLATIONS.en[key] || key;
  return interpolate(source, values);
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
  document.title = t("page_title");

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

  setActiveLanguageButton(targetLang);

  if (options.persist !== false) {
    saveLanguagePreference(targetLang);
  }
  if (options.updateUrl !== false) {
    setLanguageInUrl(targetLang);
  }
  updateLanguageAwareLinks(targetLang);

  updateFavoritesToggle();
  updateAuthUi();
  renderCategoryChips();
  renderStudentAnalytics();
  renderPlayer();
  render();
}

if (langEnButton) {
  langEnButton.addEventListener("click", () => applyLanguage("en"));
}
if (langBnButton) {
  langBnButton.addEventListener("click", () => applyLanguage("bn"));
}
applyLanguage(loadLanguagePreference(), { persist: false });

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
  const watchTrigger = event.target.closest("[data-watch-id]");
  if (watchTrigger) {
    const watchId = watchTrigger.dataset.watchId;
    if (watchId) {
      event.preventDefault();
      openVideoPlayer(watchId);
      recordVideoWatch(watchId);
      return;
    }
  }

  const favoriteBtn = event.target.closest("button[data-fav-id]");
  if (!favoriteBtn) {
    return;
  }

  const videoId = favoriteBtn.dataset.favId;
  if (!videoId) {
    return;
  }

  if (!state.token || !state.user || state.user.role !== "parent") {
    authStatusLine.textContent = t("status_signin_parent_favorites");
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

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearSession();
    updateAuthUi();
    render();
  });
}

if (logoutTopBtn) {
  logoutTopBtn.addEventListener("click", () => {
    clearSession();
    updateAuthUi();
    render();
  });
}

if (studentProfileBtn) {
  studentProfileBtn.addEventListener("click", () => {
    toggleStudentPanel();
  });
}

if (studentPanelClose) {
  studentPanelClose.addEventListener("click", () => {
    toggleStudentPanel(false);
  });
}

if (playerCloseBtn) {
  playerCloseBtn.addEventListener("click", () => {
    closeVideoPlayer();
  });
}

if (playerBackdrop) {
  playerBackdrop.addEventListener("click", () => {
    closeVideoPlayer();
  });
}

if (playerPrevBtn) {
  playerPrevBtn.addEventListener("click", () => {
    stepPlayer(-1);
  });
}

if (playerNextBtn) {
  playerNextBtn.addEventListener("click", () => {
    stepPlayer(1);
  });
}

document.addEventListener("keydown", (event) => {
  if (!state.player.isOpen) {
    return;
  }
  if (event.key === "Escape") {
    closeVideoPlayer();
    return;
  }
  if (event.key === "ArrowLeft") {
    stepPlayer(-1);
    return;
  }
  if (event.key === "ArrowRight") {
    stepPlayer(1);
  }
});

if (playerShell) {
  playerShell.addEventListener(
    "touchstart",
    (event) => {
      if (!state.player.isOpen || !event.touches || event.touches.length !== 1) {
        playerSwipeState.isTracking = false;
        return;
      }
      playerSwipeState.isTracking = true;
      playerSwipeState.startX = event.touches[0].clientX;
      playerSwipeState.startY = event.touches[0].clientY;
    },
    { passive: true }
  );

  playerShell.addEventListener(
    "touchend",
    (event) => {
      if (!state.player.isOpen || !playerSwipeState.isTracking || !event.changedTouches || !event.changedTouches.length) {
        return;
      }
      const endX = event.changedTouches[0].clientX;
      const endY = event.changedTouches[0].clientY;
      const dx = endX - playerSwipeState.startX;
      const dy = endY - playerSwipeState.startY;
      playerSwipeState.isTracking = false;

      if (Math.abs(dx) < 38 || Math.abs(dx) < Math.abs(dy)) {
        return;
      }
      if (dx < 0) {
        stepPlayer(1);
      } else {
        stepPlayer(-1);
      }
    },
    { passive: true }
  );
}

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
  renderStudentAnalytics();
  render();

  if (!state.token) {
    return;
  }

  try {
    await refreshSession();
    await Promise.all([loadVideos(), loadFavorites(), loadChildren()]);
    updateAuthUi();
    renderStudentAnalytics();
    render();
  } catch {
    clearSession();
    updateAuthUi();
    renderStudentAnalytics();
    render();
  }
}

function toggleStudentPanel(forceOpen) {
  const loggedIn = Boolean(state.user && state.user.role === "parent");
  const targetOpen = typeof forceOpen === "boolean" ? forceOpen : !state.studentPanelOpen;
  state.studentPanelOpen = loggedIn && targetOpen;

  if (studentPanel) {
    studentPanel.classList.toggle("hidden", !state.studentPanelOpen);
  }
  if (studentProfileBtn) {
    studentProfileBtn.classList.toggle("active", state.studentPanelOpen);
  }

  if (state.studentPanelOpen && studentPanel) {
    renderStudentAnalytics();
    studentPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function getParentAnalyticsKey() {
  if (!state.user) {
    return "";
  }
  return String(state.user.id || state.user.email || "");
}

function loadWatchAnalyticsStore() {
  try {
    const raw = localStorage.getItem(WATCH_ANALYTICS_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

function saveWatchAnalyticsStore(store) {
  try {
    localStorage.setItem(WATCH_ANALYTICS_STORAGE_KEY, JSON.stringify(store));
  } catch {}
}

function durationToSeconds(duration) {
  if (!duration && duration !== 0) {
    return 0;
  }
  const value = String(duration).trim();
  if (!value) {
    return 0;
  }

  if (/^\d+:\d{1,2}(:\d{1,2})?$/.test(value)) {
    const parts = value.split(":").map((part) => Number.parseInt(part, 10));
    if (parts.some((part) => Number.isNaN(part))) {
      return 0;
    }
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return parts[0] * 60 + parts[1];
  }

  if (/^\d+(\.\d+)?$/.test(value)) {
    return Math.max(0, Math.round(Number.parseFloat(value) * 60));
  }

  return 0;
}

function formatWatchTime(seconds) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const roundedMinutes = Math.round(safeSeconds / 60);
  return t("analytics_minutes", { count: roundedMinutes });
}

function formatWatchDate(value) {
  if (!value) {
    return t("analytics_not_available");
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return t("analytics_not_available");
  }
  return parsed.toLocaleDateString(state.lang === "bn" ? "bn-BD" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function getAnalyticsForSelectedChild() {
  const parentKey = getParentAnalyticsKey();
  if (!parentKey) {
    return [];
  }

  const selectedChild = getSelectedChild();
  const childKey = selectedChild ? selectedChild.id : "__unassigned__";
  const store = loadWatchAnalyticsStore();
  const parentBucket = store[parentKey] || {};
  const childBucket = parentBucket[childKey] || {};
  return Object.values(childBucket).sort((a, b) => {
    const byCount = Number(b.count || 0) - Number(a.count || 0);
    if (byCount !== 0) {
      return byCount;
    }
    return new Date(b.lastWatchedAt || 0).getTime() - new Date(a.lastWatchedAt || 0).getTime();
  });
}

function recordVideoWatch(videoId) {
  if (!state.user || state.user.role !== "parent") {
    return;
  }
  const video = state.videos.find((item) => item.id === videoId);
  if (!video) {
    return;
  }

  const parentKey = getParentAnalyticsKey();
  if (!parentKey) {
    return;
  }

  const selectedChild = getSelectedChild();
  const childKey = selectedChild ? selectedChild.id : "__unassigned__";
  const store = loadWatchAnalyticsStore();
  const parentBucket = store[parentKey] || {};
  const childBucket = parentBucket[childKey] || {};
  const current = childBucket[videoId] || {
    id: video.id,
    title: video.title || "",
    category: video.category || t("analytics_not_available"),
    count: 0,
    totalSeconds: 0,
    lastWatchedAt: ""
  };

  current.count = Number(current.count || 0) + 1;
  current.totalSeconds = Number(current.totalSeconds || 0) + durationToSeconds(video.duration);
  current.lastWatchedAt = new Date().toISOString();
  current.title = video.title || current.title;
  current.category = video.category || current.category;

  childBucket[videoId] = current;
  parentBucket[childKey] = childBucket;
  store[parentKey] = parentBucket;
  saveWatchAnalyticsStore(store);
  renderStudentAnalytics();
}

function renderStudentAnalytics() {
  if (!analyticsSummary || !analyticsList || !analyticsSubtitle) {
    return;
  }

  if (!state.user || state.user.role !== "parent") {
    analyticsSubtitle.textContent = t("analytics_subtitle_no_child");
    analyticsSummary.innerHTML = "";
    analyticsList.innerHTML = "";
    return;
  }

  const selectedChild = getSelectedChild();
  const childName = selectedChild ? selectedChild.name : t("analytics_unassigned");
  analyticsSubtitle.textContent = selectedChild
    ? t("analytics_subtitle_with_child", { name: childName })
    : t("analytics_subtitle_no_child");

  const entries = getAnalyticsForSelectedChild();
  const totalViews = entries.reduce((sum, item) => sum + Number(item.count || 0), 0);
  const totalSeconds = entries.reduce((sum, item) => sum + Number(item.totalSeconds || 0), 0);
  const uniqueVideos = entries.length;

  const topicCounter = {};
  entries.forEach((item) => {
    const topic = (item.category || "").trim() || t("analytics_not_available");
    topicCounter[topic] = (topicCounter[topic] || 0) + Number(item.count || 0);
  });
  const topTopic = Object.entries(topicCounter).sort((a, b) => b[1] - a[1])[0]?.[0] || t("analytics_not_available");

  analyticsSummary.innerHTML = `
    <article class="analytics-card">
      <p class="analytics-label">${escapeHtml(t("analytics_unique_videos"))}</p>
      <p class="analytics-value">${escapeHtml(uniqueVideos)}</p>
    </article>
    <article class="analytics-card">
      <p class="analytics-label">${escapeHtml(t("analytics_total_views"))}</p>
      <p class="analytics-value">${escapeHtml(totalViews)}</p>
    </article>
    <article class="analytics-card">
      <p class="analytics-label">${escapeHtml(t("analytics_total_time"))}</p>
      <p class="analytics-value">${escapeHtml(formatWatchTime(totalSeconds))}</p>
    </article>
    <article class="analytics-card">
      <p class="analytics-label">${escapeHtml(t("analytics_top_topic"))}</p>
      <p class="analytics-value">${escapeHtml(topTopic)}</p>
    </article>
  `;

  if (entries.length === 0) {
    analyticsList.innerHTML = `<p class="mini-status">${escapeHtml(t("analytics_empty"))}</p>`;
    return;
  }

  analyticsList.innerHTML = entries
    .map((item) => {
      return `
        <article class="analytics-row">
          <p class="analytics-video">${escapeHtml(item.title || t("analytics_not_available"))}</p>
          <p class="analytics-meta">${escapeHtml(t("analytics_count", { count: item.count || 0 }))}</p>
          <p class="analytics-meta">${escapeHtml(formatWatchTime(item.totalSeconds || 0))}</p>
          <p class="analytics-meta">${escapeHtml(t("analytics_last", { value: formatWatchDate(item.lastWatchedAt) }))}</p>
        </article>
      `;
    })
    .join("");
}

function getFilteredVideos() {
  return state.videos.filter((video) => {
    const ageMatch = !state.age || video.ageGroup === state.age;
    const categoryMatch =
      !state.category || (video.category || "").toLowerCase() === state.category.toLowerCase();
    const text = `${video.title} ${video.description}`.toLowerCase();
    const searchMatch = !state.search || text.includes(state.search);
    const favoriteMatch = !state.favoritesOnly || state.favoriteIds.has(video.id);
    return ageMatch && categoryMatch && searchMatch && favoriteMatch;
  });
}

function isDirectVideoUrl(url) {
  if (!url) {
    return false;
  }
  const clean = String(url).toLowerCase().split("?")[0];
  return [".mp4", ".webm", ".m3u8", ".ogg", ".mov"].some((suffix) => clean.endsWith(suffix));
}

function extractYouTubeId(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (host === "youtu.be") {
      return parsed.pathname.replaceAll("/", "") || "";
    }
    if (host.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v") || "";
      }
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2] || "";
      }
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/")[2] || "";
      }
    }
    return "";
  } catch {
    return "";
  }
}

function toYouTubeEmbedUrl(url) {
  const id = extractYouTubeId(url);
  if (!id) {
    return "";
  }
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
    id
  )}?rel=0&modestbranding=1&playsinline=1&autoplay=1`;
}

function getPlayerQueue(video) {
  if (!video) {
    return [];
  }
  const category = (video.category || "").trim().toLowerCase();
  if (!category) {
    return state.videos.slice();
  }
  const sameCategory = state.videos.filter(
    (item) => (item.category || "").trim().toLowerCase() === category
  );
  return sameCategory.length ? sameCategory : [video];
}

function getCurrentPlayerVideo() {
  if (!state.player.isOpen || state.player.index < 0) {
    return null;
  }
  return state.player.queue[state.player.index] || null;
}

function openVideoPlayer(videoId) {
  if (!state.user || state.user.role !== "parent") {
    return;
  }
  const video = state.videos.find((item) => item.id === videoId);
  if (!video) {
    return;
  }
  const queue = getPlayerQueue(video);
  const index = queue.findIndex((item) => item.id === video.id);
  state.player.isOpen = true;
  state.player.queue = queue;
  state.player.index = index >= 0 ? index : 0;
  renderPlayer();
}

function closeVideoPlayer() {
  state.player.isOpen = false;
  state.player.queue = [];
  state.player.index = -1;
  renderPlayer();
}

function stepPlayer(direction) {
  if (!state.player.isOpen || !state.player.queue.length) {
    return;
  }
  const total = state.player.queue.length;
  if (total < 2) {
    return;
  }
  state.player.index = (state.player.index + direction + total) % total;
  const video = getCurrentPlayerVideo();
  if (video) {
    recordVideoWatch(video.id);
  }
  renderPlayer();
}

function renderPlayer() {
  if (!playerModal || !playerStage || !playerTitle || !playerExternalLink || !playerPrevBtn || !playerNextBtn) {
    return;
  }

  if (!state.player.isOpen) {
    playerModal.classList.add("hidden");
    playerModal.setAttribute("aria-hidden", "true");
    playerStage.innerHTML = "";
    playerTitle.textContent = "";
    playerExternalLink.href = "#";
    playerPrevBtn.disabled = true;
    playerNextBtn.disabled = true;
    return;
  }

  const video = getCurrentPlayerVideo();
  if (!video) {
    closeVideoPlayer();
    return;
  }

  const category = video.category || t("general_category");
  playerTitle.textContent = `${video.title} - ${category}`;
  playerExternalLink.href = video.videoUrl || "#";

  const ytEmbed = toYouTubeEmbedUrl(video.videoUrl);
  if (ytEmbed) {
    playerStage.innerHTML = `
      <iframe
        src="${escapeHtml(ytEmbed)}"
        title="${escapeHtml(video.title)}"
        loading="eager"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
      ></iframe>
    `;
  } else if (isDirectVideoUrl(video.videoUrl)) {
    playerStage.innerHTML = `
      <video controls playsinline preload="metadata" src="${escapeHtml(video.videoUrl)}"></video>
    `;
  } else {
    playerStage.innerHTML = `
      <iframe
        src="${escapeHtml(video.videoUrl)}"
        title="${escapeHtml(video.title)}"
        loading="eager"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
      ></iframe>
    `;
  }

  const hasNav = state.player.queue.length > 1;
  playerPrevBtn.disabled = !hasNav;
  playerNextBtn.disabled = !hasNav;
  playerModal.classList.remove("hidden");
  playerModal.setAttribute("aria-hidden", "false");
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
      throw new Error(data.error || t("error_load_videos"));
    }
    state.videos = Array.isArray(data) ? data : [];
    renderCategoryChips();
  } catch (error) {
    state.videos = [];
    renderCategoryChips();
    authStatusLine.textContent = error.message || t("error_load_videos");
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
    authStatusLine.textContent = t("error_email_password_required");
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
      throw new Error(data.error || t("error_login_failed"));
    }

    if (!data.user || data.user.role !== "parent") {
      throw new Error(t("error_portal_parent_only"));
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
    authStatusLine.textContent = t("error_name_email_password_required");
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
      throw new Error(data.error || t("error_registration_failed"));
    }
    if (!data.user || data.user.role !== "parent") {
      throw new Error(t("error_parent_only_create"));
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
    forgotStatus.textContent = t("error_enter_email_first");
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
      throw new Error(data.error || t("error_request_reset_failed"));
    }

    forgotStatus.textContent = data.message || t("reset_sent");
    if (data.debugResetUrl) {
      const url = new URL(data.debugResetUrl);
      const token = url.searchParams.get("reset");
      if (token) {
        resetTokenInput.value = token;
        resetStatus.textContent = t("reset_debug_token_filled");
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
    resetStatus.textContent = t("error_token_new_password_required");
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
      throw new Error(data.error || t("error_reset_failed"));
    }

    resetStatus.textContent = data.message || t("reset_success");
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
    throw new Error(data.error || t("error_session_validation_failed"));
  }

  state.user = data.user;
  if (!state.user || state.user.role !== "parent") {
    throw new Error(t("error_parent_account_required"));
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
    throw new Error(data.error || t("error_load_favorites"));
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
      throw new Error(data.error || t("error_update_favorite"));
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
    throw new Error(data.error || t("error_load_children"));
  }

  state.children = Array.isArray(data) ? data : [];
  if (!state.selectedChildId || !state.children.some((child) => child.id === state.selectedChildId)) {
    state.selectedChildId = state.children.length ? state.children[0].id : "";
  }
  renderChildList();
  renderStudentAnalytics();
}

async function saveChildProfile() {
  childStatus.textContent = "";
  if (!state.token) {
    childStatus.textContent = t("error_signin_manage_children");
    return;
  }

  const payload = {
    name: childNameInput.value.trim(),
    ageGroup: childAgeGroupInput.value,
    avatar: state.selectedAvatar
  };

  if (!payload.name) {
    childStatus.textContent = t("error_child_name_required");
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
      throw new Error(data.error || t("error_save_child"));
    }

    childStatus.textContent = isEditing ? t("child_updated") : t("child_created");
    resetChildForm();
    await loadChildren();
    if (!state.selectedChildId) {
      state.selectedChildId = data.id;
    }
    renderStudentAnalytics();
    render();
  } catch (error) {
    childStatus.textContent = error.message;
  }
}

async function deleteChildProfile(childId) {
  if (!state.token) {
    childStatus.textContent = t("error_signin_manage_children");
    return;
  }
  if (!window.confirm(t("confirm_delete_child"))) {
    return;
  }

  try {
    const response = await authenticatedFetch(`/api/parent/children/${childId}`, {
      method: "DELETE"
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || t("error_delete_child"));
    }

    childStatus.textContent = t("child_deleted");
    if (state.selectedChildId === childId) {
      state.selectedChildId = "";
    }
    await loadChildren();
    renderStudentAnalytics();
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
  childSaveBtn.textContent = t("btn_update_child");
  childCancelBtn.classList.remove("hidden");
  renderAvatarOptions();
}

function resetChildForm() {
  state.editingChildId = "";
  state.selectedAvatar = "rocket";
  childForm.reset();
  childAgeGroupInput.value = "4-7";
  childSaveBtn.textContent = t("btn_save_child");
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
  renderStudentAnalytics();
  render();
}

function getSelectedChild() {
  return state.children.find((child) => child.id === state.selectedChildId) || null;
}

function renderChildList() {
  if (!state.user) {
    childList.innerHTML = `<p class="mini-status">${escapeHtml(t("child_list_signin"))}</p>`;
    return;
  }
  if (state.children.length === 0) {
    childList.innerHTML = `<p class="mini-status">${escapeHtml(t("child_list_empty"))}</p>`;
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
            <p class="child-meta">${escapeHtml(t("age_label", { age: child.ageGroup || "4-7" }))}${active ? ` | ${escapeHtml(t("active_label"))}` : ""}</p>
          </div>
          <div class="child-actions">
            <button type="button" class="tiny-btn select" data-action="select" data-child-id="${escapeHtml(
              child.id
            )}">${escapeHtml(t("btn_select"))}</button>
            <button type="button" class="tiny-btn edit" data-action="edit" data-child-id="${escapeHtml(
              child.id
            )}">${escapeHtml(t("btn_edit"))}</button>
            <button type="button" class="tiny-btn delete" data-action="delete" data-child-id="${escapeHtml(
              child.id
            )}">${escapeHtml(t("btn_delete"))}</button>
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
    grid.innerHTML = `<p>${escapeHtml(t("loading_videos"))}</p>`;
    emptyState.classList.add("hidden");
    resultCount.textContent = "";
    return;
  }

  if (!state.user || state.user.role !== "parent") {
    grid.innerHTML = "";
    categoryChips.innerHTML = "";
    resultCount.textContent = "";
    emptyState.classList.remove("hidden");
    emptyState.textContent = t("empty_parent_login_required");
    return;
  }

  const filtered = getFilteredVideos();

  const label = filtered.length === 1 ? t("video_single") : t("video_plural");
  const selectedChild = getSelectedChild();
  const suffix = selectedChild ? t("result_suffix_child", { name: selectedChild.name }) : "";
  resultCount.textContent = t("result_found", {
    count: filtered.length,
    label,
    suffix
  });

  if (filtered.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    if (state.favoritesOnly && !state.token) {
      emptyState.textContent = t("empty_signin_favorites_only");
    } else if (state.favoritesOnly) {
      emptyState.textContent = t("empty_no_favorites");
    } else {
      emptyState.textContent = t("empty_no_match");
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
            <span class="pill">${escapeHtml(video.category || t("general_category"))}</span>
            <span class="pill">${escapeHtml(t("age_label", { age: video.ageGroup || t("all_label") }))}</span>
            <span class="pill">${escapeHtml(video.duration || t("short_duration"))}</span>
          </div>
          <p class="video-desc">${escapeHtml(video.description || "")}</p>
          <div class="card-actions">
            <button type="button" class="watch-btn" data-watch-id="${escapeHtml(video.id)}">
              ${escapeHtml(t("watch_video"))}
            </button>
            <button type="button" class="favorite-btn ${isFavorite ? "active" : ""}" data-fav-id="${escapeHtml(
        video.id
      )}">
              ${isFavorite ? escapeHtml(t("saved_video")) : escapeHtml(t("save_video"))}
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

  const categories = [
    ...new Set(state.videos.map((video) => (video.category || t("general_category")).trim()))
  ]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  const items = [{ label: t("all_topics"), value: "" }].concat(
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
    parentPill.textContent = t("parent_pill", { name: state.user.name });
    parentPill.classList.remove("hidden");
    if (logoutBtn) {
      logoutBtn.classList.add("hidden");
    }
    if (logoutTopBtn) {
      logoutTopBtn.classList.remove("hidden");
    }
    if (studentProfileBtn) {
      studentProfileBtn.classList.remove("hidden");
      studentProfileBtn.textContent = t("btn_student_profile");
    }
    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
    resetForm.classList.add("hidden");
    authStatusLine.textContent = t("signed_in_as", { email: state.user.email });
    loginEmail.value = state.user.email || "";
    registerEmail.value = state.user.email || "";
    childStatus.textContent = t("child_status_focus_age");
    if (heroPanel) {
      heroPanel.classList.add("hidden");
    }
    if (parentAuthSection) {
      parentAuthSection.classList.add("hidden");
    }
    toggleStudentPanel(state.studentPanelOpen);
  } else {
    parentPill.textContent = "";
    parentPill.classList.add("hidden");
    if (logoutBtn) {
      logoutBtn.classList.add("hidden");
    }
    if (logoutTopBtn) {
      logoutTopBtn.classList.add("hidden");
    }
    if (studentProfileBtn) {
      studentProfileBtn.classList.add("hidden");
    }
    loginForm.classList.remove("hidden");
    registerForm.classList.remove("hidden");
    resetForm.classList.remove("hidden");
    authStatusLine.textContent = t("auth_status_default");
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
    state.studentPanelOpen = false;
    resetChildForm();
    childStatus.textContent = t("child_status_signed_out");
    renderChildList();
    if (heroPanel) {
      heroPanel.classList.remove("hidden");
    }
    if (parentAuthSection) {
      parentAuthSection.classList.remove("hidden");
    }
    toggleStudentPanel(false);
  }

  setChildSectionEnabled(loggedIn);
  setLibraryControlsEnabled(loggedIn);
  updateFavoritesToggle();
  renderStudentAnalytics();
  renderPlayer();
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
  favoritesOnlyBtn.textContent = state.favoritesOnly ? t("favorites_showing") : t("favorites_only");
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
  state.studentPanelOpen = false;
  state.player.isOpen = false;
  state.player.queue = [];
  state.player.index = -1;
  localStorage.removeItem("xerivo_parent_token");
}

async function authenticatedFetch(url, options = {}) {
  if (!state.token) {
    throw new Error(t("error_signin_first"));
  }

  const headers = Object.assign({}, options.headers || {}, {
    Authorization: `Bearer ${state.token}`
  });

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 || response.status === 403) {
    let message =
      response.status === 403
        ? t("error_parent_required_signin")
        : t("error_session_expired");
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
