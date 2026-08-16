import { useEffect, useRef, useState } from 'react'
import { site } from '../content/site'
import { SECTION_IDS } from '../content/types'
import type { SiteContent } from '../content/types'
import { useActiveSection } from '../hooks/useActiveSection'
import type { Theme } from '../hooks/useTheme'
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './icons'

interface HeaderProps {
  content: SiteContent
  theme: Theme
  onToggleTheme: () => void
  onToggleLanguage: () => void
}

const controlClasses = 'rounded-md p-2 text-muted transition-colors hover:text-foreground'

export function Header({ content, theme, onToggleTheme, onToggleLanguage }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const activeId = useActiveSection(SECTION_IDS)
  const { nav, ui } = content

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menú móvil abierto: cierra con Esc, bloquea el scroll del body y deja el
  // contenido principal inerte para que el foco no escape al contenido tapado.
  // Si el viewport cruza a >=768px (rotación, resize), el overlay y la
  // hamburguesa desaparecen por CSS: hay que cerrar el menú para no dejar la
  // página bloqueada sin ningún control visible.
  useEffect(() => {
    if (!menuOpen) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    const desktopQuery = window.matchMedia('(min-width: 768px)')
    const onBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    desktopQuery.addEventListener('change', onBreakpointChange)
    document.body.style.overflow = 'hidden'
    const main = document.getElementById('content')
    main?.setAttribute('inert', '')
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      desktopQuery.removeEventListener('change', onBreakpointChange)
      document.body.style.overflow = ''
      main?.removeAttribute('inert')
    }
  }, [menuOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors ${
        scrolled || menuOpen
          ? 'border-border bg-background/80 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      }`}
    >
      <a
        href="#content"
        onClick={() => setMenuOpen(false)}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-4 focus:py-2"
      >
        {ui.skipToContent}
      </a>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          onClick={() => setMenuOpen(false)}
          className="font-mono text-lg font-bold text-accent"
        >
          {site.monogram}
        </a>

        <nav aria-label={nav.ariaLabel} className="hidden md:block">
          <ul className="flex items-center gap-6">
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={activeId === id ? 'true' : undefined}
                  className={`text-sm transition-colors hover:text-foreground ${
                    activeId === id ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {nav.labels[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleLanguage}
            aria-label={ui.languageToggle.label}
            lang={ui.languageToggle.code.toLowerCase()}
            translate="no"
            className={`${controlClasses} font-mono text-sm`}
          >
            {ui.languageToggle.code}
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? ui.themeToggle.toLight : ui.themeToggle.toDark}
            className={controlClasses}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? ui.menu.close : ui.menu.open}
            className={`${controlClasses} md:hidden`}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-16 z-30 overflow-y-auto overscroll-contain bg-background md:hidden"
        >
          <nav aria-label={nav.ariaLabel}>
            <ul className="flex flex-col items-center gap-8 py-16">
              {SECTION_IDS.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={activeId === id ? 'true' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`font-display text-2xl font-medium transition-colors ${
                      activeId === id ? 'text-accent' : 'text-foreground'
                    }`}
                  >
                    {nav.labels[id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
