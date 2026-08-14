import { Header } from './components/Header'
import { SECTION_IDS } from './content/types'
import { useLanguage } from './hooks/useLanguage'
import { useTheme } from './hooks/useTheme'
import { Hero } from './sections/Hero'

function App() {
  const { language, content, toggleLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <Header
        content={content}
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleLanguage={toggleLanguage}
      />
      <main id="content" tabIndex={-1} className="outline-none">
        {/* key: remonta el hero al cambiar de idioma para que el typewriter reinicie. */}
        <Hero key={language} content={content} />
        {/* Secciones aún vacías: existen para que las anclas de la nav no queden rotas.
            tabIndex -1: al navegar a un ancla el foco aterriza en la sección. */}
        {SECTION_IDS.map((id) => (
          <section key={id} id={id} tabIndex={-1} className="scroll-mt-16 outline-none" />
        ))}
      </main>
    </>
  )
}

export default App
