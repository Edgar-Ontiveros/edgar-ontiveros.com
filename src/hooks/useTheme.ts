import { useCallback, useEffect, useRef, useState } from 'react'

export type Theme = 'dark' | 'light'

/** 'system' = sin elección manual: el tema lo decide prefers-color-scheme. */
type ThemePreference = Theme | 'system'

const STORAGE_KEY = 'theme'
const LIGHT_QUERY = '(prefers-color-scheme: light)'
/** Clase que habilita la transición de colores (index.css) solo mientras
    dura un cambio manual de tema: nunca en la carga inicial. */
const TRANSITION_CLASS = 'theme-transition'
const TRANSITION_MS = 200

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
  const transitionTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current)
        document.documentElement.classList.remove(TRANSITION_CLASS)
      }
    },
    [],
  )

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
    // La clase entra antes de que el efecto aplique data-theme y sale al
    // terminar la transición (con margen). prefers-reduced-motion la anula
    // por CSS.
    const root = document.documentElement
    root.classList.add(TRANSITION_CLASS)
    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current)
    }
    transitionTimer.current = window.setTimeout(() => {
      root.classList.remove(TRANSITION_CLASS)
      transitionTimer.current = null
    }, TRANSITION_MS + 50)
    setPreference(theme === 'dark' ? 'light' : 'dark')
  }, [theme])

  return { theme, toggleTheme }
}
