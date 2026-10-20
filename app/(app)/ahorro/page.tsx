'use client';

import { useEffect, useState } from 'react';
import { AVISOS, CUENTAS_MVP, CUENTAS_USD, compararCuentas } from '@/lib/calculos';
import { bolsas, calcularMes, dolarVisible, montoComparador, resumenAhorro, tasaProyeccion, type Bolsa } from '@/lib/app/derivados';
import { useApp } from '@/lib/app/estado';
import { confirmarAhorro, leerAhorrosConfirmados, leerPagosGuardados, quitarAhorroConfirmado, type AhorroConfirmado } from '@/lib/app/nube';
import { AHORRO_EXPLICACION_LARGA } from '@/lib/app/textos';
import { useMes } from '@/lib/app/usarMes';
import { capitalizar, fechaCorta, nombreMes, pct, pesos, usd } from '@/lib/formato';
import { Guardado } from '../../_ui/Guardado';
import { Logo } from '../../_ui/Logo';

function TarjetaBolsillo({ titulo, b, pie, accion }: { titulo: string; b: Bolsa; pie: React.ReactNode; accion?: React.ReactNode }) {
  return (
    <section className="tarjeta">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 className="titulo-tarjeta">{titulo}</h2>
        <span className="ayuda">{b.periodo}</span>
      </div>
      <p className="cifra-l" style={{ margin: '10px 0 12px' }}>
        {pesos(b.saldoHoy)}
      </p>
      <div role="img" aria-label={`${Math.round(b.avance * 100)}% del periodo`} className="carril">
        <div style={{ width: `${b.avance * 100}%` }} />
      </div>
      <p className="texto-suave" style={{ marginTop: 8, fontSize: 14 }}>
        {pie}
      </p>
      {accion}
    </section>
  );
}

