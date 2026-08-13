const motionOk = document.documentElement.classList.contains("motion-ok");

/* ---------- reveal on scroll (safe: only activates once wired up) ---------- */

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    document.documentElement.classList.add("js-ready");
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((el) => io.observe(el));
  document.documentElement.classList.add("js-ready");
}

/* ---------- achievement counters (ready for future data-count numbers) ---------- */

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length || !("IntersectionObserver" in window)) return;

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (!motionOk) {
      el.textContent = target;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => io.observe(el));
}

/* ---------- hero globe: Cobe (WebGL) with CSS fallback already showing by default ---------- */

async function initGlobe() {
  const wrap = document.getElementById("heroGlobe");
  const canvas = document.getElementById("heroGlobeCanvas");
  if (!wrap || !canvas) return;

  const testCanvas = document.createElement("canvas");
  const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
  if (!gl) return;

  try {
    const { default: createGlobe } = await import("https://cdn.jsdelivr.net/npm/cobe@0.6/+esm");
    const size = wrap.getBoundingClientRect().width;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    let phi = 0;
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size * dpr,
      height: size * dpr,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 14000,
      mapBrightness: 6,
      baseColor: [0.15, 0.15, 0.15],
      markerColor: [1, 0.8, 0],
      glowColor: [1, 0.8, 0],
      markers: [
        { location: [40.7128, -74.006], size: 0.05 },
        { location: [48.8566, 2.3522], size: 0.05 },
        { location: [39.9042, 116.4074], size: 0.05 },
      ],
      onRender: (state) => {
        if (motionOk) phi += 0.0026;
        state.phi = phi;
      },
    });

    canvas.style.opacity = "1";
    wrap.classList.add("globe-ready");

    window.addEventListener(
      "beforeunload",
      () => {
        if (globe && typeof globe.destroy === "function") globe.destroy();
      },
      { once: true }
    );
  } catch (err) {
    /* Cobe unavailable (CDN blocked / WebGL init failed) — CSS fallback stays visible. */
  }
}

/* Logo assembly is pure CSS now (see .logo-piece / piece-in-* keyframes in style.css),
   timed to play once right after the intro splash finishes — no JS/GSAP needed. */

/* ---------- boot ---------- */

initReveal();
initCounters();
initGlobe();
