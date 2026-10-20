/* GENERADO por scripts/wireframes-a-tsx.py desde GuiasHub.dc.html. El contenido es el copy aprobado de los wireframes.
 * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):
 *   (ninguno)
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { BannerRegistro } from '../components/BannerRegistro';

export function ContenidoHubGuias({ dinamicos = {} }: { dinamicos?: {  } }) {
  return (
    <div className="wf wf-Hub-G">
    <div className="wrap" style={{ paddingTop: "32px", paddingBottom: "96px", display: "flex", flexDirection: "column", gap: "48px" }}>
      <nav aria-label="Ruta de navegación" style={{ fontSize: "14px", color: "#4A6158", display: "flex", gap: "8px" }}>
        <Link href="/" style={{ color: "#4A6158" }}>
          Inicio
        </Link>
        <span aria-hidden="true">
          /
        </span>
        <span aria-current="page">
          Guías
        </span>
      </nav>
      <header style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "820px" }}>
        <h1 style={{ margin: "0", fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: "1.08", letterSpacing: "-0.02em" }}>
          Guías para independientes y freelancers en Colombia
        </h1>
        <p style={{ margin: "0", fontSize: "19px", lineHeight: "1.55", color: "#2B4A40" }}>
          Explicaciones claras sobre planilla, IBC, prima, cesantías y pagos en dólares, escritas para quien trabaja por prestación de servicios o para el exterior. Cada guía cita sus fuentes y dice cuándo se actualizó.
        </p>
      </header>
      <section aria-labelledby="c-aportes" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 id="c-aportes" style={{ margin: "0", fontSize: "26px" }}>
          Aportes y planilla
        </h2>
        <div className="grid">
          <Link href="/guias/ibc-independientes" className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: "700", fontSize: "19px" }}>
              IBC para independientes 2026: qué es y cómo calcularlo
            </span>
            <span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              La base sobre la que pagas salud y pensión, y cómo cambiarla en SOI.
            </span>
          </Link>
          <Link href="/guias/descargar-planilla-seguridad-social" className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: "700", fontSize: "19px" }}>
              Cómo descargar y verificar tu planilla de seguridad social
            </span>
            <span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              Paso a paso para descargar el comprobante y confirmar que el pago quedó registrado.
            </span>
          </Link>
          <Link href="/glosario/sln" className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: "700", fontSize: "19px" }}>
              Qué significa SLN en la planilla de seguridad social
            </span>
            <span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              La novedad SLN y las demás siglas de la PILA.
            </span>
          </Link>
        </div>
      </section>
      <section aria-labelledby="c-prima" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 id="c-prima" style={{ margin: "0", fontSize: "26px" }}>
          Prima, cesantías y ahorro
        </h2>
        <div className="grid">
          <Link href="/guias/cesantias-independientes" className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: "700", fontSize: "19px" }}>
              Cesantías para independientes: cómo crear las tuyas
            </span>
            <span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              Cuánto apartar, dónde guardarlas y cuándo tendrías tu dinero.
            </span>
          </Link>
          <Link href="/guias/cuentas-de-ahorro-alto-rendimiento" className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: "700", fontSize: "19px" }}>
              Cuentas de ahorro de alto rendimiento en Colombia
            </span>
            <span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              Cuáles pagan más en 2026, sin cuota de manejo y con respaldo de Fogafín.
            </span>
          </Link>
          <Link href="/calculadoras/interes-compuesto" className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: "700", fontSize: "19px" }}>
              Calculadora de interés compuesto
            </span>
            <span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              Simula cuánto rinde tu ahorro mes a mes.
            </span>
          </Link>
        </div>
      </section>
      <section aria-labelledby="c-dolar" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 id="c-dolar" style={{ margin: "0", fontSize: "26px" }}>
          Pagos en dólares
        </h2>
        <div className="grid">
          <Link href="/guias/recibir-pagos-en-dolares-colombia" className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: "700", fontSize: "19px" }}>
              Cómo recibir pagos del exterior en dólares en Colombia
            </span>
            <span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              Opciones, costos, tiempos y qué debes declarar.
            </span>
          </Link>
          <Link href="/guias/cuenta-en-dolares-colombia" className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: "700", fontSize: "19px" }}>
              Cuenta en dólares en Colombia: opciones, requisitos y costos
            </span>
            <span style={{ color: "#4A6158", lineHeight: "1.5" }}>
              Qué entidades la ofrecen y qué necesitas para abrirla.
            </span>
          </Link>
        </div>
      </section>
      <BannerRegistro variante="general" pagina="Hub-G" />
    </div>
    </div>
  );
}
