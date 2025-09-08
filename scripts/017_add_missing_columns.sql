-- Script para agregar columnas faltantes a las tablas existentes
-- Ejecuta esto si las tablas ya existen pero les faltan columnas

-- Agregar columnas faltantes a la tabla users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS website_url text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS date_of_birth date;

-- Agregar columnas faltantes a la tabla bands
ALTER TABLE public.bands 
ADD COLUMN IF NOT EXISTS cover_image_url text,
ADD COLUMN IF NOT EXISTS website_url text,
ADD COLUMN IF NOT EXISTS spotify_url text,
ADD COLUMN IF NOT EXISTS youtube_url text,
ADD COLUMN IF NOT EXISTS instagram_url text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS genres text[],
ADD COLUMN IF NOT EXISTS founded_date date,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Verificar la estructura actualizada
SELECT 
    'users' AS table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 
    'bands' AS table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'bands' 
AND table_schema = 'public'
ORDER BY ordinal_position;
