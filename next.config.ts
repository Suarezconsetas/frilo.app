import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Permite probar en un segundo servidor sin pisar el .next del que ya corre (NEXT_DIST_DIR=.next-prueba).
  distDir: process.env.NEXT_DIST_DIR || '.next',
};

export default nextConfig;
