/** Fecha de hoy en Colombia (`YYYY-MM-DD`), sin depender de la zona horaria del equipo o del servidor. */
export function hoyColombia(ahora = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(ahora);
}

/** `2026-09-24` → `2026-09`. */
export const mesDe = (fecha: string) => fecha.slice(0, 7);

/** true si `fecha` (YYYY-MM-DD) es el último día de su mes. */
export function esUltimoDiaDelMes(fecha: string): boolean {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.getUTCDate() === 1;
}
