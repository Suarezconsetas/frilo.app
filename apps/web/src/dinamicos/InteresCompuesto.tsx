'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { aportePrimaYCesantias, nominalAEfectiva, redondearMultiplo, reglaDel72, RETENCION_RENDIMIENTOS_SIMULADOR, type Capitalizacion } from '@/lib/calculos';
import { pesos } from '@/lib/formato';
import { decimalEs, miles, porcentajeAFraccion, soloEnteros } from '../lib/entradas';
import { VistaP10b1 } from './VistaP10b1';
import { VistaP10b2 } from './VistaP10b2';
import { VistaP10b3 } from './VistaP10b3';
import { VistaP10b4 } from './VistaP10b4';

interface Estado {
  modo: 'saldo' | 'meta' | 'tiempo';
  inicial: number;
  aporte: number;
  meta: number;
  tasa: string;
  plazo: number;
  unidad: 'meses' | 'anios';
  rango: string;
  cap: string;
  tipo: 'ea' | 'nominal';
  ingreso: number;
  ret: boolean;
}

const INICIAL: Estado = { modo: 'saldo', inicial: 0, aporte: 1_333_300, meta: 20_000_000, tasa: '9', plazo: 12, unidad: 'meses', rango: '2', cap: '365', tipo: 'ea', ingreso: 8_000_000, ret: false };

const Ctx = createContext<{ st: Estado; set: (c: Partial<Estado>) => void } | null>(null);

/** P10: calculadora de interés compuesto con tres modos. Sus cuatro bloques comparten estado. */
export function ProveedorInteres({ children }: { children: ReactNode }) {
  const [st, setSt] = useState<Estado>(INICIAL);
  return <Ctx.Provider value={{ st, set: (c) => setSt((p) => ({ ...p, ...c })) }}>{children}</Ctx.Provider>;
}

function usar() {
  const c = useContext(Ctx);
  if (!c) throw new Error('Falta <ProveedorInteres>');
  return c;
}

const BASE = 'background: #164538; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 4px';
const ON = 'min-height: 48px; border: 0; border-radius: 12px; background: #FFFFFF; color: #0F372D; font-weight:700;font-size:15px;line-height:1.2;font-family:inherit; padding: 8px 12px; cursor: pointer; box-shadow: 0 1px 2px rgba(15,55,45,0.15)';
const OFF = 'min-height: 48px; border: 0; border-radius: 12px; background: transparent; color: #4A6158; font-weight:600;font-size:15px;line-height:1.2;font-family:inherit; padding: 8px 12px; cursor: pointer';

const pctTxt = (t: number) => `${decimalEs(t * 100, 2)}%`;

