import { calcularAportes, parametrosDe, reglaArl, reglaArlCombinada, redondearMultiplo, type FuenteIngreso } from '../lib/calculos';

const p = parametrosDe(2026);

// Valores sacados de Calculadora_Aportes_Independientes_2026.xlsx, recalculada con LibreOffice.
const casosExcel = [
  { nombre: 'ingreso bajo → piso de 1 SMLMV', ingreso: 1_000_000, clase: 1, ibc: 1_750_905, salud: 218_900, pension: 280_100, arl: 9_100, fsp: 0, total: 508_100 },
  { nombre: 'caso base de la hoja', ingreso: 5_000_000, clase: 1, ibc: 2_000_000, salud: 250_000, pension: 320_000, arl: 10_400, fsp: 0, total: 580_400 },
  { nombre: 'riesgo III', ingreso: 5_000_000, clase: 3, ibc: 2_000_000, salud: 250_000, pension: 320_000, arl: 48_700, fsp: 0, total: 618_700 },
  { nombre: 'IBC exactamente en 4 SMLMV → FSP 1%', ingreso: 17_509_050, clase: 1, ibc: 7_003_620, salud: 875_500, pension: 1_120_600, arl: 36_600, fsp: 70_000, total: 2_102_700 },
  { nombre: 'FSP 1% con riesgo II', ingreso: 20_000_000, clase: 2, ibc: 8_000_000, salud: 1_000_000, pension: 1_280_000, arl: 83_500, fsp: 80_000, total: 2_443_500 },
  { nombre: 'FSP 1,4% (17 SMLMV)', ingreso: 75_000_000, clase: 1, ibc: 30_000_000, salud: 3_750_000, pension: 4_800_000, arl: 156_600, fsp: 420_000, total: 9_126_600 },
  { nombre: 'tope de 25 SMLMV, riesgo V, FSP 2%', ingreso: 120_000_000, clase: 5, ibc: 43_772_625, salud: 5_471_600, pension: 7_003_600, arl: 3_046_600, fsp: 875_500, total: 16_397_300 },
] as const;

describe('calcularAportes coincide con la hoja de Excel', () => {
  it.each(casosExcel)('$nombre', (c) => {
    const r = calcularAportes({ ingresoBrutoMes: c.ingreso, clase: c.clase, incluirArl: true }, p);
    expect(r.ibc).toBeCloseTo(c.ibc, 6);
    expect(r.salud).toBe(c.salud);
    expect(r.pension).toBe(c.pension);
    expect(r.arl).toBe(c.arl);
    expect(r.fsp).toBe(c.fsp);
    expect(r.totalUsuario).toBe(c.total);
  });
});

describe('calcularAportes: casos que la hoja no cubre', () => {
  it('sin ARL (voluntaria desactivada) no la suma', () => {
    const r = calcularAportes({ ingresoBrutoMes: 5_000_000, clase: 1, incluirArl: false }, p);
    expect(r.arl).toBe(0);
    expect(r.totalUsuario).toBe(570_000);
  });
  it('ARL pagada por el contratante se calcula pero no sale del bolsillo del usuario', () => {
    const r = calcularAportes({ ingresoBrutoMes: 5_000_000, clase: 4, incluirArl: true, arlLaPagaContratante: true }, p);
    expect(r.arl).toBe(87_000);
    expect(r.arlACargoDelUsuario).toBe(false);
    expect(r.totalUsuario).toBe(570_000);
  });
  it('justo debajo de 4 SMLMV no paga FSP', () => {
    const r = calcularAportes({ ingresoBrutoMes: 17_509_000, clase: 1, incluirArl: false }, p);
    expect(r.tarifaFsp).toBe(0);
  });
  it('porcentaje del ingreso', () => {
    const r = calcularAportes({ ingresoBrutoMes: 5_000_000, clase: 1, incluirArl: true }, p);
    expect(r.porcentajeDelIngreso).toBeCloseTo(0.11608, 5);
  });
  it('ingreso cero paga sobre el piso de 1 SMLMV y no divide por cero', () => {
    const r = calcularAportes({ ingresoBrutoMes: 0, clase: 1, incluirArl: false }, p);
    expect(r.ibc).toBe(p.smlmv);
    expect(r.porcentajeDelIngreso).toBe(0);
  });
  it('rechaza ingresos negativos', () => {
    expect(() => calcularAportes({ ingresoBrutoMes: -1, clase: 1, incluirArl: false }, p)).toThrow();
  });
});

describe('redondeo PILA', () => {
  it('redondea al múltiplo de 100 más cercano, como MROUND', () => {
    expect(redondearMultiplo(9_139.72, 100)).toBe(9_100);
    expect(redondearMultiplo(48_720, 100)).toBe(48_700);
    expect(redondearMultiplo(150, 100)).toBe(200);
    expect(redondearMultiplo(149.99, 100)).toBe(100);
  });
});

describe('reglas de ARL', () => {
  const f = (o: Partial<FuenteIngreso>): FuenteIngreso => ({ id: 'x', nombre: 'x', moneda: 'COP', tipoContrato: 'ops_mas_de_un_mes', contratante: 'privado', ...o });

  it('OPS > 1 mes, riesgo I–III: obligatoria y la paga el usuario', () => {
    expect(reglaArl(f({}), 1)).toMatchObject({ obligatoria: true, pagador: 'usuario' });
  });
  it('OPS > 1 mes, riesgo IV–V: obligatoria y la paga el contratante', () => {
    expect(reglaArl(f({}), 5)).toMatchObject({ obligatoria: true, pagador: 'contratante' });
  });
  it('contratista del Estado: siempre obligatoria, incluso en OPS corta', () => {
    expect(reglaArl(f({ contratante: 'publico', tipoContrato: 'ops_hasta_un_mes' }), 1)).toMatchObject({ obligatoria: true });
  });
  it('contractor del exterior riesgo I: voluntaria', () => {
    expect(reglaArl(f({ moneda: 'USD', tipoContrato: 'exterior', contratante: 'exterior' }), 1)).toMatchObject({ obligatoria: false });
  });
  it('cuenta propia de alto riesgo: obligatoria a cargo del usuario', () => {
    expect(reglaArl(f({ tipoContrato: 'cuenta_propia', contratante: 'privado' }), 4)).toMatchObject({ obligatoria: true, pagador: 'usuario' });
  });
  it('usuario mixto: si una fuente la exige, queda obligatoria', () => {
    const r = reglaArlCombinada([f({ moneda: 'USD', tipoContrato: 'exterior', contratante: 'exterior' }), f({})], 1);
    expect(r).toMatchObject({ obligatoria: true, pagador: 'usuario' });
  });
});
