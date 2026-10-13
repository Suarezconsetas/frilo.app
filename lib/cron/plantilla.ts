/** Marco común de los correos de Frilo: cabecera oliva con logo, cuerpo claro y pie. HTML con estilos en línea. */

export const escapar = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const sinBarraFinal = (url: string) => url.replace(/\/$/, '');

export function envolverCorreo(p: { urlApp: string; kicker: string; cifra: string; subtitulo: string; cuerpo: string; pie: string }): string {
  const logo = `${sinBarraFinal(p.urlApp)}/email/logo.png`; // PNG público: los correos no admiten SVG
  return `<!doctype html>
<html lang="es-CO"><body style="margin:0;background:#F3F6F4;font-family:Helvetica,Arial,sans-serif;color:#0F372D;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F6F4;padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFFFF;border:1px solid #D6E0DA;border-radius:16px;">
<tr><td style="background:#0F372D;border-radius:16px 16px 0 0;padding:24px;">
<img src="${escapar(logo)}" width="48" height="48" alt="Frilo" style="display:block;border:0;outline:none;text-decoration:none;">
<p style="margin:20px 0 0 0;font-size:14px;color:#B5CCC1;">${escapar(p.kicker)}</p>
<p style="margin:8px 0 0 0;font-size:34px;line-height:40px;font-weight:700;color:#6FFF8F;">${escapar(p.cifra)}</p>
<p style="margin:4px 0 0 0;font-size:15px;color:#FFFFFF;">${escapar(p.subtitulo)}</p>
</td></tr>
<tr><td style="padding:24px;">
${p.cuerpo}
</td></tr></table>
${p.pie}
</td></tr></table></body></html>`;
}

export function boton(href: string, texto: string): string {
  return `<p style="margin:0 0 24px 0;"><a href="${escapar(href)}" style="display:inline-block;background:#0F372D;color:#6FFF8F;text-decoration:none;font-weight:600;font-size:16px;padding:14px 24px;border-radius:12px;">${escapar(texto)}</a></p>`;
}

export const parrafo = (html: string, o: { chico?: boolean; margen?: number } = {}) =>
  `<p style="margin:0 0 ${o.margen ?? 16}px 0;font-size:${o.chico ? 13 : 16}px;line-height:${o.chico ? 19 : 24}px;${o.chico ? 'color:#4A6158;' : ''}">${html}</p>`;
