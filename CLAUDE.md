# CLAUDE.md — Portafolio de Mattias Garcés

> Contexto para Claude Code. Léelo antes de escribir código.
> Sistema de diseño (Claude Design): https://claude.ai/artifact/ChYq7sVSNVH9Stu7JNMgxs
> Maqueta de la landing (lienzo): https://claude.ai/artifact/WDwah77GhtNShAYmEkUcYv
> El nombre se escribe siempre **Mattias Garcés** (doble t, sin tilde en la i, con tilde en la é).

## 1. Qué es

Portafolio de Mattias Garcés, 21 años, Ambato (Ecuador). Ingeniero en Ciencias de la Computación que diseña marcas y construye experiencias web.

- Objetivo: que las marcas escriban (correo y WhatsApp). Después: Awwwards (Honorable Mention) y CSSDA.
- Idiomas: español en `/`, inglés en `/en`.
- Concepto **"0° — La mitad del mundo"**: una línea ecuatorial divide lo visual (arriba) de lo técnico (abajo). Se dibuja en el preloader, divide el hero y es la barra de progreso.

## 2. Stack

Astro + TypeScript strict · Tailwind CSS 4 (tokens en `@theme`) · GSAP (ScrollTrigger, SplitText, CustomEase, Flip, Draggable, InertiaPlugin, ScrambleText, DrawSVG, Observer) · Lenis en el ticker de GSAP · Astro View Transitions · Content Collections + MDX · @astrojs/sitemap.

**No usar:** Swiper, Barba, Locomotive, Framer Motion, jQuery, Three.js completo. Sliders con Draggable u Observer.

```bash
npm run dev        # desarrollo
npm run build      # build estático
npm run preview    # previsualizar el build
npm run check      # astro check (debe pasar antes de cada commit)
```

## 3. Diseño: paleta renacentista

Claroscuro de marfil y carbón, y un solo pigmento precioso: el **ultramar** (lapislázuli). **Nunca naranja, rojo ni cálidos saturados.**

| Token | Valor | Uso |
| --- | --- | --- |
| `paper` | `#F2F0EB` | Fondo marfil |
| `ink` | `#0E0E0C` | Texto y tema carbón |
| `stone` | `#8A8780` | Solo líneas y retícula (no texto pequeño) |
| `ultramar` | `#1F3D8C` | Acento sobre marfil |
| `marino` | `#14213D` | Tema marino (trabajo y casos) |
| `cielo` | `#A9BEDF` | Acento sobre carbón y marino |
| `pastel` | `#DCE5F2` | Superficies elevadas sobre marfil |
| `niebla` | `#C9D3E3` | Estado inicial del manifiesto |

- Tres temas por sección con `data-theme="paper|ink|marino"`; los colores semánticos (`surface`, `text`, `muted`, `line`, `accent`) cambian solos.
- `accent` aparece en máximo **un lugar por pantalla** (la línea o una palabra).
- Tipografía: Instrument Serif (display), Geist (texto), Geist Mono (solo datos reales).
- Anton (condensada) solo en la frase horizontal después del hero (`features/statement`), como sustituto gratuito de Schabo Condensed.
- Delicious Handrawn (a mano) solo en el bloque "Contáctame" del footer, igual que en jhosuemesias.com: una polaroid arrastrable tapa el mensaje y los enlaces.
- Bordes rectos, sin sombras, sin gradientes. Retícula de 12 columnas.

## 4. Arquitectura: vertical slices

Cada funcionalidad vive completa en su carpeta: markup, estilos propios, movimiento y textos. Para entender o borrar una sección, miras **una sola carpeta**.

