alter table trades_custom_users
  add column if not exists deriv_refresh_token text,
  add column if not exists deriv_token_expires_at timestamptz;
