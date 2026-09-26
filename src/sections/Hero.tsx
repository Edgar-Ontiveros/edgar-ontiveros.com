import { Component, useRef, type ReactNode } from 'react'
import { Constellation } from '../components/Constellation'
import {
  ChevronDownIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  WhatsAppIcon,
} from '../components/icons'
import { CONSTELLATION_TECHNOLOGIES } from '../content/constellation'
import { site } from '../content/site'
import type { SiteContent } from '../content/types'
import { useTypewriter } from '../hooks/useTypewriter'
import { liftClasses } from '../lib/motion'

interface HeroProps {
  content: SiteContent
}

const socialClasses = 'rounded-md p-2 text-muted transition-colors hover:text-accent'

/* Subtítulo con typewriter rotativo. La capa invisible reserva la altura
   del título más largo (incluido el ancho del cursor) para que el tipeo y el
   borrado no causen layout shift. La animación queda oculta a lectores de
   pantalla (aria-hidden) y el <p> expone un aria-label ESTABLE con los tres
   títulos, sin aria-live: nada se anuncia en cada cambio.

   translate="no" en la capa animada: los traductores de navegador (Google
   Translate) reemplazan los nodos de texto por <font>, dejando huérfano el
   nodo que React sigue actualizando — el tipeo se congela a media palabra.
   Los <span> que envuelven {display} y {longest} son defensa adicional para
   traductores que ignoren translate="no": con el texto como hijo único,
   React repone el contenido vía textContent y se auto-repara. */
function TypewriterLine({ titles }: { titles: string[] }) {
  const { display } = useTypewriter(titles)
  const longest = titles.reduce((a, b) => (Array.from(b).length > Array.from(a).length ? b : a), '')

  return (
    <p className="font-mono text-lg text-accent sm:text-xl" aria-label={titles.join(' · ')}>
      <span aria-hidden="true" translate="no" className="relative block">
        <span className="invisible">
          <span>{longest}</span>
          <span className="ml-1 inline-block h-[1.1em] w-[0.5ch] translate-y-[0.2em]" />
        </span>
        <span className="absolute inset-0">
          <span>{display}</span>
          {/* Cursor: parpadea siempre durante el ciclo; con reduced-motion
              queda fijo. */}
          <span className="animate-blink ml-1 inline-block h-[1.1em] w-[0.5ch] translate-y-[0.2em] bg-accent-2 motion-reduce:animate-none" />
        </span>
      </span>
    </p>
  )
}

/* Red de seguridad: si un traductor (u otra extensión que mute el DOM) hace
   crashear la animación en fase de commit, se muestran los títulos completos
   estáticos en vez de dejar el hero congelado o desmontar el árbol entero
   (el sitio no tiene ningún otro error boundary). El remonte por key al
   cambiar de idioma también resetea el estado de error. */
class TypewriterBoundary extends Component<
  { titles: string[]; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="font-mono text-lg text-accent sm:text-xl">{this.props.titles.join(' · ')}</p>
      )
    }
    return this.props.children
  }
}

export function Hero({ content }: HeroProps) {
  const { hero } = content
  const sectionRef = useRef<HTMLElement>(null)
  const textBlockRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={sectionRef} className="relative flex min-h-svh flex-col justify-center">
      <div
        id="constellation-container"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <Constellation hostRef={sectionRef} textRef={textBlockRef} />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pt-16 sm:px-6">
        <div
          ref={textBlockRef}
          className="relative flex flex-col items-center gap-5 text-center md:items-start md:text-left"
        >
          {/* Resplandor decorativo: -z-10 lo manda detrás del texto pero, por
              orden en el DOM, delante del contenedor de la constelación
              (también -z-10 y anterior). */}
          <div
            aria-hidden="true"
            className="hero-glow pointer-events-none absolute -inset-x-24 -inset-y-16 -z-10"
          />
          <p className="font-mono text-xs tracking-[0.2em] text-muted sm:text-sm">{hero.eyebrow}</p>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {hero.name}
          </h1>

          {/* key: reinicia el ciclo cuando cambian los títulos (p. ej. al cambiar de idioma). */}
          <TypewriterBoundary key={hero.taglines.join('|')} titles={hero.taglines}>
            <TypewriterLine titles={hero.taglines} />
          </TypewriterBoundary>

          <p className="max-w-xl text-base text-muted sm:text-lg">{hero.valueProp}</p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <a
              href="#contact"
              className={`rounded-md border border-accent bg-accent px-5 py-2.5 text-sm font-medium text-background hover:bg-accent/85 ${liftClasses}`}
            >
              {hero.ctaContact}
            </a>
            <a
              href={site.cvPdf}
              download
              className={`rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium ${liftClasses}`}
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
            <a
              href={`https://wa.me/${site.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={hero.whatsappLabel}
              className={socialClasses}
            >
              <WhatsAppIcon className="h-6 w-6" />
            </a>
            <a href={`mailto:${site.email}`} aria-label={hero.emailLabel} className={socialClasses}>
              <MailIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      {/* El canvas es decorativo (aria-hidden), pero revela en hover/tap un
          vocabulario MÁS AMPLIO que la sección #stack (fuente curada con
          niveles): esta lista sr-only mantiene la paridad textual de ese
          superconjunto. role="list" explícito porque el preflight pone
          list-style:none y Safari/VoiceOver quitaría el rol. */}
      <ul role="list" aria-label={hero.constellationLabel} className="sr-only">
        {CONSTELLATION_TECHNOLOGIES.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted motion-safe:animate-bounce"
      >
        <ChevronDownIcon className="h-5 w-5" />
      </div>
    </section>
  )
}
