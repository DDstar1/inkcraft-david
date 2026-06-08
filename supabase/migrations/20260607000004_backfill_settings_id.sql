-- Step 1: Insert every distinct (strategy_slug, settings) that isn't already in the table
insert into trades_strategy_settings (strategy_slug, settings)
select distinct on (strategy_slug, settings::text)
  strategy_slug,
  settings
from trades_backtest_results
where settings_id is null
on conflict do nothing;

-- Step 2: Point settings_id at the matching row
update trades_backtest_results tbr
set settings_id = tss.id
from trades_strategy_settings tss
where tbr.settings_id is null
  and tbr.strategy_slug = tss.strategy_slug
  and tbr.settings::text = tss.settings::text;
