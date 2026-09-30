import { aporteParaMeta, costoConversionPct, mesesParaMeta, parametrosDe, resumenMes, saldoFuturo, type FuenteIngreso } from '../lib/calculos';

const p = parametrosDe(2026);

describe('metas de ahorro', () => {
  it('las tres fórmulas son consistentes entre sí', () => {
    const aporte = aporteParaMeta(10_000_000, 12, 0.09);
    expect(saldoFuturo(aporte, 12, 0.09)).toBeCloseTo(10_000_000, 4);
    expect(mesesParaMeta(10_000_000, aporte, 0.09)).toBe(12);
  });
  it('con tasa 0 es una división simple', () => {
    expect(aporteParaMeta(1_200_000, 12, 0)).toBe(100_000);
    expect(mesesParaMeta(1_000_000, 300_000, 0)).toBe(4);
  });
  it('rentabilidad reduce el aporte necesario', () => {
    expect(aporteParaMeta(10_000_000, 12, 0.09)).toBeLessThan(10_000_000 / 12);
  });
  it('valida entradas', () => {
    expect(() => aporteParaMeta(1, 0, 0.09)).toThrow();
    expect(() => mesesParaMeta(1, 0, 0.09)).toThrow();
  });
});

const exterior: FuenteIngreso = { id: 'acme', nombre: 'Acme Inc.', moneda: 'USD', tipoContrato: 'exterior', contratante: 'exterior' };
const local: FuenteIngreso = { id: 'agencia', nombre: 'Agencia CO', moneda: 'COP', tipoContrato: 'ops_mas_de_un_mes', contratante: 'privado' };

describe('resumen del mes — perfil solo USD', () => {
  it('convierte con la TRM, calcula aportes sin ARL (voluntaria) y el disponible', () => {
    const r = resumenMes({ fuentes: [exterior], pagos: [{ fuenteId: 'acme', monto: 1_250 }], trm: 4_000, clase: 1, arlVoluntariaActivada: false }, p);
    expect(r.usaTrm).toBe(true);
    expect(r.ingresoBrutoMes).toBe(5_000_000);
    expect(r.arl.obligatoria).toBe(false);
    expect(r.aportes.totalUsuario).toBe(570_000);
    expect(r.disponible).toBeCloseTo(5_000_000 - 570_000 - 5_000_000 / 6, 4);
  });
  it('con tasa recibida calcula el costo de conversión y usa el valor real como base', () => {
    const r = resumenMes({ fuentes: [exterior], pagos: [{ fuenteId: 'acme', monto: 1_000, tasaRecibida: 3_900 }], trm: 4_000, clase: 1, arlVoluntariaActivada: false }, p);
    expect(r.costoConversion).toBe(100_000);
    expect(r.ingresoBrutoMes).toBe(3_900_000);
    expect(costoConversionPct(3_900, 4_000)).toBeCloseTo(0.025, 10);
  });
  it('sin TRM no puede convertir USD', () => {
    expect(() => resumenMes({ fuentes: [exterior], pagos: [{ fuenteId: 'acme', monto: 1 }], trm: null, clase: 1, arlVoluntariaActivada: false }, p)).toThrow();
  });
});

describe('resumen del mes — perfil solo COP', () => {
  it('no usa TRM, la ARL es obligatoria, y la retención baja el disponible pero no la base', () => {
    const r = resumenMes({ fuentes: [local], pagos: [{ fuenteId: 'agencia', monto: 5_000_000, retencionPracticada: 500_000 }], trm: null, clase: 1, arlVoluntariaActivada: false }, p);
    expect(r.usaTrm).toBe(false);
    expect(r.ingresoBrutoMes).toBe(5_000_000);
    expect(r.recibidoMes).toBe(4_500_000);
    expect(r.arl).toMatchObject({ obligatoria: true, pagador: 'usuario' });
    expect(r.aportes.totalUsuario).toBe(580_400); // igual que la hoja
    expect(r.ahorroPrima).toBeCloseTo(5_000_000 / 12, 6);
    expect(r.disponible).toBeCloseTo(4_500_000 - 580_400 - 5_000_000 / 6, 4);
  });
});

describe('resumen del mes — perfil mixto', () => {
  it('suma ambas fuentes para el IBC y aplica la regla de ARL más exigente', () => {
    const r = resumenMes({
      fuentes: [exterior, local],
      pagos: [{ fuenteId: 'acme', monto: 1_000 }, { fuenteId: 'agencia', monto: 16_000_000 }],
      trm: 4_000, clase: 1, arlVoluntariaActivada: false,
    }, p);
    expect(r.ingresoBrutoMes).toBe(20_000_000);
    expect(r.aportes.ibc).toBe(8_000_000);
    expect(r.aportes.tarifaFsp).toBe(0.01); // la suma cruza 4 SMLMV aunque ninguna fuente sola lo haría
    expect(r.arl.obligatoria).toBe(true);
  });
  it('falla si un pago apunta a una fuente que no existe', () => {
    expect(() => resumenMes({ fuentes: [local], pagos: [{ fuenteId: 'otra', monto: 1 }], trm: null, clase: 1, arlVoluntariaActivada: false }, p)).toThrow();
  });
});
