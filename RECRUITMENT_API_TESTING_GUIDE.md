# Recruitment Module - API Testing Guide for Thunder Client

## Base Configuration

**Base URL:** `http://localhost:5000/api/v1`

**Authentication Required:** Yes (JWT Token)
- All endpoints require authentication
- Token must be included in Authorization header: `Bearer <your_jwt_token>`

---

## Test Credentials

### Available Test Users

| Role | Employee Number | Password |
|------|----------------|----------|
| System Admin | `EMP-2025-0004` | `password123` |
| HR Manager | `EMP-2025-0005` | `password123` |
| HR Employee | `EMP-2025-0015` | `password123` |
| Department Employee | (Your regular employee number) | `password123` |

---

## Getting Started with Thunder Client

### Step 1: Setup Environment
1. Open Thunder Client in VS Code
2. Create a new collection named "Recruitment APIs"
3. Set environment variables (optional but recommended):
   - `baseUrl`: `http://localhost:5000/api/v1`
   - `authToken`: (will be set after login)

### Step 2: Login to Get Token

**IMPORTANT:** Start your backend first with `npm run start:dev`

#### Login as HR Manager (Most Common)
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

Body:
{
  "employeeNumber": "EMP-2025-0005",
  "password": "password123"
}
```

#### Login as System Admin
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

Body:
{
  "employeeNumber": "EMP-2025-0004",
  "password": "password123"
}
```

#### Login as HR Employee
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

Body:
{
  "employeeNumber": "EMP-2025-0015",
  "password": "password123"
}
```

#### Login as Department Employee (Regular Employee)
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

Body:
{
  "employeeNumber": "YOUR-EMPLOYEE-NUMBER",
  "password": "password123"
}
```

**Response Example:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "674c3a1b8f9e2a001c5d7e10",
    "employeeNumber": "EMP-2025-0005",
    "firstName": "John",
    "lastName": "Doe",
    "role": "HR_MANAGER"
  }
}
```

**Copy the `access_token` value** and use it in all subsequent requests!

### Step 3: Test Endpoints
Add this header to **every request**:
```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

---

## API Endpoints by Category

## 1. JOB TEMPLATES

### 1.1 Create Job Template
**Endpoint:** `POST /recruitment/job-template`
**Role Required:** HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/job-template`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "title": "Senior Software Engineer",
  "department": "Engineering",
  "description": "We are looking for an experienced software engineer to join our growing team",
  "responsibilities": [
    "Design and develop scalable applications",
    "Lead technical discussions and code reviews",
    "Mentor junior developers"
  ],
  "qualifications": [
    {
      "degree": "Bachelor",
      "field": "Computer Science",
      "required": true
    }
  ],
  "requiredSkills": ["JavaScript", "Node.js", "MongoDB"],
  "preferredSkills": ["TypeScript", "NestJS", "AWS"],
  "experienceYears": 5,
  "employmentType": "full_time"
}
```

**Expected Response:** `201 Created`
```json
{
  "_id": "674c3a1b8f9e2a001c5d7e12",
  "title": "Senior Software Engineer",
  "department": "Engineering",
  ...
}
```

**Save the `_id` from response - you'll need it for creating job requisitions!**

---

### 1.2 Get All Job Templates
**Endpoint:** `GET /recruitment/job-template`
**Role Required:** All authenticated users
**Login As:** Any user

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/job-template`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

**Expected Response:** `200 OK`
```json
[
  {
    "_id": "674c3a1b8f9e2a001c5d7e12",
    "title": "Senior Software Engineer",
    "department": "Engineering",
    ...
  }
]
```

---

### 1.3 Get Job Template by ID
**Endpoint:** `GET /recruitment/job-template/:id`
**Role Required:** All authenticated users

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/job-template/674c3a1b8f9e2a001c5d7e12`
  - Replace `674c3a1b8f9e2a001c5d7e12` with actual template ID
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

**Expected Response:** `200 OK` with template details

---

