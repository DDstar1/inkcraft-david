-- Drop the FK pointing at auth.users
alter table trades_backtest_results
  drop constraint if exists backtest_results_user_id_fkey;

-- Remap existing values: auth UUID → trades_custom_users internal id
update trades_backtest_results tbr
set user_id = tcu.id
from trades_custom_users tcu
where tcu.auth_id = tbr.user_id;

-- Add correct FK to trades_custom_users
alter table trades_backtest_results
  add constraint backtest_results_user_id_fkey
  foreign key (user_id) references trades_custom_users(id) on delete set null;
