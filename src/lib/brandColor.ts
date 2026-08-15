/**
 * Utilidades de color de marca: contraste WCAG y ajuste automático de
 * luminancia conservando el tono.
 *
 * Umbral por defecto: 3:1, el mínimo de WCAG 1.4.11 (contraste no textual)
 * para objetos gráficos — los logos no son texto, así que 3:1 garantiza que
 * se distingan del fondo sin forzar colores irreconocibles de la marca.
 */

export type Rgb = [number, number, number]

export function hexToRgb(hex: string): Rgb {
  const value = parseInt(hex.replace('#', ''), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

export function rgbToHex([r, g, b]: Rgb): string {
  const channel = (c: number) =>
    Math.round(Math.min(255, Math.max(0, c)))
      .toString(16)
      .padStart(2, '0')
  return `#${channel(r)}${channel(g)}${channel(b)}`
}

export function relativeLuminance([r, g, b]: Rgb): number {
  const linear = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

export function contrastRatio(hexA: string, hexB: string): number {
  const a = relativeLuminance(hexToRgb(hexA))
  const b = relativeLuminance(hexToRgb(hexB))
  const [high, low] = a > b ? [a, b] : [b, a]
  return (high + 0.05) / (low + 0.05)
}

/** [h 0..360, s 0..1, l 0..1] */
type Hsl = [number, number, number]

function rgbToHsl([r, g, b]: Rgb): Hsl {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min
  const lightness = (max + min) / 2
  if (delta === 0) {
    return [0, 0, lightness]
  }
  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  let hue: number
  if (max === rn) {
    hue = ((gn - bn) / delta) % 6
  } else if (max === gn) {
    hue = (bn - rn) / delta + 2
  } else {
    hue = (rn - gn) / delta + 4
  }
  return [(hue * 60 + 360) % 360, saturation, lightness]
}

function hslToRgb([h, s, l]: Hsl): Rgb {
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - chroma / 2
  let rgb: [number, number, number]
  if (h < 60) {
    rgb = [chroma, x, 0]
  } else if (h < 120) {
    rgb = [x, chroma, 0]
  } else if (h < 180) {
    rgb = [0, chroma, x]
  } else if (h < 240) {
    rgb = [0, x, chroma]
  } else if (h < 300) {
    rgb = [x, 0, chroma]
  } else {
    rgb = [chroma, 0, x]
  }
  return [(rgb[0] + m) * 255, (rgb[1] + m) * 255, (rgb[2] + m) * 255]
}

/**
 * Devuelve el color de marca tal cual si ya contrasta con el fondo; si no,
 * ajusta SOLO la luminancia (tono y saturación intactos) en pasos de 1% hacia
 * el lado visible — aclara sobre fondos oscuros, oscurece sobre claros —
 * hasta alcanzar `minRatio`.
 */
export function ensureContrast(brandHex: string, backgroundHex: string, minRatio = 3): string {
  if (contrastRatio(brandHex, backgroundHex) >= minRatio) {
    return brandHex
  }
  const backgroundIsDark = relativeLuminance(hexToRgb(backgroundHex)) < 0.5
  const [hue, saturation, lightness] = rgbToHsl(hexToRgb(brandHex))
  let adjusted = lightness
  for (let step = 0; step < 100; step += 1) {
    adjusted += backgroundIsDark ? 0.01 : -0.01
    if (adjusted <= 0 || adjusted >= 1) {
      adjusted = Math.min(1, Math.max(0, adjusted))
      break
    }
    if (contrastRatio(rgbToHex(hslToRgb([hue, saturation, adjusted])), backgroundHex) >= minRatio) {
      break
    }
  }
  return rgbToHex(hslToRgb([hue, saturation, adjusted]))
}
