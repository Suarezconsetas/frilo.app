/* GENERADO por scripts/wireframes-a-tsx.py desde GlosarioSLN.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   (ninguno)
 */
import type { ReactNode } from 'react';
import Link from 'next/link';

export function ContenidoP06({ dinamicos = {} }: { dinamicos?: {  } }) {
  return (
    <div className="wf wf-P06">
    <div className="wrap" style={{ paddingTop: "32px", paddingBottom: "96px", display: "flex", flexDirection: "column", gap: "28px" }}>
      <nav aria-label="Ruta de navegación" style={{ fontSize: "14px", color: "#4A6158", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <Link href="/" style={{ color: "#4A6158" }}>
          Inicio
        </Link>
        <span aria-hidden="true">
          /
        </span>
        <a href="#" style={{ color: "#4A6158" }}>
          Glosario
        </a>
        <span aria-hidden="true">
          /
        </span>
        <span aria-current="page">
          SLN
        </span>
      </nav>
      <header style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
          Glosario de la planilla
        </span>
        <h1 style={{ margin: "0", fontSize: "clamp(32px, 4vw, 46px)", lineHeight: "1.1", letterSpacing: "-0.02em" }}>
          Qué significa SLN en la planilla de seguridad social
        </h1>
        <p style={{ margin: "0", fontSize: "20px", lineHeight: "1.55", color: "#0F372D" }}>
          <strong>
            SLN
          </strong>
          {" es la novedad de la planilla PILA que reporta una suspensión temporal del contrato de trabajo, una licencia no remunerada o una comisión de servicios. Durante esos días el trabajador no aporta a salud ni a pensión, no se paga ARL y el aporte a salud lo asume el empleador."}
        </p>
        <p style={{ margin: "0", fontSize: "14px", color: "#4A6158" }}>
          {"Actualizado el 20 de octubre de 2026 · Escrito y revisado por Nicolás Suárez con fuentes oficiales · Fuente: "}
          <a href="https://www.unidadvictimas.gov.co/wp-content/uploads/Documentos/resoluciones/RESOLUCI%c3%93N_2388_2016.pdf" target="_blank" rel="noopener" style={{ color: "#4A6158" }}>
            Resolución 2388 de 2016 del Ministerio de Salud
          </a>
          {" (estructura de la PILA)"}
        </p>
      </header>
      <article className="prose">
        <h2>
          Qué significa SLN
        </h2>
        <p>
          La PILA (Planilla Integrada de Liquidación de Aportes) es el formato único, electrónico o asistido, con el que trabajadores y empleadores liquidan y pagan en un solo trámite salud, pensión, riesgos laborales, caja de compensación y parafiscales. SLN es una de las novedades que se reportan en ella. Le dice al sistema que, durante ciertos días del mes, el trabajador no prestó servicios ni recibió salario por una suspensión, una licencia no remunerada o una comisión. Se reporta con las fechas de inicio y fin para que esos días se liquiden distinto.
        </p>
        <h2>
          Cuándo se reporta la novedad SLN
        </h2>
        <ul>
          <li>
            Licencia no remunerada que el empleador concede al trabajador.
          </li>
          <li>
            Suspensión temporal del contrato de trabajo.
          </li>
          <li>
            Comisión de servicios.
          </li>
        </ul>
        <h2>
          Cómo afecta los aportes
        </h2>
        <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
          <table className="t">
            <caption style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", color: "#4A6158" }}>
              Aportes durante los días reportados con SLN
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  Subsistema
                </th>
                <th scope="col">
                  ¿Se paga?
                </th>
                <th scope="col">
                  Detalle
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Salud
                </td>
                <td>
                  Sí
                </td>
                <td>
                  Lo paga el empleador con la tarifa a su cargo. El trabajador no aporta, pero conserva la cobertura para él y su familia.
                </td>
              </tr>
              <tr>
                <td>
                  Pensión
                </td>
                <td>
                  No
                </td>
                <td>
                  No se cotiza por esos días, salvo que el afiliado haga aportes voluntarios.
                </td>
              </tr>
              <tr>
                <td>
                  Riesgos laborales (ARL)
                </td>
                <td>
                  No
                </td>
                <td>
                  El trabajador no está ejerciendo ninguna labor.
                </td>
              </tr>
              <tr>
                <td>
                  Caja de compensación y parafiscales
                </td>
                <td>
                  Depende
                </td>
                <td>
                  Se ajustan según los días no laborados, si la suspensión es total o parcial.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          {"Fuentes: "}
          <a href="https://aportesenlinea.custhelp.com/app/answers/detail/a_id/575/~/novedad-sln%2C-aporte-y-prestaci%C3%B3n-del-servicio-salud" target="_blank" rel="noopener">
            Aportes en Línea, novedad SLN y salud
          </a>
          {" · "}
          <a href="https://aportesenlinea.custhelp.com/app/answers/detail/a_id/34/~/novedades-durante-una-novedad-de-sln" target="_blank" rel="noopener">
            Aportes en Línea, novedades durante una SLN
          </a>
          {" · "}
          <a href="https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/OT/anexo-tecnico1-glosario.pdf" target="_blank" rel="noopener">
            Ministerio de Salud, glosario de términos PILA (Anexo Técnico 1)
          </a>
          {" · "}
          <a href="https://normativa.colpensiones.gov.co/compilacion/docs/resolucion_minsaludps_2388_2016.htm" target="_blank" rel="noopener">
            Resolución 2388 de 2016, Anexo Técnico 1 (glosario de la PILA)
          </a>
        </p>
        <h2>
          Otras novedades de la planilla
        </h2>
        <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
          <table className="t">
            <caption style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", color: "#4A6158" }}>
              Siglas de novedades en la PILA, según el glosario de la Resolución 2388 de 2016 (Anexo Técnico 1)
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  Sigla
                </th>
                <th scope="col">
                  Significado
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  ING
                </td>
                <td>
                  Ingreso
                </td>
              </tr>
              <tr>
                <td>
                  RET
                </td>
                <td>
                  Retiro
                </td>
              </tr>
              <tr>
                <td>
                  TDE
                </td>
                <td>
                  Traslado desde otra EPS o EOC
                </td>
              </tr>
              <tr>
                <td>
                  TAE
                </td>
                <td>
                  Traslado a otra EPS o EOC
                </td>
              </tr>
              <tr>
                <td>
                  TDP
                </td>
                <td>
                  Traslado desde otra administradora de pensiones
                </td>
              </tr>
              <tr>
                <td>
                  TAP
                </td>
                <td>
                  Traslado a otra administradora de pensiones
                </td>
              </tr>
              <tr>
                <td>
                  VSP
                </td>
                <td>
                  Variación permanente de salario
                </td>
              </tr>
              <tr>
                <td>
                  —
                </td>
                <td>
                  Correcciones (se reportan con una A o una C; no tienen sigla propia)
                </td>
              </tr>
              <tr>
                <td>
                  VST
                </td>
                <td>
                  Variación transitoria del salario
                </td>
              </tr>
              <tr>
                <td>
                  SLN
                </td>
                <td>
                  Suspensión temporal del contrato de trabajo o licencia no remunerada o comisión de servicios
                </td>
              </tr>
              <tr>
                <td>
                  IGE
                </td>
                <td>
                  Incapacidad temporal por enfermedad general o licencia por cuidado de la niñez
                </td>
              </tr>
              <tr>
                <td>
                  LMA
                </td>
                <td>
                  Licencia de maternidad o de paternidad
                </td>
              </tr>
              <tr>
                <td>
                  VAC-LR
                </td>
                <td>
                  Vacaciones o licencia remunerada
                </td>
              </tr>
              <tr>
                <td>
                  AVP
                </td>
                <td>
                  Aporte voluntario
                </td>
              </tr>
              <tr>
                <td>
                  VCT
                </td>
                <td>
                  Variación de centros de trabajo
                </td>
              </tr>
              <tr>
                <td>
                  IRP / IRL
                </td>
                <td>
                  Incapacidad por accidente de trabajo o enfermedad laboral (el glosario la llama IRP; el campo de días de la planilla se llama IRL)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "40px", background: "#E6EEE9", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontWeight: "600", fontSize: "17px" }}>
            Sigue con tu planilla
          </span>
          <Link href="/guias/descargar-planilla-seguridad-social">
            Cómo descargar y verificar tu planilla de seguridad social
          </Link>
          <Link href="/calculadoras/aportes-independientes">
            Calculadora de aportes para independientes 2026
          </Link>
        </div>
      </article>
    </div>
    </div>
  );
}
