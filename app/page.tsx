'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useApp } from '@/lib/app/estado';
import type { FormaDePago } from '@/lib/app/tipos';
import { Logo } from './_ui/Logo';

const OPCIONES: { id: FormaDePago; titulo: string; detalle: string }[] = [
  { id: 'usd', titulo: 'En dólares, desde el exterior', detalle: 'Contractor o freelancer con clientes afuera' },
  { id: 'cop', titulo: 'En pesos, por prestación de servicios', detalle: 'Contrato de prestación de servicios en Colombia' },
  { id: 'mixto', titulo: 'De ambas formas', detalle: 'Tienes clientes afuera y contratos en Colombia' },
];

export default function Bienvenida() {
  const { estado, actualizar } = useApp();
  const [elegida, setElegida] = useState<FormaDePago | null>(null);
  const forma = elegida ?? estado.formaDePago ?? 'usd';

  return (
    <div className="fondo-oliva sobre-oliva">
      <main className="pantalla pantalla-marca" style={{ background: 'transparent' }}>
        <Logo sobreOliva alto={64} />
        <div>
          <h1 className="titular-marca">
            Tus finanzas, mejor con <strong>Frilo</strong>
          </h1>
          <p style={{ marginTop: 14, color: 'var(--oliva-suave)' }}>
            Calculamos cuánto pagar de seguridad social y cuánto apartar para tu prima y tus cesantías cada mes.
          </p>
        </div>
        <fieldset className="opciones-pago">
          <legend>¿Cómo te pagan?</legend>
          {OPCIONES.map((o) => (
            <button key={o.id} type="button" className="opcion-pago" aria-pressed={forma === o.id} onClick={() => setElegida(o.id)}>
              <strong>{o.titulo}</strong>
              <span>{o.detalle}</span>
            </button>
          ))}
        </fieldset>
        <div style={{ marginTop: 'auto' }}>
          <Link href="/ingreso" className="btn btn-marca" onClick={() => actualizar({ formaDePago: forma })}>
            Continuar
          </Link>
        </div>
      </main>
    </div>
  );
}
