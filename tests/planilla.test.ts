import { describe, expect, it } from 'vitest';
import { diaHabilDe, diasHabilesAntes, fechaConDia, fechaLimitePago, festivosCo, mesAnterior, proximaFechaLimite, recordatorioDeHoy } from '@/lib/app/planilla';

const FESTIVOS_2026 = ['01-01', '01-12', '03-23', '04-02', '04-03', '05-01', '05-18', '06-08', '06-15', '06-29', '07-20', '08-07', '08-17', '10-12', '11-02', '11-16', '12-08', '12-25'].map((f) => `2026-${f}`);

describe('festivos de Colombia', () => {
  it('2026 coincide con el calendario oficial', () => {
    expect([...festivosCo(2026)].sort()).toEqual(FESTIVOS_2026);
  });
  it('2027 coincide con el calendario del brief (calendario-colombia.com, sin el 12 de julio)', () => {
    const oficial = ['01-01', '01-11', '03-22', '03-25', '03-26', '05-01', '05-10', '05-31', '06-07', '07-05', '07-20', '08-07', '08-16', '10-18', '11-01', '11-15', '12-08', '12-25'].map((f) => `2027-${f}`);
    expect([...festivosCo(2027)].sort()).toEqual(oficial);
  });
});

describe('festivos: lista de referencia de años posteriores', () => {
  // 2028 y 2030 contrastados con calendarios publicados (no oficiales). Si una ley cambia un festivo, se actualiza aquí
  // y en EXCEPCIONES_FESTIVOS.
  const REFERENCIA: Record<number, string[]> = {
    2028: ['01-01', '01-10', '03-20', '04-13', '04-14', '05-01', '05-29', '06-19', '06-26', '07-03', '07-20', '08-07', '08-21', '10-16', '11-06', '11-13', '12-08', '12-25'],
    2030: ['01-01', '01-07', '03-25', '04-18', '04-19', '05-01', '06-03', '06-24', '07-01', '07-20', '08-07', '08-19', '10-14', '11-04', '11-11', '12-08', '12-25'],
  };
  it.each(Object.entries(REFERENCIA))('%s coincide con la referencia', (anio, lista) => {
    expect([...festivosCo(Number(anio))].sort()).toEqual(lista.map((f) => `${anio}-${f}`));
  });
  it('2029 y 2031 también generan 17 o 18 fechas distintas, todas dentro del año', () => {
    for (const a of [2029, 2031]) {
      const f = [...festivosCo(a)];
      expect(f.length).toBeGreaterThanOrEqual(17);
      expect(f.every((d) => d.startsWith(String(a)))).toBe(true);
    }
  });
});

describe('festivos: excepciones y aviso de validación', () => {
  it('las excepciones agregan y quitan fechas sin tocar el algoritmo', async () => {
    const { EXCEPCIONES_FESTIVOS } = await import('@/lib/app/planilla');
    EXCEPCIONES_FESTIVOS[2035] = { agregar: ['2035-05-02'], quitar: ['2035-12-25'] };
    const f = festivosCo(2035);
    expect(f.has('2035-05-02')).toBe(true);
    expect(f.has('2035-12-25')).toBe(false);
    delete EXCEPCIONES_FESTIVOS[2035];
  });
  it('avisa cuando falta validar el año (y en diciembre, el siguiente)', async () => {
    const { festivosPorValidar } = await import('@/lib/app/planilla');
    expect(festivosPorValidar('2026-11-20')).toBeNull();
    expect(festivosPorValidar('2027-06-10')).toBeNull();
    expect(festivosPorValidar('2027-12-01')).toBe(2028);
    expect(festivosPorValidar('2028-02-01')).toBe(2028);
  });
});

describe('día hábil según los dos últimos dígitos (Decreto 1990 de 2016)', () => {
  it('cubre toda la tabla', () => {
    const casos: [string, number][] = [['00', 2], ['07', 2], ['08', 3], ['14', 3], ['15', 4], ['28', 5], ['35', 6], ['42', 7], ['49', 8], ['56', 9], ['57', 10], ['63', 10], ['64', 11], ['69', 11], ['70', 12], ['75', 12], ['76', 13], ['81', 13], ['82', 14], ['87', 14], ['88', 15], ['93', 15], ['94', 16], ['99', 16]];
    for (const [d, n] of casos) expect(diaHabilDe(d), d).toBe(n);
  });
  it('rechaza dígitos inválidos', () => {
    expect(() => diaHabilDe('9')).toThrow();
    expect(() => diaHabilDe('ab')).toThrow();
  });
});

