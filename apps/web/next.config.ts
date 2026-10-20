import path from 'node:path';
import type { NextConfig } from 'next';

const ES_PRODUCCION = process.env.VERCEL_ENV === 'production';

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // El sitio importa la lógica compartida de `lib/` (en la raíz del repositorio, donde vive la app).
  experimental: { externalDir: true },
  outputFileTracingRoot: path.join(__dirname, '../../'),
  trailingSlash: false, // /ruta/ → /ruta
  poweredByHeader: false,
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
