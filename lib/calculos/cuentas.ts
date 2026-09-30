/** Cuentas de ahorro del MVP. Actualizar tasa + fechaConsulta cada vez que cambien. */
export interface CuentaAhorro {
  id: string;
  entidad: string;
  producto: string;
  tasaBaseEA: number; // tasa sin condiciones
  tasaCondicionadaEA?: number;
  condicion?: string;
  pagoRendimientos: 'diario' | 'mensual';
  fechaConsulta: string; // YYYY-MM-DD
  verificada: boolean; // false = dato de prensa, falta confirmar en la fuente oficial
  url: string;
  /** true solo si hay relación comercial con la entidad; la UI debe mostrar la etiqueta "Patrocinado". */
  patrocinado: boolean;
}

export const CUENTAS_MVP: CuentaAhorro[] = [
  {
    id: 'rappipay-bolsillos', entidad: 'RappiPay', producto: 'Bolsillos RappiCuenta',
    tasaBaseEA: 0.09, pagoRendimientos: 'diario', fechaConsulta: '2026-09-24', verificada: true,
    url: 'https://www.rappipay.co/rappicuenta/alta-rentabilidad-cuentas/', patrocinado: false,
  },
  {
    id: 'lulo-flex', entidad: 'Lulo Bank', producto: 'Bolsillos Flex',
    tasaBaseEA: 0.095, tasaCondicionadaEA: 0.10,
    condicion: 'Lulo PRO: nómina en Lulo o ingresos recurrentes > $3.000.000/mes',
    pagoRendimientos: 'mensual', fechaConsulta: '2026-09-24', verificada: true,
    url: 'https://www.lulobank.com/', patrocinado: false,
  },
  {
    id: 'nu-cajitas', entidad: 'Nu', producto: 'Cajitas',
    tasaBaseEA: 0.093, pagoRendimientos: 'diario', fechaConsulta: '2026-07-06', verificada: true, // contratos y tarifas, vigente desde 06-jul-2026
    url: 'https://www.nu.com.co/contratos-y-tarifas/cuenta', patrocinado: false,
  },
];
