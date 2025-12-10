# Recruitment Frontend Testing Guide

## 📋 Prerequisites

### 1. Backend Setup
- Ensure the backend recruitment service is running
- Verify API endpoints are accessible at the configured base URL
- Ensure database has test data:
  - At least one published job requisition
  - Test user accounts for each role (Candidate, Employee, Department Head)

### 2. Test Accounts Required
You need accounts with the following roles:
- **JOB_CANDIDATE** (userType: "candidate")
- **DEPARTMENT_EMPLOYEE** (userType: "employee")
- **DEPARTMENT_HEAD** (userType: "employee" with DEPARTMENT_HEAD role)

### 3. Test Data Setup
Before testing, ensure you have:
- ✅ At least 1 published job requisition
- ✅ Job requisition with a valid template (title, description, requirements)
- ✅ For candidates: existing applications (optional, for viewing)
- ✅ For employees: existing referrals (optional, for viewing)
- ✅ For department heads: clearance checklists (optional, for viewing)

---

## 🧪 Testing by Role

## **ROLE 1: JOB_CANDIDATE (Candidate)**

### Test 1.1: Access Recruitment Dashboard
**Steps:**
1. Log in as a candidate user
2. Navigate to `/dashboard/recruitment`

**Expected Results:**
- ✅ Page loads without errors
- ✅ Shows "Recruitment" heading with welcome message
- ✅ Displays 4 quick access cards:
  - My Applications
  - Interviews
  - Job Offers
  - Onboarding
- ✅ Shows "Available Job Openings" section below
- ✅ Only shows published job requisitions
- ✅ Each job card shows: title, department, location, openings count, status badge
- ✅ "View Details" button on each job card

**Verify:**
- No console errors
- Loading state appears briefly
- Empty state shows if no published jobs exist

---

### Test 1.2: Browse Job Openings
**Steps:**
1. From recruitment dashboard, view the job listings
2. Click "View Details" on a job card

**Expected Results:**
- ✅ Navigates to `/dashboard/recruitment/jobs/[id]`
- ✅ Shows full job details:
  - Job title (large, prominent)
  - Department, location, openings count
  - Full description
  - Responsibilities list
  - Requirements list
  - Qualifications list
  - Experience level
  - Employment type
- ✅ Shows "Apply for this Position" button (if job is published)
- ✅ "Back to Recruitment" link works

**Verify:**
- All job template fields display correctly
- Lists render properly (bullets, spacing)
- Status badge displays correctly

---

### Test 1.3: Apply for a Job
**Steps:**
1. Navigate to a job detail page
2. Click "Apply for this Position"
3. In the modal:
   - Try to submit without checking consent → should show error
   - Check the consent checkbox
   - Click "Submit Application"

**Expected Results:**
- ✅ Modal opens with job title
- ✅ Consent checkbox is unchecked by default
- ✅ Submit button is disabled until consent is checked
- ✅ Error message appears if trying to submit without consent
- ✅ After checking consent, submit button becomes enabled
- ✅ On submit:
  - Shows "Submitting..." state
  - Success toast: "Application submitted successfully!"
  - Redirects to `/dashboard/recruitment/my-applications` after 1.5 seconds
- ✅ Application appears in "My Applications" page

**Verify:**
- Modal closes after successful submission
- Application is created in backend
- Application status is "submitted"

---

### Test 1.4: View My Applications
**Steps:**
1. Navigate to `/dashboard/recruitment/my-applications`
2. View the applications list

**Expected Results:**
- ✅ Page loads with "My Applications" heading
- ✅ Shows all applications for the logged-in candidate
- ✅ Each application card shows:
  - Job title and department
  - Application status badge (color-coded)
  - Progress bar with percentage
  - Applied date
  - Current stage (if available)
- ✅ Empty state if no applications exist
- ✅ "Back to Recruitment" link works

**Verify:**
- Progress percentage matches status:
  - submitted: 20%
  - in_process: 40%
  - offer: 80%
  - hired: 100%
  - rejected: 0%
- Status badges have correct colors
- Dates format correctly

---

### Test 1.5: View Interviews
**Steps:**
1. Navigate to `/dashboard/recruitment/interviews`

