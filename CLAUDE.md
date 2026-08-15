# edgar-ontiveros.com

Portafolio personal one-page (tema "Constelación"), bilingüe EN/ES con tema
oscuro (default) y claro. La estructura y el copy completo del sitio viven en
`docs/estructura-portfolio.md` — consultarla antes de construir cualquier
sección.

## Stack

- Vite + React 19 + TypeScript estricto · npm
- Tailwind CSS v4 (plugin `@tailwindcss/vite`)
- Fuentes self-hosted vía `@fontsource-variable`: Space Grotesk (display),
  Inter (cuerpo), JetBrains Mono (labels/código)
- Deploy objetivo: Cloudflare Pages (aún no configurado)

## Arquitectura

- `src/content/` — TODO el texto visible del sitio (`types.ts` define
  `SiteContent`; `en.ts` y `es.ts` lo implementan, el type obliga a mantener
  ambos idiomas completos).
- `src/styles/theme.css` — design tokens: colores por tema (CSS variables),
  fuentes y su mapeo a utilidades Tailwind (`bg-background`, `bg-surface`,
  `text-foreground`, `text-muted`, `text-accent`, `text-accent-2`,
  `border-border`, `font-display`, `font-sans`, `font-mono`).
- `src/hooks/` — `useTheme` (atributo `data-theme` en `<html>` + localStorage;
  default sigue `prefers-color-scheme`) y `useLanguage` (auto-detección,
  localStorage, `<html lang>`). `index.html` tiene un script inline que aplica
  tema e idioma antes del primer paint — mantenerlo en sincronía con los hooks.
- `src/components/` — componentes reutilizables; `src/sections/` — secciones
  del one-page.
- `raw-assets/` — material fuente LOCAL, **no versionado** (está en
  `.gitignore`): contiene originales sin sanear (capturas con datos de
  negocio, PDFs de pósters con correos personales). Los scripts de `scripts/`
  lo consumen para regenerar los assets optimizados y saneados de `public/`,
  que son los únicos que se versionan y publican. Nunca commitear nada de
  `raw-assets/` ni publicar originales directamente.

## Convenciones

- TypeScript estricto; `npm run build` corre `tsc -b` antes de Vite.
- Todo el texto del sitio vive SOLO en `src/content`, nunca hardcodeado en
  componentes.
- Accesibilidad WCAG AA obligatoria: contraste verificado en ambos temas
  (ratios documentados en `theme.css`), foco visible, navegación por teclado y
  `prefers-reduced-motion` respetado en toda animación.
- Toda imagen lleva `alt`.
- Colores y fuentes siempre vía tokens/utilidades del tema; no hex sueltos en
  componentes.

## Commits

- Claude Code hace un commit por tarea completada; mensajes en inglés,
  imperativos y descriptivos.
- El autor es únicamente el git config local del repo (Edgar). PROHIBIDO
  agregar trailers `Co-Authored-By`, líneas "Generated with Claude Code" o
  cualquier mención a Claude/IA en mensajes o metadatos de commit.
- Nunca se commitea si `npm run build` o `npm run lint` fallan.

## Flujo de trabajo

- Una tarea enfocada por prompt; cambios aditivos, sin refactors no pedidos.
- `npm run build` y `npm run lint` deben pasar antes de dar por terminada
  cualquier tarea.

## Comandos

- `npm run dev` — servidor de desarrollo
- `npm run build` — type-check + build de producción
- `npm run preview` — sirve el build
- `npm run lint` — ESLint
- `npm run format` — Prettier
