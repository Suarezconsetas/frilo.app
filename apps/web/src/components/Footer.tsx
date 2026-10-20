import Link from 'next/link';
import { RUTA_CUENTAS, URL_APP } from '../lib/config';
import { LogoFrilo } from './Logo';

const COLUMNAS: { titulo: string; enlaces: [string, string][] }[] = [
  {
    titulo: 'Calculadoras',
    enlaces: [
      ['Aportes para independientes', '/calculadoras/aportes-independientes'],
      ['Cesantías e intereses', '/calculadoras/cesantias'],
      ['Fecha de pago de la planilla', '/calculadoras/fecha-pago-planilla'],
      ['Interés compuesto', '/calculadoras/interes-compuesto'],
      ['Dólar hoy', '/dolar-hoy'],
    ],
  },
  {
    titulo: 'Guías',
    enlaces: [
      ['IBC para independientes', '/guias/ibc-independientes'],
      ['Descargar la planilla', '/guias/descargar-planilla-seguridad-social'],
      ['Cesantías para independientes', '/guias/cesantias-independientes'],
      ['Cuenta en dólares', '/guias/cuenta-en-dolares-colombia'],
      ['Recibir pagos en dólares', '/guias/recibir-pagos-en-dolares-colombia'],
      ['Cuentas que rinden', RUTA_CUENTAS],
    ],
  },
  {
    titulo: 'Frilo',
    enlaces: [
      ['Quiénes somos', '/quienes-somos'],
      ['Metodología', '/metodologia'],
      ['Transparencia', '/transparencia'],
      ['Glosario', '/glosario'],
    ],
  },
  {
    titulo: 'Legal',
    enlaces: [
      ['Términos de uso', '/terminos'],
      ['Política de datos', '/politica-de-datos'],
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="contenedor footer-grid">
        <div className="footer-marca">
          <LogoFrilo tono="oliva" alto={34} />
          <p>Tus finanzas, mejor con Frilo. Más claridad, más libertad.</p>
          <a href={URL_APP} className="boton-degradado">
            Probar la app gratis
          </a>
        </div>
        {COLUMNAS.map((c) => (
          <nav key={c.titulo} aria-label={c.titulo}>
            <p className="footer-titulo">{c.titulo}</p>
            <ul>
              {c.enlaces.map(([texto, href]) => (
                <li key={href}>
                  <Link href={href}>{texto}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="contenedor footer-aviso">
        <p>
          Frilo es gratis, no recibe pagos de las entidades que compara y no vende tus datos. Los cálculos son estimados: no incluyen el 4x1000 ni las retenciones de
          Colombia o del país contratante. No es asesoría financiera, legal ni tributaria.
        </p>
        <p>© {new Date().getFullYear()} Frilo.</p>
      </div>
    </footer>
  );
}
