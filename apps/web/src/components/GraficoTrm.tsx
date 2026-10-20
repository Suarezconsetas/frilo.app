'use client';

import { useState } from 'react';
import { pesosConDecimales } from '@/lib/formato';

type Periodo = '7' | '30' | '365';
const OPCIONES: [Periodo, string][] = [['7', '7 días'], ['30', '30 días'], ['365', '1 año']];
const boton = (activo: boolean) => ({
  minHeight: 36, padding: '0 14px', border: 0, borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14,
  background: activo ? '#FFFFFF' : 'transparent', color: activo ? '#0F372D' : '#4A6158', fontWeight: activo ? 700 : 600,
});

/** Gráfico de línea de la TRM (SVG, sin librerías) con los datos de datos.gov.co. */
export function GraficoTrm({ puntos }: { puntos: { fecha: string; valor: number }[] }) {
  const [periodo, setPeriodo] = useState<Periodo>('30');
  const n = Number(periodo);
  const datos = puntos.slice(-Math.min(n, puntos.length));
  const W = 640;
  const H = 280;
  const M = { l: 64, r: 12, t: 16, b: 28 };

  let cuerpo: React.ReactNode = <p style={{ margin: 0, color: '#4A6158' }}>No pudimos cargar la TRM en este momento. Consúltala en datos.gov.co.</p>;
  if (datos.length >= 2) {
    const valores = datos.map((d) => d.valor);
    const min = Math.min(...valores);
    const max = Math.max(...valores);
    const pad = (max - min || max * 0.01) * 0.1;
    const lo = min - pad;
    const hi = max + pad;
    const x = (i: number) => M.l + (i * (W - M.l - M.r)) / (datos.length - 1);
    const y = (v: number) => M.t + ((hi - v) * (H - M.t - M.b)) / (hi - lo);
    const linea = datos.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.valor).toFixed(1)}`).join(' ');
    const ticks = [lo + pad, (lo + hi) / 2, hi - pad];
    const ultimo = datos[datos.length - 1]!;
    cuerpo = (
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="titulo-grafico" style={{ width: '100%', height: 'auto', maxHeight: 300, background: '#F3F6F4', borderRadius: 12 }}>
        <title id="titulo-grafico">{`TRM de ${datos[0]!.fecha} a ${ultimo.fecha}: mínimo ${pesosConDecimales(min)}, máximo ${pesosConDecimales(max)}, último valor ${pesosConDecimales(ultimo.valor)}`}</title>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} stroke="#D6E0DA" strokeWidth="1" />
            <text x={M.l - 8} y={y(t) + 4} textAnchor="end" fontSize="12" fill="#4A6158">
              {pesosConDecimales(t)}
            </text>
          </g>
        ))}
        <path d={linea} fill="none" stroke="#0F372D" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(datos.length - 1)} cy={y(ultimo.valor)} r="4.5" fill="#2FB35E" stroke="#0F372D" strokeWidth="2" />
        <text x={M.l} y={H - 8} fontSize="12" fill="#4A6158">
          {datos[0]!.fecha}
        </text>
        <text x={W - M.r} y={H - 8} textAnchor="end" fontSize="12" fill="#4A6158">
          {ultimo.fecha}
        </text>
      </svg>
    );
  }

  return (
    <section className="card" aria-labelledby="h-grafico" style={{ flex: '2 1 560px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <h2 id="h-grafico" style={{ margin: 0, fontSize: 22 }}>
          Precio del dólar hoy en Colombia: cómo se ha movido
        </h2>
        <div role="group" aria-label="Periodo" style={{ display: 'flex', background: '#E6EEE9', borderRadius: 12, padding: 4, gap: 4 }}>
          {OPCIONES.map(([v, t]) => (
            <button key={v} type="button" aria-pressed={periodo === v} onClick={() => setPeriodo(v)} style={boton(periodo === v)}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {cuerpo}
    </section>
  );
}
