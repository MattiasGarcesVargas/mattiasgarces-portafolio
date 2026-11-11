import { en } from "./en";
import { es, type Dictionary } from "./es";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

const dictionaries: Record<Locale, Dictionary> = { es, en };

/** Locale from a URL: `/en/...` is English, everything else Spanish. */
export function getLocale(url: URL): Locale {
  const [, first] = url.pathname.split("/");
  return first === "en" ? "en" : defaultLocale;
}

export function useTranslations(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Home of each language. */
export function homePath(locale: Locale): string {
  return locale === "en" ? "/en/" : "/";
}

/** Route to the work index, or to one case study when a slug is given. */
export function workPath(locale: Locale, slug?: string): string {
  const base = locale === "en" ? "/en/work" : "/trabajo";
  return slug ? `${base}/${slug}` : base;
}

/**
 * The same page in the other language: `/` ↔ `/en/`, `/trabajo/x` ↔ `/en/work/x`.
 * Unknown routes fall back to that language's home.
 */
export function alternatePath(pathname: string, target: Locale): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  const work = path.match(/^(?:\/en\/work|\/trabajo)(?:\/([^/]+))?$/);
  if (work) return workPath(target, work[1]);
  return homePath(target);
}
