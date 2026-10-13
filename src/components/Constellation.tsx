import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { CONSTELLATION_TECHNOLOGIES } from '../content/constellation'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
// Mismo criterio que el breakpoint md: de Tailwind, para que el motor y el
// layout CSS conmuten en el mismo punto (rect.width excluye la scrollbar).
const DESKTOP_QUERY = '(min-width: 768px)'

// ── Densidad: una sola red homogénea, proporcional al área del canvas ──
// Densidad base ×1.2 (y clamp escalado en la misma proporción, para que el
// aumento se aprecie igual en móvil y en pantallas grandes).
const DENSITY_SCALE = 1.2
const DENSITY_DESKTOP = DENSITY_SCALE / 11000 // nodos por px²
const DENSITY_MOBILE = DENSITY_SCALE / 16000
const MIN_NODES = Math.round(24 * DENSITY_SCALE) // 29
const MAX_NODES = Math.round(140 * DENSITY_SCALE) // 168
/** Re-siembra solo si el objetivo difiere >15% del actual (evita pops al redimensionar). */
const RESEED_TOLERANCE = 0.15

// ── Nodos: tamaño y brillo crecen con la profundidad z (0 = lejos, 1 = cerca) ──
const NODE_RADIUS_MIN = 0.9 // radio en z = 0
const NODE_RADIUS_MAX = 2.6 // radio en z = 1
const NODE_ALPHA_MIN = 0.35 // brillo en z = 0
const NODE_ALPHA_MAX = 0.95 // brillo en z = 1
const HOVER_RADIUS_BOOST = 2
const HALO_RADIUS = 8

// ── Profundidad (pseudo-3D) ──
/** Exponente de la distribución de z: >1 hay más nodos lejanos que cercanos. */
const DEPTH_DISTRIBUTION = 1.1
/** Niveles de z cuantizados: un sprite pre-renderizado (radial-gradient) por nivel. */
const DEPTH_LEVELS = 12
/** Desenfoque (bokeh) en px en z = 0; se anula al llegar a DEPTH_BLUR_END. */
const DEPTH_BLUR_MAX = 1.4
const DEPTH_BLUR_END = 0.5
/** Halo suave del acento en los nodos cercanos: aparece desde DEPTH_GLOW_START. */
const DEPTH_GLOW_START = 0.6
const DEPTH_GLOW_RADIUS = 6 // px más allá del núcleo en z = 1
const DEPTH_GLOW_ALPHA = 0.35 // opacidad del halo en z = 1 (relativa al núcleo)

// ── Enlaces por proximidad ──
const LINK_ALPHA = 0.3
const LINK_DISTANCE_FACTOR = 1.2 // × espaciado medio entre nodos
const LINK_DISTANCE_MIN = 80
const LINK_DISTANCE_MAX = 150
/** Grosor y opacidad según la profundidad media de los extremos. */
const LINK_WIDTH_MIN = 0.6
const LINK_WIDTH_MAX = 1.4
const LINK_DEPTH_ALPHA_MIN = 0.5 // factor de opacidad en profundidad media 0
/** Prioriza capas: con |Δz| = 1 el enlace exige estar (1 + P)× más cerca. */
const LINK_DEPTH_PENALTY = 0.5

// ── Movimiento (drift orgánico, guiado suave en los bordes) ──
const EDGE_MARGIN = 8
const EDGE_STEER_ZONE = 48
const EDGE_STEER = 20 // px/s² hacia adentro
const MIN_SPEED = 4
const DRIFT_SPEED = 5 // + aleatorio
const MAX_SPEED = 16
const WANDER = 6 // px/s² de deriva orgánica
const PULL_RADIUS = 180
const MAX_PULL = 10
/** Parallax del cursor y velocidad de deriva escalan con z (lo cercano se mueve más). */
const PARALLAX_DEPTH_MIN = 0.25
const PARALLAX_DEPTH_MAX = 1.4
const DRIFT_DEPTH_MIN = 0.45
const DRIFT_DEPTH_MAX = 1.35

// ── Interacción y labels (solo visibles en hover/tap, con fade) ──
const HIT_RADIUS = 26
const TOUCH_HIT_RADIUS = 36
const TOUCH_HIGHLIGHT_MS = 2500
const LABEL_FADE_RATE = 8 // 1/s
const FOCUS_DIM = 0.55 // atenuación del resto con un nodo activo

