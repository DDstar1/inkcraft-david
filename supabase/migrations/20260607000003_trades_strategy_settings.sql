-- trades_strategy_settings: one row per unique (strategy_slug, settings) combo
create table trades_strategy_settings (
  id            uuid primary key default gen_random_uuid(),
  strategy_slug text not null,
  settings      jsonb not null default '{}',
  created_at    timestamptz default now()
);

-- Dedup: same strategy + same settings text → same row
create unique index idx_strategy_settings_dedup
  on trades_strategy_settings (strategy_slug, (settings::text));

alter table trades_strategy_settings enable row level security;

create policy "Anyone can read strategy settings"
  on trades_strategy_settings for select using (true);

-- Add new columns to trades_trades
alter table trades_trades
  add column if not exists contract_id   text unique,
  add column if not exists settings_id  uuid references trades_strategy_settings(id),
  add column if not exists balance_after numeric,
  add column if not exists strategy_slug text;

-- RLS for trades_trades (reads via auth session)
alter table trades_trades enable row level security;

create policy "Users can read own trades"
  on trades_trades for select
  using (
    user_id = (
      select id from trades_custom_users
      where auth_id = (select auth.uid())
    )
  );

-- Link backtest results to a settings row
alter table trades_backtest_results
  add column if not exists settings_id uuid references trades_strategy_settings(id);
