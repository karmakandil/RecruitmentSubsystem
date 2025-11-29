# Valid Sample Data for Create Employee Profile

## 📋 Required Fields

- `firstName` (2-50 characters)
- `lastName` (2-50 characters)
- `nationalId` (exactly 14 digits)
- `dateOfHire` (ISO date string)

## ✅ Example 1: Minimal (Required Fields Only)

```json
{
  "firstName": "Ahmed",
  "lastName": "Mohamed",
  "nationalId": "12345678901234",
  "dateOfHire": "2024-01-15T00:00:00.000Z"
}
```

## ✅ Example 2: Complete Employee (Recommended)

```json
{
  "firstName": "Ahmed",
  "lastName": "Mohamed",
  "middleName": "Ali",
  "nationalId": "12345678901234",
  "password": "password123",
  "gender": "MALE",
  "maritalStatus": "SINGLE",
  "dateOfBirth": "1995-05-20T00:00:00.000Z",
  "personalEmail": "ahmed.mohamed@example.com",
  "workEmail": "ahmed.mohamed@company.com",
  "mobilePhone": "01234567890",
  "homePhone": "02345678901",
  "address": {
    "city": "Cairo",
    "streetAddress": "123 Main Street",
    "country": "Egypt"
  },
  "dateOfHire": "2024-01-15T00:00:00.000Z",
  "contractStartDate": "2024-01-15T00:00:00.000Z",
  "contractEndDate": "2025-01-14T00:00:00.000Z",
  "contractType": "FULL_TIME_CONTRACT",
  "workType": "FULL_TIME",
  "status": "ACTIVE",
  "biography": "Experienced software developer with 5 years in web development.",
  "profilePictureUrl": "https://example.com/profile/ahmed.jpg"
}
```

## ✅ Example 2b: Employee WITH Position & Department

**First, run:** `npm run seed:org` to create departments and positions, then use their IDs:

```json
{
  "firstName": "Ahmed",
  "lastName": "Mohamed",
  "middleName": "Ali",
  "nationalId": "12345678901234",
  "password": "password123",
  "gender": "MALE",
  "maritalStatus": "SINGLE",
  "dateOfBirth": "1995-05-20T00:00:00.000Z",
  "personalEmail": "ahmed.mohamed@example.com",
  "workEmail": "ahmed.mohamed@company.com",
  "mobilePhone": "01234567890",
  "dateOfHire": "2024-01-15T00:00:00.000Z",
  "contractType": "FULL_TIME_CONTRACT",
  "workType": "FULL_TIME",
  "status": "ACTIVE",
  "primaryPositionId": "REPLACE_WITH_POSITION_ID",
  "primaryDepartmentId": "REPLACE_WITH_DEPARTMENT_ID",
  "supervisorPositionId": "REPLACE_WITH_SUPERVISOR_POSITION_ID"
}
```

**To get the IDs:**
1. Run: `npm run seed:org`
2. Copy the IDs from the output
3. Replace `REPLACE_WITH_POSITION_ID` etc. with actual IDs

## ✅ Example 3: Female Employee

```json
{
  "firstName": "Sara",
  "lastName": "Hassan",
  "middleName": "Ahmed",
  "nationalId": "98765432109876",
  "password": "securepass123",
  "gender": "FEMALE",
  "maritalStatus": "MARRIED",
  "dateOfBirth": "1992-08-10T00:00:00.000Z",
  "personalEmail": "sara.hassan@example.com",
  "workEmail": "sara.hassan@company.com",
  "mobilePhone": "01112223344",
  "dateOfHire": "2023-06-01T00:00:00.000Z",
  "contractType": "FULL_TIME_CONTRACT",
  "workType": "FULL_TIME",
  "status": "ACTIVE",
  "biography": "HR Manager with expertise in talent acquisition and employee relations."
}
```

## ✅ Example 4: Part-Time Employee

```json
{
  "firstName": "Omar",
  "lastName": "Ibrahim",
  "nationalId": "55555555555555",
  "password": "mypassword123",
  "gender": "MALE",
  "dateOfBirth": "1998-03-15T00:00:00.000Z",
  "personalEmail": "omar.ibrahim@example.com",
  "workEmail": "omar.ibrahim@company.com",
  "mobilePhone": "01098765432",
  "dateOfHire": "2024-03-01T00:00:00.000Z",
  "contractType": "PART_TIME_CONTRACT",
  "workType": "PART_TIME",
  "status": "ACTIVE"
}
```

## ✅ Example 5: Employee on Probation

