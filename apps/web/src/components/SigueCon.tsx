import Link from 'next/link';
import { SIGUE_CON } from '../lib/enlaces';

/** Bloque «Sigue con» al final de cada página: 3 a 5 enlaces del mismo tema y las páginas de confianza. */
export function SigueCon({ id }: { id: string }) {
  const enlaces = SIGUE_CON[id];
  if (!enlaces?.length) return null;
  return (
    <aside className="sigue-con" aria-labelledby="sigue-con-titulo">
      <div className="contenedor">
        <h2 id="sigue-con-titulo">Sigue con</h2>
        <ul className="sigue-con-lista">
          {enlaces.map((e) => (
            <li key={e.href} className="sigue-con-item">
              <Link href={e.href}>{e.texto}</Link>
              <span>{e.detalle}</span>
            </li>
          ))}
        </ul>
        <p className="sigue-con-pie">
          Cómo lo hacemos: <Link href="/metodologia">metodología</Link> · <Link href="/transparencia">transparencia</Link> · <Link href="/quienes-somos">quiénes somos</Link>
        </p>
      </div>
    </aside>
  );
}
