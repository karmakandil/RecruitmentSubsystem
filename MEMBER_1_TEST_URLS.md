# Member 1 Testing URLs & Roles Guide

## 🚀 Quick Testing Reference

### Base URL
```
http://localhost:3000
```

---

## 📋 Test URLs for Member 1 Tasks

### 1. Payroll Policies Management

**URL:** `/dashboard/payroll-configuration/policies`

**Required Role:** `PAYROLL_SPECIALIST`

**Test URLs:**
- List Page: `http://localhost:3000/dashboard/payroll-configuration/policies`
- Create New: `http://localhost:3000/dashboard/payroll-configuration/policies/new`
- View Details: `http://localhost:3000/dashboard/payroll-configuration/policies/[ID]`
- Edit: `http://localhost:3000/dashboard/payroll-configuration/policies/[ID]/edit`

**What to Test:**
- ✅ List all policies with status filter
- ✅ Create new policy (creates as Draft)
- ✅ Edit draft policies only
- ✅ Delete draft policies only
- ✅ View policy details

---

### 2. Pay Grades Management

**URL:** `/dashboard/payroll-configuration/pay-grades`

**Required Role:** `PAYROLL_SPECIALIST`

**Test URLs:**
- List Page: `http://localhost:3000/dashboard/payroll-configuration/pay-grades`
- Create New: `http://localhost:3000/dashboard/payroll-configuration/pay-grades/new`
- View Details: `http://localhost:3000/dashboard/payroll-configuration/pay-grades/[id]`
- Edit: `http://localhost:3000/dashboard/payroll-configuration/pay-grades/[id]/edit`

**What to Test:**
- ✅ List all pay grades with pagination
- ✅ Create new pay grade (creates as Draft)
- ✅ Edit draft pay grades only
- ✅ Delete draft pay grades only
- ✅ View pay grade details
- ⚠️ Integration with Organizational Structure (Job Grade/Band)

---

### 3. Pay Types Management

**URL:** `/dashboard/payroll-configuration/pay-types`

**Required Role:** `PAYROLL_SPECIALIST`

**Test URLs:**
- List Page: `http://localhost:3000/dashboard/payroll-configuration/pay-types`
- Create New: `http://localhost:3000/dashboard/payroll-configuration/pay-types/new`
- View Details: `http://localhost:3000/dashboard/payroll-configuration/pay-types/[id]`
- Edit: `http://localhost:3000/dashboard/payroll-configuration/pay-types/[id]/edit`

**What to Test:**
- ✅ List all pay types
- ✅ Create new pay type (creates as Draft)
- ✅ Edit draft pay types only
- ✅ Delete draft pay types only
- ✅ View pay type details

---

### 4. Allowances Management

**URL:** `/dashboard/payroll-configuration/allowances`

**Required Role:** `PAYROLL_SPECIALIST`

**Test URLs:**
- List Page: `http://localhost:3000/dashboard/payroll-configuration/allowances`
- Create New: `http://localhost:3000/dashboard/payroll-configuration/allowances/new`
- View Details: `http://localhost:3000/dashboard/payroll-configuration/allowances/[id]`
- Edit: `http://localhost:3000/dashboard/payroll-configuration/allowances/[id]/edit`

**What to Test:**
- ✅ List all allowances
- ✅ Create new allowance (creates as Draft)
- ✅ Edit draft allowances only
- ✅ Delete draft allowances only
- ✅ View allowance details

---

## 🎯 Main Dashboard

**URL:** `/dashboard/payroll-configuration`

**Accessible Roles:**
- `PAYROLL_SPECIALIST` ✅
- `PAYROLL_MANAGER` ✅
- `SYSTEM_ADMIN` ✅
- `HR_MANAGER` ✅
- `LEGAL_POLICY_ADMIN` ✅

**Test URL:** `http://localhost:3000/dashboard/payroll-configuration`

**What to Test:**
- ✅ Navigation cards for all 4 pages
- ✅ Role-based visibility of cards
- ✅ Links navigate correctly

---

## 🔐 System Roles Reference

### Roles Available in System:
```
PAYROLL_SPECIALIST      - Can create/edit/delete draft configurations
PAYROLL_MANAGER         - Can approve/reject configurations
HR_MANAGER              - Can approve/reject insurance brackets
LEGAL_POLICY_ADMIN      - Can create/edit tax rules
SYSTEM_ADMIN            - Full access, company settings
HR_ADMIN                - Employee profile management
```

### For Member 1 Testing, Use:
**Primary Role:** `PAYROLL_SPECIALIST`

This role should have:
- ✅ Access to all 4 pages (Policies, Pay Grades, Pay Types, Allowances)
- ✅ Can create new configurations
- ✅ Can edit draft configurations
- ✅ Can delete draft configurations
- ❌ Cannot approve/reject (that's Payroll Manager's job)

---

## 🧪 Quick Test Scenarios

