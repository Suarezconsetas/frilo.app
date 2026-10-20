/* GENERADO por scripts/wireframes-a-tsx.py desde el bloque b1 de P11. El marcado es el del wireframe; la lógica vive en el hook de la página. */
'use client';

import { Fragment } from 'react';

export type VarsP11b1 = { meses: string; montoTxt: string; onMeses: (e: any) => void; onMonto: (e: any) => void; onTasa: (e: any) => void; tasa: string; };

export function VistaP11b1({ meses, montoTxt, onMeses, onMonto, onTasa, tasa }: VarsP11b1) {
  return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="s-monto" style={{ fontSize: "14px", color: "#B5CCC1" }}>
            Aportas cada mes (COP)
          </label>
          <input id="s-monto" className="field" inputMode="numeric" value={montoTxt} onChange={onMonto} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="s-meses" style={{ fontSize: "14px", color: "#B5CCC1" }}>
            Durante (meses)
          </label>
          <input id="s-meses" className="field" inputMode="numeric" value={meses} onChange={onMeses} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="s-tasa" style={{ fontSize: "14px", color: "#B5CCC1" }}>
            Tasa E.A. de la cuenta (%)
          </label>
          <input id="s-tasa" className="field" inputMode="decimal" value={tasa} onChange={onTasa} />
        </div>
      </div>
  );
}
