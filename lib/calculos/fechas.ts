/** Fechas como texto 'YYYY-MM-DD' en UTC: se comparan como strings y no sufren husos horarios. */
export type Fecha = string;

const aDate = (f: Fecha) => {
  const [a, m, d] = f.split('-').map(Number);
  return new Date(Date.UTC(a!, m! - 1, d!));
};
const aFecha = (d: Date): Fecha => d.toISOString().slice(0, 10);
const diasDelMes = (anio: number, mes0: number) => new Date(Date.UTC(anio, mes0 + 1, 0)).getUTCDate();

export function restarDias(f: Fecha, dias: number): Fecha {
  const d = aDate(f);
  d.setUTCDate(d.getUTCDate() - dias);
  return aFecha(d);
}

/** 31-mar menos 1 mes = 28/29-feb (se ajusta al último día del mes, no se desborda). */
export function restarMeses(f: Fecha, meses: number): Fecha {
  const d = aDate(f);
  const total = d.getUTCFullYear() * 12 + d.getUTCMonth() - meses;
  const anio = Math.floor(total / 12);
  const mes0 = total - anio * 12;
  const dia = Math.min(d.getUTCDate(), diasDelMes(anio, mes0));
  return aFecha(new Date(Date.UTC(anio, mes0, dia)));
}

export const restarAnios = (f: Fecha, anios: number) => restarMeses(f, anios * 12);

/** 'YYYY-MM' → mes siguiente. */
export function mesSiguiente(mes: string): string {
  const [a, m] = mes.split('-').map(Number);
  const total = a! * 12 + (m! - 1) + 1;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}`;
}
