-- Drop the text CHECK constraint added in the previous migration
ALTER TABLE trades_custom_users DROP CONSTRAINT trades_custom_users_role_check;

-- Create enum type for user roles
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Convert the role column to use the enum
ALTER TABLE trades_custom_users
  ALTER COLUMN role DROP DEFAULT,
  ALTER COLUMN role TYPE user_role USING role::user_role,
  ALTER COLUMN role SET DEFAULT 'user';

COMMENT ON COLUMN trades_custom_users.role IS 'User role — select user or admin from the dropdown.';
