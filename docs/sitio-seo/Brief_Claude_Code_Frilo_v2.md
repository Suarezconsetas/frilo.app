# Brief para Claude Code: Frilo (app web + sitio SEO) — v2

> Documento de contexto para Claude Code. Reemplaza al brief inicial (`Brief_App_Freelancers_Colombia.md`) en todo lo que se contradiga. Fecha: 20 de octubre de 2026.
>
> **Regla principal:** las cifras normativas y los datos de las cuentas de ahorro deben vivir en **un solo lugar del código** y ser leídos tanto por la app (frilo.dev / app.frilo.dev) como por el sitio de contenido. Nunca escribirlos a mano en un componente. Así lo que informa la web y lo que calcula la app siempre coincide.

---

## 0. Qué cambió frente al brief inicial

| Tema | Brief inicial | Ahora |
|---|---|---|
| Decreto del salario mínimo 2026 | "Decreto 0159 de 2026" (incorrecto) | **Decreto 1469 de 2025** (29-dic-2025): $1.750.905, +23% |
| Auxilio de transporte | No estaba | $249.095 (Decreto 1470 de 2025) — se usa en la calculadora de cesantías para asalariados |
| FSP | Tabla Ley 797 | Igual. Sigue vigente en 2026: la reforma pensional (Ley 2381 de 2024) entraría en vigencia el **1-abr-2027** |
| Calendario de pago PILA | Idea futura | Verificado (Decreto 1990 de 2016, art. 3.2.2.1). Independientes cotizan mes vencido (Decreto 1273 de 2018) |
| Recordatorio de pago | Idea futura | **Funcional en esta fase**: datos, festivos, job diario y correos (sección 2.8) |
| Registro desde el sitio | Solo botón a la app | Banner con Google y código por correo que deja creada la acción pendiente (sección 2.9) |
| Cuentas de ahorro | Lulo Bank, RappiPay y Nu sin datos | 6 cuentas en pesos + 2 opciones en dólares, con datos verificados el 20-oct-2026 (sección 3) |
| Monetización | Por definir | Por ahora **sin afiliados**: enlaces directos a la web oficial de cada entidad con `rel="noopener"` |
| Revisor del contenido | — | "Equipo de finanzas Frilo" (sin nombre propio). Autor: **Nicolás Suárez** |
| Sitio de contenido | No existía | Sitio SEO con 15 páginas, 4 calculadoras y guías (secciones 5–7) |
| Base de independientes por cuenta propia | Nota sin verificar | **Decreto 379 de 2026** confirmado: el 40% se aplica sobre el ingreso neto (después de costos) solo para cuenta propia; contratistas OPS siguen con 40% del valor mensualizado del contrato |
| Dígitos para la fecha de pago con NIT | Por definir | Los dos últimos dígitos **incluyendo el dígito de verificación** |
| Banner de cuentas en la app | Lulo, RappiPay y Nu | **Misma regla que el sitio**: la más alta en pesos y la más alta en dólares (3.4-9) |
| URL de la app | `frilo.dev` | **`app.frilo.dev`** (noindex); el sitio ocupa `frilo.dev`. Publicación solo con instrucción manual (sección 9) |
| Páginas legales | Por definir | Ya existen en la app (Claude Code); el sitio enlaza a esas mismas páginas |
| Ahorro / metas (Módulo D) | Simulador neutral | Calculadora de interés compuesto con 3 modos (sección 2.6) y comparativa de cuentas (sección 3) |

---

## 1. Producto y estado

- **Frilo**: app gratuita para freelancers y contratistas por prestación de servicios en Colombia, que cobran en pesos, en dólares o ambos.
- **MVP publicado** en `https://frilo.dev` (Next.js en Vercel, Supabase, Resend). Inicio de sesión con correo (código) y Google; sin Apple por ahora.
- **Siguiente fase (decidido el 20-oct-2026):** sitio de contenido SEO en la raíz de `https://frilo.dev` y la app en **`https://app.frilo.dev`** con `noindex, nofollow` (meta y cabecera `X-Robots-Tag`) y `robots.txt` con `Disallow: /`. Todos los CTA del sitio ("Probar la app gratis", "Entrar", banners de registro) apuntan a `https://app.frilo.dev`. Hasta la publicación, `frilo.dev` sigue sirviendo la app como hoy. Ambientes y publicación: sección 9.
- **Registro:** después de que el usuario ve su primer resultado (nunca antes).
- **Datos:** no se venden a terceros.
- **Hosting:** plan gratis de Vercel. Mientras no haya afiliados ni publicidad, el sitio no es "uso comercial". Cuando se active un acuerdo de referidos: pasar a Vercel Pro o mover el sitio de contenido a un hosting que permita uso comercial.

---

## 2. Parámetros y lógica de cálculo (fuente única)

### 2.1 Archivo de configuración sugerido

Crear `src/config/parametros-2026.ts` (o `.json`) y que **app y sitio** lo importen:

