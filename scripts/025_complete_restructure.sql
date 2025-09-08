-- Comprehensive migration script to restructure users, bands, and all dependent tables.
-- This script is designed to be run once and will replace the old profiles system.
-- Version 4: Refines RLS policies for the users table.

BEGIN;

-- Step 1: Create the new tables with the correct structure

CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE NOT NULL,
    display_name text NOT NULL,
    email text,
    bio text,
    avatar_url text,
    location text,
    date_of_birth date,
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

-- Step 1.5: Refine RLS policies for the new users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_select_all" ON public.users;
CREATE POLICY "users_select_all" ON public.users FOR SELECT TO authenticated USING (true);

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

CREATE TABLE IF NOT EXISTS public.user_bands (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    band_id uuid NOT NULL REFERENCES public.bands(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'member',
    joined_date timestamp with time zone DEFAULT NOW(),
    is_active boolean DEFAULT true,
    UNIQUE(user_id, band_id)
);

-- Step 2: Migrate data from the old 'profiles' table

INSERT INTO public.users (id, username, display_name, bio, avatar_url, created_at, updated_at)
SELECT id, username, display_name, bio, avatar_url, created_at, updated_at
FROM public.profiles
WHERE is_band = false OR is_band IS NULL
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.bands (id, name, username, description, avatar_url, created_at, updated_at)
SELECT id, display_name, username, bio, avatar_url, created_at, updated_at
FROM public.profiles
WHERE is_band = true
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_bands (user_id, band_id, role)
SELECT p.id, p.id, 'owner'
FROM public.profiles p
WHERE p.is_band = true AND EXISTS (SELECT 1 FROM public.users u WHERE u.id = p.id)
ON CONFLICT (user_id, band_id) DO NOTHING;


-- Step 3: Update dependent tables

-- 3.1: Update 'forum_posts'
ALTER TABLE public.forum_posts ADD COLUMN new_author_id uuid;
UPDATE public.forum_posts SET new_author_id = author_id;
DROP POLICY IF EXISTS "forum_posts_insert_authenticated" ON public.forum_posts;
DROP POLICY IF EXISTS "forum_posts_update_own" ON public.forum_posts;
ALTER TABLE public.forum_posts DROP CONSTRAINT IF EXISTS forum_posts_author_id_fkey;
ALTER TABLE public.forum_posts DROP COLUMN author_id;
ALTER TABLE public.forum_posts RENAME COLUMN new_author_id TO author_id;
ALTER TABLE public.forum_posts ADD CONSTRAINT forum_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;
CREATE POLICY "forum_posts_insert_authenticated" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "forum_posts_update_own" ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id);

-- 3.2: Update 'forum_replies'
ALTER TABLE public.forum_replies ADD COLUMN new_author_id uuid;
UPDATE public.forum_replies SET new_author_id = author_id;
DROP POLICY IF EXISTS "forum_replies_insert_authenticated" ON public.forum_replies;
DROP POLICY IF EXISTS "forum_replies_update_own" ON public.forum_replies;
ALTER TABLE public.forum_replies DROP CONSTRAINT IF EXISTS forum_replies_author_id_fkey;
ALTER TABLE public.forum_replies DROP COLUMN author_id;
ALTER TABLE public.forum_replies RENAME COLUMN new_author_id TO author_id;
ALTER TABLE public.forum_replies ADD CONSTRAINT forum_replies_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;
CREATE POLICY "forum_replies_insert_authenticated" ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "forum_replies_update_own" ON public.forum_replies FOR UPDATE USING (auth.uid() = author_id);

-- 3.3: Update 'releases'
ALTER TABLE public.releases ADD COLUMN new_artist_id uuid;
UPDATE public.releases SET new_artist_id = artist_id;
DROP POLICY IF EXISTS "releases_insert_own" ON public.releases;
DROP POLICY IF EXISTS "releases_update_own" ON public.releases;
DROP POLICY IF EXISTS "releases_delete_own" ON public.releases;
ALTER TABLE public.releases DROP CONSTRAINT IF EXISTS releases_artist_id_fkey;
ALTER TABLE public.releases DROP COLUMN artist_id;
ALTER TABLE public.releases RENAME COLUMN new_artist_id TO artist_id;
ALTER TABLE public.releases ADD CONSTRAINT releases_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.bands(id) ON DELETE CASCADE;
CREATE POLICY "releases_insert_own" ON public.releases FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM user_bands WHERE band_id = artist_id AND user_id = auth.uid()));
CREATE POLICY "releases_update_own" ON public.releases FOR UPDATE USING (EXISTS (SELECT 1 FROM user_bands WHERE band_id = artist_id AND user_id = auth.uid()));
CREATE POLICY "releases_delete_own" ON public.releases FOR DELETE USING (EXISTS (SELECT 1 FROM user_bands WHERE band_id = artist_id AND user_id = auth.uid()));

