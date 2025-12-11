# REC-020: Structured Assessment and Scoring Forms - Testing Guide

## 📋 User Story
**As an HR Employee, I want structured assessment and scoring forms per role, so evaluations are consistent and auditable.**

---

## 🎯 Testing Overview

This guide covers comprehensive testing for the Structured Assessment and Scoring Forms feature, including:
- Interview feedback submission
- Score validation and aggregation
- Role-based access control
- Audit trail verification
- Frontend and backend testing

---

## ✅ Prerequisites

### 1. Backend Setup
- ✅ Backend recruitment service running on `http://localhost:5000`
- ✅ Database connected and accessible
- ✅ Authentication service working

### 2. Test Accounts Required
You need accounts with the following roles:
- **HR_EMPLOYEE** (userType: "employee" with HR_EMPLOYEE role)
- **HR_MANAGER** (userType: "employee" with HR_MANAGER role)
- **RECRUITER** (userType: "employee" with RECRUITER role)
- **SYSTEM_ADMIN** (userType: "employee" with SYSTEM_ADMIN role)
- **JOB_CANDIDATE** (for viewing - no restriction)

### 3. Test Data Setup
Before testing, ensure you have:
- ✅ At least 1 published job requisition
- ✅ At least 1 application in "in_process" or "submitted" status
- ✅ At least 1 scheduled interview with:
  - Valid `scheduledDate` (can be past or future)
  - Status NOT "cancelled"
  - Panel members assigned (including the test user)
- ✅ Multiple panel members for the same interview (to test aggregation)

---

## 🧪 Test Scenarios

## **TEST GROUP 1: Submit Interview Feedback (Happy Path)**

### Test 1.1: Submit Feedback as HR Employee
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Log in as HR_EMPLOYEE
2. Navigate to `/dashboard/recruitment/hr-interviews`
3. Find an application with a scheduled interview
4. Click "Submit Feedback" button
5. In the feedback modal:
   - Enter score: `85` (0-100 range)
   - Enter comments: `"Candidate demonstrated strong technical skills and good communication. Recommended for next round."`
6. Click "Submit Feedback"

**Expected Results:**
- ✅ Modal opens with feedback form
- ✅ Score input accepts numeric values (0-100)
- ✅ Comments textarea is available
- ✅ Form validation works
- ✅ On submit:
  - Success toast: "Feedback submitted successfully"
  - Modal closes
  - Feedback is saved in database
  - Interview shows updated feedback status

**Verify:**
- Check database: `AssessmentResult` collection has new record
- Record contains: `interviewId`, `interviewerId`, `score: 85`, `comments`
- Timestamps (`createdAt`, `updatedAt`) are set
- Interview record links to feedback

**API Verification:**
```bash
GET /recruitment/interview/{interviewId}/feedback
# Should return array with your feedback
```

---

### Test 1.2: Submit Feedback as HR Manager
**Role:** HR_MANAGER  
**Priority:** High

**Steps:**
1. Log in as HR_MANAGER
2. Follow same steps as Test 1.1

**Expected Results:**
- ✅ Same functionality as HR_EMPLOYEE
- ✅ Can submit feedback successfully

**Verify:**
- Role-based access works correctly
- Feedback is saved with correct `interviewerId`

---

### Test 1.3: Submit Feedback as Recruiter
**Role:** RECRUITER  
**Priority:** High

**Steps:**
1. Log in as RECRUITER
2. Follow same steps as Test 1.1

**Expected Results:**
- ✅ Same functionality as HR_EMPLOYEE
- ✅ Can submit feedback successfully

---

### Test 1.4: Submit Feedback with Only Score (No Comments)
**Role:** HR_EMPLOYEE  
**Priority:** Medium

**Steps:**
1. Log in as HR_EMPLOYEE
2. Navigate to feedback form
3. Enter score: `75`
4. Leave comments empty
5. Submit

**Expected Results:**
- ✅ Submission succeeds (comments are optional)
- ✅ Feedback saved with `score: 75`, `comments: ""` or `null`

**Verify:**
- Backend accepts empty comments
- Database stores empty string or null

---

### Test 1.5: Update Existing Feedback
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Submit feedback (score: 80, comments: "Initial feedback")
2. Submit feedback again for the same interview
3. Enter new score: `90`
4. Enter new comments: `"Updated: Excellent candidate"`
5. Submit

