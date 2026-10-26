import Link from 'next/link';
import { TERMINOS_CLAVE } from '../lib/enlaces';

/** Entrada al glosario desde el Home y los hubs. */
export function TerminosClave() {
  return (
    <aside className="terminos-clave" aria-label="Glosario">
      <div className="contenedor">
        <p>
          ¿Una sigla de la planilla que no entiendes? Consulta el <Link href="/glosario">glosario</Link>:
        </p>
        <ul>
          {TERMINOS_CLAVE.map((t) => (
            <li key={t.sigla}>
              <Link href={t.href}>{t.sigla}</Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
