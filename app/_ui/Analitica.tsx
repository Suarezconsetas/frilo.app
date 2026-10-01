'use client';

import { Analytics } from '@vercel/analytics/next';

/**
 * Estadísticas de uso agregadas con Vercel Web Analytics: sin cookies y sin identificar a la persona.
 * Antes de enviar cada visita se recorta todo lo que sigue a la ruta (parámetros y fragmentos),
 * para que nunca viaje un código u otro dato que venga en la dirección.
 */
export function Analitica() {
  return <Analytics beforeSend={(evento) => ({ ...evento, url: evento.url.split('?')[0]!.split('#')[0]! })} />;
}
