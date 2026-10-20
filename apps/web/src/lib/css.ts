/** "min-height: 44px; border: 0" → `{ minHeight: '44px', border: '0' }` (los wireframes alternan estilos como texto). */
export function cssAObjeto(css: string): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const par of css.split(';')) {
    const i = par.indexOf(':');
    if (i < 0) continue;
    const clave = par.slice(0, i).trim();
    const valor = par.slice(i + 1).trim();
    if (!clave) continue;
    obj[clave.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = valor;
  }
  return obj;
}
