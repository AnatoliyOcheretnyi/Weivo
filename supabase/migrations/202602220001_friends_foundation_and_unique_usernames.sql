alter table public.profiles
  add column if not exists social_level integer not null default 1,
  add column if not exists social_xp integer not null default 0,
  add column if not exists social_title text;

update public.profiles
set username = lower(trim(username))
where username is not null;

update public.profiles
set username = null
where username is not null
  and username !~ '^[a-z0-9](?:[a-z0-9._]{1,18}[a-z0-9])$';

with ranked as (
  select id,
         row_number() over (partition by lower(username) order by created_at asc, id asc) as rn
  from public.profiles
  where username is not null and username <> ''
)
update public.profiles p
set username = null
from ranked r
where p.id = r.id
  and r.rn > 1;

create unique index if not exists profiles_username_unique_ci
  on public.profiles (lower(username))
  where username is not null and username <> '';

create or replace function public.is_username_available(
  p_username text,
  p_exclude_user_id uuid default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_username text;
begin
  normalized_username := lower(trim(coalesce(p_username, '')));

  if normalized_username = '' then
    return false;
  end if;

  return not exists (
    select 1
    from public.profiles p
    where lower(p.username) = normalized_username
      and (p_exclude_user_id is null or p.id <> p_exclude_user_id)
  );
end;
$$;

grant execute on function public.is_username_available(text, uuid) to authenticated;

create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references auth.users(id) on delete cascade,
  to_user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (from_user_id <> to_user_id)
);

create unique index if not exists friend_requests_pending_unique
  on public.friend_requests (from_user_id, to_user_id)
  where status = 'pending';

create index if not exists friend_requests_to_user_idx on public.friend_requests (to_user_id, created_at desc);
create index if not exists friend_requests_from_user_idx on public.friend_requests (from_user_id, created_at desc);

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references auth.users(id) on delete cascade,
  user_b_id uuid not null references auth.users(id) on delete cascade,
  state text not null default 'active' check (state in ('active', 'blocked', 'removed')),
  a_role text not null default 'peer' check (a_role in ('owner', 'supporter', 'peer')),
  b_role text not null default 'peer' check (b_role in ('owner', 'supporter', 'peer')),
  shared_streak integer not null default 0,
  last_interaction_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_a_id <> user_b_id)
);

create unique index if not exists friendships_pair_unique
  on public.friendships ((least(user_a_id, user_b_id)), (greatest(user_a_id, user_b_id)));

create index if not exists friendships_user_a_idx on public.friendships (user_a_id, updated_at desc);
create index if not exists friendships_user_b_idx on public.friendships (user_b_id, updated_at desc);

create table if not exists public.buddy_messages (
  id uuid primary key default gen_random_uuid(),
  friendship_id uuid not null references public.friendships(id) on delete cascade,
  from_user_id uuid not null references auth.users(id) on delete cascade,
  to_user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('quick_reaction', 'text_nudge', 'milestone_note')),
  template_key text,
  text_body text,
  created_at timestamptz not null default now(),
  check (from_user_id <> to_user_id)
);

create index if not exists buddy_messages_friendship_idx
  on public.buddy_messages (friendship_id, created_at desc);

create table if not exists public.social_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  xp_delta integer not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists social_events_user_created_idx
  on public.social_events (user_id, created_at desc);

alter table public.friend_requests enable row level security;
alter table public.friendships enable row level security;
alter table public.buddy_messages enable row level security;
alter table public.social_events enable row level security;

drop policy if exists "friend_requests_select_participants" on public.friend_requests;
drop policy if exists "friend_requests_insert_sender" on public.friend_requests;
drop policy if exists "friend_requests_update_participants" on public.friend_requests;
drop policy if exists "friend_requests_delete_sender" on public.friend_requests;

create policy "friend_requests_select_participants"
on public.friend_requests
for select
to authenticated
using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "friend_requests_insert_sender"
on public.friend_requests
for insert
to authenticated
with check (auth.uid() = from_user_id and auth.uid() <> to_user_id);

