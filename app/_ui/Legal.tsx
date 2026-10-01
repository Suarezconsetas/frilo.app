import Link from 'next/link';
import type { ReactNode } from 'react';
import { VERSION_POLITICA } from '@/lib/app/mapeo';
import { HAY_DATOS_PENDIENTES, LEGAL } from '@/lib/legal';
import { Icono } from './Icono';
import { Logo } from './Logo';

/** Marco común de las páginas legales: encabezado, aviso de borrador, versión y fecha. */
export function PaginaLegal({ titulo, intro, children }: { titulo: string; intro: string; children: ReactNode }) {
  return (
    <main className="pantalla ancha">
      <header className="encabezado">
        <Link href="/" className="volver" aria-label="Volver al inicio">
          <Icono nombre="volver" />
        </Link>
        <Logo alto={28} className="logo" />
        <h1 className="titulo-pantalla">{titulo}</h1>
        <p className="subtitulo">{intro}</p>
        <p className="ayuda" style={{ marginTop: 8 }}>
          Versión {VERSION_POLITICA} · Actualizada el {LEGAL.fechaActualizacion}
        </p>
      </header>
      <div className="contenido doc-legal">
        {LEGAL.esBorrador && (
          <p className="banner-borrador" role="note">
            <strong>Borrador pendiente de revisión legal.</strong> Este texto aún no ha sido aprobado por un abogado.{HAY_DATOS_PENDIENTES && ' Los datos entre corchetes se completan antes de publicarlo.'}
          </p>
        )}
        {children}
        <p className="ayuda" style={{ marginTop: 24 }}>
          <Link href="/politica-de-datos">Política de datos</Link> · <Link href="/terminos">Términos de uso</Link>
        </p>
      </div>
    </main>
  );
}

export function Seccion({ n, titulo, children }: { n: number; titulo: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`s${n}`}>
      <h2 id={`s${n}`}>
        {n}. {titulo}
      </h2>
      {children}
    </section>
  );
}
