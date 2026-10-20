-- Recordatorio de la fecha límite de pago de la planilla PILA.
-- Del documento solo se guardan los dos últimos dígitos, nunca el número completo.
alter table public.perfiles add column if not exists digitos_documento char(2) check (digitos_documento ~ '^[0-9]{2}$');
alter table public.perfiles add column if not exists recordatorio_planilla boolean not null default false;
alter table public.perfiles add column if not exists dias_anticipacion smallint not null default 3 check (dias_anticipacion between 0 and 5);

-- Qué recordatorios ya se enviaron (evita duplicados si la tarea corre dos veces).
create table if not exists public.recordatorios_enviados (
  user_id uuid not null references auth.users on delete cascade,
  periodo char(7) not null,
  tipo text not null check (tipo in ('previo', 'dia')),
  enviado_at timestamptz not null default now(),
  primary key (user_id, periodo, tipo)
);
alter table public.recordatorios_enviados enable row level security;
-- Sin políticas: solo la tarea programada (service role) lee y escribe.

alter table public.cron_ejecuciones drop constraint cron_ejecuciones_tarea_check;
alter table public.cron_ejecuciones add constraint cron_ejecuciones_tarea_check check (tarea in ('trm', 'resumen', 'recordatorio', 'guardarmes', 'planilla'));
