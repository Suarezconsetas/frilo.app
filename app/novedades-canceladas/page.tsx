import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '../_ui/Logo';

export const metadata: Metadata = { title: 'Novedades canceladas', robots: { index: false } };

export default function NovedadesCanceladas() {
  return (
    <main className="pantalla">
      <div className="contenido formulario" style={{ paddingTop: 40 }}>
        <Logo alto={40} />
        <div>
          <h1 className="titulo-pantalla">Listo, ya no te enviaremos novedades</h1>
          <p className="subtitulo">
            Dejamos de enviarte el resumen semanal del dólar y las demás novedades. Las alertas del dólar que creaste en tu cuenta siguen funcionando.
          </p>
        </div>
        <p className="ayuda">Si cambias de opinión, puedes volver a activarlas en Mi cuenta.</p>
        <Link href="/cuenta" className="btn btn-primario">
          Ir a Mi cuenta
        </Link>
      </div>
    </main>
  );
}