// ── Atenuación gradual tras el bloque de texto del hero ──
const ZONE_MIN_FADE = 0.4 // opacidad mínima en el interior de la zona (~40% de la normal)
const ZONE_FEATHER = 90 // px de transición suave en los bordes
const ZONE_PADDING = 6 // margen ceñido alrededor del rect medido del texto
// En móvil la zona del texto no aplica (cubriría casi todo el hero): solo una
// atenuación ligera alrededor del nombre, para que los nodos cercanos con halo
// no compitan con él.
const NAME_ZONE_MIN_FADE = 0.6
const NAME_ZONE_FEATHER = 36
const NAME_ZONE_PADDING = 18

interface ConstellationNode {
  label: string
  x: number
  y: number
  vx: number
  vy: number
  /** Offset de parallax hacia el cursor (no altera la física del drift). */
  ox: number
  oy: number
  /** Profundidad 0 (lejos) .. 1 (cerca); fija desde la siembra. */
  z: number
  /** Índice del sprite de profundidad (z cuantizado). */
  level: number
  /** Factores de parallax y de deriva derivados de z. */
  parallax: number
  drift: number
  radius: number
  baseAlpha: number
  /** Fase del wander, para que cada nodo derive distinto. */
  phase: number
  /** Intensidad de resaltado/label 0..1 (easing del fade in/out). */
  t: number
  /** Atenuación por la zona del texto, recalculada por frame en draw(). */
  fade: number
}

interface ExclusionZone {
  x0: number
  y0: number
  x1: number
  y1: number
  /** Opacidad mínima en el interior y ancho de la transición. */
  minFade: number
  feather: number
}

interface ThemeStyle {
  accent: string
  muted: string
  fontMono: string
}

function readThemeStyle(): ThemeStyle {
  const styles = getComputedStyle(document.documentElement)
  return {
    accent: styles.getPropertyValue('--accent').trim(),
    muted: styles.getPropertyValue('--text-muted').trim(),
    fontMono: styles.getPropertyValue('--font-mono').trim(),
  }
}

