import type { ReactNode, Ref } from 'react'
import { CONCEPT_GLYPHS } from './techGlyphs'
import { DEVICON_ICONS } from '../lib/deviconIcons'
import { BRAND_ICONS } from '../lib/techIcons'
import { revealStaggerClasses } from './Section'
import { TechIcon } from './TechIcon'

/** Línea de tiempo vertical compartida (Educación, Experiencia). */
export function Timeline({ children }: { children: ReactNode }) {
  return (
    <ol role="list" className="relative ml-1 border-l border-border">
      {children}
    </ol>
  )
}

/** ¿La tecnología muestra icono en un chip mini? Los conceptos sin icono y
    los wordmarks (ilegibles a 14px) van como chip de texto; el monograma de
    TechIcon es solo red de seguridad. */
const showsChipIcon = (name: string) => {
  if (BRAND_ICONS[name] || CONCEPT_GLYPHS[name]) {
    return true
  }
  const devicon = DEVICON_ICONS[name]
  return Boolean(devicon && !devicon.wordmark)
}

interface TimelineItemProps {
  /** Índice para el stagger de entrada. */
  index: number
  /** Logo de la organización; sin él se muestra el monograma. */
  logo?: string
  monogram: string
  /** Empresa/institución (línea en --accent). */
  subtitle: string
  /** Rol/grado, destacado en Space Grotesk. */
  title: string
  location: string
  period: string
  /** Contenido libre (intro, bullets de logros…). */
  children?: ReactNode
  /** Tecnologías del puesto, como chips discretos al pie. */
  technologies?: string[]
  /** Foto de proyecto opcional: miniatura discreta que abre un visor. */
  media?: {
    thumb: string
    thumbWidth: number
    thumbHeight: number
    alt: string
    caption: string
    buttonLabel: string
    onOpen: () => void
  }
  /** Ref del botón de la foto, para que el padre restaure el foco al cerrar
      el visor. Vive fuera de `media`: un miembro pasado a ref= haría que la
      regla react-hooks/refs tratara todo el objeto como contenedor de refs. */
  mediaButtonRef?: Ref<HTMLButtonElement>
}

export function TimelineItem({
  index,
  logo,
  monogram,
  subtitle,
  title,
  location,
  period,
  children,
  technologies,
  media,
  mediaButtonRef,
}: TimelineItemProps) {
  return (
    <li className="relative pb-8 pl-5 last:pb-2 sm:pl-8">
      <span
        aria-hidden="true"
        className="absolute top-8 -left-[5px] h-2.5 w-2.5 rounded-full bg-accent"
      />
      <div
        style={{ transitionDelay: `${index * 80}ms` }}
        className={`rounded-lg border border-border bg-surface p-5 sm:p-6 ${revealStaggerClasses}`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {/* Los assets de logo llevan placa blanca horneada cuando su tinta
                no sobrevive el tema oscuro; la caja reserva su tamaño fijo. */}
            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
              {logo ? (
                <img src={logo} alt="" loading="lazy" className="h-full w-full object-contain" />
              ) : (
                <span
                  aria-hidden="true"
                  className="font-mono text-[0.6rem] font-semibold text-accent"
                >
                  {monogram}
                </span>
              )}
            </span>
            <div>
              <p className="font-mono text-sm text-accent">{subtitle}</p>
              <h3 className="mt-1 font-display text-lg font-semibold sm:text-xl">{title}</h3>
              <p className="mt-1 text-sm text-muted">{location}</p>
            </div>
          </div>
          <span className="self-start rounded-full border border-border bg-background px-3 py-1 font-mono text-xs whitespace-nowrap text-muted">
            {period}
          </span>
        </div>

        {children}

        {media && (
          <figure className="mt-5">
            <button
              type="button"
              ref={mediaButtonRef}
              onClick={media.onOpen}
              aria-label={media.buttonLabel}
              aria-haspopup="dialog"
              className="block w-44 overflow-hidden rounded-md border border-border transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-48"
            >
              {/* alt vacío: el aria-label del botón ya nombra la acción y el
                  alt descriptivo vive en la imagen del visor (misma convención
                  que las tarjetas de certificado). */}
              <img
                src={media.thumb}
                alt=""
                width={media.thumbWidth}
                height={media.thumbHeight}
                loading="lazy"
                className="aspect-3/2 w-full object-cover"
              />
            </button>
            <figcaption className="mt-2 max-w-xs font-mono text-xs text-muted">
              {media.caption}
            </figcaption>
          </figure>
        )}

        {technologies && technologies.length > 0 && (
          <ul role="list" className="mt-5 flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <li
                key={tech}
                className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted"
              >
                {showsChipIcon(tech) && <TechIcon name={tech} className="h-3.5 w-3.5" />}
                {tech}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}
