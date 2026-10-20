/* GENERADO por scripts/wireframes-a-tsx.py desde el bloque b4 de P10. El marcado es el del wireframe; la lógica vive en el hook de la página. */
'use client';

import { Fragment } from 'react';

export type VarsP10b4 = { referencia: any[]; };

export function VistaP10b4({ referencia }: VarsP10b4) {
  return (
      <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
        <table className="t">
          <caption style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", color: "#4A6158" }}>
            Un solo depósito, sin aportes, antes de retención en la fuente
          </caption>
          <thead>
            <tr>
              <th scope="col">
                Plazo
              </th>
              <th scope="col">
                Al 9% E.A.
              </th>
              <th scope="col">
                Al 11% E.A.
              </th>
            </tr>
          </thead>
          <tbody>
            {referencia.map((f: any, i: number) => (
              <Fragment key={i}>
                <tr>
                  <td>
                    {f.plazo}
                  </td>
                  <td>
                    {f.a}
                  </td>
                  <td>
                    {f.b}
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
  );
}
