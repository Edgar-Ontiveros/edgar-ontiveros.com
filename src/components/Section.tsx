import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { SectionId } from '../content/types'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Capa de entrada con stagger para los hijos de una Section: anima solo
 * opacity/transform, dirigida por la clase marcadora `revealed` del shell.
 * El retardo por elemento se pasa con style={{ transitionDelay }} en una capa
 * SIN transiciones de hover, para que el delay no entorpezca la interacción.
 */
export const revealStaggerClasses =
  'translate-y-2 opacity-0 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none [.revealed_&]:translate-y-0 [.revealed_&]:opacity-100'

interface SectionProps {
  id: SectionId
  /** Número decorativo de la sección (p. ej. "02"). */
  number: string
  title: string
  className?: string
  children: ReactNode
}

/**
 * Marco estándar de toda sección del one-page: ancla accesible, contenedor
 * centrado, encabezado numerado y reveal al entrar en viewport (una sola vez;
 * con prefers-reduced-motion el contenido aparece visible de inmediato).
 */
export function Section({ id, number, title, className, children }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(() => window.matchMedia(REDUCED_MOTION_QUERY).matches)

  useEffect(() => {
    if (revealed) {
      return
    }
    const element = sectionRef.current
    if (!element || !('IntersectionObserver' in window)) {
      // Sin observer no hay forma de detectar el viewport: revela de inmediato.
      const immediate = window.setTimeout(() => setRevealed(true), 0)
      return () => window.clearTimeout(immediate)
    }
    let intersected = false
    const observer = new IntersectionObserver(
      (entries) => {
        // .some: el observer puede entregar registros en lote (el inicial
        // no-intersectante + un cruce posterior en el mismo callback).
        if (entries.some((entry) => entry.isIntersecting)) {
          intersected = true
          setRevealed(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(element)
    // Red de seguridad: el contenido nunca queda oculto de forma permanente
    // (p. ej. una sección corta al fondo que jamás cruza el margen del -10%).
    // Ojo: el observer SIEMPRE entrega un registro inicial aunque no haya
    // intersección, así que el flag solo cuenta intersecciones reales.
    const fallback = window.setTimeout(() => {
      if (!intersected) {
        setRevealed(true)
      }
    }, 3000)
    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [revealed])

  return (
    <section
      ref={sectionRef}
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-16 outline-none ${className ?? ''}`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
        {/* La clase marcadora `revealed` permite a los hijos definir sus propias
            animaciones de entrada escalonadas vía [.revealed_&]. */}
        <div
          className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
            revealed ? 'revealed translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="mb-10 flex items-center gap-4 sm:mb-12">
            <span aria-hidden="true" className="font-mono text-sm text-accent">
              {number}
            </span>
            <h2
              id={`${id}-title`}
              className="font-display text-2xl font-bold tracking-tight sm:text-3xl"
            >
              {title}
            </h2>
            <div aria-hidden="true" className="h-px flex-1 bg-border" />
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}
