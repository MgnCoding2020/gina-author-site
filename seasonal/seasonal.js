(function renderSeasonalLayer() {
  var CONFIG = window.SEASONS_CONFIG || {};
  var mount = document.getElementById("seasonal-mount");

  function todayStr() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function resolveSeason() {
    var params = new URLSearchParams(window.location.search);
    var override = params.get("season");
    if (override) {
      if (override === "none") return null;
      if (CONFIG[override]) return override;
      return null;
    }
    var today = todayStr();
    for (var key in CONFIG) {
      var s = CONFIG[key];
      if (s.start && s.end && today >= s.start && today <= s.end) return key;
    }
    return null;
  }

  var activeKey = resolveSeason();
  if (!activeKey) return;
  var season = CONFIG[activeKey];
  if (!season) return;

  if (mount) {

  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  }

  function cardHTML(card) {
    return (
      '<article class="card seasonal-card">' +
      '<button type="button" class="card-image card-preview-trigger" data-pdf="' +
      escapeAttr(card.pdf) +
      '" data-title="' +
      escapeAttr(card.title) +
      '" aria-label="Preview ' +
      escapeAttr(card.title) +
      '">' +
      '<img src="' +
      escapeAttr(card.preview) +
      '" alt="' +
      escapeAttr(card.previewAlt) +
      '" width="' +
      card.width +
      '" height="' +
      card.height +
      '" loading="lazy" />' +
      '<span class="preview-overlay" aria-hidden="true">' +
      '<span class="preview-overlay-icon">&#128270;</span>' +
      '<span class="preview-overlay-label">Click to preview</span>' +
      "</span>" +
      "</button>" +
      "<h3>" +
      card.title +
      "</h3>" +
      "<p>" +
      card.desc +
      "</p>" +
      '<div class="card-actions">' +
      '<button type="button" class="btn btn-ghost btn-small card-preview-trigger" data-pdf="' +
      escapeAttr(card.pdf) +
      '" data-title="' +
      escapeAttr(card.title) +
      '">Preview</button>' +
      '<a href="' +
      escapeAttr(card.pdf) +
      '" download class="btn btn-small">Download PDF</a>' +
      "</div>" +
      "</article>"
    );
  }

  var html = '<div class="seasonal-banner">';
  if (season.eyebrow) {
    html += '<p class="seasonal-eyebrow">' + season.eyebrow + "</p>";
  }
  html += '<h3 class="seasonal-heading">' + season.heading + "</h3>";
  if (season.intro) {
    html += '<p class="seasonal-sub">' + season.intro + "</p>";
  }
  html += "</div>";

  if (season.cards && season.cards.length) {
    html += '<div class="card-grid seasonal-card-grid">';
    for (var i = 0; i < season.cards.length; i++) {
      html += cardHTML(season.cards[i]);
    }
    html += "</div>";

    if (season.pack) {
      html +=
        '<div class="seasonal-pack"><a href="' +
        escapeAttr(season.pack.pdf) +
        '" download class="btn btn-primary">' +
        season.pack.label +
        "</a></div>";
    }
  }

  mount.innerHTML = html;

  }

  /* ---- Decorations ---- */
  var decor = season.decor;
  if (!decor) return;

  var DECOR_KEY = "seasonalDecorOff";
  var decorOff = window.localStorage && window.localStorage.getItem(DECOR_KEY) === "1";

  function applyDecorState() {
    document.documentElement.classList.toggle("seasonal-decor-off", decorOff);
  }

  var toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "seasonal-decor-toggle btn btn-ghost btn-small";
  toggleBtn.textContent = decorOff ? "Turn on decorations" : "Turn off decorations";
  toggleBtn.addEventListener("click", function () {
    decorOff = !decorOff;
    applyDecorState();
    toggleBtn.textContent = decorOff ? "Turn on decorations" : "Turn off decorations";
    try {
      if (window.localStorage) {
        if (decorOff) window.localStorage.setItem(DECOR_KEY, "1");
        else window.localStorage.removeItem(DECOR_KEY);
      }
    } catch (e) {
      /* localStorage unavailable (private mode) — toggle still works for this page view */
    }
  });
  document.body.appendChild(toggleBtn);
  applyDecorState();

  if (decor.lights) {
    var lights = document.createElement("div");
    lights.className = "seasonal-lights";
    lights.setAttribute("aria-hidden", "true");
    var lightEdges = [
      { cls: "seasonal-lights-top", count: 16 },
      { cls: "seasonal-lights-right", count: 9 },
      { cls: "seasonal-lights-bottom", count: 16 },
      { cls: "seasonal-lights-left", count: 9 }
    ];
    lightEdges.forEach(function (edge) {
      var strip = document.createElement("div");
      strip.className = "seasonal-lights-edge " + edge.cls;
      for (var b = 0; b < edge.count; b++) {
        var bulb = document.createElement("span");
        bulb.className = "seasonal-light";
        strip.appendChild(bulb);
      }
      lights.appendChild(strip);
    });
    document.body.insertBefore(lights, document.body.firstChild);
  }

  if (decor.overlay) {
    var overlay = document.createElement("div");
    overlay.className = "seasonal-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.insertBefore(overlay, document.body.firstChild);
  }

  if (decor.flyers && decor.flyers.length) {
    var FLYER_POOL_SIZE = 6;
    var FLYER_LANES = 5;
    var FLYER_EDGE_PAD = 80;

    var flyerSlots = [];
    for (var fi = 0; fi < FLYER_POOL_SIZE; fi++) {
      var name = decor.flyers[fi % decor.flyers.length];
      var img = document.createElement("img");
      img.className = "seasonal-flyer";
      img.src = "seasonal/halloween/decor/" + name + ".svg";
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      document.body.appendChild(img);
      flyerSlots.push({ el: img, busy: false });
    }

    function randomEdgePoint() {
      var edge = Math.floor(Math.random() * 4);
      var along = Math.random();
      if (edge === 0) return { x: along * window.innerWidth, y: -FLYER_EDGE_PAD };
      if (edge === 1) return { x: window.innerWidth + FLYER_EDGE_PAD, y: along * window.innerHeight };
      if (edge === 2) return { x: along * window.innerWidth, y: window.innerHeight + FLYER_EDGE_PAD };
      return { x: -FLYER_EDGE_PAD, y: along * window.innerHeight };
    }

    function launchFlight() {
      var idle = flyerSlots.filter(function (slot) {
        return !slot.busy;
      });
      if (!idle.length) return;
      var slot = idle[Math.floor(Math.random() * idle.length)];
      slot.busy = true;
      var el = slot.el;
      var start = randomEdgePoint();
      var end = randomEdgePoint();

      el.classList.remove("flying");
      el.style.transition = "none";
      el.style.left = start.x + "px";
      el.style.top = start.y + "px";
      el.style.transform = "translate(0px, 0px)";
      void el.offsetWidth;
      el.style.transition = "";
      el.style.transform = "translate(" + (end.x - start.x) + "px, " + (end.y - start.y) + "px)";
      el.classList.add("flying");
      el.addEventListener(
        "transitionend",
        function handler(e) {
          if (e.propertyName !== "transform") return;
          el.classList.remove("flying");
          el.removeEventListener("transitionend", handler);
          slot.busy = false;
        }
      );
    }

    function scheduleLane(isFirst) {
      var delay = isFirst ? 4000 + Math.random() * 4000 : 15000 + Math.random() * 10000;
      setTimeout(function () {
        if (
          document.visibilityState === "visible" &&
          !decorOff &&
          !document.documentElement.classList.contains("seasonal-decor-off")
        ) {
          launchFlight();
        }
        scheduleLane(false);
      }, delay);
    }

    for (var lane = 0; lane < FLYER_LANES; lane++) {
      scheduleLane(true);
    }
  }

  if (decor.bouncer) {
    var BOUNCER_SIZE = 72;
    var bouncer = document.createElement("img");
    bouncer.className = "seasonal-bouncer";
    bouncer.src = "seasonal/halloween/decor/" + decor.bouncer + ".svg";
    bouncer.alt = "";
    bouncer.setAttribute("aria-hidden", "true");
    document.body.appendChild(bouncer);

    var bx = Math.random() * Math.max(window.innerWidth - BOUNCER_SIZE, 0);
    var by = Math.random() * Math.max(window.innerHeight - BOUNCER_SIZE, 0);
    var bvx = (Math.random() < 0.5 ? -1 : 1) * (0.08 + Math.random() * 0.06);
    var bvy = (Math.random() < 0.5 ? -1 : 1) * (0.08 + Math.random() * 0.06);
    var lastTick = null;

    function bounceTick(timestamp) {
      requestAnimationFrame(bounceTick);

      if (
        document.visibilityState !== "visible" ||
        decorOff ||
        document.documentElement.classList.contains("seasonal-decor-off")
      ) {
        lastTick = null;
        return;
      }
      if (lastTick === null) {
        lastTick = timestamp;
        return;
      }

      var dt = Math.min(timestamp - lastTick, 50);
      lastTick = timestamp;

      bx += bvx * dt;
      by += bvy * dt;

      var maxX = window.innerWidth - BOUNCER_SIZE;
      var maxY = window.innerHeight - BOUNCER_SIZE;
      if (bx <= 0) {
        bx = 0;
        bvx = Math.abs(bvx);
      } else if (bx >= maxX) {
        bx = maxX;
        bvx = -Math.abs(bvx);
      }
      if (by <= 0) {
        by = 0;
        bvy = Math.abs(bvy);
      } else if (by >= maxY) {
        by = maxY;
        bvy = -Math.abs(bvy);
      }

      bouncer.style.transform = "translate(" + bx + "px, " + by + "px)";
    }
    requestAnimationFrame(bounceTick);
  }
})();
