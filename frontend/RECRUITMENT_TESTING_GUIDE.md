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
- **HR_MANAGER** (userType: "employee" with HR_MANAGER role)
- **HR_EMPLOYEE** (userType: "employee" with HR_EMPLOYEE role)
- **RECRUITER** (userType: "employee" with RECRUITER role)

### 3. Test Data Setup
Before testing, ensure you have:
- ✅ At least 1 job template (for HR to create requisitions)
- ✅ At least 1 published job requisition
- ✅ Job requisition with a valid template (title, description, requirements)
- ✅ For candidates: existing applications (optional, for viewing)
- ✅ For employees: existing referrals (optional, for viewing)
- ✅ For department heads: clearance checklists (optional, for viewing)
- ✅ For HR: at least 1 application in "in_process" status (for interview scheduling)
- ✅ For HR: at least 1 application in "offer" status (for offer management)
- ✅ For HR: at least 1 accepted offer with uploaded contract (for onboarding)

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

## **ROLE 4: HR_MANAGER**

### Test 4.1: Access Recruitment Dashboard (HR Manager)
**Steps:**
1. Log in as an HR Manager user
2. Navigate to `/dashboard/recruitment`

**Expected Results:**
- ✅ Page loads without errors
- ✅ Shows HR Manager-specific view
- ✅ Displays 6 quick access cards:
  - Job Requisitions
  - Applications
  - Interviews
  - Offers
  - Onboarding
  - Referrals
- ✅ Shows "All Job Requisitions" section below with all jobs (published and draft)
- ✅ Each job card shows: title, department, location, openings, status, published status

**Verify:**
- Role-based view works correctly
- All HR management features visible
- Job requisitions list shows all jobs (not just published)

---

### Test 4.2: Create Job Requisition
**Steps:**
1. Navigate to `/dashboard/recruitment/job-requisitions`
2. Click "Create Job Requisition"
3. Fill out the form:
   - Select a job template (required)
   - Enter number of openings (required, minimum 1)
   - Enter location (optional)
   - Enter hiring manager ID (optional)
4. Click "Create"

**Expected Results:**
- ✅ Modal opens with form
- ✅ Job template dropdown shows available templates
- ✅ Form validation:
  - Template required
  - Openings must be at least 1
- ✅ On submit:
  - Shows success toast
  - Modal closes
  - New requisition appears in list
  - Status is "draft" by default
- ✅ New requisition card shows all entered information

**Verify:**
- Requisition is created in backend
- Default status is correct
- All fields save correctly

---

### Test 4.3: Publish Job Requisition
**Steps:**
1. From job requisitions page, find an unpublished requisition
2. Click "Publish" button
3. Confirm the action

**Expected Results:**
- ✅ "Publish" button only shows for unpublished jobs
- ✅ On publish:
  - Shows success toast
  - Job status updates
  - Job becomes visible to candidates
  - "Publish" button disappears (job is now published)

**Verify:**
- Published status updates correctly
- Job appears in candidate view
- Cannot publish already published jobs

---

### Test 4.4: Update Job Requisition Status
**Steps:**
1. From job requisitions page, find a requisition
2. Update its status (if status update feature is available)
3. Verify status change

**Expected Results:**
- ✅ Status can be updated (if feature implemented)
- ✅ Status badge updates immediately
- ✅ Success toast appears

**Verify:**
- Status persists after page refresh
- Status changes reflect in backend

---

### Test 4.5: Manage Applications
**Steps:**
1. Navigate to `/dashboard/recruitment/applications`
2. View all applications
3. Filter by job requisition (if multiple exist)
4. Click "Update Status" on an application
5. Select new status and submit

**Expected Results:**
- ✅ Page loads with all applications
- ✅ Filter dropdown shows all job requisitions
- ✅ Each application card shows:
  - Job title and candidate name
  - Current status badge
  - Progress bar
  - Current stage
  - Applied date
- ✅ Status update modal:
  - Shows current status
  - Dropdown with all status options
  - Update button
- ✅ On update:
  - Shows success toast
  - Status badge updates
  - Progress bar updates
  - Application list refreshes

**Verify:**
- Filter works correctly
- Status updates persist
- Progress percentage recalculates
- All status options available

---

### Test 4.6: Create Job Offer
**Steps:**
1. Navigate to `/dashboard/recruitment/hr-offers`
2. Find an application with status "offer" or "in_process"
3. Click "Create Offer"
4. Fill out offer form:
   - Gross salary (required)
   - Signing bonus (optional)
   - Offer deadline (required)
