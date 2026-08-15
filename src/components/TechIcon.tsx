import type { SimpleIcon } from 'simple-icons'
import { TECH_MONOGRAMS } from '../content/stack'
import {
  siDjango,
  siDocker,
  siFastapi,
  siGit,
  siGithubactions,
  siLinux,
  siNginx,
  siNumpy,
  siPandas,
  siPostgresql,
  siPydantic,
  siPytest,
  siPython,
  siReact,
  siRuff,
  siSap,
  siScikitlearn,
  siSqlalchemy,
  siSqlite,
  siStreamlit,
  siSupabase,
  siTensorflow,
  siTypescript,
  siVite,
} from 'simple-icons'

/* Imports por icono individual: solo entran al bundle los usados. Se renderizan
   monocromos con currentColor (nunca el color de marca), para que hereden los
   tokens del tema. */
const BRAND_ICONS: Record<string, SimpleIcon> = {
  Python: siPython,
  FastAPI: siFastapi,
  Pydantic: siPydantic,
  SQLAlchemy: siSqlalchemy,
  Django: siDjango,
  PostgreSQL: siPostgresql,
  SQLite: siSqlite,
  Supabase: siSupabase,
  Docker: siDocker,
  'GitHub Actions': siGithubactions,
  nginx: siNginx,
  Linux: siLinux,
  'scikit-learn': siScikitlearn,
  'TensorFlow/Keras': siTensorflow,
  Pandas: siPandas,
  NumPy: siNumpy,
  React: siReact,
  TypeScript: siTypescript,
  Vite: siVite,
  Streamlit: siStreamlit,
  pytest: siPytest,
  ruff: siRuff,
  Git: siGit,
  SAP: siSap,
}

interface TechIconProps {
  name: string
  className?: string
}

/** Logo monocromo de la tecnología, o monograma si la marca no tiene logo
    disponible. Siempre decorativo (aria-hidden): el nombre en texto real es
    lo que anuncia el lector de pantalla. */
export function TechIcon({ name, className }: TechIconProps) {
  const icon = BRAND_ICONS[name]
  if (icon) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className ?? 'h-7 w-7'}
      >
        <path d={icon.path} />
      </svg>
    )
  }
  return (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center rounded-md border border-current font-mono text-[0.6rem] font-semibold ${className ?? 'h-7 w-7'}`}
    >
      {TECH_MONOGRAMS[name] ?? name.slice(0, 2).toUpperCase()}
    </span>
  )
}
