-- Insert sample profiles (artists/bands)
insert into public.profiles (id, username, display_name, bio, genres, is_band, location) values
  ('550e8400-e29b-41d4-a716-446655440001', 'luna_collective', 'Luna Collective', 'Exploradores de paisajes sonoros electrónicos y ambientales', array['Electronic', 'Ambient'], true, 'Barcelona, España'),
  ('550e8400-e29b-41d4-a716-446655440002', 'mc_verso', 'MC Verso', 'Hip-hop consciente desde las calles de la ciudad', array['Hip-Hop', 'Rap'], false, 'Madrid, España'),
  ('550e8400-e29b-41d4-a716-446655440003', 'banda_eterea', 'Banda Etérea', 'Rock alternativo con alma y profundidad', array['Rock', 'Alternative'], true, 'Buenos Aires, Argentina')
on conflict (id) do nothing;

-- Insert sample releases
insert into public.releases (id, title, description, artist_id, cover_image_url, youtube_url, genres, release_date, vote_count) values
  ('650e8400-e29b-41d4-a716-446655440001', 'Midnight Dreams', 'Un viaje sonoro a través de paisajes nocturnos con sintetizadores atmosféricos', '550e8400-e29b-41d4-a716-446655440001', '/album-cover-midnight-dreams-electronic-music.png', 'https://youtube.com/watch?v=example1', array['Electronic', 'Ambient'], '2024-01-15', 127),
  ('650e8400-e29b-41d4-a716-446655440002', 'Raíces Urbanas', 'Hip-hop consciente que explora las realidades de la vida en la ciudad', '550e8400-e29b-41d4-a716-446655440002', '/hip-hop-urban-album-cover-street-art.png', 'https://youtube.com/watch?v=example2', array['Hip-Hop', 'Rap'], '2024-01-14', 89),
  ('650e8400-e29b-41d4-a716-446655440003', 'Ecos del Alma', 'Rock alternativo con letras profundas sobre la condición humana', '550e8400-e29b-41d4-a716-446655440003', '/alternative-rock-band-album-cover-ethereal.png', 'https://youtube.com/watch?v=example3', array['Rock', 'Alternative'], '2024-01-13', 156)
on conflict (id) do nothing;
