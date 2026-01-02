# Evening Sun Hub - Database Schema Design (PostgreSQL)

## 1. Core Identity & Access Management

### `branches`
Represents physical business locations.
*   `id` (UUID, PK)
*   `name` (VARCHAR)
*   `address` (TEXT)
*   `settings` (JSONB) - *Stores operating hours, tax rates, contact info.*
*   `created_at` (TIMESTAMP)

### `users`
Central identity for Customers, Staff, and Admins.
*   `id` (UUID, PK)
*   `phone` (VARCHAR, Unique, Indexed) - *Primary login method.*
*   `email` (VARCHAR, Nullable)
*   `password_hash` (VARCHAR)
*   `full_name` (VARCHAR)
*   `role` (ENUM: 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN')
*   `is_active` (BOOLEAN)
*   `loyalty_points` (INTEGER)
*   `created_at` (TIMESTAMP)

### `staff_profiles`
Extended attributes for employees.
*   `user_id` (UUID, PK, FK -> users.id)
*   `branch_id` (UUID, FK -> branches.id)
*   `department` (ENUM: 'KITCHEN', 'SALON', 'BAR', 'MARINE', 'SECURITY')
*   `specialization` (VARCHAR) - *e.g., "Braids Specialist", "Head Chef".*
*   `status` (ENUM: 'ACTIVE', 'ON_LEAVE', 'TERMINATED')
*   `hourly_rate` (DECIMAL)

---

## 2. Service Catalog (Inventory & Services)

### `categories`
*   `id` (UUID, PK)
*   `branch_id` (UUID, FK)
*   `name` (VARCHAR) - *e.g., "Swallow", "Braids", "Whiskey".*
*   `type` (ENUM: 'EATERY', 'SALON', 'CLUB', 'MARINE')

### `catalog_items`
Unified table for sellable goods and services.
*   `id` (UUID, PK)
*   `branch_id` (UUID, FK)
*   `category_id` (UUID, FK)
*   `name` (VARCHAR)
*   `description` (TEXT)
*   `price` (DECIMAL(12,2))
*   `image_url` (VARCHAR)
*   `item_type` (ENUM: 'PRODUCT', 'SERVICE')
*   `duration_minutes` (INTEGER, Nullable) - *For services only.*
*   `is_available` (BOOLEAN)
*   `stock_quantity` (INTEGER, Nullable) - *For products only.*

---

## 3. Eatery & Orders Module

### `orders`
*   `id` (UUID, PK)
*   `branch_id` (UUID, FK)
*   `user_id` (UUID, FK)
*   `status` (ENUM: 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED')
*   `total_amount` (DECIMAL)
*   `payment_status` (ENUM: 'UNPAID', 'PARTIAL', 'PAID')
*   `order_type` (ENUM: 'DINE_IN', 'PICKUP', 'DELIVERY')
*   `table_number` (VARCHAR, Nullable)
*   `delivery_address` (TEXT, Nullable)
*   `created_at` (TIMESTAMP, Indexed)

### `order_items`
*   `id` (UUID, PK)
*   `order_id` (UUID, FK)
*   `item_id` (UUID, FK -> catalog_items.id)
*   `quantity` (INTEGER)
*   `price_at_time` (DECIMAL) - *Snapshot of price.*
*   `options` (JSONB) - *e.g., {"spiciness": "high", "extras": ["plantain"]}*

---

## 4. Bookings Module (Salon & Marine)

### `bookings`
*   `id` (UUID, PK)
*   `branch_id` (UUID, FK)
*   `user_id` (UUID, FK)
*   `staff_id` (UUID, FK, Nullable) - *Specific stylist or boat captain.*
*   `item_id` (UUID, FK -> catalog_items.id)
*   `start_time` (TIMESTAMP, Indexed)
*   `end_time` (TIMESTAMP, Indexed)
*   `status` (ENUM: 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'NO_SHOW', 'CANCELLED')
*   `deposit_amount` (DECIMAL)
*   `notes` (TEXT)

---

## 5. Club & Events Module

### `events`
*   `id` (UUID, PK)
*   `branch_id` (UUID, FK)
*   `title` (VARCHAR)
*   `date` (TIMESTAMP)
*   `ticket_price` (DECIMAL)
*   `capacity` (INTEGER)

### `tables`
*   `id` (UUID, PK)
*   `branch_id` (UUID, FK)
*   `number` (VARCHAR)
*   `capacity` (INTEGER)
*   `min_spend` (DECIMAL)
*   `zone` (VARCHAR) - *e.g., "VIP", "Patio".*

### `table_reservations`
*   `id` (UUID, PK)
*   `table_id` (UUID, FK)
*   `user_id` (UUID, FK)
*   `event_id` (UUID, FK, Nullable)
*   `reservation_time` (TIMESTAMP)
*   `guest_count` (INTEGER)
*   `is_confirmed` (BOOLEAN)

---

## 6. Marine Logistics Module

### `vessels`
*   `id` (UUID, PK)
*   `name` (VARCHAR)
*   `type` (VARCHAR) - *e.g., "Speedboat", "Yacht".*
*   `capacity` (INTEGER)
*   `status` (ENUM: 'AVAILABLE', 'MAINTENANCE', 'IN_USE')

### `marine_trips`
Tracks the actual movement of boats for audit and safety.
*   `id` (UUID, PK)
*   `booking_id` (UUID, FK, Nullable)
*   `vessel_id` (UUID, FK)
*   `captain_id` (UUID, FK -> users.id)
*   `departure_time` (TIMESTAMP)
*   `arrival_time` (TIMESTAMP, Nullable)
*   `start_location` (VARCHAR)
*   `end_location` (VARCHAR)
*   `engine_hours_start` (DECIMAL)
*   `engine_hours_end` (DECIMAL)
*   `fuel_start_liters` (DECIMAL)
*   `fuel_end_liters` (DECIMAL)
*   `status` (ENUM: 'SCHEDULED', 'EN_ROUTE', 'COMPLETED', 'INCIDENT')

### `trip_manifest`
List of passengers for safety regulations.
*   `trip_id` (UUID, FK)
*   `passenger_name` (VARCHAR)
*   `emergency_contact` (VARCHAR)
*   `is_checked_in` (BOOLEAN)

---

## 7. Financial Module

### `wallets`
*   `user_id` (UUID, PK)
*   `balance` (DECIMAL(12,2) DEFAULT 0.00)
*   `currency` (VARCHAR DEFAULT 'NGN')
*   `updated_at` (TIMESTAMP)

### `transactions`
Immutable ledger of all money movement.
*   `id` (UUID, PK)
*   `wallet_id` (UUID, FK)
*   `reference` (VARCHAR, Unique) - *Paystack/Flutterwave Ref.*
*   `amount` (DECIMAL)
*   `type` (ENUM: 'DEPOSIT', 'PAYMENT', 'REFUND', 'WITHDRAWAL')
*   `channel` (ENUM: 'PAYSTACK', 'FLUTTERWAVE', 'CASH', 'POS')
*   `status` (ENUM: 'PENDING', 'SUCCESS', 'FAILED')
*   `metadata` (JSONB) - *Stores gateway response.*
*   `created_at` (TIMESTAMP)

---

## 8. Indexing Recommendations

1.  **Users**: Index on `phone` for fast login lookups.
2.  **Bookings**: Composite Index on `(staff_id, start_time, end_time)` to quickly check for double-booking conflicts.
3.  **Orders**: Index on `user_id` for history lookups; Index on `(branch_id, status)` for the Admin Dashboard live view.
4.  **Marine Trips**: Index on `vessel_id` and `departure_time`.
5.  **Transactions**: Index on `reference` for webhook idempotency checks.

---

## 9. Relationships Summary

*   **Users** 1:1 **StaffProfiles**
*   **Branches** 1:N **Orders**
*   **Users** 1:N **Orders**
*   **Orders** 1:N **OrderItems**
*   **Users** 1:N **Bookings**
*   **CatalogItems** 1:N **OrderItems**
*   **Vessels** 1:N **MarineTrips**
