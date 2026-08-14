import { useLanguage } from './hooks/useLanguage'
import { useTheme } from './hooks/useTheme'

const buttonClasses =
  'rounded-md border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-foreground'

// Placeholder temporal para verificar tokens, fuentes, tema e idioma.
// Se reemplaza cuando se construyan las secciones reales del sitio.
function App() {
  const { language, content, toggleLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
          {content.hero.name}
        </h1>
        <p className="font-mono text-lg text-accent sm:text-xl">{content.hero.tagline}</p>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={toggleTheme} className={buttonClasses}>
          {theme === 'dark' ? content.ui.themeToggle.toLight : content.ui.themeToggle.toDark}
        </button>
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={content.ui.languageToggle.label}
          lang={language === 'en' ? 'es' : 'en'}
          className={`${buttonClasses} font-mono`}
        >
          {content.ui.languageToggle.code}
        </button>
      </div>
    </main>
  )
}

export default App
