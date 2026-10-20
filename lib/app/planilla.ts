/**
 * Fecha límite de pago de la planilla PILA para independientes (Decreto 1990 de 2016, art. 3.2.2.1):
 * según los dos últimos dígitos del documento, es el día HÁBIL N del mes. Los independientes cotizan mes vencido
 * (Decreto 1273 de 2018): en el mes M pagan los aportes del mes M-1. Funciones puras, sin red.
 */

const pad = (n: number) => String(n).padStart(2, '0');
export const aIso = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const crear = (anio: number, mes: number, dia: number) => new Date(Date.UTC(anio, mes - 1, dia));
const sumar = (d: Date, dias: number) => new Date(d.getTime() + dias * 86_400_000);

/** Domingo de Pascua (algoritmo de Meeus/Jones/Butcher). */
export function pascua(anio: number): Date {
  const a = anio % 19;
  const b = Math.floor(anio / 100);
  const c = anio % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return crear(anio, mes, dia);
}

/** Pasa al lunes siguiente si no cae lunes (Ley 51 de 1983, "ley Emiliani"). */
function alLunes(d: Date): Date {
  const dow = d.getUTCDay(); // 0 domingo … 6 sábado
  return dow === 1 ? d : sumar(d, (8 - dow) % 7);
}

const cache = new Map<number, Set<string>>();

/** Festivos de Colombia de un año (`YYYY-MM-DD`): fijos, trasladados a lunes y los que dependen de la Semana Santa. */
export function festivosCo(anio: number): Set<string> {
  const guardado = cache.get(anio);
  if (guardado) return guardado;
  const p = pascua(anio);
  const f: Date[] = [
    // fijos
    crear(anio, 1, 1), crear(anio, 5, 1), crear(anio, 7, 20), crear(anio, 8, 7), crear(anio, 12, 8), crear(anio, 12, 25),
    // trasladados al lunes
    alLunes(crear(anio, 1, 6)), alLunes(crear(anio, 3, 19)), alLunes(crear(anio, 6, 29)), alLunes(crear(anio, 8, 15)),
    alLunes(crear(anio, 10, 12)), alLunes(crear(anio, 11, 1)), alLunes(crear(anio, 11, 11)),
    // Semana Santa
    sumar(p, -3), sumar(p, -2),
    alLunes(sumar(p, 39)), // Ascensión
    alLunes(sumar(p, 60)), // Corpus Christi
    alLunes(sumar(p, 68)), // Sagrado Corazón
  ];
  const set = new Set(f.map(aIso));
  cache.set(anio, set);
  return set;
}

export function esHabil(d: Date): boolean {
  const dow = d.getUTCDay();
  return dow !== 0 && dow !== 6 && !festivosCo(d.getUTCFullYear()).has(aIso(d));
}

/** Día hábil del mes (1–16) que corresponde a los dos últimos dígitos del documento. */
export function diaHabilDe(digitos: string): number {
  if (!/^\d{2}$/.test(digitos)) throw new Error('Se necesitan los dos últimos dígitos del documento');
  const n = Number(digitos);
  const topes = [7, 14, 21, 28, 35, 42, 49, 56, 63, 69, 75, 81, 87, 93, 99]; // día hábil 2, 3, … 16
  return 2 + topes.findIndex((t) => n <= t);
}

/** Fecha límite (`YYYY-MM-DD`) del mes `mes` (1–12): el día hábil N contando desde el primero del mes. */
export function fechaLimitePago(digitos: string, anio: number, mes: number): string {
  let faltan = diaHabilDe(digitos);
  for (let d = crear(anio, mes, 1); ; d = sumar(d, 1)) {
    if (esHabil(d)) faltan -= 1;
    if (faltan === 0) return aIso(d);
  }
}

/** La fecha `n` días hábiles antes de `fecha`. */
export function diasHabilesAntes(fecha: string, n: number): string {
  let d = new Date(`${fecha}T00:00:00Z`);
  let faltan = n;
  while (faltan > 0) {
    d = sumar(d, -1);
    if (esHabil(d)) faltan -= 1;
  }
  return aIso(d);
}

/** Próxima fecha límite desde `hoy` (incluida): la de este mes si aún no pasó, o la del mes siguiente. */
export function proximaFechaLimite(digitos: string, hoy: string): { fecha: string; mes: string } {
  const anio = Number(hoy.slice(0, 4));
  const mes = Number(hoy.slice(5, 7));
  const esteMes = fechaLimitePago(digitos, anio, mes);
  if (esteMes >= hoy) return { fecha: esteMes, mes: `${anio}-${pad(mes)}` };
  const [a2, m2] = mes === 12 ? [anio + 1, 1] : [anio, mes + 1];
  return { fecha: fechaLimitePago(digitos, a2, m2), mes: `${a2}-${pad(m2)}` };
}

export type TipoRecordatorio = 'previo' | 'dia';

/** ¿Hoy toca avisar? `dia` el mismo día de la fecha límite; `previo` N días hábiles antes. */
export function recordatorioDeHoy(digitos: string, hoy: string, diasAnticipacion: number): { tipo: TipoRecordatorio; fechaLimite: string; periodo: string } | null {
  const anio = Number(hoy.slice(0, 4));
  const mes = Number(hoy.slice(5, 7));
  const fechaLimite = fechaLimitePago(digitos, anio, mes);
  const periodo = `${anio}-${pad(mes)}`;
  if (hoy === fechaLimite) return { tipo: 'dia', fechaLimite, periodo };
  if (diasAnticipacion > 0 && hoy === diasHabilesAntes(fechaLimite, diasAnticipacion)) return { tipo: 'previo', fechaLimite, periodo };
  return null;
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** `2026-11-24` → "martes 24 de noviembre". */
export function fechaConDia(fecha: string): string {
  const d = new Date(`${fecha}T00:00:00Z`);
  return `${DIAS[d.getUTCDay()]} ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`;
}

/** Mes anterior (`YYYY-MM`): el que se paga en la planilla de este mes. */
export function mesAnterior(mes: string): string {
  const a = Number(mes.slice(0, 4));
  const m = Number(mes.slice(5, 7));
  return m === 1 ? `${a - 1}-12` : `${a}-${pad(m - 1)}`;
}
