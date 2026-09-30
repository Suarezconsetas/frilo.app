# Frilo — contexto del proyecto

Frilo es una app web (luego móvil) para freelancers y contratistas por prestación de servicios en Colombia, que ganan en dólares, en pesos o en ambos. Resuelve tres cosas: entender el dólar (TRM), calcular los aportes a seguridad social y reconstruir por su cuenta la prima y las cesantías que su contrato no les da. Promesa de marca: "Tus finanzas, mejor con Frilo" · "Más claridad, más libertad."

Todo el producto está en español de Colombia. Cifras en pesos con punto de miles y coma decimal: `$5.035.333`, `9,50% E.A.`, TRM `$4.000,00`.

## Stack

- **Next.js** (App Router, TypeScript) desplegado en **Vercel**.
- **Supabase**: Postgres, Auth y tareas programadas.
- **Resend** para correos (códigos de verificación y alertas), enviados desde el dominio propio.
- Pruebas con **Vitest**.
- Las claves van solo en `.env.local` y en las variables de entorno de Vercel. Nunca en el código ni en el repositorio.

## Lógica de cálculo (ya hecha y probada)

Viene en `calculadoras-freelance.zip` → copiar `src/lib/*` a `lib/calculos/` y `tests/*` a `tests/`. Son funciones puras con 58 pruebas; **no reescribir la lógica**, solo importarla. Las pruebas deben seguir pasando siempre.

Módulos: `parametros` (SMLMV y tarifas 2026 con vigencia), `cuentas` (Lulo 9,50%, Nu 9,30%, RappiPay 9,00%, con fecha de consulta y campo `patrocinado`), `trm` (TRM vigente, panel de 4 referencias, alertas por cruce de umbral), `ingresos` (fuentes USD/COP, tasa recibida y retención opcionales), `aportes` (replica la hoja de Excel validada, reglas de ARL), `prestaciones` (prima y cesantías sintéticas: 1/12 cada una = 16,67%, proyección y cobros marcados por el usuario), `rentabilidad`, `metas`, `flujo` (resumen del mes) y `avisos` (textos legales).

Decisiones fijas:
- Prima y cesantías se calculan sobre el ingreso bruto (antes de impuestos, sin IVA). Solo el 16,67%, sin ahorro extra para igualar intereses.
- El usuario marca cuándo cobró la prima; ahí se reinicia ese bolsillo.
- La tasa real recibida (USD) y la retención (COP) son campos opcionales. La retención reduce el disponible, nunca la base de cálculo.
- El comparador solo muestra cuentas de ahorro con liquidez (sin CDT), ordenadas por tasa sin condiciones, con fecha de consulta y aviso legal.
- Todo cálculo muestra el aviso: no incluye 4x1000, retenciones de Colombia o del país contratante, ni impuesto de renta.

## Diseño

- Sistema de diseño Frilo: https://claude.ai/artifact/JJcbdG8a7KEswYZbgiweq3 (tokens, modo claro y oscuro, logos, íconos, componentes y manual).
- Pantallas de referencia: https://claude.ai/artifact/7fiS8uRszjULSNmLGjbG5Y
- Tokens clave: oliva `#0F372D`, manzana `#6FFF8F`, fondo `#F3F6F4`, tinta-suave `#4A6158`, línea `#D6E0DA`. Fuente **Clarity City** (Google Fonts, pesos 300/400/600/700).
- Reglas: manzana solo sobre oliva (nunca texto sobre blanco). Botón primario: oliva con texto manzana (en oscuro al revés). Mínimo 44px en controles.

## Flujo de pantallas

1. Bienvenida (oliva): "¿Cómo te pagan?" → USD / COP / ambos.
2. Primer ingreso: cliente, monto, tasa opcional, clase de riesgo ARL, ¿contratante público?
3. Registro "Guarda tu mes": muestra primero el resultado (lo que le queda, aportes, prima+cesantías) y luego Google o correo con código. **Sin Apple por ahora** (se agrega con la app iOS).
4. Código de 6 dígitos (vence en 10 min, reenviar, cambiar correo).
5. Inicio: cabecera oliva con lo que queda, selector con/sin ahorro, reparto agrupado (Gastos obligatorios: aportes · Gastos opcionales: *prima, *cesantías + nota · Disponible para ti al final), tarjeta de TRM.
6. Aportes: desglose, interruptor de ARL, botón "Pagar mi planilla en MiPlanilla" (https://independientes2.miplanilla.com/PublicoIndependientes/Publico/IndexIndependientes).
7. Prima y cesantías: bolsillos, "Ya cobré mi prima", comparador de cuentas.
8. Dólar: TRM vs semana / mes / año, alertas, costo de conversión.

Quien gana solo en pesos no ve la pestaña Dólar.

## Datos y privacidad (Ley 1581 de 2012)

Tablas con Row Level Security (cada usuario solo ve lo suyo):
- `perfiles`: id (= auth.users.id), correo, nombre, proveedor, creado_en, ciudad, forma_de_pago (usd/cop/mixto), rango_ingreso (no la cifra exacta), clase_riesgo.
- `autorizaciones`: usuario_id, tipo (`tratamiento_datos`, `marketing_frilo`), otorgada (bool), version_politica, fecha, user_agent. Es la prueba ante la SIC; nunca se borra un registro, se agrega uno nuevo.
- `fuentes_ingreso`, `pagos`, `cobros`, `alertas`: datos de la herramienta.

Monetización: afiliados (enlaces de referidos en el comparador, marcados si son patrocinados) y productos propios de Frilo. **No se venden ni se comparten datos con terceros.** Solo hay una casilla opcional y desmarcada: "Quiero recibir novedades, ofertas y recomendaciones de Frilo por correo."

## Fuente de la TRM

`https://www.datos.gov.co/resource/32sa-8pi3.json` (filtro `vigenciadesde`). Una tarea diaria guarda la TRM en la base y evalúa las alertas; nunca consultar datos.gov.co en cada visita.

## Plan de trabajo

1. Base: proyecto Next.js, Supabase, esquema y lógica integrada con sus pruebas.
2. Pantallas con los tokens de Frilo.
3. Registro (correo con código + Google) y autorizaciones.
4. TRM diaria y alertas por correo.
5. Lanzamiento: textos legales, analítica, dominio.

Ideas para después: pedir los dos últimos dígitos del documento para avisar la fecha límite de pago de la planilla; inicio con Apple; app móvil; modo oscuro en las pantallas.
