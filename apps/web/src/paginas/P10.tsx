/* GENERADO por scripts/wireframes-a-tsx.py desde InteresCompuesto.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   b1:  ¿Cuánto tendré? ¿Cuánto debo ahorrar al mes? ¿Cuánto tiempo tardo? 
 *   b2:  Atajo: mi prima y mis cesantías Tu ingreso mensual (COP) Usar el 16,66% Tu meta de ahorro (COP) Monto inicial
 *   b3:  Proyección de tu ahorro año a año Periodo Capital aportado Intereses acumulados Saldo {{r.periodo}} {{r.aport
 *   b4:  Un solo depósito, sin aportes, antes de retención en la fuente Plazo Al 9% E.A. Al 11% E.A. {{f.plazo}} {{f.a
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { BannerRegistro } from '../components/BannerRegistro';

export function ContenidoP10({ dinamicos = {} }: { dinamicos?: { b1?: ReactNode, b2?: ReactNode, b3?: ReactNode, b4?: ReactNode } }) {
  return (
    <div className="wf wf-P10">
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
          Interés compuesto
        </span>
      </nav>
      <header style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "840px" }}>
        <h1 style={{ margin: "0", fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: "1.08", letterSpacing: "-0.02em" }}>
          Calculadora de interés compuesto: simula cuánto rinde tu ahorro
        </h1>
        <p style={{ margin: "0", fontSize: "19px", lineHeight: "1.55", color: "#2B4A40" }}>
          El interés compuesto suma los intereses a tu saldo para que también generen intereses. La fórmula es saldo final = capital × (1 + i)
          <sup>
            n
          </sup>
          , más lo que aportes cada mes. Usa esta calculadora de interés compuesto para saber cuánto tendrás, cuánto ahorrar al mes para llegar a una meta o cuánto tiempo te tomará.
        </p>
        <p style={{ margin: "0", fontSize: "14px", color: "#4A6158" }}>
          {"Actualizada el 20 de octubre de 2026 · Por Nicolás Suárez · Revisada por el equipo de finanzas Frilo · "}
          <a href="#como" style={{ color: "#4A6158" }}>
            Cómo calculamos
          </a>
        </p>
      </header>
      {dinamicos.b1}
      {dinamicos.b2}
      {dinamicos.b3}
      <article className="prose" style={{ maxWidth: "800px" }}>
        <h2 style={{ marginTop: "16px" }}>
          Cómo usar la calculadora de interés compuesto
        </h2>
        <p>
          Elige qué quieres saber:
        </p>
        <ol>
          <li>
            <strong>
              ¿Cuánto tendré?
            </strong>
            {" Escribe tu monto inicial, tu aporte mensual, la tasa y el plazo."}
          </li>
          <li>
            <strong>
              ¿Cuánto debo ahorrar al mes?
            </strong>
            {" Escribe tu meta y el plazo: te decimos el aporte mensual que necesitas."}
          </li>
          <li>
            <strong>
              ¿Cuánto tiempo tardo?
            </strong>
            {" Escribe tu meta y tu aporte: te decimos en cuántos meses llegas."}
          </li>
        </ol>
        <p>
          Si eres independiente, usa el atajo de prima y cesantías: aparta el 16,67% de tu ingreso (8,33% para cada una).
        </p>
        <h2 id="como">
          Qué es el interés compuesto y cómo se calcula
        </h2>
        <p>
          Con un solo depósito, el saldo final es C × (1 + i)
          <sup>
            n
          </sup>
          , donde C es el capital, i la tasa de cada periodo y n el número de periodos. Si además aportas cada mes, se suma el valor futuro de esos aportes:
        </p>
        <p style={{ background: "#FFFFFF", border: "1px solid #D6E0DA", borderRadius: "12px", padding: "16px", fontFamily: "ui-monospace, Menlo, monospace", fontSize: "15px" }}>
          Saldo = C × (1 + i)
          <sup>
            n
          </sup>
          + A × [(1 + i)
          <sup>
            n
          </sup>
          − 1] ÷ i
        </p>
        <p>
          Aquí A es el aporte mensual e i la tasa mensual equivalente: i = (1 + E.A.)
          <sup>
            1/12
          </sup>
          − 1. Al 9% E.A., i ≈ 0,72% mensual. Si tu tasa es nominal, primero se convierte a E.A. según la capitalización.
        </p>
        <div style={{ overflowX: "auto", border: "1px solid #D6E0DA", borderRadius: "16px", background: "#FFFFFF" }}>
          <table className="t">
            <thead>
              <tr>
                <th scope="col">
                  Concepto
                </th>
                <th scope="col">
                  Interés simple
                </th>
                <th scope="col">
                  Interés compuesto
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Sobre qué se calcula
                </td>
                <td>
                  Solo el capital
                </td>
                <td>
                  Capital + intereses acumulados
                </td>
              </tr>
              <tr>
                <td>
                  $1.000.000 al 10% E.A. por 3 años
                </td>
                <td>
                  $1.300.000
                </td>
                <td>
                  $1.331.000
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2>
          ¿Cuánto crecen $1.000.000 con interés compuesto?
        </h2>
        {dinamicos.b4}
        <h2>
          Simulador de ahorro mensual: ejemplo con tu prima y tus cesantías
        </h2>
        <p>
          {"Si facturas $8.000.000 al mes y apartas el 16,67% ($1.333.300) durante 12 meses en una cuenta al 9% E.A., terminarías con $16.649.316: $15.999.600 que aportaste y $649.716 de intereses, antes de retención en la fuente. Al 11% E.A., la tasa más alta sin condiciones que encontramos el 20 de octubre de 2026, los intereses serían mayores. ¿No sabes cuánto apartar? Usa la "}
          <Link href="/calculadoras/aportes-independientes">
            calculadora de aportes
          </Link>
          .
        </p>
        <h2>
          Cómo calcular los intereses de una cuenta de ahorros
        </h2>
        <ol>
          <li>
            Convierte la tasa E.A. a tasa diaria: (1 + E.A.)
            <sup>
              1/365
            </sup>
            − 1.
          </li>
          <li>
            Multiplica tu saldo de cada día por esa tasa: así liquidan casi todas las cuentas.
          </li>
          <li>
            Suma los intereses del mes. Algunas cuentas los abonan a diario y otras el primer día del mes siguiente.
          </li>
          <li>
            Resta la retención en la fuente: en 2026 es el 7% de los intereses, sin base mínima (
            <a href="https://www.gerencie.com/tabla-de-retencion-en-la-fuente-2026.html" target="_blank" rel="noopener">
              tabla de retención 2026
            </a>
            ).
          </li>
        </ol>
        <p>
          {"Compara tasas reales en "}
          <Link href="/guias/cuentas-de-ahorro-alto-rendimiento">
            cuentas de ahorro de alto rendimiento en Colombia
          </Link>
          .
        </p>
        <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#4A6158" }}>
          <strong style={{ color: "#0F372D" }}>
            Fuentes oficiales:
          </strong>
          {' '}
          <a href="https://www.superfinanciera.gov.co/" target="_blank" rel="noopener">
            Superintendencia Financiera de Colombia
          </a>
          {" · "}
          <a href="https://www.fogafin.gov.co/" target="_blank" rel="noopener">
            Fogafín
          </a>
          {" · "}
          <a href="https://www.banrep.gov.co/" target="_blank" rel="noopener">
            Banco de la República
          </a>
        </p>
        <h2>
          Preguntas frecuentes
        </h2>
        <details>
          <summary>
            ¿Qué diferencia hay entre tasa E.A. y tasa nominal?
          </summary>
          <p>
            La tasa efectiva anual (E.A.) ya incluye el efecto de capitalizar los intereses. La nominal no: hay que convertirla según cuántas veces al año se capitaliza. Un 9% nominal con capitalización mensual equivale a cerca de 9,38% E.A.
          </p>
        </details>
        <details>
          <summary>
            ¿El 4x1000 afecta lo que rinde mi ahorro?
          </summary>
          <p>
            El 4x1000 (GMF) se cobra cuando retiras o transfieres dinero, no sobre los intereses. Puedes marcar una sola cuenta como exenta, con un tope mensual que define cada entidad según la ley (por ejemplo, Nu informa hasta $16 millones al mes).
          </p>
        </details>
        <details>
          <summary>
            ¿Los rendimientos de una cuenta de ahorros pagan retención en la fuente?
          </summary>
          <p>
            Sí. En 2026 la retención en la fuente sobre intereses o rendimientos financieros es del 7%, sin base mínima (
            <a href="https://www.gerencie.com/tabla-de-retencion-en-la-fuente-2026.html" target="_blank" rel="noopener">
              tabla de retención 2026
            </a>
            ). Activa la opción en la calculadora para verla descontada.
          </p>
        </details>
        <details>
          <summary>
            ¿Es mejor capitalización diaria o mensual?
          </summary>
          <p>
            Si la tasa que te dan es efectiva anual (E.A.), da igual: la capitalización ya está incluida. Solo importa cuando la tasa es nominal; ahí, entre más frecuente la capitalización, más rinde.
          </p>
        </details>
        <details>
          <summary>
            ¿Qué es la regla del 72?
          </summary>
          <p>
            Un atajo para estimar en cuántos años se duplica tu dinero: divide 72 entre la tasa anual. Al 9% E.A. tu ahorro se duplica en unos 8 años.
          </p>
        </details>
        <details>
          <summary>
            ¿Esta calculadora sirve para inversiones o solo para ahorro?
          </summary>
          <p>
            Sirve para cualquier tasa que se mantenga fija. En inversiones como fondos o acciones la rentabilidad no está garantizada y puede ser negativa. No es asesoría financiera.
          </p>
        </details>
      </article>
      <BannerRegistro variante="prima" pagina="P10" />
      <section aria-labelledby="h-otras" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 id="h-otras" style={{ margin: "0", fontSize: "26px" }}>
          Otras calculadoras para independientes
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          <Link href="/calculadoras/aportes-independientes" className="card" style={{ textDecoration: "none", fontWeight: "600" }}>
            Calculadora de aportes para independientes
          </Link>
          <Link href="/calculadoras/cesantias" className="card" style={{ textDecoration: "none", fontWeight: "600" }}>
            Calculadora de cesantías e intereses
          </Link>
          <Link href="/calculadoras/fecha-pago-planilla" className="card" style={{ textDecoration: "none", fontWeight: "600" }}>
            Fecha de pago de la planilla
          </Link>
          <Link href="/guias/cuentas-de-ahorro-alto-rendimiento" className="card" style={{ textDecoration: "none", fontWeight: "600" }}>
            Cuentas de ahorro de alto rendimiento
          </Link>
        </div>
      </section>
    </div>
    </div>
  );
}
