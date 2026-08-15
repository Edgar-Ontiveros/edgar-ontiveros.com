import { Section } from '../components/Section'
import { STACK_CATEGORIES } from '../content/stack'
import type { StackLevel } from '../content/stack'
import type { SiteContent } from '../content/types'

interface StackProps {
  content: SiteContent
}

// Cada nivel se distingue por color Y por forma (WCAG 1.4.1: el color no puede
// ser el único medio): diario = punto relleno, sólido = anillo, aprendiendo = rombo.
const levelMarkerClasses: Record<StackLevel, string> = {
  daily: 'rounded-full bg-accent',
  solid: 'rounded-full border-[1.5px] border-muted',
  learning: 'rotate-45 bg-accent-2',
}

const LEVEL_ORDER: StackLevel[] = ['daily', 'solid', 'learning']

export function Stack({ content }: StackProps) {
  const { stack } = content
  const usedLevels = LEVEL_ORDER.filter((level) =>
    STACK_CATEGORIES.some((category) => category.technologies.some((tech) => tech.level === level)),
  )

  return (
    <Section id="stack" number="02" title={content.nav.labels.stack}>
      <ul
        role="list"
        aria-label={stack.legendLabel}
        className="mb-8 flex flex-wrap gap-x-6 gap-y-2"
      >
        {usedLevels.map((level) => (
          <li key={level} className="flex items-center gap-2 font-mono text-sm text-muted">
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 shrink-0 ${levelMarkerClasses[level]}`}
            />
            {stack.levels[level]}
          </li>
        ))}
      </ul>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STACK_CATEGORIES.map((category) => (
          <div key={category.id} className="rounded-lg border border-border bg-surface p-5">
            <h3 className="mb-4 font-display text-base font-semibold">
              {stack.categories[category.id]}
            </h3>
            <ul role="list" className="flex flex-wrap gap-2">
              {category.technologies.map((tech) => (
                <li
                  key={tech.name}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
                >
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 shrink-0 ${levelMarkerClasses[tech.level]}`}
                  />
                  {tech.name}
                  <span className="sr-only">({stack.levels[tech.level]})</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
