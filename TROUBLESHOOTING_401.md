# Fixing 401 "Invalid or missing token" Error

## 🔴 The Error You're Seeing

```json
{
  "message": "Invalid or missing token",
  "error": "Unauthorized",
  "statusCode": 401
}
```

This means you're trying to access a protected endpoint without a valid token.

## ✅ Step-by-Step Fix

### Step 1: Login First to Get a Token

**You MUST login first before accessing any employee-profile endpoints!**

#### Using Swagger UI:

1. **Start the server:**
   ```bash
   npm run start:dev
   ```

2. **Open Swagger UI:**
   ```
   http://localhost:5000/api/docs
   ```

3. **Find the `/auth/login` endpoint** (it's in the Authentication section)

4. **Click "Try it out"**

5. **Enter login credentials:**
   ```json
   {
     "employeeNumber": "EMP-2025-0013",
     "password": "password123"
   }
   ```

6. **Click "Execute"**

7. **Copy the `access_token` from the response:**
   ```json
   {
     "message": "Login successful",
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  ← COPY THIS
     "user": {...}
   }
   ```

#### Using curl:

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "employeeNumber": "EMP-2025-0013",
    "password": "password123"
  }'
```

Copy the `access_token` from the response.

### Step 2: Use the Token Correctly

#### In Swagger UI:

1. **Click the "Authorize" button** (🔒 icon at the top right)

2. **In the "Value" field, enter:**
   ```
   Bearer YOUR_ACCESS_TOKEN_HERE
   ```
   ⚠️ **IMPORTANT**: Include the word `Bearer` followed by a space, then your token!

3. **Click "Authorize"**

4. **Click "Close"**

5. **Now try your endpoint again** - it should work!

#### Using curl:

```bash
curl -X GET "http://localhost:5000/api/v1/employee-profile" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

⚠️ **IMPORTANT**: 
- Include `Bearer ` (with space) before the token
- Use the exact token from login response

#### Using Postman:

1. **Add Header:**
   - Key: `Authorization`
   - Value: `Bearer YOUR_ACCESS_TOKEN_HERE`

2. **Make sure there's a space after "Bearer"**

## 🔍 Common Mistakes

### ❌ Mistake 1: Missing "Bearer" prefix
```bash
# WRONG
-H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# CORRECT
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### ❌ Mistake 2: No space after "Bearer"
```bash
# WRONG
-H "Authorization: BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# CORRECT
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### ❌ Mistake 3: Using wrong token
- Make sure you're using the `access_token` from the login response
- Not the `user` object, not the `message` - just the `access_token`

### ❌ Mistake 4: Token expired
- Tokens expire after 24 hours
- If expired, login again to get a new token

### ❌ Mistake 5: Trying to access endpoint before logging in
- **You MUST login first** to get a token
- Then use that token for all other requests

## 🎯 Complete Example Workflow

### 1. Login (Get Token)
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "employeeNumber": "EMP-2025-0013",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTJhMmNlODEwNGIwMWM0Nzc4YjAwY2QiLCJ1c2VybmFtZSI6IkVNUC0yMDI1LTAwMTMiLCJyb2xlcyI6WyJTeXN0ZW0gQWRtaW4iXSwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE3MzI4ODQ3ODAsImV4cCI6MTczMjk3MTE4MH0.ABC123XYZ",
  "user": {...}
}
```

### 2. Use Token (Access Protected Endpoint)
```bash
# Save token to variable (optional)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTJhMmNlODEwNGIwMWM0Nzc4YjAwY2QiLCJ1c2VybmFtZSI6IkVNUC0yMDI1LTAwMTMiLCJyb2xlcyI6WyJTeXN0ZW0gQWRtaW4iXSwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE3MzI4ODQ3ODAsImV4cCI6MTczMjk3MTE4MH0.ABC123XYZ"

# Use token in request
curl -X GET "http://localhost:5000/api/v1/employee-profile" \
  -H "Authorization: Bearer $TOKEN"
```

## 🧪 Quick Test

Run this to verify your setup:

```bash
# 1. Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "employeeNumber": "EMP-2025-0013",
    "password": "password123"
  }')

# 2. Extract token (requires jq or manual copy)
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

# 3. Test endpoint
curl -X GET "http://localhost:5000/api/v1/employee-profile" \
  -H "Authorization: Bearer $TOKEN"
```

## 📋 Available Employee Numbers

Use any of these to login:

| Employee Number | Password | Role |
|----------------|----------|------|
| EMP-2025-0013 | password123 | SYSTEM_ADMIN |
| EMP-2025-0012 | password123 | HR_MANAGER |
| EMP-001 | password123 | DEPARTMENT_EMPLOYEE |

## ✅ Verification Checklist

- [ ] Server is running (`npm run start:dev`)
- [ ] I logged in first and got an `access_token`
- [ ] I'm using `Bearer ` (with space) before the token
- [ ] I copied the entire token (it's very long)
- [ ] Token is from the login response, not expired
- [ ] I'm using the correct endpoint URL (`/api/v1/...`)

## 🆘 Still Not Working?

1. **Check server logs** - Look for error messages
2. **Verify employee exists:**
   ```bash
   # Check if employee exists (you'll need to login first)
   curl -X GET "http://localhost:5000/api/v1/employee-profile" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```
3. **Try a different employee number** - Some might not have passwords
4. **Re-add passwords:**
   ```bash
   npm run add:passwords
   ```
5. **Check JWT_SECRET** - Make sure it's the same (default: `your-secret-key`)

## 🎉 Success!

Once you see a 200 response instead of 401, you're all set! The token is working correctly.

