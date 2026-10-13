/** Enlace de baja de novedades con un solo clic. El token es un HMAC por persona: no se puede adivinar ni reutilizar para otra. */
import { createHmac, timingSafeEqual } from 'node:crypto';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const firmarBaja = (usuarioId: string, secreto: string): string =>
  createHmac('sha256', secreto).update(`baja-novedades:${usuarioId}`).digest('hex');

export function verificarBaja(usuarioId: string, token: string, secreto: string): boolean {
  if (!UUID.test(usuarioId) || !/^[0-9a-f]{64}$/.test(token) || !secreto) return false;
  const esperado = Buffer.from(firmarBaja(usuarioId, secreto));
  const recibido = Buffer.from(token);
  return esperado.length === recibido.length && timingSafeEqual(esperado, recibido);
}

export function urlDeBaja(urlApp: string, usuarioId: string, secreto: string): string {
  const base = urlApp.replace(/\/$/, '');
  return `${base}/api/novedades/baja?u=${usuarioId}&t=${firmarBaja(usuarioId, secreto)}`;
}
