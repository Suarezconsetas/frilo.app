import { evaluarAlerta } from '@/lib/calculos';
import { construirCorreoAlerta, planificarAlertas, type AlertaFila } from '@/lib/cron/alertas';
import { filaDeEjecucion } from '@/lib/cron/tarea-diaria';

const fila = (o: Partial<AlertaFila> = {}): AlertaFila => ({
  id: 'a1',
  usuario_id: 'u1',
  umbral: '3500.00',
  direccion: 'sube',
  estado: 'activa',
  trm_referencia: '3400.00',
  ...o,
});

describe('planificarAlertas', () => {
  it('dispara cuando la TRM cruza el umbral hacia arriba', () => {
    expect(planificarAlertas([fila()], 3510)).toEqual([
      { tipo: 'notificar', id: 'a1', usuarioId: 'u1', direccion: 'sube', umbral: 3500, trmAnterior: 3400, trmNueva: 3510 },
    ]);
  });
  it('dispara cuando cruza hacia abajo', () => {
    const f = fila({ direccion: 'baja', umbral: 3300, trm_referencia: 3350 });
    expect(planificarAlertas([f], 3290)).toMatchObject([{ tipo: 'notificar', direccion: 'baja', umbral: 3300, trmNueva: 3290 }]);
  });
  it('si la TRM no llega al umbral solo actualiza la referencia', () => {
    expect(planificarAlertas([fila()], 3450)).toEqual([{ tipo: 'actualizar_referencia', id: 'a1', trmNueva: 3450 }]);
  });
  it('no avisa de nuevo si la TRM ya estaba del otro lado del umbral (no cruzó)', () => {
    // creada cuando el dólar ya estaba arriba de 3.500: no debe disparar de inmediato
    expect(planificarAlertas([fila({ trm_referencia: 3600 })], 3650)).toEqual([{ tipo: 'actualizar_referencia', id: 'a1', trmNueva: 3650 }]);
  });
  it('si no cambió la TRM no hay nada que hacer', () => {
    expect(planificarAlertas([fila()], 3400)).toEqual([]);
  });
  it('ignora las alertas que ya se dispararon', () => {
    expect(planificarAlertas([fila({ estado: 'disparada' })], 3600)).toEqual([]);
  });
  it('coincide con evaluarAlerta de lib/calculos en un barrido de casos', () => {
    for (const direccion of ['sube', 'baja'] as const) {
      for (const ref of [3200, 3500, 3800]) {
        for (const hoy of [3100, 3500, 3501, 3900]) {
          const esperado = evaluarAlerta({ umbral: 3500, direccion, estado: 'activa', trmReferencia: ref }, hoy).notificar;
          const acciones = planificarAlertas([fila({ direccion, trm_referencia: ref })], hoy);
          expect(acciones.some((a) => a.tipo === 'notificar')).toBe(esperado);
        }
      }
    }
  });
  it('procesa varias alertas a la vez', () => {
    const acciones = planificarAlertas([fila({ id: 'x' }), fila({ id: 'y', umbral: 4000 }), fila({ id: 'z', estado: 'disparada' })], 3510);
    expect(acciones.map((a) => `${a.tipo}:${a.id}`)).toEqual(['notificar:x', 'actualizar_referencia:y']);
  });
});

describe('construirCorreoAlerta', () => {
  const c = construirCorreoAlerta({ direccion: 'sube', umbral: 3500, trm: 3512.4, urlApp: 'https://frilo-app.vercel.app/' });
  it('dice qué pasó, con cifras en formato colombiano', () => {
    expect(c.asunto).toBe('El dólar subió a $3.512,40: se cumplió tu alerta');
    expect(c.texto).toContain('suba de $3.500');
    expect(c.texto).toContain('$3.512,40');
    expect(c.html).toContain('suba de $3.500');
  });
  it('lleva el logo de Frilo como imagen pública con texto alternativo', () => {
    expect(c.html).toContain('src="https://frilo-app.vercel.app/email/logo.png"');
    expect(c.html).toContain('alt="Frilo"');
  });
  it('enlaza a la pantalla del dólar sin doble barra', () => {
    expect(c.html).toContain('href="https://frilo-app.vercel.app/dolar"');
    expect(c.texto).toContain('https://frilo-app.vercel.app/dolar');
  });
  it('en baja usa el verbo y la condición correctos', () => {
    const b = construirCorreoAlerta({ direccion: 'baja', umbral: 3300, trm: 3290, urlApp: 'https://x.co' });
    expect(b.asunto).toBe('El dólar bajó a $3.290,00: se cumplió tu alerta');
    expect(b.texto).toContain('baje de $3.300');
  });
  it('es transaccional: sin lenguaje de marketing ni enlaces de baja de novedades', () => {
    expect(c.html.toLowerCase()).not.toContain('oferta');
  });
});

describe('filaDeEjecucion', () => {
  const resultado = {
    fecha: '2026-10-07', trmHoy: 3216.01, trmSincronizada: true, trmGuardadas: 11,
    alertasActivas: 3, referenciasActualizadas: 2, disparadas: 1, correosEnviados: 1, correosFallidos: 0,
  };
  it('una corrida normal queda ok y con todos los conteos', () => {
    expect(filaDeEjecucion(resultado, 1234.6, '2026-10-07')).toEqual({
      fecha: '2026-10-07', ok: true, trm_hoy: 3216.01, trm_sincronizada: true, trm_guardadas: 11, error_trm: null,
      alertas_activas: 3, referencias_actualizadas: 2, disparadas: 1, correos_enviados: 1, correos_fallidos: 0,
      duracion_ms: 1235, error: null,
    });
  });
  it('si falló la fuente de la TRM la corrida no es ok y guarda el motivo', () => {
    const f = filaDeEjecucion({ ...resultado, trmSincronizada: false, errorTrm: 'datos.gov.co respondió 503' }, 10, '2026-10-07');
    expect(f.ok).toBe(false);
    expect(f.error_trm).toBe('datos.gov.co respondió 503');
  });
  it('si la tarea se cortó con un error queda registrada con ceros y el mensaje', () => {
    const f = filaDeEjecucion(null, 50, '2026-10-07', 'no se pudieron leer las alertas');
    expect(f).toMatchObject({ ok: false, trm_hoy: null, alertas_activas: 0, correos_enviados: 0, error: 'no se pudieron leer las alertas', fecha: '2026-10-07' });
  });
  it('recorta los mensajes largos y no deja duraciones negativas', () => {
    const f = filaDeEjecucion(null, -5, '2026-10-07', 'x'.repeat(2000));
    expect(f.error).toHaveLength(500);
    expect(f.duracion_ms).toBe(0);
  });
});
