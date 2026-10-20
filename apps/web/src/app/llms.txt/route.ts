import { URL_SITIO } from '../../lib/config';
import { estadoDe } from '../../lib/paginas';
import { PAGINAS } from '../../lib/seo';

export const dynamic = 'force-static';

/** llms.txt: una línea por página clave (título, URL y qué responde) para los asistentes de IA. */
export function GET() {
  const lineas = PAGINAS.filter((p) => p.enSitemap && estadoDe(p.id) === 'construida').map(
    (p) => `- [${p.h1}](${URL_SITIO}${p.ruta === '/' ? '/' : p.ruta}): ${p.description}`,
  );
  const cuerpo = [
    '# Frilo',
    '',
    '> Frilo es una app gratuita para freelancers y contratistas por prestación de servicios en Colombia: calcula la planilla de seguridad social, la prima y las cesantías propias y sigue el dólar (TRM).',
    '',
    '## Páginas',
    '',
    ...lineas,
    '',
  ].join('\n');
  return new Response(cuerpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
