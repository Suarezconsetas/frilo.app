import Link from 'next/link';
import { Faq } from '../../../components/Faq';
import { FuentesOficiales } from '../../../components/FuentesOficiales';
import { JsonLd } from '../../../components/JsonLd';
import { PaginaTexto } from '../../../components/PaginaTexto';
import { metadataDe } from '../../../lib/seo';

export const metadata = metadataDe('Inst-2');

export default function Pagina() {
  return (
    <>
      <PaginaTexto id="Inst-2">
        <p className="respuesta-corta">
          Frilo calcula con las normas colombianas vigentes y con los datos publicados por las entidades oficiales. Cada cifra tiene su fuente y su fecha, y todo cálculo es un estimado: no
          reemplaza a tu operador de planilla, a un contador ni a un abogado.
        </p>

        <h2>Cómo calculamos tus aportes</h2>
        <p>
          Tu base de cotización (IBC) es el 40% de lo que facturas al mes, con un mínimo de 1 y un máximo de 25 salarios mínimos. Sobre esa base calculamos salud (12,5%), pensión (16%), ARL según tu clase de
          riesgo y, desde 4 salarios mínimos, el Fondo de Solidaridad Pensional. Cada aporte se redondea a los $100 más cercanos, como en la planilla (PILA). Si te pagan en dólares, convertimos con la TRM
          antes de calcular.
        </p>
        <p>
          Si trabajas por cuenta propia, el 40% se aplica sobre tu ingreso neto, es decir, después de descontar los costos de tu actividad (Decreto 379 de 2026). Los contratistas por prestación de servicios
          cotizan sobre el 40% del valor mensual del contrato, sin descontar costos.
        </p>

        <h2>Cómo calculamos tu prima y tus cesantías</h2>
        <p>
          Un contrato por prestación de servicios no trae prima ni cesantías. Para que las crees por tu cuenta, Frilo te propone apartar 1/12 de tu ingreso bruto para cada una (8,33% cada una, 16,67% en
          total), sin descontar impuestos ni IVA. No agregamos ahorro extra para igualar los intereses de las cesantías.
        </p>

        <h2>Cómo calculamos las fechas de pago de la planilla</h2>
        <p>
          La fecha límite es el día hábil del mes que corresponde a los dos últimos dígitos de tu documento, según el Decreto 1990 de 2016. Los días hábiles excluyen sábados, domingos y festivos de Colombia, que
          calculamos con las reglas de la Ley 51 de 1983 y la fecha de Semana Santa, y confirmamos cada año con el calendario oficial.
        </p>

        <h2>De dónde sale el dólar</h2>
        <p>
          La TRM es la que certifica la Superintendencia Financiera y publica datos.gov.co. La página se actualiza cada día hábil. Tu banco o plataforma aplica su propia tasa, que casi siempre es distinta.
        </p>

        <h2>De dónde salen las tasas de las cuentas de ahorro</h2>
        <ul>
          <li>Las tomamos de la página oficial de cada entidad y mostramos la fecha en que las consultamos.</li>
          <li>Ordenamos por la tasa efectiva anual que pagan sin condiciones, de mayor a menor. Las tasas con condiciones van aparte, como dato secundario.</li>
          <li>Si la misma página muestra cifras distintas, usamos la menor y lo decimos.</li>
          <li>Solo comparamos cuentas donde el dinero está disponible: no incluimos CDT ni productos con plazo fijo.</li>
          <li>Marcamos Fogafín como “Sí” solo cuando la entidad lo dice o lo confirmamos nosotros. Si no, decimos “No lo indica”.</li>
          <li>Revisamos las tasas cada semana. Si una cambia, la actualizamos en la app y en el sitio al mismo tiempo, porque usan los mismos datos.</li>
        </ul>

        <h2>Quién revisa y cada cuánto</h2>
        <p>
          El contenido lo escribe <Link href="/quienes-somos">Nicolás Suárez</Link> y lo revisa el equipo de finanzas de Frilo. Cada página muestra la fecha de su última actualización. Las calculadoras de
          aportes, cesantías y fechas de pago se actualizan en diciembre, cuando cambian el salario mínimo y las tarifas del año.
        </p>

        <h2>Qué no incluyen nuestros cálculos</h2>
        <p>
          Los cálculos no incluyen el 4x1000 ni las retenciones de Colombia o del país contratante, ni el impuesto de renta. No son asesoría financiera, legal ni tributaria. Lee también nuestra{' '}
          <Link href="/transparencia">transparencia</Link>.
        </p>

        <FuentesOficiales
          fuentes={[
            { texto: 'Ley 2277 de 2022, artículo 89', href: 'http://www.secretariasenado.gov.co/senado/basedoc/ley_2277_2022.html' },
            { texto: 'Ley 797 de 2003 (Fondo de Solidaridad Pensional)', href: 'http://www.secretariasenado.gov.co/senado/basedoc/ley_0797_2003.html' },
            { texto: 'Ley 100 de 1993', href: 'http://www.secretariasenado.gov.co/senado/basedoc/ley_0100_1993.html' },
            { texto: 'Decreto 1990 de 2016 (calendario de pago de la PILA)', href: 'https://normativa.colpensiones.gov.co/compilacion/docs/decreto_1990_2016.htm' },
            { texto: 'Decreto 159 de 2026 (salario mínimo transitorio)', href: 'https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=192181&dt=S' },
            { texto: 'Decreto 1470 de 2025 (auxilio de transporte)', href: 'https://cancilleria.gov.co/normograma/compilacion/docs/decreto_1470_2025.htm' },
            { texto: 'datos.gov.co: TRM de la Superintendencia Financiera', href: 'https://www.datos.gov.co/resource/32sa-8pi3.json' },
          ]}
        />
        <Faq
          preguntas={[
            { pregunta: '¿Por qué una tasa de Frilo puede ser distinta a la que veo en la app del banco?', respuesta: <p>Porque las entidades cambian sus tasas sin avisar. Mostramos la fecha en que la consultamos; verifica siempre en la entidad antes de decidir.</p> },
          ]}
        />
      </PaginaTexto>
      <JsonLd id="Inst-2" />
    </>
  );
}
