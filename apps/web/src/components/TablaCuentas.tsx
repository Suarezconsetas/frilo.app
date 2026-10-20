import { CUENTAS_MVP, CUENTAS_USD, type CuentaAhorro } from '@/lib/calculos';
import { fechaCorta } from '@/lib/formato';
import { decimalEs } from '../lib/entradas';

const tasa = (x: number) => `${decimalEs(x * 100, 2)}%`;
const ordenar = (cs: CuentaAhorro[]) => [...cs].filter((c) => c.verificada).sort((a, b) => b.tasaBaseEA - a.tasaBaseEA);
const MARCO = { overflowX: 'auto', border: '1px solid #D6E0DA', borderRadius: 16, background: '#FFFFFF' } as const;

/**
 * Tabla de cuentas en pesos de P11. Sale de `lib/calculos/cuentas.ts`: la misma fuente que usa la app, así que una tasa que cambia
 * se actualiza en los dos lados. Orden por tasa sin condiciones; las condiciones van como texto secundario.
 */
export function TablaCuentasPesos() {
  const cuentas = ordenar(CUENTAS_MVP);
  const consulta = cuentas.map((c) => c.fechaConsulta).sort().at(-1) ?? '';
  return (
    <div style={MARCO}>
      <table className="t" style={{ minWidth: 1040 }}>
        <caption style={{ textAlign: 'left', padding: '12px 14px', fontSize: 13, color: '#4A6158' }}>
          Ordenada por la tasa E.A. que pagan sin condiciones, de mayor a menor. Datos de la web oficial de cada entidad, última consulta el {fechaCorta(consulta)}. &quot;No lo indica&quot; =
          la entidad no lo publica en esa página.
        </caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Entidad y producto</th>
            <th scope="col">Tasa E.A.</th>
            <th scope="col">Cuota de manejo</th>
            <th scope="col">Exenta de 4x1000</th>
            <th scope="col">Cómo paga</th>
            <th scope="col">Fogafín</th>
            <th scope="col">Consultado</th>
            <th scope="col">
              <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>Ver cuenta</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((c, i) => (
            <tr key={c.id}>
              <td style={{ fontWeight: 700 }}>{i + 1}</td>
              <td>
                <span style={{ fontWeight: 700 }}>{c.entidad}</span>
                <br />
                <span style={{ color: '#4A6158' }}>
                  {c.producto}
                  {c.entidadLegal ? ` · ${c.entidadLegal}` : ''}
                </span>
              </td>
              <td style={{ fontWeight: 700, fontSize: 17 }}>
                {tasa(c.tasaBaseEA)}
                {c.tasaCondicionadaEA !== undefined && (
                  <>
                    <br />
                    <span style={{ fontSize: 13, fontWeight: 400, color: '#4A6158' }}>
                      {tasa(c.tasaCondicionadaEA)} con condiciones: {c.condicion}
                    </span>
                  </>
                )}
              </td>
              <td>{c.cuotaManejo ?? 'No lo indica'}</td>
              <td>{c.exencion4x1000 ?? 'No lo indica'}</td>
              <td>
                {c.pagoRendimientos === 'diario' ? 'Rendimientos diarios' : 'Rendimientos mensuales'}
                {c.nota ? `. ${c.nota}` : ''}
              </td>
              <td>{c.fogafin ?? 'No lo indica'}</td>
              <td>{fechaCorta(c.fechaConsulta)}</td>
              <td>
                <a className="ver" href={c.url} target="_blank" rel="noopener">
                  Ver en {c.entidad}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Tabla de cuentas en dólares de P11, desde la misma fuente. */
export function TablaCuentasDolares() {
  const cuentas = ordenar(CUENTAS_USD);
  return (
    <div style={MARCO}>
      <table className="t" style={{ minWidth: 760 }}>
        <thead>
          <tr>
            <th scope="col">Entidad</th>
            <th scope="col">Rendimiento en dólares</th>
            <th scope="col">Regulación</th>
            <th scope="col">Consultado</th>
            <th scope="col">
              <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>Ver cuenta</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((c) => (
            <tr key={c.id}>
              <td>
                <span style={{ fontWeight: 700 }}>{c.entidad}</span>
                <br />
                <span style={{ color: '#4A6158' }}>{c.producto}</span>
              </td>
              <td>
                {tasa(c.tasaBaseEA)} E.A. sin condiciones
                {c.tasaEAHasta !== undefined && c.tasaEAHasta > c.tasaBaseEA ? `; hasta ${tasa(c.tasaEAHasta)} según el producto` : ''}
                {c.condicion ? ` (${c.condicion})` : ''}. No garantiza rendimientos.
                {c.nota ? <><br /><span style={{ fontSize: 13, color: '#4A6158' }}>{c.nota}</span></> : null}
              </td>
              <td>{c.aviso ?? (c.vigiladaSFC === false ? 'No vigilada por la Superintendencia Financiera' : 'Vigilada por la Superintendencia Financiera')}</td>
              <td>{fechaCorta(c.fechaConsulta)}</td>
              <td>
                <a className="ver" href={c.url} target="_blank" rel="noopener">
                  Ver en {c.entidad}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
