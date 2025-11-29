# Debugging Token Issues

## Your Token Analysis

I decoded your token and found:
- ✅ Token format is correct
- ✅ User ID: `692a2ce8104b01c4778b00cd`
- ✅ Roles: `["System Admin"]`
- ✅ Expiration: Valid (not expired)

## Common Issues & Fixes

### Issue 1: JWT_SECRET Mismatch

**Problem**: Token was created with one secret, but server is validating with a different secret.

**Fix**: Make sure JWT_SECRET is consistent:

1. **Check if you have a `.env` file:**
   ```bash
   # Create .env file in root directory
   JWT_SECRET=your-secret-key
   ```

2. **Or set it when starting server:**
   ```bash
   JWT_SECRET=your-secret-key npm run start:dev
   ```

3. **Default secret is**: `your-secret-key` (if no .env file)

### Issue 2: User ID Doesn't Exist

**Problem**: The user ID in the token (`692a2ce8104b01c4778b00cd`) might not exist in the database.

**Fix**: Verify the user exists:

1. **Login again to get a fresh token:**
   ```bash
   curl -X POST http://localhost:5000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "employeeNumber": "EMP-2025-0013",
       "password": "password123"
     }'
   ```

2. **Use the NEW token immediately**

### Issue 3: Token Format in Request

**Problem**: Token might not be sent correctly.

**Check in Swagger UI:**
1. Click "Authorize" button
2. Make sure you enter: `Bearer YOUR_TOKEN` (with space!)
3. Click "Authorize"
4. Click "Close"

**Check in curl:**
```bash
# Make sure header is exactly:
-H "Authorization: Bearer YOUR_TOKEN"
# NOT:
-H "Authorization: YOUR_TOKEN"  ❌
-H "Authorization: BearerYOUR_TOKEN"  ❌ (no space)
```

### Issue 4: Server Restarted

**Problem**: If you restarted the server, the JWT_SECRET might have changed.

**Fix**: Login again to get a new token with the current server's secret.

## Quick Test

Try this step-by-step:

1. **Stop the server** (Ctrl+C)

2. **Start fresh:**
   ```bash
   npm run start:dev
   ```

3. **Login immediately:**
   ```bash
   curl -X POST http://localhost:5000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "employeeNumber": "EMP-2025-0013",
       "password": "password123"
     }'
   ```

4. **Copy the NEW access_token**

5. **Use it immediately:**
   ```bash
   curl -X GET "http://localhost:5000/api/v1/employee-profile" \
     -H "Authorization: Bearer NEW_TOKEN_HERE"
   ```

## Verify Token is Working

Test with a simple endpoint first:

```bash
# This should work without authentication
curl -X GET "http://localhost:5000/api/v1/auth/login"
```

Then test with token:

```bash
# Get your profile (requires auth)
curl -X GET "http://localhost:5000/api/v1/employee-profile/me" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Still Not Working?

1. **Check server logs** - Look for JWT errors
2. **Verify employee exists:**
   - Employee Number: `EMP-2025-0013` should exist
   - If not, run: `npm run seed:employee`
3. **Try a different employee:**
   ```json
   {
     "employeeNumber": "EMP-2025-0012",
     "password": "password123"
   }
   ```
4. **Check if server is using correct JWT_SECRET:**
   - Look at server startup logs
   - Should show: `JWT_SECRET: your-secret-key` (or your custom value)

## Most Likely Fix

**Just login again and use the NEW token immediately!**

The token you have might have been created with a different JWT_SECRET or the user might have been deleted/recreated.

