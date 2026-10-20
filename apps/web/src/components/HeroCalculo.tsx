'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { miles, soloEnteros } from '../lib/entradas';

/** Clave de sessionStorage con la que el hero le pasa su ingreso a la calculadora de aportes (misma pestaña, sin URL). */
export const CLAVE_INGRESO = 'frilo_ingreso_inicial';

/** "¿Cuánto cobras al mes?": lleva a la calculadora de aportes con ese ingreso. En dólares se convierte con la TRM de hoy. */
export function HeroCalculo({ trm }: { trm: number }) {
  const router = useRouter();
  const [moneda, setMoneda] = useState<'COP' | 'USD'>('COP');
  const [monto, setMonto] = useState(0);

  function enviar(e: FormEvent) {
    e.preventDefault();
    const cop = moneda === 'USD' ? Math.round(monto * trm) : monto;
    try {
      if (cop > 0) sessionStorage.setItem(CLAVE_INGRESO, String(cop));
    } catch {
      /* sin almacenamiento: la calculadora abre con su ejemplo */
    }
    router.push('/calculadoras/aportes-independientes');
  }

  return (
    <form onSubmit={enviar} style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#164538', borderRadius: 24, padding: 20, maxWidth: 560 }}>
      <label htmlFor="hero-ingreso" style={{ fontWeight: 600, fontSize: 15 }}>
        ¿Cuánto cobras al mes?
      </label>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flex: '1 1 220px', minHeight: 52, borderRadius: 12, background: '#FFFFFF', overflow: 'hidden' }}>
          <select aria-label="Moneda" value={moneda} onChange={(e) => setMoneda(e.target.value as 'COP' | 'USD')} style={{ border: 0, background: '#E6EEE9', color: '#0F372D', font: '600 15px/1 inherit', fontFamily: 'inherit', padding: '0 12px' }}>
            <option value="COP">COP</option>
            <option value="USD">USD</option>
          </select>
          <input id="hero-ingreso" inputMode="numeric" placeholder="8.000.000" value={monto ? miles(monto) : ''} onChange={(e) => setMonto(soloEnteros(e))} style={{ flex: 1, minWidth: 0, border: 0, padding: '0 16px', font: '600 18px/1 inherit', fontFamily: 'inherit', color: '#0F372D' }} />
        </div>
        <button type="submit" className="btn btn-m" style={{ border: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
          Ver mi mes
        </button>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: '#B5CCC1' }}>Sin registro para ver tu resultado. Antes de impuestos y sin IVA.</p>
    </form>
  );
}
