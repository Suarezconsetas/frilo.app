'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { useApp } from '@/lib/app/estado';
import { exportarMisDatos, guardarMarketing, leerMarketing } from '@/lib/app/nube';
import { Logo } from '../../_ui/Logo';
import { Campo, Interruptor } from '../../_ui/controles';

export default function Cuenta() {
  const router = useRouter();
  const { sesion, sesionLista, listo, sincronizando, db, cerrarSesion } = useApp();
  const userId = sesion?.user.id ?? null;
  const correo = sesion?.user.email ?? null;

  const [novedades, setNovedades] = useState<boolean | null>(null);
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const [descargando, setDescargando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [escrito, setEscrito] = useState('');
  const [errorBorrado, setErrorBorrado] = useState<string>();
  const [borrando, setBorrando] = useState(false);

  useEffect(() => {
    if (listo && sesionLista && !sesion) router.replace('/');
  }, [listo, sesionLista, sesion, router]);

  useEffect(() => {
    if (!userId || sincronizando) return;
    leerMarketing(db(), userId)
      .then(setNovedades)
      .catch(() => setNovedades(false));
  }, [userId, sincronizando, db]);

  if (!listo || !sesionLista || !sesion || !userId) return null;

  async function cambiarNovedades(valor: boolean) {
    const anterior = novedades;
    setNovedades(valor);
    setAviso(null);
    try {
      await guardarMarketing(db(), userId!, valor, navigator.userAgent);
      setAviso({ tipo: 'ok', texto: valor ? 'Listo: te enviaremos novedades y ofertas de Frilo.' : 'Listo: no te enviaremos novedades ni ofertas.' });
    } catch {
      setNovedades(anterior);
      setAviso({ tipo: 'error', texto: 'No pudimos guardar el cambio. Inténtalo de nuevo.' });
    }
  }

  async function descargar() {
    setDescargando(true);
    setAviso(null);
    try {
      const datos = await exportarMisDatos(db(), userId!, { correo, creada_en: sesion?.user.created_at ?? null });
      const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
      const enlace = document.createElement('a');
      enlace.href = URL.createObjectURL(blob);
      enlace.download = `frilo-mis-datos-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      URL.revokeObjectURL(enlace.href);
      setAviso({ tipo: 'ok', texto: 'Descargamos tus datos en un archivo. Guárdalo en un lugar seguro: tiene información financiera.' });
    } catch {
      setAviso({ tipo: 'error', texto: 'No pudimos preparar tus datos. Inténtalo de nuevo.' });
    } finally {
      setDescargando(false);
    }
  }

  async function eliminar(e: FormEvent) {
    e.preventDefault();
    setErrorBorrado(undefined);
    setBorrando(true);
    try {
      const r = await fetch('/api/cuenta/eliminar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sesion!.access_token}` },
        body: JSON.stringify({ confirmacion: escrito }),
      });
      const cuerpo = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!r.ok || !cuerpo.ok) {
        setErrorBorrado(cuerpo.error ?? 'No pudimos eliminar tu cuenta. Inténtalo de nuevo.');
        setBorrando(false);
        return;
      }
      await cerrarSesion(); // la cuenta ya no existe: se limpia también este dispositivo
      router.replace('/cuenta-eliminada');
    } catch {
      setErrorBorrado('No pudimos eliminar tu cuenta. Revisa tu conexión e inténtalo de nuevo.');
      setBorrando(false);
    }
  }

  const coincide = !!correo && escrito.trim().toLowerCase() === correo.toLowerCase();

  return (
    <main>
      <header className="encabezado">
        <Logo alto={28} className="logo" />
        <h1 className="titulo-pantalla">Mi cuenta y privacidad</h1>
        <p className="subtitulo">Tus datos son tuyos: descárgalos, decide qué te enviamos o elimina tu cuenta.</p>
      </header>

      <div className="contenido">
        <section className="tarjeta">
          <h2 className="titulo-tarjeta">Tu cuenta</h2>
          <p className="texto-suave" style={{ margin: '6px 0 14px', fontSize: 14 }}>
            Sesión iniciada con <strong style={{ color: 'var(--tinta)', fontWeight: 600 }}>{correo}</strong>
          </p>
          <button
            type="button"
            className="btn btn-secundario"
            onClick={async () => {
              await cerrarSesion();
              router.replace('/');
            }}
          >
            Cerrar sesión
          </button>
        </section>

        <section className="tarjeta">
          <h2 className="titulo-tarjeta">Descargar mis datos</h2>
          <p className="texto-suave" style={{ margin: '6px 0 14px', fontSize: 14, lineHeight: '21px' }}>
            Te damos un archivo con todo lo que Frilo guarda de ti: tu perfil, tus ingresos y pagos, tus cobros, tus alertas y la prueba de tus autorizaciones.
          </p>
          <button type="button" className="btn btn-secundario" onClick={descargar} disabled={descargando}>
            {descargando ? 'Preparando…' : 'Descargar mis datos'}
          </button>
        </section>

        <section className="tarjeta">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div>
              <p id="novedades-etiqueta" style={{ fontSize: 16, fontWeight: 600 }}>
                Novedades y ofertas de Frilo
              </p>
              <p className="texto-suave" style={{ marginTop: 6, fontSize: 14, lineHeight: '21px' }}>
                Correos opcionales con novedades, ofertas y recomendaciones. Las alertas del dólar que creas no dependen de esto.
              </p>
            </div>
            {novedades !== null && <Interruptor idEtiqueta="novedades-etiqueta" activo={novedades} onCambio={cambiarNovedades} />}
          </div>
        </section>

        {aviso && (
          <p className={aviso.tipo === 'error' ? 'aviso-error' : 'aviso-ok'} role={aviso.tipo === 'error' ? 'alert' : 'status'}>
            {aviso.texto}
          </p>
        )}

        <section className="tarjeta zona-peligro">
          <h2 className="titulo-tarjeta">Eliminar mi cuenta</h2>
          <p className="texto-suave" style={{ margin: '6px 0 14px', fontSize: 14, lineHeight: '21px' }}>
            Borramos tu perfil, tus ingresos, tus cobros y tus alertas, y no se puede deshacer. Solo conservamos la constancia de tus autorizaciones, como explica la{' '}
            <Link href="/politica-de-datos" style={{ fontWeight: 600 }}>
              Política de datos
            </Link>
            .
          </p>
          {!confirmando ? (
            <button type="button" className="btn btn-peligro" onClick={() => setConfirmando(true)}>
              Eliminar mi cuenta
            </button>
          ) : (
            <form onSubmit={eliminar} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Campo id="confirmar-correo" etiqueta="Para confirmar, escribe tu correo" ayuda={correo ?? undefined} error={errorBorrado}>
                {(p) => <input {...p} type="email" autoComplete="off" value={escrito} onChange={(e) => setEscrito(e.target.value)} />}
              </Campo>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-peligro" disabled={!coincide || borrando}>
                  {borrando ? 'Eliminando…' : 'Sí, eliminar mi cuenta'}
                </button>
                <button
                  type="button"
                  className="btn btn-secundario"
                  style={{ width: 'auto' }}
                  onClick={() => {
                    setConfirmando(false);
                    setEscrito('');
                    setErrorBorrado(undefined);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </section>

        <p className="ayuda" style={{ margin: '0 4px' }}>
          Para cualquier otro derecho (corregir un dato, consultas o reclamos), escríbenos al correo de privacidad de la{' '}
          <Link href="/politica-de-datos" style={{ fontWeight: 600 }}>
            Política de datos
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
