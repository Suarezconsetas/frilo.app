import { normalizarRegistro, panelTrm, trmVigente, type RegistroTrm } from '@/lib/calculos';
import { hoyColombia } from '@/lib/app/fechas';
import { fechaConDia } from '@/lib/app/planilla';
import { fechaCorta, pctConSigno, pesosConDecimales, pesosConSigno } from '@/lib/formato';

const FUENTE = 'https://www.datos.gov.co/resource/32sa-8pi3.json';

/** TRM oficial (Superintendencia Financiera vía datos.gov.co). La página se regenera una vez al día (`revalidate: 86400`); no se guarda nada en Supabase. */
export async function cargarSerieTrm(): Promise<RegistroTrm[]> {
  try {
    const url = `${FUENTE}?$order=${encodeURIComponent('vigenciadesde DESC')}&$limit=450`;
    const r = await fetch(url, { next: { revalidate: 86_400 } });
    if (!r.ok) return [];
    const crudos = (await r.json()) as { valor: string; vigenciadesde: string; vigenciahasta: string }[];
    return crudos.map(normalizarRegistro).sort((a, b) => a.vigenciadesde.localeCompare(b.vigenciadesde));
  } catch {
    return [];
  }
}

export interface DatosTrm {
  hoy: number;
  fechaTitulo: string; // "jueves 15 de octubre de 2026"
  hoyTxt: string; // "$3.156,32"
  desde: string; // "15 oct 2026"
  verbo: string;
  varAyerPct: string;
  varAyerTxt: string;
  actualizado: string;
  semana: { valor: string; txt: string };
  mes: { valor: string; txt: string };
  anio: { valor: string; txt: string };
  filas: { fecha: string; trm: string; variacion: string }[];
  puntos: { fecha: string; valor: number }[];
  fechaIso: string;
  hayDatos: boolean;
}

const direccion = (pct: number) => (pct > 0 ? 'sube' : pct < 0 ? 'baja' : 'igual');
const sinSigno = (txt: string) => txt.replace(/^[+−-]/, '');

export function datosDePagina(serie: RegistroTrm[], ahora = new Date()): DatosTrm {
  const hoy = hoyColombia(ahora);
  const vacio: DatosTrm = {
    hoy: 0, fechaTitulo: '', hoyTxt: 'no disponible', desde: '', verbo: 'se mantuvo', varAyerPct: 'sin cambios', varAyerTxt: '',
    actualizado: '', semana: { valor: '—', txt: '' }, mes: { valor: '—', txt: '' }, anio: { valor: '—', txt: '' }, filas: [], puntos: [], fechaIso: '', hayDatos: false,
  };
  if (!serie.length) return vacio;

  const ultima = serie[serie.length - 1]!;
  const fecha = ultima.vigenciadesde > hoy ? ultima.vigenciadesde : hoy;
  let hoyValor: number;
  try {
    hoyValor = trmVigente(serie, fecha);
  } catch {
    hoyValor = ultima.valor;
  }
  // Variación contra el registro anterior (el valor de "ayer").
  const vigente = [...serie].reverse().find((r) => r.vigenciadesde <= fecha) ?? ultima;
  const idx = serie.indexOf(vigente);
  const previo = idx > 0 ? serie[idx - 1]!.valor : vigente.valor;
  const abs = hoyValor - previo;
  const pct = previo ? hoyValor / previo - 1 : 0;

  let panel: ReturnType<typeof panelTrm> | null = null;
  try {
    panel = panelTrm(serie, fecha);
  } catch {
    panel = null;
  }
  // "Hace una semana" muestra cómo está HOY frente a esa fecha: sube/baja el dólar desde entonces.
  const ref = (clave: string) => {
    const v = panel?.variaciones.find((x) => x.referencia === clave);
    if (!v) return { valor: '—', txt: '' };
    const d = direccion(v.variacionPct);
    return { valor: pesosConDecimales(v.trm), txt: d === 'igual' ? 'sin cambio' : `${d} ${sinSigno(pctConSigno(v.variacionPct))}` };
  };

  const ultimos30 = serie.slice(-30).reverse();
  const filas = ultimos30.map((r) => {
    const i = serie.indexOf(r);
    const p = i > 0 ? serie[i - 1]!.valor : r.valor;
    return { fecha: fechaCorta(r.vigenciadesde), trm: pesosConDecimales(r.valor), variacion: i > 0 ? pctConSigno(r.valor / p - 1) : '—' };
  });

  const formatoHora = new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  return {
    hoy: hoyValor,
    fechaTitulo: `${fechaConDia(fecha)} de ${fecha.slice(0, 4)}`,
    hoyTxt: pesosConDecimales(hoyValor),
    desde: fechaCorta(vigente.vigenciadesde),
    verbo: abs > 0 ? 'subió' : abs < 0 ? 'bajó' : 'se mantuvo',
    varAyerPct: abs === 0 ? 'sin cambios' : sinSigno(pctConSigno(pct)),
    varAyerTxt: `${pesosConSigno(abs)} (${pctConSigno(pct)})`,
    actualizado: formatoHora.format(ahora),
    semana: ref('semana'),
    mes: ref('mes'),
    anio: ref('anio'),
    filas,
    puntos: serie.slice(-400).map((r) => ({ fecha: r.vigenciadesde, valor: r.valor })),
    fechaIso: vigente.vigenciadesde,
    hayDatos: true,
  };
}
