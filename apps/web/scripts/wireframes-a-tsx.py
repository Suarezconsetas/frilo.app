#!/usr/bin/env python3
"""Convierte los wireframes aprobados (docs/sitio-seo/Wireframes_sitio_Frilo/*.dc.html) en componentes TSX.

El contenido visible (textos, tablas, preguntas, fuentes) pasa tal cual. Lo que es interactivo en el lienzo (`{{...}}`, `sc-if`,
`sc-for`) se reemplaza por una ranura `dinamicos.<nombre>` que se rellena con un componente real en la página.

Uso: python3 -I apps/web/scripts/wireframes-a-tsx.py [Archivo.dc.html ...]   (sin argumentos: todas las páginas)
"""
import json, re, sys
from html.parser import HTMLParser
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[3]
REEMPLAZOS = json.loads((RAIZ / 'apps/web/content/reemplazos.json').read_text(encoding='utf-8'))['reemplazos']


# Botones de guardar/registrarse junto a un resultado: llevan al registro de la misma página (no a la portada de la app,
# que pediría calcular otra vez). Los CTA de cierre de página siguen yendo a la app.
CTA_A_REGISTRO = ('btn btn-m', 'btn btn-p')


def corregir(t):
    for a, b in REEMPLAZOS:
        t = t.replace(a, b)
    return t

WF = RAIZ / 'docs/sitio-seo/Wireframes_sitio_Frilo'
SALIDA = RAIZ / 'apps/web/src/paginas'

