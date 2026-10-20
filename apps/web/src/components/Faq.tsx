import type { ReactNode } from 'react';

/** Preguntas frecuentes visibles con <details>. El JSON-LD FAQPage solo puede llevar las preguntas que se ven aquí. */
export function Faq({ titulo = 'Preguntas frecuentes', preguntas }: { titulo?: string; preguntas: { pregunta: string; respuesta: ReactNode }[] }) {
  return (
    <section aria-labelledby="preguntas-frecuentes" className="faq">
      <h2 id="preguntas-frecuentes">{titulo}</h2>
      {preguntas.map((p) => (
        <details key={p.pregunta}>
          <summary>{p.pregunta}</summary>
          <div>{p.respuesta}</div>
        </details>
      ))}
    </section>
  );
}
