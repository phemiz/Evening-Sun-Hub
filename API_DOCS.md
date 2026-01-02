# Evening Sun Hub - REST API Specification

## 1. Authentication & Identity (Public)

### POST `/api/v1/auth/otp/request`
Request a One-Time Password via SMS.
*   **Body**: `{ "phone": "+2348012345678" }`
*   **Response**: `200 OK` `{ "message": "OTP sent", "otp_reference": "xyz..." }`

### POST `/api/v1/auth/otp/verify`
Exchange OTP for an Access Token.
*   **Body**: `{ "phone": "+2348012345678", "code": "1234" }`
*   **Response**: `200 OK`
    ```json
    {
      "access_token": "eyJhbG...",
      "user": { "id": "uuid", "role": "CUSTOMER", "full_name": "Tunde Ednut" }
    }
    ```

### POST `/api/v1/auth/refresh`
Refresh an expired access token.
*   **Body**: `{ "refresh_token": "..." }`

---

## 2. User Profile (Protected: All Roles)

### GET `/api/v1/users/me`
Get current user profile and wallet balance.

### PUT `/api/v1/users/me`
Update profile details.
*   **Body**: `{ "full_name": "New Name", "email": "new@email.com" }`

### GET `/api/v1/users/me/wallet`
Get wallet transaction history.

---

## 3. Catalog & Service Discovery (Public)

### GET `/api/v1/branches`
List all physical locations.

### GET `/api/v1/branches/:branchId/catalog`
Get menu items and services for a specific branch.
*   **Query**: `?type=EATERY` or `?type=SALON`
*   **Response**:
    ```json
    [
      { "id": "uuid", "name": "Jollof Rice", "price": 2500, "is_available": true }
    ]
    ```

---

## 4. Eatery & Orders (Protected: Customer)

### POST `/api/v1/orders`
Create a new food or supermarket order.
*   **Body**:
    ```json
    {
      "branch_id": "uuid",
      "items": [{ "item_id": "uuid", "quantity": 2, "options": { "spicy": true } }],
      "type": "DELIVERY",
      "address": "123 Lekki Phase 1"
    }
    ```
*   **Response**: `201 Created` `{ "id": "order_uuid", "status": "PENDING" }`

### GET `/api/v1/orders`
List user's order history.

### GET `/api/v1/orders/:id`
Get detailed status of a specific order.

---

## 5. Bookings (Salon & Marine) (Protected: Customer)

### GET `/api/v1/availability`
Check available slots for a service/staff.
*   **Query**: `?staff_id=uuid&date=2023-12-25&service_id=uuid`
*   **Response**: `[ "10:00", "10:30", "14:00" ]`

### POST `/api/v1/bookings`
Create a booking.
*   **Body**:
    ```json
    {
      "service_id": "uuid",
      "staff_id": "uuid", // Optional
      "start_time": "2023-12-25T14:00:00Z"
    }
    ```

### PUT `/api/v1/bookings/:id/cancel`
Cancel a booking (Checks cancellation policy).

---

## 6. Staff Operations (Protected: Staff Only)

### GET `/api/v1/staff/tasks`
Get assigned bookings or orders for the day.
*   **Query**: `?status=PENDING`

### PUT `/api/v1/staff/tasks/:id/status`
Update status of a job (e.g., Kitchen to Waiter).
*   **Body**: `{ "status": "READY" }`

### POST `/api/v1/staff/marine-logs`
Submit a marine trip log.
*   **Body**:
    ```json
    {
      "vessel_id": "uuid",
      "fuel_start": 500.5,
      "engine_start": 12000
    }
    ```

---

## 7. Payments & Financials (Protected)

### POST `/api/v1/payments/initialize`
Start a payment intent (Paystack/Flutterwave).
*   **Body**: `{ "amount": 5000, "purpose": "BOOKING_DEPOSIT" }`
*   **Response**: `{ "authorization_url": "https://paystack.com/...", "reference": "ref_123" }`

### POST `/api/v1/payments/webhook`
**Public** endpoint for Payment Gateway callbacks. Verifies signature and updates Transaction/Order status.

---

## 8. Club & Events

### GET `/api/v1/events`
List upcoming club events.

### POST `/api/v1/events/:id/reservations`
Book a table or buy a ticket.

---

## 9. Admin & Reporting (Protected: Admin Only)

### GET `/api/v1/admin/dashboard`
Get aggregated stats (Revenue today, Active bookings).

### GET `/api/v1/admin/users`
CRM view of customers.

### POST `/api/v1/admin/catalog`
Add/Edit menu items or services.

### POST `/api/v1/admin/push-notification`
Send a broadcast message to users.
*   **Body**: `{ "target": "ALL_CUSTOMERS", "title": "Happy Hour!", "message": "50% off drinks." }`

---

## 10. AI Assistant

### POST `/api/v1/ai/chat`
Send message to Gemini-powered concierge.
*   **Body**: `{ "message": "Do you have Egusi soup available?" }`
*   **Response**: `{ "reply": "Yes! We have Egusi with Goat meat available for ₦3,000." }`