**Expected Results:**
- ✅ Existing feedback is updated (not duplicated)
- ✅ New score and comments replace old values
- ✅ `updatedAt` timestamp changes
- ✅ `createdAt` timestamp remains unchanged

**Verify:**
- Database has only ONE record for this interviewer + interview
- Record shows updated values
- Timestamps are correct

---

## **TEST GROUP 2: Score Validation**

### Test 2.1: Submit Minimum Valid Score (0)
**Role:** HR_EMPLOYEE  
**Priority:** Medium

**Steps:**
1. Submit feedback with score: `0`

**Expected Results:**
- ✅ Submission succeeds
- ✅ Score 0 is accepted (valid minimum)

---

### Test 2.2: Submit Maximum Valid Score (100)
**Role:** HR_EMPLOYEE  
**Priority:** Medium

**Steps:**
1. Submit feedback with score: `100`

**Expected Results:**
- ✅ Submission succeeds
- ✅ Score 100 is accepted (valid maximum)

---

### Test 2.3: Submit Invalid Score (Negative)
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Try to submit feedback with score: `-1`

**Expected Results:**
- ❌ Frontend validation prevents submission OR
- ❌ Backend returns error: `"Score must be between 0 and 100"`
- ❌ Error toast appears
- ❌ Feedback is NOT saved

**Verify:**
- Error message is clear and user-friendly
- No database record created

---

### Test 2.4: Submit Invalid Score (Over 100)
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Try to submit feedback with score: `101`

**Expected Results:**
- ❌ Frontend validation prevents submission OR
- ❌ Backend returns error: `"Score must be between 0 and 100"`
- ❌ Error toast appears
- ❌ Feedback is NOT saved

---

### Test 2.5: Submit Invalid Score (Non-numeric)
**Role:** HR_EMPLOYEE  
**Priority:** Medium

**Steps:**
1. Try to enter non-numeric value in score field (e.g., "abc")

**Expected Results:**
- ❌ Input field prevents non-numeric entry (HTML5 number input)
- ❌ OR shows validation error

---

## **TEST GROUP 3: Interview Validation**

### Test 3.1: Submit Feedback for Non-existent Interview
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Try to submit feedback with invalid interview ID: `"invalid123"`

**Expected Results:**
- ❌ Backend returns: `404 Not Found` or `400 Bad Request`
- ❌ Error message: `"Interview not found"` or `"Invalid interview ID format"`
- ❌ Error toast appears
- ❌ Feedback is NOT saved

---

### Test 3.2: Submit Feedback for Cancelled Interview
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Find or create an interview with status: `"cancelled"`
2. Try to submit feedback

**Expected Results:**
- ❌ Backend returns: `400 Bad Request`
- ❌ Error message: `"Cannot submit feedback for a cancelled interview"`
- ❌ Error toast appears
- ❌ Feedback is NOT saved

---

### Test 3.3: Submit Feedback for Interview Without Scheduled Date
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Find or create an interview without `scheduledDate`
2. Try to submit feedback

**Expected Results:**
- ❌ Backend returns: `400 Bad Request`
- ❌ Error message: `"Interview has not been scheduled yet"`
- ❌ Error toast appears
- ❌ Feedback is NOT saved

---

### Test 3.4: Submit Feedback When Not in Panel
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Find an interview where your user is NOT in the `panel` array
2. Try to submit feedback

**Expected Results:**
- ❌ Backend returns: `400 Bad Request`
- ❌ Error message: `"Interviewer is not part of the interview panel"`
- ❌ Error toast appears
- ❌ Feedback is NOT saved

---

### Test 3.5: Submit Feedback for Future Interview (Warning)
**Role:** HR_EMPLOYEE  
**Priority:** Low

**Steps:**
1. Create an interview scheduled more than 1 day in the future
2. Submit feedback

**Expected Results:**
- ⚠️ Backend logs warning (console): `"Feedback submitted for interview scheduled more than 1 day in the future"`
- ✅ Feedback is still accepted (warning only, not error)
- ✅ Feedback is saved

**Verify:**
- Check backend console for warning message
- Feedback is saved successfully

---

## **TEST GROUP 4: View Interview Feedback**

