/**
 * Datos del responsable y estado de los textos legales. Un solo lugar para completarlos.
 * Mientras `esBorrador` sea true, las páginas legales muestran un aviso visible de borrador.
 */
export const LEGAL = {
  marca: 'Frilo',
  /** Complétalo con los datos reales de la empresa antes de publicar. */
  razonSocial: '[RAZÓN SOCIAL DE LA EMPRESA]',
  nit: '[NIT]',
  domicilio: '[DIRECCIÓN, CIUDAD, COLOMBIA]',
  correoPrivacidad: '[CORREO DE PRIVACIDAD, p. ej. privacidad@tudominio.com]',
  telefono: '[TELÉFONO DE CONTACTO]',
  fechaActualizacion: '1 de octubre de 2026',
  /** Pasar a false solo cuando un abogado haya revisado y aprobado ambos textos. */
  esBorrador: true,
} as const;
