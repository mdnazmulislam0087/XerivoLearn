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
    auth_title_logged_in: "Admin Profile",
    auth_subtitle: "Sign in with your admin account to access video publication controls.",
    auth_subtitle_logged_in: "You are signed in. Manage CMS and content from the shortcuts below.",
    ph_admin_email: "Admin email",
    ph_admin_password: "Admin password",
    btn_sign_in: "Sign In",
    btn_logout: "Logout",
    profile_label: "Admin Profile",
    btn_content_management: "Content Management",
    btn_post_management: "Post Management",
    manager_title: "Management Console",
    content_panel_title: "Homepage Content Management",
    content_links_legend: "Portal and Social Links",
    content_media_legend: "Mascots and Image Assets",
    content_hero_legend: "Navigation, Hero, Pricing, and Features (EN / BN)",
    content_trust_legend: "Trust, Testimonials, and Footer (EN / BN)",
    btn_save_content: "Save Homepage Content",
    btn_reload_content: "Reload Content",
    btn_expand_all: "Expand All",
    btn_collapse_all: "Collapse All",
    section_status_complete: "Complete",
    section_status_progress: "{filled}/{total} filled",

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
    status_loading_content: "Loading homepage content...",
    status_content_loaded: "Homepage content loaded.",
    status_content_saved: "Homepage content saved.",
    status_content_save_failed: "Could not save homepage content.",
    status_content_load_failed: "Could not load homepage content.",

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
    auth_title_logged_in: "অ্যাডমিন প্রোফাইল",
    auth_subtitle: "ভিডিও পাবলিকেশন কন্ট্রোল ব্যবহার করতে অ্যাডমিন অ্যাকাউন্টে সাইন ইন করুন।",
    auth_subtitle_logged_in: "আপনি সাইন ইন করেছেন। নিচের শর্টকাট থেকে সিএমএস এবং কনটেন্ট ম্যানেজ করুন।",
    ph_admin_email: "অ্যাডমিন ইমেইল",
    ph_admin_password: "অ্যাডমিন পাসওয়ার্ড",
    btn_sign_in: "সাইন ইন",
    btn_logout: "লগআউট",
    profile_label: "অ্যাডমিন প্রোফাইল",
    btn_content_management: "কনটেন্ট ম্যানেজমেন্ট",
    btn_post_management: "পোস্ট ম্যানেজমেন্ট",
    manager_title: "ম্যানেজমেন্ট কনসোল",
    content_panel_title: "হোমপেজ কনটেন্ট ম্যানেজমেন্ট",
    content_links_legend: "পোর্টাল এবং সোশ্যাল লিংক",
    content_media_legend: "ম্যাসকট এবং ইমেজ অ্যাসেট",
    content_hero_legend: "নেভিগেশন, হিরো, প্রাইসিং, এবং ফিচার (EN / BN)",
    content_trust_legend: "ট্রাস্ট, টেস্টিমোনিয়াল, এবং ফুটার (EN / BN)",
    btn_save_content: "হোমপেজ কনটেন্ট সেভ করুন",
    btn_reload_content: "কনটেন্ট রিলোড করুন",
    btn_expand_all: "সব খুলুন",
    btn_collapse_all: "সব বন্ধ করুন",
    section_status_complete: "পূর্ণ",
    section_status_progress: "{total} এর মধ্যে {filled} পূরণ",

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
    status_loading_content: "হোমপেজ কনটেন্ট লোড হচ্ছে...",
    status_content_loaded: "হোমপেজ কনটেন্ট লোড হয়েছে।",
    status_content_saved: "হোমপেজ কনটেন্ট সেভ হয়েছে।",
    status_content_save_failed: "হোমপেজ কনটেন্ট সেভ করা যায়নি।",
    status_content_load_failed: "হোমপেজ কনটেন্ট লোড করা যায়নি।",

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
const authHeading = document.getElementById("auth-heading");
const authSubtitle = document.getElementById("auth-subtitle");
const authLoginControls = document.getElementById("auth-login-controls");
const authSessionControls = document.getElementById("auth-session-controls");
const navParentsLink = document.getElementById("nav-parents");
const navEducatorsLink = document.getElementById("nav-educators");
const navAdminLink = document.getElementById("nav-admin");
const langEnButton = document.getElementById("lang-en");
const langBnButton = document.getElementById("lang-bn");
const jumpContentBtn = document.getElementById("jump-content-btn");
const jumpPostBtn = document.getElementById("jump-post-btn");
const openContentManagerBtn = document.getElementById("open-content-manager-btn");
const openPostManagerBtn = document.getElementById("open-post-manager-btn");
const contentManagementView = document.getElementById("content-management-view");
const postManagementView = document.getElementById("post-management-view");
const contentForm = document.getElementById("content-form");
const contentSaveBtn = document.getElementById("content-save-btn");
const contentResetBtn = document.getElementById("content-reset-btn");
const contentStatus = document.getElementById("content-status");

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

