# Shift Assignment and Punch Policy Implementation Guide

## Overview
This document explains how the attendance system validates shift assignments and enforces punch policies (FIRST_LAST vs MULTIPLE) for clock-in/out operations and CSV imports.

## Key Principles

### 1. Shift Assignment Validation
- **Requirement**: Employees MUST have an approved shift assigned for the specific date they are clocking in/out.
- **Behavior**: 
  - If no shift is assigned for the date, the system will reject the clock-in/out attempt.
  - Error message: `"Cannot clock in. No shift assigned for YYYY-MM-DD. Please contact your manager to assign a shift for this date."`

### 2. Punch Policy Enforcement
Each shift has a punch policy that determines how attendance is recorded:

#### FIRST_LAST Policy
- **Description**: Only the first clock-in (IN) and last clock-out (OUT) are recorded for the day.
- **Behavior**:
  - Any additional IN/OUT punches between the first IN and last OUT are ignored.
  - Total work time = Last OUT time - First IN time
  - Example: If you clock in at 8:00 AM, out at 10:00 AM, in at 10:30 AM, and out at 5:00 PM:
    - Only 8:00 AM IN and 5:00 PM OUT are recorded
    - Total work time = 9 hours (5:00 PM - 8:00 AM)

#### MULTIPLE Policy
- **Description**: All clock-in and clock-out pairs are recorded.
- **Behavior**:
  - Each IN/OUT pair is tracked separately.
  - Total work time = Sum of all (OUT time - IN time) pairs
  - Example: If you clock in at 8:00 AM, out at 10:00 AM, in at 10:30 AM, and out at 5:00 PM:
    - All 4 punches are recorded
    - Total work time = (10:00 AM - 8:00 AM) + (5:00 PM - 10:30 AM) = 2 hours + 6.5 hours = 8.5 hours

## Clock-In/Out Operations

### Regular Clock-In/Out (Current Date)
```
POST /time-management/clock-in/:employeeId
POST /time-management/clock-out/:employeeId
```

**Behavior**:
1. System uses the current date/time for the punch.
2. Validates that the employee has a shift assigned for today.
3. Enforces the punch policy defined in the assigned shift.
4. Creates an attendance record with audit trail.

**Example Error**:
```
Error: Cannot clock in. No shift assigned for 2025-12-19. Please contact your manager to assign a shift for this date.
```

### Manual Attendance Adjustments (Past/Future Dates)
For missed punches or corrections, the system supports optional date parameters:
- `clockInWithID(employeeId, currentUserId, punchDate?)`
- `clockOutWithID(employeeId, currentUserId, punchDate?)`

**Behavior**:
1. If `punchDate` is provided, uses that date instead of current date.
2. Validates shift assignment for the specified date.
3. Useful for fixing missed punches on past dates.

## CSV Import Behavior

### Format
```csv
employeeId,punchType,time
692b670daf00a04b192f9538,IN,2025-12-20T08:00:00Z
692b670daf00a04b192f9538,OUT,2025-12-20T10:00:00Z
```

### Import Process
1. **Grouping**: Punches are grouped by employee ID and date.
2. **Shift Validation**: For each group:
   - System checks if the employee has an approved shift assigned for that date.
   - If NO shift is found, the attendance record is SKIPPED with an error message.
   - Error: `"Employee XXX has no shift assigned for YYYY-MM-DD. Skipping attendance record."`

3. **Punch Policy Application**:
   - System retrieves the punch policy from the assigned shift.
   - Filters punches according to the policy:
     - **FIRST_LAST**: Keeps only first IN and last OUT
     - **MULTIPLE**: Keeps all punches

4. **Attendance Record Creation**:
   - Creates an attendance record with filtered punches.
   - Calculates total work minutes based on punch policy.
   - Flags missed punches (unpaired IN/OUT).

### Example Scenarios

#### Scenario 1: FIRST_LAST Policy with Multiple Punches
**CSV Data**:
```csv
employeeId,punchType,time
692b670daf00a04b192f9538,IN,2025-12-20T08:00:00Z
692b670daf00a04b192f9538,OUT,2025-12-20T10:00:00Z
692b670daf00a04b192f9538,IN,2025-12-20T10:30:00Z
692b670daf00a04b192f9538,OUT,2025-12-20T12:00:00Z
692b670daf00a04b192f9538,IN,2025-12-20T13:00:00Z
692b670daf00a04b192f9538,OUT,2025-12-20T15:00:00Z
692b670daf00a04b192f9538,IN,2025-12-20T15:30:00Z
692b670daf00a04b192f9538,OUT,2025-12-20T17:00:00Z
```