function calcular(st: Estado) {
  const P = st.inicial || 0;
  const meta = st.meta || 0;
  const k = (parseInt(st.cap, 10) || 12) as Capitalizacion;
  const aEA = (t: number) => (st.tipo === 'nominal' ? nominalAEfectiva(t, k) : t);
  const tasa = porcentajeAFraccion(st.tasa);
  const rm = Math.pow(1 + aEA(tasa), 1 / 12) - 1;
  let n = Math.min(Math.max(st.unidad === 'anios' ? (st.plazo || 0) * 12 : st.plazo || 0, 0), 600);
  let A = st.aporte || 0;
  let noLlega = false;
  if (st.modo === 'meta') {
    const g = Math.pow(1 + rm, n);
    const necesario = n > 0 ? (rm > 0 ? ((meta - P * g) * rm) / (g - 1) : (meta - P) / n) : 0;
    A = Math.max(Math.ceil(necesario / 1000) * 1000, 0);
  }
  if (st.modo === 'tiempo') {
    let x = P;
    let m = 0;
    while (x < meta && m < 600) {
      x = x * (1 + rm) + A;
      m++;
    }
    noLlega = x < meta;
    n = m;
  }
  const simular = (t: number) => {
    const r = Math.pow(1 + aEA(t), 1 / 12) - 1;
    const out: number[] = [];
    let s = P;
    for (let j = 1; j <= n; j++) {
      s = s * (1 + r) + A;
      out.push(s);
    }
    return out;
  };
  const saldos = simular(tasa);
  const bruto = n ? (saldos[n - 1] ?? P) : P;
  const aportado = P + A * n;
  const interesBruto = Math.max(bruto - aportado, 0);
  const retencion = st.ret ? interesBruto * RETENCION_RENDIMIENTOS_SIMULADOR : 0;
  const total = bruto - retencion;
  const rango = porcentajeAFraccion(st.rango);
  const finDe = (t: number) => {
    const arr = simular(t);
    const b = n ? (arr[n - 1] ?? P) : P;
    return b - (st.ret ? Math.max(b - aportado, 0) * RETENCION_RENDIMIENTOS_SIMULADOR : 0);
  };
  const escenarios = [
    { label: `Al ${pctTxt(Math.max(tasa - rango, 0))}`, total: pesos(finDe(Math.max(tasa - rango, 0))), estilo: BASE },
    { label: `Al ${pctTxt(tasa)} (tu tasa)`, total: pesos(total), estilo: `${BASE}; box-shadow: inset 0 0 0 2px #6FFF8F` },
    { label: `Al ${pctTxt(tasa + rango)}`, total: pesos(finDe(tasa + rango)), estilo: BASE },
  ];
  const pasos = Math.min(n, 8) || 1;
  const maxV = bruto || 1;
  const barras = [];
  for (let b = 1; b <= pasos; b++) {
    const idx = Math.max(Math.round((b * n) / pasos) - 1, 0);
    const sv = n ? (saldos[idx] ?? P) : P;
    const ap = P + A * (idx + 1);
    const hT = Math.max(4, Math.round((sv / maxV) * 100));
    const hA = sv ? Math.round((Math.min(ap, sv) / sv) * 100) : 0;
    barras.push({
      label: n > 24 ? `Año ${Math.round((idx + 1) / 12)}` : `Mes ${idx + 1}`,
      columna: `height: ${hT}%; display: flex; flex-direction: column; border-radius: 6px 6px 2px 2px; overflow: hidden`,
      interes: `flex: ${100 - hA} 1 0; background: #6FFF8F`,
      aporte: `flex: ${hA} 1 0; background: #B5CCC1`,
    });
  }
  const tabla: { periodo: string; aportado: string; interes: string; saldo: string }[] = [];
  const paso = n > 24 ? 12 : n > 12 ? 3 : 1;
  for (let q = paso; q <= n; q += paso) {
    const aq = P + A * q;
    const s = saldos[q - 1] ?? 0;
    tabla.push({ periodo: n > 24 ? `Año ${q / 12}` : `Mes ${q}`, aportado: pesos(aq), interes: pesos(s - aq), saldo: pesos(s) });
  }
  if (n > 0 && n % paso !== 0) {
    const af = P + A * n;
    const s = saldos[n - 1] ?? 0;
    tabla.push({ periodo: `Mes ${n}`, aportado: pesos(af), interes: pesos(s - af), saldo: pesos(s) });
  }
  const ea = aEA(tasa);
  let titular: string;
  let principal: string;
  let subtitular: string;
  if (st.modo === 'meta') {
    titular = `Para llegar a ${pesos(meta)} en ${n} meses debes ahorrar al mes`;
    principal = pesos(A);
    subtitular = `Terminarías con ${pesos(total)}.`;
  } else if (st.modo === 'tiempo') {
    titular = `Llegas a ${pesos(meta)} en`;
    const an = Math.floor(n / 12);
    const me = n % 12;
    const tA = an ? `${an} ${an === 1 ? 'año' : 'años'}` : '';
    const tM = me ? `${me} ${me === 1 ? 'mes' : 'meses'}` : '';
    principal = noLlega ? 'Más de 50 años' : tA && tM ? `${tA} y ${tM}` : tA || tM || '0 meses';
    subtitular = noLlega ? 'Sube el aporte mensual o la tasa.' : `Ahorrando ${pesos(A)} al mes.`;
  } else {
    titular = `Capital + intereses en ${n} meses`;
    principal = pesos(total);
    subtitular = `Ahorrando ${pesos(A)} al mes.`;
  }
  return {
    escenarios, barras, tabla, titular, principal, subtitular,
    totalTxt: pesos(total), ahorradoTxt: pesos(aportado), interesTxt: pesos(interesBruto - retencion), retTxt: pesos(retencion),
    regla72: ea > 0 ? `Regla del 72: tu dinero se duplica en unos ${Math.round(reglaDel72(ea))} años` : 'Sin tasa no hay crecimiento',
    graficoAlt: `Crecimiento del saldo hasta ${pesos(bruto)} en ${n} meses: capital aportado e intereses`,
  };
}

