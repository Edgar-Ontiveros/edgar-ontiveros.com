import { useEffect, useState } from 'react'

/**
 * Devuelve el id de la sección que cruza la banda central del viewport, para
 * resaltar el ancla correspondiente en la nav. `ids` debe ser una referencia
 * estable (constante de módulo) para no recrear el observer en cada render.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) {
      return
    }

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id)
          } else {
            visible.delete(entry.target.id)
          }
        }
        setActiveId(ids.find((id) => visible.has(id)) ?? null)
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    for (const el of sections) {
      observer.observe(el)
    }
    return () => observer.disconnect()
  }, [ids])

  return activeId
}
