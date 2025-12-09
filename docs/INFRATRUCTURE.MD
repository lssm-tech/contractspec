
# INFRASTRUCTURE

This document describes the current production infrastructure for the LSSM / ContractSpec stack, hosted primarily on Scaleway and Vercel.  
Goal: keep this as the source of truth for infra design, then progressively replace "manual setup" with infra-as-code using the Scaleway JS SDK within CI/CD.

---

## 1. High-level overview

**Topology**

- **Frontend**
  - Next.js apps hosted on **Vercel Pro**
  - Custom domains:
    - e.g. `app.equitya.lssm.tech`, `studio.contractspec.lssm.tech`, etc.

- **Backend**
  - Single **Scaleway Instance** (`DEV1-M`, Debian) running:
    - ContractSpec EngineCo API
    - Vertical APIs (Equitya, ArtisanOS, etc.)
    - Background workers (queues)
  - Process management: **systemd** on the VM

- **Core services (managed on Scaleway)**
  - **PostgreSQL**: managed DB (PLAY / DEV tier)
  - **Redis**: managed instance for caching, locks, rate limiting
  - **Object Storage**: S3-compatible buckets
  - **Queues**: SQS-compatible messaging
  - **Generative AI**: Scaleway Generative APIs for OSS models

- **Networking**
  - **VPC + Private Network** for backend, DB, Redis, LB
  - **Public Gateway** for outbound internet from the private network
  - **Load Balancer** for TLS termination + routing to backend
  - **DNS**: Scaleway DNS (domains still registered at OVH)

---

## 2. Environments

Currently:

- **prod**
  - Frontend: Vercel Pro
  - Backend & services: Scaleway (single region, `fr-par`)

Planned:

- **stg** (later)
  - Mirrored but downsized version of prod
  - Same patterns, separate project / resource names

---

## 3. Naming conventions

### 3.1 Instances

Pattern:

```text
<org>-<env>-<role>-<index>
````

Examples:

* `lssm-prod-core-01` (main backend VM: Elysia + workers)
* Future:

  * `lssm-prod-core-02` (second backend node)
  * `lssm-stg-core-01` (staging backend)

Hostnames inside the VM match the instance name:

```bash
hostnamectl set-hostname lssm-prod-core-01
```

### 3.2 Private network & VPC

* VPC: `vpc-lssm-prod`
* Private Network: `pn-lssm-prod-core`

All core services (backend, Postgres, Redis, LB backend NIC) live in this PN.

### 3.3 Buckets, queues, DBs

**Buckets (Object Storage)**

* `lssm-prod-core`
* `equitya-prod-files`
* `artisanos-prod-files`

**Queues**

* `lssm-prod-jobs`
* `equitya-prod-jobs`
* `artisanos-prod-jobs`
* Optional DLQs: `*-dlq`

**Databases**

* `contractspec_engine`
* `equitya`
* `artisanos`

Schema-per-domain inside a single DB is an alternative option; current design leans DB-per-domain for clarity.

---

## 4. Components (Scaleway)

### 4.1 Compute: backend VM

* **Product**: Instances
* **Type**: `DEV1-M` (cost-optimised, enough for initial prod)
* **OS**: Debian 12
* **Storage**: local disk (no block volume; no persistent DB data on this VM)
* **Network**:

  * NIC on `pn-lssm-prod-core`
  * No public IP (traffic only via LB)
  * Security Group: `sg-lssm-prod-backend`

**Responsibilities:**

* Run Bun/Elysia backend on port `3000`
* Expose:

  * `/healthz` for LB health checks
  * REST / GraphQL endpoints
  * WebSockets on `/ws` (via HTTP upgrade)
* Run queue workers (same codebase)

### 4.2 PostgreSQL (managed)

* **Product**: Managed PostgreSQL
* **Tier**: small PLAY/DEV instance (e.g. `PICO` / `DEV-S`)
* **Network**:

  * Attached to `pn-lssm-prod-core`
  * No public endpoint
  * Security Group: `sg-lssm-prod-db`

    * Allows inbound `5432` only from backend SG / backend IPs

**Usage:**

* One DB per domain:

  * `contractspec_engine`, `equitya`, `artisanos`
* Connection strings use **internal** IP/hostname

### 4.3 Redis (managed)

* **Product**: Managed Redis
* **Tier**: smallest viable (e.g. 2 vCPU / 2 GB)
* **Network**:

  * Attached to `pn-lssm-prod-core`
  * No public endpoint
  * Security Group: `sg-lssm-prod-redis`

    * Allows inbound `6379` only from backend SG / backend IPs

**Usage:**

* Cache
* Queue/job locks
* Rate limiting

### 4.4 Object Storage (S3-compatible)

* **Product**: Object Storage (multi-AZ, standard)
* Buckets:

  * `lssm-prod-core`
  * `equitya-prod-files`
  * `artisanos-prod-files`
* Access via standard S3 SDK:

  * Endpoint: `https://s3.fr-par.scw.cloud`
  * `forcePathStyle = true`
* Access keys with restricted permissions per project/bucket.

### 4.5 Queues (SQS-compatible)

* **Product**: Messaging & Queues (SQS-compatible)
* One queue per domain / job type:

  * `lssm-prod-jobs`, `equitya-prod-jobs`, `artisanos-prod-jobs`, etc.
* Access via SQS SDK:

  * Custom endpoint for Scaleway SQS
* Workers run on the backend VM and consume these queues.

### 4.6 Load Balancer

* **Product**: Public Load Balancer (LB-GP-S or equivalent)

* **Frontend**

  * Ports: `80` (HTTP), `443` (HTTPS)
  * HTTP → redirect to HTTPS
  * HTTPS: TLS termination using certificates for:

    * `api.lssm.tech`
    * `api.equitya.lssm.tech`
    * `api.artisanos.app`
    * etc.

