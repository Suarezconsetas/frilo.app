import Link from 'next/link';
import { JsonLd } from '../../../components/JsonLd';
import { PaginaTexto } from '../../../components/PaginaTexto';
import { metadataDe } from '../../../lib/seo';

export const metadata = metadataDe('Hub-Glo');

export default function Pagina() {
  return (
    <>
      <PaginaTexto id="Hub-Glo" borrador>
        <p className="respuesta-corta">Los términos de la planilla de seguridad social explicados en lenguaje claro, con su fuente oficial. Se indexa cuando haya al menos tres entradas.</p>
        <ul>
          <li>
            <Link href="/glosario/sln">SLN: qué significa en la planilla de seguridad social</Link>
          </li>
        </ul>
        <p className="aviso">Más términos próximamente.</p>
      </PaginaTexto>
      <JsonLd id="Hub-Glo" />
    </>
  );
}
