/* GENERADO por scripts/wireframes-a-tsx.py desde GuiaDescargarPlanilla.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   (ninguno)
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { URL_APP } from '../lib/config';
import { BannerRegistro } from '../components/BannerRegistro';

export function ContenidoP04({ dinamicos = {} }: { dinamicos?: {  } }) {
  return (
    <div className="wf wf-P04">
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
          Descargar la planilla
        </span>
      </nav>
      <header style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "820px" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
          Aportes y planilla · Lectura de 5 minutos
        </span>
        <h1 style={{ margin: "0", fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: "1.08", letterSpacing: "-0.02em" }}>
          Cómo descargar y verificar tu planilla de seguridad social
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <div aria-hidden="true" style={{ width: "48px", height: "48px", borderRadius: "999px", background: "#E6EEE9" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "14px" }}>
            <span style={{ fontWeight: "600" }}>
              Por Nicolás Suárez · Revisado por el equipo de finanzas Frilo
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
          Para descargar la planilla de seguridad social (PILA) entra al portal del operador de información donde pagaste: Miplanilla, Aportes en Línea, Pago Simple o Enlace Operativo, entre otros. Busca la opción de certificados o consultas, elige el periodo y descarga el PDF. Para verificarla, consulta el número de planilla en el mismo operador.
        </p>
      </section>
      <div style={{ display: "flex", flexWrap: "wrap-reverse", gap: "48px", alignItems: "flex-start" }}>
        <article className="prose" style={{ flex: "999 1 560px", minWidth: "0", maxWidth: "780px" }}>
          <h2 style={{ marginTop: "0" }}>
            Cómo descargar la planilla de seguridad social
          </h2>
          <p>
            Puedes descargar tu planilla o certificado de seguridad social (PILA) directamente en el portal del operador de información autorizado donde pagaste:
          </p>
          <ul>
            <li>
              <strong>
                Miplanilla:
              </strong>
              {" entra al "}
              <a href="https://independientes2.miplanilla.com/RegistroIndependiente/Certificado/CertificadoAgil" target="_blank" rel="noopener">
                Certificado Ágil de Miplanilla
              </a>
              {" o a "}
              <a href="https://independientes2.miplanilla.com/PublicoIndependientes/Publico/IndexIndependientes" target="_blank" rel="noopener">
                Miplanilla Independientes
              </a>
              {" para consultar y generar tus certificados."}
            </li>
            <li>
              <strong>
                Aportes en Línea:
              </strong>
              {" genera tu certificado de aportes en el portal de "}
              <a href="https://empresas.aportesenlinea.com/Autoservicio/CertificadoAportes.aspx" target="_blank" rel="noopener">
                Aportes en Línea
              </a>
              .
            </li>
            <li>
              <strong>
                Pago Simple:
              </strong>
              {" consulta tus pagos y descarga soportes en "}
              <a href="https://pagosimple.com/consultas-y-certificados/" target="_blank" rel="noopener">
                consultas y certificados de Pago Simple
              </a>
              .
            </li>
            <li>
              <strong>
                Enlace Operativo:
              </strong>
              {" entra con tu usuario y contraseña para ver el estado de tus planillas pagadas y descargar el PDF ("}
              <a href="https://enlace.com.co/blog/descargar-comprobante-pago-pila" target="_blank" rel="noopener">
                guía de Enlace Operativo
              </a>
              ).
            </li>
          </ul>
          <p>
            En todos los casos el proceso es el mismo:
          </p>
          <ol>
            <li>
              Entra al portal del operador donde pagaste.
            </li>
            <li>
              Busca la opción de certificados, consultas o comprobantes de pago.
            </li>
            <li>
              Escribe tu tipo y número de documento y elige el periodo.
            </li>
            <li>
              Descarga el PDF de la planilla o del certificado de aportes.
            </li>
          </ol>
          <h2>
            Cómo verificar una planilla de seguridad social
          </h2>
          <p>
            Busca la planilla por su número en el portal del operador donde pagaste: debe aparecer como pagada. Si quieres confirmar que el pago llegó a cada entidad, revisa tu historial en la EPS, el fondo de pensiones y la ARL.
          </p>
          <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
            <table className="t">
              <thead>
                <tr>
                  <th scope="col" />
                  <th scope="col">
                    Descargar
                  </th>
                  <th scope="col">
                    Verificar
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" style={{ textAlign: "left" }}>
                    Dónde
                  </th>
                  <td>
                    Operador donde pagaste
                  </td>
                  <td>
                    Operador o entidad (EPS, fondo)
                  </td>
                </tr>
                <tr>
                  <th scope="row" style={{ textAlign: "left" }}>
                    Qué necesitas
                  </th>
                  <td>
                    Documento y periodo
                  </td>
                  <td>
                    Número de planilla
                  </td>
                </tr>
                <tr>
                  <th scope="row" style={{ textAlign: "left" }}>
                    Cuándo
                  </th>
                  <td>
                    Después del pago, cuando el operador lo confirma
                  </td>
                  <td>
                    Cuando el operador reporta el pago a cada entidad
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h2>
            Planilla de seguridad social para independientes
          </h2>
          <p>
            {"Si eres independiente, tu planilla es tipo I y pagas sobre tu "}
            <Link href="/guias/ibc-independientes">
              IBC para independientes
            </Link>
            {". Antes de pagar, revisa el valor con la "}
            <Link href="/calculadoras/aportes-independientes">
              calculadora de aportes
            </Link>
            {". Si ves una novedad como "}
            <Link href="/glosario/sln">
              SLN en la planilla
            </Link>
            , aquí explicamos qué significa.
          </p>
          <h2>
            Fechas de pago de la planilla
          </h2>
          <p>
            {"Tu fecha límite depende de los dos últimos dígitos de tu documento. Consulta la tuya en "}
            <Link href="/calculadoras/fecha-pago-planilla">
              fechas de pago de la planilla de seguridad social
            </Link>
            .
          </p>
          <div style={{ margin: "32px 0" }}>
            <BannerRegistro variante="recordatorio" pagina="P04" />
          </div>
          <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#4A6158" }}>
            <strong style={{ color: "#0F372D" }}>
              Fuentes oficiales:
            </strong>
            {' '}
            <a href="https://www.unidadvictimas.gov.co/wp-content/uploads/Documentos/resoluciones/RESOLUCI%c3%93N_2388_2016.pdf" target="_blank" rel="noopener">
              Resolución 2388 de 2016 (PILA)
            </a>
            {" · "}
            <a href="https://www.minsalud.gov.co/" target="_blank" rel="noopener">
              Ministerio de Salud
            </a>
            {" · "}
            <a href="https://www.ugpp.gov.co/" target="_blank" rel="noopener">
              UGPP
            </a>
          </p>
          <h2>
            Preguntas frecuentes
          </h2>
          <details>
            <summary>
              ¿Puedo descargar la planilla si pagué en otro operador?
            </summary>
            <p>
              No. Cada operador guarda solo las planillas que se pagaron con él. Entra al portal del operador donde hiciste el pago.
            </p>
          </details>
          <details>
            <summary>
              ¿Cuánto tarda en aparecer el pago?
            </summary>
            <p>
              Depende del operador y del medio de pago. Si no aparece, revisa con el número de planilla en el portal del operador o comunícate con su línea de atención.
            </p>
          </details>
          <details>
            <summary>
              ¿La planilla sirve como certificado para mi contratante?
            </summary>
            <p>
              Sí. Los contratantes suelen pedir la planilla pagada del periodo para pagar tus honorarios, porque deben verificar que cotizaste.
            </p>
          </details>
        </article>
        <aside style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <nav aria-label="En esta guía" className="card" style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "15px" }}>
            <span style={{ fontWeight: "600" }}>
              En esta guía
            </span>
            <a href="#">
              Descargar la planilla
            </a>
            <a href="#">
              Verificar la planilla
            </a>
            <a href="#">
              Independientes
            </a>
            <a href="#">
              Fechas de pago
            </a>
          </nav>
          <div className="card" style={{ background: "#F3F6F4", display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontWeight: "600" }}>
              Te avisamos tu fecha de pago cada mes
            </span>
            <span style={{ fontSize: "15px", color: "#4A6158" }}>
              Según los dos últimos dígitos de tu documento.
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
