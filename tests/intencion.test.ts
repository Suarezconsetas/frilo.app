import { describe, expect, it } from 'vitest';
import { aplicarIntencion, leerIntencion } from '@/lib/app/intencion';
import { ESTADO_VACIO, type EstadoApp } from '@/lib/app/tipos';

describe('leer la intención de la cookie', () => {
  it('reconoce las tres acciones y descarta lo demás', () => {
    expect(leerIntencion('{"tipo":"recordatorio","digitos":"89"}')).toEqual({ tipo: 'recordatorio', digitos: '89' });
    expect(leerIntencion('{"tipo":"alerta_dolar","valor":3300}')).toEqual({ tipo: 'alerta_dolar', valor: 3300 });
    expect(leerIntencion('{"tipo":"guardar_calculo","ingreso":8000000,"riesgo":"II"}')).toEqual({ tipo: 'guardar_calculo', ingreso: 8_000_000, riesgo: 'II' });
    for (const malo of [null, '', 'no json', '{"tipo":"otro"}', '{"tipo":"recordatorio","digitos":"8"}', '{"tipo":"recordatorio","digitos":"ab"}', '{"tipo":"alerta_dolar","valor":-5}', '{"tipo":"guardar_calculo","ingreso":1,"riesgo":"IX"}']) {
      expect(leerIntencion(malo)).toBeNull();
    }
  });
});

describe('aplicar la intención', () => {
  const hoy = '2026-10-21';
  it('recordatorio: activa los dígitos y lleva a Aportes', () => {
    const r = aplicarIntencion({ tipo: 'recordatorio', digitos: '89' }, ESTADO_VACIO, null, hoy);
    expect(r.recordatorio).toEqual({ digitos: '89' });
    expect(r.destino).toBe('/aportes');
  });
  it('alerta del dólar: crea la alerta hacia el lado correcto y no la duplica', () => {
    const sube = aplicarIntencion({ tipo: 'alerta_dolar', valor: 3300 }, ESTADO_VACIO, 3150, hoy);
    expect(sube.cambios.alertas?.[0]).toMatchObject({ umbral: 3300, direccion: 'sube', estado: 'activa' });
    const baja = aplicarIntencion({ tipo: 'alerta_dolar', valor: 3000 }, ESTADO_VACIO, 3150, hoy);
    expect(baja.cambios.alertas?.[0]).toMatchObject({ direccion: 'baja' });
    const igual = aplicarIntencion({ tipo: 'alerta_dolar', valor: 3300 }, { ...ESTADO_VACIO, alertas: sube.cambios.alertas! }, 3150, hoy);
    expect(igual.cambios.alertas).toHaveLength(1);
    expect(aplicarIntencion({ tipo: 'alerta_dolar', valor: 3300 }, ESTADO_VACIO, null, hoy).destino).toBe('/dolar');
  });
  it('guardar cálculo: crea el primer ingreso y nunca pisa uno existente', () => {
    const nuevo = aplicarIntencion({ tipo: 'guardar_calculo', ingreso: 8_000_000, riesgo: 'I' }, ESTADO_VACIO, null, hoy);
    expect(nuevo.cambios.ingreso).toMatchObject({ moneda: 'COP', monto: 8_000_000, clase: 1 });
    expect(nuevo.cambios.mesInicio).toBe('2026-10');
    const previo: EstadoApp = { ...ESTADO_VACIO, ingreso: { cliente: 'Acme', moneda: 'USD', monto: 3000, clase: 1, publico: false }, mesInicio: '2026-09' };
    const r = aplicarIntencion({ tipo: 'guardar_calculo', ingreso: 8_000_000, riesgo: 'I' }, previo, null, hoy);
    expect(r.cambios).toEqual({});
  });
});