### 1.4 Update Job Template
**Endpoint:** `PUT /recruitment/job-template/:id`
**Role Required:** HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `PUT`
- URL: `http://localhost:5000/api/v1/recruitment/job-template/674c3a1b8f9e2a001c5d7e12`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "title": "Senior Software Engineer (Updated)",
  "experienceYears": 6,
  "requiredSkills": ["JavaScript", "Node.js", "MongoDB", "Docker"]
}
```

---

## 2. JOB REQUISITIONS

### 2.1 Create Job Requisition
**Endpoint:** `POST /recruitment/job`
**Role Required:** HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/job`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "templateId": "674c3a1b8f9e2a001c5d7e12",
  "openings": 3,
  "location": "Cairo, Egypt",
  "hiringManagerId": "674c3a1b8f9e2a001c5d7e10"
}
```

**Note:** Replace `templateId` with actual template ID from step 1.1

**Expected Response:** `201 Created`
```json
{
  "_id": "674c3a1b8f9e2a001c5d7e15",
  "templateId": "674c3a1b8f9e2a001c5d7e12",
  "openings": 3,
  "location": "Cairo, Egypt",
  "status": "draft",
  ...
}
```

**Save the `_id` - you'll need it for applications!**

---

### 2.2 Get All Job Requisitions
**Endpoint:** `GET /recruitment/job`
**Role Required:** All authenticated users

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/job`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 2.3 Get Job Requisition by ID
**Endpoint:** `GET /recruitment/job/:id`
**Role Required:** All authenticated users

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/job/674c3a1b8f9e2a001c5d7e15`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 2.4 Update Job Status
**Endpoint:** `PATCH /recruitment/job/:id/status`
**Role Required:** HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `PATCH`
- URL: `http://localhost:5000/api/v1/recruitment/job/674c3a1b8f9e2a001c5d7e15/status`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "status": "active"
}
```

**Valid Status Values:** `draft`, `active`, `closed`, `on_hold`

---

### 2.5 Publish Job
**Endpoint:** `POST /recruitment/job/:id/publish`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Employee (`EMP-2025-0015`) or HR Manager

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/job/674c3a1b8f9e2a001c5d7e15/publish`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 2.6 Preview Job Requisition
**Endpoint:** `GET /recruitment/job/:id/preview`
**Role Required:** All authenticated users

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/job/674c3a1b8f9e2a001c5d7e15/preview`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

## 3. APPLICATIONS

### 3.1 Submit Application
**Endpoint:** `POST /recruitment/application`
**Role Required:** JOB_CANDIDATE
**Login As:** Job Candidate (Create candidate first or use existing candidate credentials)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/application`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "candidateId": "674c3a1b8f9e2a001c5d7e20",
  "requisitionId": "674c3a1b8f9e2a001c5d7e15",
  "consentGiven": true,
  "assignedHr": "674c3a1b8f9e2a001c5d7e10"
}
```

**IMPORTANT:** `consentGiven` MUST be `true` or request will be rejected!

**Note:** Replace IDs with actual values:
- `candidateId`: ID of the candidate profile
- `requisitionId`: ID from job requisition (step 2.1)
- `assignedHr`: Optional - HR employee ID

**Expected Response:** `201 Created`
```json
{
  "_id": "674c3a1b8f9e2a001c5d7e25",
  "candidateId": "674c3a1b8f9e2a001c5d7e20",
  "requisitionId": "674c3a1b8f9e2a001c5d7e15",
  "status": "submitted",
  ...
}
```

**Save the `_id` - you'll need it for interviews!**

---

### 3.2 Get All Applications
**Endpoint:** `GET /recruitment/application`
**Role Required:** HR staff or candidates see their own
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/application`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

**With Query Parameters:**
- URL: `http://localhost:5000/api/v1/recruitment/application?requisitionId=674c3a1b8f9e2a001c5d7e15&prioritizeReferrals=true`

---

