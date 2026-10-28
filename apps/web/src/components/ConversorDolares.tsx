'use client';

import Link from 'next/link';
import { useState } from 'react';
import { pesos } from '@/lib/formato';
import { miles, soloEnteros } from '../lib/entradas';

/** Convierte dólares a pesos con la TRM de hoy (referencia oficial; el banco aplica su propia tasa). */
export function ConversorDolares({ trm }: { trm: number }) {
  const [usd, setUsd] = useState(2000);
  return (
    <section className="card" aria-labelledby="h-conv" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 id="h-conv" style={{ margin: 0, fontSize: 22 }}>
        Convierte dólares a pesos con la TRM de hoy
      </h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label htmlFor="usd" style={{ fontWeight: 600 }}>
            Dólares
          </label>
          <input id="usd" className="field" inputMode="numeric" placeholder="2.000" value={usd ? miles(usd) : ''} onChange={(e) => setUsd(soloEnteros(e))} />
        </div>
        <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontWeight: 600 }}>Pesos con la TRM de hoy</span>
          <span aria-live="polite" style={{ minHeight: 52, display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 700 }}>
            {trm ? pesos(usd * trm) : '—'}
          </span>
        </div>
        <Link href="/calculadoras/aportes-independientes" className="btn btn-p" style={{ flex: '0 1 auto' }}>
          Ver cuánto pago de planilla
        </Link>
      </div>
      <span style={{ fontSize: 14, color: '#4A6158' }}>
        Tu banco o plataforma aplica su propia tasa y comisiones; la TRM es la referencia oficial.{' '}
        <Link href="/guias/recibir-pagos-en-dolares-colombia" style={{ color: '#4A6158' }}>
          Cómo recibir pagos del exterior en dólares
        </Link>
        .
      </span>
    </section>
  );
}
