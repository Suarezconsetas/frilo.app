/* Logos tal como los entregó la marca (public/logos): no se redibujan ni se recolorean. */
/* eslint-disable @next/next/no-img-element */
export function Logo({ sobreOliva = false, alto = 28, className }: { sobreOliva?: boolean; alto?: number; className?: string }) {
  return (
    <img
      src={sobreOliva ? '/logos/wordmark-manzana.svg' : '/logos/wordmark-oliva.svg'}
      alt="Frilo"
      height={alto}
      style={{ height: alto, width: 'auto', display: 'block' }}
      className={className}
    />
  );
}
