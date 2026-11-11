import { gsap, registerMotion, SplitText } from "../../shared/motion/core";

/** Opacity of a word before the scroll reaches it. */
const FAINT = 0.15;

registerMotion("manifesto", (root, { desktop, reduce }) => {
  if (reduce) return;

  const text = root.querySelector<HTMLElement>("[data-manifesto-text]");
  if (!text) return;

  // autoSplit re-splits when lines reflow (resize, font swap); the animation is rebuilt with it.
  SplitText.create(text, {
    type: "words",
    autoSplit: true,
    onSplit: (self) =>
      gsap.fromTo(
        self.words,
        { opacity: FAINT },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: text,
            start: "top 80%",
            end: "bottom 45%",
            scrub: desktop ? 0.6 : true,
          },
        },
      ),
  });
});