export default function Ahorro() {
  const { listo, ingreso, resumen, estado, mesHoy, actualizar, trm } = useMes();
  const { sesion, db } = useApp();
  const userId = sesion?.user.id ?? null;
  const [confirmados, setConfirmados] = useState<AhorroConfirmado[]>([]);
  const [errorAhorro, setErrorAhorro] = useState<string>();
  const [pagos, setPagos] = useState<Awaited<ReturnType<typeof leerPagosGuardados>>>([]);

  useEffect(() => {
    if (!userId) return;
    leerAhorrosConfirmados(db(), userId)
      .then(setConfirmados)
      .catch(() => setErrorAhorro('No pudimos traer lo que habías confirmado. Recarga la pantalla para intentarlo de nuevo.'));
  }, [userId, db]);

  // Los pagos de cada mes guardado; se vuelven a leer cuando la persona guarda otro mes o cambia su ingreso
  // (el guardado en la nube espera unos instantes).
  useEffect(() => {
    if (!userId) return;
    const t = setTimeout(() => {
      leerPagosGuardados(db(), userId)
        .then(setPagos)
        .catch(() => setPagos([]));
    }, 1500);
    return () => clearTimeout(t);
  }, [userId, db, estado.mesIngreso, estado.ingreso]);

  if (!listo || !ingreso || !resumen) return null;

  const mesInicio = estado.mesInicio ?? mesHoy;
  const { prima, cesantias } = bolsas(resumen.ingresoBrutoMes, mesHoy, mesInicio, estado.cobros);
  const mensual = resumen.ahorroPrima + resumen.ahorroCesantias;
  const { monto, dias, meses } = montoComparador(resumen.ingresoBrutoMes);
  const cuentas = compararCuentas(monto, dias, CUENTAS_MVP);
  // Cuentas en dólares: solo para quien cobra en dólares y solo las verificadas. El ejemplo usa lo que apartaría en 6 meses, en dólares.
  const mostrarUsd = dolarVisible(estado.formaDePago, ingreso);
  const montoUsd = Math.max(100, Math.round(monto / (trm?.hoy ?? 4000)));
  const cuentasUsd = mostrarUsd ? compararCuentas(montoUsd, dias, CUENTAS_USD.filter((c) => c.verificada)) : [];
  const mesFinal = (b: Bolsa) => nombreMes(Number(b.mesFinal.slice(5, 7)));

  async function confirmar(mes: string, montoAhorro: number) {
    setErrorAhorro(undefined);
    try {
      await confirmarAhorro(db(), userId!, mes, montoAhorro);
      setConfirmados((prev) => [...prev.filter((c) => c.mes !== mes), { mes, monto: montoAhorro }]);
    } catch {
      setErrorAhorro('No pudimos guardar tu confirmación. Inténtalo de nuevo.');
    }
  }
  async function quitarConfirmacion(mes: string) {
    setErrorAhorro(undefined);
    try {
      await quitarAhorroConfirmado(db(), userId!, mes);
      setConfirmados((prev) => prev.filter((c) => c.mes !== mes));
    } catch {
      setErrorAhorro('No pudimos quitar la confirmación. Inténtalo de nuevo.');
    }
  }
  // Ingreso bruto en pesos de cada mes guardado (los dólares se convierten con la tasa recibida de ese mes o la TRM de hoy).
  const ingresosPorMes: Record<string, number> = {};
  for (const p of pagos) {
    const bruto = calcularMes({ ...ingreso, monto: p.monto, tasaRecibida: p.tasaRecibida, retencion: p.retencion }, estado.arlVoluntaria, trm?.hoy ?? null)?.ingresoBrutoMes;
    if (bruto !== undefined) ingresosPorMes[p.mes] = bruto;
  }
  const guardado = resumenAhorro(resumen.ingresoBrutoMes, mesInicio, mesHoy, confirmados, estado.cobros, ingresosPorMes);

  function cobrarPrima() {
    actualizar((e) => ({ cobros: [...e.cobros, { mes: mesHoy, bolsillo: 'prima' }] }));
  }
  function deshacerCobro() {
    actualizar((e) => ({ cobros: e.cobros.filter((c) => !(c.bolsillo === 'prima' && c.mes === mesHoy)) }));
  }

  return (
    <main>
      <header className="encabezado">
        <Logo alto={28} className="logo" />
        <h1 className="titulo-pantalla">Tu prima y tus cesantías</h1>
        <p className="subtitulo">
          Aparta {pesos(mensual)} al mes: el 16,67% de tu ingreso
        </p>
      </header>

      <div className="contenido">
        <TarjetaBolsillo
          titulo="Prima"
          b={prima}
          pie={
            prima.cobradoEsteMes ? (
              <>Cobraste tu prima en {nombreMes(Number(mesHoy.slice(5, 7)))}. Tu bolsillo empieza de nuevo el mes que viene.</>
            ) : (
              <>
                En {mesFinal(prima)} tendrías <strong style={{ color: 'var(--tinta)', fontWeight: 600 }}>{pesos(prima.saldoFinal)}</strong>
              </>
            )
          }
          accion={
            prima.cobradoEsteMes ? (
              <button type="button" className="btn btn-secundario" style={{ marginTop: 14 }} onClick={deshacerCobro}>
                Deshacer
              </button>
            ) : (
              <button type="button" className="btn btn-secundario" style={{ marginTop: 14 }} onClick={cobrarPrima}>
                Ya cobré mi prima
              </button>
            )
          }
        />

        <TarjetaBolsillo
          titulo="Cesantías"
          b={cesantias}
          pie={
            <>
              Disponibles en {cesantias.disponibleEn}: <strong style={{ color: 'var(--tinta)', fontWeight: 600 }}>{pesos(cesantias.saldoFinal)}</strong>
            </>
          }
        />

        <Guardado resumen={guardado} mesHoy={mesHoy} onConfirmar={confirmar} onQuitar={quitarConfirmacion} error={errorAhorro} />

        <section className="tarjeta">
          <h2 className="titulo-tarjeta">¿Dónde guardarlo?</h2>
          <p className="texto-suave" style={{ margin: '6px 0 14px', fontSize: 14, lineHeight: '21px' }}>
            Cuentas de ahorro que puedes retirar en cualquier momento, ordenadas por tasa. Rendimiento de {pesos(monto)} durante {meses} meses.
          </p>
          {cuentas.map(({ cuenta: c, rendimientoBase }) => (
            <div key={c.id} className="cuenta">
              <div className="cabeza">
                <div>
                  <p className="entidad">{c.entidad}</p>
                  <p className="ayuda" style={{ marginTop: 2 }}>
                    {c.producto.replace('Bolsillos RappiCuenta', 'Bolsillos')} · consultada el {fechaCorta(c.fechaConsulta)}
                  </p>
                  {c.tasaCondicionadaEA !== undefined && (
                    <span className="etiqueta-tinte">
                      {pct(c.tasaCondicionadaEA, 0)} E.A. · {c.condicion}
                    </span>
                  )}
                  {c.patrocinado && <span className="etiqueta-tinte">{AVISOS.patrocinado}</span>}
                </div>
                <div className="tasa">
                  <strong>{pct(c.tasaBaseEA, 2)}</strong>
                  <small>E.A.</small>
                </div>
              </div>
              <div className="pie">
                <span>
                  Rendirías <strong style={{ fontWeight: 700 }}>+{pesos(rendimientoBase)}</strong>
                </span>
                <a href={c.url} target="_blank" rel={c.patrocinado ? 'sponsored noopener noreferrer' : 'noopener noreferrer'} className="enlace">
                  Ir a {c.entidad}
                </a>
              </div>
            </div>
          ))}
          <p className="legal" style={{ marginTop: 14 }}>
            {AVISOS.comparador} {AVISOS.rendimientos}
          </p>
        </section>

        {cuentasUsd.length > 0 && (
          <section className="tarjeta" aria-labelledby="en-dolares">
            <h2 id="en-dolares" className="titulo-tarjeta">
              ¿Prefieres guardar en dólares?
            </h2>
            <p className="texto-suave" style={{ margin: '6px 0 14px', fontSize: 14, lineHeight: '21px' }}>
              Cuentas para guardar tus dólares sin convertirlos a pesos. Rendimiento de {usd(montoUsd)} durante {meses} meses, en dólares.
            </p>
            {cuentasUsd.map(({ cuenta: c, rendimientoBase }) => (
              <div key={c.id} className="cuenta">
                <div className="cabeza">
                  <div>
                    <p className="entidad">{c.entidad}</p>
                    <p className="ayuda" style={{ marginTop: 2 }}>
                      {c.producto} · consultada el {fechaCorta(c.fechaConsulta)}
                    </p>
                    {c.tasaCondicionadaEA !== undefined && (
                      <span className="etiqueta-tinte">
                        {pct(c.tasaCondicionadaEA, 1)} E.A. · {c.condicion}
                      </span>
                    )}
                    {c.patrocinado && <span className="etiqueta-tinte">{AVISOS.patrocinado}</span>}
                  </div>
                  <div className="tasa">
                    <strong>{pct(c.tasaBaseEA, 2)}</strong>
                    <small>E.A. en USD</small>
                  </div>
                </div>
                {c.aviso && (
                  <p className="ayuda" style={{ marginTop: 8 }}>
                    {c.aviso}
                  </p>
                )}
                <div className="pie">
                  <span>
                    Rendirías <strong style={{ fontWeight: 700 }}>+{usd(Math.round(rendimientoBase * 100) / 100)}</strong>
                  </span>
                  <a href={c.url} target="_blank" rel={c.patrocinado ? 'sponsored noopener noreferrer' : 'noopener noreferrer'} className="enlace">
                    Ir a {c.entidad}
                  </a>
                </div>
              </div>
            ))}
            <p className="legal" style={{ marginTop: 14 }}>
              Las tasas son las que informa cada entidad, antes de impuestos y pueden cambiar. Guardar en dólares tiene riesgo cambiario: si el dólar baja, tus ahorros valen menos pesos. Información de referencia, no asesoría financiera.
            </p>
          </section>
        )}

        <section id="como-calculamos" className="tarjeta" style={{ scrollMarginTop: 16 }}>
          <h2 className="titulo-tarjeta">¿Cómo calculamos tu ahorro?</h2>
          <p className="texto-suave" style={{ margin: '8px 0 12px', fontSize: 14, lineHeight: '21px' }}>
            {AHORRO_EXPLICACION_LARGA}
          </p>
          <div className="fila">
            <div className="nombre">Tu ingreso del mes</div>
            <div className="valor">{pesos(resumen.ingresoBrutoMes)}</div>
          </div>
          <div className="fila">
            <div className="nombre">Prima (1/12)</div>
            <div className="valor">{pesos(resumen.ahorroPrima)}</div>
          </div>
          <div className="fila">
            <div className="nombre">Cesantías (1/12)</div>
            <div className="valor">{pesos(resumen.ahorroCesantias)}</div>
          </div>
          <div className="fila">
            <div className="nombre">Total que apartas al mes</div>
            <div className="valor">{pesos(mensual)}</div>
          </div>
        </section>

        <p className="legal" style={{ margin: '0 4px' }}>
          Proyección con la tasa de la cuenta más alta ({pct(tasaProyeccion(), 2)} E.A.), suponiendo que recibes lo mismo cada mes desde{' '}
          {nombreMes(Number(mesInicio.slice(5, 7)))} de {mesInicio.slice(0, 4)}. No incluimos meses anteriores a tu registro.
        </p>
      </div>
    </main>
  );
}
