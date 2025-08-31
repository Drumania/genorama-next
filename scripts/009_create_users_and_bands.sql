-- Create users table (separate from profiles)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  email text not null,
  bio text,
  avatar_url text,
  website_url text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create bands table
create table if not exists public.bands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  username text unique not null,
  description text,
  cover_image_url text,
  logo_url text,
  website_url text,
  spotify_url text,
  youtube_url text,
  instagram_url text,
  location text,
  city text,
  country text,
  genres text[], -- Array of genres
  founded_year integer,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_bands junction table (many-to-many relationship)
create table if not exists public.user_bands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  band_id uuid not null references public.bands(id) on delete cascade,
  role text not null check (role in ('owner', 'member', 'admin', 'collaborator')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_active boolean default true,
  unique(user_id, band_id)
);

-- Create indexes for better performance
create index if not exists idx_users_username on public.users(username);
create index if not exists idx_bands_username on public.bands(username);
create index if not exists idx_bands_genres on public.bands using gin(genres);
create index if not exists idx_user_bands_user_id on public.user_bands(user_id);
create index if not exists idx_user_bands_band_id on public.user_bands(band_id);

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.bands enable row level security;
alter table public.user_bands enable row level security;

-- RLS Policies for users
create policy "users_select_all"
  on public.users for select
  using (true); -- Public user profiles can be viewed by anyone

create policy "users_insert_own"
  on public.users for insert
  with check (auth.uid() = id);

create policy "users_update_own"
  on public.users for update
  using (auth.uid() = id);

create policy "users_delete_own"
  on public.users for delete
  using (auth.uid() = id);

-- RLS Policies for bands
create policy "bands_select_all"
  on public.bands for select
  using (true); -- Public bands can be viewed by anyone

create policy "bands_insert_members"
  on public.bands for insert
  with check (
    exists (
      select 1 from public.user_bands 
      where user_id = auth.uid() 
      and role in ('owner', 'admin')
    )
  );

create policy "bands_update_members"
  on public.bands for update
  using (
    exists (
      select 1 from public.user_bands 
      where user_id = auth.uid() 
      and band_id = id
      and role in ('owner', 'admin')
    )
  );

create policy "bands_delete_owners"
  on public.bands for delete
  using (
    exists (
      select 1 from public.user_bands 
      where user_id = auth.uid() 
      and band_id = id
      and role = 'owner'
    )
  );

-- RLS Policies for user_bands
create policy "user_bands_select_all"
  on public.user_bands for select
  using (true);

create policy "user_bands_insert_own"
  on public.user_bands for insert
  with check (auth.uid() = user_id);

create policy "user_bands_update_own"
  on public.user_bands for update
  using (auth.uid() = user_id);

create policy "user_bands_delete_own"
  on public.user_bands for delete
  using (auth.uid() = user_id);

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, username, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data ->> 'display_name', 'New User'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Create trigger for new users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create triggers for updated_at
create trigger update_users_updated_at
  before update on public.users
  for each row
  execute function public.update_updated_at_column();

create trigger update_bands_updated_at
  before update on public.bands
  for each row
  execute function public.update_updated_at_column();

create trigger update_user_bands_updated_at
  before update on public.user_bands
  for each row
  execute function public.update_updated_at_column();
