import { CONCEPT_GLYPHS } from '../components/techGlyphs'
import { DEVICON_ICONS } from './deviconIcons'
import { BRAND_ICONS } from './techIcons'

/** ¿La tecnología muestra icono en un chip mini? Los conceptos sin icono y
    los wordmarks (ilegibles a 14px) van como chip de texto; el monograma de
    TechIcon es solo red de seguridad. Compartido por los chips de Experience
    (Timeline) y las tarjetas de Projects. */
export const showsChipIcon = (name: string) => {
  if (BRAND_ICONS[name] || CONCEPT_GLYPHS[name]) {
    return true
  }
  const devicon = DEVICON_ICONS[name]
  return Boolean(devicon && !devicon.wordmark)
}
