/**
 * Lee la TRM guardada en `trm_diaria`. SOLO para el servidor (usa la service role):
 * el navegador recibe ya el resultado. Nunca se consulta datos.gov.co en una visita.
 */
import { createClient } from '@supabase/supabase-js';
import { panelTrm, type RegistroTrm } from '@/lib/calculos';
import type { DatosTrm } from '@/lib/app/tipos';
import { hoyColombia } from '@/lib/app/fechas';

export async function cargarDatosTrm(): Promise<DatosTrm | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !clave) return null;

  const db = createClient(url, clave, { auth: { persistSession: false } });
  const { data, error } = await db
    .from('trm_diaria')
    .select('valor, vigenciadesde, vigenciahasta')
    .order('vigenciadesde', { ascending: false })
    .limit(500);
  if (error || !data?.length) return null;

  const serie: RegistroTrm[] = data.map((f) => ({
    valor: Number(f.valor),
    vigenciadesde: String(f.vigenciadesde),
    vigenciahasta: String(f.vigenciahasta),
  }));

  const fecha = hoyColombia();
  try {
    const panel = panelTrm(serie, fecha);
    return {
      fecha,
      hoy: panel.hoy.trm,
      variaciones: panel.variaciones.map((v) => ({ ...v, referencia: v.referencia as 'semana' | 'mes' | 'anio' })),
    };
  } catch {
    // Serie corta (aún no hay un año de historia): devolvemos al menos la TRM de hoy.
    const ultima = serie[0];
    return ultima ? { fecha, hoy: ultima.valor, variaciones: [] } : null;
  }
}
