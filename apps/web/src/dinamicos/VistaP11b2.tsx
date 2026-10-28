/* GENERADO por scripts/wireframes-a-tsx.py desde el bloque b2 de P11. El marcado es el del wireframe; la lógica vive en el hook de la página. */
'use client';

import { Fragment } from 'react';

export type VarsP11b2 = { aportadoTxt: string; interesTxt: string; totalTxt: string; };

export function VistaP11b2({ aportadoTxt, interesTxt, totalTxt }: VarsP11b2) {
  return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "12px" }}>
        <div style={{ background: "#164538", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "14px", color: "#B5CCC1" }}>
            Habrás apartado
          </span>
          <span style={{ fontSize: "26px", fontWeight: "700" }}>
            {aportadoTxt}
          </span>
        </div>
        <div style={{ background: "#164538", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "14px", color: "#B5CCC1" }}>
            Intereses ganados
          </span>
          <span style={{ fontSize: "26px", fontWeight: "700", color: "#6FFF8F" }}>
            {interesTxt}
          </span>
        </div>
        <div style={{ background: "#164538", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "14px", color: "#B5CCC1" }}>
            Saldo final
          </span>
          <span style={{ fontSize: "26px", fontWeight: "700" }}>
            {totalTxt}
          </span>
        </div>
      </div>
  );
}
