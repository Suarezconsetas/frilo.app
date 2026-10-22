import path from 'node:path';
import type { NextConfig } from 'next';

// Doble candado (ver src/lib/config.ts): producción de Vercel Y PUBLICAR_SITIO=si.
const ES_PRODUCCION = process.env.VERCEL_ENV === 'production' && process.env.PUBLICAR_SITIO === 'si';

// Rutas que antes vivían en frilo.dev (cuando la app estaba en la raíz) y ahora son de la app. Se redirigen con 308 conservando
// la consulta, para que sigan funcionando los enlaces de correos ya enviados (bajas, recordatorios, entrar) y los favoritos.
const URL_APP = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.frilo.dev').replace(/\/$/, '');
const RUTAS_DE_LA_APP = [
  '/entrar',
  '/registro',
  '/codigo',
  '/ingreso',
  '/instalar',
  '/bienvenida',
  '/inicio',
  '/aportes',
  '/ahorro',
  '/dolar',
  '/cuenta',
  '/cuenta-eliminada',
  '/novedades-canceladas',
  '/recordatorio-apagado',
  '/auth/:path*',
  '/api/:path*',
  '/guia/:path*',
  '/icons/:path*',
  '/manifest.webmanifest',
];

const nextConfig: NextConfig = {
  // El doble candado se calcula al compilar y se expone al navegador (VERCEL_ENV y PUBLICAR_SITIO no existen allí).
  env: { NEXT_PUBLIC_ES_PRODUCCION: ES_PRODUCCION ? 'si' : 'no' },
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // El sitio importa la lógica compartida de `lib/` (en la raíz del repositorio, donde vive la app).
  experimental: { externalDir: true },
  outputFileTracingRoot: path.join(__dirname, '../../'),
  trailingSlash: false, // /ruta/ → /ruta
  poweredByHeader: false,
  async redirects() {
    return RUTAS_DE_LA_APP.map((source) => ({ source, destination: `${URL_APP}${source.replace(/\/:path\*$/, '/:path*')}`, permanent: true }));
  },
  async headers() {
    const noIndexar = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }];
    return [
      // En todo lo que no sea producción (vistas previas y local): ningún buscador indexa nada.
      ...(ES_PRODUCCION ? [] : [{ source: '/:ruta*', headers: noIndexar }]),
      // La landing de pauta y la vista previa de componentes nunca se indexan.
      { source: '/lp/:ruta*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] },
      { source: '/componentes', headers: noIndexar },
    ];
  },
};

export default nextConfig;
