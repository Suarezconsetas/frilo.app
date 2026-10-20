import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '../_ui/Logo';

export const metadata: Metadata = { title: 'Recordatorio apagado', robots: { index: false } };

export default function RecordatorioApagado() {
  return (
    <main className="pantalla">
      <div className="contenido formulario" style={{ paddingTop: 40 }}>
        <Logo alto={40} />
        <div>
          <h1 className="titulo-pantalla">Listo, apagamos el recordatorio</h1>
          <p className="subtitulo">Ya no te escribiremos para recordarte la fecha límite de tu planilla. Las demás funciones de tu cuenta siguen igual.</p>
        </div>
        <p className="ayuda">Si cambias de opinión, puedes volver a activarlo en Aportes.</p>
        <Link href="/aportes" className="btn btn-primario">
          Ir a Aportes
        </Link>
      </div>
    </main>
  );
}
