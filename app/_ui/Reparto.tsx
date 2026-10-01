import Link from 'next/link';
import type { Segmento } from '@/lib/app/derivados';
import { AHORRO_ES_OPCIONAL } from '@/lib/app/textos';
import { pct, pesos } from '@/lib/formato';

const COLOR: Record<Segmento['clave'], string> = {
  aportes: 'var(--grafico-aportes)',
  retencion: 'var(--borde-control)',
  prima: 'var(--grafico-prima)',
  cesantias: 'var(--grafico-cesantias)',
  disponible: 'var(--grafico-disponible)',
};

const ENLACE: Partial<Record<Segmento['clave'], string>> = { aportes: '/aportes', prima: '/ahorro', cesantias: '/ahorro' };

function Fila({ s, total = false }: { s: Segmento; total?: boolean }) {
  const contenido = (
    <>
      <span className="etiqueta">
        <span className="muestra" style={{ background: COLOR[s.clave] }} />
        <span>{s.clave === 'prima' || s.clave === 'cesantias' ? `*${s.etiqueta}` : s.etiqueta}</span>
      </span>
      <span className="cifras">
        <strong>{pesos(s.monto)}</strong>
        <small>{pct(s.fraccion, s.clave === 'prima' || s.clave === 'cesantias' ? 2 : 1)}</small>
      </span>
    </>
  );
  const clase = `fila-reparto${total ? ' total' : ''}`;
  const href = ENLACE[s.clave];
  return href ? (
    <Link href={href} className={clase}>
      {contenido}
    </Link>
  ) : (
    <div className={clase}>{contenido}</div>
  );
}

/** Barra de reparto con leyenda y valores escritos (nunca solo color) y filas agrupadas como en Inicio. */
export function Reparto({ segmentos }: { segmentos: Segmento[] }) {
  const texto = segmentos.map((s) => `${s.etiqueta} ${pct(s.fraccion)}`).join(', ');
  const obligatorios = segmentos.filter((s) => s.clave === 'aportes' || s.clave === 'retencion');
  const opcionales = segmentos.filter((s) => s.clave === 'prima' || s.clave === 'cesantias');
  const disponible = segmentos.find((s) => s.clave === 'disponible');
  // Orden de la barra, de claro a oscuro como lo define el sistema: aportes, prima, cesantías, disponible.
  const orden: Segmento['clave'][] = ['aportes', 'retencion', 'prima', 'cesantias', 'disponible'];
  const enBarra = orden.flatMap((c) => segmentos.filter((s) => s.clave === c));

  return (
    <>
      <div role="img" aria-label={texto} className="barra">
        {enBarra.map((s) => (
          <div key={s.clave} style={{ width: `${s.fraccion * 100}%`, background: COLOR[s.clave] }} />
        ))}
      </div>
      <h3 className="grupo-titulo">Gastos obligatorios</h3>
      {obligatorios.map((s) => (
        <Fila key={s.clave} s={s} />
      ))}
      {opcionales.length > 0 && (
        <>
          <h3 className="grupo-titulo" style={{ marginTop: 20 }}>
            Gastos opcionales
          </h3>
          {opcionales.map((s) => (
            <Fila key={s.clave} s={s} />
          ))}
          <p className="ayuda" style={{ margin: '0 0 4px 22px' }}>
            *{AHORRO_ES_OPCIONAL}
          </p>
        </>
      )}
      {disponible && <Fila s={disponible} total />}
    </>
  );
}
