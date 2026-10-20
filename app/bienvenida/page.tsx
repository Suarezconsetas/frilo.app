'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useApp } from '@/lib/app/estado';
import { hoyColombia } from '@/lib/app/fechas';
import { aplicarIntencion, leerIntencion, NOMBRE_COOKIE_INTENCION } from '@/lib/app/intencion';
import { guardarRecordatorioPlanilla } from '@/lib/app/nube';
import { Logo } from '../_ui/Logo';

const DOMINIO_COOKIES = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined;

function leerCookie(nombre: string): string | null {
  const par = document.cookie.split('; ').find((c) => c.startsWith(`${nombre}=`));
  return par ? decodeURIComponent(par.slice(nombre.length + 1)) : null;
}

function borrarCookie(nombre: string) {
  const dominio = DOMINIO_COOKIES ? `; domain=${DOMINIO_COOKIES}` : '';
  document.cookie = `${nombre}=; max-age=0; path=/${dominio}`;
}

/**
 * Llegada desde el registro del sitio de contenido: retoma lo que la persona hizo allí (activar el recordatorio de planilla,
 * crear una alerta del dólar o guardar su cálculo) y la lleva a la pantalla que corresponde.
 */
export default function Bienvenida() {
  const router = useRouter();
  const { listo, sesion, sesionLista, sincronizando, estado, actualizar, trm, db } = useApp();
  const hecho = useRef(false);

  useEffect(() => {
    if (!listo || !sesionLista || sincronizando || hecho.current) return;
    if (!sesion) {
      router.replace('/entrar');
      return;
    }
    hecho.current = true;
    const intencion = leerIntencion(leerCookie(NOMBRE_COOKIE_INTENCION));
    borrarCookie(NOMBRE_COOKIE_INTENCION);
    if (!intencion) {
      router.replace(estado.ingreso ? '/inicio' : '/ingreso');
      return;
    }
    const r = aplicarIntencion(intencion, estado, trm?.hoy ?? null, hoyColombia());
    (async () => {
      try {
        if (r.recordatorio) {
          await guardarRecordatorioPlanilla(db(), sesion.user.id, { digitos: r.recordatorio.digitos, activo: true, dias: estado.diasAnticipacion ?? 3 });
          actualizar({ digitosDocumento: r.recordatorio.digitos, recordatorioPlanilla: true });
        }
        if (Object.keys(r.cambios).length) actualizar(r.cambios);
      } catch (e) {
        console.error('Frilo: no se pudo retomar lo que dejaste en el sitio', e);
      }
      // Sin ingreso guardado no hay nada que calcular: primero se pide.
      router.replace(!estado.ingreso && !r.cambios.ingreso && r.destino === '/inicio' ? '/ingreso' : r.destino);
    })();
  }, [listo, sesion, sesionLista, sincronizando, estado, actualizar, trm, db, router]);

  return (
    <main className="pantalla">
      <div className="contenido formulario" style={{ paddingTop: 40 }}>
        <Logo alto={40} />
        <p className="subtitulo" role="status">
          Preparando tu cuenta…
        </p>
      </div>
    </main>
  );
}
