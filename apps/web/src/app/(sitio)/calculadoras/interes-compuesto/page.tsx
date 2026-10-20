import { JsonLd } from '../../../../components/JsonLd';
import { CalculadoraInteres, ModosInteres, ProveedorInteres, ReferenciaInteres, TablaInteres } from '../../../../dinamicos/InteresCompuesto';
import { ContenidoP10 } from '../../../../paginas/P10';
import { metadataDe } from '../../../../lib/seo';

export const metadata = metadataDe('P10');

export default function Pagina() {
  return (
    <ProveedorInteres>
      <ContenidoP10 dinamicos={{ b1: <ModosInteres />, b2: <CalculadoraInteres />, b3: <TablaInteres />, b4: <ReferenciaInteres /> }} />
      <JsonLd id="P10" />
    </ProveedorInteres>
  );
}
