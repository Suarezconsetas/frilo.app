import { crearAlerta, evaluarAlerta, normalizarRegistro, panelTrm, reactivarAlerta, restarAnios, restarDias, restarMeses, trmVigente, type RegistroTrm } from '../lib/calculos';

const serie: RegistroTrm[] = [
  { valor: 4000, vigenciadesde: '2025-09-24', vigenciahasta: '2025-09-24' },
  { valor: 4100, vigenciadesde: '2026-08-22', vigenciahasta: '2026-08-25' }, // viernes → martes (festivo)
  { valor: 4150, vigenciadesde: '2026-08-26', vigenciahasta: '2026-08-26' },
  { valor: 4200, vigenciadesde: '2026-09-17', vigenciahasta: '2026-09-17' },
  { valor: 4300, vigenciadesde: '2026-09-24', vigenciahasta: '2026-09-24' },
];

describe('fechas', () => {
  it('resta días, meses y años', () => {
    expect(restarDias('2026-03-01', 1)).toBe('2026-02-28');
    expect(restarMeses('2026-03-31', 1)).toBe('2026-02-28');
    expect(restarMeses('2026-01-15', 1)).toBe('2025-12-15');
    expect(restarAnios('2028-02-29', 1)).toBe('2027-02-28');
  });
});

describe('trmVigente', () => {
  it('toma la TRM cuya vigencia cubre la fecha (fin de semana o festivo)', () => {
    expect(trmVigente(serie, '2026-08-24')).toBe(4100);
  });
  it('si hay un hueco en la serie, usa la última publicada antes', () => {
    expect(trmVigente(serie, '2026-09-01')).toBe(4150);
  });
  it('falla con claridad si no hay datos anteriores', () => {
    expect(() => trmVigente(serie, '2020-01-01')).toThrow();
  });
  it('normaliza el formato de datos.gov.co', () => {
    expect(normalizarRegistro({ valor: '4123.45', vigenciadesde: '2026-09-24T00:00:00.000', vigenciahasta: '2026-09-24T00:00:00.000' }))
      .toEqual({ valor: 4123.45, vigenciadesde: '2026-09-24', vigenciahasta: '2026-09-24' });
  });
});

describe('panelTrm', () => {
  it('calcula las 4 referencias y sus variaciones', () => {
    const p = panelTrm(serie, '2026-09-24');
    expect(p.hoy.trm).toBe(4300);
    const [semana, mes, anio] = p.variaciones;
    expect(semana).toMatchObject({ fecha: '2026-09-17', trm: 4200, variacionAbs: 100 });
    expect(mes).toMatchObject({ fecha: '2026-08-24', trm: 4100, variacionAbs: 200 });
    expect(anio).toMatchObject({ fecha: '2025-09-24', trm: 4000 });
    expect(anio!.variacionPct).toBeCloseTo(0.075, 6);
  });
});

describe('alertas por valor objetivo', () => {
  it('dispara solo cuando la TRM cruza el umbral, una sola vez', () => {
    let a = crearAlerta(4300, 'sube', 4250);
    let r = evaluarAlerta(a, 4280); expect(r.notificar).toBe(false); a = r.alerta;
    r = evaluarAlerta(a, 4310); expect(r.notificar).toBe(true); a = r.alerta;
    expect(a.estado).toBe('disparada');
    r = evaluarAlerta(a, 4350); expect(r.notificar).toBe(false);
  });
  it('no dispara de inmediato si al crearla ya estaba por encima', () => {
    const a = crearAlerta(4300, 'sube', 4350);
    expect(evaluarAlerta(a, 4360).notificar).toBe(false);
  });
  it('en ese caso dispara cuando baja y vuelve a cruzar', () => {
    let a = crearAlerta(4300, 'sube', 4350);
    a = evaluarAlerta(a, 4250).alerta;
    expect(evaluarAlerta(a, 4305).notificar).toBe(true);
  });
  it('alerta de bajada', () => {
    const a = crearAlerta(4000, 'baja', 4100);
    expect(evaluarAlerta(a, 3990).notificar).toBe(true);
  });
  it('se puede reactivar después de disparada', () => {
    let a = evaluarAlerta(crearAlerta(4300, 'sube', 4200), 4310).alerta;
    a = reactivarAlerta(a, 4250);
    expect(evaluarAlerta(a, 4320).notificar).toBe(true);
  });
});
