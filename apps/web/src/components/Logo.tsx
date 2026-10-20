/** Isotipo (la F) y wordmark. Manzana solo sobre oliva; oliva sobre fondos claros; nunca menos de 24 px de alto. */
type Tono = 'manzana' | 'oliva';

/** Proporciones de los SVG (ancho/alto del viewBox): evitan saltos de diseño al cargar. */
const PROPORCION = { isotipo: 722 / 814, wordmark: 1192 / 421 };

export function Isotipo({ tono = 'oliva', alto = 34, altoCss, className }: { tono?: Tono; alto?: number; altoCss?: string; className?: string }) {
  // Decorativo: el texto "Frilo" lo aporta el wordmark o un `sr-only` (el H1 de la Home lleva texto real).
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/logos/isotipo-${tono}.svg`} alt="" aria-hidden="true" width={Math.round(Math.max(24, alto) * PROPORCION.isotipo)} height={Math.max(24, alto)} style={{ height: altoCss ?? Math.max(24, alto), width: 'auto', display: altoCss ? 'block' : undefined }} className={className} />;
}

export function Wordmark({ tono = 'oliva', alto = 24, altoCss, className }: { tono?: Tono; alto?: number; altoCss?: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/logos/wordmark-${tono}.svg`} alt="" aria-hidden="true" width={Math.round(Math.max(24, alto) * PROPORCION.wordmark)} height={Math.max(24, alto)} style={{ height: altoCss ?? Math.max(24, alto), width: 'auto', display: altoCss ? 'block' : undefined }} className={className} />;
}

/** Isotipo + wordmark con nombre accesible "Frilo". */
export function LogoFrilo({ tono = 'oliva', alto = 34 }: { tono?: Tono; alto?: number }) {
  return (
    <span className="logo-frilo" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <Isotipo tono={tono} alto={alto} />
      <Wordmark tono={tono} alto={Math.round(alto * 0.7)} />
      <span className="sr-only">Frilo</span>
    </span>
  );
}
