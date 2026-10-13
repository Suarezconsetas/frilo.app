-- Agrega la tarea del recordatorio mensual a las que registra cron_ejecuciones.
alter table public.cron_ejecuciones drop constraint cron_ejecuciones_tarea_check;
alter table public.cron_ejecuciones add constraint cron_ejecuciones_tarea_check check (tarea in ('trm', 'resumen', 'recordatorio'));
