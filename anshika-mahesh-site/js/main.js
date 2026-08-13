(function () {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const form = document.querySelector("[data-newsletter-form]");
  const success = document.querySelector("[data-newsletter-success]");
  if (form && success) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = form.querySelector('input[type="email"]');
      if (!email || !email.value.trim()) return;
      success.classList.add("is-visible");
      form.reset();
    });
  }

  initStoryBook();
})();

function initStoryBook() {
  const book = document.querySelector("main.book");
  if (!book) return;
  let sourcePages;
  try {
    sourcePages = Array.prototype.slice.call(book.querySelectorAll(":scope > .page"));
  } catch (err) {
    sourcePages = Array.prototype.filter.call(book.children, function (el) {
      return el.classList && el.classList.contains("page");
    });
  }
  if (sourcePages.length < 2) return;

  Array.prototype.forEach.call(book.querySelectorAll("img"), function (img) {
    img.loading = "eager";
  });

  injectBookCss();
  document.body.classList.add("is-book-reader");

  const stage = document.createElement("div");
  stage.className = "book-stage";
  stage.innerHTML =
    '<div class="hardback" role="region" aria-label="Open book. Click the right page to turn forward, the left page to turn back.">' +
      '<div class="leaf leaf-left"><div class="leaf-inner"></div><span class="page-num"></span></div>' +
      '<div class="spine" aria-hidden="true"></div>' +
      '<div class="leaf leaf-right"><div class="leaf-inner"></div><span class="page-num"></span></div>' +
      '<div class="flipper" aria-hidden="true">' +
        '<div class="flip-face flip-front"><div class="leaf-inner"></div></div>' +
        '<div class="flip-face flip-back"><div class="leaf-inner"></div></div>' +
      "</div>" +
    "</div>" +
    '<div class="book-chrome">' +
      '<button type="button" class="book-nav" data-book-prev aria-label="Previous pages">‹</button>' +
      '<p class="book-folio" data-folio></p>' +
      '<button type="button" class="book-nav" data-book-next aria-label="Next pages">›</button>' +
    "</div>" +
    '<p class="book-hint">Click a page to flip · left page back, right page forward</p>';

  book.parentNode.insertBefore(stage, book);

  const hardback = stage.querySelector(".hardback");
  const leftEl = stage.querySelector(".leaf-left");
  const rightEl = stage.querySelector(".leaf-right");
  const flipper = stage.querySelector(".flipper");
  const folio = stage.querySelector("[data-folio]");
  const prevBtn = stage.querySelector("[data-book-prev]");
  const nextBtn = stage.querySelector("[data-book-next]");

  let leaves = [];
  let idToLeaf = {};
  let spread = 0;
  let totalSpreads = 1;
  let flipping = false;

  function leftIndex(si) { return si * 2 - 1; }
  function rightIndex(si) { return si * 2; }

  function fillLeaf(el, leafIndex) {
    const inner = el.querySelector(".leaf-inner");
    const num = el.querySelector(".page-num");
    el.classList.remove("is-blank", "is-cover", "is-cover-bleed", "has-picture");
    inner.style.fontSize = "";
    if (leafIndex < 0 || leafIndex >= leaves.length) {
      inner.innerHTML = "";
      num.textContent = "";
      el.classList.add("is-blank");
      return;
    }
    const leaf = leaves[leafIndex];
    if (leaf.cover) {
      el.classList.add("is-cover");
      if (leaf.html.indexOf("cover-hero") !== -1) el.classList.add("is-cover-bleed");
    }
    inner.innerHTML = leaf.html;
    if (inner.querySelector("figure, .illust, .gallery")) el.classList.add("has-picture");
    num.textContent = String(leafIndex + 1);
  }

  function paint(si) {
    fillLeaf(leftEl, leftIndex(si));
    fillLeaf(rightEl, rightIndex(si));
    const a = leftIndex(si);
    const b = rightIndex(si);
    const nums = [];
    if (a >= 0 && a < leaves.length) nums.push(a + 1);
    if (b >= 0 && b < leaves.length) nums.push(b + 1);
    folio.textContent = nums.length
      ? "Pages " + nums.join("–") + " of " + leaves.length
      : "";
    prevBtn.disabled = si === 0;
    nextBtn.disabled = si === totalSpreads - 1;
  }

  function spreadFromLeaf(leafIndex) {
    return Math.floor((leafIndex + 1) / 2);
  }

  function spreadFromHash() {
    const hash = (location.hash || "").replace("#", "");
    if (!hash) return 0;
    if (Object.prototype.hasOwnProperty.call(idToLeaf, hash)) {
      return spreadFromLeaf(idToLeaf[hash]);
    }
    const target = document.getElementById(hash);
    if (!target) return 0;
    const page = target.classList.contains("page") ? target : target.closest(".page");
    const i = sourcePages.indexOf(page);
    if (i < 0) return 0;
    const id = page.id;
    if (id && Object.prototype.hasOwnProperty.call(idToLeaf, id)) {
      return spreadFromLeaf(idToLeaf[id]);
    }
    return 0;
  }

  function go(dir) {
    if (flipping) return;
    const next = spread + dir;
    if (next < 0 || next >= totalSpreads) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      spread = next;
      paint(spread);
      return;
    }

    flipping = true;
    const front = flipper.querySelector(".flip-front .leaf-inner");
    const back = flipper.querySelector(".flip-back .leaf-inner");

    if (dir > 0) {
      front.innerHTML = rightEl.querySelector(".leaf-inner").innerHTML;
      const upcoming = leftIndex(next);
      back.innerHTML = upcoming >= 0 && upcoming < leaves.length ? leaves[upcoming].html : "";
      fillLeaf(rightEl, rightIndex(next));
      flipper.className = "flipper is-forward";
    } else {
      front.innerHTML = leftEl.querySelector(".leaf-inner").innerHTML;
      const upcoming = rightIndex(next);
      back.innerHTML = upcoming >= 0 && upcoming < leaves.length ? leaves[upcoming].html : "";
      fillLeaf(leftEl, leftIndex(next));
      flipper.className = "flipper is-back";
    }

    function finish() {
      if (!flipping) return;
      flipping = false;
      flipper.className = "flipper";
      spread = next;
      paint(spread);
    }
    flipper.addEventListener("animationend", finish, { once: true });
    window.setTimeout(finish, 780);
  }

  function setPageMetrics() {
    const sample = rightEl.querySelector(".leaf-inner");
    const h = sample.clientHeight;
    const w = sample.clientWidth;
    hardback.style.setProperty("--leaf-h", h + "px");
    hardback.style.setProperty("--img-max", Math.max(110, Math.round(h * 0.4)) + "px");
    hardback.style.setProperty("--cover-img-max", Math.max(150, Math.round(h * 0.54)) + "px");
    return { h: h, w: w };
  }

  function paginate() {
    const metrics = setPageMetrics();
    const maxH = metrics.h;
    const maxW = metrics.w;
    if (maxH < 80) {
      const map = {};
      const list = sourcePages.map(function (src, i) {
        if (src.id) map[src.id] = i;
        return fallbackLeaf(src);
      });
      return { leaves: list, idToLeaf: map };
    }

    const sizer = sampleClone(rightEl.querySelector(".leaf-inner"), maxW, maxH);
    rightEl.appendChild(sizer);

    const out = [];
    const map = {};

    function overflows() {
      return sizer.scrollHeight - sizer.clientHeight > 6;
    }

    function isHeading(el) {
      return el && el.classList && el.classList.contains("chapter-head");
    }
    function isMedia(el) {
      if (!el || el.nodeType !== 1) return false;
      if (el.tagName === "FIGURE" || el.tagName === "IMG") return true;
      return el.classList.contains("illust") || el.classList.contains("gallery") ||
        el.classList.contains("cover-photo") || el.classList.contains("cover-hero");
    }
    function listHost(el) {
      if (!el || el.nodeType !== 1) return null;
      if (el.tagName === "OL" || el.tagName === "UL") return el;
      if (el.classList.contains("cast") && el.children.length > 1) return el;
      return null;
    }
    function flush() {
      if (!sizer.innerHTML.trim()) return;
      out.push({ html: sizer.innerHTML, cover: false });
      sizer.innerHTML = "";
    }
    function splitHost(host) {
      const items = Array.prototype.slice.call(host.children);
      if (items.length < 2) return;
      const tag = host.tagName;
      const cls = host.className;
      host.innerHTML = "";
      let current = host;
      items.forEach(function (item) {
        current.appendChild(item);
        if (sizer.scrollHeight - sizer.clientHeight > 6 && current.children.length > 1) {
          current.removeChild(item);
          flush();
          current = document.createElement(tag);
          current.className = cls;
          sizer.appendChild(current);
          current.appendChild(item);
        }
      });
    }

    sourcePages.forEach(function (src) {
      const isCover = src.classList.contains("cover");
      const sid = src.id || "";
      const start = out.length;
      if (sid) map[sid] = start;

      const kids = Array.prototype.filter.call(src.children, function (ch) {
        return !ch.classList.contains("page-num");
      });

      if (isCover) {
        sizer.innerHTML = "";
        kids.forEach(function (ch) { sizer.appendChild(ch.cloneNode(true)); });
        out.push({ html: sizer.innerHTML, cover: true });
        return;
      }

      sizer.innerHTML = "";
      kids.forEach(function (ch) {
        const clone = ch.cloneNode(true);
        sizer.appendChild(clone);
        if (!overflows()) return;

        const host = listHost(clone);
        const glued = sizer.children.length === 2 && isHeading(sizer.children[0]) && isMedia(clone);
        if (glued) return;

        if (sizer.children.length === 1) {
          if (host) splitHost(host);
          return;
        }

        sizer.removeChild(clone);
        flush();
        sizer.appendChild(clone);
        if (overflows()) {
          const again = listHost(clone);
          if (again) splitHost(again);
        }
      });
      flush();
    });

    let i = 0;
    while (i < out.length - 1) {
      if (out[i].cover) { i += 1; continue; }
      const probe = document.createElement("div");
      probe.innerHTML = out[i].html;
      const bits = Array.prototype.filter.call(probe.children, function (el) {
        return (el.textContent && el.textContent.trim()) || el.querySelector("img");
      });
      const lonelyHead = bits.length === 1 && bits[0].classList.contains("chapter-head");
      if (lonelyHead) {
        sizer.innerHTML = out[i].html + out[i + 1].html;
        if (!overflows()) {
          out[i].html = sizer.innerHTML;
          out.splice(i + 1, 1);
          continue;
        }
      }
      i += 1;
    }

    sizer.parentNode.removeChild(sizer);
    return { leaves: out, idToLeaf: map };
  }

  function sampleClone(sample, maxW, maxH) {
    const sizer = sample.cloneNode(false);
    sizer.className = "leaf-inner leaf-sizer";
    sizer.style.width = maxW + "px";
    sizer.style.height = maxH + "px";
    sizer.style.position = "absolute";
    sizer.style.visibility = "hidden";
    sizer.style.pointerEvents = "none";
    sizer.style.display = "block";
    sizer.style.overflow = "hidden";
    sizer.style.left = "0";
    sizer.style.top = "0";
    return sizer;
  }

  function fallbackLeaf(src) {
    const wrap = document.createElement("div");
    Array.prototype.forEach.call(src.children, function (ch) {
      if (!ch.classList.contains("page-num")) wrap.appendChild(ch.cloneNode(true));
    });
    return { html: wrap.innerHTML, cover: src.classList.contains("cover") };
  }

  function waitForImages(root) {
    const imgs = Array.prototype.slice.call(root.querySelectorAll("img"));
    if (!imgs.length) return Promise.resolve();
    const loaded = Promise.all(imgs.map(function (img) {
      if (img.complete) return Promise.resolve();
      return new Promise(function (resolve) {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    }));
    const timeout = new Promise(function (resolve) {
      window.setTimeout(resolve, 900);
    });
    return Promise.race([loaded, timeout]);
  }

  let started = false;
  function rebuild() {
    const packed = paginate();
    leaves = packed.leaves.length ? packed.leaves : sourcePages.map(fallbackLeaf);
    idToLeaf = packed.idToLeaf;
    totalSpreads = Math.max(1, Math.ceil((leaves.length + 1) / 2));
    if (spread >= totalSpreads) spread = totalSpreads - 1;
    paint(spread);
  }
  function start() {
    if (started) return;
    started = true;
    rebuild();
    spread = spreadFromHash();
    paint(spread);
  }

  hardback.addEventListener("click", function (event) {
    if (event.target.closest("a, button, input, textarea, select, label")) return;
    const rect = hardback.getBoundingClientRect();
    go(event.clientX - rect.left < rect.width / 2 ? -1 : 1);
  });

  prevBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    go(-1);
  });
  nextBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    go(1);
  });

  document.addEventListener("keydown", function (event) {
    if (event.target.closest("input, textarea, select")) return;
    if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      go(-1);
    }
  });

  document.addEventListener("click", function (event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = (link.getAttribute("href") || "").slice(1);
    if (!id || !Object.prototype.hasOwnProperty.call(idToLeaf, id)) return;
    event.preventDefault();
    spread = spreadFromLeaf(idToLeaf[id]);
    paint(spread);
  });

  let touchX = 0;
  hardback.addEventListener("touchstart", function (event) {
    touchX = event.changedTouches[0].clientX;
  }, { passive: true });
  hardback.addEventListener("touchend", function (event) {
    const dx = event.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) < 50) return;
    go(dx < 0 ? 1 : -1);
  }, { passive: true });

  window.addEventListener("hashchange", function () {
    spread = spreadFromHash();
    paint(spread);
  });

  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(start);
  });
  waitForImages(book).then(function () {
    if (!started) start();
    else rebuild();
  }).catch(start);
  window.setTimeout(function () {
    if (!started) start();
    else rebuild();
  }, 800);

  let resizeT;
  window.addEventListener("resize", function () {
    if (!started) return;
    window.clearTimeout(resizeT);
    resizeT = window.setTimeout(rebuild, 180);
  });
}

