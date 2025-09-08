-- Script de migración simple para crear las tablas básicas
-- Este script no rompe la funcionalidad existente

-- 1. Crear tabla de usuarios (personas)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  email text,
  bio text,
  avatar_url text,
  website_url text,
  location text,
  date_of_birth date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Crear tabla de bandas
create table if not exists public.bands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  username text unique not null,
  description text,
  avatar_url text,
  cover_image_url text,
  website_url text,
  spotify_url text,
  youtube_url text,
  instagram_url text,
  location text,
  genres text[],
  founded_date date,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Crear tabla de relación usuario-banda
create table if not exists public.user_bands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  band_id uuid not null references public.bands(id) on delete cascade,
  role text not null check (role in ('owner', 'member', 'admin')),
  joined_date timestamp with time zone default timezone('utc'::text, now()) not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, band_id)
);

-- 4. Crear tabla de seguidores de bandas
create table if not exists public.band_followers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  band_id uuid not null references public.bands(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, band_id)
);

-- 5. Crear tabla de actividad de usuarios
create table if not exists public.user_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  activity_type text not null check (activity_type in ('post_created', 'comment_made', 'donation_made', 'event_attended', 'band_joined')),
  target_id uuid,
  target_type text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Crear tabla de preferencias de usuario
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade unique,
  email_notifications boolean default true,
  push_notifications boolean default true,
  privacy_level text default 'public' check (privacy_level in ('public', 'friends', 'private')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS en todas las tablas
alter table public.users enable row level security;
alter table public.bands enable row level security;
alter table public.user_bands enable row level security;
alter table public.band_followers enable row level security;
alter table public.user_activity enable row level security;
alter table public.user_preferences enable row level security;

-- Políticas RLS básicas
create policy "users_select_all" on public.users for select using (true);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);

create policy "bands_select_all" on public.bands for select using (true);
create policy "bands_insert_all" on public.bands for insert with check (true);
create policy "bands_update_all" on public.bands for update using (true);

create policy "user_bands_select_all" on public.user_bands for select using (true);
create policy "user_bands_insert_all" on public.user_bands for insert with check (true);

create policy "band_followers_select_all" on public.band_followers for select using (true);
create policy "band_followers_insert_all" on public.band_followers for insert with check (true);

create policy "user_activity_select_all" on public.user_activity for select using (true);
create policy "user_activity_insert_all" on public.user_activity for insert with check (true);

create policy "user_preferences_select_own" on public.user_preferences for select using (auth.uid() = user_id);
create policy "user_preferences_insert_all" on public.user_preferences for insert with check (true);

-- Crear índices básicos
create index if not exists idx_users_username on public.users(username);
create index if not exists idx_bands_username on public.bands(username);
create index if not exists idx_user_bands_user_id on public.user_bands(user_id);
create index if not exists idx_user_bands_band_id on public.user_bands(band_id);

-- Función para manejar nuevos usuarios (opcional)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Crear usuario en la nueva tabla
  insert into public.users (id, username, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data ->> 'display_name', 'Nuevo Usuario'),
    new.email
  )
  on conflict (id) do nothing;
  
  -- Crear preferencias por defecto
  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  
  return new;
end;
$$;

-- Crear trigger para nuevos usuarios (opcional)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
