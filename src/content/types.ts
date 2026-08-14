/** Idiomas soportados por el sitio. */
export type Language = 'en' | 'es'

/** Ids de las secciones del one-page, en orden; también son las anclas de la nav. */
export const SECTION_IDS = [
  'about',
  'stack',
  'experience',
  'projects',
  'education',
  'research',
  'contact',
] as const

export type SectionId = (typeof SECTION_IDS)[number]

/**
 * Contrato de todo el texto visible del sitio. `en.ts` y `es.ts` lo
 * implementan; TypeScript obliga a mantener ambos idiomas completos.
 */
export interface SiteContent {
  nav: {
    /** Nombre accesible del <nav>. */
    ariaLabel: string
    /** Labels de las anclas, en el orden de SECTION_IDS. */
    labels: Record<SectionId, string>
  }
  hero: {
    eyebrow: string
    name: string
    /** Texto de la línea typewriter. */
    tagline: string
    valueProp: string
    /** Nombre accesible de la lista de tecnologías de la constelación. */
    stackLabel: string
    ctaContact: string
    ctaDownloadCv: string
    githubLabel: string
    linkedinLabel: string
  }
  contact: {
    blurb: string
    /** Labels visibles de los botones (nombres de marca, no se traducen). */
    github: string
    linkedin: string
  }
  ui: {
    themeToggle: {
      toLight: string
      toDark: string
    }
    languageToggle: {
      /** Nombre accesible del botón, escrito en el idioma destino. */
      label: string
      /** Código visible del idioma destino (p. ej. "ES"). */
      code: string
    }
    menu: {
      open: string
      close: string
    }
    skipToContent: string
  }
}