export function ModosInteres() {
  const { st, set } = usar();
  const m = st.modo;
  return (
    <VistaP10b1
      e1={m === 'saldo' ? ON : OFF} e2={m === 'meta' ? ON : OFF} e3={m === 'tiempo' ? ON : OFF}
      m1={() => set({ modo: 'saldo' })} m2={() => set({ modo: 'meta' })} m3={() => set({ modo: 'tiempo' })}
      p1={m === 'saldo' ? 'true' : 'false'} p2={m === 'meta' ? 'true' : 'false'} p3={m === 'tiempo' ? 'true' : 'false'}
    />
  );
}

export function CalculadoraInteres() {
  const { st, set } = usar();
  const c = calcular(st);
  return (
    <VistaP10b2
      ahorradoTxt={c.ahorradoTxt} aporteTxt={miles(st.aporte || 0)} barras={c.barras} cap={st.cap}
      conAporte={st.modo !== 'meta'} conMeta={st.modo !== 'saldo'} conPlazo={st.modo !== 'tiempo'}
      escenarios={c.escenarios} graficoAlt={c.graficoAlt} ingresoTxt={miles(st.ingreso)} inicialTxt={miles(st.inicial || 0)}
      interesTxt={c.interesTxt} metaTxt={miles(st.meta || 0)}
      onAporte={(e) => set({ aporte: soloEnteros(e) })} onCap={(e) => set({ cap: e.target.value })} onIngreso={(e) => set({ ingreso: soloEnteros(e) })}
      onInicial={(e) => set({ inicial: soloEnteros(e) })} onMeta={(e) => set({ meta: soloEnteros(e) })} onPlazo={(e) => set({ plazo: soloEnteros(e) })}
      onRango={(e) => set({ rango: String(e.target.value) })} onRet={(e) => set({ ret: e.target.checked })} onTasa={(e) => set({ tasa: String(e.target.value) })}
      onTipo={(e) => set({ tipo: e.target.value })} onUnidad={(e) => set({ unidad: e.target.value })}
      plazo={st.plazo ? String(st.plazo) : ''} principal={c.principal} rango={st.rango} regla72={c.regla72} ret={st.ret} retTxt={c.retTxt}
      subtitular={c.subtitular} tasa={st.tasa} tipo={st.tipo} titular={c.titular} totalTxt={c.totalTxt} unidad={st.unidad}
      usarPreset={() => set({ aporte: redondearMultiplo(aportePrimaYCesantias(st.ingreso), 100) })}
    />
  );
}

export function TablaInteres() {
  const { st } = usar();
  return <VistaP10b3 tabla={calcular(st).tabla} />;
}

/** "¿Cuánto crecen $1.000.000?" a 1, 5, 10 y 20 años, al 9% y al 11% E.A. (un solo depósito, sin aportes). */
export function ReferenciaInteres() {
  const fv = (t: number, anios: number) => pesos(1_000_000 * Math.pow(1 + t, anios));
  const referencia = [1, 5, 10, 20].map((a) => ({ plazo: a === 1 ? '1 año' : `${a} años`, a: fv(0.09, a), b: fv(0.11, a) }));
  return <VistaP10b4 referencia={referencia} />;
}