```ts
export const PARAMETROS = {
  anio: 2026,
  smlmv: 1750905,            // Decreto 1469 de 2025
  auxilioTransporte: 249095, // Decreto 1470 de 2025
  ibc: { porcentaje: 0.40, minSmlmv: 1, maxSmlmv: 25 },
  salud: 0.125,
  pension: 0.16,
  arl: { I: 0.00522, II: 0.01044, III: 0.02436, IV: 0.0435, V: 0.0696 }, // Decreto 1772 de 1994
  arlPagaContratanteDesde: 'IV', // Decreto 723 de 2013
  fsp: [ // Ley 797 de 2003, sobre el IBC en SMLMV
    { desde: 0, hasta: 4, tasa: 0 },
    { desde: 4, hasta: 16, tasa: 0.01 },
    { desde: 16, hasta: 17, tasa: 0.012 },
    { desde: 17, hasta: 18, tasa: 0.014 },
    { desde: 18, hasta: 19, tasa: 0.016 },
    { desde: 19, hasta: 20, tasa: 0.018 },
    { desde: 20, hasta: Infinity, tasa: 0.02 },
  ],
  redondeoPila: 100,
  primaYCesantias: { porcentajeCadaUna: 0.0833, total: 0.1666 },
  interesesCesantias: 0.12,
  retencionRendimientos: 0.07, // tarifa 2026 sobre intereses y rendimientos financieros, base 0 UVT (Gerencie, tabla de retención 2026)
  fuentes: {
    smlmv: 'Decreto 1469 de 2025',
    auxilio: 'Decreto 1470 de 2025',
    calendario: 'Decreto 1990 de 2016, art. 3.2.2.1',
  },
  actualizado: '2026-10-20',
} as const;
```

Valores derivados 2026: IBC mínimo $1.750.905 · IBC máximo $43.772.625 · FSP desde IBC de $7.003.620.

### 2.2 Aportes de independientes (sin cambios de lógica)

1. IBC = ingreso bruto mensual sin IVA × 40%, acotado entre 1 y 25 SMLMV.
2. Salud 12,5% · Pensión 16% · ARL según clase (opcional en riesgo I–III por cuenta propia; en IV–V la paga el contratante) · FSP según tabla.
3. Cada aporte se redondea al múltiplo de 100 más cercano.
4. Ingreso en USD: convertir con la TRM antes de calcular.

Caso de prueba: ingreso $8.000.000, riesgo I con ARL → IBC $3.200.000; salud $400.000; pensión $512.000; ARL $16.700; FSP $0; **total $928.700**.

### 2.3 Prima y cesantías propias (Módulo C)

- Apartar 8,33% del ingreso bruto para prima y 8,33% para cesantías (16,66% en total). Sin ahorro extra para igualar los intereses de cesantías.
- El usuario marca cuándo cobró su prima. La tasa real que recibe en su cuenta es un campo opcional.
- Caso de prueba: ingreso $8.000.000 → $666.400 para cada una (redondeo a 100).

### 2.4 Calculadora de cesantías para asalariados (nueva, solo en el sitio)

- Cesantías = salario × días ÷ 360 (sumar auxilio de transporte si gana hasta 2 SMLMV).
- Intereses = cesantías × días × 12% ÷ 360.
- Consignación al fondo a más tardar el 14 de febrero; intereses al trabajador a más tardar el 31 de enero.
- Tabla de años anteriores (confirmar antes de publicar): 2025 $1.423.500 / $200.000 · 2024 $1.300.000 / $162.000 · 2023 $1.160.000 / $140.606 · 2022 $1.000.000 / $117.172 · 2021 $908.526 / $106.454.

### 2.5 Fecha de pago de la planilla (Decreto 1990 de 2016)

Día hábil del mes según los dos últimos dígitos del documento. **Con NIT se toman los dos últimos dígitos incluyendo el dígito de verificación.**

| Dígitos | Día hábil | Dígitos | Día hábil |
|---|---|---|---|
| 00–07 | 2 | 57–63 | 10 |
| 08–14 | 3 | 64–69 | 11 |
| 15–21 | 4 | 70–75 | 12 |
| 22–28 | 5 | 76–81 | 13 |
| 29–35 | 6 | 82–87 | 14 |
| 36–42 | 7 | 88–93 | 15 |
| 43–49 | 8 | 94–99 | 16 |
| 50–56 | 9 | | |

Los días hábiles excluyen sábados, domingos y festivos de Colombia. Esta tabla alimenta el **recordatorio de pago** (sección 2.8), que debe quedar funcional.

### 2.8 Recordatorio de pago de la planilla (funcional, obligatorio en esta fase)

**Qué ve el usuario:** activa el recordatorio con los dos últimos dígitos de su documento y recibe un correo **3 días hábiles antes** y **el mismo día** de su fecha límite, todos los meses, hasta que lo apague.

**Datos (Supabase):**

