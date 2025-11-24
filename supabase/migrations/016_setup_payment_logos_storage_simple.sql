-- Alternative simpler storage policies for payment-logos bucket
-- Use this if the admin check policies don't work
-- NOTE: Storage policies must be created via Supabase Dashboard
-- Run the bucket creation SQL below, then create policies via Dashboard

-- Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-logos', 'payment-logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ============================================================================
-- Create these policies via Dashboard (Storage > payment-logos > Policies):
-- ============================================================================
--
-- POLICY 1: INSERT (Allow all authenticated users)
-- Name: "Allow authenticated users to upload payment logos"
-- Operation: INSERT
-- Target roles: authenticated
-- USING: (empty)
-- WITH CHECK: bucket_id = 'payment-logos'
--
-- POLICY 2: UPDATE
-- Name: "Allow authenticated users to update payment logos"
-- Operation: UPDATE
-- Target roles: authenticated
-- USING: bucket_id = 'payment-logos'
-- WITH CHECK: bucket_id = 'payment-logos'
--
-- POLICY 3: DELETE
-- Name: "Allow authenticated users to delete payment logos"
-- Operation: DELETE
-- Target roles: authenticated
-- USING: bucket_id = 'payment-logos'
-- WITH CHECK: (empty)
--
-- POLICY 4: SELECT (Public read)
-- Name: "Allow public read access to payment logos"
-- Operation: SELECT
-- Target roles: public
-- USING: bucket_id = 'payment-logos'
-- WITH CHECK: (empty)

