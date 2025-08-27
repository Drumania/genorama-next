-- Create donations table for supporting artists
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid references auth.users(id) on delete set null,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  amount decimal(10,2) not null,
  message text,
  is_anonymous boolean default false,
  payment_status text default 'pending', -- pending, completed, failed
  payment_id text, -- External payment processor ID
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.donations enable row level security;

-- RLS Policies for donations
create policy "donations_select_own_or_recipient"
  on public.donations for select
  using (auth.uid() = donor_id or auth.uid() = recipient_id or is_anonymous = false);

create policy "donations_insert_own"
  on public.donations for insert
  with check (auth.uid() = donor_id or donor_id is null);

-- No update or delete policies - donations are immutable once created
