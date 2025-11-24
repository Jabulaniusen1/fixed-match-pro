-- Update payment_methods table to support multiple countries and additional payment types
-- Step 1: Drop the RLS policy that depends on the country column
DROP POLICY IF EXISTS "Active payment methods are viewable by everyone" ON payment_methods;

-- Step 2: Add the new countries column (JSONB array)
ALTER TABLE payment_methods 
  ADD COLUMN IF NOT EXISTS countries JSONB DEFAULT '[]'::jsonb;

-- Step 3: Migrate existing country data to countries array (before dropping the column)
UPDATE payment_methods 
SET countries = CASE 
  WHEN country IS NOT NULL THEN jsonb_build_array(country)
  ELSE '[]'::jsonb
END
WHERE countries = '[]'::jsonb OR countries IS NULL;

-- Step 4: Now drop the old country column
ALTER TABLE payment_methods 
  DROP COLUMN IF EXISTS country;

-- Step 5: Update type constraint to include new payment method types
ALTER TABLE payment_methods 
  DROP CONSTRAINT IF EXISTS payment_methods_type_check;

ALTER TABLE payment_methods 
  ADD CONSTRAINT payment_methods_type_check 
  CHECK (type IN ('bank_transfer', 'crypto', 'mobile_money', 'skrill', 'paypal', 'other'));

-- Step 6: Create index for countries array
CREATE INDEX IF NOT EXISTS idx_payment_methods_countries ON payment_methods USING GIN (countries);

-- Step 7: Recreate RLS policy with the new countries array field
CREATE POLICY "Active payment methods are viewable by everyone" ON payment_methods
  FOR SELECT USING (
    is_active = true AND (
      countries = '[]'::jsonb OR 
      countries = 'null'::jsonb OR
      countries IS NULL OR
      EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND (
          users.country = ANY(SELECT jsonb_array_elements_text(payment_methods.countries))
          OR users.country IS NULL
        )
      )
    )
  );

