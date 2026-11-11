# Mattias Garcés — Portfolio

Design & code from the middle of the world. Built with Astro, Tailwind CSS 4, GSAP and Lenis.

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # type check
npm run build    # static build in dist/
```

## Structure (vertical slices)

```txt
src/
  pages/        routes only: compose features
  layouts/      BaseLayout (head, fonts, view transitions, motion core)
  features/     one folder per slice: markup + motion + its own pieces
  shared/       ui/, motion/, i18n/, styles/, lib/ used by 2+ features
  content/work/ one MDX file per project
public/
  brand/        signature SVGs
  work/<slug>/  project videos and images
```

Design tokens live in `src/shared/styles/global.css`. Project context and rules for contributors (human or AI) are in `CLAUDE.md`.
