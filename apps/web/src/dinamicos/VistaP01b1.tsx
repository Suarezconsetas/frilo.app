/* GENERADO por scripts/wireframes-a-tsx.py desde el bloque b1 de P01. El marcado es el del wireframe; la lógica vive en el hook de la página. */
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { Isotipo, Wordmark } from '../components/Logo';

export type VarsP01b1 = { ajuste?: any; apartaTxt: string; arl: boolean; filas: any[]; ibcTxt: string; ingresoTxt: string; onArl: (e: any) => void; onIngreso: (e: any) => void; onRiesgo: (e: any) => void; primaTxt: string; quedaTxt: string; rendTxt: string; riesgo: string; tasaTxt: string; totalTxt: string; };

export function VistaP01b1({ ajuste, apartaTxt, arl, filas, ibcTxt, ingresoTxt, onArl, onIngreso, onRiesgo, primaTxt, quedaTxt, rendTxt, riesgo, tasaTxt, totalTxt }: VarsP01b1) {
  return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" }}>
        <form className="card" aria-label="Calculadora de aportes" style={{ flex: "1 1 360px", display: "flex", flexDirection: "column", gap: "20px", padding: "28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="ingreso" style={{ fontWeight: "600" }}>
              Ingreso mensual bruto (COP)
            </label>
            <input id="ingreso" className="field" inputMode="numeric" value={ingresoTxt} onChange={onIngreso} />
            {ajuste}
            <span style={{ fontSize: "13px", color: "#4A6158" }}>
              {"Antes de impuestos y sin IVA. ¿Te pagan en dólares? "}
              <Link href="/dolar-hoy" style={{ color: "#4A6158" }}>
                Convierte con la TRM de hoy
              </Link>
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="riesgo" style={{ fontWeight: "600" }}>
              Clase de riesgo ARL
            </label>
            <select id="riesgo" className="field" value={riesgo} onChange={onRiesgo}>
              <option value="0">
                I · oficina (0,522%)
              </option>
              <option value="1">
                II (1,044%)
              </option>
              <option value="2">
                III (2,436%)
              </option>
              <option value="3">
                IV (4,350%) · paga contratante
              </option>
              <option value="4">
                V (6,960%) · paga contratante
              </option>
            </select>
          </div>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", minHeight: "44px", cursor: "pointer" }}>
            <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontWeight: "600" }}>
                Incluir ARL
              </span>
              <span style={{ fontSize: "13px", color: "#4A6158" }}>
                Voluntaria si trabajas por tu cuenta en riesgo I a III
              </span>
            </span>
            <input type="checkbox" checked={arl} onChange={onArl} style={{ width: "24px", height: "24px", accentColor: "#0F372D" }} />
          </label>
        </form>
        <section aria-label="Resultado" style={{ flex: "1 1 420px", background: "#0F372D", color: "#FFFFFF", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", boxSizing: "border-box" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "600", color: "#6FFF8F" }}>
            <Isotipo tono="manzana" alto={24} />
            Calculado con Frilo
          </span>
          <div>
            <p style={{ margin: "0", color: "#B5CCC1", fontSize: "14px" }}>
              Total a pagar de planilla al mes
            </p>
            <p style={{ margin: "6px 0 0", color: "#6FFF8F", fontSize: "44px", lineHeight: "48px", fontWeight: "700", letterSpacing: "-0.02em" }}>
              {totalTxt}
            </p>
            <p style={{ margin: "6px 0 0", color: "#B5CCC1", fontSize: "14px" }}>
              <Link href="/guias/ibc-independientes" style={{ color: "#FFFFFF" }}>
                IBC
              </Link>
              {": "}{ibcTxt}{" (40% de tu ingreso, ajustado a topes)"}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", background: "#164538", borderRadius: "16px", padding: "4px 20px" }}>
            {filas.map((f: any, i: number) => (
              <Fragment key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "14px 0", borderBottom: "1px solid #24503F" }}>
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontWeight: "600" }}>
                      {f.nombre}
                    </span>
                    <span style={{ fontSize: "13px", color: "#B5CCC1" }}>
                      {f.detalle}
                    </span>
                  </span>
                  <span style={{ fontWeight: "700", fontSize: "18px" }}>
                    {f.valor}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
          <div style={{ background: "#164538", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ margin: "0", fontWeight: "600" }}>
              {"Aparta "}{primaTxt}{" para tu prima y "}{primaTxt}{" para tus cesantías"}
            </p>
            <p style={{ margin: "0", color: "#B5CCC1", fontSize: "15px" }}>
              {"Te quedan "}{quedaTxt}{" para gastos y metas. Si guardas esos "}{apartaTxt}{" al mes en una cuenta al "}{tasaTxt}{" E.A. (tasa de ejemplo), en un año tendrías cerca de "}
              <strong style={{ color: "#6FFF8F" }}>
                {rendTxt}
              </strong>
              {" de intereses."}
            </p>
            <Link href="/guias/cuentas-de-ahorro-alto-rendimiento" style={{ color: "#6FFF8F", fontWeight: "600", fontSize: "15px" }}>
              Ver cuentas que pagan más por tu ahorro
            </Link>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a className="btn btn-m" href="#registro" style={{ flex: "1 1 220px" }}>
              Guardar y recibir el recordatorio de pago
            </a>
            <a className="btn btn-g" href="#operadores" style={{ flex: "0 1 auto" }}>
              Dónde pagar la planilla
            </a>
          </div>
          <p style={{ margin: "0", fontSize: "12px", lineHeight: "18px", color: "#B5CCC1" }}>
            Estimado para independientes y contratistas por prestación de servicios. No incluye el 4x1000, retenciones ni renta.
          </p>
        </section>
      </div>
  );
}
