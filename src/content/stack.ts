/**
 * Stack tecnológico agrupado por categoría, según docs/estructura-portfolio.md
 * (sección "3 · Stack"). Los nombres de tecnologías no se traducen; los nombres
 * de las categorías viven en en.ts/es.ts indexados por StackCategoryId.
 */
export const STACK_CATEGORY_IDS = [
  'backend',
  'databases',
  'cloud',
  'ml',
  'frontend',
  'quality',
  'bi',
] as const

export type StackCategoryId = (typeof STACK_CATEGORY_IDS)[number]

export interface StackCategory {
  id: StackCategoryId
  technologies: string[]
}

/**
 * Monogramas de red de seguridad para tecnologías futuras sin logo (todas las
 * actuales se resuelven con simple-icons, Devicon o glifos propios). Texto
 * visible: vive aquí, en la capa de contenido (no se traduce, como los
 * nombres de tecnología).
 */
export const TECH_MONOGRAMS: Record<string, string> = {}

export const STACK_CATEGORIES: StackCategory[] = [
  {
    id: 'backend',
    technologies: ['Python', 'FastAPI', 'Pydantic', 'SQLAlchemy', 'Django', 'Node.js', 'REST APIs'],
  },
  {
    id: 'databases',
    technologies: ['PostgreSQL', 'SQL', 'Alembic', 'SQLite', 'Supabase'],
  },
  {
    id: 'cloud',
    technologies: ['Docker', 'Kubernetes', 'AWS EC2/EBS', 'GitHub Actions', 'nginx', 'Linux'],
  },
  {
    id: 'ml',
    technologies: ['scikit-learn', 'TensorFlow/Keras', 'Pandas', 'NumPy', 'Forecasting'],
  },
  {
    id: 'frontend',
    technologies: ['React', 'TypeScript', 'JavaScript', 'Vite', 'Streamlit'],
  },
  {
    id: 'quality',
    technologies: ['pytest', 'ruff', 'mypy', 'Git'],
  },
  {
    id: 'bi',
    technologies: ['Power BI', 'SAP'],
  },
]
