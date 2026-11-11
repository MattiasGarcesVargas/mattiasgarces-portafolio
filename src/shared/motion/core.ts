import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Observer } from "gsap/Observer";
import Lenis from "lenis";

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  CustomEase,
  Flip,
  Draggable,
  InertiaPlugin,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  Observer,
);

CustomEase.create("heavy", "0.16, 1, 0.3, 1");
CustomEase.create("curtain", "0.76, 0, 0.24, 1");
CustomEase.create("ui", "0.33, 1, 0.68, 1");
gsap.defaults({ ease: "heavy", duration: 1.1 });

export type MotionConditions = {
  desktop: boolean;
  mobile: boolean;
  reduce: boolean;
};

/**
 * A feature's motion entry point. Tweens and ScrollTriggers it creates are reverted automatically;
 * anything else (event listeners) must be undone by the cleanup function it returns.
 */
export type MotionModule = (root: HTMLElement, conditions: MotionConditions) => void | (() => void);

const modules = new Map<string, MotionModule>();

/**
 * Features register their motion under a key; the element `[data-motion="<key>"]` is its root.
 * Called at module scope in each feature's `<feature>.motion.ts`.
 */
export function registerMotion(key: string, module: MotionModule): void {
  modules.set(key, module);
}

export let lenis: Lenis | undefined;

const raf = (time: number) => lenis?.raf(time * 1000);

function startLenis(): void {
  if (lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
}

let pageContext: gsap.MatchMedia | undefined;

function runPageModules(): void {
  pageContext = gsap.matchMedia();
  pageContext.add(
    {
      desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
      reduce: "(prefers-reduced-motion: reduce)",
    },
    (ctx) => {
      const conditions = ctx.conditions as MotionConditions;
      const cleanups: Array<() => void> = [];
      document.querySelectorAll<HTMLElement>("[data-motion]").forEach((root) => {
        const key = root.dataset.motion;
        const cleanup = key ? modules.get(key)?.(root, conditions) : undefined;
        if (cleanup) cleanups.push(cleanup);
      });
      return () => cleanups.forEach((cleanup) => cleanup());
    },
  );
  ScrollTrigger.refresh();
}

document.addEventListener("astro:page-load", async () => {
  document.documentElement.classList.add("js");
  startLenis();
  await document.fonts.ready;
  runPageModules();
});

// View transitions replace <html> attributes: restore the classes runtime code relies on.
document.addEventListener("astro:after-swap", () => {
  document.documentElement.classList.add("js", "is-preloaded");
  if (lenis) document.documentElement.classList.add("lenis", "lenis-smooth");
});

document.addEventListener("astro:before-swap", () => {
  pageContext?.revert();
  pageContext = undefined;
  lenis?.scrollTo(0, { immediate: true });
});

export { gsap, ScrollTrigger, SplitText, Flip, Draggable };
