import { JsonLd } from '../../../../components/JsonLd';
import { CalculadoraCesantias } from '../../../../dinamicos/CalculadoraCesantias';
import { ContenidoP03 } from '../../../../paginas/P03';
import { metadataDe } from '../../../../lib/seo';
import { SigueCon } from '../../../../components/SigueCon';

export const metadata = metadataDe('P03');

export default function Pagina() {
  return (
    <>
      <ContenidoP03 dinamicos={{ b1: <CalculadoraCesantias /> }} />
      <SigueCon id="P03" />
      <JsonLd id="P03" />
    </>
  );
}