**Expected Results:**
- ✅ Page loads with "My Interviews" heading
- ✅ Shows applications that are in interview stages
- ✅ Each interview card shows:
  - Job title
  - Interview stage (e.g., "DEPARTMENT INTERVIEW")
  - Position and department info
  - Status badge
  - Message about interview details
- ✅ Empty state if no interviews scheduled
- ✅ "Back to Recruitment" link works

**Verify:**
- Only shows applications with interview stages
- Interview stage text is formatted correctly (uppercase, spaces)

---

### Test 1.6: View and Respond to Offers
**Steps:**
1. Navigate to `/dashboard/recruitment/offers`
2. If offers exist, view offer details
3. Click "Respond to Offer"
4. In modal, choose Accept or Decline

**Expected Results:**
- ✅ Page loads with "Job Offers" heading
- ✅ Shows all offers for the candidate
- ✅ Each offer card shows:
  - Job title and department
  - Response status badge (pending/accepted/rejected)
  - Deadline date
  - Gross salary (if available)
  - Benefits list (if available)
  - Offer content/letter
- ✅ Action buttons:
  - "Respond to Offer" (if pending)
  - "Upload Contract" (if pending or accepted)
  - "Upload Forms" (if pending or accepted)
- ✅ Response modal:
  - Shows confirmation message
  - Has Cancel, Accept, and Decline buttons
  - On Accept/Decline:
    - Shows success toast
    - Updates offer status
    - Refreshes offer list

**Verify:**
- Offer status updates correctly
- Buttons change based on response status
- Toast notifications appear

---

### Test 1.7: Upload Contract and Forms
**Steps:**
1. From offers page, click "Upload Contract" or "Upload Forms"
2. In modal:
   - Select a file (PDF, DOC, DOCX)
   - Click "Upload"

**Expected Results:**
- ✅ Upload modal opens
- ✅ File input accepts: .pdf, .doc, .docx
- ✅ Selected file name displays
- ✅ Upload button disabled until file selected
- ✅ On upload:
  - Shows "Uploading..." state
  - Success toast appears
  - Modal closes
  - Offer list refreshes

**Verify:**
- File uploads successfully
- Document is associated with the offer
- Error handling if upload fails

---

### Test 1.8: View Onboarding
**Steps:**
1. Navigate to `/dashboard/recruitment/onboarding`
2. View onboarding tasks (if available)

**Expected Results:**
- ✅ Page loads with "Onboarding" heading
- ✅ If onboarding exists:
  - Shows progress overview card:
    - Overall progress percentage
    - Progress bar
    - Total tasks, Completed, Pending counts
  - Shows list of onboarding tasks
  - Each task shows:
    - Task name and department
    - Status badge (pending/in_progress/completed)
    - Deadline (if available)
    - Notes (if available)
    - "Upload Document" button (if not completed)
- ✅ If no onboarding:
  - Shows empty state message
  - Link to view offers

**Verify:**
- Progress percentage calculates correctly
- Task status badges display correctly
- Upload document functionality works (same as offer upload)

---

## **ROLE 2: DEPARTMENT_EMPLOYEE (Employee)**

### Test 2.1: Access Recruitment Dashboard (Employee)
**Steps:**
1. Log in as an employee user (not a candidate)
2. Navigate to `/dashboard/recruitment`

**Expected Results:**
- ✅ Page loads without errors
- ✅ Shows employee-specific view (not candidate view)
- ✅ Displays 2 cards:
  - My Referrals
  - Resignation
- ✅ Does NOT show job listings or candidate features

**Verify:**
- Role-based view works correctly
- No candidate features visible

---

### Test 2.2: View Referrals
**Steps:**
1. Navigate to `/dashboard/recruitment/referrals`

**Expected Results:**
- ✅ Page loads with "My Referrals" heading
- ✅ Shows list of referred candidates (if any)
- ✅ Each referral card shows:
  - Candidate name
  - Application status
  - Job position
  - Referral date
- ✅ Empty state if no referrals exist
- ✅ Note about tagging referrals (requires backend update)

**Verify:**
- Only shows referrals for the logged-in employee
- Status badges display correctly

---

