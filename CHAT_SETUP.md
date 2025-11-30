# Chat Feature Setup Guide

## Database Setup

1. Run the schema migration in Supabase to create the `messages` table:
   ```sql
   -- The messages table is already defined in supabase/schema.sql
   ```

2. **IMPORTANT: Enable Real-time Replication**
   
   For real-time updates to work, you must enable replication for the `messages` table in Supabase:
   
   - Go to your Supabase Dashboard
   - Navigate to **Database** → **Replication**
   - Find the `messages` table
   - Toggle the switch to enable replication
   
   Without this step, messages will not update in real-time and users will need to refresh the page to see new messages.

## Features

- ✅ Real-time message updates (requires replication enabled)
- ✅ Read/unread status tracking
- ✅ User search (admin side)
- ✅ Message history
- ✅ Optimistic UI updates (messages appear immediately when sent)

## Troubleshooting

If messages are not updating in real-time:

1. **Check if replication is enabled (REQUIRED):**
   - Go to Supabase Dashboard → Database → Replication
   - Ensure `messages` table has replication enabled
   - **This is the most common issue - real-time won't work without replication enabled**

2. **Check browser console:**
   - Open browser DevTools (F12)
   - Look for subscription status messages
   - Should see "Successfully subscribed to messages" when connected
   - If you see "CHANNEL_ERROR" or "TIMED_OUT", check your Supabase connection

3. **Check network tab:**
   - Look for WebSocket connections to Supabase
   - Should see a persistent WebSocket connection
   - Connection should be to `wss://[your-project].supabase.co/realtime/v1/websocket`

4. **Verify RLS policies:**
   - Ensure Row Level Security policies allow users to read their own messages
   - Ensure admins can read all messages

5. **Test real-time subscription:**
   - Open two browser windows (one as user, one as admin)
   - Send a message from one window
   - Check console logs in both windows
   - Message should appear automatically in the other window within 1-2 seconds

6. **Fallback behavior:**
   - If real-time fails, the app will automatically retry loading messages
   - Messages are also added optimistically when you send them (appear immediately)

## Testing

1. Open two browser windows:
   - Window 1: Login as a regular user → Go to `/dashboard/chat`
   - Window 2: Login as admin → Go to `/admin/chat`

2. Send a message from the user window
3. The message should appear immediately in the admin window (if replication is enabled)
4. Reply from the admin window
5. The reply should appear immediately in the user window

