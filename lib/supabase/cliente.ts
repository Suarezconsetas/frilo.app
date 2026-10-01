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
    instancia = createBrowserClient(url, clave);
  }
  return instancia;
}
