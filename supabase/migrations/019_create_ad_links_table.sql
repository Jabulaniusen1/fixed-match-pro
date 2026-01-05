-- Create ad_links table for managing advertisement links
CREATE TABLE IF NOT EXISTS ad_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_ad_links_is_active ON ad_links(is_active);
CREATE INDEX IF NOT EXISTS idx_ad_links_display_order ON ad_links(display_order);

-- Enable Row Level Security
ALTER TABLE ad_links ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active ad links
DROP POLICY IF EXISTS "Active ad links are viewable by everyone" ON ad_links;
CREATE POLICY "Active ad links are viewable by everyone" ON ad_links
  FOR SELECT USING (is_active = true);

-- Policy: Admins can view all ad links
DROP POLICY IF EXISTS "Admins can view all ad links" ON ad_links;
CREATE POLICY "Admins can view all ad links" ON ad_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Policy: Admins can insert ad links
DROP POLICY IF EXISTS "Admins can insert ad links" ON ad_links;
CREATE POLICY "Admins can insert ad links" ON ad_links
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Policy: Admins can update ad links
DROP POLICY IF EXISTS "Admins can update ad links" ON ad_links;
CREATE POLICY "Admins can update ad links" ON ad_links
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Policy: Admins can delete ad links
DROP POLICY IF EXISTS "Admins can delete ad links" ON ad_links;
CREATE POLICY "Admins can delete ad links" ON ad_links
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );
