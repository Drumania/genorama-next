-- Script para verificar la estructura actual de las tablas
-- Ejecuta esto primero para ver qué columnas existen realmente

-- Verificar estructura de la tabla users
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar estructura de la tabla bands
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'bands' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar si las tablas existen
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'bands', 'user_bands', 'band_followers', 'user_activity', 'user_preferences');

-- Verificar datos en profiles (tabla original)
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
