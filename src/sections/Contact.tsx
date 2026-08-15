import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from '../components/icons'
import { site } from '../content/site'
import type { SiteContent } from '../content/types'

interface ContactProps {
  content: SiteContent
}

const buttonClasses =
  'inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent'

export function Contact({ content }: ContactProps) {
  const { contact } = content

  return (
    <section id="contact" tabIndex={-1} className="scroll-mt-16 outline-none">
      <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {content.nav.labels.contact}
          </h2>
          <p className="max-w-xl text-base text-muted sm:text-lg">{contact.blurb}</p>
          <a
            href={`mailto:${site.email}`}
            className="font-display text-xl font-semibold break-all text-accent transition-colors hover:text-foreground sm:text-4xl"
          >
            {site.email}
          </a>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses}
            >
              <LinkedInIcon className="h-5 w-5" />
              {contact.linkedin}
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses}
            >
              <GitHubIcon className="h-5 w-5" />
              {contact.github}
            </a>
            <a
              href={`https://wa.me/${site.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses}
            >
              <WhatsAppIcon className="h-5 w-5" />
              {contact.whatsapp}
            </a>
            <a href={site.cvPdf} download className={buttonClasses}>
              {content.hero.ctaDownloadCv}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
