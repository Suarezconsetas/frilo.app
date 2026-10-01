'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import { LARGO_CODIGO, mensajeDeError, pedirCodigo, verificarCodigo } from '@/lib/app/acceso';
import { useApp } from '@/lib/app/estado';
import { Icono } from '../_ui/Icono';

const LARGO = LARGO_CODIGO;
const ESPERA = 45; // segundos para poder reenviar

export default function Codigo() {
  const router = useRouter();
  const { estado, listo, sesion, db } = useApp();
  const [digitos, setDigitos] = useState<string[]>(Array(LARGO).fill(''));
  const [segundos, setSegundos] = useState(ESPERA);
  const [error, setError] = useState<string>();
  const [verificando, setVerificando] = useState(false);
  const [reenviado, setReenviado] = useState(false);
  const casillas = useRef<(HTMLInputElement | null)[]>([]);
  const correo = estado.correoPendiente;
  const volver = estado.ingreso ? '/registro' : '/entrar';

  useEffect(() => {
    if (!listo) return;
    if (sesion) router.replace('/inicio');
    else if (!correo) router.replace(volver);
  }, [listo, sesion, correo, volver, router]);

  useEffect(() => {
    if (segundos <= 0) return;
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundos]);

  function poner(i: number, valor: string) {
    const solo = valor.replace(/\D/g, '');
    // Autocompletado del celular o pegado: llega el código entero en una sola casilla; se reparte.
    if (solo.length > 1 && !digitos[i]) {
      const relleno = solo.slice(0, LARGO - i);
      setDigitos((prev) => prev.map((x, j) => (j >= i && j < i + relleno.length ? relleno[j - i]! : x)));
      casillas.current[Math.min(i + relleno.length, LARGO - 1)]?.focus();
      return;
    }
    const d = solo.slice(-1);
    setDigitos((prev) => prev.map((x, j) => (j === i ? d : x)));
    if (d && i < LARGO - 1) casillas.current[i + 1]?.focus();
  }

  function alBorrar(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digitos[i] && i > 0) casillas.current[i - 1]?.focus();
  }

  function alPegar(e: ClipboardEvent) {
    const pegado = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LARGO);
    if (!pegado) return;
    e.preventDefault();
    setDigitos(Array.from({ length: LARGO }, (_, i) => pegado[i] ?? ''));
    casillas.current[Math.min(pegado.length, LARGO - 1)]?.focus();
  }

  const completo = digitos.every(Boolean);

  async function verificar() {
    if (!completo || !correo) return;
    setError(undefined);
    setVerificando(true);
    try {
      await verificarCodigo(db(), correo, digitos.join(''));
      router.push('/inicio'); // el proveedor guarda las autorizaciones y sincroniza los datos
    } catch (e) {
      setError(mensajeDeError(e, 'verificar'));
      setDigitos(Array(LARGO).fill(''));
      casillas.current[0]?.focus();
      setVerificando(false);
    }
  }

  async function reenviar() {
    if (!correo) return;
    setError(undefined);
    try {
      await pedirCodigo(db(), correo);
      setSegundos(ESPERA);
      setReenviado(true);
    } catch (e) {
      setError(mensajeDeError(e, 'enviar'));
    }
  }

  const reloj = `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`;

  return (
    <main className="pantalla">
      <form
        className="contenido formulario"
        style={{ gap: 20 }}
        onSubmit={(e) => {
          e.preventDefault();
          void verificar();
        }}
      >
        <Link href={volver} className="volver" aria-label="Volver">
          <Icono nombre="volver" />
        </Link>
        <div>
          <h1 className="titulo-pantalla">Revisa tu correo</h1>
          <p className="subtitulo">
            Enviamos un código de {LARGO} dígitos a <strong style={{ color: 'var(--tinta)', fontWeight: 600 }}>{correo ?? 'tu correo'}</strong>. Vence en 10 minutos.
          </p>
        </div>

        <fieldset className="campo">
          <legend>Código de verificación</legend>
          <div className="codigo" onPaste={alPegar}>
            {digitos.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  casillas.current[i] = el;
                }}
                aria-label={`Dígito ${i + 1} de ${LARGO}`}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'error-codigo' : undefined}
                inputMode="numeric"
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                value={d}
                onChange={(e) => poner(i, e.target.value)}
                onKeyDown={(e) => alBorrar(i, e)}
              />
            ))}
          </div>
          {error && (
            <span id="error-codigo" className="error" role="alert">
              {error}
            </span>
          )}
          {reenviado && !error && (
            <span className="ayuda" role="status">
              Te enviamos un código nuevo.
            </span>
          )}
        </fieldset>

        <button type="submit" className="btn btn-primario" disabled={!completo || verificando}>
          {verificando ? 'Verificando…' : 'Verificar y entrar'}
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {segundos > 0 ? (
            <span className="texto-suave" style={{ fontSize: 14 }}>
              Reenviar código en {reloj}
            </span>
          ) : (
            <button type="button" className="enlace" style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0, fontSize: 14 }} onClick={reenviar}>
              Reenviar código
            </button>
          )}
          <Link href={volver} className="enlace" style={{ fontSize: 14 }}>
            Cambiar correo
          </Link>
        </div>
        <p className="ayuda">¿No te llegó? Revisa la carpeta de spam o promociones.</p>
      </form>
    </main>
  );
}
