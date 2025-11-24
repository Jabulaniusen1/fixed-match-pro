# Storage Policy Setup Guide for Payment Logos Bucket

## Quick Setup (Recommended)

### Step 1: Run the Migration
Run the SQL migration `014_setup_logo_storage_policies.sql` in your Supabase SQL Editor to create the bucket.

### Step 2: Create Policies via Dashboard
Storage policies **CANNOT** be created via SQL. You **MUST** create them through the Supabase Dashboard.

## Step-by-Step Instructions

### 1. Create/Verify the Bucket
1. Go to **Supabase Dashboard** → **Storage**
2. If the `payment-logos` bucket doesn't exist, click **"New bucket"**
   - Name: `payment-logos`
   - Public bucket: **Yes** (toggle ON)
   - Click **"Create bucket"**

   OR run this SQL:
   ```sql
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('payment-logos', 'payment-logos', true)
   ON CONFLICT (id) DO UPDATE SET public = true;
   ```

### 2. Set Up Policies

Go to **Storage** → **payment-logos** → **Policies** tab

#### Policy 1: INSERT (Upload) - Copy this EXACTLY

**Click "New Policy"**

- **Policy name:** `Allow authenticated admins to upload payment logos`
- **Allowed operation:** `INSERT`
- **Target roles:** `authenticated`
- **Policy definition:**
  - **WITH CHECK expression** (paste this):
```sql
bucket_id = 'payment-logos' AND EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
```

#### Policy 2: UPDATE - Copy this EXACTLY

**Click "New Policy"**

- **Policy name:** `Allow authenticated admins to update payment logos`
- **Allowed operation:** `UPDATE`
- **Target roles:** `authenticated`
- **Policy definition:**
  - **USING expression:**
```sql
bucket_id = 'payment-logos' AND EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
```
  - **WITH CHECK expression:**
```sql
bucket_id = 'payment-logos' AND EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
```

#### Policy 3: DELETE - Copy this EXACTLY

**Click "New Policy"**

- **Policy name:** `Allow authenticated admins to delete payment logos`
- **Allowed operation:** `DELETE`
- **Target roles:** `authenticated`
- **Policy definition:**
  - **USING expression:**
```sql
bucket_id = 'payment-logos' AND EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
```

#### Policy 4: SELECT (Public Read) - Copy this EXACTLY

**Click "New Policy"**

- **Policy name:** `Allow public read access to payment logos`
- **Allowed operation:** `SELECT`
- **Target roles:** `public`
- **Policy definition:**
  - **USING expression:**
```sql
bucket_id = 'payment-logos'
```

## Alternative: Simpler Policy (If Admin Check Doesn't Work)

If you're still getting errors, try this simpler policy first to test:

**INSERT Policy (Simplified):**
- **Policy name:** `Allow authenticated users to upload payment logos`
- **Allowed operation:** `INSERT`
- **Target roles:** `authenticated`
- **WITH CHECK expression:**
```sql
bucket_id = 'payment-logos'
```

This allows ANY authenticated user to upload. Once it works, you can add the admin check back.

## Verify Your Admin Status

Run this in **Supabase SQL Editor**:

```sql
SELECT id, email, is_admin FROM users WHERE id = auth.uid();
```

Make sure `is_admin = true` for your user. If not, update it:

```sql
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
```

## Troubleshooting

1. **Still getting RLS errors?** 
   - Try the simplified policy (without admin check) first
   - Make sure you've created ALL 4 policies (INSERT, UPDATE, DELETE, SELECT)
   
2. **Bucket not found?** 
   - Make sure the bucket name is exactly `payment-logos` (with hyphen)
   - Run the bucket creation SQL if needed
   
3. **Policies not saving?** 
   - Make sure you're using the correct SQL syntax in the policy editor
   - Check that you're selecting the right operation (INSERT, UPDATE, DELETE, SELECT)
   
4. **Admin check failing?** 
   - Verify your user has `is_admin = true` in the users table
   - Try the simplified policy first to test if the issue is with the admin check
   
5. **"must be owner of table objects" error?**
   - This is normal! Storage policies MUST be created via Dashboard, not SQL
   - Follow the Dashboard instructions above

