import { bolsas, calcularMes, contextoDolar, dolarVisible, escenarios, inicioDelPeriodo, proyeccionAnual, reparto, resumenAhorro } from '@/lib/app/derivados';
import type { IngresoInicial } from '@/lib/app/tipos';

const usd1750: IngresoInicial = { cliente: 'Acme Inc.', moneda: 'USD', monto: 1750, clase: 1, publico: false };

describe('calcularMes', () => {
  it('USD 1.750 a TRM 4.000 reproduce el ejemplo del diseño', () => {
    const r = calcularMes(usd1750, false, 4000)!;
    expect(r.ingresoBrutoMes).toBe(7_000_000);
    expect(r.aportes.ibc).toBe(2_800_000);
    expect(r.aportes.totalUsuario).toBe(798_000); // salud 350.000 + pensión 448.000
    expect(Math.round(r.ahorroPrima)).toBe(583_333);
    expect(Math.round(r.disponible)).toBe(5_035_333);
  });
  it('ARL voluntaria suma al total', () => {
    const r = calcularMes(usd1750, true, 4000)!;
    expect(r.aportes.arl).toBe(14_600);
    expect(r.aportes.totalUsuario).toBe(812_600);
  });
  it('sin TRM no calcula un ingreso en dólares', () => {
    expect(calcularMes(usd1750, false, null)).toBeNull();
  });
  it('en pesos no necesita TRM y la retención reduce lo disponible, no la base', () => {
    const cop: IngresoInicial = { cliente: 'Empresa', moneda: 'COP', monto: 5_000_000, retencion: 200_000, clase: 1, publico: false };
    const sin = calcularMes({ ...cop, retencion: undefined }, false, null)!;
    const con = calcularMes(cop, false, null)!;
    expect(con.aportes.ibc).toBe(sin.aportes.ibc);
    expect(sin.disponible - con.disponible).toBe(200_000);
  });
});

describe('escenarios y reparto', () => {
  const r = calcularMes(usd1750, false, 4000)!;
  it('sin ahorro deja disponible todo lo que sobra tras los aportes', () => {
    const e = escenarios(r);
    expect(Math.round(e.sinAhorro.disponible)).toBe(6_202_000);
    expect(Math.round(e.conAhorro.guardasAlMes)).toBe(1_166_667);
    expect(Math.round(e.conAhorro.enUnAnio)).toBe(14_000_000);
    expect(Math.round(e.diferenciaMensual)).toBe(1_166_667);
  });
  it('el reparto con ahorro suma 100% del ingreso', () => {
    const suma = reparto(r, true).reduce((s, x) => s + x.fraccion, 0);
    expect(suma).toBeCloseTo(1, 10);
    expect(reparto(r, false).map((s) => s.clave)).toEqual(['aportes', 'disponible']);
    expect(reparto(r, false).reduce((s, x) => s + x.fraccion, 0)).toBeCloseTo(1, 10);
  });
  it('la retención aparece como un segmento propio y el total sigue en 100%', () => {
    const cop: IngresoInicial = { cliente: 'E', moneda: 'COP', monto: 5_000_000, retencion: 200_000, clase: 1, publico: false };
    const rc = calcularMes(cop, false, null)!;
    const segs = reparto(rc, true);
    expect(segs.map((s) => s.clave)).toContain('retencion');
    expect(segs.reduce((s, x) => s + x.fraccion, 0)).toBeCloseTo(1, 10);
  });
});

describe('dolarVisible', () => {
  it('quien gana solo en pesos no ve la pestaña Dólar', () => {
    expect(dolarVisible('cop', undefined)).toBe(false);
    expect(dolarVisible('usd', undefined)).toBe(true);
    expect(dolarVisible('mixto', undefined)).toBe(true);
  });
});

