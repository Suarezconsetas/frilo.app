/* GENERADO por scripts/wireframes-a-tsx.py desde DolarHoy.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   grafico: Ranura forzada
 *   alerta: Ranura forzada
 *   conversor: Ranura forzada
 *   tabla: Ranura forzada
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import type { DatosTrm } from '../lib/trm';
import { BannerRendimiento } from '../components/BannerRendimiento';

export function ContenidoP07({ dinamicos = {}, d }: { dinamicos?: { grafico?: ReactNode, alerta?: ReactNode, conversor?: ReactNode, tabla?: ReactNode }; d: DatosTrm }) {
  return (
    <div className="wf wf-P07">
    <section style={{ background: "#0F372D", color: "#FFFFFF", padding: "40px 0 64px" }}>
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        <nav aria-label="Ruta de navegación" style={{ fontSize: "14px", color: "#B5CCC1", display: "flex", gap: "8px" }}>
          <Link href="/" style={{ color: "#B5CCC1" }}>
            Inicio
          </Link>
          <span aria-hidden="true">
            /
          </span>
          <span aria-current="page">
            Dólar hoy
          </span>
        </nav>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "860px" }}>
          <h1 style={{ margin: "0", fontSize: "clamp(32px, 4vw, 46px)", letterSpacing: "-0.02em" }}>
            {"Dólar hoy en Colombia: TRM del "}{d.fechaTitulo}
          </h1>
          <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.5" }}>
            {"El valor del dólar hoy en Colombia es "}{d.hoyTxt}{" pesos, según la TRM oficial vigente desde el "}{d.desde}{". El precio del dólar colombiano hoy "}{d.verbo}{" "}{d.varAyerPct}{" frente a ayer."}
          </p>
          <p style={{ margin: "0", color: "#B5CCC1", fontSize: "14px" }}>
            {"Fuente: Superintendencia Financiera vía datos.gov.co · Actualizado "}{d.actualizado}{" · Se actualiza cada día hábil"}
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "stretch" }}>
          <div style={{ flex: "1 1 300px", background: "#164538", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ color: "#B5CCC1", fontSize: "14px" }}>
              1 dólar hoy
            </span>
            <span style={{ color: "#6FFF8F", fontSize: "56px", lineHeight: "1", fontWeight: "700", letterSpacing: "-0.02em" }}>
              {d.hoyTxt}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#7BEA9A", fontWeight: "600" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5" />
                <path d="M6 11l6-6 6 6" />
              </svg>
              {d.varAyerTxt}{" frente a ayer"}
            </span>
          </div>
          <div style={{ flex: "2 1 520px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
            <div style={{ background: "#164538", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ color: "#B5CCC1", fontSize: "14px" }}>
                Hace una semana
              </span>
              <span style={{ fontSize: "26px", fontWeight: "700" }}>
                {d.semana.valor}
              </span>
              <span style={{ fontSize: "14px", color: "#B5CCC1" }}>
                {d.semana.txt}
              </span>
            </div>
            <div style={{ background: "#164538", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ color: "#B5CCC1", fontSize: "14px" }}>
                Hace un mes
              </span>
              <span style={{ fontSize: "26px", fontWeight: "700" }}>
                {d.mes.valor}
              </span>
              <span style={{ fontSize: "14px", color: "#B5CCC1" }}>
                {d.mes.txt}
              </span>
            </div>
            <div style={{ background: "#164538", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ color: "#B5CCC1", fontSize: "14px" }}>
                Hace un año
              </span>
              <span style={{ fontSize: "26px", fontWeight: "700" }}>
                {d.anio.valor}
              </span>
              <span style={{ fontSize: "14px", color: "#B5CCC1" }}>
                {d.anio.txt}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div className="wrap" style={{ paddingTop: "40px", paddingBottom: "96px", display: "flex", flexDirection: "column", gap: "32px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "stretch" }}>
        {dinamicos.grafico}
        {dinamicos.alerta}
      </div>
      {dinamicos.conversor}
      <BannerRendimiento variante="dolar" pagina="P07" />
      <section aria-labelledby="h-tabla" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 id="h-tabla" style={{ margin: "0", fontSize: "24px" }}>
          TRM de los últimos 30 días
        </h2>
        {dinamicos.tabla}
      </section>
      <section className="card" aria-labelledby="h-trm" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2 id="h-trm" style={{ margin: "0", fontSize: "24px" }}>
          ¿Qué es la TRM y por qué cambia?
        </h2>
        <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.65", color: "#2B4A40" }}>
          La TRM (Tasa Representativa del Mercado) es el promedio de las operaciones de compra y venta de dólares del día hábil anterior, que certifica la Superintendencia Financiera. Cambia cada día hábil según la oferta y la demanda de dólares, y queda vigente también los fines de semana y festivos hasta la siguiente publicación. Tu banco no te paga la TRM: usa su propia tasa de compra.
        </p>
      </section>
      <section aria-labelledby="h-faq" style={{ maxWidth: "820px" }}>
        <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#4A6158" }}>
          <strong style={{ color: "#0F372D" }}>
            Fuentes oficiales:
          </strong>
          {' '}
          <a href="https://www.banrep.gov.co/" target="_blank" rel="noopener">
            Banco de la República
          </a>
          {" · "}
          <a href="https://www.superfinanciera.gov.co/" target="_blank" rel="noopener">
            Superintendencia Financiera de Colombia
          </a>
          {" · "}
          <a href="https://www.datos.gov.co/" target="_blank" rel="noopener">
            datos.gov.co (TRM histórica)
          </a>
        </p>
        <h2 id="h-faq" style={{ margin: "0 0 8px", fontSize: "24px" }}>
          Preguntas frecuentes sobre el dólar hoy
        </h2>
        <details>
          <summary>
            ¿A cómo está el dólar en Colombia hoy?
          </summary>
          <p style={{ margin: "0 0 18px", color: "#4A6158", lineHeight: "1.6" }}>
            {"Hoy la TRM está en "}{d.hoyTxt}{" pesos por dólar, vigente desde el "}{d.desde}.
          </p>
        </details>
        <details>
          <summary>
            ¿La TRM es el precio al que me compran los dólares?
          </summary>
          <p style={{ margin: "0 0 18px", color: "#4A6158", lineHeight: "1.6" }}>
            No exactamente. La TRM es la referencia oficial. Bancos y plataformas compran tus dólares con su propia tasa, normalmente por debajo de la TRM, y pueden cobrar comisión.
          </p>
        </details>
        <details>
          <summary>
            ¿Qué TRM uso para calcular mi planilla si me pagan en dólares?
          </summary>
          <p style={{ margin: "0 0 18px", color: "#4A6158", lineHeight: "1.6" }}>
            {"Cotizas sobre el valor en pesos que recibiste. Para estimarlo, usa la TRM del día del pago y la "}
            <Link href="/calculadoras/aportes-independientes">
              calculadora de aportes
            </Link>
            .
          </p>
        </details>
        <details>
          <summary>
            ¿Necesito una cuenta en dólares para recibir pagos del exterior?
          </summary>
          <p style={{ margin: "0 0 18px", color: "#4A6158", lineHeight: "1.6" }}>
            {"No. Puedes recibirlos en tu cuenta en pesos, y el banco los convierte. Una cuenta en dólares te deja elegir cuándo cambiarlos. Compara opciones en "}
            <Link href="/guias/cuenta-en-dolares-colombia">
              cuenta en dólares en Colombia
            </Link>
            .
          </p>
        </details>
      </section>
    </div>
    </div>
  );
}
