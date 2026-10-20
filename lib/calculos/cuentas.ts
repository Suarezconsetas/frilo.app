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
  // Datos para las tablas del sitio (comparativa P11); la app los puede ignorar.
  entidadLegal?: string;
  moneda?: 'COP' | 'USD';
  /** Tasa máxima anunciada ("hasta"), cuando difiere de la tasa sin condiciones. */
  tasaEAHasta?: number;
  cuotaManejo?: string;
  exencion4x1000?: string;
  vigiladaSFC?: boolean;
}

export const CUENTAS_MVP: CuentaAhorro[] = [
  {
    id: 'pibank-cuenta', entidadLegal: 'Banco Pichincha', moneda: 'COP', cuotaManejo: '$0, sin comisiones', exencion4x1000: 'Exenta a solicitud en la app', vigiladaSFC: true, entidad: 'Pibank', producto: 'Cuenta Pibank',
    tasaBaseEA: 0.11, pagoRendimientos: 'mensual', fechaConsulta: '2026-10-20', verificada: true,
    url: 'https://www.pibank.co/cuenta-pibank/', patrocinado: false, fogafin: 'Sí',
    nota: 'Sin cuota de manejo. El dinero sale por transferencias desde la app (hasta 20 al mes); no tiene PSE ni Bre-B.',
  },
  {
    id: 'global66-cop', entidadLegal: 'Global Colombia 81 S.A.', moneda: 'COP', tasaEAHasta: 0.11, cuotaManejo: '$0 apertura y mantenimiento', exencion4x1000: 'No lo indica', vigiladaSFC: true, entidad: 'Global66', producto: 'Cuenta global en pesos',
    tasaBaseEA: 0.11, pagoRendimientos: 'diario', fechaConsulta: '2026-10-20', verificada: true,
    url: 'https://www.global66.com/co/cuenta-global/', patrocinado: false, fogafin: 'Sí',
    nota: 'La página anuncia "hasta 11% E.A." en pesos, sin montos mínimos y con el dinero disponible 24/7.',
  },
  {
    // Confirmado por la persona responsable de Frilo el 20-oct-2026: Bolsillos hasta 10% E.A. (con Lulo Pro), CDT hasta
    // 13% E.A. y cubierta por Fogafín. La página y la ayuda de Lulo no cargan para automatizar la revisión.
    id: 'lulo-flex', entidadLegal: 'Lulo bank S.A.', moneda: 'COP', cuotaManejo: '$0', exencion4x1000: 'No lo indica', vigiladaSFC: true, entidad: 'Lulo Bank', producto: 'Bolsillos Flex',
    tasaBaseEA: 0.095, tasaCondicionadaEA: 0.10,
    condicion: 'Lulo PRO: nómina en Lulo o ingresos recurrentes > $3.000.000/mes',
    pagoRendimientos: 'mensual', fechaConsulta: '2026-10-20', verificada: true,
    url: 'https://www.lulobank.com/', patrocinado: false, fogafin: 'Sí',
    nota: 'Sus CDT pagan hasta 13% E.A., pero el dinero queda bloqueado por el plazo: no los comparamos aquí.',
  },
  {
    id: 'rappipay-bolsillos', entidadLegal: 'RappiPay Compañía de Financiamiento S.A.', moneda: 'COP', cuotaManejo: '$0 cuenta y tarjeta', exencion4x1000: 'No lo indica', vigiladaSFC: true, entidad: 'RappiPay', producto: 'Bolsillos RappiCuenta',
    tasaBaseEA: 0.09, pagoRendimientos: 'diario', fechaConsulta: '2026-10-20', verificada: true,
    url: 'https://www.rappipay.co/rappicuenta/', patrocinado: false, fogafin: 'Sí',
  },
  {
    id: 'nu-cajitas', entidadLegal: 'Nu Colombia Compañía de Financiamiento S.A.', moneda: 'COP', tasaEAHasta: 0.097, cuotaManejo: 'No lo indica; 1 retiro gratis al mes, luego $6.800', exencion4x1000: 'Exenta a solicitud por chat (hasta $16 millones al mes)', vigiladaSFC: true, entidad: 'Nu', producto: 'Cajitas',
    tasaBaseEA: 0.0825, pagoRendimientos: 'diario', fechaConsulta: '2026-10-20', verificada: true,
    url: 'https://www.nu.com.co/cuenta', patrocinado: false, fogafin: 'Sí',
    nota: 'La página de Nu muestra tres cifras (8,25%, 9,25% y "hasta 9,70%" con CDT): usamos la menor.',
  },
  {
    id: 'uala-deposito', entidadLegal: 'Bancar Tecnología CO Compañía de Financiamiento', moneda: 'COP', tasaEAHasta: 0.105, cuotaManejo: 'No lo indica', exencion4x1000: 'Exenta hasta 65 UVT al mes', vigiladaSFC: true, entidad: 'Ualá', producto: 'Cuenta Ualá (depósito remunerado)',
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
    id: 'global66-cuenta-usd', entidadLegal: 'Global66 (Global 81 SpA; custodia 100x Corp., Panamá)', moneda: 'USD', tasaEAHasta: 0.06, cuotaManejo: '$0 apertura y mantenimiento', vigiladaSFC: false, entidad: 'Global66', producto: 'Cuenta en dólares',
    tasaBaseEA: 0.06, pagoRendimientos: 'diario', fechaConsulta: '2026-10-20', verificada: true,
    url: 'https://www.global66.com/co/cuenta-global/', patrocinado: false, fogafin: 'No',
    nota: 'La página anuncia "hasta 6% E.A." en dólares y 8% en Bóvedas. Los dólares los custodia 100x Corp. (Panamá); esta cuenta no tiene seguro de depósitos de Fogafín.',
  },
  {
    id: 'littio-bolsillos-usd', entidadLegal: 'Selenio S.A.S.', moneda: 'USD', tasaEAHasta: 0.08, cuotaManejo: '$0 cuota; USD 2,99 por enviar o recibir de EE. UU. o Europa', vigiladaSFC: false, entidad: 'Littio', producto: 'Bolsillos en dólares (USDC)',
    tasaBaseEA: 0.06, tasaCondicionadaEA: 0.08,
    condicion: 'Bóvedas a 30 o 90 días, hasta 8% (el dinero queda bloqueado)',
    pagoRendimientos: 'diario', fechaConsulta: '2026-10-20', verificada: true,
    url: 'https://littio.co/cuenta-en-dolares', patrocinado: false, fogafin: 'No',
    aviso: 'Littio no está vigilada por la Superintendencia Financiera: opera con activos digitales (USDC), no tiene seguro de depósitos de Fogafín y no garantiza rendimientos.',
    nota: 'Según su página de la cuenta en dólares: hasta 6% E.A. en Bolsillos y hasta 8% en Bóvedas. Las tasas no están garantizadas.',
  },
];
