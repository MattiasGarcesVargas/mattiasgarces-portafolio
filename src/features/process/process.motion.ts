import { gsap, registerMotion } from "../../shared/motion/core";

/** How far a card recedes once the next one covers it. */
const RECEDED_SCALE = 0.94;
const RECEDED_OPACITY = 0.35;

registerMotion("process", (root, { desktop }) => {
  // Mobile and reduced motion keep the plain list: stacking only exists where the cards are sticky.
  if (!desktop) return;

  const list = root.querySelector<HTMLElement>("ol");
  const cards = gsap.utils.toArray<HTMLElement>("[data-process-card]", root);
  if (!list) return;

  // Sticky elements report shifted positions once stuck, so scroll positions are derived
  // from the (non-sticky) list and each card's height instead of measuring the cards.
  const naturalTop = (index: number) => {
    const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
    let top = list.getBoundingClientRect().top + window.scrollY;
    for (let i = 0; i < index; i++) top += (cards[i]?.offsetHeight ?? 0) + gap;
    return top;
  };
  const stickyTop = (card: HTMLElement) => parseFloat(getComputedStyle(card).top) || 0;

  cards.forEach((card, index) => {
    const next = cards[index + 1];
    if (!next) return;

    const inner = card.querySelector<HTMLElement>("[data-card-inner]");
    const content = card.querySelector<HTMLElement>("[data-card-content]");

    // From the moment the next card enters the screen until it reaches its sticky spot,
    // this one sinks back into the stack.
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          start: () => naturalTop(index + 1) - window.innerHeight,
          end: () => naturalTop(index + 1) - stickyTop(next),
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      .to(inner, { scale: RECEDED_SCALE }, 0)
      .to(content?.children ?? [], { opacity: RECEDED_OPACITY }, 0);
  });
});
