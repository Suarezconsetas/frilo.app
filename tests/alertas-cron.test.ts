import { evaluarAlerta } from '@/lib/calculos';
import { construirCorreoAlerta, planificarAlertas, type AlertaFila } from '@/lib/cron/alertas';

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