5. Click "Create Offer"

**Expected Results:**
- ✅ Modal opens with offer form
- ✅ Form validation:
  - Gross salary required and > 0
  - Deadline required (future date)
- ✅ On submit:
  - Shows success toast
  - Modal closes
  - Offer is created
  - Candidate can now see the offer

**Verify:**
- Offer is created in backend
- Candidate receives notification (if implemented)
- Offer appears in candidate's offers page

---

### Test 4.7: Finalize Offer
**Steps:**
1. From offers page, find an offer that needs finalization
2. Click "Finalize Offer" (if available)
3. Select final status (Approved/Rejected/Pending)
4. Submit

**Expected Results:**
- ✅ Finalize modal opens
- ✅ Status dropdown shows: Approved, Rejected, Pending
- ✅ On submit:
  - Shows success toast
  - Offer final status updates
  - If approved, option to create employee appears

**Verify:**
- Final status persists
- Approved offers can create employees
- Rejected offers are marked appropriately

---

### Test 4.8: Create Employee from Contract
**Steps:**
1. From offers page, find an offer with accepted status and uploaded contract
2. Click "Create Employee" (if available)
3. Fill out employee form:
   - Start date (required)
   - Work email (optional)
   - Employee number (optional)
4. Submit

**Expected Results:**
- ✅ Modal opens with employee creation form
- ✅ Form validation:
  - Start date required (future date)
- ✅ On submit:
  - Shows success toast
  - Employee profile created
  - Onboarding can be initiated

**Verify:**
- Employee is created in backend
- Employee profile accessible
- Ready for onboarding setup

---

### Test 4.9: Manage Onboarding
**Steps:**
1. Navigate to `/dashboard/recruitment/hr-onboarding`
2. Click "Create Onboarding"
3. Fill out form:
   - Employee ID (required)
   - Contract ID (optional)
4. Submit
5. After creation, click "Add Task" on the onboarding
6. Fill out task form:
   - Task name (required)
   - Department (required)
   - Deadline (optional)
7. Submit

**Expected Results:**
- ✅ Create onboarding modal opens
- ✅ Form validation works
- ✅ On submit:
  - Shows success toast
  - New onboarding appears in list
- ✅ Add task modal opens
- ✅ Task form validation works
- ✅ On submit:
  - Task added to onboarding
  - Progress bar updates
  - Task appears in task list

**Verify:**
- Onboarding created successfully
- Tasks can be added
- Progress percentage calculates correctly

---

### Test 4.10: Update Onboarding Task Status
**Steps:**
1. From onboarding page, find an onboarding with tasks
2. Change a task's status using the dropdown
3. Verify status update

**Expected Results:**
- ✅ Status dropdown available for each task
- ✅ Options: Pending, In Progress, Completed
- ✅ On change:
  - Status updates immediately
  - Progress bar recalculates
  - Success toast appears (if implemented)

**Verify:**
- Status persists after page refresh
- Progress percentage updates correctly
- All status transitions work

---

### Test 4.11: Send Onboarding Reminders
**Steps:**
1. From onboarding page, click "Send Reminders" button
2. Verify reminders are sent

**Expected Results:**
- ✅ Button is visible
- ✅ On click:
  - Shows success toast
  - Reminders sent to all pending tasks
  - Notification sent (if implemented)

**Verify:**
- Reminders are triggered
- No errors occur
- Success message appears

---

## **ROLE 5: HR_EMPLOYEE**

### Test 5.1: Access Recruitment Dashboard (HR Employee)
**Steps:**
1. Log in as an HR Employee user
2. Navigate to `/dashboard/recruitment`

**Expected Results:**
- ✅ Page loads without errors
- ✅ Shows HR Employee-specific view
- ✅ Displays 5 quick access cards:
  - Applications
  - Interviews
  - Onboarding
  - Referrals
- ✅ Does NOT show "Job Requisitions" or "Offers" (HR Manager only)

**Verify:**
- Role-based view works correctly
- Only appropriate features visible
- No HR Manager-only features shown

---

### Test 5.2: Manage Applications (HR Employee)
**Steps:**
1. Navigate to `/dashboard/recruitment/applications`
2. Follow same steps as Test 4.5

**Expected Results:**
- ✅ Same functionality as HR Manager for applications
- ✅ Can view, filter, and update application status

**Verify:**
- All application management features work
- Status updates function correctly

---

