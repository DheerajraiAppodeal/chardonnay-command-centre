-- Chardonnay Command Centre — Gantt schema
-- Run this in the Supabase SQL editor for project: chardonnay-gantt
-- https://bbzhntajcxdgeskbmbzp.supabase.co

-- ── Sprint features ──────────────────────────────────────────────────────────
create table if not exists sprint_features (
  id               uuid default gen_random_uuid() primary key,
  game             text not null,            -- 'wm' | 'sol'
  version          text not null,            -- e.g. '1.49.0'
  name             text not null,
  subtitle         text,
  kpi_target       text,
  status           text default 'planned',
  risks            text[],
  sprint_week_start integer default 0,       -- Week 0 = Apr 21 2026
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ── Sprint tracks ─────────────────────────────────────────────────────────────
create table if not exists sprint_tracks (
  id           uuid default gen_random_uuid() primary key,
  feature_id   uuid references sprint_features(id) on delete cascade,
  track        text not null,               -- 'design'|'art'|'techArt'|'dev'|'qa'
  status       text default 'not-started',
  note         text,
  week_start   integer default 0,
  week_end     integer default 1,
  people       text[],                      -- ['Toni', 'Víctor']
  jira_tickets text[],                      -- ['WORD-123']
  updated_by   text,
  updated_at   timestamptz default now()
);

-- ── Team OOO ──────────────────────────────────────────────────────────────────
create table if not exists team_ooo (
  id           uuid default gen_random_uuid() primary key,
  person_name  text not null,
  person_email text,
  start_date   date not null,
  end_date     date not null,
  note         text,
  source       text default 'manual',       -- 'rippling' | 'manual'
  created_at   timestamptz default now()
);

-- ── Real-time ─────────────────────────────────────────────────────────────────
alter publication supabase_realtime add table sprint_features;
alter publication supabase_realtime add table sprint_tracks;
alter publication supabase_realtime add table team_ooo;

-- ── Row Level Security (open for now — add Supabase Auth later) ───────────────
alter table sprint_features enable row level security;
alter table sprint_tracks   enable row level security;
alter table team_ooo        enable row level security;

create policy "Allow all" on sprint_features for all using (true);
create policy "Allow all" on sprint_tracks   for all using (true);
create policy "Allow all" on team_ooo        for all using (true);
