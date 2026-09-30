/** Redondeo al múltiplo más cercano (equivale a MROUND de Excel para valores positivos). */
export function redondearMultiplo(valor: number, multiplo: number): number {
  if (multiplo <= 0) throw new Error('El múltiplo debe ser positivo');
  // El épsilon evita que 104.49999999 (error de coma flotante) redondee hacia abajo.
  return Math.round(valor / multiplo + 1e-9) * multiplo;
}
