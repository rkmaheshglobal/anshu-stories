/** GoatCounter site code — must match https://CODE.goatcounter.com */
var GOATCOUNTER_CODE = "rkmaheshglobal";
var readerEventQueue = [];
var readerFlushTimer = 0;

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
  const errorBox = document.querySelector("[data-newsletter-error]");
  if (form && success) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = form.querySelector('input[type="email"]');
      if (!email || !email.value.trim()) return;
      const btn = form.querySelector('button[type="submit"]');
      success.classList.remove("is-visible");
      if (errorBox) errorBox.classList.remove("is-visible");
      if (btn) btn.disabled = true;
      fetch(form.getAttribute("action"), {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          return { ok: res.ok, data: data };
        });
      }).then(function (result) {
        if (btn) btn.disabled = false;
        if (result.ok) {
          success.classList.add("is-visible");
          form.reset();
          return;
        }
        if (errorBox) errorBox.classList.add("is-visible");
      }).catch(function () {
        if (btn) btn.disabled = false;
        if (errorBox) errorBox.classList.add("is-visible");
      });
    });
  }

  addPrivacyLink();
  addSiteIcons();
  initReaderStats();
  initPrintableBack();
  initStoryBook();
})();

function siteFileHref(file) {
  var path = (location.pathname || "").replace(/\\/g, "/");
  if (path.indexOf("/stories/chosen-for-magic/") !== -1) return "../../" + file;
  if (path.indexOf("/stories/") !== -1 || path.indexOf("/invitations/") !== -1 || path.indexOf("/printables/") !== -1) return "../" + file;
  return file;
}

function addSiteIcons() {
  if (document.querySelector('link[rel="icon"]')) return;
  var icon = document.createElement("link");
  icon.rel = "icon";
  icon.type = "image/svg+xml";
  icon.href = siteFileHref("images/favicon.svg");
  document.head.appendChild(icon);
  var apple = document.createElement("link");
  apple.rel = "apple-touch-icon";
  apple.href = siteFileHref("images/apple-touch-icon.png");
  document.head.appendChild(apple);
}

function addPrivacyLink() {
  var footers = document.querySelectorAll(".site-footer");
  if (!footers.length) return;
  Array.prototype.forEach.call(footers, function (footer) {
    if (footer.querySelector("[data-privacy]")) return;
    var a = document.createElement("a");
    a.href = siteFileHref("privacy.html");
    a.textContent = "Privacy";
    a.setAttribute("data-privacy", "");
    footer.appendChild(a);
  });
}

function isLiveSite() {
  var host = location.hostname;
  return !!host && host !== "localhost" && host !== "127.0.0.1";
}

function initReaderStats() {
  if (!GOATCOUNTER_CODE || !isLiveSite()) return;
  if (document.getElementById("goatcounter-script")) return;
  var s = document.createElement("script");
  s.id = "goatcounter-script";
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter", "https://" + GOATCOUNTER_CODE + ".goatcounter.com/count");
  document.head.appendChild(s);
}

function flushReaderEvents() {
  if (!window.goatcounter || typeof window.goatcounter.count !== "function") return false;
  while (readerEventQueue.length) window.goatcounter.count(readerEventQueue.shift());
  return true;
}

function trackReaderEvent(path, title) {
  if (!GOATCOUNTER_CODE || !isLiveSite() || !path) return;
  readerEventQueue.push({ path: path, title: title || path, event: true });
  if (flushReaderEvents()) return;
  if (readerFlushTimer) return;
  var tries = 0;
  readerFlushTimer = window.setInterval(function () {
    tries += 1;
    if (flushReaderEvents() || tries > 40) {
      window.clearInterval(readerFlushTimer);
      readerFlushTimer = 0;
    }
  }, 250);
}

