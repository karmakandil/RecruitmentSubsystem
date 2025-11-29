# Manual Testing Guide for Employee Profile

## ✅ Status: COMPLETE

All tests are passing:
- ✅ 26/26 Unit Tests
- ✅ 39/39 E2E Tests  
- ✅ Route Validation: All checks passing

## 🌱 Seeding Test Data

### What Data Gets Seeded?

The seed script creates **3 sample employees**:

1. **John Doe** (Regular Employee)
   - National ID: `12345678901234`
   - Email: `john.doe@company.com`
   - Status: ACTIVE
   - Role: DEPARTMENT_EMPLOYEE (default)

2. **Jane Smith** (HR Manager)
   - National ID: `23456789012345`
   - Email: `jane.smith@company.com`
   - Status: ACTIVE
   - Role: HR_MANAGER

3. **Admin User** (System Admin)
   - National ID: `34567890123456`
   - Email: `admin@company.com`
   - Status: ACTIVE
   - Role: SYSTEM_ADMIN

### Run the Seed Script

```bash
npm run seed:employee
```

This will:
- Create 3 employees in your database
- Assign appropriate roles
- Display the created employee IDs for testing

**Note**: If employees with these national IDs already exist, they will be skipped.

## 🧪 Manual Testing Steps

### Step 1: Start the Server

```bash
npm run start:dev
```

Server will start on: `http://localhost:5000`
API Documentation: `http://localhost:5000/api/docs` (Swagger)

### Step 2: Get Authentication Token

First, you need to login to get a JWT token. You'll need to create an employee with a password first, or use the auth endpoint.

**Option A: Using Swagger UI**
1. Go to `http://localhost:5000/api/docs`
2. Find the `/auth/login` endpoint
3. Use employee number and password to login
4. Copy the `access_token` from the response

**Option B: Using curl/Postman**

```bash
# Login (you'll need to create an employee with password first)
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "employeeNumber": "EMP-2024-0001",
    "password": "your-password"
  }'
```

### Step 3: Test Endpoints

#### 1. Create Employee (POST)

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/v1/employee-profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "nationalId": "98765432109876",
    "dateOfHire": "2024-01-15T00:00:00.000Z",
    "personalEmail": "alice@example.com",
    "workEmail": "alice@company.com",
    "mobilePhone": "5551234567",
    "gender": "FEMALE",
    "maritalStatus": "SINGLE"
  }'
```

**Using Postman:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/employee-profile`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN_HERE`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "nationalId": "98765432109876",
  "dateOfHire": "2024-01-15T00:00:00.000Z",
  "personalEmail": "alice@example.com",
  "workEmail": "alice@company.com",
  "mobilePhone": "5551234567",
  "gender": "FEMALE",
  "maritalStatus": "SINGLE"
}
```

**Expected Response (201):**
```json
{
  "message": "Employee created successfully",
  "data": {
    "_id": "...",
    "employeeNumber": "EMP-2024-0001",
    "firstName": "Alice",
    "lastName": "Johnson",
    ...
  }
}
```

#### 2. List Employees (GET)

**Using curl:**
```bash
# Get all employees
curl -X GET "http://localhost:5000/api/v1/employee-profile" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# With pagination
curl -X GET "http://localhost:5000/api/v1/employee-profile?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# With search
curl -X GET "http://localhost:5000/api/v1/employee-profile?search=John" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# With filters
curl -X GET "http://localhost:5000/api/v1/employee-profile?status=ACTIVE&page=1&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200):**
```json
{
  "message": "Employees retrieved successfully",
  "data": [...],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### 3. Get My Profile (GET /me)

```bash
curl -X GET "http://localhost:5000/api/v1/employee-profile/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Note**: The token must contain a valid `userId` that exists in the database.

#### 4. Update My Profile (PATCH /me)

```bash
curl -X PATCH "http://localhost:5000/api/v1/employee-profile/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "personalEmail": "newemail@example.com",
    "mobilePhone": "5559876543"
  }'
```

#### 5. Get Employee by ID (GET /:id)

```bash
# Replace EMPLOYEE_ID with actual ID from create response
curl -X GET "http://localhost:5000/api/v1/employee-profile/EMPLOYEE_ID" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 6. Update Employee (PATCH /:id)

```bash
curl -X PATCH "http://localhost:5000/api/v1/employee-profile/EMPLOYEE_ID" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "workEmail": "updated@company.com"
  }'
```

#### 7. Get Statistics (GET /stats)

