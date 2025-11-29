# Create HR Manager Employee

## ✅ Complete Valid Data for HR Manager

Use this JSON in Swagger UI or Postman:

```json
{
  "firstName": "Sarah",
  "lastName": "Hassan",
  "middleName": "Ahmed",
  "nationalId": "98765432109876",
  "password": "password123",
  "gender": "FEMALE",
  "maritalStatus": "MARRIED",
  "dateOfBirth": "1990-03-15T00:00:00.000Z",
  "personalEmail": "sara.hassan@example.com",
  "workEmail": "sara.hassan@company.com",
  "mobilePhone": "01234567890",
  "homePhone": "02345678901",
  "address": {
    "city": "Cairo",
    "streetAddress": "456 HR Street",
    "country": "Egypt"
  },
  "dateOfHire": "2023-06-01T00:00:00.000Z",
  "contractStartDate": "2023-06-01T00:00:00.000Z",
  "contractEndDate": "2025-05-31T00:00:00.000Z",
  "contractType": "FULL_TIME_CONTRACT",
  "workType": "FULL_TIME",
  "status": "ACTIVE",
  "biography": "Experienced HR Manager with 8 years in human resources, talent acquisition, and employee relations.",
  "profilePictureUrl": "https://example.com/profile/sara.jpg",
  "primaryPositionId": "691a10776aead875cebf65b3",
  "primaryDepartmentId": "691a10776aead875cebf65a3"
}
```

## 📋 Your IDs

- **Department ID**: `691a10776aead875cebf65a3` (HR Department) ✅
- **Position ID**: `691a10776aead875cebf65b3` (HR Manager) ✅

## 🎯 Minimal Version (Required Fields Only)

If you want to create with minimal data first:

```json
{
  "firstName": "Sarah",
  "lastName": "Hassan",
  "nationalId": "98765432109876",
  "dateOfHire": "2023-06-01T00:00:00.000Z",
  "primaryPositionId": "691a10776aead875cebf65b3",
  "primaryDepartmentId": "691a10776aead875cebf65a3"
}
```

## 🔐 After Creation - Assign HR Manager Role

After creating the employee, you need to assign the HR_MANAGER system role:

**Endpoint:** `POST /api/v1/employee-profile/assign-roles`

**Body:**
```json
{
  "employeeProfileId": "EMPLOYEE_ID_FROM_CREATE_RESPONSE",
  "roles": ["HR Manager"],
  "permissions": ["read:employees", "write:employees", "read:departments", "read:positions"]
}
```

**Note:** Requires SYSTEM_ADMIN token!

## 📝 Using curl

```bash
# 1. Create HR Manager Employee
curl -X POST 'http://localhost:5000/api/v1/employee-profile' \
  -H 'Authorization: Bearer YOUR_ADMIN_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Sarah",
    "lastName": "Hassan",
    "nationalId": "98765432109876",
    "password": "password123",
    "gender": "FEMALE",
    "workEmail": "sara.hassan@company.com",
    "mobilePhone": "01234567890",
    "dateOfHire": "2023-06-01T00:00:00.000Z",
    "contractType": "FULL_TIME_CONTRACT",
    "workType": "FULL_TIME",
    "status": "ACTIVE",
    "primaryPositionId": "691a10776aead875cebf65b3",
    "primaryDepartmentId": "691a10776aead875cebf65a3"
  }'

# 2. Copy the employee _id from response, then assign role:
curl -X POST 'http://localhost:5000/api/v1/employee-profile/assign-roles' \
  -H 'Authorization: Bearer YOUR_ADMIN_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "employeeProfileId": "EMPLOYEE_ID_HERE",
    "roles": ["HR Manager"],
    "permissions": ["read:employees", "write:employees"]
  }'
```

## ✅ Expected Response

After creation, you should get:

```json
{
  "message": "Employee created successfully",
  "data": {
    "_id": "...",
    "employeeNumber": "EMP-2024-XXXX",
    "firstName": "Sarah",
    "lastName": "Hassan",
    "fullName": "Sarah Ahmed Hassan",
    "primaryPositionId": {
      "_id": "691a10776aead875cebf65b3",
      "title": "HR Manager",
      "code": "..."
    },
    "primaryDepartmentId": {
      "_id": "691a10776aead875cebf65a3",
      "name": "HR Department",
      "code": "..."
    },
    ...
  }
}
```

## 🔍 Verify Position & Department

After creation, GET the employee:

```bash
GET /api/v1/employee-profile/EMPLOYEE_ID
```

You should see the position and department populated with full details!

## ⚠️ Important Notes

1. **National ID must be unique** - If `98765432109876` exists, change it (e.g., `98765432109877`)
2. **Password is optional** - But recommended if you want them to login
3. **Position & Department IDs** - Must be valid MongoDB ObjectIds
4. **Role Assignment** - Must be done separately after employee creation

## 🎉 Ready to Use!

Copy the complete JSON above and paste it into Swagger UI or Postman!

