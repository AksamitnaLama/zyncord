var THEMES = [
  {
    id: "default",
    name: "Default",
    preview: "linear-gradient(135deg, #1a1a2e, #16213e)",
    css: ""
  },
  {
    id: "red",
    name: "Red",
    preview: "linear-gradient(135deg, #3a0000, #7a0000)",
    css: "body { background: linear-gradient(135deg, #3a0000 0%, #7a0000 100%) !important; background-attachment: fixed !important; }"
  },
  {
    id: "green",
    name: "Green",
    preview: "linear-gradient(135deg, #003a1a, #007a3a)",
    css: "body { background: linear-gradient(135deg, #003a1a 0%, #007a3a 100%) !important; background-attachment: fixed !important; }"
  },
  {
    id: "clearvision",
    name: "ClearVision",
    preview: "linear-gradient(135deg, #1a2a4a, #2780e6)",
    css: "body { background: url(https://clearvision.github.io/images/sapphire.jpg) center/cover fixed !important; } :root { --main-color: #2780e6; --hover-color: #1e63b3; }"
  }
];

var TRANSPARENT_CLASSES = ".chat-area, .sidebar, .sidebar-left, .sidebar-left-bar, .main-content, .settings-container, .right-sidebar, .subchannel-header-info, .sidebar-left-bar-buttons, .group-info-header";

var EXTRA_TRANSPARENT = ".subchannel-header-info, .subchannel-header, .voice-on-other-bar, .voice-on-other-bar-content, .voice-panel-row, .voice-panel-channel-info, .voice-panel-inner, .voice-connection-panel { background: transparent !important; background-color: transparent !important; } body .subchannel-header-info, body .subchannel-header, body .voice-on-other-bar, body .voice-on-other-bar-content, body .voice-panel-row, body .voice-panel-channel-info, body .voice-panel-inner, body .voice-connection-panel { background: transparent !important; background-color: transparent !important; }";

function applyTheme(themeId) {
  var styleTag = document.getElementById("zynclist-theme-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "zynclist-theme-style";
    document.head.appendChild(styleTag);
  }
  var theme = THEMES.find(function(t) { return t.id === themeId; });
  if (!theme || theme.id === "default") {
    styleTag.textContent = "";
  } else {
    styleTag.textContent = theme.css + " " + TRANSPARENT_CLASSES + " { background: transparent !important; } " + EXTRA_TRANSPARENT;
  }
  localStorage.setItem("zynclist-theme", themeId);
  document.querySelectorAll(".zynclist-theme-card").forEach(function(c) {
    c.style.outline = c.dataset.themeId === themeId ? "2px solid #fff" : "none";
  });
}

function applySkipLoading(enabled) {
  var styleTag = document.getElementById("zyncord-skip-loading-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "zyncord-skip-loading-style";
    document.head.appendChild(styleTag);
  }
  if (enabled) {
    styleTag.textContent = "#loading-screen, .loading-screen, .animation-preloader { display: none !important; }";
    var el = document.querySelector(".animation-preloader") || document.getElementById("loading-screen");
    if (el) el.remove();
    if (!window.__zyncordPreloaderObserver) {
      window.__zyncordPreloaderObserver = new MutationObserver(function() {
        var preloader = document.querySelector(".animation-preloader") || document.getElementById("loading-screen");
        if (preloader) preloader.remove();
      });
      window.__zyncordPreloaderObserver.observe(document.body, { childList: true, subtree: true });
    }
  } else {
    styleTag.textContent = "";
    if (window.__zyncordPreloaderObserver) {
      window.__zyncordPreloaderObserver.disconnect();
      window.__zyncordPreloaderObserver = null;
    }
  }
}

function applyCustomCSS(css) {
  var tag = document.getElementById("zynclist-custom-css-style");
  if (!tag) {
    tag = document.createElement("style");
    tag.id = "zynclist-custom-css-style";
    document.head.appendChild(tag);
  }
  tag.textContent = css;
}

function injectButton() {
  var sidebar = document.querySelector(".sidebar-left-bar-buttons");
  if (!sidebar) return;
  if (document.getElementById("zynclist-btn")) return;

  var refBtn = document.getElementById("settings-btn") || sidebar.querySelector(".header-btn");
  var refStyle = refBtn ? window.getComputedStyle(refBtn) : null;
  var borderRadius = refStyle ? refStyle.borderRadius : "12px";
  var btnSize = refStyle ? refStyle.width : "44px";

  var btn = document.createElement("button");
  btn.id = "zynclist-btn";
  btn.setAttribute("style",
    "cursor:pointer;border:none;padding:6px;display:flex;align-items:center;" +
    "justify-content:center;width:" + btnSize + ";height:" + btnSize + ";" +
    "border-radius:" + borderRadius + ";box-sizing:border-box;" +
    "background:#2e2e2e !important;background-color:#2e2e2e !important;"
  );

  var label = document.createElement("span");
  label.textContent = "ZL";
  label.style.cssText = "font-size:12px;font-weight:700;color:#fff;letter-spacing:0.5px;";
  btn.appendChild(label);

  btn.addEventListener("click", function() {
    window.open("https://zynclist.xyz", "zynclist-popup", "width=1200,height=850,left=100,top=80,resizable=yes,scrollbars=yes");
  });

  sidebar.insertBefore(btn, sidebar.firstChild);
}

