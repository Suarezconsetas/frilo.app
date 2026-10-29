/* GENERADO por scripts/wireframes-a-tsx.py desde Main.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   hero: Ranura forzada
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Isotipo, Wordmark } from '../components/Logo';
import { URL_APP } from '../lib/config';
import type { DatosTrm } from '../lib/trm';
import { BannerRendimiento } from '../components/BannerRendimiento';

export function ContenidoHome({ dinamicos = {}, d }: { dinamicos?: { hero?: ReactNode; app?: ReactNode }; d: DatosTrm }) {
  return (
    <div className="wf wf-Home">
    <div style={{ background: "#F3F6F4" }}>
      <section style={{ background: "#0F372D", color: "#FFFFFF", padding: "64px 0 96px" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: "56px", alignItems: "center" }}>
          <div className="home-columna" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h1 style={{ margin: "0", fontSize: "clamp(28px, 3.4vw, 42px)", lineHeight: "1.12", fontWeight: "700", letterSpacing: "-0.02em" }}>
              Calculadoras gratis para independientes: aportes, cesantías y planilla
            </h1>
            <h2 className="home-marca" style={{ margin: "0", display: "flex", alignItems: "center", gap: "20px" }}>
              <Isotipo tono="manzana" alto={28} altoCss="clamp(72px, 8vw, 104px)" />
              <Wordmark tono="manzana" alto={28} altoCss="clamp(52px, 5.8vw, 76px)" />
              <span className="sr-only">Frilo</span>
            </h2>
            <p style={{ margin: "0", fontSize: "19px", lineHeight: "1.5", color: "#B5CCC1", maxWidth: "560px" }}>
              Sabes cuánto cobras; Frilo te dice cuánto es tuyo. Calcula tu planilla de seguridad social, aparta tu prima y tus cesantías, ponlas a rendir y sigue el dólar. Para freelancers y contratistas en Colombia, en pesos o en dólares.
            </p>
            {dinamicos.hero}
          </div>
          <div className="card" style={{ border: "0", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", color: "#0F372D" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <p style={{ margin: "0", fontWeight: "600", fontSize: "17px", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                <Isotipo tono="oliva" alto={26} />
                Así se ve tu mes
              </p>
              <p style={{ margin: "0", fontSize: "14px", color: "#4A6158" }}>
                Ejemplo con $8.000.000
              </p>
            </div>
            <div>
              <p style={{ margin: "0", fontSize: "14px", color: "#4A6158" }}>
                Te queda para gastos y metas
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "44px", lineHeight: "48px", fontWeight: "700", letterSpacing: "-0.02em" }}>
                $5.738.500
              </p>
            </div>
            <div role="img" aria-label="Reparto: 72% disponible, 12% aportes, 8% prima, 8% cesantías" style={{ display: "flex", height: "16px", borderRadius: "999px", overflow: "hidden", gap: "2px" }}>
              <div style={{ width: "71.7%", background: "#0F372D" }} />
              <div style={{ width: "11.6%", background: "#BFCBC5" }} />
              <div style={{ width: "8.35%", background: "#2FB35E" }} />
              <div style={{ width: "8.35%", background: "#6FFF8F" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "16px", background: "#F3F6F4", borderRadius: "12px" }}>
                <span style={{ fontSize: "14px", color: "#4A6158" }}>
                  Planilla (salud, pensión, ARL)
                </span>
                <span style={{ fontSize: "20px", fontWeight: "700" }}>
                  $928.700
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "16px", background: "#F3F6F4", borderRadius: "12px" }}>
                <span style={{ fontSize: "14px", color: "#4A6158" }}>
                  Aparta para prima
                </span>
                <span style={{ fontSize: "20px", fontWeight: "700" }}>
                  $666.400
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "16px", background: "#F3F6F4", borderRadius: "12px" }}>
                <span style={{ fontSize: "14px", color: "#4A6158" }}>
                  Aparta para cesantías
                </span>
                <span style={{ fontSize: "20px", fontWeight: "700" }}>
                  $666.400
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "16px", background: "#F3F6F4", borderRadius: "12px" }}>
                <span style={{ fontSize: "14px", color: "#4A6158" }}>
                  Dólar hoy (TRM)
                </span>
                <span style={{ fontSize: "20px", fontWeight: "700" }}>
                  {d.hoyTxt}
                </span>
              </div>
            </div>
            <p style={{ margin: "0", fontSize: "14px", lineHeight: "18px", color: "#4A6158" }}>
              Cálculo estimado con el salario mínimo 2026 y ARL riesgo I. No incluye el 4x1000, retenciones ni renta.
            </p>
          </div>
        </div>
      </section>
      <section aria-label="Fuentes" style={{ borderBottom: "1px solid #D6E0DA", background: "#FFFFFF" }}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: "12px 40px", justifyContent: "center", paddingTop: "20px", paddingBottom: "20px", fontSize: "14px", color: "#4A6158" }}>
          <span>
            Salario mínimo 2026: $1.750.905 (Decretos 1469 de 2025 y 0159 de 2026)
          </span>
          <span>
            TRM oficial de la Superintendencia Financiera
          </span>
          <span>
            Tarifas de la Ley 100 de 1993 y la Ley 797 de 2003
          </span>
        </div>
      </section>
      <section style={{ padding: "96px 0" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <div style={{ maxWidth: "760px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={{ margin: "0", fontSize: "40px", lineHeight: "1.1", letterSpacing: "-0.015em" }}>
              ¿Qué tiene que calcular un independiente cada mes?
            </h2>
            <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.5", color: "#4A6158" }}>
              Tu contrato no trae prima ni cesantías y la planilla corre por tu cuenta. Trabajar por prestación de servicios o para afuera te da libertad, pero te deja tres cuentas que nadie hace por ti.
            </p>
          </div>
          <ol className="grid3" style={{ listStyle: "none", margin: "0", padding: "0" }}>
            <li className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#1E7A43" }}>
                01
              </span>
              <p style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>
                El dólar cambia todos los días
              </p>
              <p style={{ margin: "0", color: "#4A6158", lineHeight: "1.5" }}>
                Facturas lo mismo y recibes distinto. No sabes cuánto entra hasta que cambias.
              </p>
            </li>
            <li className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#1E7A43" }}>
                02
              </span>
              <p style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>
                La planilla la calculas tú
              </p>
              <p style={{ margin: "0", color: "#4A6158", lineHeight: "1.5" }}>
                Salud, pensión y ARL sobre el 40% de lo que facturas, con topes y redondeos.
              </p>
            </li>
            <li className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#1E7A43" }}>
                03
              </span>
              <p style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>
                Nadie te aparta prima ni cesantías
              </p>
              <p style={{ margin: "0", color: "#4A6158", lineHeight: "1.5" }}>
                Si no las ahorras tú, en junio y en diciembre no hay colchón. Y si las apartas en una cuenta sin rentabilidad, pierden valor.
              </p>
            </li>
          </ol>
        </div>
      </section>
      <section id="funciones" style={{ padding: "0 0 72px" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "36px", letterSpacing: "-0.015em", display: "flex", alignItems: "center", gap: "14px" }}>
            <Isotipo tono="oliva" alto={36} />
            Todo lo que calcula Frilo: planilla, cesantías y dólar
          </h2>
          <article className="card" style={{ padding: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "40px", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
                01 · Aportes
              </span>
              <h3 style={{ margin: "0", fontSize: "32px", lineHeight: "1.15" }}>
                Sabe exactamente cuánto pagar de planilla
              </h3>
              <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.5", color: "#4A6158" }}>
                Salud, pensión, ARL y Fondo de Solidaridad sobre tu IBC, con el mismo redondeo de la PILA. Te avisamos tu fecha límite según tu documento y te llevamos a pagar.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link href="/calculadoras/aportes-independientes" style={{ fontWeight: "600" }}>
                  Calculadora de aportes para independientes
                </Link>
                <Link href="/guias/ibc-independientes" style={{ fontWeight: "600" }}>
                  Qué es el IBC y cómo se calcula
                </Link>
              </div>
            </div>
            <div style={{ background: "#E6EEE9", borderRadius: "16px", maxHeight: "420px", overflow: "hidden" }}>
              <img src="/capturas/aportes.jpg" width="640" height="1385" alt="Pantalla Aportes de la app de Frilo: total de la planilla de $1.079.400 con el desglose de IBC, salud, pensión, Fondo de Solidaridad y ARL." loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </article>
          <article className="card" style={{ padding: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "40px", alignItems: "center" }}>
            <div style={{ background: "#E6EEE9", borderRadius: "16px", maxHeight: "420px", overflow: "hidden" }}>
              <img src="/capturas/ahorro.jpg" width="640" height="1385" alt="Pantalla de Ahorro de la app de Frilo: bolsillos de prima y cesantías con su saldo y lo que llevas guardado." loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
                02 · Prima y cesantías
              </span>
              <h3 style={{ margin: "0", fontSize: "32px", lineHeight: "1.15" }}>
                Arma tu propia prima y tus cesantías, y ponlas a rendir
              </h3>
              <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.5", color: "#4A6158" }}>
                Aparta el 8,33% para cada una en cada pago y mira cuánto llevas. Compara cuentas de ahorro por tasa, con fecha de consulta, y marca cuándo cobras tu prima.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link href="/calculadoras/cesantias" style={{ fontWeight: "600" }}>
                  Calculadora de cesantías e intereses
                </Link>
                <Link href="/guias/cesantias-independientes" style={{ fontWeight: "600" }}>
                  Cesantías para independientes
                </Link>
              </div>
            </div>
          </article>
          <article className="card" style={{ padding: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "40px", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
                03 · Dólar
              </span>
              <h3 style={{ margin: "0", fontSize: "32px", lineHeight: "1.15" }}>
                Sigue el dólar y cobra en el mejor momento
              </h3>
              <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.5", color: "#4A6158" }}>
                La TRM de hoy frente a hace una semana, un mes y un año. Pon un valor objetivo y te avisamos por correo cuando el dólar llegue.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link href="/dolar-hoy" style={{ fontWeight: "600" }}>
                  Dólar hoy en Colombia
                </Link>
                <Link href="/guias/recibir-pagos-en-dolares-colombia" style={{ fontWeight: "600" }}>
                  Cómo recibir pagos en dólares
                </Link>
              </div>
            </div>
            <div style={{ background: "#E6EEE9", borderRadius: "16px", maxHeight: "420px", overflow: "hidden" }}>
              <img src="/capturas/dolar.jpg" width="640" height="1385" alt="Pantalla Dólar hoy de la app de Frilo: TRM del día, comparación con la semana, el mes y el año, y las alertas del dólar." loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </article>
        </div>
      </section>
      {dinamicos.app}
      <section aria-labelledby="rinde" style={{ padding: "0 0 96px" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 id="rinde" style={{ margin: "0", fontSize: "36px", letterSpacing: "-0.015em" }}>
            Calcula cuánto rendirían tu prima y tus cesantías
          </h2>
          <BannerRendimiento variante="prima" pagina="Home" />
        </div>
      </section>
      <section style={{ padding: "0 0 96px" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <h2 style={{ margin: "0", fontSize: "36px", letterSpacing: "-0.015em" }}>
            Calculadoras para freelancers en dólares y contratistas por prestación de servicios
          </h2>
          <div className="grid3">
            <Link href="/guias/recibir-pagos-en-dolares-colombia" className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "18px", fontWeight: "600" }}>
                Te pagan en dólares desde afuera
              </span>
              <span style={{ color: "#4A6158", lineHeight: "1.5" }}>
                Contractor o freelancer con clientes en el exterior.
              </span>
              <span style={{ fontWeight: "600", marginTop: "8px" }}>
                Cómo recibir y convertir tus pagos
              </span>
            </Link>
            <Link href="/calculadoras/aportes-independientes" className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "18px", fontWeight: "600" }}>
                Tienes contrato por prestación de servicios
              </span>
              <span style={{ color: "#4A6158", lineHeight: "1.5" }}>
                Contratista en pesos con una o varias empresas en Colombia.
              </span>
              <span style={{ fontWeight: "600", marginTop: "8px" }}>
                Calcula tu planilla de contratista
              </span>
            </Link>
            <Link href="/calculadoras/aportes-independientes" className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "18px", fontWeight: "600" }}>
                Te ofrecieron un contrato y quieres saber cuánto te queda
              </span>
              <span style={{ color: "#4A6158", lineHeight: "1.5" }}>
                Compara la oferta antes de firmar.
              </span>
              <span style={{ fontWeight: "600", marginTop: "8px" }}>
                Simula tu ingreso neto
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section style={{ background: "#FFFFFF", padding: "96px 0", borderTop: "1px solid #D6E0DA", borderBottom: "1px solid #D6E0DA" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h2 style={{ margin: "0", fontSize: "36px", letterSpacing: "-0.015em" }}>
                Calculadora de aportes, de cesantías y de fecha de pago de la planilla
              </h2>
              <p style={{ margin: "0", color: "#4A6158", fontSize: "17px" }}>
                Úsalas sin registrarte. Crea tu cuenta solo si quieres guardar.
              </p>
            </div>
            <Link href="/calculadoras" style={{ fontWeight: "600" }}>
              Todas las calculadoras
            </Link>
          </div>
          <div className="grid3">
            <div className="card" style={{ textDecoration: "none", background: "#F3F6F4", display: "flex", flexDirection: "column", gap: "8px" , position: "relative"}}>
<Link href="/calculadoras/aportes-independientes" className="card-enlace" style={{ fontWeight: "600", fontSize: "17px" , color: "inherit", textDecoration: "none"}}>
Calculadora de aportes para independientes 2026
</Link>
<span style={{ color: "#4A6158", fontSize: "15px" }}>
                Salud, pensión, ARL y FSP sobre tu IBC.
              </span>
</div>
            <div className="card" style={{ textDecoration: "none", background: "#F3F6F4", display: "flex", flexDirection: "column", gap: "8px" , position: "relative"}}>
<Link href="/calculadoras/cesantias" className="card-enlace" style={{ fontWeight: "600", fontSize: "17px" , color: "inherit", textDecoration: "none"}}>
Calculadora de cesantías e intereses
</Link>
<span style={{ color: "#4A6158", fontSize: "15px" }}>
                Cesantías e intereses del 12%, con contrato o como independiente.
              </span>
</div>
            <div className="card" style={{ textDecoration: "none", background: "#F3F6F4", display: "flex", flexDirection: "column", gap: "8px" , position: "relative"}}>
<Link href="/calculadoras/fecha-pago-planilla" className="card-enlace" style={{ fontWeight: "600", fontSize: "17px" , color: "inherit", textDecoration: "none"}}>
Fecha de pago de la planilla
</Link>
<span style={{ color: "#4A6158", fontSize: "15px" }}>
                Según los dos últimos dígitos de tu documento.
              </span>
</div>
            <div className="card" style={{ textDecoration: "none", background: "#F3F6F4", display: "flex", flexDirection: "column", gap: "8px" , position: "relative"}}>
<Link href="/dolar-hoy" className="card-enlace" style={{ fontWeight: "600", fontSize: "17px" , color: "inherit", textDecoration: "none"}}>
Dólar hoy en Colombia (TRM)
</Link>
<span style={{ color: "#4A6158", fontSize: "15px" }}>
                Hoy, hace una semana, un mes y un año.
              </span>
</div>
            <a href="#" className="card" style={{ textDecoration: "none", background: "#F3F6F4", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontWeight: "600", fontSize: "17px" }}>
                Calculadora de prima para independientes
              </span>
              <span style={{ color: "#4A6158", fontSize: "15px" }}>
                Cuánto apartar y cuánto tendrás en junio.
              </span>
            </a>
            <div className="card" style={{ textDecoration: "none", background: "#F3F6F4", display: "flex", flexDirection: "column", gap: "8px" , position: "relative"}}>
<Link href="/calculadoras/interes-compuesto" className="card-enlace" style={{ fontWeight: "600", fontSize: "17px" , color: "inherit", textDecoration: "none"}}>
Calculadora de interés compuesto
</Link>
<span style={{ color: "#4A6158", fontSize: "15px" }}>
                Simula cuánto rinden tu prima y tus cesantías.
              </span>
</div>
          </div>
        </div>
      </section>
      <section style={{ padding: "96px 0" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "720px" }}>
            <h2 style={{ margin: "0", fontSize: "36px", letterSpacing: "-0.015em" }}>
              Calcular aportes con Frilo, con una hoja de cálculo o con el simulador del operador
            </h2>
            <p style={{ margin: "0", color: "#4A6158", fontSize: "17px" }}>
              Una comparación honesta, incluido lo que Frilo no hace.
            </p>
          </div>
          <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
            <table style={{ width: "100%", minWidth: "640px", borderCollapse: "collapse", fontSize: "15px" }}>
              <thead>
                <tr style={{ background: "#E6EEE9", textAlign: "left" }}>
                  <th scope="col" style={{ padding: "16px 20px" }}>
                    <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>
                      Función
                    </span>
                  </th>
                  <th scope="col" style={{ padding: "16px 20px" }}>
                    Frilo
                  </th>
                  <th scope="col" style={{ padding: "16px 20px" }}>
                    Hoja de cálculo
                  </th>
                  <th scope="col" style={{ padding: "16px 20px" }}>
                    Simulador del operador PILA
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: "1px solid #D6E0DA" }}>
                  <th scope="row" style={{ padding: "16px 20px", textAlign: "left", fontWeight: "400" }}>
                    Calcula aportes con la regla del 40%
                  </th>
                  <td style={{ padding: "16px 20px", fontWeight: "600" }}>
                    Sí
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    A mano
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    Sí
                  </td>
                </tr>
                <tr style={{ borderTop: "1px solid #D6E0DA" }}>
                  <th scope="row" style={{ padding: "16px 20px", textAlign: "left", fontWeight: "400" }}>
                    Convierte dólares con la TRM oficial
                  </th>
                  <td style={{ padding: "16px 20px", fontWeight: "600" }}>
                    Sí
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    A mano
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    No
                  </td>
                </tr>
                <tr style={{ borderTop: "1px solid #D6E0DA" }}>
                  <th scope="row" style={{ padding: "16px 20px", textAlign: "left", fontWeight: "400" }}>
                    Aparta prima y cesantías
                  </th>
                  <td style={{ padding: "16px 20px", fontWeight: "600" }}>
                    Sí
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    A mano
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    No
                  </td>
                </tr>
                <tr style={{ borderTop: "1px solid #D6E0DA" }}>
                  <th scope="row" style={{ padding: "16px 20px", textAlign: "left", fontWeight: "400" }}>
                    Compara cuentas donde ponerlas a rendir
                  </th>
                  <td style={{ padding: "16px 20px", fontWeight: "600" }}>
                    Sí
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    No
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    No
                  </td>
                </tr>
                <tr style={{ borderTop: "1px solid #D6E0DA" }}>
                  <th scope="row" style={{ padding: "16px 20px", textAlign: "left", fontWeight: "400" }}>
                    Alertas del dólar por correo
                  </th>
                  <td style={{ padding: "16px 20px", fontWeight: "600" }}>
                    Sí
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    No
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    No
                  </td>
                </tr>
                <tr style={{ borderTop: "1px solid #D6E0DA" }}>
                  <th scope="row" style={{ padding: "16px 20px", textAlign: "left", fontWeight: "400" }}>
                    Paga la planilla
                  </th>
                  <td style={{ padding: "16px 20px", fontWeight: "600" }}>
                    No, te lleva al operador
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    No
                  </td>
                  <td style={{ padding: "16px 20px", fontWeight: "600" }}>
                    Sí
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section style={{ padding: "0 0 96px" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "16px", flexWrap: "wrap" }}>
            <h2 style={{ margin: "0", fontSize: "36px", letterSpacing: "-0.015em" }}>
              Guías para calcular y pagar tu planilla de seguridad social
            </h2>
            <Link href="/guias" style={{ fontWeight: "600" }}>
              Todas las guías
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: "16px" }}>
            <Link href="/guias/descargar-planilla-seguridad-social" className="card" style={{ textDecoration: "none", padding: "0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: "140px", background: "#E6EEE9" }} />
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
                  Aportes
                </span>
                <span style={{ fontSize: "18px", fontWeight: "600" }}>
                  Cómo descargar y verificar tu planilla de seguridad social
                </span>
              </div>
            </Link>
            <Link href="/guias/ibc-independientes" className="card" style={{ textDecoration: "none", padding: "0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: "140px", background: "#E6EEE9" }} />
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
                  Aportes
                </span>
                <span style={{ fontSize: "18px", fontWeight: "600" }}>
                  IBC para independientes: qué es y cómo se calcula
                </span>
              </div>
            </Link>
            <Link href="/guias/cesantias-independientes" className="card" style={{ textDecoration: "none", padding: "0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: "140px", background: "#E6EEE9" }} />
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
                  Prima y cesantías
                </span>
                <span style={{ fontSize: "18px", fontWeight: "600" }}>
                  Cesantías para independientes: cómo crear las tuyas
                </span>
              </div>
            </Link>
            <Link href="/guias/recibir-pagos-en-dolares-colombia" className="card" style={{ textDecoration: "none", padding: "0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: "140px", background: "#E6EEE9" }} />
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
                  Dólar
                </span>
                <span style={{ fontSize: "18px", fontWeight: "600" }}>
                  Cómo recibir pagos del exterior en dólares en Colombia
                </span>
              </div>
            </Link>
            <Link href="/guias/cuentas-de-ahorro-alto-rendimiento" className="card" style={{ textDecoration: "none", padding: "0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: "140px", background: "#E6EEE9" }} />
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
                  Ahorro
                </span>
                <span style={{ fontSize: "18px", fontWeight: "600" }}>
                  Cuentas de ahorro de alto rendimiento en Colombia
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <section id="preguntas" style={{ background: "#FFFFFF", padding: "96px 0", borderTop: "1px solid #D6E0DA" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "48px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h2 style={{ margin: "0", fontSize: "36px", letterSpacing: "-0.015em" }}>
              Preguntas frecuentes sobre Frilo y sus calculadoras
            </h2>
            <p style={{ margin: "0", color: "#4A6158", fontSize: "17px", lineHeight: "1.5" }}>
              Lo que decide si Frilo te sirve.
            </p>
          </div>
          <div>
            <details open>
              <summary>
                ¿Frilo es gratis?
              </summary>
              <p style={{ margin: "0 0 20px", color: "#4A6158", lineHeight: "1.6" }}>
                Sí. Las calculadoras se usan sin registro. Crear una cuenta es gratis y sirve para guardar tus cálculos y recibir alertas.
              </p>
            </details>
            <details>
              <summary>
                ¿Las cuentas que recomienda Frilo le pagan?
              </summary>
              <p style={{ margin: "0 0 20px", color: "#4A6158", lineHeight: "1.6" }}>
                No. Frilo es un proyecto nuevo y gratuito: ninguna entidad nos paga por aparecer y el orden de las comparativas es siempre por tasa. No vendemos tus datos.
              </p>
            </details>
            <details>
              <summary>
                ¿Frilo paga mi planilla?
              </summary>
              <p style={{ margin: "0 0 20px", color: "#4A6158", lineHeight: "1.6" }}>
                No. Calcula el valor y te lleva al operador para que la pagues tú.
              </p>
            </details>
            <details>
              <summary>
                ¿Sirve si me pagan en pesos?
              </summary>
              <p style={{ margin: "0 0 20px", color: "#4A6158", lineHeight: "1.6" }}>
                Sí. Funciona para contratos de prestación de servicios en pesos, en dólares o de ambas formas.
              </p>
            </details>
            <details>
              <summary>
                ¿De dónde sale la TRM?
              </summary>
              <p style={{ margin: "0 0 20px", color: "#4A6158", lineHeight: "1.6" }}>
                Del dato oficial que publica la Superintendencia Financiera en Datos Abiertos Colombia.
              </p>
            </details>
            <details>
              <summary>
                ¿Es asesoría financiera?
              </summary>
              <p style={{ margin: "0 0 20px", color: "#4A6158", lineHeight: "1.6" }}>
                No. Son cálculos y simulaciones con fines informativos.
              </p>
            </details>
          </div>
        </div>
      </section>
      <section style={{ padding: "96px 0" }}>
        <div className="wrap">
          <div style={{ background: "#0F372D", borderRadius: "24px", padding: "64px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center", color: "#FFFFFF" }}>
            <Isotipo tono="manzana" alto={88} />
            <p style={{ margin: "0", fontSize: "clamp(30px, 4vw, 44px)", fontWeight: "700", letterSpacing: "-0.02em", maxWidth: "720px" }}>
              Más claridad, más libertad.
            </p>
            <p style={{ margin: "0", color: "#B5CCC1", fontSize: "18px" }}>
              Haz tu primer cálculo en menos de un minuto.
            </p>
            <a className="btn btn-grad" href={URL_APP}>
              Probar la app gratis
            </a>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}
