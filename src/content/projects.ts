/**
 * Proyectos en producción, según docs/estructura-portfolio.md (sección
 * "5 · Projects"). Datos sin idioma: los textos por proyecto viven en
 * en.ts/es.ts indexados por ProjectId.
 *
 * Las imágenes se generan con `python3 scripts/generate_project_images.py`
 * (sanea datos sensibles de las capturas y produce los dos tamaños WebP;
 * las dimensiones de abajo salen de lo que imprime ese script).
 *
 * Todos los proyectos son herramientas internas de Herinox (sin demo
 * pública), pero su código vive en repositorios públicos de GitHub (`repo`,
 * URLs verificadas con respuesta 200). La etiqueta "Proyecto interno" solo se
 * muestra en tarjetas que no tengan ningún enlace.
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
  /** Repositorio público en GitHub. */
  repo?: string
  /** Herramienta interna: sin `repo` ni demo, la tarjeta muestra la etiqueta
      de proyecto interno en lugar de enlaces. */
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
    repo: 'https://github.com/Edgar-Ontiveros/proyecto-cotizaciones',
    internal: true,
  },
  {
    id: 'pricing',
    technologies: ['FastAPI', 'React', 'Pandas', 'Docker'],
    screenshots: [screenshot('pricing')],
    repo: 'https://github.com/Edgar-Ontiveros/auto-precios',
    internal: true,
  },
  {
    id: 'codegen',
    technologies: ['FastAPI', 'scikit-learn', 'RapidFuzz', 'AWS EC2/EBS'],
    screenshots: [screenshot('codegen')],
    repo: 'https://github.com/Edgar-Ontiveros/Generador-de-Codigos',
    internal: true,
  },
  {
    id: 'purchase-orders',
    technologies: ['FastAPI', 'Pydantic', 'lxml', 'pdfplumber'],
    screenshots: [screenshot('purchase-orders')],
    repo: 'https://github.com/Edgar-Ontiveros/Ordenes-Compra',
    internal: true,
  },
]
