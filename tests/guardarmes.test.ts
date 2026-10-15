import { describe, expect, it } from 'vitest';
import { construirCorreoGuardarMes, diaDeAviso, diasDelMes, tocaAvisarHoy } from '@/lib/cron/guardarmes';
import { mesEstaGuardado } from '@/lib/app/derivados';

describe('día del aviso', () => {
  it('sin día indicado, avisa el primero', () => {
    expect(diaDeAviso(null, '2026-11-15')).toBe(1);
    expect(tocaAvisarHoy(undefined, '2026-11-01')).toBe(true);
    expect(tocaAvisarHoy(undefined, '2026-11-02')).toBe(false);
  });
  it('usa el día de pago', () => {
    expect(tocaAvisarHoy(15, '2026-11-15')).toBe(true);
    expect(tocaAvisarHoy(15, '2026-11-14')).toBe(false);
  });
  it('en meses cortos avisa el último día', () => {
    expect(diasDelMes('2026-02-10')).toBe(28);
    expect(diasDelMes('2028-02-10')).toBe(29);
    expect(tocaAvisarHoy(31, '2026-02-28')).toBe(true);
    expect(tocaAvisarHoy(30, '2026-04-30')).toBe(true);
    expect(tocaAvisarHoy(31, '2026-04-30')).toBe(true);
    expect(tocaAvisarHoy(31, '2026-01-30')).toBe(false);
  });
  it('un día fuera de rango se trata como el primero', () => {
    expect(diaDeAviso(0, '2026-11-20')).toBe(1);
    expect(diaDeAviso(45, '2026-11-20')).toBe(1);
  });
});

describe('correo de guardar el mes', () => {
  it('trae el mes, el enlace y la baja', () => {
    const c = construirCorreoGuardarMes({ mes: '2026-11', urlApp: 'https://frilo.dev/', urlBaja: 'https://frilo.dev/baja?x=1', diaDePago: 15 });
    expect(c.asunto).toBe('Guarda tu noviembre en Frilo');
    expect(c.texto).toContain('https://frilo.dev/inicio');
    expect(c.texto).toContain('https://frilo.dev/baja?x=1');
    expect(c.html).toContain('Dejar de recibirlo');
  });
});

describe('mes guardado', () => {
  it('guardado si el último mes guardado es el de hoy o posterior', () => {
    expect(mesEstaGuardado('2026-11', '2026-10', '2026-11')).toBe(true);
    expect(mesEstaGuardado(undefined, '2026-10', '2026-10')).toBe(true);
  });
  it('pendiente si el último guardado es anterior', () => {
    expect(mesEstaGuardado('2026-10', '2026-10', '2026-11')).toBe(false);
    expect(mesEstaGuardado(undefined, '2026-10', '2026-11')).toBe(false);
  });
});
