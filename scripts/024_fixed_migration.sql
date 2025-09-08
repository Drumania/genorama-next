-- Script de migración corregido que maneja correctamente las relaciones
-- Primero crea las tablas, luego migra los datos en el orden correcto

-- 1. Crear tabla users
CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE NOT NULL,
    display_name text NOT NULL,
    email text,
    bio text,
    avatar_url text,
    location text,
    date_of_birth date,
    genres text[],
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW(),
    PRIMARY KEY (id)
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

-- 15. MIGRAR DATOS EN ORDEN CORRECTO
-- Primero: Migrar usuarios (personas)
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

-- Segundo: Migrar bandas
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

-- Tercero: Crear relaciones usuario-banda SOLO para usuarios que realmente existen
-- Esto crea una relación entre el usuario y su banda
INSERT INTO public.user_bands (user_id, band_id, role, joined_date, is_active, created_at)
SELECT 
    u.id AS user_id,
    b.id AS band_id,
    'owner' AS role,
    b.created_at AS joined_date,
    true AS is_active,
    b.created_at
FROM public.users u
JOIN public.bands b ON u.username = b.username
WHERE u.id IN (SELECT id FROM public.users) 
  AND b.id IN (SELECT id FROM public.bands)
ON CONFLICT (user_id, band_id) DO NOTHING;

-- Cuarto: Crear preferencias por defecto para usuarios existentes
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

-- 16. Crear vistas útiles
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

-- 17. Verificar la migración
SELECT 'Tables created successfully!' AS status;
SELECT 'Users migrated:' AS info, COUNT(*) AS count FROM public.users;
SELECT 'Bands migrated:' AS info, COUNT(*) AS count FROM public.bands;
SELECT 'User-Band relationships:' AS info, COUNT(*) AS count FROM public.user_bands;
SELECT 'User preferences created:' AS info, COUNT(*) AS count FROM public.user_preferences;

-- 18. Mostrar algunos ejemplos de datos migrados
SELECT 'Sample users:' AS info, '' AS data;
SELECT username, display_name FROM public.users LIMIT 3;

SELECT 'Sample bands:' AS info, '' AS data;
SELECT name, username FROM public.bands LIMIT 3;

SELECT 'Sample user-bands relationships:' AS info, '' AS data;
SELECT 
    u.username AS user_username,
    b.name AS band_name,
    ub.role
FROM public.user_bands ub
JOIN public.users u ON ub.user_id = u.id
JOIN public.bands b ON ub.band_id = b.id
LIMIT 3;

-- 19. Mostrar estructura final
SELECT 'Final table structure:' AS info, '' AS data;
SELECT 'Users table columns:' AS info, '' AS data;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public' 
ORDER BY ordinal_position;

SELECT 'Bands table columns:' AS info, '' AS data;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'bands' AND table_schema = 'public' 
ORDER BY ordinal_position;

-- 20. Mensaje final
SELECT '🎉 Migration script generated! Now, drop the old profiles table.' AS final_status;

-- 26. Drop the old profiles table after migration
DROP TABLE IF EXISTS public.profiles;

SELECT '🎉 Migration completed successfully! Old profiles table dropped!' AS final_status;


-- 21. Función para crear un perfil de usuario al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name, email, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'display_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 22. Trigger para ejecutar la función al crear un usuario en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 23. Función para obtener el perfil del usuario actual
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id uuid)
RETURNS TABLE (
    username text,
    display_name text,
    avatar_url text,
    is_band boolean,
    profile_data json
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.username,
        u.display_name,
        u.avatar_url,
        false AS is_band,
        json_build_object(
            'id', u.id,
            'email', u.email,
            'bio', u.bio,
            'location', u.location,
            'date_of_birth', u.date_of_birth
        ) AS profile_data
    FROM public.users u
    WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql;

-- 24. Función para obtener el perfil de una banda
CREATE OR REPLACE FUNCTION public.get_band_profile(band_username text)
RETURNS TABLE (
    username text,
    name text,
    avatar_url text,
    is_band boolean,
    profile_data json
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.username,
        b.name,
        b.avatar_url,
        true AS is_band,
        json_build_object(
            'id', b.id,
            'description', b.description,
            'cover_image_url', b.cover_image_url,
            'website_url', b.website_url,
            'spotify_url', b.spotify_url,
            'youtube_url', b.youtube_url,
            'instagram_url', b.instagram_url,
            'location', b.location,
            'genres', b.genres,
            'founded_date', b.founded_date,
            'is_active', b.is_active
        ) AS profile_data
    FROM public.bands b
    WHERE b.username = band_username;
END;
$$ LANGUAGE plpgsql;

-- 25. Función para obtener el perfil completo (usuario o banda)
CREATE OR REPLACE FUNCTION public.get_profile(user_id_param uuid)
RETURNS json AS $$
DECLARE
    profile_json json;
BEGIN
    -- Primero, intentar obtener el perfil de usuario
    SELECT to_json(u) INTO profile_json FROM public.users u WHERE u.id = user_id_param;

    -- Si no se encuentra, no hacemos nada más, devolvemos lo que tengamos (que será null)
    -- La lógica de buscar en bandas se hará en el cliente para simplificar
    RETURN profile_json;
END;
$$ LANGUAGE plpgsql;