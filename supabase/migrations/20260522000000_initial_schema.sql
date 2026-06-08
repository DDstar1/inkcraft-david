-- ============================================================
-- DerivAlgo — Initial Schema
-- ============================================================

-- ── USERS ────────────────────────────────────────────────────
-- One row per Deriv account. Users authenticate via Deriv OAuth;
-- no passwords stored here.
create table if not exists users (
  id               uuid primary key default gen_random_uuid(),
  deriv_account_id text unique not null,   -- e.g. "DOT92283479"
  account_type     text not null default 'demo',  -- 'demo' | 'real'
  currency         text not null default 'USD',
  created_at       timestamptz not null default now()
);

-- ── STRATEGIES ───────────────────────────────────────────────
-- Mirrors the backend REGISTRY. Slug must match the key used in
-- GET /bot/strategies so the frontend can link rows to live code.
create table if not exists strategies (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,  -- matches REGISTRY key e.g. "multup_eurusd"
  name          text not null,         -- human-readable e.g. "MULTUP EUR/USD"
  symbol        text not null,         -- e.g. "frxEURUSD"
  contract_type text not null,         -- e.g. "MULTUP"
  description   text,
  created_at    timestamptz not null default now()
);

-- Seed the one strategy that exists in code
insert into strategies (slug, name, symbol, contract_type, description) values
  ('multup_eurusd', 'MULTUP EUR/USD', 'frxEURUSD', 'MULTUP',
   'RSI oversold signal on EUR/USD with multiplier contract. Enters when RSI(14) < 30.')
on conflict (slug) do nothing;

-- ── BACKTEST RESULTS ─────────────────────────────────────────
create table if not exists trades_backtest_results (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references users(id) on delete cascade,
  strategy_slug    text not null,
  days             int not null,
  starting_balance numeric(12, 2) not null,
  final_balance    numeric(12, 2) not null,
  total_pnl        numeric(12, 2) not null,
  total_return_pct numeric(8, 4) not null,
  total_trades     int not null,
  wins             int not null,
  losses           int not null,
  win_rate         numeric(6, 2) not null,
  max_drawdown_pct numeric(6, 2) not null,
  profit_factor    numeric(8, 4),
  trades_skipped   int not null default 0,
  settings         jsonb not null default '{}',   -- user overrides applied
  equity_curve     jsonb not null default '[]',   -- array of balance snapshots
  trades           jsonb not null default '[]',   -- full trade log
  created_at       timestamptz not null default now()
);

create index on trades_backtest_results (user_id);
create index on trades_backtest_results (strategy_slug);

-- ── BOT SESSIONS ─────────────────────────────────────────────
-- One row per time a user starts the bot on a strategy.
create table if not exists bot_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references users(id) on delete cascade,
  strategy_slug text not null,
  status        text not null default 'running',  -- 'running' | 'stopped' | 'error'
  trades_placed int not null default 0,
  started_at    timestamptz not null default now(),
  stopped_at    timestamptz
);

create index on bot_sessions (user_id);

-- ── TRADES ───────────────────────────────────────────────────
-- Every individual trade placed by the bot (live, not backtest).
create table if not exists trades (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid references bot_sessions(id) on delete cascade,
  user_id       uuid references users(id) on delete cascade,
  strategy_slug text not null,
  contract_id   text,               -- Deriv contract ID returned from buy
  contract_type text not null,      -- MULTUP, CALL etc.
  symbol        text not null,
  stake         numeric(10, 2) not null,
  multiplier    int,                -- null for CALL/PUT
  outcome       text,               -- 'win' | 'loss' | 'open'
  pnl           numeric(10, 2),     -- null while open
  placed_at     timestamptz not null default now(),
  settled_at    timestamptz
);

create index on trades (user_id);
create index on trades (session_id);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
alter table users             enable row level security;
alter table trades_backtest_results  enable row level security;
alter table bot_sessions      enable row level security;
alter table trades            enable row level security;

-- Users can only see and modify their own rows.
-- The backend authenticates via service role key so it bypasses RLS;
-- these policies protect direct client-side queries.

create policy "users: own row only"
  on users for all
  using (deriv_account_id = current_setting('app.deriv_account_id', true));

create policy "trades_backtest_results: own rows only"
  on trades_backtest_results for all
  using (user_id = (
    select id from users
    where deriv_account_id = current_setting('app.deriv_account_id', true)
  ));

create policy "bot_sessions: own rows only"
  on bot_sessions for all
  using (user_id = (
    select id from users
    where deriv_account_id = current_setting('app.deriv_account_id', true)
  ));

create policy "trades: own rows only"
  on trades for all
  using (user_id = (
    select id from users
    where deriv_account_id = current_setting('app.deriv_account_id', true)
  ));

-- Strategies table is public read, no writes from client side
alter table strategies enable row level security;
create policy "strategies: public read"
  on strategies for select
  using (true);