const clamp = (min: number, max: number, value: number) => Math.min(max, Math.max(min, value))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp(0, 1, (value - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

interface DepthSprite {
  canvas: HTMLCanvasElement
  /** Semilado en px CSS: el sprite se dibuja centrado en el nodo. */
  extent: number
}

/**
 * Pre-renderiza un sprite por nivel de profundidad (una sola vez por DPR):
 * los lejanos son discos suaves y desenfocados (bokeh), los cercanos un núcleo
 * nítido con halo del acento. Se pinta una máscara radial y se tiñe con el
 * color del token (source-in), así no hay colores fuera del tema.
 */
function buildDepthSprites(accent: string, dpr: number): DepthSprite[] {
  return Array.from({ length: DEPTH_LEVELS }, (_, level) => {
    const z = level / (DEPTH_LEVELS - 1)
    const radius = lerp(NODE_RADIUS_MIN, NODE_RADIUS_MAX, z)
    const blur = DEPTH_BLUR_MAX * (1 - smoothstep(0, DEPTH_BLUR_END, z))
    const glow = smoothstep(DEPTH_GLOW_START, 1, z)
    const edge = Math.max(blur, 0.6) // borde suave mínimo como antialiasing
    const extent = radius + edge + DEPTH_GLOW_RADIUS * glow
    // El desenfoque reparte la luz: el pico baja para conservar el "peso" del punto.
    const peak = radius / (radius + blur * 0.5)

    const canvas = document.createElement('canvas')
    const size = Math.ceil(extent * 2 * dpr)
    canvas.width = size
    canvas.height = size
    const sctx = canvas.getContext('2d')
    if (!sctx) {
      return { canvas, extent }
    }
    const center = size / 2
    const gradient = sctx.createRadialGradient(center, center, 0, center, center, center)
    const stop = (r: number, alpha: number) =>
      gradient.addColorStop(clamp(0, 1, r / extent), `rgb(0 0 0 / ${alpha})`)
    stop(0, peak)
    stop(Math.max(0, radius - edge * 0.5), peak)
    if (glow > 0) {
      const glowAlpha = DEPTH_GLOW_ALPHA * glow
      stop(radius + edge * 0.5, glowAlpha)
      stop(radius + edge + DEPTH_GLOW_RADIUS * glow * 0.4, glowAlpha * 0.4)
    } else {
      stop(radius, peak * 0.55)
    }
    stop(extent, 0)
    sctx.fillStyle = gradient
    sctx.fillRect(0, 0, size, size)
    // Tinte con el acento del tema conservando la máscara.
    sctx.globalCompositeOperation = 'source-in'
    sctx.fillStyle = accent
    sctx.fillRect(0, 0, size, size)
    return { canvas, extent }
  })
}

interface ConstellationProps {
  /** Elemento que recibe los eventos de puntero (el canvas es pointer-events: none). */
  hostRef: RefObject<HTMLElement | null>
  /** Bloque de texto del hero: define la zona de atenuación (en móvil, solo su h1). */
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

    const theme = readThemeStyle()
    let width = 0
    let height = 0
    let linkDistance = LINK_DISTANCE_MIN
    let zone: ExclusionZone | null = null
    let nodes: ConstellationNode[] = []
    let sprites: DepthSprite[] = []
    let spriteDpr = 0
    let hoveredIndex = -1
    let touchIndex = -1
    let touchUntil = 0
    const pointer = { clientX: 0, clientY: 0, active: false }
    let running = false
    let inViewport = true
    let rafId = 0
    let lastTime = 0
    let wanderClock = 0
    let resizeTimer = 0
    let disposed = false

    // Atenuación gradual dentro de la zona del texto: 1 fuera, baja con
    // smoothstep hasta zone.minFade en el interior profundo.
    const zoneFade = (x: number, y: number) => {
      if (!zone) {
        return 1
      }
      const depth = Math.min(x - zone.x0, zone.x1 - x, y - zone.y0, zone.y1 - y)
      if (depth <= 0) {
        return 1
      }
      const step = Math.min(1, depth / zone.feather)
      const smooth = step * step * (3 - 2 * step)
      return 1 - (1 - zone.minFade) * smooth
    }

    // Zona medida del rect real del bloque de texto (sus hijos encogen a su
    // contenido con items-start), con fallback por fracciones. En móvil, solo
    // la zona ligera alrededor del nombre (h1 del bloque).
    const measureZone = (): ExclusionZone | null => {
      if (!window.matchMedia(DESKTOP_QUERY).matches) {
        const name = textRef.current?.querySelector('h1')
        if (!name) {
          return null
        }
        const canvasRect = canvas.getBoundingClientRect()
        const rect = name.getBoundingClientRect()
        return {
          x0: rect.left - canvasRect.left - NAME_ZONE_PADDING,
          y0: rect.top - canvasRect.top - NAME_ZONE_PADDING,
          x1: rect.right - canvasRect.left + NAME_ZONE_PADDING,
          y1: rect.bottom - canvasRect.top + NAME_ZONE_PADDING,
          minFade: NAME_ZONE_MIN_FADE,
          feather: NAME_ZONE_FEATHER,
        }
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
            x0: left - canvasRect.left - ZONE_PADDING,
            y0: top - canvasRect.top - ZONE_PADDING,
            x1: right - canvasRect.left + ZONE_PADDING,
            y1: bottom - canvasRect.top + ZONE_PADDING,
            minFade: ZONE_MIN_FADE,
            feather: ZONE_FEATHER,
          }
        }
      }
      return {
        x0: 0,
        y0: height * 0.24,
        x1: width * 0.52,
        y1: height * 0.78,
        minFade: ZONE_MIN_FADE,
        feather: ZONE_FEATHER,
      }
    }

    const seedNodes = (target: number) => {
      // Un re-seed invalida cualquier resaltado táctil pendiente.
      touchIndex = -1
      touchUntil = 0
      // Baraja el vocabulario y repártelo cíclicamente (puede repetirse).
      const vocabulary = [...CONSTELLATION_TECHNOLOGIES]
      for (let i = vocabulary.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[vocabulary[i], vocabulary[j]] = [vocabulary[j], vocabulary[i]]
      }
      nodes = Array.from({ length: target }, (_, index) => {
        const angle = Math.random() * Math.PI * 2
        const speed = MIN_SPEED + Math.random() * DRIFT_SPEED
        const level = Math.round(Math.random() ** DEPTH_DISTRIBUTION * (DEPTH_LEVELS - 1))
        const z = level / (DEPTH_LEVELS - 1)
        return {
          label: vocabulary[index % vocabulary.length],
          x: EDGE_MARGIN + Math.random() * Math.max(1, width - EDGE_MARGIN * 2),
          y: EDGE_MARGIN + Math.random() * Math.max(1, height - EDGE_MARGIN * 2),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          ox: 0,
          oy: 0,
          z,
          level,
          parallax: lerp(PARALLAX_DEPTH_MIN, PARALLAX_DEPTH_MAX, z),
          drift: lerp(DRIFT_DEPTH_MIN, DRIFT_DEPTH_MAX, z),
          radius: lerp(NODE_RADIUS_MIN, NODE_RADIUS_MAX, z),
          baseAlpha: lerp(NODE_ALPHA_MIN, NODE_ALPHA_MAX, z),
          phase: Math.random() * Math.PI * 2,
          t: 0,
          fade: 1,
        }
      })
      // De lejos a cerca: los nodos cercanos se pintan encima.
      nodes.sort((a, b) => a.z - b.z)
    }

    const findNodeAt = (x: number, y: number, radius: number) => {
      let best = radius
      let found = -1
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i]
        const distance = Math.hypot(x - (node.x + node.ox), y - (node.y + node.oy))
        if (distance < best) {
          best = distance
          found = i
        }
      }
      return found
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const { accent, muted, fontMono } = theme

      let maxT = 0
      for (const node of nodes) {
        node.fade = zoneFade(node.x + node.ox, node.y + node.oy)
        if (node.t > maxT) {
          maxT = node.t
        }
      }

      // Enlaces por proximidad: la red se teje y desteje conforme derivan.
      // La diferencia de profundidad acorta el alcance (la red se lee en
      // capas) y la profundidad media fija grosor y opacidad.
      const linkDistance2 = linkDistance * linkDistance
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = b.x + b.ox - (a.x + a.ox)
          const dy = b.y + b.oy - (a.y + a.oy)
          const d2 = dx * dx + dy * dy
          if (d2 >= linkDistance2) {
            continue
          }
          const distance = Math.sqrt(d2) * (1 + LINK_DEPTH_PENALTY * Math.abs(a.z - b.z))
          if (distance >= linkDistance) {
            continue
          }
          const closeness = 1 - distance / linkDistance
          const fade = Math.min(a.fade, b.fade)
          const depth = (a.z + b.z) / 2
          ctx.lineWidth = lerp(LINK_WIDTH_MIN, LINK_WIDTH_MAX, depth)
          ctx.strokeStyle = muted
          ctx.globalAlpha =
            LINK_ALPHA *
            closeness *
            fade *
            (1 - FOCUS_DIM * maxT) *
            lerp(LINK_DEPTH_ALPHA_MIN, 1, depth)
          ctx.beginPath()
          ctx.moveTo(a.x + a.ox, a.y + a.oy)
          ctx.lineTo(b.x + b.ox, b.y + b.oy)
          ctx.stroke()
          const highlight = Math.max(a.t, b.t)
          if (highlight > 0.01) {
            ctx.lineWidth = Math.max(1, ctx.lineWidth)
            ctx.strokeStyle = accent
            ctx.globalAlpha = highlight * closeness * 0.9 * Math.max(fade, 0.5)
            ctx.beginPath()
            ctx.moveTo(a.x + a.ox, a.y + a.oy)
            ctx.lineTo(b.x + b.ox, b.y + b.oy)
            ctx.stroke()
          }
        }
      }

      // Nodos: sprite de su profundidad (bokeh lejos, halo cerca). El activo
      // pasa a un punto nítido a brillo pleno, sea cual sea su z.
      ctx.fillStyle = accent
      for (const node of nodes) {
        const x = node.x + node.ox
        const y = node.y + node.oy
        const base = node.baseAlpha * node.fade * (1 - FOCUS_DIM * maxT * (1 - node.t))
        const sprite = sprites[node.level]
        if (sprite && node.t < 0.99) {
          ctx.globalAlpha = base * (1 - node.t)
          ctx.drawImage(
            sprite.canvas,
            x - sprite.extent,
            y - sprite.extent,
            sprite.extent * 2,
            sprite.extent * 2,
          )
        }
        if (node.t > 0.01 || !sprite) {
          ctx.globalAlpha = node.t * 0.18
          ctx.beginPath()
          ctx.arc(x, y, HALO_RADIUS, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = sprite
            ? node.t * Math.max(node.fade, 0.6)
            : Math.max(base, node.t * Math.max(node.fade, 0.6))
          ctx.beginPath()
          ctx.arc(x, y, node.radius + HOVER_RADIUS_BOOST * node.t, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Labels: solo nodos activos (o en fade), reposicionados si tocan un borde.
      ctx.font = `11px ${fontMono}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      for (const node of nodes) {
        if (node.t <= 0.02) {
          continue
        }
        const x = node.x + node.ox
        const y = node.y + node.oy
        const textWidth = ctx.measureText(node.label).width
        const labelX = clamp(4 + textWidth / 2, width - 4 - textWidth / 2, x)
        let labelY = y + node.radius + HOVER_RADIUS_BOOST + 6
        if (labelY + 14 > height - 2) {
          labelY = y - node.radius - HOVER_RADIUS_BOOST - 17
        }
        ctx.fillStyle = accent
        ctx.globalAlpha = node.t
        ctx.fillText(node.label, labelX, labelY)
      }
      ctx.globalAlpha = 1
    }

    const step = (dt: number) => {
      wanderClock += dt

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
        // Deriva orgánica: aceleración suave con fase propia, sin tirones.
        node.vx += Math.sin(wanderClock * 0.6 + node.phase) * WANDER * dt
        node.vy += Math.cos(wanderClock * 0.7 + node.phase * 1.7) * WANDER * dt

        // Guiado suave hacia adentro cerca de los bordes (sin rebote duro).
        if (node.x < EDGE_STEER_ZONE) {
          node.vx += EDGE_STEER * dt * (1 - node.x / EDGE_STEER_ZONE)
        } else if (node.x > width - EDGE_STEER_ZONE) {
          node.vx -= EDGE_STEER * dt * (1 - (width - node.x) / EDGE_STEER_ZONE)
        }
        if (node.y < EDGE_STEER_ZONE) {
          node.vy += EDGE_STEER * dt * (1 - node.y / EDGE_STEER_ZONE)
        } else if (node.y > height - EDGE_STEER_ZONE) {
          node.vy -= EDGE_STEER * dt * (1 - (height - node.y) / EDGE_STEER_ZONE)
        }

        const speed = Math.hypot(node.vx, node.vy)
        if (speed > MAX_SPEED) {
          node.vx *= MAX_SPEED / speed
          node.vy *= MAX_SPEED / speed
        }

        // La deriva escala con z: lo cercano avanza más rápido que lo lejano.
        node.x += node.vx * node.drift * dt
        node.y += node.vy * node.drift * dt

        // Red de seguridad: rebote amortiguado en el margen mínimo.
        if (node.x < EDGE_MARGIN) {
          node.x = EDGE_MARGIN
          node.vx = Math.abs(node.vx) * 0.5
        } else if (node.x > width - EDGE_MARGIN) {
          node.x = width - EDGE_MARGIN
          node.vx = -Math.abs(node.vx) * 0.5
        }
        if (node.y < EDGE_MARGIN) {
          node.y = EDGE_MARGIN
          node.vy = Math.abs(node.vy) * 0.5
        } else if (node.y > height - EDGE_MARGIN) {
          node.y = height - EDGE_MARGIN
          node.vy = -Math.abs(node.vy) * 0.5
        }

        // Parallax sutil hacia el cursor.
        let targetOx = 0
        let targetOy = 0
        if (pointerInCanvas) {
          const dx = px - node.x
          const dy = py - node.y
          const distance = Math.hypot(dx, dy)
          if (distance > 1 && distance < PULL_RADIUS) {
            const pull = (1 - distance / PULL_RADIUS) * MAX_PULL * node.parallax
            targetOx = (dx / distance) * pull
            targetOy = (dy / distance) * pull
          }
        }
        const ease = Math.min(1, dt * 6)
        node.ox += (targetOx - node.ox) * ease
        node.oy += (targetOy - node.oy) * ease
      }

      hoveredIndex = pointerInCanvas ? findNodeAt(px, py, HIT_RADIUS) : -1
      // Resaltado táctil temporal cuando no hay hover de ratón.
      if (touchIndex !== -1) {
        if (performance.now() < touchUntil && touchIndex < nodes.length) {
          if (hoveredIndex === -1) {
            hoveredIndex = touchIndex
          }
        } else {
          touchIndex = -1
        }
      }

      // Fade in/out del resaltado y del label.
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i]
        const target = i === hoveredIndex ? 1 : 0
        node.t += (target - node.t) * Math.min(1, dt * LABEL_FADE_RATE)
        if (target === 0 && node.t < 0.005) {
          node.t = 0
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
      // Sprites de profundidad: solo se regeneran si cambia el DPR.
      if (dpr !== spriteDpr) {
        sprites = buildDepthSprites(theme.accent, dpr)
        spriteDpr = dpr
      }
      zone = measureZone()

      const desktop = window.matchMedia(DESKTOP_QUERY).matches
      const density = desktop ? DENSITY_DESKTOP : DENSITY_MOBILE
      const target = Math.round(clamp(MIN_NODES, MAX_NODES, width * height * density))
      if (nodes.length === 0 || Math.abs(nodes.length - target) > target * RESEED_TOLERANCE) {
        seedNodes(target)
      } else if (prevWidth > 0 && prevHeight > 0) {
        // Reacomodo proporcional, conservando la constelación existente.
        for (const node of nodes) {
          node.x = clamp(EDGE_MARGIN, width - EDGE_MARGIN, (node.x * width) / prevWidth)
          node.y = clamp(EDGE_MARGIN, height - EDGE_MARGIN, (node.y * height) / prevHeight)
        }
      }
      // Umbral de enlace ligado al espaciado medio real de la red.
      linkDistance = clamp(
        LINK_DISTANCE_MIN,
        LINK_DISTANCE_MAX,
        Math.sqrt((width * height) / Math.max(1, nodes.length)) * LINK_DISTANCE_FACTOR,
      )
      if (!running) {
        draw()
      }
    }

    applyResize()
    updateRunning()

    // Re-mide y redibuja cuando la fuente mono termina de cargar (cambia las
    // métricas del bloque de texto y de los labels).
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

    // En modo estático (reduced-motion) el hover/tap sigue funcionando: no es
    // animación. Se redibuja una sola vez por cambio, sin fade (t se fija).
    const applyStaticHighlight = (found: number) => {
      let changed = false
      for (let i = 0; i < nodes.length; i += 1) {
        const target = i === found ? 1 : 0
        if (nodes[i].t !== target) {
          nodes[i].t = target
          changed = true
        }
      }
      if (changed) {
        draw()
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        return
      }
      pointer.clientX = event.clientX
      pointer.clientY = event.clientY
      pointer.active = true
      if (reducedMotion) {
        const rect = canvas.getBoundingClientRect()
        applyStaticHighlight(
          findNodeAt(event.clientX - rect.left, event.clientY - rect.top, HIT_RADIUS),
        )
      }
    }
    const onPointerLeave = (event: PointerEvent) => {
      pointer.active = false
      // Solo el ratón limpia el resaltado estático: en táctil el navegador
      // dispara pointerleave justo tras pointerup y borraría el tap al instante.
      if (reducedMotion && event.pointerType === 'mouse') {
        applyStaticHighlight(-1)
      }
    }
    // Touch: un tap cerca de un nodo lo resalta; en modo animado expira solo,
    // en modo estático persiste hasta el siguiente tap.
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') {
        return
      }
      const rect = canvas.getBoundingClientRect()
      const found = findNodeAt(
        event.clientX - rect.left,
        event.clientY - rect.top,
        TOUCH_HIT_RADIUS,
      )
      touchIndex = found
      touchUntil = found === -1 ? 0 : performance.now() + TOUCH_HIGHLIGHT_MS
      if (reducedMotion) {
        applyStaticHighlight(found)
      }
    }
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerleave', onPointerLeave)
    host.addEventListener('pointerdown', onPointerDown)

    // Pausas del loop solo en modo animado.
    const onVisibilityChange = () => updateRunning()
    let intersectionObserver: IntersectionObserver | null = null
    if (!reducedMotion) {
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
      intersectionObserver?.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
      host.removeEventListener('pointerdown', onPointerDown)
    }
  }, [hostRef, textRef, reducedMotion])

  return <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
}
