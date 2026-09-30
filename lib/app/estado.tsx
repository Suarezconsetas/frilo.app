'use client';

/**
 * Estado de la app en el navegador. Hasta la fase 3 (registro) vive en localStorage de este
 * dispositivo; con sesión, los datos pasan a las tablas de Supabase con RLS.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ESTADO_VACIO, type DatosTrm, type EstadoApp } from './tipos';

const CLAVE = 'frilo.estado.v1';

interface Contexto {
  estado: EstadoApp;
  /** false hasta leer localStorage: evita redirigir antes de saber si ya hay datos. */
  listo: boolean;
  actualizar: (cambios: Partial<EstadoApp> | ((e: EstadoApp) => Partial<EstadoApp>)) => void;
  reiniciar: () => void;
  trm: DatosTrm | null;
}

const Ctx = createContext<Contexto | null>(null);

function leer(): EstadoApp {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    return crudo ? { ...ESTADO_VACIO, ...(JSON.parse(crudo) as Partial<EstadoApp>) } : ESTADO_VACIO;
  } catch {
    return ESTADO_VACIO; // almacenamiento bloqueado o dato dañado: se empieza de cero
  }
}

export function ProveedorApp({ trm, children }: { trm: DatosTrm | null; children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoApp>(ESTADO_VACIO);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setEstado(leer());
    setListo(true);
  }, []);

  const guardar = useCallback((e: EstadoApp) => {
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(e));
    } catch {
      /* sin almacenamiento: la sesión sigue funcionando en memoria */
    }
  }, []);

  const actualizar = useCallback<Contexto['actualizar']>(
    (cambios) =>
      setEstado((previo) => {
        const siguiente = { ...previo, ...(typeof cambios === 'function' ? cambios(previo) : cambios) };
        guardar(siguiente);
        return siguiente;
      }),
    [guardar],
  );

  const reiniciar = useCallback(() => {
    setEstado(ESTADO_VACIO);
    guardar(ESTADO_VACIO);
  }, [guardar]);

  const valor = useMemo(() => ({ estado, listo, actualizar, reiniciar, trm }), [estado, listo, actualizar, reiniciar, trm]);
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useApp(): Contexto {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp debe usarse dentro de <ProveedorApp>');
  return c;
}
