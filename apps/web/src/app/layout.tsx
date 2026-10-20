import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { PrimerContacto } from '../components/PrimerContacto';
import { URL_SITIO } from '../lib/config';
import './globals.css';
import '../paginas/wireframes.css';
import './legal.css';

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITIO),
  applicationName: 'Frilo',
  // Cada página define su title y description desde el Excel (`metadataDe`).
  openGraph: { siteName: 'Frilo', locale: 'es_CO', type: 'website' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0F372D' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CO" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Clarity+City:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <PrimerContacto />
      </body>
    </html>
  );
}
