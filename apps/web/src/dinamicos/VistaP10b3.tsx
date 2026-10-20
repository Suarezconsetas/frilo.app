/* GENERADO por scripts/wireframes-a-tsx.py desde el bloque b3 de P10. El marcado es el del wireframe; la lógica vive en el hook de la página. */
'use client';

import { Fragment } from 'react';

export type VarsP10b3 = { tabla: any[]; };

export function VistaP10b3({ tabla }: VarsP10b3) {
  return (
      <section aria-labelledby="h-proy" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2 id="h-proy" style={{ margin: "0", fontSize: "26px" }}>
          Proyección de tu ahorro año a año
        </h2>
        <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF", maxHeight: "420px" }}>
          <table className="t" style={{ minWidth: "560px" }}>
            <thead>
              <tr>
                <th scope="col">
                  Periodo
                </th>
                <th scope="col">
                  Capital aportado
                </th>
                <th scope="col">
                  Intereses acumulados
                </th>
                <th scope="col">
                  Saldo
                </th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((r: any, i: number) => (
                <Fragment key={i}>
                  <tr>
                    <td>
                      {r.periodo}
                    </td>
                    <td>
                      {r.aportado}
                    </td>
                    <td>
                      {r.interes}
                    </td>
                    <td style={{ fontWeight: "700" }}>
                      {r.saldo}
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
  );
}
