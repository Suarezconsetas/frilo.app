'use client';

import type { ReactNode } from 'react';
import { dolarVisible } from '@/lib/app/derivados';
import { useApp } from '@/lib/app/estado';
import { Navegacion } from '../_ui/Navegacion';

export default function LayoutApp({ children }: { children: ReactNode }) {
  const { estado } = useApp();
  return (
    <div className="pantalla con-nav">
      {children}
      <Navegacion conDolar={dolarVisible(estado.formaDePago, estado.ingreso)} />
    </div>
  );
}
