// Carga la TRM de datos.gov.co en `trm_diaria` (upsert por vigenciadesde). Uso: npm run trm:cargar [-- --dias=450]
// Es la misma operación que hará la tarea diaria: aquí sirve para sembrar el historial.
// Usa la service role: solo corre en tu máquina o en el servidor, nunca en el navegador.

const env = process.env;
for (const n of ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) {
  if (!env[n]) {
    console.error(`Falta ${n} en .env.local`);
    process.exit(1);
  }
}

const dias = Number(process.argv.find((a) => a.startsWith('--dias='))?.split('=')[1] ?? 450);
const desde = new Date(Date.now() - dias * 864e5).toISOString().slice(0, 10);

const url = new URL('https://www.datos.gov.co/resource/32sa-8pi3.json');
url.searchParams.set('$where', `vigenciadesde >= '${desde}T00:00:00.000'`);
url.searchParams.set('$order', 'vigenciadesde');
url.searchParams.set('$limit', '5000');

const r = await fetch(url);
if (!r.ok) {
  console.error(`datos.gov.co respondió ${r.status}`);
  process.exit(1);
}
const filas = (await r.json()).map((f) => ({
  vigenciadesde: f.vigenciadesde.slice(0, 10),
  vigenciahasta: f.vigenciahasta.slice(0, 10),
  valor: Number(f.valor),
}));
if (!filas.length) {
  console.error('datos.gov.co no devolvió filas');
  process.exit(1);
}

const clave = env.SUPABASE_SERVICE_ROLE_KEY;
const guardar = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/trm_diaria?on_conflict=vigenciadesde`, {
  method: 'POST',
  headers: {
    apikey: clave,
    Authorization: `Bearer ${clave}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=minimal',
  },
  body: JSON.stringify(filas),
});
if (!guardar.ok) {
  console.error(`Supabase respondió ${guardar.status}: ${await guardar.text()}`);
  process.exit(1);
}
console.log(`✅ ${filas.length} TRM guardadas (${filas[0].vigenciadesde} → ${filas.at(-1).vigenciadesde})`);
