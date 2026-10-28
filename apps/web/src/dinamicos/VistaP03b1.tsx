/* GENERADO por scripts/wireframes-a-tsx.py desde el bloque b1 de P03. El marcado es el del wireframe; la lógica vive en el hook de la página. */
'use client';

import { Fragment } from 'react';
import { Isotipo, Wordmark } from '../components/Logo';
import { cssAObjeto } from '../lib/css';

export type VarsP03b1 = { ajuste?: any; ajusteSalario?: any; cta: string; ctaHref: string; dias: string; eInd: string; eLab: string; esInd: boolean; esLab: boolean; ingresoTxt: string; l1: string; l2: string; nota: string; onDias: (e: any) => void; onIngreso: (e: any) => void; onSalario: (e: any) => void; pInd: any; pLab: any; salarioTxt: string; setInd: (e: any) => void; setLab: (e: any) => void; v1: string; v2: string; };

export function VistaP03b1({ ajuste, ajusteSalario, cta, ctaHref, dias, eInd, eLab, esInd, esLab, ingresoTxt, l1, l2, nota, onDias, onIngreso, onSalario, pInd, pLab, salarioTxt, setInd, setLab, v1, v2 }: VarsP03b1) {
  return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" }}>
        <form className="card" aria-label="Calculadora de cesantías" style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: "20px", padding: "28px" }}>
          <div role="group" aria-label="Tipo de contrato" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", background: "#E6EEE9", borderRadius: "12px", padding: "4px", gap: "4px" }}>
            <button type="button" aria-pressed={pLab} onClick={setLab} style={cssAObjeto(eLab)}>
              Tengo contrato laboral
            </button>
            <button type="button" aria-pressed={pInd} onClick={setInd} style={cssAObjeto(eInd)}>
              Soy independiente
            </button>
          </div>
          {esLab ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label htmlFor="salario" style={{ fontWeight: "600" }}>
                    Salario mensual (COP)
                  </label>
                  <input id="salario" className="field" inputMode="numeric" value={salarioTxt} onChange={onSalario} />
                  {ajusteSalario}
                  <span style={{ fontSize: "14px", color: "#4A6158" }}>
                    Si ganas hasta 2 salarios mínimos, súmale el auxilio de transporte: $249.095 en 2026.
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label htmlFor="dias" style={{ fontWeight: "600" }}>
                      Días trabajados
                    </label>
                    <input id="dias" className="field" inputMode="numeric" value={dias} onChange={onDias} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label htmlFor="anio" style={{ fontWeight: "600" }}>
                      Año
                    </label>
                    <select id="anio" className="field">
                      <option>
                        2026
                      </option>
                      <option>
                        2025
                      </option>
                      <option>
                        2024
                      </option>
                      <option>
                        2023
                      </option>
                      <option>
                        2022
                      </option>
                      <option>
                        2021
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {esInd ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label htmlFor="ingresoInd" style={{ fontWeight: "600" }}>
                  Ingreso mensual bruto (COP)
                </label>
                <input id="ingresoInd" className="field" inputMode="numeric" value={ingresoTxt} onChange={onIngreso} />
            {ajuste}
                <span style={{ fontSize: "14px", color: "#4A6158" }}>
                  Tu contrato no genera cesantías: calculamos cuánto apartar para tener las tuyas.
                </span>
              </div>
            </>
          ) : null}
        </form>
        <section aria-label="Resultado" style={{ flex: "1 1 420px", background: "#0F372D", color: "#FFFFFF", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "18px", boxSizing: "border-box" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", color: "#6FFF8F" }}>
            <Isotipo tono="manzana" alto={24} />
            Calculado con Frilo
          </span>
          <div>
            <p style={{ margin: "0", color: "#B5CCC1", fontSize: "14px" }}>
              {l1}
            </p>
            <p style={{ margin: "6px 0 0", color: "#6FFF8F", fontSize: "44px", lineHeight: "48px", fontWeight: "700", letterSpacing: "-0.02em" }}>
              {v1}
            </p>
          </div>
          <div style={{ background: "#164538", borderRadius: "16px", padding: "18px 20px", display: "flex", justifyContent: "space-between", gap: "16px" }}>
            <span style={{ color: "#B5CCC1" }}>
              {l2}
            </span>
            <span style={{ fontWeight: "700", fontSize: "20px" }}>
              {v2}
            </span>
          </div>
          <p style={{ margin: "0", color: "#B5CCC1", fontSize: "15px", lineHeight: "1.5" }}>
            {nota}
          </p>
          <a className="btn btn-m" href={ctaHref}>
            {cta}
          </a>
          <p style={{ margin: "0", fontSize: "14px", lineHeight: "18px", color: "#B5CCC1" }}>
            Cálculo estimado. No incluye sanciones, descuentos ni impuestos.
          </p>
        </section>
      </div>
  );
}
