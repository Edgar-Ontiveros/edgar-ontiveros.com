import { useEffect, useMemo, useState } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
/** Resolución del reloj (ms): la fase más rápida es el borrado a 40 ms. */
const TICK_MS = 40

export interface TypewriterTiming {
  /** ms por carácter al escribir. */
  typeMs: number
  /** Pausa con la frase completa. */
  holdMs: number
  /** ms por carácter al borrar. */
  deleteMs: number
  /** Pausa con la línea vacía antes del siguiente título. */
  gapMs: number
}

export const DEFAULT_TYPEWRITER_TIMING: TypewriterTiming = {
  typeMs: 75,
  holdMs: 2200,
  deleteMs: 40,
  gapMs: 400,
}

interface Segment {
  chars: string[]
  typeMs: number
  holdEnd: number
  deleteEnd: number
  end: number
}

interface Frame {
  index: number
  count: number
}

/** Estado (título y caracteres visibles) para un instante `t` del ciclo. */
function resolve(segments: Segment[], timing: TypewriterTiming, t: number): Frame {
  let offset = 0
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index]
    const local = t - offset
    if (local < segment.end) {
      const length = segment.chars.length
      if (local < segment.typeMs) {
        return { index, count: Math.min(length, Math.floor(local / timing.typeMs)) }
      }
      if (local < segment.holdEnd) {
        return { index, count: length }
      }
      if (local < segment.deleteEnd) {
        const deleted = Math.floor((local - segment.holdEnd) / timing.deleteMs)
        return { index, count: Math.max(0, length - deleted) }
      }
      return { index, count: 0 }
    }
    offset += segment.end
  }
  return { index: 0, count: 0 }
}

/**
 * Typewriter rotativo: escribe cada título carácter por carácter, lo mantiene,
 * lo borra (más rápido), hace una pausa y sigue con el siguiente, en loop
 * infinito. Con prefers-reduced-motion devuelve el primer título completo y
 * fijo, sin ciclo.
 *
 * El estado se DERIVA del tiempo transcurrido módulo la duración del ciclo,
 * no de contar ticks: si el navegador throttlea o congela el intervalo
 * (pestaña en segundo plano, ahorro de energía), el siguiente tick que sí
 * llegue calcula la posición exacta que corresponde al reloj y se pone al día
 * sin saltos raros ni glitches.
 *
 * El reloj vive en el componente: para reiniciar el ciclo cuando cambian los
 * títulos (p. ej. al cambiar de idioma), remonta el componente con `key`.
 */
export function useTypewriter(titles: string[], timing = DEFAULT_TYPEWRITER_TIMING) {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
  )

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY)
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const { segments, total } = useMemo(() => {
    const built = titles.map((title): Segment => {
      const chars = Array.from(title)
      const typeMs = chars.length * timing.typeMs
      const holdEnd = typeMs + timing.holdMs
      const deleteEnd = holdEnd + chars.length * timing.deleteMs
      return { chars, typeMs, holdEnd, deleteEnd, end: deleteEnd + timing.gapMs }
    })
    return { segments: built, total: built.reduce((sum, segment) => sum + segment.end, 0) }
  }, [titles, timing])

  const [frame, setFrame] = useState<Frame>({ index: 0, count: 0 })

  useEffect(() => {
    if (reducedMotion || total === 0) {
      return
    }
    const startedAt = performance.now()
    const tick = () => {
      const next = resolve(segments, timing, (performance.now() - startedAt) % total)
      // Mismo estado → misma referencia: sin re-render en los ticks sin cambio.
      setFrame((current) =>
        current.index === next.index && current.count === next.count ? current : next,
      )
    }
    tick()
    const id = window.setInterval(tick, TICK_MS)
    return () => window.clearInterval(id)
  }, [segments, total, timing, reducedMotion])

  if (reducedMotion) {
    const first = segments[0]
    return { display: first ? first.chars.join('') : '', index: 0, reducedMotion }
  }
  const segment = segments[frame.index]
  return {
    display: segment
      ? segment.chars.slice(0, Math.min(frame.count, segment.chars.length)).join('')
      : '',
    index: frame.index,
    reducedMotion,
  }
}
