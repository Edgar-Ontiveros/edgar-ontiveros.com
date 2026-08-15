import { ExternalLinkIcon } from '../components/icons'
import { Section, revealStaggerClasses } from '../components/Section'
import { CERTIFICATIONS } from '../content/certifications'
import { site } from '../content/site'
import type { SiteContent } from '../content/types'

interface EducationProps {
  content: SiteContent
}

export function Education({ content }: EducationProps) {
  const { education } = content

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
      <ul role="list" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATIONS.map((cert, index) => (
          <li key={cert.file} className="h-full">
            <a
              href={`/certificaciones/${cert.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span
                style={{ transitionDelay: `${140 + index * 35}ms` }}
                className={`flex h-full flex-col gap-3 ${revealStaggerClasses}`}
              >
                <span className="flex items-start justify-between gap-3">
                  {/* lang: los títulos van en el idioma del certificado (español). */}
                  <span lang="es" className="leading-snug font-medium">
                    {cert.title}
                  </span>
                  <ExternalLinkIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted transition-colors duration-200 group-hover:text-accent" />
                </span>
                <span className="mt-auto font-mono text-xs text-muted">
                  {cert.issuer} · {cert.year}
                </span>
                <span className="sr-only">({education.opensPdf})</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
