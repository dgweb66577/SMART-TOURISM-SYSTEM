-- Migration: Update handle_new_user trigger to support place_incharge role from metadata
-- When a place owner registers, they pass raw_user_meta_data->>'role' = 'place_incharge'
-- The trigger reads this and sets the correct role (only 'user' or 'place_incharge' allowed — never 'platform_admin')

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_requested_role TEXT;
  v_assigned_role  public.user_role;
BEGIN
  -- Read the requested role from signup metadata
  v_requested_role := NEW.raw_user_meta_data->>'role';

  -- Only allow safe roles through self-registration (never platform_admin)
  IF v_requested_role = 'place_incharge' THEN
    v_assigned_role := 'place_incharge';
  ELSE
    v_assigned_role := 'user';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_assigned_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;
