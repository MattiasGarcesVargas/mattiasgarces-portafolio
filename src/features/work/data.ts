import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"work">;

export async function getProjects(): Promise<Project[]> {
  return (await getCollection("work")).sort((a, b) => a.data.order - b.data.order);
}