```bash
curl -X GET "http://localhost:5000/api/v1/employee-profile/stats" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

**Note**: Requires SYSTEM_ADMIN or HR_MANAGER role.

#### 8. Assign Roles (POST /assign-roles)

```bash
curl -X POST "http://localhost:5000/api/v1/employee-profile/assign-roles" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeProfileId": "EMPLOYEE_ID",
    "roles": ["HR_MANAGER", "HR_EMPLOYEE"],
    "permissions": ["read:employees", "write:employees"]
  }'
```

**Note**: Requires SYSTEM_ADMIN role.

#### 9. Get Employee Roles (GET /:id/roles)

```bash
curl -X GET "http://localhost:5000/api/v1/employee-profile/EMPLOYEE_ID/roles" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

#### 10. Delete Employee (DELETE /:id)

```bash
curl -X DELETE "http://localhost:5000/api/v1/employee-profile/EMPLOYEE_ID" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

**Note**: This is a soft delete (sets status to TERMINATED).

## 📋 Testing Checklist

### Authentication & Authorization
- [ ] Test without token (should return 401)
- [ ] Test with invalid token (should return 401)
- [ ] Test with insufficient role (should return 403)
- [ ] Test with valid token and role (should succeed)

### Validation
- [ ] Test with missing required fields (should return 400)
- [ ] Test with invalid email format (should return 400)
- [ ] Test with invalid national ID format (should return 400)
- [ ] Test with invalid phone format (should return 400)
- [ ] Test with duplicate national ID (should return 409)

### CRUD Operations
- [ ] Create employee (POST)
- [ ] List employees (GET)
- [ ] Get employee by ID (GET /:id)
- [ ] Update employee (PATCH /:id)
- [ ] Delete employee (DELETE /:id)
- [ ] Get my profile (GET /me)
- [ ] Update my profile (PATCH /me)

### Advanced Features
- [ ] Search functionality
- [ ] Pagination
- [ ] Filtering by status
- [ ] Filtering by department
- [ ] Sorting
- [ ] Statistics endpoint
- [ ] Role assignment
- [ ] Get employee roles

## 🔧 Using Swagger UI (Recommended)

The easiest way to test manually is using Swagger UI:

1. **Start the server:**
   ```bash
   npm run start:dev
   ```

2. **Open Swagger UI:**
   Navigate to: `http://localhost:5000/api/docs`

3. **Authorize:**
   - Click the "Authorize" button (🔒)
   - Enter your JWT token: `Bearer YOUR_TOKEN_HERE`
   - Click "Authorize"

4. **Test endpoints:**
   - Expand any endpoint
   - Click "Try it out"
   - Fill in the parameters
   - Click "Execute"
   - View the response

## 🐛 Common Issues

### Issue: 401 Unauthorized
**Solution**: Make sure you:
- Include `Bearer ` prefix in Authorization header
- Token is valid and not expired
- Token contains correct user ID

### Issue: 403 Forbidden
**Solution**: Check that:
- User has the required role
- Token contains roles in payload
- Route requires specific role (check route documentation)

### Issue: 404 Not Found
**Solution**: Verify:
- Route path is correct (case-sensitive)
- Employee ID exists in database
- Global prefix `/api/v1` is included

### Issue: 400 Bad Request
**Solution**: Check:
- Request body matches DTO structure
- Required fields are provided
- Field formats are correct (email, phone, etc.)
- No extra fields (if `forbidNonWhitelisted` is enabled)

## 📊 Sample Test Data

After running the seed script, you'll have:

| Name | National ID | Role | Email |
|------|-------------|------|-------|
| John Doe | 12345678901234 | DEPARTMENT_EMPLOYEE | john.doe@company.com |
| Jane Smith | 23456789012345 | HR_MANAGER | jane.smith@company.com |
| Admin User | 34567890123456 | SYSTEM_ADMIN | admin@company.com |

Use these to test different role-based access scenarios!

## 🎯 Quick Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api/v1"
TOKEN="YOUR_TOKEN_HERE"

# Create employee
echo "Creating employee..."
curl -X POST "$BASE_URL/employee-profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "nationalId": "11111111111111",
    "dateOfHire": "2024-01-01T00:00:00.000Z"
  }'

# List employees
echo -e "\n\nListing employees..."
curl -X GET "$BASE_URL/employee-profile?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN"

# Get stats
echo -e "\n\nGetting stats..."
curl -X GET "$BASE_URL/employee-profile/stats" \
  -H "Authorization: Bearer $TOKEN"
```

Make it executable and run:
```bash
chmod +x test-api.sh
./test-api.sh
```