### Test 4.1: View All Feedback for Interview (HR Employee)
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Navigate to interview details or feedback view
2. View all feedback submitted for an interview

**Expected Results:**
- ✅ Shows list of all feedback entries
- ✅ Each entry shows:
  - Interviewer name/ID
  - Score
  - Comments
  - Submission timestamp
- ✅ Multiple panel members' feedback visible

**API Test:**
```bash
GET /recruitment/interview/{interviewId}/feedback
Authorization: Bearer {token}

Expected Response:
[
  {
    "_id": "...",
    "interviewId": "...",
    "interviewerId": "...",
    "score": 85,
    "comments": "Good candidate",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  },
  {
    "_id": "...",
    "interviewId": "...",
    "interviewerId": "...",
    "score": 90,
    "comments": "Excellent",
    "createdAt": "2025-01-15T11:00:00.000Z",
    "updatedAt": "2025-01-15T11:00:00.000Z"
  }
]
```

---

### Test 4.2: View Feedback as Candidate (No Restriction)
**Role:** JOB_CANDIDATE  
**Priority:** Medium

**Steps:**
1. Log in as JOB_CANDIDATE
2. Navigate to interview details (if accessible)
3. View feedback

**Expected Results:**
- ✅ Can view feedback (no role restriction)
- ✅ All feedback entries visible

**Note:** This tests that viewing is unrestricted as per requirements.

---

### Test 4.3: View Feedback for Interview with No Feedback
**Role:** HR_EMPLOYEE  
**Priority:** Medium

**Steps:**
1. Find an interview with no feedback submitted
2. View feedback

**Expected Results:**
- ✅ Returns empty array: `[]`
- ✅ Frontend shows empty state or "No feedback yet" message
- ✅ No errors occur

---

## **TEST GROUP 5: Average Score Calculation**

### Test 5.1: Calculate Average Score (Single Feedback)
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Submit feedback with score: `85`
2. Get average score for the interview

**Expected Results:**
- ✅ Average score: `85` (single feedback)
- ✅ Calculation: `85 / 1 = 85`

**API Test:**
```bash
GET /recruitment/interview/{interviewId}/score
Authorization: Bearer {token}

Expected Response:
85
```

---

### Test 5.2: Calculate Average Score (Multiple Feedbacks)
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Have 3 panel members submit feedback:
   - Panel Member 1: Score `80`
   - Panel Member 2: Score `90`
   - Panel Member 3: Score `85`
2. Get average score

**Expected Results:**
- ✅ Average score: `85` (rounded if needed)
- ✅ Calculation: `(80 + 90 + 85) / 3 = 85`

**Verify:**
- Calculation is correct
- Handles decimal results appropriately

---

### Test 5.3: Calculate Average Score (No Feedback)
**Role:** HR_EMPLOYEE  
**Priority:** Medium

**Steps:**
1. Get average score for interview with no feedback

**Expected Results:**
- ✅ Returns: `0`
- ✅ No errors occur

---

### Test 5.4: Calculate Average Score (Updated Feedback)
**Role:** HR_EMPLOYEE  
**Priority:** Medium

**Steps:**
1. Panel Member 1 submits: Score `70`
2. Panel Member 2 submits: Score `80`
3. Average = `75`
4. Panel Member 1 updates to: Score `90`
5. Get new average

**Expected Results:**
- ✅ New average: `85` (not 75)
- ✅ Calculation uses updated score: `(90 + 80) / 2 = 85`

---

## **TEST GROUP 6: Role-Based Access Control**

### Test 6.1: Submit Feedback - Authorized Roles
**Roles:** HR_EMPLOYEE, HR_MANAGER, RECRUITER, SYSTEM_ADMIN  
**Priority:** Critical

**Steps:**
1. Test with each authorized role
2. Submit feedback

**Expected Results:**
- ✅ All authorized roles can submit feedback
- ✅ No access denied errors

---

### Test 6.2: Submit Feedback - Unauthorized Role
**Role:** JOB_CANDIDATE or DEPARTMENT_EMPLOYEE  
**Priority:** High

**Steps:**
1. Log in as unauthorized role
2. Try to access feedback submission endpoint

**Expected Results:**
- ❌ Backend returns: `403 Forbidden`
- ❌ Error message indicates insufficient permissions
- ❌ Frontend should not show feedback submission button (if implemented)