```sql
-- Perfil: solo los 2 últimos dígitos, nunca el documento completo
alter table perfiles add column digitos_documento char(2) check (digitos_documento ~ '^[0-9]{2}$');
alter table perfiles add column recordatorio_planilla boolean not null default false;
alter table perfiles add column dias_anticipacion smallint not null default 3;

create table festivos_co (
  fecha date primary key,
  nombre text not null
);

create table recordatorios_enviados (
  user_id uuid references auth.users on delete cascade,
  periodo char(7) not null,          -- 'AAAA-MM'
  tipo text not null check (tipo in ('previo','dia')),
  enviado_at timestamptz not null default now(),
  primary key (user_id, periodo, tipo) -- evita duplicados si el job corre dos veces
);
```

Activar RLS: cada usuario solo lee y edita su propio perfil. `festivos_co` es de solo lectura pública. `recordatorios_enviados` solo la escribe el job con la service role.

**Festivos 2026** (cargar en `festivos_co`): 01-01, 01-12, 03-23, 04-02, 04-03, 05-01, 05-18, 06-08, 06-15, 06-29, 07-20, 08-07, 08-17, 10-12, 11-02, 11-16, 12-08, 12-25. **Festivos 2027** (cargar antes del 1-dic-2026): 01-01, 01-11, 03-22, 03-25, 03-26, 05-01, 05-10, 05-31, 06-07, 07-05, 07-20, 08-07, 08-16, 10-18, 11-01, 11-15, 12-08, 12-25 (fuente: calendario-colombia.com/calendario-2027). Esa fuente también marca el 12 de julio (Virgen de Chiquinquirá); **no se cargó** porque no es festivo nacional según la Ley 51 de 1983. Confirmar con Nicolás antes de cargarlo. Si falta el año siguiente, el job debe fallar con un error visible, no calcular sin festivos.

**Función compartida** `fechaLimitePago(digitos, anio, mes, festivos)`: toma el día hábil N de la tabla 2.5 y cuenta los días del mes saltando sábados, domingos y festivos. La usan la calculadora del sitio (P05), la app y el job.

Casos de prueba (deben pasar):

| Dígitos | Mes | Resultado |
|---|---|---|
| 89 | noviembre 2026 | martes 24 de noviembre |
| 00 | enero 2026 | lunes 5 de enero |
| 50 | junio 2026 | viernes 12 de junio |
| 99 | diciembre 2026 | miércoles 23 de diciembre |

**Envío programado:**
- Vercel Cron (el plan gratis permite jobs diarios, aunque la hora exacta puede variar dentro de la hora programada) a las **07:00 hora Colombia** (`0 12 * * *` UTC) que llama a `/api/cron/recordatorios`, protegido con `CRON_SECRET`. Alternativa: Supabase `pg_cron` + Edge Function.
- Para cada usuario con `recordatorio_planilla = true` y `digitos_documento` no nulo: calcular la fecha límite del mes actual; si hoy es N días hábiles antes → tipo `previo`; si hoy es la fecha → tipo `dia`.
- Insertar en `recordatorios_enviados` **después** de que Resend confirme el envío. Si falla, el siguiente run lo reintenta (en el tipo `dia` solo ese mismo día).
- Reutilizar el mismo job (o uno hermano) para las **alertas del dólar**.

**Correo (Resend):**
- Asunto: "Tu planilla vence el [día] [fecha]" / "Hoy vence tu planilla de seguridad social".
- Cuerpo: fecha límite; si la app tiene su ingreso guardado, el valor estimado de la planilla (salud, pensión, ARL y Fondo de Solidaridad); botón a Miplanilla (`https://independientes2.miplanilla.com/PublicoIndependientes/Publico/IndexIndependientes`); recordatorio de que los independientes pagan mes vencido.
- Pie: enlace para apagar el recordatorio con un token firmado (sin iniciar sesión), cabecera `List-Unsubscribe`, y aviso de que es un cálculo estimado.

**Dónde se activa:**
1. Desde el sitio (P05 y la guía de descargar la planilla) con el banner de registro (sección 2.9): los dígitos que el usuario escribió en la calculadora se guardan como intención y se activan al terminar el registro.
2. En el onboarding de la app (paso opcional "¿Quieres que te recordemos tu fecha de pago?").
3. En la configuración de la app (activar, cambiar dígitos, días de anticipación, apagar).

### 2.9 Registro embebido en el sitio (banner de registro)

Componente `BannerRegistro` con variantes `recordatorio`, `dolar`, `prima`, `aportes` y `general`. Muestra un beneficio y el registro en el mismo bloque: botón **Continuar con Google** y campo de correo con **código de 6 dígitos**.

