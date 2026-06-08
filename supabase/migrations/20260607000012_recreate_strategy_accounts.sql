create table trades_strategy_accounts (
  id              bigserial primary key,
  user_id         uuid        not null references trades_custom_users(id) on delete cascade,
  strategy_slug   text        not null,
  deriv_acct_id   text        not null,
  is_running      boolean     not null default false,
  deriv_token     text,
  auth_id         text,
  started_at      timestamptz,
  last_active_at  timestamptz,
  created_at      timestamptz not null default now(),
  unique(user_id, strategy_slug)
);

alter table trades_strategy_accounts enable row level security;

create policy "Users can read own strategy accounts"
  on trades_strategy_accounts for select
  using (
    user_id = (select id from trades_custom_users where auth_id::uuid = (select auth.uid()))
  );
