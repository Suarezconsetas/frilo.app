'use client';

import { AVISOS, CUENTAS_MVP, compararCuentas } from '@/lib/calculos';
import { bolsas, montoComparador, tasaProyeccion, type Bolsa } from '@/lib/app/derivados';
import { useMes } from '@/lib/app/usarMes';
import { capitalizar, fechaCorta, nombreMes, pct, pesos } from '@/lib/formato';
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
  const { listo, ingreso, resumen, estado, mesHoy, actualizar } = useMes();
  if (!listo || !ingreso || !resumen) return null;

  const mesInicio = estado.mesInicio ?? mesHoy;
  const { prima, cesantias } = bolsas(resumen.ingresoBrutoMes, mesHoy, mesInicio, estado.cobros);
  const mensual = resumen.ahorroPrima + resumen.ahorroCesantias;
  const { monto, dias, meses } = montoComparador(resumen.ingresoBrutoMes);
  const cuentas = compararCuentas(monto, dias, CUENTAS_MVP);
  const mesFinal = (b: Bolsa) => nombreMes(Number(b.mesFinal.slice(5, 7)));

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

        <p className="legal" style={{ margin: '0 4px' }}>
          Proyección con la tasa de la cuenta más alta ({pct(tasaProyeccion(), 2)} E.A.), suponiendo que recibes lo mismo cada mes desde{' '}
          {nombreMes(Number(mesInicio.slice(5, 7)))} de {mesInicio.slice(0, 4)}. No incluimos meses anteriores a tu registro.
        </p>

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
      </div>
    </main>
  );
}
