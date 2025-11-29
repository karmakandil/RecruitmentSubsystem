# Login Instructions for Employee Profile Testing

## 🔐 Quick Login Guide

### Default Password
**All seeded employees use the password: `password123`**

## Step 1: Add Passwords to Existing Employees

If you already have employees in the database without passwords, run:

```bash
npm run add:passwords
```

This will add the default password `password123` to all employees who don't have one.

## Step 2: Get Employee Numbers

After seeding, you'll see employee numbers like:
- `EMP-2024-0001`
- `EMP-2025-0012`
- `EMP-2025-0013`

Or run the seed script again to see them:
```bash
npm run seed:employee
```

## Step 3: Login to Get JWT Token

### Using Swagger UI (Easiest)

1. Start the server:
   ```bash
   npm run start:dev
   ```

2. Open Swagger UI:
   ```
   http://localhost:5000/api/docs
   ```

3. Find the `/auth/login` endpoint

4. Click "Try it out"

5. Enter:
   ```json
   {
     "employeeNumber": "EMP-2025-0012",
     "password": "password123"
   }
   ```

6. Click "Execute"

7. Copy the `access_token` from the response

8. Click the "Authorize" button (🔒) at the top

9. Enter: `Bearer YOUR_ACCESS_TOKEN_HERE`

10. Click "Authorize"

11. Now you can test all endpoints!

### Using curl

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "employeeNumber": "EMP-2025-0012",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "employeeNumber": "EMP-2025-0012",
    "fullName": "Jane Smith",
    "workEmail": "jane.smith@company.com",
    "roles": ["HR Manager"]
  }
}
```

Copy the `access_token` and use it in subsequent requests:

```bash
# Example: List employees
curl -X GET "http://localhost:5000/api/v1/employee-profile" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Using Postman

1. Create a new request
2. Method: `POST`
3. URL: `http://localhost:5000/api/v1/auth/login`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
   ```json
   {
     "employeeNumber": "EMP-2025-0012",
     "password": "password123"
   }
   ```
6. Send request
7. Copy the `access_token` from response
8. For other requests, add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_ACCESS_TOKEN_HERE`

## 📋 Seeded Employees & Credentials

After running `npm run seed:employee`, you'll have:

| Name | Employee Number | Password | Role |
|------|----------------|----------|------|
| John Doe | EMP-2024-0001 | password123 | DEPARTMENT_EMPLOYEE |
| Jane Smith | EMP-2025-0012 | password123 | HR_MANAGER |
| Admin User | EMP-2025-0013 | password123 | SYSTEM_ADMIN |

## 🎯 Quick Test Flow

1. **Seed employees with passwords:**
   ```bash
   npm run seed:employee
   ```

2. **Start server:**
   ```bash
   npm run start:dev
   ```

3. **Login (using Swagger or curl):**
   - Employee Number: `EMP-2025-0013` (Admin)
   - Password: `password123`

4. **Copy the access_token**

5. **Test endpoints:**
   - Use `Bearer YOUR_TOKEN` in Authorization header
   - Or authorize in Swagger UI

## 🔑 Creating New Employees with Passwords

When creating new employees via API, include password in the request:

```json
{
  "firstName": "New",
  "lastName": "Employee",
  "nationalId": "99999999999999",
  "dateOfHire": "2024-01-01T00:00:00.000Z",
  "password": "mypassword123"
}
```

Then login with:
- Employee Number: (from response, e.g., `EMP-2025-0014`)
- Password: `mypassword123`

## ⚠️ Troubleshooting

### "Invalid credentials" error
- Check employee number is correct (case-sensitive)
- Check password is correct: `password123`
- Make sure employee has a password (run `npm run add:passwords`)

### "Employee not found"
- Check employee number format: `EMP-YYYY-XXXX`
- Make sure employee exists in database
- Run seed script: `npm run seed:employee`

### Token not working
- Make sure to include `Bearer ` prefix
- Check token hasn't expired (default: 24 hours)
- Verify token is from the login response

## 🚀 Ready to Test!

Now you can:
1. Login and get a token
2. Use the token to test all employee-profile endpoints
3. Test different roles (use different employee numbers)

Happy testing! 🎉

