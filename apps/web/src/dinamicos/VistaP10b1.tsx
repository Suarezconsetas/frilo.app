/* GENERADO por scripts/wireframes-a-tsx.py desde el bloque b1 de P10. El marcado es el del wireframe; la lógica vive en el hook de la página. */
'use client';

import { Fragment } from 'react';
import { cssAObjeto } from '../lib/css';

export type VarsP10b1 = { e1: string; e2: string; e3: string; m1: (e: any) => void; m2: (e: any) => void; m3: (e: any) => void; p1: any; p2: any; p3: any; };

export function VistaP10b1({ e1, e2, e3, m1, m2, m3, p1, p2, p3 }: VarsP10b1) {
  return (
      <div role="group" aria-label="¿Qué quieres calcular?" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "6px", background: "#E6EEE9", borderRadius: "16px", padding: "6px", maxWidth: "840px" }}>
        <button type="button" aria-pressed={p1} onClick={m1} style={cssAObjeto(e1)}>
          ¿Cuánto tendré?
        </button>
        <button type="button" aria-pressed={p2} onClick={m2} style={cssAObjeto(e2)}>
          ¿Cuánto debo ahorrar al mes?
        </button>
        <button type="button" aria-pressed={p3} onClick={m3} style={cssAObjeto(e3)}>
          ¿Cuánto tiempo tardo?
        </button>
      </div>
  );
}
