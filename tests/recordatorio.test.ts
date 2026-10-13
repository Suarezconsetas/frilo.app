import { esUltimoDiaDelMes } from '@/lib/app/fechas';
import { promocionDeEjemplo } from '@/lib/cron/mensajes';
import { construirCorreoRecordatorio, montoSugerido } from '@/lib/cron/recordatorio';

describe('esUltimoDiaDelMes', () => {
  it.each([
    ['2026-10-31', true],
    ['2026-10-30', false],
    ['2026-11-30', true],
    ['2026-02-28', true], // 2026 no es bisiesto
    ['2028-02-28', false],
    ['2028-02-29', true],
    ['2026-12-31', true],
    ['2026-10-01', false],
  ])('%s -> %s', (fecha, esperado) => {
    expect(esUltimoDiaDelMes(fecha)).toBe(esperado);
  });
});

describe('montoSugerido', () => {
  it('en pesos usa el monto tal cual', () => {
    expect(montoSugerido({ moneda: 'COP', monto: 6_000_000, tasaRecibida: null, trm: null })).toBeCloseTo(1_000_000, 0);
  });
  it('en dólares convierte con la tasa que le pagaron, o con la TRM si no la dio', () => {
    expect(montoSugerido({ moneda: 'USD', monto: 3000, tasaRecibida: 3000, trm: 3500 })).toBeCloseTo((3000 * 3000) / 6, 0);
    expect(montoSugerido({ moneda: 'USD', monto: 3000, tasaRecibida: null, trm: 3194.44 })).toBeCloseTo((3000 * 3194.44) / 6, 0);
  });
  it('en dólares sin TRM ni tasa no inventa un monto', () => {
    expect(montoSugerido({ moneda: 'USD', monto: 3000, tasaRecibida: null, trm: null })).toBeNull();
  });
});

describe('construirCorreoRecordatorio', () => {
  const c = construirCorreoRecordatorio({
    mes: '2026-10',
    monto: 1_656_420,
    urlApp: 'https://frilo.dev/',
    urlBaja: 'https://frilo.dev/api/novedades/baja?u=x&t=y',
    promocion: promocionDeEjemplo(),
  });
  it('pregunta si ya apartó y dice cuánto calculó Frilo', () => {
    expect(c.asunto).toBe('Octubre se acaba: ¿ya apartaste tu prima y tus cesantías?');
    expect(c.texto).toContain('Frilo calculó $1.656.420');
    expect(c.html).toContain('$1.656.420');
  });
  it('lleva al apartado de lo guardado', () => {
    expect(c.html).toContain('href="https://frilo.dev/ahorro#guardado"');
    expect(c.texto).toContain('https://frilo.dev/ahorro#guardado');
  });
  it('es promocional bien hecho: baja con un clic, quién lo envía y aclara que Frilo no ve las cuentas', () => {
    expect(c.html).toContain('Dejar de recibirlo');
    expect(c.texto).toContain('Dejar de recibirlo: https://frilo.dev/api/novedades/baja?u=x&t=y');
    expect(c.texto).toContain('Nicolás Suárez Pardo');
    expect(c.texto).toContain('Frilo no ve tus cuentas ni mueve tu dinero');
  });
});
