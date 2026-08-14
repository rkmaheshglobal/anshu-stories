/**
 * Story library — add new tales at the top of STORIES (newest first).
 * Home “Just arrived” uses the first three. START_IDS and SERIES are optional extras.
 * Tags must match a filter: short, school, magic, animals, adventure, series, kannada.
 */
(function () {
  const STORIES = [
    {
      id: "short-stories",
      title: "Short Stories",
      href: "stories/short-stories.html",
      cover: "stories/images/short-stories/cover.png",
      blurb: "Six little tales — a bicycle, a unicorn swap, mermaids, a singing dragon, a pirate castle, and a camel who meets a penguin.",
      tags: ["short", "magic", "animals"],
      lengthLabel: "Quick read",
      fresh: true,
      search: "facing fears switcheroo coral rose hugo delia humpy raya bicycle unicorn mermaid dragon pirate camel penguin"
    },
    {
      id: "kylies-story",
      title: "Kylie’s Story",
      href: "stories/kylies-story.html",
      cover: "stories/images/kylies-story/cover.png",
      blurb: "Dreams that come true, a baby sister named Stuthi, and a watch that opens the future.",
      tags: ["magic"],
      lengthLabel: "A short book",
      fresh: true,
      search: "kylie moira stuthi luminary animal magic trees"
    },
    {
      id: "vivian-and-hazel",
      title: "Vivian and Hazel",
      href: "stories/vivian-and-hazel.html",
      cover: "stories/images/vivian-and-hazel/cover.png",
      blurb: "A school play, an old-school rival, and the secret about Vivian’s sister.",
      tags: ["school", "series"],
      seriesId: "shy-girl",
      seriesLabel: "Book 2",
      seriesBook: 2,
      lengthLabel: "A short book",
      continued: true,
      search: "vivian hazel bella noele school play popular shy girl"
    },
    {
      id: "kuvempu",
      title: "ಕುವೆಂಪು — ಕರ್ನಾಟಕದ ಶ್ರೇಷ್ಠ ಕವಿ",
      href: "stories/kuvempu.html",
      cover: "stories/images/kuvempu/cover.png",
      blurb: "Kannada project tale: Anshika and Samyuktha meet Kuvempu in a magical book.",
      tags: ["kannada", "school", "magic"],
      lang: "kn",
      lengthLabel: "A short book",
      search: "kuvempu kannada karnataka poet samyuktha magical book kannada project"
    },
    {
      id: "almost-sisters",
      title: "Almost Sisters",
      href: "stories/almost-sisters.html",
      cover: "stories/images/almost-sisters/cover.png",
      blurb: "Meg and Rosemina — new stepsisters, old hurt, and a marriage that jumped the gun.",
      tags: ["school"],
      lengthLabel: "Quick read",
      continued: true,
      search: "meg rosemina stepsisters family market garden"
    },
    {
      id: "the-wish-hair-fairies",
      title: "The Wish Hair Fairies",
      href: "stories/the-wish-hair-fairies.html",
      cover: "stories/images/wish-hair-fairies/cover.png",
      blurb: "Moira and Sthuthi stop gloomy elves from stealing wishes — and help one secret wish turn gray into rainbow.",
      tags: ["magic", "short"],
      lengthLabel: "Quick read",
      search: "fairies fairyland elves wishes moira sthuthi rainbow"
    },
    {
      id: "the-bandit-family",
      title: "The Bandit Family",
      href: "stories/the-bandit-family.html",
      cover: "stories/images/bandit-family/cover.png",
      blurb: "Esther’s birthday secret: Mum, Dad and Eric are bandits — and they want to train her too.",
      tags: ["adventure"],
      lengthLabel: "A short book",
      continued: true,
      search: "esther eric bandits birthday mall tunnel bank"
    },
    {
      id: "moving-in",
      title: "Moving In",
      href: "stories/moving-in.html",
      cover: "stories/images/moving-in/cover.png",
      blurb: "Aarushi’s new flat, a playground gang, and the Amazing Adventurers — KT2A — waiting for their first mystery.",
      tags: ["adventure", "school"],
      lengthLabel: "A short book",
      continued: true,
      search: "aarushi krish tanay amaya adventurers kt2a secret seven butterfly"
    },
    {
      id: "invention-of-abacus",
      title: "Invention of Abacus",
      href: "stories/invention-of-abacus.html",
      cover: "stories/images/abacus/cover.png",
      blurb: "A magical project adventure with Samyuktha — from a dead phone to beads in a China museum.",
      tags: ["magic", "school"],
      lengthLabel: "A short book",
      search: "abacus china beads mimi cheng samyuktha school project"
    },
    {
      id: "trip-to-giza",
      title: "The Trip to the Great Pyramid of Giza",
      href: "stories/trip-to-giza.html",
      cover: "stories/images/giza/cover.png",
      blurb: "A magical school-project adventure with Samyuktha — from cardboard model to the sands of Giza.",
      tags: ["magic", "school"],
      lengthLabel: "A short book",
      search: "egypt pyramid giza camel tomb ramp samyuktha school project"
    },
    {
      id: "star-of-the-toy-farm",
      title: "Star of the Toy Farm",
      href: "stories/star-of-the-toy-farm.html",
      cover: "stories/images/star-of-the-toy-farm/cover.png",
      blurb: "Star finds her name, brings Mia home, and learns her purpose is family.",
      tags: ["animals", "series"],
      seriesId: "star",
      seriesLabel: "Book 1",
      seriesBook: 1,
      lengthLabel: "12 chapters",
      search: "star toy farm mia dog purpose belonging"
    },
    {
      id: "star-and-the-midnight-feast",
      title: "Star and the Midnight Feast",
      href: "stories/star-and-the-midnight-feast.html",
      cover: "stories/images/star-of-the-toy-farm/midnight-feast.png",
      blurb: "A sleepover, a riddle-loving goat, and a midnight feast — Star learns bravery is looking after friends when the night gets messy.",
      tags: ["animals", "series"],
      seriesId: "star",
      seriesLabel: "Book 2",
      seriesBook: 2,
      lengthLabel: "12 chapters",
      search: "star midnight feast barney avril goat sleepover"
    },
    {
      id: "from-streets-to-snuggles",
      title: "From Streets to Snuggles",
      href: "stories/from-streets-to-snuggles.html",
      cover: "stories/images/streets/cover.png",
      blurb: "Bundle and Snowy go from rainy streets to a loving home — a tale of rescue and belonging.",
      tags: ["animals"],
      lengthLabel: "25 chapters",
      search: "bundle snowy fluffy rescue dogs goa sam forever home"
    },
    {
      id: "shy-girl",
      title: "The Shy Girl & The Popular Girl",
      href: "stories/shy-girl.html",
      cover: "stories/images/shy-girl/cover.png?v=book1",
      blurb: "Vivian and Hazel learn what true friendship looks like when popularity and kindness collide.",
      tags: ["school", "series"],
      seriesId: "shy-girl",
      seriesLabel: "Book 1",
      seriesBook: 1,
      lengthLabel: "A school story",
      search: "vivian hazel badminton friendship popular shy girl kindness"
    },
    {
      id: "chosen-for-magic",
      title: "Chosen for Magic",
      href: "stories/chosen-for-magic/index.html",
      cover: "stories/images/chosen-for-magic/cover.png",
      blurb: "A Magical Mission Story — personalised editions for each friend, with a sidekick to invent.",
      tags: ["magic", "series"],
      seriesId: "chosen-for-magic",
      seriesLabel: "Gift series",
      seriesBook: 1,
      lengthLabel: "12 editions",
      search: "chosen magic meera winged cat gift friend hero mission aanya aadhya"
    },
    {
      id: "famous-five",
      title: "The Famous Five",
      href: "stories/famous-five.html",
      cover: "stories/images/famous-five/cover.png",
      blurb: "Aanya and Anshika’s Kirrin Island treasure hunt — with Timmy and an activity page.",
      tags: ["adventure", "short"],
      lengthLabel: "Quick read",
      credit: "Aanya & Anshika",
      search: "famous five julian dick anne george timmy kirrin aanya treasure"
    },
    {
      id: "magic-of-storytelling",
      title: "The Magic of Storytelling",
      href: "stories/magic-of-storytelling.html",
      cover: "stories/images/magic/cover.png",
      blurb: "Anshu and Anya — magic dust, Enid Blyton’s garden study, and secrets for young writers.",
      tags: ["magic", "short"],
      lengthLabel: "Quick read",
      search: "anshu anya aanya enid blyton writing magic dust garden study"
    }
  ];

  const START_IDS = ["short-stories", "shy-girl", "from-streets-to-snuggles"];

  const SERIES = [
    {
      id: "shy-girl",
      title: "Vivian & Hazel",
      blurb: "A school friendship across two books — popularity, kindness, and standing up.",
      storyIds: ["shy-girl", "vivian-and-hazel"]
    },
    {
      id: "star",
      title: "Star of the Toy Farm",
      blurb: "A toy dog finds her name, her girl, and a farm full of midnight adventures.",
      storyIds: ["star-of-the-toy-farm", "star-and-the-midnight-feast"]
    }
  ];

  const FILTERS = [
    { id: "all", label: "All" },
    { id: "short", label: "Short reads" },
    { id: "school", label: "School & friends" },
    { id: "magic", label: "Magic & fairy" },
    { id: "animals", label: "Animals" },
    { id: "adventure", label: "Adventure" },
    { id: "series", label: "Series" },
    { id: "kannada", label: "Kannada" }
  ];

  const FILTER_IDS = FILTERS.map(function (item) { return item.id; });

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function byId(id) {
    return STORIES.find(function (story) { return story.id === id; });
  }

  const LANE_NAME = {
    kannada: "Kannada",
    animals: "Animals",
    adventure: "Adventure",
    school: "School",
    magic: "Magic",
    short: "Short read"
  };

  function laneOf(story) {
    if (story.lang === "kn" || story.tags.indexOf("kannada") !== -1) return "kannada";
    if (story.tags.indexOf("animals") !== -1) return "animals";
    if (story.tags.indexOf("adventure") !== -1) return "adventure";
    if (story.tags.indexOf("school") !== -1) return "school";
    if (story.tags.indexOf("magic") !== -1) return "magic";
    return "short";
  }

  function laneLabel(story) {
    const name = LANE_NAME[laneOf(story)];
    if (story.seriesLabel) return name + " · " + story.seriesLabel;
    if (story.lang === "kn") return "Kannada · Project";
    return name;
  }

  function cardHTML(story) {
    const lane = laneOf(story);
    const credit = story.credit || "Anshika Mahesh";
    const extra = story.credit ? "Co-written tale" : "A story by Anshika";
    const mark = story.fresh ? "New" : (story.continued ? "To be continued" : "");
    return (
      '<a class="story-card u-tile u-spring" href="' + esc(story.href) + '">' +
        '<div class="story-card-cover"><img src="' + esc(story.cover) + '" alt="" /></div>' +
        '<div class="story-card-lane story-card-lane--' + lane + '">' + esc(laneLabel(story)) + "</div>" +
        '<div class="story-card-body">' +
          "<h3>" + esc(story.title) + "</h3>" +
          '<p class="story-card-credit">' + esc(credit) + "</p>" +
          (extra ? '<p class="story-card-credit">' + esc(extra) + "</p>" : "") +
        "</div>" +
        '<div class="story-card-foot">' +
          "<span>" + esc(mark) + "</span>" +
          "<span>" + esc(story.lengthLabel || "") + "</span>" +
        "</div>" +
      "</a>"
    );
  }

  function matches(story, filter, query) {
    if (filter && filter !== "all" && story.tags.indexOf(filter) === -1) return false;
    if (query) {
      const hay = (story.title + " " + story.blurb + " " + (story.search || "")).toLowerCase();
      if (hay.indexOf(query) === -1) return false;
    }
    return true;
  }

  function renderGrid(root, stories) {
    root.innerHTML = stories.map(cardHTML).join("");
    const pattern = (root.getAttribute("data-bento") || "").trim().split(/\s+/).filter(Boolean);
    if (!pattern.length) return;
    Array.prototype.forEach.call(root.children, function (card, i) {
      const span = pattern[i] || pattern[pattern.length - 1];
      card.classList.add("u-span-" + span);
      if (i === 0 && root.getAttribute("data-library") === "latest") {
        card.classList.add("u-row-2", "u-tile--feature", "u-enter");
      } else {
        card.classList.add("u-enter");
      }
    });
  }

  function renderSeriesBundles(root) {
    root.innerHTML = SERIES.map(function (bundle) {
      const books = bundle.storyIds.map(byId).filter(Boolean);
      const thumbs = books.map(function (story) {
        return (
          '<a class="series-book" href="' + esc(story.href) + '">' +
            '<img src="' + esc(story.cover) + '" alt="" />' +
            "<span>" + esc(story.seriesLabel || story.title) + "</span>" +
            "<strong>" + esc(story.title) + "</strong>" +
          "</a>"
        );
      }).join("");
      return (
        '<article class="series-bundle u-tile u-spring u-span-6 u-enter">' +
          '<p class="eyebrow">' + books.length + " books</p>" +
          "<h3>" + esc(bundle.title) + "</h3>" +
          "<p>" + esc(bundle.blurb) + "</p>" +
          '<div class="series-bundle-books">' + thumbs + "</div>" +
        "</article>"
      );
    }).join("");
  }

  function groupedSeries(query) {
    const groups = SERIES.map(function (bundle) {
      const stories = bundle.storyIds.map(byId).filter(Boolean).filter(function (story) {
        return matches(story, "all", query);
      }).sort(function (a, b) {
        return (a.seriesBook || 0) - (b.seriesBook || 0);
      });
      return { bundle: bundle, stories: stories };
    }).filter(function (group) { return group.stories.length; });

    const groupedIds = {};
    SERIES.forEach(function (bundle) {
      bundle.storyIds.forEach(function (id) { groupedIds[id] = true; });
    });

    const extras = STORIES.filter(function (story) {
      return story.tags.indexOf("series") !== -1 && !groupedIds[story.id] && matches(story, "all", query);
    });

    return { groups: groups, extras: extras };
  }

  function renderLibrary(root, filter, query) {
    const empty = document.querySelector("[data-library-empty]");
    const count = document.querySelector("[data-library-count]");
    const groupsRoot = document.querySelector("[data-library-groups]");

    if (filter === "series") {
      const packed = groupedSeries(query);
      const total = packed.groups.reduce(function (sum, group) {
        return sum + group.stories.length;
      }, 0) + packed.extras.length;

      root.hidden = true;
      root.innerHTML = "";
      if (groupsRoot) {
        groupsRoot.hidden = total === 0;
        groupsRoot.innerHTML = packed.groups.map(function (group) {
          return (
            '<section class="library-group">' +
              "<h2>" + esc(group.bundle.title) + "</h2>" +
              "<p>" + esc(group.bundle.blurb) + "</p>" +
              '<div class="story-grid catalogue-grid">' + group.stories.map(cardHTML).join("") + "</div>" +
            "</section>"
          );
        }).join("") + (packed.extras.length
          ? '<section class="library-group"><h2>Gift editions</h2><div class="story-grid catalogue-grid">' +
            packed.extras.map(cardHTML).join("") +
            "</div></section>"
          : "");
      }
      if (count) count.textContent = total === 1 ? "1 series story" : total + " series stories";
      if (empty) empty.hidden = total !== 0;
      return;
    }

    if (groupsRoot) {
      groupsRoot.hidden = true;
      groupsRoot.innerHTML = "";
    }
    root.hidden = false;

    const found = STORIES.filter(function (story) {
      return matches(story, filter, query);
    });
    renderGrid(root, found);
    if (count) {
      count.textContent = found.length === STORIES.length
        ? found.length + " stories"
        : found.length + " of " + STORIES.length + " stories";
    }
    if (empty) empty.hidden = found.length !== 0;
  }

  function setChipState(toolbar, filter) {
    toolbar.querySelectorAll("[data-filter]").forEach(function (chip) {
      const on = chip.getAttribute("data-filter") === filter;
      chip.classList.toggle("is-on", on);
      chip.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function initHome() {
    const latest = document.querySelector('[data-library="latest"]');
    const start = document.querySelector('[data-library="start"]');
    const series = document.querySelector('[data-library="series"]');
    if (latest) renderGrid(latest, STORIES.slice(0, 3));
    if (start) renderGrid(start, START_IDS.map(byId).filter(Boolean));
    if (series) renderSeriesBundles(series);
  }

  function initStories() {
    const grid = document.querySelector('[data-library="all"]');
    const toolbar = document.querySelector("[data-library-toolbar]");
    if (!grid || !toolbar) return;

    const search = toolbar.querySelector("[data-library-search]");
    const hash = (location.hash || "").replace("#", "").toLowerCase();
    let filter = FILTER_IDS.indexOf(hash) !== -1 ? hash : "all";

    toolbar.querySelector("[data-library-chips]").innerHTML = FILTERS.map(function (item) {
      return (
        '<button type="button" class="story-chip" data-filter="' + item.id + '" aria-pressed="false">' +
          esc(item.label) +
        "</button>"
      );
    }).join("");

    function paint() {
      const query = search ? search.value.trim().toLowerCase() : "";
      setChipState(toolbar, filter);
      renderLibrary(grid, filter, query);
    }

    toolbar.addEventListener("click", function (event) {
      const chip = event.target.closest("[data-filter]");
      if (!chip) return;
      filter = chip.getAttribute("data-filter");
      if (history.replaceState) {
        history.replaceState(null, "", filter === "all" ? location.pathname : "#" + filter);
      }
      paint();
    });

    if (search) {
      search.addEventListener("input", paint);
    }

    window.addEventListener("hashchange", function () {
      const next = (location.hash || "").replace("#", "").toLowerCase();
      filter = FILTER_IDS.indexOf(next) !== -1 ? next : "all";
      paint();
    });

    paint();
  }

  document.querySelectorAll("[data-story-count]").forEach(function (node) {
    node.textContent = String(STORIES.length);
  });

  initHome();
  initStories();
})();