### Test 5.3: Schedule Interviews (HR Employee)
**Steps:**
1. Navigate to `/dashboard/recruitment/hr-interviews`
2. Find an application in "in_process" or "submitted" status
3. Click "Schedule Interview"
4. Fill out interview form:
   - Interview stage (required)
   - Scheduled date & time (required)
   - Interview method (required)
   - Video link (if method is video)
5. Submit

**Expected Results:**
- ✅ Modal opens with interview scheduling form
- ✅ Stage dropdown shows: Screening, Department Interview, HR Interview, Offer
- ✅ Method dropdown shows: Onsite, Video, Phone
- ✅ Date/time picker works correctly
- ✅ Video link field appears only for video method
- ✅ Form validation:
  - All required fields validated
  - Date must be in future
- ✅ On submit:
  - Shows success toast
  - Interview scheduled
  - Candidate notified (if implemented)
  - Interview appears in system

**Verify:**
- Interview is created in backend
- Date/time saved correctly
- Method and stage saved correctly
- Video link saved if provided

---

### Test 5.4: Submit Interview Feedback (HR Employee)
**Steps:**
1. From interviews page, find an application with scheduled interview
2. Click "Submit Feedback"
3. Fill out feedback form:
   - Score (0-10, required)
   - Comments (optional)
4. Submit

**Expected Results:**
- ✅ Modal opens with feedback form
- ✅ Score input accepts 0-10
- ✅ Comments textarea available
- ✅ Form validation:
  - Score required and between 0-10
- ✅ On submit:
  - Shows success toast
  - Feedback saved
  - Average score updates (if calculated)

**Verify:**
- Feedback is saved in backend
- Score is recorded correctly
- Comments are saved
- Feedback can be viewed later

---

### Test 5.5: Tag Candidate as Referral (HR Employee)
**Steps:**
1. Navigate to `/dashboard/recruitment/referrals`
2. Find a candidate in the "Tag Candidates" section
3. Click "Tag as Referral"
4. Fill out form:
   - Role (optional)
   - Level (optional)
5. Submit

**Expected Results:**
- ✅ Tagging section visible at top of page
- ✅ List of candidates/applications shown
- ✅ Modal opens with tagging form
- ✅ On submit:
  - Shows success toast
  - Candidate tagged as referral
  - Referral appears in referrals list

**Verify:**
- Referral is created in backend
- Tagged candidate appears in referrals
- Referral information saved correctly

---

### Test 5.6: Manage Onboarding (HR Employee)
**Steps:**
1. Navigate to `/dashboard/recruitment/hr-onboarding`
2. Follow same steps as Test 4.9 and Test 4.10

**Expected Results:**
- ✅ Same functionality as HR Manager for onboarding
- ✅ Can create onboarding, add tasks, update status
- ✅ Can send reminders

**Verify:**
- All onboarding features work
- Task management functions correctly

---

## **ROLE 6: RECRUITER**

### Test 6.1: Access Recruitment Dashboard (Recruiter)
**Steps:**
1. Log in as a Recruiter user
2. Navigate to `/dashboard/recruitment`

**Expected Results:**
- ✅ Page loads without errors
- ✅ Shows Recruiter-specific view
- ✅ Displays 3 quick access cards:
  - Applications
  - Interviews
  - Referrals
- ✅ Similar to HR Employee view

**Verify:**
- Role-based view works correctly
- Appropriate features visible

---

### Test 6.2: Schedule Interviews (Recruiter)
**Steps:**
1. Navigate to `/dashboard/recruitment/hr-interviews`
2. Follow same steps as Test 5.3

**Expected Results:**
- ✅ Same functionality as HR Employee for interviews
- ✅ Can schedule interviews
- ✅ Can submit feedback

**Verify:**
- Interview scheduling works
- Feedback submission works

---

### Test 6.3: Submit Interview Feedback (Recruiter)
**Steps:**
1. Follow same steps as Test 5.4

**Expected Results:**
- ✅ Same functionality as HR Employee
- ✅ Can submit feedback and scores

**Verify:**
- Feedback submission works correctly

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
   - Job Requisition (template, openings)
   - Interview Scheduling (stage, date, method)
   - Offer Creation (salary, deadline)
   - Onboarding Creation (employee ID)
   - Task Creation (name, department)

**Expected Results:**
- ✅ Required fields validated
- ✅ Error messages appear
- ✅ Submit disabled until valid
- ✅ Date pickers work correctly
- ✅ File uploads validate file types
- ✅ Number inputs validate ranges
- ✅ Dropdowns require selection

---

## 🐛 Known Limitations to Test

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

