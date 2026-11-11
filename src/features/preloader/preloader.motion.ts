import { gsap, lenis, registerMotion } from "../../shared/motion/core";
import { markIntroReady } from "../../shared/motion/intro";

const SESSION_KEY = "mg:preloaded";
const LOAD_DURATION = 2.4;

registerMotion("preloader", (root, { reduce }) => {
  const html = document.documentElement;

  const finish = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage blocked (private mode): the preloader simply plays again next visit.
    }
    html.classList.add("is-preloaded");
    root.remove();
    lenis?.start();
    markIntroReady();
  };

  if (reduce || html.classList.contains("is-preloaded")) {
    finish();
    return;
  }

  lenis?.stop();

  const q = gsap.utils.selector(root);
  const count = root.querySelector<HTMLElement>("[data-preloader-count]");
  const progress = { value: 0 };

  gsap
    .timeline({ onComplete: finish })
    .to(
      progress,
      {
        value: 100,
        duration: LOAD_DURATION,
        ease: "power2.inOut",
        onUpdate: () => {
          if (count) count.textContent = String(Math.round(progress.value)).padStart(3, "0");
        },
      },
      0,
    )
    .to(q("[data-preloader-fill]"), { scaleX: 1, duration: LOAD_DURATION, ease: "power2.inOut" }, 0)
    .fromTo(
      q("[data-preloader-dot]"),
      { x: 0 },
      { x: () => root.clientWidth, duration: LOAD_DURATION, ease: "power2.inOut" },
      0,
    )
    .to(q("[data-preloader-content], [data-preloader-dot], [data-preloader-track]"), {
      autoAlpha: 0,
      duration: 0.4,
      ease: "ui",
    })
    // The world opens from the equator: the top half rises, the bottom half sinks.
    .addLabel("open", "+=0.05")
    .to(q('[data-preloader-half="top"]'), { yPercent: -100, duration: 1.2, ease: "curtain" }, "open")
    .to(q('[data-preloader-half="bottom"]'), { yPercent: 100, duration: 1.2, ease: "curtain" }, "open")
    .to(q("[data-preloader-fill]"), { autoAlpha: 0, duration: 0.5, ease: "ui" }, "open+=0.5")
    .call(markIntroReady, [], "open+=0.45");
});
