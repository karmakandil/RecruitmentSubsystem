# Complete Flow Testing Guide
## Recruitment → Offer → Employee → Onboarding

---

## Prerequisites

### 1. User Accounts Needed
You need at least these user accounts with different roles:

- **HR Manager** account (`SystemRole.HR_MANAGER`)
- **HR Employee** account (`SystemRole.HR_EMPLOYEE`) - Optional, for equipment management
- **System Admin** account (`SystemRole.SYSTEM_ADMIN`) - For access provisioning
- **Job Candidate** account (`SystemRole.JOB_CANDIDATE`)

### 2. Required Data Setup
- At least one **Job Template** created
- At least one **Job Requisition** created from template
- At least one **Application** submitted by candidate (status should be `in_process` or `offer`)

---

## Complete Testing Flow

### **STEP 1: HR Manager Creates Offer**

**User**: HR Manager  
**Page**: `/dashboard/recruitment/hr-offers`

1. Login as HR Manager
2. Navigate to **Recruitment → HR Offers**
3. Click on **"Create New Offer"** tab
4. You should see applications ready for offers
5. Click **"Create Offer"** button on an application
6. Fill in the offer form:
   - **Gross Salary**: Enter a number (e.g., 50000)
   - **Signing Bonus**: Optional (e.g., 5000)
   - **Benefits**: Add benefits (e.g., "Health Insurance", "401k")
   - **Deadline**: Select a future date
   - **Role**: Enter role title
   - **Content**: Enter offer details
7. Click **"Create Offer"**
8. ✅ **Verify**: 
   - Success toast appears
   - Offer appears in "Active Offers" tab
   - Application status should be `offer`

---

### **STEP 2: Candidate Views and Accepts Offer**

**User**: Job Candidate  
**Page**: `/dashboard/recruitment/offers`

1. **Logout** and login as Job Candidate
2. Navigate to **Recruitment → My Offers** (or `/dashboard/recruitment/offers`)
3. You should see the offer created in Step 1
4. Review offer details (salary, benefits, deadline, etc.)
5. Click **"Respond to Offer"** button
6. Select **"Accept"** in the modal
7. Click **"Submit Response"**
8. ✅ **Verify**:
   - Success message: "Offer accepted successfully!"
   - Offer status shows "ACCEPTED"
   - "Upload Contract" and "Upload Forms" buttons appear

---

### **STEP 3: Candidate Uploads Contract**

**User**: Job Candidate  
**Page**: `/dashboard/recruitment/offers`

1. Still on the candidate offers page
2. Click **"Upload Contract"** button
3. In the upload modal:
   - Select a PDF/document file (or use manual entry for testing)
   - Select document type: **"CONTRACT"**
   - Fill in optional fields if needed
4. Click **"Upload Document"**
5. ✅ **Verify**:
   - Success message appears
   - Contract document is uploaded
   - You can upload additional forms if needed

---

### **STEP 4: HR Manager Triggers Pre-boarding (REC-029)**

**User**: HR Manager  
**Page**: `/dashboard/recruitment/hr-offers`

1. **Logout** and login as HR Manager
2. Navigate to **Recruitment → HR Offers**
3. Go to **"Active Offers"** tab
4. Find the offer where candidate accepted (status: ACCEPTED)
5. ✅ **Verify**: You should see **"Trigger Pre-boarding (REC-029)"** button
6. Click the **"Trigger Pre-boarding"** button
7. ✅ **Verify**: 
   - You're redirected to `/dashboard/recruitment/preboarding`
   - Pre-boarding modal opens automatically with the application pre-selected
8. In the pre-boarding modal:
   - Select tasks you want to trigger (e.g., "Sign Employment Contract", "Complete Tax Forms")
   - Or click "Select All"
9. Click **"Trigger Pre-boarding Tasks"**
10. ✅ **Verify**:
    - Success message appears
    - Tasks are queued/created

---

### **STEP 5: HR Manager Approves Offer**

**User**: HR Manager  
**Page**: `/dashboard/recruitment/hr-offers`