**API Test:**
```bash
POST /recruitment/interview/{interviewId}/feedback
Authorization: Bearer {candidate_token}
Body: { "score": 85, "comments": "Test" }

Expected Response:
403 Forbidden
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}
```

---

### Test 6.3: View Feedback - No Role Restriction
**Role:** Any authenticated user  
**Priority:** Medium

**Steps:**
1. Test viewing feedback with different roles
2. All should be able to view

**Expected Results:**
- ✅ All authenticated users can view feedback
- ✅ No role restrictions for viewing

---

## **TEST GROUP 7: Audit Trail & Data Integrity**

### Test 7.1: Verify Timestamps
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Submit feedback
2. Check database record

**Expected Results:**
- ✅ `createdAt` timestamp is set
- ✅ `updatedAt` timestamp is set
- ✅ Both timestamps are valid ISO dates

**Verify:**
```javascript
// Database record should have:
{
  "createdAt": ISODate("2025-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2025-01-15T10:30:00.000Z")
}
```

---

### Test 7.2: Verify Timestamp Update on Edit
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Submit feedback (note `createdAt` and `updatedAt`)
2. Wait 2 seconds
3. Update feedback
4. Check timestamps

**Expected Results:**
- ✅ `createdAt` remains unchanged
- ✅ `updatedAt` is updated to new time
- ✅ `updatedAt` > `createdAt`

---

### Test 7.3: Verify Interviewer ID Tracking
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Submit feedback as User A
2. Check database record

**Expected Results:**
- ✅ `interviewerId` matches User A's ID
- ✅ Cannot be modified by other users
- ✅ Links correctly to user profile

---

### Test 7.4: Verify Interview Linkage
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Submit feedback for Interview X
2. Check database record

**Expected Results:**
- ✅ `interviewId` matches Interview X's ID
- ✅ Interview record has `feedbackId` reference (if implemented)
- ✅ Can query feedback by interview ID

---

## **TEST GROUP 8: Frontend UI/UX**

### Test 8.1: Feedback Form Display
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Open feedback submission modal
2. Check form elements

**Expected Results:**
- ✅ Modal opens correctly
- ✅ Score input field visible (type: number)
- ✅ Comments textarea visible
- ✅ Submit button visible
- ✅ Cancel/Close button visible
- ✅ Form labels are clear

---

### Test 8.2: Score Input Validation (Frontend)
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Open feedback form
2. Test score input:
   - Enter `-1` → Should prevent or show error
   - Enter `101` → Should prevent or show error
   - Enter `50` → Should accept
   - Enter `abc` → Should prevent (number input)

**Expected Results:**
- ✅ Frontend validation prevents invalid scores
- ✅ Error messages appear for invalid input
- ✅ Submit button disabled for invalid input

---

### Test 8.3: Form Submission States
**Role:** HR_EMPLOYEE  
**Priority:** Medium

**Steps:**
1. Fill out feedback form
2. Click Submit
3. Observe loading state

**Expected Results:**
- ✅ Submit button shows loading state ("Submitting...")
- ✅ Form is disabled during submission
- ✅ Loading indicator visible
- ✅ After success: Modal closes, toast appears

---

### Test 8.4: Error Handling (Frontend)
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Try to submit with invalid data
2. Observe error handling

