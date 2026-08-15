import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, ExternalLinkIcon } from './icons'

export interface LightboxItem {
  src: string
  width: number
  height: number
  alt: string
  title: string
  /** Idioma del título si difiere del de la UI (p. ej. certificados en español). */
  titleLang?: string
  subtitle?: string
  /** Enlace opcional bajo el título (p. ej. al PDF original). */
  link?: {
    href: string
    label: string
    /** Aviso sr-only (p. ej. "abre el PDF en una pestaña nueva"). */
    srHint?: string
  }
}

interface LightboxProps {
  items: LightboxItem[]
  index: number
  labels: {
    close: string
    previous: string
    next: string
    of: string
  }
  onNavigate: (index: number) => void
  onClose: () => void
}

const controlClasses =
  'rounded-md border border-border bg-surface p-2.5 text-muted transition-colors hover:border-accent hover:text-foreground'

/**
 * Visor genérico a pantalla completa (certificados, fotos de proyecto…).
 * Renderiza en un portal fuera de #root para dejar TODO el fondo inerte
 * (patrón endurecido del menú móvil: scroll lock + inert + Esc + restauración
 * de foco a cargo del padre tras el cleanup). Con un solo elemento no hay
 * contador, botones de navegación, flechas, swipe ni precarga. Con varios, la
 * navegación es CIRCULAR (los botones nunca se deshabilitan; el contador
 * comunica la posición). Sin transiciones de apertura/cambio: el visor
 * aparece directamente (cumple prefers-reduced-motion por diseño). No se
 * cierra al rotar el viewport: ningún control desaparece por breakpoint y
 * rotar a horizontal es precisamente cómo mejor se ve una imagen.
 */
export function Lightbox({ items, index, labels, onNavigate, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const swipeStart = useRef<{ x: number; y: number } | null>(null)
  const total = items.length
  const multiple = total > 1
  const item = items[index]

  const goTo = useCallback(
    (target: number) => onNavigate((target + total) % total),
    [onNavigate, total],
  )

  // Al abrir: foco al diálogo, scroll del body bloqueado y fondo inerte.
  useEffect(() => {
    dialogRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const root = document.getElementById('root')
    root?.setAttribute('inert', '')
    return () => {
      document.body.style.overflow = ''
      root?.removeAttribute('inert')
    }
  }, [])

  // Teclado: Esc cierra, flechas navegan (solo con varios), Tab queda atrapado.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (multiple && event.key === 'ArrowRight') {
        goTo(index + 1)
        return
      }
      if (multiple && event.key === 'ArrowLeft') {
        goTo(index - 1)
        return
      }
      if (event.key !== 'Tab') {
        return
      }
      const dialog = dialogRef.current
      if (!dialog) {
        return
      }
      const focusables = dialog.querySelectorAll<HTMLElement>('a[href], button')
      if (focusables.length === 0) {
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [index, multiple, goTo, onClose])

  // Precarga solo las imágenes adyacentes (irrelevante con un solo elemento).
  useEffect(() => {
    if (!multiple) {
      return
    }
    for (const offset of [-1, 1]) {
      const adjacent = items[(index + offset + total) % total]
      new Image().src = adjacent.src
    }
  }, [index, items, multiple, total])

  // Swipe lateral en táctil. isPrimary descarta el segundo dedo de un gesto
  // de pellizco; el contenedor lleva touch-action pan-y + pinch-zoom para que
  // el navegador no reclame el drag horizontal como pan (dispararía
  // pointercancel y el swipe nunca llegaría).
  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse' && event.isPrimary) {
      swipeStart.current = { x: event.clientX, y: event.clientY }
    }
  }
  const onPointerUp = (event: React.PointerEvent) => {
    if (!event.isPrimary) {
      return
    }
    const start = swipeStart.current
    swipeStart.current = null
    if (!start) {
      return
    }
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      goTo(index + (dx < 0 ? 1 : -1))
    }
  }

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col bg-background/95 p-4 outline-none backdrop-blur-sm sm:p-6"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-muted">
          {multiple ? `${index + 1}/${total}` : ''}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={labels.close}
          className={controlClasses}
        >
          <CloseIcon />
        </button>
      </div>

      <div
        className="flex min-h-0 flex-1 touch-pan-y touch-pinch-zoom items-center justify-center py-4"
        onPointerDown={multiple ? onPointerDown : undefined}
        onPointerUp={multiple ? onPointerUp : undefined}
      >
        <img
          key={item.src}
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          className="max-h-full max-w-full rounded-md object-contain"
        />
      </div>

      <div className="flex flex-col items-center gap-4 pb-1 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p lang={item.titleLang} className="font-medium">
            {item.title}
          </p>
          {item.subtitle && <p className="font-mono text-xs text-muted">{item.subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {item.link && (
            <a
              href={item.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent"
            >
              <ExternalLinkIcon className="h-4 w-4" />
              {item.link.label}
              {item.link.srHint && <span className="sr-only">({item.link.srHint})</span>}
            </a>
          )}
          {multiple && (
            <>
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label={labels.previous}
                className={controlClasses}
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label={labels.next}
                className={controlClasses}
              >
                <ChevronRightIcon />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Anuncio del cambio para lectores de pantalla. */}
      <div aria-live="polite" className="sr-only">
        {[item.title, item.subtitle].filter(Boolean).join(' — ')}
        {multiple ? `, ${index + 1} ${labels.of} ${total}` : ''}
      </div>
    </div>,
    document.body,
  )
}
