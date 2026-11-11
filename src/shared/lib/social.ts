/**
 * Mattias's contact channels. Change them here and every link on the site updates.
 * A network without `href` is still shown, but not as a link.
 */
export type SocialNetwork = "github" | "linkedin" | "whatsapp" | "instagram";

export const EMAIL = "mattygarces.vargas@gmail.com";

/** WhatsApp number with country code, digits only. */
const WHATSAPP_NUMBER: string | undefined = "593969060843";

export function whatsappHref(message: string): string | undefined {
  return WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}` : undefined;
}

/** Shown in this order in the footer. */
export const socials: Array<{ network: SocialNetwork; label: string; href?: string }> = [
  { network: "github", label: "GitHub", href: "https://github.com/MattiasGarcesVargas" },
  { network: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/mattias-garc%C3%A9s-871231289/" },
  { network: "whatsapp", label: "WhatsApp", href: whatsappHref("Hola Mattias") },
  { network: "instagram", label: "Instagram", href: "https://www.instagram.com/mattiasgv_13/" },
];
