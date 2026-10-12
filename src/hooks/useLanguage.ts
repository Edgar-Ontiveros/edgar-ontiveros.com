import { useCallback, useEffect, useState } from 'react'
import { content } from '../content'
import type { Language, SiteContent } from '../content/types'

/**
 * Idioma EN/ES: cada visita arranca SIEMPRE en inglés (sin detección del
 * navegador ni persistencia); el toggle cambia a español solo durante la
 * visita. <html lang> parte de "en" (index.html) y se sincroniza al cambiar.
 */
export function useLanguage() {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === 'en' ? 'es' : 'en'))
  }, [])

  const siteContent: SiteContent = content[language]

  return { language, content: siteContent, setLanguage, toggleLanguage }
}
