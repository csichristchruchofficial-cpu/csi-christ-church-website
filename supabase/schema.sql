-- ====================================================================
-- CSI CHRIST CHURCH - DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Run this SQL in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. CREATE ADMINS TABLE
-- Stores authorized administrator user IDs referencing auth.users
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast user lookup
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins (user_id);

-- 2. CREATE ANNOUNCEMENTS TABLE
-- Stores church updates and notifications with approval workflow
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Announcement', 'Prayer', 'Event')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index for efficient public queries (approved ordered by published_at)
CREATE INDEX IF NOT EXISTS idx_announcements_status_published 
  ON public.announcements (status, published_at DESC);

-- 3. HELPER FUNCTION: Check if the calling user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = auth.uid()
  );
$$;

-- 4. ROW LEVEL SECURITY (RLS) FOR ADMINS TABLE
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view admins if they are checking their own status or are already an admin
DROP POLICY IF EXISTS "Admins can view admin directory" ON public.admins;
CREATE POLICY "Admins can view admin directory"
  ON public.admins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- 5. ROW LEVEL SECURITY (RLS) FOR ANNOUNCEMENTS TABLE
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public users (anon and authenticated) can select ONLY approved announcements
DROP POLICY IF EXISTS "Public users can view approved announcements" ON public.announcements;
CREATE POLICY "Public users can view approved announcements"
  ON public.announcements
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Policy 2: Admins can view ALL announcements (pending, approved, rejected)
DROP POLICY IF EXISTS "Admins can view all announcements" ON public.announcements;
CREATE POLICY "Admins can view all announcements"
  ON public.announcements
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Policy 3: Admins can insert announcements
DROP POLICY IF EXISTS "Admins can insert announcements" ON public.announcements;
CREATE POLICY "Admins can insert announcements"
  ON public.announcements
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Policy 4: Admins can update announcements (approve, reject, edit)
DROP POLICY IF EXISTS "Admins can update announcements" ON public.announcements;
CREATE POLICY "Admins can update announcements"
  ON public.announcements
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policy 5: Admins can delete announcements
DROP POLICY IF EXISTS "Admins can delete announcements" ON public.announcements;
CREATE POLICY "Admins can delete announcements"
  ON public.announcements
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 6. CREATE PUSH_SUBSCRIPTIONS TABLE
-- Stores browser web push notification subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index on endpoint for quick lookup
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint 
  ON public.push_subscriptions (endpoint);

-- 7. ROW LEVEL SECURITY (RLS) FOR PUSH_SUBSCRIPTIONS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone (visitors on web/mobile) to register their push subscription
DROP POLICY IF EXISTS "Anyone can register push subscription" ON public.push_subscriptions;
CREATE POLICY "Anyone can register push subscription"
  ON public.push_subscriptions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to unsubscribe their own endpoint
DROP POLICY IF EXISTS "Anyone can remove their push subscription" ON public.push_subscriptions;
CREATE POLICY "Anyone can remove their push subscription"
  ON public.push_subscriptions
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Allow anyone to update/refresh their own push subscription (needed for upsert)
DROP POLICY IF EXISTS "Anyone can update push subscription" ON public.push_subscriptions;
CREATE POLICY "Anyone can update push subscription"
  ON public.push_subscriptions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Admins can view all subscriptions (for subscriber count & broadcasting)
DROP POLICY IF EXISTS "Admins can view push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Admins can view push subscriptions"
  ON public.push_subscriptions
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 8. CREATE CHURCH_PEOPLE_DATES TABLE
-- Stores birthdays and wedding anniversaries for congregation members
CREATE TABLE IF NOT EXISTS public.church_people_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date_of_birth DATE,
  anniversary_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_church_people_dates_dob 
  ON public.church_people_dates (date_of_birth);

CREATE INDEX IF NOT EXISTS idx_church_people_dates_anniversary 
  ON public.church_people_dates (anniversary_date);

CREATE INDEX IF NOT EXISTS idx_church_people_dates_name 
  ON public.church_people_dates (name);

-- 9. ROW LEVEL SECURITY (RLS) FOR CHURCH_PEOPLE_DATES
ALTER TABLE public.church_people_dates ENABLE ROW LEVEL SECURITY;

-- Allow public to view celebration dates for homepage display
DROP POLICY IF EXISTS "Public can view celebration dates" ON public.church_people_dates;
CREATE POLICY "Public can view celebration dates"
  ON public.church_people_dates
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow admins to insert celebration dates
DROP POLICY IF EXISTS "Admins can insert celebration dates" ON public.church_people_dates;
CREATE POLICY "Admins can insert celebration dates"
  ON public.church_people_dates
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Allow admins to update celebration dates
DROP POLICY IF EXISTS "Admins can update celebration dates" ON public.church_people_dates;
CREATE POLICY "Admins can update celebration dates"
  ON public.church_people_dates
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Allow admins to delete celebration dates
DROP POLICY IF EXISTS "Admins can delete celebration dates" ON public.church_people_dates;
CREATE POLICY "Admins can delete celebration dates"
  ON public.church_people_dates
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ====================================================================
-- HOW TO ADD YOUR FIRST ADMIN:
-- 1. In Supabase Dashboard -> Authentication -> Users, create an admin user
--    (e.g., csichristchruchofficial@gmail.com with a strong password).
-- 2. Copy the newly created User UID.
-- 3. Run the following query in the SQL Editor:
--
--    INSERT INTO public.admins (user_id, email)
--    VALUES ('PASTE_USER_UID_HERE', 'csichristchruchofficial@gmail.com');
-- ====================================================================

