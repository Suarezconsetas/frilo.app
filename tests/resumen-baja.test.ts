import { firmarBaja, urlDeBaja, verificarBaja } from '@/lib/cron/baja';
import { construirCorreoResumen, datosDeSemana } from '@/lib/cron/resumen';
import { promocionDeEjemplo } from '@/lib/cron/mensajes';
import { filaDeResumen } from '@/lib/cron/tarea-diaria';

// Serie de ejemplo: el viernes 2026-10-16 cierra en 3.250 (sube frente al viernes anterior).
const serie = [
  { vigenciadesde: '2025-10-16', vigenciahasta: '2025-10-16', valor: 3900 },
  { vigenciadesde: '2026-09-16', vigenciahasta: '2026-09-16', valor: 3200 },
  { vigenciadesde: '2026-10-09', vigenciahasta: '2026-10-09', valor: 3218.75 },
  { vigenciadesde: '2026-10-12', vigenciahasta: '2026-10-12', valor: 3194.44 },
  { vigenciadesde: '2026-10-13', vigenciahasta: '2026-10-13', valor: 3180 },
  { vigenciadesde: '2026-10-14', vigenciahasta: '2026-10-14', valor: 3260 },
  { vigenciadesde: '2026-10-15', vigenciahasta: '2026-10-15', valor: 3240 },
  { vigenciadesde: '2026-10-16', vigenciahasta: '2026-10-16', valor: 3250 },
];

describe('datosDeSemana', () => {
  const d = datosDeSemana(serie, '2026-10-16');
  it('toma el cierre y compara con hace una semana, un mes y un año', () => {
    expect(d.cierre).toBe(3250);
    expect(d.referencias.map((r) => r.clave)).toEqual(['semana', 'mes', 'anio']);
    expect(d.referencias[0]).toMatchObject({ trm: 3218.75 });
    expect(d.referencias[1]).toMatchObject({ trm: 3200 });
    expect(d.referencias[2]).toMatchObject({ trm: 3900 });
    expect(d.referencias[2]!.variacionPct).toBeLessThan(0);
  });
  it('calcula el mínimo y el máximo de la semana', () => {
    expect(d.minima).toBe(3180);
    expect(d.maxima).toBe(3260);
  });
  it('clasifica el movimiento de la semana', () => {
    expect(d.movimiento).toBe('sube');
    expect(datosDeSemana([...serie.slice(0, 2), { vigenciadesde: '2026-10-09', vigenciahasta: '2026-10-09', valor: 3250 }, { vigenciadesde: '2026-10-16', vigenciahasta: '2026-10-16', valor: 3251 }], '2026-10-16').movimiento).toBe('igual');
    expect(datosDeSemana(serie.map((r) => (r.vigenciadesde === '2026-10-16' ? { ...r, valor: 3100 } : r)), '2026-10-16').movimiento).toBe('baja');
  });
});

describe('construirCorreoResumen', () => {
  const datos = datosDeSemana(serie, '2026-10-16');
  const base = { datos, urlApp: 'https://frilo.dev', urlBaja: 'https://frilo.dev/api/novedades/baja?u=x&t=y' };
  const c = construirCorreoResumen({ ...base, promocion: promocionDeEjemplo() });
  it('el asunto dice cómo cerró el dólar', () => {
    expect(c.asunto).toBe('Así cerró el dólar esta semana: $3.250,00');
  });
  it('muestra la semana, el mes y el año con cifras en formato colombiano', () => {
    expect(c.texto).toContain('Hace una semana: $3.218,75');
    expect(c.texto).toContain('Hace un mes: $3.200,00');
    expect(c.texto).toContain('Hace un año: $3.900,00');
    expect(c.texto).toContain('entre $3.180,00 y $3.260,00');
  });
  it('lleva el mensaje motivador de la semana y la invitación a ahorrar', () => {
    expect(c.texto).toContain('Esta semana el dólar subió');
    expect(c.texto).toContain('Pon a trabajar una parte de lo que ganas');
    expect(c.html).toContain('https://frilo.dev/ahorro');
  });
  it('es un correo promocional correcto: baja con un clic, quién lo envía y no es asesoría', () => {
    expect(c.html).toContain('href="https://frilo.dev/api/novedades/baja?u=x&amp;t=y"');
    expect(c.texto).toContain('Dejar de recibirlo: https://frilo.dev/api/novedades/baja?u=x&t=y');
    expect(c.texto).toContain('Nicolás Suárez Pardo');
    expect(c.texto).toContain('no asesoría financiera');
  });
});

describe('enlace de baja', () => {
  const id = '421c2c98-0000-4000-8000-000000000001';
  const secreto = 'clave-de-prueba';
  it('un token válido verifica y es por persona', () => {
    const t = firmarBaja(id, secreto);
    expect(verificarBaja(id, t, secreto)).toBe(true);
    expect(verificarBaja('421c2c98-0000-4000-8000-000000000002', t, secreto)).toBe(false);
  });
  it('rechaza tokens falsos, vacíos o hechos con otra clave', () => {
    expect(verificarBaja(id, 'a'.repeat(64), secreto)).toBe(false);
    expect(verificarBaja(id, '', secreto)).toBe(false);
    expect(verificarBaja(id, firmarBaja(id, 'otra-clave'), secreto)).toBe(false);
    expect(verificarBaja('no-es-uuid', firmarBaja('no-es-uuid', secreto), secreto)).toBe(false);
  });
  it('la URL generada trae la persona y su token', () => {
    const u = new URL(urlDeBaja('https://frilo.dev/', id, secreto));
    expect(u.pathname).toBe('/api/novedades/baja');
    expect(u.searchParams.get('u')).toBe(id);
    expect(verificarBaja(id, u.searchParams.get('t')!, secreto)).toBe(true);
  });
});

describe('filaDeResumen', () => {
  it('registra la corrida del resumen con su tarea y sus conteos', () => {
    const f = filaDeResumen({ fecha: '2026-10-16', trmCierre: 3250, destinatarios: 5, enviados: 5, fallidos: 0 }, 900, '2026-10-16');
    expect(f).toMatchObject({ tarea: 'resumen', ok: true, trm_hoy: 3250, correos_enviados: 5, correos_fallidos: 0, fecha: '2026-10-16' });
  });
  it('si hubo fallidos o no había TRM, la corrida no es ok', () => {
    expect(filaDeResumen({ fecha: '2026-10-16', trmCierre: 3250, destinatarios: 5, enviados: 4, fallidos: 1 }, 1, '2026-10-16').ok).toBe(false);
    expect(filaDeResumen({ fecha: '2026-10-16', trmCierre: null, destinatarios: 0, enviados: 0, fallidos: 0, omitido: 'no hay TRM para armar el resumen' }, 1, '2026-10-16')).toMatchObject({ ok: false, error_trm: 'no hay TRM para armar el resumen' });
  });
});
