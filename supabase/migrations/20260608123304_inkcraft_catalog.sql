-- InkCraft: predefined catalog tables for design assets and garments
-- Uses ic_ prefix to avoid conflicts with existing tables in this project

-- Garments (base clothing items users can customize)
create table if not exists ic_garments (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  storage_path  text not null,
  price         numeric(10, 2) not null,
  display_order int not null default 0,
  created_at    timestamptz not null default now()
);

alter table ic_garments enable row level security;

create policy "garments_public_read" on ic_garments
  for select to anon, authenticated
  using (true);

-- Design assets (graphics users can place on garments)
create table if not exists ic_design_assets (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  storage_path  text not null,
  display_order int not null default 0,
  created_at    timestamptz not null default now()
);

alter table ic_design_assets enable row level security;

create policy "design_assets_public_read" on ic_design_assets
  for select to anon, authenticated
  using (true);

-- Create public storage buckets (idempotent)
insert into storage.buckets (id, name, public)
  values
    ('garments',       'garments',       true),
    ('design-assets',  'design-assets',  true)
  on conflict (id) do update set public = true;
