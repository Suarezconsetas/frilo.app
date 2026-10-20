import { jsonLdDe, type DinamicosJsonLd } from '../lib/seo';

/** Imprime el JSON-LD de la hoja "Datos estructurados" del Excel: un solo `@graph` por página. */
export function JsonLd({ id, dinamicos }: { id: string; dinamicos?: DinamicosJsonLd }) {
  const datos = jsonLdDe(id, dinamicos);
  if (!datos) return null;
  // `<` se escapa para que un texto nunca cierre el <script>.
  const json = JSON.stringify(datos).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
