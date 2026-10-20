import { JsonLd } from '../../../components/JsonLd';
import { PaginaBorrador } from '../../../components/PaginaBorrador';
import { metadataDe } from '../../../lib/seo';

export const metadata = metadataDe('Hub-Glo');

export default function Pagina() {
  return (
    <>
      <PaginaBorrador id="Hub-Glo" />
      <JsonLd id="Hub-Glo" />
    </>
  );
}
