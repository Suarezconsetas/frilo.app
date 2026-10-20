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
  /** Advertencia propia del producto (por ejemplo, si no es un depósito bancario). */
  aviso?: string;
  /** Saldo máximo que rinde, si la entidad lo limita (el rendimiento de saldos mayores no se cuenta). */
  topeRemunerado?: number;
  /** Seguro de depósitos: 'Sí' solo si la página oficial lo dice o la persona responsable de Frilo lo confirmó. */
  fogafin?: 'Sí' | 'No' | 'No lo indica';
  /** Aclaración que se muestra con la cuenta (por ejemplo, diferencias entre cifras de la propia página). */
  nota?: string;
}

export const CUENTAS_MVP: CuentaAhorro[] = [
  {
    id: 'pibank-cuenta', entidad: 'Pibank', producto: 'Cuenta Pibank',
    tasaBaseEA: 0.11, pagoRendimientos: 'mensual', fechaConsulta: '2026-10-20', verificada: true,
    url: 'https://www.pibank.co/cuenta-pibank/', patrocinado: false, fogafin: 'Sí',
    nota: 'Sin cuota de manejo. El dinero sale por transferencias desde la app (hasta 20 al mes); no tiene PSE ni Bre-B.',
  },
  {
    id: 'global66-cop', entidad: 'Global66', producto: 'Cuenta global en pesos',
    tasaBaseEA: 0.11, pagoRendimientos: 'diario', fechaConsulta: '2026-10-20', verificada: true,
    url: 'https://www.global66.com/co/cuenta-global/', patrocinado: false, fogafin: 'Sí',
    nota: 'La página anuncia "hasta 11% E.A." en pesos, sin montos mínimos y con el dinero disponible 24/7.',
  },
  {
    // Dato del 24-sep-2026 y recopilado de nuevo el 20-oct; la página y la ayuda de Lulo no cargaron para confirmarlo
    // (el centro de ayuda indicaría 7,5% / 9,25%). Confirmar en la app: Ajustes > Rentabilidad y tarifas.
    id: 'lulo-flex', entidad: 'Lulo Bank', producto: 'Bolsillos Flex',
    tasaBaseEA: 0.095, tasaCondicionadaEA: 0.10,
    condicion: 'Lulo PRO: nómina en Lulo o ingresos recurrentes > $3.000.000/mes',
    pagoRendimientos: 'mensual', fechaConsulta: '2026-09-24', verificada: true,
    url: 'https://www.lulobank.com/', patrocinado: false,
  },
  {
    id: 'rappipay-bolsillos', entidad: 'RappiPay', producto: 'Bolsillos RappiCuenta',
    tasaBaseEA: 0.09, pagoRendimientos: 'diario', fechaConsulta: '2026-10-20', verificada: true,
    url: 'https://www.rappipay.co/rappicuenta/', patrocinado: false, fogafin: 'Sí',
  },
  {
    id: 'nu-cajitas', entidad: 'Nu', producto: 'Cajitas',
    tasaBaseEA: 0.0825, pagoRendimientos: 'diario', fechaConsulta: '2026-10-20', verificada: true,
    url: 'https://www.nu.com.co/cuenta', patrocinado: false, fogafin: 'Sí',
    nota: 'La página de Nu muestra tres cifras (8,25%, 9,25% y "hasta 9,70%" con CDT): usamos la menor.',
  },
  {
    id: 'uala-deposito', entidad: 'Ualá', producto: 'Cuenta Ualá (depósito remunerado)',
    tasaBaseEA: 0.05, tasaCondicionadaEA: 0.0825,
    condicion: '1 compra al mes con la tarjeta débito Ualá; 10,5% con $400.000 en compras al mes',
    pagoRendimientos: 'diario', fechaConsulta: '2026-10-20', verificada: true,
    url: 'https://www.uala.com.co/deposito-remunerado', patrocinado: false, topeRemunerado: 10_500_000,
    nota: 'Rinde hasta $10.500.000 de saldo. El rendimiento adicional se abona el 5.º día hábil del mes siguiente.',
  },
];

/**
 * Cuentas para guardar en dólares, sin convertirlos a pesos. La tasa es E.A. en dólares (no en pesos), por eso
 * va aparte de CUENTAS_MVP: no se mezcla con el comparador en pesos ni con la proyección. Solo se muestran las
 * `verificada: true`.
 */
export const CUENTAS_USD: CuentaAhorro[] = [
  {
    id: 'global66-cuenta-usd', entidad: 'Global66', producto: 'Cuenta en dólares',
    tasaBaseEA: 0.06, pagoRendimientos: 'diario', fechaConsulta: '2026-10-20', verificada: true,
    url: 'https://www.global66.com/co/cuenta-global/', patrocinado: false, fogafin: 'No',
    nota: 'La página anuncia "hasta 6% E.A." en dólares y 8% en Bóvedas. Los dólares los custodia 100x Corp. (Panamá); esta cuenta no tiene seguro de depósitos de Fogafín.',
  },
  {
    id: 'littio-bolsillos-usd', entidad: 'Littio', producto: 'Bolsillos en dólares (USDC)',
    tasaBaseEA: 0.04, tasaCondicionadaEA: 0.08,
    condicion: 'Bóvedas a 30 o 90 días, hasta 8% (el dinero queda bloqueado)',
    pagoRendimientos: 'diario', fechaConsulta: '2026-10-20', verificada: true,
    url: 'https://littio.co/cuenta-en-dolares', patrocinado: false, fogafin: 'No',
    aviso: 'Littio no está vigilada por la Superintendencia Financiera: opera con activos digitales (USDC), no tiene seguro de depósitos de Fogafín y no garantiza rendimientos.',
    nota: 'Su página de inicio muestra 4% E.A. para Bolsillos y la de la cuenta en dólares dice "hasta 6% o 8%": usamos la menor.',
  },
];
