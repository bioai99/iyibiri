-- Email kolonu ekle
alter table public.profiles
  add column if not exists email text;

-- Mevcut kullanıcıların emaillerini auth.users'dan kopyala
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

-- Yeni kullanıcı oluşturulduğunda email de kaydedilsin
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$;