### Scenario 1: Full CRUD Flow (Policies)
1. Login as `PAYROLL_SPECIALIST`
2. Go to: `http://localhost:3000/dashboard/payroll-configuration/policies`
3. Click "Create New Policy"
4. Fill form and submit
5. Verify it appears in list with "Draft" status
6. Click "Edit" on the new policy
7. Make changes and save
8. Verify changes reflected
9. Click "Delete" on the policy
10. Verify it's removed from list

### Scenario 2: Status Filtering (Pay Grades)
1. Login as `PAYROLL_SPECIALIST`
2. Go to: `http://localhost:3000/dashboard/payroll-configuration/pay-grades`
3. Select "Draft" from filter dropdown
4. Verify only draft items shown
5. Select "Approved" from filter
6. Verify only approved items shown
7. Select "All Statuses"
8. Verify all items shown

### Scenario 3: Edit Restrictions (Pay Types)
1. Login as `PAYROLL_SPECIALIST`
2. Go to: `http://localhost:3000/dashboard/payroll-configuration/pay-types`
3. Find an item with "Approved" status
4. Try to click "Edit"
5. Verify alert/error: "Only draft pay types can be edited"
6. Find a "Draft" item
7. Click "Edit"
8. Verify edit page loads

### Scenario 4: Role Access Test
1. Login as `PAYROLL_MANAGER` (or any non-PAYROLL_SPECIALIST role)
2. Try to access: `http://localhost:3000/dashboard/payroll-configuration/policies`
3. Verify access denied or read-only view
4. Try to create new policy
5. Verify button is hidden or access denied

---

## 📝 Testing Checklist Per Page

### Policies Page
- [ ] URL: `/dashboard/payroll-configuration/policies`
- [ ] Role: `PAYROLL_SPECIALIST`
- [ ] List displays
- [ ] Status filter works
- [ ] Create button works
- [ ] Edit works for drafts
- [ ] Delete works for drafts
- [ ] View details works

### Pay Grades Page
- [ ] URL: `/dashboard/payroll-configuration/pay-grades`
- [ ] Role: `PAYROLL_SPECIALIST`
- [ ] List displays
- [ ] Status filter works
- [ ] Create button works
- [ ] Edit works for drafts
- [ ] Delete works for drafts
- [ ] View details works

### Pay Types Page
- [ ] URL: `/dashboard/payroll-configuration/pay-types`
- [ ] Role: `PAYROLL_SPECIALIST`
- [ ] List displays
- [ ] Status filter works
- [ ] Create button works
- [ ] Edit works for drafts
- [ ] Delete works for drafts
- [ ] View details works

### Allowances Page
- [ ] URL: `/dashboard/payroll-configuration/allowances`
- [ ] Role: `PAYROLL_SPECIALIST`
- [ ] List displays
- [ ] Status filter works
- [ ] Create button works
- [ ] Edit works for drafts
- [ ] Delete works for drafts
- [ ] View details works

---

## 🐛 Common Issues to Check

### Access Issues
- [ ] Wrong role → Access denied message?
- [ ] No role → Redirected to login?
- [ ] Expired token → Redirected to login?

### Navigation Issues
- [ ] Links work correctly?
- [ ] Back button works?
- [ ] Breadcrumbs (if any) work?

### Data Issues
- [ ] Empty list shows message?
- [ ] Loading state displays?
- [ ] Error messages are clear?

---

## 🔗 Related Pages (For Context)

### Approval Dashboard (Member 3)
- URL: `/dashboard/payroll-configuration/approvals`
- Role: `PAYROLL_MANAGER`
- Note: This is where Payroll Manager approves your drafts

### Stats Dashboard (Member 3)
- URL: `/dashboard/payroll-configuration/stats`
- Role: `PAYROLL_MANAGER`, `SYSTEM_ADMIN`
- Note: Shows statistics of all configurations

---

## 📱 Mobile Testing URLs

Same URLs, but test on:
- Mobile viewport (375px width)
- Tablet viewport (768px width)
- Desktop viewport (1920px width)

Use browser DevTools to resize:
- Chrome: F12 → Toggle Device Toolbar (Ctrl+Shift+M)
- Firefox: F12 → Responsive Design Mode (Ctrl+Shift+M)

---

## ✅ Quick Test Command

Copy-paste these URLs in your browser (replace `localhost:3000` if different):

```
# Main Dashboard
http://localhost:3000/dashboard/payroll-configuration

# Policies
http://localhost:3000/dashboard/payroll-configuration/policies
http://localhost:3000/dashboard/payroll-configuration/policies/new

# Pay Grades
http://localhost:3000/dashboard/payroll-configuration/pay-grades
http://localhost:3000/dashboard/payroll-configuration/pay-grades/new

# Pay Types
http://localhost:3000/dashboard/payroll-configuration/pay-types
http://localhost:3000/dashboard/payroll-configuration/pay-types/new

# Allowances
http://localhost:3000/dashboard/payroll-configuration/allowances
http://localhost:3000/dashboard/payroll-configuration/allowances/new
```

---

**Last Updated:** [Current Date]  
**For:** Member 1 Testing

