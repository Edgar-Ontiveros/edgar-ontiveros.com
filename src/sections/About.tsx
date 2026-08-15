import { Section } from '../components/Section'
import { site } from '../content/site'
import type { SiteContent } from '../content/types'

interface AboutProps {
  content: SiteContent
}

export function About({ content }: AboutProps) {
  const { about } = content

  return (
    <Section id="about" number="01" title={content.nav.labels.about}>
      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        {/* Foto con marco sutil de nodos (motivo de la constelación). */}
        <div className="relative mx-auto w-full max-w-xs md:mx-0 md:max-w-sm">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 rounded-lg border border-border"
          >
            <span className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-accent" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent/50" />
            <span className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-accent/50" />
            <span className="absolute -right-1 -bottom-1 h-2 w-2 rounded-full bg-accent" />
          </div>
          <img
            src={site.aboutPhoto}
            alt={about.photoAlt}
            width={768}
            height={1152}
            loading="lazy"
            className="aspect-2/3 w-full rounded-lg object-cover"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex max-w-prose flex-col gap-4">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-muted sm:text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          <ul role="list" className="mt-2 flex flex-wrap gap-3">
            {about.metrics.map((metric) => (
              <li
                key={metric.label}
                className="flex items-baseline gap-2 rounded-md border border-border bg-surface px-4 py-2"
              >
                <span className="font-mono text-lg font-semibold text-accent">{metric.value}</span>
                <span className="text-sm text-muted">{metric.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
