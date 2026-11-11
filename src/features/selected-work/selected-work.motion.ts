import { gsap, registerMotion, ScrollTrigger } from "../../shared/motion/core";

registerMotion("selected-work", (root, { desktop, reduce }) => {
  const q = gsap.utils.selector(root);

  // Videos play only while on screen (and never on their own with reduced motion).
  if (!reduce) {
    q<HTMLVideoElement>("[data-chapter-video]").forEach((video) => {
      ScrollTrigger.create({
        trigger: video,
        start: "top bottom",
        end: "bottom top",
        onToggle: ({ isActive }) => (isActive ? void video.play().catch(() => {}) : video.pause()),
      });
    });
  }

  if (reduce) return;

  q<HTMLElement>("[data-chapter-frame]").forEach((frame) => {
    // Every chapter opens from its own equator, then the footage drifts slower than the page.
    gsap.from(frame, {
      clipPath: "inset(50% 0% 50% 0%)",
      duration: 1.4,
      ease: "curtain",
      scrollTrigger: { trigger: frame, start: "top 85%", once: true },
    });

    gsap.fromTo(
      frame.querySelector("[data-parallax]"),
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: desktop ? 0.5 : true },
      },
    );

    // The thin bar under each frame is the equator again: it fills while the chapter crosses the screen.
    gsap.to(frame.querySelector("[data-loop-bar]"), {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: frame, start: "top 70%", end: "bottom 30%", scrub: true },
    });
  });

  if (!desktop) return;

  // Hover preview: the hovered project's cover follows the pointer over the index.
  const list = root.querySelector<HTMLElement>("[data-project-list]");
  const preview = root.querySelector<HTMLElement>("[data-preview]");
  if (!list || !preview) return;

  const layers = q<HTMLElement>("[data-preview-layer]");
  gsap.set(preview, { display: "block", autoAlpha: 0, scale: 0.85, xPercent: -50, yPercent: -50 });

  const xTo = gsap.quickTo(preview, "x", { duration: 0.5, ease: "ui" });
  const yTo = gsap.quickTo(preview, "y", { duration: 0.5, ease: "ui" });

  const onMove = (event: PointerEvent) => {
    xTo(event.clientX);
    yTo(event.clientY);
  };

  const onOver = (event: PointerEvent) => {
    const row = (event.target as Element | null)?.closest<HTMLElement>("[data-preview-index]");
    if (!row) return;
    const active = Number(row.dataset.previewIndex);
    layers.forEach((layer, i) => gsap.set(layer, { opacity: i === active ? 1 : 0 }));
    gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "ui", overwrite: "auto" });
  };

  const onLeave = () => gsap.to(preview, { autoAlpha: 0, scale: 0.85, duration: 0.3, ease: "ui", overwrite: "auto" });

  list.addEventListener("pointermove", onMove);
  list.addEventListener("pointerover", onOver);
  list.addEventListener("pointerleave", onLeave);

  return () => {
    list.removeEventListener("pointermove", onMove);
    list.removeEventListener("pointerover", onOver);
    list.removeEventListener("pointerleave", onLeave);
  };
});
