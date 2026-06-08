-- ── trades_strategy_settings: UUID → bigserial ───────────────────────────────

-- 1. Add a temporary integer id column (auto-assigns sequential values)
alter table trades_strategy_settings add column int_id bigserial;

-- 2. Add temporary integer FK columns to referencing tables
alter table trades_backtest_results add column settings_id_int bigint;
alter table trades_trades            add column settings_id_int bigint;

-- 3. Populate the new integer FK columns via the current UUID link
update trades_backtest_results tbr
set settings_id_int = tss.int_id
from trades_strategy_settings tss
where tbr.settings_id = tss.id;

update trades_trades tt
set settings_id_int = tss.int_id
from trades_strategy_settings tss
where tt.settings_id = tss.id;

-- 4. Drop old UUID FK constraints and columns
alter table trades_backtest_results
  drop constraint trades_backtest_results_settings_id_fkey,
  drop column settings_id;

alter table trades_trades
  drop constraint trades_trades_settings_id_fkey,
  drop column settings_id;

-- 5. Swap the PK on trades_strategy_settings
alter table trades_strategy_settings drop constraint trades_strategy_settings_pkey;
alter table trades_strategy_settings drop column id;
alter table trades_strategy_settings rename column int_id to id;
alter table trades_strategy_settings add primary key (id);

-- 6. Rename new FK columns and add constraints
alter table trades_backtest_results rename column settings_id_int to settings_id;
alter table trades_trades            rename column settings_id_int to settings_id;

alter table trades_backtest_results
  add constraint trades_backtest_results_settings_id_fkey
  foreign key (settings_id) references trades_strategy_settings(id) on delete set null;

alter table trades_trades
  add constraint trades_trades_settings_id_fkey
  foreign key (settings_id) references trades_strategy_settings(id) on delete set null;


-- ── trades_strategy_accounts: UUID → bigserial ───────────────────────────────
-- Nothing references this id, so just swap the PK column

alter table trades_strategy_accounts add column int_id bigserial;
alter table trades_strategy_accounts drop constraint trades_strategy_accounts_pkey;
alter table trades_strategy_accounts drop column id;
alter table trades_strategy_accounts rename column int_id to id;
alter table trades_strategy_accounts add primary key (id);
