'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { usd, pesos, capitalizar, nombreMes } from '@/lib/formato';
import { useMes } from '@/lib/app/usarMes';
import { Logo } from '../_ui/Logo';
import { Campo } from '../_ui/controles';

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// FASE 3: aquí se conectan Google y el código por correo con Supabase Auth, y se guardan las
// autorizaciones (tratamiento_datos y, si la marca, marketing_frilo). Por ahora solo se avanza.
export default function Registro() {
  const router = useRouter();
  const { listo, ingreso, resumen, sinTrm, mesHoy, actualizar } = useMes();
  const [correo, setCorreo] = useState('');
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState<string>();

  if (!listo || !ingreso) return null;

  function pedirCodigo(e: FormEvent) {
    e.preventDefault();
    if (!CORREO.test(correo.trim())) {
      setError('Escribe un correo válido, por ejemplo tu@correo.com.');
      return;
    }
    actualizar({ correoPendiente: correo.trim() });
    router.push('/codigo');
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

      <form className="contenido" style={{ paddingTop: 28, gap: 14 }} onSubmit={pedirCodigo} noValidate>
        <h1 className="titulo-pantalla">Guarda tu mes</h1>
        <p className="subtitulo" style={{ margin: '0 0 6px' }}>
          Crea tu cuenta para ver el detalle, guardar tus cálculos y recibir alertas del dólar.
        </p>

        <Link href="/inicio" className="btn btn-secundario" style={{ minHeight: 52, borderRadius: 'var(--radius-l)', fontSize: 16 }}>
          Continuar con Google
        </Link>

        <div className="separador" role="separator">
          o con tu correo
        </div>

        <Campo id="correo" etiqueta="Correo electrónico" error={error}>
          {(p) => (
            <input
              {...p}
              type="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          )}
        </Campo>
        <button type="submit" className="btn btn-primario">
          Enviarme un código
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
