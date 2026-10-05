/* Ortak site betiği: "Tüm projeler" menüsü, altbilgi proje şeridi, kök kartlar, dil tercihi, lightbox.
   Bağımlılık yok. assets/projects.js'ten SONRA (defer sırası) yüklenir. */
(function () {
  "use strict";
  var doc = document, html = doc.documentElement;
  var LANG = (html.lang || "tr").slice(0, 2) === "en" ? "en" : "tr";
  var EN = LANG === "en";
  var T = EN
    ? {all: "All projects", home: "All projects (home)", foot: "All projects", close: "Close", prev: "Previous", next: "Next", dlg: "Image viewer", tr: "Turkish", en: "English"}
    : {all: "Tüm projeler", home: "Tüm projeler (ana sayfa)", foot: "Tüm projeler", close: "Kapat", prev: "Önceki", next: "Sonraki", dlg: "Görsel görüntüleyici", tr: "Türkçe", en: "English"};

  /* Site kökü: bu betiğin adresinden (…/assets/site.js) türetilir. */
  var scr = doc.currentScript || (function () {
    var s = doc.querySelectorAll("script[src*='site.js']"); return s[s.length - 1];
  })();
  var ROOT = scr && scr.src ? new URL("../", scr.src).href : new URL("./", location.href).href;
  function rootUrl(p) { return new URL(p, ROOT).href; }
  function el(tag, attrs, kids) {
    var e = doc.createElement(tag), k;
    for (k in (attrs || {})) { if (k === "text") e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }
  var P = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
  function pName(p) { return (EN ? p.en : p.tr) || p.tr; }
  function pHref(p) { return rootUrl(p.path + (EN ? "en.html" : "")); }
  function isCurrent(p) {
    var path = location.pathname, base = new URL(p.path, ROOT).pathname;
    return path.indexOf(base) === 0;
  }
  function homeHref() { return rootUrl(EN ? "en.html" : "./"); }

  /* Dil tercihi (yalnızca kaydedilir; zorla yönlendirme yok). */
  function saveLang(l) { try { localStorage.setItem("ps-lang", l); } catch (e) {} }
  Array.prototype.forEach.call(doc.querySelectorAll(".ps-lang a"), function (a) {
    a.addEventListener("click", function () { saveLang(a.getAttribute("hreflang") || (a.lang === "en" ? "en" : "tr")); });
  });

  /* "Tüm projeler" açılır menüsü. */
  var menuN = 0;
  function enhanceMenu(box) {
    if (!P.length) return;
    var id = "ps-menu-list-" + (++menuN);
    var btn = el("button", {type: "button", "class": "ps-menu-btn", "aria-expanded": "false", "aria-haspopup": "true", "aria-controls": id, text: T.all});
    var ul = el("ul", {"class": "ps-menu-list", id: id, hidden: ""});
    var li = el("li"); li.appendChild(el("a", {href: homeHref(), text: T.home})); ul.appendChild(li);
    ul.appendChild(el("li", {"class": "ps-sep", role: "separator"}));
    P.forEach(function (p) {
      var a = el("a", {href: pHref(p)}, [el("img", {src: rootUrl(p.icon), alt: "", width: "28", height: "28", loading: "lazy"}), el("span", {text: pName(p)})]);
      if (isCurrent(p)) a.setAttribute("aria-current", "page");
      var item = el("li"); item.appendChild(a); ul.appendChild(item);
    });
    box.textContent = ""; box.appendChild(btn); box.appendChild(ul);
    function items() { return Array.prototype.slice.call(ul.querySelectorAll("a")); }
    function open() { ul.hidden = false; btn.setAttribute("aria-expanded", "true"); }
    function close(back) { ul.hidden = true; btn.setAttribute("aria-expanded", "false"); if (back) btn.focus(); }
    btn.addEventListener("click", function () { ul.hidden ? open() : close(); });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); open(); items()[0].focus(); }
    });
    ul.addEventListener("keydown", function (e) {
      var it = items(), i = it.indexOf(doc.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); it[(i + 1) % it.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); it[(i - 1 + it.length) % it.length].focus(); }
      else if (e.key === "Home") { e.preventDefault(); it[0].focus(); }
      else if (e.key === "End") { e.preventDefault(); it[it.length - 1].focus(); }
    });
    box.addEventListener("keydown", function (e) { if (e.key === "Escape" && !ul.hidden) { e.stopPropagation(); close(true); } });
    doc.addEventListener("click", function (e) { if (!box.contains(e.target)) close(); });
    box.addEventListener("focusout", function (e) { if (e.relatedTarget && !box.contains(e.relatedTarget)) close(); });
  }
  Array.prototype.forEach.call(doc.querySelectorAll(".ps-menu"), enhanceMenu);

  /* Altbilgi proje şeridi. */
  Array.prototype.forEach.call(doc.querySelectorAll("[data-ps-footer]"), function (box) {
    if (!P.length) return;
    var ul = el("ul");
    P.forEach(function (p) {
      var a = el("a", {href: pHref(p), title: p.short ? (EN ? p.short.en : p.short.tr) : ""}, [el("img", {src: rootUrl(p.icon), alt: "", width: "26", height: "26", loading: "lazy"}), el("span", {text: pName(p)})]);
      if (isCurrent(p)) a.setAttribute("aria-current", "page");
      var li = el("li"); li.appendChild(a); ul.appendChild(li);
    });
    box.textContent = "";
    box.appendChild(el("p", {"class": "ps-foot-t", text: T.foot}));
    box.appendChild(ul);
  });

  /* Kök sayfadaki kartlar (liste tek yerden). */
  Array.prototype.forEach.call(doc.querySelectorAll("[data-ps-grid]"), function (grid) {
    if (!P.length) return;
    grid.textContent = "";
    P.forEach(function (p) {
      var info = el("div", {}, [
        el("h2", {text: pName(p)}),
        el("p", {text: p.short ? (EN ? p.short.en : p.short.tr) : ""}),
        el("a", {href: rootUrl(p.path), hreflang: "tr", lang: "tr", text: "Türkçe"}),
        el("a", {href: rootUrl(p.path + "en.html"), hreflang: "en", lang: "en", text: "English"})
      ]);
      grid.appendChild(el("article", {"class": "card"}, [el("img", {src: rootUrl(p.icon), alt: pName(p) + (EN ? " icon" : " simgesi"), width: "84", height: "84"}), info]));
    });
  });

  /* Lightbox. */
  var lb, imgEl, cntEl, capEl, items = [], cur = 0, opener = null, bound = false;
  function isImgUrl(u) { return /\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/i.test(u || ""); }
  function build() {
    if (lb) return;
    var x = el("button", {type: "button", "class": "ps-lb-x", "aria-label": T.close, text: "×"});
    var pv = el("button", {type: "button", "class": "ps-lb-p", "aria-label": T.prev, text: "‹"});
    var nx = el("button", {type: "button", "class": "ps-lb-n", "aria-label": T.next, text: "›"});
    imgEl = el("img", {"class": "ps-lb-img", alt: "", draggable: "false"});
    cntEl = el("span", {"class": "ps-lb-cnt"}); capEl = el("span", {"class": "ps-lb-cap"});
    var stage = el("div", {"class": "ps-lb-stage"}, [imgEl]);
    var bar = el("div", {"class": "ps-lb-bar", "aria-live": "polite"}, [cntEl, capEl]);
    lb = el("div", {"class": "ps-lb", role: "dialog", "aria-modal": "true", "aria-label": T.dlg, hidden: ""}, [stage, bar, pv, nx, x]);
    doc.body.appendChild(lb);
    x.addEventListener("click", close); pv.addEventListener("click", function () { go(-1); }); nx.addEventListener("click", function () { go(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target === stage) close(); });
    var sx = null, sy = null;
    stage.addEventListener("touchstart", function (e) { if (e.touches.length === 1) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } }, {passive: true});
    stage.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1);
    }, {passive: true});
  }
  function show() {
    var it = items[cur];
    imgEl.src = it.src; imgEl.alt = it.cap;
    cntEl.textContent = (cur + 1) + " / " + items.length;
    capEl.textContent = it.cap;
    lb.classList.toggle("ps-lb-one", items.length < 2);
    [cur + 1, cur - 1].forEach(function (i) { if (items[i]) { new Image().src = items[i].src; } });
  }
  function go(d) { if (items.length < 2) return; cur = (cur + d + items.length) % items.length; show(); }
  function focusables() { return Array.prototype.filter.call(lb.querySelectorAll("button"), function (b) { return b.offsetParent !== null || getComputedStyle(b).display !== "none"; }); }
  function onKey(e) {
    if (!lb || lb.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "Tab") {
      var f = focusables(); if (!f.length) return;
      var i = f.indexOf(doc.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      else if (i === -1) { e.preventDefault(); f[0].focus(); }
    }
  }
  function open(group, idx, trigger) {
    build();
    items = group; cur = idx; opener = trigger;
    lb.hidden = false; doc.body.classList.add("ps-noscroll"); html.classList.add("ps-noscroll");
    if (!bound) { doc.addEventListener("keydown", onKey, true); bound = true; }
    show();
    lb.querySelector(".ps-lb-x").focus();
  }
  function close() {
    if (!lb || lb.hidden) return;
    lb.hidden = true; imgEl.removeAttribute("src");
    doc.body.classList.remove("ps-noscroll"); html.classList.remove("ps-noscroll");
    if (opener && opener.focus) opener.focus();
    opener = null;
  }
  function groupOf(container) {
    return Array.prototype.map.call(container.querySelectorAll("img"), function (img) {
      var a = img.closest("a");
      var src = img.getAttribute("data-full") || (a && isImgUrl(a.getAttribute("href")) ? a.href : "") || img.currentSrc || img.src;
      var fig = img.closest("figure"), fc = fig && fig.querySelector("figcaption");
      return {src: src, cap: img.alt || (fc && fc.textContent.trim()) || "", node: a || img};
    });
  }
  doc.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var img = e.target.closest && e.target.closest("[data-lightbox] img");
    if (!img) {
      var link = e.target.closest && e.target.closest("[data-lightbox] a");
      img = link && link.querySelector("img");
    }
    if (!img) return;
    var container = img.closest("[data-lightbox]");
    var a = img.closest("a"); if (a) { e.preventDefault(); a.removeAttribute("target"); }
    var g = groupOf(container), idx = 0;
    g.forEach(function (it, i) { if (it.node === (a || img)) idx = i; });
    open(g, idx, a || img);
  });
  Array.prototype.forEach.call(doc.querySelectorAll("[data-lightbox] a[target]"), function (a) { a.removeAttribute("target"); });
  Array.prototype.forEach.call(doc.querySelectorAll("[data-lightbox] a"), function (a) {
    if (!a.hasAttribute("aria-haspopup")) a.setAttribute("aria-haspopup", "dialog");
  });
})();
