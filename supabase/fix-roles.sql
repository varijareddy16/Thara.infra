-- ============================================================
-- THARA INFRA — Role Fix Migration
-- Run this in Supabase SQL Editor AFTER the main schema.sql
-- ============================================================

-- 1. Drop the old user_role enum and recreate with only 2 roles
--    (skip if you haven't run schema.sql yet — schema.sql already has this)

-- 2. Fix RLS on profiles so users can always read their own row
--    (this was blocking role detection in the frontend)

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Allow any authenticated user to read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow admins to view ALL profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Allow users to update their own profile (name, phone, avatar)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR update
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow admins to update any profile (for role changes)
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 3. Ensure your admin user has the correct role
--    Replace the UUID below with your actual user ID
-- UPDATE public.profiles SET role = 'admin'
-- WHERE id = 'eace0380-d18d-42d4-bb8d-adf06670c32b';

-- 4. Verify — should show role = 'admin' for your user
SELECT id, full_name, role FROM public.profiles;
