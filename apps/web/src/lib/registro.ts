'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRef, useState, type FormEvent } from 'react';
import { CORREO_VALIDO, mensajeDeError } from '@/lib/app/acceso';
import { COOKIE_DOMINIO, LARGO_CODIGO, URL_APP } from './config';
import { intencionActual } from './intencion';
import { guardarIntencion, guardarMarketing, registrarEvento, type Intencion } from './medicion';

/** Entra a la app tras registrarse: la app retoma la acción pendiente (cookie de intención) en /bienvenida. */
export const DESTINO_REGISTRO = `${URL_APP}/bienvenida`;

/**
 * Registro con Google o con código por correo (brief §2.9). Lo usan el banner de registro y el formulario de alerta del dólar.
 * `intencion` (o la que haya fijado la calculadora de la página) se deja en una cookie del dominio compartido, nunca en la URL.
 */
export function useRegistro({ variante, pagina, intencion }: { variante: string; pagina: string; intencion?: () => Intencion | undefined }) {
  const [paso, setPaso] = useState<1 | 2>(1);
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState<string>();
  const [ocupado, setOcupado] = useState(false);
  const [novedades, setNovedades] = useState(false);
  const cliente = useRef<ReturnType<typeof createBrowserClient> | null>(null);

  const db = () => {
    if (!cliente.current) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !clave) throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
      cliente.current = createBrowserClient(url, clave, COOKIE_DOMINIO ? { cookieOptions: { domain: COOKIE_DOMINIO, path: '/', sameSite: 'lax' } } : undefined);
    }
    return cliente.current;
  };

  const preparar = (metodo: 'google' | 'correo') => {
    const pendiente = intencion?.() ?? intencionActual();
    if (pendiente) guardarIntencion(pendiente);
    guardarMarketing(novedades);
    registrarEvento('signup_start', { pagina, variante, metodo });
  };

  async function conGoogle() {
    setError(undefined);
    setOcupado(true);
    try {
      preparar('google');
      const { error: e } = await db().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${URL_APP}/auth/callback?siguiente=/bienvenida` } });
      if (e) throw e;
    } catch {
      setError('No pudimos entrar con Google. Inténtalo de nuevo o usa tu correo.');
      setOcupado(false);
    }
  }

  async function pedirCodigo(e: FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (!CORREO_VALIDO.test(correo.trim())) {
      setError('Escribe un correo válido, por ejemplo tu@correo.com.');
      return;
    }
    setOcupado(true);
    try {
      preparar('correo');
      const { error: err } = await db().auth.signInWithOtp({ email: correo.trim(), options: { shouldCreateUser: true } });
      if (err) throw err;
      setPaso(2);
    } catch (err) {
      setError(mensajeDeError(err, 'enviar'));
    } finally {
      setOcupado(false);
    }
  }

  async function verificar(e: FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (codigo.trim().length !== LARGO_CODIGO) {
      setError(`El código tiene ${LARGO_CODIGO} dígitos.`);
      return;
    }
    setOcupado(true);
    try {
      const { error: err } = await db().auth.verifyOtp({ email: correo.trim(), token: codigo.trim(), type: 'email' });
      if (err) throw err;
      registrarEvento('signup_complete', { pagina, variante, metodo: 'correo' });
      window.location.assign(DESTINO_REGISTRO);
    } catch (err) {
      setError(mensajeDeError(err, 'verificar'));
      setOcupado(false);
    }
  }

  const volver = () => {
    setPaso(1);
    setCodigo('');
    setError(undefined);
  };

  return { novedades, setNovedades, paso, correo, setCorreo, codigo, setCodigo, error, ocupado, conGoogle, pedirCodigo, verificar, volver };
}
