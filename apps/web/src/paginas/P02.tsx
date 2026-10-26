/* GENERADO por scripts/wireframes-a-tsx.py desde GuiaIBC.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   b1:  Calculadora del IBC para independientes Lo que facturas al mes (COP) Tu IBC {{ibcTxt}} {{nota}} Ver cuánto pa
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { URL_APP } from '../lib/config';
import { BannerRegistro } from '../components/BannerRegistro';

export function ContenidoP02({ dinamicos = {} }: { dinamicos?: { b1?: ReactNode } }) {
  return (
    <div className="wf wf-P02">
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
          IBC para independientes
        </span>
      </nav>
      <header style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "820px" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
          Aportes y planilla · Lectura de 6 minutos
        </span>
        <h1 style={{ margin: "0", fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: "1.08", letterSpacing: "-0.02em" }}>
          IBC para independientes 2026: qué es y cómo calcularlo
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <div aria-hidden="true" style={{ width: "48px", height: "48px", borderRadius: "999px", background: "#E6EEE9" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "14px" }}>
            <span style={{ fontWeight: "600" }}>
              Escrito y revisado por <Link href="/quienes-somos" style={{ color: "inherit", textDecoration: "underline" }}>Nicolás Suárez</Link> con fuentes oficiales
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
          El IBC (Ingreso Base de Cotización) para independientes es el 40% de lo que facturas al mes, antes de IVA. No puede ser menor a 1 salario mínimo ni mayor a 25. Sobre ese valor se calculan la salud, la pensión y la ARL. En 2026 el mínimo es $1.750.905 y el tope, $43.772.625.
        </p>
      </section>
      <div style={{ display: "flex", flexWrap: "wrap-reverse", gap: "48px", alignItems: "flex-start" }}>
        <article className="prose" style={{ flex: "999 1 560px", minWidth: "0", maxWidth: "780px" }}>
          <h2 style={{ marginTop: "0" }}>
            Qué es el IBC para independientes
          </h2>
          <p>
            {"El IBC (ingreso base de cotización) es el valor sobre el que se calculan tus aportes a salud, pensión y "}<Link href="/glosario#arl" style={{ color: "inherit", textDecoration: "underline" }}>ARL</Link>{". Para el IBC de seguridad social de los independientes, la ley fija el 40% del valor mensualizado de tus contratos o de tus ingresos ("}
            <a href="http://www.secretariasenado.gov.co/senado/basedoc/ley_2277_2022.html" target="_blank" rel="noopener">
              artículo 89 de la Ley 2277 de 2022
            </a>
            ). Nunca puede ser menor a un salario mínimo ($1.750.905 en 2026) ni mayor a 25 ($43.772.625).
          </p>
          <p>
            {"¿Por qué el 40%? Porque se supone que el otro 60% cubre los costos de tu actividad. Un empleado cotiza sobre todo su salario y su empleador paga la mayor parte; tú pagas el 100% de los aportes, pero sobre una base menor. Si trabajas por cuenta propia, desde el "}
            <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=275076" target="_blank" rel="noopener">
              Decreto 379 de 2026
            </a>
            {" el 40% se aplica sobre tu ingreso neto, después de costos."}
          </p>
          <h2>
            Cómo calcular el IBC para independientes en 2026
          </h2>
          <ol>
            <li>
              Suma lo que facturaste en el mes (sin IVA).
            </li>
            <li>
              Multiplica por 40%.
            </li>
            <li>
              Si el resultado es menor a $1.750.905 (salario mínimo 2026, Decretos 1469 de 2025 y 0159 de 2026), tu IBC es $1.750.905.
            </li>
            <li>
              Si es mayor a 25 salarios mínimos, tu IBC es el tope.
            </li>
          </ol>
          {dinamicos.b1}
          <h2>
            Ejemplo con ingresos variables o varios contratos
          </h2>
          <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
            <table className="t">
              <thead>
                <tr>
                  <th scope="col">
                    Caso
                  </th>
                  <th scope="col">
                    Ingreso del mes
                  </th>
                  <th scope="col">
                    IBC
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Un contrato
                  </td>
                  <td>
                    $5.000.000
                  </td>
                  <td>
                    $2.000.000
                  </td>
                </tr>
                <tr>
                  <td>
                    Dos contratos
                  </td>
                  <td>
                    $3.000.000 + $4.000.000
                  </td>
                  <td>
                    $2.800.000
                  </td>
                </tr>
                <tr>
                  <td>
                    Mes con ingreso bajo
                  </td>
                  <td>
                    $3.000.000
                  </td>
                  <td>
                    $1.750.905 (mínimo)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "14px", color: "#4A6158" }}>
            Con varios contratos, el IBC es el 40% de la suma de lo que facturas en el mes.
          </p>
          <h2>
            Cómo cambiar el IBC en SOI
          </h2>
          <p>
            En SOI, igual que en los demás operadores, el IBC se ajusta al liquidar la planilla del mes: al elegir planilla tipo I, escribe tu ingreso del periodo o el IBC que quieres usar. El sistema no te deja poner menos del mínimo. Revisa el valor de cada subsistema antes de pagar. Describimos los pasos en texto porque cada operador cambia su interfaz.
          </p>
          <ol>
            <li>
              Ingresa con tu usuario al operador donde pagas.
            </li>
            <li>
              Al liquidar la planilla, actualiza el ingreso del periodo o reporta la novedad de variación de ingreso.
            </li>
            <li>
              Revisa el valor de cada aporte y paga.
            </li>
          </ol>
          <div style={{ margin: "32px 0" }}>
            <BannerRegistro variante="aportes" pagina="P02" />
          </div>
          <h2>
            Preguntas frecuentes
          </h2>
          <details>
            <summary>
              ¿El IBC se calcula sobre lo facturado o sobre lo recibido?
            </summary>
            <p>
              Si tienes contrato de prestación de servicios, sobre el 40% del valor mensualizado del contrato, sin IVA. Como cotizas mes vencido, pagas en la planilla del mes siguiente. Si trabajas por cuenta propia, sin contrato de prestación de servicios, primero descuentas tus costos y sacas el 40% del ingreso neto (
              <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=275076" target="_blank" rel="noopener">
                Decreto 379 de 2026
              </a>
              ).
            </p>
          </details>
          <details>
            <summary>
              ¿Puedo cotizar sobre un IBC mayor al 40%?
            </summary>
            <p>
              Sí. El 40% es la base mínima, no la máxima (
              <a href="https://www.gerencie.com/independientes-pueden-cotizar-sobre-una-base-superior-al-40.html" target="_blank" rel="noopener">
                artículo 89 de la Ley 2277 de 2022
              </a>
              ). Puedes cotizar sobre más para mejorar tu pensión futura, sin pasar de 25 salarios mínimos ($43.772.625 en 2026).
            </p>
          </details>
          <details>
            <summary>
              ¿Qué pasa si no reporto bien mi IBC?
            </summary>
            <p>
              La UGPP fiscaliza los aportes de los independientes y puede cobrar lo que faltó, con intereses y sanciones. Guarda tus facturas y las planillas pagadas.
            </p>
          </details>
          <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #D6E0DA" }}>
            <span style={{ fontWeight: "600" }}>
              Fuentes
            </span>
            <p style={{ fontSize: "15px", color: "#4A6158" }}>
              <a href="http://www.secretariasenado.gov.co/senado/basedoc/ley_2277_2022.html" target="_blank" rel="noopener">
                Ley 2277 de 2022, artículo 89
              </a>
              {" · "}
              <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=87624" target="_blank" rel="noopener">
                Decreto 1273 de 2018
              </a>
              {" · "}
              <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=275076" target="_blank" rel="noopener">
                Decreto 379 de 2026
              </a>
              {" · "}
              <a href="https://acmineria.com.co/wp-content/uploads/2025/12/DECRETO-1469-DEL-29-DE-DICIEMBRE-DE-2025.pdf" target="_blank" rel="noopener">
                Decreto 1469 de 2025
              </a>
              {" · "}
              <a href="https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=192181&dt=S" target="_blank" rel="noopener">
                Decreto 159 de 2026
              </a>
              {" · "}
              <a href="https://www.ugpp.gov.co/" target="_blank" rel="noopener">
                UGPP
              </a>
            </p>
          </div>
        </article>
        <aside style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <nav aria-label="En esta guía" className="card" style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "15px" }}>
            <span style={{ fontWeight: "600" }}>
              En esta guía
            </span>
            <a href="#">
              Qué es el IBC
            </a>
            <a href="#">
              Cómo calcularlo
            </a>
            <a href="#calculadora-ibc">
              Calculadora
            </a>
            <a href="#">
              Ejemplos
            </a>
            <a href="#">
              Cambiarlo en SOI
            </a>
          </nav>
          <div className="card" style={{ background: "#F3F6F4", display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontWeight: "600" }}>
              Después de pagar
            </span>
            <Link href="/guias/descargar-planilla-seguridad-social">
              Cómo descargar y verificar tu planilla de seguridad social
            </Link>
          </div>
          <a className="btn btn-grad" href={URL_APP}>
            Probar la app gratis
          </a>
        </aside>
      </div>
    </div>
    </div>
  );
}
