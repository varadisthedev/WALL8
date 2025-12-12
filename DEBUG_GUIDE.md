# MongoDB Data Not Persisting - Debug Guide

## Current Status
✅ **Backend Server**: Running on `http://localhost:5000`
✅ **MongoDB Connection**: Connected to `test` database
✅ **Frontend**: Running on `http://localhost:5173`

## Issue
MongoDB collection `test.users` is empty despite app being in use.

## Root Cause Analysis

### 1. **Backend Was Not Running**
The backend server needs to be running for data to persist. I just started it for you.

### 2. **Authentication Flow Issue**
User needs to:
1. Sign in with Clerk → Triggers `/api/user/sync` call
2. Complete onboarding → Triggers `/api/user/onboarding` call
3. Add expenses → Triggers `/api/expenses` POST call

## Step-by-Step Debug Process

### Check 1: Verify Backend is Running
```bash
# In server directory
npm start
```
**Expected Output**: Should see:
- ✅ Connected to MongoDB
- 📦 Active Database: test
- 🚀 Server started at http://localhost:5000

### Check 2: Test Backend Health
Open browser to: `http://localhost:5000/api/health`

**Expected Response**:
```json
{
  "success": true,
  "message": "Server is running",
  "clerkEnabled": true
}
```

### Check 3: Check Browser Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Look for these API calls:
   - `POST /api/user/sync` - Should return 200 with user data
   - `POST /api/user/onboarding` - Should return 200 after form submit

### Check 4: Monitor Server Logs
Watch the server terminal for:
- Incoming requests
- Database operations
- Any error messages

## Expected Data Flow

### New User Login:
1. **Login** → Clerk authenticates
2. **App.jsx** → Calls `/api/user/sync` 
   - Creates user in MongoDB `users` collection
   - Returns `profileCompleted: false`
3. **Redirect** → `/onboarding`
4. **Submit Form** → Calls `/api/user/onboarding`
   - Updates user profile
   - Sets `profileCompleted: true`
5. **Redirect** → `/dashboard`
6. **Add Expense** → Calls `/api/expenses`
   - Creates document in `expenses` collection

### What Should Be in MongoDB:
- **users** collection: 1 document with your email
- **expenses** collection: Documents for each expense added

## Quick Fix Checklist

- [x] Backend server is running
- [ ] Frontend can reach backend (check Network tab)
- [ ] User successfully logs in with Clerk
- [ ] `/api/user/sync` is called after login
- [ ] Onboarding form submits successfully
- [ ] Check MongoDB Compass - Refresh the collections view

## Common Issues

### Issue: "User not found" error
**Fix**: The user sync endpoint creates the user. Make sure:
1. Backend is running BEFORE you log in
2. Check server logs for errors
3. Refresh browser after backend starts

### Issue: Data not appearing in MongoDB
**Fix**: 
1. Click "Refresh" in MongoDB Compass
2. The data appears after API calls, not automatically
3. Check both `users` and `expenses` collections

### Issue: CORS errors in browser console
**Fix**: Already configured for localhost:5173, restart backend if needed

## Testing Right Now

1. **Refresh MongoDB Compass** - Click the refresh icon
2. **Log in to the app** at `http://localhost:5173`
3. **Watch the server terminal** for incoming requests
4. **Check browser console** for any errors
5. **Complete onboarding** if redirected
6. **Refresh MongoDB Compass again**

You should now see a user document!

## Server Logs to Watch For

```
POST /api/user/sync - Should log when you log in
Updating existing user [email] with new Clerk ID - If user exists
✅ Connected to MongoDB
📦 Active Database: test
```
