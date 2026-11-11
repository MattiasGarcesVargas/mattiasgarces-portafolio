import { gsap, registerMotion } from "../../shared/motion/core";
import { introReady } from "../../shared/motion/intro";

/** Max tilt of the horizon, in degrees. */
const MAX_TILT = 3;

registerMotion("hero", (root, { desktop, reduce }) => {
  if (reduce) return;

  const q = gsap.utils.selector(root);
  const horizon = root.querySelector<HTMLElement>("[data-hero-horizon]");
  const line = horizon?.querySelector<HTMLElement>("[data-equator]");
  const [topWord, bottomWord] = q("[data-hero-word]");

  // Intro: the line opens from its centre, then the name rises out of it.
  // "Mattias" comes up from below the line, "Garcés" drops down from above it.
  const intro = gsap
    .timeline({ paused: true })
    .set(q("[data-intro]"), { visibility: "visible" })
    .from(line ?? [], { scaleX: 0, transformOrigin: "50% 50%", duration: 1.4, ease: "curtain" })
    .from(topWord ?? [], { yPercent: 105, duration: 1.3 }, "-=0.75")
    .from(bottomWord ?? [], { yPercent: -105, duration: 1.3 }, "<")
    .from(q("[data-hero-fade]"), { autoAlpha: 0, y: 12, duration: 0.9, stagger: 0.06 }, "-=0.95");

  void introReady.then(() => intro.play());

  // Scroll: the hemispheres drift apart and the details clear out.
  gsap
    .timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: desktop ? 1 : true },
      defaults: { ease: "none" },
    })
    .to(q('[data-hero-half="top"]'), { yPercent: -45 }, 0)
    .to(q('[data-hero-half="bottom"]'), { yPercent: 45 }, 0)
    .to(q("[data-hero-out]"), { autoAlpha: 0, duration: 0.35 }, 0)
    .to(horizon ?? [], { autoAlpha: 0, duration: 0.25 }, 0.75);

  if (!desktop || !horizon) return;

  // A living horizon: the line leans toward the pointer, pivoting on its centre.
  const tilt = gsap.quickTo(horizon, "rotation", { duration: 0.6, ease: "ui" });

  const onMove = (event: PointerEvent) => {
    const box = horizon.getBoundingClientRect();
    const dx = event.clientX - (box.left + box.width / 2);
    const dy = event.clientY - (box.top + box.height / 2);
    const angle = (Math.atan(dy / (Math.abs(dx) || 1)) * 180) / Math.PI;
    tilt(gsap.utils.clamp(-MAX_TILT, MAX_TILT, Math.sign(dx || 1) * angle * 0.25));
  };
  const onLeave = () => tilt(0);

  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerleave", onLeave);

  return () => {
    root.removeEventListener("pointermove", onMove);
    root.removeEventListener("pointerleave", onLeave);
  };
});