**Implementación:**
- Supabase Auth en el sitio con `@supabase/ssr`. Si el sitio y la app quedan en dominios distintos (`frilo.dev` y `app.frilo.dev`), configurar la cookie de sesión con dominio `.frilo.dev` para compartir la sesión.
- Correo: `signInWithOtp({ email, options: { shouldCreateUser: true } })` con la plantilla de correo de Supabase usando `{{ .Token }}` (código, no enlace mágico); luego `verifyOtp({ email, token, type: 'email' })`. Envío con Resend como SMTP de Supabase.
- Google: `signInWithOAuth({ provider: 'google', options: { redirectTo: 'https://app.frilo.dev/bienvenida' } })`. Usar el **botón oficial de Google** según sus guías de marca (el wireframe solo marca el lugar).
- **Intención:** antes de autenticar, guardar en `sessionStorage` la acción pendiente, por ejemplo `{ tipo: 'recordatorio', digitos: '89' }`, `{ tipo: 'alerta_dolar', valor: 4300 }` o `{ tipo: 'guardar_calculo', ingreso: 8000000, riesgo: 'I' }`. Al llegar a `/bienvenida`, crear el recordatorio, la alerta o el cálculo y borrar la intención. **Nunca** poner estos datos en la URL.
- Consentimiento: texto "Al continuar aceptas los Términos de uso y la Política de datos" con enlaces (Ley 1581 de 2012). Sin casillas premarcadas para correos de marketing.
- Medición: `signup_start {pagina, variante, metodo}` y `signup_complete`, más el first touch (sección 8).

**Ubicación en el sitio:** P05 (`recordatorio`, debajo del resultado), P04 (`recordatorio`), P01 y P02 (`aportes`), P03, P10 y P12 (`prima`), P09 (`dolar`) e índices de calculadoras y guías (`general`). Dólar hoy ya tiene su propio formulario de alerta, que usa el mismo flujo con la variante `dolar`.

### 2.6 Calculadora de interés compuesto (nueva)

- Tasa mensual equivalente: `i = (1 + E.A.)^(1/12) − 1`. Si la tasa es nominal: `E.A. = (1 + nominal/k)^k − 1` con k = capitalizaciones al año (365, 12, 4, 2, 1).
- Saldo: `C × (1 + i)^n + A × [(1 + i)^n − 1] ÷ i`.
- **Modos:**
  - ¿Cuánto tendré? → saldo con aporte A y plazo n.
  - ¿Cuánto debo ahorrar al mes? → `A = (Meta − C(1+i)^n) × i ÷ ((1+i)^n − 1)`, redondeado hacia arriba a miles; mínimo 0.
  - ¿Cuánto tiempo tardo? → iterar mes a mes hasta que saldo ≥ meta (tope 600 meses).
- Extras: escenarios con la tasa ± N puntos, retención en la fuente opcional (7% de los intereses, sin base mínima), regla del 72, tabla por mes o año, atajo "mi prima y mis cesantías" (aporte = 16,66% del ingreso).
- Casos de prueba (aporte $1.332.800, 9% E.A., C = 0): 12 meses → $16.643.072 (intereses $649.472). Meta $20.000.000 en 12 meses → aporte $1.602.000. Meta $20.000.000 con $1.332.800 al mes → 1 año y 3 meses.

### 2.7 TRM

Sin cambios: datos.gov.co (`32sa-8pi3`). **Descartadas las páginas por fecha** (`/dolar-hoy/AAAA-MM-DD`): una sola página con los últimos 30 días, regenerada una vez al día. No se guarda la TRM en Supabase para el sitio.

---

## 3. Cuentas de ahorro: datos que deben coincidir en app y sitio

### 3.1 Archivo sugerido `src/config/cuentas.ts`

Un solo arreglo que alimenta: la sección de ahorro de la app (Módulo C), el banner del sitio, la tabla de la guía de cuentas y la calculadora de interés compuesto.

```ts
export type Cuenta = {
  id: string;
  entidad: string;
  entidadLegal: string;
  producto: string;
  moneda: 'COP' | 'USD';
  tasaEA: number | null;            // tasa sin condiciones
  tasaEAHasta?: number;             // tasa máxima anunciada
  condiciones?: string;             // texto corto de las tasas con condiciones
  topeRemunerado?: number;
  cuotaManejo: string;
  exencion4x1000: string;
  fogafin: 'Sí' | 'No' | 'No lo indica';
  vigiladaSFC: boolean;
  url: string;
  consultado: string;               // AAAA-MM-DD
  nota?: string;
};
```

### 3.2 Cuentas en pesos (consultadas el 2026-10-20, ordenadas por tasa sin condiciones)

