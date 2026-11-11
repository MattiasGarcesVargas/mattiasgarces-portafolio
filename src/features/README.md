# features/

One folder per vertical slice. Each slice owns its markup, its styles, its motion and nothing else.

```txt
features/hero/
  Hero.astro          markup (texts from shared/i18n)
  hero.motion.ts      registerMotion("hero", (root, conditions) => { ... })
  index.ts            export { default as Hero } from "./Hero.astro";
```

Rules:

- A feature never imports from another feature. Shared code moves to `src/shared/`.
- The section root carries `data-motion="<key>"` and `data-theme="paper|ink|marino"`.
- Pages in `src/pages/` only compose features; they hold no logic.

Planned slices, in build order: `preloader`, `hero`, `manifesto`, `selected-work`, `process`, `about`, `contact`, `work` (index + case study).
