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
    (DIN / f'Vista{ident.replace("-", "")}{nombre}.tsx').write_text(ajustes_vista(ident, ajustes_moviles(arreglar_font(tsx))), encoding='utf-8')
    return nombres


DIN = RAIZ / 'apps/web/src/dinamicos'
CSS_ACUMULADO = []


# ---------------------------------------------------------------------------------------------------------------------
# Enlazado interno (diagnóstico SEO E3, E4 y E6). Se aplica al TSX ya generado para que regenerar no lo pierda.
# ---------------------------------------------------------------------------------------------------------------------
SIGLAS = {'ARL': '/glosario#arl', 'FSP': '/glosario#fsp', 'IBC': '/glosario#ibc', 'PILA': '/glosario#pila', 'SLN': '/glosario/sln'}
SIN_SIGLA = {'P02': {'IBC'}, 'P06': {'SLN'}}  # la página que explica el término no se enlaza a sí misma
ESTILO_ENLACE_TEXTO = '{{ color: "inherit", textDecoration: "underline" }}'


def _enlazar_siglas(tsx, ident):
    """Primera mención de cada sigla del glosario, dentro del cuerpo (`<article className="prose">`), enlaza al glosario."""
    lineas = tsx.split('\n')
    dentro, profundidad_articulo, saltar, hechas = False, 0, 0, set(SIN_SIGLA.get(ident, set()))
    for i, linea in enumerate(lineas):
        t = linea.strip()
        if not dentro:
            if t.startswith('<article') and 'className="prose"' in t:
                dentro, profundidad_articulo = True, 1
            continue
        if t.startswith('<article'):
            profundidad_articulo += 1
        if t.startswith('</article'):
            profundidad_articulo -= 1
            if profundidad_articulo == 0:
                break
        abre = re.match(r'<(a|Link|h[1-6]|table|th|strong)\b', t) and '</' not in t and not t.endswith('/>')
        cierra = re.match(r'</(a|Link|h[1-6]|table|th|strong)>', t)
        if abre:
            saltar += 1
            continue
        if cierra:
            saltar = max(0, saltar - 1)
            continue
        if saltar or t.startswith('<') or not t:
            continue
        cadena = t.startswith('{"') and t.endswith('"}')
        texto_linea = json.loads(t[1:-1]) if cadena else t
        if cadena is False and ('{' in t or '}' in t):
            continue
        pendientes = [(m.start(), m.group(1)) for m in re.finditer(r'(?<![\w/#-])(' + '|'.join(SIGLAS) + r')(?![\w-])', texto_linea) if m.group(1) not in hechas]
        if not pendientes:
            continue
        sangria = linea[: len(linea) - len(linea.lstrip())]
        piezas, cursor = [], 0
        for inicio, sigla in pendientes:
            if sigla in hechas:
                continue
            hechas.add(sigla)
            piezas.append(('t', texto_linea[cursor:inicio]))
            piezas.append(('l', sigla))
            cursor = inicio + len(sigla)
        piezas.append(('t', texto_linea[cursor:]))
        salida = ''
        for tipo, valor in piezas:
            if tipo == 'l':
                salida += f'<Link href="{SIGLAS[valor]}" style={ESTILO_ENLACE_TEXTO}>{valor}</Link>'
            elif valor:
                salida += '{' + json.dumps(valor, ensure_ascii=False) + '}'
        lineas[i] = sangria + salida
    return '\n'.join(lineas)


def _enlazar_confianza(tsx):
    """E4: «Nicolás Suárez» → /quienes-somos y «Cómo calculamos / Cómo hacemos nuestras guías» → /metodologia."""
    autor = 'Escrito y revisado por Nicolás Suárez con fuentes oficiales'
    est = '{{ color: "inherit", textDecoration: "underline" }}'
    # texto dentro de una cadena JSX: {"… Escrito y revisado por Nicolás Suárez con fuentes oficiales · "}
    tsx = re.sub(
        r'\{"([^"{}]*?)' + re.escape(autor) + r'([^"{}]*)"\}',
        lambda m: '{"' + m.group(1) + 'Escrito y revisado por "}<Link href="/quienes-somos" style=' + est + '>Nicolás Suárez</Link>{" con fuentes oficiales' + m.group(2) + '"}',
        tsx,
    )
    # texto suelto dentro de un <span>
    tsx = re.sub(
        r'(>\s*\n\s*)' + re.escape(autor) + r'(\s*\n\s*</span>)',
        lambda m: m.group(1) + 'Escrito y revisado por <Link href="/quienes-somos" style=' + est + '>Nicolás Suárez</Link> con fuentes oficiales' + m.group(2),
        tsx,
    )
    tsx = re.sub(r'<a href="(?:#metodo|#como|#)" (style=\{\{[^}]*\}\}>\s*(?:Cómo calculamos|Cómo hacemos nuestras guías)\s*)</a>', r'<Link href="/metodologia" \1</Link>', tsx)
    return tsx


