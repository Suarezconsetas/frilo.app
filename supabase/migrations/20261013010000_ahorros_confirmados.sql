-- Lo que la persona confirma que apartó de su prima y cesantías, mes a mes. Es una declaración suya: Frilo no ve sus cuentas.
create table public.ahorros_confirmados (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  mes text not null check (mes ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  monto numeric(16, 2) not null check (monto >= 0),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (usuario_id, mes)
);

alter table public.ahorros_confirmados enable row level security;
create policy ahorros_propios on public.ahorros_confirmados for all
  using (usuario_id = (select auth.uid()))
  with check (usuario_id = (select auth.uid()));