**Expected Results:**
- ✅ Error toast appears with clear message
- ✅ Form remains open (doesn't close on error)
- ✅ Error message is user-friendly
- ✅ No console errors

---

### Test 8.5: Success Feedback
**Role:** HR_EMPLOYEE  
**Priority:** Medium

**Steps:**
1. Submit valid feedback
2. Observe success handling

**Expected Results:**
- ✅ Success toast appears: "Feedback submitted successfully"
- ✅ Modal closes
- ✅ Form resets
- ✅ Interview list refreshes (if applicable)

---

## **TEST GROUP 9: Integration Tests**

### Test 9.1: Feedback Used in Ranking
**Role:** HR_EMPLOYEE  
**Priority:** Medium

**Steps:**
1. Submit feedback for multiple candidates
2. Check ranked applications endpoint

**Expected Results:**
- ✅ Applications ranked by average interview scores
- ✅ Higher scores rank higher
- ✅ Ranking algorithm uses feedback scores

**API Test:**
```bash
GET /recruitment/requisition/{requisitionId}/ranked-applications
# Should return applications sorted by average interview scores
```

---

### Test 9.2: Multiple Panel Members Submit Feedback
**Role:** HR_EMPLOYEE, HR_MANAGER, RECRUITER  
**Priority:** High

**Steps:**
1. Schedule interview with 3 panel members
2. Each panel member submits feedback:
   - HR_EMPLOYEE: Score `80`
   - HR_MANAGER: Score `90`
   - RECRUITER: Score `85`
3. View all feedback
4. Check average score

**Expected Results:**
- ✅ All 3 feedback entries saved
- ✅ Each has correct `interviewerId`
- ✅ Average score calculated correctly: `85`
- ✅ All feedback visible in view

---

### Test 9.3: Feedback Persistence
**Role:** HR_EMPLOYEE  
**Priority:** High

**Steps:**
1. Submit feedback
2. Refresh page
3. View feedback again

**Expected Results:**
- ✅ Feedback persists after page refresh
- ✅ Data loaded from database
- ✅ No data loss

---

## **TEST GROUP 10: Edge Cases**

### Test 10.1: Submit Feedback with Very Long Comments
**Role:** HR_EMPLOYEE  
**Priority:** Low

**Steps:**
1. Submit feedback with comments: 5000+ characters

**Expected Results:**
- ✅ Submission succeeds (if no backend limit)
- ✅ OR backend enforces reasonable limit (e.g., 2000 chars)
- ✅ Error message if limit exceeded

---

### Test 10.2: Submit Feedback with Special Characters
**Role:** HR_EMPLOYEE  
**Priority:** Low

**Steps:**
1. Submit feedback with comments containing:
   - Special characters: `!@#$%^&*()`
   - Unicode: `中文 العربية`
   - Emojis: `👍 😊`

**Expected Results:**
- ✅ All characters saved correctly
- ✅ No encoding issues
- ✅ Display correctly in UI

---

### Test 10.3: Concurrent Feedback Submission
**Role:** HR_EMPLOYEE, HR_MANAGER  
**Priority:** Medium

**Steps:**
1. Two panel members submit feedback simultaneously
2. Both for the same interview

**Expected Results:**
- ✅ Both submissions succeed
- ✅ No data conflicts
- ✅ Both records saved correctly

---

### Test 10.4: Submit Feedback for Deleted Interview
**Role:** HR_EMPLOYEE  
**Priority:** Low

**Steps:**
1. Delete an interview (if possible)
2. Try to submit feedback for deleted interview

**Expected Results:**
- ❌ Backend returns: `404 Not Found`
- ❌ Error message: `"Interview not found"`

---

## 📊 Test Execution Checklist

### Critical Tests (Must Pass)
- [ ] Test 1.1: Submit Feedback as HR Employee
- [ ] Test 2.3: Submit Invalid Score (Negative)
- [ ] Test 2.4: Submit Invalid Score (Over 100)
- [ ] Test 3.1: Submit Feedback for Non-existent Interview
- [ ] Test 3.2: Submit Feedback for Cancelled Interview
- [ ] Test 3.4: Submit Feedback When Not in Panel
- [ ] Test 5.2: Calculate Average Score (Multiple Feedbacks)
- [ ] Test 6.2: Submit Feedback - Unauthorized Role
- [ ] Test 7.1: Verify Timestamps
- [ ] Test 7.3: Verify Interviewer ID Tracking

### High Priority Tests
- [ ] Test 1.2: Submit Feedback as HR Manager
- [ ] Test 1.3: Submit Feedback as Recruiter
- [ ] Test 1.5: Update Existing Feedback
- [ ] Test 4.1: View All Feedback for Interview
- [ ] Test 5.1: Calculate Average Score (Single Feedback)
- [ ] Test 6.1: Submit Feedback - Authorized Roles
- [ ] Test 8.1: Feedback Form Display
- [ ] Test 8.2: Score Input Validation (Frontend)
- [ ] Test 9.2: Multiple Panel Members Submit Feedback

### Medium Priority Tests
- [ ] Test 1.4: Submit Feedback with Only Score
- [ ] Test 2.1: Submit Minimum Valid Score (0)
- [ ] Test 2.2: Submit Maximum Valid Score (100)
- [ ] Test 3.3: Submit Feedback for Interview Without Scheduled Date
- [ ] Test 4.2: View Feedback as Candidate
- [ ] Test 4.3: View Feedback for Interview with No Feedback
- [ ] Test 5.3: Calculate Average Score (No Feedback)
- [ ] Test 5.4: Calculate Average Score (Updated Feedback)
- [ ] Test 7.2: Verify Timestamp Update on Edit
- [ ] Test 7.4: Verify Interview Linkage

### Low Priority Tests
- [ ] Test 3.5: Submit Feedback for Future Interview (Warning)
- [ ] Test 6.3: View Feedback - No Role Restriction
- [ ] Test 8.3: Form Submission States
- [ ] Test 8.4: Error Handling (Frontend)
- [ ] Test 8.5: Success Feedback
- [ ] Test 9.1: Feedback Used in Ranking
- [ ] Test 9.3: Feedback Persistence
- [ ] Test 10.1-10.4: Edge Cases

---

## 🔧 API Testing with Thunder Client / Postman

### Setup
1. Import collection or create new requests
2. Set base URL: `http://localhost:5000/api/v1`
3. Get authentication token (login first)

### Test 1: Submit Interview Feedback
```http
POST /recruitment/interview/{interviewId}/feedback
Authorization: Bearer {token}
Content-Type: application/json

{
  "score": 85,
  "comments": "Candidate demonstrated strong technical skills."
}
```

**Expected:** `200 OK` or `201 Created`

### Test 2: Get Interview Feedback
```http
GET /recruitment/interview/{interviewId}/feedback
Authorization: Bearer {token}
```

**Expected:** `200 OK` with array of feedback objects

### Test 3: Get Average Score
```http
GET /recruitment/interview/{interviewId}/score
Authorization: Bearer {token}
```

**Expected:** `200 OK` with number (average score)

### Test 4: Invalid Score (Negative)
```http
POST /recruitment/interview/{interviewId}/feedback
Authorization: Bearer {token}
Content-Type: application/json

{
  "score": -1,
  "comments": "Test"
}
```

**Expected:** `400 Bad Request` with error message

### Test 5: Unauthorized Access
```http
POST /recruitment/interview/{interviewId}/feedback
Authorization: Bearer {candidate_token}
Content-Type: application/json

{
  "score": 85,
  "comments": "Test"
}
```

**Expected:** `403 Forbidden`

---

## 🐛 Common Issues to Watch For

1. **Score Range:** Backend expects 0-100, frontend might show 0-10
2. **Panel Validation:** Ensure user is in panel before submission
3. **Interview Status:** Cannot submit for cancelled interviews
4. **Timestamp Issues:** Check timezone handling
5. **Concurrent Updates:** Multiple panel members submitting simultaneously
6. **Empty Comments:** Should be optional, not required
7. **Interviewer ID:** Must be extracted from JWT token correctly

---

## 📝 Test Report Template

For each test, document:

1. **Test ID:** (e.g., Test 1.1)
2. **Test Name:** (e.g., "Submit Feedback as HR Employee")
3. **Priority:** Critical / High / Medium / Low
4. **Role:** HR_EMPLOYEE / HR_MANAGER / etc.
5. **Steps Taken:**
6. **Expected Result:**
7. **Actual Result:**
8. **Status:** ✅ Pass / ❌ Fail / ⚠️ Partial / ⏸️ Blocked
9. **Notes:** (Issues, observations, screenshots)
10. **Browser/Device:** (e.g., Chrome/Desktop)
11. **Backend Version:** (if applicable)
12. **Frontend Version:** (if applicable)

---

## ✅ Definition of Done

All tests should pass:
- ✅ All Critical tests pass
- ✅ All High Priority tests pass
- ✅ At least 80% of Medium Priority tests pass
- ✅ No blocking bugs
- ✅ Documentation updated
- ✅ Code reviewed

---

## 🚀 Quick Test Script

Run these in sequence for a quick smoke test:

1. **Login as HR_EMPLOYEE**
2. **Submit feedback** (score: 85, comments: "Test feedback")
3. **View feedback** (verify it appears)
4. **Update feedback** (score: 90, comments: "Updated")
5. **Get average score** (verify calculation)
6. **Test invalid score** (score: 101, should fail)
7. **Test unauthorized role** (login as candidate, should fail)

---

**Happy Testing! 🎉**