### Test 2.3: Submit Resignation Request
**Steps:**
1. Navigate to `/dashboard/recruitment/resignation`
2. Fill out resignation form:
   - Effective date (future date)
   - Reason (text)
3. Click "Submit Resignation"

**Expected Results:**
- ✅ Page loads with "Resignation" heading
- ✅ Shows resignation form:
  - Effective date picker
  - Reason textarea
  - Submit button
- ✅ Form validation:
  - Effective date required
  - Reason required
- ✅ On submit:
  - Shows success toast
  - Form resets
  - Resignation appears in history
- ✅ Shows resignation history below form:
  - Previous resignation requests
  - Status of each request
  - Effective date and reason

**Verify:**
- Form validation works
- Resignation is created in backend
- History updates correctly
- Date picker works correctly

---

### Test 2.4: Track Resignation Status
**Steps:**
1. After submitting resignation, view the resignation history
2. Check status updates

**Expected Results:**
- ✅ Resignation appears in history immediately
- ✅ Status badge shows current status
- ✅ Shows effective date and reason
- ✅ Status updates as HR processes the request

**Verify:**
- Status reflects backend state
- History persists across page refreshes

---

## **ROLE 3: DEPARTMENT_HEAD**

### Test 3.1: Access Recruitment Dashboard (Department Head)
**Steps:**
1. Log in as a department head user
2. Navigate to `/dashboard/recruitment`

**Expected Results:**
- ✅ Page loads without errors
- ✅ Shows department head-specific view
- ✅ Displays 2 cards:
  - Department Interviews
  - Clearance Checklists
- ✅ Does NOT show candidate or employee features

**Verify:**
- Role-based view works correctly
- Correct features visible

---

### Test 3.2: View Department Interviews
**Steps:**
1. Navigate to `/dashboard/recruitment/department-interviews`

**Expected Results:**
- ✅ Page loads with "Department Interviews" heading
- ✅ Shows interviews for the department head's department
- ✅ Each interview card shows:
  - Job title
  - Candidate name
  - Interview stage
  - Status badge
- ✅ Empty state if no interviews
- ✅ Note about feedback submission (requires backend update)

**Verify:**
- Only shows department interviews
- Candidate information displays correctly

---

### Test 3.3: Manage Clearance Checklists
**Steps:**
1. Navigate to `/dashboard/recruitment/clearance`
2. View clearance checklists
3. Update a clearance item:
   - Click on a checklist
   - Update an item status
   - Add notes (optional)
   - Click "Update Status"

**Expected Results:**
- ✅ Page loads with "Clearance Checklists" heading
- ✅ Shows list of clearance checklists
- ✅ Each checklist shows:
  - Employee name
  - Department
  - Checklist status
  - Number of items
- ✅ Clicking a checklist shows:
  - List of clearance items
  - Each item has:
    - Item name
    - Current status
    - Notes (if any)
  - Update form for each item
- ✅ On update:
  - Shows success toast
  - Item status updates
  - Notes saved (if provided)

**Verify:**
- Clearance items update correctly
- Status changes reflect in UI
- Notes are saved and displayed
- Form validation works

---

## 🔍 General Testing Scenarios

### Test G.1: Navigation
**Steps:**
1. Test all "Back to Recruitment" links
2. Test navigation between pages
3. Test browser back/forward buttons

**Expected Results:**
- ✅ All navigation links work correctly
- ✅ Browser history works
- ✅ No broken links

---

### Test G.2: Error Handling
**Steps:**
1. Test with network errors (disable network)
2. Test with invalid data
3. Test with missing permissions

**Expected Results:**
- ✅ Error toasts appear
- ✅ User-friendly error messages
- ✅ No crashes or blank screens
- ✅ Loading states show during API calls

---

### Test G.3: Responsive Design
**Steps:**
1. Test on different screen sizes:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)

**Expected Results:**
- ✅ Layout adapts correctly
- ✅ Cards stack on mobile
- ✅ Buttons are touch-friendly
- ✅ Text is readable
- ✅ No horizontal scrolling

---

### Test G.4: Loading States
**Steps:**
1. Navigate to pages with slow network (throttle in DevTools)
2. Observe loading states

**Expected Results:**
- ✅ Loading indicators appear
- ✅ "Loading..." messages show
- ✅ No blank screens during loading
- ✅ Smooth transitions