### 3.3 Get Ranked Applications
**Endpoint:** `GET /recruitment/application/ranked/:requisitionId`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/application/ranked/674c3a1b8f9e2a001c5d7e15`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 3.4 Update Application Status
**Endpoint:** `PATCH /recruitment/application/:id/status`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `PATCH`
- URL: `http://localhost:5000/api/v1/recruitment/application/674c3a1b8f9e2a001c5d7e25/status`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "status": "in_process"
}
```

**Valid Status Values:**
- `submitted` - Application just submitted
- `in_process` - Under review
- `offer` - Offer made
- `hired` - Candidate hired
- `rejected` - Application rejected

---

## 4. INTERVIEWS

### 4.1 Schedule Interview
**Endpoint:** `POST /recruitment/interview`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, RECRUITER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/interview`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "applicationId": "674c3a1b8f9e2a001c5d7e25",
  "stage": "screening",
  "scheduledDate": "2025-12-15T10:00:00.000Z",
  "method": "video",
  "panel": [
    "674c3a1b8f9e2a001c5d7e10",
    "674c3a1b8f9e2a001c5d7e11"
  ],
  "videoLink": "https://zoom.us/j/123456789"
}
```

**Valid Stage Values:**
- `screening` - Initial screening
- `department_interview` - Department interview
- `hr_interview` - HR interview
- `offer` - Offer stage

**Valid Method Values:**
- `onsite` - In-person interview
- `video` - Video call
- `phone` - Phone call

**Expected Response:** `201 Created`
```json
{
  "_id": "674c3a1b8f9e2a001c5d7e30",
  "applicationId": "674c3a1b8f9e2a001c5d7e25",
  "stage": "screening",
  "scheduledDate": "2025-12-15T10:00:00.000Z",
  "status": "scheduled",
  ...
}
```

**Save the `_id` - you'll need it for feedback!**

---

### 4.2 Update Interview Status
**Endpoint:** `PATCH /recruitment/interview/:id/status`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, RECRUITER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `PATCH`
- URL: `http://localhost:5000/api/v1/recruitment/interview/674c3a1b8f9e2a001c5d7e30/status`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "status": "completed"
}
```

**Valid Status Values:**
- `scheduled` - Interview scheduled
- `completed` - Interview completed
- `cancelled` - Interview cancelled

---

### 4.3 Submit Interview Feedback
**Endpoint:** `POST /recruitment/interview/:id/feedback`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, RECRUITER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/interview/674c3a1b8f9e2a001c5d7e30/feedback`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "score": 85,
  "comments": "Candidate demonstrated strong technical skills and good communication. Recommended for next round."
}
```

**Note:** Score should be between 0-100

---

### 4.4 Get Interview Feedback
**Endpoint:** `GET /recruitment/interview/:id/feedback`
**Role Required:** All authenticated users

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/interview/674c3a1b8f9e2a001c5d7e30/feedback`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 4.5 Get Interview Average Score
**Endpoint:** `GET /recruitment/interview/:id/score`
**Role Required:** All authenticated users

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/interview/674c3a1b8f9e2a001c5d7e30/score`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

## 5. OFFERS

### 5.1 Create Offer
**Endpoint:** `POST /recruitment/offer`
**Role Required:** HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/offer`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "applicationId": "674c3a1b8f9e2a001c5d7e25",
  "candidateId": "674c3a1b8f9e2a001c5d7e20",
  "grossSalary": 80000,
  "signingBonus": 5000,
  "benefits": [
    "Health Insurance",
    "Annual Leave (21 days)",
    "Training Budget"
  ],
  "conditions": "Probation period: 3 months",
  "insurances": "Medical insurance for employee and family",
  "content": "We are pleased to offer you the position of Senior Software Engineer...",
  "role": "Senior Software Engineer",
  "deadline": "2025-12-20T23:59:59.000Z"
}
```

**Expected Response:** `201 Created`
```json
{
  "_id": "674c3a1b8f9e2a001c5d7e35",
  "applicationId": "674c3a1b8f9e2a001c5d7e25",
  "candidateId": "674c3a1b8f9e2a001c5d7e20",
  "grossSalary": 80000,
  ...
}
```

**Save the `_id` - you'll need it!**

---

### 5.2 Respond to Offer (Candidate)
**Endpoint:** `PATCH /recruitment/offer/:id/respond`
**Role Required:** JOB_CANDIDATE
**Login As:** Job Candidate

**Thunder Client Setup:**
- Method: `PATCH`
- URL: `http://localhost:5000/api/v1/recruitment/offer/674c3a1b8f9e2a001c5d7e35/respond`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "applicantResponse": "accepted"
}
```

**Valid Response Values:**
- `accepted` - Candidate accepts offer
- `rejected` - Candidate rejects offer
- `pending` - Candidate still thinking

---

### 5.3 Finalize Offer (HR Manager)
**Endpoint:** `PATCH /recruitment/offer/:id/finalize`
**Role Required:** HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `PATCH`
- URL: `http://localhost:5000/api/v1/recruitment/offer/674c3a1b8f9e2a001c5d7e35/finalize`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "finalStatus": "approved"
}
```

**Valid Final Status Values:**
- `approved` - Offer approved by HR
- `rejected` - Offer rejected
- `pending` - Still pending approval

---

## 6. EMPLOYEE CREATION

### 6.1 Create Employee from Contract
**Endpoint:** `POST /recruitment/offer/:id/create-employee`
**Role Required:** HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/offer/674c3a1b8f9e2a001c5d7e35/create-employee`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "offerId": "674c3a1b8f9e2a001c5d7e35",
  "contractId": "674c3a1b8f9e2a001c5d7e40",
  "workEmail": "john.doe@company.com",
  "contractType": "full_time",
  "workType": "onsite",
  "primaryDepartmentId": "674c3a1b8f9e2a001c5d7e05",
  "supervisorPositionId": "674c3a1b8f9e2a001c5d7e08",
  "payGradeId": "674c3a1b8f9e2a001c5d7e45"
}
```

**Valid Contract Types:**
- `full_time` - Full-time employee
- `part_time` - Part-time employee
- `contractor` - Contractor
- `intern` - Intern

**Valid Work Types:**
- `onsite` - Works from office
- `remote` - Works remotely
- `hybrid` - Mixed onsite/remote

**Expected Response:** `201 Created` with employee profile

---

## 7. ONBOARDING

### 7.1 Create Onboarding Checklist
**Endpoint:** `POST /recruitment/onboarding`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "employeeId": "674c3a1b8f9e2a001c5d7e50",
  "tasks": [
    {
      "name": "Complete employment forms",
      "department": "HR",
      "status": "pending",
      "deadline": "2025-12-10T00:00:00.000Z",
      "notes": "Forms to be submitted by first day"
    },
    {
      "name": "Setup workstation",
      "department": "IT",
      "status": "pending",
      "deadline": "2025-12-09T00:00:00.000Z"
    },
    {
      "name": "Complete orientation training",
      "department": "HR",
      "status": "pending",
      "deadline": "2025-12-15T00:00:00.000Z"
    }
  ]
}
```

