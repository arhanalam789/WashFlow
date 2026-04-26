# Test Cases And Results

## Manual Verification Summary

| Test Case | Steps | Expected Result | Actual Result |
| --- | --- | --- | --- |
| User signup | Register with name, email, password, role | Account is created and token is returned | Passed |
| User login | Login with valid credentials | Token and user data are returned | Passed |
| Create laundry request | Customer creates request with clothes count and pickup date | Request is stored and visible in dashboard | Passed |
| Assign to washing center | Admin assigns request to center | Request status becomes `assigned` | Passed |
| Send notification | Admin sends request-linked update | Customer inbox shows new notification | Passed |
| View incoming requests | Manager opens dashboard | Assigned requests are listed | Passed |
| Manager ownership filtering | Manager opens dashboard | Only requests for their assigned washing center are listed | Passed |
| Verify clothes count | Manager marks request `in_progress` | Status updates and customer is notified | Passed |
| Mark request completed | Manager marks request `completed` | Status updates and customer is notified | Passed |
| Raise concern ticket | Manager raises concern | Concern ticket is created and customer is notified | Passed |
| Invalid status transition | Move request directly from `pending` to `completed` | Backend rejects the transition | Passed |
| Cross-center manager update | Manager updates another center's request | Backend returns forbidden response | Passed |
| Confirm concern ticket | Customer confirms concern | Concern becomes confirmed and notification is created | Passed |
| Mark notification as read | Customer marks inbox item as read | Notification read state becomes true | Passed |

## Automated Backend Service Tests

Run from `Backend/`:

```bash
npm test
```

Covered scenarios:

- Manager request listing carries `assignedCenterId`.
- Manager cannot update another center's request.
- Illegal status transitions are rejected.
- Valid status updates create notifications.
- Manager cannot raise concerns for another center.
- Valid concern creation updates request status and creates a notification.

## Latest Verified Live Flow

- Customer account created
- Request created
- Admin assignment completed
- Manager processing completed
- Concern ticket raised
- Customer concern confirmation completed
- Notification read-state update completed
