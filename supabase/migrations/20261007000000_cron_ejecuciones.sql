-- Una fila por cada ejecución de la tarea diaria (TRM + alertas). Sin datos personales.
-- Sirve para saber cuándo corrió y qué hizo, sin depender de los logs de Vercel (el plan Hobby guarda 1 hora).
create table public.cron_ejecuciones (
  id bigint generated always as identity primary key,
  ejecutada_en timestamptz not null default now(),
  fecha date not null,
  ok boolean not null,
  trm_hoy numeric(12, 2),
  trm_sincronizada boolean not null default false,
  trm_guardadas integer not null default 0,
  error_trm text,
  alertas_activas integer not null default 0,
  referencias_actualizadas integer not null default 0,
  disparadas integer not null default 0,
  correos_enviados integer not null default 0,
  correos_fallidos integer not null default 0,
  duracion_ms integer,
  error text
);
create index on public.cron_ejecuciones (ejecutada_en desc);

-- Solo el servidor (service role, que ignora el RLS) la lee y la escribe: ningún usuario la ve.
alter table public.cron_ejecuciones enable row level security;
create policy sin_acceso_de_usuarios on public.cron_ejecuciones for all to anon, authenticated using (false) with check (false);
