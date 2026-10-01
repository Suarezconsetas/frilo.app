'use client';

import type { SupabaseClient } from '@supabase/supabase-js';

/** Google se muestra solo cuando está activado en Supabase (NEXT_PUBLIC_GOOGLE_ACTIVO=true). */
export const GOOGLE_ACTIVO = process.env.NEXT_PUBLIC_GOOGLE_ACTIVO === 'true';

/** Largo del código que envía Supabase (Authentication → Email → OTP length). Debe coincidir con ese ajuste. */
export const LARGO_CODIGO = Number(process.env.NEXT_PUBLIC_LARGO_CODIGO ?? 6);

export const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ErrorAuth = { status?: number; code?: string; message?: string };

/** Mensajes claros en español; nunca el texto técnico de Supabase. */
export function mensajeDeError(e: unknown, contexto: 'enviar' | 'verificar'): string {
  const { status, code, message = '' } = (e ?? {}) as ErrorAuth;
  if (status === 429 || code === 'over_email_send_rate_limit' || /security purposes|rate limit/i.test(message)) {
    return 'Pediste varios códigos seguidos. Espera un momento e inténtalo de nuevo.';
  }
  if (contexto === 'verificar') {
    return 'Ese código no es válido o ya venció. Revisa el último correo que te enviamos o pide uno nuevo.';
  }
  return 'No pudimos enviar el código. Revisa el correo e inténtalo de nuevo.';
}

/** Envía el código de 6 dígitos. Crea la cuenta si el correo es nuevo. */
export async function pedirCodigo(db: SupabaseClient, correo: string) {
  const { error } = await db.auth.signInWithOtp({ email: correo, options: { shouldCreateUser: true } });
  if (error) throw error;
}

export async function verificarCodigo(db: SupabaseClient, correo: string, codigo: string) {
  const { error } = await db.auth.verifyOtp({ email: correo, token: codigo, type: 'email' });
  if (error) throw error;
}

export async function entrarConGoogle(db: SupabaseClient) {
  const { error } = await db.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } });
  if (error) throw error;
}
