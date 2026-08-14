import { ChevronDownIcon, GitHubIcon, LinkedInIcon } from '../components/icons'
import { site } from '../content/site'
import type { SiteContent } from '../content/types'
import { useTypewriter } from '../hooks/useTypewriter'

interface HeroProps {
  content: SiteContent
}

const socialClasses = 'rounded-md p-2 text-muted transition-colors hover:text-accent'

export function Hero({ content }: HeroProps) {
  const { hero } = content
  const { display } = useTypewriter(hero.tagline)

  return (
    <section className="relative flex min-h-svh flex-col justify-center">
      {/* Aquí se monta el canvas del grafo-constelación (tarea posterior); el fondo queda en --bg. */}
      <div id="constellation-container" aria-hidden="true" className="absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-6xl px-4 pt-16 sm:px-6">
        <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
          <p className="font-mono text-xs tracking-[0.2em] text-muted sm:text-sm">{hero.eyebrow}</p>
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {hero.name}
          </h1>

          {/* La capa invisible reserva la altura final del texto completo para
              que el tipeo no cause layout shift; la animación queda oculta a
              lectores de pantalla, que reciben el texto completo. */}
          <p className="w-full font-mono text-lg text-accent sm:text-xl">
            <span className="sr-only">{hero.tagline}</span>
            <span aria-hidden="true" className="relative block">
              {/* La capa de medida incluye un espaciador del tamaño del cursor
                  para que la reserva y el contenido final midan lo mismo. */}
              <span className="invisible">
                {hero.tagline}
                <span className="ml-1 inline-block h-[1.1em] w-[0.5ch] translate-y-[0.2em]" />
              </span>
              <span className="absolute inset-0">
                {display}
                <span className="animate-blink ml-1 inline-block h-[1.1em] w-[0.5ch] translate-y-[0.2em] bg-accent-2 motion-reduce:animate-none" />
              </span>
            </span>
          </p>

          <p className="max-w-xl text-base text-muted sm:text-lg">{hero.valueProp}</p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <a
              href="#contact"
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent/85"
            >
              {hero.ctaContact}
            </a>
            <a
              href={site.cvPdf}
              download
              className="rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent"
            >
              {hero.ctaDownloadCv}
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={hero.githubLabel}
              className={socialClasses}
            >
              <GitHubIcon className="h-6 w-6" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={hero.linkedinLabel}
              className={socialClasses}
            >
              <LinkedInIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted motion-safe:animate-bounce"
      >
        <ChevronDownIcon className="h-5 w-5" />
      </div>
    </section>
  )
}