### HR Manager Features
- [ ] Access recruitment dashboard (HR Manager view)
- [ ] Create job requisition
- [ ] Update job requisition status
- [ ] Publish job requisition
- [ ] View all job requisitions
- [ ] Manage applications (view, filter, update status)
- [ ] Create job offer
- [ ] Finalize offer
- [ ] Create employee from contract
- [ ] Create onboarding
- [ ] Add tasks to onboarding
- [ ] Update task status
- [ ] Send onboarding reminders
- [ ] View onboarding statistics

### HR Employee Features
- [ ] Access recruitment dashboard (HR Employee view)
- [ ] Manage applications (view, filter, update status)
- [ ] Schedule interviews
- [ ] Update interview status
- [ ] Submit interview feedback
- [ ] Tag candidates as referrals
- [ ] Create onboarding
- [ ] Manage onboarding tasks
- [ ] Send onboarding reminders

### Recruiter Features
- [ ] Access recruitment dashboard (Recruiter view)
- [ ] Schedule interviews
- [ ] Submit interview feedback
- [ ] View applications

### General
- [ ] Navigation works
- [ ] Error handling
- [ ] Responsive design
- [ ] Loading states
- [ ] Empty states
- [ ] Status badges
- [ ] Toast notifications
- [ ] Form validation
- [ ] Role-based access control
- [ ] API error handling

---

## 📝 Test Report Template

For each test, document:
1. **Test ID:** (e.g., Test 1.1, Test 4.5)
2. **Role:** (Candidate/Employee/Department Head/HR Manager/HR Employee/Recruiter)
3. **Feature:** (e.g., "Apply for Job", "Create Job Requisition")
4. **Steps Taken:**
5. **Expected Result:**
6. **Actual Result:**
7. **Status:** ✅ Pass / ❌ Fail / ⚠️ Partial
8. **Notes:** (Any issues, bugs, or observations)
9. **Screenshots:** (If applicable)
10. **Browser/Device:** (e.g., Chrome/Desktop, Safari/Mobile)

---

## 🚨 Common Issues to Watch For

1. **API Errors:** Check browser console for 401, 403, 404, 500 errors
2. **Role Access:** Verify users can only see features for their role
3. **Data Loading:** Ensure data loads correctly from backend
4. **State Management:** Check that state updates correctly after actions
5. **Navigation:** Verify all links work and routes are correct
6. **Responsive:** Test on multiple screen sizes
7. **Performance:** Check for slow loading or lag
8. **Form Validation:** Ensure all required fields are validated
9. **Date/Time Handling:** Verify date pickers work and dates are formatted correctly
10. **File Uploads:** Check file size limits and type validation
11. **Modal Behavior:** Ensure modals open/close correctly and don't overlap
12. **Status Updates:** Verify status changes reflect immediately and persist
13. **Progress Calculations:** Check that progress bars update correctly
14. **Filter/Search:** Ensure filtering works correctly with multiple criteria

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify backend API is running
3. Check network tab for failed requests
4. Verify user role and permissions
5. Check test data exists in database
6. Verify role assignments in user profile
7. Check API endpoint URLs match backend routes
8. Verify authentication token is valid

---

## 🎯 Testing Priority Order

### Phase 1: Core Candidate Flow (Start Here)
1. Test 1.1 - 1.8 (Candidate features)
   - This is the primary user flow
   - Ensures basic functionality works

### Phase 2: Employee & Department Head
2. Test 2.1 - 2.4 (Employee features)
3. Test 3.1 - 3.3 (Department Head features)
   - Secondary user flows
   - Verify role-based access

### Phase 3: HR Management (Critical)
4. Test 4.1 - 4.11 (HR Manager features)
5. Test 5.1 - 5.6 (HR Employee features)
6. Test 6.1 - 6.3 (Recruiter features)
   - Core management functionality
   - Most complex features

### Phase 4: Integration & Edge Cases
7. Test G.1 - G.8 (General scenarios)
   - Cross-cutting concerns
   - Error handling and edge cases

---

## 📊 Testing Statistics

After completing all tests, track:
- **Total Tests:** 50+ test cases
- **Passed:** ___
- **Failed:** ___
- **Partial:** ___
- **Coverage:** ___%

**Roles Tested:**
- ✅ JOB_CANDIDATE: 8 tests
- ✅ DEPARTMENT_EMPLOYEE: 4 tests
- ✅ DEPARTMENT_HEAD: 3 tests
- ✅ HR_MANAGER: 11 tests
- ✅ HR_EMPLOYEE: 6 tests
- ✅ RECRUITER: 3 tests
- ✅ General: 8 tests

---

**Happy Testing! 🎉**

