/** Idiomas soportados por el sitio. */
export type Language = 'en' | 'es'

/**
 * Contrato de todo el texto visible del sitio. `en.ts` y `es.ts` lo
 * implementan; TypeScript obliga a mantener ambos idiomas completos.
 */
export interface SiteContent {
  hero: {
    name: string
    tagline: string
  }
  ui: {
    themeToggle: {
      toLight: string
      toDark: string
    }
    languageToggle: {
      /** Nombre accesible del botón, escrito en el idioma destino. */
      label: string
      /** Código visible del idioma destino (p. ej. "ES"). */
      code: string
    }
  }
}
