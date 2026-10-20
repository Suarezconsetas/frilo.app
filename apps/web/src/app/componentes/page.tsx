import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BannerRegistro } from '../../components/BannerRegistro';
import { BannerRendimiento } from '../../components/BannerRendimiento';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Faq } from '../../components/Faq';
import { FuentesOficiales } from '../../components/FuentesOficiales';
import { JsonLd } from '../../components/JsonLd';
import { LineaConfianza } from '../../components/LineaConfianza';
import { ES_PRODUCCION } from '../../lib/config';
import { marcadoresPendientes } from '../../lib/seo';

export const metadata: Metadata = { title: 'Componentes (vista previa interna)', robots: { index: false, follow: false } };

/** Vista previa interna de los componentes de la Fase 1. No existe en producción. */
export default function Componentes() {
  if (ES_PRODUCCION) notFound();
  return (
    <div className="contenido">
      <p className="borrador">
        <strong>Vista previa interna.</strong> Solo existe fuera de producción y no se indexa.
      </p>
      <Breadcrumb niveles={[{ texto: 'Inicio', href: '/' }, { texto: 'Calculadoras', href: '/calculadoras' }, { texto: 'Aportes para independientes' }]} />
      <h1>Calculadora de aportes para independientes 2026</h1>
      <LineaConfianza id="P01" />
      <p className="respuesta-corta">Ejemplo de la caja “La respuesta corta”: con $8.000.000 al mes, un independiente en riesgo I con ARL paga $928.700 de planilla.</p>

      <h2>BannerRendimiento</h2>
      <BannerRendimiento variante="aportes" pagina="componentes" />

      <h2>BannerRegistro</h2>
      <BannerRegistro variante="recordatorio" pagina="componentes" intencion={{ tipo: 'recordatorio', digitos: '89' }} />

      <FuentesOficiales
        fuentes={[
          { texto: 'Decreto 1990 de 2016', href: 'https://normativa.colpensiones.gov.co/compilacion/docs/decreto_1990_2016.htm' },
          { texto: 'Ley 2277 de 2022, artículo 89', href: 'http://www.secretariasenado.gov.co/senado/basedoc/ley_2277_2022.html' },
        ]}
      />
      <Faq preguntas={[{ pregunta: '¿Ejemplo de pregunta frecuente?', respuesta: <p>Aquí va la respuesta visible, igual al JSON-LD FAQPage.</p> }]} />
      <p className="aviso">
        Marcadores sin resolver en el JSON-LD de P01: {marcadoresPendientes('P01').join(', ') || 'ninguno'}.
      </p>
      <JsonLd id="P01" />
    </div>
  );
}
