---
name: revisar-tasas
description: Revisa las páginas oficiales de las cuentas de ahorro que Frilo recomienda (en pesos y en dólares), compara tasas y condiciones con lo que muestra la app y reporta qué cambió. Úsala una vez por semana o cuando se pida "revisar tasas", "actualizar cuentas" o "verificar rentabilidades".
---

# Revisar tasas de las cuentas de ahorro

Frilo muestra tasas de cuentas de ahorro a personas que toman decisiones con su dinero. Un dato viejo o inventado es peor que no tener el dato. Esta revisión existe para que lo que ve la persona sea lo que dice la entidad hoy.

## Dónde viven los datos

`lib/calculos/cuentas.ts`:
- `CUENTAS_MVP`: cuentas en pesos (el comparador, la proyección y los correos usan la de mayor tasa).
- `CUENTAS_USD`: cuentas en dólares (sección aparte; solo se muestran las `verificada: true`).

Cada cuenta tiene `tasaBaseEA` (sin condiciones), `tasaCondicionadaEA` + `condicion` (opcional), `fechaConsulta`, `verificada`, `url`, `aviso` (opcional).

## Cuentas y páginas a revisar

| Cuenta | Lista | Página |
|---|---|---|
| RappiPay · Bolsillos RappiCuenta | `CUENTAS_MVP` | https://www.rappipay.co/rappicuenta/alta-rentabilidad-cuentas/ |
| Lulo Bank · Bolsillos Flex | `CUENTAS_MVP` | https://www.lulobank.com/ |
| Nu · Cajitas | `CUENTAS_MVP` | https://www.nu.com.co/contratos-y-tarifas/cuenta |
| Littio · Bolsillos en dólares (USDC) | `CUENTAS_USD` | https://www.littio.co/ |
| Global66 · Cuenta en dólares | `CUENTAS_USD` | https://global66.com/co/cuenta-en-dolares/ |
| Ualá | (pendiente) | https://www.uala.com.co/ |

Si el usuario agrega una cuenta nueva, añádela a esta tabla y a `cuentas.ts`.

## Cómo revisar

1. Lee `lib/calculos/cuentas.ts` y anota lo que hoy muestra la app para cada cuenta.
2. Para cada página, consulta la fuente con `WebFetch`. Si la página bloquea (403) o la tasa se carga con JavaScript, usa el navegador integrado (`mcp__Claude_Browser__*`, `get_page_text`) o, como último recurso, `WebSearch` limitado al dominio de la entidad. Una nota de prensa o un blog **no** es fuente oficial.
3. De cada una extrae: tasa E.A. sin condiciones, tasa con condiciones (y cuáles), si se puede retirar en cualquier momento, topes de saldo, forma de pago de rendimientos y cualquier advertencia (por ejemplo, si rinde en una moneda digital o no tiene seguro de depósitos). Para Nu, la fuente es el documento de contratos y tarifas y su fecha de vigencia.
4. Compara con lo que muestra la app y clasifica cada cuenta:
   - **Sin cambios**: tasa y condiciones iguales.
   - **Cambió**: indica qué (tasa, condición, tope, liquidez).
   - **No se pudo verificar**: la página no cargó o no dice la tasa. No la des por buena ni por cambiada.

## Reglas que no se rompen

- **Nunca inventes ni estimes una tasa.** Si no la ves en la fuente, es "no se pudo verificar".
- Reporta la evidencia: URL consultada y la cifra tal como aparece (cita corta, sin copiar párrafos).
- Las tasas con condiciones nunca reemplazan la tasa base: el orden del comparador es por tasa sin condiciones.
- El comparador solo muestra cuentas con liquidez (sin CDT ni plazos fijos). Si una cuenta pasa a tener plazo o bloqueo, avísalo.
- Marca como "Patrocinado" solo si hay relación comercial (`patrocinado: true`); nunca cambies ese campo por tu cuenta.
- No cambies código ni publiques nada sin que el usuario lo pida.

## Qué entregar

Un informe corto en español con:
1. Una tabla: cuenta · en la app · en la fuente · estado (sin cambios / cambió / no verificada) · enlace.
2. Cambios propuestos, uno por línea, con el valor exacto a poner.
3. Alertas: cuentas que dejaron de ser líquidas, que quitaron la tasa o cuya página cambió.
4. Si algo requiere decisión del usuario (por ejemplo, una cuenta nueva o la salida de una cuenta), dilo al final.

## Si el usuario dice "aplica los cambios"

1. Edita `lib/calculos/cuentas.ts`: `tasaBaseEA`, `tasaCondicionadaEA`/`condicion`, `fechaConsulta` = fecha de hoy (`YYYY-MM-DD`) y `verificada` según corresponda. Si cambió la tasa de la cuenta más alta, revisa textos fijos que la nombren (por ejemplo `CLAUDE.md`, `tests/`).
2. Corre `npm run typecheck` y `npx vitest run`.
3. Haz commit con un mensaje del tipo "Actualiza tasas de cuentas de ahorro (fecha)" y push a `main`, con la línea de atribución que indique el sistema.
4. Verifica que el despliegue quedó activo: `https://frilo.dev/ahorro` responde 200 y, si es posible, que el nuevo contenido ya se sirve (el webhook de Vercel a veces falla; si no se desplegó, un commit vacío lo reactiva).
5. Resume qué quedó publicado.
