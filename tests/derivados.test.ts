import { bolsas, calcularMes, dolarVisible, escenarios, reparto } from '@/lib/app/derivados';
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
