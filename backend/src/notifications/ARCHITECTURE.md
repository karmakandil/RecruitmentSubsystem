# Notifications Module Architecture

## Overview

The notifications system uses a **two-schema architecture** to maintain the TA's original requirements while providing extended functionality for the full HR system.

---

## Schema Architecture

### 1. **NotificationLog** (Basic Schema - TA's Version)
**Location:** `time-management/models/notification-log.schema.ts`

```typescript
{
  to: ObjectId         // Recipient (EmployeeProfile._id)
  type: string         // Notification type
  message?: string     // Optional message
  timestamps: true     // createdAt, updatedAt (automatic)
}
```

**Purpose:**
- Basic notification schema as provided by TA
- Used by time-management module for simple notifications
- Clean, minimal design

---

### 2. **ExtendedNotification** (Rich Schema - Full System)
**Location:** `notifications/models/extended-notification.schema.ts`

```typescript
{
  to: ObjectId            // Recipient (EmployeeProfile._id)
  type: string            // Notification type (from NotificationType enum)
  message?: string        // Human-readable message
  isRead?: boolean        // Read/unread status (default: false)
  data?: Record<any>      // Structured data for frontend (IDs, links, context)
  title?: string          // Optional title for better UX
  createdBy?: ObjectId    // User who triggered the notification
  timestamps: true        // createdAt, updatedAt (automatic)
}
```

**Purpose:**
- Extended notification with rich features for full HR system
- Used by notifications service for all subsystems
- Supports read/unread tracking, structured data, and audit trail

---

