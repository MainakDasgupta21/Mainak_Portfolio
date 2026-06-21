# 10 — DevOps & Infrastructure

[← Security](./09-security.md) · [Docs index](./README.md) · Next: [Testing →](./11-testing.md)

---

How the system is configured, built, deployed, and operated. The reference deployment target is **Vercel** (three projects, one per app) with **MongoDB Atlas**, **Cloudinary**, and **Resend** as managed dependencies. This doc also covers containerization (for self‑hosting), monitoring/logging, and disaster recovery.

## Table of contents

- [10.1 Deployment architecture](#101-deployment-architecture)
- [10.2 Infrastructure components](#102-infrastructure-components)
- [10.3 Backend deployment (Vercel)](#103-backend-deployment-vercel)
- [10.4 Frontend deployment (Vercel)](#104-frontend-deployment-vercel)
- [10.5 Admin deployment (Vercel)](#105-admin-deployment-vercel)
- [10.6 Environment configuration](#106-environment-configuration)
- [10.7 Monitoring & logging](#107-monitoring--logging)
- [10.8 CI/CD pipeline](#108-cicd-pipeline)
- [10.9 Containerization (optional self-hosting)](#109-containerization-optional-self-hosting)
- [10.10 Disaster recovery](#1010-disaster-recovery)

---

## 10.1 Deployment architecture

```mermaid
flowchart TB
    subgraph Vercel["Vercel (3 independent projects, same git repo)"]
        FEp["Frontend project<br/>root: frontend/<br/>framework: Vite (static)"]
        ADp["Admin project<br/>root: admin/<br/>framework: Vite (static)"]
        BEp["Backend project<br/>root: backend/<br/>builder: @vercel/node (serverless)"]
    end

    subgraph SaaS["Managed services"]
        DB[("MongoDB Atlas")]
        CL["Cloudinary"]
        RS["Resend"]
    end

    User([Visitor]) --> FEp
    Owner([Owner]) --> ADp
    FEp -- "VITE_BACKEND_URL" --> BEp
    ADp -- "VITE_BACKEND_URL" --> BEp
    BEp --> DB
    BEp --> CL
    BEp --> RS
```

### Topology summary

| Component | Hosting | Build artifact | Wired to | Public? |
|-----------|---------|----------------|----------|---------|
| Frontend | Vercel static | `dist/` (SPA) | backend via `VITE_BACKEND_URL` | yes |
| Admin | Vercel static | `dist/` (SPA) | backend via `VITE_BACKEND_URL` | yes (should be `noindex`/protected) |
| Backend | Vercel serverless | `server.js` (function) | Atlas, Cloudinary, Resend | yes (API) |
| Database | MongoDB Atlas | — | backend | no (allow‑listed) |
| Assets/CDN | Cloudinary | — | backend (write), browsers (read) | yes (asset URLs) |
| Email | Resend | — | backend | n/a |

The three Vercel projects can all point at the **same repository**, each with a different **Root Directory** (`backend/`, `frontend/`, `admin/`).

---

## 10.2 Infrastructure components

| Component | Role | Notes |
|-----------|------|-------|
| **Vercel** | Hosting + CDN + serverless functions | Static SPAs + the Node API as a function. |
| **MongoDB Atlas** | Managed MongoDB | DB name `portfolio`; IP allow‑list (or `0.0.0.0/0` for serverless) required. |
| **Cloudinary** | Media storage + delivery CDN | image/video/raw; transformations available. |
| **Resend** | Transactional email | contact notifications; needs a verified domain or the `onboarding@resend.dev` sender. |
| **GitHub (or any git host)** | Source + deploy trigger | Vercel auto‑deploys on push. |

---

## 10.3 Backend deployment (Vercel)

### Configuration

The backend ships a `vercel.json` that routes everything to the exported Express app via `@vercel/node`:

```1:20:backend/vercel.json
{
    "version": 2,
    "builds": [
        { "src": "server.js", "use": "@vercel/node", "config": { "includeFiles": ["dist/**"] } }
    ],
    "routes": [
        { "src": "/(.*)", "dest": "server.js" }
    ]
}
```

`server.js` is **already serverless‑aware**: it only calls `app.listen()` when `process.env.VERCEL` is unset, and otherwise exports the app. (See [Backend §4.2](./04-backend.md#42-entry-point--serverjs).)

### Steps

```mermaid
flowchart LR
    A["New Vercel project<br/>Root = backend/"] --> B["Framework preset: Other"]
    B --> C["Set env vars (see 10.6)"]
    C --> D["Deploy → function at https://<backend>.vercel.app"]
    D --> E["Verify GET / → 'API Working'"]
```

1. Create a Vercel project with **Root Directory = `backend/`**, framework **Other**.
2. Add all backend environment variables (next section).
3. In **Atlas → Network Access**, allow Vercel egress (serverless IPs are dynamic, so typically allow `0.0.0.0/0` and rely on credentials, or use Atlas's Vercel integration).
4. Deploy. Confirm `GET /` returns `API Working` and a content endpoint returns JSON.

> **Serverless caveats:** cold starts open new DB connections; for heavy traffic, reuse the mongoose connection across warm invocations and watch Atlas connection limits. Memory‑storage uploads are bounded by the function's memory.

---

## 10.4 Frontend deployment (Vercel)

1. New Vercel project, **Root Directory = `frontend/`**, framework **Vite**.
2. Build command `npm run build`, output `dist`.
3. Set `VITE_BACKEND_URL` to the deployed backend URL (no trailing slash). **Redeploy** after changing it (Vite inlines env at build time).
4. `frontend/vercel.json` provides the SPA rewrite so deep links resolve to `index.html`.

```mermaid
flowchart LR
    A["Root = frontend/, preset Vite"] --> B["VITE_BACKEND_URL = https://<backend>"]
    B --> C["npm run build → dist/"]
    C --> D["SPA rewrite serves index.html for all paths"]
```

---

## 10.5 Admin deployment (Vercel)

Identical to the frontend (Root `admin/`, Vite, `VITE_BACKEND_URL`, SPA rewrite), **plus** hardening:

- Add an **`X-Robots-Tag: noindex`** response header (Vercel `headers` config) so search engines don't index the admin.
- Optionally protect the URL (Vercel password protection / IP allow‑list / edge auth) — see [Security §9.6](./09-security.md#96-known-risks--recommendations).

---

## 10.6 Environment configuration

Three `.env` files (one per app). Templates are committed as `.env.example`; real values are git‑ignored. Full security treatment in [Security §9.7](./09-security.md#97-secrets-management).

### Backend `.env`

| Key | Required | Purpose |
|-----|----------|---------|
| `PORT` | no (default 4000) | local Express port |
| `MONGODB_URI` | **yes** | Atlas URI **without** trailing slash (code appends `/portfolio`) |
| `JWT_SECRET` | **yes** | long random string for signing/verifying admin JWT |
| `ADMIN_EMAIL` | **yes** | admin login email |
| `ADMIN_PASSWORD` | **yes** | admin login password |
| `CLOUDINARY_NAME` | **yes** (for uploads) | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | **yes** (for uploads) | Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | **yes** (for uploads) | Cloudinary API secret |
| `RESEND_API_KEY` | optional | enables contact emails (skipped if unset) |
| `CONTACT_NOTIFY_TO` | optional | recipient (default `dasguptamainak02@gmail.com`) |
| `CONTACT_NOTIFY_FROM` | optional | sender (default `Portfolio Contact <onboarding@resend.dev>`) |
| `VERCEL` | set by Vercel | when present, `server.js` skips `listen()` |

```1:19:backend/.env.example
# Express server port (defaults to 4000)
PORT=4000

# MongoDB Atlas connection string WITHOUT a trailing "/".
# The code appends "/portfolio" so the database name is "portfolio".
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net

# Long random string used to sign admin JWTs.
JWT_SECRET=replace_with_a_long_random_string

# Single admin credentials. Plain compare in userController.adminLogin
# (same pattern as Forever).
ADMIN_EMAIL=admin@mainak.dev
ADMIN_PASSWORD=change_me_strong

# Cloudinary credentials for image / video / pdf uploads.
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
```

### Frontend / Admin `.env`

| Key | Required | Purpose |
|-----|----------|---------|
| `VITE_BACKEND_URL` | **yes** | base URL of the backend API, no trailing slash (e.g. `http://localhost:4000`) |

> **Gotcha:** `VITE_*` values are baked into the build. Changing the backend URL requires a **rebuild/redeploy** of the SPA, not just an env edit.

### Environment matrix

```mermaid
flowchart TD
    subgraph Local
        L1["backend :4000"]
        L2["frontend :5173 → VITE_BACKEND_URL=http://localhost:4000"]
        L3["admin :5174 → VITE_BACKEND_URL=http://localhost:4000"]
    end
    subgraph Production
        P1["backend.vercel.app"]
        P2["frontend.vercel.app → VITE_BACKEND_URL=https://backend.vercel.app"]
        P3["admin.vercel.app → VITE_BACKEND_URL=https://backend.vercel.app"]
    end
```

There is no separate "staging" wired in‑repo; Vercel **Preview Deployments** (per branch/PR) serve that role. Point a preview's `VITE_BACKEND_URL` at a preview/staging backend if you want isolation.

---

## 10.7 Monitoring & logging

### Current state

- **Logging:** plain `console.log` / `console.warn` / `console.error` in controllers, config, and scripts. On Vercel these appear in the function's **runtime logs**.
- **DB connection events** are logged (`DB Connected`, connection errors) via the listeners in `config/mongodb.js`.
- **Health check:** `GET /` returns `API Working` — usable by an uptime monitor.
- **No** metrics, tracing, structured logs, log levels, correlation IDs, or alerting are built in.

### Recommended observability additions

```mermaid
flowchart LR
    App["Express app"] --> Logs["Structured logs (pino/winston)"]
    App --> Health["/health endpoint"]
    Health --> Uptime["Uptime monitor (UptimeRobot/BetterStack)"]
    App --> Errors["Error tracking (Sentry)"]
    Vercel["Vercel Analytics"] --> Web["Web vitals on FE/Admin"]
```

| Need | Suggestion |
|------|------------|
| Structured logs + levels | `pino` or `winston`; log request id + outcome |
| Error aggregation | Sentry (backend + SPAs) |
| Uptime/alerting | UptimeRobot/BetterStack pinging `GET /` |
| Web performance | Vercel Analytics / Web Vitals on the frontend |
| DB monitoring | Atlas built‑in metrics + alerts (connections, ops, storage) |

---

## 10.8 CI/CD pipeline

### As deployed (Vercel git integration)

```mermaid
flowchart LR
    Dev["git push"] --> GH["Git host"]
    GH --> Vercel["Vercel detects change"]
    Vercel --> Build{"Which app(s)?"}
    Build --> BEbuild["Backend: @vercel/node build"]
    Build --> FEbuild["Frontend: vite build"]
    Build --> ADbuild["Admin: vite build"]
    BEbuild & FEbuild & ADbuild --> Preview["Preview deploy (PR/branch)"]
    Preview --> Prod["Promote to Production (main)"]
```

- Each Vercel project auto‑builds on push to its configured branch and creates **preview deployments** for PRs.
- There is **no repo‑level CI workflow file** (no GitHub Actions in this repo). Linting/tests are run manually today.

### Recommended CI (add a workflow)

A minimal GitHub Actions pipeline that runs before deploy:

```yaml
# .github/workflows/ci.yml (recommended, not yet present)
name: CI
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [frontend, admin]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm, cache-dependency-path: ${{ matrix.app }}/package-lock.json }
      - run: npm ci
        working-directory: ${{ matrix.app }}
      - run: npm run lint
        working-directory: ${{ matrix.app }}
      - run: npm run build
        working-directory: ${{ matrix.app }}
```

(Extend with a backend test job once tests exist — see [Testing](./11-testing.md).)

---

## 10.9 Containerization (optional self-hosting)

The project is **not containerized in‑repo**, but it self‑hosts cleanly. The backend is the only long‑running service; the SPAs are static. Example Dockerization (illustrative, **not in the repo**):

```dockerfile
# backend/Dockerfile (example)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV PORT=4000
EXPOSE 4000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml (example)
services:
  backend:
    build: ./backend
    ports: ["4000:4000"]
    env_file: ./backend/.env       # MONGODB_URI, JWT_SECRET, ADMIN_*, CLOUDINARY_*, RESEND_*
  # Build SPAs separately and serve dist/ via any static host or nginx.
```

```mermaid
flowchart LR
    subgraph Host["Self-hosted"]
        BE["backend container :4000"]
        NGINX["nginx serving frontend/dist + admin/dist"]
    end
    NGINX --> BE
    BE --> Atlas[(MongoDB Atlas)]
    BE --> CL[Cloudinary]
```

Notes for self‑hosting:
- Build each SPA (`npm run build`) and serve its `dist/` with any static server (nginx, Caddy, S3+CloudFront). Configure the SPA fallback to `index.html`.
- Point each SPA's `VITE_BACKEND_URL` at the backend's public URL at build time.
- Terminate TLS at nginx/Caddy/load balancer.

---

## 10.10 Disaster recovery

```mermaid
flowchart TD
    subgraph Risks
        R1["DB data loss/corruption"]
        R2["Cloudinary asset loss"]
        R3["Lost env/secrets"]
        R4["Bad deploy"]
    end
    R1 --> A1["Atlas automated backups → restore snapshot;<br/>or re-run seed.js from resume.json (content only)"]
    R2 --> A2["Re-upload assets via Media page;<br/>keep originals in version control / cloud backup"]
    R3 --> A3["Store secrets in a password manager;<br/>rotate via Vercel env settings"]
    R4 --> A4["Vercel instant rollback to previous deployment"]
```

### RPO/RTO posture (typical for this stack)

| Asset | Backup mechanism | Recovery |
|-------|------------------|----------|
| Content collections | `seed-data/resume.json` (content), Atlas snapshots (live) | re‑seed (`npm run seed`) or restore snapshot |
| `contacts` / `media` rows | Atlas snapshots only (not seeded) | restore snapshot |
| Cloudinary assets | none in‑repo | keep local/cloud copies of originals; re‑upload |
| Secrets | none in‑repo (git‑ignored) | password manager; re‑enter in Vercel |
| Code | git history | redeploy / rollback |

### Recommendations

- Enable and verify **Atlas backups** (schedule + retention) — this is the primary durable backup for runtime data (`contacts`, `media`).
- Keep **canonical content** (`seed-data/resume.json`) and **media originals** under version control or a backup bucket.
- Document the **secret values** in a team password manager so a new environment can be stood up quickly.
- Use **Vercel rollback** for bad deploys (one click to a previous build).

---

Next: [11 — Testing →](./11-testing.md)
