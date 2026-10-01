import type { Metadata } from 'next';
import { LEGAL } from '@/lib/legal';
import { PaginaLegal, Seccion } from '../_ui/Legal';

export const metadata: Metadata = { title: 'Política de tratamiento de datos personales' };

export default function PoliticaDeDatos() {
  return (
    <PaginaLegal
      titulo="Política de tratamiento de datos personales"
      intro="Cómo cuidamos tus datos en Frilo, para qué los usamos y cómo ejercer tus derechos (Ley 1581 de 2012)."
    >
      <section aria-labelledby="resumen" className="resumen-legal">
        <h2 id="resumen">En resumen</h2>
        <ul>
          <li>Te pedimos solo lo necesario: tu correo, cómo te pagan, tu clase de riesgo y los ingresos que registras para calcular tu mes.</li>
          <li>
            <strong>No vendemos ni compartimos tus datos con terceros.</strong> Solo los tratan los proveedores técnicos que hacen funcionar Frilo, bajo nuestras
            instrucciones.
          </li>
          <li>Recibir novedades y ofertas de Frilo es opcional y viene desmarcado.</li>
          <li>Puedes conocer, corregir, actualizar o pedir que borremos tus datos, y revocar tu autorización.</li>
          <li>Si crees que no cumplimos, también puedes quejarte ante la Superintendencia de Industria y Comercio (SIC).</li>
        </ul>
      </section>

      <Seccion n={1} titulo="Quién es el responsable">
        <p>
          El responsable del tratamiento de tus datos personales es <strong>{LEGAL.razonSocial}</strong>, NIT {LEGAL.nit}, que opera la marca {LEGAL.marca}
          (en adelante, “Frilo”, “nosotros”).
        </p>
        <ul>
          <li>Domicilio: {LEGAL.domicilio}</li>
          <li>Correo para asuntos de privacidad: {LEGAL.correoPrivacidad}</li>
          <li>Teléfono: {LEGAL.telefono}</li>
        </ul>
      </Seccion>

      <Seccion n={2} titulo="Qué datos recogemos">
        <p>Según lo que uses, tratamos:</p>
        <ul>
          <li>
            <strong>Datos de tu cuenta:</strong> correo electrónico y, si entras con Google, tu nombre y el hecho de que usaste ese proveedor. No tenemos tu contraseña
            de Google ni usamos contraseñas propias: entras con un código que te enviamos por correo.
          </li>
          <li>
            <strong>Datos de tu perfil:</strong> cómo te pagan (dólares, pesos o ambos), un rango de ingreso (nunca la cifra exacta en el perfil), tu clase de riesgo
            ARL y si activas la ARL voluntaria.
          </li>
          <li>
            <strong>Datos de la herramienta:</strong> el nombre de quien te paga, los montos que registras, la tasa que te pagaron o la retención practicada (si
            decides escribirlas), los cobros de prima que marcas y las alertas del dólar que creas. Solo tú los ves.
          </li>
          <li>
            <strong>Prueba de tus autorizaciones:</strong> qué autorizaste, la fecha, la versión de esta política y el navegador desde el que lo hiciste.
          </li>
          <li>
            <strong>Datos técnicos mínimos:</strong> registros de seguridad y funcionamiento (por ejemplo, errores y accesos), necesarios para proteger el servicio.
          </li>
        </ul>
        <p>
          <strong>No pedimos</strong> datos sensibles (salud, origen, orientación, biometría y similares), números de documento, números de cuenta o tarjeta, ni
          contraseñas bancarias. Tampoco consultamos centrales de riesgo ni hacemos perfiles crediticios (Ley 1266 de 2008).
        </p>
      </Seccion>

      <Seccion n={3} titulo="Para qué usamos tus datos">
        <ul>
          <li>Crear y mantener tu cuenta, y que puedas entrar con seguridad.</li>
          <li>Calcular tus aportes a seguridad social, tu ahorro de prima y cesantías y lo que te queda cada mes, y guardar esos cálculos para ti.</li>
          <li>Enviarte las alertas del dólar que tú configures y los correos necesarios para el servicio (por ejemplo, el código para entrar).</li>
          <li>Conservar la prueba de tus autorizaciones, como exige la ley.</li>
          <li>Proteger el servicio, prevenir fraudes y atender solicitudes de autoridades competentes.</li>
          <li>Mejorar Frilo con estadísticas de uso agregadas, sin identificarte. Si añadimos herramientas de analítica, lo diremos en esta política.</li>
          <li>
            <strong>Solo si tú lo autorizas</strong> (casilla opcional): enviarte novedades, ofertas y recomendaciones de Frilo por correo. Puedes retirar esta
            autorización cuando quieras.
          </li>
        </ul>
      </Seccion>

      <Seccion n={4} titulo="Lo que no hacemos">
        <ul>
          <li>No vendemos tus datos.</li>
          <li>No los compartimos con terceros para sus propios fines (publicidad, perfilamiento, cobranza o similares).</li>
          <li>
            Al comparar cuentas de ahorro mostramos información pública de entidades financieras. Si hacemos clic en un enlace de una entidad, sales de Frilo; no le
            enviamos tus datos, y los enlaces con relación comercial se marcan como “Patrocinado”.
          </li>
        </ul>
      </Seccion>

      <Seccion n={5} titulo="Quién trata tus datos por nosotros">
        <p>Para funcionar usamos proveedores técnicos (encargados del tratamiento) que solo actúan bajo nuestras instrucciones:</p>
        <ul>
          <li>
            <strong>Supabase:</strong> base de datos y autenticación (servidores en Estados Unidos).
          </li>
          <li>
            <strong>Vercel:</strong> alojamiento de la aplicación.
          </li>
          <li>
            <strong>Resend:</strong> envío de correos (código de acceso y alertas).
          </li>
          <li>
            <strong>Google:</strong> solo si eliges entrar con tu cuenta de Google.
          </li>
        </ul>
        <p>
          Esto implica que tus datos se tratan y almacenan fuera de Colombia, en particular en Estados Unidos. Al aceptar esta política autorizas de forma expresa esa
          transmisión y transferencia, y exigimos a estos proveedores medidas de seguridad adecuadas. La TRM la consultamos en datos abiertos de Colombia
          (datos.gov.co) sin enviar ningún dato personal.
        </p>
        <p>También podremos entregar información cuando una autoridad competente lo exija conforme a la ley.</p>
      </Seccion>

      <Seccion n={6} titulo="Tus autorizaciones">
        <ul>
          <li>
            <strong>Tratamiento de datos (necesaria):</strong> sin ella no podemos crear tu cuenta ni calcular tu mes. La das al continuar con el registro, después de
            ver esta política.
          </li>
          <li>
            <strong>Novedades y ofertas de Frilo (opcional):</strong> la casilla viene desmarcada. Decir que no no limita el uso de la herramienta.
          </li>
        </ul>
        <p>
          Guardamos cada autorización como un registro nuevo (con fecha y versión) y no se editan: así puedes acreditar lo que autorizaste y cuándo. Para retirar la
          autorización de novedades, escríbenos a {LEGAL.correoPrivacidad}.
        </p>
      </Seccion>

      <Seccion n={7} titulo="Tus derechos">
        <p>Como titular de los datos tienes derecho a:</p>
        <ul>
          <li>Conocer, actualizar y rectificar tus datos.</li>
          <li>Pedir prueba de la autorización que nos diste.</li>
          <li>Ser informado, si lo solicitas, del uso que hemos dado a tus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.</li>
          <li>Revocar tu autorización y/o pedir la supresión de tus datos, cuando no se respeten los principios, derechos y garantías o cuando ya no sean necesarios.</li>
          <li>Acceder de forma gratuita a tus datos personales que hayan sido objeto de tratamiento.</li>
        </ul>
      </Seccion>

      <Seccion n={8} titulo="Cómo ejercer tus derechos: consultas y reclamos">
        <p>
          Escríbenos a {LEGAL.correoPrivacidad} desde el correo de tu cuenta, indicando qué quieres (consultar, corregir, actualizar, suprimir o revocar) y, si hace
          falta, los datos que ayuden a ubicar tu solicitud.
        </p>
        <ul>
          <li>
            <strong>Consultas:</strong> las respondemos en máximo 10 días hábiles. Si necesitamos más tiempo te avisamos el motivo y la nueva fecha, que no pasará de 5
            días hábiles adicionales.
          </li>
          <li>
            <strong>Reclamos</strong> (corrección, actualización, supresión o revocatoria): los atendemos en máximo 15 días hábiles. Si la solicitud está incompleta te
            pediremos lo que falte dentro de los 5 días siguientes. Si necesitamos más tiempo te avisamos, y no pasará de 8 días hábiles adicionales.
          </li>
        </ul>
        <p>
          La supresión no procede cuando tengamos un deber legal o contractual de conservar la información; en ese caso te lo explicamos. Solo puedes acudir a la SIC
          después de haber agotado este trámite con nosotros.
        </p>
      </Seccion>

      <Seccion n={9} titulo="Seguridad">
        <p>
          Aplicamos medidas técnicas y organizativas razonables: conexiones cifradas, acceso a la base de datos restringido por usuario (cada persona solo ve lo suyo),
          claves de servicio fuera del código y accesos limitados. Ningún sistema es infalible; si ocurre un incidente que afecte tus datos, lo informaremos a las
          autoridades y a ti cuando la ley lo exija.
        </p>
      </Seccion>

      <Seccion n={10} titulo="Por cuánto tiempo guardamos tus datos">
        <p>
          Mientras tengas tu cuenta y mientras sea necesario para las finalidades de esta política. Si pides la supresión o cierras tu cuenta, borramos tus datos,
          salvo lo que debamos conservar por ley o para acreditar tus autorizaciones y defendernos de reclamaciones, por el tiempo que esas normas indiquen.
        </p>
      </Seccion>

      <Seccion n={11} titulo="Cookies y almacenamiento en tu dispositivo">
        <p>
          Usamos una cookie de sesión para mantenerte dentro de tu cuenta y guardamos en tu dispositivo (almacenamiento local) los cálculos de tu mes para que no
          los pierdas. No usamos cookies publicitarias. Cerrar sesión borra esos datos de tu dispositivo.
        </p>
      </Seccion>

      <Seccion n={12} titulo="Menores de edad">
        <p>Frilo es para personas mayores de 18 años. No recogemos a sabiendas datos de menores; si detectamos una cuenta de un menor, la eliminamos.</p>
      </Seccion>

      <Seccion n={13} titulo="Cambios a esta política">
        <p>
          Si cambiamos esta política de forma sustancial, te lo avisaremos por la aplicación o por correo y te pediremos de nuevo tu autorización cuando la ley lo
          exija. La versión vigente siempre está en esta página, con su fecha.
        </p>
      </Seccion>

      <Seccion n={14} titulo="Normas que aplican">
        <p>
          Constitución Política (art. 15), Ley 1581 de 2012, Decreto 1377 de 2013 (incorporado en el Decreto Único 1074 de 2015) y las demás normas que los modifiquen o
          complementen.
        </p>
      </Seccion>
    </PaginaLegal>
  );
}
