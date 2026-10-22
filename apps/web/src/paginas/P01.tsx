/* GENERADO por scripts/wireframes-a-tsx.py desde Calculadora.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   b1:  Ingreso mensual bruto (COP) Antes de impuestos y sin IVA. ¿Te pagan en dólares? Convierte con la TRM de hoy C
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { BannerRendimiento } from '../components/BannerRendimiento';
import { BannerRegistro } from '../components/BannerRegistro';

export function ContenidoP01({ dinamicos = {} }: { dinamicos?: { b1?: ReactNode } }) {
  return (
    <div className="wf wf-P01">
    <div className="wrap" style={{ paddingTop: "32px", paddingBottom: "96px", display: "flex", flexDirection: "column", gap: "32px" }}>
      <nav aria-label="Ruta de navegación" style={{ fontSize: "14px", color: "#4A6158", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <Link href="/" style={{ color: "#4A6158" }}>
          Inicio
        </Link>
        <span aria-hidden="true">
          /
        </span>
        <Link href="/calculadoras" style={{ color: "#4A6158" }}>
          Calculadoras
        </Link>
        <span aria-hidden="true">
          /
        </span>
        <span aria-current="page">
          Aportes para independientes
        </span>
      </nav>
      <header style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "820px" }}>
        <h1 style={{ margin: "0", fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: "1.08", letterSpacing: "-0.02em" }}>
          Calculadora de aportes para independientes 2026
        </h1>
        <p style={{ margin: "0", fontSize: "19px", lineHeight: "1.55", color: "#2B4A40" }}>
          Un independiente cotiza sobre el 40% de lo que factura (IBC). Sobre esa base paga 12,5% de salud, 16% de pensión, ARL según su riesgo y, desde 4 salarios mínimos, Fondo de Solidaridad. Escribe tu ingreso y la calculadora hace la liquidación de aportes en línea.
        </p>
        <p style={{ margin: "0", fontSize: "14px", color: "#4A6158" }}>
          {"Actualizada el 20 de octubre de 2026 · Escrito y revisado por Nicolás Suárez con fuentes oficiales · "}
          <a href="#metodo" style={{ color: "#4A6158" }}>
            Cómo calculamos
          </a>
        </p>
      </header>
      {dinamicos.b1}
      <BannerRendimiento variante="aportes" pagina="P01" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "48px", alignItems: "flex-start" }}>
        <nav aria-label="En esta página" className="card" style={{ flex: "0 1 260px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "15px" }}>
          <span style={{ fontWeight: "600" }}>
            En esta página
          </span>
          <a href="#metodo">
            Cómo se calculan los aportes
          </a>
          <a href="#arl">
            Tarifas de ARL
          </a>
          <a href="#fsp">
            Fondo de Solidaridad
          </a>
          <a href="#ejemplo">
            Ejemplo de liquidación
          </a>
          <a href="#operadores">
            Dónde pagar la planilla
          </a>
          <a href="#faq">
            Preguntas frecuentes
          </a>
          <a href="#fuentes">
            Fuentes
          </a>
        </nav>
        <article className="prose" style={{ flex: "999 1 560px", minWidth: "0", maxWidth: "780px" }}>
          <h2 id="metodo" style={{ marginTop: "0" }}>
            Cómo se calculan los aportes de un independiente
          </h2>
          <p>
            {"Si trabajas por prestación de servicios, cotizas sobre el 40% de lo que facturas cada mes. A ese valor se le llama "}
            <Link href="/guias/ibc-independientes">
              Ingreso Base de Cotización (IBC)
            </Link>
            {" y no puede ser menor a un salario mínimo ni mayor a 25. La calculadora de aportes como independiente sigue estos pasos:"}
          </p>
          <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
            <table className="t">
              <caption style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", color: "#4A6158" }}>
                Fórmula de los aportes de un independiente en 2026 (salario mínimo: $1.750.905)
              </caption>
              <thead>
                <tr>
                  <th scope="col">
                    Paso
                  </th>
                  <th scope="col">
                    Concepto
                  </th>
                  <th scope="col">
                    Cálculo
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    1
                  </td>
                  <td>
                    IBC
                  </td>
                  <td>
                    Ingreso × 40%, entre $1.750.905 y $43.772.625
                  </td>
                </tr>
                <tr>
                  <td>
                    2
                  </td>
                  <td>
                    Salud
                  </td>
                  <td>
                    IBC × 12,5%
                  </td>
                </tr>
                <tr>
                  <td>
                    3
                  </td>
                  <td>
                    Pensión
                  </td>
                  <td>
                    IBC × 16%
                  </td>
                </tr>
                <tr>
                  <td>
                    4
                  </td>
                  <td>
                    ARL
                  </td>
                  <td>
                    IBC × tarifa de tu clase de riesgo
                  </td>
                </tr>
                <tr>
                  <td>
                    5
                  </td>
                  <td>
                    Fondo de Solidaridad
                  </td>
                  <td>
                    IBC × 1% a 2%, desde 4 salarios mínimos
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            La PILA redondea cada aporte al múltiplo de 100 más cercano.
          </p>
          <h2 id="arl">
            Tarifas de ARL por clase de riesgo
          </h2>
          <p>
            La tarifa de ARL depende del riesgo de tu actividad. Si eres contratista en riesgo I, II o III pagas tú la ARL; en riesgo IV y V la paga el contratante.
          </p>
          <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
            <table className="t">
              <caption style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", color: "#4A6158" }}>
                Tarifa de cotización a riesgos laborales por clase (Decreto 1772 de 1994; Decreto 723 de 2013 para contratistas)
              </caption>
              <thead>
                <tr>
                  <th scope="col">
                    Clase
                  </th>
                  <th scope="col">
                    Tarifa sobre el IBC
                  </th>
                  <th scope="col">
                    Ejemplos de actividad
                  </th>
                  <th scope="col">
                    Quién paga
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    I
                  </td>
                  <td>
                    0,522%
                  </td>
                  <td>
                    Trabajo de oficina, diseño, programación, consultoría
                  </td>
                  <td>
                    El contratista
                  </td>
                </tr>
                <tr>
                  <td>
                    II
                  </td>
                  <td>
                    1,044%
                  </td>
                  <td>
                    Algunos procesos de manufactura y comercio
                  </td>
                  <td>
                    El contratista
                  </td>
                </tr>
                <tr>
                  <td>
                    III
                  </td>
                  <td>
                    2,436%
                  </td>
                  <td>
                    Conductores, algunos procesos industriales
                  </td>
                  <td>
                    El contratista
                  </td>
                </tr>
                <tr>
                  <td>
                    IV
                  </td>
                  <td>
                    4,350%
                  </td>
                  <td>
                    Actividades de alto riesgo
                  </td>
                  <td>
                    El contratante
                  </td>
                </tr>
                <tr>
                  <td>
                    V
                  </td>
                  <td>
                    6,960%
                  </td>
                  <td>
                    Actividades de riesgo máximo, como trabajo en alturas o minería
                  </td>
                  <td>
                    El contratante
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h2 id="fsp">
            Fondo de Solidaridad Pensional
          </h2>
          <p>
            Si tu IBC llega a 4 salarios mínimos ($7.003.620 en 2026) pagas un aporte adicional al Fondo de Solidaridad Pensional. La reforma pensional (Ley 2381 de 2024) entraría en vigencia el 1 de abril de 2027, así que en 2026 sigue esta tabla:
          </p>
          <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
            <table className="t">
              <caption style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", color: "#4A6158" }}>
                Aporte al Fondo de Solidaridad Pensional según el IBC (Ley 797 de 2003)
              </caption>
              <thead>
                <tr>
                  <th scope="col">
                    IBC en salarios mínimos
                  </th>
                  <th scope="col">
                    IBC en pesos (2026)
                  </th>
                  <th scope="col">
                    Aporte
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Menos de 4
                  </td>
                  <td>
                    Menos de $7.003.620
                  </td>
                  <td>
                    0%
                  </td>
                </tr>
                <tr>
                  <td>
                    De 4 a menos de 16
                  </td>
                  <td>
                    $7.003.620 a $28.014.479
                  </td>
                  <td>
                    1%
                  </td>
                </tr>
                <tr>
                  <td>
                    De 16 a 17
                  </td>
                  <td>
                    $28.014.480 a $29.765.385
                  </td>
                  <td>
                    1,2%
                  </td>
                </tr>
                <tr>
                  <td>
                    De 17 a 18
                  </td>
                  <td>
                    $29.765.385 a $31.516.290
                  </td>
                  <td>
                    1,4%
                  </td>
                </tr>
                <tr>
                  <td>
                    De 18 a 19
                  </td>
                  <td>
                    $31.516.290 a $33.267.195
                  </td>
                  <td>
                    1,6%
                  </td>
                </tr>
                <tr>
                  <td>
                    De 19 a 20
                  </td>
                  <td>
                    $33.267.195 a $35.018.100
                  </td>
                  <td>
                    1,8%
                  </td>
                </tr>
                <tr>
                  <td>
                    Más de 20
                  </td>
                  <td>
                    Más de $35.018.100
                  </td>
                  <td>
                    2%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h2 id="ejemplo">
            Ejemplo de liquidación de aportes: facturas $8.000.000 al mes
          </h2>
          <ol>
            <li>
              IBC: $8.000.000 × 40% = $3.200.000
            </li>
            <li>
              Salud: $3.200.000 × 12,5% = $400.000
            </li>
            <li>
              Pensión: $3.200.000 × 16% = $512.000
            </li>
            <li>
              ARL riesgo I: $3.200.000 × 0,522% = $16.700 (redondeado)
            </li>
            <li>
              Fondo de Solidaridad: no aplica (IBC menor a 4 salarios mínimos)
            </li>
            <li>
              Total a pagar: $928.700
            </li>
          </ol>
          <h2 id="operadores">
            Dónde pagar la planilla: Mi Planilla, SOI, Pago Simple, Compensar y otros operadores
          </h2>
          <p>
            Frilo calcula el valor, pero la planilla se paga en un operador de información autorizado. Estos son los más usados por independientes:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            <div className="card" style={{ padding: "18px" }}>
              <p style={{ margin: "0", fontWeight: "600", color: "#0F372D" }}>
                Miplanilla
              </p>
              <p style={{ margin: "6px 0 0", fontSize: "15px" }}>
                Tiene un portal para independientes donde liquidas, pagas y descargas tu certificado.
              </p>
            </div>
            <div className="card" style={{ padding: "18px" }}>
              <p style={{ margin: "0", fontWeight: "600", color: "#0F372D" }}>
                Aportes en Línea
              </p>
              <p style={{ margin: "6px 0 0", fontSize: "15px" }}>
                Liquida planillas y genera certificados de aportes en línea.
              </p>
            </div>
            <div className="card" style={{ padding: "18px" }}>
              <p style={{ margin: "0", fontWeight: "600", color: "#0F372D" }}>
                Pago Simple
              </p>
              <p style={{ margin: "6px 0 0", fontSize: "15px" }}>
                Pago de la planilla y consulta de pagos y certificados.
              </p>
            </div>
            <div className="card" style={{ padding: "18px" }}>
              <p style={{ margin: "0", fontWeight: "600", color: "#0F372D" }}>
                SOI y Enlace Operativo
              </p>
              <p style={{ margin: "6px 0 0", fontSize: "15px" }}>
                Otros operadores autorizados para liquidar y pagar la PILA.
              </p>
            </div>
          </div>
          <p>
            {"Después de pagar, "}
            <Link href="/guias/descargar-planilla-seguridad-social">
              descarga y verifica tu planilla de seguridad social
            </Link>
            {" y revisa tu "}
            <Link href="/calculadoras/fecha-pago-planilla">
              fecha de pago de la planilla
            </Link>
            {" del próximo mes."}
          </p>
          <aside style={{ margin: "40px 0", background: "#E6EEE9", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontWeight: "600", fontSize: "17px" }}>
              Que no se te pase la fecha de pago
            </span>
            <span style={{ color: "#4A6158" }}>
              Con tu cuenta te avisamos cada mes según los dos últimos dígitos de tu documento.
            </span>
            <a className="btn btn-p" href="#registro" style={{ alignSelf: "flex-start" }}>
              Probar la app gratis
            </a>
          </aside>
          <h2 id="faq">
            Preguntas frecuentes sobre aportes de independientes
          </h2>
          <details>
            <summary>
              ¿Puedo calcular la liquidación de mi planilla antes de pagar?
            </summary>
            <p>
              Sí. Esta calculadora hace la liquidación de aportes con las tarifas y el redondeo de la PILA. El valor final lo confirma el operador al liquidar tu planilla.
            </p>
          </details>
          <details>
            <summary>
              ¿El resultado es el mismo que me da Mi Planilla o SOI?
            </summary>
            <p>
              Usamos la misma fórmula (40% del ingreso, tarifas de 2026 y redondeo a 100). Puede haber diferencias si reportas novedades, días incompletos o una clase de riesgo distinta.
            </p>
          </details>
          <details>
            <summary>
              ¿Tengo que pagar ARL si trabajo desde mi casa?
            </summary>
            <p>
              Depende de tu contrato. Si tienes un contrato de prestación de servicios de más de un mes, la ARL es obligatoria (Decreto 723 de 2013): en riesgo I a III la pagas tú y en IV y V la paga el contratante. Si trabajas por tu cuenta, sin contrato, en riesgo I a III es voluntaria.
            </p>
          </details>
          <details>
            <summary>
              ¿Qué pasa si facturo menos de un salario mínimo?
            </summary>
            <p>
              Cotizas igual sobre un salario mínimo ($1.750.905 en 2026), porque es la base mínima de cotización. Por eso la calculadora nunca usa un IBC menor.
            </p>
          </details>
          <details>
            <summary>
              ¿Cómo cotizo si tengo varios contratos?
            </summary>
            <p>
              Sumas lo que facturas en el mes por todos tus contratos y sacas el 40% de esa suma. El IBC sigue con el tope de 25 salarios mínimos.
            </p>
          </details>
          <details>
            <summary>
              ¿Si me pagan en dólares, qué TRM uso?
            </summary>
            <p>
              {"Usa el valor en pesos de lo que recibiste. Si necesitas convertir, toma la TRM del día en que te pagaron. Puedes consultarla en "}
              <Link href="/dolar-hoy">
                dólar hoy en Colombia
              </Link>
              .
            </p>
          </details>
          <details>
            <summary>
              ¿Y si trabajo por cuenta propia, sin contrato de prestación de servicios?
            </summary>
            <p>
              {"Desde el "}
              <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=275076" target="_blank" rel="noopener">
                Decreto 379 de 2026
              </a>
              , primero descuentas tus costos (o aplicas la presunción de costos de la UGPP) y sacas el 40% del ingreso neto. Esta calculadora tiene un modo para independientes por cuenta propia: escribe tus costos y calcula sobre tu ingreso neto. Si eres contratista de prestación de servicios, tu IBC es el 40% del valor de tu contrato, sin descontar costos.
            </p>
          </details>
          <h2 id="fuentes">
            Fuentes
          </h2>
          <ul>
            <li>
              <a href="http://www.secretariasenado.gov.co/senado/basedoc/ley_0100_1993.html" target="_blank" rel="noopener">
                Ley 100 de 1993
              </a>
            </li>
            <li>
              <a href="http://www.secretariasenado.gov.co/senado/basedoc/ley_0797_2003.html" target="_blank" rel="noopener">
                Ley 797 de 2003
              </a>
              {" (Fondo de Solidaridad Pensional)"}
            </li>
            <li>
              <a href="http://www.secretariasenado.gov.co/senado/basedoc/ley_2277_2022.html" target="_blank" rel="noopener">
                Ley 2277 de 2022
              </a>
              , artículo 89
            </li>
            <li>
              <a href="http://www.secretariasenado.gov.co/senado/basedoc/ley_2381_2024.html" target="_blank" rel="noopener">
                Ley 2381 de 2024
              </a>
              {" (reforma pensional, vigente desde el 1 de abril de 2027)"}
            </li>
            <li>
              <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=87624" target="_blank" rel="noopener">
                Decreto 1273 de 2018
              </a>
            </li>
            <li>
              <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=52627" target="_blank" rel="noopener">
                Decreto 723 de 2013
              </a>
              {" (ARL de contratistas)"}
            </li>
            <li>
              Decreto 1772 de 1994 (tarifas de riesgos laborales)
            </li>
            <li>
              <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=275076" target="_blank" rel="noopener">
                Decreto 379 de 2026
              </a>
              {" (independientes por cuenta propia)"}
            </li>
            <li>
              <a href="https://acmineria.com.co/wp-content/uploads/2025/12/DECRETO-1469-DEL-29-DE-DICIEMBRE-DE-2025.pdf" target="_blank" rel="noopener">
                Decreto 1469 de 2025
              </a>
              {" (salario mínimo 2026)"}
            </li>
            <li>
              <a href="https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=192181&dt=S" target="_blank" rel="noopener">
                Decreto 159 de 2026
              </a>
              {" (salario mínimo 2026, transitorio y vigente)"}
            </li>
            <li>
              <a href="https://www.ugpp.gov.co/" target="_blank" rel="noopener">
                UGPP
              </a>
              , entidad que fiscaliza los aportes
            </li>
          </ul>
        </article>
      </div>
      <BannerRegistro variante="aportes" pagina="P01" />
      <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <h2 style={{ margin: "0", fontSize: "28px" }}>
          Otras calculadoras y guías para independientes
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          <Link href="/calculadoras/fecha-pago-planilla" className="card" style={{ textDecoration: "none", fontWeight: "600" }}>
            Fecha de pago de la planilla
          </Link>
          <Link href="/guias/descargar-planilla-seguridad-social" className="card" style={{ textDecoration: "none", fontWeight: "600" }}>
            Cómo descargar la planilla de seguridad social
          </Link>
          <Link href="/calculadoras/cesantias" className="card" style={{ textDecoration: "none", fontWeight: "600" }}>
            Calculadora de cesantías e intereses
          </Link>
          <Link href="/dolar-hoy" className="card" style={{ textDecoration: "none", fontWeight: "600" }}>
            Dólar hoy en Colombia (TRM)
          </Link>
        </div>
      </section>
    </div>
    </div>
  );
}
