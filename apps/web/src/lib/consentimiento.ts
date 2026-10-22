'use client';

/**
 * Elección sobre las cookies de analítica (Google Analytics vía Tag Manager). Se guarda en el almacenamiento del navegador,
 * no en una cookie. Sin elección = no se carga nada: la analítica solo existe si la persona la acepta.
 */
export type Consentimiento = 'si' | 'no';

const CLAVE = 'frilo_cookies';
export const EVENTO_CONSENTIMIENTO = 'frilo:consentimiento';
export const EVENTO_PREFERENCIAS = 'frilo:preferencias';

export function leerConsentimiento(): Consentimiento | null {
  try {
    const v = localStorage.getItem(CLAVE);
    return v === 'si' || v === 'no' ? v : null;
  } catch {
    return null;
  }
}

export function guardarConsentimiento(v: Consentimiento) {
  try {
    localStorage.setItem(CLAVE, v);
  } catch {
    /* sin almacenamiento: la elección vale solo para esta visita */
  }
  window.dispatchEvent(new Event(EVENTO_CONSENTIMIENTO));
}

export const abrirPreferenciasCookies = () => window.dispatchEvent(new Event(EVENTO_PREFERENCIAS));
