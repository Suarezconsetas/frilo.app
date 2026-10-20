# Sitio de contenido SEO de Frilo (documentos de diseño)

Material de referencia para construir el sitio de contenido (próxima fase). **No es código de la app y no se despliega.**

| Archivo | Qué es |
|---|---|
| `Brief_Claude_Code_Frilo_v2.md` | Brief principal: parámetros, cuentas de ahorro, recordatorio de planilla, ambientes y reglas de publicación (sección 9). |
| `Especificacion_SEO_sitio_Frilo_v2.md` | Metadatos, JSON-LD, enlazado interno y reglas SEO por página. |
| `URLs_SEO_sitio_Frilo.xlsx` | Inventario de URLs: title, meta description, H1, keyword objetivo y JSON-LD de cada página (fuente única de metadatos). |
| `Wireframes_sitio_Frilo/` | Wireframes aprobados (copy final); ver su `LEEME.md`. |

Versión de los documentos: 20 de octubre de 2026. Si hay diferencias con lo que hace la app hoy, mandan las decisiones registradas en el chat y en `CLAUDE.md`.

## Cambios hechos a los wireframes después de aprobarlos (21 de octubre de 2026)

Los wireframes de `Wireframes_sitio_Frilo/` se editaron para resolver pendientes y alinearse con las decisiones del proyecto:

- **Guia.dc.html (P12):** se redactaron los tres párrafos pendientes sobre qué recibe un empleado con contrato laboral y por qué la prestación de servicios no las incluye. Redactados por Claude; falta la revisión del equipo de finanzas.
- **GlosarioSLN.dc.html (P06):** la tabla de siglas ahora sigue el glosario oficial de la Resolución 2388 de 2016 (Anexo Técnico 1).
- **Main.dc.html (Home):** las tres capturas de la app reemplazan los marcadores (`apps/web/public/capturas/`).
- **Calculadora, Cesantias y GuiaIBC:** se agregó el Decreto 159 de 2026 (salario mínimo transitorio) a las fuentes.
- **CuentasRentables.dc.html (P11):** el rango de tasas sin condiciones ahora es 5% a 11% (Ualá paga 5% sin condiciones).

Otras correcciones de copy (16,67%, ejemplos de P10, "Decretos 1469 de 2025 y 0159 de 2026") viven en `apps/web/content/reemplazos.json`.
