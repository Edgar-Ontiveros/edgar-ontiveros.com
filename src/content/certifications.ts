/**
 * Certificaciones, extraídas de los documentos en raw-assets/certificaciones/
 * (publicados en public/certificaciones/). Títulos y emisores tal como
 * aparecen en cada certificado: no se traducen.
 *
 * Ordenadas de más reciente a más antigua (por `date`, la fecha del documento).
 */
export interface Certification {
  title: string
  issuer: string
  year: number
  /** Fecha del certificado en ISO, para mantener el orden. */
  date: string
  /** Nombre del PDF en public/certificaciones/. */
  file: string
}

export const CERTIFICATIONS: Certification[] = [
  {
    title: 'Docker Avanzado',
    issuer: 'Platzi',
    year: 2026,
    date: '2026-08-11',
    file: '2026-docker-avanzado.pdf',
  },
  {
    title: 'Docker: Fundamentos',
    issuer: 'Platzi',
    year: 2026,
    date: '2026-07-17',
    file: '2026-docker-fundamentos.pdf',
  },
  {
    title: 'FastAPI',
    issuer: 'Platzi',
    year: 2026,
    date: '2026-06-02',
    file: '2026-fastapi.pdf',
  },
  {
    title: 'Introducción al Desarrollo Backend',
    issuer: 'Platzi',
    year: 2026,
    date: '2026-05-21',
    file: '2026-introduccion-desarrollo-backend.pdf',
  },
  {
    title: 'Git y GitHub',
    issuer: 'Platzi',
    year: 2026,
    date: '2026-05-20',
    file: '2026-git-github.pdf',
  },
  {
    title: 'Python para Data Science & Machine Learning en 18 Días',
    issuer: 'Udemy',
    year: 2026,
    date: '2026-05-14',
    file: '2026-python-data-science-machine-learning.pdf',
  },
  {
    title: 'Python TOTAL - Programador Avanzado en 16 días',
    issuer: 'Udemy',
    year: 2025,
    date: '2025-11-19',
    file: '2025-python-total.pdf',
  },
  {
    title: 'SQL TOTAL - Domina Bases de Datos de 0 a Avanzado en 12 Días',
    issuer: 'Udemy',
    year: 2025,
    date: '2025-07-21',
    file: '2025-sql-total.pdf',
  },
  {
    title: 'Power BI TOTAL en 14 Días - Analista de Datos Avanzado',
    issuer: 'Udemy',
    year: 2025,
    date: '2025-06-09',
    file: '2025-power-bi-total.pdf',
  },
]
