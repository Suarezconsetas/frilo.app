import { JsonLd } from '../../../../components/JsonLd';
import { CalculadoraIbc } from '../../../../dinamicos/CalculadoraIbc';
import { ContenidoP02 } from '../../../../paginas/P02';
import { metadataDe } from '../../../../lib/seo';

export const metadata = metadataDe('P02');

export default function Pagina() {
  return (
    <>
      <ContenidoP02 dinamicos={{ b1: <CalculadoraIbc /> }} />
      <JsonLd id="P02" />
    </>
  );
}
