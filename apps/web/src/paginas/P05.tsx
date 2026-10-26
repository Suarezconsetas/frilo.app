/* GENERADO por scripts/wireframes-a-tsx.py desde FechaPago.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   b1:  Dos últimos dígitos de tu documento Ejemplo: si tu cédula termina en 1.234.567 89 , escribe 89. Mes en que va
 *   b2:  Día hábil límite de pago según el artículo 3.2.2.1 del Decreto 1990 de 2016. Aplica a todos los aportantes, i
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { BannerRegistro } from '../components/BannerRegistro';

export function ContenidoP05({ dinamicos = {} }: { dinamicos?: { b1?: ReactNode, b2?: ReactNode } }) {
  return (
    <div className="wf wf-P05">
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
          Fecha de pago de la planilla
        </span>
      </nav>
      <header style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "820px" }}>
        <h1 style={{ margin: "0", fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: "1.08", letterSpacing: "-0.02em" }}>
          Fechas de pago de la planilla de seguridad social 2026
        </h1>
        <p style={{ margin: "0", fontSize: "19px", lineHeight: "1.55", color: "#2B4A40" }}>
          La fecha de pago de la planilla de seguridad social depende de los dos últimos dígitos de tu documento: va del segundo al decimosexto día hábil de cada mes. Escribe tus dígitos y te decimos tu día límite.
        </p>
        <p style={{ margin: "0", fontSize: "14px", color: "#4A6158" }}>
          {"Actualizada el 20 de octubre de 2026 · Escrito y revisado por "}<Link href="/quienes-somos" style={{ color: "inherit", textDecoration: "underline" }}>Nicolás Suárez</Link>{" con fuentes oficiales · Fuente: "}
          <a href="https://normativa.colpensiones.gov.co/compilacion/docs/decreto_1990_2016.htm" target="_blank" rel="noopener" style={{ color: "#4A6158" }}>
            Decreto 1990 de 2016, artículo 3.2.2.1
          </a>
        </p>
      </header>
      {dinamicos.b1}
      <BannerRegistro variante="recordatorio" pagina="P05" />
      <article className="prose" style={{ maxWidth: "820px" }}>
        <h2 style={{ marginTop: "16px" }}>
          Calendario de pago según los dos últimos dígitos del documento
        </h2>
        {dinamicos.b2}
        <h2>
          Qué pasa si pagas la planilla después de la fecha
        </h2>
        <p>
          {"Pagas intereses de mora por cada día de retraso, liquidados a la tasa de usura vigente (los calcula el operador al liquidar la planilla). Si dejas de pagar, la "}
          <a href="https://www.ugpp.gov.co/" target="_blank" rel="noopener">
            UGPP
          </a>
          {" puede cobrarte los aportes con sanciones, y tu EPS puede suspender la atención mientras estés en mora. Si se te pasó la fecha, paga cuanto antes: los intereses crecen cada día."}
        </p>
        <h2>
          Fechas para independientes
        </h2>
        <p>
          Los independientes cotizan mes vencido: lo que facturas en octubre se paga en la planilla de noviembre (
          <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=87624" target="_blank" rel="noopener">
            Decreto 1273 de 2018
          </a>
          {"). Si aún no sabes cuánto pagar, usa la "}
          <Link href="/calculadoras/aportes-independientes">
            calculadora de aportes para independientes
          </Link>
          {". Después de pagar, aprende a "}
          <Link href="/guias/descargar-planilla-seguridad-social">
            descargar y verificar tu planilla de seguridad social
          </Link>
          .
        </p>
        <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#4A6158" }}>
          <strong style={{ color: "#0F372D" }}>
            Fuentes oficiales:
          </strong>
          {' '}
          <a href="https://normativa.colpensiones.gov.co/compilacion/docs/decreto_1990_2016.htm" target="_blank" rel="noopener">
            Decreto 1990 de 2016
          </a>
          {" · "}
          <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=87624" target="_blank" rel="noopener">
            Decreto 1273 de 2018
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
            ¿Qué pasa si la fecha cae en festivo?
          </summary>
          <p>
            No puede caer en festivo: el plazo se cuenta en días hábiles, así que los sábados, domingos y festivos no cuentan. Por eso tu fecha cambia de un mes a otro aunque tus dígitos sean los mismos.
          </p>
        </details>
        <details>
          <summary>
            ¿Uso los dígitos de la cédula o del NIT?
          </summary>
          <p>
            Los dos últimos dígitos del documento con el que pagas la planilla. Si pagas con tu NIT, toma los dos últimos dígitos incluyendo el dígito de verificación.
          </p>
        </details>
        <details>
          <summary>
            ¿Puedo pagar antes de mi fecha?
          </summary>
          <p>
            Sí. La fecha es el límite, no el único día posible. Puedes pagar desde que el operador habilita el periodo.
          </p>
        </details>
        <details>
          <summary>
            ¿Frilo me puede avisar cada mes?
          </summary>
          <p>
            Sí. Crea tu cuenta gratis, escribe los dos últimos dígitos de tu documento y te enviamos un correo 3 días hábiles antes y el mismo día de tu fecha límite.
          </p>
        </details>
      </article>
    </div>
    </div>
  );
}
