-- Add temporary integer id
alter table trades_strategies add column int_id bigserial;

-- Add temporary integer FK columns on referencing tables
alter table trades_trades      add column strategy_id_int bigint;
alter table trades_leaderboard add column strategy_id_int bigint;

-- Populate via existing UUID link
update trades_trades tt
set strategy_id_int = ts.int_id
from trades_strategies ts
where tt.strategy_id = ts.id;

update trades_leaderboard tl
set strategy_id_int = ts.int_id
from trades_strategies ts
where tl.strategy_id = ts.id;

-- Drop old UUID FK constraints and columns
alter table trades_trades
  drop constraint trades_trades_strategy_id_fkey,
  drop column strategy_id;

alter table trades_leaderboard
  drop constraint trades_leaderboard_strategy_id_fkey,
  drop column strategy_id;

-- Swap PK on trades_strategies
alter table trades_strategies drop constraint trades_strategies_pkey;
alter table trades_strategies drop column id;
alter table trades_strategies rename column int_id to id;
alter table trades_strategies add primary key (id);

-- Rename FK columns and add new constraints
alter table trades_trades      rename column strategy_id_int to strategy_id;
alter table trades_leaderboard rename column strategy_id_int to strategy_id;

alter table trades_trades
  add constraint trades_trades_strategy_id_fkey
  foreign key (strategy_id) references trades_strategies(id) on delete set null;

alter table trades_leaderboard
  add constraint trades_leaderboard_strategy_id_fkey
  foreign key (strategy_id) references trades_strategies(id) on delete cascade;
