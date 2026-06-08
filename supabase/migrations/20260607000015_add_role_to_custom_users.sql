-- Add role column to trades_custom_users
ALTER TABLE trades_custom_users
  ADD COLUMN role text NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

COMMENT ON COLUMN trades_custom_users.role IS 'User role: user or admin. Change directly in Supabase to promote/demote admins.';

-- Allow users to read their own row (needed for admin role check on the frontend)
CREATE POLICY "Users can read own profile"
  ON trades_custom_users
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = auth_id);
