'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { CORREO_VALIDO, GOOGLE_ACTIVO, entrarConGoogle, mensajeDeError, pedirCodigo } from '@/lib/app/acceso';
import { useApp } from '@/lib/app/estado';
import { useMes } from '@/lib/app/usarMes';
import { capitalizar, nombreMes, pesos, usd } from '@/lib/formato';
import { Logo } from '../_ui/Logo';
import { Campo } from '../_ui/controles';

/** "Guarda tu mes": primero el resultado, después la cuenta (Google o código por correo). */
export default function Registro() {
  const router = useRouter();
  const { db, sesion } = useApp();
  const { listo, ingreso, resumen, sinTrm, mesHoy, actualizar } = useMes({ requerido: false });
  const [correo, setCorreo] = useState('');
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState<string>();
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!listo) return;
    if (sesion) router.replace('/inicio');
    else if (!ingreso) router.replace('/');
  }, [listo, sesion, ingreso, router]);

  if (!listo || !ingreso || sesion) return null;

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!CORREO_VALIDO.test(correo.trim())) {
      setError('Escribe un correo válido, por ejemplo tu@correo.com.');
      return;
    }
    setError(undefined);
    setEnviando(true);
    try {
      // La autorización se guarda en la base al verificar el código; aquí queda pendiente.
      actualizar({ correoPendiente: correo.trim(), autorizacionPendiente: { marketing } });
      await pedirCodigo(db(), correo.trim());
      router.push('/codigo');
    } catch (err) {
      setError(mensajeDeError(err, 'enviar'));
    } finally {
      setEnviando(false);
    }
  }

  async function conGoogle() {
    setError(undefined);
    actualizar({ autorizacionPendiente: { marketing } });
    try {
      await entrarConGoogle(db());
    } catch {
      setError('No pudimos abrir Google. Inténtalo de nuevo o usa tu correo.');
    }
  }

  const mes = capitalizar(nombreMes(Number(mesHoy.slice(5, 7))));
  const cuanto = ingreso.moneda === 'USD' ? usd(ingreso.monto) : pesos(ingreso.monto);

  return (
    <main className="pantalla">
      <header className="cabecera-oliva sobre-oliva">
        <Logo sobreOliva alto={32} />
        {resumen ? (
          <>
            <p className="suave" style={{ marginTop: 24, fontSize: 15 }}>
              Con {cuanto} al mes, en {mes.toLowerCase()} te quedan
            </p>
            <p className="cifra-xl">{pesos(resumen.disponible)}</p>
            <div className="chips">
              <div className="chip-oliva">
                <p className="ayuda">Aportes a pagar</p>
                <strong>{pesos(resumen.aportes.totalUsuario)}</strong>
              </div>
              <div className="chip-oliva">
                <p className="ayuda">Prima y cesantías</p>
                <strong>{pesos(resumen.ahorroPrima + resumen.ahorroCesantias)}</strong>
              </div>
            </div>
          </>
        ) : (
          <p style={{ marginTop: 24 }}>{sinTrm ? 'No pudimos traer la TRM de hoy para calcular tu mes.' : 'Calculando tu mes…'}</p>
        )}
      </header>

      <form className="contenido" style={{ paddingTop: 28, gap: 14 }} onSubmit={enviar} noValidate>
        <h1 className="titulo-pantalla">Guarda tu mes</h1>
        <p className="subtitulo" style={{ margin: '0 0 6px' }}>
          Crea tu cuenta para ver el detalle, guardar tus cálculos y recibir alertas del dólar.
        </p>

        {GOOGLE_ACTIVO && (
          <>
            <button type="button" className="btn btn-secundario" style={{ minHeight: 52, borderRadius: 'var(--radius-l)', fontSize: 16 }} onClick={conGoogle}>
              Continuar con Google
            </button>
            <div className="separador" role="separator">
              o con tu correo
            </div>
          </>
        )}

        <Campo id="correo" etiqueta="Correo electrónico" error={error}>
          {(p) => (
            <input {...p} type="email" autoComplete="email" placeholder="tu@correo.com" value={correo} onChange={(e) => setCorreo(e.target.value)} />
          )}
        </Campo>
        <button type="submit" className="btn btn-primario" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviarme un código'}
        </button>

        {/* Casilla opcional y desmarcada por defecto (Ley 1581 de 2012). */}
        <label className="casilla" style={{ marginTop: 6 }}>
          <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
          <span>Quiero recibir novedades, ofertas y recomendaciones de Frilo por correo.</span>
        </label>
        <p className="legal">
          Al continuar autorizas el tratamiento de tus datos personales según la{' '}
          <a href="#politica" style={{ fontWeight: 600 }}>
            Política de tratamiento de datos
          </a>{' '}
          de Frilo (Ley 1581 de 2012). Puedes consultar, corregir o borrar tus datos cuando quieras.
        </p>
      </form>
    </main>
  );
}