**Valid Task Status Values:**
- `pending` - Not started
- `in_progress` - In progress
- `completed` - Completed
- `cancelled` - Cancelled

**Expected Response:** `201 Created`
```json
{
  "_id": "674c3a1b8f9e2a001c5d7e55",
  "employeeId": "674c3a1b8f9e2a001c5d7e50",
  "tasks": [...],
  ...
}
```

---

### 7.2 Get All Onboarding Records
**Endpoint:** `GET /recruitment/onboarding`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 7.3 Get Onboarding Statistics
**Endpoint:** `GET /recruitment/onboarding/stats`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/stats`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 7.4 Get Onboarding by ID
**Endpoint:** `GET /recruitment/onboarding/:id`
**Role Required:** All authenticated users

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/674c3a1b8f9e2a001c5d7e55`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 7.5 Get Onboarding by Employee ID
**Endpoint:** `GET /recruitment/onboarding/employee/:employeeId`
**Role Required:** All authenticated users

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/employee/674c3a1b8f9e2a001c5d7e50`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 7.6 Update Onboarding Checklist
**Endpoint:** `PUT /recruitment/onboarding/:id`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `PUT`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/674c3a1b8f9e2a001c5d7e55`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "tasks": [
    {
      "name": "Complete employment forms",
      "department": "HR",
      "status": "completed",
      "deadline": "2025-12-10T00:00:00.000Z"
    },
    {
      "name": "Setup workstation",
      "department": "IT",
      "status": "in_progress",
      "deadline": "2025-12-09T00:00:00.000Z"
    }
  ]
}
```

---

### 7.7 Update Single Onboarding Task
**Endpoint:** `PATCH /recruitment/onboarding/:id/task/:taskIndex`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `PATCH`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/674c3a1b8f9e2a001c5d7e55/task/0`
  - Note: `0` is the first task, `1` is second task, etc.
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "status": "completed",
  "notes": "Forms submitted and verified"
}
```

---

### 7.8 Add Task to Onboarding
**Endpoint:** `POST /recruitment/onboarding/:id/task`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/674c3a1b8f9e2a001c5d7e55/task`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "name": "Complete safety training",
  "department": "HR",
  "status": "pending",
  "deadline": "2025-12-20T00:00:00.000Z",
  "notes": "Mandatory safety course"
}
```

---

### 7.9 Remove Task from Onboarding
**Endpoint:** `DELETE /recruitment/onboarding/:id/task/:taskIndex`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `DELETE`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/674c3a1b8f9e2a001c5d7e55/task/2`
  - Note: `2` means remove the 3rd task (index starts at 0)
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

**Expected Response:** `204 No Content`

---

### 7.10 Delete Onboarding
**Endpoint:** `DELETE /recruitment/onboarding/:id`
**Role Required:** HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `DELETE`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/674c3a1b8f9e2a001c5d7e55`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

**Expected Response:** `204 No Content`

---

### 7.11 Send Onboarding Reminders
**Endpoint:** `POST /recruitment/onboarding/send-reminders`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/send-reminders`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

**Expected Response:** `200 OK`
```json
{
  "message": "Reminders sent successfully"
}
```

---