| # | Entidad (legal) | Producto | Tasa E.A. sin condiciones | Con condiciones | Cuota de manejo | 4x1000 | Fogafín | URL |
|---|---|---|---|---|---|---|---|---|
| 1 | Pibank (Banco Pichincha) | Cuenta Pibank | **11%** | — | $0, sin comisiones | Exenta a solicitud en la app | Sí | https://www.pibank.co/cuenta-pibank/ |
| 2 | Global66 (Global Colombia 81 S.A.) | Cuenta global en pesos | **11%** | — | $0 apertura y mantenimiento | No lo indica | Sí (depósito en pesos) | https://www.global66.com/co/cuenta-global/ |
| 3 | Lulo Bank (Lulo bank S.A.) | Bolsillos | **9,50%** | 10% con Lulo Pro; Lulo cuenta 0,10% | $0 | No lo indica | No lo indica | https://www.lulobank.com/ |
| 4 | RappiPay (RappiPay C.F. S.A.) | RappiCuenta, Bolsillos | **9%** | Bóvedas: 60 d 9,8% · 90 d 11% · 180 d 11,5% · 360 d 12% · 540 d 13%; retiro anticipado al 0,1% | $0 cuenta y tarjeta | No lo indica | Sí | https://www.rappipay.co/rappicuenta/ |
| 5 | Nu (Nu Colombia C.F. S.A.) | Cajitas | **8,25%** | La misma página también dice 9,25% y "hasta 9,70% en Cajitas o CDT" | No lo indica; 1 retiro gratis al mes, luego $6.800 | Exenta a solicitud por chat (hasta $16 millones al mes) | Sí, hasta $50 millones | https://www.nu.com.co/cuenta |
| 6 | Ualá (Bancar Tecnología CO C.F.) | Cuenta Ualá (depósito de bajo monto) | **5%** | 8,25% con 1 compra al mes; 10,5% con $400.000 en compras al mes | No lo indica | Exenta hasta 65 UVT al mes | Sí | https://www.uala.com.co/deposito-remunerado |

Ualá remunera saldos hasta $10.500.000. El 5% se paga diario y el adicional se abona el 5.º día hábil del mes siguiente.

### 3.3 Cuentas en dólares

| Entidad | Rendimiento en USD | Regulación | Costos | URL |
|---|---|---|---|---|
| Littio (Selenio S.A.S.) | Hasta 6% u 8% E.A. (Bolsillos / Bóvedas), sin garantía | **No** vigilada por la Superfinanciera; opera con activos digitales (USDC); sin Fogafín | $0 cuota; USD 2,99 por enviar o recibir de EE. UU. o Europa | https://littio.co/cuenta-en-dolares |
| Global66 | Hasta 6% E.A. (la página también menciona 8% en Bóvedas) | Dólares en custodia de 100x Corp. (Panamá); sin Fogafín para esta cuenta | $0 apertura y mantenimiento | https://www.global66.com/co/cuenta-global/ |

### 3.4 Reglas de presentación (app y sitio)

1. **Orden:** por tasa E.A. sin condiciones, de mayor a menor. Las tasas con condiciones van como texto secundario, nunca como cifra principal.
2. **Fecha de consulta** visible junto a la tabla o la tarjeta ("Consultado el 20 oct. 2026").
3. **Inconsistencias de la fuente:** usar la tasa menor y decir que la página muestra otra (caso Nu).
4. **Fogafín:** "Sí" solo si la web lo dice o Nicolás lo confirmó (RappiPay y Nu). Si no, "No lo indica".
5. **Cuentas en dólares:** siempre con el aviso de regulación (Littio no vigilada, sin Fogafín).
6. **Enlaces:** `target="_blank" rel="noopener"`. Si algún día son de afiliado: `rel="sponsored noopener"` y cambiar el aviso.
7. **Aviso fijo:** "Frilo no recibe pagos de estas entidades. No es asesoría financiera."
8. **Lenguaje:** "poner a rendir" o "cuenta que rinde", no "invertir".
9. **Banner de rendimiento (sitio y app, misma regla, confirmado por Nicolás):** muestra **la cuenta en pesos con la tasa más alta sin condiciones** (hoy Pibank 11%, empata con Global66) y **la cuenta en dólares con la tasa más alta** (hoy Littio, hasta 8%, con aviso de que no es vigilada). Sitio y app leen de `cuentas.ts` con la misma función de orden. Reemplaza la idea anterior de destacar Lulo, RappiPay y Nu en la app.
10. **Actualización:** una tarea programada revisa las tasas cada lunes y deja el registro en el doc del proyecto `claude/Registro_tasas_cuentas_ahorro.md`. Cuando cambie un dato, actualizar solo `cuentas.ts` (y su fecha `consultado`).

### 3.5 Cómo leer las tasas de cada entidad (incluido Lulo Bank)

Las tasas **nunca** se leen en vivo desde el sitio ni desde la app: viven en `cuentas.ts` y se cambian a mano (o con un PR) después de verificarlas. La verificación semanal la hace la tarea programada de Claude y deja el registro en el doc del proyecto `claude/Registro_tasas_cuentas_ahorro.md`. Si quieres automatizar la lectura, crea un script local que proponga cambios, nunca uno que los publique solo.

| Entidad | Cómo se lee | Por qué |
|---|---|---|
| RappiPay, Global66, Littio | `fetch` del HTML funciona | Contenido en el HTML del servidor |
| Pibank, Nu | Navegador (Playwright) | El fetch simple suele fallar o llega sin las tasas |
| Ualá | Navegador; la tasa está en el PDF de términos que abre `deposito-remunerado` | Hay que descargar y leer el PDF |
| **Lulo Bank** | **Navegador con WebGL** (ver abajo) | La página se dibuja con WebGL/JavaScript: el HTML que devuelve un fetch no trae las tasas |

**Lulo Bank, paso a paso (por qué no lo ves y cómo sí):**

