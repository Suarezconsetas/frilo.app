# Brief para crear las etiquetas de GTM y GA4 de Frilo (para pegar en Claude Web)

Pega este documento completo en Claude Web (con el conector `gtm-mcp-server` encendido) y pídele ejecutar el plan. Todo lo que está aquí sale del código real del sitio (`apps/web`), a 29-oct-2026.

## 1. Contexto del proyecto
- **Frilo** (`https://frilo.dev`): calculadoras gratis para independientes y contratistas en Colombia (aportes de seguridad social, cesantías y prima, interés compuesto, dólar/TRM). Todo en español de Colombia.
- Hay dos dominios: el **sitio de contenido** `frilo.dev` (Next.js, el que usa GTM) y la **app** `app.frilo.dev` (no lleva GTM; está en `noindex`).
- **Contenedor GTM:** `GTM-NPF6MT3S` (tipo Web). **Propiedad GA4:** ya existe; el ID de medición `G-…` lo conoce Nicolás (si no está en el contenedor, pídeselo; no lo inventes).
- **Privacidad (Ley 1581 de 2012):** GTM solo se carga si la persona acepta el aviso de cookies de analítica. Nunca viajan montos, ingresos ni correos. No se usa publicidad ni remarketing.

## 2. Consentimiento (importante para configurar las etiquetas)
El sitio carga `gtm.js` **solo después** de que la persona pulse «Aceptar». Justo antes ejecuta:

```js
gtag('consent', 'default', {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
```

Por tanto:
- Todas las etiquetas de GA4 deben tener **consentimiento adicional requerido: `analytics_storage`**.
- **No crear** etiquetas de Google Ads, remarketing, píxeles de Meta ni nada de publicidad. En «Consent Overview» el 0 % de publicidad es intencional.
- Si la persona rechaza, GTM nunca se carga: no hay eventos.
- Los eventos solo se empujan al `dataLayer` en producción y con la analítica aceptada.

## 3. Eventos que el sitio ya envía al `dataLayer`
Formato: `window.dataLayer.push({ event: '<nombre>', ...parámetros })`. Los nombres y parámetros son exactos.

| Evento | Cuándo se dispara | Parámetros |
|---|---|---|
| `signup_start` | Al pedir el código o pulsar «Google» en un bloque de registro del sitio | `pagina` (id de la página: `P01`, `P07`, `Home`…), `variante` (`aportes`, `prima`, `dolar`, `recordatorio`, `general`), `metodo` (`correo` o `google`) |
| `signup_complete` | Al verificar el código del correo (solo registro con correo; con Google no se dispara en el sitio) | `pagina`, `variante`, `metodo` (`correo`) |
| `calc_result` | La primera vez que la persona usa una calculadora de la página | `pagina` (ruta, p. ej. `/calculadoras/aportes-independientes`) |
| `bank_click` | Clic en un enlace a un banco (banner de rendimiento y tabla de cuentas) | `entidad` (nombre del banco), `pagina` (ruta) |

Nota: el parámetro `pagina` no es igual en todos los eventos: en `signup_*` es el **id de la página** (`P01`, `P07`, `Hub-G`…) y en `calc_result` y `bank_click` es la **ruta** (`/calculadoras/cesantias`). En GA4 conviene tenerlo en cuenta al comparar; unificarlo sería una mejora de código.

Los enlaces de los banners de rendimiento llevan además UTM: `utm_source=frilo&utm_medium=banner&utm_campaign={pagina}-{variante}` (esto lo ve el banco, no GTM).

## 4. Qué crear en GTM (en un espacio de trabajo NUEVO)
Nombre del espacio de trabajo: `eventos-frilo-oct-2026`. **No publicar**; Nicolás revisa en vista previa y publica.

**Antes de crear:** listar las etiquetas, disparadores y variables que ya existen en `GTM-NPF6MT3S` y **no duplicar** nada. Si ya hay una etiqueta de configuración de Google (GA4), reutilizarla.

### 4.1 Variables de capa de datos (versión 2)
Crear cuatro variables «Variable de capa de datos»: `dlv - pagina` (clave `pagina`), `dlv - variante` (`variante`), `dlv - metodo` (`metodo`), `dlv - entidad` (`entidad`). Valor por defecto: vacío.

### 4.2 Etiqueta de configuración (si no existe)
- Tipo: **Etiqueta de Google (Google tag)**, ID de etiqueta `G-…` (el de la propiedad GA4 de Frilo).
- Disparador: **All Pages** (Inicialización).
- Consentimiento adicional requerido: `analytics_storage`.

### 4.3 Disparadores (tipo «Evento personalizado», coincidencia exacta)
`ce - signup_start`, `ce - signup_complete`, `ce - calc_result`, `ce - bank_click`.

### 4.4 Cuatro etiquetas «Evento de GA4»
Todas con consentimiento adicional `analytics_storage` y la etiqueta de configuración del punto 4.2 como referencia.

| Etiqueta | Nombre del evento | Parámetros del evento | Disparador |
|---|---|---|---|
| `GA4 - signup_start` | `signup_start` | `pagina`, `variante`, `metodo` | `ce - signup_start` |
| `GA4 - signup_complete` | `signup_complete` | `pagina`, `variante`, `metodo` | `ce - signup_complete` |
| `GA4 - calc_result` | `calc_result` | `pagina` | `ce - calc_result` |
| `GA4 - bank_click` | `bank_click` | `entidad`, `pagina` | `ce - bank_click` |

## 5. Qué debe hacer Nicolás en GA4 (no hay conector para esto)
1. Admin → Definiciones personalizadas → crear 4 **dimensiones de alcance «Evento»**: `variante`, `metodo`, `entidad`, `pagina`.
2. Admin → Eventos → marcar como **evento clave**: `signup_complete` y `bank_click`.
3. Admin → Recopilación de datos: **desactivar** señales de Google y uso compartido de datos; retención de datos de eventos **14 meses**.
4. Informes sugeridos: embudo `calc_result` → `signup_start` → `signup_complete` por `pagina`; `bank_click` por `entidad`.

## 6. Cómo verificar (lo hace Nicolás)
1. En GTM, abrir **Vista previa** (Tag Assistant) con `https://frilo.dev`.
2. **Aceptar** el aviso de cookies (sin aceptar, GTM no carga).
3. Usar una calculadora (debe salir `calc_result` una vez), pulsar un enlace de banco (`bank_click` con `entidad`) y pedir un código de registro en un banner (`signup_start`).
4. Confirmar en GA4 → Informes → Tiempo real que llegan los eventos con sus parámetros.
5. Solo entonces **publicar** la versión del contenedor, con una descripción clara.

## 7. Mejoras pendientes (requieren cambiar el código del sitio; NO crearlas en GTM todavía)
- `banner_view`: visibilidad de cada banner (para tasa de clic), con `variante` y `pagina`.
- Enviar `variante` en `bank_click`.
- `cta_click` para los botones «Probar la app» (hoy van a `app.frilo.dev` sin evento).
- Medir el registro con Google en `/bienvenida` de la app.

Cuando Nicolás quiera alguna, se pide a Claude Code (que edita el repositorio) y después se crea su etiqueta en GTM.

## 8. Reglas de trabajo
- Español de Colombia en nombres descriptivos y notas.
- No inventar IDs (`G-…`, cuentas, contenedores): leerlos de GTM o preguntar.
- No publicar versiones ni borrar etiquetas existentes sin confirmación expresa de Nicolás.
- Después de crear todo, entregar un resumen: qué se creó (nombres y tipos), qué ya existía y se reutilizó, y qué debe revisar Nicolás en vista previa.