PAGINAS = {  # archivo → (id del Excel, nombre del componente)
    'Main.dc.html': ('Home', 'ContenidoHome'),
    'CalculadorasHub.dc.html': ('Hub-C', 'ContenidoHubCalculadoras'),
    'Calculadora.dc.html': ('P01', 'ContenidoP01'),
    'Cesantias.dc.html': ('P03', 'ContenidoP03'),
    'FechaPago.dc.html': ('P05', 'ContenidoP05'),
    'InteresCompuesto.dc.html': ('P10', 'ContenidoP10'),
    'DolarHoy.dc.html': ('P07', 'ContenidoP07'),
    'GuiasHub.dc.html': ('Hub-G', 'ContenidoHubGuias'),
    'GuiaIBC.dc.html': ('P02', 'ContenidoP02'),
    'GuiaDescargarPlanilla.dc.html': ('P04', 'ContenidoP04'),
    'Guia.dc.html': ('P12', 'ContenidoP12'),
    'GuiaCuentaDolares.dc.html': ('P08', 'ContenidoP08'),
    'GuiaRecibirDolares.dc.html': ('P09', 'ContenidoP09'),
    'CuentasRentables.dc.html': ('P11', 'ContenidoP11'),
    'GlosarioSLN.dc.html': ('P06', 'ContenidoP06'),
    'LandingSEM.dc.html': ('SEM', 'ContenidoSEM'),
}
RUTAS = {
    'Main.dc.html': '/', 'CalculadorasHub.dc.html': '/calculadoras', 'Calculadora.dc.html': '/calculadoras/aportes-independientes',
    'Cesantias.dc.html': '/calculadoras/cesantias', 'FechaPago.dc.html': '/calculadoras/fecha-pago-planilla',
    'InteresCompuesto.dc.html': '/calculadoras/interes-compuesto', 'DolarHoy.dc.html': '/dolar-hoy', 'GuiasHub.dc.html': '/guias',
    'GuiaIBC.dc.html': '/guias/ibc-independientes', 'GuiaDescargarPlanilla.dc.html': '/guias/descargar-planilla-seguridad-social',
    'Guia.dc.html': '/guias/cesantias-independientes', 'GuiaCuentaDolares.dc.html': '/guias/cuenta-en-dolares-colombia',
    'GuiaRecibirDolares.dc.html': '/guias/recibir-pagos-en-dolares-colombia', 'CuentasRentables.dc.html': '/guias/cuentas-de-ahorro-alto-rendimiento',
    'GlosarioSLN.dc.html': '/glosario/sln', 'LandingSEM.dc.html': '/lp/planilla-independientes',
}
# Ranuras forzadas (bloques con interacción que el lienzo no marca con {{ }}): archivo → [(tag, atributo, valor, nombre)]
RANURAS_FORZADAS = {
    'DolarHoy.dc.html': [
        ('section', 'aria-labelledby', 'h-grafico', 'grafico'),
        ('section', 'aria-labelledby', 'h-alerta', 'alerta'),
        ('section', 'aria-labelledby', 'h-conv', 'conversor'),
        ('div', 'TABLA', 't', 'tabla'),
    ],
    'Main.dc.html': [('form', 'ID', 'x', 'hero')],
}
# Marcadores [..] del wireframe que se reemplazan por datos reales, en orden de aparición (fuera de las ranuras).
MARCADORES = {
    'Main.dc.html': ['d.hoyTxt'],
    'DolarHoy.dc.html': [
        'd.fechaTitulo', 'd.hoyTxt', 'd.desde', 'd.verbo', 'd.varAyerPct', 'd.actualizado',
        'd.hoyTxt', 'd.varAyerTxt', 'd.semana.valor', 'd.semana.txt', 'd.mes.valor', 'd.mes.txt', 'd.anio.valor', 'd.anio.txt',
        'd.hoyTxt', 'd.desde',
    ],
}
# Imágenes /_blob/ del lienzo = logos de la marca (se deducen de Header y Footer): id → (componente, tono)
BLOBS = {
    '34387cbc3838c02c4d9ef15a15b5d70e': ('Isotipo', 'manzana'),
    '00d18b0804a41bfd4b8dc73e11787dbc': ('Wordmark', 'manzana'),
    'f3656da70462c6952d82c0d3b2018938': ('Isotipo', 'oliva'),
    'd0f681e9e4342550da9e3738b8e57b2f': ('Wordmark', 'oliva'),
}
VOID = {'br', 'img', 'input', 'meta', 'link', 'hr', 'source', 'col', 'wbr'}
NUMERICOS = {'colspan', 'rowspan', 'maxlength', 'minlength', 'tabindex', 'size', 'rows', 'cols'}
BOOL = {'checked', 'disabled', 'open', 'required', 'readonly', 'selected', 'hidden', 'multiple', 'autofocus'}
RENOMBRAR = {'class': 'className', 'for': 'htmlFor', 'colspan': 'colSpan', 'rowspan': 'rowSpan', 'tabindex': 'tabIndex', 'autocomplete': 'autoComplete',
             'inputmode': 'inputMode', 'maxlength': 'maxLength', 'minlength': 'minLength', 'readonly': 'readOnly', 'datetime': 'dateTime', 'srcset': 'srcSet',
             'viewbox': 'viewBox', 'preserveaspectratio': 'preserveAspectRatio', 'crossorigin': 'crossOrigin', 'referrerpolicy': 'referrerPolicy',
             'onchange': 'onChange', 'onclick': 'onClick', 'oninput': 'onInput', 'onblur': 'onBlur', 'onfocus': 'onFocus', 'onsubmit': 'onSubmit', 'onkeydown': 'onKeyDown'}


class Nodo:
    def __init__(self, tag, attrs, padre):
        self.tag, self.attrs, self.padre, self.hijos = tag, dict(attrs), padre, []


