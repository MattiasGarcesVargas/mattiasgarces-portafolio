export const TIME_ZONE = "America/Guayaquil";

/** Local time in Ambato as HH:MM (24h). */
export function formatLocalTime(date: Date = new Date(), locale = "es-EC"): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}
