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
