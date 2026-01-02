# Evening Sun Hub - System Architecture Blueprint

## 1. High-Level Architecture Overview

The Evening Sun Hub is designed as a **Modular Monolith** with a path to Microservices. This approach allows for rapid development and shared resources (like Auth and Notifications) initially, while allowing specific modules (like Marine Logistics or High-Volume Food Ordering) to be split into separate services as the application scales to a SaaS model.

### 1.1 System Context Diagram (Text Description)

1.  **Clients**:
    *   **Customer Mobile App**: (React Native / PWA) - iOS & Android.
    *   **Staff App**: (PWA/Tablet) - Optimized for quick status updates (Kitchen display, Stylist schedule).
    *   **Admin Dashboard**: (React Web) - Desktop optimized for complex data grids and reports.
2.  **Load Balancer / CDN**: Cloudflare (for DDoS protection, caching static assets, and SSL termination).
3.  **API Gateway**: Nginx Reverse Proxy. Routes requests to the backend, handles rate limiting, and serves static files.
4.  **Application Server**: Node.js (NestJS Framework).
5.  **Realtime Server**: Socket.io / Redis Pub/Sub for live updates.
6.  **Data Layer**:
    *   **Primary DB**: PostgreSQL (Relational data, Transactions).
    *   **Cache/Queue**: Redis (Session storage, Job queues, Leaderboards).
    *   **Object Storage**: AWS S3 or Cloudinary (Images, Marine logs).

---

## 2. Frontend Architecture (Mobile & Web)

### 2.1 Technology Stack
*   **Framework**: React 19 (Web/PWA).
*   **State Management**: Zustand (Lightweight global state) + React Query (Server state & Caching).
*   **Styling**: Tailwind CSS (Utility-first, low bundle size).
*   **Maps**: Google Maps API or Mapbox (Critical for Marine/Logistics).

### 2.2 Key UX Strategies
*   **Offline-First**: Using Service Workers and `redux-persist` or `localForage`. Customers can view menus and their history without internet. Bookings sync when connection is restored.
*   **Optimistic UI**: The app updates the UI immediately (e.g., "Booking Confirmed") while the server processes the request in the background. Critical for perceived speed on slower Nigerian 3G/4G networks.
*   **Image Optimization**: Lazy loading and WebP conversion to save user data costs.

---

## 3. Backend Architecture (API & Services)

### 3.1 Technology Stack
*   **Language**: TypeScript (Node.js).
*   **Framework**: NestJS (Provides strong architectural boundaries).
*   **API Protocol**: REST (Standard ops) + GraphQL (optional for complex aggregation) + WebSockets (Realtime).

### 3.2 Module Breakdown
The backend is divided into distinct domains:

1.  **Auth Module (IAM)**:
    *   JWT-based authentication.
    *   Role-Based Access Control (RBAC): Roles (`SUPER_ADMIN`, `BUSINESS_OWNER`, `STAFF_KITCHEN`, `STAFF_STYLIST`, `CUSTOMER`).
    *   OTP Service (Interfacing with SMS providers like Termii).

2.  **Core Services Module**:
    *   **Eatery Service**: Product Mgmt, Inventory decrementing, Kitchen KDS (Kitchen Display System).
    *   **Booking Service**: Slot management for Salon/Marine. handles concurrency (preventing double booking).
    *   **Event Service**: Table reservations, Ticketing.

3.  **Payment Module (Financial Ledger)**:
    *   Abstracted Payment Interface.
    *   **Adapters**: `PaystackAdapter`, `FlutterwaveAdapter`.
    *   **Webhook Handler**: Securely verifies signatures from payment gateways to confirm transactions.
    *   **Wallet System**: Internal ledger for user deposits/refunds.

4.  **Logistics Module (Marine)**:
    *   GPS Tracking integration.
    *   Trip logging (Fuel consumption, Captain logs).

5.  **Notification Module**:
    *   Job Queue (BullMQ/Redis).
    *   Channels: Push (FCM), Email (SendGrid/AWS SES), SMS (Termii/Twilio), WhatsApp (Meta API).

---

## 4. Database Design Strategy

### 4.1 Schema Overview (PostgreSQL)
*   **Tenancy (SaaS Prep)**: Every table includes a `business_id` or `tenant_id` to allow future splitting of businesses.
*   **Users**: `id, phone, password_hash, push_token, role`.
*   **Bookings**: `id, user_id, service_id, staff_id, start_time, end_time, status, deposit_status`.
*   **Orders**: `id, user_id, items (JSONB), total, status (PENDING/PREPARING/READY)`.
*   **Transactions**: `id, user_id, reference, gateway, amount, currency, status`.

### 4.2 Data Flow & Caching
1.  **Read Heavy**: Menus and Service Lists are cached in Redis (TTL: 1 hour).
2.  **Write Critical**: Payments and Bookings go directly to Postgres with ACID transactions.

---

## 5. Realtime Communication Flow

**Scenario: A Customer orders food.**

1.  **Customer App**: Emits `create_order` event via WebSocket.
2.  **Server**: Validates stock -> Persists to DB -> Publishes `order_created` event to Redis.
3.  **Kitchen Tablet (Staff App)**: Subscribed to `kitchen_orders` channel. Receives event -> Plays sound -> Shows new ticket.
4.  **Staff**: Taps "Start Preparing".
5.  **Server**: Updates DB -> Pushes notification to Customer: "Chef Tunde is preparing your Jollof Rice".

---

## 6. Security & Compliance

*   **Data Privacy**: NDPR (Nigeria Data Protection Regulation) compliance.
*   **Encryption**: TLS 1.3 for transit, AES-256 for sensitive data at rest (though we delegate Payment Card Industry (PCI) compliance to Paystack/Flutterwave).
*   **Rate Limiting**: Throttling requests by IP to prevent abuse.
*   **Input Validation**: Strict Zod/DTO validation to prevent Injection attacks.

---

## 7. Deployment & DevOps

*   **Containerization**: Docker for consistent environments (Dev/Staging/Prod).
*   **CI/CD**: GitHub Actions.
    *   Stage 1: Lint & Test.
    *   Stage 2: Build Docker Image.
    *   Stage 3: Push to Registry (ECR/Docker Hub).
    *   Stage 4: Deploy to Orchestrator (Kubernetes or AWS ECS).
*   **Monitoring**: Prometheus (Metrics) + Grafana (Visuals) + Sentry (Error Tracking).

---

## 8. Summary of External Integrations

| Service Type | Provider Options | Purpose |
| :--- | :--- | :--- |
| **Payments** | Paystack, Flutterwave | Processing Naira cards, USSD, Bank Transfers. |
| **Maps** | Google Maps, Mapbox | Location picking for deliveries and Marine routing. |
| **SMS/OTP** | Termii, Africa's Talking | High deliverability SMS in Nigeria. |
| **Push Notif** | Firebase (FCM) | Mobile push notifications. |
| **AI/LLM** | Google Gemini | Chat concierge and search grounding. |
