import { TECH_MONOGRAMS } from '../content/stack'
import { DEVICON_ICONS } from '../lib/deviconIcons'
import { BRAND_ICONS } from '../lib/techIcons'
import { CONCEPT_GLYPHS } from './techGlyphs'

interface TechIconProps {
  name: string
  className?: string
  /** Color de marca ya ajustado a contraste (src/lib/brandColor.ts). */
  color?: string
}

/** Icono de la tecnología, resuelto en orden: logo de simple-icons → logo de
    Devicon (marcas retiradas de simple-icons) → glifo propio en --accent →
    monograma (red de seguridad para tecnologías futuras). Siempre decorativo
    (aria-hidden): el nombre en texto real es lo que anuncia el lector. */
export function TechIcon({ name, className, color }: TechIconProps) {
  const brand = BRAND_ICONS[name]
  if (brand) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill={color ?? 'currentColor'}
        className={className ?? 'h-7 w-7'}
      >
        <path d={brand.path} />
      </svg>
    )
  }
  const devicon = DEVICON_ICONS[name]
  if (devicon) {
    return (
      <svg
        aria-hidden="true"
        viewBox={devicon.viewBox}
        fill={color ?? 'currentColor'}
        className={className ?? 'h-7 w-7'}
      >
        <path d={devicon.path} />
      </svg>
    )
  }
  const glyph = CONCEPT_GLYPHS[name]
  if (glyph) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`text-accent ${className ?? 'h-7 w-7'}`}
      >
        {glyph}
      </svg>
    )
  }
  return (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center rounded-md border border-current font-mono text-[0.65rem] font-semibold text-accent ${className ?? 'h-7 w-7'}`}
    >
      {TECH_MONOGRAMS[name] ?? name.slice(0, 2).toUpperCase()}
    </span>
  )
}