_TARJETA = re.compile(
    r'<Link href="([^"]+)" className="card" style=\{\{([^}]*)\}\}>\s*'
    r'<span style=\{\{([^}]*)\}\}>\s*([^<]*?)\s*</span>\s*'
    r'(<span style=\{\{[^}]*\}\}>\s*[^<]*?\s*</span>)\s*</Link>'
)


def _limpiar_tarjetas(tsx):
    """E6: en las tarjetas solo el título es el texto del enlace; la descripción queda fuera del <a> y la tarjeta entera sigue siendo clicable."""
    def cambia(m):
        href, estilo_tarjeta, estilo_titulo, titulo, descripcion = m.groups()
        estilo_tarjeta += ', position: "relative"'
        color = '' if 'color:' in estilo_titulo else ', color: "inherit"'
        return (
            f'<div className="card" style={{{{{estilo_tarjeta}}}}}>\n'
            f'<Link href="{href}" className="card-enlace" style={{{{{estilo_titulo}{color}, textDecoration: "none"}}}}>\n{titulo}\n</Link>\n'
            f'{descripcion}\n</div>'
        )
    return _TARJETA.sub(cambia, tsx)


def enlazar(tsx, ident):
    tsx = _limpiar_tarjetas(_enlazar_confianza(_enlazar_siglas(tsx, ident)))
    if 'Link' in tsx and "import Link from 'next/link';" not in tsx:
        tsx = tsx.replace("import type { ReactNode } from 'react';", "import type { ReactNode } from 'react';\nimport Link from 'next/link';", 1)
    return tsx


def arreglar_font(t):
    """`font: 600 18px/1 inherit` es inválido en CSS (`inherit` no puede ir dentro del atajo): el navegador lo descarta y deja
    el campo en 13,3 px, y iOS hace zoom al tocarlo. Se expande a propiedades sueltas."""
    t = re.sub(r'font:\s*(\d{3}) ([\d.]+)px/([\d.]+) inherit', r'font-weight:\1;font-size:\2px;line-height:\3;font-family:inherit', t)
    t = re.sub(r'font: (["\'])(\d{3}) ([\d.]+)px/([\d.]+) inherit\1', r'fontWeight: \2, fontSize: "\3px", lineHeight: \4, fontFamily: "inherit"', t)
    return t


def ajustes_moviles(t):
    """Teléfonos de 360 px: las columnas `minmax(340px, 1fr)` no caben con el relleno de la página (desborde de 25 px), y el texto
    de 12-13 px es ilegible en pantalla pequeña (mínimo 14 px)."""
    t = re.sub(r'minmax\((\d+)px, 1fr\)', r'minmax(min(\1px, 100%), 1fr)', t)
    t = re.sub(r'fontSize: "1[23]px"', 'fontSize: "14px"', t)
    t = re.sub(r'font-size:1[23]px', 'font-size:14px', t)
    return t

def h1_del_home(tsx):
    """H1 del Home = el título con las palabras clave; «Frilo» (logo) pasa a H2. El título va primero en el código (orden de lectura y de
    importancia) y el logo se muestra arriba con `order`."""
    m_logo = re.search(r'            <h1 style=\{\{ margin: "0", display: "flex", alignItems: "center", gap: "20px" \}\}>(.*?)</h1>\n', tsx, re.S)
    m_tit = re.search(r'            <h2 style=\{\{ margin: "0", fontSize: "clamp\(28px, 3\.4vw, 42px\)"([^>]*)>(.*?)</h2>\n', tsx, re.S)
    if not (m_logo and m_tit):
        return tsx
    logo = '            <h2 className="home-marca" style={{ margin: "0", display: "flex", alignItems: "center", gap: "20px" }}>' + m_logo.group(1) + '</h2>\n'
    titulo = '            <h1 style={{ margin: "0", fontSize: "clamp(28px, 3.4vw, 42px)"' + m_tit.group(1).replace('}}', '}}', 1) + '>' + m_tit.group(2) + '</h1>\n'
    tsx = tsx[: m_logo.start()] + titulo + logo + tsx[m_tit.end() :] if m_logo.start() < m_tit.start() else tsx
    return tsx.replace('<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>\n            <h1', '<div className="home-columna" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>\n            <h1', 1)


