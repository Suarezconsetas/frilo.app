'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let instancia: SupabaseClient | null = null;

/** Cliente del navegador: usa solo la clave pública; lo que ve cada usuario lo decide el RLS. */
export function clienteNavegador(): SupabaseClient {
  if (!instancia) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !clave) throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
    // Con NEXT_PUBLIC_COOKIE_DOMAIN (p. ej. .frilo.dev) la sesión se comparte con el sitio de contenido. Sin la variable, todo igual que antes.
    const dominio = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
    instancia = createBrowserClient(url, clave, dominio ? { cookieOptions: { domain: dominio, path: '/', sameSite: 'lax' } } : undefined);
  }
  return instancia;
}
