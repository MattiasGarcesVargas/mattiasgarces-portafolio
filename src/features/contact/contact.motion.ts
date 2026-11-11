import { Draggable, gsap, registerMotion, SplitText } from "../../shared/motion/core";

/** The polaroid covers the message; drag it anywhere inside the stage to uncover it. */
function initPolaroid(root: HTMLElement, reduce: boolean): (() => void) | undefined {
  const stage = root.querySelector<HTMLElement>("[data-contact-stage]");
  const polaroid = root.querySelector<HTMLElement>("[data-contact-polaroid]");
  const message = root.querySelector<HTMLElement>("[data-contact-message]");
  if (!stage || !polaroid || !message) return;

  // Dragging is an interaction, not decoration: it also works with reduced motion, just without the throw.
  const [drag] = Draggable.create(polaroid, {
    type: "x,y",
    bounds: stage,
    inertia: !reduce,
    edgeResistance: 0.85,
    zIndexBoost: false,
  });

  // Keyboard users can't drag: when focus reaches the hidden links, the photo slides off them.
  const onFocusIn = () => {
    const photo = polaroid.getBoundingClientRect();
    const text = message.getBoundingClientRect();
    const overlaps = photo.left < text.right && photo.right > text.left && photo.top < text.bottom && photo.bottom > text.top;
    if (!overlaps) return;
    gsap.to(polaroid, {
      x: `-=${photo.right - text.left + 24}`,
      duration: reduce ? 0 : 0.6,
      ease: "heavy",
      onUpdate: () => drag?.update(),
    });
  };

  message.addEventListener("focusin", onFocusIn);
  return () => message.removeEventListener("focusin", onFocusIn);
}

registerMotion("contact", (root, { reduce }) => {
  const cleanup = initPolaroid(root, reduce);
  if (reduce) return cleanup;

  const q = gsap.utils.selector(root);

  // "Contact me" rises letter by letter every time it comes into view: it resets when you scroll
  // back up past it, so coming down again replays it.
  const title = root.querySelector<HTMLElement>("[data-contact-title]");
  if (title) {
    SplitText.create(title, {
      type: "chars",
      mask: "chars",
      onSplit: (self) =>
        gsap.from(self.chars, {
          yPercent: 100,
          duration: 0.9,
          stagger: 0.035,
          scrollTrigger: { trigger: title, start: "top 85%", toggleActions: "play none none reset" },
        }),
    });
  }

  // The footer is the end of the page, so the scrub finishes exactly at the bottom ("max").
  // The signature writes itself from left to right as the end of the page arrives.
  gsap.fromTo(
    q("[data-signature-reveal]"),
    { clipPath: "inset(0% 100% 0% 0%)" },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      ease: "none",
      scrollTrigger: { trigger: q("[data-signature-reveal]")[0], start: "top 95%", end: "max", scrub: true },
    },
  );

  return cleanup;
});
