/* GENERADO por scripts/wireframes-a-tsx.py desde el bloque b1 de P12. El marcado es el del wireframe; la lógica vive en el hook de la página. */
'use client';

import { Fragment } from 'react';

export type VarsP12b1 = { ajuste?: any; ingresoTxt: string; onIngreso: (e: any) => void; };

export function VistaP12b1({ ajuste, ingresoTxt, onIngreso }: VarsP12b1) {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label htmlFor="g-ingreso" style={{ fontSize: "14px", color: "#B5CCC1" }}>
          Ingreso mensual (COP)
        </label>
        <input id="g-ingreso" className="field" inputMode="numeric" value={ingresoTxt} onChange={onIngreso} />
            {ajuste}
      </div>
  );
}
