import { gsap, registerMotion, SplitText } from "../../shared/motion/core";

/** How far (yPercent) a letter can start from its place. */
const SCATTER = 100;
/**
 * Exception to the site's "nothing bounces" rule, on purpose: this section recreates
 * Sachith Tharinda's horizontal statement, whose letters settle with an elastic ease.
 */
const SETTLE_EASE = "elastic.out(1.2, 1)";

registerMotion("statement", (root, { desktop, reduce }) => {
  if (reduce) return;

  const q = gsap.utils.selector(root);
  const track = root.querySelector<HTMLElement>("[data-statement-track]");
  if (!track) return;

  // Each word is a mask, so a scattered letter is partly hidden until it settles.
  const chars = q("[data-statement-line]").flatMap(
    (line) => SplitText.create(line, { type: "words,chars", mask: "words" }).chars,
  );
  const draws = q<SVGPathElement>("[data-statement-draw]");
  const icons = q<SVGElement>("[data-statement-icon]");
  const spins = q<SVGGElement>("[data-statement-spin]");
  const scatter = () => gsap.utils.random(-SCATTER, SCATTER);

  if (!desktop) {
    // Mobile: the sentence stacks vertically and settles as each letter scrolls in.
    chars.forEach((char) =>
      gsap.from(char, {
        yPercent: scatter,
        ease: SETTLE_EASE,
        scrollTrigger: { trigger: char, start: "top 95%", end: "top 60%", scrub: 0.5 },
      }),
    );
    icons.forEach((icon) =>
      gsap.from(icon, { scale: 0, rotation: () => gsap.utils.random(-40, 40), ease: SETTLE_EASE, scrollTrigger: { trigger: icon, start: "top 90%", end: "top 55%", scrub: 0.5 } }),
    );
    return;
  }

  // Desktop: pin the section and slide the sentence sideways, one pixel of scroll per pixel of track.
  const distance = () => track.scrollWidth - window.innerWidth;
  const slide = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  // Letters arrive scattered from the right; the elastic ease settles them well before the left edge.
  chars.forEach((char) =>
    gsap.from(char, {
      yPercent: scatter,
      ease: SETTLE_EASE,
      scrollTrigger: { trigger: char, containerAnimation: slide, start: "left 90%", end: "left 10%", scrub: 0.5 },
    }),
  );

  draws.forEach((path) =>
    gsap.from(path, {
      drawSVG: "0%",
      ease: "none",
      scrollTrigger: { trigger: path, containerAnimation: slide, start: "left 90%", end: "right 45%", scrub: 0.5 },
    }),
  );

  icons.forEach((icon) =>
    gsap.from(icon, {
      scale: 0,
      rotation: () => gsap.utils.random(-40, 40),
      xPercent: () => gsap.utils.random(-20, 20),
      yPercent: () => gsap.utils.random(-10, 10),
      transformOrigin: "50% 50%",
      ease: SETTLE_EASE,
      scrollTrigger: { trigger: icon, containerAnimation: slide, start: "left 90%", end: "left 50%", scrub: 0.5 },
    }),
  );

  // The icons keep turning slowly while the sentence travels.
  spins.forEach((spin, i) =>
    gsap.to(spin, {
      rotation: i % 2 ? -120 : 120,
      transformOrigin: "50% 50%",
      ease: "none",
      scrollTrigger: { trigger: spin.ownerSVGElement, containerAnimation: slide, start: "left 100%", end: "right 0%", scrub: true },
    }),
  );

});
