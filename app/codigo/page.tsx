'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import { useApp } from '@/lib/app/estado';
import { Icono } from '../_ui/Icono';

const LARGO = 6;
const ESPERA = 45; // segundos para poder reenviar

// FASE 3: aquí se verifica el código contra Supabase Auth (vence a los 10 minutos) y se reenvía con Resend.
// Por ahora cualquier código de 6 dígitos deja entrar.
export default function Codigo() {
  const router = useRouter();
  const { estado, listo } = useApp();
  const [digitos, setDigitos] = useState<string[]>(Array(LARGO).fill(''));
  const [segundos, setSegundos] = useState(ESPERA);
  const casillas = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (listo && !estado.ingreso) router.replace('/');
  }, [listo, estado.ingreso, router]);

  useEffect(() => {
    if (segundos <= 0) return;
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundos]);

  function poner(i: number, valor: string) {
    const d = valor.replace(/\D/g, '').slice(-1);
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
  const reloj = `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`;

  return (
    <main className="pantalla">
      <form
        className="contenido formulario"
        style={{ gap: 20 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (completo) router.push('/inicio');
        }}
      >
        <Link href="/registro" className="volver" aria-label="Volver">
          <Icono nombre="volver" />
        </Link>
        <div>
          <h1 className="titulo-pantalla">Revisa tu correo</h1>
          <p className="subtitulo">
            Enviamos un código de 6 dígitos a <strong style={{ color: 'var(--tinta)', fontWeight: 600 }}>{estado.correoPendiente ?? 'tu correo'}</strong>. Vence en 10
            minutos.
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
                inputMode="numeric"
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                value={d}
                onChange={(e) => poner(i, e.target.value)}
                onKeyDown={(e) => alBorrar(i, e)}
              />
            ))}
          </div>
        </fieldset>

        <button type="submit" className="btn btn-primario" disabled={!completo}>
          Verificar y entrar
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {segundos > 0 ? (
            <span className="texto-suave" style={{ fontSize: 14 }}>
              Reenviar código en {reloj}
            </span>
          ) : (
            <button type="button" className="enlace" style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0, fontSize: 14 }} onClick={() => setSegundos(ESPERA)}>
              Reenviar código
            </button>
          )}
          <Link href="/registro" className="enlace" style={{ fontSize: 14 }}>
            Cambiar correo
          </Link>
        </div>
        <p className="ayuda">¿No te llegó? Revisa la carpeta de spam o promociones.</p>
      </form>
    </main>
  );
}
