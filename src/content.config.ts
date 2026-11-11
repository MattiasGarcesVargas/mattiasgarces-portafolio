import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * One MDX file per project in src/content/work/<slug>.mdx.
 * Media lives in public/work/<slug>/. The slug comes from the file name.
 */
const work = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/work" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      /** TODO(content): confirm the real year before launch. */
      year: z.number().optional(),
      type: z.enum(["identidad", "web", "concepto"]),
      role: z.array(z.string()),
      stack: z.array(z.string()),
      /** Blue the chapter is tinted with on the home (no warm accents). */
      accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      cover: image().optional(),
      coverVertical: image().optional(),
      /** Looping screen recording of the project's animation, path under /public. */
      video: z.string().optional(),
      videoPoster: z.string().optional(),
      liveUrl: z.url().optional(),
      summary: z.string().max(180),
      summaryEn: z.string().max(180),
      featured: z.boolean().default(false),
      order: z.number().default(99),
      disclaimer: z.string().optional(),
    }),
});

export const collections = { work };
