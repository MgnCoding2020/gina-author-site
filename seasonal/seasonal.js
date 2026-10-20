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
  document.documentElement.classList.add("season-" + activeKey);

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
      img.src = "seasonal/" + activeKey + "/decor/" + name + ".svg";
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
    bouncer.src = "seasonal/" + activeKey + "/decor/" + decor.bouncer + ".svg";
    bouncer.alt = "";
    bouncer.setAttribute("aria-hidden", "true");
    document.body.appendChild(bouncer);

    var bx = Math.random() * Math.max(window.innerWidth - BOUNCER_SIZE, 0);
    var by = Math.random() * Math.max(window.innerHeight - BOUNCER_SIZE, 0);
    var bvx = (Math.random() < 0.5 ? -1 : 1) * (0.08 + Math.random() * 0.06);
    var bvy = (Math.random() < 0.5 ? -1 : 1) * (0.08 + Math.random() * 0.06);
    var brot = 0;
    var BOUNCER_SPIN_SPEED = decor.bouncerTwirl ? 0.03 : 0; // deg/ms, ~1 turn per ~3.3s
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

      var transform = "translate(" + bx + "px, " + by + "px)";
      if (BOUNCER_SPIN_SPEED) {
        brot = (brot + BOUNCER_SPIN_SPEED * dt) % 360;
        transform += " rotate(" + brot + "deg)";
      }
      bouncer.style.transform = transform;
    }
    requestAnimationFrame(bounceTick);
  }

  // Set by the leaf-pile block below (if active) so a landing falling-leaf
  // can feed a new piece into the pile. Declared here so it exists
  // regardless of block order -- assignment always completes before any
  // animationend event can fire, since events only fire after this
  // synchronous script body finishes running.
  var onLeafLand = null;

  if (decor.leaves && decor.leaves.length) {
    var LEAF_POOL_SIZE = 10;

    function randomizeLeaf(el) {
      var name = decor.leaves[Math.floor(Math.random() * decor.leaves.length)];
      var size = 26 + Math.random() * 18;
      var duration = 9 + Math.random() * 7;
      var delay = Math.random() * 8;
      var sway = 40 + Math.random() * 60;
      el.src = "seasonal/" + activeKey + "/decor/" + name + ".svg";
      el.style.width = size + "px";
      el.style.left = Math.random() * 100 + "vw";
      el.style.setProperty("--leaf-duration", duration + "s");
      el.style.setProperty("--leaf-delay", delay + "s");
      el.style.setProperty("--leaf-sway", sway + "px");
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
    }

    for (var li = 0; li < LEAF_POOL_SIZE; li++) {
      var leafEl = document.createElement("img");
      leafEl.className = "seasonal-leaf";
      leafEl.alt = "";
      leafEl.setAttribute("aria-hidden", "true");
      randomizeLeaf(leafEl);
      leafEl.addEventListener("animationend", function (e) {
        if (onLeafLand) onLeafLand();
        randomizeLeaf(e.target);
      });
      document.body.appendChild(leafEl);
    }
  }

  if (decor.pumpkinCluster) {
    var pumpkinCluster = document.createElement("img");
    pumpkinCluster.className = "seasonal-pumpkin-cluster";
    pumpkinCluster.src = "seasonal/" + activeKey + "/decor/pumpkin-cluster.svg";
    pumpkinCluster.alt = "";
    pumpkinCluster.setAttribute("aria-hidden", "true");
    document.body.appendChild(pumpkinCluster);
  }

  if (decor.scarecrowAnchor) {
    // Two-layer structure: the outer wrapper holds position + the walking
    // translateX (a JS-driven transition), the inner image holds the
    // continuous jig bounce (a CSS keyframe animation). They have to live
    // on separate elements -- both would otherwise be fighting to set the
    // same element's `transform`.
    var SCARECROW_WALK_DISTANCE = 220;

    var scarecrowWrap = document.createElement("div");
    scarecrowWrap.className = "seasonal-scarecrow-walker";
    scarecrowWrap.setAttribute("aria-hidden", "true");
    var scarecrowEl = document.createElement("img");
    scarecrowEl.className = "seasonal-scarecrow-anchor";
    scarecrowEl.alt = "";
    scarecrowWrap.appendChild(scarecrowEl);
    document.body.appendChild(scarecrowWrap);

    function setScarecrowFrame(name) {
      scarecrowEl.src = "seasonal/" + activeKey + "/decor/" + name + ".webp";
    }
    function setScarecrowFacing(mirrored) {
      scarecrowEl.style.animationName = mirrored ? "seasonal-scarecrow-jig-mirrored" : "seasonal-scarecrow-jig";
    }
    setScarecrowFrame("scarecrow-front");
    setScarecrowFacing(false);

    // Idle (facing home) -> turn (brief side-view) -> walk out -> idle ->
    // turn -> walk back -> repeat. The art has no walk-cycle leg frames, so
    // "walking" is the whole figure sliding while the jig bounce keeps it
    // feeling alive, with the side view standing in for the turn itself.
    var scarecrowAtHome = true;

    function scarecrowCycle() {
      // turn
      setScarecrowFrame("scarecrow-side");
      setTimeout(function () {
        scarecrowAtHome = !scarecrowAtHome;
        setScarecrowFrame("scarecrow-front");
        setScarecrowFacing(!scarecrowAtHome);
        scarecrowWrap.style.transition = "transform 3.5s ease-in-out";
        scarecrowWrap.style.transform = scarecrowAtHome
          ? "translateX(0)"
          : "translateX(-" + SCARECROW_WALK_DISTANCE + "px)";
        var settleDelay = 3500 + (scarecrowAtHome ? 12000 + Math.random() * 8000 : 4000 + Math.random() * 3000);
        setTimeout(scarecrowCycle, settleDelay);
      }, 550);
    }
    setTimeout(scarecrowCycle, 12000 + Math.random() * 8000);
  }

  if (decor.trim) {
    var trim = document.createElement("div");
    trim.className = "seasonal-trim";
    trim.setAttribute("aria-hidden", "true");
    var trimTileH = "url(seasonal/" + activeKey + "/decor/vine-tile-h.svg)";
    var trimTileV = "url(seasonal/" + activeKey + "/decor/vine-tile-v.svg)";
    [
      { side: "top", tile: trimTileH },
      { side: "bottom", tile: trimTileH },
      { side: "left", tile: trimTileV },
      { side: "right", tile: trimTileV }
    ].forEach(function (edge) {
      var strip = document.createElement("div");
      strip.className = "seasonal-trim-edge seasonal-trim-" + edge.side;
      strip.style.backgroundImage = edge.tile;
      trim.appendChild(strip);
    });
    document.body.insertBefore(trim, document.body.firstChild);
  }

  if (decor.leafPile && decor.leaves && decor.leaves.length) {
    var PILE_BOX_WIDTH = 320;
    var PILE_MAX_PIECES = 40;
    var PILE_EXPLODE_MS = 600;
    var pilePool = decor.leaves.concat(["acorn"]);

    var pileBox = document.createElement("div");
    pileBox.className = "seasonal-leaf-pile";
    pileBox.setAttribute("aria-hidden", "true");
    document.body.appendChild(pileBox);

    // No timer, no auto-explode: the pile just keeps growing as leaves land
    // (up to a practical cap) until a visitor clicks it. "settling" is a
    // brief technical cooldown covering the burst transition only, so a
    // leaf landing mid-explosion doesn't spawn a piece into a pile that's
    // still mid-animation.
    var pileState = "collecting"; // "collecting" | "settling"
    var pilePieces = [];

    function addPilePiece() {
      if (pileState !== "collecting" || pilePieces.length >= PILE_MAX_PIECES) return;
      var name = pilePool[Math.floor(Math.random() * pilePool.length)];
      var piece = document.createElement("img");
      piece.className = "seasonal-pile-piece";
      piece.src = "seasonal/" + activeKey + "/decor/" + name + ".svg";
      piece.alt = "";
      var size = 30 + Math.random() * 18;
      var spread = Math.min(26 + pilePieces.length * 2.4, 140);
      var offsetX = (Math.random() * 2 - 1) * spread;
      piece.style.width = size + "px";
      piece.style.left = PILE_BOX_WIDTH / 2 + offsetX + "px";
      piece.style.bottom = Math.random() * 10 + "px";
      piece.style.setProperty("--pile-rotate", Math.random() * 50 - 25 + "deg");
      piece.style.transform = "rotate(var(--pile-rotate))";
      pileBox.appendChild(piece);
      pilePieces.push(piece);
    }

    function explodePile() {
      if (pileState !== "collecting" || !pilePieces.length) return;
      pileState = "settling";
      pilePieces.forEach(function (piece) {
        var angle = Math.random() * Math.PI * 2;
        var dist = 70 + Math.random() * 100;
        var dx = Math.cos(angle) * dist;
        var dy = Math.sin(angle) * dist * -1 - 30;
        piece.style.transition =
          "transform " + PILE_EXPLODE_MS / 1000 + "s ease-out, opacity " + PILE_EXPLODE_MS / 1000 + "s ease-out";
        piece.style.transform =
          "rotate(var(--pile-rotate)) translate(" + dx + "px, " + dy + "px) rotate(" + (Math.random() * 180 - 90) + "deg)";
        piece.style.opacity = "0";
      });
      setTimeout(function () {
        pileBox.innerHTML = "";
        pilePieces = [];
        pileState = "collecting";
      }, PILE_EXPLODE_MS + 50);
    }

    pileBox.addEventListener("click", explodePile);
    onLeafLand = addPilePiece;
  }

  if (decor.cardAccent) {
    document.documentElement.classList.add("seasonal-card-accent");
  }

  if (decor.squirrel) {
    var SQUIRREL_SIZE = 70;
    var squirrelEl = document.createElement("img");
    squirrelEl.className = "seasonal-squirrel";
    squirrelEl.alt = "";
    squirrelEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(squirrelEl);

    function setSquirrelPose(name) {
      squirrelEl.src = "seasonal/" + activeKey + "/decor/squirrel-" + name + ".webp";
    }

    // Picks an edge (left or right) of a currently-on-screen card to perch
    // on and peek from, using the matching peek-left/peek-right art; falls
    // back to a spot near the bottom if no card is visible. Coordinates are
    // document-absolute (rect + current scroll), matching the element being
    // position:absolute rather than fixed -- see the note on squirrelEl
    // below for why.
    function pickPerchPoint() {
      var cards = Array.prototype.slice.call(
        document.querySelectorAll(".card, .seasonal-card, .review-card")
      );
      var visible = cards.filter(function (el) {
        var r = el.getBoundingClientRect();
        return r.width > 0 && r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0;
      });
      if (!visible.length) {
        return {
          x: window.scrollX + Math.random() * Math.max(window.innerWidth - SQUIRREL_SIZE, 0),
          y: window.scrollY + window.innerHeight - 60 - Math.random() * 180,
          peekPose: Math.random() < 0.5 ? "peek-left" : "peek-right",
        };
      }
      var card = visible[Math.floor(Math.random() * visible.length)];
      var r = card.getBoundingClientRect();
      var pageTop = window.scrollY + Math.max(r.top - SQUIRREL_SIZE * 0.4, 0);
      if (Math.random() < 0.5) {
        // peek-left's grip hangs off the art's own right edge -- line that
        // edge up with the card's right edge (a few px of overlap so it
        // reads as gripping on, not floating past it).
        return { x: window.scrollX + r.right - SQUIRREL_SIZE + 6, y: pageTop, peekPose: "peek-left" };
      }
      // peek-right's grip hangs off the art's own left edge -- line that up
      // with the card's left edge instead.
      return { x: window.scrollX + r.left - 6, y: pageTop, peekPose: "peek-right" };
    }

    function randomSideEntry() {
      var fromLeft = Math.random() < 0.5;
      var y = window.scrollY + window.innerHeight - 50 - Math.random() * 180;
      return { x: fromLeft ? window.scrollX - SQUIRREL_SIZE : window.scrollX + window.innerWidth + SQUIRREL_SIZE, y: y };
    }

    var squirrelX = 0;

    function moveTo(point, duration, cb) {
      setSquirrelPose(point.x >= squirrelX ? "run-right" : "run-left");
      squirrelX = point.x;
      squirrelEl.style.transition = "transform " + duration + "s ease-in-out";
      squirrelEl.style.transform = "translate(" + point.x + "px, " + point.y + "px)";
      var handled = false;
      function done(e) {
        if (e && e.propertyName !== "transform") return;
        if (handled) return;
        handled = true;
        squirrelEl.removeEventListener("transitionend", done);
        cb();
      }
      squirrelEl.addEventListener("transitionend", done);
      setTimeout(done, duration * 1000 + 300);
    }

    function scheduleSquirrel() {
      var delay = 15000 + Math.random() * 20000;
      setTimeout(runSquirrelRoute, delay);
    }

    function runSquirrelRoute() {
      if (
        document.visibilityState !== "visible" ||
        decorOff ||
        document.documentElement.classList.contains("seasonal-decor-off")
      ) {
        scheduleSquirrel();
        return;
      }

      var entry = randomSideEntry();
      squirrelX = entry.x;
      setSquirrelPose(entry.x < 0 ? "run-right" : "run-left");
      squirrelEl.style.transition = "none";
      squirrelEl.style.opacity = "0";
      squirrelEl.style.transform = "translate(" + entry.x + "px, " + entry.y + "px)";
      void squirrelEl.offsetWidth;
      squirrelEl.style.transition = "opacity 0.3s ease";
      squirrelEl.style.opacity = "1";

      var perch = pickPerchPoint();
      var exit = randomSideEntry();
      var moveDuration = 2.6 + Math.random() * 1.8;

      moveTo(perch, moveDuration, function () {
        setSquirrelPose(perch.peekPose);
        setTimeout(function () {
          moveTo(exit, moveDuration, function () {
            squirrelEl.style.transition = "opacity 0.3s ease";
            squirrelEl.style.opacity = "0";
            scheduleSquirrel();
          });
        }, 2000 + Math.random() * 2000);
      });
    }

    scheduleSquirrel();
  }
})();