function buildThemesPanel(settingsMain) {
  var panel = document.createElement("div");
  panel.id = "zynclist-themes-panel";
  panel.style.cssText = "display:none;padding:24px 32px;";

  var saved = localStorage.getItem("zynclist-theme") || "default";

  var selectOptionsHtml = "";
  THEMES.forEach(function(t) {
    var selClass = saved === t.id ? ' selected' : '';
    selectOptionsHtml += '<div class="custom-select-option' + selClass + '" data-value="' + t.id + '">' + t.name + '</div>';
  });

  var savedName = THEMES.find(function(t) { return t.id === saved; });
  var displayName = savedName ? savedName.name : "Default";

  panel.innerHTML = [
    '<div class="settings-group">',
      '<label class="settings-label">',
        '<span class="label-text">Theme</span>',
      '</label>',
      '<div class="settings-select-wrapper">',
        '<div class="settings-select" id="zynclist-theme-display" style="pointer-events:auto;margin-top:0px;width:100%;box-sizing:border-box;cursor:pointer;">' + displayName + '</div>',
        '<div class="custom-select-dropdown" id="zynclist-theme-dropdown">' + selectOptionsHtml + '</div>',
      '</div>',
    '</div>',
    '<div class="settings-section-footer">',
      '<button class="settings-section-save settings-btn primary" id="zynclist-themes-save">',
        '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17,21 17,13 7,13 7,21"></polyline><polyline points="7,3 7,8 15,8"></polyline></svg>',
        'Save',
      '</button>',
    '</div>'
  ].join("");

  settingsMain.appendChild(panel);

  var display = panel.querySelector("#zynclist-theme-display");
  var dropdown = panel.querySelector("#zynclist-theme-dropdown");

  display.addEventListener("click", function(e) {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  dropdown.querySelectorAll(".custom-select-option").forEach(function(opt) {
    opt.addEventListener("click", function() {
      var val = opt.dataset.value;
      display.textContent = opt.textContent;
      dropdown.querySelectorAll(".custom-select-option").forEach(function(o) { o.classList.remove("selected"); });
      opt.classList.add("selected");
      dropdown.style.display = "none";
      applyTheme(val);
    });
  });

  document.addEventListener("click", function() { dropdown.style.display = "none"; });

  return panel;
}

function injectSettingsTab() {
  var settingsNav = document.querySelector(".settings-nav");
  if (!settingsNav) return;
  if (document.getElementById("zynclist-settings-tab")) return;

  var h2 = document.createElement("h2");
  h2.textContent = "Zynclista";

  var btn = document.createElement("button");
  btn.id = "zynclist-settings-tab";
  btn.className = "settings-nav-btn";

  var img = document.createElement("img");
  img.src = chrome.runtime.getURL("themes.png");
  img.alt = "Themes";
  img.style.cssText = "width:20px;height:20px;object-fit:contain;margin-right:8px;vertical-align:middle;";
  btn.appendChild(img);
  btn.appendChild(document.createTextNode("Themes"));

  btn.addEventListener("click", function() {
    document.querySelectorAll(".settings-nav-btn").forEach(function(b) { b.classList.remove("active"); });
    btn.classList.add("active");

    var settingsMain = document.querySelector(".settings-main");
    if (!settingsMain) return;

    var title = document.getElementById("settings-global-title");
    var subtitle = document.getElementById("settings-global-subtitle");
    if (title) title.textContent = "Themes";
    if (subtitle) subtitle.textContent = "Choose a color theme for the interface";

    var footerDesc = document.getElementById("settings-footer-section-desc");
    if (footerDesc) footerDesc.textContent = "Bring your own look to the app!";

    document.querySelectorAll(".settings-section.active").forEach(function(s) { s.classList.remove("active"); });
    var nativeThemes = document.getElementById("themes-section");
    if (nativeThemes) nativeThemes.classList.remove("active");
    var zyncordPanel = document.getElementById("zynclist-zyncord-panel");
    if (zyncordPanel) zyncordPanel.style.display = "none";

    var panel = document.getElementById("zynclist-themes-panel");
    if (!panel) panel = buildThemesPanel(document.querySelector(".settings-content") || settingsMain);
    panel.style.display = "block";
  });

  settingsNav.addEventListener("click", function(e) {
    var clicked = e.target.closest(".settings-nav-btn");
    if (!clicked || clicked.id === "zynclist-settings-tab") return;
    var panel = document.getElementById("zynclist-themes-panel");
    if (panel) panel.style.display = "none";
    var zyncordPanel = document.getElementById("zynclist-zyncord-panel");
    if (zyncordPanel && clicked.id !== "zynclist-zyncord-tab") zyncordPanel.style.display = "none";
    var footerDesc = document.getElementById("settings-footer-section-desc");
    if (footerDesc) footerDesc.textContent = "";
  });

  settingsNav.appendChild(h2);

  var zyncordBtn = document.createElement("button");
  zyncordBtn.id = "zynclist-zyncord-tab";
  zyncordBtn.className = "settings-nav-btn";
  zyncordBtn.appendChild(document.createTextNode("Zyncord"));

  zyncordBtn.addEventListener("click", function() {
    document.querySelectorAll(".settings-nav-btn").forEach(function(b) { b.classList.remove("active"); });
    zyncordBtn.classList.add("active");

    var settingsMain = document.querySelector(".settings-main");
    if (!settingsMain) return;

    var title = document.getElementById("settings-global-title");
    var subtitle = document.getElementById("settings-global-subtitle");
    if (title) title.textContent = "Zyncord";
    if (subtitle) subtitle.textContent = "Zyncord options";

    var footerDesc = document.getElementById("settings-footer-section-desc");
    if (footerDesc) footerDesc.textContent = "Customize your Zynced experience.";

    document.querySelectorAll(".settings-section.active").forEach(function(s) { s.classList.remove("active"); });
    var themesPanel = document.getElementById("zynclist-themes-panel");
    if (themesPanel) themesPanel.style.display = "none";

    var zyncordPanel = document.getElementById("zynclist-zyncord-panel");
    if (!zyncordPanel) {
      zyncordPanel = document.createElement("div");
      zyncordPanel.id = "zynclist-zyncord-panel";
      zyncordPanel.style.cssText = "padding:24px 32px;";

      var skipLoading = localStorage.getItem("zyncord-skip-loading") === "true";

      zyncordPanel.innerHTML = [
        '<div class="settings-group">',
          '<label class="settings-label">',
            '<span class="label-text">Ukryj ekran \u0142adowania strony</span>',
            '<span class="label-description">Ukrywa ekran \u0142adowania aplikacji</span>',
          '</label>',
          '<div style="display:flex;align-items:center;gap:12px;margin-top:10px;">',
            '<div id="zyncord-skip-loading-toggle" style="width:44px;height:24px;border-radius:12px;cursor:pointer;position:relative;transition:background 0.2s;background:' + (skipLoading ? '#5865f2' : '#555') + ';">',
              '<div style="position:absolute;top:3px;left:' + (skipLoading ? '23px' : '3px') + ';width:18px;height:18px;border-radius:50%;background:#fff;transition:left 0.2s;"></div>',
            '</div>',
            '<span id="zyncord-skip-loading-label" style="font-size:14px;">' + (skipLoading ? "Enabled" : "Disabled") + '</span>',
          '</div>',
        '</div>'
      ].join("");

      var settingsContent = document.querySelector(".settings-content") || settingsMain;
      settingsContent.appendChild(zyncordPanel);

      var toggle = zyncordPanel.querySelector("#zyncord-skip-loading-toggle");
      var label = zyncordPanel.querySelector("#zyncord-skip-loading-label");
      var dot = toggle.querySelector("div");
      var isEnabled = localStorage.getItem("zyncord-skip-loading") === "true";

      toggle.addEventListener("click", function() {
        isEnabled = !isEnabled;
        localStorage.setItem("zyncord-skip-loading", isEnabled);
        toggle.style.background = isEnabled ? "#5865f2" : "#555";
        dot.style.left = isEnabled ? "23px" : "3px";
        label.textContent = isEnabled ? "Enabled" : "Disabled";
        applySkipLoading(isEnabled);
      });

      if (skipLoading) applySkipLoading(true);
    }

    zyncordPanel.style.display = "block";
  });

  settingsNav.appendChild(zyncordBtn);
  settingsNav.appendChild(btn);

  var githubBtn = document.createElement("button");
  githubBtn.id = "zynclist-github-tab";
  githubBtn.className = "settings-nav-btn";

  var githubImg = document.createElement("img");
  githubImg.src = chrome.runtime.getURL("github.png");
  githubImg.alt = "Github";
  githubImg.style.cssText = "width:20px;height:20px;object-fit:contain;margin-right:8px;vertical-align:middle;";
  githubBtn.appendChild(githubImg);
  githubBtn.appendChild(document.createTextNode("Github"));

  githubBtn.addEventListener("click", function() {
    window.open("https://github.com/grupha-hakerska-pirahow", "_blank");
  });

  settingsNav.appendChild(githubBtn);
}

var observer = new MutationObserver(function() {
  injectButton();
  injectSettingsTab();
});
observer.observe(document.body, { childList: true, subtree: true });
injectButton();
injectSettingsTab();

(function() {
  var saved = localStorage.getItem("zynclist-theme");
  if (saved && saved !== "default") applyTheme(saved);
  var savedCss = localStorage.getItem("zynclist-custom-css");
  if (savedCss) applyCustomCSS(savedCss);
  if (localStorage.getItem("zyncord-skip-loading") === "true") applySkipLoading(true);
})();
