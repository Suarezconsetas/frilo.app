import Link from 'next/link';
import { JsonLd } from '../../../components/JsonLd';
import { PaginaTexto } from '../../../components/PaginaTexto';
import { metadataDe } from '../../../lib/seo';

export const metadata = metadataDe('Inst-1');

export default function Pagina() {
  return (
    <>
      <PaginaTexto id="Inst-1" borrador>
        <p className="respuesta-corta">
          Frilo es una app gratuita para freelancers y contratistas por prestación de servicios en Colombia, que cobran en pesos, en dólares o en ambos. Te ayuda a entender el dólar, calcular tu planilla y
          reconstruir la prima y las cesantías que tu contrato no trae.
        </p>
        <h2>Quién la hace</h2>
        <p>
          Frilo la crea y la mantiene Nicolás Suárez, fundador. <span className="verificar">[VERIFICAR] trayectoria y experiencia de Nicolás (texto para la señal de confianza)</span>
        </p>
        <h2>Quién revisa el contenido</h2>
        <p>
          El contenido lo revisa el equipo de finanzas de Frilo. <span className="verificar">[VERIFICAR] criterios y formación de quien revisa</span> Conoce cómo calculamos en la{' '}
          <Link href="/metodologia">metodología</Link> y qué hacemos y qué no en la <Link href="/transparencia">transparencia</Link>.
        </p>
      </PaginaTexto>
      <JsonLd id="Inst-1" />
    </>
  );
}
