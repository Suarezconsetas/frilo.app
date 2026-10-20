'use client';

import Link from 'next/link';
import { GOOGLE_ACTIVO, LARGO_CODIGO } from '../lib/config';
import type { Intencion } from '../lib/medicion';
import { useRegistro } from '../lib/registro';
import { Isotipo } from './Logo';

export type VarianteRegistro = 'recordatorio' | 'dolar' | 'prima' | 'aportes' | 'general';

const TEXTOS: Record<VarianteRegistro, { eyebrow: string; titulo: string; cta: string; puntos: string[] }> = {
  recordatorio: {
    eyebrow: 'Recordatorio de pago de la planilla',
    titulo: 'Que no se te pase la fecha de pago: te avisamos cada mes.',
    cta: 'Activar mi recordatorio',
    puntos: ['Correo 3 días hábiles antes y el mismo día de tu fecha límite.', 'Calculado con los dos últimos dígitos de tu documento y los festivos de Colombia.', 'Gratis. Lo apagas cuando quieras.'],
  },
  dolar: {
    eyebrow: 'Alerta del dólar',
    titulo: 'Te avisamos cuando el dólar llegue a tu precio.',
    cta: 'Crear mi alerta',
    puntos: ['Pon tu valor objetivo y recibe un correo cuando la TRM llegue.', 'La TRM oficial de la Superintendencia Financiera.', 'Gratis. La apagas cuando quieras.'],
  },
  prima: {
    eyebrow: 'Prima y cesantías',
    titulo: 'Lleva tu prima y tus cesantías mes a mes.',
    cta: 'Empezar a ahorrar',
    puntos: ['Te decimos cuánto apartar de cada pago.', 'Ves cuánto llevas y cuánto rendiría en una cuenta.', 'Marca cuándo cobraste tu prima.'],
  },
  aportes: {
    eyebrow: 'Tu planilla, cada mes',
    titulo: 'Guarda tu cálculo y recibe el valor de tu planilla cada mes.',
    cta: 'Guardar mi cálculo',
    puntos: ['El valor exacto de salud, pensión y ARL con tu ingreso.', 'Recordatorio de tu fecha límite de pago.', 'Funciona si cobras en pesos o en dólares.'],
  },
  general: {
    eyebrow: 'Frilo, gratis',
    titulo: 'Tus finanzas de freelancer en un solo lugar.',
    cta: 'Crear mi cuenta',
    puntos: ['Planilla, prima, cesantías y dólar.', 'Recordatorios y alertas por correo.', 'Sin costo y sin vender tus datos.'],
  },
};

/**
 * Registro embebido (brief §2.9): Google y código de 6 dígitos por correo en el mismo bloque.
 * `intencion` es lo que la persona hizo en la página (p. ej. los dos dígitos de su documento); se deja en una cookie del
 * dominio compartido, nunca en la URL, y se retoma en la app al terminar.
 */
export function BannerRegistro({ variante, pagina, intencion }: { variante: VarianteRegistro; pagina: string; intencion?: Intencion }) {
  const t = TEXTOS[variante];
  const { paso, correo, setCorreo, codigo, setCodigo, error, ocupado, conGoogle, pedirCodigo, verificar, volver } = useRegistro({ variante, pagina, intencion: intencion ? () => intencion : undefined });

  return (
    <section id="registro" aria-label="Crea tu cuenta en Frilo" className="banner-registro">
      <div className="registro-texto">
        <span className="banner-eyebrow">
          <Isotipo tono="manzana" alto={28} />
          {t.eyebrow}
        </span>
        <p className="banner-titulo">{t.titulo}</p>
        <ul className="registro-puntos">
          {t.puntos.map((p) => (
            <li key={p}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6FFF8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7" />
              </svg>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="registro-caja">
        {paso === 1 ? (
          <form onSubmit={pedirCodigo} noValidate>
            <span className="registro-titulo">Crea tu cuenta gratis</span>
            {GOOGLE_ACTIVO && (
              <>
                <button type="button" className="boton-google" onClick={conGoogle} disabled={ocupado}>
                  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  Continuar con Google
                </button>
                <div className="registro-o">
                  <span aria-hidden="true" />o con tu correo<span aria-hidden="true" />
                </div>
              </>
            )}
            <label htmlFor="reg-correo" className="sr-only">
              Correo electrónico
            </label>
            <input id="reg-correo" type="email" autoComplete="email" placeholder="tu@correo.com" value={correo} onChange={(e) => setCorreo(e.target.value)} className="registro-input" />
            <button type="submit" className="boton-degradado grande" disabled={ocupado}>
              {ocupado ? 'Enviando…' : t.cta}
            </button>
          </form>
        ) : (
          <form onSubmit={verificar} noValidate>
            <span className="registro-titulo">Revisa tu correo</span>
            <span className="registro-ayuda">
              Te enviamos un código de {LARGO_CODIGO} dígitos a {correo || 'tu correo'}.
            </span>
            <label htmlFor="reg-codigo" className="registro-ayuda">
              Código
            </label>
            <input
              id="reg-codigo"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={LARGO_CODIGO}
              placeholder={'0'.repeat(LARGO_CODIGO)}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
              className="registro-input codigo"
            />
            <button type="submit" className="boton-degradado grande" disabled={ocupado}>
              {ocupado ? 'Verificando…' : 'Verificar y entrar'}
            </button>
            <button
              type="button"
              className="boton-contorno"
              onClick={volver}
            >
              Usar otro correo
            </button>
          </form>
        )}
        {error && (
          <p role="alert" className="registro-error">
            {error}
          </p>
        )}
        <span className="registro-legal">
          Al continuar aceptas los <Link href="/terminos">Términos de uso</Link> y la <Link href="/politica-de-datos">Política de datos</Link>. No vendemos tus datos.
        </span>
      </div>
    </section>
  );
}
