'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { calcularMes } from './derivados';
import { useApp } from './estado';
import { hoyColombia, mesDe } from './fechas';

/**
 * Lo que necesitan las pantallas con datos: estado + TRM + el mes calculado.
 * Pide sesión y un ingreso guardado (`requerido`); si falta algo, manda a donde se resuelve.
 */
export function useMes({ requerido = true }: { requerido?: boolean } = {}) {
  const { estado, listo, trm, actualizar, sesion, sesionLista, sincronizando, errorNube } = useApp();
  const router = useRouter();
  const ingreso = estado.ingreso;
  const cargando = !listo || !sesionLista || sincronizando;

  useEffect(() => {
    if (!requerido || cargando) return;
    if (!sesion) router.replace(ingreso ? '/registro' : '/');
    else if (!ingreso) router.replace('/ingreso');
  }, [requerido, cargando, sesion, ingreso, router]);

  const resumen = useMemo(
    () => (ingreso ? calcularMes(ingreso, estado.arlVoluntaria, trm?.hoy ?? null) : null),
    [ingreso, estado.arlVoluntaria, trm],
  );

  const hoy = listo ? hoyColombia() : '';
  return {
    listo: !cargando && (!requerido || (!!sesion && !!ingreso)),
    estado,
    ingreso,
    trm,
    resumen,
    hoy,
    mesHoy: hoy ? mesDe(hoy) : '',
    actualizar,
    errorNube,
    /** Ingreso en dólares pero sin TRM disponible: no se puede calcular. */
    sinTrm: !!ingreso && ingreso.moneda === 'USD' && !trm,
  };
}
