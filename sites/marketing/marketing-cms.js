(function () {
  const STORAGE_KEY = "xerivo_lang";
  const LEGACY_STORAGE_KEY = "xerivo_app_lang";
  const LANGUAGE_QUERY_KEY = "lang";
  const SUPPORTED_LANGUAGES = new Set(["en", "bn"]);

  const CUSTOM_HOSTS = new Set([
    "xerivolearn.com",
    "www.xerivolearn.com",
    "app.xerivolearn.com",
    "educator.xerivolearn.com",
    "admin.xerivolearn.com"
  ]);

  const PARENT_LINK_IDS = ["nav-parent-link", "hero-parent-link", "price-parent-link"];
  const EDUCATOR_LINK_IDS = ["nav-educator-link", "hero-educator-link", "price-educator-link"];
  const ADMIN_LINK_IDS = ["nav-admin-link"];
  const HOME_LINK_IDS = ["home-link", "footer-home-link"];

  const MEDIA_FIELD_MAP = [
    ["cms-mascot-tom", "mascotTomUrl"],
    ["cms-mascot-jerry", "mascotJerryUrl"],
    ["cms-feature-image-1", "featureOneImageUrl"],
    ["cms-feature-image-2", "featureTwoImageUrl"],
    ["cms-feature-image-3", "featureThreeImageUrl"],
    ["cms-testimonial-avatar-1", "testimonialOneAvatarUrl"],
    ["cms-testimonial-avatar-2", "testimonialTwoAvatarUrl"],
    ["cms-testimonial-avatar-3", "testimonialThreeAvatarUrl"]
  ];

  let marketingContent = null;
  window.__XERIVO_MARKETING_CONTENT__ = null;

  function getLanguage() {
    const fromQuery = (new URLSearchParams(window.location.search).get(LANGUAGE_QUERY_KEY) || "").toLowerCase();
    if (SUPPORTED_LANGUAGES.has(fromQuery)) {
      return fromQuery;
    }
    const docLang = String(document.documentElement.lang || "").toLowerCase();
    if (SUPPORTED_LANGUAGES.has(docLang)) {
      return docLang;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY) || "en";
      return SUPPORTED_LANGUAGES.has(saved) ? saved : "en";
    } catch {
      return "en";
    }
  }

  function withLang(url, lang) {
    try {
      const parsed = new URL(url, window.location.origin);
      parsed.searchParams.set(LANGUAGE_QUERY_KEY, lang);
      return parsed.toString();
    } catch {
      return url;
    }
  }

  function setHrefById(id, url, lang) {
    const node = document.getElementById(id);
    if (!node || !url) {
      return;
    }
    node.href = withLang(url, lang);
  }

  function isPathFallbackHost() {
    return !CUSTOM_HOSTS.has(window.location.hostname.toLowerCase());
  }

  function resolvePortalLinks(links) {
    if (!isPathFallbackHost()) {
      return {
        parent: links.parentAppUrl || "https://app.xerivolearn.com/",
        educator: links.educatorPortalUrl || "https://educator.xerivolearn.com/",
        admin: links.adminCmsUrl || "https://admin.xerivolearn.com/",
        home: "https://xerivolearn.com/"
      };
    }

    return {
      parent: "/app/",
      educator: "/educator/",
      admin: "/admin/",
      home: "/"
    };
  }

  function applyTextOverrides(lang) {
    const langData = marketingContent?.i18n?.[lang];
    if (!langData || typeof langData !== "object") {
      return;
    }

    Object.entries(langData).forEach(([key, value]) => {
      if (typeof value !== "string" || !value.trim()) {
        return;
      }
      const nodes = document.querySelectorAll(`[data-i18n="${key}"]`);
      nodes.forEach((node) => {
        node.textContent = value;
      });
    });
  }

  function applyMediaOverrides() {
    const media = marketingContent?.media;
    if (!media || typeof media !== "object") {
      return;
    }

    MEDIA_FIELD_MAP.forEach(([id, key]) => {
      const node = document.getElementById(id);
      const value = media[key];
      if (!node || typeof value !== "string" || !value.trim()) {
        return;
      }
      node.src = value.trim();
    });
  }

  function applyLinkOverrides(lang) {
    const links = marketingContent?.links || {};
    const portal = resolvePortalLinks(links);

    PARENT_LINK_IDS.forEach((id) => setHrefById(id, portal.parent, lang));
    EDUCATOR_LINK_IDS.forEach((id) => setHrefById(id, portal.educator, lang));
    ADMIN_LINK_IDS.forEach((id) => setHrefById(id, portal.admin, lang));
    HOME_LINK_IDS.forEach((id) => setHrefById(id, portal.home, lang));

    if (typeof links.youtubeUrl === "string" && links.youtubeUrl.trim()) {
      const node = document.getElementById("cms-social-youtube");
      if (node) {
        node.href = links.youtubeUrl.trim();
      }
    }
    if (typeof links.facebookUrl === "string" && links.facebookUrl.trim()) {
      const node = document.getElementById("cms-social-facebook");
      if (node) {
        node.href = links.facebookUrl.trim();
      }
    }
    if (typeof links.instagramUrl === "string" && links.instagramUrl.trim()) {
      const node = document.getElementById("cms-social-instagram");
      if (node) {
        node.href = links.instagramUrl.trim();
      }
    }

    if (typeof links.contactEmail === "string" && links.contactEmail.trim()) {
      const value = links.contactEmail.trim();
      const emailNode = document.getElementById("cms-contact-email");
      if (emailNode) {
        emailNode.href = `mailto:${value}`;
        emailNode.textContent = value;
      }
    }
  }

  function applyMarketingContent(lang) {
    if (!marketingContent) {
      return;
    }
    applyTextOverrides(lang);
    applyMediaOverrides();
    applyLinkOverrides(lang);
  }

  async function loadMarketingContent() {
    try {
      const response = await fetch("/api/public/marketing-content", { method: "GET" });
      const data = await response.json();
      if (!response.ok || !data || typeof data !== "object") {
        return;
      }
      marketingContent =
        data && data.marketingContent && typeof data.marketingContent === "object"
          ? data.marketingContent
          : null;
      window.__XERIVO_MARKETING_CONTENT__ = marketingContent;
      window.dispatchEvent(new CustomEvent("xerivo:marketing-content-updated"));
      applyMarketingContent(getLanguage());
    } catch {
      // Keep static fallback content.
    }
  }

  function hookLanguageButtons() {
    const langEn = document.getElementById("lang-en");
    const langBn = document.getElementById("lang-bn");

    if (langEn) {
      langEn.addEventListener("click", () => {
        window.setTimeout(() => applyMarketingContent("en"), 0);
      });
    }
    if (langBn) {
      langBn.addEventListener("click", () => {
        window.setTimeout(() => applyMarketingContent("bn"), 0);
      });
    }
  }

  hookLanguageButtons();
  void loadMarketingContent();
})();
