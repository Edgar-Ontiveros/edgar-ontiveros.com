import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { CONSTELLATION_NODES, CONSTELLATION_NODES_MOBILE } from '../content/constellation'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const LIGHT_SCHEME_QUERY = '(prefers-color-scheme: light)'
// Mismo criterio que el breakpoint md: de Tailwind, para que el motor y el
// layout CSS conmuten en el mismo punto (rect.width excluye la scrollbar).
const DESKTOP_QUERY = '(min-width: 768px)'

// Márgenes para que los labels no se corten en los bordes del canvas; el
// inferior es mayor para dejar libre la franja del indicador de scroll.
const MARGIN_X = 56
const MARGIN_TOP = 44
const MARGIN_BOTTOM = 84
// Holgura de la zona de exclusión: mitad del label más ancho + halo +
// penetración del empuje blando + parallax.
const ZONE_PADDING = 56
const NODE_RADIUS = 2.5
const HALO_RADIUS = 9
const HIT_RADIUS = 28
const PULL_RADIUS = 180
const MAX_PULL = 10
const MIN_SPEED = 6
const DRIFT_SPEED = 10
const MAX_SPEED = 26
const EXCLUSION_PUSH = 30

interface ConstellationNode {
  label: string
  x: number
  y: number
  vx: number
  vy: number
  /** Offset de parallax hacia el cursor (no altera la física del drift). */
  ox: number
  oy: number
}

interface ExclusionZone {
  x0: number
  y0: number
  x1: number
  y1: number
}

interface ThemeStyle {
  accent: string
  muted: string
  fontMono: string
  /** Atenúa solo los elementos ambientales en tema claro; los estados de
      hover se dibujan a opacidad plena (los tokens ya vienen calibrados). */
  dim: number
}

function readThemeStyle(): ThemeStyle {
  const styles = getComputedStyle(document.documentElement)
  const manual = document.documentElement.dataset.theme
  const light =
    manual === 'light' || (manual !== 'dark' && window.matchMedia(LIGHT_SCHEME_QUERY).matches)
  return {
    accent: styles.getPropertyValue('--accent').trim(),
    muted: styles.getPropertyValue('--text-muted').trim(),
    fontMono: styles.getPropertyValue('--font-mono').trim(),
    dim: light ? 0.75 : 1,
  }
}

interface ConstellationProps {
  /** Elemento que recibe los eventos de puntero (el canvas es pointer-events: none). */
  hostRef: RefObject<HTMLElement | null>
  /** Bloque de texto del hero: define la zona de exclusión en desktop. */
  textRef: RefObject<HTMLDivElement | null>
}

