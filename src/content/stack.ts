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
 * Monogramas para tecnologías sin logo en simple-icons (restricciones de
 * marca: AWS, Power BI; sin logo registrado: Alembic, mypy) y conceptos que no
 * son productos. Texto visible: vive aquí, en la capa de contenido (no se
 * traduce, como los nombres de tecnología).
 */
export const TECH_MONOGRAMS: Record<string, string> = {
  'REST APIs': 'API',
  SQL: 'SQL',
  Alembic: 'AL',
  'AWS EC2/EBS': 'AWS',
  Forecasting: 'FC',
  mypy: 'my',
  'Power BI': 'BI',
}

export const STACK_CATEGORIES: StackCategory[] = [
  {
    id: 'backend',
    technologies: ['Python', 'FastAPI', 'Pydantic', 'SQLAlchemy', 'Django', 'REST APIs'],
  },
  {
    id: 'databases',
    technologies: ['PostgreSQL', 'SQL', 'Alembic', 'SQLite', 'Supabase'],
  },
  {
    id: 'cloud',
    technologies: ['Docker', 'AWS EC2/EBS', 'GitHub Actions', 'nginx', 'Linux'],
  },
  {
    id: 'ml',
    technologies: ['scikit-learn', 'TensorFlow/Keras', 'Pandas', 'NumPy', 'Forecasting'],
  },
  {
    id: 'frontend',
    technologies: ['React', 'TypeScript', 'Vite', 'Streamlit'],
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
