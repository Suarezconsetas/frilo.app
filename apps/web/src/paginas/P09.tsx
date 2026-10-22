/* GENERADO por scripts/wireframes-a-tsx.py desde GuiaRecibirDolares.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   (ninguno)
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { URL_APP } from '../lib/config';
import { BannerRendimiento } from '../components/BannerRendimiento';
import { BannerRegistro } from '../components/BannerRegistro';

export function ContenidoP09({ dinamicos = {} }: { dinamicos?: {  } }) {
  return (
    <div className="wf wf-P09">
    <div className="wrap" style={{ paddingTop: "32px", paddingBottom: "96px", display: "flex", flexDirection: "column", gap: "40px" }}>
      <nav aria-label="Ruta de navegación" style={{ fontSize: "14px", color: "#4A6158", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <Link href="/" style={{ color: "#4A6158" }}>
          Inicio
        </Link>
        <span aria-hidden="true">
          /
        </span>
        <Link href="/guias" style={{ color: "#4A6158" }}>
          Guías
        </Link>
        <span aria-hidden="true">
          /
        </span>
        <span aria-current="page">
          Recibir pagos en dólares
        </span>
      </nav>
      <header style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "820px" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
          Pagos en dólares · Lectura de 8 minutos
        </span>
        <h1 style={{ margin: "0", fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: "1.08", letterSpacing: "-0.02em" }}>
          Cómo recibir pagos del exterior en dólares en Colombia
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <div aria-hidden="true" style={{ width: "48px", height: "48px", borderRadius: "999px", background: "#E6EEE9" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "14px" }}>
            <span style={{ fontWeight: "600" }}>
              Escrito y revisado por Nicolás Suárez con fuentes oficiales
            </span>
            <span style={{ color: "#4A6158" }}>
              Actualizado el 20 de octubre de 2026
            </span>
          </div>
        </div>
      </header>
      <section aria-label="La respuesta corta" style={{ background: "#E6EEE9", borderRadius: "16px", padding: "24px 28px", maxWidth: "772px", display: "flex", flexDirection: "column", gap: "8px", boxSizing: "border-box" }}>
        <span style={{ fontWeight: "600" }}>
          La respuesta corta
        </span>
        <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#2B4A40" }}>
          Para recibir pagos en dólares en Colombia tienes tres caminos: transferencia internacional a tu cuenta bancaria en pesos, una cuenta en dólares o una plataforma o billetera digital. Compara la tasa que te dan frente a la TRM y las comisiones, y recuerda que cotizas sobre el valor en pesos.
        </p>
      </section>
      <div style={{ display: "flex", flexWrap: "wrap-reverse", gap: "48px", alignItems: "flex-start" }}>
        <article className="prose" style={{ flex: "999 1 560px", minWidth: "0", maxWidth: "780px" }}>
          <h2 style={{ marginTop: "0" }}>
            Opciones para recibir pagos en dólares
          </h2>
          <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
            <table className="t">
              <caption style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", color: "#4A6158" }}>
                Consultado el 20 de octubre de 2026. Sin recomendación de una opción en particular.
              </caption>
              <thead>
                <tr>
                  <th scope="col">
                    Opción
                  </th>
                  <th scope="col">
                    Costo
                  </th>
                  <th scope="col">
                    Tiempo
                  </th>
                  <th scope="col">
                    Tasa frente a la TRM
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Transferencia a cuenta en pesos
                  </td>
                  <td>
                    Comisión del banco por recibir giros, según tu banco
                  </td>
                  <td>
                    Llega convertida a pesos
                  </td>
                  <td>
                    El banco aplica su tasa, normalmente por debajo de la TRM
                  </td>
                </tr>
                <tr>
                  <td>
                    Cuenta en dólares en la filial de un banco (Bancolombia, Davivienda)
                  </td>
                  <td>
                    Sin cuota de manejo en las opciones consultadas; Davivienda limita el saldo a USD 5.000
                  </td>
                  <td>
                    Apertura digital si ya eres cliente
                  </td>
                  <td>
                    Tú eliges cuándo cambiar a pesos
                  </td>
                </tr>
                <tr>
                  <td>
                    Plataforma digital (Global66, Littio)
                  </td>
                  <td>
                    Sin costo de apertura; Littio cobra USD 2,99 por recibir de EE. UU. o Europa
                  </td>
                  <td>
                    Apertura en minutos
                  </td>
                  <td>
                    Tú eliges cuándo cambiar; revisa su tasa de cambio
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h2>
            Costos y tasa de cambio
          </h2>
          <div className="card" style={{ background: "#F3F6F4", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "14px", color: "#4A6158" }}>
                TRM de hoy
              </span>
              <span style={{ fontSize: "30px", fontWeight: "700" }}>
                [$X.XXX,XX]
              </span>
            </div>
            <Link href="/dolar-hoy" style={{ fontWeight: "600" }}>
              Ver el dólar hoy en Colombia
            </Link>
          </div>
          <p>
            Para comparar, multiplica lo que recibes por la tasa que te da la entidad y réstale la comisión. Luego compáralo con lo que te darían a la TRM del día. Ejemplo: si recibes USD 2.000 y tu banco te paga 1% por debajo de la TRM, pierdes el 1% de USD 2.000 (USD 20) en pesos, más la comisión.
          </p>
          <h2>
            Qué debes declarar como independiente
          </h2>
          <p>
            {"Los pagos que recibes del exterior son ingresos y van en tu declaración de renta. En lo cambiario, la DIAN lista las operaciones que deben canalizarse por el mercado cambiario (importaciones, exportaciones de bienes, deuda e inversión extranjera, derivados); para esas se usa un intermediario o una cuenta de compensación y se presenta declaración de cambio. Guarda los soportes de tus pagos por cinco años. Revisa tu caso en la página de "}
            <a href="https://www.dian.gov.co/atencionciudadano/infoconsulta/Paginas/ControlCambiario.aspx" target="_blank" rel="noopener">
              control cambiario de la DIAN
            </a>
            {" o con un contador."}
          </p>
          <h2>
            Cuenta en dólares vs. billetera digital
          </h2>
          <p>
            {"Una cuenta en la filial de un banco está vigilada por el regulador de ese país y suele pedir ser cliente o soportar ingresos. Una plataforma digital se abre en minutos, pero revisa su regulación: Littio, por ejemplo, no está vigilada por la Superintendencia Financiera. Compara opciones en "}
            <Link href="/guias/cuenta-en-dolares-colombia">
              cuenta en dólares en Colombia
            </Link>
            .
          </p>
          <h2>
            Cuánto pagas de planilla si cobras en dólares
          </h2>
          <p>
            {"Cotizas sobre el 40% del valor en pesos de lo que facturas. Convierte tu factura con la TRM y usa la "}
            <Link href="/calculadoras/aportes-independientes">
              calculadora de aportes para independientes
            </Link>
            {" para ver el valor exacto."}
          </p>
          <Link href="/calculadoras/aportes-independientes" className="btn btn-m" style={{ background: "#0F372D", color: "#6FFF8F" }}>
            Calcular mi planilla en dólares
          </Link>
          <div style={{ margin: "40px 0" }}>
            <BannerRendimiento variante="dolar" pagina="P09" />
          </div>
          <div style={{ margin: "40px 0" }}>
            <BannerRegistro variante="dolar" pagina="P09" />
          </div>
          <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#4A6158" }}>
            <strong style={{ color: "#0F372D" }}>
              Fuentes oficiales:
            </strong>
            {' '}
            <a href="https://www.dian.gov.co/atencionciudadano/infoconsulta/Paginas/ControlCambiario.aspx" target="_blank" rel="noopener">
              DIAN, control cambiario
            </a>
            {" · "}
            <a href="https://www.banrep.gov.co/" target="_blank" rel="noopener">
              Banco de la República
            </a>
            {" · "}
            <a href="https://www.datos.gov.co/" target="_blank" rel="noopener">
              datos.gov.co (TRM histórica)
            </a>
          </p>
          <h2>
            Preguntas frecuentes
          </h2>
          <details>
            <summary>
              ¿Puedo recibir dólares en una cuenta en pesos?
            </summary>
            <p>
              Sí. El banco recibe la transferencia y la convierte a pesos con su propia tasa, que suele ser menor que la TRM. Compara esa tasa y la comisión antes de elegir.
            </p>
          </details>
          <details>
            <summary>
              ¿Qué TRM se usa para calcular la planilla?
            </summary>
            <p>
              {"Cotizas sobre el valor en pesos de lo que recibiste. Para estimarlo, usa la TRM del día del pago y luego la "}
              <Link href="/calculadoras/aportes-independientes">
                calculadora de aportes
              </Link>
              .
            </p>
          </details>
          <details>
            <summary>
              ¿Tengo que pagar impuestos por recibir dólares?
            </summary>
            <p>
              {"Los pagos del exterior son ingresos y cuentan para tu declaración de renta como cualquier otro ingreso. Para las obligaciones cambiarias, consulta la página de "}
              <a href="https://www.dian.gov.co/atencionciudadano/infoconsulta/Paginas/ControlCambiario.aspx" target="_blank" rel="noopener">
                control cambiario de la DIAN
              </a>
              .
            </p>
          </details>
        </article>
        <aside style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <nav aria-label="En esta guía" className="card" style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "15px" }}>
            <span style={{ fontWeight: "600" }}>
              En esta guía
            </span>
            <a href="#">
              Opciones
            </a>
            <a href="#">
              Costos y tasa
            </a>
            <a href="#">
              Qué declarar
            </a>
            <a href="#">
              Cuenta vs. billetera
            </a>
            <a href="#">
              Planilla en dólares
            </a>
          </nav>
          <div className="card" style={{ background: "#F3F6F4", display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontWeight: "600" }}>
              Te avisamos cuando el dólar llegue a tu precio
            </span>
            <a className="btn btn-grad" href={URL_APP}>
              Probar la app gratis
            </a>
          </div>
        </aside>
      </div>
    </div>
    </div>
  );
}