1. Still on HR Offers page (or navigate back)
2. Go to **"Active Offers"** tab
3. Find the offer (status: ACCEPTED, Final Status: PENDING)
4. Click **"Approve/Reject"** button
5. In the "Approve/Reject Offer" modal:
   - Review candidate information and offer details
   - **Final Decision**: Select **"✓ Approve Offer"** from dropdown
   - Note: You can only approve if candidate has ACCEPTED the offer
6. Click **"Approve Offer"** button (green button)
7. ✅ **Verify**:
   - Success message: "Offer approved successfully. You can now create an employee profile."
   - Modal closes
   - **IMPORTANT**: Offer remains visible in "Active Offers" tab (it does NOT disappear)
   - Final Status badge shows "APPROVED"
   - **"Create Employee"** button now appears (green button) next to the "Approve/Reject" button
   - The "Trigger Pre-boarding" button disappears (replaced by "Create Employee")

---

### **STEP 6: HR Manager Creates Employee from Contract (ONB-002)**

**User**: HR Manager  
**Page**: `/dashboard/recruitment/hr-offers`

1. Still on HR Offers page (do NOT refresh the page - offer should still be visible)
2. Go to **"Active Offers"** tab
3. ✅ **IMPORTANT**: The approved offer should still be visible here (even if application status changed to "hired")
4. Find the offer where:
   - Candidate Response: **ACCEPTED** (green badge)
   - Final Status: **APPROVED** (green badge)
5. Click the **"Create Employee"** button (green button)
6. In the "Create Employee from Contract" modal:
   - **Start Date**: Select a future date (e.g., 2 weeks from now)
   - **Work Email**: Optional (will be auto-generated if not provided)
   - **Employee Number**: Optional (will be auto-generated if not provided)
7. Click **"Create Employee"**
8. ✅ **Verify**:
   - Success message: "Employee created successfully! Onboarding tasks have been automatically created."
   - Modal closes
   - Offer may disappear from active offers after employee is created (this is expected)
   - Navigate to Onboarding page to verify onboarding tasks were created

---

### **STEP 7: Verify Automatic Onboarding Creation (ONB-001)**

**User**: HR Manager  
**Page**: `/dashboard/recruitment/hr-onboarding`

1. Navigate to **Recruitment → HR Onboarding**
2. ✅ **Verify**:
   - New onboarding record appears in the list
   - Employee name matches the candidate
   - Onboarding has tasks automatically generated
   - Status shows as "in_progress" or similar

---

### **STEP 8: Verify Automatic Payroll & Signing Bonus (ONB-018, ONB-019)**

**User**: HR Manager  
**Page**: `/dashboard/recruitment/hr-onboarding`

**Testing Steps:**

#### **A. Verify Payroll Initiation (ONB-018)**
1. After creating an employee (Step 6), go to **Recruitment → HR Onboarding** (or click "Manage Onboarding" button)
2. Click **🔄 Refresh** button to see the newly created employee
3. Find the employee in the onboarding list
4. Look for an **HR task** with name containing "Payroll" or "payroll"
5. ✅ **Verify**:
   - The payroll task status should be **"Completed"** (automatically marked when employee was created)
   - Click on the task to see notes/details
   - Notes should mention: "Payroll readiness confirmed" with contract signing date and gross salary
   - The employee is now ready and will be automatically included in payroll runs when payroll initiation is processed for that period

**Backend Verification (Optional):**
- Check backend console logs for: `"Payroll readiness confirmed for employee [ID]"`
- The employee will appear in payroll runs when `processPayrollInitiation()` is called for the payroll period

#### **B. Verify Signing Bonus Processing (ONB-019)**
1. Ensure the offer/contract had a **Signing Bonus** amount > 0
2. In the onboarding list, find the same employee
3. Look for an **HR task** with name containing "Signing Bonus"
4. ✅ **Verify**:
   - The signing bonus task status should be **"Completed"** (if signing bonus configuration exists for the position)
   - Task notes should mention the signing bonus amount and processing details
   - If a matching signing bonus configuration exists for the position, an employee signing bonus record was created in the payroll system

**Backend Verification (Optional):**
- Check backend console logs for: `"Signing bonus processed"` or `"Signing bonus task completed"`
- Query the database: Check `EmployeeSigningBonus` collection for a record with the employee's ID
- API endpoint: `GET /api/v1/payroll-execution/employee-signing-bonuses` (if accessible) to see signing bonus records

