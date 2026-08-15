/**
 * Stack tecnológico agrupado por categoría, según docs/estructura-portfolio.md
 * (sección "3 · Stack"). Los nombres de tecnologías no se traducen; los nombres
 * de las categorías viven en en.ts/es.ts indexados por StackCategoryId.
 *
 * Niveles de uso como etiqueta textual + color, nunca barras de porcentaje:
 * daily → --accent · solid → --text-muted · learning → --accent-2.
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

export type StackLevel = 'daily' | 'solid' | 'learning'

export interface StackTechnology {
  name: string
  level: StackLevel
}

export interface StackCategory {
  id: StackCategoryId
  technologies: StackTechnology[]
}

export const STACK_CATEGORIES: StackCategory[] = [
  {
    id: 'backend',
    technologies: [
      { name: 'Python', level: 'daily' },
      { name: 'FastAPI', level: 'daily' },
      { name: 'Pydantic', level: 'daily' },
      { name: 'SQLAlchemy', level: 'daily' },
      { name: 'Django', level: 'solid' },
      { name: 'REST APIs', level: 'daily' },
    ],
  },
  {
    id: 'databases',
    technologies: [
      { name: 'PostgreSQL', level: 'daily' },
      { name: 'SQL', level: 'daily' },
      { name: 'Alembic', level: 'solid' },
      { name: 'SQLite', level: 'solid' },
      { name: 'Supabase', level: 'solid' },
    ],
  },
  {
    id: 'cloud',
    technologies: [
      { name: 'Docker', level: 'daily' },
      { name: 'AWS EC2/EBS', level: 'solid' },
      { name: 'GitHub Actions', level: 'solid' },
      { name: 'nginx', level: 'solid' },
      { name: 'Linux', level: 'daily' },
    ],
  },
  {
    id: 'ml',
    technologies: [
      { name: 'scikit-learn', level: 'solid' },
      { name: 'TensorFlow/Keras', level: 'solid' },
      { name: 'Pandas', level: 'daily' },
      { name: 'NumPy', level: 'daily' },
      { name: 'Forecasting', level: 'solid' },
    ],
  },
  {
    id: 'frontend',
    technologies: [
      { name: 'React', level: 'daily' },
      { name: 'TypeScript', level: 'daily' },
      { name: 'Vite', level: 'daily' },
      { name: 'Streamlit', level: 'solid' },
    ],
  },
  {
    id: 'quality',
    technologies: [
      { name: 'pytest', level: 'daily' },
      { name: 'ruff', level: 'daily' },
      { name: 'mypy', level: 'solid' },
      { name: 'Git', level: 'daily' },
    ],
  },
  {
    id: 'bi',
    technologies: [
      { name: 'Power BI', level: 'solid' },
      { name: 'SAP', level: 'solid' },
    ],
  },
]
