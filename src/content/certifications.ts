/**
 * Certificaciones, extraídas de los documentos en raw-assets/certificaciones/
 * (publicados en public/certificaciones/). Títulos y emisores tal como
 * aparecen en cada certificado: no se traducen.
 *
 * Ordenadas de más reciente a más antigua (por `date`, la fecha del documento).
 * Las vistas previas se generan con `npm run certs:previews` (las dimensiones
 * de abajo salen de lo que imprime ese script).
 */
export interface CertificationPreview {
  thumb: string
  large: string
  thumbWidth: number
  thumbHeight: number
  largeWidth: number
  largeHeight: number
}

export interface Certification {
  title: string
  issuer: string
  year: number
  /** Fecha del certificado en ISO, para mantener el orden. */
  date: string
  /** Nombre del PDF en public/certificaciones/. */
  file: string
  preview: CertificationPreview
}

const PREVIEW_DIR = '/certificaciones/preview'

function preview(base: string, width: number, height: number): CertificationPreview {
  return {
    thumb: `${PREVIEW_DIR}/${base}-thumb.webp`,
    large: `${PREVIEW_DIR}/${base}-large.webp`,
    thumbWidth: 600,
    thumbHeight: Math.round((600 / width) * height),
    largeWidth: width,
    largeHeight: height,
  }
}

export const CERTIFICATIONS: Certification[] = [
  {
    title: 'Fundamentos de Ingeniería de Software',
    issuer: 'Platzi',
    year: 2026,
    date: '2026-08-18',
    file: '2026-fundamentos-ingenieria-software.pdf',
    preview: preview('2026-fundamentos-ingenieria-software', 1400, 1082),
  },
  {
    title: 'Docker Avanzado',
    issuer: 'Platzi',
    year: 2026,
    date: '2026-08-11',
    file: '2026-docker-avanzado.pdf',
    preview: preview('2026-docker-avanzado', 1400, 1082),
  },
  {
    title: 'Docker: Fundamentos',
    issuer: 'Platzi',
    year: 2026,
    date: '2026-07-17',
    file: '2026-docker-fundamentos.pdf',
    preview: preview('2026-docker-fundamentos', 1400, 1082),
  },
  {
    title: 'FastAPI',
    issuer: 'Platzi',
    year: 2026,
    date: '2026-06-02',
    file: '2026-fastapi.pdf',
    preview: preview('2026-fastapi', 1400, 1082),
  },
  {
    title: 'Introducción al Desarrollo Backend',
    issuer: 'Platzi',
    year: 2026,
    date: '2026-05-21',
    file: '2026-introduccion-desarrollo-backend.pdf',
    preview: preview('2026-introduccion-desarrollo-backend', 1400, 1082),
  },
  {
    title: 'Git y GitHub',
    issuer: 'Platzi',
    year: 2026,
    date: '2026-05-20',
    file: '2026-git-github.pdf',
    preview: preview('2026-git-github', 1400, 1082),
  },
  {
    title: 'Python para Data Science & Machine Learning en 18 Días',
    issuer: 'Udemy',
    year: 2026,
    date: '2026-05-14',
    file: '2026-python-data-science-machine-learning.pdf',
    preview: preview('2026-python-data-science-machine-learning', 1400, 1042),
  },
  {
    title: 'Python TOTAL - Programador Avanzado en 16 días',
    issuer: 'Udemy',
    year: 2025,
    date: '2025-11-19',
    file: '2025-python-total.pdf',
    preview: preview('2025-python-total', 1400, 1042),
  },
  {
    title: 'SQL TOTAL - Domina Bases de Datos de 0 a Avanzado en 12 Días',
    issuer: 'Udemy',
    year: 2025,
    date: '2025-07-21',
    file: '2025-sql-total.pdf',
    preview: preview('2025-sql-total', 1400, 1042),
  },
  {
    title: 'Power BI TOTAL en 14 Días - Analista de Datos Avanzado',
    issuer: 'Udemy',
    year: 2025,
    date: '2025-06-09',
    file: '2025-power-bi-total.pdf',
    preview: preview('2025-power-bi-total', 1400, 1042),
  },
]
