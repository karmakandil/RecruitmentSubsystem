# Correct curl Commands with Token

## ❌ Your Current Command (Missing Authorization)

```bash
curl -X 'GET' \
  'http://localhost:5000/api/v1/employee-profile' \
  -H 'accept: */*'
```

**Problem:** No Authorization header = 401 error!

## ✅ Correct Command (With Token)

```bash
curl -X GET \
  'http://localhost:5000/api/v1/employee-profile' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkVNUC0yMDI1LTAwMTMiLCJzdWIiOiI2OTJhMmNlODEwNGIwMWM0Nzc4YjAwY2QiLCJyb2xlcyI6WyJTeXN0ZW0gQWRtaW4iXSwicGVybWlzc2lvbnMiOlsiKiJdLCJpYXQiOjE3NjQzNzMwMTYsImV4cCI6MTc2NDQ1OTQxNn0.ldTgMB5Ifo2ADzcOz3UvxUFftP0q417KwfYQjsDf1jM'
```

## 🔑 Key Point: You MUST Include Authorization Header!

Every protected endpoint needs:
```
-H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

## 📋 All Correct curl Examples

### 1. List Employees
```bash
curl -X GET \
  'http://localhost:5000/api/v1/employee-profile' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### 2. Get My Profile
```bash
curl -X GET \
  'http://localhost:5000/api/v1/employee-profile/me' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### 3. Get Employee by ID
```bash
curl -X GET \
  'http://localhost:5000/api/v1/employee-profile/692a2ce8104b01c4778b00cd' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### 4. Create Employee
```bash
curl -X POST \
  'http://localhost:5000/api/v1/employee-profile' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "nationalId": "99999999999999",
    "dateOfHire": "2024-01-01T00:00:00.000Z"
  }'
```

## 💡 Pro Tip: Save Token as Variable

```bash
# Save your token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkVNUC0yMDI1LTAwMTMiLCJzdWIiOiI2OTJhMmNlODEwNGIwMWM0Nzc4YjAwY2QiLCJyb2xlcyI6WyJTeXN0ZW0gQWRtaW4iXSwicGVybWlzc2lvbnMiOlsiKiJdLCJpYXQiOjE3NjQzNzMwMTYsImV4cCI6MTc2NDQ1OTQxNn0.ldTgMB5Ifo2ADzcOz3UvxUFftP0q417KwfYQjsDf1jM"

# Use it
curl -X GET \
  'http://localhost:5000/api/v1/employee-profile' \
  -H "Authorization: Bearer $TOKEN"
```

## ⚠️ Common Mistakes

### ❌ Missing Authorization Header
```bash
curl -X GET 'http://localhost:5000/api/v1/employee-profile'
# Result: 401 Unauthorized
```

### ❌ Missing "Bearer " Prefix
```bash
curl -X GET 'http://localhost:5000/api/v1/employee-profile' \
  -H 'Authorization: YOUR_TOKEN'
# Result: 401 Unauthorized (needs "Bearer " prefix)
```

### ❌ No Space After "Bearer"
```bash
curl -X GET 'http://localhost:5000/api/v1/employee-profile' \
  -H 'Authorization: BearerYOUR_TOKEN'
# Result: 401 Unauthorized (needs space)
```

### ✅ Correct Format
```bash
curl -X GET 'http://localhost:5000/api/v1/employee-profile' \
  -H 'Authorization: Bearer YOUR_TOKEN'
# Result: 200 OK ✅
```

## 🎯 Quick Copy-Paste Ready Command

Replace `YOUR_TOKEN_HERE` with your actual token:

```bash
curl -X GET 'http://localhost:5000/api/v1/employee-profile' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

## 📝 Your Token (From Login Response)

Use this token:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkVNUC0yMDI1LTAwMTMiLCJzdWIiOiI2OTJhMmNlODEwNGIwMWM0Nzc4YjAwY2QiLCJyb2xlcyI6WyJTeXN0ZW0gQWRtaW4iXSwicGVybWlzc2lvbnMiOlsiKiJdLCJpYXQiOjE3NjQzNzMwMTYsImV4cCI6MTc2NDQ1OTQxNn0.ldTgMB5Ifo2ADzcOz3UvxUFftP0q417KwfYQjsDf1jM
```

## ✅ Complete Working Example

```bash
curl -X GET 'http://localhost:5000/api/v1/employee-profile' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkVNUC0yMDI1LTAwMTMiLCJzdWIiOiI2OTJhMmNlODEwNGIwMWM0Nzc4YjAwY2QiLCJyb2xlcyI6WyJTeXN0ZW0gQWRtaW4iXSwicGVybWlzc2lvbnMiOlsiKiJdLCJpYXQiOjE3NjQzNzMwMTYsImV4cCI6MTc2NDQ1OTQxNn0.ldTgMB5Ifo2ADzcOz3UvxUFftP0q417KwfYQjsDf1jM'
```

This should work! 🎉

