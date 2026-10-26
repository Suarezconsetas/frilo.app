/* GENERADO por scripts/wireframes-a-tsx.py desde CalculadorasHub.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   (ninguno)
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { BannerRegistro } from '../components/BannerRegistro';

export function ContenidoHubCalculadoras({ dinamicos = {} }: { dinamicos?: {  } }) {
  return (
    <div className="wf wf-Hub-C">
    <div className="wrap" style={{ paddingTop: "32px", paddingBottom: "96px", display: "flex", flexDirection: "column", gap: "48px" }}>
      <nav aria-label="Ruta de navegación" style={{ fontSize: "14px", color: "#4A6158", display: "flex", gap: "8px" }}>
        <Link href="/" style={{ color: "#4A6158" }}>
          Inicio
        </Link>
        <span aria-hidden="true">
          /
        </span>
        <span aria-current="page">
          Calculadoras
        </span>
      </nav>
      <header style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "820px" }}>
        <h1 style={{ margin: "0", fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: "1.08", letterSpacing: "-0.02em" }}>
          Calculadoras para independientes y contratistas en Colombia
        </h1>
        <p style={{ margin: "0", fontSize: "19px", lineHeight: "1.55", color: "#2B4A40" }}>
          Calcula gratis y sin registro cuánto pagas de planilla, cuándo vence, cuánto apartar para tu prima y tus cesantías y cuánto valen tus dólares hoy. Todas usan las cifras oficiales de 2026 y muestran sus fuentes.
        </p>
      </header>
      <section aria-labelledby="g-aportes" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 id="g-aportes" style={{ margin: "0", fontSize: "26px" }}>
          Aportes a seguridad social
        </h2>
        <div className="grid">
          <div className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px" , position: "relative"}}>
<Link href="/calculadoras/aportes-independientes" className="card-enlace" style={{ fontWeight: "700", fontSize: "19px" , color: "inherit", textDecoration: "none"}}>
Calculadora de aportes para independientes 2026
</Link>
<span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              Salud, pensión, ARL y Fondo de Solidaridad sobre el 40% de lo que facturas.
            </span>
</div>
          <div className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px" , position: "relative"}}>
<Link href="/calculadoras/fecha-pago-planilla" className="card-enlace" style={{ fontWeight: "700", fontSize: "19px" , color: "inherit", textDecoration: "none"}}>
Fechas de pago de la planilla de seguridad social 2026
</Link>
<span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              Tu día límite según los dos últimos dígitos de tu documento.
            </span>
</div>
        </div>
      </section>
      <section aria-labelledby="g-prima" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 id="g-prima" style={{ margin: "0", fontSize: "26px" }}>
          Prima y cesantías
        </h2>
        <div className="grid">
          <div className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px" , position: "relative"}}>
<Link href="/calculadoras/cesantias" className="card-enlace" style={{ fontWeight: "700", fontSize: "19px" , color: "inherit", textDecoration: "none"}}>
Calculadora de cesantías e intereses de cesantías 2026
</Link>
<span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              Con contrato laboral o como independiente, para este año o años anteriores.
            </span>
</div>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "8px", background: "#E6EEE9", borderStyle: "dashed" }}>
            <span style={{ fontWeight: "700", fontSize: "19px" }}>
              Calculadora de prima para independientes
            </span>
            <span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              Próximamente · pendiente de keyword research.
            </span>
          </div>
        </div>
      </section>
      <section aria-labelledby="g-dolar" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 id="g-dolar" style={{ margin: "0", fontSize: "26px" }}>
          Dólar
        </h2>
        <div className="grid">
          <div className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px" , position: "relative"}}>
<Link href="/dolar-hoy" className="card-enlace" style={{ fontWeight: "700", fontSize: "19px" , color: "inherit", textDecoration: "none"}}>
Dólar hoy en Colombia (TRM)
</Link>
<span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              La TRM oficial, el conversor y alertas por correo.
            </span>
</div>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "8px", background: "#E6EEE9", borderStyle: "dashed" }}>
            <span style={{ fontWeight: "700", fontSize: "19px" }}>
              De dólares a pesos, con planilla
            </span>
            <span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              Próximamente · pendiente de keyword research.
            </span>
          </div>
        </div>
      </section>
      <section aria-labelledby="g-ahorro" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 id="g-ahorro" style={{ margin: "0", fontSize: "26px" }}>
          Ahorro
        </h2>
        <div className="grid">
          <div className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px" , position: "relative"}}>
<Link href="/calculadoras/interes-compuesto" className="card-enlace" style={{ fontWeight: "700", fontSize: "19px" , color: "inherit", textDecoration: "none"}}>
Calculadora de interés compuesto y simulador de ahorro
</Link>
<span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              Cuánto crece lo que apartas cada mes, con tu tasa y tu plazo.
            </span>
</div>
          <div className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px" , position: "relative"}}>
<Link href="/guias/cuentas-de-ahorro-alto-rendimiento" className="card-enlace" style={{ fontWeight: "700", fontSize: "19px" , color: "inherit", textDecoration: "none"}}>
Cuentas de ahorro de alto rendimiento en Colombia
</Link>
<span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              Guía comparativa por tasa, costos y respaldo de Fogafín.
            </span>
</div>
        </div>
      </section>
      <BannerRegistro variante="general" pagina="Hub-C" />
    </div>
    </div>
  );
}
