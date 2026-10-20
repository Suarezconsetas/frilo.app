import { JsonLd } from '../../../components/JsonLd';
import { ContenidoHubGuias } from '../../../paginas/Hub-G';
import { metadataDe } from '../../../lib/seo';

export const metadata = metadataDe('Hub-G');

export default function Pagina() {
  return (
    <>
      <ContenidoHubGuias />
      <JsonLd id="Hub-G" />
    </>
  );
}