1. `https://www.lulobank.com/` responde con un HTML casi vacío: el texto se monta en el navegador y parte de la página se dibuja en un `<canvas>` con WebGL. Por eso `curl`, `fetch` o un lector de páginas no encuentran "9,50%".
2. Ábrela con Playwright (Chromium) y habilita WebGL por software, porque en modo headless no hay GPU:
   `chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })`
3. Usa `locale: 'es-CO'`, viewport de escritorio (1366×900), `waitUntil: 'networkidle'`, espera 3 s más y haz scroll por toda la página (de 1.200 px en 1.200 px, con pausas de 500 ms) para que carguen las secciones diferidas.
4. Lee el texto con `document.body.innerText` y busca porcentajes con una expresión como `/(\d{1,2}(?:[.,]\d{1,2})?)\s?%\s?(E\.?\s?A\.?)?/g`, guardando 80 caracteres de contexto antes y después (para saber si es Bolsillos, Lulo Pro, Lulo cuenta o CDT).
5. Escucha también las respuestas JSON de la página (`page.on('response')`): el contenido suele venir de una API o un CMS, y ahí las tasas aparecen como texto aunque en pantalla estén dentro del canvas. Guarda las respuestas que contengan "E.A.", "tasa" o "%".
6. Recorre los enlaces de la página cuyo texto contenga "tasa", "tarifa", "bolsillo", "Pro" o "reglamento" (por ejemplo, la página de tasas y tarifas del pie de página) y repite los pasos 3 y 4. Las páginas legales suelen ser HTML normal.
7. Si después de dos intentos no aparece la tasa, toma una captura de página completa (`fullPage: true`), guárdala con la fecha y marca Lulo como "Sin verificar esta semana", conservando el dato anterior con su fecha anterior.
8. **Validación:** valores de referencia al 20-10-2026: Bolsillos 9,50% E.A., Lulo Pro 10% E.A., Lulo cuenta 0,10% E.A., CDT hasta 13%. Si el script lee algo que difiere en más de 2 puntos o no encuentra el dato, no actualices `cuentas.ts`: deja el resultado en `scripts/tasas/salida/AAAA-MM-DD.json` y avisa a Nicolás.
9. Solo lectura: no iniciar sesión, no llenar formularios, no aceptar cookies más allá de lo necesario (elegir "rechazar" las no esenciales) y no intentar saltar captchas ni bloqueos. Si la página bloquea al navegador automatizado, se marca "Sin verificar" y se revisa a mano.

Script sugerido: `scripts/tasas/leer-tasas.ts` con una función por entidad que devuelva `{ entidad, tasas: [{ producto, valor, contexto }], fuente, consultado }`, y un comando `pnpm tasas:verificar` que compare contra `cuentas.ts` e imprima las diferencias. No corre en el build ni en producción.

---

## 4. Avisos legales y transparencia

- En todo cálculo: "Cálculo estimado. No incluye el 4x1000 ni las retenciones de Colombia o del país contratante. No es asesoría financiera, legal ni tributaria."
- Términos de uso y Política de datos: **ya existen en la app** (desarrolladas en Claude Code). El sitio y el banner de registro enlazan a esas mismas URLs; no duplicar.
- Página `/transparencia` (enlazada en el footer): Frilo es gratuito, no recibe pagos de las entidades que compara y no vende datos.
- Referente de tono para productos financieros: Comparabien.

---

## 5. Sitio de contenido: arquitectura

Rutas sin barra final (la variante con barra redirige 301). Diseño en el lienzo "Frilo — Sitio web (wireframes)".

| ID | URL | Tipo |
|---|---|---|
| Home | `/` | Hub de marca |
| — | `/calculadoras` | Índice de calculadoras |
| P01 | `/calculadoras/aportes-independientes` | Calculadora de aportes |
| P03 | `/calculadoras/cesantias` | Calculadora con modo laboral e independiente |
| P05 | `/calculadoras/fecha-pago-planilla` | Buscador por dígitos |
| P10 | `/calculadoras/interes-compuesto` | Calculadora con 3 modos |
| P07 | `/dolar-hoy` | TRM (página única) |
| — | `/guias` | Índice de guías |
| P02 | `/guias/ibc-independientes` | Guía con mini calculadora de IBC |
| P04 | `/guias/descargar-planilla-seguridad-social` | Guía con enlaces a operadores |
| P08 | `/guias/cuenta-en-dolares-colombia` | Guía comparativa |
| P09 | `/guias/recibir-pagos-en-dolares-colombia` | Guía |
| P11 | `/guias/cuentas-de-ahorro-alto-rendimiento` | Comparativa de cuentas (sección 3) |
| P12 | `/guias/cesantias-independientes` | Guía |
| P06 | `/glosario/sln` | Entrada de glosario |
| — | `/glosario` | Índice del glosario (falta wireframe; `noindex` hasta tener 3 entradas) |
| — | `/quienes-somos` | Institucional (URL del `Person` en el JSON-LD; falta wireframe) |
| — | `/metodologia` | "Cómo calculamos" y "Cómo hacemos nuestras guías" (falta wireframe) |
| — | `/transparencia` | Institucional (falta wireframe) |
| — | `/terminos` y `/politica-de-datos` | Legales: hoy existen en la app; pasan a servirse desde el sitio |
| — | `/lp/planilla-independientes` | Landing de pauta, `noindex`, fuera del sitemap |

