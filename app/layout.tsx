import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ProveedorApp } from '@/lib/app/estado';
import { cargarDatosTrm } from '@/lib/trm-servidor';
import './globals.css';

// La TRM viene de nuestra base (la llena la tarea diaria): se refresca cada hora, no por visita.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Frilo',
  description: 'Tus finanzas, mejor con Frilo. Más claridad, más libertad.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0F372D' };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const trm = await cargarDatosTrm();
  return (
    <html lang="es-CO">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Clarity+City:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ProveedorApp trm={trm}>{children}</ProveedorApp>
      </body>
    </html>
  );
}
