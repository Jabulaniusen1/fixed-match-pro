-- Setup storage bucket for payment-logos
-- Run this in Supabase SQL Editor

-- First, ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-logos', 'payment-logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Try to create policies directly (same way as payment-proofs bucket)
-- If this fails with "must be owner" error, create policies via Dashboard instead

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Authenticated users can upload payment logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update payment logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete payment logos" ON storage.objects;
DROP POLICY IF EXISTS "Public can read payment logos" ON storage.objects;

-- Policy: Authenticated users can upload payment logos
CREATE POLICY "Authenticated users can upload payment logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-logos');

-- Policy: Authenticated users can update payment logos
CREATE POLICY "Authenticated users can update payment logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'payment-logos')
WITH CHECK (bucket_id = 'payment-logos');

-- Policy: Authenticated users can delete payment logos
CREATE POLICY "Authenticated users can delete payment logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'payment-logos');

-- Policy: Public can read payment logos
CREATE POLICY "Public can read payment logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'payment-logos');

-- ============================================================================
-- NOTE: If the above CREATE POLICY commands fail with "must be owner" error,
-- you need to create the policies via Supabase Dashboard instead.
-- ============================================================================
-- 
-- Follow these steps:
-- 
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to: Storage > payment-logos > Policies
-- 3. Click "New Policy" and create the following 4 policies:
--
-- ============================================================================
-- POLICY 1: INSERT (Allow authenticated admins to upload)
-- ============================================================================
-- Name: "Allow authenticated admins to upload payment logos"
-- Allowed operation: INSERT
-- Target roles: authenticated
-- USING expression: (leave empty)
-- WITH CHECK expression:
--   bucket_id = 'payment-logos' 
--   AND EXISTS (
--     SELECT 1 FROM users 
--     WHERE users.id = auth.uid() 
--     AND users.is_admin = true
--   )
--
-- ============================================================================
-- POLICY 2: UPDATE (Allow authenticated admins to update)
-- ============================================================================
-- Name: "Allow authenticated admins to update payment logos"
-- Allowed operation: UPDATE
-- Target roles: authenticated
-- USING expression:
--   bucket_id = 'payment-logos' 
--   AND EXISTS (
--     SELECT 1 FROM users 
--     WHERE users.id = auth.uid() 
--     AND users.is_admin = true
--   )
-- WITH CHECK expression:
--   bucket_id = 'payment-logos' 
--   AND EXISTS (
--     SELECT 1 FROM users 
--     WHERE users.id = auth.uid() 
--     AND users.is_admin = true
--   )
--
-- ============================================================================
-- POLICY 3: DELETE (Allow authenticated admins to delete)
-- ============================================================================
-- Name: "Allow authenticated admins to delete payment logos"
-- Allowed operation: DELETE
-- Target roles: authenticated
-- USING expression:
--   bucket_id = 'payment-logos' 
--   AND EXISTS (
--     SELECT 1 FROM users 
--     WHERE users.id = auth.uid() 
--     AND users.is_admin = true
--   )
-- WITH CHECK expression: (leave empty)
--
-- ============================================================================
-- POLICY 4: SELECT (Allow public read access)
-- ============================================================================
-- Name: "Allow public read access to payment logos"
-- Allowed operation: SELECT
-- Target roles: public
-- USING expression:
--   bucket_id = 'payment-logos'
-- WITH CHECK expression: (leave empty)
--
-- ============================================================================
-- ALTERNATIVE: If admin check doesn't work, use this simpler INSERT policy:
-- ============================================================================
-- Name: "Allow authenticated users to upload payment logos"
-- Allowed operation: INSERT
-- Target roles: authenticated
-- USING expression: (leave empty)
-- WITH CHECK expression:
--   bucket_id = 'payment-logos'
--
-- This allows ALL authenticated users to upload (not just admins)
-- You can use this for testing, then switch to admin-only policies later