## Module Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                   TIME-MANAGEMENT MODULE                     │
│                                                              │
│  Models:                                                     │
│  └── notification-log.schema.ts (Basic - TA's version)      │
│                                                              │
│  Services:                                                   │
│  └── notification.service.ts (uses NotificationLog)         │
│      └── sendNotification() - Simple notifications only     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          ↑
                          │ Imports NotificationLog
                          │
┌─────────────────────────────────────────────────────────────┐
│                   NOTIFICATIONS MODULE                       │
│                                                              │
│  Models:                                                     │
│  └── extended-notification.schema.ts (Rich version)         │
│                                                              │
│  Enums:                                                      │
│  └── notification-type.enum.ts (All notification types)     │
│      ├── LEAVE_APPROVED, LEAVE_REJECTED                     │
│      ├── INTERVIEW_SCHEDULED, CANDIDATE_HIRED               │
│      ├── SHIFT_EXPIRY_ALERT, MISSED_PUNCH_ALERT            │
│      ├── RESIGNATION_SUBMITTED, TERMINATION_APPROVED        │
│      └── ... (90+ notification types)                       │
│                                                              │
│  Services:                                                   │
│  ├── notifications.service.ts                               │
│  │   └── Uses ExtendedNotification for rich notifications   │
│  │   └── Methods: notifyLeaveRequestFinalized(),           │
│  │       sendShiftExpiryNotification(),                     │
│  │       notifyResignationSubmitted(), etc.                 │
│  │                                                           │
│  └── recruitment-notifications.service.ts                   │
│      └── Uses ExtendedNotification                          │
│      └── Methods: notifyInterviewPanelMembers(),           │
│          notifyCandidateHired(), etc.                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Notification Types Enum

**Location:** `notifications/enums/notification-type.enum.ts`

Defines all notification types used across the system:

### Leave Module
- `LEAVE_APPROVED`, `LEAVE_REJECTED`, `LEAVE_CREATED`, `LEAVE_MODIFIED`

### Time Management
- `SHIFT_EXPIRY_ALERT`, `SHIFT_RENEWAL_CONFIRMATION`
- `MISSED_PUNCH_EMPLOYEE_ALERT`, `MISSED_PUNCH_MANAGER_ALERT`

### Recruitment
- `INTERVIEW_SCHEDULED`, `INTERVIEW_CANCELLED`
- `CANDIDATE_HIRED`, `CANDIDATE_REJECTED`
- `OFFER_RECEIVED`, `APPLICATION_ACCEPTED`

### Onboarding
- `ONBOARDING_WELCOME`, `ONBOARDING_TASK_REMINDER`
- `ONBOARDING_DOCUMENT_UPLOADED`, `ONBOARDING_COMPLETED`

### Offboarding
- `RESIGNATION_SUBMITTED`, `TERMINATION_APPROVED`
- `CLEARANCE_CHECKLIST_CREATED`, `ACCESS_REVOKED`
- `FINAL_SETTLEMENT_COMPLETED`

### Employee Profile
- `PROFILE_CHANGE_REQUEST_SUBMITTED`, `PROFILE_CHANGE_APPROVED`

---

## When to Use Which Schema?

### Use **NotificationLog** (Basic) when:
- ✅ Working within time-management module only
- ✅ Simple notifications (just to, type, message)
- ✅ No need for read/unread tracking
- ✅ No structured data required

### Use **ExtendedNotification** (Rich) when:
- ✅ Cross-module notifications (recruitment, onboarding, offboarding, etc.)
- ✅ Need read/unread status tracking
- ✅ Need to pass structured data to frontend
- ✅ Need titles or created by tracking
- ✅ Using the unified NotificationsService

---

## Data Flow

### Creating a Notification

```typescript
// OPTION 1: Simple notification (time-management only)
// Uses: NotificationLog schema
const notification = await timeManagementNotificationService.sendNotification({
  to: employeeId,
  type: 'SHIFT_EXPIRY',
  message: 'Your shift is expiring soon'
}, currentUserId);

// OPTION 2: Rich notification (recommended for all subsystems)
// Uses: ExtendedNotification schema
const notification = await notificationsService.sendShiftExpiryNotification(
  recipientId,
  shiftAssignmentId,
  employeeId,
  endDate,
  daysRemaining,
  currentUserId
);
// Creates notification with:
// - isRead: false
// - data: { assignmentId, employeeId, daysRemaining, urgency }
// - title: "Shift Expiry Alert - X days remaining"
```

### Reading Notifications

```typescript
// Get all notifications for a user (returns ExtendedNotification documents)
const notifications = await notificationsService.getUserNotifications(userId);

// Mark as read
await notificationsService.markNotificationAsRead(notificationId);
```

---

## Database Collections

Both schemas write to the same MongoDB collection: `extendednotifications`

**Why?**
- The notifications module registers `ExtendedNotification` as the primary model
- ExtendedNotification is a superset of NotificationLog
- All fields from NotificationLog are included in ExtendedNotification
- Time-management can still create basic notifications if needed

---

## Benefits of This Architecture

1. **TA's Requirements Met** ✅
   - NotificationLog exists exactly as provided by TA
   - Located in time-management module as specified
   - Has only the 3 required fields (to, type, message)

2. **Extended Functionality** ✅
   - ExtendedNotification adds rich features
   - Backward compatible (includes all NotificationLog fields)
   - Supports complex notification needs across all subsystems

3. **Clear Separation** ✅
   - Basic schema in time-management (domain-specific)
   - Rich schema in notifications (cross-cutting concern)
   - Each module uses what it needs

4. **No Duplication** ✅
   - Notifications module imports from time-management when needed
   - Single source of truth for each schema
   - Clear ownership boundaries

---

## Migration Notes

If you need to migrate existing NotificationLog documents to use ExtendedNotification features:

```typescript
// Add isRead field to existing documents
await db.notificationlogs.updateMany(
  { isRead: { $exists: false } },
  { $set: { isRead: false } }
);
```

---

## Testing

### Test Basic Notifications
```bash
# Test time-management simple notification
POST /time-management/notification/send
{
  "to": "employee_id",
  "type": "SHIFT_EXPIRY",
  "message": "Test message"
}
```

### Test Rich Notifications
```bash
# Test shift expiry notification with full features
GET /notification/shift-expiry?hrAdminId=admin_id
```

---

## Questions?

- **Q: Why two schemas?**
  - A: To maintain TA's original design while adding needed features

- **Q: Which service should I use?**
  - A: Use `NotificationsService` from notifications module for most cases

- **Q: Can I add more fields to NotificationLog?**
  - A: No, keep TA's version unchanged. Add fields to ExtendedNotification instead

- **Q: Do both schemas use the same collection?**
  - A: Yes, `extendednotifications` collection (managed by the notifications module)

---

## Related Files

- `notifications/models/extended-notification.schema.ts` - Rich notification schema
- `notifications/enums/notification-type.enum.ts` - All notification types
- `notifications/notifications.service.ts` - Main notification service
- `notifications/services/recruitment-notifications.service.ts` - Recruitment-specific
- `time-management/models/notification-log.schema.ts` - Basic TA schema
- `time-management/services/notification.service.ts` - Time-management notifications
