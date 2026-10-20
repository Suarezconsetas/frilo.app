import Link from 'next/link';
import { cuentasDestacadas } from '@/lib/app/derivados';
import { pct } from '@/lib/formato';

const nombres = (cs: { entidad: string }[]) => cs.map((c) => c.entidad).join(' y ');

/**
 * Las dos cuentas que más rinden hoy: una en pesos y otra en dólares (la de mayor tasa sin condiciones).
 * Muestra que se puede poner a rendir lo apartado en cualquiera de las dos monedas.
 */
export function CuentasDestacadas({ href, compacta = false }: { href: string; compacta?: boolean }) {
  const { pesos, dolares } = cuentasDestacadas();
  const p = pesos[0];
  const d = dolares[0];
  if (!p || !d) return null;

  return (
    <section className="tarjeta" aria-labelledby="destacadas">
      <h2 id="destacadas" className="titulo-tarjeta">
        Pon a rendir lo que apartas
      </h2>
      <p className="texto-suave" style={{ margin: '6px 0 14px', fontSize: 14, lineHeight: '21px' }}>
        Puedes guardarlo en pesos o en dólares. Estas son las cuentas que más rinden hoy en cada moneda.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ background: 'var(--oliva)', borderRadius: 12, padding: 14, color: '#fff' }}>
          <p style={{ fontSize: 13, color: 'var(--oliva-suave)' }}>En pesos</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--manzana)', margin: '4px 0' }}>{pct(p.tasaBaseEA, 0)}</p>
          <p style={{ fontSize: 12 }}>E.A. · {nombres(pesos)}</p>
        </div>
        <div style={{ background: 'var(--oliva)', borderRadius: 12, padding: 14, color: '#fff' }}>
          <p style={{ fontSize: 13, color: 'var(--oliva-suave)' }}>En dólares</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--manzana)', margin: '4px 0' }}>hasta {pct(d.tasaBaseEA, 0)}</p>
          <p style={{ fontSize: 12 }}>E.A. en USD · {nombres(dolares)}</p>
        </div>
      </div>
      {!compacta && (
        <p className="ayuda" style={{ marginTop: 10 }}>
          Las cuentas en dólares tienen riesgo cambiario y pueden no tener seguro de depósitos: revisa el aviso de cada una más abajo.
        </p>
      )}
      <Link href={href} className="enlace" style={{ marginTop: 10 }}>
        {compacta ? 'Ver todas las cuentas' : 'Ver cuentas en pesos y en dólares'}
      </Link>
    </section>
  );
}