describe('bolsas de prima y cesantías', () => {
  it('en septiembre, empezando ese mes: un solo mes apartado', () => {
    const b = bolsas(7_000_000, '2026-09', '2026-09', []);
    expect(b.prima.periodo).toBe('Julio a diciembre');
    expect(Math.round(b.prima.saldoHoy)).toBe(583_333);
    expect(b.prima.mesFinal).toBe('2026-12');
    expect(b.prima.saldoFinal).toBeGreaterThan(583_333 * 4); // 4 depósitos + rendimientos
    expect(b.prima.avance).toBeCloseTo(3 / 6);
    expect(b.cesantias.disponibleEn).toBe('febrero');
    expect(b.cesantias.avance).toBeCloseTo(9 / 12);
  });
  it('marcar la prima como cobrada reinicia ese bolsillo y no toca las cesantías', () => {
    const sin = bolsas(7_000_000, '2026-09', '2026-07', []);
    const con = bolsas(7_000_000, '2026-09', '2026-07', [{ mes: '2026-09', bolsillo: 'prima' }]);
    expect(sin.prima.saldoHoy).toBeGreaterThan(0);
    expect(con.prima.saldoHoy).toBe(0);
    expect(con.prima.cobradoEsteMes).toBe(true);
    expect(con.cesantias.saldoHoy).toBe(sin.cesantias.saldoHoy);
  });
  it('en el primer semestre el periodo de la prima es enero a junio', () => {
    expect(bolsas(1_000_000, '2026-03', '2026-03', []).prima.periodo).toBe('Enero a junio');
  });
});

describe('proyeccionAnual', () => {
  it('usa la cuenta de mayor tasa y suma 12 depósitos con sus rendimientos', () => {
    const p = proyeccionAnual(9_938_520);
    expect(p.cuenta.id).toBe('lulo-flex'); // 9,50% E.A., la más alta sin condiciones
    expect(p.mensual).toBeCloseTo(1_656_420, 0);
    expect(p.aportado).toBeCloseTo(19_877_040, 0); // 2 ingresos mensuales al año
    // anualidad vencida: d · ((1+i)^12 − 1) / i, con i la tasa mensual equivalente a 9,5% E.A.
    const i = Math.pow(1.095, 1 / 12) - 1;
    expect(p.total).toBeCloseTo(1_656_420 * ((Math.pow(1 + i, 12) - 1) / i), 0);
    expect(p.rendimiento).toBeGreaterThan(0);
    expect(p.total).toBeCloseTo(p.aportado + p.rendimiento, 5);
  });
  it('la proyección es proporcional al ingreso', () => {
    const a = proyeccionAnual(5_000_000);
    const b = proyeccionAnual(10_000_000);
    expect(b.total / a.total).toBeCloseTo(2, 8);
  });
});

describe('contextoDolar', () => {
  const trm = { fecha: '2026-10-01', hoy: 3312.84, variaciones: [{ referencia: 'mes' as const, fecha: '2026-09-01', trm: 3202.79, variacionAbs: 110.05, variacionPct: 0.0344 }] };
  it('sin tasa propia se convierte a la TRM de hoy', () => {
    expect(contextoDolar(usd1750, trm)).toEqual({ tasa: 3312.84, propia: false, trmHoy: 3312.84, variacionMes: 0.0344 });
  });
  it('con tasa propia muestra esa tasa y deja la TRM de hoy como referencia', () => {
    expect(contextoDolar({ ...usd1750, tasaRecibida: 3300 }, trm)).toMatchObject({ tasa: 3300, propia: true, trmHoy: 3312.84 });
  });
  it('quien gana en pesos, o no tiene TRM, no ve contexto del dólar', () => {
    expect(contextoDolar({ ...usd1750, moneda: 'COP' }, trm)).toBeNull();
    expect(contextoDolar(usd1750, null)).toBeNull();
  });
  it('sin historial del mes no inventa la variación', () => {
    expect(contextoDolar(usd1750, { ...trm, variaciones: [] })?.variacionMes).toBeNull();
  });
});

