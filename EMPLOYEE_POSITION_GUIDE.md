# Employee Position & Department Guide

## 🔍 What's Missing in Employee Profiles?

When you create an employee, these **optional** fields can be added to link them to organizational structure:

### Missing Optional Fields:

1. **`primaryPositionId`** - Links employee to a Position (e.g., "Software Engineer", "HR Manager")
2. **`primaryDepartmentId`** - Links employee to a Department (e.g., "IT Department", "HR Department")
3. **`supervisorPositionId`** - Links to supervisor's position
4. **`payGradeId`** - Links to pay grade for salary information

## 📋 Current Employee Profile Structure

### ✅ What You Have (Required):
- `firstName`, `lastName`, `nationalId`, `dateOfHire`

### ❌ What's Missing (Optional but Important):
- **Position** - What job/role they have
- **Department** - Which department they belong to
- **Supervisor** - Who they report to
- **Pay Grade** - Their salary level

## 🎯 How to Know Employee's Position

### Option 1: Check the Employee Response

When you GET an employee, if they have a position, you'll see:

```json
{
  "data": {
    "_id": "...",
    "firstName": "Ahmed",
    "lastName": "Mohamed",
    "primaryPositionId": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Software Engineer",
      "code": "SE-001"
    },
    "primaryDepartmentId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "IT Department",
      "code": "IT"
    }
  }
}
```

### Option 2: Check What's Populated

The service populates these fields, so if they're set, you'll see the full position/department info.

## 🏗️ How to Set Position & Department

### Step 1: Create Department First

You need to create departments and positions in the database. Since the organization-structure endpoints might not be ready, you can:

**Option A: Create via MongoDB directly**
```javascript
// In MongoDB shell or Compass
db.departments.insertOne({
  code: "IT",
  name: "IT Department",
  description: "Information Technology Department",
  isActive: true
})
```

**Option B: Create via seed script** (I'll create one for you)

### Step 2: Create Position

Positions must belong to a department:

```javascript
// In MongoDB
db.positions.insertOne({
  code: "SE-001",
  title: "Software Engineer",
  description: "Senior Software Engineer",
  departmentId: ObjectId("DEPARTMENT_ID_HERE"), // From step 1
  isActive: true
})
```

### Step 3: Get the IDs

After creating, get the `_id` values:
- Department ID: `507f1f77bcf86cd799439011`
- Position ID: `507f1f77bcf86cd799439012`

### Step 4: Use IDs When Creating Employee

```json
{
  "firstName": "Ahmed",
  "lastName": "Mohamed",
  "nationalId": "12345678901234",
  "dateOfHire": "2024-01-15T00:00:00.000Z",
  "primaryPositionId": "507f1f77bcf86cd799439012",
  "primaryDepartmentId": "507f1f77bcf86cd799439011"
}
```

## 📝 Complete Employee Example WITH Position

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
  "primaryPositionId": "507f1f77bcf86cd799439012",
  "primaryDepartmentId": "507f1f77bcf86cd799439011",
  "supervisorPositionId": "507f1f77bcf86cd799439013",
  "payGradeId": "507f1f77bcf86cd799439014"
}
```

## 🔍 How to Find Existing IDs

### Method 1: Query Database Directly

```javascript
// Get all departments
db.departments.find({}, {_id: 1, name: 1, code: 1})

// Get all positions
db.positions.find({}, {_id: 1, title: 1, code: 1, departmentId: 1})
```

### Method 2: Check Employee Response

When you GET an employee that has position/department set, the response includes the IDs:

```json
{
  "primaryPositionId": "507f1f77bcf86cd799439012",
  "primaryDepartmentId": "507f1f77bcf86cd799439011"
}
```

### Method 3: Use MongoDB Compass or Studio 3T

- Connect to your database
- Browse `departments` collection → Copy `_id`
- Browse `positions` collection → Copy `_id`

## 🚀 Quick Setup Script

I'll create a seed script to set up sample departments and positions for you!

## ⚠️ Important Notes

1. **Position requires Department**: You must create department first, then position
2. **IDs are MongoDB ObjectIds**: Must be valid 24-character hex strings
3. **These fields are optional**: Employee can be created without them
4. **Can be updated later**: Use PATCH endpoint to add position/department later

## 📊 What Gets Populated

When you GET an employee with position/department, the response includes:

```json
{
  "primaryPositionId": {
    "_id": "...",
    "title": "Software Engineer",
    "code": "SE-001",
    "description": "..."
  },
  "primaryDepartmentId": {
    "_id": "...",
    "name": "IT Department",
    "code": "IT",
    "description": "..."
  }
}
```

This makes it easy to see the employee's position and department!

