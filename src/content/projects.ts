/**
 * Proyectos en producción, según docs/estructura-portfolio.md (sección
 * "5 · Projects"). Datos sin idioma: los textos por proyecto viven en
 * en.ts/es.ts indexados por ProjectId.
 *
 * Las imágenes se generan con `python3 scripts/generate_project_images.py`
 * (sanea datos sensibles de las capturas y produce los dos tamaños WebP;
 * las dimensiones de abajo salen de lo que imprime ese script). Los
 * `placeholder` (data URI de ~24 px para el blur-up de la miniatura) salen de
 * `python3 scripts/generate_thumb_placeholders.py`.
 *
 * Todos los proyectos son herramientas internas de Herinox (sin demo
 * pública), pero su código vive en repositorios públicos de GitHub (`repo`,
 * URLs verificadas con respuesta 200). La etiqueta "Proyecto interno" solo se
 * muestra en tarjetas que no tengan ningún enlace.
 */
export const PROJECT_IDS = [
  'sales-reporting',
  'quotes',
  'pricing',
  'codegen',
  'purchase-orders',
] as const

export type ProjectId = (typeof PROJECT_IDS)[number]

export interface ProjectScreenshot {
  thumb: string
  thumbWidth: number
  thumbHeight: number
  /** Versión de ~24 px de la miniatura como data URI: se muestra
      desenfocada mientras carga `thumb` (blur-up). */
  placeholder?: string
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

/** Capturas heredadas de tamaño uniforme (1601x817 de origen). Las demás
    llevan objetos literales con las dimensiones que imprime el script. */
function screenshot(base: string, placeholder: string): ProjectScreenshot {
  return {
    thumb: `${IMAGE_DIR}/${base}-thumb.webp`,
    thumbWidth: 800,
    thumbHeight: 408,
    placeholder,
    large: `${IMAGE_DIR}/${base}-large.webp`,
    largeWidth: 1600,
    largeHeight: 816,
  }
}

export const PROJECTS: Project[] = [
  {
    id: 'sales-reporting',
    technologies: [
      'FastAPI',
      'PostgreSQL',
      'SAP HANA (hdbcli)',
      'React + TypeScript',
      'Docker',
      'AWS',
    ],
    screenshots: [
      {
        thumb: `${IMAGE_DIR}/sales-1-dashboard-thumb.webp`,
        thumbWidth: 800,
        thumbHeight: 817,
        placeholder:
          'data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAABQBACdASoYABkAPtlWoUyoJKMiMAwBABsJZQDLw8AD7vA+g3BjmF9T+H0AAP7w9uEm0ZhFrgqjpvtiGfKuh3hEQZvQpCNqkVTUWhfMjQaMmuR5Cuvtu5YN4+CZPrV3+uJ40ti469TiGglAOmPXRt8LxJdxVX879TOT+IcCTZM2+djfgAA=',
        large: `${IMAGE_DIR}/sales-1-dashboard-large.webp`,
        largeWidth: 871,
        largeHeight: 889,
      },
      {
        thumb: `${IMAGE_DIR}/sales-2-budget-thumb.webp`,
        thumbWidth: 766,
        thumbHeight: 868,
        placeholder:
          'data:image/webp;base64,UklGRqgAAABXRUJQVlA4IJwAAAAwBQCdASoYABsAPtVWpEyoJKOiMAwBABqJYwDDVJX9nbf4D4m4nBcrnNk9xBchOqetAAD+83rc30D9QmvQfUOVkA57AMtYoUzp6Vshr3z5mYzP2VSl5aqpl/m3OuEU9dwJnh46KynLr+3cAoIe11l3bdWd/GHhqE669vpYnJDsyKOQ4PfvhDi5oUi4dEMtgwxn4xI9Gn4vUS5lAAA=',
        large: `${IMAGE_DIR}/sales-2-budget-large.webp`,
        largeWidth: 766,
        largeHeight: 868,
      },
      {
        thumb: `${IMAGE_DIR}/sales-3-yoy-thumb.webp`,
        thumbWidth: 772,
        thumbHeight: 868,
        placeholder:
          'data:image/webp;base64,UklGRsgAAABXRUJQVlA4ILwAAAAQBgCdASoYABsAPt1cpkyopSOiMAgBEBuJZQDLTKt6A5/8WxE36vGOuY5Dn1f1Abpr73DrTx8kD4AA/vHzOtx6IiSRV5bwsvkm3GtToVVz2ZTuDiBqlQvITro4p6ND+NhP5EJ1lJAn/TRrXjmAo+Ae78f1gLnaJDOH1q4Zb2LDdPrF5u7yWBcLldsYEe2Qs0eSZhIJtxtw4eIRfkRYQ6pexv8K9T47s5zgtaQ6PjREt9XJsn6mAzVTdpAAAA==',
        large: `${IMAGE_DIR}/sales-3-yoy-large.webp`,
        largeWidth: 772,
        largeHeight: 868,
      },
      {
        thumb: `${IMAGE_DIR}/sales-4-mobile-thumb.webp`,
        thumbWidth: 739,
        thumbHeight: 1600,
        placeholder:
          'data:image/webp;base64,UklGRtgAAABXRUJQVlA4IMwAAABQBgCdASoYADQAPt1apE4opKMiLBqsyRAbiWkAzYgIAK7/Or6vo3C5xH2MUvI9np1SPeGTYes7oYbAAAD+87CgrRs0DiaxrOagxrvyZ/ws++E/SJHFf22G/uYShhQgFl0+q10blSxgvQU+jqpbDXFGxJyYVlQ+qGOMsob6IWZQz7LO8mI31gfsaEZrci7k2flelp29RBdg6kc6UMXQmSQg/22ow3G/71Cn0LsCkfK6TadoNLkEGraTuUqj6BpR7e29K39ffWHYUaAkAAA=',
        large: `${IMAGE_DIR}/sales-4-mobile-large.webp`,
        largeWidth: 739,
        largeHeight: 1600,
      },
    ],
    repo: 'https://github.com/Edgar-Ontiveros/ventas-proyecto',
    internal: true,
  },
  {
    id: 'quotes',
    technologies: [
      'FastAPI',
      'PostgreSQL',
      'React + TypeScript',
      'SAP HANA (hdbcli)',
      'AWS',
      'GitHub Actions',
    ],
    screenshots: [
      {
        thumb: `${IMAGE_DIR}/quotes-1-dashboard-thumb.webp`,
        thumbWidth: 800,
        thumbHeight: 382,
        placeholder:
          'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACQAwCdASoYAAsAPt1cp00opSOiMAgBEBuJZwDCgCHfw7CpMagAAP7tsxKjJuKdAoH+jRglmglZU2BmW12wIXo/3xabaX2l5SoJjDAA',
        large: `${IMAGE_DIR}/quotes-1-dashboard-large.webp`,
        largeWidth: 1600,
        largeHeight: 764,
      },
      {
        thumb: `${IMAGE_DIR}/quotes-2-order-po-thumb.webp`,
        thumbWidth: 800,
        thumbHeight: 396,
        placeholder:
          'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACQAwCdASoYAAwAPt1cpkyopSOiMAgBEBuJZwAAW+wc/z+9BYhAAP7tsTJ4m34b2zZOZC6orZfQ2V309I84BnE3zt5FHAAA',
        large: `${IMAGE_DIR}/quotes-2-order-po-large.webp`,
        largeWidth: 1600,
        largeHeight: 791,
      },
      {
        thumb: `${IMAGE_DIR}/quotes-3-requests-thumb.webp`,
        thumbWidth: 800,
        thumbHeight: 391,
        placeholder:
          'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAwCdASoYAAwAPt1cqUyopSQiMAgBEBuJZwBTAAehzcIJqvj//JAA/urzjdQ7N/ikMjuUyvEN8B3vTsSc0KLeNDBVr6Gye8AAAA==',
        large: `${IMAGE_DIR}/quotes-3-requests-large.webp`,
        largeWidth: 1600,
        largeHeight: 782,
      },
      {
        thumb: `${IMAGE_DIR}/quotes-4-notifications-thumb.webp`,
        thumbWidth: 800,
        thumbHeight: 368,
        placeholder:
          'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAABwAwCdASoYAAsAPt1kqU2opaQiMAgBEBuJZQCdACHhSyr8psAA/us21LFYn38zDTJ3oTEgpIPMuRLLwrVe6tQYLdp/3B04KFwAAA==',
        large: `${IMAGE_DIR}/quotes-4-notifications-large.webp`,
        largeWidth: 1600,
        largeHeight: 736,
      },
      {
        thumb: `${IMAGE_DIR}/quotes-5-mobile-thumb.webp`,
        thumbWidth: 739,
        thumbHeight: 1600,
        placeholder:
          'data:image/webp;base64,UklGRsQAAABXRUJQVlA4ILgAAABQBQCdASoYADQAPt1goUyopiMiLA5hEBuJZwDR+CDmGpbQlt2ZGjWmqpH/IUo9C60uOeAA/vDi8sbxAYwNuUs9zp8l9clgZz3pt48cTb2ny7WlKZkt+GbGtGxGRZjhpWyVOPWL5LwW2dlj/T0Bc2ylHgN61AKbp17HSGQJFePAPNFVvwenNxfDDHVvgQ9KbOMnKbQQhhIsw3yChmpnqVYwGI2ndLZho9BPB3CBRA7r0vAGNXg3AAAA',
        large: `${IMAGE_DIR}/quotes-5-mobile-large.webp`,
        largeWidth: 739,
        largeHeight: 1600,
      },
    ],
    repo: 'https://github.com/Edgar-Ontiveros/proyecto-cotizaciones',
    internal: true,
  },
  {
    id: 'pricing',
    technologies: ['FastAPI', 'React', 'Pandas', 'Docker'],
    screenshots: [
      screenshot(
        'pricing',
        'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAgCdASoYAAwAPt1cpkyopSOiMAgBEBuJaQAAlYgAAP7xP+mMi19Yv8+Zl4+b7qoCwAAA',
      ),
    ],
    repo: 'https://github.com/Edgar-Ontiveros/auto-precios',
    internal: true,
  },
  {
    id: 'codegen',
    technologies: ['FastAPI', 'scikit-learn', 'RapidFuzz', 'AWS EC2/EBS'],
    screenshots: [
      screenshot(
        'codegen',
        'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAABwAwCdASoYAAwAPt0+s1SooiWjmAEQG4lnAAEeG4CNRaDpSgAA/vzaikLKWsLa9trOuOUPEoq3zEQM3VnPt5qzcVF1E88IAAA=',
      ),
    ],
    repo: 'https://github.com/Edgar-Ontiveros/Generador-de-Codigos',
    internal: true,
  },
  {
    id: 'purchase-orders',
    technologies: ['FastAPI', 'Pydantic', 'lxml', 'pdfplumber'],
    screenshots: [
      screenshot(
        'purchase-orders',
        'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAABQAwCdASoYAAwAPt1qqU4opqQiMAgBEBuJaQAAetEoIVpIYAD+8OT+HVQe86iMKUUqodH1wawyyeI8swcXcqx66N00PgAA',
      ),
    ],
    repo: 'https://github.com/Edgar-Ontiveros/Ordenes-Compra',
    internal: true,
  },
]
