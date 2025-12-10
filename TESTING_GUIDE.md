# Step-by-Step Testing Guide for Leave Entitlement Fixes

## Prerequisites
1. Backend server running on `http://localhost:3001` (or your port)
2. Frontend running on `http://localhost:3000` (or your port)
3. Valid JWT token for HR Admin user
4. At least one employee profile created in the system
5. Postman, Thunder Client, or similar API testing tool

---

## Test 1: Verify Consistent Remaining Balance Calculation

### Step 1.1: Create Leave Category
```bash
POST http://localhost:3001/leaves/categories
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "name": "Paid Leave",
  "description": "Leave types that deduct from annual balance"
}
```
**Save the `_id` as `CATEGORY_ID`**

### Step 1.2: Create Leave Type
```bash
POST http://localhost:3001/leaves/types
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "name": "Annual Leave",
  "code": "ANNUAL",
  "categoryId": "CATEGORY_ID",
  "description": "Annual vacation leave"
}
```
**Save the `_id` as `LEAVE_TYPE_ID`**

### Step 1.3: Create Leave Policy
```bash
POST http://localhost:3001/leaves/policies
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "leaveTypeId": "LEAVE_TYPE_ID",
  "accrualMethod": "monthly",
  "monthlyRate": 1.25,
  "yearlyRate": 15,
  "carryForwardAllowed": true,
  "maxCarryForward": 5,
  "roundingRule": "round",
  "minNoticeDays": 7,
  "maxConsecutiveDays": 30
}
```
**Save the `_id` as `POLICY_ID`**

### Step 1.4: Create Employee Entitlement
```bash
POST http://localhost:3001/leaves/entitlements
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "employeeId": "YOUR_EMPLOYEE_ID",
  "leaveTypeId": "LEAVE_TYPE_ID",
  "yearlyEntitlement": 15,
  "accruedActual": 0,
  "accruedRounded": 0,
  "carryForward": 0,
  "taken": 0,
  "pending": 0,
  "remaining": 0
}
```

### Step 1.5: Verify Initial State
```bash
GET http://localhost:3001/leaves/entitlements/YOUR_EMPLOYEE_ID/LEAVE_TYPE_ID
Authorization: Bearer <your_jwt_token>
```

**Expected Response:**
```json
{
  "yearlyEntitlement": 15,
  "accruedActual": 0,
  "accruedRounded": 0,
  "carryForward": 0,
  "taken": 0,
  "pending": 0,
  "remaining": 0
}
```

**✅ Verify:** `remaining = accruedRounded (0) + carryForward (0) - taken (0) - pending (0) = 0` ✓

---

## Test 2: Test Auto-Accrual with Rounding

### Step 2.1: Run Monthly Accrual (Month 1)
```bash
POST http://localhost:3001/leaves/accruals/auto
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "leaveTypeId": "LEAVE_TYPE_ID",
  "accrualAmount": 1.25,
  "accrualType": "monthly"
}
```

**Expected Response:**
```json
{
  "successful": 1,
  "failed": 0,
  "skipped": 0,
  "total": 1,
  "details": [
    {
      "employeeId": "YOUR_EMPLOYEE_ID",
      "status": "success",
      "previousBalance": 0,
      "newBalance": 1,
      "accrualAmount": 1.25,
      "accrualType": "monthly"
    }
  ]
}
```

### Step 2.2: Verify Entitlement After Accrual
```bash
GET http://localhost:3001/leaves/entitlements/YOUR_EMPLOYEE_ID/LEAVE_TYPE_ID
```

**Expected Response:**
```json
{
  "accruedActual": 1.25,
  "accruedRounded": 1,
  "carryForward": 0,
  "taken": 0,
  "pending": 0,
  "remaining": 1
}
```

**✅ Verify:** 
- `accruedRounded = 1` (1.25 rounded to nearest = 1) ✓
- `remaining = 1 + 0 - 0 - 0 = 1` ✓

### Step 2.3: Run Second Monthly Accrual (Month 2)
```bash
POST http://localhost:3001/leaves/accruals/auto
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "leaveTypeId": "LEAVE_TYPE_ID",
  "accrualAmount": 1.25,
  "accrualType": "monthly"
}
```

**Expected Response:**
```json
{
  "details": [
    {
      "status": "success",
      "previousBalance": 1,
      "newBalance": 3,
      "accrualAmount": 1.25
    }
  ]
}
```

### Step 2.4: Verify Entitlement After Second Accrual
```bash
GET http://localhost:3001/leaves/entitlements/YOUR_EMPLOYEE_ID/LEAVE_TYPE_ID
```

