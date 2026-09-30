import { type CuentaAhorro } from './cuentas';

export const tasaMensual = (tasaEA: number) => Math.pow(1 + tasaEA, 1 / 12) - 1;

export function rendimiento(saldo: number, dias: number, tasaEA: number): number {
  return saldo * (Math.pow(1 + tasaEA, dias / 365) - 1);
}

/** null si la retención aún no está validada: la UI muestra "rendimiento antes de impuestos". */
export function rendimientoNeto(bruto: number, retencion: number | null): number | null {
  return retencion === null ? null : bruto * (1 - retencion);
}

/** Ordena por tasa SIN condiciones; la condicionada se muestra como información extra. */
export function compararCuentas(saldo: number, dias: number, cuentas: CuentaAhorro[]) {
  return [...cuentas]
    .sort((a, b) => b.tasaBaseEA - a.tasaBaseEA)
    .map((c) => ({
      cuenta: c,
      rendimientoBase: rendimiento(saldo, dias, c.tasaBaseEA),
      rendimientoCondicionado: c.tasaCondicionadaEA !== undefined ? rendimiento(saldo, dias, c.tasaCondicionadaEA) : null,
    }));
}
