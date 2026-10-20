import { jsonLdDe } from '../lib/seo';

/** Imprime el JSON-LD de la hoja "Datos estructurados" del Excel: un solo `@graph` por página. */
export function JsonLd({ id }: { id: string }) {
  const datos = jsonLdDe(id);
  if (!datos) return null;
  // `<` se escapa para que un texto nunca cierre el <script>.
  const json = JSON.stringify(datos).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