export function Constellation({ hostRef, textRef }: ConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
  )

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY)
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef.current
    if (!canvas || !host) {
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    let theme = readThemeStyle()
    let width = 0
    let height = 0
    let linkDistance = 160
    let zone: ExclusionZone | null = null
    let nodes: ConstellationNode[] = []
    let hoveredIndex = -1
    const pointer = { clientX: 0, clientY: 0, active: false }
    let running = false
    let inViewport = true
    let rafId = 0
    let lastTime = 0
    let resizeTimer = 0
    let disposed = false

    const insideZone = (z: ExclusionZone, x: number, y: number) =>
      x > z.x0 && x < z.x1 && y > z.y0 && y < z.y1

    // Zona de exclusión medida del rect real del bloque de texto (sus hijos
    // encogen a su contenido con items-start), con fallback por fracciones.
    const measureZone = (): ExclusionZone | null => {
      if (!window.matchMedia(DESKTOP_QUERY).matches) {
        return null
      }
      const textBlock = textRef.current
      if (textBlock && textBlock.children.length > 0) {
        const canvasRect = canvas.getBoundingClientRect()
        let left = Infinity
        let top = Infinity
        let right = -Infinity
        let bottom = -Infinity
        for (const child of Array.from(textBlock.children)) {
          const rect = child.getBoundingClientRect()
          left = Math.min(left, rect.left)
          top = Math.min(top, rect.top)
          right = Math.max(right, rect.right)
          bottom = Math.max(bottom, rect.bottom)
        }
        if (right > left) {
          return {
            x0: Math.max(0, left - canvasRect.left - ZONE_PADDING),
            y0: Math.max(0, top - canvasRect.top - ZONE_PADDING),
            x1: Math.min(width, right - canvasRect.left + ZONE_PADDING),
            y1: Math.min(height, bottom - canvasRect.top + ZONE_PADDING),
          }
        }
      }
      return { x0: 0, y0: height * 0.24, x1: width * 0.52, y1: height * 0.78 }
    }

    const randomPoint = () => {
      let x = 0
      let y = 0
      // Rechazo contra la zona de exclusión, con tope de intentos.
      for (let attempt = 0; attempt < 40; attempt += 1) {
        x = MARGIN_X + Math.random() * Math.max(1, width - MARGIN_X * 2)
        y = MARGIN_TOP + Math.random() * Math.max(1, height - MARGIN_TOP - MARGIN_BOTTOM)
        if (!zone || !insideZone(zone, x, y)) {
          break
        }
      }
      return { x, y }
    }

    const seedNodes = (labels: readonly string[]) => {
      nodes = labels.map((label) => {
        const { x, y } = randomPoint()
        const angle = Math.random() * Math.PI * 2
        const speed = MIN_SPEED + Math.random() * DRIFT_SPEED
        return {
          label,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          ox: 0,
          oy: 0,
        }
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const { accent, muted, fontMono, dim } = theme
      const hovered = hoveredIndex

      // Enlaces por proximidad, opacidad proporcional a la cercanía.
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i]
          const b = nodes[j]
          const ax = a.x + a.ox
          const ay = a.y + a.oy
          const bx = b.x + b.ox
          const by = b.y + b.oy
          const distance = Math.hypot(bx - ax, by - ay)
          if (distance >= linkDistance) {
            continue
          }
          const closeness = 1 - distance / linkDistance
          const linkHovered = hovered !== -1 && (i === hovered || j === hovered)
          if (linkHovered) {
            ctx.strokeStyle = accent
            ctx.globalAlpha = 0.25 + 0.65 * closeness
          } else {
            ctx.strokeStyle = muted
            ctx.globalAlpha = dim * 0.35 * closeness * (hovered !== -1 ? 0.3 : 1)
          }
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          ctx.lineTo(bx, by)
          ctx.stroke()
        }
      }

      ctx.font = `11px ${fontMono}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i]
        const x = node.x + node.ox
        const y = node.y + node.oy
        const isHovered = i === hovered
        const dimmed = hovered !== -1 && !isHovered

        ctx.fillStyle = accent
        ctx.globalAlpha = isHovered ? 0.28 : dim * 0.1 * (dimmed ? 0.5 : 1)
        ctx.beginPath()
        ctx.arc(x, y, isHovered ? HALO_RADIUS + 3 : HALO_RADIUS, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = isHovered ? 1 : dim * (dimmed ? 0.35 : 0.85)
        ctx.beginPath()
        ctx.arc(x, y, isHovered ? NODE_RADIUS + 1 : NODE_RADIUS, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = isHovered ? accent : muted
        ctx.globalAlpha = isHovered ? 1 : dim * 0.55 * (dimmed ? 0.5 : 1)
        ctx.fillText(node.label, x, y + HALO_RADIUS + 3)
      }
      ctx.globalAlpha = 1
    }

    const step = (dt: number) => {
      // El puntero se guarda en coordenadas de cliente y se traduce con un
      // rect fresco cada frame: el scroll mueve el canvas sin disparar
      // pointermove y dejaría hover/atracción anclados a un punto obsoleto.
      let px = 0
      let py = 0
      let pointerInCanvas = false
      if (pointer.active) {
        const rect = canvas.getBoundingClientRect()
        px = pointer.clientX - rect.left
        py = pointer.clientY - rect.top
        pointerInCanvas = px >= 0 && px <= width && py >= 0 && py <= height
      }

      for (const node of nodes) {
        node.x += node.vx * dt
        node.y += node.vy * dt

        // Rebote suave en los bordes (respetando el margen de los labels).
        if (node.x < MARGIN_X) {
          node.x = MARGIN_X
          node.vx = Math.abs(node.vx)
        } else if (node.x > width - MARGIN_X) {
          node.x = width - MARGIN_X
          node.vx = -Math.abs(node.vx)
        }
        if (node.y < MARGIN_TOP) {
          node.y = MARGIN_TOP
          node.vy = Math.abs(node.vy)
        } else if (node.y > height - MARGIN_BOTTOM) {
          node.y = height - MARGIN_BOTTOM
          node.vy = -Math.abs(node.vy)
        }

        // Empuje suave fuera de la zona de exclusión del texto del hero.
        if (zone && insideZone(zone, node.x, node.y)) {
          const toLeft = node.x - zone.x0
          const toRight = zone.x1 - node.x
          const toTop = node.y - zone.y0
          const toBottom = zone.y1 - node.y
          const min = Math.min(toLeft, toRight, toTop, toBottom)
          if (min === toRight) {
            node.vx += EXCLUSION_PUSH * dt
          } else if (min === toLeft) {
            node.vx -= EXCLUSION_PUSH * dt
          } else if (min === toTop) {
            node.vy -= EXCLUSION_PUSH * dt
          } else {
            node.vy += EXCLUSION_PUSH * dt
          }
          const speed = Math.hypot(node.vx, node.vy)
          if (speed > MAX_SPEED) {
            node.vx *= MAX_SPEED / speed
            node.vy *= MAX_SPEED / speed
          }
        }

        // Parallax sutil hacia el cursor.
        let targetOx = 0
        let targetOy = 0
        if (pointerInCanvas) {
          const dx = px - node.x
          const dy = py - node.y
          const distance = Math.hypot(dx, dy)
          if (distance > 1 && distance < PULL_RADIUS) {
            const pull = (1 - distance / PULL_RADIUS) * MAX_PULL
            targetOx = (dx / distance) * pull
            targetOy = (dy / distance) * pull
          }
        }
        const ease = Math.min(1, dt * 6)
        node.ox += (targetOx - node.ox) * ease
        node.oy += (targetOy - node.oy) * ease
      }

      hoveredIndex = -1
      if (pointerInCanvas) {
        let best = HIT_RADIUS
        for (let i = 0; i < nodes.length; i += 1) {
          const node = nodes[i]
          const distance = Math.hypot(px - (node.x + node.ox), py - (node.y + node.oy))
          if (distance < best) {
            best = distance
            hoveredIndex = i
          }
        }
      }
    }

    const frame = (time: number) => {
      rafId = requestAnimationFrame(frame)
      const dt = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time
      step(dt)
      draw()
    }

    const start = () => {
      if (running || reducedMotion) {
        return
      }
      running = true
      lastTime = performance.now()
      rafId = requestAnimationFrame(frame)
    }

    const stop = () => {
      if (!running) {
        return
      }
      running = false
      cancelAnimationFrame(rafId)
    }

    const updateRunning = () => {
      if (!document.hidden && inViewport) {
        start()
      } else {
        stop()
      }
    }

    const applyResize = () => {
      const rect = canvas.getBoundingClientRect()
      const prevWidth = width
      const prevHeight = height
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      linkDistance = Math.min(200, Math.max(120, Math.hypot(width, height) * 0.14))
      zone = measureZone()

      const desktop = window.matchMedia(DESKTOP_QUERY).matches
      const labels = desktop ? CONSTELLATION_NODES : CONSTELLATION_NODES_MOBILE
      if (nodes.length !== labels.length) {
        seedNodes(labels)
      } else if (prevWidth > 0 && prevHeight > 0) {
        // Reacomodo proporcional, conservando la constelación existente.
        for (const node of nodes) {
          node.x = Math.min(width - MARGIN_X, Math.max(MARGIN_X, (node.x * width) / prevWidth))
          node.y = Math.min(
            height - MARGIN_BOTTOM,
            Math.max(MARGIN_TOP, (node.y * height) / prevHeight),
          )
        }
      }
      if (!running) {
        draw()
      }
    }

    applyResize()
    updateRunning()

    // Re-mide y redibuja cuando la fuente mono termina de cargar (cambia las
    // métricas del bloque de texto y el render estático de los labels).
    document.fonts?.ready.then(() => {
      if (!disposed) {
        applyResize()
      }
    })

    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(applyResize, 150)
    })
    resizeObserver.observe(host)

    const themeObserver = new MutationObserver(() => {
      theme = readThemeStyle()
      if (!running) {
        draw()
      }
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    const schemeQuery = window.matchMedia(LIGHT_SCHEME_QUERY)
    const onSchemeChange = () => {
      theme = readThemeStyle()
      if (!running) {
        draw()
      }
    }
    schemeQuery.addEventListener('change', onSchemeChange)

    // Interacción de cursor y pausas solo en modo animado.
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        return
      }
      pointer.clientX = event.clientX
      pointer.clientY = event.clientY
      pointer.active = true
    }
    const onPointerLeave = () => {
      pointer.active = false
    }
    const onVisibilityChange = () => updateRunning()
    let intersectionObserver: IntersectionObserver | null = null
    if (!reducedMotion) {
      host.addEventListener('pointermove', onPointerMove)
      host.addEventListener('pointerleave', onPointerLeave)
      document.addEventListener('visibilitychange', onVisibilityChange)
      intersectionObserver = new IntersectionObserver((entries) => {
        inViewport = entries[0]?.isIntersecting ?? true
        updateRunning()
      })
      intersectionObserver.observe(host)
    }

    return () => {
      disposed = true
      stop()
      window.clearTimeout(resizeTimer)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      intersectionObserver?.disconnect()
      schemeQuery.removeEventListener('change', onSchemeChange)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [hostRef, textRef, reducedMotion])

  return <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
}
