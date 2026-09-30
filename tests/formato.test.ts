import { fechaCorta, fechaLarga, leerNumero, pct, pctConSigno, pesos, pesosConDecimales, pesosConSigno, usd } from '@/lib/formato';

describe('formato colombiano', () => {
  it('pesos con punto de miles', () => {
    expect(pesos(5035333)).toBe('$5.035.333');
    expect(pesos(798000)).toBe('$798.000');
    expect(pesos(0)).toBe('$0');
    expect(pesos(999)).toBe('$999');
    expect(pesos(1234567.6)).toBe('$1.234.568');
    expect(pesos(-61500)).toBe('−$61.500');
  });
  it('TRM con coma decimal', () => {
    expect(pesosConDecimales(4000)).toBe('$4.000,00');
    expect(pesosConDecimales(3312.84)).toBe('$3.312,84');
  });
  it('porcentajes', () => {
    expect(pct(0.114)).toBe('11,4%');
    expect(pct(0.095, 2)).toBe('9,50%');
    expect(pctConSigno(0.0037)).toBe('+0,37%');
    expect(pctConSigno(-0.0151)).toBe('−1,51%');
    expect(pesosConSigno(14.8)).toBe('+$14,80');
    expect(pesosConSigno(-150.8)).toBe('−$150,80');
  });
  it('dólares y fechas', () => {
    expect(usd(1750)).toBe('USD 1.750');
    expect(usd(1750.5)).toBe('USD 1.750,50');
    expect(fechaCorta('2026-09-24')).toBe('24 sep 2026');
    expect(fechaLarga('2026-09-24')).toBe('24 de septiembre');
  });
});

describe('leerNumero', () => {
  it.each([
    ['1750', 1750],
    ['1.750', 1750],
    ['USD 1.750', 1750],
    ['1.750,50', 1750.5],
    ['$7.000.000', 7000000],
    ['3312,84', 3312.84],
    ['1750.5', 1750.5],
  ])('%s → %s', (texto, esperado) => {
    expect(leerNumero(texto)).toBe(esperado);
  });
  it('rechaza lo que no es número', () => {
    expect(leerNumero('')).toBeNull();
    expect(leerNumero('abc')).toBeNull();
  });
});
