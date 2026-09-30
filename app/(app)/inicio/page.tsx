'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AVISOS } from '@/lib/calculos';
import { dolarVisible, escenarios, reparto } from '@/lib/app/derivados';
import { useMes } from '@/lib/app/usarMes';
import { capitalizar, nombreMes, pct, pesos, pesosConDecimales, usd } from '@/lib/formato';
import { Icono } from '../../_ui/Icono';
import { Logo } from '../../_ui/Logo';
import { Reparto } from '../../_ui/Reparto';
import { Selector } from '../../_ui/controles';

type Vista = 'con' | 'sin';

export default function Inicio() {
  const { listo, ingreso, resumen, sinTrm, trm, mesHoy, estado } = useMes();
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
        <p className="suave" style={{ margin: '4px 0 20px', fontSize: 15 }}>
          {recibiste}
        </p>
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
          {conAhorro ? (
            <>
              <h2 className="titulo-tarjeta" style={{ marginBottom: 14 }}>
                Así se reparte tu ingreso
              </h2>
              <Reparto segmentos={reparto(resumen, true)} />
            </>
          ) : (
            <>
              <h2 className="titulo-tarjeta" style={{ marginBottom: 12 }}>
                Comparación de los dos escenarios
              </h2>
              <div className="comparacion">
                <div>
                  <p>Con ahorro</p>
                  <p>Disponible al mes</p>
                  <strong>{pesos(e.conAhorro.disponible)}</strong>
                  <p>Guardas al mes</p>
                  <strong>{pesos(e.conAhorro.guardasAlMes)}</strong>
                  <p>En un año juntas</p>
                  <strong>{pesos(e.conAhorro.enUnAnio)}</strong>
                </div>
                <div>
                  <p>Sin ahorro</p>
                  <p>Disponible al mes</p>
                  <strong>{pesos(e.sinAhorro.disponible)}</strong>
                  <p>Guardas al mes</p>
                  <strong>{pesos(0)}</strong>
                  <p>En un año juntas</p>
                  <strong>{pesos(0)}</strong>
                </div>
              </div>
              <p style={{ marginTop: 14, fontSize: 14, lineHeight: '21px' }}>
                Tienes {pesos(e.diferenciaMensual)} más al mes para gastar, pero dejas de juntar {pesos(e.conAhorro.enUnAnio)} en el año.
              </p>
              <div className="tarjeta-oliva sobre-oliva" style={{ marginTop: 14 }}>
                <p style={{ fontSize: 14, lineHeight: '21px' }}>
                  Guardar tu prima y tus cesantías en una cuenta con rentabilidad te ayuda a cubrir un imprevisto y puede ser tu primer paso para empezar a invertir.
                </p>
                <Link href="/ahorro" className="enlace" style={{ marginTop: 4, fontSize: 14, color: 'var(--manzana)' }}>
                  Ver cuentas con rentabilidad
                </Link>
              </div>
            </>
          )}
        </section>

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
        <Link href="/ingreso" className="enlace" style={{ margin: '0 4px' }}>
          Editar mi ingreso
        </Link>
      </div>
    </main>
  );
}
