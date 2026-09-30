/** Cálculos de pantalla: toman lo que escribió el usuario y lo pasan por la lógica de `lib/calculos`. Funciones puras. */
import {
  CUENTAS_MVP,
  ahorroMensual,
  mesSiguiente,
  parametrosDe,
  proyectarPrestaciones,
  resumenMes,
  type Bolsillo,
  type Cobro,
  type FilaProyeccion,
  type FuenteIngreso,
  type PagoMes,
  type ResumenMes,
} from '@/lib/calculos';
import type { EstadoApp, FormaDePago, IngresoInicial } from './tipos';

export const ANIO_PARAMETROS = 2026;

export function fuenteDe(ing: IngresoInicial): FuenteIngreso {
  if (ing.moneda === 'USD') {
    return { id: 'f1', nombre: ing.cliente, moneda: 'USD', tipoContrato: 'exterior', contratante: 'exterior' };
  }
  return {
    id: 'f1',
    nombre: ing.cliente,
    moneda: 'COP',
    tipoContrato: 'ops_mas_de_un_mes',
    contratante: ing.publico ? 'publico' : 'privado',
  };
}

export function pagoDe(ing: IngresoInicial): PagoMes {
  return { fuenteId: 'f1', monto: ing.monto, tasaRecibida: ing.tasaRecibida, retencionPracticada: ing.retencion };
}

/** El mes completo del usuario. `null` si falta la TRM para un ingreso en dólares. */
export function calcularMes(ing: IngresoInicial, arlVoluntaria: boolean, trm: number | null): ResumenMes | null {
  if (ing.moneda === 'USD' && trm === null) return null;
  return resumenMes(
    { fuentes: [fuenteDe(ing)], pagos: [pagoDe(ing)], trm, clase: ing.clase, arlVoluntariaActivada: arlVoluntaria },
    parametrosDe(ANIO_PARAMETROS),
  );
}

export interface Escenarios {
  conAhorro: { disponible: number; guardasAlMes: number; enUnAnio: number };
  sinAhorro: { disponible: number; guardasAlMes: number; enUnAnio: number };
  diferenciaMensual: number;
}

/** Con ahorro: se aparta 1/12 + 1/12. Sin ahorro: todo lo que sobra tras aportes queda disponible. */
export function escenarios(r: ResumenMes): Escenarios {
  const guardas = r.ahorroPrima + r.ahorroCesantias;
  const sinDisponible = r.disponible + guardas;
  return {
    conAhorro: { disponible: r.disponible, guardasAlMes: guardas, enUnAnio: guardas * 12 },
    sinAhorro: { disponible: sinDisponible, guardasAlMes: 0, enUnAnio: 0 },
    diferenciaMensual: guardas,
  };
}

export interface Segmento {
  clave: 'aportes' | 'prima' | 'cesantias' | 'disponible' | 'retencion';
  etiqueta: string;
  monto: number;
  fraccion: number; // sobre el ingreso bruto
}

/** Reparto del ingreso bruto. Si hubo retención (COP) aparece aparte: reduce lo disponible, no la base. */
export function reparto(r: ResumenMes, conAhorro: boolean): Segmento[] {
  const base = r.ingresoBrutoMes;
  const f = (m: number) => (base > 0 ? m / base : 0);
  const aportes = r.aportes.totalUsuario;
  const segs: Segmento[] = [{ clave: 'aportes', etiqueta: 'Aportes a seguridad social', monto: aportes, fraccion: f(aportes) }];
  if (r.retencion > 0) segs.push({ clave: 'retencion', etiqueta: 'Retención practicada', monto: r.retencion, fraccion: f(r.retencion) });
  if (conAhorro) {
    segs.push({ clave: 'prima', etiqueta: 'Prima', monto: r.ahorroPrima, fraccion: f(r.ahorroPrima) });
    segs.push({ clave: 'cesantias', etiqueta: 'Cesantías', monto: r.ahorroCesantias, fraccion: f(r.ahorroCesantias) });
  }
  const disponible = conAhorro ? r.disponible : r.disponible + r.ahorroPrima + r.ahorroCesantias;
  segs.push({ clave: 'disponible', etiqueta: 'Disponible para ti', monto: disponible, fraccion: f(disponible) });
  return segs;
}

