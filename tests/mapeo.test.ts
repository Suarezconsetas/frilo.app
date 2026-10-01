import { autorizacionesPorAgregar, estadoDesdeFilas, filasDesdeEstado, rangoIngreso, VERSION_POLITICA } from '@/lib/app/mapeo';
import { ESTADO_VACIO, type EstadoApp } from '@/lib/app/tipos';

const usd: EstadoApp = {
  ...ESTADO_VACIO,
  formaDePago: 'usd',
  mesInicio: '2026-09',
  arlVoluntaria: true,
  ingreso: { cliente: 'Acme Inc.', moneda: 'USD', monto: 1750, tasaRecibida: 3300, clase: 2, publico: false },
  cobros: [{ mes: '2026-09', bolsillo: 'prima' }],
  alertas: [{ umbral: 3500, direccion: 'sube', estado: 'activa', trmReferencia: 3341.23 }],
};

describe('rangoIngreso', () => {
  it('guarda un rango, no la cifra', () => {
    expect(rangoIngreso(1_000_000)).toBe('menos de 2 salarios mínimos');
    expect(rangoIngreso(5_847_153)).toBe('2 a 4 salarios mínimos');
    expect(rangoIngreso(10_000_000)).toBe('4 a 8 salarios mínimos');
    expect(rangoIngreso(20_000_000)).toBe('8 a 16 salarios mínimos');
    expect(rangoIngreso(40_000_000)).toBe('más de 16 salarios mínimos');
  });
});

describe('estado ⇄ filas', () => {
  it('el perfil lleva el rango y no la cifra exacta', () => {
    const f = filasDesdeEstado(usd, 5_775_000);
    expect(f.perfil).toEqual({ forma_de_pago: 'usd', rango_ingreso: '2 a 4 salarios mínimos', clase_riesgo: 2, arl_voluntaria: true });
    expect(JSON.stringify(f.perfil)).not.toContain('5775000');
  });
  it('un viaje de ida y vuelta conserva el ingreso, los cobros y las alertas', () => {
    const f = filasDesdeEstado(usd, 5_775_000);
    const vuelta = estadoDesdeFilas({
      perfil: f.perfil,
      fuente: { id: 'abc', ...f.fuente! },
      pago: { ...f.pago!, monto: '1750.00', tasa_recibida: '3300.00' }, // numeric llega como texto
      cobros: f.cobros,
      alertas: f.alertas.map((a) => ({ ...a, umbral: '3500.00', trm_referencia: '3341.23' })),
    });
    expect(vuelta.ingreso).toEqual(usd.ingreso);
    expect(vuelta.mesInicio).toBe('2026-09');
    expect(vuelta.fuenteId).toBe('abc');
    expect(vuelta.arlVoluntaria).toBe(true);
    expect(vuelta.cobros).toEqual(usd.cobros);
    expect(vuelta.alertas).toEqual(usd.alertas);
  });
  it('un ingreso en pesos con entidad pública vuelve como público', () => {
    const cop: EstadoApp = { ...ESTADO_VACIO, mesInicio: '2026-09', ingreso: { cliente: 'Alcaldía', moneda: 'COP', monto: 5_000_000, retencion: 200_000, clase: 1, publico: true } };
    const f = filasDesdeEstado(cop, 5_000_000);
    expect(f.fuente?.contratante).toBe('publico');
    const vuelta = estadoDesdeFilas({ perfil: f.perfil, fuente: { id: 'x', ...f.fuente! }, pago: f.pago, cobros: [], alertas: [] });
    expect(vuelta.ingreso).toEqual(cop.ingreso);
  });
  it('sin ingreso no hay fuente ni pago', () => {
    const f = filasDesdeEstado(ESTADO_VACIO, null);
    expect(f.fuente).toBeNull();
    expect(f.pago).toBeNull();
    expect(f.perfil.rango_ingreso).toBeNull();
  });
  it('una cuenta sin datos cargados no inventa ingreso', () => {
    const vuelta = estadoDesdeFilas({ perfil: null, fuente: null, pago: null, cobros: [], alertas: [] });
    expect(vuelta.ingreso).toBeUndefined();
  });
});

describe('autorizacionesPorAgregar (solo se agrega, nunca se edita)', () => {
  it('usuario nuevo: queda el sí a tratamiento y el estado de la casilla de novedades', () => {
    expect(autorizacionesPorAgregar([], false)).toEqual([
      { tipo: 'tratamiento_datos', otorgada: true, version_politica: VERSION_POLITICA },
      { tipo: 'marketing_frilo', otorgada: false, version_politica: VERSION_POLITICA },
    ]);
    expect(autorizacionesPorAgregar([], true)[1]).toMatchObject({ tipo: 'marketing_frilo', otorgada: true });
  });
  it('quien vuelve a entrar sin marcar novedades no pierde lo que había otorgado', () => {
    const previas = [
      { tipo: 'tratamiento_datos', otorgada: true, version_politica: VERSION_POLITICA },
      { tipo: 'marketing_frilo', otorgada: true, version_politica: VERSION_POLITICA },
    ];
    expect(autorizacionesPorAgregar(previas, false)).toEqual([]);
  });
  it('si había dicho que no a novedades y ahora marca la casilla, se agrega un sí', () => {
    const previas = [
      { tipo: 'tratamiento_datos', otorgada: true, version_politica: VERSION_POLITICA },
      { tipo: 'marketing_frilo', otorgada: false, version_politica: VERSION_POLITICA },
    ];
    expect(autorizacionesPorAgregar(previas, true)).toEqual([{ tipo: 'marketing_frilo', otorgada: true, version_politica: VERSION_POLITICA }]);
  });
  it('una versión nueva de la política pide volver a registrar el tratamiento', () => {
    const previas = [
      { tipo: 'tratamiento_datos', otorgada: true, version_politica: 'vieja' },
      { tipo: 'marketing_frilo', otorgada: false, version_politica: 'vieja' },
    ];
    expect(autorizacionesPorAgregar(previas, false).map((n) => n.tipo)).toEqual(['tratamiento_datos']);
  });
});
