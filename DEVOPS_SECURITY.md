# Evening Sun Hub - DevOps, Security & Scaling Architecture

## 1. Hosting & Infrastructure Strategy

We employ a **Three-Phase Evolution Strategy** to balance immediate cost efficiency with future scalability.

### Phase 1: MVP & Pilot (Current)
*   **Provider**: DigitalOcean or AWS Lightsail.
*   **Architecture**: Single Virtual Private Server (VPS) running Docker Compose.
    *   Container A: Frontend (Nginx + React).
    *   Container B: Backend API (NestJS).
    *   Container C: Redis (Cache/Queue).
*   **Database**: Managed PostgreSQL (DigitalOcean Managed DB) to ensure automated backups and high availability without manual admin.
*   **Cost Estimate**: ~$50/month.

### Phase 2: Growth (10k+ Users)
*   **Provider**: AWS (Amazon Web Services).
*   **Architecture**: Containerized Orchestration (ECS Fargate).
    *   Decouples the application from underlying servers.
    *   **Auto-scaling**: Automatically adds tasks during Friday night surges (Club events) and scales down on Tuesday mornings.
*   **Load Balancer**: Application Load Balancer (ALB) to distribute traffic.
*   **Assets**: AWS S3 + CloudFront CDN for serving food images and marine logs globally with low latency.

### Phase 3: SaaS / Enterprise (Franchise Model)
*   **Architecture**: Kubernetes (EKS).
*   **Strategy**: Namespace isolation for different Franchise tenants.
*   **Database**: Horizontal Sharding by `tenant_id`.

---

## 2. CI/CD Pipeline (GitHub Actions)

We implement a **GitOps** workflow. Code is infrastructure.

1.  **Trigger**: Push to `main` branch.
2.  **Test Stage**:
    *   Run Unit Tests (Jest).
    *   Run Linting (ESLint).
    *   **Security Scan**: Run `npm audit` and SonarQube static analysis.
3.  **Build Stage**:
    *   Build Docker Image.
    *   Tag with Commit SHA (`evening-sun-app:sha-123`).
4.  **Deploy Stage**:
    *   **Staging**: Auto-deploy to `staging.eveningsunhub.com`.
    *   **Production**: Requires Manual Approval in GitHub Environments. Updates AWS ECS Service.

---

## 3. Environment Separation

| Env | URL | Database | Purpose |
| :--- | :--- | :--- | :--- |
| **Dev** | `localhost:3000` | Local Docker | Feature development & hot-reload. |
| **Staging** | `staging.eveningsunhub.com` | RDS (Staging Instance) | **Integration Testing**. Payments in "Test Mode". |
| **Prod** | `app.eveningsunhub.com` | RDS (Production Cluster) | Live Data. Payments in "Live Mode". **Write-Protected** access for devs. |

---

## 4. Security Architecture & Checklist

### 4.1 Network Security
*   [x] **VPC Isolation**: Database resides in a *Private Subnet* (No public IP). Only the API container can talk to it.
*   [x] **WAF (Web Application Firewall)**: Cloudflare configured to block Nigerian ISP IP ranges showing bot behavior (DDoS protection).
*   [x] **SSL/TLS**: Forced HTTPS via Let's Encrypt / AWS ACM. TLS 1.3 enforced.

### 4.2 Data Protection
*   **Encryption at Rest**: AES-256 encryption for the PostgreSQL volume and S3 Buckets.
*   **Encryption in Transit**: All API calls over HTTPS.
*   **PII Handling**: Phone numbers and customer names are redacted in application logs.
*   **Secrets Management**: **NO** `.env` files in code. Secrets injected via AWS Secrets Manager at runtime.

### 4.3 Role-Based Access Control (RBAC)
Implemented at the Gateway level (Nginx/Kong) and App level (Guards).

*   **Super Admin**: Can delete branches, view system revenue. (MFA Enforced).
*   **Business Manager**: Can view *their* branch revenue, manage *their* staff.
*   **Staff**: Can view assigned tasks. No access to financial aggregates.

---

## 5. Backup & Disaster Recovery (DR)

### 5.1 Database
*   **Frequency**: Automated daily snapshots + Transaction logs (WAL) every 5 minutes.
*   **Retention**: 30 Days.
*   **Point-in-Time Recovery**: Ability to restore DB to "10 minutes ago" in case of accidental data corruption.

### 5.2 Marine Logs (Compliance)
*   **Strategy**: S3 Object Lock (WORM - Write Once Read Many).
*   **Reasoning**: Prevents tampering with boat safety logs or manifests in case of legal investigations.

---

## 6. SaaS Readiness Roadmap

To transition from a Single-Business App to a Platform for many businesses:

1.  **Schema Migration**: Ensure every table has a `tenant_id` column.
2.  **Subdomain Routing**: Configure Nginx to route `hotel-x.eveningsunhub.com` to the specific branding config of Hotel X.
3.  **Feature Flags**: Use LaunchDarkly to enable "Marine Module" only for tenants who pay for the premium tier.
