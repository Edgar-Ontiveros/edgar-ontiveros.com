/** Datos del sitio independientes del idioma (marca, enlaces, assets). */
export const site = {
  monogram: 'EO·',
  email: 'edgarontiverosfm@gmail.com',
  /** Solo dígitos, para el enlace wa.me. */
  whatsappNumber: '526143139226',
  /** Formato legible, por si se muestra en la UI. */
  whatsappDisplay: '+52 614 313 9226',
  github: 'https://github.com/Edgar-Ontiveros',
  linkedin: 'https://www.linkedin.com/in/edgaronti',
  cvPdf: '/cv/edgar-ontiveros-cv.pdf',
  aboutPhoto: '/images/cv-photo.webp',
  /** Logos de organizaciones (instituciones y empresas), por id de entrada
      de education.entries / experience.roles. */
  orgLogos: {
    uach: '/logos/uach-ingenieria.webp',
    herinox: '/logos/herinox.webp',
    'safran-manufacturing': '/logos/safran.webp',
    'safran-intern': '/logos/safran.webp',
  } as Record<string, string>,
  /** Fotos de proyecto por id de puesto (experience.roles). El asset publicado
      lleva el crop del doc: excluye a la persona del fondo del original. */
  rolePhotos: {
    'safran-manufacturing': {
      thumb: '/images/safran-torque-thumb.webp',
      thumbWidth: 600,
      thumbHeight: 400,
      large: '/images/safran-torque-large.webp',
      largeWidth: 1080,
      largeHeight: 720,
    },
  } as Record<
    string,
    {
      thumb: string
      thumbWidth: number
      thumbHeight: number
      large: string
      largeWidth: number
      largeHeight: number
    }
  >,
} as const
