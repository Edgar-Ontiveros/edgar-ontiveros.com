import { Section, revealStaggerClasses } from '../components/Section'
import { TechIcon } from '../components/TechIcon'
import { STACK_CATEGORIES } from '../content/stack'
import type { SiteContent } from '../content/types'

interface StackProps {
  content: SiteContent
}

export function Stack({ content }: StackProps) {
  const { stack } = content

  return (
    <Section id="stack" number="02" title={content.nav.labels.stack}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STACK_CATEGORIES.map((category, cardIndex) => (
          <div
            key={category.id}
            style={{ transitionDelay: `${cardIndex * 70}ms` }}
            className={`rounded-lg border border-border bg-surface p-4 sm:p-5 ${revealStaggerClasses}`}
          >
            <h3 className="mb-4 font-display text-base font-semibold">
              {stack.categories[category.id]}
            </h3>
            <ul role="list" className="grid grid-cols-3 gap-2">
              {category.technologies.map((tech, cellIndex) => (
                <li
                  key={tech}
                  className="group rounded-lg border border-border transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div
                    style={{ transitionDelay: `${cardIndex * 70 + 120 + cellIndex * 35}ms` }}
                    className={`flex h-full flex-col items-center justify-start gap-2 p-2 text-center ${revealStaggerClasses}`}
                  >
                    <TechIcon
                      name={tech}
                      className="h-7 w-7 text-muted opacity-80 transition-[color,opacity] duration-200 group-hover:text-accent group-hover:opacity-100"
                    />
                    <span className="font-mono text-[11px] leading-tight wrap-anywhere text-muted transition-colors duration-200 group-hover:text-foreground">
                      {tech}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
