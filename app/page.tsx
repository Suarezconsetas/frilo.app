'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useApp } from '@/lib/app/estado';
import type { FormaDePago } from '@/lib/app/tipos';
import { Icono, type NombreIcono } from './_ui/Icono';
import { Logo } from './_ui/Logo';

const OPCIONES: { id: FormaDePago; titulo: string; detalle: string }[] = [
  { id: 'usd', titulo: 'En dólares, desde el exterior', detalle: 'Contractor o freelancer con clientes afuera' },
  { id: 'cop', titulo: 'En pesos, por prestación de servicios', detalle: 'Contrato de prestación de servicios en Colombia' },
  { id: 'mixto', titulo: 'De ambas formas', detalle: 'Tienes clientes afuera y contratos en Colombia' },
];

const PARA_QUIEN = [
  'Te ofrecieron un trabajo por prestación de servicios y quieres saber cuánto pagarás de planilla y cuánta plata te quedará a fin de mes.',
  'Trabajas desde Colombia para una empresa del exterior y recibes tu pago en dólares.',
  'Tienes uno o más contratos de prestación de servicios, en pesos o en dólares, y quieres llevar el control de tus finanzas.',
];

const QUE_PUEDES_SABER: { icono: NombreIcono; titulo: string; detalle: string }[] = [
  { icono: 'aportes', titulo: 'Cuánto pagar de planilla', detalle: 'Tus aportes a salud, pensión y ARL cada mes, con el valor exacto para pagar.' },
  { icono: 'dolar', titulo: 'A cuánto está el dólar', detalle: 'La TRM de hoy y cómo se compara con la semana, el mes y el año pasados.' },
  {
    icono: 'ahorro',
    titulo: 'Cuánto podrías ahorrar y ganar',
    detalle: 'Tu prima y tus cesantías, aunque tu contrato no las incluya, y lo que podrían rendir en una cuenta.',
  },
];

export default function Bienvenida() {
  const { estado, actualizar } = useApp();
  const [elegida, setElegida] = useState<FormaDePago | null>(null);
  const forma = elegida ?? estado.formaDePago ?? 'usd';

  return (
    <div className="fondo-oliva sobre-oliva">
      <main className="pantalla pantalla-marca" style={{ background: 'transparent' }}>
        <div>
          <Logo sobreOliva alto={64} />
        </div>
        <div>
          <h1 className="titular-marca">
            Tus finanzas, mejor con <strong>Frilo</strong>
          </h1>
          <p style={{ marginTop: 14, color: 'var(--oliva-suave)' }}>
            Calculamos cuánto pagar de seguridad social y cuánto apartar para tu prima y tus cesantías cada mes.
          </p>
        </div>
        <section aria-labelledby="para-quien">
          <h2 id="para-quien" className="bloque-titulo">
            Frilo es la app ideal para tus finanzas si:
          </h2>
          <ul className="lista-check">
            {PARA_QUIEN.map((t) => (
              <li key={t}>
                <span className="icono-check" aria-hidden="true">
                  <Icono nombre="check" tamano={16} activo />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="que-puedes-saber">
          <h2 id="que-puedes-saber" className="bloque-titulo">
            Con Frilo puedes saber
          </h2>
          <ul className="caracteristicas">
            {QUE_PUEDES_SABER.map((c) => (
              <li key={c.titulo}>
                <span className="icono-caracteristica" aria-hidden="true">
                  <Icono nombre={c.icono} tamano={22} />
                </span>
                <span>
                  <strong>{c.titulo}</strong>
                  <span>{c.detalle}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
        <fieldset className="opciones-pago">
          <legend>¿Cómo te pagan?</legend>
          {OPCIONES.map((o) => (
            <button key={o.id} type="button" className="opcion-pago" aria-pressed={forma === o.id} onClick={() => setElegida(o.id)}>
              <strong>{o.titulo}</strong>
              <span>{o.detalle}</span>
            </button>
          ))}
        </fieldset>
        <div className="cta-fijo">
          <Link href="/ingreso" className="btn btn-marca" onClick={() => actualizar({ formaDePago: forma })}>
            Continuar
          </Link>
          <Link href="/entrar" className="enlace" style={{ width: '100%', justifyContent: 'center', marginTop: 8, color: 'var(--oliva-suave)' }}>
            Ya tengo cuenta
          </Link>
        </div>
      </main>
    </div>
  );
}
