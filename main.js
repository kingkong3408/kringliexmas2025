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

  // ===== Gallery + Lightbox =====
  const galleryItems = [
    { src: "assets/gallery/pic01_kaitennis.jpg", caption: "Kai, tennis mode", alt: "Kai playing tennis indoors" },
    { src: "assets/gallery/pic02_chief.jpg", caption: "Chief", alt: "Chief" },
    { src: "assets/gallery/pic03_halegun.jpg", caption: "Hale", alt: "Hale" },
    { src: "assets/gallery/pic04_susanerikhof.jpg", caption: "Susan & Erik", alt: "Susan and Erik smiling" },
    { src: "assets/gallery/pic05_catsfranktessie.jpg", caption: "Frank & Tessie", alt: "Two cats lounging" },
    { src: "assets/gallery/pic06_familyboston.jpg", caption: "Family — Boston", alt: "Family photo in Boston" },
    { src: "assets/gallery/pic07_familyfenway.jpg", caption: "Family — Fenway", alt: "Family at Fenway Park" },
    { src: "assets/gallery/pic08_familyfenway.jpg", caption: "Fenway, part 2", alt: "Family at Fenway Park (second photo)" },
    { src: "assets/gallery/pic09_halekaifenway.jpg", caption: "Hale & Kai — Fenway", alt: "Hale and Kai at Fenway Park" },
    { src: "assets/gallery/pic10_chief.jpg", caption: "Chief (again, because obviously)", alt: "Chief again" },
  ];

  const grid = document.getElementById("galleryGrid");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImage");
  const lbCap = document.getElementById("lbCaption");

  let currentIndex = 0;

  function renderLightbox() {
    const item = galleryItems[currentIndex];
    lbImg.src = item.src;
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
    // NOTE: do NOT clear lbImg.src here — that’s one cause of “empty lightbox” weirdness.
  }

  function showNext(dir) {
    currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
    renderLightbox();
  }

  if (grid) {
    grid.innerHTML = galleryItems.map((item, i) => `
      <figure class="thumb" role="button" tabindex="0" data-idx="${i}" aria-label="Open photo ${i + 1}">
        <img src="${item.src}" alt="${item.alt || ""}" loading="lazy" />
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

  // Disable snow gracefully if needed (NO early return!)
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
})();