### 7.12 Provision System Access
**Endpoint:** `POST /recruitment/onboarding/:employeeId/provision-access/:taskIndex`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/674c3a1b8f9e2a001c5d7e50/provision-access/1`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 7.13 Reserve Equipment
**Endpoint:** `POST /recruitment/onboarding/:employeeId/reserve-equipment`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/674c3a1b8f9e2a001c5d7e50/reserve-equipment`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "equipmentType": "laptop",
  "equipmentDetails": {
    "model": "Dell Latitude 5520",
    "serialNumber": "SN12345678",
    "accessories": ["Mouse", "Laptop Bag", "USB Hub"]
  }
}
```

---

### 7.14 Schedule Access Provisioning
**Endpoint:** `POST /recruitment/onboarding/:employeeId/schedule-access`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/674c3a1b8f9e2a001c5d7e50/schedule-access`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "startDate": "2025-12-15T08:00:00.000Z",
  "endDate": "2026-12-15T17:00:00.000Z"
}
```

---

### 7.15 Trigger Payroll Initiation
**Endpoint:** `POST /recruitment/onboarding/:employeeId/trigger-payroll`
**Role Required:** HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/674c3a1b8f9e2a001c5d7e50/trigger-payroll`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "contractSigningDate": "2025-12-01T00:00:00.000Z",
  "grossSalary": 80000
}
```

---

### 7.16 Process Signing Bonus
**Endpoint:** `POST /recruitment/onboarding/:employeeId/process-bonus`
**Role Required:** HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/674c3a1b8f9e2a001c5d7e50/process-bonus`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "signingBonus": 5000,
  "contractSigningDate": "2025-12-01T00:00:00.000Z"
}
```

---

### 7.17 Cancel Onboarding
**Endpoint:** `POST /recruitment/onboarding/:employeeId/cancel`
**Role Required:** HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/674c3a1b8f9e2a001c5d7e50/cancel`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "reason": "Candidate did not show up on first day"
}
```

---

## 8. DOCUMENT MANAGEMENT

### 8.1 Upload Task Document
**Endpoint:** `POST /recruitment/onboarding/:id/task/:taskIndex/upload`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)
**Content-Type:** `multipart/form-data`

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/674c3a1b8f9e2a001c5d7e55/task/0/upload`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab:
  - Select `Form` type (not JSON)
  - Add fields:
    - Field 1: Key: `file`, Type: `File`, Value: [Click to select file]
    - Field 2: Key: `documentType`, Type: `Text`, Value: `contract`

**Valid Document Types:**
- `resume`
- `contract`
- `id_document`
- `certificate`
- `medical_report`
- `other`

---

### 8.2 Download Document
**Endpoint:** `GET /recruitment/document/:documentId/download`
**Role Required:** All authenticated users

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/document/674c3a1b8f9e2a001c5d7e60/download`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

**Expected Response:** File download

---

### 8.3 Get Task Document Metadata
**Endpoint:** `GET /recruitment/onboarding/:id/task/:taskIndex/document`
**Role Required:** All authenticated users

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/onboarding/674c3a1b8f9e2a001c5d7e55/task/0/document`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 8.4 Delete Document
**Endpoint:** `DELETE /recruitment/document/:documentId`
**Role Required:** HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `DELETE`
- URL: `http://localhost:5000/api/v1/recruitment/document/674c3a1b8f9e2a001c5d7e60`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

**Expected Response:** `204 No Content`

---

## 9. REFERRALS & CONSENT

### 9.1 Tag Candidate as Referral
**Endpoint:** `POST /recruitment/candidate/:candidateId/referral`
**Role Required:** HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/candidate/674c3a1b8f9e2a001c5d7e20/referral`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "referringEmployeeId": "674c3a1b8f9e2a001c5d7e10",
  "role": "Senior Software Engineer",
  "level": "Senior"
}
```

---

