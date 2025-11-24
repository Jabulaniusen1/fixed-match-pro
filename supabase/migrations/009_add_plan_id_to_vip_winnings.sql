-- Add plan_id column to vip_winnings table
ALTER TABLE vip_winnings 
ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES plans(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_vip_winnings_plan_id ON vip_winnings(plan_id);
CREATE INDEX IF NOT EXISTS idx_vip_winnings_date ON vip_winnings(date);

-- Update RLS policies to allow admins to manage VIP winnings
DROP POLICY IF EXISTS "Admins can insert VIP winnings" ON vip_winnings;
CREATE POLICY "Admins can insert VIP winnings" ON vip_winnings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can update VIP winnings" ON vip_winnings;
CREATE POLICY "Admins can update VIP winnings" ON vip_winnings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete VIP winnings" ON vip_winnings;
CREATE POLICY "Admins can delete VIP winnings" ON vip_winnings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

