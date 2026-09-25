import { useCallback, useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'

/**
 * Spotlight de tarjetas: devuelve un handler de mousemove que publica la
 * posición del cursor relativa a la tarjeta en las variables CSS --mx/--my
 * del elemento (la capa .spotlight las lee). La escritura va en un
 * requestAnimationFrame, uno por frame como máximo. La visibilidad del
 * efecto la decide solo el CSS (cursor fino + hover + sin reduced-motion).
 */
export function useSpotlight() {
  const frame = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current)
      }
    },
    [],
  )

  return useCallback((event: MouseEvent<HTMLElement>) => {
    const host = event.currentTarget
    const rect = host.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current)
    }
    frame.current = requestAnimationFrame(() => {
      host.style.setProperty('--mx', `${x}px`)
      host.style.setProperty('--my', `${y}px`)
      frame.current = null
    })
  }, [])
}
