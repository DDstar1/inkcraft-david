-- Add back-of-garment image path
alter table ic_garments
  add column if not exists storage_path_back text;

-- Orders table
create table if not exists ic_orders (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  garment_slug  text not null,
  garment_name  text not null,
  qty           int not null default 1,
  price         numeric(10,2) not null,
  status        text not null default 'pending'
                  check (status in ('pending','printing','shipped','delivered','cancelled')),
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table ic_orders enable row level security;

create policy "orders_public_insert" on ic_orders
  for insert to anon, authenticated with check (true);

create policy "orders_public_read" on ic_orders
  for select to anon, authenticated using (true);

create policy "orders_authenticated_update" on ic_orders
  for update to authenticated using (true) with check (true);

-- Storage upload policies for admin page (lock down with auth later)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'garments_public_insert'
  ) then
    execute $p$
      create policy "garments_public_insert" on storage.objects
        for insert to anon, authenticated
        with check (bucket_id = 'garments');
    $p$;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'garments_public_update'
  ) then
    execute $p$
      create policy "garments_public_update" on storage.objects
        for update to anon, authenticated
        using (bucket_id = 'garments');
    $p$;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'design_assets_public_insert'
  ) then
    execute $p$
      create policy "design_assets_public_insert" on storage.objects
        for insert to anon, authenticated
        with check (bucket_id = 'design-assets');
    $p$;
  end if;
end $$;
