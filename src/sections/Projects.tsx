import { useEffect, useRef, useState } from 'react'
import { Lightbox } from '../components/Lightbox'
import type { LightboxItem } from '../components/Lightbox'
import { GitHubIcon } from '../components/icons'
import { Section, revealStaggerClasses } from '../components/Section'
import { TechIcon } from '../components/TechIcon'
import { showsChipIcon } from '../lib/chipIcon'
import { liftClasses, liftWithinClasses } from '../lib/motion'
import { useSpotlight } from '../hooks/useSpotlight'
import { PROJECTS } from '../content/projects'
import type { ProjectScreenshot } from '../content/projects'
import type { SiteContent } from '../content/types'

interface ProjectsProps {
  content: SiteContent
}

/** "PostgreSQL 17" → "PostgreSQL": el chip muestra la versión del doc, pero
    el icono se resuelve por el nombre base de la marca. */
const iconName = (tech: string) => tech.replace(/\s+\d+$/, '')

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
/** Cadencia de la rotación de miniaturas y duración del crossfade. */
const ROTATION_INTERVAL_MS = 4000
const CROSSFADE_MS = 600
/** Desfase inicial por tarjeta: las miniaturas no cambian todas a la vez. */
const ROTATION_STAGGER_MS = 900

/** Capturas aptas para la miniatura (contenedor 2:1 con object-cover): las de
    escritorio, incluidas las casi cuadradas (~0.9). Las de móvil, en retrato
    (~0.46), solo se ven completas en el visor. */
const isLandscape = (shot: ProjectScreenshot) => shot.thumbWidth / shot.thumbHeight >= 0.75

interface RotatingThumbnailProps {
  shots: ProjectScreenshot[]
  /** alt de cada captura, en el orden de `shots`. */
  alts: string[]
  offsetMs: number
  reducedMotion: boolean
}

/**
 * Miniatura de la tarjeta: con varias capturas horizontales rota entre ellas
 * con un crossfade de opacidad; las imágenes van apiladas (absolute) dentro
 * del mismo contenedor 2:1, así no hay layout shift. Solo la visible queda
 * expuesta al lector de pantalla (alt propio; el resto aria-hidden y alt
 * vacío). Con prefers-reduced-motion, o con una sola captura, la primera
 * imagen queda fija. La rotación se pausa fuera del viewport y con la
 * pestaña oculta (mismo patrón que la constelación del hero).
 */
function RotatingThumbnail({ shots, alts, offsetMs, reducedMotion }: RotatingThumbnailProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const rotating = shots.length > 1 && !reducedMotion
  const visibleShots = rotating ? shots : shots.slice(0, 1)

  useEffect(() => {
    const host = hostRef.current
    if (!rotating || !host) {
      setActive(0)
      return
    }
    let inViewport = false
    let timer: number | null = null
    let pendingOffset = offsetMs
    const tick = () => {
      setActive((current) => (current + 1) % shots.length)
      timer = window.setTimeout(tick, ROTATION_INTERVAL_MS)
    }
    const start = () => {
      if (timer !== null) {
        return
      }
      timer = window.setTimeout(tick, ROTATION_INTERVAL_MS + pendingOffset)
      pendingOffset = 0
    }
    const stop = () => {
      if (timer !== null) {
        window.clearTimeout(timer)
        timer = null
      }
    }
    const updateRunning = () => {
      if (inViewport && document.visibilityState === 'visible') {
        start()
      } else {
        stop()
      }
    }
    document.addEventListener('visibilitychange', updateRunning)
    let observer: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        inViewport = entries.some((entry) => entry.isIntersecting)
        updateRunning()
      })
      observer.observe(host)
    } else {
      inViewport = true
      updateRunning()
    }
    return () => {
      stop()
      observer?.disconnect()
      document.removeEventListener('visibilitychange', updateRunning)
    }
  }, [rotating, shots.length, offsetMs])

  return (
    <div
      ref={hostRef}
      className="relative aspect-2/1 w-full bg-background transition-opacity duration-200 group-hover:opacity-85 motion-reduce:transition-none"
    >
      {visibleShots.map((shot, index) => {
        const isActive = index === active
        return (
          <img
            key={shot.thumb}
            src={shot.thumb}
            alt={isActive ? alts[index] : ''}
            aria-hidden={isActive ? undefined : true}
            width={shot.thumbWidth}
            height={shot.thumbHeight}
            loading="lazy"
            style={{ transitionDuration: `${CROSSFADE_MS}ms` }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out motion-reduce:transition-none ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )
      })}
    </div>
  )
}

