/**
 * Proyectos en producción, según docs/estructura-portfolio.md (sección
 * "5 · Projects"). Datos sin idioma: los textos por proyecto viven en
 * en.ts/es.ts indexados por ProjectId.
 *
 * Las imágenes se generan con `python3 scripts/generate_project_images.py`
 * (sanea datos sensibles de las capturas y produce los dos tamaños WebP;
 * las dimensiones de abajo salen de lo que imprime ese script).
 *
 * Todos los proyectos actuales son herramientas internas de Herinox: no hay
 * demo ni repositorio públicos, así que no llevan enlaces (la tarjeta muestra
 * la etiqueta "Proyecto interno" en su lugar).
 */
export const PROJECT_IDS = ['quotes', 'pricing', 'codegen', 'purchase-orders'] as const

export type ProjectId = (typeof PROJECT_IDS)[number]

export interface ProjectScreenshot {
  thumb: string
  thumbWidth: number
  thumbHeight: number
  large: string
  largeWidth: number
  largeHeight: number
}

export interface Project {
  id: ProjectId
  /** Tecnologías del doc, tal cual (no se traducen). */
  technologies: string[]
  /** Capturas en el orden en que navega el visor; la primera es la miniatura. */
  screenshots: ProjectScreenshot[]
  /** Sin demo/repo público: la tarjeta muestra la etiqueta de proyecto interno. */
  internal: boolean
}

const IMAGE_DIR = '/images/projects'

/** Todas las capturas comparten tamaño (1601x817 de origen). */
function screenshot(base: string): ProjectScreenshot {
  return {
    thumb: `${IMAGE_DIR}/${base}-thumb.webp`,
    thumbWidth: 800,
    thumbHeight: 408,
    large: `${IMAGE_DIR}/${base}-large.webp`,
    largeWidth: 1600,
    largeHeight: 816,
  }
}

export const PROJECTS: Project[] = [
  {
    id: 'quotes',
    technologies: ['FastAPI', 'PostgreSQL 17', 'React 19', 'Docker', 'GitHub Actions'],
    screenshots: [
      screenshot('quotes-dashboard'),
      screenshot('quotes-requests'),
      screenshot('quotes-login'),
    ],
    internal: true,
  },
  {
    id: 'pricing',
    technologies: ['FastAPI', 'React', 'Pandas', 'Docker'],
    screenshots: [screenshot('pricing')],
    internal: true,
  },
  {
    id: 'codegen',
    technologies: ['FastAPI', 'scikit-learn', 'RapidFuzz', 'AWS EC2/EBS'],
    screenshots: [screenshot('codegen')],
    internal: true,
  },
  {
    id: 'purchase-orders',
    technologies: ['FastAPI', 'Pydantic', 'lxml', 'pdfplumber'],
    screenshots: [screenshot('purchase-orders')],
    internal: true,
  },
]
