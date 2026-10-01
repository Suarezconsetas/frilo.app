import Link from 'next/link';
import { AVISOS } from '@/lib/calculos';
import type { Escenarios, ProyeccionAnual } from '@/lib/app/derivados';
import { AHORRO_EXPLICACION_CORTA, AHORRO_RECOMENDACION } from '@/lib/app/textos';
import { fechaCorta, pct, pesos } from '@/lib/formato';

/** Los dos escenarios lado a lado: con ahorro de prima y cesantías, y sin él. */
export function Comparacion({ e, proy }: { e: Escenarios; proy: ProyeccionAnual }) {
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
      <div className="promo-ahorro sobre-oliva">
        <p className="promo-kicker">Si apartas tu prima y tus cesantías en {proy.cuenta.entidad}</p>
        <p className="promo-cifra">{pesos(proy.total)}</p>
        <p className="promo-sub">podrías tener en un año</p>
        <div className="promo-desglose">
          <div>
            <span>Tu ahorro</span>
            <strong>{pesos(proy.aportado)}</strong>
          </div>
          <div>
            <span>Rendimientos</span>
            <strong>+{pesos(proy.rendimiento)}</strong>
          </div>
        </div>
        <p className="promo-texto">{AHORRO_RECOMENDACION}</p>
        <Link href="/ahorro" className="btn btn-marca">
          Ver cuentas con rentabilidad
          <span aria-hidden="true">→</span>
        </Link>
        <p className="promo-legal">
          Proyección con {proy.cuenta.entidad} ({proy.cuenta.producto}), {pct(proy.cuenta.tasaBaseEA, 2)} E.A. según su información del{' '}
          {fechaCorta(proy.cuenta.fechaConsulta)}, apartando {pesos(proy.mensual)} cada mes durante 12 meses. {AVISOS.rendimientos}
        </p>
      </div>
    </section>
  );
}
