import type { DatosTrm } from '../lib/trm';

/** TRM de los últimos 30 días en texto plano: una sola página, sin páginas por fecha. */
export function TablaTrm({ filas }: { filas: DatosTrm['filas'] }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid #D6E0DA', borderRadius: 16, background: '#FFFFFF' }}>
      <table className="t">
        <caption style={{ textAlign: 'left', padding: '12px 14px', fontSize: 14, color: '#4A6158' }}>TRM oficial por fecha de vigencia. Fuente: Superintendencia Financiera.</caption>
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">TRM</th>
            <th scope="col">Variación diaria</th>
          </tr>
        </thead>
        <tbody>
          {filas.length ? (
            filas.map((f) => (
              <tr key={f.fecha}>
                <td>{f.fecha}</td>
                <td>{f.trm}</td>
                <td>{f.variacion}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No pudimos cargar la TRM en este momento.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
