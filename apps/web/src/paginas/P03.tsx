/* GENERADO por scripts/wireframes-a-tsx.py desde Cesantias.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   b1:  Tengo contrato laboral Soy independiente Salario mensual (COP) Si ganas hasta 2 salarios mínimos, súmale el a
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { BannerRendimiento } from '../components/BannerRendimiento';
import { BannerRegistro } from '../components/BannerRegistro';

export function ContenidoP03({ dinamicos = {} }: { dinamicos?: { b1?: ReactNode } }) {
  return (
    <div className="wf wf-P03">
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
          Cesantías e intereses
        </span>
      </nav>
      <header style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "820px" }}>
        <h1 style={{ margin: "0", fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: "1.08", letterSpacing: "-0.02em" }}>
          Calculadora de cesantías e intereses de cesantías 2026
        </h1>
        <p style={{ margin: "0", fontSize: "19px", lineHeight: "1.55", color: "#2B4A40" }}>
          Las cesantías equivalen a un mes de salario por año trabajado: salario × días trabajados ÷ 360. Los intereses de cesantías son el 12% anual sobre ese valor y los paga el empleador. Esta calculadora de intereses de cesantías en Colombia sirve con contrato laboral o como independiente.
        </p>
        <p style={{ margin: "0", fontSize: "14px", color: "#4A6158" }}>
          {"Actualizada el 20 de octubre de 2026 · Revisada por el equipo de finanzas Frilo · "}
          <a href="#como" style={{ color: "#4A6158" }}>
            Cómo calculamos
          </a>
        </p>
      </header>
      {dinamicos.b1}
      <BannerRendimiento variante="cesantias" pagina="P03" />
      <article className="prose" style={{ maxWidth: "780px" }}>
        <h2 id="como" style={{ marginTop: "16px" }}>
          Cómo se calculan las cesantías y sus intereses
        </h2>
        <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
          <table className="t">
            <thead>
              <tr>
                <th scope="col">
                  Concepto
                </th>
                <th scope="col">
                  Fórmula
                </th>
                <th scope="col">
                  Cuándo se paga
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Cesantías
                </td>
                <td>
                  Salario × días ÷ 360
                </td>
                <td>
                  Consignación al fondo a más tardar el 14 de febrero
                </td>
              </tr>
              <tr>
                <td>
                  Intereses de cesantías
                </td>
                <td>
                  Cesantías × días × 12% ÷ 360
                </td>
                <td>
                  Al trabajador a más tardar el 31 de enero
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Ejemplo: salario de $3.000.000 y 360 días trabajados en 2025. Como gana más de 2 salarios mínimos, no suma auxilio de transporte.
        </p>
        <ol>
          <li>
            Cesantías: $3.000.000 × 360 ÷ 360 = $3.000.000, que se consignan al fondo.
          </li>
          <li>
            Intereses: $3.000.000 × 360 × 12% ÷ 360 = $360.000, que se pagan al trabajador.
          </li>
        </ol>
        <h2>
          Calcular cesantías de años anteriores
        </h2>
        <p>
          {"Elige el año en la calculadora: la fórmula es la misma y solo cambian el salario mínimo y el auxilio de transporte de ese año. "}
        </p>
        <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
          <table className="t">
            <caption style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", color: "#4A6158" }}>
              {"Salario mínimo y auxilio de transporte por año (fuente histórica: "}
              <a href="https://www.gerencie.com/historico-del-salario-minimo-en-colombia.html" target="_blank" rel="noopener">
                Gerencie
              </a>
              )
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  Año
                </th>
                <th scope="col">
                  Salario mínimo
                </th>
                <th scope="col">
                  Auxilio de transporte
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  2026
                </td>
                <td>
                  $1.750.905 (Decretos 1469 de 2025 y 0159 de 2026)
                </td>
                <td>
                  $249.095 (Decreto 1470 de 2025)
                </td>
              </tr>
              <tr>
                <td>
                  2025
                </td>
                <td>
                  $1.423.500
                </td>
                <td>
                  $200.000
                </td>
              </tr>
              <tr>
                <td>
                  2024
                </td>
                <td>
                  $1.300.000
                </td>
                <td>
                  $162.000
                </td>
              </tr>
              <tr>
                <td>
                  2023
                </td>
                <td>
                  $1.160.000
                </td>
                <td>
                  $140.606
                </td>
              </tr>
              <tr>
                <td>
                  2022
                </td>
                <td>
                  $1.000.000
                </td>
                <td>
                  $117.172
                </td>
              </tr>
              <tr>
                <td>
                  2021
                </td>
                <td>
                  $908.526
                </td>
                <td>
                  $106.454
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2>
          Si eres independiente: cuánto apartar para tus propias cesantías
        </h2>
        <p>
          {"Aparta el 8,33% de cada pago. Lee la guía completa de "}
          <Link href="/guias/cesantias-independientes">
            cesantías para independientes
          </Link>
          {" y, si además quieres saber cuánto pagas de planilla, usa la "}
          <Link href="/calculadoras/aportes-independientes">
            calculadora de aportes para independientes
          </Link>
          .
        </p>
        <h2>
          Calculadora de cesantías de Porvenir y otros fondos
        </h2>
        <p>
          Porvenir, Protección, Colfondos y Skandia muestran tu saldo en sus portales. Esta calculadora sirve para verificar que el valor consignado coincide con lo que te corresponde. Si no coincide, pide el detalle de la liquidación a tu empleador antes de reclamar al fondo.
        </p>
        <h2>
          Preguntas frecuentes
        </h2>
        <details>
          <summary>
            ¿Cuándo pagan los intereses de cesantías en 2026?
          </summary>
          <p>
            Los intereses de las cesantías de 2025 se pagan directamente al trabajador a más tardar el 31 de enero de 2026. Las cesantías se consignan al fondo a más tardar el 14 de febrero.
          </p>
        </details>
        <details>
          <summary>
            ¿Qué pasa si el empleador no consigna las cesantías a tiempo?
          </summary>
          <p>
            Debe pagar una sanción moratoria: un día de salario por cada día de retraso en la consignación (
            <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=281" target="_blank" rel="noopener">
              Ley 50 de 1990, artículo 99
            </a>
            ).
          </p>
        </details>
        <details>
          <summary>
            ¿El auxilio de transporte se incluye en las cesantías?
          </summary>
          <p>
            Sí. Si ganas hasta 2 salarios mínimos y tienes derecho al auxilio de transporte ($249.095 en 2026), se suma al salario para liquidar las cesantías y sus intereses.
          </p>
        </details>
        <details>
          <summary>
            ¿Un independiente tiene derecho a cesantías?
          </summary>
          <p>
            {"No por su contrato. Puede crear las suyas apartando el 8,33% de cada pago. "}
            <Link href="/guias/cesantias-independientes">
              Ver la guía
            </Link>
            .
          </p>
        </details>
        <div style={{ margin: "40px 0" }}>
          <BannerRegistro variante="prima" pagina="P03" />
        </div>
        <h2>
          Fuentes
        </h2>
        <ul>
          <li>
            <a href="http://www.secretariasenado.gov.co/senado/basedoc/codigo_sustantivo_trabajo.html" target="_blank" rel="noopener">
              Código Sustantivo del Trabajo
            </a>
            , artículos 249 y siguientes
          </li>
          <li>
            <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=281" target="_blank" rel="noopener">
              Ley 50 de 1990
            </a>
            , artículo 99
          </li>
          <li>
            Ley 52 de 1975 (intereses de cesantías)
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
            <a href="https://cancilleria.gov.co/normograma/compilacion/docs/decreto_1470_2025.htm" target="_blank" rel="noopener">
              Decreto 1470 de 2025
            </a>
            {" (auxilio de transporte 2026)"}
          </li>
        </ul>
      </article>
    </div>
    </div>
  );
}
