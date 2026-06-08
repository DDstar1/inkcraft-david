create table trades_strategy_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references trades_custom_users(id) on delete cascade,
  deriv_acct_id text not null,
  strategy_name text not null,
  account_type text not null default 'demo',
  balance numeric default 10000,
  currency text default 'USD',
  created_at timestamptz default now(),
  unique(user_id, strategy_name)
);

alter table trades_strategy_accounts enable row level security;

create policy "Users can read own strategy accounts"
  on trades_strategy_accounts for select
  using ((select auth.uid()) = (select auth_id from trades_custom_users where id = user_id));

create policy "Users can insert own strategy accounts"
  on trades_strategy_accounts for insert
  with check ((select auth.uid()) = (select auth_id from trades_custom_users where id = user_id));
