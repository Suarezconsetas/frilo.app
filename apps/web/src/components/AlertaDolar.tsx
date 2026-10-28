'use client';

import { useState } from 'react';
import { GOOGLE_ACTIVO, LARGO_CODIGO } from '../lib/config';
import { miles, soloEnteros } from '../lib/entradas';
import { useRegistro } from '../lib/registro';
import { TEXTO_NOVEDADES } from './BannerRegistro';

const ETIQUETA = { fontSize: 14, color: '#B5CCC1' } as const;

/** Alerta del dólar: el valor objetivo queda como intención y se crea en la app al terminar el registro (mismo flujo que el banner). */
export function AlertaDolar() {
  const [valor, setValor] = useState(0);
  const { novedades, setNovedades, paso, correo, setCorreo, codigo, setCodigo, error, ocupado, conGoogle, pedirCodigo, verificar, volver } = useRegistro({
    variante: 'dolar',
    pagina: 'P07',
    intencion: () => (valor > 0 ? { tipo: 'alerta_dolar', valor } : undefined),
  });

  return (
    <section aria-labelledby="h-alerta" style={{ flex: '1 1 320px', background: '#0F372D', color: '#FFFFFF', borderRadius: 24, padding: 28, display: 'flex', flexDirection: 'column', gap: 16, boxSizing: 'border-box' }}>
      <h2 id="h-alerta" style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 18 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
        </svg>
        Avísame cuando el dólar llegue a…
      </h2>
      {paso === 1 ? (
        <form onSubmit={pedirCodigo} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label htmlFor="alerta-valor" style={ETIQUETA}>
            Valor objetivo (COP)
          </label>
          <input id="alerta-valor" className="field" inputMode="numeric" placeholder="4.300" value={valor ? miles(valor) : ''} onChange={(e) => setValor(soloEnteros(e))} />
          <label htmlFor="alerta-correo" style={ETIQUETA}>
            Tu correo
          </label>
          <input id="alerta-correo" className="field" type="email" autoComplete="email" placeholder="tu@correo.com" value={correo} onChange={(e) => setCorreo(e.target.value)} />
          <label className="registro-casilla">
            <input type="checkbox" checked={novedades} onChange={(e) => setNovedades(e.target.checked)} />
            <span>{TEXTO_NOVEDADES}</span>
          </label>
          <button type="submit" className="btn btn-m" disabled={ocupado} style={{ border: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
            {ocupado ? 'Enviando…' : 'Crear alerta gratis'}
          </button>
          {GOOGLE_ACTIVO && (
            <button type="button" className="boton-contorno" onClick={conGoogle} disabled={ocupado}>
              O continuar con Google
            </button>
          )}
          <span style={{ fontSize: 14, color: '#B5CCC1' }}>Crea tu cuenta con un código que te llega al correo.</span>
        </form>
      ) : (
        <form onSubmit={verificar} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={ETIQUETA}>Te enviamos un código de {LARGO_CODIGO} dígitos a {correo}.</span>
          <label htmlFor="alerta-codigo" style={ETIQUETA}>
            Código
          </label>
          <input id="alerta-codigo" className="field" inputMode="numeric" autoComplete="one-time-code" maxLength={LARGO_CODIGO} placeholder={'0'.repeat(LARGO_CODIGO)} value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))} />
          <button type="submit" className="btn btn-m" disabled={ocupado} style={{ border: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
            {ocupado ? 'Verificando…' : 'Verificar y crear mi alerta'}
          </button>
          <button type="button" className="boton-contorno" onClick={volver}>
            Usar otro correo
          </button>
        </form>
      )}
      {error && (
        <p role="alert" style={{ margin: 0, fontSize: 14, color: '#ffd2d2' }}>
          {error}
        </p>
      )}
    </section>
  );
}
