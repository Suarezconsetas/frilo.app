import { ahorroMensual, compararCuentas, CUENTAS_MVP, proyectarPrestaciones, referenciaEmpleado, rendimiento, rendimientoNeto, tasaMensual, mesSiguiente, type MesIngreso } from '../lib/calculos';

const anio = (ingreso: number, desde = '2026-01', n = 12): MesIngreso[] => {
  const out: MesIngreso[] = []; let mes = desde;
  for (let k = 0; k < n; k++) { out.push({ mes, ingresoBrutoMes: ingreso }); mes = mesSiguiente(mes); }
  return out;
};

describe('ahorro mensual de prima y cesantías (16,67%)', () => {
  it('ejemplo de Nicolás: $7.000.000 → $583.333 por bolsillo, $1.166.667 en total', () => {
    const a = ahorroMensual(7_000_000);
    expect(a.prima).toBeCloseTo(583_333.33, 2);
    expect(a.cesantias).toBeCloseTo(583_333.33, 2);
    expect(a.total).toBeCloseTo(1_166_666.67, 2);
    expect(a.porcentaje).toBeCloseTo(0.16667, 5);
  });
  it('12 meses reconstruyen exactamente $14.000.000 (sin tasa)', () => {
    const f = proyectarPrestaciones(anio(7_000_000), 0);
    expect(f[11]!.saldoPrima + f[11]!.saldoCesantias).toBeCloseTo(14_000_000, 4);
  });
  it('la referencia del empleado es 1 salario de prima + 1 de cesantías + 12% de intereses', () => {
    expect(referenciaEmpleado(7_000_000)).toEqual({ prima: 7_000_000, cesantias: 7_000_000, interesesCesantias: 840_000 });
  });
});

describe('proyección con rentabilidad (valores del esquema)', () => {
  it('9% E.A.: prima a 6 meses $3.563.673; cesantías a 12 meses $7.284.258', () => {
    const f = proyectarPrestaciones(anio(7_000_000), 0.09);
    expect(Math.round(f[5]!.saldoPrima)).toBe(3_563_673);
    expect(Math.round(f[11]!.saldoCesantias)).toBe(7_284_258);
  });
  it('9,5% E.A.: prima a 6 meses $3.567.102; cesantías a 12 meses $7.299.798', () => {
    const f = proyectarPrestaciones(anio(7_000_000), 0.095);
    expect(Math.round(f[5]!.saldoPrima)).toBe(3_567_102);
    expect(Math.round(f[11]!.saldoCesantias)).toBe(7_299_798);
  });
  it('el primer mes no genera rendimiento (el aporte entra al final del mes)', () => {
    expect(proyectarPrestaciones(anio(7_000_000), 0.09)[0]!.rendimientoPrima).toBe(0);
  });
});

describe('calendario y cobros marcados por el usuario', () => {
  it('marca cortes de prima en junio y diciembre, y cesantías disponibles en febrero', () => {
    const f = proyectarPrestaciones(anio(7_000_000), 0.09);
    expect(f.filter((x) => x.esCortePrima).map((x) => x.mes)).toEqual(['2026-06', '2026-12']);
    expect(f.filter((x) => x.cesantiasDisponibles).map((x) => x.mes)).toEqual(['2026-02']);
  });
  it('si el usuario marca la prima cobrada en junio, julio arranca desde cero', () => {
    const f = proyectarPrestaciones(anio(7_000_000), 0.09, [{ mes: '2026-06', bolsillo: 'prima' }]);
    expect(f[5]!.saldoPrima).toBeCloseTo(3_563_673, 0); // junio muestra el saldo antes del cobro
    expect(f[5]!.cobros).toEqual(['prima']);
    expect(f[6]!.saldoPrima).toBeCloseTo(583_333.33, 2); // julio: solo el aporte nuevo
    expect(f[6]!.saldoCesantias).toBeGreaterThan(4_000_000); // cesantías no se tocan
  });
  it('si el usuario NO marca el cobro, la prima sigue acumulando', () => {
    const f = proyectarPrestaciones(anio(7_000_000), 0.09);
    expect(f[6]!.saldoPrima).toBeGreaterThan(4_000_000);
  });
  it('con ingreso variable cada mes aparta 1/12 de su propio ingreso', () => {
    const meses: MesIngreso[] = [
      { mes: '2026-01', ingresoBrutoMes: 6_000_000 },
      { mes: '2026-02', ingresoBrutoMes: 9_000_000 },
    ];
    const f = proyectarPrestaciones(meses, 0);
    expect(f[1]!.saldoPrima).toBeCloseTo(1_250_000, 4);
  });
  it('funciona con años que cruzan diciembre', () => {
    const f = proyectarPrestaciones(anio(3_000_000, '2026-11', 4), 0);
    expect(f.map((x) => x.mes)).toEqual(['2026-11', '2026-12', '2027-01', '2027-02']);
  });
});

describe('rentabilidad y comparador de cuentas', () => {
  it('tasa mensual equivalente', () => {
    expect(tasaMensual(0.09)).toBeCloseTo(0.0072073, 6);
    expect(Math.pow(1 + tasaMensual(0.095), 12) - 1).toBeCloseTo(0.095, 10);
  });
  it('rendimiento de $1.000.000 a 365 días al 10% E.A. = $100.000', () => {
    expect(rendimiento(1_000_000, 365, 0.1)).toBeCloseTo(100_000, 6);
  });
  it('sin retención validada, el neto es null', () => {
    expect(rendimientoNeto(100_000, null)).toBeNull();
    expect(rendimientoNeto(100_000, 0.07)).toBeCloseTo(93_000, 6);
  });
  it('ordena por tasa sin condiciones: Lulo 9,5% > Nu 9,30% > RappiPay 9%', () => {
    const r = compararCuentas(3_500_000, 180, CUENTAS_MVP);
    expect(r.map((x) => x.cuenta.id)).toEqual(['lulo-flex', 'nu-cajitas', 'rappipay-bolsillos']);
    expect(r[0]!.rendimientoCondicionado).not.toBeNull();
    expect(r[1]!.rendimientoCondicionado).toBeNull();
  });
  it('toda cuenta tiene fecha de consulta y URL', () => {
    for (const c of CUENTAS_MVP) {
      expect(c.fechaConsulta).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(c.url).toMatch(/^https:\/\//);
      expect(typeof c.patrocinado).toBe('boolean');
    }
  });
});

import { AVISOS } from '../lib/calculos';
describe('avisos legales', () => {
  it('el aviso de alcance menciona 4x1000 y retenciones de ambos países', () => {
    expect(AVISOS.alcanceCalculos).toMatch(/4x1000/);
    expect(AVISOS.alcanceCalculos).toMatch(/Colombia o en el país de quien te contrata/);
  });
});
