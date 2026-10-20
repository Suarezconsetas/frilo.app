import { AlertaDolar } from '../../../components/AlertaDolar';
import { ConversorDolares } from '../../../components/ConversorDolares';
import { GraficoTrm } from '../../../components/GraficoTrm';
import { JsonLd } from '../../../components/JsonLd';
import { TablaTrm } from '../../../components/TablaTrm';
import { ContenidoP07 } from '../../../paginas/P07';
import { metadataDe } from '../../../lib/seo';
import { cargarSerieTrm, datosDePagina } from '../../../lib/trm';

export const metadata = metadataDe('P07');
// La TRM se publica una vez por día hábil: la página se regenera cada 24 horas.
export const revalidate = 86_400;

export default async function Pagina() {
  const d = datosDePagina(await cargarSerieTrm());
  return (
    <>
      <ContenidoP07
        d={d}
        dinamicos={{ grafico: <GraficoTrm puntos={d.puntos} />, alerta: <AlertaDolar />, conversor: <ConversorDolares trm={d.hoy} />, tabla: <TablaTrm filas={d.filas} /> }}
      />
      <JsonLd
        id="P07"
        dinamicos={{ trm: d.hayDatos ? { fechaTitulo: d.fechaTitulo, hoyTxt: d.hoyTxt, desde: d.desde, fechaIso: d.fechaIso, desdeIso: d.puntos.at(-30)?.fecha ?? d.fechaIso, hastaIso: d.fechaIso } : undefined }}
      />
    </>
  );
}