describe('fecha límite de pago (casos del brief)', () => {
  it.each([
    ['89', 2026, 11, '2026-11-24', 'martes 24 de noviembre'],
    ['00', 2026, 1, '2026-01-05', 'lunes 5 de enero'],
    ['50', 2026, 6, '2026-06-12', 'viernes 12 de junio'],
    ['99', 2026, 12, '2026-12-23', 'miércoles 23 de diciembre'],
  ])('dígitos %s, %i-%i → %s', (digitos, anio, mes, esperada, texto) => {
    expect(fechaLimitePago(digitos, anio, mes)).toBe(esperada);
    expect(fechaConDia(esperada)).toBe(texto);
  });
  it('salta sábados, domingos y festivos', () => {
    // 2026-10: el 12 es festivo (lunes). Día hábil 2 → martes 6? octubre 1 jueves, 2 viernes → 2º hábil = viernes 2
    expect(fechaLimitePago('00', 2026, 10)).toBe('2026-10-02');
  });
});

describe('recordatorios', () => {
  it('3 días hábiles antes y el mismo día', () => {
    // dígitos 89, noviembre 2026: vence el martes 24 → 3 hábiles antes = jueves 19
    expect(diasHabilesAntes('2026-11-24', 3)).toBe('2026-11-19');
    expect(recordatorioDeHoy('89', '2026-11-19', 3)).toEqual({ tipo: 'previo', fechaLimite: '2026-11-24', periodo: '2026-11' });
    expect(recordatorioDeHoy('89', '2026-11-24', 3)).toEqual({ tipo: 'dia', fechaLimite: '2026-11-24', periodo: '2026-11' });
    expect(recordatorioDeHoy('89', '2026-11-20', 3)).toBeNull();
  });
  it('la anticipación cuenta solo días hábiles (cruza fines de semana y festivos)', () => {
    // vence lunes 5 de enero de 2026 (dígitos 00): 1 hábil antes = martes 30-dic? (31-dic mié, 1-ene festivo, 2-ene vie)
    expect(diasHabilesAntes('2026-01-05', 1)).toBe('2026-01-02');
  });
  it('próxima fecha límite: la de este mes si no ha pasado, si no la del siguiente', () => {
    expect(proximaFechaLimite('89', '2026-11-10')).toEqual({ fecha: '2026-11-24', mes: '2026-11' });
    expect(proximaFechaLimite('89', '2026-11-24').fecha).toBe('2026-11-24');
    expect(proximaFechaLimite('89', '2026-11-25').mes).toBe('2026-12');
    expect(proximaFechaLimite('99', '2026-12-24').mes).toBe('2027-01');
  });
  it('mes anterior (la planilla es mes vencido)', () => {
    expect(mesAnterior('2026-11')).toBe('2026-10');
    expect(mesAnterior('2027-01')).toBe('2026-12');
  });
});

import { construirCorreoPlanilla } from '@/lib/cron/planilla';
import { firmarBaja, verificarBaja } from '@/lib/cron/baja';

describe('correo de la planilla', () => {
  const base = { fechaLimite: '2026-11-24', periodo: '2026-11', diasAnticipacion: 3, urlApp: 'https://frilo.dev/', urlBaja: 'https://frilo.dev/api/recordatorio/baja?u=x&t=y' };
  it('aviso previo: fecha, mes vencido, estimado y enlaces', () => {
    const c = construirCorreoPlanilla({ ...base, tipo: 'previo', estimado: { total: 928_700, salud: 400_000, pension: 512_000, arl: 16_700, fsp: 0 } });
    expect(c.asunto).toBe('Tu planilla vence el martes 24 de noviembre');
    expect(c.texto).toContain('de octubre');
    expect(c.texto).toContain('$928.700');
    expect(c.texto).toContain('independientes2.miplanilla.com');
    expect(c.texto).toContain('api/recordatorio/baja');
    expect(c.html).toContain('Apagar el recordatorio');
    expect(c.texto).toContain('4x1000');
  });
  it('el mismo día cambia el asunto y sin ingreso guardado no inventa un valor', () => {
    const c = construirCorreoPlanilla({ ...base, tipo: 'dia', estimado: null });
    expect(c.asunto).toBe('Hoy vence tu planilla de seguridad social');
    expect(c.texto).not.toContain('Valor estimado');
  });
});

describe('baja del recordatorio de planilla', () => {
  const id = '3f2504e0-4f89-41d3-9a0c-0305e82c3301';
  it('su token solo sirve para este recordatorio, no para las novedades', () => {
    const t = firmarBaja(id, 'secreto', 'planilla');
    expect(verificarBaja(id, t, 'secreto', 'planilla')).toBe(true);
    expect(verificarBaja(id, t, 'secreto')).toBe(false);
    expect(verificarBaja(id, firmarBaja(id, 'secreto'), 'secreto', 'planilla')).toBe(false);
  });
});
