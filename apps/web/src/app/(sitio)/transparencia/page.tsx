import Link from 'next/link';
import { JsonLd } from '../../../components/JsonLd';
import { PaginaTexto } from '../../../components/PaginaTexto';
import { LEGAL } from '@/lib/legal';
import { metadataDe } from '../../../lib/seo';

export const metadata = metadataDe('Inst-3');

export default function Pagina() {
  return (
    <>
      <PaginaTexto id="Inst-3">
        <p className="respuesta-corta">
          Frilo es gratis. No recibimos pagos de las entidades que comparamos, no mostramos publicidad y no vendemos tus datos. Los enlaces a bancos y plataformas llevan directo a su página oficial.
        </p>

        <h2>Cómo se financia Frilo</h2>
        <p>
          Hoy Frilo no cobra ni recibe dinero de las entidades de las que habla. Si algún día firmamos acuerdos de referidos, lo diremos aquí y en cada tabla, marcaremos esos enlaces como patrocinados y
          nunca cambiaremos el orden por comisión: la lista seguirá ordenada por tasa, de mayor a menor.
        </p>

        <h2>Qué hacemos con tus datos</h2>
        <ul>
          <li>No vendemos ni compartimos tus datos personales con terceros.</li>
          <li>Guardamos lo necesario para que las calculadoras y los recordatorios funcionen y puedas retomarlos.</li>
          <li>Solo te escribimos para novedades y ofertas si marcas esa casilla, y la puedes retirar cuando quieras.</li>
          <li>
            Lee la <Link href="/politica-de-datos">Política de datos</Link> y los <Link href="/terminos">Términos de uso</Link>. Para ejercer tus derechos, escribe a{' '}
            <a href={`mailto:${LEGAL.correoPrivacidad}`}>{LEGAL.correoPrivacidad}</a>.
          </li>
        </ul>

        <h2>Cómo elegimos qué mostrar</h2>
        <p>
          Mostramos las cuentas de ahorro donde el dinero está disponible, con los mismos criterios para todas: tasa efectiva anual sin condiciones, costos, 4x1000, Fogafín y fecha de consulta. Explicamos
          el detalle en nuestra <Link href="/metodologia">metodología</Link>.
        </p>

        <h2>Lo que Frilo no es</h2>
        <p>
          Frilo no es una entidad financiera ni una asesoría financiera, legal o tributaria. No gestiona tu dinero ni paga tu planilla. Las decisiones sobre tu dinero son tuyas; nuestros cálculos son
          estimados y no incluyen el 4x1000 ni las retenciones de Colombia o del país contratante.
        </p>
      </PaginaTexto>
      <JsonLd id="Inst-3" />
    </>
  );
}
