'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ES_PRODUCCION, GTM_ID } from '../lib/config';
import { EVENTO_CONSENTIMIENTO, EVENTO_PREFERENCIAS, guardarConsentimiento, leerConsentimiento, type Consentimiento } from '../lib/consentimiento';
import { registrarEvento } from '../lib/medicion';

function cargarGtm(id: string) {
  const w = window as unknown as { dataLayer: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  // Solo analítica: publicidad y personalización de anuncios quedan denegadas.
  w.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

/** Borra las cookies de Google Analytics (`_ga*`) del dominio y de sus subdominios. */
function borrarCookiesGa() {
  const host = location.hostname;
  const partes = host.split('.');
  const dominios = ['', host, `.${host}`, partes.length > 2 ? `.${partes.slice(-2).join('.')}` : ''].filter((d, i) => i === 0 || d);
  document.cookie.split('; ').forEach((c) => {
    const nombre = c.split('=')[0] ?? '';
    if (!nombre.startsWith('_ga')) return;
    dominios.forEach((d) => (document.cookie = `${nombre}=; max-age=0; path=/${d ? `; domain=${d}` : ''}`));
  });
}

/**
 * Aviso de cookies y carga de Google Tag Manager. Nada se carga hasta que la persona acepta; rechazar es igual de fácil.
 * Solo funciona en el despliegue de producción publicado (mismo doble candado que la indexación); en las demás vistas
 * el aviso se ve para revisarlo, pero no se carga Google.
 */
export function Analitica() {
  const [eleccion, setEleccion] = useState<Consentimiento | null | 'cargando'>('cargando');
  const [abierto, setAbierto] = useState(false);
  const cargado = useRef(false);
  const calculo = useRef(false);

  useEffect(() => {
    const leer = () => setEleccion(leerConsentimiento());
    leer();
    window.addEventListener(EVENTO_CONSENTIMIENTO, leer);
    const abrir = () => setAbierto(true);
    window.addEventListener(EVENTO_PREFERENCIAS, abrir);
    return () => {
      window.removeEventListener(EVENTO_CONSENTIMIENTO, leer);
      window.removeEventListener(EVENTO_PREFERENCIAS, abrir);
    };
  }, []);

  useEffect(() => {
    if (eleccion !== 'si' || !ES_PRODUCCION || !GTM_ID || cargado.current) return;
    cargado.current = true;
    cargarGtm(GTM_ID);
  }, [eleccion]);

  // Clics en enlaces de bancos y primer uso de una calculadora. Nunca se envían los valores que escribe la persona.
  useEffect(() => {
    if (eleccion !== 'si') return;
    const clic = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('[data-evento]') as HTMLElement | null;
      if (!a || a.dataset.evento !== 'bank_click') return;
      registrarEvento('bank_click', { entidad: a.dataset.entidad, pagina: location.pathname });
    };
    const campo = (e: Event) => {
      const el = e.target as HTMLInputElement | null;
      if (calculo.current || !el?.classList?.contains('field') || el.type === 'email' || el.id.startsWith('alerta-')) return;
      calculo.current = true;
      registrarEvento('calc_result', { pagina: location.pathname });
    };
    document.addEventListener('click', clic);
    document.addEventListener('input', campo);
    return () => {
      document.removeEventListener('click', clic);
      document.removeEventListener('input', campo);
    };
  }, [eleccion]);

  if (!GTM_ID || eleccion === 'cargando') return null;
  if (eleccion !== null && !abierto) return null;

  const elegir = (v: Consentimiento) => {
    const eraSi = eleccion === 'si';
    guardarConsentimiento(v);
    setAbierto(false);
    if (v === 'no' && eraSi) {
      borrarCookiesGa();
      location.reload();
    }
  };

  return (
    <section className="aviso-cookies" role="dialog" aria-labelledby="aviso-cookies-titulo" aria-live="polite">
      <div className="aviso-cookies-texto">
        <p id="aviso-cookies-titulo" className="aviso-cookies-titulo">
          Cookies de analítica
        </p>
        <p>
          Con tu permiso usamos Google Analytics para saber qué páginas y calculadoras sirven y cuántas personas se registran. No enviamos tus ingresos ni tu correo, y no usamos cookies de publicidad. Puedes
          cambiar tu elección cuando quieras en «Preferencias de cookies», al final de la página. Más en la <Link href="/politica-de-datos">Política de datos</Link>.
        </p>
      </div>
      <div className="aviso-cookies-botones">
        <button type="button" className="aviso-cookies-no" onClick={() => elegir('no')}>
          Rechazar
        </button>
        <button type="button" className="aviso-cookies-si" onClick={() => elegir('si')}>
          Aceptar
        </button>
      </div>
    </section>
  );
}
