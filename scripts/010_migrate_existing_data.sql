-- Script de migración para mover datos existentes
-- de la tabla profiles a la nueva estructura de usuarios y bandas

-- 1. Migrar usuarios existentes (personas que no son bandas)
insert into public.users (
  id, username, display_name, bio, avatar_url, website_url, 
  spotify_url, youtube_url, instagram_url, location, genres, created_at, updated_at
)
select 
  id, username, display_name, bio, avatar_url, website_url,
  spotify_url, youtube_url, instagram_url, location, genres, created_at, updated_at
from public.profiles 
where is_band = false or is_band is null;

-- 2. Migrar bandas existentes
insert into public.bands (
  id, name, username, description, avatar_url, website_url,
  spotify_url, youtube_url, instagram_url, location, genres, created_at, updated_at
)
select 
  id, display_name as name, username, bio as description, avatar_url, website_url,
  spotify_url, youtube_url, instagram_url, location, genres, created_at, updated_at
from public.profiles 
where is_band = true;

-- 3. Crear relaciones usuario-banda para usuarios que tenían bandas
-- (asumiendo que el usuario es el propietario de su perfil de banda)
insert into public.user_bands (user_id, band_id, role, joined_date, is_active, created_at)
select 
  p.id as user_id,
  p.id as band_id,
  'owner' as role,
  p.created_at as joined_date,
  true as is_active,
  p.created_at
from public.profiles p
where p.is_band = true;

-- 4. Crear preferencias por defecto para usuarios existentes
insert into public.user_preferences (user_id, email_notifications, push_notifications, privacy_level, created_at, updated_at)
select 
  id,
  true as email_notifications,
  true as push_notifications,
  'public' as privacy_level,
  created_at,
  updated_at
from public.users
on conflict (user_id) do nothing;

-- 5. Actualizar referencias en otras tablas
-- Nota: Esto dependerá de cómo estén estructuradas las otras tablas
-- Por ejemplo, si releases.artist_id apunta a profiles.id, necesitarás actualizarlo

-- 6. Crear índices adicionales para mejorar el rendimiento
create index if not exists idx_users_username on public.users(username);
create index if not exists idx_bands_username on public.bands(username);
create index if not exists idx_bands_name on public.bands(name);
create index if not exists idx_user_activity_target on public.user_activity(target_id, target_type);

-- 7. Crear vistas útiles para consultas comunes
create or replace view public.user_bands_view as
select 
  u.id as user_id,
  u.username as user_username,
  u.display_name as user_display_name,
  u.avatar_url as user_avatar_url,
  b.id as band_id,
  b.name as band_name,
  b.username as band_username,
  b.avatar_url as band_avatar_url,
  ub.role,
  ub.joined_date,
  ub.is_active
from public.users u
join public.user_bands ub on u.id = ub.user_id
join public.bands b on ub.band_id = b.id
where ub.is_active = true;

-- Vista para obtener todas las bandas de un usuario
create or replace view public.user_bands_summary as
select 
  u.id as user_id,
  u.username as user_username,
  u.display_name as user_display_name,
  array_agg(json_build_object(
    'id', b.id,
    'name', b.name,
    'username', b.username,
    'avatar_url', b.avatar_url,
    'role', ub.role
  )) as bands
from public.users u
left join public.user_bands ub on u.id = ub.user_id and ub.is_active = true
left join public.bands b on ub.band_id = b.id
group by u.id, u.username, u.display_name;

-- Vista para obtener estadísticas de usuario
create or replace view public.user_stats as
select 
  u.id,
  u.username,
  u.display_name,
  count(distinct ub.band_id) as band_count,
  count(distinct bf.band_id) as following_count,
  count(distinct ua.id) as activity_count
from public.users u
left join public.user_bands ub on u.id = ub.user_id and ub.is_active = true
left join public.band_followers bf on u.id = bf.user_id
left join public.user_activity ua on u.id = ua.user_id
group by u.id, u.username, u.display_name;
