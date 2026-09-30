import { type ClaseRiesgo, type ParametrosAnio } from './parametros';
import { redondearMultiplo } from './redondeo';
import { type FuenteIngreso } from './ingresos';

// ── Reglas de obligatoriedad de la ARL ───────────────────────────────────
export type EstadoArl =
  | { obligatoria: true; pagador: 'usuario' | 'contratante'; motivo: string }
  | { obligatoria: false; pagador: 'usuario'; motivo: string };

export function reglaArl(fuente: FuenteIngreso, clase: ClaseRiesgo): EstadoArl {
  const altoRiesgo = clase >= 4;
  if (fuente.contratante === 'publico')
    return { obligatoria: true, pagador: altoRiesgo ? 'contratante' : 'usuario', motivo: 'Contratista del Estado: ARL siempre obligatoria' };
  if (fuente.tipoContrato === 'ops_mas_de_un_mes')
    return altoRiesgo
      ? { obligatoria: true, pagador: 'contratante', motivo: 'OPS > 1 mes, riesgo IV–V: la paga el contratante (Decreto 723/2013)' }
      : { obligatoria: true, pagador: 'usuario', motivo: 'OPS > 1 mes, riesgo I–III: la pagas tú (Decreto 723/2013)' };
  // Cuenta propia o contratante del exterior: no hay contratante colombiano que la asuma.
  if (altoRiesgo) return { obligatoria: true, pagador: 'usuario', motivo: 'Actividad de alto riesgo (IV–V): ARL obligatoria' };
  return { obligatoria: false, pagador: 'usuario', motivo: 'Voluntaria, pero recomendable' };
}

/** Si alguna fuente la vuelve obligatoria, es obligatoria. Si alguna la hace pagar al contratante, se refleja. */
export function reglaArlCombinada(fuentes: FuenteIngreso[], clase: ClaseRiesgo): EstadoArl {
  const estados = fuentes.map((f) => reglaArl(f, clase));
  const obligatorias = estados.filter((e) => e.obligatoria);
  if (obligatorias.length === 0) return estados[0] ?? { obligatoria: false, pagador: 'usuario', motivo: 'Voluntaria, pero recomendable' };
  return obligatorias.find((e) => e.pagador === 'usuario') ?? obligatorias[0]!;
}

// ── Cálculo de aportes (replica la calculadora de Excel) ─────────────────
export interface EntradaAportes {
  ingresoBrutoMes: number; // suma de todas las fuentes, en COP, sin IVA
  clase: ClaseRiesgo;
  incluirArl: boolean;
  arlLaPagaContratante?: boolean;
}

export interface ResultadoAportes {
  ibcTeorico: number;
  ibc: number;
  ibcEnSmlmv: number;
  salud: number;
  pension: number;
  arl: number; // la calcula siempre que se incluya; ver arlACargoDelUsuario
  arlACargoDelUsuario: boolean;
  tarifaFsp: number;
  fsp: number;
  totalUsuario: number; // lo que sale del bolsillo del usuario
  porcentajeDelIngreso: number;
}

export function tarifaFsp(ibc: number, p: ParametrosAnio): number {
  const enSmlmv = ibc / p.smlmv;
  let tarifa = 0;
  for (const t of p.tramosFsp) if (enSmlmv >= t.desdeSmlmv) tarifa = t.tarifa;
  return tarifa;
}

export function calcularAportes(e: EntradaAportes, p: ParametrosAnio): ResultadoAportes {
  if (e.ingresoBrutoMes < 0) throw new Error('El ingreso no puede ser negativo');
  const r = (v: number) => redondearMultiplo(v, p.redondeoPila);
  const ibcTeorico = e.ingresoBrutoMes * p.porcentajeIbc;
  const ibc = Math.min(Math.max(ibcTeorico, p.smlmv * p.topeMinIbcSmlmv), p.smlmv * p.topeMaxIbcSmlmv);
  const salud = r(ibc * p.tarifaSalud);
  const pension = r(ibc * p.tarifaPension);
  const arl = e.incluirArl ? r(ibc * p.tarifasArl[e.clase]) : 0;
  const arlACargoDelUsuario = e.incluirArl && !e.arlLaPagaContratante;
  const tFsp = tarifaFsp(ibc, p);
  const fsp = r(ibc * tFsp);
  const totalUsuario = salud + pension + fsp + (arlACargoDelUsuario ? arl : 0);
  return {
    ibcTeorico, ibc, ibcEnSmlmv: ibc / p.smlmv, salud, pension, arl, arlACargoDelUsuario,
    tarifaFsp: tFsp, fsp, totalUsuario,
    porcentajeDelIngreso: e.ingresoBrutoMes > 0 ? totalUsuario / e.ingresoBrutoMes : 0,
  };
}
