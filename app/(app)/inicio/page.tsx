'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AVISOS } from '@/lib/calculos';
import { contextoDolar, dolarVisible, escenarios, proyeccionAnual, reparto } from '@/lib/app/derivados';
import { useApp } from '@/lib/app/estado';
import { useMes } from '@/lib/app/usarMes';
import { capitalizar, nombreMes, pct, pesos, pesosConDecimales, usd } from '@/lib/formato';
import { Comparacion } from '../../_ui/Comparacion';
import { Icono } from '../../_ui/Icono';
import { Logo } from '../../_ui/Logo';
import { Reparto } from '../../_ui/Reparto';
import { Selector } from '../../_ui/controles';

type Vista = 'con' | 'sin';

export default function Inicio() {
  const { listo, ingreso, resumen, sinTrm, trm, mesHoy, estado, errorNube } = useMes();
  const { cerrarSesion, sesion } = useApp();
  const router = useRouter();
  const [vista, setVista] = useState<Vista>('con');

  if (!listo || !ingreso) return null;
  const mes = capitalizar(nombreMes(Number(mesHoy.slice(5, 7))));
  const conDolar = dolarVisible(estado.formaDePago, ingreso);

  if (!resumen) {
    return (
      <main className="contenido" style={{ paddingTop: 32 }}>
        <p className="aviso-error" role="alert">
          {sinTrm ? 'No pudimos traer la TRM de hoy, y la necesitamos para convertir tus dólares. Vuelve a intentar en unos minutos.' : 'No pudimos calcular tu mes.'}
        </p>
      </main>
    );
  }

  const e = escenarios(resumen);
  const conAhorro = vista === 'con';
  const recibiste = ingreso.moneda === 'USD' ? `Recibiste ${usd(ingreso.monto)} = ${pesos(resumen.recibidoMes)}` : `Recibiste ${pesos(resumen.recibidoMes)}`;
  const mensual = trm?.variaciones.find((v) => v.referencia === 'mes');
  const dolar = contextoDolar(ingreso, trm);

  return (
    <main>
      <header className="cabecera-oliva sobre-oliva">
        <div className="fila-logo">
          <Logo sobreOliva alto={32} />
          {conDolar && (
            <Link href="/dolar" className="btn btn-icono" aria-label="Alertas del dólar">
              <Icono nombre="alerta" tamano={20} />
            </Link>
          )}
        </div>
        <h1 className="titulo-pantalla" style={{ marginTop: 24 }}>
          {mes}
        </h1>
        <p className="suave" style={{ margin: dolar ? '4px 0 0' : '4px 0 20px', fontSize: 15 }}>
          {recibiste}
        </p>
        {dolar && (
          <p className="suave" style={{ margin: '4px 0 20px', fontSize: 13, lineHeight: '19px' }}>
            {dolar.propia ? `A tu tasa de ${pesosConDecimales(dolar.tasa)} (la TRM de hoy es ${pesosConDecimales(dolar.trmHoy)})` : `A la TRM de hoy: ${pesosConDecimales(dolar.tasa)}`}
            {dolar.variacionMes !== null &&
              (dolar.variacionMes === 0
                ? ' · igual que hace un mes'
                : ` · ${pct(Math.abs(dolar.variacionMes), 1)} ${dolar.variacionMes > 0 ? 'más alta' : 'más baja'} que hace un mes`)}
            {'. '}
            <Link href="/dolar" style={{ color: 'var(--manzana)', fontWeight: 600 }}>
              Ver tendencia
            </Link>
          </p>
        )}
        <Selector
          sobreOliva
          nombre="Escenario de cálculo"
          valor={vista}
          onCambio={setVista}
          opciones={[
            { valor: 'con', etiqueta: 'Con ahorro' },
            { valor: 'sin', etiqueta: 'Sin ahorro' },
          ]}
        />
        <p className="suave" style={{ fontSize: 14 }}>
          Te quedan para gastos y metas
        </p>
        <p className="cifra-xl">{pesos(conAhorro ? e.conAhorro.disponible : e.sinAhorro.disponible)}</p>
      </header>

      <div className="contenido" style={{ paddingTop: 16 }}>
        <section className="tarjeta">
          <h2 className="titulo-tarjeta" style={{ marginBottom: 14 }}>
            {conAhorro ? 'Así se reparte tu ingreso' : 'Así se reparte tu ingreso sin ahorro'}
          </h2>
          <Reparto segmentos={reparto(resumen, conAhorro)} />
        </section>

        <Comparacion e={e} proy={proyeccionAnual(resumen.ingresoBrutoMes)} />

        {conDolar && trm && (
          <section className="tarjeta">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="texto-suave" style={{ fontSize: 14 }}>
                  Dólar hoy (TRM)
                </p>
                <p style={{ marginTop: 4, fontSize: 22, fontWeight: 700 }}>{pesosConDecimales(trm.hoy)}</p>
              </div>
              <Link href="/dolar" className="enlace">
                Ver tendencia
              </Link>
            </div>
            {mensual && (
              <p className="texto-suave" style={{ marginTop: 10, fontSize: 14 }}>
                {mensual.variacionPct === 0
                  ? 'Igual que el mes pasado'
                  : `${mensual.variacionPct > 0 ? 'Subió' : 'Bajó'} ${pct(Math.abs(mensual.variacionPct), 2)} frente al mes pasado`}
              </p>
            )}
          </section>
        )}

        <p className="legal" style={{ margin: '4px 4px 0' }}>
          {AVISOS.alcanceCalculos}
        </p>
        {errorNube && (
          <p className="aviso-error" role="status">
            {errorNube}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 4px' }}>
          <Link href="/ingreso" className="enlace">
            Editar mi ingreso
          </Link>
          <button
            type="button"
            className="enlace"
            style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0 }}
            onClick={async () => {
              await cerrarSesion();
              router.replace('/');
            }}
          >
            Cerrar sesión
          </button>
        </div>
        <p className="ayuda" style={{ margin: '0 4px' }}>
          <Link href="/politica-de-datos">Política de datos</Link> · <Link href="/terminos">Términos de uso</Link>
        </p>
        {sesion?.user.email && (
          <p className="ayuda" style={{ margin: '0 4px' }}>
            Sesión iniciada con {sesion.user.email}
          </p>
        )}
      </div>
    </main>
  );
}
