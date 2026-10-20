import Link from 'next/link';

/** Migas de pan visibles. El último nivel es la página actual (`aria-current`). Su JSON-LD viene del Excel. */
export function Breadcrumb({ niveles }: { niveles: { texto: string; href?: string }[] }) {
  return (
    <nav aria-label="Migas de pan" className="breadcrumb">
      <ol>
        {niveles.map((n, i) => {
          const ultimo = i === niveles.length - 1;
          return (
            <li key={n.texto}>
              {ultimo || !n.href ? <span aria-current={ultimo ? 'page' : undefined}>{n.texto}</span> : <Link href={n.href}>{n.texto}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
