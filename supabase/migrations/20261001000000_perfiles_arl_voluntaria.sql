-- La ARL voluntaria es una preferencia del usuario sobre su cálculo.
alter table public.perfiles add column arl_voluntaria boolean not null default false;
