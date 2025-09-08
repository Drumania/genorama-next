-- Script de migración adaptativo que se ajusta a la estructura real de las tablas
-- Primero verifica qué columnas existen y luego migra solo las que están disponibles

-- 1. Verificar qué columnas tiene realmente la tabla users
DO $$ 
DECLARE
    col_exists boolean;
BEGIN
    -- Verificar si la columna genres existe en users
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'genres'
    ) INTO col_exists;
    
    -- Si no existe, agregarla
    IF NOT col_exists THEN
        ALTER TABLE public.users ADD COLUMN genres text[];
    END IF;
    
    -- Verificar si la columna location existe en users
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'location'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE public.users ADD COLUMN location text;
    END IF;
    
    -- Verificar si la columna date_of_birth existe en users
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'date_of_birth'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE public.users ADD COLUMN date_of_birth date;
    END IF;
    
    -- Verificar si la columna email existe en users
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'email'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE public.users ADD COLUMN email text;
    END IF;
END $$;

-- 2. Verificar qué columnas tiene realmente la tabla bands
DO $$ 
DECLARE
    col_exists boolean;
BEGIN
    -- Verificar columnas en bands
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bands' AND column_name = 'cover_image_url'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE public.bands ADD COLUMN cover_image_url text;
    END IF;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bands' AND column_name = 'website_url'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE public.bands ADD COLUMN website_url text;
    END IF;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bands' AND column_name = 'spotify_url'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE public.bands ADD COLUMN spotify_url text;
    END IF;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bands' AND column_name = 'youtube_url'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE public.bands ADD COLUMN youtube_url text;
    END IF;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bands' AND column_name = 'instagram_url'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE public.bands ADD COLUMN instagram_url text;
    END IF;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bands' AND column_name = 'location'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE public.bands ADD COLUMN location text;
    END IF;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bands' AND column_name = 'genres'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE public.bands ADD COLUMN genres text[];
    END IF;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bands' AND column_name = 'founded_date'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE public.bands ADD COLUMN founded_date date;
    END IF;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bands' AND column_name = 'is_active'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE public.bands ADD COLUMN is_active boolean DEFAULT true;
    END IF;
END $$;

-- 3. Migrar usuarios existentes (solo las columnas que existen)
INSERT INTO public.users (
  id, username, display_name, bio, avatar_url, created_at, updated_at
)
SELECT 
  id, username, display_name, bio, avatar_url, created_at, updated_at
FROM public.profiles 
WHERE is_band = false OR is_band IS NULL
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = NOW();

-- 4. Migrar bandas existentes (solo las columnas que existen)
INSERT INTO public.bands (
  id, name, username, description, avatar_url, created_at, updated_at
)
SELECT 
  id, display_name AS name, username, bio AS description, avatar_url, created_at, updated_at
FROM public.profiles 
WHERE is_band = true
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  username = EXCLUDED.username,
  description = EXCLUDED.description,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = NOW();

-- 5. Crear relaciones usuario-banda para usuarios que tenían bandas
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

-- 6. Crear preferencias por defecto para usuarios existentes
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

-- 7. Crear vistas útiles para consultas comunes
CREATE OR REPLACE VIEW public.user_bands_view AS
SELECT 
  u.id AS user_id,
  u.username AS user_username,
  u.display_name AS user_display_name,
  u.avatar_url AS user_avatar_url,
  b.id AS band_id,
  b.name AS band_name,
  b.username AS band_username,
  b.avatar_url AS band_avatar_url,
  ub.role,
  ub.joined_date,
  ub.is_active
FROM public.users u
JOIN public.user_bands ub ON u.id = ub.user_id
JOIN public.bands b ON ub.band_id = b.id
WHERE ub.is_active = true;

-- Vista para obtener todas las bandas de un usuario
CREATE OR REPLACE VIEW public.user_bands_summary AS
SELECT 
  u.id AS user_id,
  u.username AS user_username,
  u.display_name AS user_display_name,
  COALESCE(
    array_agg(
      json_build_object(
        'id', b.id,
        'name', b.name,
        'username', b.username,
        'avatar_url', b.avatar_url,
        'role', ub.role
      )
    ) FILTER (WHERE b.id IS NOT NULL),
    '{}'::json[]
  ) AS bands
FROM public.users u
LEFT JOIN public.user_bands ub ON u.id = ub.user_id AND ub.is_active = true
LEFT JOIN public.bands b ON ub.band_id = b.id
GROUP BY u.id, u.username, u.display_name;

-- Vista para obtener estadísticas de usuario
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
  u.id,
  u.username,
  u.display_name,
  COUNT(DISTINCT ub.band_id) AS band_count,
  COUNT(DISTINCT bf.band_id) AS following_count,
  COUNT(DISTINCT ua.id) AS activity_count
FROM public.users u
LEFT JOIN public.user_bands ub ON u.id = ub.user_id AND ub.is_active = true
LEFT JOIN public.band_followers bf ON u.id = bf.user_id
LEFT JOIN public.user_activity ua ON u.id = ua.user_id
GROUP BY u.id, u.username, u.display_name;

-- 8. Verificar la migración
SELECT 'Users migrated:' AS info, COUNT(*) AS count FROM public.users;
SELECT 'Bands migrated:' AS info, COUNT(*) AS count FROM public.bands;
SELECT 'User-Band relationships:' AS info, COUNT(*) AS count FROM public.user_bands;
SELECT 'User preferences created:' AS info, COUNT(*) AS count FROM public.user_preferences;

-- 9. Mostrar algunos ejemplos de datos migrados
SELECT 'Sample users:' AS info, '' AS data;
SELECT username, display_name FROM public.users LIMIT 3;

SELECT 'Sample bands:' AS info, '' AS data;
SELECT name, username FROM public.bands LIMIT 3;

-- 10. Mostrar la estructura final de las tablas
SELECT 'Final table structure:' AS info, '' AS data;

SELECT 'Users table columns:' AS info, '' AS data;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public' 
ORDER BY ordinal_position;

SELECT 'Bands table columns:' AS info, '' AS data;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'bands' AND table_schema = 'public' 
ORDER BY ordinal_position;

-- 11. Mensaje de confirmación
SELECT 'Migration completed successfully!' AS status;
