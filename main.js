(() => {
  // Year stamps
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = String(new Date().getFullYear());
  });

  // Copy link
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

  // Snow (respects reduced motion)
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const canvas = document.getElementById("snow");
  const ctx = canvas?.getContext?.("2d");

  let snowOn = true;
  const toggleBtn = document.getElementById("toggleSnow");

  if (!canvas || !ctx || prefersReducedMotion) {
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", "false");
      toggleBtn.textContent = "❄️ Snow: Off";
    }
    return;
  }

  let w = 0, h = 0, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const flakes = [];
  const FLAKE_COUNT = 120;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makeFlake() {
    return {
      x: rand(0, w),
      y: rand(-h, 0),
      r: rand(0.8, 2.6),
      vx: rand(-0.35, 0.35),
      vy: rand(0.7, 1.9),
      a: rand(0.25, 0.85)
    };
  }

  function init() {
    flakes.length = 0;
    for (let i = 0; i < FLAKE_COUNT; i++) flakes.push(makeFlake());
  }

  function step() {
    if (!snowOn) return;

    ctx.clearRect(0, 0, w, h);

    for (const f of flakes) {
      f.x += f.vx;
      f.y += f.vy;

      // gentle drift
      f.vx += rand(-0.02, 0.02);
      f.vx = Math.max(-0.6, Math.min(0.6, f.vx));

      if (f.y > h + 10) {
        f.y = rand(-40, -10);
        f.x = rand(0, w);
      }
      if (f.x < -10) f.x = w + 10;
      if (f.x > w + 10) f.x = -10;

      ctx.globalAlpha = f.a;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(step);
  }

  // ===== Gallery (10 photos + captions + lightbox) =====
  const galleryItems = [
    { src: "assets/gallery/pic01_kaitennis.jpg", caption: "pic01_kaitennis.jpg", alt: "Photo 1" },
    { src: "assets/gallery/pic02_chief.jpg", caption: "pic02_chief.jpg", alt: "Photo 2" },
    { src: "assets/gallery/pic03_halegun.jpg", caption: "pic03_halegun.jpg", alt: "Photo 3" },
    { src: "assets/gallery/pic04_susanerikhof.jpg", caption: "pic04_susanerikhof.jpg", alt: "Photo 4" },
    { src: "assets/gallery/pic05_catsfranktessie.jpg", caption: "pic05_catsfranktessie.jpg", alt: "Photo 5" },
    { src: "assets/gallery/pic06_familyboston.jpg", caption: "pic06_familyboston.jpg", alt: "Photo 6" },
    { src: "assets/gallery/pic07_familyfenway.jpg", caption: "pic07_familyfenway.jpg", alt: "Photo 7" },
    { src: "assets/gallery/pic08_familyfenway.jpg", caption: "pic08_familyfenway.jpg", alt: "Photo 8" },
    { src: "assets/gallery/pic09_halekaifenway.jpg", caption: "pic09_halekaifenway.jpg", alt: "Photo 9" },
    { src: "assets/gallery/pic10_chief.jpg", caption: "pic10_chief.jpg", alt: "Photo 10" },
  ];

  const grid = document.getElementById("galleryGrid");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImage");
  const lbCap = document.getElementById("lbCaption");

  let currentIndex = 0;

  function openLightbox(i) {
    currentIndex = i;
    const item = galleryItems[currentIndex];
    lbImg.src = item.src;
    lbImg.alt = item.alt || "";
    lbCap.textContent = item.caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    // Optional: stop memory creep on mobile Safari
    lbImg.removeAttribute("src");
  }

  function showNext(dir) {
    currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    lbImg.src = item.src;
    lbImg.alt = item.alt || "";
    lbCap.textContent = item.caption || "";
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


  resize();
  init();
  requestAnimationFrame(step);
  window.addEventListener("resize", () => {
    resize();
    init();
  });

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      snowOn = !snowOn;
      toggleBtn.setAttribute("aria-pressed", String(snowOn));
      toggleBtn.textContent = snowOn ? "❄️ Snow: On" : "❄️ Snow: Off";
      if (snowOn) requestAnimationFrame(step);
      else ctx.clearRect(0, 0, w, h);
    });
  }
})();
