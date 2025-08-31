-- Seed script for users and bands
-- This script inserts sample data to test the new structure

-- Insert sample users
INSERT INTO public.users (id, username, display_name, email, bio, avatar_url, website_url, location, created_at, updated_at) VALUES
  (gen_random_uuid(), 'juan_musico', 'Juan Pérez', 'juan@example.com', 'Músico apasionado por el rock alternativo', '/placeholder-user.jpg', 'https://juanmusico.com', 'Buenos Aires, Argentina', now(), now()),
  (gen_random_uuid(), 'maria_artista', 'María González', 'maria@example.com', 'Cantante y compositora indie', '/placeholder-user.jpg', 'https://mariaartista.com', 'México DF, México', now(), now()),
  (gen_random_uuid(), 'carlos_dj', 'Carlos Rodríguez', 'carlos@example.com', 'DJ y productor de música electrónica', '/placeholder-user.jpg', 'https://carlosdj.com', 'Bogotá, Colombia', now(), now()),
  (gen_random_uuid(), 'ana_rockera', 'Ana Silva', 'ana@example.com', 'Guitarrista de rock duro', '/placeholder-user.jpg', 'https://anarockera.com', 'Santiago, Chile', now(), now()),
  (gen_random_uuid(), 'luis_hiphop', 'Luis Morales', 'luis@example.com', 'MC y productor de hip-hop', '/placeholder-user.jpg', 'https://luishiphop.com', 'Lima, Perú', now(), now());

