import type { MetadataRoute } from 'next';

/**
 * Cómo se instala Frilo en el inicio del celular. `start_url: '/'` hace que siempre abra por la bienvenida,
 * que lleva directo al inicio a quien ya tiene sesión (y no a la última pantalla en la que se agregó).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Frilo · Tus finanzas, mejor con Frilo',
    short_name: 'Frilo',
    description: 'Calcula tus aportes, sigue el dólar y aparta tu prima y tus cesantías.',
    lang: 'es-CO',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0F372D',
    theme_color: '#0F372D',
    icons: [
      { src: '/icons/frilo-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/frilo-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