```txt
src/
  pages/                    Solo rutas. Delgadas: un layout + una vista o feature. `/` español, `/en/` inglés.
  views/                    Composiciones de features compartidas entre idiomas (Home.astro: el orden de los actos).
  layouts/                  BaseLayout (head, fuentes, ClientRouter, Lenis, dock)
  features/                 Una carpeta por slice vertical
    preloader/              Preloader.astro + preloader.motion.ts
    hero/                   Hero.astro + hero.motion.ts
    manifesto/
    selected-work/          usa la colección work
    process/
    about/
    contact/
    work/                   índice /trabajo y caso /trabajo/[slug] (CaseCover, BrandBoard, …)
  shared/                   Lo que usan 2+ features. Nada de una sola feature vive aquí.
    ui/                     Button, Label, Tag, EquatorLine, Signature, Dock
    motion/                 core.ts (plugins, Lenis, ciclo de vida), reveals.ts, marquee.ts, theme.ts
    i18n/                   es.ts, en.ts, utils.ts
    styles/                 global.css (tokens @theme), fonts.css
    lib/                    utilidades puras (time.ts, …)
  content/work/             un .mdx por proyecto
  content.config.ts         esquema de la colección work
public/
  fonts/  brand/  work/<slug>/
```

Reglas:

1. Una feature **no importa de otra feature**. Si dos la necesitan, sube a `shared/`. Solo `views/` y `layouts/` combinan features.
2. Cada feature exporta su componente principal desde `index.ts`.
3. El movimiento de una feature vive en `<feature>.motion.ts` y exporta `init(root, ctx)`, registrado en `shared/motion/core.ts`.
4. Los textos van en `shared/i18n/`, nunca sueltos en un componente.
5. Los proyectos salen de la colección `work`; nunca se escriben a mano.

## 5. Movimiento (obligatorio)

1. Un solo reloj: Lenis en `gsap.ticker`, `lagSmoothing(0)`.
2. Solo `transform`, `opacity` y `clip-path`.
3. Easing `heavy` (0.16, 1, 0.3, 1) de 0.9 a 1.4 s para lo narrativo; UI de 0.3 a 0.5 s. Nada rebota (sin `elastic`). Única excepción pedida: las letras de `features/statement` (recreación de Sachith Tharinda).
4. Scrub para lo narrativo; una interacción protagonista por sección.
5. **Sin cursor personalizado.** Nada que siga al mouse; el hover vive en el propio elemento.
6. Todo nace de la línea: entradas desde la línea o con `clip-path` desde el centro.
7. SplitText después de `document.fonts.ready`, con `autoSplit` y `mask: "lines"`.
8. Mouse con `gsap.quickTo`, nunca `gsap.to` en `mousemove`.
9. Tres versiones: escritorio, móvil (sin cursor, sin horizontales) y `prefers-reduced-motion`.
10. Contenido visible sin JS: el estado oculto inicial depende de la clase `.js` en `<html>`.
11. Limpieza total en `astro:before-swap`.

## 6. Contenido

- Proyectos: `omakase` (concepto, mantener el aviso fan-made), `proalimec` (identidad + web), `pulsocont` (web; indicar con honestidad el rol).
- Cada proyecto se muestra con **video en loop** (8–10 s, sin sonido, `playsinline`, < 3 MB, póster) grabado de su propia animación.
- **Nunca inventar** métricas, clientes, testimonios ni premios. Si falta algo: `TODO:` visible.

## 7. Pendientes

- [x] Retrato en B/N de Mattias (`public/me/portrait.jpg`, copia liviana de `me.jpg`, marco 9:16 sin zoom)
- [x] Foto de la polaroid del footer (`public/contact/mattias.webp`)
- [x] Grabaciones de OMAKASE, Proalimec y Pulsocont (`public/work/<slug>/loop.mp4` + `poster.jpg`, 1280×800, ~8–9 s)
- [x] Links de redes, correo y WhatsApp (`src/shared/lib/social.ts`)
- [ ] Dominio (`mattiasgarces`), permisos de Proalimec y Pulsotek, rol en Pulsocont
- [ ] Licencias de fuentes PP (por ahora alternativas gratuitas)