-- Insert sample bands
INSERT INTO public.bands (id, name, username, description, cover_image_url, logo_url, website_url, spotify_url, youtube_url, instagram_url, location, city, country, genres, founded_year, is_active, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Los Rockeros del Sur', 'rockeros_sur', 'Banda de rock alternativo con influencias latinas', '/alternative-rock-band-album-cover-ethereal.png', '/placeholder-logo.png', 'https://rockerosdelsur.com', 'https://open.spotify.com/artist/example1', 'https://youtube.com/@rockerosdelsur', 'https://instagram.com/rockerosdelsur', 'Buenos Aires, Argentina', 'Buenos Aires', 'Argentina', ARRAY['Rock', 'Alternativo', 'Latino'], 2018, true, now(), now()),
  
  (gen_random_uuid(), 'Electro Dreams', 'electro_dreams', 'Proyecto de música electrónica experimental', '/album-cover-midnight-dreams-electronic-music.png', '/placeholder-logo.png', 'https://electrodreams.com', 'https://open.spotify.com/artist/example2', 'https://youtube.com/@electrodreams', 'https://instagram.com/electrodreams', 'México DF, México', 'México DF', 'México', ARRAY['Electrónica', 'Experimental', 'Ambient'], 2020, true, now(), now()),
  
  (gen_random_uuid(), 'Hip-Hop Urbano', 'hiphop_urbano', 'Colectivo de hip-hop y rap urbano', '/hip-hop-urban-album-cover-street-art.png', '/placeholder-logo.png', 'https://hiphopurbano.com', 'https://open.spotify.com/artist/example3', 'https://youtube.com/@hiphopurbano', 'https://instagram.com/hiphopurbano', 'Bogotá, Colombia', 'Bogotá', 'Colombia', ARRAY['Hip-Hop', 'Rap', 'Urbano'], 2019, true, now(), now()),
  
  (gen_random_uuid(), 'Folk del Valle', 'folk_valle', 'Grupo de música folklórica tradicional', '/placeholder.jpg', '/placeholder-logo.png', 'https://folkdelvalle.com', 'https://open.spotify.com/artist/example4', 'https://youtube.com/@folkdelvalle', 'https://instagram.com/folkdelvalle', 'Santiago, Chile', 'Santiago', 'Chile', ARRAY['Folk', 'Tradicional', 'Latino'], 2017, true, now(), now()),
  
  (gen_random_uuid(), 'Indie Pop Collective', 'indie_pop_collective', 'Colectivo de artistas indie pop', '/placeholder.jpg', '/placeholder-logo.png', 'https://indiepopcollective.com', 'https://open.spotify.com/artist/example5', 'https://youtube.com/@indiepopcollective', 'https://instagram.com/indiepopcollective', 'Lima, Perú', 'Lima', 'Perú', ARRAY['Indie', 'Pop', 'Alternativo'], 2021, true, now(), now());

-- Create user-band relationships
-- First, let's get the actual IDs we just inserted
DO $$
DECLARE
  user1_id uuid;
  user2_id uuid;
  user3_id uuid;
  user4_id uuid;
  user5_id uuid;
  band1_id uuid;
  band2_id uuid;
  band3_id uuid;
  band4_id uuid;
  band5_id uuid;
BEGIN
  -- Get user IDs
  SELECT id INTO user1_id FROM public.users WHERE username = 'juan_musico';
  SELECT id INTO user2_id FROM public.users WHERE username = 'maria_artista';
  SELECT id INTO user3_id FROM public.users WHERE username = 'carlos_dj';
  SELECT id INTO user4_id FROM public.users WHERE username = 'ana_rockera';
  SELECT id INTO user5_id FROM public.users WHERE username = 'luis_hiphop';
  
  -- Get band IDs
  SELECT id INTO band1_id FROM public.bands WHERE username = 'rockeros_sur';
  SELECT id INTO band2_id FROM public.bands WHERE username = 'electro_dreams';
  SELECT id INTO band3_id FROM public.bands WHERE username = 'hiphop_urbano';
  SELECT id INTO band4_id FROM public.bands WHERE username = 'folk_valle';
  SELECT id INTO band5_id FROM public.bands WHERE username = 'indie_pop_collective';
  
  -- Insert user-band relationships
  INSERT INTO public.user_bands (user_id, band_id, role, joined_at, is_active) VALUES
    (user1_id, band1_id, 'owner', now(), true),
    (user2_id, band2_id, 'owner', now(), true),
    (user3_id, band3_id, 'owner', now(), true),
    (user4_id, band4_id, 'owner', now(), true),
    (user5_id, band5_id, 'owner', now(), true),
    -- Add some members to bands
    (user1_id, band2_id, 'member', now(), true),
    (user2_id, band1_id, 'collaborator', now(), true),
    (user3_id, band4_id, 'admin', now(), true);
END $$;

-- Insert some sample releases for the bands
INSERT INTO public.releases (id, title, description, artist_id, band_id, cover_image_url, youtube_url, spotify_url, apple_music_url, soundcloud_url, release_date, genres, tags, vote_count, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Rock del Sur', 'Primer álbum de Los Rockeros del Sur', 
   (SELECT id FROM public.bands WHERE username = 'rockeros_sur'), 
   (SELECT id FROM public.bands WHERE username = 'rockeros_sur'),
   '/alternative-rock-band-album-cover-ethereal.png', 
   'https://youtube.com/watch?v=example1', 
   'https://open.spotify.com/album/example1', 
   'https://music.apple.com/album/example1', 
   'https://soundcloud.com/example1', 
   '2024-01-15', 
   ARRAY['Rock', 'Alternativo'], 
   ARRAY['Rock', 'Latino', 'Alternativo'], 
   45, now(), now()),
   
  (gen_random_uuid(), 'Midnight Dreams', 'EP de música electrónica experimental', 
   (SELECT id FROM public.bands WHERE username = 'electro_dreams'), 
   (SELECT id FROM public.bands WHERE username = 'electro_dreams'),
   '/album-cover-midnight-dreams-electronic-music.png', 
   'https://youtube.com/watch?v=example2', 
   'https://open.spotify.com/album/example2', 
   'https://music.apple.com/album/example2', 
   'https://soundcloud.com/example2', 
   '2024-02-20', 
   ARRAY['Electrónica', 'Experimental'], 
   ARRAY['Electrónica', 'Ambient', 'Experimental'], 
   32, now(), now()),
   
  (gen_random_uuid(), 'Street Poetry', 'Mixtape de hip-hop urbano', 
   (SELECT id FROM public.bands WHERE username = 'hiphop_urbano'), 
   (SELECT id FROM public.bands WHERE username = 'hiphop_urbano'),
   '/hip-hop-urban-album-cover-street-art.png', 
   'https://youtube.com/watch?v=example3', 
   'https://open.spotify.com/album/example3', 
   'https://music.apple.com/album/example3', 
   'https://soundcloud.com/example3', 
   '2024-03-10', 
   ARRAY['Hip-Hop', 'Rap'], 
   ARRAY['Hip-Hop', 'Urbano', 'Rap'], 
   67, now(), now());

-- Display the results
SELECT 'Users created:' as info, count(*) as count FROM public.users
UNION ALL
SELECT 'Bands created:', count(*) FROM public.bands
UNION ALL
SELECT 'User-Band relationships:', count(*) FROM public.user_bands
UNION ALL
SELECT 'Releases created:', count(*) FROM public.releases;