class Arbol(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.raiz = Nodo('raiz', [], None)
        self.cur = self.raiz

    def handle_starttag(self, tag, attrs):
        n = Nodo(tag, attrs, self.cur)
        self.cur.hijos.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.hijos.append(Nodo(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        c = self.cur
        while c is not None and c.tag != tag:
            c = c.padre
        if c is not None and c.padre is not None:
            self.cur = c.padre

    def handle_data(self, d):
        self.cur.hijos.append(d)


def buscar(n, tag):
    if isinstance(n, str):
        return None
    if n.tag == tag:
        return n
    for h in n.hijos:
        r = buscar(h, tag)
        if r:
            return r


def es_dinamico(n):
    if isinstance(n, str):
        return '{{' in n
    if n.tag.startswith('sc-') or any('{{' in (v or '') for v in n.attrs.values()):
        return True
    return any(es_dinamico(h) for h in n.hijos)


def texto(n):
    return n if isinstance(n, str) else ' '.join(texto(h) for h in n.hijos)


def es_raiz_dinamica(n):
    """Se reemplaza el elemento completo si todo su contenido interesante es dinámico; si mezcla bloques estáticos largos
    con dinámicos, se baja un nivel y solo se reemplazan los hijos dinámicos."""
    if isinstance(n, str) or not es_dinamico(n):
        return False
    elementos = [h for h in n.hijos if not isinstance(h, str)]
    dinamicos = [h for h in elementos if es_dinamico(h)]
    estaticos = [h for h in elementos if not es_dinamico(h) and len(re.sub(r'\s+', ' ', texto(h)).strip()) > 60]
    return not (estaticos and dinamicos)


def estilo_a_obj(css):
    partes = [p for p in css.split(';') if ':' in p]
    out = []
    for p in partes:
        k, v = p.split(':', 1)
        k = k.strip()
        v = v.strip()
        if k.startswith('--'):
            clave = json.dumps(k)
        else:
            clave = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)
            if k.startswith('-webkit-') or k.startswith('-ms-'):
                clave = clave[0].upper() + clave[1:]
        out.append(f'{clave}: {json.dumps(v, ensure_ascii=False)}')
    return '{{ ' + ', '.join(out) + ' }}'


def nombre_attr(k):
    if k.startswith('data-') or k.startswith('aria-'):
        return k
    if k in RENOMBRAR:
        return RENOMBRAR[k]
    return re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)


class Convertidor:
    def __init__(self, archivo, ident):
        self.archivo, self.ident = archivo, ident
        self.dinamicos = []  # (nombre, resumen)
        self.nodos_dinamicos = []
        self.pendientes = []
        self.usa_app = False
        self.cola = list(MARCADORES.get(archivo, []))
        self.usa_datos = archivo in MARCADORES
        self.usa_link = False
        self.usa_isotipo = False
        self.banners = set()

    def ruta_interna(self, href):
        base = href.split('#')[0]
        if base in RUTAS:
            r = RUTAS[base]
            return r + (('#' + href.split('#')[1]) if '#' in href else '')
        return None

    def attrs(self, n):
        res = []
        for k, v in n.attrs.items():
            if k in ('support', 'hint-placeholder-count', 'hint-placeholder-val', 'hint-size') or k.startswith('on'):
                continue
            if k == 'href' and (v or '').rstrip('/') == 'https://frilo.dev':
                if n.attrs.get('class') in CTA_A_REGISTRO:
                    res.append('href="#registro"')
                    continue
                self.usa_app = True
                res.append('href={URL_APP}')
            elif k == 'style':
                res.append(f'style={estilo_a_obj(v)}')
            elif v is None or (k in BOOL and v in ('', k)):
                res.append(nombre_attr(k))
            elif k in NUMERICOS and (v or '').strip().lstrip('-').isdigit():
                res.append(f'{nombre_attr(k)}={{{v.strip()}}}')
            else:
                res.append(f'{nombre_attr(k)}={json.dumps(v, ensure_ascii=False)}')
        return res

    def texto_jsx(self, s, anterior_inline):
        t = re.sub(r'\s+', ' ', corregir(s))
        if self.cola and re.search(r'\[[^\]]+\]', t):
            partes = []
            for trozo in re.split(r'(\[[^\]]+\])', t):
                if re.fullmatch(r'\[[^\]]+\]', trozo) and self.cola:
                    partes.append('{' + self.cola.pop(0) + '}')
                elif trozo:
                    partes.append('{' + json.dumps(trozo, ensure_ascii=False) + '}' if re.search(r'[{}<>]', trozo) or trozo != trozo.strip() else trozo)
            return ''.join(partes)
        if not t.strip():
            return "{' '}" if (' ' in s and '\n' not in s and anterior_inline) else ''
        lidera = t.startswith(' ')
        trail = t.endswith(' ')
        nucleo = t.strip()
        # Marcador de contenido pendiente en el wireframe ("[2–3 párrafos: …]"): se deja visible como [VERIFICAR].
        if re.fullmatch(r'\[(?!VERIFICAR)[^\]]{12,}\]', nucleo):
            self.pendientes.append(nucleo)
            return '<span className="verificar">{' + json.dumps('[VERIFICAR] ' + nucleo[1:-1], ensure_ascii=False) + '}</span>'
        if re.search(r'[{}<>]', nucleo) or (lidera and anterior_inline) or trail:
            return '{' + json.dumps(('' if not lidera else ' ') + nucleo + (' ' if trail else ''), ensure_ascii=False) + '}'
        return nucleo

    def a_jsx(self, n, nivel=0):
        pad = '  ' * nivel
        if isinstance(n, str):
            t = self.texto_jsx(n, True)
            return pad + t if t else ''
        tag = n.tag
        if tag in ('helmet', 'script', 'style', 'title', 'meta', 'link', 'x-dc'):
            if tag == 'x-dc':
                return '\n'.join(x for x in (self.a_jsx(h, nivel) for h in n.hijos) if x)
            return ''
        if tag == 'dc-import':
            nombre = n.attrs.get('name')
            if nombre in ('Header', 'Footer'):
                return ''
            if nombre == 'BannerRendimiento':
                self.banners.add('BannerRendimiento')
                return f'{pad}<BannerRendimiento variante={json.dumps(n.attrs.get("variante", "prima"))} pagina={json.dumps(self.ident)} />'
            if nombre == 'BannerRegistro':
                self.banners.add('BannerRegistro')
                return f'{pad}<BannerRegistro variante={json.dumps(n.attrs.get("variante", "general"))} pagina={json.dumps(self.ident)} />'
            return f'{pad}{{/* dc-import sin resolver: {nombre} */}}'
        for tag_, attr_, val_, nombre_ in RANURAS_FORZADAS.get(self.archivo, []):
            if n.tag != tag_:
                continue
            if attr_ == 'ID':
                ok = True  # primer <form> de la página (el formulario del hero)
            elif attr_ == 'TABLA':
                el = [h for h in n.hijos if not isinstance(h, str)]
                ok = len(el) == 1 and el[0].tag == 'table' and 't' in el[0].attrs.get('class', '').split()
            else:
                ok = n.attrs.get(attr_) == val_
            if ok:
                self.dinamicos.append((nombre_, 'Ranura forzada'))
                return f'{pad}{{dinamicos.{nombre_}}}'
        # Las tablas de cuentas de P11 se generan desde `lib/calculos/cuentas.ts` (una sola fuente de tasas): ranura en vez de texto fijo.
        if self.archivo == 'CuentasRentables.dc.html' and n.tag == 'div':
            el = [h for h in n.hijos if not isinstance(h, str)]
            if len(el) == 1 and el[0].tag == 'table' and 't' in el[0].attrs.get('class', '').split() and len([d for d in self.dinamicos if d[0].startswith('tabla')]) < 2:
                nombre = ['tablaPesos', 'tablaDolares'][len([d for d in self.dinamicos if d[0].startswith('tabla')])]
                self.dinamicos.append((nombre, 'Tabla de cuentas generada desde cuentas.ts'))
                return f'{pad}{{dinamicos.{nombre}}}'
        if es_raiz_dinamica(n):
            nombre = f'b{len([d for d in self.dinamicos if d[0].startswith("b")]) + 1}'
            self.dinamicos.append((nombre, re.sub(r'\s+', ' ', texto(n))[:110]))
            self.nodos_dinamicos.append((nombre, n))
            return f'{pad}{{dinamicos.{nombre}}}'
        if tag == 'img':
            alto = re.search(r'height:\s*(\d+)px', n.attrs.get('style', ''))
            alto_css = re.search(r'height:\s*(clamp\([^)]*\))', n.attrs.get('style', ''))
            if '/_blob/' in n.attrs.get('src', ''):
                self.usa_isotipo = True
                comp, tono = BLOBS.get(n.attrs['src'].split('/_blob/')[1], ('Isotipo', 'manzana'))
                extra = f' altoCss={json.dumps(alto_css.group(1))}' if alto_css else ''
                return f'{pad}<{comp} tono="{tono}" alto={{{alto.group(1) if alto else 28}}}{extra} />'
        attrs = self.attrs(n)
        if tag == 'a' and 'href' in n.attrs:
            interna = self.ruta_interna(n.attrs['href'])
            if interna:
                self.usa_link = True
                resto = [a for a in attrs if not a.startswith('href=')]
                tag = 'Link'
                attrs = [f'href={json.dumps(interna)}'] + resto
        if tag == 'a' and n.attrs.get('target') == '_blank' and 'rel' not in n.attrs:
            attrs.append('rel="noopener"')
        ab = ('<' + tag + (' ' + ' '.join(attrs) if attrs else ''))
        if tag in VOID:
            return pad + ab + ' />'
        hijos = []
        for i, h in enumerate(n.hijos):
            prev_inline = i > 0 and (isinstance(n.hijos[i - 1], str) or n.hijos[i - 1].tag in ('a', 'span', 'strong', 'em', 'b', 'i', 'code', 'svg', 'img'))
            if isinstance(h, str):
                t = self.texto_jsx(h, prev_inline)
                if t:
                    hijos.append(pad + '  ' + t)
            else:
                s = self.a_jsx(h, nivel + 1)
                if s:
                    hijos.append(s)
        if tag == 'h1' and hijos and all('<Isotipo' in h or '<Wordmark' in h for h in hijos):
            hijos.append(pad + '  <span className="sr-only">Frilo</span>')  # el H1 lleva texto real además de los logos
        if not hijos:
            return f'{pad}{ab} />'
        return f'{pad}{ab}>\n' + '\n'.join(hijos) + f'\n{pad}</{tag}>'


def css_de(archivo, ident):
    """Reglas <style> del wireframe, limitadas a la página (`.wf-<ID>`): cada lienzo define sus propios anchos y tablas."""
    html = (WF / archivo).read_text(encoding='utf-8')
    reglas = []
    for bloque in re.findall(r'<style>(.*?)</style>', html, re.S):
        for sel, cuerpo in re.findall(r'([^{}]+)\{([^{}]*)\}', bloque):
            sels = []
            for x in sel.split(','):
                x = x.strip()
                if not x:
                    continue
                sels.append(f'.wf-{ident}' if x == 'body' else f'.wf-{ident} {x}')
            if sels:
                reglas.append(f"{', '.join(sels)} {{{cuerpo.strip()}}}")
    return '\n'.join(reglas)


# ── Vistas de los bloques dinámicos ─────────────────────────────────────
EXPR = re.compile(r'\{\{\s*([^{}]+?)\s*\}\}')


class Vista:
    """Convierte un bloque con {{...}}, sc-if y sc-for en JSX de React que recibe las variables como props."""

    def __init__(self, ident):
        self.ident = ident
        self.vars = {}  # nombre -> tipo

    def var(self, expr, tipo='string'):
        raiz = re.split(r'[.\[]', expr)[0]
        if raiz in self.locales:
            return
        previo = self.vars.get(raiz)
        if previo is None or (previo == 'string' and tipo != 'string') or (previo not in ('any', 'string') and tipo == 'any'):
            self.vars[raiz] = tipo

    locales = set()

    def attr(self, k, v):
        if k in ('hint-placeholder-count', 'hint-placeholder-val', 'hint-size', 'support'):
            return None
        nk = nombre_attr(k)
        if k == 'style' and '{{' in v:
            m = EXPR.fullmatch(v.strip())
            if m:
                self.var(m.group(1))
                return f'style={{cssAObjeto({m.group(1)})}}'
        if k == 'style':
            return f'style={estilo_a_obj(v)}'
        if v is None:
            return nk
        m = EXPR.fullmatch(v.strip())
        if m:
            e = m.group(1)
            tipo = 'handler' if k.startswith('on') else ('boolean' if k in BOOL else ('any' if (k.startswith('aria-') or k in ('maxlength', 'minlength', 'size', 'rows', 'cols', 'tabindex', 'min', 'max', 'step')) else 'string'))
            self.var(e, tipo)
            return f'{nk}={{{e}}}'
        if k == 'href' and v.rstrip('/') == 'https://frilo.dev':
            return 'href={URL_APP}'
        if '{{' in v:
            partes = []
            for t in re.split(r'(\{\{[^{}]+\}\})', v):
                if t.startswith('{{'):
                    e = t[2:-2].strip()
                    self.var(e)
                    partes.append('${' + e + '}')
                else:
                    partes.append(t.replace('`', '\\`'))
            return f'{nk}={{`{"".join(partes)}`}}'
        if k in NUMERICOS and v.strip().lstrip('-').isdigit():
            return f'{nk}={{{v.strip()}}}'
        return f'{nk}={json.dumps(v, ensure_ascii=False)}'

    def texto(self, s, inline_prev):
        out = []
        for t in re.split(r'(\{\{[^{}]+\}\})', s):
            if t.startswith('{{'):
                e = t[2:-2].strip()
                self.var(e)
                out.append('{' + e + '}')
            else:
                x = re.sub(r'\s+', ' ', corregir(t))
                if not x.strip():
                    if ' ' in t and '\n' not in t and inline_prev:
                        out.append("{' '}")
                    continue
                lid, tra = x.startswith(' '), x.endswith(' ')
                core = x.strip()
                if re.search(r'[{}<>]', core) or lid or tra:
                    out.append('{' + json.dumps((' ' if lid else '') + core + (' ' if tra else ''), ensure_ascii=False) + '}')
                else:
                    out.append(core)
        return ''.join(out)

    def jsx(self, n, nivel):
        pad = '  ' * nivel
        if isinstance(n, str):
            t = self.texto(n, True)
            return pad + t if t else ''
        tag = n.tag
        if tag == 'sc-for':
            lista = EXPR.fullmatch(n.attrs['list'].strip()).group(1)
            como = n.attrs.get('as', 'x')
            self.var(lista, 'array')
            Vista.locales = Vista.locales | {como}
            hijos = '\n'.join(x for x in (self.jsx(h, nivel + 2) for h in n.hijos) if x)
            Vista.locales = Vista.locales - {como}
            return f'{pad}{{{lista}.map(({como}: any, i: number) => (\n{pad}  <Fragment key={{i}}>\n{hijos}\n{pad}  </Fragment>\n{pad}))}}'
        if tag == 'sc-if':
            cond = EXPR.fullmatch(n.attrs['value'].strip()).group(1)
            self.var(cond, 'boolean')
            hijos = '\n'.join(x for x in (self.jsx(h, nivel + 2) for h in n.hijos) if x)
            return f'{pad}{{{cond} ? (\n{pad}  <>\n{hijos}\n{pad}  </>\n{pad}) : null}}'
        attrs = [a for a in (self.attr(k, v) for k, v in n.attrs.items()) if a]
        if tag == 'a' and 'href' in n.attrs and '{{' not in n.attrs['href']:
            h = n.attrs['href']
            base = h.split('#')[0]
            if base in RUTAS:
                tag = 'Link'
                attrs = [f'href={json.dumps(RUTAS[base] + ("#" + h.split("#")[1] if "#" in h else ""))}'] + [a for a in attrs if not a.startswith('href=')]
        if tag == 'img' and '/_blob/' in n.attrs.get('src', ''):
            alto = re.search(r'height:\s*(\d+)px', n.attrs.get('style', ''))
            comp, tono = BLOBS.get(n.attrs['src'].split('/_blob/')[1], ('Isotipo', 'manzana'))
            return f'{pad}<{comp} tono="{tono}" alto={{{alto.group(1) if alto else 28}}} />'
        if tag == 'a' and n.attrs.get('target') == '_blank':
            attrs.append('rel="noopener"')
        ab = '<' + tag + (' ' + ' '.join(attrs) if attrs else '')
        if tag in VOID:
            return pad + ab + ' />'
        hijos = []
        for i, h in enumerate(n.hijos):
            prev_inline = i > 0 and (isinstance(n.hijos[i - 1], str) or n.hijos[i - 1].tag in ('a', 'span', 'strong', 'em', 'b', 'i', 'code', 'svg', 'img'))
            if isinstance(h, str):
                t = self.texto(h, prev_inline)
                if t:
                    hijos.append(pad + '  ' + t)
            else:
                x = self.jsx(h, nivel + 1)
                if x:
                    hijos.append(x)
        if not hijos:
            return f'{pad}{ab} />'
        return f'{pad}{ab}>\n' + '\n'.join(hijos) + f'\n{pad}</{tag}>'


def tipo_ts(t):
    return {'string': 'string', 'boolean': 'boolean', 'array': 'any[]', 'handler': '(e: any) => void', 'any': 'any'}[t]


def escribir_vista(ident, nombre, nodo):
    v = Vista(ident)
    Vista.locales = set()
    cuerpo = v.jsx(nodo, 3)
    for clase in CTA_A_REGISTRO:
        cuerpo = cuerpo.replace(f'className="{clase}" href={{URL_APP}}', f'className="{clase}" href="#registro"')
    nombres = sorted(v.vars)
    tipos = ' '.join(f'{k}: {tipo_ts(v.vars[k])};' for k in nombres)
    usa_link = '<Link' in cuerpo
    usa_iso = '<Isotipo' in cuerpo
    cab = ["'use client';", '', "import { Fragment } from 'react';"]
    if usa_link:
        cab.append("import Link from 'next/link';")
    if usa_iso:
        cab.append("import { Isotipo, Wordmark } from '../components/Logo';")
    if 'URL_APP' in cuerpo:
        cab.append("import { URL_APP } from '../lib/config';")
    if 'cssAObjeto(' in cuerpo:
        cab.append("import { cssAObjeto } from '../lib/css';")
    tsx = (
        f"/* GENERADO por scripts/wireframes-a-tsx.py desde el bloque {nombre} de {ident}. El marcado es el del wireframe; la lógica vive en el hook de la página. */\n"
        + '\n'.join(cab)
        + f"\n\nexport type Vars{ident.replace('-', '')}{nombre} = {{ {tipos} }};\n\n"
        + f"export function Vista{ident.replace('-', '')}{nombre}({{ {', '.join(nombres)} }}: Vars{ident.replace('-', '')}{nombre}) {{\n  return (\n{cuerpo}\n  );\n}}\n"
    )
    DIN.mkdir(parents=True, exist_ok=True)
    (DIN / f'Vista{ident.replace("-", "")}{nombre}.tsx').write_text(tsx, encoding='utf-8')
    return nombres


DIN = RAIZ / 'apps/web/src/dinamicos'
CSS_ACUMULADO = []


def convertir(archivo):
    ident, comp = PAGINAS[archivo]
    html = (WF / archivo).read_text(encoding='utf-8')
    arbol = Arbol()
    arbol.feed(html)
    xdc = buscar(arbol.raiz, 'x-dc')
    c = Convertidor(archivo, ident)
    # contenido: <main> si existe; si no, todo lo que hay dentro de x-dc
    main = buscar(xdc, 'main')
    if main is not None:
        wrap = Nodo('div', [(k, v) for k, v in main.attrs.items()], None)
        wrap.hijos = main.hijos
        previos = []
        for h in main.padre.hijos:
            if h is main:
                break
            if not isinstance(h, str) and h.tag not in ('dc-import', 'helmet') and texto(h).strip():
                previos.append(c.a_jsx(h, 2))
        cuerpo = '\n'.join(previos + [c.a_jsx(wrap, 2)])
    else:
        cuerpo = '\n'.join(x for x in (c.a_jsx(h, 2) for h in xdc.hijos) if x)
    imports = ["import type { ReactNode } from 'react';"]
    if c.usa_link:
        imports.append("import Link from 'next/link';")
    if c.usa_isotipo:
        imports.append("import { Isotipo, Wordmark } from '../components/Logo';")
    if c.usa_app:
        imports.append("import { URL_APP } from '../lib/config';")
    if c.usa_datos:
        imports.append("import type { DatosTrm } from '../lib/trm';")
    if 'BannerRendimiento' in c.banners:
        imports.append("import { BannerRendimiento } from '../components/BannerRendimiento';")
    if 'BannerRegistro' in c.banners:
        imports.append("import { BannerRegistro } from '../components/BannerRegistro';")
    claves = ', '.join(f'{n}?: ReactNode' for n, _ in c.dinamicos)
    resumen = '\n'.join(f' *   {n}: {r}' for n, r in c.dinamicos) or ' *   (ninguno)'
    tsx = (
        f"/* GENERADO por scripts/wireframes-a-tsx.py desde {archivo}. El contenido es el copy aprobado de los wireframes.\n"
        f" * Bloques interactivos del lienzo (se rellenan con componentes reales vía `dinamicos`):\n{resumen}\n */\n"
        + '\n'.join(imports)
        + f"\n\nexport function {comp}({{ dinamicos = {{}}{', d' if c.usa_datos else ''} }}: {{ dinamicos?: {{ {claves} }}{'; d: DatosTrm' if c.usa_datos else ''} }}) {{\n  return (\n    <div className=\"wf wf-{ident}\">\n{cuerpo}\n    </div>\n  );\n}}\n"
    )
    (SALIDA / f'{ident}.tsx').write_text(tsx, encoding='utf-8')
    CSS_ACUMULADO.append(f'/* {archivo} */\n' + css_de(archivo, ident))
    print(f'{archivo:34} → paginas/{ident}.tsx   dinámicos: {len(c.dinamicos)}')
    for t in c.pendientes:
        print(f'      PENDIENTE: {t[:140]}')
    for nombre, nodo in c.nodos_dinamicos:
        vars_ = escribir_vista(ident, nombre, nodo)
        print(f'      vista {nombre}: ' + ', '.join(vars_))
    for n, r in c.dinamicos:
        print(f'      {n}: {r}')


if __name__ == '__main__':
    SALIDA.mkdir(parents=True, exist_ok=True)
    objetivo = sys.argv[1:] or list(PAGINAS)
    for a in objetivo:
        convertir(a)
    if not sys.argv[1:]:
        (SALIDA / 'wireframes.css').write_text('/* GENERADO por scripts/wireframes-a-tsx.py: estilos de cada wireframe, limitados a su página. */\n' + '\n\n'.join(CSS_ACUMULADO) + '\n', encoding='utf-8')
