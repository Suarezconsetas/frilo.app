'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { ahorroMensual, parametrosDe, redondearMultiplo } from '@/lib/calculos';
import { pesos } from '@/lib/formato';
import { miles, soloEnteros } from '../lib/entradas';
import { AjusteIngreso } from './AjusteIngreso';
import { VistaP12b1 } from './VistaP12b1';
import { VistaP12b2 } from './VistaP12b2';

const P = parametrosDe(2026);
const Ctx = createContext<{ ingreso: number; setIngreso: (n: number) => void } | null>(null);

/** P12: el campo de ingreso y el resultado están en lugares distintos de la página; comparten el estado. */
export function ProveedorP12({ children }: { children: ReactNode }) {
  const [ingreso, setIngreso] = useState(8_000_000);
  return <Ctx.Provider value={{ ingreso, setIngreso }}>{children}</Ctx.Provider>;
}

const usar = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Falta <ProveedorP12>');
  return c;
};

export function EntradaP12() {
  const { ingreso, setIngreso } = usar();
  return <VistaP12b1 ajuste={<AjusteIngreso valor={ingreso} onCambio={setIngreso} />} ingresoTxt={miles(ingreso)} onIngreso={(e) => setIngreso(soloEnteros(e))} />;
}

export function ResultadoP12() {
  const { ingreso } = usar();
  const mes = redondearMultiplo(ahorroMensual(ingreso).cesantias, P.redondeoPila);
  return <VistaP12b2 mesTxt={pesos(mes)} anioTxt={`${pesos(mes * 12)} + intereses`} />;
}
