import { JsonLd } from '../../../../components/JsonLd';
import { CalculadoraAportes } from '../../../../dinamicos/CalculadoraAportes';
import { ContenidoP01 } from '../../../../paginas/P01';
import { metadataDe } from '../../../../lib/seo';

export const metadata = metadataDe('P01');

export default function Pagina() {
  return (
    <>
      <ContenidoP01 dinamicos={{ b1: <CalculadoraAportes /> }} />
      <JsonLd id="P01" />
    </>
  );
}
