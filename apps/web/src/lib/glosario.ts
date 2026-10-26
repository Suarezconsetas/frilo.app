import { PARAMETROS } from '@/lib/calculos';
import { pesos } from '@/lib/formato';

/**
 * Términos del glosario (hub `/glosario`). Una sola fuente para la página y para el JSON-LD (DefinedTermSet), y las cifras
 * salen de `lib/calculos/parametros.ts` (las mismas de las calculadoras), no se escriben a mano.
 */
export interface TerminoGlosario {
  id: string;
  sigla: string;
  nombre: string;
  /** Primera oración visible y descripción del DefinedTerm: deben decir lo mismo. */
  definicion: string;
  detalle?: string;
  fuentes: { texto: string; href?: string }[];
  mas: { texto: string; href: string }[];
  /** Si el término tiene su propia página, el DefinedTerm vive allí. */
  pagina?: string;
}

const P = PARAMETROS[2026]!;
const pct = (n: number) => `${(n * 100).toFixed(3).replace(/\.?0+$/, '').replace('.', ',')}%`;
const arl = Object.values(P.tarifasArl);
const fsp = P.tramosFsp.filter((t) => t.tarifa > 0);
const minFsp = fsp[0]!;
const maxFsp = fsp[fsp.length - 1]!;

export const TERMINOS: TerminoGlosario[] = [
  {
    id: 'arl',
    sigla: 'ARL',
    nombre: 'Administradora de Riesgos Laborales',
    definicion: `La ARL (Administradora de Riesgos Laborales) es la entidad que cubre los accidentes de trabajo y las enfermedades laborales. Su tarifa depende de la clase de riesgo de tu actividad, de I a V, y va de ${pct(Math.min(...arl))} a ${pct(Math.max(...arl))} del IBC.`,
    detalle: 'Si eres contratista en riesgo I, II o III, la ARL la pagas tú; en riesgo IV y V la paga el contratante.',
    fuentes: [
      { texto: 'Decreto 1772 de 1994 (tarifas de riesgos laborales)' },
      { texto: 'Decreto 723 de 2013 (ARL de contratistas)', href: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=52627' },
    ],
    mas: [{ texto: 'Tarifas de ARL por clase de riesgo', href: '/calculadoras/aportes-independientes#arl' }],
  },
  {
    id: 'fsp',
    sigla: 'FSP',
    nombre: 'Fondo de Solidaridad Pensional',
    definicion: `El FSP (Fondo de Solidaridad Pensional) es un aporte adicional a pensión que pagan quienes cotizan sobre un IBC de ${minFsp.desdeSmlmv} salarios mínimos o más (${pesos(minFsp.desdeSmlmv * P.smlmv)} en 2026). La tarifa va del ${pct(minFsp.tarifa)} al ${pct(maxFsp.tarifa)} del IBC, según cuántos salarios mínimos sea tu IBC.`,
    fuentes: [{ texto: 'Ley 797 de 2003', href: 'http://www.secretariasenado.gov.co/senado/basedoc/ley_0797_2003.html' }],
    mas: [{ texto: 'Tramos del Fondo de Solidaridad', href: '/calculadoras/aportes-independientes#fsp' }],
  },
  {
    id: 'ibc',
    sigla: 'IBC',
    nombre: 'Ingreso Base de Cotización',
    definicion: `El IBC (Ingreso Base de Cotización) es el valor sobre el que se calculan tus aportes a salud, pensión y riesgos laborales. Si eres independiente con contrato de prestación de servicios, es el ${pct(P.porcentajeIbc)} del valor mensualizado de tu contrato, y nunca puede ser menor a un salario mínimo (${pesos(P.smlmv)} en 2026) ni mayor a ${P.topeMaxIbcSmlmv} (${pesos(P.topeMaxIbcSmlmv * P.smlmv)}).`,
    detalle: 'Si trabajas por cuenta propia, desde el Decreto 379 de 2026 ese porcentaje se aplica sobre tu ingreso neto, después de costos.',
    fuentes: [
      { texto: 'Ley 2277 de 2022, artículo 89', href: 'http://www.secretariasenado.gov.co/senado/basedoc/ley_2277_2022.html' },
      { texto: 'Decreto 379 de 2026', href: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=275076' },
    ],
    mas: [
      { texto: 'Cómo calcular el IBC de un independiente', href: '/guias/ibc-independientes' },
      { texto: 'Calculadora de aportes', href: '/calculadoras/aportes-independientes' },
    ],
  },
  {
    id: 'pila',
    sigla: 'PILA',
    nombre: 'Planilla Integrada de Liquidación de Aportes',
    definicion:
      'La PILA (Planilla Integrada de Liquidación de Aportes) es el formato único, electrónico o asistido, con el que trabajadores y empleadores liquidan y pagan en un solo trámite salud, pensión, riesgos laborales, caja de compensación y parafiscales.',
    detalle: 'Si eres independiente, es la planilla que pagas cada mes en el operador de información que elijas.',
    fuentes: [
      { texto: 'Resolución 2388 de 2016, Anexo Técnico 1 (glosario de la PILA)', href: 'https://www.unidadvictimas.gov.co/wp-content/uploads/Documentos/resoluciones/RESOLUCI%c3%93N_2388_2016.pdf' },
    ],
    mas: [
      { texto: 'Cómo descargar tu planilla de seguridad social', href: '/guias/descargar-planilla-seguridad-social' },
      { texto: 'Fecha límite de pago de la planilla', href: '/calculadoras/fecha-pago-planilla' },
    ],
  },
  {
    id: 'sln',
    sigla: 'SLN',
    nombre: 'Suspensión temporal del contrato o licencia no remunerada',
    definicion: 'SLN es la novedad de la planilla PILA que reporta una suspensión temporal del contrato de trabajo, una licencia no remunerada o una comisión de servicios.',
    fuentes: [{ texto: 'Resolución 2388 de 2016, Anexo Técnico 1', href: 'https://www.unidadvictimas.gov.co/wp-content/uploads/Documentos/resoluciones/RESOLUCI%c3%93N_2388_2016.pdf' }],
    mas: [{ texto: 'Qué significa SLN, cuándo se reporta y cómo afecta tus aportes', href: '/glosario/sln' }],
    pagina: '/glosario/sln',
  },
];

export const NOMBRE_GLOSARIO = 'Glosario de seguridad social para independientes';