Inventario completo con title, meta description, H1, keyword objetivo y JSON-LD de cada URL: `URLs_SEO_sitio_Frilo.xlsx` (fuente única para metadatos y datos estructurados).

Operadores para P04 (enlaces oficiales):
- Miplanilla: https://independientes2.miplanilla.com/RegistroIndependiente/Certificado/CertificadoAgil y https://independientes2.miplanilla.com/PublicoIndependientes/Publico/IndexIndependientes
- Aportes en Línea: https://empresas.aportesenlinea.com/Autoservicio/CertificadoAportes.aspx
- Pago Simple: https://pagosimple.com/consultas-y-certificados/
- Enlace Operativo: https://enlace.com.co/blog/descargar-comprobante-pago-pila

---

## 6. Sitio de contenido: componentes y marca

- **Header** (todas las páginas): isotipo F manzana + wordmark sobre oliva; nav Calculadoras · Dólar hoy · Guías · Cuentas que rinden; botón **"Probar la app gratis"** con degradé `linear-gradient(100deg, #6FFF8F, #2FB35E)` y texto oliva `#0F372D`, que lleva a la app.
- **H1 de la Home:** "Frilo" (isotipo + wordmark como SVG `aria-hidden` + `<span class="sr-only">Frilo</span>`). H2 principal: "Calculadoras gratis para independientes: aportes, cesantías y planilla".
- **La F en todo el sitio:** header, footer, sello "Calculado con Frilo" en cada resultado, banner, favicon/ícono de app. Manzana solo sobre oliva, oliva sobre fondos claros, mínimo 24 px.
- **BannerRendimiento:** variantes `prima`, `cesantias`, `aportes`, `dolar`, `guia`; lee de `cuentas.ts` (regla 3.4-9).
- **Línea de confianza** en calculadoras y guías: "Por Nicolás Suárez · Revisado por el equipo de finanzas Frilo · Actualizado el [fecha]".
- Tokens de color, tipografía (Clarity City), radios y espaciado: sistema de diseño "Frilo" (oliva `#0F372D`, manzana `#6FFF8F`, fondo `#F3F6F4`, tinta suave `#4A6158`, línea `#D6E0DA`).

---

## 7. SEO técnico (resumen; detalle en `claude/Especificacion_SEO_sitio_Frilo_v2.md`)

- Title, meta description, canonical absoluto, Open Graph y `og:image` 1200×630 por página (tabla completa en la especificación, sección 4).
- JSON-LD con `@graph`: Organization + WebSite + Person (Nicolás Suárez) global; `reviewedBy` = Organization "Equipo de finanzas Frilo"; WebApplication en calculadoras; Article en guías; FAQPage solo con preguntas visibles; BreadcrumbList; DefinedTerm en glosario; ItemList de DepositAccount en P11.
- `robots.txt` bloquea `/lp/`, `/app/`, `/api/`; no bloquear bots de IA. `sitemap.xml` con `lastmod` real. `llms.txt` en la raíz.
- Calculadoras renderizadas en servidor con un ejemplo por defecto (ingreso $8.000.000).
- Cada página: respuesta directa de 40 a 60 palabras bajo el H1, FAQ visible, fuentes al final.
- **Enlaces a fuentes oficiales:** cada calculadora y guía cita con enlace externo (`target="_blank" rel="noopener"`, sin `nofollow`) la norma o entidad de la que sale el dato: DIAN, UGPP, Minsalud, Banco de la República, Superfinanciera, Fogafín, datos.gov.co, Secretaría del Senado (leyes) y Función Pública (decretos). Van en el texto donde se usa el dato y en un bloque "Fuentes oficiales" antes de las preguntas frecuentes. Los wireframes ya los incluyen.

---

## 8. Medición

- Guardar en cada registro: `utm_source`, `utm_medium`, `utm_campaign`, `gclid`, `referrer` y URL de entrada (first touch).
- Eventos: `calc_result` (calculadora, ingreso en rangos), `signup`, `bank_click` `{pagina, variante, entidad, posicion}` con UTM propio por ubicación.

---

## 9. Ambientes, prueba y publicación (obligatorio)

