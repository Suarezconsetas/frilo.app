'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import type { ClaseRiesgo, Moneda } from '@/lib/calculos';
import { useApp } from '@/lib/app/estado';
import { hoyColombia, mesDe } from '@/lib/app/fechas';
import type { IngresoInicial } from '@/lib/app/tipos';
import { leerNumero } from '@/lib/formato';
import { Icono } from '../_ui/Icono';
import { Campo, Selector } from '../_ui/controles';

const CLASES: { valor: ClaseRiesgo; etiqueta: string }[] = [
  { valor: 1, etiqueta: 'I — Oficina o trabajo digital' },
  { valor: 2, etiqueta: 'II — Riesgo bajo' },
  { valor: 3, etiqueta: 'III — Riesgo medio' },
  { valor: 4, etiqueta: 'IV — Riesgo alto' },
  { valor: 5, etiqueta: 'V — Riesgo máximo' },
];

type Errores = Partial<Record<'cliente' | 'monto' | 'tasa' | 'retencion', string>>;

export default function PrimerIngreso() {
  const router = useRouter();
  const { estado, listo, actualizar, trm, sesion } = useApp();
  const previo = estado.ingreso;
  const editando = !!previo && !!sesion;

  const [moneda, setMoneda] = useState<Moneda>('USD');
  const [cliente, setCliente] = useState('');
  const [monto, setMonto] = useState('');
  const [extra, setExtra] = useState(''); // tasa recibida (USD) o retención (COP)
  const [clase, setClase] = useState<ClaseRiesgo>(1);
  const [publico, setPublico] = useState(false);
  const [errores, setErrores] = useState<Errores>({});

  // Precarga: lo que ya guardó (editar ingreso) o la forma de pago que eligió al inicio.
  useEffect(() => {
    if (!listo) return;
    if (previo) {
      setMoneda(previo.moneda);
      setCliente(previo.cliente);
      setMonto(String(previo.monto));
      setExtra(String((previo.moneda === 'USD' ? previo.tasaRecibida : previo.retencion) ?? ''));
      setClase(previo.clase);
      setPublico(previo.publico);
    } else if (estado.formaDePago === 'cop') {
      setMoneda('COP');
    }
    // solo al terminar de leer el almacenamiento
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo]);

  const sinTrm = moneda === 'USD' && !trm;

  function enviar(e: FormEvent) {
    e.preventDefault();
    const nuevos: Errores = {};
    const m = leerNumero(monto);
    const x = extra.trim() === '' ? undefined : leerNumero(extra);
    if (!cliente.trim()) nuevos.cliente = 'Escribe el nombre de quien te paga.';
    if (m === null || m <= 0) nuevos.monto = 'Escribe un monto mayor a cero, por ejemplo 1.750.';
    if (x === null) nuevos[moneda === 'USD' ? 'tasa' : 'retencion'] = 'Escribe solo números, por ejemplo 3.950.';
    if (moneda === 'USD' && x !== undefined && x !== null && x <= 0) nuevos.tasa = 'La tasa debe ser mayor a cero.';
    setErrores(nuevos);
    if (Object.keys(nuevos).length || sinTrm || m === null || x === null) return;

    const ingreso: IngresoInicial = {
      cliente: cliente.trim(),
      moneda,
      monto: m,
      tasaRecibida: moneda === 'USD' ? x : undefined,
      retencion: moneda === 'COP' ? x : undefined,
      clase,
      publico: moneda === 'COP' && publico,
    };
    actualizar((e0) => ({ ingreso, mesInicio: e0.mesInicio ?? mesDe(hoyColombia()) }));
    router.push(sesion ? '/inicio' : '/registro');
  }

  return (
    <main className="pantalla">
      <form className="contenido formulario" onSubmit={enviar} noValidate>
        <Link href={editando ? '/inicio' : '/'} className="volver" aria-label="Volver">
          <Icono nombre="volver" />
        </Link>
        <div>
          {!editando && (
            <div role="img" aria-label="Paso 2 de 2" className="pasos">
              <span />
              <span />
            </div>
          )}
          <h1 className="titulo-pantalla">{editando ? 'Tu ingreso' : 'Tu primer ingreso'}</h1>
          <p className="subtitulo">{editando ? 'Cambia lo que necesites y recalculamos tu mes.' : 'Después puedes agregar más clientes o contratos.'}</p>
        </div>

        {estado.formaDePago === 'mixto' && (
          <div className="campo">
            <span style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>¿En qué moneda te paga este cliente?</span>
            <Selector
              nombre="Moneda del ingreso"
              valor={moneda}
              onCambio={(v) => {
                setMoneda(v);
                setExtra('');
              }}
              opciones={[
                { valor: 'USD', etiqueta: 'Dólares' },
                { valor: 'COP', etiqueta: 'Pesos' },
              ]}
            />
          </div>
        )}

        {sinTrm && (
          <p className="aviso-error" role="alert">
            No pudimos traer la TRM de hoy, y la necesitamos para convertir tus dólares. Intenta de nuevo en unos minutos.
          </p>
        )}

        <Campo id="cliente" etiqueta="¿Quién te paga?" error={errores.cliente}>
          {(p) => <input {...p} value={cliente} onChange={(e) => setCliente(e.target.value)} autoComplete="organization" />}
        </Campo>

        <Campo
          id="monto"
          etiqueta={moneda === 'USD' ? 'Monto mensual en dólares' : 'Monto mensual en pesos'}
          ayuda="Antes de impuestos y sin IVA."
          error={errores.monto}
        >
          {(p) => (
            <input
              {...p}
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              inputMode="decimal"
              placeholder={moneda === 'USD' ? 'USD 1.750' : '$5.000.000'}
            />
          )}
        </Campo>

        {moneda === 'USD' ? (
          <Campo
            id="tasa"
            etiqueta="Tasa que te pagaron (opcional)"
            ayuda="La que te dio Payoneer, Wise o tu banco. Si la dejas vacía usamos la TRM."
            error={errores.tasa}
          >
            {(p) => <input {...p} value={extra} onChange={(e) => setExtra(e.target.value)} inputMode="decimal" placeholder="$3.950" />}
          </Campo>
        ) : (
          <Campo
            id="retencion"
            etiqueta="Retención en la fuente (opcional)"
            ayuda="Lo que tu contratante te retuvo este mes. Reduce lo que te queda, no la base de tus aportes."
            error={errores.retencion}
          >
            {(p) => <input {...p} value={extra} onChange={(e) => setExtra(e.target.value)} inputMode="decimal" placeholder="$200.000" />}
          </Campo>
        )}

        <Campo id="riesgo" etiqueta="Clase de riesgo de tu trabajo">
          {(p) => (
            <select {...p} value={clase} onChange={(e) => setClase(Number(e.target.value) as ClaseRiesgo)}>
              {CLASES.map((c) => (
                <option key={c.valor} value={c.valor}>
                  {c.etiqueta}
                </option>
              ))}
            </select>
          )}
        </Campo>

        {moneda === 'COP' && (
          <fieldset className="campo">
            <legend>¿Te contrata una entidad pública?</legend>
            <div className="opciones-2">
              <label className="opcion-radio">
                <input type="radio" name="publico" checked={!publico} onChange={() => setPublico(false)} /> No
              </label>
              <label className="opcion-radio">
                <input type="radio" name="publico" checked={publico} onChange={() => setPublico(true)} /> Sí
              </label>
            </div>
          </fieldset>
        )}

        <button type="submit" className="btn btn-primario" style={{ marginTop: 8 }} disabled={sinTrm}>
          {editando ? 'Guardar y ver mi mes' : 'Ver mi mes'}
        </button>
      </form>
    </main>
  );
}
