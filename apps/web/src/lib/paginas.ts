/**
 * Estado y fecha de edición de cada página. `construida` = ya existe con su contenido final (entra al sitemap y se indexa);
 * `borrador` = existe pero falta su diseño (noindex, fuera del sitemap); `pendiente` = aún no se ha construido.
 * La fecha es la de la última edición real del contenido (no la del build): se sube a mano al cambiar una página.
 */
export type EstadoPagina = 'construida' | 'borrador' | 'pendiente';

export const ESTADO_PAGINAS: Record<string, EstadoPagina> = {};

export const FECHA_EDICION: Record<string, string> = {};
/** Fecha de los textos aprobados (wireframes) cuando una página aún no tiene una propia. */
export const FECHA_CONTENIDO_BASE = '2026-10-20';

export const estadoDe = (id: string): EstadoPagina => ESTADO_PAGINAS[id] ?? 'pendiente';
export const fechaDe = (id: string): string => FECHA_EDICION[id] ?? FECHA_CONTENIDO_BASE;

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
/** `2026-10-20` → "20 de octubre de 2026". */
export function fechaLarga(iso: string): string {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[(m ?? 1) - 1]} de ${a}`;
}
