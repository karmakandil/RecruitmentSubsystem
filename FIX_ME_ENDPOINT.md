# Fixing /me Endpoint Issues

## The Problem

The `/me` endpoint requires:
1. Valid JWT token
2. Token must contain `userId` (from `sub` field)
3. User ID must exist in database

## Debugging Steps

### Step 1: Check What Error You're Getting

**In Swagger UI:**
- Look at the response body
- Check the status code
- Read the error message

**Common errors:**
- `401 Unauthorized` - Token issue
- `404 Not Found` - User ID doesn't exist
- `400 Bad Request` - Invalid user ID format

### Step 2: Verify Your Token Contains User ID

Your token should have a `sub` field which becomes `userId`. 

**Decode your token** (use jwt.io or run):
```bash
node -e "console.log(JSON.stringify(require('jsonwebtoken').decode('YOUR_TOKEN'), null, 2))"
```

Look for:
```json
{
  "sub": "692a2ce8104b01c4778b00cd",  ← This becomes userId
  "username": "EMP-2025-0013",
  "roles": ["System Admin"]
}
```

### Step 3: Verify User Exists in Database

The user ID from your token (`692a2ce8104b01c4778b00cd`) must exist in the database.

**Check by trying to get the user directly:**
```bash
# First, login to get a token
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"employeeNumber": "EMP-2025-0013", "password": "password123"}' \
  | jq -r '.access_token')

# Try to get user by ID (replace with actual ID from token)
curl -X GET "http://localhost:5000/api/v1/employee-profile/692a2ce8104b01c4778b00cd" \
  -H "Authorization: Bearer $TOKEN"
```

If this returns 404, the user doesn't exist!

### Step 4: Solution - Login Again

**The most common issue:** The user ID in your token doesn't match any user in the database.

**Fix:**
1. **Login again** to get a fresh token with a valid user ID:
   ```bash
   curl -X POST http://localhost:5000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "employeeNumber": "EMP-2025-0013",
       "password": "password123"
     }'
   ```

2. **Use the NEW token** immediately

3. **Try /me endpoint again**

### Step 5: Alternative - Use Employee Number Instead

If the user ID approach isn't working, we can modify the endpoint to use employee number. But first, let's try the login approach.

## Quick Test

Run this to test if it works:

```bash
# 1. Login
LOGIN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"employeeNumber": "EMP-2025-0013", "password": "password123"}')

# 2. Extract token
TOKEN=$(echo $LOGIN | jq -r '.access_token')

# 3. Test /me endpoint
curl -X GET "http://localhost:5000/api/v1/employee-profile/me" \
  -H "Authorization: Bearer $TOKEN" \
  -v
```

The `-v` flag will show you detailed response including any error messages.

## Common Issues

### Issue 1: User ID Doesn't Exist
**Error:** `404 Not Found - Employee with ID ... not found`

**Solution:** 
- Login again with a valid employee number
- Make sure the employee exists: `npm run seed:employee`

### Issue 2: Token Doesn't Have userId
**Error:** `401 Unauthorized - User information not found in token`

**Solution:**
- Login again to get a fresh token
- Make sure you're using the token immediately after login

### Issue 3: Token Expired
**Error:** `401 Unauthorized - Invalid or missing token`

**Solution:**
- Login again (tokens expire after 24 hours)

## Still Not Working?

1. **Check server logs** - Look for detailed error messages
2. **Verify employee exists:**
   ```bash
   npm run seed:employee
   ```
3. **Try a different employee:**
   - Employee Number: `EMP-2025-0012`
   - Password: `password123`
4. **Test with a simple endpoint first:**
   ```bash
   # This should work
   GET /api/v1/employee-profile?page=1&limit=1
   ```

## Expected Working Response

When `/me` works, you should get:

```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "...",
    "employeeNumber": "EMP-2025-0013",
    "firstName": "Admin",
    "lastName": "User",
    "fullName": "Admin User",
    ...
  }
}
```

