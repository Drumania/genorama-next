-- Create releases table for music launches
create table if not exists public.releases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  artist_id uuid not null references public.profiles(id) on delete cascade,
  cover_image_url text,
  youtube_url text,
  spotify_url text,
  apple_music_url text,
  soundcloud_url text,
  release_date date,
  genres text[], -- Array of genres
  tags text[], -- Array of tags
  vote_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.releases enable row level security;

-- RLS Policies for releases
create policy "releases_select_all"
  on public.releases for select
  using (true); -- All releases are public

create policy "releases_insert_own"
  on public.releases for insert
  with check (auth.uid() = artist_id);

create policy "releases_update_own"
  on public.releases for update
  using (auth.uid() = artist_id);

create policy "releases_delete_own"
  on public.releases for delete
  using (auth.uid() = artist_id);
