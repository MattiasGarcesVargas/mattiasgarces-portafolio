/**
 * Copy with inline emphasis, kept as data so components never render raw HTML.
 * `accent` marks the one word per screen painted in the accent color.
 */
export type RichText = Array<string | { em: string; accent?: boolean }>;
