/* GENERADO por scripts/wireframes-a-tsx.py desde el bloque b2 de P10. El marcado es el del wireframe; la lógica vive en el hook de la página. */
'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { Isotipo, Wordmark } from '../components/Logo';
import { cssAObjeto } from '../lib/css';

export type VarsP10b2 = { ahorradoTxt: string; aporteTxt: string; barras: any[]; cap: string; conAporte: boolean; conMeta: boolean; conPlazo: boolean; escenarios: any[]; graficoAlt: any; ingresoTxt: string; inicialTxt: string; interesTxt: string; metaTxt: string; onAporte: (e: any) => void; onCap: (e: any) => void; onIngreso: (e: any) => void; onInicial: (e: any) => void; onMeta: (e: any) => void; onPlazo: (e: any) => void; onRango: (e: any) => void; onRet: (e: any) => void; onTasa: (e: any) => void; onTipo: (e: any) => void; onUnidad: (e: any) => void; plazo: string; principal: string; rango: string; regla72: string; ret: boolean; retTxt: string; subtitular: string; tasa: string; tipo: string; titular: string; totalTxt: string; unidad: string; usarPreset: (e: any) => void; };

export function VistaP10b2({ ahorradoTxt, aporteTxt, barras, cap, conAporte, conMeta, conPlazo, escenarios, graficoAlt, ingresoTxt, inicialTxt, interesTxt, metaTxt, onAporte, onCap, onIngreso, onInicial, onMeta, onPlazo, onRango, onRet, onTasa, onTipo, onUnidad, plazo, principal, rango, regla72, ret, retTxt, subtitular, tasa, tipo, titular, totalTxt, unidad, usarPreset }: VarsP10b2) {
  return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" }}>
        <form className="card" aria-label="Calculadora de interés compuesto" style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: "18px", padding: "28px" }}>
          <div style={{ background: "#E6EEE9", borderRadius: "12px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontWeight: "600", fontSize: "15px" }}>
              Atajo: mi prima y mis cesantías
            </span>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <label htmlFor="ic-ingreso" style={{ fontSize: "14px", color: "#4A6158", flex: "1 1 100%" }}>
                Tu ingreso mensual (COP)
              </label>
              <input id="ic-ingreso" className="field" inputMode="numeric" value={ingresoTxt} onChange={onIngreso} style={{ flex: "1 1 160px", minHeight: "44px" }} />
              <button type="button" onClick={usarPreset} style={{ minHeight: "44px", padding: "0 16px", border: "0", borderRadius: "12px", background: "#0F372D", color: "#6FFF8F", fontWeight: 700, fontSize: "14px", lineHeight: 1, fontFamily: "inherit", cursor: "pointer" }}>
                Usar el 16,67%
              </button>
            </div>
          </div>
          {conMeta ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label htmlFor="ic-meta" style={{ fontWeight: "600" }}>
                  Tu meta de ahorro (COP)
                </label>
                <input id="ic-meta" className="field" inputMode="numeric" value={metaTxt} onChange={onMeta} />
              </div>
            </>
          ) : null}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="ic-inicial" style={{ fontWeight: "600" }}>
                Monto inicial
              </label>
              <input id="ic-inicial" className="field" inputMode="numeric" value={inicialTxt} onChange={onInicial} />
            </div>
            {conAporte ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label htmlFor="ic-aporte" style={{ fontWeight: "600" }}>
                    Aporte mensual
                  </label>
                  <input id="ic-aporte" className="field" inputMode="numeric" value={aporteTxt} onChange={onAporte} />
                </div>
              </>
            ) : null}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="ic-tasa" style={{ fontWeight: "600" }}>
                Tasa anual (%)
              </label>
              <input id="ic-tasa" className="field" inputMode="decimal" value={tasa} onChange={onTasa} />
            </div>
            {conPlazo ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label htmlFor="ic-meses" style={{ fontWeight: "600" }}>
                    Plazo
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    <input id="ic-meses" className="field" inputMode="numeric" value={plazo} onChange={onPlazo} style={{ flex: "1 1 88px", minWidth: "88px" }} />
                    <select aria-label="Unidad del plazo" className="field" value={unidad} onChange={onUnidad} style={{ flex: "1 1 104px", padding: "0 8px" }}>
                      <option value="meses">
                        meses
                      </option>
                      <option value="anios">
                        años
                      </option>
                    </select>
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="ic-rango" style={{ fontWeight: "600" }}>
              Comparar con una tasa ± (puntos)
            </label>
            <input id="ic-rango" className="field" inputMode="decimal" value={rango} onChange={onRango} />
            <span style={{ fontSize: "14px", color: "#4A6158" }}>
              Ve qué pasa si la tasa baja o sube: las tasas de las cuentas cambian seguido.
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="ic-tipo" style={{ fontWeight: "600" }}>
                Tipo de tasa
              </label>
              <select id="ic-tipo" className="field" value={tipo} onChange={onTipo}>
                <option value="ea">
                  Efectiva anual (E.A.)
                </option>
                <option value="nominal">
                  Nominal anual
                </option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="ic-cap" style={{ fontWeight: "600" }}>
                Capitalización
              </label>
              <select id="ic-cap" className="field" value={cap} onChange={onCap}>
                <option value="365">
                  Diaria
                </option>
                <option value="12">
                  Mensual
                </option>
                <option value="4">
                  Trimestral
                </option>
                <option value="2">
                  Semestral
                </option>
                <option value="1">
                  Anual
                </option>
              </select>
            </div>
          </div>
          <span style={{ fontSize: "14px", color: "#4A6158" }}>
            Con tasa E.A. la capitalización ya está incluida en la tasa; solo cambia el resultado si la tasa es nominal.
          </span>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", minHeight: "44px", cursor: "pointer" }}>
            <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontWeight: "600" }}>
                Descontar retención en la fuente
              </span>
              <span style={{ fontSize: "14px", color: "#4A6158" }}>
                7% de los intereses (tarifa 2026 para rendimientos financieros)
              </span>
            </span>
            <input type="checkbox" checked={ret} onChange={onRet} style={{ width: "24px", height: "24px", accentColor: "#0F372D" }} />
          </label>
        </form>
        <section aria-label="Resultado" style={{ flex: "1 1 440px", background: "#0F372D", color: "#FFFFFF", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "18px", boxSizing: "border-box" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", color: "#6FFF8F" }}>
            <Isotipo tono="manzana" alto={24} />
            Calculado con Frilo
          </span>
          <div>
            <p style={{ margin: "0", color: "#B5CCC1", fontSize: "14px" }}>
              {titular}
            </p>
            <p style={{ margin: "6px 0 0", color: "#6FFF8F", fontSize: "44px", lineHeight: "48px", fontWeight: "700", letterSpacing: "-0.02em" }}>
              {principal}
            </p>
            <p style={{ margin: "6px 0 0", color: "#B5CCC1", fontSize: "14px" }}>
              {subtitular}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
            <div style={{ background: "#164538", borderRadius: "16px", padding: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "14px", color: "#B5CCC1" }}>
                Capital aportado
              </span>
              <span style={{ fontSize: "19px", fontWeight: "700" }}>
                {ahorradoTxt}
              </span>
            </div>
            <div style={{ background: "#164538", borderRadius: "16px", padding: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "14px", color: "#B5CCC1" }}>
                Intereses
              </span>
              <span style={{ fontSize: "19px", fontWeight: "700", color: "#6FFF8F" }}>
                {interesTxt}
              </span>
            </div>
            <div style={{ background: "#164538", borderRadius: "16px", padding: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "14px", color: "#B5CCC1" }}>
                Capital + intereses
              </span>
              <span style={{ fontSize: "19px", fontWeight: "700" }}>
                {totalTxt}
              </span>
            </div>
          </div>
          {ret ? (
            <>
              <p style={{ margin: "0", fontSize: "14px", color: "#B5CCC1" }}>
                {"Retención en la fuente estimada: "}{retTxt}{" (ya descontada)."}
              </p>
            </>
          ) : null}
          <div role="img" aria-label={graficoAlt} style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "150px", paddingTop: "8px" }}>
            {barras.map((b: any, i: number) => (
              <Fragment key={i}>
                <div style={{ flex: "1 1 0", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", gap: "6px", alignItems: "stretch" }}>
                  <div style={cssAObjeto(b.columna)}>
                    <div style={cssAObjeto(b.interes)} />
                    <div style={cssAObjeto(b.aporte)} />
                  </div>
                  <span style={{ fontSize: "11px", color: "#B5CCC1", textAlign: "center" }}>
                    {b.label}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "14px", color: "#B5CCC1" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span aria-hidden="true" style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#B5CCC1" }} />
              Capital aportado
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span aria-hidden="true" style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#6FFF8F" }} />
              Intereses
            </span>
            <span>
              {"· "}{regla72}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px" }}>
            {escenarios.map((e: any, i: number) => (
              <Fragment key={i}>
                <div style={cssAObjeto(e.estilo)}>
                  <span style={{ fontSize: "14px", color: "#B5CCC1" }}>
                    {e.label}
                  </span>
                  <span style={{ fontSize: "17px", fontWeight: "700" }}>
                    {e.total}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
          <p style={{ margin: "0", fontSize: "14px", lineHeight: "18px", color: "#B5CCC1" }}>
            Simulación con tasa constante, sin 4x1000. No es asesoría financiera.
          </p>
          <Link href="/guias/cuentas-de-ahorro-alto-rendimiento" className="btn btn-m">
            Compara cuentas de ahorro de alto rendimiento
          </Link>
        </section>
      </div>
  );
}
