/** Enlace de baja de novedades con un solo clic. El token es un HMAC por persona: no se puede adivinar ni reutilizar para otra. */
import { createHmac, timingSafeEqual } from 'node:crypto';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** `alcance` separa los enlaces: el de novedades no sirve para apagar el recordatorio de planilla ni al revés. */
export type AlcanceBaja = 'novedades' | 'planilla';

export const firmarBaja = (usuarioId: string, secreto: string, alcance: AlcanceBaja = 'novedades'): string =>
  createHmac('sha256', secreto).update(`baja-${alcance}:${usuarioId}`).digest('hex');

export function verificarBaja(usuarioId: string, token: string, secreto: string, alcance: AlcanceBaja = 'novedades'): boolean {
  if (!UUID.test(usuarioId) || !/^[0-9a-f]{64}$/.test(token) || !secreto) return false;
  const esperado = Buffer.from(firmarBaja(usuarioId, secreto, alcance));
  const recibido = Buffer.from(token);
  return esperado.length === recibido.length && timingSafeEqual(esperado, recibido);
}

export function urlDeBaja(urlApp: string, usuarioId: string, secreto: string): string {
  const base = urlApp.replace(/\/$/, '');
  return `${base}/api/novedades/baja?u=${usuarioId}&t=${firmarBaja(usuarioId, secreto)}`;
}

/** Enlace para apagar el recordatorio de la planilla con un clic, sin iniciar sesión. */
export function urlDeBajaPlanilla(urlApp: string, usuarioId: string, secreto: string): string {
  const base = urlApp.replace(/\/$/, '');
  return `${base}/api/recordatorio/baja?u=${usuarioId}&t=${firmarBaja(usuarioId, secreto, 'planilla')}`;
}
