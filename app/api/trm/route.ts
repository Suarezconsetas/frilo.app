import { cargarDatosTrm } from '@/lib/trm-servidor';

// La app lo pide cuando se abre con datos de otro día. Se guarda 5 minutos en la red de Vercel, no por visita.
export const dynamic = 'force-dynamic';

export async function GET() {
  const datos = await cargarDatosTrm();
  return Response.json(datos, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } });
}
