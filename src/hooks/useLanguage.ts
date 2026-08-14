import { useCallback, useEffect, useState } from 'react'
import { content } from '../content'
import type { Language, SiteContent } from '../content/types'

const STORAGE_KEY = 'lang'

function detectLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'es') {
      return stored
    }
  } catch {
    /* localStorage no disponible (modo privado, permisos) */
  }
  return /^es(-|$)/i.test(navigator.language) ? 'es' : 'en'
}

/**
 * Idioma EN/ES: auto-detección con navigator.language, elección manual
 * persistida en localStorage y <html lang> siempre sincronizado. El script
 * inline de index.html aplica `lang` antes del primer paint.
 */
export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(detectLanguage)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    try {
      // Solo la elección manual se persiste; la auto-detección no.
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* localStorage no disponible: el idioma aplica solo en esta sesión */
    }
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'es' : 'en')
  }, [language, setLanguage])

  const siteContent: SiteContent = content[language]

  return { language, content: siteContent, setLanguage, toggleLanguage }
}