-- 3.4: Update 'donations'
ALTER TABLE public.donations ADD COLUMN recipient_user_id uuid REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.donations ADD COLUMN recipient_band_id uuid REFERENCES public.bands(id) ON DELETE SET NULL;
UPDATE public.donations d SET recipient_user_id = d.recipient_id FROM public.profiles p WHERE d.recipient_id = p.id AND (p.is_band = false OR p.is_band IS NULL);
UPDATE public.donations d SET recipient_band_id = d.recipient_id FROM public.profiles p WHERE d.recipient_id = p.id AND p.is_band = true;

DROP POLICY IF EXISTS "donations_select_own_or_recipient" ON public.donations;

ALTER TABLE public.donations DROP CONSTRAINT IF EXISTS donations_recipient_id_fkey;
ALTER TABLE public.donations DROP COLUMN recipient_id;
ALTER TABLE public.donations ADD CONSTRAINT chk_donations_recipient CHECK ((recipient_user_id IS NOT NULL AND recipient_band_id IS NULL) OR (recipient_user_id IS NULL AND recipient_band_id IS NOT NULL));

CREATE POLICY "donations_select_own_or_recipient" ON public.donations FOR SELECT USING (
    auth.uid() = donor_id OR 
    auth.uid() = recipient_user_id OR 
    EXISTS (SELECT 1 FROM user_bands WHERE band_id = recipient_band_id AND user_id = auth.uid()) OR 
    is_anonymous = false
);

-- 3.5: Update 'events'
ALTER TABLE public.events ADD COLUMN organizer_user_id uuid REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.events ADD COLUMN organizer_band_id uuid REFERENCES public.bands(id) ON DELETE SET NULL;
UPDATE public.events e SET organizer_user_id = e.organizer_id FROM public.profiles p WHERE e.organizer_id = p.id AND (p.is_band = false OR p.is_band IS NULL);
UPDATE public.events e SET organizer_band_id = e.organizer_id FROM public.profiles p WHERE e.organizer_id = p.id AND p.is_band = true;

DROP POLICY IF EXISTS "events_insert_authenticated" ON public.events;
DROP POLICY IF EXISTS "events_update_own" ON public.events;
DROP POLICY IF EXISTS "events_delete_own" ON public.events;

ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_organizer_id_fkey;
ALTER TABLE public.events DROP COLUMN organizer_id;
ALTER TABLE public.events ADD CONSTRAINT chk_events_organizer CHECK ((organizer_user_id IS NOT NULL AND organizer_band_id IS NULL) OR (organizer_user_id IS NULL AND organizer_band_id IS NOT NULL));

CREATE POLICY "events_insert_authenticated" ON public.events FOR INSERT WITH CHECK ((organizer_user_id = auth.uid()) OR (EXISTS (SELECT 1 FROM user_bands WHERE band_id = organizer_band_id AND user_id = auth.uid())));
CREATE POLICY "events_update_own" ON public.events FOR UPDATE USING ((organizer_user_id = auth.uid()) OR (EXISTS (SELECT 1 FROM user_bands WHERE band_id = organizer_band_id AND user_id = auth.uid())));
CREATE POLICY "events_delete_own" ON public.events FOR DELETE USING ((organizer_user_id = auth.uid()) OR (EXISTS (SELECT 1 FROM user_bands WHERE band_id = organizer_band_id AND user_id = auth.uid())));

-- Step 4: Drop the old 'profiles' table
DROP TABLE IF EXISTS public.profiles;

-- Step 5: Final success message
SELECT '✅ Migration to new users/bands structure completed successfully!' AS status;

COMMIT;