### 9.2 Get Candidate Referrals
**Endpoint:** `GET /recruitment/candidate/:candidateId/referrals`
**Role Required:** All authenticated users

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/candidate/674c3a1b8f9e2a001c5d7e20/referrals`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 9.3 Record Candidate Consent
**Endpoint:** `POST /recruitment/candidate/:candidateId/consent`
**Role Required:** All authenticated users

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/candidate/674c3a1b8f9e2a001c5d7e20/consent`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "consentGiven": true,
  "consentType": "data_processing",
  "notes": "Consent given for data processing and background checks"
}
```

**Valid Consent Types:**
- `data_processing`
- `background_check`
- `reference_check`

---

## 10. OFFBOARDING

### 10.1 Create Termination Request
**Endpoint:** `POST /recruitment/offboarding/termination`
**Role Required:** Any authenticated user
**Login As:** HR Manager (`EMP-2025-0005`) for termination, or Department Employee for resignation

**Employee Resignation - Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/offboarding/termination`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "employeeId": "EMP-2025-0010",
  "initiator": "employee",
  "reason": "Career change",
  "employeeComments": "Found opportunity in different industry",
  "terminationDate": "2026-01-31T00:00:00.000Z"
}
```

**HR Termination - Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/offboarding/termination`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "employeeId": "EMP-2025-0010",
  "initiator": "hr",
  "reason": "Performance issues",
  "terminationDate": "2025-12-31T00:00:00.000Z"
}
```

**Valid Initiator Values:**
- `employee` - Employee resignation
- `hr` - HR-initiated termination
- `manager` - Manager-initiated termination

**Expected Response:** `201 Created`
```json
{
  "_id": "674c3a1b8f9e2a001c5d7e70",
  "employeeId": "EMP-2025-0010",
  "initiator": "employee",
  "status": "pending",
  ...
}
```

---

### 10.2 Get My Resignation Requests
**Endpoint:** `GET /recruitment/offboarding/my-resignation`
**Role Required:** DEPARTMENT_EMPLOYEE
**Login As:** Department Employee

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/offboarding/my-resignation`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 10.3 Get Termination Request by ID
**Endpoint:** `GET /recruitment/offboarding/termination/:id`
**Role Required:** HR_MANAGER
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/offboarding/termination/674c3a1b8f9e2a001c5d7e70`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 10.4 Update Termination Status
**Endpoint:** `PATCH /recruitment/offboarding/termination/:id/status`
**Role Required:** HR_MANAGER
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `PATCH`
- URL: `http://localhost:5000/api/v1/recruitment/offboarding/termination/674c3a1b8f9e2a001c5d7e70/status`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "status": "approved",
  "hrComments": "Resignation accepted. Notice period waived.",
  "terminationDate": "2025-12-31T00:00:00.000Z"
}
```

**Valid Status Values:**
- `pending` - Under review
- `under_review` - Being reviewed
- `approved` - Approved
- `rejected` - Rejected

---

### 10.5 Update Termination Details
**Endpoint:** `PATCH /recruitment/offboarding/termination/:id`
**Role Required:** HR_MANAGER
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `PATCH`
- URL: `http://localhost:5000/api/v1/recruitment/offboarding/termination/674c3a1b8f9e2a001c5d7e70`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "reason": "Mutual agreement",
  "employeeComments": "Updated reason after discussion",
  "terminationDate": "2026-01-15T00:00:00.000Z"
}
```

---

### 10.6 Create Clearance Checklist
**Endpoint:** `POST /recruitment/offboarding/clearance`
**Role Required:** HR_MANAGER
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/offboarding/clearance`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "terminationId": "674c3a1b8f9e2a001c5d7e70",
  "actorRole": "HR_MANAGER"
}
```

**Expected Response:** `201 Created`
```json
{
  "_id": "674c3a1b8f9e2a001c5d7e75",
  "terminationId": "674c3a1b8f9e2a001c5d7e70",
  "items": [
    {
      "department": "HR",
      "status": "pending",
      ...
    },
    {
      "department": "IT",
      "status": "pending",
      ...
    }
  ],
  ...
}
```

---

### 10.7 Send Clearance Reminders
**Endpoint:** `POST /recruitment/offboarding/clearance/send-reminders`
**Role Required:** HR_MANAGER, SYSTEM_ADMIN
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/v1/recruitment/offboarding/clearance/send-reminders`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "force": false
}
```

**Note:** Body is optional. Can be empty or omit the request body entirely.

---

### 10.8 Get Clearance Checklist by Employee
**Endpoint:** `GET /recruitment/offboarding/clearance/employee/:employeeId`
**Role Required:** HR_MANAGER
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/offboarding/clearance/employee/674c3a1b8f9e2a001c5d7e50`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 10.9 Update Clearance Item Status
**Endpoint:** `PATCH /recruitment/offboarding/clearance/:id/item`
**Role Required:** HR_MANAGER, HR_EMPLOYEE, SYSTEM_ADMIN, DEPARTMENT_HEAD, FINANCE_STAFF, PAYROLL_MANAGER, PAYROLL_SPECIALIST
**Login As:** System Admin (`EMP-2025-0004`) for IT department, HR Manager for HR department, etc.

