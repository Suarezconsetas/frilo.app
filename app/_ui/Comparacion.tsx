import Link from 'next/link';
import type { Escenarios } from '@/lib/app/derivados';
import { AHORRO_EXPLICACION_CORTA, AHORRO_RECOMENDACION } from '@/lib/app/textos';
import { pesos } from '@/lib/formato';

/** Los dos escenarios lado a lado: con ahorro de prima y cesantías, y sin él. */
export function Comparacion({ e }: { e: Escenarios }) {
  return (
    <section className="tarjeta" aria-labelledby="comparacion-titulo">
      <h2 id="comparacion-titulo" className="titulo-tarjeta" style={{ marginBottom: 12 }}>
        Con ahorro o sin ahorro
      </h2>
      <div className="comparacion">
        <div>
          <p>Con ahorro</p>
          <p>Te quedan al mes</p>
          <strong>{pesos(e.conAhorro.disponible)}</strong>
          <p>Guardas al mes</p>
          <strong>{pesos(e.conAhorro.guardasAlMes)}</strong>
          <p>En un año juntas</p>
          <strong>{pesos(e.conAhorro.enUnAnio)}</strong>
        </div>
        <div>
          <p>Sin ahorro</p>
          <p>Te quedan al mes</p>
          <strong>{pesos(e.sinAhorro.disponible)}</strong>
          <p>Guardas al mes</p>
          <strong>{pesos(0)}</strong>
          <p>En un año juntas</p>
          <strong>{pesos(0)}</strong>
        </div>
      </div>
      <p style={{ marginTop: 14, fontSize: 14, lineHeight: '21px' }}>
        Sin ahorro tienes {pesos(e.diferenciaMensual)} más al mes para gastar, pero dejas de juntar {pesos(e.conAhorro.enUnAnio)} en el año.
      </p>
      <p className="ayuda" style={{ marginTop: 10 }}>
        {AHORRO_EXPLICACION_CORTA}{' '}
        <Link href="/ahorro#como-calculamos" style={{ fontWeight: 600 }}>
          Cómo lo calculamos
        </Link>
      </p>
      <div className="tarjeta-oliva sobre-oliva" style={{ marginTop: 14 }}>
        <p style={{ fontSize: 14, lineHeight: '21px' }}>{AHORRO_RECOMENDACION}</p>
        <Link href="/ahorro" className="enlace" style={{ marginTop: 4, fontSize: 14, color: 'var(--manzana)' }}>
          Ver cuentas con rentabilidad
        </Link>
      </div>
    </section>
  );
}
