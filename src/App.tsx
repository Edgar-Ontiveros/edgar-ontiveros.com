import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { useLanguage } from './hooks/useLanguage'
import { useTheme } from './hooks/useTheme'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Education } from './sections/Education'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Research } from './sections/Research'
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
        <Experience content={content} />
        <Projects content={content} />
        <Education content={content} />
        <Research content={content} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
    </>
  )
}

export default App
