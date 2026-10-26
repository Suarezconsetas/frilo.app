import { JsonLd } from '../../../../components/JsonLd';
import { CalculadoraInteres, ModosInteres, ProveedorInteres, ReferenciaInteres, TablaInteres } from '../../../../dinamicos/InteresCompuesto';
import { ContenidoP10 } from '../../../../paginas/P10';
import { metadataDe } from '../../../../lib/seo';
import { SigueCon } from '../../../../components/SigueCon';

export const metadata = metadataDe('P10');

export default function Pagina() {
  return (
    <ProveedorInteres>
      <ContenidoP10 dinamicos={{ b1: <ModosInteres />, b2: <CalculadoraInteres />, b3: <TablaInteres />, b4: <ReferenciaInteres /> }} />
      <SigueCon id="P10" />
      <JsonLd id="P10" />
    </ProveedorInteres>
  );
}