describe('resumenAhorro', () => {
  const ingreso = 9_938_520; // ahorra 1.656.420 al mes
  it('sin confirmaciones, lo calculado crece mes a mes y todo queda pendiente', () => {
    const r = resumenAhorro(ingreso, '2026-08', '2026-10', []);
    expect(r.meses.map((m) => m.mes)).toEqual(['2026-08', '2026-09', '2026-10']);
    expect(r.totalCalculado).toBeCloseTo(1_656_420 * 3, 0);
    expect(r.totalConfirmado).toBe(0);
    expect(r.diferencia).toBeCloseTo(1_656_420 * 3, 0);
    expect(r.mesesSinConfirmar).toBe(3);
  });
  it('suma lo que la persona confirmó, aunque sea otro monto', () => {
    const r = resumenAhorro(ingreso, '2026-08', '2026-10', [
      { mes: '2026-08', monto: 1_656_420 },
      { mes: '2026-09', monto: 1_000_000 },
    ]);
    expect(r.totalConfirmado).toBe(2_656_420);
    expect(r.mesesSinConfirmar).toBe(1);
    expect(r.meses[1]).toMatchObject({ mes: '2026-09', confirmado: 1_000_000 });
    expect(r.meses[2]).toMatchObject({ mes: '2026-10', confirmado: null });
    expect(r.diferencia).toBeCloseTo(1_656_420 * 3 - 2_656_420, 0);
  });
  it('si apartó más de lo calculado, la diferencia es negativa', () => {
    const r = resumenAhorro(ingreso, '2026-10', '2026-10', [{ mes: '2026-10', monto: 2_000_000 }]);
    expect(r.diferencia).toBeLessThan(0);
    expect(r.mesesSinConfirmar).toBe(0);
  });
  it('si el inicio es posterior al mes de hoy, usa solo el mes de hoy', () => {
    const r = resumenAhorro(ingreso, '2026-12', '2026-10', []);
    expect(r.meses.map((m) => m.mes)).toEqual(['2026-10']);
  });
  it('lo confirmado de un mes anterior al inicio también se cuenta', () => {
    const r = resumenAhorro(ingreso, '2026-10', '2026-10', [{ mes: '2026-07', monto: 500_000 }]);
    expect(r.totalConfirmado).toBe(500_000);
    expect(r.meses).toHaveLength(1);
  });
});

