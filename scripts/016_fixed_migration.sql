-- Script de migración corregido que se adapta a la estructura real
-- Ejecuta DESPUÉS de verificar la estructura con 015_check_table_structure.sql

-- 1. Migrar usuarios existentes (personas que no son bandas)
-- Solo incluir las columnas que realmente existen
INSERT INTO public.users (
  id, username, display_name, bio, avatar_url, created_at, updated_at
)
SELECT 
  id, username, display_name, bio, avatar_url, created_at, updated_at
FROM public.profiles 
WHERE is_band = false OR is_band IS NULL
ON CONFLICT (id) DO NOTHING;

-- 2. Migrar bandas existentes
-- Solo incluir las columnas que realmente existen
INSERT INTO public.bands (
  id, name, username, description, avatar_url, created_at, updated_at
)
SELECT 
  id, display_name AS name, username, bio AS description, avatar_url, created_at, updated_at
FROM public.profiles 
WHERE is_band = true
ON CONFLICT (id) DO NOTHING;

-- 3. Crear relaciones usuario-banda para usuarios que tenían bandas
-- (asumiendo que el usuario es el propietario de su perfil de banda)
INSERT INTO public.user_bands (user_id, band_id, role, joined_date, is_active, created_at)
SELECT 
  p.id AS user_id,
  p.id AS band_id,
  'owner' AS role,
  p.created_at AS joined_date,
  true AS is_active,
  p.created_at
FROM public.profiles p
WHERE p.is_band = true
ON CONFLICT (user_id, band_id) DO NOTHING;

-- 4. Crear preferencias por defecto para usuarios existentes
INSERT INTO public.user_preferences (user_id, email_notifications, push_notifications, privacy_level, created_at, updated_at)
SELECT 
  id,
  true AS email_notifications,
  true AS push_notifications,
  'public' AS privacy_level,
  created_at,
  updated_at
FROM public.users
ON CONFLICT (user_id) DO NOTHING;

-- 5. Verificar la migración
SELECT 
  'Users migrated:' AS info,
  COUNT(*) AS count
FROM public.users
UNION ALL
SELECT 
  'Bands migrated:' AS info,
  COUNT(*) AS count
FROM public.bands
UNION ALL
SELECT 
  'User-Band relationships:' AS info,
  COUNT(*) AS count
FROM public.user_bands;
