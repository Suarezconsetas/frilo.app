/* Isotipo (la F con pliegue) tal como lo entregó la marca: manzana sobre oliva, oliva sobre claro. */
/* El wordmark "Frilo" (public/logos/wordmark-*.svg) queda para piezas de marca; las pantallas usan el isotipo. */
/* eslint-disable @next/next/no-img-element */
export function Logo({ sobreOliva = false, alto = 28, className }: { sobreOliva?: boolean; alto?: number; className?: string }) {
  return (
    <img
      src={sobreOliva ? '/logos/isotipo-manzana.svg' : '/logos/isotipo-oliva.svg'}
      alt="Frilo"
      height={alto}
      style={{ height: alto, width: 'auto', display: 'block' }}
      className={className}
    />
  );
}