1. **Nada se publica sin instrucción manual de Nicolás.** Todo el desarrollo se despliega primero a un ambiente de prueba privado. El paso a producción ocurre solo cuando Nicolás escriba en el chat una instrucción explícita como "Publica el sitio en producción". Una aprobación de diseño, un "se ve bien" o un merge no cuentan como esa instrucción.
2. **Ambiente de prueba del sitio:** proyecto propio en Vercel (por ejemplo `frilo-web`) y despliegues de vista previa desde una rama de trabajo (por ejemplo `web-staging`). Protección con Vercel Authentication (Deployment Protection) para que solo lo vean cuentas del equipo. En todo lo que no sea producción (`VERCEL_ENV !== 'production'`): cabecera `X-Robots-Tag: noindex, nofollow` y `robots.txt` con `Disallow: /`. Sin analítica de producción.
3. **Producción no se toca durante el desarrollo:** el dominio `frilo.dev` sigue asignado al proyecto actual de la app, las variables de entorno de producción no se cambian y la base de datos de producción de Supabase no recibe migraciones sin aprobación.
4. **Estructura recomendada:** monorepo con `apps/web` (sitio), `apps/app` (app actual) y `packages/config` (`parametros-2026.ts`, `cuentas.ts`, `festivos`, `fechaLimitePago`), para que app y sitio lean los mismos datos. Dos proyectos de Vercel apuntando al mismo repositorio con distinto *root directory*. Si reestructurar la app en un monorepo es riesgoso, proponer otra forma de compartir `packages/config` antes de mover código.
5. **Checklist antes de pedir aprobación:** todas las URLs de `URLs_SEO_sitio_Frilo.xlsx` responden 200 en el ambiente de prueba; title, meta description, H1 y canonical coinciden con el Excel; JSON-LD válido (Rich Results Test con el HTML); Lighthouse móvil ≥ 90 en rendimiento, accesibilidad, buenas prácticas y SEO en P01, P07, P10 y la Home; casos de prueba de la sección 2 pasan; enlaces internos sin 404; enlaces externos con `target="_blank" rel="noopener"`.
6. **Pasos de publicación (solo tras la instrucción):** a) agregar `app.frilo.dev` al proyecto de la app y verificar que funciona; b) actualizar Supabase Auth (Site URL y Redirect URLs), los orígenes de Google OAuth, los enlaces de los correos de Resend y el Vercel Cron a `app.frilo.dev`; c) mover `frilo.dev` al proyecto del sitio; d) activar las redirecciones 301 de las rutas viejas de la app a `app.frilo.dev`; e) quitar el `noindex` solo en producción del sitio; f) enviar `sitemap.xml` en Search Console; g) reportar a Nicolás qué se hizo y qué revisar.
7. **Plan de reversa:** si algo falla en la publicación, volver a asignar `frilo.dev` al proyecto de la app (el cambio de dominio en Vercel es inmediato) y avisar.

---

## 10. Pendientes `[VERIFICAR]`

Resueltos el 20-oct-2026: SLN (Minsalud caso 5), retención 7%, salarios mínimos históricos, regla de banner en la app, festivos 2027, NIT con dígito de verificación, Decreto 379 de 2026.

1. Lista completa de siglas de novedades PILA (Resolución 2388 de 2016 y modificaciones). Solo se tiene la definición de PILA y la sigla SLN.
2. Si Lulo Bank está cubierto por Fogafín (la web no lo indica).
3. Si el 12 de julio de 2027 (Chiquinquirá) se trata como festivo. Por ahora no.
4. Tope mensual de la exención del 4x1000 (cada entidad lo informa; Nu dice $16 millones).

---

## 11. Fuentes

- Decreto 1469 de 2025 (salario mínimo 2026): https://acmineria.com.co/wp-content/uploads/2025/12/DECRETO-1469-DEL-29-DE-DICIEMBRE-DE-2025.pdf
- Decreto 1470 de 2025 (auxilio de transporte): https://cancilleria.gov.co/normograma/compilacion/docs/decreto_1470_2025.htm
- Decreto 1990 de 2016 (calendario PILA): https://normativa.colpensiones.gov.co/compilacion/docs/decreto_1990_2016.htm
- Tabla FSP 2026: https://www.gerencie.com/fondo-de-solidaridad-pensional.html
- Vigencia de la reforma pensional: https://seguridadsocialcolombia.com.co/la-corte-constitucional-avala-la-reforma-pensional-ley-2381-de-2024-claves-del-fallo/
- Retención en la fuente 2026: https://www.gerencie.com/tabla-de-retencion-en-la-fuente-2026.html
- IBC superior al 40%: https://www.gerencie.com/independientes-pueden-cotizar-sobre-una-base-superior-al-40.html
- Decreto 379 de 2026: https://www.ugpp.gov.co/wp-content/uploads/2026/07/Decreto_379_de_2026_MinSalud.pdf
- Control cambiario DIAN: https://www.dian.gov.co/atencionciudadano/infoconsulta/Paginas/ControlCambiario.aspx
- Salario mínimo histórico: https://www.salariominimocolombia.net/historico/
- Festivos 2027: https://www.calendario-colombia.com/calendario-2027
- Novedad SLN: https://www.minsalud.gov.co/proteccionsocial/Financiamiento/Documents/CASO%205%20-%20Trabajador%20con%20%20novedad%20de%20SLN.pdf
- Webs oficiales de las cuentas: ver URL en las tablas 3.2 y 3.3 (consultadas el 2026-10-20).
