/**
 * Trabajos de investigación, según docs/estructura-portfolio.md (sección
 * "7 · Research"). Datos sin idioma: los textos por trabajo viven en
 * en.ts/es.ts indexados por ResearchId.
 *
 * Las imágenes se generan con `python3 scripts/generate_research_images.py`
 * (rasteriza los pósters difuminando los correos con matrícula, y produce los
 * dos tamaños WebP; las dimensiones de abajo salen de lo que imprime ese
 * script). Los PDFs originales de los pósters NO se publican: contienen los
 * correos sin difuminar.
 */
export const RESEARCH_IDS = ['melanoma', 'fresnel', 'raman'] as const

export type ResearchId = (typeof RESEARCH_IDS)[number]

export interface ResearchAsset {
  /** Las fotos se recortan a la proporción de la tarjeta (cover); los
      documentos (pósters, constancias) se muestran completos (contain). */
  kind: 'photo' | 'document'
  thumb: string
  thumbWidth: number
  thumbHeight: number
  large: string
  largeWidth: number
  largeHeight: number
}

export interface ResearchProject {
  id: ResearchId
  /** Material en el orden en que navega el visor; el primero es la imagen
      principal de la tarjeta y el resto la fila de evidencia. */
  media: ResearchAsset[]
}

const IMAGE_DIR = '/images/research'

function asset(
  kind: ResearchAsset['kind'],
  base: string,
  thumbWidth: number,
  thumbHeight: number,
  largeWidth: number,
  largeHeight: number,
): ResearchAsset {
  return {
    kind,
    thumb: `${IMAGE_DIR}/${base}-thumb.webp`,
    thumbWidth,
    thumbHeight,
    large: `${IMAGE_DIR}/${base}-large.webp`,
    largeWidth,
    largeHeight,
  }
}

export const RESEARCH_PROJECTS: ResearchProject[] = [
  {
    id: 'melanoma',
    media: [
      asset('photo', 'melanoma-presentacion', 600, 338, 1600, 900),
      asset('document', 'verano-reconocimiento', 600, 464, 800, 618),
    ],
  },
  {
    id: 'fresnel',
    media: [
      asset('photo', 'congreso-presentacion', 600, 750, 1280, 1600),
      asset('document', 'poster-fresnel', 600, 849, 2000, 2828),
      asset('document', 'congreso-certificado', 362, 501, 362, 501),
      asset('document', 'congreso-constancia-poster', 600, 777, 994, 1287),
    ],
  },
  {
    id: 'raman',
    media: [asset('document', 'poster-raman', 600, 849, 2000, 2828)],
  },
]
