import { TablaCuentasDolares, TablaCuentasPesos } from '../../../../components/TablaCuentas';
import { JsonLd } from '../../../../components/JsonLd';
import { CamposP11, ProveedorP11, ResultadoP11 } from '../../../../dinamicos/SimuladorP11';
import { ContenidoP11 } from '../../../../paginas/P11';
import { metadataDe } from '../../../../lib/seo';
import { SigueCon } from '../../../../components/SigueCon';

export const metadata = metadataDe('P11');

export default function Pagina() {
  return (
    <ProveedorP11>
      <ContenidoP11 dinamicos={{ b1: <CamposP11 />, b2: <ResultadoP11 />, tablaPesos: <TablaCuentasPesos />, tablaDolares: <TablaCuentasDolares /> }} />
      <SigueCon id="P11" />
      <JsonLd id="P11" />
    </ProveedorP11>
  );
}