create policy "friend_requests_update_participants"
on public.friend_requests
for update
to authenticated
using (auth.uid() = from_user_id or auth.uid() = to_user_id)
with check (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "friend_requests_delete_sender"
on public.friend_requests
for delete
to authenticated
using (auth.uid() = from_user_id);

drop policy if exists "friendships_participants_all" on public.friendships;

create policy "friendships_participants_all"
on public.friendships
for all
to authenticated
using (auth.uid() = user_a_id or auth.uid() = user_b_id)
with check (auth.uid() = user_a_id or auth.uid() = user_b_id);

drop policy if exists "buddy_messages_participants_all" on public.buddy_messages;

create policy "buddy_messages_participants_all"
on public.buddy_messages
for all
to authenticated
using (auth.uid() = from_user_id or auth.uid() = to_user_id)
with check (auth.uid() = from_user_id);

drop policy if exists "social_events_own_all" on public.social_events;

create policy "social_events_own_all"
on public.social_events
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.search_users_for_friends(
  p_query text,
  p_limit integer default 20
)
returns table (
  user_id uuid,
  username text,
  avatar_url text
)
language sql
security definer
set search_path = public
as $$
  select p.id as user_id, p.username, p.avatar_url
  from public.profiles p
  where auth.uid() is not null
    and p.id <> auth.uid()
    and p.username is not null
    and p.username ilike lower(trim(coalesce(p_query, ''))) || '%'
  order by p.username asc
  limit greatest(1, least(coalesce(p_limit, 20), 50));
$$;

create or replace function public.list_friend_requests()
returns table (
  request_id uuid,
  direction text,
  status text,
  message text,
  created_at timestamptz,
  other_user_id uuid,
  other_username text,
  other_avatar_url text
)
language sql
security definer
set search_path = public
as $$
  select
    fr.id as request_id,
    case when fr.to_user_id = auth.uid() then 'incoming' else 'outgoing' end as direction,
    fr.status,
    fr.message,
    fr.created_at,
    p.id as other_user_id,
    p.username as other_username,
    p.avatar_url as other_avatar_url
  from public.friend_requests fr
  join public.profiles p
    on p.id = case when fr.to_user_id = auth.uid() then fr.from_user_id else fr.to_user_id end
  where auth.uid() is not null
    and (fr.from_user_id = auth.uid() or fr.to_user_id = auth.uid())
  order by fr.created_at desc;
$$;

create or replace function public.list_friends()
returns table (
  friendship_id uuid,
  friend_user_id uuid,
  friend_username text,
  friend_avatar_url text,
  shared_streak integer,
  last_interaction_at timestamptz,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    f.id as friendship_id,
    p.id as friend_user_id,
    p.username as friend_username,
    p.avatar_url as friend_avatar_url,
    f.shared_streak,
    f.last_interaction_at,
    f.created_at
  from public.friendships f
  join public.profiles p
    on p.id = case when f.user_a_id = auth.uid() then f.user_b_id else f.user_a_id end
  where auth.uid() is not null
    and f.state = 'active'
    and (f.user_a_id = auth.uid() or f.user_b_id = auth.uid())
  order by coalesce(f.last_interaction_at, f.created_at) desc;
$$;

create or replace function public.send_friend_request(
  p_to_user_id uuid,
  p_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid;
  request_id uuid;
begin
  actor_id := auth.uid();
  if actor_id is null then
    raise exception 'Authentication required';
  end if;
  if p_to_user_id is null or p_to_user_id = actor_id then
    raise exception 'Invalid recipient';
  end if;

  select fr.id into request_id
  from public.friend_requests fr
  where ((fr.from_user_id = actor_id and fr.to_user_id = p_to_user_id)
      or (fr.from_user_id = p_to_user_id and fr.to_user_id = actor_id))
    and fr.status = 'pending'
  limit 1;
  if request_id is not null then
    return request_id;
  end if;

  if exists (
    select 1 from public.friendships f
    where least(f.user_a_id, f.user_b_id) = least(actor_id, p_to_user_id)
      and greatest(f.user_a_id, f.user_b_id) = greatest(actor_id, p_to_user_id)
      and f.state = 'active'
  ) then
    raise exception 'Already friends';
  end if;

  insert into public.friend_requests (from_user_id, to_user_id, status, message, updated_at)
  values (actor_id, p_to_user_id, 'pending', nullif(trim(coalesce(p_message, '')), ''), now())
  returning id into request_id;
  return request_id;
end;
$$;

create or replace function public.respond_friend_request(
  p_request_id uuid,
  p_action text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid;
  req public.friend_requests%rowtype;
  normalized_action text;
  existing_friendship_id uuid;
begin
  actor_id := auth.uid();
  if actor_id is null then
    raise exception 'Authentication required';
  end if;
  normalized_action := lower(trim(coalesce(p_action, '')));
  if normalized_action not in ('accept', 'decline', 'cancel') then
    raise exception 'Unsupported action';
  end if;

  select * into req from public.friend_requests where id = p_request_id for update;
  if req.id is null or req.status <> 'pending' then
    raise exception 'Request is not pending';
  end if;

  if normalized_action in ('accept', 'decline') and req.to_user_id <> actor_id then
    raise exception 'Only recipient can accept or decline';
  end if;
  if normalized_action = 'cancel' and req.from_user_id <> actor_id then
    raise exception 'Only sender can cancel';
  end if;

  update public.friend_requests
  set status = case
    when normalized_action = 'accept' then 'accepted'
    when normalized_action = 'decline' then 'declined'
    else 'cancelled'
  end,
      updated_at = now()
  where id = req.id;

  if normalized_action = 'accept' then
    select f.id into existing_friendship_id
    from public.friendships f
    where least(f.user_a_id, f.user_b_id) = least(req.from_user_id, req.to_user_id)
      and greatest(f.user_a_id, f.user_b_id) = greatest(req.from_user_id, req.to_user_id)
    limit 1;

    if existing_friendship_id is null then
      insert into public.friendships (
        user_a_id,
        user_b_id,
        state,
        a_role,
        b_role,
        shared_streak,
        last_interaction_at,
        updated_at
      )
      values (
        least(req.from_user_id, req.to_user_id),
        greatest(req.from_user_id, req.to_user_id),
        'active',
        'peer',
        'peer',
        0,
        now(),
        now()
      );
    else
      update public.friendships
      set state = 'active',
          last_interaction_at = now(),
          updated_at = now()
      where id = existing_friendship_id;
    end if;
  end if;
end;
$$;

grant execute on function public.search_users_for_friends(text, integer) to authenticated;
grant execute on function public.list_friend_requests() to authenticated;
grant execute on function public.list_friends() to authenticated;
grant execute on function public.send_friend_request(uuid, text) to authenticated;
grant execute on function public.respond_friend_request(uuid, text) to authenticated;
