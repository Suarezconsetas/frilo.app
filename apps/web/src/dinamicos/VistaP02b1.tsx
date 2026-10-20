/* GENERADO por scripts/wireframes-a-tsx.py desde el bloque b1 de P02. El marcado es el del wireframe; la lógica vive en el hook de la página. */
'use client';

import { Fragment } from 'react';
import Link from 'next/link';

export type VarsP02b1 = { ibcTxt: string; ingresoTxt: string; nota: string; onIngreso: (e: any) => void; };

export function VistaP02b1({ ibcTxt, ingresoTxt, nota, onIngreso }: VarsP02b1) {
  return (
      <section id="calculadora-ibc" aria-labelledby="h-calc" style={{ margin: "32px 0", background: "#0F372D", color: "#FFFFFF", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 id="h-calc" style={{ margin: "0", fontSize: "24px", color: "#FFFFFF" }}>
          Calculadora del IBC para independientes
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="ibc-ing" style={{ fontSize: "14px", color: "#B5CCC1" }}>
            Lo que facturas al mes (COP)
          </label>
          <input id="ibc-ing" className="field" inputMode="numeric" value={ingresoTxt} onChange={onIngreso} />
        </div>
        <div style={{ background: "#164538", borderRadius: "16px", padding: "18px", display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "baseline", flexWrap: "wrap" }}>
          <span style={{ color: "#B5CCC1" }}>
            Tu IBC
          </span>
          <span style={{ fontSize: "32px", fontWeight: "700", color: "#6FFF8F" }}>
            {ibcTxt}
          </span>
        </div>
        <span style={{ fontSize: "14px", color: "#B5CCC1" }}>
          {nota}
        </span>
        <Link href="/calculadoras/aportes-independientes" className="btn btn-m">
          Ver cuánto pago de planilla con este IBC
        </Link>
      </section>
  );
}
