-- Día del mes en que le pagan a la persona (para avisarle ese día que guarde su mes)
-- y la nueva tarea 'guardarmes' en el registro de ejecuciones.
alter table public.perfiles add column if not exists dia_de_pago smallint check (dia_de_pago between 1 and 31);
alter table public.cron_ejecuciones drop constraint cron_ejecuciones_tarea_check;
alter table public.cron_ejecuciones add constraint cron_ejecuciones_tarea_check check (tarea in ('trm', 'resumen', 'recordatorio', 'guardarmes'));
