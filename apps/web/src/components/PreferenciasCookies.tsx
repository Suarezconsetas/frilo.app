'use client';

import { GTM_ID } from '../lib/config';
import { abrirPreferenciasCookies } from '../lib/consentimiento';

/** Enlace del pie para volver a elegir sobre las cookies de analítica. */
export function PreferenciasCookies() {
  if (!GTM_ID) return null;
  return (
    <button type="button" className="enlace-cookies" onClick={abrirPreferenciasCookies}>
      Preferencias de cookies
    </button>
  );
}
