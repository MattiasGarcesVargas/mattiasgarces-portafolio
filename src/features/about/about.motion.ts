import { gsap, registerMotion, SplitText } from "../../shared/motion/core";

const pad = (n: number) => String(n).padStart(2, "0");

registerMotion("about", (root, { desktop, reduce }) => {
  if (reduce) return;

  const q = gsap.utils.selector(root);
  const title = root.querySelector<HTMLElement>("[data-about-title]");

  // The portrait rises from the bottom up, tied to the scroll. On desktop the section's content is
  // sticky, so the photo keeps uncovering itself while everything else holds still.
  const sticky = window.matchMedia("(min-width: 768px)").matches; // Same breakpoint as `md:sticky`.
  const scrollTrigger = sticky
    ? { trigger: root, start: "top 55%", end: "bottom bottom", scrub: 0.8 }
    : { trigger: q("[data-about-frame]")[0], start: "top 90%", end: "top 25%", scrub: 0.5 };

  gsap.fromTo(
    q("[data-about-frame]"),
    { clipPath: "inset(100% 0% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger },
  );

  // Kinetic title: each letter rises out of its own mask, in a wave.
  if (title) {
    SplitText.create(title, {
      type: "chars",
      mask: "chars",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.chars, {
          yPercent: 110,
          rotationX: desktop ? -60 : 0,
          transformPerspective: 600,
          transformOrigin: "50% 100%",
          duration: 1.2,
          stagger: { each: 0.035, ease: "power1.in" },
          // Triggers hang off the section: sticky elements report shifted positions once stuck.
          scrollTrigger: { trigger: root, start: "top 45%", once: true },
        }),
    });
  }

  // Counters replay from zero when the numbers come into view.
  const counters = q<HTMLElement>("[data-count]");
  const finals = counters.map((el) => el.textContent ?? "");

  counters.forEach((el) => {
    const target = Number(el.dataset.count);
    if (!target) return;
    const value = { n: 0 };
    el.textContent = pad(0);
    gsap.to(value, {
      n: target,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = pad(Math.round(value.n));
      },
      scrollTrigger: { trigger: sticky ? root : el, start: sticky ? "top 30%" : "top 90%", once: true },
    });
  });

  return () => counters.forEach((el, i) => (el.textContent = finals[i] ?? ""));
});