export function Projects({ content }: ProjectsProps) {
  const { projects } = content
  /** Visor abierto: proyecto + captura dentro de su serie. */
  const [viewer, setViewer] = useState<{ project: number; shot: number } | null>(null)
  const openedFrom = useRef<number | null>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const onSpotlightMove = useSpotlight()
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
  )

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY)
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const openViewer = (project: number) => {
    openedFrom.current = project
    setViewer({ project, shot: 0 })
  }
  const closeViewer = () => setViewer(null)

  // Restauración de foco tras el cleanup del visor (que quita inert de #root):
  // mismo patrón que la galería de certificados.
  useEffect(() => {
    if (viewer === null && openedFrom.current !== null) {
      cardRefs.current[openedFrom.current]?.focus()
      openedFrom.current = null
    }
  }, [viewer])

  const openProject = viewer !== null ? PROJECTS[viewer.project] : null
  const openTexts = openProject ? projects.items[openProject.id] : null

  return (
    <Section id="projects" number="04" title={content.nav.labels.projects}>
      <p className={`-mt-6 mb-10 text-muted sm:-mt-8 ${revealStaggerClasses}`}>
        {projects.subtitle}
      </p>

      {/* 1 → 2 columnas: las capturas necesitan ancho para leerse. */}
      <ul role="list" className="grid gap-6 sm:grid-cols-2">
        {PROJECTS.map((project, index) => {
          const texts = projects.items[project.id]
          const landscapeIndexes = project.screenshots
            .map((shot, shotIndex) => (isLandscape(shot) ? shotIndex : -1))
            .filter((shotIndex) => shotIndex >= 0)
          // Sin ninguna horizontal (no ocurre hoy) la miniatura es la primera.
          const thumbIndexes = landscapeIndexes.length > 0 ? landscapeIndexes : [0]
          return (
            <li key={project.id} className="h-full">
              {/* El reveal (stagger) va en el wrapper y el lift/spotlight en
                  el article: sus transiciones de transform no se mezclan. */}
              <div
                style={{ transitionDelay: `${80 + index * 60}ms` }}
                className={`h-full ${revealStaggerClasses}`}
              >
                <article
                  onMouseMove={onSpotlightMove}
                  className={`spotlight-host relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface ${liftWithinClasses}`}
                >
                  <button
                    type="button"
                    ref={(el) => {
                      cardRefs.current[index] = el
                    }}
                    onClick={() => openViewer(index)}
                    aria-haspopup="dialog"
                    aria-label={`${projects.viewScreenshots}: ${texts.name}`}
                    className="group block w-full border-b border-border"
                  >
                    {/* Proporción fija ~2:1 + object-cover: la retícula queda
                      pareja sin deformar la imagen. El aria-label del botón
                      nombra la acción; la imagen visible lleva su alt. */}
                    <RotatingThumbnail
                      shots={thumbIndexes.map((shotIndex) => project.screenshots[shotIndex])}
                      alts={thumbIndexes.map(
                        (shotIndex) => texts.screenshots[shotIndex]?.alt ?? texts.name,
                      )}
                      offsetMs={index * ROTATION_STAGGER_MS}
                      reducedMotion={reducedMotion}
                    />
                  </button>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h3 className="font-display text-lg font-semibold">{texts.name}</h3>
                      {/* La etiqueta solo aparece cuando NO hay ningún enlace
                        que la sustituya. */}
                      {project.internal && !project.repo && (
                        <span className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-xs whitespace-nowrap text-muted">
                          {projects.internalTag}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                      {texts.description}
                    </p>
                    <p className="mt-2 font-mono text-xs leading-relaxed text-muted">
                      {texts.detail}
                    </p>
                    <ul role="list" className="mt-auto flex flex-wrap gap-2 pt-5">
                      {project.technologies.map((tech) => (
                        <li
                          key={tech}
                          className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted"
                        >
                          {showsChipIcon(iconName(tech)) && (
                            <TechIcon name={iconName(tech)} className="h-3.5 w-3.5" />
                          )}
                          {tech}
                        </li>
                      ))}
                    </ul>
                    {project.repo && (
                      <div className="mt-5">
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${projects.viewRepo}: ${texts.name}`}
                          className={`inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium ${liftClasses}`}
                        >
                          <GitHubIcon className="h-5 w-5" />
                          GitHub
                        </a>
                      </div>
                    )}
                  </div>
                  <span aria-hidden="true" className="spotlight" />
                </article>
              </div>
            </li>
          )
        })}
      </ul>

      {viewer !== null && openProject && openTexts && (
        <Lightbox
          items={openProject.screenshots.map((shot, shotIndex): LightboxItem => ({
            src: shot.large,
            width: shot.largeWidth,
            height: shot.largeHeight,
            alt: openTexts.screenshots[shotIndex]?.alt ?? openTexts.name,
            title: openTexts.name,
            subtitle: openTexts.screenshots[shotIndex]?.caption,
          }))}
          index={viewer.shot}
          labels={content.ui.lightbox}
          onNavigate={(shot) => setViewer({ project: viewer.project, shot })}
          onClose={closeViewer}
        />
      )}
    </Section>
  )
}
