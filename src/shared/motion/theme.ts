import { registerMotion, ScrollTrigger } from "./core";

/**
 * Mirrors the theme of the section under the middle of the viewport onto <body>,
 * so fixed elements (the progress line) take that section's colors.
 * Runs with reduced motion too: it changes colors, not movement.
 */
registerMotion("theme", (body) => {
  document.querySelectorAll<HTMLElement>("main > [data-theme]").forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: ({ isActive }) => {
        if (isActive && section.dataset.theme) body.dataset.theme = section.dataset.theme;
      },
    });
  });

  return () => {
    body.dataset.theme = "paper";
  };
});
