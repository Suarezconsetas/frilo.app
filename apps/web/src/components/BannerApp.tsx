import Link from 'next/link';
import { URL_APP } from '../lib/config';

const FUNCIONES: { titulo: string; detalle: string }[] = [
  { titulo: 'Lo que te queda cada mes', detalle: 'Tu ingreso menos la planilla, la prima y las cesantías que apartas.' },
  { titulo: 'Aportes y fecha límite', detalle: 'Salud, pensión, ARL y Fondo de Solidaridad, con recordatorio de tu fecha de pago y acceso directo a MiPlanilla.' },
  { titulo: 'Prima y cesantías propias', detalle: 'Dos bolsillos con lo que llevas guardado; marcas cuándo cobraste tu prima y se reinicia.' },
  { titulo: 'Dólar y alertas', detalle: 'La TRM frente a la semana, el mes y el año, y una alerta cuando cruce el valor que elijas.' },
  { titulo: 'Cuentas que rinden', detalle: 'Compara cuentas de ahorro con liquidez, ordenadas por tasa y con la fecha de consulta.' },
];

/** Banner del Home que lleva a la app: tres pantallas reales (capturas) en marcos de teléfono, resumen de funciones y CTA. */
export function BannerApp() {
  return (
    <section className="banner-app" aria-labelledby="banner-app-titulo">
      <div className="wrap banner-app-grid">
        <div className="banner-app-texto">
          <span className="banner-app-etiqueta">La app de Frilo</span>
          <h2 id="banner-app-titulo">Tu mes completo en una sola app</h2>
          <p className="banner-app-resumen">
            Escribe lo que cobras, en pesos o en dólares, y Frilo te dice cuánto va a tu planilla, cuánto apartar para tu prima y tus cesantías, y cuánto te queda para ti.
          </p>
          <ul className="banner-app-lista">
            {FUNCIONES.map((f) => (
              <li key={f.titulo}>
                <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                  <circle cx="11" cy="11" r="11" fill="#6FFF8F" />
                  <path d="M6.5 11.5l3 3 6-6.5" fill="none" stroke="#0F372D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>
                  <strong>{f.titulo}.</strong> <span className="banner-app-detalle">{f.detalle}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="banner-app-acciones">
            <a className="btn btn-grad" href={URL_APP} data-evento="cta_click" data-variante="banner_app">
              Probar la app gratis
            </a>
            <Link href="/metodologia" className="banner-app-enlace">
              Cómo calculamos
            </Link>
          </div>
          <p className="banner-app-nota">Gratis. Entras con Google o con un código a tu correo. Cálculos estimados: no incluyen 4x1000, retenciones ni impuesto de renta.</p>
        </div>
        <div className="banner-app-telefonos" aria-hidden="false">
          <div className="telefono telefono-lado telefono-izq">
            <img src="/capturas/ahorro.jpg" width="640" height="1385" alt="Pantalla de Ahorro de la app de Frilo: bolsillos de prima y cesantías con su saldo." loading="lazy" />
          </div>
          <div className="telefono telefono-centro">
            <img src="/capturas/aportes.jpg" width="640" height="1385" alt="Pantalla Aportes de la app de Frilo: total de la planilla con el desglose de IBC, salud, pensión, Fondo de Solidaridad y ARL." loading="lazy" />
          </div>
          <div className="telefono telefono-lado telefono-der">
            <img src="/capturas/dolar.jpg" width="640" height="1385" alt="Pantalla Dólar hoy de la app de Frilo: TRM del día, comparación con la semana, el mes y el año, y alertas." loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
