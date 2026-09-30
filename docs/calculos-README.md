# Calculadoras — App para freelancers y contratistas (Colombia)

Lógica pura en TypeScript, sin interfaz, lista para usar desde Next.js. Todo con pruebas.

```bash
npm install
npm test          # 57 pruebas
npm run typecheck
```

## Módulos (`src/lib`)

| Archivo | Qué hace |
|---|---|
| `parametros.ts` | SMLMV, tarifas, tramos FSP… por año. Para 2027 se agrega un año, no se toca el código. |
| `cuentas.ts` | Cuentas de ahorro del MVP (Lulo, RappiPay, Nu) con tasa y fecha de consulta. |
| `ingresos.ts` | Fuentes de ingreso con moneda (USD/COP), conversión, tasa recibida y retención. |
| `trm.ts` | TRM vigente por fecha, panel de 4 referencias y alertas por cruce de umbral. |
| `aportes.ts` | Aportes a seguridad social (replica la hoja de Excel) y reglas de ARL. |
| `prestaciones.ts` | Prima y cesantías sintéticas (1/12 cada una), proyección mes a mes y cobros. |
| `rentabilidad.ts` | Tasa mensual equivalente, rendimientos y comparador de cuentas. |
| `metas.ts` | Simulador neutral de metas de ahorro. |
| `avisos.ts` | Disclaimers: alcance (sin 4x1000 ni retenciones), rendimientos y comparador. |
| `flujo.ts` | Resumen del mes: fuentes → COP → aportes → prima/cesantías → disponible. |

## Supuestos y decisiones

- **Ahorro de prestaciones:** 16,67% del ingreso bruto (antes de impuestos, sin IVA), calculado con 1/12 exacto.
- **Cobro de prima:** lo marca el usuario; el saldo reinicia después del mes marcado.
- **Depósitos:** al final de cada mes; rendimientos capitalizados mensualmente.
- **Base en USD:** si el usuario da la tasa recibida, la base de aportes y prestaciones es el valor real en pesos; si no, el valor a TRM.
- **Retención (COP):** reduce el disponible, nunca la base de aportes ni de prestaciones.
- **ARL con varios contratos:** se calcula sobre el IBC total (simplificación del MVP). En la PILA real la ARL se liquida por contrato; revisar antes de producción.
- **Contractor del exterior:** tratado como cuenta propia para la ARL (voluntaria en riesgo I–III).
- **Retención sobre rendimientos:** `null` hasta validarla con un contador; la app muestra rendimiento bruto.
- **Nu:** Cajitas al 9,30% E.A., según contratos y tarifas vigentes desde el 6 de julio de 2026.
- **Alcance:** los cálculos no incluyen 4x1000 ni retenciones de Colombia o del país contratante (ver `AVISOS.alcanceCalculos`).

## Validación

Los 7 casos de `tests/aportes.test.ts` salen de `Calculadora_Aportes_Independientes_2026.xlsx` recalculada
(piso de 1 SMLMV, límite exacto de 4 SMLMV, FSP 1% / 1,4% / 2%, tope de 25 SMLMV, riesgos I, II, III y V).
Además se hicieron pruebas de mutación (errores introducidos a propósito) para confirmar que las pruebas los detectan.
