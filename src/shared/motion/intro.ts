/**
 * Hand-off between the preloader and whatever opens the page (the hero).
 * The preloader calls `markIntroReady()` as its curtain opens; openers await `introReady`.
 * Features never import each other, so they meet here.
 */
let resolveIntro: () => void = () => {};

export const introReady = new Promise<void>((resolve) => {
  resolveIntro = resolve;
});

export function markIntroReady(): void {
  resolveIntro();
}
