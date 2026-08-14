import { useEffect, useMemo, useState } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Escribe `text` una sola vez, carácter por carácter. Con
 * prefers-reduced-motion devuelve el texto completo de inmediato.
 *
 * El progreso vive en el estado del componente: para reiniciar el tipeo cuando
 * cambia el texto (p. ej. al cambiar de idioma), remonta el componente con
 * `key`.
 */
export function useTypewriter(text: string, speedMs = 55) {
  const [count, setCount] = useState(() =>
    window.matchMedia(REDUCED_MOTION_QUERY).matches ? Number.POSITIVE_INFINITY : 0,
  )
  const chars = useMemo(() => Array.from(text), [text])
  const done = count >= chars.length

  useEffect(() => {
    if (done) {
      return
    }
    const id = window.setInterval(() => setCount((current) => current + 1), speedMs)
    return () => window.clearInterval(id)
  }, [done, speedMs])

  return { display: chars.slice(0, Math.min(count, chars.length)).join(''), done }
}
