-- Create forum categories
create table if not exists public.forum_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  color text default '#ef4444', -- Default red color
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create forum posts
create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid not null references public.forum_categories(id) on delete cascade,
  is_pinned boolean default false,
  reply_count integer default 0,
  last_reply_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create forum replies
create table if not exists public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  author_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for all forum tables
alter table public.forum_categories enable row level security;
alter table public.forum_posts enable row level security;
alter table public.forum_replies enable row level security;

-- RLS Policies for forum
create policy "forum_categories_select_all"
  on public.forum_categories for select
  using (true);

create policy "forum_posts_select_all"
  on public.forum_posts for select
  using (true);

create policy "forum_posts_insert_authenticated"
  on public.forum_posts for insert
  with check (auth.uid() = author_id);

create policy "forum_posts_update_own"
  on public.forum_posts for update
  using (auth.uid() = author_id);

create policy "forum_replies_select_all"
  on public.forum_replies for select
  using (true);

create policy "forum_replies_insert_authenticated"
  on public.forum_replies for insert
  with check (auth.uid() = author_id);

create policy "forum_replies_update_own"
  on public.forum_replies for update
  using (auth.uid() = author_id);

-- Insert default forum categories
insert into public.forum_categories (name, description, color) values
  ('General Discussion', 'General music discussion and community chat', '#ef4444'),
  ('Music Production', 'Tips, tricks, and discussions about music production', '#f97316'),
  ('Collaboration', 'Find other musicians to collaborate with', '#eab308'),
  ('Gear & Equipment', 'Discuss instruments, software, and equipment', '#22c55e'),
  ('Industry News', 'Latest news and updates from the music industry', '#3b82f6')
on conflict do nothing;
