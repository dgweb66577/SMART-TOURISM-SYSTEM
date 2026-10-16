-- Migration: 20250101000000_init_roles.sql
-- Description: Initialize RBAC roles enum, user_roles table, places table, triggers, and Row Level Security policies.

-- 1. Create Role Enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('user', 'platform_admin', 'place_incharge');
  END IF;
END $$;

-- 2. Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- 3. Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Attach updated_at trigger to user_roles
DROP TRIGGER IF EXISTS trigger_user_roles_updated_at ON public.user_roles;
CREATE TRIGGER trigger_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Create places table
CREATE TABLE IF NOT EXISTS public.places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  contact_phone TEXT,
  contact_email TEXT,
  opening_hours JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_places_owner_id ON public.places(owner_id);
CREATE INDEX IF NOT EXISTS idx_places_status ON public.places(status);
CREATE INDEX IF NOT EXISTS idx_places_category ON public.places(category);

-- Attach updated_at trigger to places
DROP TRIGGER IF EXISTS trigger_places_updated_at ON public.places;
CREATE TRIGGER trigger_places_updated_at
  BEFORE UPDATE ON public.places
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. Helper function for RLS: Check if current user is platform_admin
-- Marked SECURITY DEFINER to bypass RLS recursion on user_roles
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = check_user_id AND role = 'platform_admin'
  );
$$;

-- 6. Trigger: Automatically assign default 'user' role on auth.users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies for user_roles
-- Users read their own roles
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Platform admins can read all roles
DROP POLICY IF EXISTS "Platform admins can read all roles" ON public.user_roles;
CREATE POLICY "Platform admins can read all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Platform admins can insert roles
DROP POLICY IF EXISTS "Platform admins can insert roles" ON public.user_roles;
CREATE POLICY "Platform admins can insert roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Platform admins can update roles
DROP POLICY IF EXISTS "Platform admins can update roles" ON public.user_roles;
CREATE POLICY "Platform admins can update roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Platform admins can delete roles
DROP POLICY IF EXISTS "Platform admins can delete roles" ON public.user_roles;
CREATE POLICY "Platform admins can delete roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 9. RLS Policies for places
-- Anyone (authenticated or anonymous) can read approved places
DROP POLICY IF EXISTS "Anyone can read approved places" ON public.places;
CREATE POLICY "Anyone can read approved places"
  ON public.places
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Place owners can view all their own places (including pending/rejected)
DROP POLICY IF EXISTS "Owners can view own places" ON public.places;
CREATE POLICY "Owners can view own places"
  ON public.places
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

-- Place owners can insert places
DROP POLICY IF EXISTS "Owners can insert own places" ON public.places;
CREATE POLICY "Owners can insert own places"
  ON public.places
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Place owners can update own places
DROP POLICY IF EXISTS "Owners can update own places" ON public.places;
CREATE POLICY "Owners can update own places"
  ON public.places
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Place owners can delete own places
DROP POLICY IF EXISTS "Owners can delete own places" ON public.places;
CREATE POLICY "Owners can delete own places"
  ON public.places
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Platform admins have full CRUD access to all places
DROP POLICY IF EXISTS "Admins have full CRUD access to places" ON public.places;
CREATE POLICY "Admins have full CRUD access to places"
  ON public.places
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
