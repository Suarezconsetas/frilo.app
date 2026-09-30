-- Frilo · esquema inicial
-- Ley 1581 de 2012: cada usuario solo ve lo suyo (RLS). No se venden ni comparten datos.

-- ── Perfiles ─────────────────────────────────────────────────────────────
create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  correo text not null,
  nombre text,
  proveedor text not null default 'email' check (proveedor in ('email', 'google', 'apple')),
  creado_en timestamptz not null default now(),
  ciudad text,
  forma_de_pago text check (forma_de_pago in ('usd', 'cop', 'mixto')),
  rango_ingreso text, -- rango, nunca la cifra exacta
  clase_riesgo smallint check (clase_riesgo between 1 and 5)
);

-- ── Autorizaciones (prueba ante la SIC: solo se agregan filas, nunca se editan ni borran) ──
create table public.autorizaciones (
  id bigint generated always as identity primary key,
  usuario_id uuid not null references auth.users (id) on delete cascade,
  tipo text not null check (tipo in ('tratamiento_datos', 'marketing_frilo')),
  otorgada boolean not null,
  version_politica text not null,
  fecha timestamptz not null default now(),
  user_agent text
);
create index on public.autorizaciones (usuario_id, tipo, fecha desc);

-- ── Datos de la herramienta ──────────────────────────────────────────────
create table public.fuentes_ingreso (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  nombre text not null,
  moneda text not null check (moneda in ('USD', 'COP')),
  tipo_contrato text not null check (tipo_contrato in ('ops_mas_de_un_mes', 'ops_hasta_un_mes', 'cuenta_propia', 'exterior')),
  contratante text not null check (contratante in ('privado', 'publico', 'exterior')),
  creado_en timestamptz not null default now()
);
create index on public.fuentes_ingreso (usuario_id);

create table public.pagos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  fuente_id uuid not null references public.fuentes_ingreso (id) on delete cascade,
  mes text not null check (mes ~ '^\d{4}-(0[1-9]|1[0-2])$'), -- 'YYYY-MM'
  monto numeric(16, 2) not null check (monto >= 0),           -- moneda de la fuente, bruto sin IVA
  tasa_recibida numeric(12, 2) check (tasa_recibida > 0),     -- opcional, solo USD
  retencion_practicada numeric(16, 2) check (retencion_practicada >= 0), -- opcional, solo COP
  creado_en timestamptz not null default now()
);
create index on public.pagos (usuario_id, mes);

create table public.cobros (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  mes text not null check (mes ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  bolsillo text not null check (bolsillo in ('prima', 'cesantias')),
  creado_en timestamptz not null default now()
);
create index on public.cobros (usuario_id, bolsillo, mes);

create table public.alertas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  umbral numeric(12, 2) not null check (umbral > 0),
  direccion text not null check (direccion in ('sube', 'baja')),
  estado text not null default 'activa' check (estado in ('activa', 'disparada')),
  trm_referencia numeric(12, 2) not null,
  creado_en timestamptz not null default now()
);
create index on public.alertas (usuario_id, estado);

-- ── TRM diaria (la llena la tarea programada; nunca se consulta datos.gov.co por visita) ──
create table public.trm_diaria (
  vigenciadesde date primary key,
  vigenciahasta date not null,
  valor numeric(12, 2) not null check (valor > 0)
);

-- ── Perfil automático al registrarse ─────────────────────────────────────
create function public.crear_perfil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.perfiles (id, correo, nombre, proveedor)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    case when new.raw_app_meta_data ->> 'provider' = 'google' then 'google' else 'email' end
  );
  return new;
end $$;

create trigger al_crear_usuario after insert on auth.users
  for each row execute function public.crear_perfil();

-- ── Row Level Security ───────────────────────────────────────────────────
alter table public.perfiles enable row level security;
alter table public.autorizaciones enable row level security;
alter table public.fuentes_ingreso enable row level security;
alter table public.pagos enable row level security;
alter table public.cobros enable row level security;
alter table public.alertas enable row level security;
alter table public.trm_diaria enable row level security;

create policy perfiles_ver on public.perfiles for select using (id = auth.uid());
create policy perfiles_editar on public.perfiles for update using (id = auth.uid()) with check (id = auth.uid());

-- Autorizaciones: solo leer y agregar. Sin update ni delete.
create policy autorizaciones_ver on public.autorizaciones for select using (usuario_id = auth.uid());
create policy autorizaciones_agregar on public.autorizaciones for insert with check (usuario_id = auth.uid());

create policy fuentes_propias on public.fuentes_ingreso for all using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
create policy pagos_propios on public.pagos for all using (usuario_id = auth.uid())
  with check (usuario_id = auth.uid() and exists (select 1 from public.fuentes_ingreso f where f.id = fuente_id and f.usuario_id = auth.uid()));
create policy cobros_propios on public.cobros for all using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
create policy alertas_propias on public.alertas for all using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

-- TRM: lectura para usuarios con sesión; escribe solo la tarea (service role, que ignora RLS).
create policy trm_leer on public.trm_diaria for select to authenticated using (true);

-- Refuerzo: aunque falte una policy, las autorizaciones no se pueden editar ni borrar.
revoke update, delete on public.autorizaciones from anon, authenticated;