**Expected Response:**
```json
{
  "accruedActual": 2.5,
  "accruedRounded": 3,
  "remaining": 3
}
```

**✅ Verify:**
- `accruedActual = 1.25 + 1.25 = 2.5` ✓
- `accruedRounded = 3` (2.5 rounded to nearest = 3) ✓
- `remaining = 3 + 0 - 0 - 0 = 3` ✓

---

## Test 3: Test Leave Request (Pending → Approved)

### Step 3.1: Create Leave Request (5 days)
```bash
POST http://localhost:3001/leaves/requests
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "employeeId": "YOUR_EMPLOYEE_ID",
  "leaveTypeId": "LEAVE_TYPE_ID",
  "startDate": "2025-03-15",
  "endDate": "2025-03-19",
  "justification": "Vacation"
}
```

**Save the `_id` as `REQUEST_ID`**

### Step 3.2: Verify Entitlement After Request Created
```bash
GET http://localhost:3001/leaves/entitlements/YOUR_EMPLOYEE_ID/LEAVE_TYPE_ID
```

**Expected Response:**
```json
{
  "accruedRounded": 3,
  "taken": 0,
  "pending": 5,
  "remaining": -2
}
```

**✅ Verify:**
- `pending = 5` ✓
- `remaining = 3 + 0 - 0 - 5 = -2` ✓ (negative is OK for pending)

### Step 3.3: Approve Leave Request
```bash
POST http://localhost:3001/leaves/requests/REQUEST_ID/approve
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "approvedBy": "MANAGER_USER_ID",
  "comments": "Approved"
}
```

### Step 3.4: Verify Entitlement After Approval
```bash
GET http://localhost:3001/leaves/entitlements/YOUR_EMPLOYEE_ID/LEAVE_TYPE_ID
```

**Expected Response:**
```json
{
  "accruedRounded": 3,
  "taken": 5,
  "pending": 0,
  "remaining": -2
}
```

**✅ Verify:**
- `taken = 5` ✓
- `pending = 0` ✓
- `remaining = 3 + 0 - 5 - 0 = -2` ✓

---

## Test 4: Test Unpaid Leave/Suspension Check (BR 11)

### Step 4.1: Update Employee Status to SUSPENDED
```bash
PATCH http://localhost:3001/employee-profiles/YOUR_EMPLOYEE_ID
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "status": "SUSPENDED"
}
```

### Step 4.2: Try to Accrue Leave (Should Skip)
```bash
POST http://localhost:3001/leaves/accruals/auto
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "leaveTypeId": "LEAVE_TYPE_ID",
  "accrualAmount": 1.25,
  "accrualType": "monthly"
}
```

**Expected Response:**
```json
{
  "successful": 0,
  "failed": 0,
  "skipped": 1,
  "total": 1,
  "details": [
    {
      "employeeId": "YOUR_EMPLOYEE_ID",
      "status": "skipped",
      "reason": "Employee is SUSPENDED"
    }
  ]
}
```

**✅ Verify:** Accrual was skipped because employee is suspended ✓

### Step 4.3: Verify Entitlement Unchanged
```bash
GET http://localhost:3001/leaves/entitlements/YOUR_EMPLOYEE_ID/LEAVE_TYPE_ID
```

**Expected Response:** Should be the same as before (no accrual happened)

### Step 4.4: Restore Employee Status to ACTIVE
```bash
PATCH http://localhost:3001/employee-profiles/YOUR_EMPLOYEE_ID
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "status": "ACTIVE"
}
```

---

## Test 5: Test Carry-Forward with Policy maxCarryForward

### Step 5.1: Accrue More Leave to Have Remaining Balance
Run accrual a few more times to build up remaining balance:
```bash
POST http://localhost:3001/leaves/accruals/auto
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "leaveTypeId": "LEAVE_TYPE_ID",
  "accrualAmount": 1.25,
  "accrualType": "monthly"
}
```

Repeat 3-4 times to get remaining balance > 5

### Step 5.2: Verify Current State
```bash
GET http://localhost:3001/leaves/entitlements/YOUR_EMPLOYEE_ID/LEAVE_TYPE_ID
```

**Note the `remaining` value** (should be > 5)

### Step 5.3: Run Carry-Forward
```bash
POST http://localhost:3001/leaves/carry-forward
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "leaveTypeId": "LEAVE_TYPE_ID",
  "asOfDate": "2025-12-31"
}
```

**Expected Response:**
```json
{
  "successful": 1,
  "failed": 0,
  "total": 1,
  "details": [
    {
      "employeeId": "YOUR_EMPLOYEE_ID",
      "status": "success",
      "carryForwardAmount": 5,
      "newBalance": <remaining - 5>
    }
  ]
}
```

