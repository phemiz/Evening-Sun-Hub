# Evening Sun Hub - Payment & Monetization Architecture

## 1. Monetization Strategy

The platform operates on a **Hybrid Transactional Model** designed to accommodate both immediate service delivery (Food) and scheduled services (Salon/Marine).

### 1.1 Revenue Streams
1.  **Direct Sales (Eatery/Mart)**: 100% immediate revenue.
2.  **Booking Deposits (Salon/Marine)**:
    *   **Policy**: 20-50% upfront deposit required to secure slot.
    *   **Balance**: Paid offline (Cash/POS) or via App after service.
3.  **Event Ticketing (Club)**: 100% upfront for tickets; Tables require reservation deposit.
4.  **Commission (Future SaaS/Multi-tenant)**:
    *   The platform calculates a "Platform Fee" (e.g., 5%) on every transaction processed for a tenant.
    *   Implementation: Use **Paystack Split Payments** to automatically route commission to the Super Admin wallet and the rest to the Branch wallet.

---

## 2. Payment Providers Integration Strategy

We utilize a **Failover Strategy** for high availability in Nigeria.

*   **Primary**: **Paystack**. Best for card success rates and UX.
*   **Secondary**: **Flutterwave**. Used if Paystack is experiencing downtime.
*   **Channels Enabled**: Card, Bank Transfer (Virtual Accounts), USSD, Apple Pay.

---

## 3. Detailed Payment Flows (Text Diagrams)

### Flow A: Booking with Deposit (Salon/Marine)

```text
User                  App/Frontend              Backend API                  Paystack/Gateway
 |                         |                         |                              |
 |--- Select Service ----->|                         |                              |
 |--- Choose Date/Time --->|                         |                              |
 |                         |--- POST /bookings ----->|                              |
 |                         | (Status: PENDING)       |                              |
 |                         |                         |                              |
 |--- Click "Pay Deposit"->|--- POST /initialize --->|                              |
 |                         |                         |--- Req Auth URL ------------>|
 |                         |<-- Ret Auth URL --------|<-- Ret URL + Ref ------------|
 |                         |                         |                              |
 |--- Enters Card Details->|--- Load Checkout ------>|                              |
 |                         |                         |<-- Webhook: Success ---------|
 |                         |                         | 1. Verify Signature          |
 |                         |                         | 2. Find Transaction          |
 |                         |                         | 3. Update Booking: CONFIRMED |
 |<-- "Booking Confirmed" -|<-- SSE/Push Notif ------| 4. Send Receipt Email        |
 |                         |                         |                              |
 |       ... ON SERVICE DAY ...                      |                              |
 |                         |                         |                              |
 |--- Service Complete --->|                         |                              |
 |                         |-- Staff: "Mark Done" -->|                              |
 |                         |                         |                              |
 |--- Pays Balance (POS) ->|-- Staff: "Log Pay" ---->|                              |
 |                         |                         | 1. Create Transaction (POS)  |
 |                         |                         | 2. Update Order: COMPLETED   |
 |                         |                         | 3. Update Daily Revenue Log  |
```

### Flow B: Offline Reconciliation (Cash/POS)

In Nigeria, many customers prefer paying via physical POS terminals or Cash after service.

1.  **Staff Action**: Staff opens "Job Details" on the Staff App.
2.  **Input**: Selects "Record Payment".
    *   Method: `CASH` or `EXTERNAL_POS`.
    *   Amount: Full Balance or Partial.
    *   Reference: (Optional) Enters POS receipt number.
3.  **Backend Processing**:
    *   Creates a `Transaction` record with `channel: 'POS'`.
    *   Status is set to `SUCCESS` immediately.
    *   **Audit**: This transaction is flagged for the "End of Day Cash Up" report. The Manager must physically count cash/POS slips to match the system total.

---

## 4. Refund Rules & Logic

Refunding is strictly controlled to prevent fraud.

*   **Trigger**: Can be automated (Cancellation > 24hrs) or Manual (Admin).
*   **Wallet System**: Refunds are **NOT** sent back to the bank account automatically (due to gateway delays/fees). They are credited to the User's **In-App Wallet**.
    *   *User Logic*: "I cancelled my appointment. My wallet now has ₦5,000. I can use this for Jollof Rice."
*   **Logic**:
    ```typescript
    if (booking.cancellation_reason === 'USER_REQUEST' && time_to_start > 24h) {
        creditWallet(user_id, deposit_amount);
        markBookingCancelled(booking_id);
    } else {
        // No Refund or Manual Review required
        markBookingCancelled(booking_id);
    }
    ```

---

## 5. Security & Reconciliation Considerations

### 5.1 The "Lost" Transaction (Edge Case)
*   **Scenario**: User is debited, but network fails before the App gets the success signal.
*   **Solution**:
    1.  **Webhooks**: The primary source of truth. Even if the user closes the browser, Paystack calls our server.
    2.  **Re-Query Job**: A Cron job runs every 10 minutes checking `PENDING` transactions older than 5 minutes. It calls `Paystack.verifyTransaction(ref)` to sync status.

### 5.2 Idempotency
*   Every payment request generates a unique `idempotency_key` stored in Redis.
*   Prevents double-charging if a user clicks "Pay" twice rapidly.

### 5.3 Signature Verification
*   **Strict Rule**: Never trust the frontend callback.
*   The Backend **MUST** calculate the HMAC SHA512 signature of the webhook payload using the `PAYSTACK_SECRET_KEY` and compare it with the `x-paystack-signature` header.

---

## 6. SaaS/Multi-Branch Commission Logic

To scale this to a franchise or SaaS model:

1.  **Merchant Accounts**: Each Branch/Business has a `subaccount_code` on Paystack.
2.  **Split Calculation**:
    ```typescript
    const PLATFORM_FEE_PERCENT = 0.05; // 5%
    const amount = 10000;
    const platform_share = amount * PLATFORM_FEE_PERCENT; // 500
    const merchant_share = amount - platform_share; // 9500

    // Paystack Payload
    {
      amount: 10000,
      split: {
        type: "flat",
        bearer_type: "account",
        subaccounts: [
          { subaccount: "ACCT_MERCHANT_123", share: 9500 }
        ]
      }
    }
    ```
3.  **Result**: The Platform Owner gets ₦500 instantly, the Business Owner gets ₦9,500. No manual invoicing needed.

---

## 7. Data Models for Payments (Addendum to Schema)

**`payment_attempts`** (Ephemeral log)
*   `id`, `transaction_ref`, `gateway_response` (JSON), `ip_address`, `device_fingerprint`.

**`daily_reconciliation`**
*   `branch_id`, `date`, `total_system_cash`, `total_declared_cash`, `total_system_pos`, `total_declared_pos`, `variance`, `manager_id`.

