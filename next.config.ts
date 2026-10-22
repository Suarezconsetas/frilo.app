import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Permite probar en un segundo servidor sin pisar el .next del que ya corre (NEXT_DIST_DIR=.next-prueba).
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // La app vive en app.frilo.dev y no se indexa: el contenido que posiciona es el del sitio (frilo.dev).
  async headers() {
    return [{ source: '/:ruta*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
};

export default nextConfig;
