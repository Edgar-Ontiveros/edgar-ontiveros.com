import { site } from '../content/site'
import { SECTION_IDS } from '../content/types'
import type { SiteContent } from '../content/types'
import { GitHubIcon, LinkedInIcon, MailIcon, WhatsAppIcon } from './icons'

interface FooterProps {
  content: SiteContent
}

const iconLinkClasses =
  'rounded-md p-2 text-muted transition-colors hover:text-foreground motion-reduce:transition-none'

/** Pie de página: monograma, mini-nav de anclas, redes y copyright con el
    año en runtime. Vive fuera del <main> (landmark propio). */
export function Footer({ content }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:px-6">
        <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:justify-between">
          <a
            href="#content"
            className="font-mono text-lg font-semibold text-accent transition-colors hover:text-foreground motion-reduce:transition-none"
          >
            {site.monogram}
          </a>

          {/* Nombre accesible distinto al del header: dos <nav> con el mismo
              nombre se anunciarían como navegaciones idénticas. */}
          <nav aria-label={content.footer.navAriaLabel}>
            <ul role="list" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {SECTION_IDS.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="font-mono text-xs text-muted transition-colors hover:text-foreground motion-reduce:transition-none"
                  >
                    {content.nav.labels[id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={content.hero.githubLabel}
              className={iconLinkClasses}
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={content.hero.linkedinLabel}
              className={iconLinkClasses}
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
            <a
              href={`https://wa.me/${site.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={content.hero.whatsappLabel}
              className={iconLinkClasses}
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${site.email}`}
              aria-label={content.hero.emailLabel}
              className={iconLinkClasses}
            >
              <MailIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <p className="text-center font-mono text-xs text-muted">
          {/* El tagline va en su propio <span> (hijo único de texto): con un
              traductor de navegador activo, React repone hijos únicos vía
              textContent al cambiar de idioma; un nodo de texto suelto entre
              hermanos quedaría huérfano y se mostraría en el idioma viejo. */}
          © {year} {content.hero.name} · <span>{content.footer.tagline}</span>
        </p>
      </div>
    </footer>
  )
}
