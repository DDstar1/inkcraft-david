-- Add the user who first created these settings (informational, not part of uniqueness)
alter table trades_strategy_settings
  add column if not exists user_id uuid references trades_custom_users(id) on delete set null;
