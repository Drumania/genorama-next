-- Insert sample events
insert into public.events (id, title, description, organizer_id, event_date, end_date, location, city, country, venue_name, ticket_url, genres, is_online, max_attendees) values
  ('750e8400-e29b-41d4-a716-446655440001', 'Noche de Rock Alternativo', 'Una noche increíble con las mejores bandas de rock alternativo de la ciudad', '550e8400-e29b-41d4-a716-446655440003', '2024-02-15 21:00:00+00', '2024-02-16 02:00:00+00', 'Calle del Rock 123', 'Madrid', 'España', 'Sala Riviera', 'https://tickets.example.com/rock-night', array['Rock', 'Alternative'], false, 300),
  ('750e8400-e29b-41d4-a716-446655440002', 'Festival Electrónico Virtual', 'Festival online con los mejores DJs y productores electrónicos', '550e8400-e29b-41d4-a716-446655440001', '2024-02-20 20:00:00+00', '2024-02-21 04:00:00+00', null, 'Online', null, 'Plataforma Virtual', 'https://tickets.example.com/electronic-fest', array['Electronic', 'Techno', 'House'], true, 1000),
  ('750e8400-e29b-41d4-a716-446655440003', 'Hip-Hop en el Barrio', 'Evento comunitario de hip-hop con artistas locales', '550e8400-e29b-41d4-a716-446655440002', '2024-02-25 19:00:00+00', '2024-02-25 23:00:00+00', 'Plaza Central', 'Barcelona', 'España', 'Centro Cultural del Barrio', null, array['Hip-Hop', 'Rap'], false, 150)
on conflict (id) do nothing;

-- Insert sample event attendees
insert into public.event_attendees (event_id, user_id) values
  ('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
  ('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
  ('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'),
  ('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001')
on conflict (event_id, user_id) do nothing;
