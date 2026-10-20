'use client';

import { useEffect, useState } from 'react';
import { ahorroMensual, calcularAportes, calcularAportesCuentaPropia, parametrosDe, redondearMultiplo, saldoFinal } from '@/lib/calculos';
import { pct, pesos } from '@/lib/formato';
import { decimalEs, miles, soloEnteros } from '../lib/entradas';
import { CLAVE_INGRESO } from '../components/HeroCalculo';
import { fijarIntencion } from '../lib/intencion';
import { VistaP01b1 } from './VistaP01b1';

const P = parametrosDe(2026);
const NOMBRES = ['I', 'II', 'III', 'IV', 'V'];
/** Tasa de ejemplo para estimar intereses (la del wireframe). */
const TASA_EJEMPLO = 0.09;

/** P01: calculadora de aportes. Modo contratista (40% del valor bruto) o cuenta propia (40% del ingreso neto, Decreto 379 de 2026). */
export function CalculadoraAportes() {
  const [ingreso, setIngreso] = useState(8_000_000);
  const [riesgo, setRiesgo] = useState('0');
  const [arl, setArl] = useState(true);
  const [modo, setModo] = useState<'ops' | 'propia'>('ops');
  const [costos, setCostos] = useState(0);

  // Si la persona escribió su ingreso en el hero de la Home, la calculadora abre con ese valor (se usa una sola vez).
  useEffect(() => {
    try {
      const guardado = sessionStorage.getItem(CLAVE_INGRESO);
      if (guardado) {
        const v = parseInt(guardado, 10);
        if (v > 0) setIngreso(v);
        sessionStorage.removeItem(CLAVE_INGRESO);
      }
    } catch {
      /* sin almacenamiento */
    }
  }, []);

  const idx = parseInt(riesgo, 10) || 0;
  const pagaContratante = idx >= 3;
  const entrada = { ingresoBrutoMes: ingreso, clase: (idx + 1) as 1 | 2 | 3 | 4 | 5, incluirArl: arl || pagaContratante, arlLaPagaContratante: pagaContratante };
  const r = modo === 'propia' ? calcularAportesCuentaPropia({ ...entrada, costosMes: costos }, P) : calcularAportes(entrada, P);
  const arlValor = r.arlACargoDelUsuario ? r.arl : 0;
  const prima = redondearMultiplo(ahorroMensual(ingreso).prima, P.redondeoPila);
  const aparta = prima * 2;
  const rendimiento = saldoFinal(0, aparta, TASA_EJEMPLO, 12) - aparta * 12;

  useEffect(() => {
    fijarIntencion({ tipo: 'guardar_calculo', ingreso, riesgo: NOMBRES[idx] ?? 'I' });
  }, [ingreso, idx]);

  const filas = [
    { nombre: 'Salud', detalle: '12,5% del IBC', valor: pesos(r.salud) },
    { nombre: 'Pensión', detalle: '16% del IBC', valor: pesos(r.pension) },
    { nombre: 'ARL', detalle: pagaContratante ? `Riesgo ${NOMBRES[idx]}: la paga el contratante` : arl ? `Riesgo ${NOMBRES[idx]}` : 'No incluida', valor: pesos(arlValor) },
    { nombre: 'Fondo de Solidaridad', detalle: r.tarifaFsp ? `${decimalEs(r.tarifaFsp * 100)}% del IBC` : 'No aplica: IBC menor a 4 salarios mínimos', valor: pesos(r.fsp) },
  ];

  const boton = (activo: boolean) => ({
    minHeight: 44, border: 0, borderRadius: 9, padding: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, lineHeight: 1.2,
    background: activo ? '#FFFFFF' : 'transparent', color: activo ? '#0F372D' : '#4A6158', fontWeight: activo ? 700 : 600,
    boxShadow: activo ? '0 1px 2px rgba(15,55,45,0.15)' : 'none',
  });

  return (
    <>
      <div className="card" style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div role="group" aria-label="Tipo de ingreso" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', background: '#E6EEE9', borderRadius: 12, padding: 4, gap: 4 }}>
          <button type="button" aria-pressed={modo === 'ops'} onClick={() => setModo('ops')} style={boton(modo === 'ops')}>
            Contratista por prestación de servicios
          </button>
          <button type="button" aria-pressed={modo === 'propia'} onClick={() => setModo('propia')} style={boton(modo === 'propia')}>
            Independiente por cuenta propia
          </button>
        </div>
        {modo === 'ops' ? (
          <p style={{ margin: 0, fontSize: 14, color: '#4A6158' }}>
            Si tienes contrato de prestación de servicios personales, tu IBC es el 40% del valor mensual de tu contrato, sin descontar costos (Ley 2277 de 2022, art. 89).
          </p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="costos" style={{ fontWeight: 600 }}>
                Costos de tu actividad al mes (COP)
              </label>
              <input id="costos" className="field" inputMode="numeric" value={miles(costos)} onChange={(e) => setCostos(soloEnteros(e))} />
              <span style={{ fontSize: 13, color: '#4A6158' }}>
                Costos reales y soportados. Tu IBC es el 40% del ingreso neto: {pesos((r as { ingresoNeto?: number }).ingresoNeto ?? ingreso)} ({pct(P.porcentajeIbc, 0)} → {pesos(r.ibcTeorico)}).
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: '#4A6158' }}>
              Decreto 379 de 2026, vigente desde el 7 de abril de 2026. Esta calculadora usa los costos que escribes: si no puedes soportarlos, la UGPP aplica su presunción de costos según tu actividad, que no calculamos aquí.
            </p>
          </>
        )}
      </div>
      <VistaP01b1
        apartaTxt={pesos(aparta)}
        arl={arl}
        filas={filas}
        ibcTxt={pesos(r.ibc)}
        ingresoTxt={miles(ingreso)}
        onArl={(e) => setArl(e.target.checked)}
        onIngreso={(e) => setIngreso(soloEnteros(e))}
        onRiesgo={(e) => setRiesgo(e.target.value)}
        primaTxt={pesos(prima)}
        quedaTxt={pesos(ingreso - r.totalUsuario - aparta)}
        rendTxt={pesos(rendimiento)}
        riesgo={riesgo}
        tasaTxt={pct(TASA_EJEMPLO, 2)}
        totalTxt={pesos(r.totalUsuario)}
      />
    </>
  );
}
