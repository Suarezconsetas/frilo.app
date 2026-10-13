-- Distingue qué tarea programada dejó cada fila: la diaria de TRM y alertas, o el resumen semanal.
alter table public.cron_ejecuciones add column tarea text not null default 'trm' check (tarea in ('trm', 'resumen'));
