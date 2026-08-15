import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CERTIFICATIONS } from '../content/certifications'
import type { SiteContent } from '../content/types'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, ExternalLinkIcon } from './icons'

interface CertificateLightboxProps {
  index: number
  content: SiteContent
  onNavigate: (index: number) => void
  onClose: () => void
}

const controlClasses =
  'rounded-md border border-border bg-surface p-2.5 text-muted transition-colors hover:border-accent hover:text-foreground'

/**
 * Visor a pantalla completa de certificados. Renderiza en un portal fuera de
 * #root para poder dejar TODO el fondo inerte (patrón endurecido del menú
 * móvil: scroll lock + inert + Esc + restauración de foco). Navegación
 * CIRCULAR (del último se pasa al primero): los botones nunca se deshabilitan
 * y el contador comunica la posición. Sin transiciones de apertura/cambio:
 * el visor aparece directamente (cumple prefers-reduced-motion por diseño).
 * No se cierra al rotar el viewport: aquí ningún control desaparece por
 * breakpoint (a diferencia del menú móvil) y rotar a horizontal es
 * precisamente cómo mejor se ve un certificado.
 */
export function CertificateLightbox({
  index,
  content,
  onNavigate,
  onClose,
}: CertificateLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const swipeStart = useRef<{ x: number; y: number } | null>(null)
  const total = CERTIFICATIONS.length
  const cert = CERTIFICATIONS[index]
  const { gallery, opensPdf } = content.education

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

  // Teclado: Esc cierra, flechas navegan, Tab queda atrapado en el diálogo.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key === 'ArrowRight') {
        goTo(index + 1)
        return
      }
      if (event.key === 'ArrowLeft') {
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
  }, [index, goTo, onClose])

  // Precarga solo las imágenes adyacentes.
  useEffect(() => {
    for (const offset of [-1, 1]) {
      const adjacent = CERTIFICATIONS[(index + offset + total) % total]
      new Image().src = adjacent.preview.large
    }
  }, [index, total])

  // Swipe lateral en táctil. isPrimary descarta el segundo dedo de un gesto
  // de pellizco (evita computar dx entre dedos distintos); el contenedor lleva
  // touch-action pan-y + pinch-zoom para que el navegador no reclame el drag
  // horizontal como pan (dispararía pointercancel y el swipe nunca llegaría).
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
      aria-label={cert.title}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col bg-background/95 p-4 outline-none backdrop-blur-sm sm:p-6"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-muted">
          {index + 1}/{total}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={gallery.close}
          className={controlClasses}
        >
          <CloseIcon />
        </button>
      </div>

      <div
        className="flex min-h-0 flex-1 touch-pan-y touch-pinch-zoom items-center justify-center py-4"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <img
          key={cert.file}
          src={cert.preview.large}
          alt={`${cert.title} — ${cert.issuer}`}
          width={cert.preview.largeWidth}
          height={cert.preview.largeHeight}
          className="max-h-full max-w-full rounded-md object-contain"
        />
      </div>

      <div className="flex flex-col items-center gap-4 pb-1 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p lang="es" className="font-medium">
            {cert.title}
          </p>
          <p className="font-mono text-xs text-muted">
            {cert.issuer} · {cert.year}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/certificaciones/${cert.file}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            {gallery.viewPdf}
            <span className="sr-only">({opensPdf})</span>
          </a>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label={gallery.previous}
            className={controlClasses}
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label={gallery.next}
            className={controlClasses}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      {/* Anuncio del cambio para lectores de pantalla. */}
      <div aria-live="polite" className="sr-only">
        {cert.title} — {cert.issuer}, {index + 1} {gallery.of} {total}
      </div>
    </div>,
    document.body,
  )
}
