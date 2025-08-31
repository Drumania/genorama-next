-- Migration script: Convert existing profiles to users and bands structure
-- This script should be run after creating the new tables

-- First, let's see what we have in the current profiles table
-- SELECT * FROM public.profiles LIMIT 5;

-- Step 1: Migrate user profiles to users table
INSERT INTO public.users (id, username, display_name, email, bio, avatar_url, website_url, location, created_at, updated_at)
SELECT 
  id,
  username,
  display_name,
  COALESCE(
    (SELECT email FROM auth.users WHERE auth.users.id = profiles.id),
    'migrated@example.com'
  ) as email,
  bio,
  avatar_url,
  website_url,
  location,
  created_at,
  updated_at
FROM public.profiles
WHERE is_band = false OR is_band IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 2: Migrate band profiles to bands table
INSERT INTO public.bands (id, name, username, description, cover_image_url, logo_url, website_url, spotify_url, youtube_url, instagram_url, location, city, country, genres, created_at, updated_at)
SELECT 
  id,
  display_name as name,
  username,
  bio as description,
  avatar_url as cover_image_url,
  avatar_url as logo_url, -- Using avatar_url as logo_url for now
  website_url,
  spotify_url,
  youtube_url,
  instagram_url,
  location,
  NULL as city, -- We'll need to parse this from location later
  NULL as country, -- We'll need to parse this from location later
  genres,
  created_at,
  updated_at
FROM public.profiles
WHERE is_band = true
ON CONFLICT (username) DO NOTHING;

-- Step 3: Create user_bands relationships for migrated bands
-- For each band, we'll create a relationship with the user who created it
INSERT INTO public.user_bands (user_id, band_id, role, joined_at, is_active)
SELECT 
  ub.id as user_id,
  b.id as band_id,
  'owner' as role,
  b.created_at as joined_at,
  true as is_active
FROM public.bands b
CROSS JOIN LATERAL (
  SELECT u.id 
  FROM public.users u 
  ORDER BY u.created_at 
  LIMIT 1
) ub
ON CONFLICT (user_id, band_id) DO NOTHING;

-- Step 4: Update the releases table to reference bands instead of profiles
-- First, let's add a new column to releases
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS band_id uuid REFERENCES public.bands(id);

-- Update releases to use band_id instead of artist_id
UPDATE public.releases 
SET band_id = (
  SELECT b.id 
  FROM public.bands b 
  WHERE b.username = (
    SELECT p.username 
    FROM public.profiles p 
    WHERE p.id = releases.artist_id
  )
)
WHERE band_id IS NULL;

-- Step 5: Update votes table to reference users instead of profiles
-- First, let's add a new column to votes
ALTER TABLE public.votes ADD COLUMN IF NOT EXISTS user_id_new uuid REFERENCES public.users(id);

-- Update votes to use user_id_new
UPDATE public.votes 
SET user_id_new = user_id
WHERE user_id_new IS NULL;

-- Step 6: Update donations table to reference users instead of profiles
-- First, let's add new columns to donations
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS donor_user_id uuid REFERENCES public.users(id);
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS recipient_user_id uuid REFERENCES public.users(id);

-- Update donations to use new user references
UPDATE public.donations 
SET donor_user_id = (
  SELECT u.id 
  FROM public.users u 
  WHERE u.username = (
    SELECT p.username 
    FROM public.profiles p 
    WHERE p.id = donations.donor_id
  )
)
WHERE donor_user_id IS NULL AND donor_id IS NOT NULL;

UPDATE public.donations 
SET recipient_user_id = (
  SELECT u.id 
  FROM public.users u 
  WHERE u.username = (
    SELECT p.username 
    FROM public.profiles p 
    WHERE p.id = donations.recipient_id
  )
)
WHERE recipient_user_id IS NULL;

-- Step 7: Update community posts to reference users instead of profiles
-- First, let's add a new column to forum_posts
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS author_user_id uuid REFERENCES public.users(id);

-- Update forum_posts to use author_user_id
UPDATE public.forum_posts 
SET author_user_id = (
  SELECT u.id 
  FROM public.users u 
  WHERE u.username = (
    SELECT p.username 
    FROM public.profiles p 
    WHERE p.id = forum_posts.author_id
  )
)
WHERE author_user_id IS NULL;

-- Step 8: Update events to reference users instead of profiles
-- First, let's add a new column to events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_user_id uuid REFERENCES public.users(id);

-- Update events to use organizer_user_id
UPDATE public.events 
SET organizer_user_id = (
  SELECT u.id 
  FROM public.users u 
  WHERE u.username = (
    SELECT p.username 
    FROM public.profiles p 
    WHERE p.id = events.organizer_id
  )
)
WHERE organizer_user_id IS NULL;

-- Note: After running this migration, you should:
-- 1. Verify all data was migrated correctly
-- 2. Update your application code to use the new table structure
-- 3. Eventually drop the old columns and tables when you're confident everything works
-- 4. Update your TypeScript types to match the new structure