def ajustes_vista(ident, tsx):
    """Plazo del interés compuesto: en móvil la columna mide ~134 px y el selector fijo de 104 px dejaba el campo de meses en 34 px
    (sin espacio para escribir). Ahora el campo tiene un mínimo de 88 px y el selector baja de línea si no caben."""
    if ident == 'P10':
        tsx = tsx.replace('<div style={{ display: "flex", gap: "8px" }}>\n                    <input id="ic-meses"', '<div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>\n                    <input id="ic-meses"')
        tsx = tsx.replace('style={{ flex: "1 1 0", minWidth: "0" }} />\n                    <select aria-label="Unidad del plazo"', 'style={{ flex: "1 1 88px", minWidth: "88px" }} />\n                    <select aria-label="Unidad del plazo"')
        tsx = tsx.replace('style={{ flex: "0 0 104px", padding: "0 8px" }}', 'style={{ flex: "1 1 104px", padding: "0 8px" }}')
        # «Efectiva anual (E.A.)» se cortaba en el selector de media columna: tipo de tasa y capitalización se apilan en pantallas angostas
        parte = '<div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>'
        i = tsx.find(parte, tsx.find(parte) + 1)
        if i > 0:
            tsx = tsx[:i] + '<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "14px" }}>' + tsx[i + len(parte):]
    for ident_aj, id_campo, nombre_vista in (('P03', 'ingresoInd', 'VistaP03b1'), ('P12', 'g-ingreso', 'VistaP12b1')):
        if ident == ident_aj and f'id="{id_campo}"' in tsx:
            tsx = re.sub(r'(<input id="' + id_campo + r'"[^>]*/>)', r'\1\n            {ajuste}', tsx, count=1)
            if ident == 'P03':  # el salario del modo con contrato laboral (el que abre por defecto) lleva su propia barra
                tsx = re.sub(r'(<input id="salario"[^>]*/>)', r'\1\n                  {ajusteSalario}', tsx, count=1)
            tsx = tsx.replace('export type Vars' + ident_aj + 'b1 = { ', 'export type Vars' + ident_aj + 'b1 = { ajuste?: any; ' + ('ajusteSalario?: any; ' if ident_aj == 'P03' else ''), 1).replace('export function ' + nombre_vista + '({ ', 'export function ' + nombre_vista + '({ ajuste, ' + ('ajusteSalario, ' if ident_aj == 'P03' else ''), 1)
    if ident == 'P01':  # el ajuste del ingreso (barra y botones ±) se pinta justo debajo del campo
        tsx = tsx.replace('<input id="ingreso" className="field" inputMode="numeric" value={ingresoTxt} onChange={onIngreso} />', '<input id="ingreso" className="field" inputMode="numeric" value={ingresoTxt} onChange={onIngreso} />\n            {ajuste}')
        # etiquetas más cortas: en un teléfono de 360 px el selector cerrado cortaba «(0,522%)»
        tsx = tsx.replace('I · oficina, trabajo digital (0,522%)', 'I · oficina (0,522%)').replace('(4,350%) · la paga el contratante', '(4,350%) · paga contratante').replace('(6,960%) · la paga el contratante', '(6,960%) · paga contratante')
        tsx = tsx.replace('export type VarsP01b1 = { ', 'export type VarsP01b1 = { ajuste?: any; ', 1).replace('export function VistaP01b1({ ', 'export function VistaP01b1({ ajuste, ', 1)
    return tsx

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
    if ident == 'P06':  # la miga «Glosario» del wireframe apunta a «#»: ahora existe el hub
        tsx = re.sub(r'<a href="#" (style=\{\{[^}]*\}\}>\s*Glosario\s*)</a>', r'<Link href="/glosario" \1</Link>', tsx)
    tsx = ajustes_moviles(arreglar_font(enlazar(tsx, ident)))
    if ident == 'Home':
        tsx = h1_del_home(tsx)
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
        (SALIDA / 'wireframes.css').write_text('/* GENERADO por scripts/wireframes-a-tsx.py: estilos de cada wireframe, limitados a su página. */\n' + ajustes_moviles(arreglar_font('\n\n'.join(CSS_ACUMULADO))) + '\n', encoding='utf-8')
