import { useEffect, useMemo, useState } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Escribe `text` una sola vez, carácter por carácter. Con
 * prefers-reduced-motion devuelve el texto completo de inmediato.
 *
 * El progreso se deriva del tiempo transcurrido desde el inicio, no de contar
 * ticks: si el navegador throttlea o pierde ticks del intervalo (pestaña en
 * segundo plano, ahorro de energía), el siguiente tick que sí llegue calcula
 * cuántos caracteres corresponden al elapsed y se pone al día solo.
 *
 * El estado vive en el componente: para reiniciar el tipeo cuando cambia el
 * texto (p. ej. al cambiar de idioma), remonta el componente con `key`.
 */
export function useTypewriter(text: string, speedMs = 55) {
  const chars = useMemo(() => Array.from(text), [text])
  const [count, setCount] = useState(() =>
    window.matchMedia(REDUCED_MOTION_QUERY).matches ? chars.length : 0,
  )
  const done = count >= chars.length

  useEffect(() => {
    if (done) {
      return
    }
    const startedAt = performance.now()
    const id = window.setInterval(() => {
      const elapsed = performance.now() - startedAt
      const target = Math.min(chars.length, Math.floor(elapsed / speedMs))
      // Monotónico: nunca retrocede (p. ej. tras el doble montaje de StrictMode).
      setCount((current) => (target > current ? target : current))
    }, speedMs)
    return () => window.clearInterval(id)
  }, [done, chars, speedMs])

  return { display: chars.slice(0, Math.min(count, chars.length)).join(''), done }
}