const CONTENT_LINK_FIELD_MAP = [
  ["content-parent-url", "parentAppUrl"],
  ["content-educator-url", "educatorPortalUrl"],
  ["content-admin-url", "adminCmsUrl"],
  ["content-contact-email", "contactEmail"],
  ["content-youtube-url", "youtubeUrl"],
  ["content-facebook-url", "facebookUrl"],
  ["content-instagram-url", "instagramUrl"]
];

const CONTENT_MEDIA_FIELD_MAP = [
  ["content-tom-url", "mascotTomUrl"],
  ["content-jerry-url", "mascotJerryUrl"],
  ["content-feature-1-url", "featureOneImageUrl"],
  ["content-feature-2-url", "featureTwoImageUrl"],
  ["content-feature-3-url", "featureThreeImageUrl"],
  ["content-testimonial-1-url", "testimonialOneAvatarUrl"],
  ["content-testimonial-2-url", "testimonialTwoAvatarUrl"],
  ["content-testimonial-3-url", "testimonialThreeAvatarUrl"]
];

const CONTENT_TEXT_FIELD_MAP = [
  ["content-nav-parents-en", "en", "nav_parents"],
  ["content-nav-parents-bn", "bn", "nav_parents"],
  ["content-nav-educators-en", "en", "nav_educators"],
  ["content-nav-educators-bn", "bn", "nav_educators"],
  ["content-nav-admin-en", "en", "nav_admin"],
  ["content-nav-admin-bn", "bn", "nav_admin"],
  ["content-hero-title-en", "en", "hero_title"],
  ["content-hero-title-bn", "bn", "hero_title"],
  ["content-parent-cta-en", "en", "cta_parent"],
  ["content-parent-cta-bn", "bn", "cta_parent"],
  ["content-educator-cta-en", "en", "cta_educator"],
  ["content-educator-cta-bn", "bn", "cta_educator"],
  ["content-parent-price-en", "en", "parent_price"],
  ["content-parent-price-bn", "bn", "parent_price"],
  ["content-parent-plan-en", "en", "parent_plan"],
  ["content-parent-plan-bn", "bn", "parent_plan"],
  ["content-educator-price-en", "en", "educator_price"],
  ["content-educator-price-bn", "bn", "educator_price"],
  ["content-educator-plan-en", "en", "educator_plan"],
  ["content-educator-plan-bn", "bn", "educator_plan"],
  ["content-feature-alpha-en", "en", "topic_alpha"],
  ["content-feature-alpha-bn", "bn", "topic_alpha"],
  ["content-feature-story-en", "en", "topic_story"],
  ["content-feature-story-bn", "bn", "topic_story"],
  ["content-feature-words-en", "en", "feature_words"],
  ["content-feature-words-bn", "bn", "feature_words"],
  ["content-stat-1-value-en", "en", "stat_1_value"],
  ["content-stat-1-value-bn", "bn", "stat_1_value"],
  ["content-stat-1-label-en", "en", "stat_1_label"],
  ["content-stat-1-label-bn", "bn", "stat_1_label"],
  ["content-stat-2-value-en", "en", "stat_2_value"],
  ["content-stat-2-value-bn", "bn", "stat_2_value"],
  ["content-stat-2-label-en", "en", "stat_2_label"],
  ["content-stat-2-label-bn", "bn", "stat_2_label"],
  ["content-stat-3-value-en", "en", "stat_3_value"],
  ["content-stat-3-value-bn", "bn", "stat_3_value"],
  ["content-stat-3-label-en", "en", "stat_3_label"],
  ["content-stat-3-label-bn", "bn", "stat_3_label"],
  ["content-demo-title-en", "en", "demo_title"],
  ["content-demo-title-bn", "bn", "demo_title"],
  ["content-demo-caption-1-en", "en", "demo_caption_1"],
  ["content-demo-caption-1-bn", "bn", "demo_caption_1"],
  ["content-demo-caption-2-en", "en", "demo_caption_2"],
  ["content-demo-caption-2-bn", "bn", "demo_caption_2"],
  ["content-demo-caption-3-en", "en", "demo_caption_3"],
  ["content-demo-caption-3-bn", "bn", "demo_caption_3"],
  ["content-demo-pause-en", "en", "demo_pause"],
  ["content-demo-pause-bn", "bn", "demo_pause"],
  ["content-demo-play-en", "en", "demo_play"],
  ["content-demo-play-bn", "bn", "demo_play"],
  ["content-preview-title-en", "en", "preview_title"],
  ["content-preview-title-bn", "bn", "preview_title"],
  ["content-preview-text-en", "en", "preview_text"],
  ["content-preview-text-bn", "bn", "preview_text"],
  ["content-preview-1-title-en", "en", "preview_1_title"],
  ["content-preview-1-title-bn", "bn", "preview_1_title"],
  ["content-preview-1-meta-en", "en", "preview_1_meta"],
  ["content-preview-1-meta-bn", "bn", "preview_1_meta"],
  ["content-preview-2-title-en", "en", "preview_2_title"],
  ["content-preview-2-title-bn", "bn", "preview_2_title"],
  ["content-preview-2-meta-en", "en", "preview_2_meta"],
  ["content-preview-2-meta-bn", "bn", "preview_2_meta"],
  ["content-preview-3-title-en", "en", "preview_3_title"],
  ["content-preview-3-title-bn", "bn", "preview_3_title"],
  ["content-preview-3-meta-en", "en", "preview_3_meta"],
  ["content-preview-3-meta-bn", "bn", "preview_3_meta"],
  ["content-preview-4-title-en", "en", "preview_4_title"],
  ["content-preview-4-title-bn", "bn", "preview_4_title"],
  ["content-preview-4-meta-en", "en", "preview_4_meta"],
  ["content-preview-4-meta-bn", "bn", "preview_4_meta"],
  ["content-trust-title-en", "en", "trust_title"],
  ["content-trust-title-bn", "bn", "trust_title"],
  ["content-trust-text-en", "en", "trust_text"],
  ["content-trust-text-bn", "bn", "trust_text"],
  ["content-trust-item-1-title-en", "en", "trust_item_1_title"],
  ["content-trust-item-1-title-bn", "bn", "trust_item_1_title"],
  ["content-trust-item-1-text-en", "en", "trust_item_1_text"],
  ["content-trust-item-1-text-bn", "bn", "trust_item_1_text"],
  ["content-trust-item-2-title-en", "en", "trust_item_2_title"],
  ["content-trust-item-2-title-bn", "bn", "trust_item_2_title"],
  ["content-trust-item-2-text-en", "en", "trust_item_2_text"],
  ["content-trust-item-2-text-bn", "bn", "trust_item_2_text"],
  ["content-trust-item-3-title-en", "en", "trust_item_3_title"],
  ["content-trust-item-3-title-bn", "bn", "trust_item_3_title"],
  ["content-trust-item-3-text-en", "en", "trust_item_3_text"],
  ["content-trust-item-3-text-bn", "bn", "trust_item_3_text"],
  ["content-testimonials-title-en", "en", "testimonials_title"],
  ["content-testimonials-title-bn", "bn", "testimonials_title"],
  ["content-testimonials-text-en", "en", "testimonials_text"],
  ["content-testimonials-text-bn", "bn", "testimonials_text"],
  ["content-quote-1-en", "en", "quote_1"],
  ["content-quote-1-bn", "bn", "quote_1"],
  ["content-quote-1-by-en", "en", "quote_1_by"],
  ["content-quote-1-by-bn", "bn", "quote_1_by"],
  ["content-quote-2-en", "en", "quote_2"],
  ["content-quote-2-bn", "bn", "quote_2"],
  ["content-quote-2-by-en", "en", "quote_2_by"],
  ["content-quote-2-by-bn", "bn", "quote_2_by"],
  ["content-quote-3-en", "en", "quote_3"],
  ["content-quote-3-bn", "bn", "quote_3"],
  ["content-quote-3-by-en", "en", "quote_3_by"],
  ["content-quote-3-by-bn", "bn", "quote_3_by"],
  ["content-footer-tagline-en", "en", "footer_tagline"],
  ["content-footer-tagline-bn", "bn", "footer_tagline"],
  ["content-footer-social-title-en", "en", "footer_social_title"],
  ["content-footer-social-title-bn", "bn", "footer_social_title"],
  ["content-footer-contact-title-en", "en", "footer_contact_title"],
  ["content-footer-contact-title-bn", "bn", "footer_contact_title"],
  ["content-footer-contact-en", "en", "footer_contact_text"],
  ["content-footer-contact-bn", "bn", "footer_contact_text"],
  ["content-footer-rights-en", "en", "footer_rights"],
  ["content-footer-rights-bn", "bn", "footer_rights"],
  ["content-footer-made-en", "en", "footer_made"],
  ["content-footer-made-bn", "bn", "footer_made"]
];

