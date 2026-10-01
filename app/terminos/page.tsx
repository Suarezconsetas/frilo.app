import type { Metadata } from 'next';
import Link from 'next/link';
import { AVISOS } from '@/lib/calculos';
import { LEGAL } from '@/lib/legal';
import { PaginaLegal, Seccion } from '../_ui/Legal';

export const metadata: Metadata = { title: 'Términos de uso' };

export default function Terminos() {
  return (
    <PaginaLegal titulo="Términos de uso" intro="Las reglas para usar Frilo, en lenguaje claro.">
      <Seccion n={1} titulo="Qué es Frilo (y qué no es)">
        <p>
          Frilo es una herramienta informativa para personas que trabajan por prestación de servicios o para clientes del exterior en Colombia. Te ayuda a estimar
          tus aportes a seguridad social, a reconstruir una prima y unas cesantías por tu cuenta y a seguir el dólar (TRM).
        </p>
        <p>
          <strong>Frilo no es una entidad financiera, ni una asesoría financiera, tributaria, contable o legal.</strong> No gestionamos tu dinero, no pagamos tu
          planilla por ti y no te recomendamos productos de inversión. Las decisiones sobre tu dinero son tuyas.
        </p>
      </Seccion>

      <Seccion n={2} titulo="Tu cuenta">
        <ul>
          <li>Debes ser mayor de 18 años y darnos un correo que sea tuyo.</li>
          <li>Entras con un código que te enviamos o con tu cuenta de Google. Cuida el acceso a tu correo: quien lo tenga puede entrar a tu cuenta.</li>
          <li>Tú eres responsable de que la información que escribes sea veraz.</li>
          <li>Puedes dejar de usar Frilo y pedir que borremos tu cuenta cuando quieras, como explica la <Link href="/politica-de-datos">Política de datos</Link>.</li>
        </ul>
      </Seccion>

      <Seccion n={3} titulo="Los cálculos son estimados">
        <p>{AVISOS.alcanceCalculos}</p>
        <ul>
          <li>Usamos los parámetros legales del año (por ejemplo, el salario mínimo y las tarifas de aportes) y te mostramos las normas en las que se basan.</li>
          <li>
            El ahorro de prima y cesantías es un cálculo de referencia: aparta 1/12 de tu ingreso bruto para cada una. No equivale a las prestaciones sociales de un
            contrato laboral, y tu contrato por prestación de servicios no las incluye.
          </li>
          <li>La TRM viene de datos abiertos de la Superintendencia Financiera de Colombia (datos.gov.co) y puede tener retrasos o diferencias con la tasa que realmente te pagan.</li>
          <li>Confirma siempre los valores con tu operador de planilla, tu contador o la entidad correspondiente antes de pagar o decidir.</li>
        </ul>
      </Seccion>

      <Seccion n={4} titulo="Productos de terceros y enlaces">
        <p>{AVISOS.comparador}</p>
        <p>
          {AVISOS.rendimientos} Algunos enlaces pueden ser de referidos con los que Frilo recibe una comisión; en ese caso se marcan como “{AVISOS.patrocinado}”. Al
          entrar a la página de un tercero aplican sus propios términos y políticas, y no le enviamos tus datos personales.
        </p>
      </Seccion>

      <Seccion n={5} titulo="Uso aceptable">
        <p>
          Usa Frilo solo para tus propias finanzas y de forma lícita. No intentes acceder a cuentas de otras personas, afectar el servicio, extraer datos de forma masiva
          ni usarlo para actividades ilegales.
        </p>
      </Seccion>

      <Seccion n={6} titulo="Propiedad intelectual">
        <p>
          La marca, el logo, el diseño y el código de Frilo son de {LEGAL.razonSocial} o de sus licenciantes. Te damos un derecho personal, limitado y revocable para
          usar la herramienta; no puedes copiarla ni usar la marca sin permiso. Tus datos siguen siendo tuyos.
        </p>
      </Seccion>

      <Seccion n={7} titulo="Disponibilidad y responsabilidad">
        <p>
          Hacemos nuestro mejor esfuerzo para que Frilo funcione bien, pero se ofrece “tal cual”, sin garantía de que esté siempre disponible o libre de errores.
          Dentro de lo que la ley permita, no respondemos por decisiones que tomes basándote solo en los cálculos de la herramienta, ni por diferencias entre una
          estimación y los valores reales de tus pagos, impuestos o rendimientos. Esto no limita derechos que la ley te reconozca como consumidor.
        </p>
      </Seccion>

      <Seccion n={8} titulo="Tus datos personales">
        <p>
          Tratamos tus datos como explica la <Link href="/politica-de-datos">Política de tratamiento de datos personales</Link>, que forma parte de estos términos.
        </p>
      </Seccion>

      <Seccion n={9} titulo="Cambios y terminación">
        <p>
          Podemos actualizar estos términos o el servicio. Si el cambio es importante te avisaremos. Seguir usando Frilo después del aviso significa que lo aceptas. Podemos
          suspender una cuenta que incumpla estos términos o ponga en riesgo el servicio.
        </p>
      </Seccion>

      <Seccion n={10} titulo="Ley aplicable y contacto">
        <p>
          Estos términos se rigen por las leyes de Colombia. Si tienes una duda o queja, escríbenos a {LEGAL.correoPrivacidad}. Si no llegamos a un acuerdo, puedes
          acudir a la Superintendencia de Industria y Comercio o a la jurisdicción colombiana.
        </p>
      </Seccion>
    </PaginaLegal>
  );
}
