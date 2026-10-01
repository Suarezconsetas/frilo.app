import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

/** Vuelta de Google (OAuth con PKCE): cambia el código por la sesión y deja las cookies. */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const fallo = (motivo: string) => NextResponse.redirect(`${origin}/entrar?error=${motivo}`);

  if (searchParams.get('error')) return fallo('google');
  if (!code) return fallo('sin_codigo');

  const jar = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (lista: { name: string; value: string; options: CookieOptions }[]) => lista.forEach(({ name, value, options }) => jar.set(name, value, options)),
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return fallo('sesion');
  return NextResponse.redirect(`${origin}/inicio`);
}
