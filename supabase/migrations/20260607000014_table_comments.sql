-- Table descriptions
comment on table trades_custom_users is
  'Mirror of auth.users. Auto-populated via trigger on signup. Stores Deriv OAuth tokens and account metadata.';

comment on table trades_strategies is
  'Platform strategies. Each row is a deployable algorithm with a unique slug used across the app.';

comment on table trades_trades is
  'Live and demo trades executed by the bot. Each row is one contract placed on Deriv.';

comment on table trades_backtest_results is
  'One row per backtest run. Results are stored as JSONB — shape varies by strategy type.';

comment on table trades_strategy_settings is
  'Deduplicated settings combos. One row per unique (strategy_slug, settings) pair. Linked from both backtest results and live trades.';

comment on table trades_running_strategy_accounts is
  'Tracks actively running bots. A row exists only while a bot is running. Deleted on explicit user stop. Used to resume bots after server restart.';

comment on table trades_leaderboard is
  'Aggregated performance metrics per strategy. Updated periodically from live trade results.';

comment on table trades_bookings is
  'Strategy consultation call bookings submitted via the /submit page.';

-- Key column descriptions
comment on column trades_custom_users.deriv_token is
  'Current Deriv OAuth access token (ory_at_... format, expires ~1 hour).';
comment on column trades_custom_users.deriv_refresh_token is
  'Deriv refresh token used to obtain a new access token without re-authenticating.';
comment on column trades_custom_users.deriv_accounts is
  'JSONB array of Deriv accounts returned from OAuth. Each entry has loginid, token, currency.';

comment on column trades_trades.contract_id is
  'Deriv contract reference ID returned on successful buy.';
comment on column trades_trades.settings_id is
  'FK to the strategy settings used when this trade was placed.';
comment on column trades_trades.strategy_slug is
  'Denormalised slug for fast filtering without joining trades_strategies.';

comment on column trades_strategy_settings.settings is
  'JSONB of strategy parameters (stake, duration, symbol, contract_type, etc.). Unique per strategy_slug.';
comment on column trades_strategy_settings.user_id is
  'The user who first created this settings combination.';

comment on column trades_running_strategy_accounts.deriv_token is
  'Access token in use at the time the bot was started. Used to resume after restart.';
comment on column trades_running_strategy_accounts.auth_id is
  'Supabase auth UUID — used by the backend to call the token refresh endpoint.';

comment on column trades_backtest_results.results is
  'JSONB summary metrics. Rise/Fall shape: {total_return_pct, win_rate, profit_factor, avg_win, avg_loss, total_trades, final_balance}. Multipliers shape: {total_return_pct, max_drawdown_pct, profit_factor, total_trades, final_balance}.';
