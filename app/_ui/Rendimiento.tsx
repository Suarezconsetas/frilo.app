'use client';

import { SpeedInsights } from '@vercel/speed-insights/next';

/**
 * Velocidad real de la app (Core Web Vitals) con Vercel Speed Insights: sin cookies y sin identificar a nadie.
 * Igual que la analítica de visitas, se recorta todo lo que sigue a la ruta antes de enviar la dirección.
 */
export function Rendimiento() {
  return <SpeedInsights beforeSend={(evento) => ({ ...evento, url: evento.url.split('?')[0]!.split('#')[0]! })} />;
}
