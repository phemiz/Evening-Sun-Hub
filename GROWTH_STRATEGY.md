# Evening Sun Hub - Growth & Loyalty Engine Strategy

## 1. Core Philosophy: "The Sun Ecosystem"

The primary growth lever is **Cross-Pollination**. A user entering for a haircut (Low AOV, High Frequency) should be nudged towards Marine Services (High AOV, Low Frequency).

**The Hook**: "Your lifestyle pays for itself."

---

## 2. Loyalty Program: "SunRewards"

A unified point system across all 5 business verticals.

### 2.1 The Currency: SunPoints
*   **Earn Rate**: 5% of spend in Points (e.g., Spend ₦10,000 → Earn 500 Points).
*   **Value**: 1 Point = ₦1 (Simple 1:1 redemption ratio for transparency).
*   **Expiry**: Rolling 12 months.

### 2.2 Tier System
Tiers gamify status and unlock non-monetary perks (highly valued in the target demographic).

| Tier Name | Entry Requirement | Perks |
| :--- | :--- | :--- |
| **Rising Sun** | Sign up | 2% Cashback (Points)<br>Access to Promos |
| **Golden Hour** | Spend ₦100k/year | 5% Cashback<br>Free Birthday Meal<br>Priority Kitchen (Skip queue) |
| **Sunset Elite** | Spend ₦500k/year | 7% Cashback<br>No Booking Deposit Required<br>Vessel Upgrade (Marine)<br>Dedicated WhatsApp Concierge |

### 2.3 Reward Logic
```typescript
function calculatePoints(amount, userTier) {
  const rates = { RISING: 0.02, GOLDEN: 0.05, ELITE: 0.07 };
  return Math.floor(amount * rates[userTier]);
}
// Redemption is only allowed on increments of 1000 Points to drive retention.
```

---

## 3. Referral Engine: "SunCircle"

Designed for **WhatsApp Viral Loops**.

### 3.1 The Offer (Double-Sided)
*   **Referrer (User)**: Get ₦1,000 Wallet Credit.
*   **Referee (Friend)**: Get ₦1,000 off their first order (Min spend ₦5,000).

### 3.2 The User Journey
1.  **Trigger**: User completes a booking or order with a rating of 4★+.
2.  **Prompt**: "Loved the service? Invite your squad."
3.  **Action**: User taps "Share on WhatsApp".
4.  **Content**: The app generates a pre-filled message:
    > "Guys, I just ordered the best Jollof from Evening Sun! Use my code **TUNDE24** to get ₦1,000 off your first chop. Download here: [Link]"
5.  **Conversion**: Friend installs, inputs code during onboarding (or auto-applied via deep link).
6.  **Reward Unlock**: Referrer gets credit *only* after Friend completes first paid order.

---

## 4. Digital Marketing Engine

### 4.1 Dynamic "Status" Flyers
The biggest marketing channel in Nigeria is WhatsApp Status. The app includes a **Flyer Generator**.

*   **Feature**: Admin creates a "Friday Night Groove" template.
*   **User Action**: User goes to "Promotions" -> Taps "Share & Earn".
*   **Technical**: The backend overlays the User's Referral Code onto the event image.
*   **Result**: User posts a professional graphic on their status. If their contacts screenshot/scan it, the User gets referral credit.

### 4.2 Push Notification Strategy (Personalized)
Avoid spam. Use behavioral triggers.

*   **The "Glow Up" Trigger**: User books a Club Table for Friday.
    *   *Push (Thursday)*: "Big night tomorrow? Book a haircut/styling today and get 10% off with code GLOWUP."
*   **The "Replenish" Trigger**: User ordered a Supermarket Hamper 30 days ago.
    *   *Push*: "Running low on provisions? Re-order your basket in 1 tap."
*   **The "Rainy Day" Trigger**: Weather API detects rain.
    *   *Push*: "Raining in Lekki? Free delivery on all hot soups today."

---

## 5. Cross-Promotion Loops

We use **Smart Coupons** to move users between services.

1.  **Salon to Club**: "You look fresh! ✂️ Here is a free cocktail voucher for the Club tonight."
2.  **Marine to Eatery**: "Hope you enjoyed the cruise. 🚤 The Chef has prepared a special seafood platter for you at the Eatery."
3.  **Eatery to Supermarket**: "Liked the wine with dinner? 🍷 Buy a bottle from our Mart to take home."

---

## 6. Anti-Abuse & Fraud Protection

Referral systems in Nigeria face high fraud attempts (self-referrals).

1.  **Device Fingerprinting**: Prevent multiple accounts from the same physical device ID (IMEI/UUID) claiming referral bonuses.
2.  **Phone Verification**: Strict OTP on signup. VoIP numbers blocked.
3.  **First Order Rule**: Referral bonus is **Pending** until the new user spends real money (min ₦2,000).
4.  **Velocity Limits**: Max 10 Referrals per week. Accounts exceeding this are flagged for "Ambassador" review (manual upgrade) or fraud block.

---

## 7. Metrics to Track (North Star)

1.  **K-Factor**: (Avg # of referrals per user) * (Conversion rate). Target > 1.0.
2.  **Cross-Sell Ratio**: % of users who have used >1 Service Category.
3.  **Redemption Rate**: % of issued Points/Coupons actually used (measure of program value).
4.  **Churn Rate (Tiered)**: Do "Golden Hour" members churn less than "Rising Sun"?

---

## 8. UX Wireframe Description: Promotions Tab

**Header**: "My SunRewards" (Card showing Points: 4,500 | Value: ₦4,500)

**Section 1: Active Challenges**
*   [Icon: Boat] "The Sailor": Book 1 Marine Trip → Get 5k Salon Credit. (Progress: 0/1)
*   [Icon: Utensils] "Foodie": Order 5 times → Get Free Delivery. (Progress: 3/5)

**Section 2: Flash Deals (Digital Flyers)**
*   *Card*: "Friday Club Night".
*   *CTA*: "Share to WhatsApp Status (Earn ₦500)".

**Section 3: Referral**
*   "Invite Friends" Card with copy-paste code.
