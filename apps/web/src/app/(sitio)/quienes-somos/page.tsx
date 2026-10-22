import Link from 'next/link';
import { JsonLd } from '../../../components/JsonLd';
import { PaginaTexto } from '../../../components/PaginaTexto';
import { metadataDe } from '../../../lib/seo';

export const metadata = metadataDe('Inst-1');

export default function Pagina() {
  return (
    <>
      <PaginaTexto id="Inst-1">
        <p className="respuesta-corta">
          Frilo es una app gratuita para freelancers y contratistas por prestación de servicios en Colombia, que cobran en pesos, en dólares o en ambos. Te ayuda a entender el dólar, calcular tu planilla y
          reconstruir la prima y las cesantías que tu contrato no trae.
        </p>

        <h2>La historia detrás de Frilo</h2>
        <p>
          Soy Nicolás Suárez, experto en SEO y marketing de contenidos, con más de 7 años de experiencia trabajando con marcas de consumo masivo, medios de comunicación y agencias de publicidad.
        </p>
        <p>
          A lo largo de mi carrera, he desarrollado una curiosidad especial por encontrar formas de mejorar y automatizar procesos, crear herramientas útiles y hacer que el trabajo del día a día sea más
          fácil, tanto para mí como para las personas y los clientes con los que trabajo.
        </p>
        <p>Esa curiosidad, sumada a un cambio importante en mi vida, fue lo que dio origen a Frilo.</p>
        <p>
          Hace un tiempo empecé a trabajar para una empresa fuera de Colombia y a recibir mi sueldo en dólares. Aunque esto representaba una oportunidad muy positiva para mis finanzas, también me planteó
          nuevos retos: aprender a organizar mejor mis ingresos, prepararme para las fluctuaciones del dólar y asumir por mi cuenta obligaciones como la seguridad social, las pensiones y el ahorro para
          cubrir periodos sin ingresos.
        </p>
        <p>
          Me di cuenta de que necesitaba una forma sencilla de organizar mis finanzas, anticiparme a los pagos y tomar mejores decisiones con el dinero que ganaba cada mes. Quería que mis ingresos no
          solo me permitieran cubrir mis gastos, sino también acercarme a mis metas personales y profesionales.
        </p>
        <p>Y pensé: si yo estoy pasando por esto, seguramente hay muchas más personas en Colombia que también lo necesitan.</p>
        <p>
          Así nació <strong>Frilo</strong>, un asistente financiero pensado para freelancers que trabajan desde Colombia para el exterior y reciben sus ingresos en dólares, personas que trabajan por
          prestación de servicios y contratistas del Estado que necesitan organizar sus pagos y administrar mejor su dinero.
        </p>

        <h2>Dos objetivos claros</h2>
        <p>Al crear Frilo, tenía dos objetivos muy claros.</p>
        <p>El primero era construir una herramienta que yo mismo pudiera utilizar en mi día a día para organizar mis finanzas de forma fácil, rápida y sin complicaciones.</p>
        <p>
          El segundo era poner esa herramienta al alcance de todos, sin ningún costo para sus usuarios. Quería que cualquier persona que necesitara un poco más de claridad sobre sus finanzas pudiera
          acceder a ella sin tener que pagar una suscripción.
        </p>

        <h2>Qué puedes hacer con Frilo</h2>
        <p>
          Con Frilo puedes tener un panel de control para organizar tus finanzas y recibir recordatorios por correo electrónico sobre fechas importantes, como el pago de tu planilla de seguridad social.
          También podrás recibir alertas sobre los movimientos del dólar y conocer oportunidades de cuentas de ahorro de alto rendimiento para explorar alternativas que te ayuden a hacer crecer tu
          dinero, tanto en pesos como en dólares.
        </p>
        <p>
          Pero Frilo es mucho más que una herramienta para llevar las cuentas. Es mi forma de convertir una necesidad personal en una solución que pueda ayudar a muchas otras personas a vivir con más
          tranquilidad, tomar mejores decisiones y tener mayor control sobre su dinero.
        </p>
        <p>
          <strong>Gracias por confiar en Frilo y dedicar unos minutos a conocerlo.</strong>
        </p>

        <h2>Un proyecto en construcción</h2>
        <p>
          Hoy, Frilo es un proyecto que construyo con mucha ilusión, siendo su fundador y, por ahora, su único colaborador. Por eso, cada registro significa muchísimo para mí. No solo me ayuda a validar
          que esta idea puede ser útil para otras personas, sino que también me motiva a seguir mejorándola y a construir, con el tiempo, un equipo que comparta este propósito.
        </p>
        <p>
          Mi objetivo es que Frilo crezca contigo y que, poco a poco, se convierta en ese aliado que te ayude a organizar mejor tus finanzas, tomar decisiones con más confianza y acercarte a tus metas.
        </p>
        <p>Porque creo que la libertad financiera empieza por algo muy sencillo: tener claridad sobre tu dinero y saber qué puedes hacer con él.</p>
        <p>
          <strong>Gracias por ser parte de Frilo.</strong>
        </p>
        <p>
          <em>Tu libertad financiera y tus metas, más cerca con Frilo.</em>
        </p>

        <h2>Cómo cuidamos lo que publicamos</h2>
        <p>
          Conoce cómo calculamos en la <Link href="/metodologia">metodología</Link> y qué hacemos y qué no en la <Link href="/transparencia">transparencia</Link>.
        </p>
      </PaginaTexto>
      <JsonLd id="Inst-1" />
    </>
  );
}
