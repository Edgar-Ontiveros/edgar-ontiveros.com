/**
 * Nodos del grafo-constelación del hero. Son nombres de tecnologías: no se
 * traducen, por eso viven fuera de en.ts/es.ts.
 */
export const CONSTELLATION_NODES = [
  'Python',
  'FastAPI',
  'PostgreSQL',
  'React',
  'TypeScript',
  'Docker',
  'AWS',
  'scikit-learn',
  'TensorFlow',
  'nginx',
  'GitHub Actions',
  'Pandas',
] as const

/** Subconjunto para viewports angostos (<768px), para no saturar. */
export const CONSTELLATION_NODES_MOBILE = [
  'Python',
  'FastAPI',
  'PostgreSQL',
  'React',
  'TypeScript',
  'Docker',
  'AWS',
] as const