```json
{
  "firstName": "Fatima",
  "lastName": "Ali",
  "nationalId": "11111111111111",
  "password": "password123",
  "gender": "FEMALE",
  "maritalStatus": "SINGLE",
  "dateOfBirth": "2000-01-20T00:00:00.000Z",
  "personalEmail": "fatima.ali@example.com",
  "workEmail": "fatima.ali@company.com",
  "mobilePhone": "01234567890",
  "dateOfHire": "2024-12-01T00:00:00.000Z",
  "status": "PROBATION",
  "contractType": "FULL_TIME_CONTRACT",
  "workType": "FULL_TIME"
}
```

## 📝 Field Validation Rules

### Required Fields
- **firstName**: 2-50 characters
- **lastName**: 2-50 characters  
- **nationalId**: Exactly 14 digits (numbers only)
- **dateOfHire**: Valid ISO date string

### Optional Fields with Validation
- **password**: Minimum 8 characters (if provided)
- **personalEmail**: Valid email format
- **workEmail**: Valid email format
- **mobilePhone**: 10-15 digits (numbers only)
- **gender**: `MALE` or `FEMALE`
- **maritalStatus**: `SINGLE`, `MARRIED`, `DIVORCED`, or `WIDOWED`
- **contractType**: `FULL_TIME_CONTRACT` or `PART_TIME_CONTRACT`
- **workType**: `FULL_TIME` or `PART_TIME`
- **status**: `ACTIVE`, `INACTIVE`, `ON_LEAVE`, `SUSPENDED`, `RETIRED`, `PROBATION`, or `TERMINATED`
- **primaryPositionId**: Valid MongoDB ObjectId (if you have positions)
- **primaryDepartmentId**: Valid MongoDB ObjectId (if you have departments)
- **supervisorPositionId**: Valid MongoDB ObjectId (if you have positions)
- **payGradeId**: Valid MongoDB ObjectId (if you have pay grades)

## 🎯 Quick Copy-Paste for Swagger/Postman

### Minimal Example
```json
{
  "firstName": "Ahmed",
  "lastName": "Mohamed",
  "nationalId": "12345678901234",
  "dateOfHire": "2024-01-15T00:00:00.000Z"
}
```

### Complete Example
```json
{
  "firstName": "Ahmed",
  "lastName": "Mohamed",
  "middleName": "Ali",
  "nationalId": "12345678901234",
  "password": "password123",
  "gender": "MALE",
  "maritalStatus": "SINGLE",
  "dateOfBirth": "1995-05-20T00:00:00.000Z",
  "personalEmail": "ahmed.mohamed@example.com",
  "workEmail": "ahmed.mohamed@company.com",
  "mobilePhone": "01234567890",
  "address": {
    "city": "Cairo",
    "streetAddress": "123 Main Street",
    "country": "Egypt"
  },
  "dateOfHire": "2024-01-15T00:00:00.000Z",
  "contractType": "FULL_TIME_CONTRACT",
  "workType": "FULL_TIME",
  "status": "ACTIVE"
}
```

## ⚠️ Important Notes

1. **National ID must be unique** - If you get 409 Conflict, the national ID already exists. Use a different one.

2. **Generate unique National IDs for testing:**
   ```javascript
   // Use timestamp to make it unique
   const uniqueId = Date.now().toString().slice(-14).padStart(14, '0');
   // Example: "76437301600000"
   ```

3. **Date Format:** Use ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`
   - Example: `"2024-01-15T00:00:00.000Z"`

4. **Phone Numbers:** Must be 10-15 digits, numbers only
   - ✅ Valid: `"01234567890"`, `"1234567890"`
   - ❌ Invalid: `"012-345-6789"`, `"123"` (too short)

5. **Password:** If provided, minimum 8 characters
   - ✅ Valid: `"password123"`, `"mypass123"`
   - ❌ Invalid: `"123"` (too short)

## 🔄 Using curl

```bash
curl -X POST 'http://localhost:5000/api/v1/employee-profile' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Ahmed",
    "lastName": "Mohamed",
    "nationalId": "12345678901234",
    "dateOfHire": "2024-01-15T00:00:00.000Z"
  }'
```

## ✅ Success Response

You should get:
```json
{
  "message": "Employee created successfully",
  "data": {
    "_id": "...",
    "employeeNumber": "EMP-2024-0001",
    "firstName": "Ahmed",
    "lastName": "Mohamed",
    "fullName": "Ahmed Mohamed",
    ...
  }
}
```

The `employeeNumber` is auto-generated in format: `EMP-YYYY-XXXX`

