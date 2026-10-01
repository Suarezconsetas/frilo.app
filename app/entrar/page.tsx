'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, type FormEvent } from 'react';
import { CORREO_VALIDO, GOOGLE_ACTIVO, LARGO_CODIGO, entrarConGoogle, mensajeDeError, pedirCodigo } from '@/lib/app/acceso';
import { useApp } from '@/lib/app/estado';
import { Icono } from '../_ui/Icono';
import { BotonGoogle } from '../_ui/BotonGoogle';
import { Logo } from '../_ui/Logo';
import { Campo } from '../_ui/controles';

const ERRORES_URL: Record<string, string> = {
  google: 'No pudimos entrar con Google. Inténtalo de nuevo o usa tu correo.',
  sesion: 'No pudimos iniciar tu sesión. Inténtalo de nuevo.',
  sin_codigo: 'No pudimos iniciar tu sesión. Inténtalo de nuevo.',
};

function Formulario() {
  const router = useRouter();
  const params = useSearchParams();
  const { db, sesion, listo, sesionLista, actualizar } = useApp();
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState<string | undefined>(ERRORES_URL[params.get('error') ?? '']);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (listo && sesionLista && sesion) router.replace('/inicio');
  }, [listo, sesionLista, sesion, router]);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!CORREO_VALIDO.test(correo.trim())) {
      setError('Escribe un correo válido, por ejemplo tu@correo.com.');
      return;
    }
    setError(undefined);
    setEnviando(true);
    try {
      actualizar({ correoPendiente: correo.trim(), autorizacionPendiente: { marketing: false } });
      await pedirCodigo(db(), correo.trim());
      router.push('/codigo');
    } catch (err) {
      setError(mensajeDeError(err, 'enviar'));
    } finally {
      setEnviando(false);
    }
  }

  async function conGoogle() {
    setError(undefined);
    actualizar({ autorizacionPendiente: { marketing: false } });
    try {
      await entrarConGoogle(db());
    } catch {
      setError(ERRORES_URL.google);
    }
  }

  return (
    <main className="pantalla">
      <form className="contenido formulario" onSubmit={enviar} noValidate>
        <Link href="/" className="volver" aria-label="Volver">
          <Icono nombre="volver" />
        </Link>
        <Logo alto={40} />
        <div>
          <h1 className="titulo-pantalla">Entra a tu cuenta</h1>
          <p className="subtitulo">Te enviamos un código de {LARGO_CODIGO} dígitos a tu correo. Sin contraseñas.</p>
        </div>

        {GOOGLE_ACTIVO && (
          <>
            <BotonGoogle onClick={conGoogle} />
            <div className="separador" role="separator">
              o con tu correo
            </div>
          </>
        )}

        <Campo id="correo" etiqueta="Correo electrónico" error={error}>
          {(p) => <input {...p} type="email" autoComplete="email" placeholder="tu@correo.com" value={correo} onChange={(e) => setCorreo(e.target.value)} />}
        </Campo>
        <button type="submit" className="btn btn-primario" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviarme un código'}
        </button>
        <p className="legal">
          Al continuar autorizas el tratamiento de tus datos personales según la{' '}
          <Link href="/politica-de-datos" target="_blank" rel="noopener" style={{ fontWeight: 600 }}>
            Política de tratamiento de datos
          </Link>{' '}
          de Frilo (Ley 1581 de 2012) y aceptas los{' '}
          <Link href="/terminos" target="_blank" rel="noopener" style={{ fontWeight: 600 }}>
            Términos de uso
          </Link>
          .
        </p>
        <p className="ayuda">
          ¿Primera vez? <Link href="/" style={{ fontWeight: 600 }}>Calcula tu mes</Link> y crea tu cuenta al final.
        </p>
      </form>
    </main>
  );
}

export default function Entrar() {
  // useSearchParams exige Suspense en las páginas que se generan de forma estática.
  return (
    <Suspense fallback={null}>
      <Formulario />
    </Suspense>
  );
}
