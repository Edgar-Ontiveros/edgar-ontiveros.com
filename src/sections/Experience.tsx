import { Section } from '../components/Section'
import { Timeline, TimelineItem } from '../components/Timeline'
import { site } from '../content/site'
import type { SiteContent } from '../content/types'

interface ExperienceProps {
  content: SiteContent
}

/** Monograma de fallback cuando no hay logo de la empresa: iniciales. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
}

export function Experience({ content }: ExperienceProps) {
  const { experience } = content

  return (
    <Section id="experience" number="03" title={content.nav.labels.experience}>
      <Timeline>
        {experience.roles.map((role, index) => (
          <TimelineItem
            key={role.id}
            index={index}
            logo={site.orgLogos[role.id]}
            monogram={initials(role.company)}
            subtitle={role.company}
            title={role.role}
            location={role.location}
            period={role.period}
            technologies={role.technologies}
          >
            {role.intro && (
              <p className="mt-4 text-sm text-muted italic sm:text-base">{role.intro}</p>
            )}
            <ul role="list" className="mt-4 flex flex-col gap-2.5">
              {role.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-3 text-sm leading-relaxed text-muted sm:text-base"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </TimelineItem>
        ))}
      </Timeline>
    </Section>
  )
}
