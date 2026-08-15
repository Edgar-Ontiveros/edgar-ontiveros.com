import type { ReactNode } from 'react'

/* Glifos propios para conceptos sin logo oficial (SQL, Forecasting, REST APIs)
   y marcas sin logo disponible en simple-icons ni Devicon (Power BI, Alembic,
   mypy). Mismo lenguaje visual que icons.tsx: trazo 2, puntas redondeadas,
   en --accent. Alembic usa un matraz (el proyecto toma su nombre del
   alambique); mypy, un escudo con check (verificación de tipos). */
export const CONCEPT_GLYPHS: Record<string, ReactNode> = {
  SQL: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </>
  ),
  Forecasting: (
    <>
      <path d="M3 3v18h18" />
      <path d="m7 15 4-4 3 3 5-6" />
    </>
  ),
  'REST APIs': (
    <>
      <path d="m8 6-6 6 6 6" />
      <path d="m16 6 6 6-6 6" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  'Power BI': (
    <>
      <path d="M3 3v18h18" />
      <path d="M8 17v-3" />
      <path d="M13 17V5" />
      <path d="M18 17V9" />
    </>
  ),
  Alembic: (
    <>
      <path d="M10 2v7.53a2 2 0 0 1-.21.9L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.07-10.13a2 2 0 0 1-.21-.89V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16h10" />
    </>
  ),
  mypy: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
}