**Result** (if FIRST_LAST policy):
- Filtered Punches: 
  - IN: 2025-12-20T08:00:00Z (first IN)
  - OUT: 2025-12-20T17:00:00Z (last OUT)
- Total Work Time: 9 hours (540 minutes)

**Result** (if MULTIPLE policy):
- All 8 punches are kept
- Total Work Time: Sum of all pairs
  - (10:00 - 8:00) = 2 hours
  - (12:00 - 10:30) = 1.5 hours
  - (15:00 - 13:00) = 2 hours
  - (17:00 - 15:30) = 1.5 hours
  - Total = 7 hours (420 minutes)

#### Scenario 2: No Shift Assigned
**CSV Data**:
```csv
employeeId,punchType,time
692b670daf00a04b192f9538,IN,2025-12-25T08:00:00Z
692b670daf00a04b192f9538,OUT,2025-12-25T17:00:00Z
```

**Result** (if no shift assigned for 2025-12-25):
- **ERROR**: "Employee 692b670daf00a04b192f9538 has no shift assigned for 2025-12-25. Skipping attendance record."
- No attendance record is created for this date.

## Testing the System

### Step 1: Ensure Shift Assignment
Before testing, verify the employee has a shift assigned:
1. Go to Shift Assignments in the system
2. Create/verify a shift assignment for the employee
3. Ensure the assignment:
   - Status is APPROVED
   - Start Date ≤ Test Date
   - End Date ≥ Test Date (or is null for ongoing)

### Step 2: Check Shift Punch Policy
Verify the punch policy of the assigned shift:
1. Go to Shift Management
2. Find the shift assigned to the employee
3. Check the Punch Policy field (FIRST_LAST or MULTIPLE)

### Step 3: Import CSV
1. Use the CSV format with employee ID and punch times
2. Import via the Time Management interface
3. Review the import results:
   - Success count
   - Errors (if any shifts are missing)
   - Created attendance records

### Step 4: Verify Attendance Records
1. Go to Attendance Records
2. Filter by employee and date
3. Verify:
   - Correct punches are recorded (filtered by punch policy)
   - Total work minutes match expected calculation
   - Missed punch flags (if any unpaired punches)

## Logs and Debugging

### Console Logs
The system outputs detailed logs during CSV import:
```
📋 Processing 692b670daf00a04b192f9538|2025-12-20: Shift="Morning Shift", Policy="FIRST_LAST"
🔄 FIRST_LAST: Filtered from 8 to 2 punches
✅ Created attendance record for 692b670daf00a04b192f9538 on 2025-12-20 with 540 minutes
```

### Error Messages
- **No Shift Assigned**: `"Employee XXX has no shift assigned for YYYY-MM-DD. Skipping attendance record."`
- **Invalid Employee ID**: `"Invalid employeeId format (expected MongoDB ObjectId)"`
- **Invalid Punch Type**: `"Invalid punchType: XXX (expected IN or OUT)"`
- **Invalid Time**: `"Invalid time: XXX"`

## Business Rules Summary

1. **BR-TM-11**: Attendance system must support both FIRST_LAST and MULTIPLE punch policies.
2. **Shift Assignment Required**: Employees must have an approved shift assigned for the date they are recording attendance.
3. **Date-Based Validation**: Shift assignments are validated based on the punch date, not the current date.
4. **Policy Enforcement**: Punch policies are automatically enforced during CSV import and manual clock-in/out.
5. **Manual Adjustments**: Past dates can be adjusted via manual attendance records (used for fixing missed punches).

## API Changes

### Updated Method Signatures
```typescript
// Added optional punchDate parameter for manual adjustments
clockInWithID(employeeId: string, currentUserId: string, punchDate?: Date)
clockOutWithID(employeeId: string, currentUserId: string, punchDate?: Date)
```

### CSV Import Enhancement
- Now validates shift assignments for each punch date
- Enforces punch policy based on assigned shift
- Skips records with no shift assignment
- Provides detailed error messages

## Next Steps
1. Test the CSV import with the provided test file
2. Verify that FIRST_LAST policy correctly filters punches
3. Test scenarios with missing shift assignments
4. Validate total work time calculations for both policies
