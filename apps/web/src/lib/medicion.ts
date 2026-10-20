'use client';

import { COOKIE_DOMINIO, ES_PRODUCCION } from './config';

/** Eventos del brief §8: `signup_start`, `signup_complete`, `calc_result`, `bank_click`. Solo se envían en producción. */
export type Evento = 'signup_start' | 'signup_complete' | 'calc_result' | 'bank_click';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function registrarEvento(evento: Evento, datos: Record<string, string | number | boolean | undefined> = {}) {
  if (!ES_PRODUCCION || typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: evento, ...datos });
}

// ── Cookies de primer contacto y de intención (no llevan datos personales sensibles) ──

function escribirCookie(nombre: string, valor: string, dias: number) {
  const dominio = COOKIE_DOMINIO ? `; domain=${COOKIE_DOMINIO}` : '';
  const seguro = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${nombre}=${encodeURIComponent(valor)}; max-age=${dias * 86_400}; path=/; SameSite=Lax${dominio}${seguro}`;
}

export function leerCookie(nombre: string): string | null {
  const par = document.cookie.split('; ').find((c) => c.startsWith(`${nombre}=`));
  return par ? decodeURIComponent(par.slice(nombre.length + 1)) : null;
}

/** Guarda una sola vez el primer contacto: UTM, gclid, referrer y página de entrada (first touch). */
export function guardarPrimerContacto() {
  if (leerCookie('frilo_ft')) return;
  const q = new URLSearchParams(location.search);
  const dato = {
    utm_source: q.get('utm_source') ?? undefined,
    utm_medium: q.get('utm_medium') ?? undefined,
    utm_campaign: q.get('utm_campaign') ?? undefined,
    gclid: q.get('gclid') ?? undefined,
    referrer: document.referrer ? new URL(document.referrer).hostname : undefined,
    entrada: location.pathname,
  };
  escribirCookie('frilo_ft', JSON.stringify(dato), 90);
}

/**
 * Acción pendiente que la app retoma al terminar el registro (por ejemplo, activar el recordatorio con dos dígitos).
 * Va en una cookie del dominio compartido y NUNCA en la URL: el sitio y la app son orígenes distintos, así que
 * `sessionStorage` no se comparte entre ellos.
 */
export type Intencion =
  | { tipo: 'recordatorio'; digitos: string }
  | { tipo: 'alerta_dolar'; valor: number }
  | { tipo: 'guardar_calculo'; ingreso: number; riesgo: string };

export function guardarIntencion(i: Intencion) {
  escribirCookie('frilo_intencion', JSON.stringify(i), 1);
}