**✅ Verify:**
- `carryForwardAmount = 5` (not 10! Uses policy maxCarryForward) ✓
- `carryForwardAmount <= maxCarryForward (5)` ✓

### Step 5.4: Verify Entitlement After Carry-Forward
```bash
GET http://localhost:3001/leaves/entitlements/YOUR_EMPLOYEE_ID/LEAVE_TYPE_ID
```

**Expected Response:**
```json
{
  "carryForward": 5,
  "remaining": <previous_remaining - 5>
}
```

**✅ Verify:**
- `carryForward = 5` ✓
- `remaining = accruedRounded + carryForward - taken - pending` ✓

---

## Test 6: Test Reset Logic

### Step 6.1: Run Reset (if reset date has passed)
```bash
POST http://localhost:3001/leaves/reset
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "criterion": "HIRE_DATE"
}
```

**Note:** This will only reset if the reset date (based on hire date) has passed.

### Step 6.2: Verify Entitlement After Reset
```bash
GET http://localhost:3001/leaves/entitlements/YOUR_EMPLOYEE_ID/LEAVE_TYPE_ID
```

**Expected Response:**
```json
{
  "yearlyEntitlement": 15,
  "accruedActual": 0,
  "accruedRounded": 0,
  "carryForward": 0,
  "taken": 0,
  "pending": 0,
  "remaining": 15
}
```

**✅ Verify:**
- All accrual fields reset to 0 ✓
- `carryForward = 0` (reset after using it) ✓
- `remaining = 15` (yearlyEntitlement, or 15 + carryForward if it was added) ✓

---

## Test 7: Test Frontend Integration

### Step 7.1: View Leave Balance in Frontend
1. Log in as the employee
2. Navigate to `/dashboard/leaves/requests` or leave balance page
3. Verify the balance displays correctly

### Step 7.2: View Leave History
1. Navigate to leave history/requests page
2. Verify past requests are displayed
3. Test filtering by leave type, date range, status

### Step 7.3: Test Manager View (if you have manager role)
1. Log in as manager
2. Navigate to team leave balances
3. Verify team members' balances are displayed correctly

---

## Quick Verification Checklist

After running all tests, verify:

- [ ] ✅ Remaining balance calculation is consistent: `remaining = accruedRounded + carryForward - taken - pending`
- [ ] ✅ Rounding works correctly (1.25 → 1, 2.5 → 3)
- [ ] ✅ Accrual skips when employee is SUSPENDED or ON_LEAVE
- [ ] ✅ Carry-forward uses `maxCarryForward` from policy (not hardcoded 10)
- [ ] ✅ Reset properly resets all fields including `carryForward = 0`
- [ ] ✅ Leave request approval correctly moves from `pending` to `taken`
- [ ] ✅ Frontend displays balances correctly
- [ ] ✅ No errors in backend logs

---

## Troubleshooting

### Issue: Accrual not working
- Check employee status (should be ACTIVE)
- Check if employee has entitlement created
- Check backend logs for errors

### Issue: Remaining balance seems wrong
- Verify using formula: `remaining = accruedRounded + carryForward - taken - pending`
- Check if there are pending requests
- Check if carry-forward was applied

### Issue: Carry-forward not working
- Verify policy has `carryForwardAllowed: true`
- Verify `maxCarryForward` is set in policy
- Check if there's remaining balance to carry forward

### Issue: Reset not working
- Check if reset date (based on criterion) has passed
- Verify employee has entitlement
- Check backend logs for errors

---

## Expected Results Summary

| Operation | accruedActual | accruedRounded | carryForward | taken | pending | remaining |
|-----------|---------------|----------------|--------------|-------|---------|-----------|
| Initial   | 0             | 0              | 0            | 0     | 0       | 0         |
| Month 1   | 1.25          | 1              | 0            | 0     | 0       | 1         |
| Month 2   | 2.5           | 3              | 0            | 0     | 0       | 3         |
| Request   | 2.5           | 3              | 0            | 0     | 5       | -2        |
| Approved  | 2.5           | 3              | 0            | 5     | 0       | -2        |
| Month 3   | 3.75          | 4              | 0            | 5     | 0       | -1        |
| Carry-Fwd | 3.75          | 4              | 5            | 5     | 0       | 4         |
| Reset     | 0             | 0              | 0            | 0     | 0       | 15        |

---

## Notes

- Replace `YOUR_EMPLOYEE_ID`, `LEAVE_TYPE_ID`, etc. with actual IDs from your system
- Adjust dates based on your test timeline
- The accrual amounts (1.25 per month) assume 15 days per year
- All calculations should be consistent with the formula: `remaining = accruedRounded + carryForward - taken - pending`

