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

  // ===== Gallery (10 photos + captions + lightbox) =====
  const galleryItems = [
    { src: "assets/gallery/pic01_kaitennis.jpg", caption: "pic01_kaitennis.jpg", alt: "Kai playing tennis" },
    { src: "assets/gallery/pic02_chief.jpg", caption: "pic02_chief.jpg", alt: "Chief" },
    { src: "assets/gallery/pic03_halegun.jpg", caption: "pic03_halegun.jpg", alt: "Hale" },
    { src: "assets/gallery/pic04_susanerikhof.jpg", caption: "pic04_susanerikhof.jpg", alt: "Susan & Erik" },
    { src: "assets/gallery/pic05_catsfranktessie.jpg", caption: "pic05_catsfranktessie.jpg", alt: "Frank & Tessie" },
    { src: "assets/gallery/pic06_familyboston.jpg", caption: "pic06_familyboston.jpg", alt: "Family in Boston" },
    { src: "assets/gallery/pic07_familyfenway.jpg", caption: "pic07_familyfenway.jpg", alt: "Family at Fenway" },
    { src: "assets/gallery/pic08_familyfenway.jpg", caption: "pic08_familyfenway.jpg", alt: "Family at Fenway (2)" },
    { src: "assets/gallery/pic09_halekaifenway.jpg", caption: "pic09_halekaifenway.jpg", alt: "Hale & Kai at Fenway" },
    { src: "assets/gallery/pic10_chief.jpg", caption: "pic10_chief.jpg", alt: "Chief (2)" },
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
    // Optional: comment this out if you don’t want the image to “blank” during close animation
    lbImg?.removeAttribute("src");
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

  // ===== Snow (optional; never blocks the rest of the script) =====
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const canvas = document.getElementById("snow");
  const ctx = canvas?.getContext?.("2d");
  const toggleBtn = document.getElementById("toggleSnow");

  let snowOn = true;

  if (!canvas || !ctx || prefersReducedMotion) {
    snowOn = false;
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", "false");
      toggleBtn.textContent = "❄️ Snow: Off";
    }
    return; // <-- IMPORTANT: if you want snow disabled BUT keep everything else, DELETE THIS LINE
  }

  // If you want snow disabled but keep everything else, remove the return above and use this block instead:
  // (Leave the rest of the snow code as-is)
})();