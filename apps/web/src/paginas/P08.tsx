/* GENERADO por scripts/wireframes-a-tsx.py desde GuiaCuentaDolares.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   (ninguno)
 */
import type { ReactNode } from 'react';
import Link from 'next/link';

export function ContenidoP08({ dinamicos = {} }: { dinamicos?: {  } }) {
  return (
    <div className="wf wf-P08">
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
          Cuenta en dólares en Colombia
        </span>
      </nav>
      <header style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "820px" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
          Pagos en dólares · Lectura de 7 minutos
        </span>
        <h1 style={{ margin: "0", fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: "1.08", letterSpacing: "-0.02em" }}>
          Cuenta en dólares en Colombia: opciones, requisitos y costos
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <div aria-hidden="true" style={{ width: "48px", height: "48px", borderRadius: "999px", background: "#E6EEE9" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "14px" }}>
            <span style={{ fontWeight: "600" }}>
              Escrito y revisado por <Link href="/quienes-somos" style={{ color: "inherit", textDecoration: "underline" }}>Nicolás Suárez</Link> con fuentes oficiales
            </span>
            <span style={{ color: "#4A6158" }}>
              Actualizado el 20 de octubre de 2026 · Datos consultados en la web de cada entidad el 20 de octubre de 2026
            </span>
          </div>
        </div>
      </header>
      <section aria-label="La respuesta corta" style={{ background: "#E6EEE9", borderRadius: "16px", padding: "24px 28px", maxWidth: "772px", display: "flex", flexDirection: "column", gap: "8px", boxSizing: "border-box" }}>
        <span style={{ fontWeight: "600" }}>
          La respuesta corta
        </span>
        <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#2B4A40" }}>
          En Colombia puedes tener una cuenta en dólares de tres formas: en la filial de un banco colombiano en el exterior (Bancolombia en Panamá o Puerto Rico, Davivienda en Panamá), en dólares digitales dentro de tu banco (Cuenta Global de Wenia de Bancolombia) o en una plataforma como Global66 o Littio. Las plataformas se abren en minutos y sin costo; los bancos piden ser cliente o soportar ingresos.
        </p>
      </section>
      <article className="prose" style={{ maxWidth: "820px" }}>
        <h2 style={{ marginTop: "0" }}>
          Qué es una cuenta en dólares
        </h2>
        <p>
          Una cuenta en dólares guarda tu dinero en esa moneda, sin convertirlo a pesos. La diferencia con recibir los dólares en una cuenta en pesos es que tú decides cuándo cambiarlos, en vez de que el banco los convierta el día que llegan con su propia tasa.
        </p>
        <h2>
          Cómo abrir una cuenta en dólares en Colombia
        </h2>
        <ol>
          <li>
            Elige el tipo de cuenta: banco local, filial en el exterior o plataforma digital.
          </li>
          <li>
            Reúne tus documentos: cédula y, según la entidad, soporte de ingresos o contrato.
          </li>
          <li>
            Solicita la apertura en la app o la web de la entidad. Si vas a usar la cuenta para operaciones que deben canalizarse por el mercado cambiario, debe registrarse como cuenta de compensación ante el Banco de la República (
            <a href="https://www.dian.gov.co/atencionciudadano/infoconsulta/Paginas/ControlCambiario.aspx" target="_blank" rel="noopener">
              DIAN, control cambiario
            </a>
            ).
          </li>
        </ol>
        <h2>
          Cuenta de ahorros en dólares: requisitos y costos
        </h2>
        <p>
          Las plataformas digitales no cobran apertura ni cuota de manejo. En los bancos depende del producto: la cuenta internacional de Davivienda no tiene cuota de manejo pero sí límites de saldo, y la Cuenta Global de Wenia de Bancolombia no exige monto mínimo ni cobro mensual. Revisa también el costo por recibir transferencias y la tasa a la que te cambian los dólares a pesos.
        </p>
        <h2>
          Beneficios de una cuenta en dólares
        </h2>
        <ul>
          <li>
            {"Eliges cuándo cambiar a pesos según la "}
            <Link href="/dolar-hoy">
              TRM de hoy
            </Link>
            .
          </li>
          <li>
            Tu ahorro no pierde valor si el peso se devalúa.
          </li>
          <li>
            Pagas servicios y suscripciones en el exterior sin cambiar moneda.
          </li>
        </ul>
        <h2>
          Comparativa de opciones (Bancolombia, Davivienda y otras)
        </h2>
        <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
          <table className="t">
            <caption style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", color: "#4A6158" }}>
              Opciones consultadas el 20 de octubre de 2026 en la web de cada entidad. Frilo no recomienda una en particular.
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  Entidad
                </th>
                <th scope="col">
                  Tipo de cuenta
                </th>
                <th scope="col">
                  Requisitos
                </th>
                <th scope="col">
                  Costo
                </th>
                <th scope="col">
                  Apertura
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <a href="https://panama.bancolombia.com/productos-servicios/cuenta-ahorro-dolares-personas" target="_blank" rel="noopener">
                    Bancolombia
                  </a>
                </td>
                <td>
                  Cuenta de ahorros en dólares en la filial de Panamá o Puerto Rico
                </td>
                <td>
                  Colombiano con cédula, residente en Colombia, sin residencia fiscal ni actividad en Panamá o Puerto Rico; soporte de ingresos (carta laboral, certificado de pensión o declaración de renta); datos de beneficiarios
                </td>
                <td>
                  Sin costo de apertura en línea
                </td>
                <td>
                  En la app Mi Bancolombia, la app de Inversiones o la Sucursal Virtual Inversiones
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://www.bancolombia.com/personas/cuentas/ahorros-y-corriente/global-wenia" target="_blank" rel="noopener">
                    Bancolombia, Wenia
                  </a>
                </td>
                <td>
                  Cuenta Global de Wenia en dólares digitales (USDW)
                </td>
                <td>
                  Cédula colombiana, cuenta de ahorros o corriente activa en Bancolombia y dirección actualizada
                </td>
                <td>
                  Sin monto mínimo ni cobro mensual de manejo
                </td>
                <td>
                  100% digital en la app Mi Bancolombia
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://www.davivienda.com/personas/cuentas/cuenta-internacional" target="_blank" rel="noopener">
                    Davivienda
                  </a>
                </td>
                <td>
                  Cuenta de ahorros internacional en dólares (Banco Davivienda Panamá S.A.)
                </td>
                <td>
                  Cuenta activa en pesos en Davivienda, app Davivienda con clave virtual, cédula y formulario de ingresos y origen de recursos
                </td>
                <td>
                  USD 0 de manejo; tope de USD 5.000 de saldo y USD 5.000 al mes en transacciones; tarjeta débito opcional USD 25 al año + 7% ITBMS
                </td>
                <td>
                  Digital, en la app
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://www.global66.com/co/cuenta-en-dolares/" target="_blank" rel="noopener">
                    Global66
                  </a>
                </td>
                <td>
                  Cuenta global en dólares (custodia en Panamá)
                </td>
                <td>
                  Mayor de edad, documento de identidad vigente y registro en la app o la web
                </td>
                <td>
                  Sin costo de apertura ni mantenimiento; rinde hasta 6% E.A. en dólares
                </td>
                <td>
                  Menos de 5 minutos, 100% digital
                </td>
              </tr>
              <tr>
                <td>
                  <a href="https://littio.co/cuenta-en-dolares" target="_blank" rel="noopener">
                    Littio
                  </a>
                </td>
                <td>
                  Cuenta en dólares con activos digitales (USDC); no vigilada por la Superintendencia Financiera
                </td>
                <td>
                  App, documento de identidad de un país permitido, correo, celular y datos personales
                </td>
                <td>
                  $0 cuota de manejo; USD 2,99 por recibir o enviar a EE. UU. o Europa; rinde hasta 6% u 8% E.A., sin garantía
                </td>
                <td>
                  Digital, sin costo de apertura
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ margin: "40px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          <div className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "6px" , position: "relative"}}>
<Link href="/guias/recibir-pagos-en-dolares-colombia" className="card-enlace" style={{ fontSize: "13px", fontWeight: "600", color: "#4A6158" , textDecoration: "none"}}>
Siguiente paso
</Link>
<span style={{ fontWeight: "600", fontSize: "17px" }}>
              Cómo recibir pagos del exterior en dólares en Colombia
            </span>
</div>
          <div className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "6px" , position: "relative"}}>