function isSafeStoryPath(path) {
  if (!path || path.charAt(0) !== "/") return false;
  if (path.indexOf("://") !== -1 || path.indexOf("//") !== -1 || path.indexOf("\\") !== -1) return false;
  var file = path.replace(/#.*$/, "");
  return file.indexOf("/stories/") !== -1 && /\.html$/i.test(file);
}

function initPrintableBack() {
  var path = (location.pathname || "").replace(/\\/g, "/");
  if (path.indexOf("/printables/") === -1) return;
  var link = document.querySelector("[data-back-to-story]");
  if (!link) return;
  var from = "";
  try {
    from = new URLSearchParams(location.search).get("from") || "";
  } catch (err) {
    from = "";
  }
  if (!isSafeStoryPath(from) && document.referrer) {
    try {
      var ref = new URL(document.referrer);
      if (ref.origin === location.origin && isSafeStoryPath(ref.pathname)) {
        from = ref.pathname + (ref.hash || "");
      }
    } catch (err) {}
  }
  if (!isSafeStoryPath(from)) return;
  link.href = from;
  link.hidden = false;
}

function storyIdFromPath() {
  var parts = (location.pathname || "").replace(/\\/g, "/").split("/");
  var file = (parts.pop() || "").replace(/\.html$/i, "");
  if (!file) return "";
  if (file.toLowerCase() === "index" && parts[parts.length - 1] === "chosen-for-magic") {
    return "chosen-for-magic";
  }
  return file.toLowerCase();
}

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
  addPrintableLinks();

  const stage = document.createElement("div");
  stage.className = "book-stage";
  stage.innerHTML =
    '<div class="hardback" role="region" aria-label="Open book. Use arrow keys or swipe to turn pages.">' +
      '<div class="leaf leaf-left"><div class="leaf-inner"></div><span class="page-num"></span></div>' +
      '<div class="spine" aria-hidden="true"></div>' +
      '<div class="leaf leaf-right"><div class="leaf-inner"></div><span class="page-num"></span></div>' +
      '<div class="flipper" aria-hidden="true">' +
        '<div class="flip-face flip-front"><div class="leaf-inner"></div></div>' +
        '<div class="flip-face flip-back"><div class="leaf-inner"></div></div>' +
      "</div>" +
    "</div>" +
    '<div class="book-chrome">' +
      '<button type="button" class="book-nav" data-book-prev aria-label="Previous page">‹</button>' +
      '<p class="book-folio" data-folio></p>' +
      '<button type="button" class="book-nav" data-book-next aria-label="Next page">›</button>' +
      '<button type="button" class="book-nav book-listen-btn" data-listen-toggle aria-pressed="false" aria-label="Read this page aloud">▶</button>' +
      '<button type="button" class="book-nav book-focus-btn" data-book-focus aria-pressed="false" aria-label="Read without menus">⛶</button>' +
    "</div>" +
    '<p class="book-listen-note" data-listen-note hidden><span class="listen-wave" aria-hidden="true"><i></i><i></i><i></i><i></i></span> <span data-listen-voice>Neerja Natural · clear computer voice</span></p>' +
    '<p class="book-hint" data-book-hint></p>' +
    '<div class="story-react" data-react hidden>' +
      '<p>Did you love this story? Leave a reaction:</p>' +
      '<div class="story-react-btns">' +
        '<button type="button" data-emo="wand" aria-label="Magic">🪄</button>' +
        '<button type="button" data-emo="spark" aria-label="Sparkle">✨</button>' +
        '<button type="button" data-emo="unicorn" aria-label="Unicorn">🦄</button>' +
        '<button type="button" data-emo="heart" aria-label="Love">💖</button>' +
        '<button type="button" data-emo="star" aria-label="Star">🌟</button>' +
      "</div>" +
      '<p class="story-react-thanks" data-react-thanks hidden>Thanks — saved on this device only.</p>' +
    "</div>" +
    '<div class="cast-card" data-cast-card hidden role="dialog" aria-label="Character">' +
      '<p class="cast-card-letter" data-cast-letter></p>' +
      '<p class="cast-card-name" data-cast-name></p>' +
      '<p class="cast-card-fact" data-cast-fact></p>' +
      '<button type="button" data-cast-close>Close</button>' +
    "</div>";

  book.parentNode.insertBefore(stage, book);

  const hardback = stage.querySelector(".hardback");
  const leftEl = stage.querySelector(".leaf-left");
  const rightEl = stage.querySelector(".leaf-right");
  const flipper = stage.querySelector(".flipper");
  const folio = stage.querySelector("[data-folio]");
  const hint = stage.querySelector("[data-book-hint]");
  const prevBtn = stage.querySelector("[data-book-prev]");
  const nextBtn = stage.querySelector("[data-book-next]");
  const focusBtn = stage.querySelector("[data-book-focus]");
  const listenBtn = stage.querySelector("[data-listen-toggle]");
  const listenNote = stage.querySelector("[data-listen-note]");
  const listenVoiceLabel = stage.querySelector("[data-listen-voice]");
  const reactBox = stage.querySelector("[data-react]");
  const reactThanks = stage.querySelector("[data-react-thanks]");
  const castCard = stage.querySelector("[data-cast-card]");
  const ENDPAPER =
    '<div class="endpaper">' +
      '<p class="endpaper-kicker">From a kid, to a kid</p>' +
      '<p class="endpaper-dedicate">For every reader who opens a notebook and finds a world.</p>' +
      '<p class="endpaper-about"><strong>Anshika Mahesh</strong> is 12. She writes stories about friendship, courage, and choosing kindness.</p>' +
    "</div>";

  let leaves = [];
  let idToLeaf = {};
  let spread = 0;
  let totalSpreads = 1;
  let flipping = false;
  let singlePage = false;
  let ignoreClick = false;
  let immersive = false;
  let listening = false;
  let speakToken = 0;
  const canSpeak = typeof window.speechSynthesis !== "undefined";
  if (!canSpeak) {
    listenBtn.hidden = true;
    stage.querySelector(".book-chrome").classList.add("no-listen");
  } else {
    window.speechSynthesis.getVoices();
  }

  function isSingle() {
    return window.matchMedia("(max-width: 767px)").matches;
  }
  function leftIndex(si) {
    return singlePage ? -1 : si * 2 - 1;
  }
  function rightIndex(si) {
    return singlePage ? si : si * 2;
  }
  function spreadFromLeafIndex(leafIndex) {
    return singlePage ? Math.max(0, leafIndex) : Math.floor((leafIndex + 1) / 2);
  }
  function keepLeafIndex() {
    if (singlePage) return spread;
    return spread === 0 ? 0 : spread * 2;
  }

  function fillLeaf(el, leafIndex) {
    const inner = el.querySelector(".leaf-inner");
    const num = el.querySelector(".page-num");
    el.classList.remove("is-blank", "is-cover", "is-cover-bleed", "has-picture", "is-endpaper");
    inner.classList.remove("toc");
    inner.style.fontSize = "";
    if (leafIndex < 0) {
      inner.innerHTML = ENDPAPER;
      num.textContent = "";
      el.classList.add("is-blank", "is-endpaper");
      return;
    }
    if (leafIndex >= leaves.length) {
      inner.innerHTML = "";
      num.textContent = "";
      el.classList.add("is-blank", "is-endpaper");
      return;
    }
    const leaf = leaves[leafIndex];
    if (leaf.cover) {
      el.classList.add("is-cover");
      if (leaf.html.indexOf("cover-hero") !== -1) el.classList.add("is-cover-bleed");
    }
    inner.innerHTML = leaf.html;
    if (leaf.toc) inner.classList.add("toc");
    if (inner.querySelector("figure, .illust, .gallery")) el.classList.add("has-picture");
    num.textContent = String(leafIndex + 1);
    fitLeaf(el);
  }

  function fitLeaf(el) {
    const inner = el.querySelector(".leaf-inner");
    if (!inner || el.classList.contains("is-cover") || el.classList.contains("is-endpaper") || el.classList.contains("is-blank")) {
      if (inner) {
        inner.style.fontSize = "";
        inner.style.overflowY = "";
      }
      return;
    }
    inner.style.fontSize = "";
    inner.style.overflowY = "hidden";
    if (inner.scrollHeight <= inner.clientHeight + 2) return;
    const sizes = ["0.84rem", "0.8rem", "0.76rem", "0.72rem"];
    for (let i = 0; i < sizes.length; i++) {
      inner.style.fontSize = sizes[i];
      if (inner.scrollHeight <= inner.clientHeight + 2) return;
    }
    inner.style.overflowY = "auto";
  }

  function paint(si) {
    fillLeaf(leftEl, leftIndex(si));
    fillLeaf(rightEl, rightIndex(si));
    const a = leftIndex(si);
    const b = rightIndex(si);
    const nums = [];
    if (a >= 0 && a < leaves.length) nums.push(a + 1);
    if (b >= 0 && b < leaves.length) nums.push(b + 1);
    if (singlePage) {
      folio.textContent = nums.length ? "Page " + nums[0] + " of " + leaves.length : "";
    } else {
      folio.textContent = nums.length
        ? "Pages " + nums.join("–") + " of " + leaves.length
        : "";
    }
    prevBtn.disabled = si === 0;
    nextBtn.disabled = si === totalSpreads - 1;
    noteStoryProgress(si);
    closeCast();
    wireCastNames();
    showReact(si === totalSpreads - 1);
    if (listening) speakVisiblePages();
  }

  function syncLayout() {
    hardback.classList.toggle("is-single", singlePage);
    stage.classList.toggle("is-single", singlePage);
    document.body.classList.toggle("is-book-single", singlePage);
    hint.textContent = singlePage
      ? "Swipe to turn · tap the sides · ← →"
      : "Click a page to flip · ← → keys · left back, right forward";
  }

  function visiblePageText() {
    const parts = [];
    [leftEl, rightEl].forEach(function (leaf) {
      if (leaf.classList.contains("is-endpaper")) return;
      const inner = leaf.querySelector(".leaf-inner");
      if (!inner) return;
      const clone = inner.cloneNode(true);
      Array.prototype.forEach.call(clone.querySelectorAll(".cover-cta, .cta, figcaption"), function (n) {
        n.parentNode.removeChild(n);
      });
      const text = (clone.textContent || "").replace(/\s+/g, " ").trim();
      if (text) parts.push(text);
    });
    return parts.join(". ");
  }

  function setListening(on) {
    listening = !!on;
    listenBtn.setAttribute("aria-pressed", listening ? "true" : "false");
    listenBtn.textContent = listening ? "⏸" : "▶";
    listenBtn.setAttribute("aria-label", listening ? "Pause reading" : "Read this page aloud");
    stage.classList.toggle("is-listening", listening);
    if (listenNote) listenNote.hidden = !listening;
  }

  function stopSpeak() {
    speakToken += 1;
    if (canSpeak) window.speechSynthesis.cancel();
  }

  function scoreNarrationVoice(voice) {
    const name = (voice.name || "").toLowerCase();
    const lang = (voice.lang || "").toLowerCase().replace("_", "-");
    if (/neerja/.test(name) && /natural/.test(name)) return 400;
    if (/neerja/.test(name)) return 350;
    let score = 0;
    if (/^en-in/.test(lang)) score += 130;
    else if (/india|indian/.test(name) && /^en/.test(lang)) score += 120;
    else if (/heera|veena|sangeeta|isha/.test(name)) score += 115;
    else if (/^en/.test(lang)) score += 8;
    else return -1;
    if (/male|\bman\b|rishi|ravi|prabhat/.test(name)) score -= 90;
    if (/female|heera|veena|sangeeta|isha/.test(name)) score += 40;
    if (/natural|neural|online/.test(name)) score += 30;
    return score;
  }

  function pickNarrationVoice(voices) {
    let best = null;
    let bestScore = -1;
    for (let i = 0; i < voices.length; i++) {
      const score = scoreNarrationVoice(voices[i]);
      if (score > bestScore) {
        bestScore = score;
        best = voices[i];
      }
    }
    return best;
  }

  function withVoices(done) {
    const have = window.speechSynthesis.getVoices() || [];
    if (have.length) {
      done(have);
      return;
    }
    let settled = false;
    function once() {
      if (settled) return;
      settled = true;
      done(window.speechSynthesis.getVoices() || []);
    }
    window.speechSynthesis.addEventListener("voiceschanged", once, { once: true });
    window.setTimeout(once, 500);
  }

  function describeVoice(voice) {
    const name = (voice && voice.name) || "";
    if (/neerja/i.test(name)) return "Neerja Natural · clear computer voice";
    if (name) return "Reading with " + name + " · clear computer voice";
    return "Clear computer voice · Neerja Natural when this device has it";
  }

  function speakVisiblePages() {
    if (!canSpeak) return;
    stopSpeak();
    const token = speakToken;
    const text = visiblePageText();
    if (!text) {
      setListening(false);
      return;
    }
    withVoices(function (voices) {
      if (token !== speakToken) return;
      const utter = new SpeechSynthesisUtterance(text);
      const voice = pickNarrationVoice(voices);
      utter.lang = (voice && voice.lang) || "en-IN";
      if (voice) utter.voice = voice;
      utter.rate = 0.82;
      utter.pitch = 1;
      utter.volume = 1;
      utter.onend = function () {
        if (token !== speakToken) return;
        if (listening && spread < totalSpreads - 1) go(1);
        else setListening(false);
      };
      utter.onerror = function () {
        if (token !== speakToken) return;
        setListening(false);
      };
      if (listenVoiceLabel) listenVoiceLabel.textContent = describeVoice(voice);
      window.speechSynthesis.speak(utter);
      setListening(true);
    });
  }

  function toggleListen() {
    if (!canSpeak) return;
    if (listening) {
      stopSpeak();
      setListening(false);
      return;
    }
    speakVisiblePages();
  }

  function wireCastNames() {
    Array.prototype.forEach.call(hardback.querySelectorAll(".cast > div"), function (row) {
      Array.prototype.forEach.call(row.querySelectorAll("strong, span"), function (el) {
        if (el.classList.contains("cast-name")) return;
        if (!(el.textContent || "").trim()) return;
        el.classList.add("cast-name");
        el.setAttribute("tabindex", "0");
        el.setAttribute("role", "button");
        el.setAttribute("aria-haspopup", "dialog");
      });
    });
  }

  function openCast(el) {
    const row = el.closest("div");
    const strong = row && row.querySelector("strong");
    const span = row && row.querySelector("span");
    let name = (strong && strong.textContent.trim()) || el.textContent.trim();
    let fact = "";
    if (span) {
      const extra = span.textContent.trim();
      const role = strong ? strong.textContent.trim() : "";
      if (extra && !/leave blank/i.test(extra)) {
        name = extra.split(/\s*[—–-]\s*/)[0].trim() || extra;
        fact = /[—–-]/.test(extra) ? extra : role;
      } else {
        fact = extra;
      }
    } else {
      const raw = (row && row.textContent) || "";
      fact = raw.replace(name, "").replace(/^[\s—–-]+/, "").trim();
    }
    const letterEl = castCard.querySelector("[data-cast-letter]");
    letterEl.textContent = "";
    const leafInner = el.closest(".leaf-inner");
    const leafImg = leafInner && leafInner.querySelector("img");
    if (leafImg && leafImg.getAttribute("src")) {
      const thumb = document.createElement("img");
      thumb.src = leafImg.getAttribute("src");
      thumb.alt = "";
      letterEl.appendChild(thumb);
    } else {
      letterEl.textContent = name.charAt(0) || "?";
    }
    castCard.querySelector("[data-cast-name]").textContent = name;
    castCard.querySelector("[data-cast-fact]").textContent = fact || "A character in this story.";
    castCard.hidden = false;
  }

  function closeCast() {
    castCard.hidden = true;
  }

  function showReact(on) {
    reactBox.hidden = !on;
    if (!on || !storyId) return;
    const picked = window.localStorage.getItem("anshika-react-" + storyId);
    Array.prototype.forEach.call(reactBox.querySelectorAll("[data-emo]"), function (btn) {
      btn.classList.toggle("is-picked", picked === btn.getAttribute("data-emo"));
    });
    reactThanks.hidden = !picked;
  }

  function pickReact(emo) {
    if (!storyId || !emo) return;
    window.localStorage.setItem("anshika-react-" + storyId, emo);
    showReact(true);
    trackReaderEvent("story_react/" + storyId + "/" + emo, "Reacted " + storyId);
  }

  function addPrintableLinks() {
    const tools = document.querySelector(".book-tools");
    if (!tools || tools.querySelector("[data-printable]")) return;
    const from = encodeURIComponent(location.pathname + location.hash);
    [["printables/bookmark.html", "Print a bookmark"], ["printables/coloring.html", "Coloring page"]].forEach(function (item) {
      const a = document.createElement("a");
      a.href = siteFileHref(item[0]) + "?from=" + from;
      a.textContent = item[1];
      a.setAttribute("data-printable", "");
      tools.appendChild(a);
    });
  }

  const storyId = storyIdFromPath();
  const sentRead = { open: false, halfway: false, finish: false };
  function noteStoryProgress(si) {
    if (!storyId) return;
    if (!sentRead.open) {
      sentRead.open = true;
      trackReaderEvent("story_open/" + storyId, "Opened " + storyId);
    }
    if (!sentRead.halfway && totalSpreads > 1 && si > 0 && si >= Math.floor((totalSpreads - 1) / 2)) {
      sentRead.halfway = true;
      trackReaderEvent("story_halfway/" + storyId, "Halfway " + storyId);
    }
    if (!sentRead.finish && si === totalSpreads - 1) {
      sentRead.finish = true;
      trackReaderEvent("story_finish/" + storyId, "Finished " + storyId);
    }
  }

  function spreadFromLeaf(leafIndex) {
    return spreadFromLeafIndex(leafIndex);
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

  function copyLeafFace(target, source) {
    target.innerHTML = source ? source.innerHTML : "";
    target.classList.toggle("toc", !!(source && source.classList.contains("toc")));
  }
  function copyLeafHtml(target, leaf) {
    target.innerHTML = leaf ? leaf.html : "";
    target.classList.toggle("toc", !!(leaf && leaf.toc));
  }

  function go(dir) {
    if (flipping) return;
    const next = spread + dir;
    if (next < 0 || next >= totalSpreads) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || singlePage) {
      if (listening) stopSpeak();
      spread = next;
      paint(spread);
      return;
    }

    flipping = true;
    if (listening) stopSpeak();
    const front = flipper.querySelector(".flip-front .leaf-inner");
    const back = flipper.querySelector(".flip-back .leaf-inner");

    if (dir > 0) {
      copyLeafFace(front, rightEl.querySelector(".leaf-inner"));
      const upcoming = leftIndex(next);
      copyLeafHtml(back, upcoming >= 0 && upcoming < leaves.length ? leaves[upcoming] : null);
      fillLeaf(rightEl, rightIndex(next));
      flipper.className = "flipper is-forward";
    } else {
      copyLeafFace(front, leftEl.querySelector(".leaf-inner"));
      const upcoming = rightIndex(next);
      copyLeafHtml(back, upcoming >= 0 && upcoming < leaves.length ? leaves[upcoming] : null);
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

    const sizer = sampleClone(rightEl.querySelector(".leaf-inner"), maxW, Math.max(80, maxH - 10));
    rightEl.appendChild(sizer);

    const out = [];
    const map = {};
    let pageIsToc = false;

    function overflows() {
      return sizer.scrollHeight - sizer.clientHeight > 2;
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
    function isTextBlock(el) {
      if (!el || el.nodeType !== 1) return false;
      if (isHeading(el) || isMedia(el) || listHost(el)) return false;
      const tag = el.tagName;
      if (tag !== "P" && tag !== "DIV" && tag !== "BLOCKQUOTE") return false;
      return Array.prototype.every.call(el.children, function (ch) {
        return /^(EM|STRONG|I|B|A|SPAN|BR)$/.test(ch.tagName);
      });
    }
    function sentenceChunks(html) {
      const parts = [];
      const re = /[.!?]["']?(?:\s+|$)/g;
      let last = 0;
      let m;
      while ((m = re.exec(html))) {
        const bit = html.slice(last, m.index + m[0].length).trim();
        if (bit) parts.push(bit);
        last = m.index + m[0].length;
      }
      if (last < html.length) {
        const tail = html.slice(last).trim();
        if (tail) parts.push(tail);
      }
      return parts;
    }
    function splitTextBlock(el) {
      const chunks = sentenceChunks(el.innerHTML.trim());
      if (chunks.length < 2) return;
      const tag = el.tagName;
      const cls = el.className;
      el.innerHTML = "";
      let current = el;
      let acc = [];
      chunks.forEach(function (chunk) {
        acc.push(chunk);
        current.innerHTML = acc.join(" ");
        if (overflows() && acc.length > 1) {
          acc.pop();
          current.innerHTML = acc.join(" ");
          flush();
          current = document.createElement(tag);
          current.className = cls;
          sizer.appendChild(current);
          acc = [chunk];
          current.innerHTML = chunk;
        }
      });
    }
    function fitClone(clone) {
      const host = listHost(clone);
      if (host) {
        splitHost(host);
        return;
      }
      if (isTextBlock(clone)) splitTextBlock(clone);
    }
    function flush() {
      if (!sizer.innerHTML.trim()) return;
      out.push({ html: sizer.innerHTML, cover: false, toc: pageIsToc });
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
        if (sizer.scrollHeight - sizer.clientHeight > 2 && current.children.length > 1) {
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
      pageIsToc = src.classList.contains("toc");
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

        if (sizer.children.length === 1) {
          fitClone(clone);
          return;
        }

        sizer.removeChild(clone);
        flush();
        sizer.appendChild(clone);
        if (overflows()) fitClone(clone);
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
    return { html: wrap.innerHTML, cover: src.classList.contains("cover"), toc: src.classList.contains("toc") };
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
    const keep = keepLeafIndex();
    singlePage = isSingle();
    syncLayout();
    const packed = paginate();
    leaves = packed.leaves.length ? packed.leaves : sourcePages.map(fallbackLeaf);
    idToLeaf = packed.idToLeaf;
    totalSpreads = singlePage
      ? Math.max(1, leaves.length)
      : Math.max(1, Math.ceil((leaves.length + 1) / 2));
    spread = spreadFromLeafIndex(Math.min(keep, Math.max(0, leaves.length - 1)));
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
    if (ignoreClick) {
      ignoreClick = false;
      return;
    }
    const castName = event.target.closest(".cast-name");
    if (castName) {
      event.preventDefault();
      openCast(castName);
      return;
    }
    if (event.target.closest("a, button, input, textarea, select, label")) return;
    const rect = hardback.getBoundingClientRect();
    go(event.clientX - rect.left < rect.width / 2 ? -1 : 1);
  });
  hardback.addEventListener("keydown", function (event) {
    if (!event.target.classList.contains("cast-name")) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openCast(event.target);
  });

  prevBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    go(-1);
  });
  nextBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    go(1);
  });

  function setImmersive(on) {
    immersive = !!on;
    document.body.classList.toggle("is-book-immersive", immersive);
    stage.classList.toggle("is-immersive", immersive);
    focusBtn.setAttribute("aria-pressed", immersive ? "true" : "false");
    focusBtn.setAttribute("aria-label", immersive ? "Show menus" : "Read without menus");
    focusBtn.textContent = immersive ? "✕" : "⛶";
    window.setTimeout(function () {
      if (started) rebuild();
    }, 80);
  }

  function toggleImmersive() {
    const next = !immersive;
    const node = stage;
    if (next && node.requestFullscreen) {
      node.requestFullscreen().then(function () { setImmersive(true); }).catch(function () { setImmersive(true); });
      return;
    }
    if (!next && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    }
    setImmersive(next);
  }

  focusBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleImmersive();
  });
  listenBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleListen();
  });
  reactBox.addEventListener("click", function (event) {
    const btn = event.target.closest("[data-emo]");
    if (!btn) return;
    event.stopPropagation();
    pickReact(btn.getAttribute("data-emo"));
  });
  castCard.querySelector("[data-cast-close]").addEventListener("click", function (event) {
    event.stopPropagation();
    closeCast();
  });
  document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement && immersive) setImmersive(false);
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && listening) {
      stopSpeak();
      setListening(false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.target.closest("input, textarea, select")) return;
    if (event.key === " " && event.target.closest("button, a, .cast-name")) return;
    if (event.key === "Escape" && !castCard.hidden) {
      event.preventDefault();
      closeCast();
      return;
    }
    if (event.key === "Escape" && immersive) {
      event.preventDefault();
      toggleImmersive();
      return;
    }
    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      spread = 0;
      paint(spread);
    } else if (event.key === "End") {
      event.preventDefault();
      spread = totalSpreads - 1;
      paint(spread);
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
  let touchY = 0;
  function onTouchStart(event) {
    if (event.target.closest("button, a, .cast-name, .cast-card, .story-react")) return;
    touchX = event.changedTouches[0].clientX;
    touchY = event.changedTouches[0].clientY;
  }
  function onTouchEnd(event) {
    if (event.target.closest("button, a, .cast-name, .cast-card, .story-react")) return;
    const dx = event.changedTouches[0].clientX - touchX;
    const dy = event.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    ignoreClick = true;
    go(dx < 0 ? 1 : -1);
  }
  stage.addEventListener("touchstart", onTouchStart, { passive: true });
  stage.addEventListener("touchend", onTouchEnd, { passive: true });

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
    "body.is-book-reader .site-header{position:relative;flex:0 0 auto;z-index:30;background:rgba(247,244,239,.94)}",
    "body.is-book-reader .site-footer{display:none}",
    "body.is-book-reader main.book{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;overflow:hidden!important;margin:0!important}",
    "body.is-book-reader .book-tools{flex:0 0 auto;position:relative;z-index:5;width:min(980px,calc(100vw - 1.5rem));margin:0 auto;padding:.45rem .6rem .35rem;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:.45rem .7rem}",
    "body.is-book-reader .book-tools a{padding:.28rem .75rem;border-radius:999px;background:#fffdf9;border:1px solid rgba(28,36,48,.12);line-height:1.2}",
    ".book-stage{flex:1 1 auto;min-height:0;height:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.45rem;padding:0 .75rem .45rem;touch-action:pan-y;position:relative}",
    ".book-stage.is-immersive,.book-stage:fullscreen{width:100%;height:100%;background:#1a120c;padding:.6rem .75rem .5rem}",
    "body.is-book-immersive .site-header,body.is-book-immersive .book-tools{display:none!important}",
    ".hardback{width:min(980px,calc(100vw - 1.5rem));height:min(620px,calc(100% - 92px));flex:0 0 auto;display:grid;grid-template-columns:1fr 8px 1fr;position:relative;perspective:2200px;border-radius:5px 10px 10px 5px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0 1px,transparent 1px 4px),repeating-linear-gradient(0deg,rgba(0,0,0,.07) 0 1px,transparent 1px 5px),linear-gradient(180deg,#5c3f2c,#2a1a12);box-shadow:0 22px 48px rgba(40,28,18,.32),inset 0 1px 0 rgba(255,255,255,.08),0 0 0 1px rgba(60,40,20,.35);cursor:pointer}",
    ".hardback::after{content:\"\";position:absolute;inset:4px 5px;border-radius:2px 6px 6px 2px;pointer-events:none;z-index:7;box-shadow:inset 10px 0 16px rgba(0,0,0,.16),inset -10px 0 16px rgba(0,0,0,.12);}",
    ".spine{background:linear-gradient(90deg,#1a100a,#7a5640 46%,#1a100a);box-shadow:inset 0 0 10px rgba(0,0,0,.55)}",
    ".leaf{position:relative;height:100%;overflow:hidden;background:#fbf7ee}",
    ".leaf-left{border-radius:4px 0 0 4px;background:linear-gradient(90deg,transparent 78%,rgba(40,30,20,.14)),#fbf7ee}",
    ".leaf-right{border-radius:0 8px 8px 0;background:linear-gradient(90deg,rgba(40,30,20,.14),transparent 22%),#fbf7ee}",
    ".leaf.is-blank{background:#e9dccb}",
    ".leaf.is-endpaper{background-color:#e4d0bc;background-image:radial-gradient(circle at 18% 22%,rgba(93,127,98,.2) 0 1.6px,transparent 2.2px),radial-gradient(circle at 82% 78%,rgba(201,123,132,.16) 0 1.6px,transparent 2.2px),radial-gradient(circle at 50% 50%,rgba(217,164,65,.12) 0 1.2px,transparent 1.8px);background-size:22px 22px,26px 26px,18px 18px}",
    ".leaf.is-endpaper .page-num{display:none}",
    ".endpaper{text-align:center;max-width:22ch;margin:0 auto}",
    ".endpaper-kicker{margin:0 0 .7rem;letter-spacing:.16em;text-transform:uppercase;font-size:.68rem;font-weight:800;color:#6b4a38}",
    ".endpaper-dedicate{margin:0 0 .85rem;font-family:Fraunces,Georgia,serif;font-style:italic;font-size:1.02rem;line-height:1.4;color:#3a2a1c}",
    ".endpaper-about{margin:0;font-size:.78rem;line-height:1.45;color:#5a4a40}",
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
    ".cast-name{cursor:pointer;text-decoration:underline;text-decoration-style:dotted;text-underline-offset:.18em;color:#3a4d3e}",
    ".cast-name:focus{outline:2px solid #5d7f62;outline-offset:2px}",
    ".leaf-inner p{margin:0 0 .5rem}",
    ".leaf-inner p:last-child{margin-bottom:.35rem}",
    ".leaf-inner h2{font-size:1.12rem!important;line-height:1.2}",
    ".leaf-inner .dropcap::first-letter{font-size:1.75rem!important;line-height:1!important;padding-right:.28rem!important}",
    ".leaf-inner .brand{font-size:1.5rem!important;line-height:1.15!important}",
    ".leaf-inner .author,.leaf-inner .author-line{font-size:.72rem!important;margin:.35rem 0 0!important}",
    ".leaf-inner .blurb{font-size:.98rem!important;margin:0 auto!important}",
    ".leaf-inner .series-note,.leaf-inner .note{font-size:.75rem!important;margin:.4rem 0!important;padding:.45rem!important}",
    ".leaf-inner.toc ol,.leaf-inner .toc ol{font-size:.78rem;columns:1!important;margin:0;padding:0;list-style:none;counter-reset:tocchap}",
    ".leaf-inner.toc li,.leaf-inner .toc li{counter-increment:tocchap;border-bottom:1px dashed rgba(28,36,48,.12)}",
    ".leaf-inner.toc a,.leaf-inner .toc a{display:grid;grid-template-columns:1.7em 1fr;column-gap:.4rem;align-items:baseline;padding:.28rem .1rem!important;text-decoration:none;color:inherit;font-weight:600}",
    ".leaf-inner.toc a::before,.leaf-inner .toc a::before{content:counter(tocchap) \".\";font-weight:800;text-align:right;color:#3d7f99}",
    ".leaf-inner.toc a > span:first-of-type,.leaf-inner .toc a > span:first-of-type{grid-column:2}",
    ".leaf-inner.toc .sum,.leaf-inner .toc .sum{display:none!important}",
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
    ".book-chrome{flex:0 0 auto;width:min(980px,calc(100vw - 1.5rem));display:grid;grid-template-columns:44px 1fr 44px 44px 44px;align-items:center;gap:.55rem}",
    ".book-chrome.no-listen{grid-template-columns:44px 1fr 44px 44px}",
    ".book-folio{margin:0;text-align:center;font-size:.78rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#4a5563}",
    ".book-nav{width:44px;height:44px;border-radius:999px;border:1px solid rgba(28,36,48,.14);background:#fffdf9;color:#1c2430;font-size:1.35rem;line-height:1;cursor:pointer}",
    ".book-nav:hover{background:#eef5f4}",
    ".book-nav:disabled{opacity:.35;cursor:default}",
    ".book-focus-btn{font-size:1.05rem}",
    ".book-listen-btn{font-size:1rem}",
    ".book-stage.is-listening .book-listen-btn{background:#e8f2ee;box-shadow:0 0 0 3px rgba(93,127,98,.28)}",
    ".book-listen-note{flex:0 0 auto;margin:0;display:flex;align-items:center;justify-content:center;gap:.45rem;font-size:.72rem;color:#4a5563}",
    ".book-listen-note[hidden],.story-react[hidden],.cast-card[hidden]{display:none!important}",
    ".listen-wave{display:inline-flex;align-items:flex-end;gap:2px;height:14px}",
    ".listen-wave i{display:block;width:3px;height:6px;border-radius:2px;background:#5d7f62;animation:listen-bar .9s ease-in-out infinite}",
    ".listen-wave i:nth-child(2){animation-delay:.15s;height:12px}",
    ".listen-wave i:nth-child(3){animation-delay:.3s;height:8px}",
    ".listen-wave i:nth-child(4){animation-delay:.45s;height:14px}",
    "@keyframes listen-bar{0%,100%{transform:scaleY(.45)}50%{transform:scaleY(1)}}",
    ".book-hint{flex:0 0 auto;margin:0;text-align:center;font-size:.75rem;color:#4a5563}",
    ".story-react{flex:0 0 auto;width:min(980px,calc(100vw - 1.5rem));text-align:center;padding:.35rem .5rem .2rem;border-radius:14px;background:#fffdf9;border:1px solid rgba(28,36,48,.1)}",
    ".story-react p{margin:0;font-size:.82rem;font-weight:700;color:#3a4d3e}",
    ".story-react-btns{display:flex;justify-content:center;gap:.35rem;margin:.35rem 0 .2rem}",
    ".story-react-btns button{width:42px;height:42px;border:none;border-radius:999px;background:#f4eee4;font-size:1.25rem;cursor:pointer}",
    ".story-react-btns button:hover,.story-react-btns button.is-picked{background:#e8f2ee;box-shadow:0 0 0 2px #5d7f62}",
    ".story-react-thanks{font-size:.72rem!important;font-weight:600!important;color:#4a5563!important}",
    ".cast-card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:20;width:min(280px,calc(100% - 2rem));padding:1rem 1rem .85rem;border-radius:16px;background:#fffdf9;border:1px solid rgba(28,36,48,.14);box-shadow:0 18px 40px rgba(40,28,18,.28);text-align:center}",
    ".cast-card-letter{margin:0 auto .55rem;width:64px;height:64px;border-radius:50%;background:#e8f2ee;color:#3a4d3e;font-family:Fraunces,Georgia,serif;font-size:1.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;overflow:hidden}",
    ".cast-card-letter img{width:100%;height:100%;object-fit:cover}",
    ".cast-card-name{margin:0 0 .35rem;font-family:Fraunces,Georgia,serif;font-size:1.15rem}",
    ".cast-card-fact{margin:0 0 .7rem;font-size:.82rem;line-height:1.4;color:#4a5563}",
    ".cast-card button{border:1px solid rgba(28,36,48,.14);background:#fff;border-radius:999px;padding:.3rem .8rem;cursor:pointer;font-weight:700}",
    "@media (prefers-reduced-motion:reduce){.flipper.is-forward,.flipper.is-back{animation-duration:.01s}.listen-wave i{animation:none}}",
    "@media print{body.is-book-reader{height:auto;overflow:visible}.book-stage{display:none!important}body.is-book-reader main.book{position:static!important;width:auto!important;height:auto!important;left:auto!important}body.is-book-reader .site-footer{display:flex}}",
    "@media (max-width:767px){.hardback.is-single{grid-template-columns:1fr;width:min(560px,calc(100vw - 1rem));height:min(70vh,calc(100% - 88px));border-radius:8px}.hardback.is-single .leaf-left,.hardback.is-single .spine,.hardback.is-single .flipper{display:none!important}.hardback.is-single .leaf-right{border-radius:8px;background:#fbf7ee}.hardback.is-single .leaf-inner{overflow-y:auto;-webkit-overflow-scrolling:touch;font-size:.86rem;padding:.85rem .9rem 2.5rem}.book-hint{display:none}.book-chrome{width:min(560px,calc(100vw - 1rem));grid-template-columns:44px 1fr 44px 44px 44px}.book-chrome.no-listen{grid-template-columns:44px 1fr 44px 44px}.leaf-inner .brand{font-size:1.2rem!important}.book-tools a{font-size:.7rem;padding:.22rem .55rem}.story-react{width:min(560px,calc(100vw - 1rem))}body.is-book-reader .nav{background:rgba(247,244,239,.98)}}"
  ].join("");
  document.head.appendChild(style);
}
