import { TECH_MONOGRAMS } from '../content/stack'
import { BRAND_ICONS } from '../lib/techIcons'

interface TechIconProps {
  name: string
  className?: string
  /** Color de marca ya ajustado a contraste (src/lib/brandColor.ts). */
  color?: string
}

/** Logo de la tecnología a color de marca, o monograma en --accent si la
    marca no tiene logo disponible (fallback deliberado, misma huella).
    Siempre decorativo (aria-hidden): el nombre en texto real es lo que
    anuncia el lector de pantalla. */
export function TechIcon({ name, className, color }: TechIconProps) {
  const icon = BRAND_ICONS[name]
  if (icon) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill={color ?? 'currentColor'}
        className={className ?? 'h-7 w-7'}
      >
        <path d={icon.path} />
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
