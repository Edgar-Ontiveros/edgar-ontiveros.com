import type { ProjectId } from './projects'
import type { ResearchId } from './research'
import type { StackCategoryId } from './stack'

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
    /** Nombre accesible de la lista sr-only con el vocabulario de la constelación. */
    constellationLabel: string
    ctaContact: string
    ctaDownloadCv: string
    githubLabel: string
    linkedinLabel: string
    whatsappLabel: string
    emailLabel: string
  }
  stack: {
    categories: Record<StackCategoryId, string>
  }
  about: {
    paragraphs: string[]
    photoAlt: string
    metrics: {
      value: string
      label: string
    }[]
  }
  experience: {
    /** Puestos en orden cronológico inverso (el más reciente primero). */
    roles: {
      /** Clave para datos sin idioma (p. ej. el logo en site.orgLogos). */
      id: string
      company: string
      role: string
      period: string
      location: string
      /** Línea introductoria opcional (cursiva en el doc). */
      intro?: string
      bullets: string[]
      /** Tags de tecnología del doc; se omiten si el doc no los da. */
      technologies?: string[]
      /** Foto de proyecto opcional (los assets viven en site.rolePhotos). */
      photo?: {
        alt: string
        caption: string
        buttonLabel: string
      }
    }[]
  }
  projects: {
    /** Subtítulo de la sección, bajo el encabezado. */
    subtitle: string
    /** Etiqueta de los proyectos sin demo/repo públicos. */
    internalTag: string
    /** Prefijo del nombre accesible del botón de capturas ("Ver capturas"). */
    viewScreenshots: string
    /** Textos por proyecto (los datos sin idioma viven en projects.ts). */
    items: Record<
      ProjectId,
      {
        name: string
        /** Problema → solución, escaneable en segundos. */
        description: string
        /** Línea secundaria de ingeniería, del doc. */
        detail: string
        /** Una entrada por captura, en el orden de projects.ts. */
        screenshots: {
          alt: string
          /** Pie visible en el visor (qué vista es). */
          caption: string
        }[]
      }
    >
  }
  education: {
    /** Entradas de la línea de tiempo académica, de más reciente a más antigua. */
    entries: {
      /** Clave para datos sin idioma (p. ej. el logo en site.orgLogos). */
      id: string
      institution: string
      degree: string
      location: string
      period: string
    }[]
    certificationsTitle: string
    /** Aviso accesible en el enlace al PDF original. */
    opensPdf: string
    /** Label del enlace al PDF original dentro del visor. */
    viewPdf: string
  }
  research: {
    /** Textos por trabajo (los datos sin idioma viven en research.ts). */
    items: Record<
      ResearchId,
      {
        title: string
        /** Evento o institución (y año cuando se conoce), línea meta en mono. */
        event: string
        description: string
        /** Áreas/técnicas del doc, como chips de texto (sin icono). */
        tags: string[]
        /** Una entrada por asset, en el orden de research.ts. */
        media: {
          /** Etiqueta corta visible (imagen principal y fila de evidencia). */
          label: string
          alt: string
          /** Título en el visor. */
          title: string
          /** Idioma del título si difiere del de la UI (documentos en español). */
          titleLang?: string
          subtitle?: string
        }[]
      }
    >
  }
  contact: {
    blurb: string
    /** Labels visibles de los botones (nombres de marca, no se traducen). */
    github: string
    linkedin: string
    whatsapp: string
  }
  footer: {
    /** Nombre accesible de la mini-nav (distinto al del header, para que el
        lector de pantalla no anuncie dos navegaciones idénticas). */
    navAriaLabel: string
    /** Créditos tras el copyright ("Built with…"), del doc. El año y el
        nombre se componen en runtime con hero.name. */
    tagline: string
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
    /** Textos del visor genérico (certificados, fotos de proyecto). */
    lightbox: {
      close: string
      previous: string
      next: string
      /** Conector del anuncio de posición ("3 de 9" / "3 of 9"). */
      of: string
    }
    skipToContent: string
  }
}
