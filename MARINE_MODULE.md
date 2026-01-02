# Evening Sun Hub - Marine Services Module

## 1. Overview
The Marine Module manages the lifecycle of boat rentals, from customer booking to the captain's operational log. It solves key industry pain points in Nigeria: **Fuel Theft**, **Unreported Trips**, and **Safety Compliance**.

---

## 2. Operational Workflow

### Phase 1: Booking & Assignment
1.  **Customer** selects a Vessel type (e.g., "Speedboat" vs "Yacht").
2.  **Customer** selects Destination/Duration (e.g., "Ilashe Private Beach - Drop off").
3.  **System** calculates price based on `Vessel Rate` + `Fuel Surcharge` (if applicable).
4.  **Admin/System** assigns a `Captain` and generates a `Trip Manifest` (List of passengers).

### Phase 2: Pre-Trip (Captain App)
1.  Captain logs in and sees "Upcoming Trips".
2.  **Safety Checklist**: Must check Life Jackets, Fire Extinguisher, Radio.
3.  **Engine Start**: Logs `Engine Hours` (Hobbs meter) and `Fuel Level` (Liters).
4.  **Photo Evidence**: Uploads photo of the dashboard gauges.

### Phase 3: The Trip
1.  **Start**: System captures GPS Timestamp (`LAT/LONG`) at dock departure.
2.  **En-Route**: Optional distinct tracking pings every 15 mins.
3.  **Arrival**: GPS Timestamp at destination.

### Phase 4: Post-Trip & Sign-off
1.  **Engine Stop**: Logs `Engine Hours` and `Fuel Level`.
2.  **Variance Check**: System calculates fuel consumed. If `Fuel Consumed > Expected`, flag for audit.
3.  **Customer Sign-off**: Customer signs digitally on the Captain's tablet confirming safe arrival.
4.  **Invoice**: Final invoice generated with actual hours used (if hourly rental).

---

## 3. Data Validation Rules

| Field | Rule | Error/Warning |
| :--- | :--- | :--- |
| **Engine Hours** | `End Hours` >= `Start Hours` | "End hours cannot be lower than start." |
| **Fuel Level** | `End Fuel` < `Start Fuel` | "Fuel level increased without Refuel Log." |
| **Timestamps** | `End Time` > `Start Time` | "Invalid trip duration." |
| **Manifest** | `Passenger Count` <= `Vessel Capacity` | "Vessel overloaded. Cannot start trip." |
| **GPS** | `Start Location` must be within 500m of `Dock` | "You are not at the jetty." |

---

## 4. Compliance & Safety Considerations

### 4.1 Digital Manifest (NIWA Compliance)
The National Inland Waterways Authority (NIWA) requires a manifest of all souls on board.
*   **Implementation**: PDF export of `trip_manifest` table containing Name + Emergency Contact.
*   **Storage**: Stored in S3 (Immutable) for 7 years.

### 4.2 Invoice Generation
The system generates a PDF Invoice containing:
*   Trip ID & Date.
*   Vessel Name & Captain.
*   Route (Start/End GPS).
*   Total Time & Cost.
*   **Digital Signature** image of the customer.

### 4.3 Incident Reporting
If `status` is set to `INCIDENT`, the system triggers an immediate SMS to the Operations Manager and activates the "Emergency" UI on the Captain's app (SOS Button).
