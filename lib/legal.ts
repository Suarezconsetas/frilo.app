/**
 * Datos del responsable y estado de los textos legales. Un solo lugar para completarlos.
 * Mientras `esBorrador` sea true, las páginas legales muestran un aviso visible de borrador.
 */
export const LEGAL = {
  marca: 'Frilo',
  /** Datos del responsable del tratamiento. Lo que quede entre corchetes se muestra como pendiente. */
  razonSocial: 'Nicolás Suárez Pardo',
  nit: '1018498427',
  domicilio: 'Cra 6 # 48a - 47, Bogotá, Colombia',
  correoPrivacidad: 'nicolas.suarez.cr@gmail.com',
  telefono: '+57 304 533 7042',
  fechaActualizacion: '1 de octubre de 2026',
  /** true muestra un aviso de borrador en las páginas legales. Revisados por un abogado: false. */
  esBorrador: false,
} as const;

/** true si queda algún dato entre corchetes por completar. */
export const HAY_DATOS_PENDIENTES = Object.values(LEGAL).some((v) => typeof v === 'string' && v.includes('['));
