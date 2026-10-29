import { BannerApp } from '../../components/BannerApp';
import { HeroCalculo } from '../../components/HeroCalculo';
import { JsonLd } from '../../components/JsonLd';
import { ContenidoHome } from '../../paginas/Home';
import { metadataDe } from '../../lib/seo';
import { cargarSerieTrm, datosDePagina } from '../../lib/trm';
import { TerminosClave } from '../../components/TerminosClave';
import { SigueCon } from '../../components/SigueCon';

export const metadata = metadataDe('Home');
// La tarjeta de ejemplo muestra la TRM del día: la página se regenera cada 24 horas.
export const revalidate = 86_400;

export default async function Pagina() {
  const d = datosDePagina(await cargarSerieTrm());
  return (
    <>
      <ContenidoHome d={d} dinamicos={{ hero: <HeroCalculo trm={d.hoy} />, app: <BannerApp /> }} />
      <TerminosClave />
      <SigueCon id="Home" />
      <JsonLd id="Home" />
    </>
  );
}
