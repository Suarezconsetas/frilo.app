// Verifica las conexiones externas de Frilo. Uso: npm run verificar
// Lee .env.local (node --env-file). No imprime claves.

const env = process.env;
const resultados = [];

async function prueba(nombre, fn) {
  try {
    const detalle = await fn();
    resultados.push({ nombre, ok: true, detalle });
  } catch (e) {
    resultados.push({ nombre, ok: false, detalle: e.message });
  }
}

function exigir(...nombres) {
  const faltan = nombres.filter((n) => !env[n]);
  if (faltan.length) throw new Error(`falta en .env.local: ${faltan.join(", ")}`);
}

const supabase = (ruta, clave, opts = {}) =>
  fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}${ruta}`, {
    ...opts,
    headers: { apikey: clave, Authorization: `Bearer ${clave}`, ...opts.headers },
  });

await prueba("Supabase · clave pública (anon)", async () => {
  exigir("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const r = await supabase("/rest/v1/perfiles?select=id&limit=1", env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const filas = await r.json();
  if (filas.length) throw new Error("¡anon pudo leer perfiles! Revisa el RLS");
  return "responde y el RLS no deja ver perfiles sin sesión";
});

await prueba("Supabase · service role", async () => {
  exigir("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY");
  const tablas = ["perfiles", "autorizaciones", "fuentes_ingreso", "pagos", "cobros", "alertas", "trm_diaria"];
  for (const t of tablas) {
    const r = await supabase(`/rest/v1/${t}?select=*&limit=1`, env.SUPABASE_SERVICE_ROLE_KEY);
    if (!r.ok) throw new Error(`${t}: HTTP ${r.status}`);
  }
  return `lee las ${tablas.length} tablas`;
});

await prueba("Resend · clave y remitente", async () => {
  exigir("RESEND_API_KEY", "RESEND_FROM");
  const r = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
  });
  // Una clave "solo envío" da 401 restricted_api_key: la clave es válida pero no lista dominios.
  const cuerpo = await r.json().catch(() => ({}));
  if (r.status === 401 && cuerpo.name === "restricted_api_key") return "clave válida (solo envío)";
  if (!r.ok) throw new Error(`HTTP ${r.status} ${cuerpo.message ?? ""}`.trim());
  const dominio = /@([^>\s]+)/.exec(env.RESEND_FROM)?.[1];
  const d = cuerpo.data?.find((x) => x.name === dominio);
  return d ? `dominio ${dominio}: ${d.status}` : `clave válida; ${dominio} no está en Resend`;
});

await prueba("datos.gov.co · TRM", async () => {
  const r = await fetch("https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde DESC");
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const [fila] = await r.json();
  return `TRM ${fila.valor} vigente desde ${fila.vigenciadesde.slice(0, 10)}`;
});

for (const { nombre, ok, detalle } of resultados) console.log(`${ok ? "✅" : "❌"} ${nombre}: ${detalle}`);
process.exit(resultados.every((r) => r.ok) ? 0 : 1);