**Thunder Client Setup:**
- Method: `PATCH`
- URL: `http://localhost:5000/api/v1/recruitment/offboarding/clearance/674c3a1b8f9e2a001c5d7e75/item`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "department": "IT",
  "status": "approved",
  "comments": "Laptop and access card returned",
  "actorId": "674c3a1b8f9e2a001c5d7e10",
  "actorRole": "SYSTEM_ADMIN"
}
```

**Valid Status Values:**
- `pending` - Not cleared yet
- `approved` - Cleared
- `rejected` - Issues found

**Valid Department Values:**
- `HR` - Human Resources
- `IT` - Information Technology
- `FINANCE` - Finance Department
- `PAYROLL` - Payroll Department

---

### 10.10 Mark Clearance Checklist Completed
**Endpoint:** `PATCH /recruitment/offboarding/clearance/:id/complete`
**Role Required:** HR_MANAGER
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `PATCH`
- URL: `http://localhost:5000/api/v1/recruitment/offboarding/clearance/674c3a1b8f9e2a001c5d7e75/complete`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 10.11 Get Latest Appraisal for Employee
**Endpoint:** `GET /recruitment/offboarding/appraisal/:employeeId`
**Role Required:** HR_MANAGER
**Login As:** HR Manager (`EMP-2025-0005`)

**Thunder Client Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/v1/recruitment/offboarding/appraisal/674c3a1b8f9e2a001c5d7e50`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
- Body Tab: (Empty)

---

### 10.12 Revoke System Access
**Endpoint:** `PATCH /recruitment/offboarding/system-revoke`
**Role Required:** SYSTEM_ADMIN
**Login As:** System Admin (`EMP-2025-0004`)

**Thunder Client Setup:**
- Method: `PATCH`
- URL: `http://localhost:5000/api/v1/recruitment/offboarding/system-revoke`
- Headers Tab:
  - `Authorization`: `Bearer YOUR_TOKEN_HERE`
  - `Content-Type`: `application/json`
- Body Tab (JSON):

```json
{
  "employeeId": "674c3a1b8f9e2a001c5d7e50",
  "systems": ["email", "vpn", "slack", "github"],
  "effectiveDate": "2025-12-31T17:00:00.000Z"
}
```

---

## Complete Testing Workflow

Here's a recommended end-to-end testing flow with actual credentials:

### Phase 1: Setup (Login as HR Manager)
```json
POST http://localhost:5000/api/v1/auth/login
{
  "employeeNumber": "EMP-2025-0005",
  "password": "password123"
}
```
1. Copy the `access_token` from response
2. Use it in all subsequent requests

### Phase 2: Job Creation
3. Create job template (save the `_id`)
4. Create job requisition from template (save the `_id`)
5. Update job status to `active`
6. Publish job requisition

### Phase 3: Application Process (Login as Job Candidate if needed)
7. Submit application with consent (save the `_id`)
8. View all applications (as HR Manager)
9. Update application status to `in_process`
10. Get ranked applications

### Phase 4: Interview Process (as HR Manager)
11. Schedule interview for screening stage (save the `_id`)
12. Submit interview feedback with score
13. Get interview average score
14. Update interview status to `completed`
15. Schedule department interview
16. Submit feedback and complete

### Phase 5: Offer Management
17. Create offer for candidate (save the `_id`)
18. Candidate accepts offer
19. Finalize offer as `approved`

### Phase 6: Employee Creation
20. Create employee from accepted offer (save employee `_id`)

### Phase 7: Onboarding
21. Create onboarding checklist (save the `_id`)
22. Get onboarding by employee ID
23. Update onboarding task status to `completed`
24. Add new task to onboarding
25. Upload task document
26. Provision system access
27. Reserve equipment
28. Trigger payroll initiation
29. Process signing bonus

### Phase 8: Offboarding (Later - as HR Manager)
30. Create termination request
31. Update termination status to `approved`
32. Create clearance checklist
33. Login as System Admin (`EMP-2025-0004`)
34. Update IT clearance item to `approved`
35. Login back as HR Manager
36. Mark checklist completed
37. Login as System Admin
38. Revoke system access

---

## Quick Reference: Copy-Paste Bodies

### Login Bodies

**HR Manager:**
```json
{
  "employeeNumber": "EMP-2025-0005",
  "password": "password123"
}
```

**System Admin:**
```json
{
  "employeeNumber": "EMP-2025-0004",
  "password": "password123"
}
```

**HR Employee:**
```json
{
  "employeeNumber": "EMP-2025-0015",
  "password": "password123"
}
```

### Common Request Bodies

