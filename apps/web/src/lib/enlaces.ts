import { RUTA_CUENTAS } from './config';

export type Enlace = { texto: string; href: string; detalle: string };

/** Destinos que se reutilizan en el menú, los bloques «Sigue con» y los términos clave. */
const D = {
  aportes: { texto: 'Calculadora de aportes para independientes', href: '/calculadoras/aportes-independientes', detalle: 'Salud, pensión, ARL y Fondo de Solidaridad en un solo cálculo.' },
  cesantias: { texto: 'Calculadora de cesantías e intereses', href: '/calculadoras/cesantias', detalle: 'Cuánto apartar cada mes para tus cesantías y su prima.' },
  fecha: { texto: 'Fecha de pago de la planilla', href: '/calculadoras/fecha-pago-planilla', detalle: 'Tu día límite según los dos últimos dígitos del documento.' },
  interes: { texto: 'Calculadora de interés compuesto', href: '/calculadoras/interes-compuesto', detalle: 'Simula cuánto rinde tu ahorro mes a mes.' },
  dolar: { texto: 'Dólar hoy en Colombia (TRM)', href: '/dolar-hoy', detalle: 'La TRM de hoy y cómo se compara con la semana, el mes y el año.' },
  ibc: { texto: 'IBC para independientes: qué es y cómo calcularlo', href: '/guias/ibc-independientes', detalle: 'La base sobre la que pagas salud y pensión.' },
  planilla: { texto: 'Cómo descargar y verificar tu planilla', href: '/guias/descargar-planilla-seguridad-social', detalle: 'Paso a paso para descargar el comprobante de pago.' },
  cesantiasGuia: { texto: 'Cesantías para independientes', href: '/guias/cesantias-independientes', detalle: 'Cómo crear tus cesantías y dónde guardarlas.' },
  cuentaDolares: { texto: 'Cuenta en dólares en Colombia', href: '/guias/cuenta-en-dolares-colombia', detalle: 'Opciones, requisitos y costos para tener dólares.' },
  recibir: { texto: 'Cómo recibir pagos en dólares', href: '/guias/recibir-pagos-en-dolares-colombia', detalle: 'Opciones, costos y tiempos para cobrar del exterior.' },
  cuentas: { texto: 'Cuentas de ahorro que rinden', href: RUTA_CUENTAS, detalle: 'Qué tasa pagan hoy, sin CDT y con liquidez.' },
  glosario: { texto: 'Glosario de la planilla', href: '/glosario', detalle: 'ARL, FSP, IBC, PILA y SLN en lenguaje claro.' },
} satisfies Record<string, Enlace>;

/** Menú desplegable del encabezado (E1). */
type ElementoMenu = { titulo: string; href: string; coincide?: 'exacta'; enlaces: Enlace[] };
export const MENU_CALCULADORAS: ElementoMenu = { titulo: 'Calculadoras', href: '/calculadoras', enlaces: [D.aportes, D.cesantias, D.fecha, D.interes] };
export const MENU_GUIAS: ElementoMenu = { titulo: 'Guías', href: '/guias', coincide: 'exacta', enlaces: [D.ibc, D.planilla, D.cesantiasGuia, D.recibir, D.cuentaDolares, D.glosario] };

/** «Sigue con» (E2 y E5): enlaces del mismo tema al final de cada página, por id de página. */
export const SIGUE_CON: Record<string, Enlace[]> = {
  Home: [D.cuentaDolares, D.glosario],
  'Hub-C': [D.cuentaDolares, D.ibc, D.planilla],
  P01: [D.ibc, D.fecha, D.planilla, D.cesantias, D.cuentaDolares],
  P02: [D.aportes, D.fecha, D.planilla, D.cesantias, D.glosario],
  P03: [D.cesantiasGuia, D.interes, D.cuentas, D.aportes],
  P04: [D.aportes, D.fecha, D.ibc, D.cesantias],
  P05: [D.aportes, D.planilla, D.ibc, D.cesantias],
  P06: [D.planilla, D.ibc, D.aportes, D.glosario],
  P07: [D.cuentaDolares, D.recibir, D.interes, D.cesantias, D.cuentas],
  P08: [D.dolar, D.recibir, D.interes, D.cuentas],
  P09: [D.dolar, D.cuentaDolares, D.aportes, D.cuentas],
  P10: [D.cuentas, D.cesantiasGuia, D.cuentaDolares, D.dolar],
  P11: [D.interes, D.cesantiasGuia, D.cuentaDolares, D.dolar],
  P12: [D.cesantias, D.interes, D.cuentas, D.ibc],
};

/** Términos del glosario que se muestran en el Home y los hubs (E7). */
export const TERMINOS_CLAVE: { sigla: string; href: string }[] = [
  { sigla: 'IBC', href: '/glosario#ibc' },
  { sigla: 'PILA', href: '/glosario#pila' },
  { sigla: 'ARL', href: '/glosario#arl' },
  { sigla: 'FSP', href: '/glosario#fsp' },
  { sigla: 'SLN', href: '/glosario/sln' },
];
