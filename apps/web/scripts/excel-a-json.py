#!/usr/bin/env python3
"""Convierte docs/sitio-seo/URLs_SEO_sitio_Frilo.xlsx (hojas URLs y Datos estructurados) en apps/web/content/seo.json.

Uso: python3 -I apps/web/scripts/excel-a-json.py [ruta.xlsx]
El Excel es la fuente única de metadatos y JSON-LD. Quita los `sameAs` (la marca aún no tiene redes) y avisa si
queda algún marcador [VERIFICAR] o [URL ...] sin resolver.
"""
import json, re, sys, zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

RAIZ = Path(__file__).resolve().parents[3]
XLSX = Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ / 'docs/sitio-seo/URLs_SEO_sitio_Frilo.xlsx'
SALIDA = RAIZ / 'apps/web/content/seo.json'
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main', 'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}

z = zipfile.ZipFile(XLSX)
compartidas = [''.join(si.itertext()) for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', NS)]
libro = ET.fromstring(z.read('xl/workbook.xml'))
rels = {r.get('Id'): r.get('Target') for r in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
hojas = {s.get('name'): 'xl/' + rels[s.get('{%s}id' % NS['r'])].lstrip('/').replace('xl/', '') for s in libro.find('m:sheets', NS)}


# El Excel dice «Frilo» como H1 del Home; se decidió (28-oct-2026) que el H1 lleve las palabras clave y «Frilo» pase a H2.
H1_CORREGIDO = {'Home': 'Calculadoras gratis para independientes: aportes, cesantías y planilla'}


def filas(nombre):
    raiz = ET.fromstring(z.read(hojas[nombre]))
    for fila in raiz.iter('{%s}row' % NS['m']):
        celdas = {}
        for c in fila.findall('m:c', NS):
            v = c.find('m:v', NS)
            if v is None:
                t = c.find('m:is', NS)
                valor = ''.join(t.itertext()) if t is not None else ''
            else:
                valor = compartidas[int(v.text)] if c.get('t') == 's' else v.text
            celdas[re.sub(r'\d', '', c.get('r'))] = valor
        yield celdas


REEMPLAZOS = json.loads((RAIZ / 'apps/web/content/reemplazos.json').read_text(encoding='utf-8'))['reemplazos']


def corregir(o):
    """Aplica las correcciones de copy (content/reemplazos.json) también a los textos del JSON-LD, para que sigan iguales a lo visible."""
    if isinstance(o, dict):
        # Quien revisa es la misma persona que escribe (decisión del 22-10-2026): sin «equipo de finanzas».
        return {k: ({'@id': 'https://frilo.dev/#nicolas'} if k == 'reviewedBy' else corregir(v)) for k, v in o.items()}
    if isinstance(o, list):
        return [corregir(x) for x in o]
    if isinstance(o, str):
        for a, b in REEMPLAZOS:
            o = o.replace(a, b)
    return o


def quitar_same_as(o):
    if isinstance(o, dict):
        return {k: quitar_same_as(v) for k, v in o.items() if k != 'sameAs'}
    if isinstance(o, list):
        return [quitar_same_as(x) for x in o]
    return o


jsonld = {}
for f in list(filas('Datos estructurados'))[1:]:
    if not f.get('A') or not f.get('D', '').lstrip().startswith('{'):
        continue  # p. ej. la landing de pauta: "Ninguno"
    try:
        jsonld[f['A']] = corregir(quitar_same_as(json.loads(f['D'])))
    except json.JSONDecodeError as e:
        sys.exit(f'JSON-LD inválido en {f["A"]}: {e}')

paginas = []
for f in list(filas('URLs'))[1:]:
    ident = f.get('A', '')
    if not ident or not f.get('D', '').startswith('/') and ident != 'APP':
        continue
    if ident == 'APP' or ident.startswith('Rangos'):
        continue
    paginas.append({
        'id': ident,
        'nombre': f.get('B', ''),
        'ruta': f['D'],
        'tipo': f.get('E', ''),
        'wireframe': f.get('F', ''),
        'estado': f.get('G', ''),
        'robots': f.get('H', ''),
        'enSitemap': f.get('I', '').startswith('Sí'),  # «Sí, cuando sea indexable»: entra cuando la página está construida
        'canonical': f.get('J', ''),
        'keyword': f.get('L', ''),
        'title': f.get('R', ''),
        'description': f.get('T', ''),
        'h1': H1_CORREGIDO.get(ident, f.get('V', '')),
        'ogType': f.get('W', 'website'),
        'tiposSchema': f.get('X', ''),
        'breadcrumb': f.get('Y', ''),
        'frecuencia': f.get('Z', ''),
        'notas': f.get('AA', ''),
        'jsonld': jsonld.get(ident),
    })

texto = json.dumps(paginas, ensure_ascii=False, indent=2)
pendientes = sorted(set(re.findall(r'\[(?:VERIFICAR|URL)[^\]]*\]', texto)))
SALIDA.parent.mkdir(parents=True, exist_ok=True)
SALIDA.write_text(texto + '\n', encoding='utf-8')
print(f'{len(paginas)} páginas, {len(jsonld)} JSON-LD → {SALIDA.relative_to(RAIZ)}')
if pendientes:
    print('Marcadores sin resolver:', ', '.join(pendientes))
