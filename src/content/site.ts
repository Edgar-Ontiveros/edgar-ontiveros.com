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
  /** Logos de instituciones, por id de entrada de education.entries. */
  institutionLogos: {
    uach: '/logos/uach-ingenieria.webp',
  } as Record<string, string>,
} as const
