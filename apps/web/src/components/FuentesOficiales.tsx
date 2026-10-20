/** Bloque "Fuentes oficiales" que cierra cada página, antes de las preguntas frecuentes. Enlaces externos con noopener. */
export function FuentesOficiales({ fuentes }: { fuentes: { texto: string; href?: string; nota?: string }[] }) {
  return (
    <section aria-labelledby="fuentes-oficiales" className="fuentes">
      <h2 id="fuentes-oficiales">Fuentes oficiales</h2>
      <ul>
        {fuentes.map((f) => (
          <li key={f.texto}>
            {f.href ? (
              <a href={f.href} target="_blank" rel="noopener">
                {f.texto}
              </a>
            ) : (
              f.texto
            )}
            {f.nota ? ` ${f.nota}` : ''}
          </li>
        ))}
      </ul>
    </section>
  );
}
