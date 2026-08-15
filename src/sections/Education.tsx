import { ExternalLinkIcon } from '../components/icons'
import { Section, revealStaggerClasses } from '../components/Section'
import { CERTIFICATIONS } from '../content/certifications'
import type { SiteContent } from '../content/types'

interface EducationProps {
  content: SiteContent
}

export function Education({ content }: EducationProps) {
  const { education } = content

  return (
    <Section id="education" number="05" title={content.nav.labels.education}>
      <div
        className={`rounded-lg border border-border bg-surface p-5 sm:p-6 ${revealStaggerClasses}`}
      >
        <h3 className="font-display text-lg font-semibold">{education.degree}</h3>
        <p className="mt-1 text-muted">
          {education.institution} · <span className="font-mono text-sm">{education.period}</span>
        </p>
        <p className="mt-2 text-sm text-muted">{education.detail}</p>
      </div>

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
