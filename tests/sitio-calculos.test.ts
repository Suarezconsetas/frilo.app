import { describe, expect, it } from 'vitest';
import {
  aporteMensualParaMeta, calcularAportes, calcularAportesCuentaPropia, tiempoParaMeta, nominalAEfectiva, parametrosDe, reglaDel72, resultadoInteres, saldoFinal, tablaProyeccion,
} from '@/lib/calculos';

const P = parametrosDe(2026);

describe('aportes de independientes: caso del brief', () => {
  it('ingreso $8.000.000, riesgo I con ARL → total $928.700', () => {
    const r = calcularAportes({ ingresoBrutoMes: 8_000_000, clase: 1, incluirArl: true }, P);
    expect(r.ibc).toBe(3_200_000);
    expect(r.salud).toBe(400_000);
    expect(r.pension).toBe(512_000);
    expect(r.arl).toBe(16_700);
    expect(r.fsp).toBe(0);
    expect(r.totalUsuario).toBe(928_700);
  });
  it('valores derivados 2026: IBC máximo y FSP', () => {
    expect(P.smlmv * P.topeMaxIbcSmlmv).toBe(43_772_625);
    expect(P.smlmv * 4).toBe(7_003_620);
  });
});

describe('cuenta propia (Decreto 379 de 2026): el 40% sobre el ingreso neto', () => {
  it('descuenta los costos antes de aplicar el 40%', () => {
    const r = calcularAportesCuentaPropia({ ingresoBrutoMes: 10_000_000, costosMes: 4_000_000, clase: 1, incluirArl: false }, P);
    expect(r.ingresoNeto).toBe(6_000_000);
    expect(r.ibc).toBe(2_400_000);
    expect(r.salud).toBe(300_000);
    expect(r.pension).toBe(384_000);
    expect(r.totalUsuario).toBe(684_000);
  });
  it('sin costos coincide con el cálculo de un contratista', () => {
    const a = calcularAportesCuentaPropia({ ingresoBrutoMes: 8_000_000, costosMes: 0, clase: 1, incluirArl: true }, P);
    expect(a.totalUsuario).toBe(928_700);
  });
  it('el IBC nunca baja de un salario mínimo y los costos no pueden superar el ingreso', () => {
    const r = calcularAportesCuentaPropia({ ingresoBrutoMes: 3_000_000, costosMes: 9_000_000, clase: 1, incluirArl: false }, P);
    expect(r.ingresoNeto).toBe(0);
    expect(r.ibc).toBe(P.smlmv);
    expect(r.costos).toBe(3_000_000);
  });
});

describe('interés compuesto (casos del brief)', () => {
  const aporte = 1_332_800;
  it('aporte $1.332.800, 9% E.A., 12 meses → $16.643.072 (intereses $649.472)', () => {
    const r = resultadoInteres(0, aporte, 0.09, 12);
    expect(Math.round(r.saldo)).toBe(16_643_072);
    expect(Math.round(r.intereses)).toBe(649_472);
  });
  it('meta $20.000.000 en 12 meses → aporte $1.602.000', () => {
    expect(aporteMensualParaMeta(20_000_000, 0, 0.09, 12)).toBe(1_602_000);
  });
  it('meta $20.000.000 con $1.332.800 al mes → 15 meses (1 año y 3 meses)', () => {
    expect(tiempoParaMeta(20_000_000, 0, aporte, 0.09)).toBe(15);
  });
  it('la meta ya cumplida pide 0 y la imposible devuelve null', () => {
    expect(aporteMensualParaMeta(1_000_000, 2_000_000, 0.09, 12)).toBe(0);
    expect(tiempoParaMeta(1_000_000, 0, 0, 0.09)).toBeNull();
  });
  it('tasa nominal → efectiva y regla del 72', () => {
    expect(nominalAEfectiva(0.12, 12)).toBeCloseTo(0.126825, 6);
    expect(reglaDel72(0.09)).toBeCloseTo(8, 6);
  });
  it('retención opcional del 7% sobre los intereses', () => {
    const r = resultadoInteres(0, aporte, 0.09, 12, true);
    expect(r.interesesNetos).toBeCloseTo(r.intereses * 0.93, 6);
  });
  it('sin tasa solo suma los aportes y la tabla por año llega al plazo', () => {
    expect(saldoFinal(1_000_000, 100_000, 0, 10)).toBeCloseTo(2_000_000, 6);
    const t = tablaProyeccion(0, aporte, 0.09, 30, 12);
    expect(t.map((f) => f.periodo)).toEqual([1, 2, 2.5]);
  });
});
