import { useEffect, useRef, useState } from 'react'
import { CertificateLightbox } from '../components/CertificateLightbox'
import { Section, revealStaggerClasses } from '../components/Section'
import { CERTIFICATIONS } from '../content/certifications'
import { site } from '../content/site'
import type { SiteContent } from '../content/types'

interface EducationProps {
  content: SiteContent
}

export function Education({ content }: EducationProps) {
  const { education } = content
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  /** Tarjeta que abrió el visor: el foco regresa ahí al cerrar. */
  const openedFrom = useRef<number | null>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])

  const openViewer = (index: number) => {
    openedFrom.current = index
    setViewerIndex(index)
  }
  const closeViewer = () => setViewerIndex(null)

  // La restauración de foco debe correr DESPUÉS del cleanup del visor (que
  // quita inert de #root): un focus() síncrono en el handler sería un no-op
  // porque la tarjeta aún está dentro del subárbol inert. Los cleanups del
  // hijo desmontado corren antes que este efecto en el mismo commit.
  useEffect(() => {
    if (viewerIndex === null && openedFrom.current !== null) {
      cardRefs.current[openedFrom.current]?.focus()
      openedFrom.current = null
    }
  }, [viewerIndex])

  return (
    <Section id="education" number="05" title={content.nav.labels.education}>
      {/* Línea de tiempo vertical: admite más entradas sin rehacerse. */}
      <ol role="list" className="relative ml-1 border-l border-border">
        {education.entries.map((entry, index) => {
          const logo = site.institutionLogos[entry.id]
          return (
            <li key={entry.id} className="relative pb-2 pl-5 sm:pl-8">
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
                    {/* El asset lleva placa blanca horneada: la tinta del sello
                        es casi negra y sería invisible sobre el fondo oscuro. */}
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
                      {logo ? (
                        <img
                          src={logo}
                          alt=""
                          width={256}
                          height={255}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="font-mono text-[0.6rem] font-semibold text-accent"
                        >
                          {entry.id.toUpperCase()}
                        </span>
                      )}
                    </span>
                    <div>
                      <p className="font-mono text-sm text-accent">{entry.institution}</p>
                      <h3 className="mt-1 font-display text-lg font-semibold sm:text-xl">
                        {entry.degree}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{entry.location}</p>
                    </div>
                  </div>
                  <span className="self-start rounded-full border border-border bg-background px-3 py-1 font-mono text-xs whitespace-nowrap text-muted">
                    {entry.period}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      <h3
        style={{ transitionDelay: '80ms' }}
        className={`mt-12 mb-5 font-display text-lg font-semibold ${revealStaggerClasses}`}
      >
        {education.certificationsTitle}
      </h3>
      <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATIONS.map((cert, index) => (
          <li key={cert.file} className="h-full">
            <button
              type="button"
              ref={(el) => {
                cardRefs.current[index] = el
              }}
              onClick={() => openViewer(index)}
              aria-haspopup="dialog"
              className="group flex h-full w-full flex-col rounded-lg border border-border bg-surface p-3 text-left transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span
                style={{ transitionDelay: `${140 + index * 35}ms` }}
                className={`flex h-full w-full flex-col ${revealStaggerClasses}`}
              >
                {/* Proporción fija + object-contain: Platzi y Udemy no comparten
                    proporción y ninguno debe recortarse. */}
                <span className="relative block aspect-4/3 w-full overflow-hidden rounded-md bg-background">
                  {/* alt vacío: dentro del botón el título y emisor ya son texto
                      visible (el alt descriptivo vive en la imagen del visor,
                      donde la imagen ES el contenido). */}
                  <img
                    src={cert.preview.thumb}
                    alt=""
                    width={cert.preview.thumbWidth}
                    height={cert.preview.thumbHeight}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </span>
                <span className="mt-3 block px-1 pb-1">
                  {/* lang: los títulos van en el idioma del certificado (español). */}
                  <span lang="es" className="block leading-snug font-medium">
                    {cert.title}
                  </span>
                  <span className="mt-1 block font-mono text-xs text-muted">
                    {cert.issuer} · {cert.year}
                  </span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {viewerIndex !== null && (
        <CertificateLightbox
          index={viewerIndex}
          content={content}
          onNavigate={setViewerIndex}
          onClose={closeViewer}
        />
      )}
    </Section>
  )
}
