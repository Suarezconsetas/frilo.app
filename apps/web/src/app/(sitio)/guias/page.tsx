import { JsonLd } from '../../../components/JsonLd';
import { ContenidoHubGuias } from '../../../paginas/Hub-G';
import { metadataDe } from '../../../lib/seo';
import { TerminosClave } from '../../../components/TerminosClave';

export const metadata = metadataDe('Hub-G');

export default function Pagina() {
  return (
    <>
      <ContenidoHubGuias />
      <TerminosClave />
      <JsonLd id="Hub-G" />
    </>
  );
}
