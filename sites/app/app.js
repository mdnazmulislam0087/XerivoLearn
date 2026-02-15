const AVATARS = [
  { key: "rocket", label: "Rocket", src: "./assets/avatars/rocket.svg" },
  { key: "star", label: "Star", src: "./assets/avatars/star.svg" },
  { key: "whale", label: "Whale", src: "./assets/avatars/whale.svg" },
  { key: "panda", label: "Panda", src: "./assets/avatars/panda.svg" },
  { key: "owl", label: "Owl", src: "./assets/avatars/owl.svg" },
  { key: "fox", label: "Fox", src: "./assets/avatars/fox.svg" }
];

const LANGUAGE_STORAGE_KEY = "xerivo_app_lang";
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
    child_profiles_title: "চাইল্ড প্রোফাইল",
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
  lang: "en"
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
  if (brandLink) {
    brandLink.href = "/";
  }
}

function loadLanguagePreference() {
  try {
    const value = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
    return SUPPORTED_LANGUAGES.has(value) ? value : "en";
  } catch {
    return "en";
  }
}

function saveLanguagePreference(lang) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {}
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

  updateFavoritesToggle();
  updateAuthUi();
  renderCategoryChips();
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
  const target = event.target.closest("button[data-fav-id]");
  if (!target) {
    return;
  }

  const videoId = target.dataset.favId;
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

  const filtered = state.videos.filter((video) => {
    const ageMatch = !state.age || video.ageGroup === state.age;
    const categoryMatch =
      !state.category || (video.category || "").toLowerCase() === state.category.toLowerCase();
    const text = `${video.title} ${video.description}`.toLowerCase();
    const searchMatch = !state.search || text.includes(state.search);
    const favoriteMatch = !state.favoritesOnly || state.favoriteIds.has(video.id);
    return ageMatch && categoryMatch && searchMatch && favoriteMatch;
  });

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
            <a class="watch-btn" href="${escapeHtml(video.videoUrl)}" target="_blank" rel="noreferrer">
              ${escapeHtml(t("watch_video"))}
            </a>
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
    logoutBtn.classList.remove("hidden");
    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
    resetForm.classList.add("hidden");
    authStatusLine.textContent = t("signed_in_as", { email: state.user.email });
    loginEmail.value = state.user.email || "";
    registerEmail.value = state.user.email || "";
    childStatus.textContent = t("child_status_focus_age");
  } else {
    parentPill.textContent = "";
    parentPill.classList.add("hidden");
    logoutBtn.classList.add("hidden");
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
    resetChildForm();
    childStatus.textContent = t("child_status_signed_out");
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
