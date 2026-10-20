/** Cálculos de pantalla: toman lo que escribió el usuario y lo pasan por la lógica de `lib/calculos`. Funciones puras. */
import {
  CUENTAS_MVP,
  CUENTAS_USD,
  type CuentaAhorro,
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
import type { DatosTrm, EstadoApp, FormaDePago, IngresoInicial } from './tipos';

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

export interface ProyeccionAnual {
  cuenta: CuentaAhorro;
  mensual: number; // lo que se aparta cada mes (prima + cesantías)
  aportado: number; // lo que el usuario pone en 12 meses
  rendimiento: number; // lo que rinde la cuenta
  total: number; // aportado + rendimiento
}

/**
 * Cuánto tendría en un año quien aparta su prima y sus cesantías cada mes en la cuenta con la tasa más alta
 * (sin condiciones). El depósito va al final de cada mes y los rendimientos se capitalizan mensualmente,
 * igual que en la proyección de la pantalla de Ahorro. Antes de impuestos.
 */
export function proyeccionAnual(ingresoBrutoMes: number, cuentas: CuentaAhorro[] = CUENTAS_MVP): ProyeccionAnual {
  const cuenta = [...cuentas].sort((a, b) => b.tasaBaseEA - a.tasaBaseEA)[0];
  if (!cuenta) throw new Error('No hay cuentas para proyectar');
  const meses = Array.from({ length: 12 }, (_, i) => ({ mes: `2027-${String(i + 1).padStart(2, '0')}`, ingresoBrutoMes }));
  const ultima = proyectarPrestaciones(meses, cuenta.tasaBaseEA).at(-1)!;
  const total = ultima.saldoPrima + ultima.saldoCesantias;
  const mensual = ahorroMensual(ingresoBrutoMes).total;
  const aportado = mensual * 12;
  return { cuenta, mensual, aportado, rendimiento: total - aportado, total };
}

export interface ContextoDolar {
  tasa: number; // la que se usó para convertir
  propia: boolean; // true si es la tasa que el usuario dijo que le pagaron
  trmHoy: number;
  /** TRM de hoy frente a la de hace un mes (fracción); null si aún no hay historial. */
  variacionMes: number | null;
}

/** A qué dólar se convirtió el ingreso y cómo está frente al mes pasado (para saber si está alto o bajo). */
export function contextoDolar(ing: IngresoInicial, trm: DatosTrm | null): ContextoDolar | null {
  if (ing.moneda !== 'USD' || !trm) return null;
  const mes = trm.variaciones.find((v) => v.referencia === 'mes');
  return {
    tasa: ing.tasaRecibida ?? trm.hoy,
    propia: ing.tasaRecibida !== undefined,
    trmHoy: trm.hoy,
    variacionMes: mes ? mes.variacionPct : null,
  };
}

// ── Lo que lleva guardado ─────────────────────────────────────────────────

export interface MesAhorro {
  mes: string;
  sugerido: number; // lo que Frilo calcula que debía apartar ese mes (prima + cesantías)
  confirmado: number | null; // lo que la persona confirmó que apartó; null si no lo ha confirmado
}

export interface RetiroAhorro {
  bolsillo: Bolsillo;
  mes: string; // mes del cobro
  calculado: number; // lo que Frilo calcula que había apartado en ese bolsillo y se retiró
  confirmado: number; // la parte de lo confirmado por la persona que corresponde a ese bolsillo
}

export interface ResumenAhorro {
  meses: MesAhorro[];
  retiros: RetiroAhorro[];
  retiradoCalculado: number;
  retiradoConfirmado: number;
  /** Lo que Frilo calcula que debería llevar apartado, ya descontando lo que cobró. */
  totalCalculado: number;
  /** Lo que la persona confirmó, ya descontando lo que cobró. */
  totalConfirmado: number;
  /** Calculado − confirmado: positivo = le falta confirmar o apartar; negativo = apartó más de lo calculado. */
  diferencia: number;
  mesesSinConfirmar: number;
}

/** Prima y cesantías se calculan con la misma fracción: cada bolsillo es la mitad de lo apartado. */
const PARTE_DE_CADA_BOLSILLO = 0.5;

/** Primer mes del periodo en que se acumula cada bolsillo: semestre para la prima, año para las cesantías. */
export function inicioDelPeriodo(bolsillo: Bolsillo, mes: string): string {
  const anio = mes.slice(0, 4);
  const mm = Number(mes.slice(5, 7));
  return bolsillo === 'prima' ? `${anio}-${mm <= 6 ? '01' : '07'}` : `${anio}-01`;
}

/**
 * Compara lo que Frilo calcula que debería llevar apartado (con el ingreso guardado de cada mes)
 * con lo que la persona confirmó, descontando lo que ya cobró (prima o cesantías). Frilo no ve sus
 * cuentas: lo confirmado es una declaración suya.
 *
 * Al cobrar un bolsillo se descuenta su parte (la mitad) de lo apartado desde el cobro anterior del
 * mismo bolsillo, o desde el inicio del periodo, hasta el mes del cobro.
 */
export function resumenAhorro(
  ingresoBrutoMes: number,
  mesInicio: string,
  mesHoy: string,
  confirmados: { mes: string; monto: number }[],
  cobros: Cobro[] = [],
  /** Ingreso bruto (en pesos) de cada mes guardado. Un mes sin guardar toma el del último mes guardado anterior. */
  ingresosPorMes: Record<string, number> = {},
): ResumenAhorro {
  const guardados = Object.keys(ingresosPorMes).sort();
  const sugeridoDe = (mes: string): number => {
    const previo = guardados.filter((g) => g <= mes).at(-1) ?? guardados[0];
    const bruto = previo !== undefined ? ingresosPorMes[previo]! : ingresoBrutoMes;
    return ahorroMensual(bruto).total;
  };
  const sugerido = sugeridoDe(mesHoy);
  const porMes = new Map(confirmados.map((c) => [c.mes, c.monto]));
  const desde = mesInicio <= mesHoy ? mesInicio : mesHoy;
  const meses = rango(desde, mesHoy).map((mes): MesAhorro => ({ mes, sugerido: sugeridoDe(mes), confirmado: porMes.get(mes) ?? null }));

  const retiros: RetiroAhorro[] = [];
  const ordenados = [...cobros].filter((c) => c.mes <= mesHoy).sort((a, b) => a.mes.localeCompare(b.mes));
  for (const cobro of ordenados) {
    const periodo = inicioDelPeriodo(cobro.bolsillo, cobro.mes);
    const anterior = retiros.filter((r) => r.bolsillo === cobro.bolsillo && r.mes < cobro.mes && r.mes >= periodo).at(-1);
    const arranque = anterior ? mesSiguiente(anterior.mes) : periodo;
    const mesesConfirmables = rango(arranque, cobro.mes);
    const mesesCalculados = mesesConfirmables.filter((m) => m >= desde);
    retiros.push({
      bolsillo: cobro.bolsillo,
      mes: cobro.mes,
      calculado: mesesCalculados.reduce((suma, m) => suma + sugeridoDe(m), 0) * PARTE_DE_CADA_BOLSILLO,
      confirmado: mesesConfirmables.reduce((suma, m) => suma + (porMes.get(m) ?? 0), 0) * PARTE_DE_CADA_BOLSILLO,
    });
  }

  const retiradoCalculado = retiros.reduce((suma, r) => suma + r.calculado, 0);
  const retiradoConfirmado = retiros.reduce((suma, r) => suma + r.confirmado, 0);
  const totalCalculado = Math.max(0, meses.reduce((suma, m) => suma + m.sugerido, 0) - retiradoCalculado);
  // Cuenta todo lo confirmado, aunque sea de un mes anterior al inicio registrado.
  const totalConfirmado = Math.max(0, confirmados.reduce((suma, c) => suma + c.monto, 0) - retiradoConfirmado);
  return {
    meses,
    retiros,
    retiradoCalculado,
    retiradoConfirmado,
    totalCalculado,
    totalConfirmado,
    diferencia: totalCalculado - totalConfirmado,
    mesesSinConfirmar: meses.filter((m) => m.confirmado === null).length,
  };
}

// ── Guardar el mes ───────────────────────────────────────────────────────

/**
 * ¿Ya está guardado el mes de hoy? Cada mes guardado es un pago propio; los valores del ingreso
 * siempre son los del último mes guardado (`mesIngreso`, o el de registro si aún no hay otro).
 */
export function mesEstaGuardado(mesIngreso: string | undefined, mesInicio: string | undefined, mesHoy: string): boolean {
  const ultimo = mesIngreso ?? mesInicio;
  return !!ultimo && ultimo >= mesHoy;
}

/** Último mes con ingreso guardado (el que se copia si la persona guarda el mes tal cual). */
export const ultimoMesGuardado = (mesIngreso: string | undefined, mesInicio: string | undefined): string | undefined => mesIngreso ?? mesInicio;

// ── Cuentas destacadas ───────────────────────────────────────────────────

export interface CuentasDestacadas {
  /** La(s) cuenta(s) en pesos con la tasa más alta sin condiciones (varias si empatan). */
  pesos: CuentaAhorro[];
  /** La(s) cuenta(s) en dólares con la tasa más alta sin condiciones (varias si empatan). */
  dolares: CuentaAhorro[];
}

const masAltas = (cuentas: CuentaAhorro[]): CuentaAhorro[] => {
  const visibles = cuentas.filter((c) => c.verificada);
  const tope = Math.max(...visibles.map((c) => c.tasaBaseEA));
  return visibles.filter((c) => c.tasaBaseEA === tope);
};

/** Regla de Frilo: se destaca la cuenta en pesos y la cuenta en dólares con la tasa más alta sin condiciones. */
export function cuentasDestacadas(pesos: CuentaAhorro[] = CUENTAS_MVP, dolares: CuentaAhorro[] = CUENTAS_USD): CuentasDestacadas {
  return { pesos: masAltas(pesos), dolares: masAltas(dolares) };
}