**Create Job Template:**
```json
{
  "title": "Senior Software Engineer",
  "department": "Engineering",
  "description": "Looking for experienced software engineer",
  "responsibilities": ["Design systems", "Lead teams", "Mentor developers"],
  "qualifications": [{"degree": "Bachelor", "field": "Computer Science", "required": true}],
  "requiredSkills": ["JavaScript", "Node.js", "MongoDB"],
  "preferredSkills": ["TypeScript", "NestJS"],
  "experienceYears": 5,
  "employmentType": "full_time"
}
```

**Create Job Requisition:**
```json
{
  "templateId": "REPLACE_WITH_TEMPLATE_ID",
  "openings": 3,
  "location": "Cairo, Egypt"
}
```

**Submit Application:**
```json
{
  "candidateId": "REPLACE_WITH_CANDIDATE_ID",
  "requisitionId": "REPLACE_WITH_JOB_ID",
  "consentGiven": true
}
```

**Schedule Interview:**
```json
{
  "applicationId": "REPLACE_WITH_APPLICATION_ID",
  "stage": "screening",
  "scheduledDate": "2025-12-15T10:00:00.000Z",
  "method": "video",
  "panel": ["REPLACE_WITH_INTERVIEWER_ID"]
}
```

**Create Offer:**
```json
{
  "applicationId": "REPLACE_WITH_APPLICATION_ID",
  "candidateId": "REPLACE_WITH_CANDIDATE_ID",
  "grossSalary": 80000,
  "signingBonus": 5000,
  "benefits": ["Health Insurance", "Annual Leave"],
  "role": "Senior Software Engineer",
  "deadline": "2025-12-20T23:59:59.000Z"
}
```

**Create Onboarding:**
```json
{
  "employeeId": "REPLACE_WITH_EMPLOYEE_ID",
  "tasks": [
    {
      "name": "Complete employment forms",
      "department": "HR",
      "status": "pending",
      "deadline": "2025-12-10T00:00:00.000Z"
    }
  ]
}
```

**Create Termination:**
```json
{
  "employeeId": "EMP-2025-0010",
  "initiator": "employee",
  "reason": "Career change",
  "terminationDate": "2026-01-31T00:00:00.000Z"
}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["employeeNumber should not be empty", "password should not be empty"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Solution:** Login again and get a new token

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```
**Solution:** You don't have the required role for this endpoint

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```
**Solution:** Check the ID in the URL

---

## Tips for Testing

1. **Start Backend:** Run `npm run start:dev` before testing
2. **Login First:** Always get a fresh token before testing
3. **Save IDs:** After creating resources, save their `_id` values
4. **Replace Placeholders:** Replace `REPLACE_WITH_*` with actual IDs
5. **Check Roles:** Make sure you're logged in with the correct role
6. **Use Dates:** All dates must be in ISO 8601 format: `2025-12-15T10:00:00.000Z`
7. **Test Sequentially:** Follow the workflow order
8. **Check Response:** Always check the response for errors
9. **MongoDB IDs:** All IDs are 24-character hex strings
10. **Copy-Paste:** Use the bodies exactly as shown, just replace IDs

---

## System Roles Reference

| Role | Description | Access Level |
|------|-------------|--------------|
| SYSTEM_ADMIN | Full system access | Highest |
| HR_MANAGER | Manages HR operations | High |
| HR_EMPLOYEE | HR staff member | Medium |
| RECRUITER | Recruitment specialist | Medium |
| JOB_CANDIDATE | Job applicant | Low |
| DEPARTMENT_HEAD | Department manager | Medium |
| DEPARTMENT_EMPLOYEE | Regular employee | Low |
| PAYROLL_MANAGER | Payroll management | Medium |
| PAYROLL_SPECIALIST | Payroll operations | Medium |
| FINANCE_STAFF | Finance department | Medium |

---

## Total Endpoints: 72

- **Job Templates:** 4 endpoints
- **Job Requisitions:** 6 endpoints
- **Applications:** 4 endpoints
- **Interviews:** 5 endpoints
- **Offers:** 3 endpoints
- **Employee Creation:** 1 endpoint
- **Onboarding:** 17 endpoints
- **Documents:** 4 endpoints
- **Referrals & Consent:** 3 endpoints
- **Offboarding:** 12 endpoints

---

**Document Version:** 2.0
**Last Updated:** December 2025
**API Version:** v1
**Base URL:** http://localhost:5000/api/v1

---

## Need Help?

1. Make sure backend is running: `npm run start:dev`
2. Check you're using the correct credentials
3. Verify the token hasn't expired (tokens last 24 hours)
4. Ensure all IDs are valid MongoDB ObjectIds (24 hex characters)
5. Check the request body matches the expected format exactly
