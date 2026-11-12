import { gsap, lenis, registerMotion } from "../../shared/motion/core";
import { markIntroReady } from "../../shared/motion/intro";

/** Longest wait for the pictures and the face; after it the montage runs with whatever arrived. */
const LOAD_TIMEOUT = 1800;
/** Shortest cut: four frames at 60 Hz. Anything faster stops registering as an image. */
const FASTEST = 66;

/** One still of the montage: a word or a picture, held for `ms`. */
type Beat = {
  ms: number;
  word?: number;
  cut?: number;
  /** Blue ground, black word. */
  invert?: boolean;
  /** Word blown up to the edges of the screen. */
  full?: boolean;
  flip?: boolean;
  /** Picture held back a little, so the fast cuts never strobe between full dark and full light. */
  dim?: boolean;
};

/**
 * The score, after worksruthi.com's opening: the sentence once, readable, every word answered by
 * a picture and each cut shorter than the last; then the same sentence again in a chain too fast
 * to read. `chainAt` is where that chain starts, in milliseconds.
 */
function score(words: number, cuts: number): { beats: Beat[]; chainAt: number } {
  const beats: Beat[] = [];
  const last = words - 1;
  let picture = 0;

  // Once, readable: a picture between every two words, so four pictures carry five words.
  let ms = 420;
  for (let word = 0; word < words; word++) {
    beats.push({ ms: word === last ? 190 : ms, word, full: word === last });
    ms = Math.max(150, ms * 0.86);
    if (cuts === 0 || word === last) continue;
    beats.push({ ms, cut: picture++ % cuts });
    ms = Math.max(150, ms * 0.86);
  }
  const chainAt = beats.reduce((total, beat) => total + beat.ms, 0);

  // The loop: picture, word, picture, word… from the first picture again, ending on a word.
  const holds = [110, 90, 80, 70];
  for (let i = 0; i < 22; i++) {
    const hold = holds[i] ?? FASTEST;
    const turn = Math.floor(i / 2);
    if (i % 2 === 1 || cuts === 0) beats.push({ ms: hold, word: turn % words, invert: turn % 3 === 2 });
    else beats.push({ ms: hold, cut: picture++ % cuts, flip: turn % 2 === 1, dim: true });
  }

  return { beats, chainAt };
}

function loadImage(src: string): Promise<boolean> {
  const image = new Image();
  image.src = src;
  return image.decode().then(
    () => true,
    () => false,
  );
}

/** Cap height of a face as a fraction of its font size. */
function capHeight(family: string): number {
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return 0.72;
  context.font = `100px ${family}`;
  return context.measureText("H").actualBoundingBoxAscent / 100 || 0.72;
}

registerMotion("preloader", (root, { reduce }) => {
  const html = document.documentElement;
  let done = false;
  let timeline: gsap.core.Timeline | undefined;

  const finish = () => {
    if (done) return;
    done = true;
    timeline?.kill();
    html.classList.add("is-preloaded");
    root.remove();
    lenis?.start();
    markIntroReady();
  };

  if (reduce || html.classList.contains("is-preloaded")) {
    finish();
    return;
  }

  // The page under the trailer always starts from the top, even when a reload restored a scroll position.
  lenis?.stop();
  window.scrollTo(0, 0);

  const frame = root.querySelector<HTMLElement>("[data-preloader-frame]");
  const bars = [...root.querySelectorAll<HTMLElement>("[data-preloader-bar]")];
  const words = [...root.querySelectorAll<HTMLElement>("[data-preloader-word]")];
  const cutSlots = [...root.querySelectorAll<HTMLElement>("[data-preloader-cut]")];
  if (!frame || words.length === 0) {
    finish();
    return;
  }
  const family = getComputedStyle(words[0]!).fontFamily;

  const play = (cuts: HTMLElement[]) => {
    if (done) return;

    // Fit every word to the screen: as large as it goes inside a comfortable margin.
    const { clientWidth: width, clientHeight: height } = root;
    const cap = capHeight(family);
    const fit = (word: HTMLElement, maxWidth: number, maxHeight: number) => {
      word.style.fontSize = "100px";
      const natural = word.firstElementChild?.getBoundingClientRect().width || 100;
      return Math.min((maxWidth * 100) / natural, maxHeight / cap);
    };
    const sizes = words.map((word) => fit(word, width * 0.9, height * 0.76));
    const fullSizes = words.map((word) => fit(word, width * 0.98, height * 0.96));

    const stills = [...words, ...cuts];
    const show = (beat: Beat) => {
      stills.forEach((still) => (still.style.visibility = "hidden"));
      frame.dataset.tone = beat.invert ? "invert" : "ink";

      if (beat.word !== undefined) {
        const word = words[beat.word]!;
        word.style.fontSize = `${(beat.full ? fullSizes : sizes)[beat.word]}px`;
        word.style.visibility = "visible";
        return;
      }

      const cut = cuts[beat.cut ?? 0];
      if (!cut) return;
      // The grain lands somewhere else on every cut, like film.
      cut.style.setProperty("--grain-x", `${Math.floor(Math.random() * 256)}px`);
      cut.style.setProperty("--grain-y", `${Math.floor(Math.random() * 256)}px`);
      cut.style.transform = beat.flip ? "scaleX(-1)" : "none";
      cut.style.opacity = beat.dim ? "0.75" : "1";
      cut.style.visibility = "visible";
    };

    const { beats, chainAt } = score(words.length, cuts.length);
    timeline = gsap.timeline({ onComplete: finish });
    let at = 0;
    for (const beat of beats) {
      timeline.call(show, [beat], at);
      at += beat.ms / 1000;
    }

    // While the chain runs, two bars close over it from top and bottom until nothing is left.
    timeline.fromTo(
      bars,
      { scaleY: 0 },
      { scaleY: 1, duration: at - chainAt / 1000, ease: "sine.inOut" },
      chainAt / 1000,
    );

    // Then the same bars part like a curtain, and the page is behind them.
    timeline
      .call(
        () => {
          frame.remove();
          root.style.background = "transparent";
          markIntroReady();
        },
        [],
        at,
      )
      .to(bars[0] ?? [], { yPercent: -100, duration: 0.9, ease: "curtain" }, at + 0.12)
      .to(bars[1] ?? [], { yPercent: 100, duration: 0.9, ease: "curtain" }, "<");
  };

  const pictures: Promise<Array<HTMLElement | undefined>> = Promise.all([
    document.fonts.load(`400 100px ${family}`).then(
      () => undefined,
      () => undefined,
    ),
    ...cutSlots.map(async (slot) => {
      const src = slot.dataset.src;
      if (!src || !(await loadImage(src))) return undefined;
      slot.style.backgroundImage = `url("${src}")`;
      return slot;
    }),
  ]);
  const timeout = new Promise<Array<HTMLElement | undefined>>((resolve) => setTimeout(() => resolve([]), LOAD_TIMEOUT));

  void Promise.race([pictures, timeout]).then((loaded) =>
    play(loaded.filter((slot): slot is HTMLElement => slot !== undefined)),
  );

  // Nobody is made to sit through it: any click, tap or key cuts straight to the page.
  root.addEventListener("pointerdown", finish);
  window.addEventListener("keydown", finish);

  return () => {
    timeline?.kill();
    done = true;
    root.removeEventListener("pointerdown", finish);
    window.removeEventListener("keydown", finish);
  };
});
