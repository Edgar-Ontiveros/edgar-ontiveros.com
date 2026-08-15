import { useEffect, useRef, useState } from 'react'
import { Lightbox } from '../components/Lightbox'
import type { LightboxItem } from '../components/Lightbox'
import { Section, revealStaggerClasses } from '../components/Section'
import { RESEARCH_PROJECTS } from '../content/research'
import type { SiteContent } from '../content/types'

interface ResearchProps {
  content: SiteContent
}

export function Research({ content }: ResearchProps) {
  const { research } = content
  /** Visor abierto: trabajo + posición dentro de su material. */
  const [viewer, setViewer] = useState<{ project: number; media: number } | null>(null)
  /** Botón que abrió el visor (imagen principal o miniatura de evidencia):
      el foco regresa ahí al cerrar, tras el cleanup del visor (mismo patrón
      que la galería de certificados). */
  const openedFrom = useRef<string | null>(null)
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const openViewer = (project: number, media: number) => {
    openedFrom.current = `${project}-${media}`
    setViewer({ project, media })
  }
  const closeViewer = () => setViewer(null)

  useEffect(() => {
    if (viewer === null && openedFrom.current !== null) {
      buttonRefs.current[openedFrom.current]?.focus()
      openedFrom.current = null
    }
  }, [viewer])

  const openProject = viewer !== null ? RESEARCH_PROJECTS[viewer.project] : null
  const openTexts = openProject ? research.items[openProject.id] : null

  return (
    <Section id="research" number="06" title={content.nav.labels.research}>
      <ul role="list" className="flex flex-col gap-6">
        {RESEARCH_PROJECTS.map((project, index) => {
          const texts = research.items[project.id]
          const main = project.media[0]
          const mainText = texts.media[0]
          const evidence = project.media.slice(1)
          return (
            <li key={project.id}>
              <article
                style={{ transitionDelay: `${80 + index * 60}ms` }}
                className={`flex flex-col gap-6 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:p-6 ${revealStaggerClasses}`}
              >
                {/* En móvil el texto va primero y el material gráfico después,
                    como evidencia; en sm+ la imagen queda a la izquierda (doc). */}
                <div className="order-first shrink-0 sm:order-none sm:w-60 lg:w-72">
                  <button
                    type="button"
                    ref={(el) => {
                      buttonRefs.current[`${index}-0`] = el
                    }}
                    onClick={() => openViewer(index, 0)}
                    aria-haspopup="dialog"
                    aria-label={`${mainText.label} — ${texts.title}`}
                    className="group block w-full overflow-hidden rounded-md border border-border bg-background transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    {/* Fotos: recorte cover a proporción fija; documentos
                        (pósters): contain, se asoman completos. El alt
                        descriptivo vive en el visor. */}
                    <img
                      src={main.thumb}
                      alt=""
                      width={main.thumbWidth}
                      height={main.thumbHeight}
                      loading="lazy"
                      className={
                        main.kind === 'photo'
                          ? 'aspect-4/3 w-full object-cover'
                          : 'aspect-4/3 w-full object-contain p-2 sm:aspect-3/4'
                      }
                    />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold sm:text-xl">{texts.title}</h3>
                  <p className="mt-1 font-mono text-xs text-accent sm:text-sm">{texts.event}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {texts.description}
                  </p>
                  <ul role="list" className="mt-4 flex flex-wrap gap-2">
                    {texts.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  {evidence.length > 0 && (
                    <ul role="list" className="mt-5 flex flex-wrap gap-4">
                      {evidence.map((item, evidenceIndex) => {
                        const mediaIndex = evidenceIndex + 1
                        const itemText = texts.media[mediaIndex]
                        return (
                          <li key={item.thumb}>
                            <button
                              type="button"
                              ref={(el) => {
                                buttonRefs.current[`${index}-${mediaIndex}`] = el
                              }}
                              onClick={() => openViewer(index, mediaIndex)}
                              aria-haspopup="dialog"
                              aria-label={`${itemText.label} — ${texts.title}`}
                              className="group block w-24 text-left sm:w-28"
                            >
                              <span className="block overflow-hidden rounded-md border border-border bg-background transition-[transform,border-color] duration-200 group-hover:-translate-y-0.5 group-hover:border-accent motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                                <img
                                  src={item.thumb}
                                  alt=""
                                  width={item.thumbWidth}
                                  height={item.thumbHeight}
                                  loading="lazy"
                                  className="aspect-4/3 w-full object-contain p-1"
                                />
                              </span>
                              <span className="mt-1.5 block font-mono text-xs text-muted">
                                {itemText.label}
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </article>
            </li>
          )
        })}
      </ul>

      {viewer !== null && openProject && openTexts && (
        <Lightbox
          items={openProject.media.map((item, mediaIndex): LightboxItem => ({
            src: item.large,
            width: item.largeWidth,
            height: item.largeHeight,
            alt: openTexts.media[mediaIndex]?.alt ?? openTexts.title,
            title: openTexts.media[mediaIndex]?.title ?? openTexts.title,
            titleLang: openTexts.media[mediaIndex]?.titleLang,
            subtitle: openTexts.media[mediaIndex]?.subtitle,
          }))}
          index={viewer.media}
          labels={content.ui.lightbox}
          onNavigate={(media) => setViewer({ project: viewer.project, media })}
          onClose={closeViewer}
        />
      )}
    </Section>
  )
}
