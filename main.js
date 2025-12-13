(() => {
  // ===== Basics =====
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = String(new Date().getFullYear());
  });

  const copyBtn = document.getElementById("copyLink");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => (copyBtn.textContent = "🔗 Copy Link"), 1200);
      } catch {
        copyBtn.textContent = "😅 No clipboard";
        setTimeout(() => (copyBtn.textContent = "🔗 Copy Link"), 1200);
      }
    });
  }

  // ===== Gallery + Lightbox (thumbs in grid, full in lightbox) =====
  const galleryItems = [
    { thumb: "assets/gallery/thumbs/pic06_familyboston.jpg", full: "assets/gallery/full/pic06_familyboston.jpg", caption: "Family — Boston", alt: "Family photo in Boston" },
    { thumb: "assets/gallery/thumbs/pic01_kaitennis.jpg", full: "assets/gallery/full/pic01_kaitennis.jpg", caption: "Kai - Cobber Tennis", alt: "Kai playing Cobber tennis" },
    { thumb: "assets/gallery/thumbs/pic02_chief.jpg", full: "assets/gallery/full/pic02_chief.jpg", caption: "Chief", alt: "Chief" },
    { thumb: "assets/gallery/thumbs/pic03_halegun.jpg", full: "assets/gallery/full/pic03_halegun.jpg", caption: "Hale", alt: "Hale" },
    { thumb: "assets/gallery/thumbs/pic04_susanerikhof.jpg", full: "assets/gallery/full/pic04_susanerikhof.jpg", caption: "Susan & Erik - ND Tennis HOF", alt: "Susan and Erik at their Hall of Fame Plaque" },
    { thumb: "assets/gallery/thumbs/pic05_catsfranktessie.jpg", full: "assets/gallery/full/pic05_catsfranktessie.jpg", caption: "Frank & Tessie", alt: "Two cats lounging" },
    { thumb: "assets/gallery/thumbs/pic07_familyfenway.jpg", full: "assets/gallery/full/pic07_familyfenway.jpg", caption: "Family — Fenway", alt: "Family at Fenway Park" },
    { thumb: "assets/gallery/thumbs/pic08_familyfenway.jpg", full: "assets/gallery/full/pic08_familyfenway.jpg", caption: "Fenway - part 2", alt: "Family at Fenway Park (second photo)" },
    { thumb: "assets/gallery/thumbs/pic09_halekaifenway.jpg", full: "assets/gallery/full/pic09_halekaifenway.jpg", caption: "Hale & Kai — Fenway on the Green Monster", alt: "Hale and Kai at Fenway Park" },
    { thumb: "assets/gallery/thumbs/pic11_floridacobbertennis.jpg", full: "assets/gallery/full/pic11_floridacobbertennis.jpg", caption: "Florida Cobber tennis (sun edition)", alt: "Tennis in Florida" },
    { thumb: "assets/gallery/thumbs/pic12_halehunting.jpg", full: "assets/gallery/full/pic12_halehunting.jpg", caption: "Hale - hunting mode", alt: "Hale hunting" },
    { thumb: "assets/gallery/thumbs/pic13_halenewhome.jpg", full: "assets/gallery/full/pic13_halenewhome.jpg", caption: "Hale's new home base", alt: "Hale at new home" },
    { thumb: "assets/gallery/thumbs/pic14_kaicobbertennisgameday.jpg", full: "assets/gallery/full/pic14_kaicobbertennisgameday.jpg", caption: "Kai - Cobber Tennis Game Day", alt: "Kai on tennis game day" },
    { thumb: "assets/gallery/thumbs/pic10_chief.jpg", full: "assets/gallery/full/pic10_chief.jpg", caption: "Chief (again, because obviously)", alt: "Chief again" },
  ];

  const grid = document.getElementById("galleryGrid");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImage");
  const lbCap = document.getElementById("lbCaption");

  let currentIndex = 0;

  function renderLightbox() {
    const item = galleryItems[currentIndex];
    lbImg.src = item.full;
    lbImg.alt = item.alt || "";
    lbCap.textContent = item.caption || "";
  }

  function openLightbox(i) {
    if (!lightbox || !lbImg || !lbCap) return;
    currentIndex = i;
    renderLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function showNext(dir) {
    currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
    renderLightbox();
  }

  if (grid) {
    grid.innerHTML = galleryItems.map((item, i) => `
      <figure class="thumb" role="button" tabindex="0" data-idx="${i}" aria-label="Open photo ${i + 1}">
        <img src="${item.thumb}" alt="${item.alt || ""}" loading="lazy" />
        <figcaption>${item.caption || ""}</figcaption>
      </figure>
    `).join("");

    grid.addEventListener("click", (e) => {
      const fig = e.target.closest(".thumb");
      if (!fig) return;
      openLightbox(Number(fig.dataset.idx));
    });

    grid.addEventListener("keydown", (e) => {
      const fig = e.target.closest(".thumb");
      if (!fig) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(Number(fig.dataset.idx));
      }
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target.matches("[data-close]")) closeLightbox();
      if (e.target.matches("[data-prev]")) showNext(-1);
      if (e.target.matches("[data-next]")) showNext(1);
    });

    window.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showNext(-1);
      if (e.key === "ArrowRight") showNext(1);
    });
  }

  // ===== Snow (optional; never blocks the rest) =====
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const canvas = document.getElementById("snow");
  const ctx = canvas?.getContext?.("2d");
  const toggleBtn = document.getElementById("toggleSnow");

  let snowOn = true;
  let w = 0, h = 0, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const flakes = [];
  const FLAKE_COUNT = 120;

  function resizeSnow() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function makeFlake() {
    return { x: rand(0, w), y: rand(-h, 0), r: rand(0.8, 2.6), vx: rand(-0.35, 0.35), vy: rand(0.7, 1.9), a: rand(0.25, 0.85) };
  }

  function initSnow() {
    flakes.length = 0;
    for (let i = 0; i < FLAKE_COUNT; i++) flakes.push(makeFlake());
  }

  function stepSnow() {
    if (!snowOn) return;
    ctx.clearRect(0, 0, w, h);

    for (const f of flakes) {
      f.x += f.vx;
      f.y += f.vy;

      f.vx += rand(-0.02, 0.02);
      f.vx = Math.max(-0.6, Math.min(0.6, f.vx));

      if (f.y > h + 10) { f.y = rand(-40, -10); f.x = rand(0, w); }
      if (f.x < -10) f.x = w + 10;
      if (f.x > w + 10) f.x = -10;

      ctx.globalAlpha = f.a;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(stepSnow);
  }

  if (!canvas || !ctx || prefersReducedMotion) {
    snowOn = false;
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", "false");
      toggleBtn.textContent = "❄️ Snow: Off";
    }
  } else {
    resizeSnow();
    initSnow();
    requestAnimationFrame(stepSnow);

    window.addEventListener("resize", () => {
      resizeSnow();
      initSnow();
    });

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        snowOn = !snowOn;
        toggleBtn.setAttribute("aria-pressed", String(snowOn));
        toggleBtn.textContent = snowOn ? "❄️ Snow: On" : "❄️ Snow: Off";
        if (snowOn) requestAnimationFrame(stepSnow);
        else ctx.clearRect(0, 0, w, h);
      });
    }
  }

  // ===== Map (Leaflet / OSM) =====
  (function initI94Map(){
    const el = document.getElementById("i94map");
    if (!el || !window.L) return;

    const bismarck = [46.8083, -100.7837];
    const jamestown = [46.9105, -98.7084];
    const valleyCity = [46.9233, -98.0032];

    const mystery1 = [46.85, -100.10];
    const mystery2 = [46.88, -99.55];
    const mystery3 = [46.90, -99.05];

    const map = L.map("i94map", { scrollWheelZoom: false });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const iconOpts = {
      radius: 7,
      weight: 2,
      color: "rgba(255,255,255,.9)",
      fillOpacity: 0.9
    };

    const mk = (latlng, label, fillColor) =>
      L.circleMarker(latlng, { ...iconOpts, fillColor }).addTo(map).bindPopup(label);

    mk(bismarck, "<b>Bismarck</b><br>Cards last seen behaving normally.", "#e9c46a");
    mk(jamestown, "<b>Jamestown</b><br>Somewhere near here… the box went <em>hollow</em>.", "#c81d25");
    mk(valleyCity, "<b>Valley City</b><br>Home base. Waiting patiently. Mostly.", "#2a9d5b");

    mk(mystery1, "Possible scatter zone: “Box vibes questionable.”", "#c81d25");
    mk(mystery2, "Possible scatter zone: “Card confetti?”", "#c81d25");
    mk(mystery3, "Possible scatter zone: “UPS says: ¯\\\\_(ツ)_/¯ ”", "#c81d25");

    const routeA = L.polyline([bismarck, jamestown], { weight: 4, opacity: 0.85 }).addTo(map);
    const routeB = L.polyline([jamestown, valleyCity], { weight: 4, opacity: 0.55, dashArray: "6 8" }).addTo(map);

    const group = L.featureGroup([routeA, routeB]);
    map.fitBounds(group.getBounds().pad(0.25));
  })();

})();