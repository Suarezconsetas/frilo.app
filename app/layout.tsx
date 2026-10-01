import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ProveedorApp } from '@/lib/app/estado';
import { Analitica } from './_ui/Analitica';
import { cargarDatosTrm } from '@/lib/trm-servidor';
import './globals.css';

// La TRM viene de nuestra base (la llena la tarea diaria): se refresca cada hora, no por visita.
export const revalidate = 3600;

const URL_APP = process.env.NEXT_PUBLIC_APP_URL ?? 'https://frilo-app.vercel.app';
const TITULO = 'Frilo · Tus finanzas, mejor con Frilo';
const DESCRIPCION =
  'Calcula cuánto pagar de planilla, sigue el dólar (TRM) y aparta tu prima y tus cesantías si trabajas por prestación de servicios o para el exterior.';

// La imagen para compartir (opengraph-image / twitter-image) y los íconos salen de los archivos de esta carpeta.
export const metadata: Metadata = {
  metadataBase: new URL(URL_APP),
  title: { default: TITULO, template: '%s · Frilo' },
  description: DESCRIPCION,
  applicationName: 'Frilo',
  openGraph: { type: 'website', locale: 'es_CO', siteName: 'Frilo', title: TITULO, description: DESCRIPCION, url: '/' },
  twitter: { card: 'summary_large_image', title: TITULO, description: DESCRIPCION },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0F372D' };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const trm = await cargarDatosTrm();
  return (
    <html lang="es-CO" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Clarity+City:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      {/* Las extensiones del navegador (LanguageTool, Grammarly…) agregan atributos a <html> y <body> antes de hidratar. */}
      <body suppressHydrationWarning>
        <ProveedorApp trm={trm}>{children}</ProveedorApp>
        <Analitica />
      </body>
    </html>
  );
}
