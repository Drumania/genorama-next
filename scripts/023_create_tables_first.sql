-- Script que crea todas las tablas necesarias desde cero
-- Luego migra los datos existentes

-- 1. Crear tabla users
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username text UNIQUE NOT NULL,
    display_name text NOT NULL,
    email text,
    bio text,
    avatar_url text,
    location text,
    date_of_birth date,
    genres text[],
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

-- 2. Crear tabla bands
CREATE TABLE IF NOT EXISTS public.bands (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    username text UNIQUE NOT NULL,
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
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

-- 3. Crear tabla user_bands (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS public.user_bands (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    band_id uuid NOT NULL REFERENCES public.bands(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'member',
    joined_date timestamp with time zone DEFAULT NOW(),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW(),
    UNIQUE(user_id, band_id)
);

-- 4. Crear tabla band_followers
CREATE TABLE IF NOT EXISTS public.band_followers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    band_id uuid NOT NULL REFERENCES public.bands(id) ON DELETE CASCADE,
    followed_at timestamp with time zone DEFAULT NOW(),
    UNIQUE(user_id, band_id)
);

-- 5. Crear tabla user_activity
CREATE TABLE IF NOT EXISTS public.user_activity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    activity_type text NOT NULL,
    activity_data jsonb,
    created_at timestamp with time zone DEFAULT NOW()
);

-- 6. Crear tabla user_preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    email_notifications boolean DEFAULT true,
    push_notifications boolean DEFAULT true,
    privacy_level text DEFAULT 'public',
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

-- 7. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_bands_username ON public.bands(username);
CREATE INDEX IF NOT EXISTS idx_user_bands_user_id ON public.user_bands(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bands_band_id ON public.user_bands(band_id);
CREATE INDEX IF NOT EXISTS idx_band_followers_user_id ON public.band_followers(user_id);
CREATE INDEX IF NOT EXISTS idx_band_followers_band_id ON public.band_followers(band_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);

-- 8. Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.band_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- 9. Crear políticas RLS para users
DROP POLICY IF EXISTS "users_select_all" ON public.users;
CREATE POLICY "users_select_all" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "users_insert_own" ON public.users;
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_delete_own" ON public.users;
CREATE POLICY "users_delete_own" ON public.users FOR DELETE USING (auth.uid() = id);

-- 10. Crear políticas RLS para bands
DROP POLICY IF EXISTS "bands_select_all" ON public.bands;
CREATE POLICY "bands_select_all" ON public.bands FOR SELECT USING (true);

DROP POLICY IF EXISTS "bands_insert_own" ON public.bands;
CREATE POLICY "bands_insert_own" ON public.bands FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "bands_update_own" ON public.bands;
CREATE POLICY "bands_update_own" ON public.bands FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "bands_delete_own" ON public.bands;
CREATE POLICY "bands_delete_own" ON public.bands FOR DELETE USING (auth.uid() = id);

-- 11. Crear políticas RLS para user_bands
DROP POLICY IF EXISTS "user_bands_select_own" ON public.user_bands;
CREATE POLICY "user_bands_select_own" ON public.user_bands FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT user_id FROM public.user_bands WHERE band_id = user_bands.band_id)
);

DROP POLICY IF EXISTS "user_bands_insert_own" ON public.user_bands;
CREATE POLICY "user_bands_insert_own" ON public.user_bands FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT user_id FROM public.user_bands WHERE band_id = user_bands.band_id AND role = 'owner')
);

DROP POLICY IF EXISTS "user_bands_update_own" ON public.user_bands;
CREATE POLICY "user_bands_update_own" ON public.user_bands FOR UPDATE USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT user_id FROM public.user_bands WHERE band_id = user_bands.band_id AND role = 'owner')
);

DROP POLICY IF EXISTS "user_bands_delete_own" ON public.user_bands;
CREATE POLICY "user_bands_delete_own" ON public.user_bands FOR DELETE USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT user_id FROM public.user_bands WHERE band_id = user_bands.band_id AND role = 'owner')
);

-- 12. Crear políticas RLS para band_followers
DROP POLICY IF EXISTS "band_followers_select_all" ON public.band_followers;
CREATE POLICY "band_followers_select_all" ON public.band_followers FOR SELECT USING (true);

DROP POLICY IF EXISTS "band_followers_insert_own" ON public.band_followers;
CREATE POLICY "band_followers_insert_own" ON public.band_followers FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "band_followers_delete_own" ON public.band_followers;
CREATE POLICY "band_followers_delete_own" ON public.band_followers FOR DELETE USING (auth.uid() = user_id);

-- 13. Crear políticas RLS para user_activity
DROP POLICY IF EXISTS "user_activity_select_own" ON public.user_activity;
CREATE POLICY "user_activity_select_own" ON public.user_activity FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_activity_insert_own" ON public.user_activity;
CREATE POLICY "user_activity_insert_own" ON public.user_activity FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 14. Crear políticas RLS para user_preferences
DROP POLICY IF EXISTS "user_preferences_select_own" ON public.user_preferences;
CREATE POLICY "user_preferences_select_own" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_preferences_insert_own" ON public.user_preferences;
CREATE POLICY "user_preferences_insert_own" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_preferences_update_own" ON public.user_preferences;
CREATE POLICY "user_preferences_update_own" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- 15. Migrar datos existentes desde profiles
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

-- 16. Migrar bandas existentes
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

-- 17. Crear relaciones usuario-banda para usuarios que tenían bandas
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

-- 18. Crear preferencias por defecto para usuarios existentes
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

-- 19. Crear vistas útiles
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

-- 20. Verificar la migración
SELECT 'Tables created successfully!' AS status;
SELECT 'Users migrated:' AS info, COUNT(*) AS count FROM public.users;
SELECT 'Bands migrated:' AS info, COUNT(*) AS count FROM public.bands;
SELECT 'User-Band relationships:' AS info, COUNT(*) AS count FROM public.user_bands;
SELECT 'User preferences created:' AS info, COUNT(*) AS count FROM public.user_preferences;

-- 21. Mostrar estructura final
SELECT 'Final table structure:' AS info, '' AS data;
SELECT 'Users table columns:' AS info, '' AS data;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public' 
ORDER BY ordinal_position;

SELECT 'Bands table columns:' AS info, '' AS data;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'bands' AND table_schema = 'public' 
ORDER BY ordinal_position;

-- 22. Mensaje final
SELECT '🎉 Migration completed successfully! All tables created and data migrated!' AS final_status;
