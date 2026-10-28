/* GENERADO por scripts/wireframes-a-tsx.py desde el bloque b1 de P05. El marcado es el del wireframe; la lógica vive en el hook de la página. */
'use client';

import { Fragment } from 'react';
import { Isotipo, Wordmark } from '../components/Logo';

export type VarsP05b1 = { diaTxt: string; digitos: string; fechaTxt: string; mes: string; meses: any[]; onDig: (e: any) => void; onMes: (e: any) => void; };

export function VistaP05b1({ diaTxt, digitos, fechaTxt, mes, meses, onDig, onMes }: VarsP05b1) {
  return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "stretch" }}>
        <form className="card" aria-label="Buscar mi fecha de pago" style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "12px", padding: "28px" }}>
          <label htmlFor="digitos" style={{ fontWeight: "600", fontSize: "17px" }}>
            Dos últimos dígitos de tu documento
          </label>
          <input id="digitos" className="field" inputMode="numeric" maxLength={2} value={digitos} onChange={onDig} style={{ maxWidth: "160px" }} />
          <span style={{ fontSize: "14px", color: "#4A6158" }}>
            Ejemplo: si tu cédula termina en 1.234.567
            <strong>
              89
            </strong>
            , escribe 89.
          </span>
          <label htmlFor="mes" style={{ fontWeight: "600", fontSize: "17px", marginTop: "8px" }}>
            Mes en que vas a pagar
          </label>
          <select id="mes" className="field" value={mes} onChange={onMes} style={{ fontSize: "18px", letterSpacing: "0" }}>
            {meses.map((o: any, i: number) => (
              <Fragment key={i}>
                <option value={o.v}>
                  {o.t}
                </option>
              </Fragment>
            ))}
          </select>
        </form>
        <section aria-label="Tu fecha límite" style={{ flex: "1 1 420px", background: "#0F372D", color: "#FFFFFF", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "14px", boxSizing: "border-box" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", color: "#6FFF8F" }}>
            <Isotipo tono="manzana" alto={24} />
            Calculado con Frilo
          </span>
          <p style={{ margin: "0", color: "#B5CCC1", fontSize: "14px" }}>
            Tu fecha límite de pago es el
          </p>
          <p style={{ margin: "0", color: "#6FFF8F", fontSize: "44px", lineHeight: "48px", fontWeight: "700", letterSpacing: "-0.02em" }}>
            {diaTxt}
          </p>
          <p style={{ margin: "0", color: "#FFFFFF", fontSize: "20px", fontWeight: "700" }}>
            {fechaTxt}
          </p>
          <p style={{ margin: "0", color: "#B5CCC1", fontSize: "15px" }}>
            Contamos los días hábiles sin sábados, domingos ni festivos de Colombia. Paga antes para evitar intereses de mora.
          </p>
          <a className="btn btn-grad" href="#registro">
            Recibir el recordatorio cada mes
          </a>
        </section>
      </div>
  );
}
