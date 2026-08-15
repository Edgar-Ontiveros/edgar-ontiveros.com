import { useEffect, useMemo, useState } from 'react'
import { Section, revealStaggerClasses } from '../components/Section'
import { TechIcon } from '../components/TechIcon'
import { STACK_CATEGORIES } from '../content/stack'
import type { SiteContent } from '../content/types'
import type { Theme } from '../hooks/useTheme'
import { ensureContrast } from '../lib/brandColor'
import { BRAND_ICONS } from '../lib/techIcons'

interface StackProps {
  content: SiteContent
  theme: Theme
}

function readSurfaceColor(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--surface').trim()
}

export function Stack({ content, theme }: StackProps) {
  const { stack } = content
  const [surfaceColor, setSurfaceColor] = useState(readSurfaceColor)

  // El token --surface cambia con el tema DESPUÉS del render (el efecto de
  // useTheme aplica data-theme en el commit): se relee en un rAF, que corre
  // tras la mutación del DOM.
  useEffect(() => {
    const id = requestAnimationFrame(() => setSurfaceColor(readSurfaceColor()))
    return () => cancelAnimationFrame(id)
  }, [theme])

  // Color de marca por tecnología, ajustado a contraste 3:1 (WCAG 1.4.11)
  // contra la superficie del tema actual.
  const brandColors = useMemo(() => {
    const colors: Record<string, string> = {}
    for (const category of STACK_CATEGORIES) {
      for (const tech of category.technologies) {
        const icon = BRAND_ICONS[tech]
        if (icon) {
          colors[tech] = ensureContrast(`#${icon.hex}`, surfaceColor)
        }
      }
    }
    return colors
  }, [surfaceColor])

  // El brillo de hover depende del tema: aclarar sube el contraste sobre
  // fondo oscuro pero lo BAJA sobre claro (rompería el 3:1 de ensureContrast),
  // así que en claro se oscurece ligeramente.
  const hoverBrightness =
    theme === 'dark' ? 'group-hover:brightness-110' : 'group-hover:brightness-95'

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
                    className={`flex h-full flex-col items-center justify-start gap-2.5 p-2 pt-3 text-center ${revealStaggerClasses}`}
                  >
                    <TechIcon
                      name={tech}
                      color={brandColors[tech]}
                      className={`h-9 w-9 transition-[transform,filter] duration-200 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${hoverBrightness}`}
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
