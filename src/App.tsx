import { Header } from './components/Header'
import { useLanguage } from './hooks/useLanguage'
import { useTheme } from './hooks/useTheme'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Education } from './sections/Education'
import { Hero } from './sections/Hero'
import { Stack } from './sections/Stack'

function App() {
  const { content, toggleLanguage } = useLanguage()
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
        <Hero content={content} />
        <About content={content} />
        <Stack content={content} theme={theme} />
        {/* Secciones aún vacías: existen para que las anclas de la nav no queden rotas.
            tabIndex -1: al navegar a un ancla el foco aterriza en la sección. */}
        <section id="experience" tabIndex={-1} className="scroll-mt-16 outline-none" />
        <section id="projects" tabIndex={-1} className="scroll-mt-16 outline-none" />
        <Education content={content} />
        <section id="research" tabIndex={-1} className="scroll-mt-16 outline-none" />
        <Contact content={content} />
      </main>
    </>
  )
}

export default App
