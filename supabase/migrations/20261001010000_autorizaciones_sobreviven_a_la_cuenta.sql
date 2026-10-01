-- La prueba de las autorizaciones se conserva aunque la persona elimine su cuenta (Ley 1581 de 2012):
-- se quita la clave foránea (el uuid queda como identificador seudónimo) y se guarda un hash del correo,
-- no el correo, para poder acreditar quién autorizó sin conservar el dato personal.
alter table public.autorizaciones drop constraint autorizaciones_usuario_id_fkey;
alter table public.autorizaciones add column correo_hash text;

create function public.autorizaciones_correo_hash() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  select encode(sha256(convert_to(lower(u.email), 'UTF8')), 'hex') into new.correo_hash
  from auth.users u where u.id = new.usuario_id;
  return new;
end $$;
revoke execute on function public.autorizaciones_correo_hash() from public, anon, authenticated;

create trigger autorizaciones_hash before insert on public.autorizaciones
  for each row execute function public.autorizaciones_correo_hash();

update public.autorizaciones a
set correo_hash = encode(sha256(convert_to(lower(u.email), 'UTF8')), 'hex')
from auth.users u
where u.id = a.usuario_id and a.correo_hash is null;
