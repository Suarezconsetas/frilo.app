/* GENERADO por scripts/wireframes-a-tsx.py desde Guia.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   b1: Ingreso mensual (COP) 
 *   b2:  Aparta cada mes {{mesTxt}} En febrero tendrías {{anioTxt}} 
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { URL_APP } from '../lib/config';
import { BannerRendimiento } from '../components/BannerRendimiento';
import { BannerRegistro } from '../components/BannerRegistro';

export function ContenidoP12({ dinamicos = {} }: { dinamicos?: { b1?: ReactNode, b2?: ReactNode } }) {
  return (
    <div className="wf wf-P12">
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
          Cesantías para independientes
        </span>
      </nav>
      <header style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "820px" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#4A6158" }}>
          Prima y cesantías · Lectura de 8 minutos
        </span>
        <h1 style={{ margin: "0", fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: "1.08", letterSpacing: "-0.02em" }}>
          Cesantías para independientes: cómo crear las tuyas si tu contrato no las trae
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <div aria-hidden="true" style={{ width: "48px", height: "48px", borderRadius: "999px", background: "#E6EEE9" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "14px" }}>
            <span style={{ fontWeight: "600" }}>
              Por Nicolás Suárez · Revisado por el equipo de finanzas Frilo
            </span>
            <span style={{ color: "#4A6158" }}>
              {"Actualizado el 20 de octubre de 2026 · "}
              <a href="#" style={{ color: "#4A6158" }}>
                Cómo hacemos nuestras guías
              </a>
            </span>
          </div>
        </div>
      </header>
      <section aria-label="La respuesta corta" style={{ background: "#E6EEE9", borderRadius: "16px", padding: "24px 28px", maxWidth: "772px", display: "flex", flexDirection: "column", gap: "8px", boxSizing: "border-box" }}>
        <span style={{ fontWeight: "600" }}>
          La respuesta corta
        </span>
        <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#2B4A40" }}>
          Un contrato por prestación de servicios no genera cesantías. Para tener el mismo colchón que un empleado, aparta el 8,33% de cada pago (un mes de ingreso al año) en una cuenta de ahorro que rinda, y no lo toques hasta febrero.
        </p>
      </section>
      <div style={{ display: "flex", flexWrap: "wrap-reverse", gap: "48px", alignItems: "flex-start" }}>
        <article className="prose" style={{ flex: "999 1 560px", minWidth: "0", maxWidth: "780px" }}>
          <h2 style={{ marginTop: "0" }}>
            Qué son las cesantías y por qué no las tienes
          </h2>
          <p>
            Un empleado con contrato laboral recibe, además de su salario, prestaciones sociales. Una de ellas es la cesantía: un mes de salario por cada año trabajado, o la parte proporcional si no completó el año (Código Sustantivo del Trabajo, artículo 249).
          </p>
          <p>
            Su empleador no se la paga en efectivo cada mes: la consigna en un fondo de cesantías a más tardar el 14 de febrero del año siguiente. Los intereses del 12% anual sobre ese saldo se los paga directamente a más tardar el 31 de enero (Ley 50 de 1990, artículo 99, y Ley 52 de 1975).
          </p>
          <p>
            Un contrato por prestación de servicios es distinto: no hay relación laboral, tienes un contratante en lugar de un empleador y recibes honorarios, no salario. Por eso no genera cesantías, prima ni vacaciones, y nadie las aparta por ti. Si las quieres, las creas tú, y de eso trata el resto de esta guía. Si en la práctica tu contrato tiene horario y subordinación como el de un empleado, consulta a un abogado laboral.
          </p>
          <h2>
            Cuánto apartar cada mes
          </h2>
          <p>
            {"La regla es el 8,33% de lo que facturas: un mes de ingreso dividido entre doce. Si cobras en dólares, aplícalo al valor en pesos con la "}
            <Link href="/dolar-hoy">
              TRM del día
            </Link>
            .
          </p>
          <section aria-label="Calcula cuánto apartar" style={{ margin: "32px 0", background: "#0F372D", color: "#FFFFFF", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ fontWeight: "600", fontSize: "18px" }}>
              ¿Cuánto apartar para tus cesantías?
            </span>
            {dinamicos.b1}
            {dinamicos.b2}
            <Link href="/calculadoras/cesantias" style={{ color: "#6FFF8F", fontWeight: "600", fontSize: "15px" }}>
              Calculadora completa de cesantías, también para contrato laboral
            </Link>
          </section>
          <h2>
            Dónde guardar las cesantías para que rindan
          </h2>
          <p>
            {"Busca una cuenta de ahorro sin plazo fijo, con rentabilidad diaria y sin cuota de manejo, vigilada por la Superintendencia Financiera. Así no pierdes liquidez si tienes un mes sin pagos y el dinero gana intereses mientras llega febrero. Comparamos tasas, costos y respaldo de Fogafín en "}
            <Link href="/guias/cuentas-de-ahorro-alto-rendimiento">
              cuentas de ahorro de alto rendimiento en Colombia
            </Link>
            .
          </p>
          <div style={{ margin: "24px 0" }}>
            <BannerRendimiento variante="cesantias" pagina="P12" />
          </div>
          <h2>
            Los intereses: el 12% que nadie te paga
          </h2>
          <p>
            {"Un empleado recibe cada año el 12% de sus cesantías como intereses. Puedes ver cómo se calculan en la "}
            <Link href="/calculadoras/cesantias">
              calculadora de intereses de cesantías
            </Link>
            {" y compararlo con lo que te pagaría tu cuenta. Para ver cuánto crecería lo que apartas, "}
            <Link href="/calculadoras/interes-compuesto">
              simula cuánto rinde con la calculadora de interés compuesto
            </Link>
            .
          </p>
          <h2>
            Qué hacer con las cesantías cuando las tengas
          </h2>
          <p>
            {"Los usos más comunes son los mismos que tiene un empleado: un colchón para los meses sin contrato, la cuota inicial de una vivienda o el pago de estudios. Si sabes que no las vas a tocar en un plazo definido, un CDT te da una tasa fija; si pueden servirte en cualquier momento, déjalas en una cuenta de ahorros sin plazo. Compara opciones en "}
            <Link href="/guias/cuentas-de-ahorro-alto-rendimiento">
              cuentas de ahorro que más rinden
            </Link>
            . Esto es información general, no una recomendación de inversión.
          </p>
          <h2>
            Calendario: cuándo tendrías tu dinero
          </h2>
          <p>
            Si empiezas a apartar en enero, en diciembre tendrás el equivalente a un mes de ingreso, más los intereses de tu cuenta. Así llegas a febrero con tus cesantías listas, como un empleado.
          </p>
          <div style={{ margin: "32px 0" }}>
            <BannerRegistro variante="prima" pagina="P12" />
          </div>
          <h2>
            Preguntas frecuentes
          </h2>
          <details>
            <summary>
              ¿Un independiente puede afiliarse a un fondo de cesantías?
            </summary>
            <p>
              {"Sí, como ahorro voluntario. Puedes aportar en cualquier momento del año, directamente en fondos como "}
              <a href="https://www.porvenir.com.co/" target="_blank" rel="noopener">
                Porvenir
              </a>
              {" o "}
              <a href="https://www.proteccion.com/" target="_blank" rel="noopener">
                Protección
              </a>
              , o por planilla asistida en operadores como Aportes en Línea o Miplanilla. El aporte llega hasta la doceava parte (1/12) de tus ingresos del año anterior, y los fondos ofrecen portafolios de corto y largo plazo. Puedes retirar con más flexibilidad que un empleado, según las reglas de cada fondo. (
              <a href="https://www.porvenir.com.co/web/articulos-de-interes/5-cosas-que-debes-saber-para-ahorrar-cesantias-como-independiente" target="_blank" rel="noopener">
                Porvenir
              </a>
              {", "}
              <a href="https://ayuda.miplanilla.com/hc/es-419/articles/11184330736020--C%C3%B3mo-funciona-las-cesant%C3%ADas-para-el-caso-de-los-independientes" target="_blank" rel="noopener">
                Miplanilla
              </a>
              )
            </p>
          </details>
          <details>
            <summary>
              ¿Lo que ahorro como cesantías propias paga impuestos?
            </summary>
            <p>
              Depende de dónde las guardes. En un fondo de cesantías, los aportes voluntarios pueden deducirse de la renta hasta 1/12 de tus ingresos, dentro de los topes de rentas exentas, si el dinero se queda en el fondo al menos hasta el 31 de diciembre del año en que aportaste. En una cuenta de ahorros no hay ese beneficio, y los intereses tienen retención en la fuente del 7%.
            </p>
          </details>
          <details>
            <summary>
              ¿Qué pasa si un mes no me pagan?
            </summary>
            <p>
              No apartas ese mes y retomas cuando vuelvas a cobrar. Por eso conviene que la cuenta no tenga plazo fijo: el ahorro se adapta a tus ingresos.
            </p>
          </details>
          <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #D6E0DA", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: "600" }}>
              Fuentes
            </span>
            <span style={{ fontSize: "15px", color: "#4A6158" }}>
              <a href="http://www.secretariasenado.gov.co/senado/basedoc/codigo_sustantivo_trabajo.html" target="_blank" rel="noopener">
                Código Sustantivo del Trabajo, artículos 249 y siguientes
              </a>
              {" · "}
              <a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=281" target="_blank" rel="noopener">
                Ley 50 de 1990, artículo 99
              </a>
              {" · Ley 52 de 1975 · "}
              <a href="https://www.gerencie.com/tabla-de-retencion-en-la-fuente-2026.html" target="_blank" rel="noopener">
                Tabla de retención en la fuente 2026
              </a>
              {" · Tasas de cuentas consultadas en la web de cada entidad el 20 de octubre de 2026"}
            </span>
          </div>
        </article>
        <aside style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <nav aria-label="En esta guía" className="card" style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "15px" }}>
            <span style={{ fontWeight: "600" }}>
              En esta guía
            </span>
            <a href="#">
              Qué son las cesantías
            </a>
            <a href="#">
              Cuánto apartar
            </a>
            <a href="#">
              Dónde guardarlas
            </a>
            <a href="#">
              Los intereses
            </a>
            <a href="#">
              Qué hacer con ellas
            </a>
            <a href="#">
              Calendario
            </a>
          </nav>
          <div className="card" style={{ background: "#F3F6F4", display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontWeight: "600" }}>
              Lleva tu prima y tus cesantías en Frilo
            </span>
            <span style={{ fontSize: "15px", color: "#4A6158" }}>
              Te decimos cuánto apartar de cada pago y cuánto llevas.
            </span>
            <a className="btn btn-grad" href={URL_APP}>
              Probar la app gratis
            </a>
          </div>
        </aside>
      </div>
      <section style={{ display: "flex", flexDirection: "column", gap: "20px", borderTop: "1px solid #D6E0DA", paddingTop: "40px" }}>
        <h2 style={{ margin: "0", fontSize: "28px" }}>
          Sigue leyendo
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          <Link href="/guias/cuentas-de-ahorro-alto-rendimiento" className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#4A6158" }}>
              Ahorro
            </span>
            <span style={{ fontWeight: "600", fontSize: "17px" }}>
              Cuentas de ahorro de alto rendimiento en Colombia
            </span>
          </Link>
          <Link href="/guias/ibc-independientes" className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#4A6158" }}>
              Aportes
            </span>
            <span style={{ fontWeight: "600", fontSize: "17px" }}>
              IBC para independientes: qué es y cómo se calcula
            </span>
          </Link>
          <Link href="/calculadoras/aportes-independientes" className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#4A6158" }}>
              Herramienta
            </span>
            <span style={{ fontWeight: "600", fontSize: "17px" }}>
              Calculadora de aportes para independientes 2026
            </span>
          </Link>
        </div>
      </section>
    </div>
    </div>
  );
}
