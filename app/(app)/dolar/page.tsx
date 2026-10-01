'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { costoConversionPct, crearAlerta, reactivarAlerta, type Alerta } from '@/lib/calculos';
import { dolarVisible } from '@/lib/app/derivados';
import { useApp } from '@/lib/app/estado';
import { useMes } from '@/lib/app/usarMes';
import { fechaLarga, leerNumero, pct, pctConSigno, pesos, pesosConDecimales, pesosConSigno, usd } from '@/lib/formato';
import { Icono } from '../../_ui/Icono';
import { Logo } from '../../_ui/Logo';
import { Campo, Selector } from '../../_ui/controles';
import Link from 'next/link';

const ETIQUETA = { semana: 'Hace una semana', mes: 'Hace un mes', anio: 'Hace un año' } as const;

export default function Dolar() {
  const router = useRouter();
  const { listo, ingreso, estado, trm, actualizar } = useMes();
  const { refrescarAlertas, sesion } = useApp();
  const visible = dolarVisible(estado.formaDePago, ingreso);

  const [creando, setCreando] = useState(false);
  const [direccion, setDireccion] = useState<Alerta['direccion']>('sube');
  const [umbral, setUmbral] = useState('');
  const [error, setError] = useState<string>();

  // Quien gana solo en pesos no ve esta pestaña.
  useEffect(() => {
    if (listo && !visible) router.replace('/inicio');
  }, [listo, visible, router]);

  // Las alertas las evalúa la tarea diaria del servidor; aquí se lee su estado real (puede haberse cumplido).
  useEffect(() => {
    if (listo) void refrescarAlertas();
    // solo al abrir la pantalla
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo]);

  if (!listo || !ingreso || !visible) return null;

  if (!trm) {
    return (
      <main className="contenido" style={{ paddingTop: 32 }}>
        <p className="aviso-error" role="alert">
          No pudimos traer la TRM de hoy. Vuelve a intentar en unos minutos.
        </p>
      </main>
    );
  }
  const datos = trm;

  function crear(e: FormEvent) {
    e.preventDefault();
    const u = leerNumero(umbral);
    if (u === null || u <= 0) {
      setError('Escribe el valor del dólar que quieres vigilar, por ejemplo 4.300.');
      return;
    }
    if ((direccion === 'sube' && u <= datos.hoy) || (direccion === 'baja' && u >= datos.hoy)) {
      setError(
        direccion === 'sube'
          ? `Para que te avisemos cuando suba, el valor debe ser mayor a la TRM de hoy (${pesosConDecimales(datos.hoy)}).`
          : `Para que te avisemos cuando baje, el valor debe ser menor a la TRM de hoy (${pesosConDecimales(datos.hoy)}).`,
      );
      return;
    }
    actualizar((prev) => ({ alertas: [...prev.alertas, crearAlerta(u, direccion, datos.hoy)] }));
    setCreando(false);
    setUmbral('');
    setError(undefined);
  }

  const tasa = ingreso.tasaRecibida;
  const esUsd = ingreso.moneda === 'USD';
  const costo = esUsd && tasa ? costoConversionPct(tasa, datos.hoy) : null;

  return (
    <main>
      <header className="encabezado">
        <Logo alto={28} className="logo" />
        <h1 className="titulo-pantalla">Dólar hoy</h1>
        <p className="subtitulo">TRM vigente al {fechaLarga(datos.fecha)}</p>
      </header>

      <div className="contenido">
        <section className="tarjeta">
          <p className="cifra-xl">{pesosConDecimales(datos.hoy)}</p>
          <p className="texto-suave" style={{ margin: '6px 0 16px', fontSize: 14 }}>
            {datos.variaciones.length ? 'Hoy está así frente a:' : 'Aún estamos reuniendo el historial para compararla.'}
          </p>
          {datos.variaciones.map((v) => {
            const dir = v.variacionPct > 0 ? 'sube' : v.variacionPct < 0 ? 'baja' : null;
            return (
              <div key={v.referencia} className="fila" style={{ alignItems: 'center', padding: '14px 0' }}>
                <div>
                  <p style={{ fontSize: 15 }}>{ETIQUETA[v.referencia]}</p>
                  <p className="ayuda" style={{ marginTop: 2 }}>
                    {pesosConDecimales(v.trm)}
                  </p>
                </div>
                <div className={`variacion${dir === 'sube' ? ' sube' : ''}`}>
                  <div>
                    <strong>{dir ? pctConSigno(v.variacionPct) : 'Sin cambio'}</strong>
                    {dir && <small>{pesosConSigno(v.variacionAbs)}</small>}
                  </div>
                  {dir && <Icono nombre={dir} tamano={18} titulo={dir === 'sube' ? 'Subió' : 'Bajó'} activo />}
                </div>
              </div>
            );
          })}
        </section>

        <section className="tarjeta">
          <h2 className="titulo-tarjeta">Tus alertas</h2>
          {estado.alertas.length === 0 && !creando && (
            <p className="texto-suave" style={{ margin: '10px 0 0', fontSize: 14 }}>
              Te avisamos cuando el dólar cruce el valor que elijas.
            </p>
          )}
          {estado.alertas.map((a, i) => (
            <div key={`${a.umbral}-${a.direccion}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 4px', gap: 12 }}>
              <div>
                <p style={{ fontSize: 15 }}>
                  Si {a.direccion === 'sube' ? 'sube de' : 'baja de'} {pesos(a.umbral)}
                </p>
                <p className="ayuda" style={{ marginTop: 2 }}>
                  {a.estado === 'activa' ? 'Te avisamos por correo, una vez' : 'Ya se cumplió y te avisamos'}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={a.estado === 'activa' ? 'estado-activa' : 'estado-disparada'}>{a.estado === 'activa' ? 'Activa' : 'Cumplida'}</span>
                {a.estado === 'disparada' && (
                  <button
                    type="button"
                    className="enlace"
                    style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: 14 }}
                    onClick={() => actualizar((prev) => ({ alertas: prev.alertas.map((x, j) => (j === i ? reactivarAlerta(x, datos.hoy) : x)) }))}
                    aria-label={`Reactivar la alerta de ${pesos(a.umbral)}`}
                  >
                    Reactivar
                  </button>
                )}
                <button
                  type="button"
                  className="enlace"
                  style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: 14 }}
                  onClick={() => actualizar((prev) => ({ alertas: prev.alertas.filter((_, j) => j !== i) }))}
                  aria-label={`Quitar la alerta de ${pesos(a.umbral)}`}
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}

          {creando ? (
            <form onSubmit={crear} noValidate style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Selector
                nombre="Cuándo avisarte"
                valor={direccion}
                onCambio={setDireccion}
                opciones={[
                  { valor: 'sube', etiqueta: 'Si sube' },
                  { valor: 'baja', etiqueta: 'Si baja' },
                ]}
              />
              <Campo id="umbral" etiqueta="Valor del dólar" ayuda={`Hoy está en ${pesosConDecimales(datos.hoy)}.`} error={error}>
                {(p) => <input {...p} inputMode="decimal" value={umbral} onChange={(e) => setUmbral(e.target.value)} placeholder="$4.300" />}
              </Campo>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primario" style={{ minHeight: 48, borderRadius: 'var(--radius-m)', fontSize: 15 }}>
                  Guardar alerta
                </button>
                <button
                  type="button"
                  className="btn btn-secundario"
                  style={{ width: 'auto' }}
                  onClick={() => {
                    setCreando(false);
                    setError(undefined);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <button type="button" className="btn btn-secundario" style={{ marginTop: 14 }} onClick={() => setCreando(true)}>
              Crear alerta
            </button>
          )}
          <p className="ayuda" style={{ marginTop: 12 }}>
            Revisamos el dólar cada mañana y, si cruza el valor que elegiste, te escribimos a {sesion?.user.email ?? 'tu correo'}.
          </p>
        </section>

        {esUsd && (
          <section className="tarjeta">
            <h2 className="titulo-tarjeta">Tu último pago</h2>
            <div style={{ height: 8 }} />
            <div className="fila">
              <div className="nombre">
                {usd(ingreso.monto)} a {tasa ? 'la tasa que te pagaron' : 'TRM'}
              </div>
              <div className="valor">{pesos(ingreso.monto * (tasa ?? datos.hoy))}</div>
            </div>
            <div className="fila">
              <div>
                <div className="nombre">{costo !== null ? 'Lo que te costó convertir' : 'Lo que recibiste'}</div>
                <div className="ayuda" style={{ marginTop: 2 }}>
                  {costo !== null ? `Frente a la TRM de hoy (${pesosConDecimales(datos.hoy)})` : 'Así calculamos cuánto te cobró la plataforma'}
                </div>
              </div>
              {costo !== null ? (
                <div className="valor">{pct(costo, 2)}</div>
              ) : (
                <Link href="/ingreso" className="enlace" style={{ minHeight: 0 }}>
                  Agrega la tasa
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