describe('resumenAhorro con cobros (descuento de retiros)', () => {
  const ingreso = 9_938_520; // 1.656.420 al mes: 828.210 prima + 828.210 cesantías
  const mensual = 1_656_420;
  const conf = (meses: string[], monto = mensual) => meses.map((mes) => ({ mes, monto }));

  it('el periodo de la prima es el semestre y el de las cesantías, el año', () => {
    expect(inicioDelPeriodo('prima', '2026-09')).toBe('2026-07');
    expect(inicioDelPeriodo('prima', '2026-03')).toBe('2026-01');
    expect(inicioDelPeriodo('cesantias', '2026-09')).toBe('2026-01');
  });
  it('al cobrar la prima se descuenta su mitad de lo apartado en el semestre', () => {
    const r = resumenAhorro(ingreso, '2026-07', '2026-09', conf(['2026-07', '2026-08', '2026-09']), [{ mes: '2026-09', bolsillo: 'prima' }]);
    expect(r.retiros).toHaveLength(1);
    expect(r.retiradoConfirmado).toBeCloseTo(mensual * 3 * 0.5, 0);
    expect(r.retiradoCalculado).toBeCloseTo(mensual * 3 * 0.5, 0);
    expect(r.totalConfirmado).toBeCloseTo(mensual * 3 * 0.5, 0);
    expect(r.totalCalculado).toBeCloseTo(mensual * 3 * 0.5, 0);
    expect(r.diferencia).toBeCloseTo(0, 0);
  });
  it('descuenta lo confirmado de verdad, no solo lo calculado', () => {
    const r = resumenAhorro(ingreso, '2026-07', '2026-09', [{ mes: '2026-07', monto: 1_000_000 }], [{ mes: '2026-09', bolsillo: 'prima' }]);
    expect(r.retiradoConfirmado).toBeCloseTo(500_000, 0); // la mitad de lo confirmado
    expect(r.totalConfirmado).toBeCloseTo(500_000, 0);
    expect(r.totalCalculado).toBeCloseTo(mensual * 3 * 0.5, 0);
  });
  it('un cobro de otro semestre no descuenta lo del semestre actual', () => {
    const r = resumenAhorro(ingreso, '2026-01', '2026-09', conf(['2026-07', '2026-08', '2026-09']), [{ mes: '2026-06', bolsillo: 'prima' }]);
    // enero a junio (6 meses calculados) se descuentan; de lo confirmado solo hay meses del segundo semestre
    expect(r.retiradoCalculado).toBeCloseTo(mensual * 6 * 0.5, 0);
    expect(r.retiradoConfirmado).toBe(0);
    expect(r.totalConfirmado).toBeCloseTo(mensual * 3, 0);
  });
  it('un segundo cobro del mismo bolsillo solo descuenta lo apartado después del primero', () => {
    const r = resumenAhorro(ingreso, '2026-07', '2026-09', conf(['2026-07', '2026-08', '2026-09']), [
      { mes: '2026-08', bolsillo: 'prima' },
      { mes: '2026-09', bolsillo: 'prima' },
    ]);
    expect(r.retiros[0]!.confirmado).toBeCloseTo(mensual * 2 * 0.5, 0); // julio y agosto
    expect(r.retiros[1]!.confirmado).toBeCloseTo(mensual * 1 * 0.5, 0); // solo septiembre
  });
  it('los totales no quedan negativos y sin cobros todo sigue igual', () => {
    const sin = resumenAhorro(ingreso, '2026-09', '2026-09', conf(['2026-09']));
    expect(sin.retiros).toEqual([]);
    expect(sin.totalConfirmado).toBeCloseTo(mensual, 0);
    const r = resumenAhorro(ingreso, '2026-09', '2026-09', [], [{ mes: '2026-09', bolsillo: 'prima' }, { mes: '2026-09', bolsillo: 'cesantias' }]);
    expect(r.totalConfirmado).toBeGreaterThanOrEqual(0);
    expect(r.totalCalculado).toBeGreaterThanOrEqual(0);
  });
});

describe('resumenAhorro con el ingreso de cada mes', () => {
  it('cada mes guardado usa su propio ingreso y un mes sin guardar toma el último guardado', () => {
    const r = resumenAhorro(5_000_000, '2026-08', '2026-10', [], [], { '2026-08': 4_000_000, '2026-10': 6_000_000 });
    const por = Object.fromEntries(r.meses.map((m) => [m.mes, m.sugerido]));
    expect(por['2026-08']).toBeCloseTo(4_000_000 / 6, 0); // 16,67 %
    expect(por['2026-09']).toBe(por['2026-08']);
    expect(por['2026-10']).toBeCloseTo(1_000_000, 0);
    expect(r.totalCalculado).toBeCloseTo((por['2026-08'] ?? 0) + (por['2026-09'] ?? 0) + (por['2026-10'] ?? 0), 0);
  });
  it('un cobro descuenta lo calculado de cada mes, no el ingreso actual por cada mes', () => {
    const r = resumenAhorro(6_000_000, '2026-07', '2026-09', [], [{ mes: '2026-09', bolsillo: 'prima' }], { '2026-07': 3_000_000, '2026-08': 6_000_000 });
    const sug = (b: number) => b / 6;
    expect(r.retiradoCalculado).toBeCloseTo(0.5 * (sug(3_000_000) + sug(6_000_000) + sug(6_000_000)), 0);
  });
  it('sin ingresos guardados se comporta como antes', () => {
    const a = resumenAhorro(5_000_000, '2026-08', '2026-10', []);
    const b = resumenAhorro(5_000_000, '2026-08', '2026-10', [], [], {});
    expect(b).toEqual(a);
  });
});
