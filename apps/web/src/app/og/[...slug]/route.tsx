import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { PAGINAS } from '../../../lib/seo';

export const dynamic = 'force-dynamic';

/** Imagen para compartir 1200×630: la F en una esquina y el H1 de la página. `/og/home.png`, `/og/guias/ibc-independientes.png`… */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const ruta = '/' + slug.join('/').replace(/\.png$/, '');
  const pagina = PAGINAS.find((p) => p.ruta === (ruta === '/home' ? '/' : ruta));
  if (!pagina) return new Response('No existe', { status: 404 });

  const svg = readFileSync(path.join(process.cwd(), 'public/logos/isotipo-manzana.svg'));
  const isotipo = `data:image/svg+xml;base64,${svg.toString('base64')}`;
  const titulo = pagina.id === 'Home' ? 'Tus finanzas, mejor con Frilo' : pagina.h1;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0F372D', color: '#FFFFFF', padding: 72 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={isotipo} alt="" height={96} style={{ height: 96 }} />
        <div style={{ display: 'flex', fontSize: titulo.length > 70 ? 54 : 66, fontWeight: 700, lineHeight: 1.12, letterSpacing: -1.5, maxWidth: 1000 }}>{titulo}</div>
        <div style={{ display: 'flex', fontSize: 30, color: '#B5CCC1' }}>frilo.dev · Más claridad, más libertad</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
