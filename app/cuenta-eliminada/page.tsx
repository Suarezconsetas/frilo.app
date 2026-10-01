import type { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL } from '@/lib/legal';
import { Logo } from '../_ui/Logo';

export const metadata: Metadata = { title: 'Cuenta eliminada' };

export default function CuentaEliminada() {
  return (
    <main className="pantalla">
      <div className="contenido formulario" style={{ paddingTop: 40 }}>
        <Logo alto={40} />
        <div>
          <h1 className="titulo-pantalla">Eliminamos tu cuenta</h1>
          <p className="subtitulo">
            Borramos tu perfil, tus ingresos, tus cobros y tus alertas. Solo conservamos la constancia de tus autorizaciones, como explica nuestra{' '}
            <Link href="/politica-de-datos" style={{ fontWeight: 600 }}>
              Política de datos
            </Link>
            .
          </p>
        </div>
        <p className="ayuda">Si algo no quedó como esperabas, escríbenos a {LEGAL.correoPrivacidad}.</p>
        <Link href="/" className="btn btn-primario">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