**Note**: If signing bonus task is NOT automatically completed, it may be because:
- No signing bonus configuration exists for the employee's position in Payroll Configuration
- The configuration exists but is not in "APPROVED" status

---

### **STEP 9: Verify Automatic Access Provisioning Scheduled (ONB-013)**

**User**: System Admin  
**Page**: `/dashboard/recruitment/access-management`

1. Login as System Admin
2. Navigate to **Recruitment → Access Management**
3. Search for the new employee
4. ✅ **Verify**:
   - Employee appears in the list
   - Access provisioning tasks are created
   - Tasks are scheduled for the start date (or today's date if the contract start date was in the past)

**Backend Verification (Optional):**
- Check backend console logs for: `"Access provisioning scheduled"` or `"Clock access scheduled"`
- If the contract start date was in the past, the system automatically uses today's date for access provisioning
- No error messages should appear: `"Failed to schedule access provisioning: Start date cannot be in the past"`

---

### **STEP 10: New Hire Views Onboarding Tracker (ONB-004)**

**User**: New Employee (same as Job Candidate, but now has employee profile)  
**Page**: `/dashboard/recruitment/my-onboarding`

1. **Logout** and login as the candidate (who is now an employee)
2. Navigate to **Recruitment → My Onboarding** (or `/dashboard/recruitment/my-onboarding`)
3. ✅ **Verify**:
   - Onboarding tracker page loads
   - Shows all onboarding tasks
   - Progress percentage is displayed
   - Tasks are categorized by department
   - Each task shows status (Pending, In Progress, Completed)

---

### **STEP 11: New Hire Uploads Documents (ONB-007)**

**User**: New Employee  
**Page**: `/dashboard/recruitment/my-onboarding`

1. Still on the onboarding tracker page
2. Find a task that requires document upload (e.g., "Submit ID Documents")
3. Click on the task or "Upload Document" button
4. In the upload modal:
   - Select a file (PDF, image, etc.)
   - Select document type: **"ID"**, **"CERTIFICATE"**, or **"CONTRACT"**
   - Fill in optional fields
5. Click **"Upload Document"**
6. ✅ **Verify**:
   - Success message appears
   - Task status updates to "Completed" (if auto-complete is enabled)
   - Progress percentage increases
   - Document icon appears on the task

---

### **STEP 12: HR Employee Reserves Equipment (ONB-012)**

**User**: HR Employee  
**Page**: `/dashboard/recruitment/equipment-management`

1. **Logout** and login as HR Employee
2. Navigate to **Recruitment → Equipment Management**
3. Find the new employee's onboarding in the list
4. Click **"+ Reserve Equipment"** button
5. In the modal:
   - Select equipment type: **"Workspace/Desk"**, **"Desk Assignment"**, **"Access Card"**, or **"ID Badge"**
   - Fill in optional details (model, serial number, location, notes)
6. Click **"Reserve Equipment"**
7. ✅ **Verify**:
   - Success message appears
   - Equipment task is added to onboarding
   - Equipment progress percentage updates
   - Equipment appears in the equipment list

---

### **STEP 13: System Admin Provisions Access (ONB-009)**

**User**: System Admin  
**Page**: `/dashboard/recruitment/access-management`

1. **Logout** and login as System Admin
2. Navigate to **Recruitment → Access Management**
3. Search for and select the new employee
4. In the "Provision Access" section:
   - You should see access tasks (Email, SSO, Payroll, Internal Systems)
5. Click **"Provision Access"** button on a task
6. ✅ **Verify**:
   - Success message: "System access provisioned successfully"
   - Task status updates
   - Access is granted

---

### **STEP 14: Verify Onboarding Completion**

**User**: New Employee  
**Page**: `/dashboard/recruitment/my-onboarding`

1. **Logout** and login as the new employee
2. Navigate to **Recruitment → My Onboarding**
3. Complete all remaining tasks (upload documents, mark tasks complete, etc.)
4. ✅ **Verify**:
   - When all tasks are completed:
     - Progress shows 100%
     - **Completion banner appears** with congratulations message
     - "Go to Dashboard" button is available
   - All tasks show "Completed" status

---

## Quick Test Checklist

Use this checklist to verify each step:

- [ ] HR creates offer successfully
- [ ] Candidate can view offer
- [ ] Candidate accepts offer
- [ ] Candidate uploads contract
- [ ] "Trigger Pre-boarding" button appears for HR
- [ ] Pre-boarding tasks can be triggered
- [ ] HR approves offer
- [ ] "Create Employee" button appears
- [ ] Employee profile is created
- [ ] Onboarding is automatically created
- [ ] Payroll initiation is triggered (check logs/module)
- [ ] Signing bonus is processed (check logs/module)
- [ ] Access provisioning is scheduled
- [ ] New hire can view onboarding tracker
- [ ] New hire can upload documents
- [ ] HR can reserve equipment
- [ ] System Admin can provision access
- [ ] Onboarding completion banner appears when all tasks done

---

## Common Issues & Troubleshooting

### Issue 1: "Trigger Pre-boarding" button doesn't appear
**Solution**: 
- Verify offer status is `ACCEPTED` but not yet `APPROVED`
- Check that you're logged in as HR Manager
- Refresh the page

### Issue 2: "Create Employee" button doesn't appear
**Solution**:
- Verify offer is both `ACCEPTED` by candidate AND `APPROVED` by HR
- Check that contract document is uploaded
- Check browser console for errors

### Issue 3: Employee creation fails with "Contract not found"
**Solution**:
- Ensure candidate uploaded contract document in Step 3
- Check backend logs for contract validation errors
- Verify contract document exists in database

### Issue 4: Onboarding not appearing for new employee
**Solution**:
- Check that employee profile was created successfully
- Verify employee ID matches between employee profile and onboarding
- Check backend logs for onboarding creation errors
- Try accessing onboarding via HR Onboarding page first

### Issue 5: Candidate can't see offers
**Solution**:
- Verify candidate has `JOB_CANDIDATE` role
- Check that application status is `offer`
- Try refreshing the page
- Check browser console for API errors

### Issue 6: Access provisioning tasks not appearing
**Solution**:
- Verify access provisioning was scheduled (check backend logs)
- Check that start date is in the future
- Tasks may be scheduled for the start date, not immediately

---

## Testing with Different Scenarios

### Scenario 1: Full Flow with All Features
- Follow all 14 steps above
- Complete every task
- Verify all automatic triggers work

### Scenario 2: Quick Test (Minimal Steps)
1. HR creates offer
2. Candidate accepts
3. Candidate uploads contract
4. HR approves
5. HR creates employee
6. Verify onboarding appears
7. Verify automatic triggers (check logs)

### Scenario 3: Test Error Handling
- Try creating employee without contract uploaded → Should fail with error
- Try accepting offer that's already accepted → Should fail
- Try creating duplicate offer → Should fail

---

## Backend Logs to Monitor

When testing, watch for these log messages:

```
✅ "Offer created successfully"
✅ "Offer accepted by candidate"
✅ "Contract document uploaded successfully"
✅ "Employee profile created successfully from contract"
✅ "Onboarding created automatically"
✅ "Payroll initiation triggered" (if salary > 0)
✅ "Signing bonus processed" (if bonus > 0)
✅ "Access provisioning scheduled"
```

---

## Success Criteria

The flow is working correctly if:

1. ✅ All steps can be completed without errors
2. ✅ All buttons appear at the correct times
3. ✅ All automatic triggers execute (onboarding, payroll, bonus, access)
4. ✅ New hire can view and interact with onboarding tracker
5. ✅ All user stories are covered (REC-029, ONB-001 through ONB-019)
6. ✅ No schema or enum changes were made
7. ✅ Data flows correctly from offer → contract → employee → onboarding

---

## Notes

- **No Schema Changes**: All implementation uses existing schemas and enums
- **Role-Based Access**: Make sure you're using the correct role for each step
- **Data Persistence**: Employee data persists, so you may need to clean up test data between runs
- **Date Validation**: Start dates must be in the future for access provisioning scheduling

---

**Happy Testing! 🚀**

