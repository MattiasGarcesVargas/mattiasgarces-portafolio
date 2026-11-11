import type { RichText } from "./types";

export const es = {
  meta: {
    title: "Mattias Garcés — Diseño y código desde la mitad del mundo",
    description:
      "Mattias Garcés diseña identidades de marca y construye experiencias web inmersivas desde Ambato, Ecuador.",
  },
  brand: {
    name: "Mattias Garcés",
    tagline: "Diseño y código desde la mitad del mundo.",
    coordinates: "01°14′S · 78°37′O",
    city: "Ambato, EC",
  },
  nav: {
    skip: "Saltar al contenido",
    home: "Inicio",
    work: "Trabajo",
    about: "Sobre mí",
    contact: "Hablemos",
  },
  preloader: {
    coordinates: "0°00′00″",
    loading: "Cargando la mitad del mundo",
  },
  hero: {
    designLabel: "(Diseño)",
    design: "Identidad visual · Dirección de arte",
    codeLabel: "(Código)",
    code: "Ingeniería · Experiencias web",
    available: "Disponible para proyectos",
    scroll: "(Scroll)",
  },
  statement: {
    // TODO(content): copy given by Mattias; "Webflow Expert" may not match his stack (Astro/React).
    segments: ["I craft digital experiences as a Designer,", "Frontend Developer", "&", "Webflow Expert."],
  },
  manifesto: {
    label: "Manifiesto",
    text: [
      "No hago páginas. Hago que las marcas se ",
      { em: "sientan", accent: true },
      ". Entiendo tu negocio, construyo tu identidad y la convierto en una experiencia que la gente ",
      { em: "recuerda" },
      ". De la estrategia al código, sin intermediarios.",
    ] as RichText,
  },
  work: {
    title: "Trabajo",
    titleEm: "seleccionado",
    viewCase: "Ver caso",
    viewAll: "Ver todo el trabajo",
    index: "Índice",
    videoPending: "Video pendiente",
    loop: "Loop sin sonido",
    back: "Volver al inicio",
    caseTodo: "Caso de estudio en construcción.",
    types: { identidad: "Identidad", web: "Web", concepto: "Concepto" },
  },
  process: {
    title: "Cómo",
    titleEm: "trabajo",
    intro: "Cuatro pasos y una sola persona de principio a fin. Así sabes exactamente qué estás comprando.",
    steps: [
      { title: "Analizar", text: "Antes de diseñar, escucho. Quién eres, a quién le hablas y qué te hace distinto." },
      { title: "Identidad", text: "Logo, color, tipografía y un sistema visual que funciona en todas partes." },
      {
        title: "Experiencia",
        text: "Tu marca convertida en un sitio que se vive, no solo se visita. Diseñado y programado por la misma persona.",
      },
      { title: "Continuidad", text: "Las marcas crecen. Me quedo para que crezcan coherentes." },
    ],
  },
  about: {
    label: "(Sobre mí)",
    titleLines: ["Hambre", "de"],
    titleEm: "mundo.",
    body: "Tengo 21 años y soy ingeniero en Ciencias de la Computación. De día construyo software; el resto del tiempo diseño marcas y experiencias web. Me mueve el arte, la música y la idea de que desde Ecuador se puede hacer trabajo de nivel mundial.",
    portraitAlt: "Retrato de Mattias Garcés",
    stats: [
      { value: 21, suffix: "", label: "Años" },
      { value: 3, suffix: "", label: "Marcas lanzadas" },
      { value: 0, suffix: "°", label: "Latitud" },
    ],
  },
  contact: {
    headline: "¿Tu marca merece algo más que una página?",
    contactMe: "Contáctame",
    workTogether: "¡Trabajemos juntos!",
    sendDm: "Escríbeme un DM",
    email: "Email",
    or: "o",
    dragHint: "Arrastra la foto aquí",
    photoAlt: "Foto de Mattias Garcés",
    photoPending: "Pendiente: tu foto",
    socials: "Redes",
    pending: "enlace pendiente",
  },
};

export type Dictionary = typeof es;