<Link href="/dolar-hoy" className="card-enlace" style={{ fontSize: "13px", fontWeight: "600", color: "#4A6158" , textDecoration: "none"}}>
Alerta gratis
</Link>
<span style={{ fontWeight: "600", fontSize: "17px" }}>
              Avísame cuando el dólar llegue a mi precio
            </span>
</div>
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
          <a href="https://www.superfinanciera.gov.co/" target="_blank" rel="noopener">
            Superintendencia Financiera de Colombia
          </a>
        </p>
        <h2>
          Preguntas frecuentes
        </h2>
        <details>
          <summary>
            ¿Un freelancer puede abrir una cuenta en dólares en Colombia?
          </summary>
          <p>
            Sí. Puedes abrirla en un banco con filial en el exterior o usar una plataforma digital. Revisa si la entidad está vigilada por la Superintendencia Financiera: algunas plataformas, como Littio, no lo están y no tienen el respaldo de Fogafín.
          </p>
        </details>
        <details>
          <summary>
            ¿Tengo que declarar una cuenta en dólares?
          </summary>
          <p>
            {"Los saldos y los ingresos en dólares se incluyen en tu declaración de renta. En lo cambiario, la DIAN explica que las operaciones de canalización obligatoria se hacen por intermediarios del mercado cambiario o por cuentas de compensación registradas en el Banco de la República, con declaración de cambio, y que debes guardar los soportes por cinco años. Revisa tu caso en la página de "}
            <a href="https://www.dian.gov.co/atencionciudadano/infoconsulta/Paginas/ControlCambiario.aspx" target="_blank" rel="noopener">
              control cambiario de la DIAN
            </a>
            .
          </p>
        </details>
        <details>
          <summary>
            ¿Cuánto cobran por recibir una transferencia en dólares?
          </summary>
          <p>
            Depende de la entidad. Por ejemplo, Littio cobra USD 2,99 por recibir desde EE. UU. o Europa (consultado el 20 de octubre de 2026). Además, al pasar a pesos se aplica la tasa de la entidad, no la TRM.
          </p>
        </details>
      </article>
    </div>
    </div>
  );
}
