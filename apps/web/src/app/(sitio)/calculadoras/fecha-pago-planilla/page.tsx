import { JsonLd } from '../../../../components/JsonLd';
import { BuscadorFechaPago, TablaDiaHabil } from '../../../../dinamicos/BuscadorFechaPago';
import { ContenidoP05 } from '../../../../paginas/P05';
import { metadataDe } from '../../../../lib/seo';
import { SigueCon } from '../../../../components/SigueCon';

export const metadata = metadataDe('P05');

export default function Pagina() {
  return (
    <>
      <ContenidoP05 dinamicos={{ b1: <BuscadorFechaPago />, b2: <TablaDiaHabil /> }} />
      <SigueCon id="P05" />
      <JsonLd id="P05" />
    </>
  );
}
