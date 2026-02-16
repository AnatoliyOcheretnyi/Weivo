alter table public.profiles
  add column if not exists has_seen_welcome boolean not null default false,
  add column if not exists birth_date_iso text,
  add column if not exists sex text,
  add column if not exists height_cm numeric(5,2),
  add column if not exists activity_level text,
  add column if not exists goal_type text,
  add column if not exists goal_target_kg numeric(6,2),
  add column if not exists goal_rate_kg_per_week numeric(4,2),
  add column if not exists goal_range_min_kg numeric(6,2),
  add column if not exists goal_range_max_kg numeric(6,2),
  add column if not exists units text,
  add column if not exists language text,
  add column if not exists theme text,
  add column if not exists has_seen_segments_hint boolean not null default false,
  add column if not exists latest_weight_kg numeric(6,2),
  add column if not exists bmi numeric(5,2),
  add column if not exists calories_maintenance integer,
  add column if not exists calories_target integer,
  add column if not exists eta_weeks integer;

alter table public.weight_entries
  add column if not exists date_iso text,
  add column if not exists mood text,
  add column if not exists updated_at timestamptz not null default now();

update public.weight_entries
set date_iso = coalesce(date_iso, created_at::text)
where date_iso is null;

alter table public.weight_entries
  alter column date_iso set not null;

create unique index if not exists weight_entries_user_date_unique
  on public.weight_entries(user_id, date_iso);

create table if not exists public.goal_segments (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  start_kg numeric(6,2) not null,
  target_kg numeric(6,2) not null,
  direction text not null check (direction in ('lose', 'gain')),
  note text,
  created_at_iso text not null,
  completed_at_iso text,
  updated_at timestamptz not null default now()
);

create index if not exists goal_segments_user_idx on public.goal_segments(user_id);

alter table public.goal_segments enable row level security;

drop policy if exists "goal_segments_own_all" on public.goal_segments;

create policy "goal_segments_own_all"
on public.goal_segments
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
