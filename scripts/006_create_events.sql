-- Create events table for community calendar
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  organizer_id uuid not null references public.profiles(id) on delete cascade,
  event_date timestamp with time zone not null,
  end_date timestamp with time zone,
  location text,
  city text,
  country text,
  venue_name text,
  ticket_url text,
  cover_image_url text,
  genres text[], -- Array of genres
  is_online boolean default false,
  max_attendees integer,
  attendee_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create event attendees table
create table if not exists public.event_attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(event_id, user_id) -- One attendance per user per event
);

-- Enable RLS
alter table public.events enable row level security;
alter table public.event_attendees enable row level security;

-- RLS Policies for events
create policy "events_select_all"
  on public.events for select
  using (true); -- All events are public

create policy "events_insert_authenticated"
  on public.events for insert
  with check (auth.uid() = organizer_id);

create policy "events_update_own"
  on public.events for update
  using (auth.uid() = organizer_id);

create policy "events_delete_own"
  on public.events for delete
  using (auth.uid() = organizer_id);

-- RLS Policies for event attendees
create policy "event_attendees_select_all"
  on public.event_attendees for select
  using (true);

create policy "event_attendees_insert_own"
  on public.event_attendees for insert
  with check (auth.uid() = user_id);

create policy "event_attendees_delete_own"
  on public.event_attendees for delete
  using (auth.uid() = user_id);

-- Function to update attendee count
create or replace function update_event_attendee_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.events 
    set attendee_count = attendee_count + 1 
    where id = NEW.event_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.events 
    set attendee_count = attendee_count - 1 
    where id = OLD.event_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql;

-- Create triggers for attendee count updates
drop trigger if exists update_attendee_count_on_insert on public.event_attendees;
create trigger update_attendee_count_on_insert
  after insert on public.event_attendees
  for each row
  execute function update_event_attendee_count();

drop trigger if exists update_attendee_count_on_delete on public.event_attendees;
create trigger update_attendee_count_on_delete
  after delete on public.event_attendees
  for each row
  execute function update_event_attendee_count();
