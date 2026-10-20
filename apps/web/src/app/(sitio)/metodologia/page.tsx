import { JsonLd } from '../../../components/JsonLd';
import { PaginaBorrador } from '../../../components/PaginaBorrador';
import { metadataDe } from '../../../lib/seo';

export const metadata = metadataDe('Inst-2');

export default function Pagina() {
  return (
    <>
      <PaginaBorrador id="Inst-2" />
      <JsonLd id="Inst-2" />
    </>
  );
}
