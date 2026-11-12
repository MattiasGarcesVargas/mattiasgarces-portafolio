import { gsap, registerMotion } from "../../shared/motion/core";
import { introReady } from "../../shared/motion/intro";

registerMotion("hero", (root, { desktop, reduce }) => {
  if (reduce) return;

  const q = gsap.utils.selector(root);
  const frame = q("[data-hero-frame]");
  const [firstWord, lastWord] = q("[data-hero-word]");

  // Intro: the portrait opens from its own horizon, then the name comes through it —
  // "Mattias" rising from below, "Garcés" dropping from above.
  const intro = gsap
    .timeline({ paused: true })
    .set(q("[data-intro]"), { visibility: "visible" })
    .fromTo(
      frame,
      { clipPath: "inset(50% 0% 50% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "curtain" },
    )
    .from(q("[data-hero-photo]"), { scale: 1.3, duration: 1.9 }, 0)
    .from(firstWord ?? [], { yPercent: 115, duration: 1.3 }, 0.4)
    .from(lastWord ?? [], { yPercent: -115, duration: 1.3 }, 0.5)
    .from(q("[data-hero-fade]"), { autoAlpha: 0, y: 12, duration: 0.9, stagger: 0.06 }, 0.8);

  void introReady.then(() => intro.play());

  // Scroll: the name parts like a curtain and leaves him alone in the frame.
  // Sideways on desktop; on phones the lines sit above and below, so they part vertically.
  gsap
    .timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: desktop ? 1 : true },
      defaults: { ease: "none" },
    })
    .to(q('[data-hero-line="first"]'), desktop ? { xPercent: 30 } : { yPercent: -70 }, 0)
    .to(q('[data-hero-line="last"]'), desktop ? { xPercent: -30 } : { yPercent: 70 }, 0)
    .to(frame, { yPercent: 16, scale: 1.08 }, 0)
    .to(q("[data-hero-out]"), { autoAlpha: 0, duration: 0.35 }, 0);
});
