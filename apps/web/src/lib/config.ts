/** Direcciones y ambiente. Producción = solo el despliegue de producción de Vercel; todo lo demás se trata como prueba. */
export const URL_SITIO = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://frilo.dev').replace(/\/$/, '');
export const URL_APP = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.frilo.dev').replace(/\/$/, '');
/**
 * Doble candado: el sitio solo se indexa si es el despliegue de producción de Vercel Y existe `PUBLICAR_SITIO=si`.
 * Esa variable solo se crea cuando Nicolás da la instrucción de publicar (brief §9): hasta entonces todo es noindex.
 */
export const ES_PRODUCCION = process.env.VERCEL_ENV === 'production' && process.env.PUBLICAR_SITIO === 'si';
/** Dominio de las cookies de sesión compartidas con la app (`.frilo.dev`). Sin valor = cookies del propio sitio. */
export const COOKIE_DOMINIO = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined;
export const GOOGLE_ACTIVO = process.env.NEXT_PUBLIC_GOOGLE_ACTIVO === 'true';
export const LARGO_CODIGO = Number(process.env.NEXT_PUBLIC_LARGO_CODIGO ?? 6);

export const RUTA_CUENTAS = '/guias/cuentas-de-ahorro-alto-rendimiento';
