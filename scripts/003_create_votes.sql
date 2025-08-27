-- Create votes table for release voting system
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  release_id uuid not null references public.releases(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, release_id) -- One vote per user per release
);

-- Enable RLS
alter table public.votes enable row level security;

-- RLS Policies for votes
create policy "votes_select_all"
  on public.votes for select
  using (true); -- Vote counts are public

create policy "votes_insert_own"
  on public.votes for insert
  with check (auth.uid() = user_id);

create policy "votes_delete_own"
  on public.votes for delete
  using (auth.uid() = user_id);

-- Function to update vote count on releases
create or replace function update_release_vote_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.releases 
    set vote_count = vote_count + 1 
    where id = NEW.release_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.releases 
    set vote_count = vote_count - 1 
    where id = OLD.release_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql;

-- Create triggers for vote count updates
drop trigger if exists update_vote_count_on_insert on public.votes;
create trigger update_vote_count_on_insert
  after insert on public.votes
  for each row
  execute function update_release_vote_count();

drop trigger if exists update_vote_count_on_delete on public.votes;
create trigger update_vote_count_on_delete
  after delete on public.votes
  for each row
  execute function update_release_vote_count();
