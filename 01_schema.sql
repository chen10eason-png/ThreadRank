-- Threads Trend Radar V1
create extension if not exists pgcrypto;

create table if not exists public.threads_posts (
  id text primary key,
  author_id text,
  author_name text,
  username text,
  text text,
  permalink text,
  media_type text,
  region text default 'all',
  topic text default 'other',
  published_at timestamptz,
  discovered_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.post_snapshots (
  snapshot_id uuid primary key default gen_random_uuid(),
  post_id text not null references public.threads_posts(id) on delete cascade,
  captured_at timestamptz not null default now(),
  views bigint default 0,
  likes bigint default 0,
  replies bigint default 0,
  reposts bigint default 0,
  quotes bigint default 0,
  shares bigint default 0,
  unique(post_id, captured_at)
);

create index if not exists idx_snapshots_post_time on public.post_snapshots(post_id, captured_at desc);
create index if not exists idx_posts_published_at on public.threads_posts(published_at desc);

create or replace view public.latest_post_metrics as
select distinct on (s.post_id)
  s.post_id, s.captured_at, s.views, s.likes, s.replies, s.reposts, s.quotes, s.shares,
  p.author_name, p.username, p.text, p.permalink, p.region, p.topic, p.published_at
from public.post_snapshots s
join public.threads_posts p on p.id = s.post_id
order by s.post_id, s.captured_at desc;