function injectBookCss() {
  if (document.getElementById("book-reader-css")) return;
  const style = document.createElement("style");
  style.id = "book-reader-css";
  style.textContent = [
    "body.is-book-reader{height:100vh;overflow:hidden;display:flex;flex-direction:column}",
    "body.is-book-reader .site-header{position:relative;flex:0 0 auto;z-index:4}",
    "body.is-book-reader .site-footer{display:none}",
    "body.is-book-reader main.book{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;overflow:hidden!important;margin:0!important}",
    "body.is-book-reader .book-tools{flex:0 0 auto;position:relative;z-index:5;width:min(980px,calc(100vw - 1.5rem));margin:0 auto;padding:.45rem .6rem .35rem;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:.45rem .7rem}",
    "body.is-book-reader .book-tools a{padding:.28rem .75rem;border-radius:999px;background:#fffdf9;border:1px solid rgba(28,36,48,.12);line-height:1.2}",
    ".book-stage{flex:1 1 auto;min-height:0;height:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.45rem;padding:0 .75rem .45rem}",
    ".hardback{width:min(980px,calc(100vw - 1.5rem));height:min(620px,calc(100% - 92px));flex:0 0 auto;display:grid;grid-template-columns:1fr 8px 1fr;position:relative;perspective:2200px;border-radius:5px 10px 10px 5px;background:#3a2a1c;box-shadow:0 22px 48px rgba(40,28,18,.32),0 0 0 1px rgba(60,40,20,.25);cursor:pointer}",
    ".spine{background:linear-gradient(90deg,#24160e,#6a4a34 45%,#24160e);box-shadow:inset 0 0 8px rgba(0,0,0,.45)}",
    ".leaf{position:relative;height:100%;overflow:hidden;background:#fbf7ee}",
    ".leaf-left{border-radius:4px 0 0 4px;background:linear-gradient(90deg,transparent 82%,rgba(40,30,20,.1)),#fbf7ee}",
    ".leaf-right{border-radius:0 8px 8px 0;background:linear-gradient(90deg,rgba(40,30,20,.1),transparent 18%),#fbf7ee}",
    ".leaf.is-blank{background:#ebe2d2}",
    ".leaf-inner{height:100%;min-height:0;overflow:hidden;padding:1.05rem 1.1rem 2.85rem;box-sizing:border-box;font-size:.88rem;line-height:1.5}",
    ".leaf-sizer{display:block!important}",
    ".leaf-inner .chapter-head{margin:0 0 .55rem!important;padding-bottom:.4rem!important}",
    ".leaf-inner .chapter-head h2{font-size:1.18rem!important;line-height:1.2}",
    ".leaf-inner .chapter-num{font-size:.7rem!important;margin-bottom:.2rem!important}",
    ".leaf-inner figure,.leaf-inner .illust{display:block;width:fit-content;max-width:100%;margin:.15rem auto .55rem;background:transparent!important;border:none!important;border-radius:8px;overflow:hidden}",
    ".leaf-inner figcaption{display:block!important;font-size:.68rem!important;padding:.2rem .15rem 0!important;text-align:center;background:transparent!important;border:none!important;color:#6b6358}",
    ".leaf-inner img{max-width:100%!important;max-height:var(--img-max,220px)!important;width:auto!important;height:auto!important;min-height:0!important;object-fit:contain!important;display:block;margin:0 auto;animation:none!important;transform:none!important;opacity:1!important}",
    ".leaf-inner .gallery{display:grid!important;grid-template-columns:1fr 1fr;gap:.45rem!important;margin:.4rem auto!important;width:100%;max-width:100%}",
    ".leaf-inner .gallery img{max-height:calc(var(--img-max,220px) * .7)!important}",
    ".leaf-inner .draw-box{max-height:120px!important;min-height:88px!important;aspect-ratio:auto!important}",
    ".leaf-inner .cast{gap:.12rem!important;margin:0}",
    ".leaf-inner .cast div{padding:.28rem 0!important}",
    ".leaf-inner p{margin:0 0 .5rem}",
    ".leaf-inner p:last-child{margin-bottom:.35rem}",
    ".leaf-inner h2{font-size:1.12rem!important;line-height:1.2}",
    ".leaf-inner .dropcap::first-letter{font-size:1.75rem!important;line-height:1!important;padding-right:.28rem!important}",
    ".leaf-inner .brand{font-size:1.5rem!important;line-height:1.15!important}",
    ".leaf-inner .author,.leaf-inner .author-line{font-size:.72rem!important;margin:.35rem 0 0!important}",
    ".leaf-inner .blurb{font-size:.98rem!important;margin:0 auto!important}",
    ".leaf-inner .series-note,.leaf-inner .note{font-size:.75rem!important;margin:.4rem 0!important;padding:.45rem!important}",
    ".leaf-inner .toc ol{font-size:.78rem;columns:1!important;margin:0;padding-left:1.1rem}",
    ".leaf-inner .toc a{padding:.22rem .1rem!important}",
    ".leaf-inner .toc .sum{display:none!important}",
    ".leaf-inner .cover-hero,.leaf-inner .cover-photo{min-height:0!important}",
    ".leaf.is-cover .leaf-inner{display:flex;flex-direction:column;justify-content:center;text-align:center;gap:.45rem;padding:.9rem .95rem 1.6rem}",
    ".leaf.is-cover .leaf-inner img{max-height:var(--cover-img-max,300px)!important}",
    ".leaf.is-cover .cover-photo{width:100%!important;max-width:100%!important;margin:.2rem auto!important;display:flex;justify-content:center;background:transparent!important;border:none!important}",
    ".leaf.is-cover .cover-photo img{max-height:var(--cover-img-max,300px)!important;width:auto!important;height:auto!important;object-fit:contain!important}",
    ".leaf.is-cover-bleed .leaf-inner{padding:0!important;gap:0;justify-content:stretch}",
    ".leaf.is-cover-bleed .cover-hero{flex:1 1 auto;width:100%!important;max-width:none!important;margin:0!important;border-radius:0!important;min-height:0!important;overflow:hidden}",
    ".leaf.is-cover-bleed .cover-hero img{max-height:none!important;width:100%!important;height:100%!important;object-fit:cover!important;margin:0!important}",
    ".leaf.is-cover-bleed .cover-panel{flex:0 0 auto;padding:.7rem .85rem .95rem!important}",
    ".leaf.is-cover .cover-cta,.leaf.is-cover .cta{display:none!important}",
    ".page-num{position:absolute;left:0;right:0;bottom:.42rem;z-index:6;text-align:center;font-size:.7rem;font-weight:800;letter-spacing:.14em;color:#6b6358;pointer-events:none}",
    ".flipper{position:absolute;top:0;height:100%;width:calc(50% - 4px);display:none;transform-style:preserve-3d;z-index:8;pointer-events:none}",
    ".flipper.is-forward,.flipper.is-back{display:block}",
    ".flipper.is-forward{left:calc(50% + 4px);transform-origin:left center;animation:book-flip-fwd .7s ease-in-out forwards}",
    ".flipper.is-back{left:0;transform-origin:right center;animation:book-flip-back .7s ease-in-out forwards}",
    ".flip-face{position:absolute;inset:0;overflow:hidden;backface-visibility:hidden;background:#fbf7ee}",
    ".flip-front .leaf-inner,.flip-back .leaf-inner{height:100%;overflow:hidden;padding:1rem 1.1rem 2.6rem;box-sizing:border-box}",
    ".flip-back{transform:rotateY(180deg)}",
    "@keyframes book-flip-fwd{from{transform:rotateY(0)}to{transform:rotateY(-180deg)}}",
    "@keyframes book-flip-back{from{transform:rotateY(0)}to{transform:rotateY(180deg)}}",
    ".book-chrome{flex:0 0 auto;width:min(980px,calc(100vw - 1.5rem));display:grid;grid-template-columns:44px 1fr 44px;align-items:center;gap:.75rem}",
    ".book-folio{margin:0;text-align:center;font-size:.78rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#4a5563}",
    ".book-nav{width:44px;height:44px;border-radius:999px;border:1px solid rgba(28,36,48,.14);background:#fffdf9;color:#1c2430;font-size:1.35rem;line-height:1;cursor:pointer}",
    ".book-nav:hover{background:#eef5f4}",
    ".book-nav:disabled{opacity:.35;cursor:default}",
    ".book-hint{flex:0 0 auto;margin:0;text-align:center;font-size:.75rem;color:#4a5563}",
    "@media (prefers-reduced-motion:reduce){.flipper.is-forward,.flipper.is-back{animation-duration:.01s}}",
    "@media print{body.is-book-reader{height:auto;overflow:visible}.book-stage{display:none!important}body.is-book-reader main.book{position:static!important;width:auto!important;height:auto!important;left:auto!important}body.is-book-reader .site-footer{display:flex}}",
    "@media (max-width:700px){.leaf-inner{font-size:.78rem;padding:.7rem .75rem 2.4rem}.hardback{height:min(520px,calc(100% - 92px))}.leaf-inner .brand{font-size:1.15rem!important}.book-tools a{font-size:.7rem;padding:.22rem .55rem}}"
  ].join("");
  document.head.appendChild(style);
}
