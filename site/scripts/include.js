/* =============================================================================
   include.js — header/footer injection + active-nav + config binding.
   Requires config.js to be loaded first (window.SHUHARI).
   NOTE: uses fetch() for partials, so the site MUST be served over HTTP
   (e.g. `python3 -m http.server 8000`); it will not work from file://.
   ========================================================================== */
(function () {
  "use strict";

  const C = window.SHUHARI || {};

  /* ---- helpers ----------------------------------------------------------- */
  // Resolve a possibly-dotted key path against an object: "links.sachet".
  function deepGet(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  }

  // Normalise a path for active-nav comparison ("/" and "" => index.html).
  function currentPage() {
    let p = window.location.pathname.split("/").pop();
    if (!p || p === "") p = "index.html";
    return p.toLowerCase();
  }

  /* ---- nav builder ------------------------------------------------------- */
  function buildNav(scope) {
    const list = scope.querySelector("[data-nav]");
    if (!list || !Array.isArray(C.nav)) return;
    const here = currentPage();
    const frag = document.createDocumentFragment();

    C.nav.forEach((item) => {
      if (item.disabled) return; // e.g. Investor Relations hook — left off until enabled
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "nav__link";
      a.href = item.href;
      a.textContent = item.label;
      const target = item.href.split("/").pop().toLowerCase();
      if (target === here) {
        a.setAttribute("aria-current", "page");
      }
      li.appendChild(a);
      frag.appendChild(li);
    });
    list.appendChild(frag);
  }

  /* ---- config binding (data-cfg / data-cfg-href) ------------------------- */
  function bindConfig(scope) {
    scope.querySelectorAll("[data-cfg]").forEach((el) => {
      const val = deepGet(C, el.getAttribute("data-cfg"));
      if (val != null && val !== "") el.textContent = val;
    });
    scope.querySelectorAll("[data-cfg-href]").forEach((el) => {
      const val = deepGet(C, el.getAttribute("data-cfg-href"));
      if (val) el.setAttribute("href", val);
    });
    // data-cfg-mailto: same, but wraps a config e-mail address as a mailto: link.
    scope.querySelectorAll("[data-cfg-mailto]").forEach((el) => {
      const val = deepGet(C, el.getAttribute("data-cfg-mailto"));
      if (val && !/\[TO BE UPDATED\]/.test(val)) el.setAttribute("href", "mailto:" + val);
    });
    // Wrap unfilled [TO BE UPDATED] config values so they read as placeholders.
    scope.querySelectorAll('[data-cfg]').forEach((el) => {
      if (/\[TO BE UPDATED\]/.test(el.textContent)) {
        el.classList.add("placeholder");
      }
    });
    // Current year (no Date dependency issues client-side).
    scope.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---- hamburger --------------------------------------------------------- */
  function wireNavToggle(scope) {
    const toggle = scope.querySelector(".nav-toggle");
    const nav = scope.querySelector(".nav");
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    // Close on nav link click (mobile) and on Escape.
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ---- injection --------------------------------------------------------- */
  async function inject(id, url, after) {
    const mount = document.getElementById(id);
    if (!mount) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status + " " + res.statusText);
      mount.innerHTML = await res.text();
      if (typeof after === "function") after(mount);
    } catch (err) {
      // Most common cause: opened via file:// instead of over HTTP.
      console.error("include.js: failed to load " + url + " —", err);
      mount.innerHTML =
        '<div style="padding:1rem;background:#FBEAE7;color:#a3331f;' +
        'font-family:sans-serif;font-size:.85rem">Could not load ' + id +
        '. Serve this site over HTTP (e.g. <code>python3 -m http.server 8000</code>).</div>';
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Bind config-driven facts in the static page content (data-cfg / data-cfg-href
    // in <main>) so no CIN/CoR/address is hard-coded scattered across pages.
    bindConfig(document);

    inject("site-header", "/partials/header.html", (scope) => {
      buildNav(scope);
      wireNavToggle(scope);
    });
    inject("site-footer", "/partials/footer.html", (scope) => {
      bindConfig(scope);
    });
  });
})();
