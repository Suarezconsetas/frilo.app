// Muestra las últimas ejecuciones de la tarea diaria (TRM + alertas). Uso: npm run cron:ver [-- --n=30]
// Lee `cron_ejecuciones` con la service role: solo corre en tu máquina o en el servidor.
import { createClient } from '@supabase/supabase-js';

const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: clave } = process.env;
if (!url || !clave) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}
const n = Number(process.argv.find((a) => a.startsWith('--n='))?.split('=')[1] ?? 14);
const db = createClient(url, clave, { auth: { persistSession: false } });
const { data, error } = await db.from('cron_ejecuciones').select('*').order('ejecutada_en', { ascending: false }).limit(n);
if (error) {
  console.error('No se pudo leer cron_ejecuciones:', error.message);
  process.exit(1);
}
if (!data.length) {
  console.log('Todavía no hay ejecuciones registradas. La primera queda al correr el cron (13:00 UTC = 8:00 a.m. en Colombia).');
  process.exit(0);
}
const hora = (iso) => new Date(iso).toLocaleString('es-CO', { timeZone: 'America/Bogota', dateStyle: 'short', timeStyle: 'short' });
for (const r of data) {
  const trm = r.trm_hoy === null ? 'sin TRM' : `TRM $${Number(r.trm_hoy).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
  console.log(
    `${r.ok ? '✅' : '❌'} ${hora(r.ejecutada_en)} (hora de Colombia) · ${trm} · ${r.alertas_activas} alertas activas · ${r.disparadas} disparadas · ` +
      `${r.correos_enviados} correos enviados, ${r.correos_fallidos} fallidos · ${r.duracion_ms} ms` +
      (r.error_trm ? ` · TRM: ${r.error_trm}` : '') + (r.error ? ` · error: ${r.error}` : ''),
  );
}