---

### Test G.5: Empty States
**Steps:**
1. Test pages with no data:
   - No applications
   - No jobs
   - No offers
   - No referrals

**Expected Results:**
- ✅ Empty state messages appear
- ✅ Helpful guidance (e.g., "Browse available jobs")
- ✅ Links to relevant pages
- ✅ No errors or crashes

---

### Test G.6: Status Badges
**Steps:**
1. Verify status badges on all pages
2. Check color coding

**Expected Results:**
- ✅ Status badges display correctly
- ✅ Colors match status:
  - Blue: submitted
  - Yellow: in_process
  - Purple: offer
  - Green: hired/completed
  - Red: rejected
- ✅ Text is readable
- ✅ Badges are properly sized

---

### Test G.7: Toast Notifications
**Steps:**
1. Trigger various actions (success, error)
2. Observe toast behavior

**Expected Results:**
- ✅ Toasts appear at top-right
- ✅ Auto-dismiss after 3 seconds
- ✅ Can be manually closed
- ✅ Success: green
- ✅ Error: red
- ✅ Info: blue
- ✅ Warning: yellow

---

### Test G.8: Form Validation
**Steps:**
1. Test all forms:
   - Application (consent)
   - Resignation (date, reason)
   - Clearance (status)

**Expected Results:**
- ✅ Required fields validated
- ✅ Error messages appear
- ✅ Submit disabled until valid
- ✅ Date pickers work correctly
- ✅ File uploads validate file types

---

## 🐛 Known Limitations to Test

### Limitation 1: Employee Referral Tagging
- **Status:** View-only (tagging requires HR_EMPLOYEE/HR_MANAGER role)
- **Test:** Verify employees can view referrals but cannot tag new ones
- **Expected:** Note displayed about backend requirement

### Limitation 2: Department Head Interview Feedback
- **Status:** View-only (feedback submission requires HR_EMPLOYEE/HR_MANAGER/RECRUITER)
- **Test:** Verify department heads can view interviews but cannot submit feedback
- **Expected:** Note displayed about backend requirement

---

## ✅ Test Checklist

### Candidate Features
- [ ] Access recruitment dashboard
- [ ] Browse job openings
- [ ] View job details
- [ ] Apply for job (with consent)
- [ ] View my applications
- [ ] View interviews
- [ ] View offers
- [ ] Respond to offer (accept/decline)
- [ ] Upload contract document
- [ ] Upload candidate forms
- [ ] View onboarding tasks
- [ ] Upload onboarding documents

### Employee Features
- [ ] Access recruitment dashboard (employee view)
- [ ] View referrals
- [ ] Submit resignation request
- [ ] Track resignation status

### Department Head Features
- [ ] Access recruitment dashboard (dept head view)
- [ ] View department interviews
- [ ] View clearance checklists
- [ ] Update clearance item status
- [ ] Add notes to clearance items

### General
- [ ] Navigation works
- [ ] Error handling
- [ ] Responsive design
- [ ] Loading states
- [ ] Empty states
- [ ] Status badges
- [ ] Toast notifications
- [ ] Form validation

---

## 📝 Test Report Template

For each test, document:
1. **Test ID:** (e.g., Test 1.1)
2. **Role:** (Candidate/Employee/Department Head)
3. **Feature:** (e.g., "Apply for Job")
4. **Steps Taken:**
5. **Expected Result:**
6. **Actual Result:**
7. **Status:** ✅ Pass / ❌ Fail / ⚠️ Partial
8. **Notes:** (Any issues, bugs, or observations)

---

## 🚨 Common Issues to Watch For

1. **API Errors:** Check browser console for 401, 403, 404, 500 errors
2. **Role Access:** Verify users can only see features for their role
3. **Data Loading:** Ensure data loads correctly from backend
4. **State Management:** Check that state updates correctly after actions
5. **Navigation:** Verify all links work and routes are correct
6. **Responsive:** Test on multiple screen sizes
7. **Performance:** Check for slow loading or lag

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify backend API is running
3. Check network tab for failed requests
4. Verify user role and permissions
5. Check test data exists in database

---

**Happy Testing! 🎉**