export function dolarVisible(forma: FormaDePago | undefined, ing: IngresoInicial | undefined): boolean {
  return forma === 'usd' || forma === 'mixto' || ing?.moneda === 'USD';
}

// ── Prima y cesantías ────────────────────────────────────────────────────

/** Tasa con la que se proyecta: la más alta sin condiciones del comparador. */
export const tasaProyeccion = () => Math.max(...CUENTAS_MVP.map((c) => c.tasaBaseEA));

function rango(desde: string, hasta: string): string[] {
  const meses: string[] = [];
  for (let m = desde; m <= hasta; m = mesSiguiente(m)) meses.push(m);
  return meses;
}

export interface Bolsa {
  bolsillo: Bolsillo;
  periodo: string; // "Julio a diciembre"
  saldoHoy: number;
  saldoFinal: number;
  mesFinal: string; // mes en que se cierra el periodo
  avance: number; // 0–1: meses transcurridos del periodo
  disponibleEn: string | null; // cesantías: "febrero"
  cobradoEsteMes: boolean;
}

/**
 * Proyección suponiendo que recibe lo mismo cada mes desde que empezó en Frilo.
 * El saldo solo cuenta los meses que Frilo conoce; no inventa un historial anterior.
 */
export function bolsas(ingresoBrutoMes: number, mesHoy: string, mesInicio: string, cobros: Cobro[], tasaEA = tasaProyeccion()): Record<Bolsillo, Bolsa> {
  const anio = Number(mesHoy.slice(0, 4));
  const primerSemestre = Number(mesHoy.slice(5, 7)) <= 6;
  const iniPrima = `${anio}-${primerSemestre ? '01' : '07'}`;
  const finPrima = `${anio}-${primerSemestre ? '06' : '12'}`;
  const iniCes = `${anio}-01`;
  const finCes = `${anio}-12`;

  const armar = (bolsillo: Bolsillo, ini: string, fin: string, periodo: string, disponibleEn: string | null): Bolsa => {
    const desde = mesInicio > ini ? mesInicio : ini;
    const meses = rango(desde, fin).map((mes) => ({ mes, ingresoBrutoMes }));
    const cobrosDelPeriodo = cobros.filter((c) => c.bolsillo === bolsillo && c.mes >= ini && c.mes <= fin);
    const filas: FilaProyeccion[] = proyectarPrestaciones(meses, tasaEA, cobrosDelPeriodo);
    const saldo = (f: FilaProyeccion | undefined) => (f ? (bolsillo === 'prima' ? f.saldoPrima : f.saldoCesantias) : 0);
    const hoy = filas.find((f) => f.mes === mesHoy);
    const cobradoEsteMes = cobrosDelPeriodo.some((c) => c.mes === mesHoy);
    // Cobrar reinicia el bolsillo: el mes del cobro queda en cero y el siguiente arranca de nuevo.
    const saldoHoy = cobradoEsteMes ? 0 : saldo(hoy);
    const total = rango(ini, fin).length;
    const pasados = rango(ini, mesHoy).length;
    return {
      bolsillo,
      periodo,
      saldoHoy,
      saldoFinal: saldo(filas[filas.length - 1]),
      mesFinal: fin,
      avance: Math.min(1, pasados / total),
      disponibleEn,
      cobradoEsteMes,
    };
  };

  return {
    prima: armar('prima', iniPrima, finPrima, primerSemestre ? 'Enero a junio' : 'Julio a diciembre', null),
    cesantias: armar('cesantias', iniCes, finCes, 'Enero a diciembre', 'febrero'),
  };
}

/** Monto sobre el que se muestra el rendimiento del comparador: seis meses de ahorro. */
export function montoComparador(ingresoBrutoMes: number): { monto: number; dias: number; meses: number } {
  return { monto: ahorroMensual(ingresoBrutoMes).total * 6, dias: 182, meses: 6 };
}