const state = {
  token: localStorage.getItem("xerivo_auth_token") || "",
  user: null,
  editingId: null,
  videos: [],
  searchQuery: "",
  lang: "en",
  managerView: "content",
  marketingContent: null
};
let contentAccordion = null;

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
if (jumpContentBtn) {
  jumpContentBtn.addEventListener("click", () => {
    setManagerView("content", { scroll: true });
  });
}
if (jumpPostBtn) {
  jumpPostBtn.addEventListener("click", () => {
    setManagerView("post", { scroll: true });
  });
}
if (openContentManagerBtn) {
  openContentManagerBtn.addEventListener("click", () => {
    setManagerView("content");
  });
}
if (openPostManagerBtn) {
  openPostManagerBtn.addEventListener("click", () => {
    setManagerView("post");
  });
}
if (contentForm) {
  contentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveMarketingContent();
  });
}
if (contentResetBtn) {
  contentResetBtn.addEventListener("click", async () => {
    await loadMarketingContent();
  });
}

setupContentAccordion();
applyLanguage(loadLanguagePreference(), { persist: false });
bootstrap();

async function bootstrap() {
  setCmsEnabled(false);
  setManagerView("content");
  if (!state.token) {
    showLoggedOut(t("status_signin_to_manage"));
    return;
  }

  try {
    await refreshAdminSession();
    await Promise.all([loadVideos(), loadMarketingContent()]);
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
    await Promise.all([loadVideos(), loadMarketingContent()]);
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

async function loadMarketingContent() {
  if (!contentStatus) {
    return;
  }

  if (!state.token) {
    state.marketingContent = getDefaultMarketingContent();
    populateContentForm(state.marketingContent);
    contentStatus.textContent = t("status_signin_to_manage");
    return;
  }

  contentStatus.textContent = t("status_loading_content");
  try {
    const response = await adminFetch("/api/admin/settings/marketing-content", { method: "GET" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(localizeApiMessage(data.error, "status_content_load_failed"));
    }

    state.marketingContent = normalizeMarketingContent(data.marketingContent);
    populateContentForm(state.marketingContent);
    contentStatus.textContent = t("status_content_loaded");
  } catch (error) {
    state.marketingContent = getDefaultMarketingContent();
    populateContentForm(state.marketingContent);
    contentStatus.textContent = localizeApiMessage(error.message, "status_content_load_failed");
  }
}

async function saveMarketingContent() {
  if (!contentStatus) {
    return;
  }

  try {
    assertAuthenticated();
    const marketingContent = readMarketingContentForm();
    const response = await adminFetch("/api/admin/settings/marketing-content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ marketingContent })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(localizeApiMessage(data.error, "status_content_save_failed"));
    }

    state.marketingContent = normalizeMarketingContent(data.marketingContent);
    populateContentForm(state.marketingContent);
    contentStatus.textContent = t("status_content_saved");
  } catch (error) {
    contentStatus.textContent = localizeApiMessage(error.message, "status_content_save_failed");
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
  setManagerView("post");
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

function getDefaultMarketingContent() {
  return {
    links: {
      parentAppUrl: "https://app.xerivolearn.com",
      educatorPortalUrl: "https://educator.xerivolearn.com",
      adminCmsUrl: "https://admin.xerivolearn.com",
      contactEmail: "hello@xerivolearn.com",
      youtubeUrl: "https://www.youtube.com/",
      facebookUrl: "https://www.facebook.com/",
      instagramUrl: "https://www.instagram.com/"
    },
    media: {
      mascotTomUrl: "./assets/characters/tom.png",
      mascotJerryUrl: "./assets/characters/jerry.png",
      featureOneImageUrl: "./assets/characters/fox.svg",
      featureTwoImageUrl: "./assets/characters/penguin.svg",
      featureThreeImageUrl: "./assets/characters/bear.svg",
      testimonialOneAvatarUrl: "./assets/testimonials/rima.png",
      testimonialTwoAvatarUrl: "./assets/testimonials/tanvir.png",
      testimonialThreeAvatarUrl: "./assets/testimonials/nusrat.png"
    },
    i18n: {
      en: {
        nav_parents: "Parents",
        nav_educators: "Educators",
        nav_admin: "Admin CMS",
        hero_title: "Where Cartoons Spark Curious Minds",
        cta_parent: "Enter Parent App",
        cta_educator: "Educator Portal",
        parent_price: "$1/month",
        parent_plan: "Parent Plan",
        educator_price: "$20/year",
        educator_plan: "Educator Plan",
        topic_alpha: "Alphabet",
        topic_story: "Bedtime Stories",
        feature_words: "Words",
        stat_1_value: "500+",
        stat_1_label: "Families learning weekly",
        stat_2_value: "1,000+",
        stat_2_label: "Lessons watched this month",
        stat_3_value: "4.8/5",
        stat_3_label: "Average parent rating",
        preview_title: "Sample video carousel",
        preview_text: "Swipeable preview cards to show what children will watch.",
        preview_1_title: "ABC Rocket Song",
        preview_1_meta: "Age 3-5 | 3:12",
        preview_2_title: "Count the Stars",
        preview_2_meta: "Age 4-7 | 4:01",
        preview_3_title: "Moonlight Story Time",
        preview_3_meta: "Age 3-8 | 5:18",
        preview_4_title: "Tiny Science Lab",
        preview_4_meta: "Age 6-10 | 6:20",
        trust_title: "Why parents trust XerivoLearn",
        trust_text: "Built for happy kids and low-stress parenting.",
        trust_item_1_title: "Child-safe content",
        trust_item_1_text: "Curated videos designed for young learners.",
        trust_item_2_title: "Quick, focused lessons",
        trust_item_2_text: "Short formats match real family routines.",
        trust_item_3_title: "Bilingual Mode (Bangla + English)",
        trust_item_3_text: "Switch language anytime and keep it saved.",
        testimonials_title: "What families are saying",
        testimonials_text: "Parent feedback from early XerivoLearn users.",
        quote_1: "\"My daughter now asks for learning cartoons before bedtime.\"",
        quote_1_by: "Rima, Parent of a 5-year-old",
        quote_2: "\"The bilingual option helps us practice Bangla and English together.\"",
        quote_2_by: "Tanvir, Parent",
        quote_3: "\"Very easy for families. The videos are bright, short, and educational.\"",
        quote_3_by: "Nusrat, Guardian",
        demo_title: "30-second XerivoLearn Preview",
        demo_caption_1: "Scene 1: Alphabet song with cartoon friends",
        demo_caption_2: "Scene 2: Bedtime story time with calm narration",
        demo_caption_3: "Scene 3: Fun science cartoon mini lesson",
        demo_pause: "Pause",
        demo_play: "Play",
        footer_tagline: "Safe cartoons and learning joy for every family.",
        footer_social_title: "Follow Us",
        footer_contact_title: "Contact",
        footer_contact_text: "Need help with your plan or videos? Email us anytime.",
        footer_rights: "(C) 2026 XerivoLearn. All rights reserved.",
        footer_made: "Made for children, trusted by parents."
      },
      bn: {}
    }
  };
}

function normalizeMarketingContent(content) {
  const defaults = getDefaultMarketingContent();
  const source = content && typeof content === "object" ? content : {};
  return {
    links: { ...defaults.links, ...(source.links || {}) },
    media: { ...defaults.media, ...(source.media || {}) },
    i18n: {
      en: { ...(source.i18n?.en || {}) },
      bn: { ...(source.i18n?.bn || {}) }
    }
  };
}

function setInputValueById(id, value) {
  const input = document.getElementById(id);
  if (!input) {
    return;
  }
  input.value = typeof value === "string" ? value : "";
}

function populateContentForm(content) {
  const safe = normalizeMarketingContent(content);
  CONTENT_LINK_FIELD_MAP.forEach(([id, key]) => {
    setInputValueById(id, safe.links[key] || "");
  });
  CONTENT_MEDIA_FIELD_MAP.forEach(([id, key]) => {
    setInputValueById(id, safe.media[key] || "");
  });
  CONTENT_TEXT_FIELD_MAP.forEach(([id, lang, key]) => {
    setInputValueById(id, safe.i18n?.[lang]?.[key] || "");
  });
  updateContentAccordionProgress();
}

function getInputValueById(id) {
  const input = document.getElementById(id);
  return input ? String(input.value || "").trim() : "";
}

function readMarketingContentForm() {
  const current = normalizeMarketingContent(state.marketingContent);
  const next = {
    links: { ...current.links },
    media: { ...current.media },
    i18n: {
      en: { ...current.i18n.en },
      bn: { ...current.i18n.bn }
    }
  };

  CONTENT_LINK_FIELD_MAP.forEach(([id, key]) => {
    const value = getInputValueById(id);
    next.links[key] = value || current.links[key] || "";
  });

  CONTENT_MEDIA_FIELD_MAP.forEach(([id, key]) => {
    const value = getInputValueById(id);
    next.media[key] = value || current.media[key] || "";
  });

  CONTENT_TEXT_FIELD_MAP.forEach(([id, lang, key]) => {
    const value = getInputValueById(id);
    if (value) {
      next.i18n[lang][key] = value;
    } else {
      delete next.i18n[lang][key];
    }
  });

  return next;
}

function setManagerView(view, options = {}) {
  const target = view === "post" ? "post" : "content";
  state.managerView = target;

  if (contentManagementView) {
    contentManagementView.classList.toggle("hidden", target !== "content");
  }
  if (postManagementView) {
    postManagementView.classList.toggle("hidden", target !== "post");
  }
  if (openContentManagerBtn) {
    openContentManagerBtn.classList.toggle("active", target === "content");
  }
  if (openPostManagerBtn) {
    openPostManagerBtn.classList.toggle("active", target === "post");
  }
  if (jumpContentBtn) {
    jumpContentBtn.classList.toggle("active", target === "content");
  }
  if (jumpPostBtn) {
    jumpPostBtn.classList.toggle("active", target === "post");
  }

  if (options.scroll) {
    if (target === "content") {
      contentManagementView?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      postManagementView?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function setAccordionItemOpen(item, open) {
  item.wrapper.classList.toggle("collapsed", !open);
  item.trigger.setAttribute("aria-expanded", open ? "true" : "false");
}

function readAccordionControlValue(control) {
  if (!control) {
    return "";
  }
  const type = String(control.type || "").toLowerCase();
  if (type === "checkbox" || type === "radio") {
    return control.checked ? "1" : "";
  }
  return String(control.value || "").trim();
}

function updateAccordionItemProgress(item) {
  if (!item || !item.statusNode || !Array.isArray(item.controls)) {
    return;
  }

  const total = item.controls.length;
  const filled = item.controls.reduce((count, control) => {
    const value = readAccordionControlValue(control);
    return value ? count + 1 : count;
  }, 0);
  const complete = total > 0 && filled >= total;

  item.statusNode.textContent = complete
    ? t("section_status_complete")
    : t("section_status_progress", { filled, total });
  item.statusNode.classList.toggle("complete", complete);
}

function updateContentAccordionProgress() {
  if (!contentAccordion || !Array.isArray(contentAccordion.items)) {
    return;
  }
  contentAccordion.items.forEach((item) => updateAccordionItemProgress(item));
}

function syncContentAccordionTitles() {
  if (!contentAccordion || !Array.isArray(contentAccordion.items)) {
    return;
  }
  contentAccordion.items.forEach((item, index) => {
    const fallback = `Section ${index + 1}`;
    const title = item.legend && item.legend.textContent ? item.legend.textContent.trim() : "";
    item.titleNode.textContent = title || fallback;
  });
  updateContentAccordionProgress();
}

function setupContentAccordion() {
  if (!contentForm || contentAccordion || contentForm.dataset.accordionReady === "true") {
    return;
  }

  const fieldsets = Array.from(contentForm.querySelectorAll(":scope > fieldset"));
  if (fieldsets.length === 0) {
    return;
  }

  const toolbar = document.createElement("div");
  toolbar.className = "content-accordion-toolbar";
  const expandBtn = document.createElement("button");
  expandBtn.type = "button";
  expandBtn.className = "muted";
  expandBtn.setAttribute("data-i18n", "btn_expand_all");
  expandBtn.textContent = "Expand All";
  const collapseBtn = document.createElement("button");
  collapseBtn.type = "button";
  collapseBtn.className = "muted";
  collapseBtn.setAttribute("data-i18n", "btn_collapse_all");
  collapseBtn.textContent = "Collapse All";
  toolbar.appendChild(expandBtn);
  toolbar.appendChild(collapseBtn);

  contentForm.insertBefore(toolbar, fieldsets[0]);

  const items = fieldsets.map((fieldset, index) => {
    const wrapper = document.createElement("section");
    wrapper.className = "content-accordion-item";
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "content-accordion-trigger";
    trigger.setAttribute("aria-expanded", "true");

    const titleNode = document.createElement("span");
    titleNode.className = "content-accordion-title";
    trigger.appendChild(titleNode);
    const statusNode = document.createElement("span");
    statusNode.className = "content-accordion-status";
    trigger.appendChild(statusNode);

    const body = document.createElement("div");
    body.className = "content-accordion-body";
    const legend = Array.from(fieldset.children).find(
      (child) => child && child.tagName && child.tagName.toLowerCase() === "legend"
    );

    const parent = fieldset.parentNode;
    parent.insertBefore(wrapper, fieldset);
    wrapper.appendChild(trigger);
    wrapper.appendChild(body);
    body.appendChild(fieldset);

    const controls = Array.from(fieldset.querySelectorAll("input, textarea, select"));
    return { wrapper, trigger, titleNode, statusNode, body, fieldset, legend, index, controls };
  });

  items.forEach((item) => {
    item.trigger.addEventListener("click", () => {
      const willOpen = item.wrapper.classList.contains("collapsed");
      if (willOpen) {
        items.forEach((candidate) => {
          setAccordionItemOpen(candidate, candidate === item);
        });
      } else {
        setAccordionItemOpen(item, false);
      }
    });
  });

  expandBtn.addEventListener("click", () => {
    items.forEach((item) => setAccordionItemOpen(item, true));
  });

  collapseBtn.addEventListener("click", () => {
    items.forEach((item) => setAccordionItemOpen(item, false));
  });

  const updateByTarget = (target) => {
    if (!target || !target.tagName) {
      return;
    }
    const tag = target.tagName.toLowerCase();
    if (!["input", "textarea", "select"].includes(tag)) {
      return;
    }
    const owner = items.find((item) => item.fieldset.contains(target));
    if (owner) {
      updateAccordionItemProgress(owner);
    }
  };

  contentForm.addEventListener("input", (event) => {
    updateByTarget(event.target);
  });
  contentForm.addEventListener("change", (event) => {
    updateByTarget(event.target);
  });

  items.forEach((item, index) => setAccordionItemOpen(item, index === 0));
  contentAccordion = { items, toolbar, expandBtn, collapseBtn };
  contentForm.dataset.accordionReady = "true";
  syncContentAccordionTitles();
}

function showLoggedIn() {
  setCmsEnabled(true);
  setManagerView(state.managerView || "content");
  if (authLoginControls) {
    authLoginControls.classList.add("hidden");
  }
  if (authSessionControls) {
    authSessionControls.classList.remove("hidden");
  }
  authStatus.textContent = t("status_authenticated");
  authUser.textContent = state.user
    ? t("status_logged_in_as", { name: state.user.name || "Admin", email: state.user.email || "" })
    : t("status_logged_in");
  updateAuthPanelText();
}

function showLoggedOut(message) {
  setCmsEnabled(false);
  setManagerView("content");
  if (authLoginControls) {
    authLoginControls.classList.remove("hidden");
  }
  if (authSessionControls) {
    authSessionControls.classList.add("hidden");
  }
  authStatus.textContent = message || "";
  authUser.textContent = "";
  state.videos = [];
  state.marketingContent = getDefaultMarketingContent();
  updateStats();
  populateContentForm(state.marketingContent);
  videoList.innerHTML = `<p>${escapeHtml(t("status_signin_to_load"))}</p>`;
  if (contentStatus) {
    contentStatus.textContent = "";
  }
  updateAuthPanelText();
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
  if (contentSaveBtn) {
    contentSaveBtn.disabled = !enabled;
  }
  if (contentResetBtn) {
    contentResetBtn.disabled = !enabled;
  }
  if (openContentManagerBtn) {
    openContentManagerBtn.disabled = !enabled;
  }
  if (openPostManagerBtn) {
    openPostManagerBtn.disabled = !enabled;
  }
  if (jumpContentBtn) {
    jumpContentBtn.disabled = !enabled;
  }
  if (jumpPostBtn) {
    jumpPostBtn.disabled = !enabled;
  }
  if (contentForm) {
    const controls = contentForm.querySelectorAll("input, textarea, select, button");
    controls.forEach((control) => {
      control.disabled = !enabled;
    });
  }
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
  syncContentAccordionTitles();

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
  updateAuthPanelText();
  setManagerView(state.managerView || "content");

  renderList();

  if (!state.user && !state.token && !authStatus.textContent) {
    authStatus.textContent = t("status_signin_to_manage");
  }
}

function updateAuthPanelText() {
  if (!authHeading || !authSubtitle) {
    return;
  }

  if (state.user && state.token) {
    authHeading.textContent = t("auth_title_logged_in");
    authSubtitle.textContent = t("auth_subtitle_logged_in");
    return;
  }

  authHeading.textContent = t("auth_title");
  authSubtitle.textContent = t("auth_subtitle");
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
