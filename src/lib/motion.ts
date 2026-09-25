/**
 * Clases del "hover lift": la pieza sube ~3 px con sombra suave (shadow-lift,
 * teñida de acento) y borde de acento, tanto en hover como con foco de
 * teclado. Con prefers-reduced-motion no hay transición ni desplazamiento
 * (el borde de acento sí cambia: sigue siendo la señal de foco/hover).
 */
const liftBase =
  'transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-[3px] hover:border-accent hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0'

/** Elemento focusable en sí (botón, enlace): paridad con focus-visible. */
export const liftClasses = `${liftBase} focus-visible:-translate-y-[3px] focus-visible:border-accent focus-visible:shadow-lift motion-reduce:focus-visible:translate-y-0`

/** Contenedor cuyo control focusable está dentro (tarjeta): paridad con
    :has(:focus-visible). */
export const liftWithinClasses = `${liftBase} has-[:focus-visible]:-translate-y-[3px] has-[:focus-visible]:border-accent has-[:focus-visible]:shadow-lift motion-reduce:has-[:focus-visible]:translate-y-0`
