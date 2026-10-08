-- Server-only visitor state used by server/data-routes.mjs.
create table if not exists public.pays (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.pays enable row level security;

revoke all on table public.pays from anon, authenticated;
grant select, insert, update on table public.pays to service_role;