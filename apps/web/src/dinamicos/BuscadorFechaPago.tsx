'use client';

import { useEffect, useState } from 'react';
import { diaHabilDe, fechaLimitePago } from '@/lib/app/planilla';
import { fijarIntencion } from '../lib/intencion';
import { VistaP05b1 } from './VistaP05b1';
import { VistaP05b2 } from './VistaP05b2';

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const ANIO = 2026;
const pad = (n: number) => String(n).padStart(2, '0');

/** P05: fecha límite de pago de la planilla según los dos últimos dígitos (Decreto 1990 de 2016). Festivos de Colombia calculados. */
export function BuscadorFechaPago() {
  const [digitos, setDigitos] = useState('89');
  const [mes, setMes] = useState('10');

  const valido = /^\d{2}$/.test(digitos);
  const mi = parseInt(mes, 10);
  const dia = valido ? diaHabilDe(digitos) : null;
  const fecha = valido ? fechaLimitePago(digitos, ANIO, mi + 1) : null;
  const f = fecha ? new Date(`${fecha}T00:00:00Z`) : null;

  useEffect(() => {
    fijarIntencion(valido ? { tipo: 'recordatorio', digitos } : undefined);
  }, [digitos, valido]);

  return (
    <VistaP05b1
      diaTxt={dia ? `día hábil ${dia}` : 'Escribe dos dígitos'}
      digitos={digitos}
      fechaTxt={f ? `En ${MESES[mi]} de ${ANIO}: ${DIAS[f.getUTCDay()]} ${f.getUTCDate()} de ${MESES[mi]}` : 'Escribe tus dos dígitos para ver la fecha'}
      mes={mes}
      meses={MESES.map((n, i) => ({ v: String(i), t: `${n.charAt(0).toUpperCase()}${n.slice(1)} de ${ANIO}` }))}
      onDig={(e) => setDigitos(String(e.target.value).replace(/\D/g, '').slice(0, 2))}
      onMes={(e) => setMes(e.target.value)}
    />
  );
}

const RANGOS: [number, number, number][] = [[0, 7, 2], [8, 14, 3], [15, 21, 4], [22, 28, 5], [29, 35, 6], [36, 42, 7], [43, 49, 8], [50, 56, 9], [57, 63, 10], [64, 69, 11], [70, 75, 12], [76, 81, 13], [82, 87, 14], [88, 93, 15], [94, 99, 16]];

/** Tabla del Decreto 1990 de 2016 (la misma que usa `diaHabilDe`). */
export function TablaDiaHabil() {
  return <VistaP05b2 tabla={RANGOS.map(([a, b, n]) => ({ rango: `${pad(a)} a ${pad(b)}`, dia: `Día hábil ${n}` }))} />;
}
