/* GENERADO por scripts/wireframes-a-tsx.py desde CuentasRentables.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   tablaPesos: Tabla de cuentas generada desde cuentas.ts
 *   tablaDolares: Tabla de cuentas generada desde cuentas.ts
 *   b1:  Aportas cada mes (COP) Durante (meses) Tasa E.A. de la cuenta (%) 
 *   b2:  Habrás apartado {{aportadoTxt}} Intereses ganados {{interesTxt}} Saldo final {{totalTxt}} 
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Isotipo, Wordmark } from '../components/Logo';

export function ContenidoP11({ dinamicos = {} }: { dinamicos?: { tablaPesos?: ReactNode, tablaDolares?: ReactNode, b1?: ReactNode, b2?: ReactNode } }) {
  return (
    <div className="wf wf-P11">
    <div className="wrap" style={{ paddingTop: "32px", paddingBottom: "96px", display: "flex", flexDirection: "column", gap: "36px" }}>
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
        <span>
          Ahorro
        </span>
        <span aria-hidden="true">
          /
        </span>
        <span aria-current="page">
          Cuentas de ahorro de alto rendimiento
        </span>
      </nav>
      <header style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "860px" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
          Ahorro · Lectura de 7 minutos
        </span>
        <h1 style={{ margin: "0", fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: "1.08", letterSpacing: "-0.02em" }}>
          Cuentas de ahorro de alto rendimiento en Colombia: cuáles pagan más en 2026
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <Isotipo tono="manzana" alto={48} />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "14px" }}>
            <span style={{ fontWeight: "600" }}>
              Escrito y revisado por Nicolás Suárez con fuentes oficiales
            </span>
            <span style={{ color: "#4A6158" }}>
              {"Tasas consultadas el 20 de octubre de 2026 · "}
              <a href="#metodologia" style={{ color: "#4A6158" }}>
                Cómo comparamos
              </a>
              {" · "}
              <a href="#transparencia" style={{ color: "#4A6158" }}>
                Transparencia
              </a>
            </span>
          </div>
        </div>
      </header>
      <section aria-label="La respuesta corta" style={{ background: "#E6EEE9", borderRadius: "16px", padding: "24px 28px", maxWidth: "812px", display: "flex", flexDirection: "column", gap: "8px", boxSizing: "border-box" }}>
        <span style={{ fontWeight: "600" }}>
          La respuesta corta
        </span>
        <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#2B4A40" }}>
          Las cuentas de ahorro de alto rendimiento en Colombia pagan hoy entre 5% y 11% efectivo anual sin condiciones, sin plazo fijo y con el dinero disponible (Ualá paga 5% y llega a 10,5% si cumples sus condiciones de compra). Para decidir dónde ahorrar dinero en Colombia mira tres cosas: la tasa E.A., los costos (cuota de manejo y 4x1000) y que la entidad esté vigilada y cubierta por Fogafín.
        </p>
      </section>
      <div role="note" style={{ fontSize: "14px", lineHeight: "1.55", color: "#4A6158", maxWidth: "812px" }}>
        Frilo no recibe pagos de las entidades de esta guía. Los enlaces llevan a la página oficial de cada una y el orden es siempre por tasa, de mayor a menor.
      </div>
      <section aria-labelledby="h-mejores" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 id="h-mejores" style={{ margin: "0", fontSize: "30px", letterSpacing: "-0.01em" }}>
          Mejores cuentas de ahorro en Colombia por rentabilidad
        </h2>
        <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#2B4A40", maxWidth: "812px" }}>
          Las cuentas de ahorro con mayor rentabilidad, comparadas con los mismos criterios y con la fecha en que consultamos cada dato.
        </p>
        {dinamicos.tablaPesos}
        <p style={{ margin: "0", fontSize: "13px", color: "#4A6158", maxWidth: "812px" }}>
          Todas son entidades vigiladas por la Superintendencia Financiera de Colombia. Las tasas cambian seguido: revisamos esta tabla cada semana.
        </p>
      </section>
      <section aria-labelledby="h-usd" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h3 id="h-usd" style={{ margin: "0", fontSize: "22px" }}>
          Si ahorras en dólares
        </h3>
        {dinamicos.tablaDolares}
        <p style={{ margin: "0", fontSize: "13px", color: "#4A6158", maxWidth: "812px" }}>
          {"Una cuenta en dólares no tiene la misma protección que una cuenta de ahorros en pesos. Lee la guía de "}
          <Link href="/guias/cuenta-en-dolares-colombia" style={{ color: "#4A6158" }}>
            cuenta en dólares en Colombia
          </Link>
          .
        </p>
      </section>
      <section aria-labelledby="h-sim" style={{ background: "#0F372D", color: "#FFFFFF", borderRadius: "24px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h2 id="h-sim" style={{ margin: "0", fontSize: "26px", display: "flex", alignItems: "center", gap: "10px" }}>
          <Isotipo tono="manzana" alto={28} />
          ¿Cuánto rendiría lo que apartas?
        </h2>
        {dinamicos.b1}
        {dinamicos.b2}
        <p style={{ margin: "0", fontSize: "13px", color: "#B5CCC1" }}>
          {"Antes de retención en la fuente y 4x1000. Para más opciones (monto inicial, tasa nominal, plazos largos) usa la "}
          <Link href="/calculadoras/interes-compuesto" style={{ color: "#FFFFFF" }}>
            calculadora de interés compuesto
          </Link>
          .
        </p>
      </section>
      <article className="prose" style={{ maxWidth: "812px" }}>
        <h2 style={{ marginTop: "8px" }}>
          Cuentas de ahorro sin cuota de manejo
        </h2>
        <p>
          Pibank, Lulo Bank, RappiPay y Global66 publican cuota de manejo en $0. Nu y Ualá no la indican en las páginas consultadas, aunque Nu sí aclara el costo de retiros: 1 gratis al mes y $6.800 desde el segundo. Además de la cuota, revisa el costo de retiros en cajero, transferencias y la tarjeta débito.
        </p>
        <h2>
          Bancos digitales en Colombia: ¿son seguros y están cubiertos por Fogafín?
        </h2>
        <p>
          Fogafín es el seguro de depósitos del Estado: si una entidad inscrita quiebra, te devuelve tus ahorros hasta un tope por persona y por entidad. Nu informa una cobertura de hasta $50 millones. Entre los bancos digitales y neobancos de Colombia hay bancos (Lulo Bank, Pibank) y compañías de financiamiento (RappiPay, Nu, Ualá). Todas son vigiladas por la Superintendencia Financiera, pero no todas lo dicen igual en su web: revisa la tabla.
        </p>
        <h2>
          ¿CDT o cuenta de ahorros?
        </h2>
        <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
          <table className="t" style={{ minWidth: "560px" }}>
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">
                  Cuenta de ahorros
                </th>
                <th scope="col">
                  CDT
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" style={{ textAlign: "left" }}>
                  Liquidez
                </th>
                <td>
                  Retiras cuando quieras
                </td>
                <td>
                  Dinero amarrado al plazo
                </td>
              </tr>
              <tr>
                <th scope="row" style={{ textAlign: "left" }}>
                  Tasa
                </th>
                <td>
                  Variable: la entidad la puede cambiar
                </td>
                <td>
                  Fija durante el plazo pactado
                </td>
              </tr>
              <tr>
                <th scope="row" style={{ textAlign: "left" }}>
                  Mejor para
                </th>
                <td>
                  Prima y cesantías que usarás en meses
                </td>
                <td>
                  Dinero que no tocarás en un año o más
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2>
          Cómo elegir dónde ahorrar tu prima y tus cesantías
        </h2>
        <ol>
          <li>
            Separa prima y cesantías en bolsillos o cajitas distintas.
          </li>
          <li>
            Elige una cuenta con rentabilidad diaria y retiro inmediato: la prima se usa en junio y diciembre.
          </li>
          <li>
            Marca la cuenta como exenta de 4x1000 si puedes.
          </li>
          <li>
            Revisa la tasa cada mes: cambia seguido.
          </li>
        </ol>
        <p>
          {"Si eres independiente, primero calcula cuánto apartar con la "}
          <Link href="/calculadoras/aportes-independientes">
            calculadora de aportes
          </Link>
          {" y lee "}
          <Link href="/guias/cesantias-independientes">
            cómo crear tus propias cesantías
          </Link>
          .
        </p>
        <h2 id="metodologia">
          Cómo comparamos
        </h2>
        <p>
          Ordenamos solo por tasa efectiva anual publicada por cada entidad en la fecha de consulta. Revisamos las tasas cada [frecuencia].
        </p>
        <h2 id="transparencia">
          Transparencia: nadie nos paga por aparecer aquí
        </h2>
        <p>
          Frilo es un proyecto nuevo y gratuito. Ninguna de estas entidades nos paga por aparecer ni por el orden, y no vendemos tus datos. Si eso cambia algún día, lo diremos en esta página y en cada banner.
        </p>
        <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#4A6158" }}>
          <strong style={{ color: "#0F372D" }}>
            Fuentes oficiales:
          </strong>
          {' '}
          <a href="https://www.fogafin.gov.co/" target="_blank" rel="noopener">
            Fogafín
          </a>
          {" · "}
          <a href="https://www.superfinanciera.gov.co/" target="_blank" rel="noopener">
            Superintendencia Financiera de Colombia
          </a>
        </p>
        <h2>
          Preguntas frecuentes
        </h2>
        <details>
          <summary>
            ¿Qué cuenta de ahorros paga más en Colombia?
          </summary>
          <p>
            Al 20 de octubre de 2026, Pibank y Global66 (en pesos) pagan 11% E.A. sin condiciones. Ualá llega a 10,5% E.A. si haces al menos $400.000 en compras al mes con su tarjeta.
          </p>
        </details>
        <details>
          <summary>
            ¿Dónde pongo a rendir mi dinero si lo voy a necesitar pronto?
          </summary>
          <p>
            En una cuenta de ahorros sin plazo fijo, que liquide intereses sobre el saldo diario. Así gana mientras tanto y puedes sacarlo cuando lo necesites. Un CDT paga una tasa fija pero amarra el dinero al plazo.
          </p>
        </details>
        <details>
          <summary>
            ¿Lulo Bank, Nu, RappiPay, Pibank, Ualá y Global66 son seguros?
          </summary>
          <p>
            {"Las seis están vigiladas por la Superintendencia Financiera. Pibank, Global66 (en pesos), RappiPay, Nu (hasta $50 millones) y Ualá tienen el respaldo del seguro de depósitos de Fogafín. Lulo Bank no lo menciona en la página que consultamos; puedes confirmarlo en el listado de entidades inscritas de "}
            <a href="https://www.fogafin.gov.co/" target="_blank" rel="noopener">
              Fogafín
            </a>
            {" y la vigilancia de cada una en la "}
            <a href="https://www.superfinanciera.gov.co/" target="_blank" rel="noopener">
              Superintendencia Financiera
            </a>
            .
          </p>
        </details>
        <details>
          <summary>
            ¿Qué hacer con la prima?
          </summary>
          <p>
            Lo más común es usarla para gastos de junio y diciembre, pagar deudas caras o reforzar tu fondo de emergencias. Si no la vas a usar de inmediato, déjala en una cuenta que rinda mientras decides.
          </p>
        </details>
        <details>
          <summary>
            ¿En qué invertir la prima?
          </summary>
          <p>
            Ahorrar no es lo mismo que invertir. Una cuenta de ahorros vigilada protege el dinero y paga una tasa conocida. Fondos, acciones o activos digitales pueden rendir más, pero también perder. Esta guía solo compara cuentas de ahorro y no es asesoría financiera.
          </p>
        </details>
        <details>
          <summary>
            ¿Los intereses de la cuenta pagan impuestos?
          </summary>
          <p>
            Sí. Los rendimientos pueden tener retención en la fuente y cuentan para tu declaración de renta. En 2026 la retención sobre intereses o rendimientos financieros es del 7% (
            <a href="https://www.gerencie.com/tabla-de-retencion-en-la-fuente-2026.html" target="_blank" rel="noopener">
              tabla de retención 2026
            </a>
            ). Pibank y Nu la muestran en sus simuladores.
          </p>
        </details>
      </article>
    </div>
    </div>
  );
}
