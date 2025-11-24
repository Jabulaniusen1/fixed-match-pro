# Avatars Storage Bucket Setup Guide

This guide will help you set up the `avatars` storage bucket in Supabase so that new users can automatically receive random avatar images.

## Step 1: Create the Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Name the bucket: `avatars`
5. Set it as **Public bucket** (toggle ON)
6. Click **Create bucket**

## Step 2: Upload Avatar Images

1. After creating the bucket, click on it to open it
2. Click **Upload file** or drag and drop image files
3. Upload multiple avatar images (jpg, png, gif, webp, or svg format)
4. Make sure the files are directly in the root of the bucket (not in subfolders)

**Recommended:**
- Upload at least 10-20 different avatar images for variety
- Use square images (e.g., 200x200px or 400x400px) for best results
- Supported formats: JPG, PNG, GIF, WEBP, SVG

## Step 3: Set Storage Policies (RLS)

The bucket needs to allow public read access so that avatar URLs can be accessed.

### Option A: Via Supabase Dashboard

1. Go to **Storage** → **Policies** → Select `avatars` bucket
2. Click **New Policy**
3. Create a policy for **SELECT** (Read):
   - Policy name: `Allow public read access to avatars`
   - Allowed operation: `SELECT`
   - Target roles: `public`
   - Policy definition:
     ```sql
     bucket_id = 'avatars'
     ```

### Option B: Via SQL Editor

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable RLS on storage.objects if not already
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public read access to avatars" ON storage.objects;

-- Create policy for public read access
CREATE POLICY "Allow public read access to avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

## Step 4: Verify Setup

1. Check that the bucket exists and is public
2. Verify that you have uploaded image files
3. Test by signing up a new user
4. Check the browser console for logs showing:
   - "Attempting to list files in avatars bucket..."
   - "Found X files in avatars bucket"
   - "Selected random avatar: [filename]"
   - "Generated public URL: [url]"

## Troubleshooting

### Avatar URL is null in database

**Possible causes:**
1. **Bucket doesn't exist**: Make sure the bucket is named exactly `avatars`
2. **No files in bucket**: Upload some image files to the bucket
3. **RLS policies**: Make sure public read access is enabled
4. **Bucket is private**: The bucket must be set as public
5. **Wrong file format**: Only image files (jpg, png, gif, webp, svg) are recognized

**Check browser console:**
- Look for error messages when signing up
- Check the logs to see what step is failing

### Files not being detected

- Make sure files are in the root of the bucket, not in subfolders
- Verify file extensions are lowercase (e.g., `.jpg` not `.JPG`)
- Check that files are actually uploaded (refresh the storage page)

### Permission errors

- Ensure the bucket is set to **Public**
- Verify RLS policies allow `SELECT` for `public` role
- Check that the anon key has proper permissions

## Testing

After setup, test by:
1. Signing up a new user account
2. Checking the `users` table in the database
3. Verifying the `avatar_url` column has a value
4. The URL should point to an image in your avatars bucket

## Notes

- The system will automatically assign a random avatar to each new user
- If no avatars are found, the `avatar_url` will be `null`
- Users can change their avatar later through profile settings (if implemented)
- The function logs detailed information to help with debugging

