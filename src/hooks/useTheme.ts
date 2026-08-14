import { useCallback, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

/** 'system' = sin elección manual: el tema lo decide prefers-color-scheme. */
type ThemePreference = Theme | 'system'

const STORAGE_KEY = 'theme'
const LIGHT_QUERY = '(prefers-color-scheme: light)'

function readStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') {
      return stored
    }
  } catch {
    /* localStorage no disponible (modo privado, permisos) */
  }
  return 'system'
}

function readSystemTheme(): Theme {
  return window.matchMedia(LIGHT_QUERY).matches ? 'light' : 'dark'
}

/**
 * Tema claro/oscuro: default sigue al sistema; la elección manual se aplica
 * como `data-theme` en <html> y se persiste en localStorage. El script inline
 * de index.html aplica el atributo antes del primer paint.
 */
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(readStoredPreference)
  const [systemTheme, setSystemTheme] = useState<Theme>(readSystemTheme)

  useEffect(() => {
    const query = window.matchMedia(LIGHT_QUERY)
    const onChange = () => setSystemTheme(query.matches ? 'light' : 'dark')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (preference === 'system') {
      delete root.dataset.theme
    } else {
      root.dataset.theme = preference
    }
    try {
      if (preference === 'system') {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, preference)
      }
    } catch {
      /* localStorage no disponible: el tema aplica solo en esta sesión */
    }
  }, [preference])

  const theme: Theme = preference === 'system' ? systemTheme : preference

  const toggleTheme = useCallback(() => {
    setPreference(theme === 'dark' ? 'light' : 'dark')
  }, [theme])

  return { theme, toggleTheme }
}
