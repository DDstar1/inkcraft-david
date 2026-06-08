-- Link auth.users to our custom users table
ALTER TABLE trades_custom_users
  ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

-- Function: called whenever a new auth user is inserted (Google, email, etc.)
CREATE OR REPLACE FUNCTION public.sync_auth_user_to_custom()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.trades_custom_users (auth_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (auth_id) DO UPDATE SET
    email      = EXCLUDED.email,
    full_name  = COALESCE(EXCLUDED.full_name,  trades_custom_users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, trades_custom_users.avatar_url);

  RETURN NEW;
END;
$$;

-- Fire after every new auth user row (covers Google, email, any future provider)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_auth_user_to_custom();
