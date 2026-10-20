import Link from 'next/link';
import { AVISOS, CUENTAS_MVP, CUENTAS_USD, type CuentaAhorro } from '@/lib/calculos';
import { cuentasDestacadas } from '@/lib/app/derivados';
import { pct } from '@/lib/formato';
import { RUTA_CUENTAS } from '../lib/config';
import { fechaLarga } from '../lib/paginas';
import { Isotipo } from './Logo';

export type VarianteBanner = 'prima' | 'cesantias' | 'aportes' | 'dolar' | 'guia';

const TEXTOS: Record<VarianteBanner, { eyebrow: string; titulo: string; texto: string }> = {
  prima: {
    eyebrow: 'Tu prima, trabajando para ti',
    titulo: 'Lo que apartas para junio y diciembre puede rendir mientras llega.',
    texto: 'Guarda tu prima en una cuenta de ahorro que pague intereses diarios y retíralos cuando la necesites, sin plazos.',
  },
  cesantias: {
    eyebrow: 'Tus cesantías, con intereses',
    titulo: 'Un fondo te paga intereses por tus cesantías. Tu cuenta también puede hacerlo.',
    texto: 'Si eres independiente, aparta el 8,33% de cada pago en una cuenta que rinda y tendrás tu colchón de febrero con intereses.',
  },
  aportes: {
    eyebrow: 'Ya sabes cuánto es la planilla',
    titulo: 'Ahora haz que lo que te queda trabaje: aparta tu prima y tus cesantías en una cuenta que rinda.',
    texto: 'La planilla protege tu salud y tu pensión. La prima y las cesantías nadie te las aparta: hazlo en una cuenta con rentabilidad diaria.',
  },
  dolar: {
    eyebrow: '¿Ya cambiaste tus dólares?',
    titulo: 'Los pesos que no vas a usar este mes pueden rendir desde hoy.',
    texto: 'Mientras esperas la prima o el próximo pago, mueve el excedente a una cuenta de ahorro que pague intereses diarios.',
  },
  guia: {
    eyebrow: 'Del plan a la acción',
    titulo: 'Abre tu bolsillo de prima y cesantías en una cuenta que rinda.',
    texto: 'La cuenta en pesos y la cuenta en dólares que más pagan hoy, sin plazo fijo y con retiro cuando quieras.',
  },
};

const conUtm = (url: string, pagina: string, variante: string) =>
  `${url}${url.includes('?') ? '&' : '?'}utm_source=frilo&utm_medium=banner&utm_campaign=${pagina}-${variante}`;

function detallePesos(c: CuentaAhorro, empatan: CuentaAhorro[]): string {
  const otras = empatan.filter((x) => x.id !== c.id).map((x) => x.entidad);
  return [c.producto, c.cuotaManejo ? `${c.cuotaManejo} de cuota de manejo`.replace(/^\$0, sin comisiones de/, '$0') : undefined, c.fogafin === 'Sí' ? 'Fogafín' : undefined, 'sin condiciones', otras.length ? `empata con ${otras.join(' y ')}` : undefined]
    .filter(Boolean)
    .join(' · ');
}

function detalleDolares(c: CuentaAhorro, empatan: CuentaAhorro[]): string {
  const otras = empatan.filter((x) => x.id !== c.id).map((x) => x.entidad);
  return [
    'En dólares',
    'sin garantía de rendimiento',
    c.vigiladaSFC === false ? 'no vigilada por la Superfinanciera' : undefined,
    c.fogafin === 'No' ? 'sin Fogafín' : undefined,
    otras.length ? `empata con ${otras.join(' y ')}` : undefined,
  ]
    .filter(Boolean)
    .join(' · ');
}

/**
 * Banner de cuentas que rinden. Regla única (brief §3.4-9): la cuenta en pesos con la tasa más alta sin condiciones y la
 * cuenta en dólares con la tasa más alta, leídas de `cuentas.ts`. Sin afiliados: enlaces directos y "Frilo no recibe pagos".
 */
export function BannerRendimiento({ variante, pagina }: { variante: VarianteBanner; pagina: string }) {
  const { pesos, dolares } = cuentasDestacadas();
  const p = pesos[0];
  const d = dolares[0];
  if (!p || !d) return null;
  const t = TEXTOS[variante];
  const consulta = [...CUENTAS_MVP, ...CUENTAS_USD].filter((c) => c.verificada).map((c) => c.fechaConsulta).sort().at(-1) ?? '';
  const tarjetas = [
    { pos: 'La más alta en pesos', c: p, tasa: `${pct(p.tasaBaseEA, 0)} E.A.`, detalle: detallePesos(p, pesos) },
    { pos: 'La más alta en dólares', c: d, tasa: `Hasta ${pct(d.tasaEAHasta ?? d.tasaBaseEA, 0)} E.A.`, detalle: detalleDolares(d, dolares) },
  ];

  return (
    <aside aria-label="Cuentas de ahorro con rentabilidad" className="banner-rendimiento">
      <div className="banner-cabeza">
        <div>
          <span className="banner-eyebrow">
            <Isotipo tono="manzana" alto={24} />
            {t.eyebrow}
          </span>
          <p className="banner-titulo">{t.titulo}</p>
          <p className="banner-texto">{t.texto}</p>
        </div>
        <span className="etiqueta-referencia">Información de referencia</span>
      </div>
      <ol className="banner-cuentas">
        {tarjetas.map(({ pos, c, tasa, detalle }) => (
          <li key={c.id}>
            <span className="banner-pos">{pos}</span>
            <span className="banner-nombre">{c.entidad}</span>
            <span className="banner-tasa">{tasa}</span>
            <span className="banner-detalle">{detalle}</span>
            <a href={conUtm(c.url, pagina, variante)} target="_blank" rel="noopener" className="boton-manzana" data-evento="bank_click" data-entidad={c.entidad}>
              Ver cuenta en {c.entidad}
            </a>
          </li>
        ))}
      </ol>
      <div className="banner-pie">
        <Link href={RUTA_CUENTAS}>Compara cuentas de ahorro de alto rendimiento</Link>
        <span>
          Tasas consultadas el {fechaLarga(consulta)} en la web de cada entidad: la más alta sin condiciones en pesos y la más alta en dólares. Frilo no recibe pagos de estas
          entidades. No es asesoría financiera. {AVISOS.rendimientos}
        </span>
      </div>
    </aside>
  );
}
