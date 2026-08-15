import { useEffect, useRef, useState } from 'react'
import { Lightbox } from '../components/Lightbox'
import type { LightboxItem } from '../components/Lightbox'
import { GitHubIcon } from '../components/icons'
import { Section, revealStaggerClasses } from '../components/Section'
import { TechIcon } from '../components/TechIcon'
import { showsChipIcon } from '../lib/chipIcon'
import { PROJECTS } from '../content/projects'
import type { SiteContent } from '../content/types'

interface ProjectsProps {
  content: SiteContent
}

/** "PostgreSQL 17" → "PostgreSQL": el chip muestra la versión del doc, pero
    el icono se resuelve por el nombre base de la marca. */
const iconName = (tech: string) => tech.replace(/\s+\d+$/, '')

export function Projects({ content }: ProjectsProps) {
  const { projects } = content
  /** Visor abierto: proyecto + captura dentro de su serie. */
  const [viewer, setViewer] = useState<{ project: number; shot: number } | null>(null)
  const openedFrom = useRef<number | null>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])

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
          return (
            <li key={project.id} className="h-full">
              <article
                style={{ transitionDelay: `${80 + index * 60}ms` }}
                className={`flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface ${revealStaggerClasses}`}
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
                  {/* Proporción fija ~2:1 (la de las capturas) + object-cover:
                      la retícula queda pareja sin deformar la imagen. El alt
                      descriptivo vive en el visor, donde la imagen se ve
                      completa; aquí el aria-label del botón nombra la acción. */}
                  <img
                    src={project.screenshots[0].thumb}
                    alt=""
                    width={project.screenshots[0].thumbWidth}
                    height={project.screenshots[0].thumbHeight}
                    loading="lazy"
                    className="aspect-2/1 w-full bg-background object-cover transition-opacity duration-200 group-hover:opacity-85 motion-reduce:transition-none"
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
                        className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent motion-reduce:transition-none"
                      >
                        <GitHubIcon className="h-5 w-5" />
                        GitHub
                      </a>
                    </div>
                  )}
                </div>
              </article>
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
