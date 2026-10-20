/* GENERADO por scripts/wireframes-a-tsx.py desde el bloque b2 de P05. El marcado es el del wireframe; la lógica vive en el hook de la página. */
'use client';

import { Fragment } from 'react';

export type VarsP05b2 = { tabla: any[]; };

export function VistaP05b2({ tabla }: VarsP05b2) {
  return (
      <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
        <table className="t">
          <caption style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", color: "#4A6158" }}>
            Día hábil límite de pago según el artículo 3.2.2.1 del Decreto 1990 de 2016. Aplica a todos los aportantes, incluidos los independientes.
          </caption>
          <thead>
            <tr>
              <th scope="col">
                Dos últimos dígitos
              </th>
              <th scope="col">
                Día hábil del mes
              </th>
            </tr>
          </thead>
          <tbody>
            {tabla.map((r: any, i: number) => (
              <Fragment key={i}>
                <tr>
                  <td>
                    {r.rango}
                  </td>
                  <td>
                    {r.dia}
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
  );
}
