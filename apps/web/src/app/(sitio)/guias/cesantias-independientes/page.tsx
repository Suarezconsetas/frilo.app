import { JsonLd } from '../../../../components/JsonLd';
import { EntradaP12, ProveedorP12, ResultadoP12 } from '../../../../dinamicos/CalculadoraP12';
import { ContenidoP12 } from '../../../../paginas/P12';
import { metadataDe } from '../../../../lib/seo';

export const metadata = metadataDe('P12');

export default function Pagina() {
  return (
    <ProveedorP12>
      <ContenidoP12 dinamicos={{ b1: <EntradaP12 />, b2: <ResultadoP12 /> }} />
      <JsonLd id="P12" />
    </ProveedorP12>
  );
}
