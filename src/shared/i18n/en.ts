import type { Dictionary } from "./es";

export const en: Dictionary = {
  meta: {
    title: "Mattias Garcés — Design & code from the middle of the world",
    description:
      "Mattias Garcés designs brand identities and builds immersive web experiences from Ambato, Ecuador.",
  },
  brand: {
    name: "Mattias Garcés",
    tagline: "Design & code from the middle of the world.",
    coordinates: "01°14′S · 78°37′W",
    city: "Ambato, EC",
  },
  nav: {
    skip: "Skip to content",
    home: "Home",
    work: "Work",
    about: "About",
    contact: "Let's talk",
  },
  preloader: {
    coordinates: "0°00′00″",
    loading: "Loading the middle of the world",
  },
  hero: {
    designLabel: "(Design)",
    design: "Visual identity · Art direction",
    codeLabel: "(Code)",
    code: "Engineering · Web experiences",
    available: "Available for projects",
    scroll: "(Scroll)",
  },
  statement: {
    // TODO(content): copy given by Mattias; "Webflow Expert" may not match his stack (Astro/React).
    segments: ["I craft digital experiences as a Designer,", "Frontend Developer", "&", "Webflow Expert."],
  },
  manifesto: {
    label: "Manifesto",
    text: [
      "I don't make pages. I make brands ",
      { em: "felt", accent: true },
      ". I understand your business, build your identity and turn it into an experience people ",
      { em: "remember" },
      ". From strategy to code, no middlemen.",
    ],
  },
  work: {
    title: "Selected",
    titleEm: "work",
    viewCase: "View case",
    viewAll: "View all work",
    index: "Index",
    videoPending: "Video pending",
    loop: "Silent loop",
    back: "Back home",
    caseTodo: "Case study in progress.",
    types: { identidad: "Identity", web: "Web", concepto: "Concept" },
  },
  process: {
    title: "How I",
    titleEm: "work",
    intro: "Four steps and one person from start to finish. So you know exactly what you are buying.",
    steps: [
      { title: "Analyse", text: "Before designing, I listen. Who you are, who you speak to and what sets you apart." },
      { title: "Identity", text: "Logo, color, type and a visual system that works everywhere." },
      {
        title: "Experience",
        text: "Your brand turned into a site people live, not just visit. Designed and built by the same person.",
      },
      { title: "Continuity", text: "Brands grow. I stay so they grow consistently." },
    ],
  },
  about: {
    label: "(About)",
    titleLines: ["Hungry", "for the"],
    titleEm: "world.",
    body: "I'm 21 and a Computer Science engineer. By day I build software; the rest of the time I design brands and web experiences. I'm driven by art, music and the idea that world-class work can come from Ecuador.",
    portraitAlt: "Portrait of Mattias Garcés",
    stats: [
      { value: 21, suffix: "", label: "Years old" },
      { value: 3, suffix: "", label: "Brands launched" },
      { value: 0, suffix: "°", label: "Latitude" },
    ],
  },
  contact: {
    headline: "Does your brand deserve more than a page?",
    contactMe: "Contact me",
    workTogether: "Let's work together!",
    sendDm: "Send me a DM",
    email: "Email",
    or: "or",
    dragHint: "Drag the picture here",
    photoAlt: "Photo of Mattias Garcés",
    photoPending: "Pending: your photo",
    socials: "Social",
    pending: "link pending",
  },
};