* **Backend**

  * Protocol: `HTTP`
  * Target port: `3000` on backend private IP
  * Health check:

    * Protocol: HTTP
    * Path: `/healthz`
    * Interval/thresholds: standard (e.g. 10–15s, 2–3 failures)

* **Sticky session**

  * Enabled (cookie-based if available)
  * Rationale: WebSockets + future session affinity

* **Proxy protocol**

  * Disabled
  * Client IP provided via standard `X-Forwarded-For` header

### 4.7 Public Gateway & Private Network

* **Private Network**: `pn-lssm-prod-core`

  * Backend VM, Postgres, Redis, LB backend interface are attached here.
  * DHCP configured at PN-level.

* **Public Gateway**

  * Attached to `pn-lssm-prod-core`
  * “Advertise default route” enabled:

    * All resources on this PN use the gateway for outbound internet.
  * Purpose:

    * Outbound HTTP(S) for:

      * System updates
      * Package installs
      * Calls to LLM APIs
      * External webhooks, etc.

### 4.8 DNS

* **Registrar**: OVH
* **DNS hosting**: Scaleway Domains & DNS

Flow:

* OVH: set NS records to Scaleway for each domain.
* Scaleway DNS zones:

  * `lssm.tech`
  * `lssm.world`
  * `lssm.community`
  * `lssm.cash`
  * etc.

Example records:

* Frontend (Vercel):

  * `app.equitya.lssm.tech` → CNAME to Vercel target
* Backend (Scaleway LB):

  * `api.lssm.tech` → A / AAAA to LB public IP or LB DNS name
  * `api.equitya.lssm.tech` → same LB, additional hostname

---

## 5. Application layer

### 5.1 Backend runtime

* **Runtime**: Bun
* **Framework**: Elysia
* **Ports**:

  * `3000`: HTTP server (REST + GraphQL + WebSocket)

Mounted services:

* `/healthz`: liveness endpoint (no DB/Redis dependency)
* `/rest/...`: HTTP API
* `/graphql`: GraphQL endpoint
* `/ws`: WebSocket endpoint (HTTP upgrade)

### 5.2 Systemd units

Two core services:

* `lssm-api.service`

  * Runs Bun/Elysia HTTP server
  * Working directory: `/srv/lssm`
  * Reads env from: `/etc/lssm/backend.env`
  * Restart policy: `Restart=always`, `RestartSec=3`

* `lssm-worker.service`

  * Runs queue consumers
  * Same env file
  * Same restart policy

Both are:

```bash
systemctl enable --now lssm-api lssm-worker
```

---

## 6. CI/CD

### 6.1 Frontend (Vercel)

* Deployed via Vercel’s built-in pipeline:

  * Git integration on `main` / specific branches.
  * Environment variables managed via Vercel.

### 6.2 Backend (Scaleway VM)

CI:

* **Tooling**: GitHub Actions (or similar)
* Pipeline steps:

  1. Checkout
  2. Install deps
  3. Run tests / lint
  4. If successful → deploy job

CD (deploy job, via SSH):

1. SSH into `lssm-prod-core-01`
2. `cd /srv/lssm`
3. `git pull`
4. `bun install --production` (or equivalent)
5. Run migrations (e.g. `prisma migrate deploy`)
6. `sudo systemctl restart lssm-api lssm-worker`

Only systemd services restart; no full VM reboot required.

Secrets:

* Use GitHub Actions secrets for:

  * SSH key
  * Hostname
  * User
* App-level secrets live in `/etc/lssm/backend.env` on the VM (out of repo).

---

## 7. LLM & AI routing

### 7.1 Providers

* **Scaleway Generative APIs**

  * Used for:

    * Cheap utility tasks
    * Vertical assistant flows where OSS quality is enough
    * Classification / summarisation / transformation

* **Premium external LLMs**

  * Used for:

    * High-quality codegen
    * Complex financial reasoning in Equitya
    * Non-trivial planning / analysis where quality > cost

### 7.2 Routing pattern (app-level)

Inside backend / ContractSpec engine:

* Define a simple routing config:

```ts
type LlmProvider = "scaleway" | "premium";

type LlmUseCase =
  | "cheap_utility"
  | "vertical_assistant"
  | "spec_codegen"
  | "complex_analysis";
```

Each use-case is mapped to a provider + model. Centralised to allow:

* Cost control
* Model switching
* Logging & observability

---

## 8. Infra-as-code implementation

Infrastructure-as-code is implemented using the Scaleway JavaScript SDK.

**Location**: `packages/tools/scaleway-infra/`

**Documentation**: See [scaleway-infra README](../../packages/tools/scaleway-infra/README.md)

The tool provides:

* CLI commands (`plan`, `apply`, `destroy`, `status`)
* Programmatic library exports
* Multi-environment support (prod, stg)
* CI/CD integration via GitHub Actions

**Resource Management**:

* VPC, Private Networks, Public Gateway, Security Groups
* Instances (with user-data/bootstrap scripts)
* Load Balancers
* Managed PostgreSQL
* Managed Redis
* Object Storage buckets
* Queues (SQS-compatible)
* DNS zones & records

**CI/CD**:

* Infrastructure updates: `.github/workflows/infra-scaleway.yml`
* Service deployment: `.github/workflows/deploy-services.yml`

---

## 9. Open points / TODO

* [ ] Define precise Scaleway resource IDs & tags for all components.
* [ ] Add staging environment (`lssm-stg-*`) with smaller instance types.
* [ ] Add monitoring & alerting (metrics, logs, health).
* [ ] Document backup & restore strategy for Postgres and Object Storage.
* [ ] Add zero-downtime deployment strategy when moving from 1 → 2 backend nodes.