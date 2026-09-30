'use client';

import { parametrosDe } from '@/lib/calculos';
import { ANIO_PARAMETROS } from '@/lib/app/derivados';
import { useMes } from '@/lib/app/usarMes';
import { capitalizar, nombreMes, pct, pesos } from '@/lib/formato';
import { Icono } from '../../_ui/Icono';
import { Logo } from '../../_ui/Logo';
import { Interruptor } from '../../_ui/controles';

const MI_PLANILLA = 'https://independientes2.miplanilla.com/PublicoIndependientes/Publico/IndexIndependientes';

function Linea({ nombre, detalle, valor }: { nombre: string; detalle: string; valor: string }) {
  return (
    <div className="fila">
      <div>
        <div className="nombre">{nombre}</div>
        <div className="ayuda" style={{ marginTop: 2 }}>
          {detalle}
        </div>
      </div>
      <div className="valor">{valor}</div>
    </div>
  );
}

export default function Aportes() {
  const { listo, ingreso, resumen, estado, mesHoy, actualizar } = useMes();
  if (!listo || !ingreso || !resumen) return null;

  const p = parametrosDe(ANIO_PARAMETROS);
  const a = resumen.aportes;
  const arl = resumen.arl;
  const mes = nombreMes(Number(mesHoy.slice(5, 7)));
  const arlIncluida = arl.obligatoria || estado.arlVoluntaria;
  const ibcAjustado = Math.abs(a.ibc - a.ibcTeorico) > 0.5;
  const tarifaArl = p.tarifasArl[ingreso.clase];

  let arlDetalle: string;
  if (!arlIncluida) arlDetalle = 'No incluida (voluntaria)';
  else if (a.arlACargoDelUsuario) arlDetalle = `Clase ${['I', 'II', 'III', 'IV', 'V'][ingreso.clase - 1]} · ${pct(tarifaArl, 3)} del IBC`;
  else arlDetalle = 'La paga tu contratante';

  return (
    <main>
      <header className="encabezado">
        <Logo alto={28} className="logo" />
        <h1 className="titulo-pantalla">Aportes de {mes}</h1>
        <p className="subtitulo">Sobre un ingreso de {pesos(resumen.ingresoBrutoMes)}</p>
      </header>

      <div className="contenido">
        <section className="tarjeta">
          <p className="texto-suave" style={{ fontSize: 14 }}>
            Total a pagar en tu planilla PILA
          </p>
          <p className="cifra-xl" style={{ margin: '4px 0 2px' }}>
            {pesos(a.totalUsuario)}
          </p>
          <p className="texto-suave" style={{ marginBottom: 14, fontSize: 14 }}>
            {pct(a.porcentajeDelIngreso)} de tu ingreso
          </p>
          <Linea
            nombre="Base de cotización (IBC)"
            detalle={ibcAjustado ? `Ajustada al ${a.ibc > a.ibcTeorico ? 'mínimo' : 'máximo'} legal` : `${pct(p.porcentajeIbc, 0)} de tu ingreso`}
            valor={pesos(a.ibc)}
          />
          <Linea nombre="Salud" detalle={`${pct(p.tarifaSalud)} del IBC`} valor={pesos(a.salud)} />
          <Linea nombre="Pensión" detalle={`${pct(p.tarifaPension, 0)} del IBC`} valor={pesos(a.pension)} />
          <Linea
            nombre="Fondo de Solidaridad Pensional"
            detalle={a.fsp > 0 ? `${pct(a.tarifaFsp)} del IBC` : `Aplica cuando tu IBC pasa de ${p.tramosFsp[1]?.desdeSmlmv ?? 4} salarios mínimos`}
            valor={pesos(a.fsp)}
          />
          <div className="fila">
            <div>
              <div className="nombre">ARL</div>
              <div className="ayuda" style={{ marginTop: 2 }}>
                {arlDetalle}
              </div>
            </div>
            <div className="valor">{pesos(a.arlACargoDelUsuario ? a.arl : 0)}</div>
          </div>

          <a href={MI_PLANILLA} target="_blank" rel="noopener noreferrer" className="btn btn-primario" style={{ marginTop: 18 }}>
            Pagar mi planilla en MiPlanilla
            <Icono nombre="enlace-externo" tamano={18} />
          </a>
          <p className="ayuda" style={{ marginTop: 10 }}>
            Se abre la página de MiPlanilla para independientes, un operador de la PILA. Ten a mano los valores de esta pantalla; también puedes pagar con otro
            operador.
          </p>
        </section>

        <section className="tarjeta">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div>
              <p id="arl-etiqueta" style={{ fontSize: 16, fontWeight: 600 }}>
                Incluir ARL
              </p>
              <p className="texto-suave" style={{ marginTop: 6, fontSize: 14, lineHeight: '21px' }}>
                {arl.obligatoria
                  ? `Es obligatoria: ${arl.motivo.charAt(0).toLowerCase()}${arl.motivo.slice(1)}.`
                  : `Para ti es voluntaria: ${ingreso.moneda === 'USD' ? 'tu cliente está en el exterior y ' : ''}tu riesgo es clase ${['I', 'II', 'III', 'IV', 'V'][ingreso.clase - 1]}. Te cubre si tienes un accidente trabajando.`}
              </p>
            </div>
            <Interruptor
              idEtiqueta="arl-etiqueta"
              activo={arlIncluida}
              bloqueado={arl.obligatoria}
              onCambio={(v) => actualizar({ arlVoluntaria: v })}
            />
          </div>
        </section>

        <details className="tarjeta">
          <summary>Así lo calculamos</summary>
          <p className="texto-suave" style={{ margin: '0 0 16px', fontSize: 14, lineHeight: '22px' }}>
            Tu base es el {pct(p.porcentajeIbc, 0)} de lo que facturas, con mínimo {p.topeMinIbcSmlmv} y máximo {p.topeMaxIbcSmlmv} salarios mínimos (
            {pesos(p.smlmv)} en {p.anio}). Cada aporte se redondea a los {pesos(p.redondeoPila)} más cercanos, como en la PILA. Fuentes: {p.fuentes.join(', ')}.
          </p>
        </details>
      </div>
    </main>
  );
}
