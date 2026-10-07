import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Permite probar en un segundo servidor sin pisar el .next del que ya corre (NEXT_DIST_DIR=.next-prueba).
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Las pantallas con datos de la persona no deben aparecer en buscadores (la bienvenida, el acceso y los textos legales sí).
  async headers() {
    return [
      {
        source: '/:ruta(inicio|aportes|ahorro|dolar|cuenta|cuenta-eliminada|ingreso|registro|codigo)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
