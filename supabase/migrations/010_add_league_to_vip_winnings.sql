-- Add league column to vip_winnings table
ALTER TABLE vip_winnings 
ADD COLUMN IF NOT EXISTS league VARCHAR(255);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_vip_winnings_league ON vip_winnings(league);

