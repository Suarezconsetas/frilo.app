'use client';

/**
 * Estado de la app. Sin sesión vive en localStorage de este dispositivo; con sesión se sincroniza
 * con las tablas de Supabase (RLS: cada usuario solo ve lo suyo).
 */
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { clienteNavegador } from '@/lib/supabase/cliente';
import { calcularMes } from './derivados';
import { cargarAlertas, cargarDeNube, guardarEnNube, registrarAutorizaciones } from './nube';
import { ESTADO_VACIO, type DatosTrm, type EstadoApp } from './tipos';

const CLAVE = 'frilo.estado.v1';

interface Contexto {
  estado: EstadoApp;
  /** false hasta leer localStorage: evita redirigir antes de saber si ya hay datos. */
  listo: boolean;
  actualizar: (cambios: Partial<EstadoApp> | ((e: EstadoApp) => Partial<EstadoApp>)) => void;
  reiniciar: () => void;
  trm: DatosTrm | null;
  sesion: Session | null;
  /** false hasta saber si hay sesión guardada. */
  sesionLista: boolean;
  /** Hay sesión pero aún no se trajeron/subieron sus datos. */
  sincronizando: boolean;
  errorNube: string | null;
  db: () => SupabaseClient;
  /** Vuelve a leer las alertas de la cuenta (la tarea diaria puede haberlas cumplido). */
  refrescarAlertas: () => Promise<void>;
  cerrarSesion: () => Promise<void>;
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

/** Lo que va a la nube: sin ids ni campos que solo sirven al navegador. */
const instantanea = (e: EstadoApp) => ({
  base: JSON.stringify({ f: e.formaDePago, i: e.ingreso, m: e.mesInicio, a: e.arlVoluntaria }),
  cobros: JSON.stringify(e.cobros),
  alertas: JSON.stringify(e.alertas),
});
type Instantanea = ReturnType<typeof instantanea>;
const SIN_FOTO: Instantanea = { base: '', cobros: '', alertas: '' };

export function ProveedorApp({ trm, children }: { trm: DatosTrm | null; children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoApp>(ESTADO_VACIO);
  const [listo, setListo] = useState(false);
  const [sesion, setSesion] = useState<Session | null>(null);
  const [sesionLista, setSesionLista] = useState(false);
  const [enlazadoId, setEnlazadoId] = useState<string | null>(null);
  const [errorNube, setErrorNube] = useState<string | null>(null);
  const estadoRef = useRef(estado);
  estadoRef.current = estado;
  const ultimoGuardado = useRef<Instantanea>(SIN_FOTO);

  const db = useCallback(() => clienteNavegador(), []);

  useEffect(() => {
    setEstado(leer());
    setListo(true);
  }, []);

  // Sesión: la guardada y los cambios (entrar, salir, renovar).
  useEffect(() => {
    const cliente = clienteNavegador();
    cliente.auth.getSession().then(({ data }) => {
      setSesion(data.session);
      setSesionLista(true);
    });
    const { data } = cliente.auth.onAuthStateChange((_evento, s) => setSesion(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const guardarLocal = useCallback((e: EstadoApp) => {
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
        guardarLocal(siguiente);
        return siguiente;
      }),
    [guardarLocal],
  );

  const reiniciar = useCallback(() => {
    setEstado(ESTADO_VACIO);
    guardarLocal(ESTADO_VACIO);
  }, [guardarLocal]);

  const userId = sesion?.user.id ?? null;
  const sincronizando = !!userId && enlazadoId !== userId;

  // Al iniciar sesión: autorizaciones, y luego los datos. Si la cuenta ya tenía datos, esos mandan
  // (entrar a una cuenta existente no pisa lo guardado); si es nueva, se sube lo que escribió.
  useEffect(() => {
    if (!listo || !userId || enlazadoId === userId) return;
    let cancelado = false;
    (async () => {
      const cliente = clienteNavegador();
      const local = estadoRef.current;
      try {
        const [, remoto] = await Promise.all([
          registrarAutorizaciones(cliente, userId, local.autorizacionPendiente?.marketing ?? false, navigator.userAgent),
          cargarDeNube(cliente, userId),
        ]);
        if (cancelado) return;
        if (remoto.ingreso) {
          const fusionado: EstadoApp = { ...local, ...remoto, autorizacionPendiente: undefined, correoPendiente: undefined };
          ultimoGuardado.current = instantanea(fusionado);
          setEstado(fusionado);
          guardarLocal(fusionado);
        } else {
          const base: EstadoApp = { ...local, autorizacionPendiente: undefined, correoPendiente: undefined };
          const bruto = base.ingreso ? (calcularMes(base.ingreso, base.arlVoluntaria, trm?.hoy ?? null)?.ingresoBrutoMes ?? null) : null;
          const fuenteId = await guardarEnNube(cliente, userId, base, bruto);
          const fusionado = { ...base, fuenteId };
          ultimoGuardado.current = instantanea(fusionado);
          setEstado(fusionado);
          guardarLocal(fusionado);
        }
        setErrorNube(null);
      } catch (e) {
        console.error('Frilo: no se pudo sincronizar', e);
        if (!cancelado) setErrorNube('No pudimos sincronizar tus datos. Los seguimos guardando en este dispositivo.');
      } finally {
        if (!cancelado) setEnlazadoId(userId);
      }
    })();
    return () => {
      cancelado = true;
    };
    // trm solo se usa para el rango del perfil
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo, userId, enlazadoId]);

  // Con sesión, cada cambio se guarda en la nube (con una pausa para no escribir en cada tecla).
  useEffect(() => {
    if (!userId || enlazadoId !== userId) return;
    const foto = instantanea(estado);
    const previa = ultimoGuardado.current;
    const partes = { cobros: foto.cobros !== previa.cobros, alertas: foto.alertas !== previa.alertas };
    if (foto.base === previa.base && !partes.cobros && !partes.alertas) return;
    const t = setTimeout(async () => {
      try {
        const bruto = estado.ingreso ? (calcularMes(estado.ingreso, estado.arlVoluntaria, trm?.hoy ?? null)?.ingresoBrutoMes ?? null) : null;
        const fuenteId = await guardarEnNube(clienteNavegador(), userId, estado, bruto, partes);
        ultimoGuardado.current = foto;
        setErrorNube(null);
        if (fuenteId && fuenteId !== estado.fuenteId) actualizar({ fuenteId });
      } catch (e) {
        console.error('Frilo: no se pudo guardar', e);
        setErrorNube('No pudimos guardar tus últimos cambios. Los reintentamos con el próximo.');
      }
    }, 700);
    return () => clearTimeout(t);
  }, [estado, userId, enlazadoId, trm, actualizar]);

  const refrescarAlertas = useCallback(async () => {
    if (!userId) return;
    try {
      const alertas = await cargarAlertas(clienteNavegador(), userId);
      // Se marca como ya guardado: es lo que dice la cuenta, no hay nada que subir.
      ultimoGuardado.current = { ...ultimoGuardado.current, alertas: JSON.stringify(alertas) };
      setEstado((previo) => {
        const siguiente = { ...previo, alertas };
        guardarLocal(siguiente);
        return siguiente;
      });
    } catch (e) {
      console.error('Frilo: no se pudieron refrescar las alertas', e);
    }
  }, [userId, guardarLocal]);

  const cerrarSesion = useCallback(async () => {
    await clienteNavegador().auth.signOut();
    setEnlazadoId(null);
    ultimoGuardado.current = SIN_FOTO;
    reiniciar(); // en un equipo compartido no debe quedar nada de la persona anterior
  }, [reiniciar]);

  const valor = useMemo(
    () => ({ estado, listo, actualizar, reiniciar, trm, sesion, sesionLista, sincronizando, errorNube, db, refrescarAlertas, cerrarSesion }),
    [estado, listo, actualizar, reiniciar, trm, sesion, sesionLista, sincronizando, errorNube, db, refrescarAlertas, cerrarSesion],
  );
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useApp(): Contexto {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp debe usarse dentro de <ProveedorApp>');
  return c;
}
