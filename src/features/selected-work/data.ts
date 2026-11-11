import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"work">;

const MAX_FEATURED = 4;

const byOrder = (a: Project, b: Project) => a.data.order - b.data.order;

/** Projects shown as full chapters on the home. */
export async function getFeaturedProjects(): Promise<Project[]> {
  const featured = await getCollection("work", ({ data }) => data.featured);
  return featured.sort(byOrder).slice(0, MAX_FEATURED);
}

/** Every project, for the compact index under the chapters. */
export async function getAllProjects(): Promise<Project[]> {
  return (await getCollection("work")).sort(byOrder);
}

/** "01", "02"… */
export const pad = (n: number) => String(n).padStart(2, "0");
