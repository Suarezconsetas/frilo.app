import Link from 'next/link';
import { JsonLd } from '../../../components/JsonLd';
import { PaginaTexto } from '../../../components/PaginaTexto';
import { TERMINOS } from '../../../lib/glosario';
import { metadataDe } from '../../../lib/seo';

export const metadata = metadataDe('Hub-Glo');

/** La sigla va en negrita la primera vez que aparece (convención del glosario). */
function conSiglaEnNegrita(texto: string, sigla: string) {
  const i = texto.indexOf(sigla);
  if (i < 0) return texto;
  return (
    <>
      {texto.slice(0, i)}
      <strong>{sigla}</strong>
      {texto.slice(i + sigla.length)}
    </>
  );
}

export default function Pagina() {
  return (
    <>
      <PaginaTexto id="Hub-Glo">
        <p className="respuesta-corta">
          Qué significan las siglas de la planilla de seguridad social, explicadas en lenguaje claro y con su fuente oficial: ARL, FSP, IBC, PILA y SLN. Cada término enlaza a la guía o la calculadora donde lo usas.
        </p>
        <nav aria-label="Términos del glosario" className="card" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: 16, margin: '16px 0' }}>
          {TERMINOS.map((t) => (
            <a key={t.id} href={`#${t.id}`} style={{ fontWeight: 600 }}>
              {t.sigla}
            </a>
          ))}
        </nav>
        {TERMINOS.map((t) => (
          <section key={t.id} id={t.id} aria-labelledby={`h-${t.id}`}>
            <h2 id={`h-${t.id}`}>
              {t.sigla}: {t.nombre}
            </h2>
            <p>{conSiglaEnNegrita(t.definicion, t.sigla)}</p>
            {t.detalle && <p>{t.detalle}</p>}
            <p>
              Más información:{' '}
              {t.mas.map((m, i) => (
                <span key={m.href}>
                  {i > 0 && ' · '}
                  <Link href={m.href}>{m.texto}</Link>
                </span>
              ))}
            </p>
            <p style={{ fontSize: 14, color: '#4A6158' }}>
              Fuente:{' '}
              {t.fuentes.map((f, i) => (
                <span key={f.texto}>
                  {i > 0 && '; '}
                  {f.href ? (
                    <a href={f.href} target="_blank" rel="noopener">
                      {f.texto}
                    </a>
                  ) : (
                    f.texto
                  )}
                </span>
              ))}
            </p>
          </section>
        ))}
        <p className="aviso">
          Estos términos explican la planilla en general; para tu caso concreto revisa las guías y las fuentes oficiales. Más términos próximamente.
        </p>
      </PaginaTexto>
      <JsonLd id="Hub-Glo" />
    </>
  );
}
