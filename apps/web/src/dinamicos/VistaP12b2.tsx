/* GENERADO por scripts/wireframes-a-tsx.py desde el bloque b2 de P12. El marcado es el del wireframe; la lógica vive en el hook de la página. */
'use client';

import { Fragment } from 'react';

export type VarsP12b2 = { anioTxt: string; mesTxt: string; };

export function VistaP12b2({ anioTxt, mesTxt }: VarsP12b2) {
  return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", gap: "12px" }}>
        <div style={{ background: "#164538", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "14px", color: "#B5CCC1" }}>
            Aparta cada mes
          </span>
          <span style={{ fontSize: "26px", fontWeight: "700", color: "#6FFF8F" }}>
            {mesTxt}
          </span>
        </div>
        <div style={{ background: "#164538", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "14px", color: "#B5CCC1" }}>
            En febrero tendrías
          </span>
          <span style={{ fontSize: "26px", fontWeight: "700" }}>
            {anioTxt}
          </span>
        </div>
      </div>
  );
}
