-- Script de limpieza para eliminar las tablas de migración
-- ⚠️ ADVERTENCIA: Este script ELIMINARÁ todas las nuevas tablas
-- Solo usar si quieres empezar desde cero

-- Eliminar vistas primero
drop view if exists public.user_bands_view;
drop view if exists public.user_bands_summary;
drop view if exists public.user_stats;

-- Eliminar trigger
drop trigger if exists on_auth_user_created on auth.users;

-- Eliminar función
drop function if exists public.handle_new_user();

-- Eliminar tablas en orden (por las foreign keys)
drop table if exists public.user_activity cascade;
drop table if exists public.band_followers cascade;
drop table if exists public.user_bands cascade;
drop table if exists public.user_preferences cascade;
drop table if exists public.bands cascade;
drop table if exists public.users cascade;

-- Mensaje de confirmación
select 'Limpieza completada - todas las tablas de migración han sido eliminadas' as status;
