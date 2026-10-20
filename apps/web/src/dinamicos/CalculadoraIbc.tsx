'use client';

import { useState } from 'react';
import { parametrosDe } from '@/lib/calculos';
import { pesos } from '@/lib/formato';
import { miles, soloEnteros } from '../lib/entradas';
import { VistaP02b1 } from './VistaP02b1';

const P = parametrosDe(2026);

/** P02: mini calculadora del IBC (40% del ingreso, entre 1 y 25 salarios mínimos). */
export function CalculadoraIbc() {
  const [ingreso, setIngreso] = useState(5_000_000);
  const bruto = ingreso * P.porcentajeIbc;
  const min = P.smlmv * P.topeMinIbcSmlmv;
  const max = P.smlmv * P.topeMaxIbcSmlmv;
  const ibc = Math.min(Math.max(bruto, min), max);
  const nota = bruto < min ? 'El 40% queda por debajo del salario mínimo, así que cotizas sobre el mínimo.' : bruto > max ? 'Superas el tope: cotizas sobre 25 salarios mínimos.' : 'Es el 40% de lo que facturas.';
  return <VistaP02b1 ingresoTxt={miles(ingreso)} ibcTxt={pesos(ibc)} nota={nota} onIngreso={(e) => setIngreso(soloEnteros(e))} />;
}
