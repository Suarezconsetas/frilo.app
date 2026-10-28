/* GENERADO por scripts/wireframes-a-tsx.py desde LandingSEM.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   (ninguno)
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Isotipo, Wordmark } from '../components/Logo';
import { URL_APP } from '../lib/config';

export function ContenidoSEM({ dinamicos = {} }: { dinamicos?: {  } }) {
  return (
    <div className="wf wf-SEM">
    <div>
      <section style={{ background: "#0F372D", color: "#FFFFFF", padding: "28px 0 80px" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "56px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
              <Isotipo tono="manzana" alto={34} />
              <Wordmark tono="manzana" alto={24} />
            </span>
            <a href={URL_APP} style={{ display: "inline-flex", alignItems: "center", minHeight: "48px", padding: "0 22px", borderRadius: "16px", background: "linear-gradient(100deg, #6FFF8F 0%, #2FB35E 100%)", color: "#0F372D", fontWeight: "700", fontSize: "16px", textDecoration: "none" }}>
              Probar la app gratis
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: "48px", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h1 style={{ margin: "0", fontSize: "clamp(36px, 4.6vw, 54px)", lineHeight: "1.05", letterSpacing: "-0.02em" }}>
                ¿Cuánto pagas de planilla como independiente en 2026?
              </h1>
              <p style={{ margin: "0", fontSize: "19px", lineHeight: "1.5", color: "#B5CCC1" }}>
                Escribe lo que facturas y en 10 segundos sabes cuánto pagar de salud, pensión y ARL. Con el salario mínimo 2026.
              </p>
              <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "16px" }}>
                <li style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6FFF8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7" />
                  </svg>
                  Mismo cálculo y redondeo de la PILA
                </li>
                <li style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6FFF8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7" />
                  </svg>
                  En pesos o en dólares, con la TRM oficial
                </li>
                <li style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6FFF8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7" />
                  </svg>
                  Te decimos cuánto apartar para prima y cesantías
                </li>
              </ul>
            </div>
            <form style={{ background: "#164538", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <label htmlFor="lp-ingreso" style={{ fontWeight: "600", fontSize: "17px" }}>
                ¿Cuánto facturas al mes?
              </label>
              <input id="lp-ingreso" className="field" inputMode="numeric" placeholder="$ 8.000.000" />
              <Link href="/calculadoras/aportes-independientes" className="btn btn-m">
                Calcular mi planilla
              </Link>
              <span style={{ fontSize: "14px", color: "#B5CCC1" }}>
                Ves el resultado sin registrarte.
              </span>
            </form>
          </div>
        </div>
      </section>
      <section style={{ padding: "72px 0" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: "16px" }}>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: "700", fontSize: "32px" }}>
              1
            </span>
            <span style={{ fontWeight: "600" }}>
              Escribe lo que facturas
            </span>
            <span style={{ color: "#4A6158" }}>
              Antes de impuestos y sin IVA.
            </span>
          </div>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: "700", fontSize: "32px" }}>
              2
            </span>
            <span style={{ fontWeight: "600" }}>
              Mira tu planilla al peso
            </span>
            <span style={{ color: "#4A6158" }}>
              Salud, pensión, ARL y Fondo de Solidaridad.
            </span>
          </div>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: "700", fontSize: "32px" }}>
              3
            </span>
            <span style={{ fontWeight: "600" }}>
              Guarda y recibe el recordatorio
            </span>
            <span style={{ color: "#4A6158" }}>
              Te avisamos tu fecha de pago cada mes.
            </span>
          </div>
        </div>
      </section>
      <section style={{ padding: "0 0 72px" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "820px" }}>
          <div>
            <h2 style={{ margin: "0 0 8px", fontSize: "26px" }}>
              Preguntas rápidas
            </h2>
            <details>
              <summary>
                ¿Cuánto cuesta?
              </summary>
              <p style={{ margin: "0 0 18px", color: "#4A6158" }}>
                Nada. Frilo es gratis.
              </p>
            </details>
            <details>
              <summary>
                ¿Necesito crear una cuenta?
              </summary>
              <p style={{ margin: "0 0 18px", color: "#4A6158" }}>
                No para calcular. Sí para guardar y recibir recordatorios.
              </p>
            </details>
            <details>
              <summary>
                ¿Frilo paga la planilla por mí?
              </summary>
              <p style={{ margin: "0 0 18px", color: "#4A6158" }}>
                No. Te lleva al operador para que la pagues tú.
              </p>
            </details>
          </div>
          <Link href="/calculadoras/aportes-independientes" className="btn btn-p" style={{ alignSelf: "flex-start" }}>
            Calcular mi planilla
          </Link>
        </div>
      </section>
      <footer style={{ borderTop: "1px solid #D6E0DA", padding: "24px 0", background: "#FFFFFF" }}>
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", fontSize: "14px", color: "#4A6158" }}>
          <span>
            Contenido educativo. No es asesoría financiera. No incluye el 4x1000 ni retenciones.
          </span>
          <span>
            <a href="#" style={{ color: "#4A6158" }}>
              Política de datos
            </a>
            {" · "}
            <a href="#" style={{ color: "#4A6158" }}>
              Términos
            </a>
          </span>
        </div>
      </footer>
    </div>
    </div>
  );
}
