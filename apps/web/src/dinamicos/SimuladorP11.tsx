'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { saldoFinal } from '@/lib/calculos';
import { pesos } from '@/lib/formato';
import { miles, porcentajeAFraccion, soloEnteros } from '../lib/entradas';
import { VistaP11b1 } from './VistaP11b1';
import { VistaP11b2 } from './VistaP11b2';

interface Estado {
  monto: number;
  meses: number;
  tasa: string;
  set: (c: Partial<{ monto: number; meses: number; tasa: string }>) => void;
}
const Ctx = createContext<Estado | null>(null);

/** P11: simulador de rendimiento (aporte mensual, meses y tasa E.A.). Los campos y el resultado comparten estado. */
export function ProveedorP11({ children }: { children: ReactNode }) {
  const [e, setE] = useState({ monto: 1_333_300, meses: 12, tasa: '9' });
  return <Ctx.Provider value={{ ...e, set: (c) => setE((p) => ({ ...p, ...c })) }}>{children}</Ctx.Provider>;
}

const usar = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Falta <ProveedorP11>');
  return c;
};

export function CamposP11() {
  const s = usar();
  return <VistaP11b1 meses={String(s.meses)} montoTxt={miles(s.monto)} tasa={s.tasa} onMeses={(e) => s.set({ meses: soloEnteros(e) })} onMonto={(e) => s.set({ monto: soloEnteros(e) })} onTasa={(e) => s.set({ tasa: String(e.target.value) })} />;
}

export function ResultadoP11() {
  const s = usar();
  const n = Math.min(Math.max(s.meses || 0, 0), 120);
  const fv = saldoFinal(0, s.monto, porcentajeAFraccion(s.tasa), n);
  return <VistaP11b2 aportadoTxt={pesos(s.monto * n)} interesTxt={pesos(fv - s.monto * n)} totalTxt={pesos(fv)} />;
}
