# Testing FIRST_LAST vs MULTIPLE Punch Policy

## Test Scenario
Employee ID: `692b670daf00a04b192f9538`
Date: December 20, 2025
Shift Assignment: Night Rotational (should have MULTIPLE punch policy)

## CSV Test Data
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

## Expected Results

### If Punch Policy = MULTIPLE
**Attendance Record:**
- Number of Records: 1 (one record per day)
- Number of Punches in Record: 8 (all punches kept)
- Punches:
  1. IN at 08:00
  2. OUT at 10:00
  3. IN at 10:30
  4. OUT at 12:00
  5. IN at 13:00
  6. OUT at 15:00
  7. IN at 15:30
  8. OUT at 17:00

**Total Work Time Calculation:**
- Session 1: 10:00 - 08:00 = 2 hours (120 min)
- Session 2: 12:00 - 10:30 = 1.5 hours (90 min)
- Session 3: 15:00 - 13:00 = 2 hours (120 min)
- Session 4: 17:00 - 15:30 = 1.5 hours (90 min)
- **Total: 7 hours (420 minutes)**

### If Punch Policy = FIRST_LAST
**Attendance Record:**
- Number of Records: 1 (one record per day)
- Number of Punches in Record: 2 (only first IN and last OUT)
- Punches:
  1. IN at 08:00 (first IN)
  2. OUT at 17:00 (last OUT)

**Total Work Time Calculation:**
- 17:00 - 08:00 = 9 hours (540 minutes)

## What Was Happening (BUG)
The system was creating 1 record with 2 punches (first IN and last OUT) even though the shift policy was MULTIPLE, indicating the punch policy was being read as FIRST_LAST or the comparison logic was faulty.

## Fix Applied
1. **Added explicit enum import**: Imported `PunchPolicy` enum for proper comparison
2. **Normalized policy string**: Added `.toUpperCase().trim()` to handle any case/whitespace issues
3. **Added detailed logging**: Shows:
   - Raw punch policy from database
   - Normalized policy value
   - All collected punches before filtering
   - All filtered punches after applying policy
   - Total work minutes calculation

4. **Fixed array reference issue**: Changed `let filteredPunches = punchesSorted;` to `let filteredPunches = [...punchesSorted];` to avoid reference issues

## How to Test

### Step 1: Verify Shift Assignment
1. Check that employee `692b670daf00a04b192f9538` has "Night Rotational" shift assigned for 2025-12-20
2. Verify the assignment status is APPROVED
3. Check the shift's punch policy (should be MULTIPLE)

### Step 2: Import CSV
1. Go to Time Management → Import Attendance
2. Paste the CSV content or upload the file
3. Click "Import Attendance"

### Step 3: Check Backend Logs
Look for these log messages:
```
📋 Processing 692b670daf00a04b192f9538|2025-12-20: Shift="Night Rotational"
📋 Shift Object: {...}
📋 Punch Policy from DB: "MULTIPLE" (type: string)
📋 Final Policy to use: "MULTIPLE"
📊 Total punches collected: 8
  Punch 1: IN at 2025-12-20T08:00:00.000Z
  Punch 2: OUT at 2025-12-20T10:00:00.000Z
  ...
🔍 Normalized Policy: "MULTIPLE"
🔄 MULTIPLE: Keeping all 8 punches
📊 Filtered punches: 8
  Final Punch 1: IN at 2025-12-20T08:00:00.000Z
  ...
✅ Created attendance record for 692b670daf00a04b192f9538 on 2025-12-20 with 420 minutes
```

### Step 4: Verify Database Record
Check the created attendance record:
```javascript
{
  employeeId: ObjectId("692b670daf00a04b192f9538"),
  punches: [
    { type: 'IN', time: ISODate('2025-12-20T08:00:00.000Z') },
    { type: 'OUT', time: ISODate('2025-12-20T10:00:00.000Z') },
    { type: 'IN', time: ISODate('2025-12-20T10:30:00.000Z') },
    { type: 'OUT', time: ISODate('2025-12-20T12:00:00.000Z') },
    { type: 'IN', time: ISODate('2025-12-20T13:00:00.000Z') },
    { type: 'OUT', time: ISODate('2025-12-20T15:00:00.000Z') },
    { type: 'IN', time: ISODate('2025-12-20T15:30:00.000Z') },
    { type: 'OUT', time: ISODate('2025-12-20T17:00:00.000Z') }
  ],
  totalWorkMinutes: 420,
  hasMissedPunch: false
}
```

### Step 5: Verify Frontend Display
1. Go to Attendance Records
2. Filter by employee and date (2025-12-20)
3. Click on the record to see details
4. Verify:
   - All 8 punches are shown
   - Total work time = 7 hours (420 minutes) or displayed as "7h 0m"

## Troubleshooting

### If still showing only 2 punches (first IN, last OUT):
1. **Check shift punch policy in database**:
   - Verify the "Night Rotational" shift document
   - Ensure `punchPolicy` field = "MULTIPLE"
   - Check for typos or case sensitivity

2. **Check backend logs**:
   - Look for the "Punch Policy from DB" log
   - If it shows "FIRST_LAST", update the shift in database
   - If it shows "MULTIPLE" but still filters to 2, there's a logic issue

3. **Clear existing records**:
   - Delete the existing attendance record for 2025-12-20
   - Re-import the CSV

4. **Restart backend server**:
   - Stop the backend
   - Clear any cached data
   - Restart and try again

## Database Query to Check Shift Policy
```javascript
// In MongoDB shell or Compass
db.shifts.findOne({ name: "Night Rotational" })

// Should show:
{
  _id: ObjectId("..."),
  name: "Night Rotational",
  punchPolicy: "MULTIPLE",  // <-- Check this field
  ...
}
```

## Database Query to Update Shift Policy (if needed)
```javascript
// If the shift policy is wrong, update it:
db.shifts.updateOne(
  { name: "Night Rotational" },
  { $set: { punchPolicy: "MULTIPLE" } }
)
```
