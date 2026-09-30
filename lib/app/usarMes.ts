'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { calcularMes } from './derivados';
import { useApp } from './estado';
import { hoyColombia, mesDe } from './fechas';

/**
 * Lo que necesitan las pantallas con datos: estado + TRM + el mes calculado.
 * Si no hay ingreso guardado manda a la bienvenida (`requerido`).
 */
export function useMes({ requerido = true }: { requerido?: boolean } = {}) {
  const { estado, listo, trm, actualizar } = useApp();
  const router = useRouter();
  const ingreso = estado.ingreso;

  useEffect(() => {
    if (requerido && listo && !ingreso) router.replace('/');
  }, [requerido, listo, ingreso, router]);

  const resumen = useMemo(
    () => (ingreso ? calcularMes(ingreso, estado.arlVoluntaria, trm?.hoy ?? null) : null),
    [ingreso, estado.arlVoluntaria, trm],
  );

  const hoy = listo ? hoyColombia() : '';
  return {
    listo: listo && (!requerido || !!ingreso),
    estado,
    ingreso,
    trm,
    resumen,
    hoy,
    mesHoy: hoy ? mesDe(hoy) : '',
    actualizar,
    /** Ingreso en dólares pero sin TRM disponible: no se puede calcular. */
    sinTrm: !!ingreso && ingreso.moneda === 'USD' && !trm,
  };
}
