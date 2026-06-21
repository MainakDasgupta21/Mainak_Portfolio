# 12 — Development Guide

[← Testing](./11-testing.md) · [Docs index](./README.md) · Next: [Maintenance Guide →](./13-maintenance-guide.md)

---

Everything you need to clone, configure, run, debug, and contribute to all three apps locally — assuming **no prior knowledge** of the project. If a term is unfamiliar, check the [Glossary](./14-glossary.md).

## Table of contents

- [12.1 Prerequisites](#121-prerequisites)
- [12.2 Repository layout](#122-repository-layout)
- [12.3 First-time setup (step by step)](#123-first-time-setup-step-by-step)
- [12.4 Environment variables](#124-environment-variables)
- [12.5 Seeding the database](#125-seeding-the-database)
- [12.6 Running everything locally](#126-running-everything-locally)
- [12.7 Debugging workflows](#127-debugging-workflows)
- [12.8 Common dev tasks](#128-common-dev-tasks)
- [12.9 Code style & conventions](#129-code-style--conventions)
- [12.10 Contribution guidelines](#1210-contribution-guidelines)

---

## 12.1 Prerequisites

| Tool | Version | Why |
|------|---------|-----|
| **Node.js** | 18+ (20 LTS recommended) | runtime for all three apps; native `fetch`, ESM |
| **npm** | 9+ (ships with Node) | dependency management (each app has its own lockfile) |
| **Git** | any recent | clone & version control |
| **A MongoDB** | Atlas cluster *or* local `mongod` | data store; the code appends `/portfolio` to your URI |
| **Cloudinary account** | free tier | image/video/pdf uploads (admin Media + project images) |
| **Resend account** | free tier (optional) | contact‑form email notifications; skipped if unset |

You do **not** need Docker, a global CLI, or TypeScript tooling. Everything runs with `node` + `npm`.

> **Windows/PowerShell note:** `&&` chaining may not work in older PowerShell. Run commands one per line, or use `;`, or use Git Bash. Examples below are shown one command per line for safety.

---

## 12.2 Repository layout

```text
portfolio-website/
├── backend/      # Express + Mongoose REST API (the only server)
├── frontend/     # Public React + Vite SPA (visitors)
├── admin/        # Private React + Vite SPA (the owner / CMS)
├── docs/         # ← you are here
├── portfolio-data.json   # canonical content snapshot (also see backend/seed-data/resume.json)
└── README.md
```

Each app is **self‑contained**: its own `package.json`, `node_modules`, `.env`, and build. There is no root‑level package manager or workspace. See [Architecture §2.3](./02-architecture.md) for *why* it's three apps.

---

## 12.3 First-time setup (step by step)

```mermaid
flowchart TD
    A["git clone"] --> B["Provision Atlas + Cloudinary (+ Resend)"]
    B --> C["backend: npm i, create .env"]
    C --> D["npm run seed (populate DB)"]
    D --> E["frontend: npm i, create .env"]
    E --> F["admin: npm i, create .env"]
    F --> G["Run all three (3 terminals)"]
```

### 1. Clone

```bash
git clone <repo-url>
cd portfolio-website
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env` from the template and fill it in (see [§12.4](#124-environment-variables)):

```bash
cp .env.example .env   # then edit .env
```

### 3. Frontend

```bash
cd ../frontend
npm install
cp .env.example .env    # default points at http://localhost:4000
```

### 4. Admin

```bash
cd ../admin
npm install
cp .env.example .env    # default points at http://localhost:4000
```

---

## 12.4 Environment variables

Full reference (incl. production) is in [DevOps §10.6](./10-devops-infrastructure.md#106-environment-configuration). Quick local version:

### `backend/.env`

```bash
PORT=4000
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net   # NO trailing slash; code appends /portfolio
JWT_SECRET=any_long_random_string_for_local
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose_a_password
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_SECRET_KEY=your_secret
# Optional — contact email; if RESEND_API_KEY is omitted, emails are skipped (not an error)
RESEND_API_KEY=
CONTACT_NOTIFY_TO=
CONTACT_NOTIFY_FROM=
```

> **Critical gotcha:** `MONGODB_URI` must **not** end with `/`. The connection code builds the DB name itself: `mongoose.connect(`${MONGODB_URI}/portfolio`)`. A trailing slash yields `//portfolio` and a bad connection.

### `frontend/.env` and `admin/.env`

```bash
VITE_BACKEND_URL=http://localhost:4000
```

> `VITE_*` vars are inlined at **build/dev‑server start**. If you change this value, restart the Vite dev server (or rebuild) for it to take effect.

---

## 12.5 Seeding the database

The backend ships canonical content in `backend/seed-data/resume.json` and a seeder that loads it:

```bash
cd backend
npm run seed
```

What it does (see [Database §5.5](./05-database.md#55-migration-strategy)):
- Connects using `MONGODB_URI`.
- **Wipes and repopulates** the content collections (`profiles`, `projects`, `experiences`, `skills`, `achievements`, `educations`) from the JSON.
- **Leaves `contacts` and `media` untouched** (those are runtime data, not seed content).
- Safe to run repeatedly (idempotent for content).

Without seeding, the public site loads but shows empty sections.

---

## 12.6 Running everything locally

You need **three terminals** (one per app). The backend must be up first because both SPAs call it.

```mermaid
flowchart LR
    T1["Terminal 1: backend<br/>npm run server → :4000"]
    T2["Terminal 2: frontend<br/>npm run dev → :5173"]
    T3["Terminal 3: admin<br/>npm run dev → :5174"]
    T2 --> T1
    T3 --> T1
```

### Terminal 1 — backend (auto‑reload via nodemon)

```bash
cd backend
npm run server
# → "Server started on PORT : 4000" and (if DB reachable) "DB Connected"
```

> `npm run server` uses **nodemon** (auto‑restart on file save). `npm start` runs once with plain `node`.

### Terminal 2 — frontend

```bash
cd frontend
npm run dev
# → Vite serves http://localhost:5173
```

### Terminal 3 — admin

```bash
cd admin
npm run dev
# → Vite serves http://localhost:5174 (5173 is taken, Vite picks the next port)
```

Open the public site at `http://localhost:5173`, the admin at `http://localhost:5174`, and log into the admin with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set.

### Health check

```bash
curl http://localhost:4000/            # → "API Working"
curl http://localhost:4000/api/project/list   # → {"success":true,"projects":[...]}
```

### Script reference

| App | Command | What it does |
|-----|---------|--------------|
| backend | `npm run server` | dev server with nodemon (auto‑reload) |
| backend | `npm start` | plain `node server.js` |
| backend | `npm run seed` | seed content collections from `seed-data/resume.json` |
| backend | `npm run cleanup:testimonials` | one‑off migration (removes legacy testimonials) |
| frontend | `npm run dev` | Vite dev server |
| frontend | `npm run build` | production build → `dist/` |
| frontend | `npm run preview` | serve the built `dist/` locally |
| frontend | `npm run lint` | ESLint (flat config disabled via `cross-env`) |
| frontend | `npm run optimize:media` | run the `ffmpeg`-based media optimizer |
| admin | `npm run dev` / `build` / `preview` / `lint` | same as frontend (no media script) |

---

## 12.7 Debugging workflows

### Backend

- **Logs:** the controllers/config use `console.*`. Watch Terminal 1.
- **DB connectivity:** look for `DB Connected`. If you see `MongoDB initial connection failed` or `Running without database connection`, the server **stays up** by design (see `server.js` / `config/mongodb.js`) but DB routes return errors. Usual cause: IP not allow‑listed in Atlas, wrong URI, or trailing slash.
- **Node inspector:** `node --inspect server.js` then attach VS Code / Chrome DevTools. (Replace `npm run server` temporarily.)
- **Inspect requests:** use `curl`/Postman against `http://localhost:4000/api/...`. Remember the [response envelope](./06-api-reference.md#response-envelope) and the custom **`token`** header for admin routes.

### Frontend / Admin

- **React errors & network:** browser DevTools console + Network tab. Confirm requests hit `VITE_BACKEND_URL`.
- **CORS:** backend uses wide‑open `cors()`, so CORS errors usually mean the **backend is down** or the URL is wrong.
- **Auth (admin):** the JWT lives in `localStorage` under the app's token key and is sent as the `token` header. Clear `localStorage` to force re‑login; an auth failure means the token is missing or invalid (e.g. `JWT_SECRET`/credentials changed — note tokens have **no expiry**).
- **HMR:** Vite hot‑reloads on save. If state gets weird, hard‑refresh.

### Common failure → cause map

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| SPA loads but sections empty | DB not seeded / backend down | `npm run seed`; start backend |
| "Network Error" in browser | wrong `VITE_BACKEND_URL` / backend down | fix `.env`, restart Vite |
| Admin login fails with correct creds | `ADMIN_EMAIL/PASSWORD` mismatch or `JWT_SECRET` unset | check backend `.env` |
| Uploads fail | Cloudinary creds missing/wrong | set `CLOUDINARY_*` |
| No contact email | `RESEND_API_KEY` unset (by design) or unverified sender | set key + verified domain |
| `//portfolio` connection error | trailing slash on `MONGODB_URI` | remove it |

---

## 12.8 Common dev tasks

### Add a new content field to a resource (e.g. add `repoUrl` to projects)

```mermaid
flowchart LR
    M["Model: add field to projectModel"] --> C["Controller: accept/parse it in add/update"]
    C --> A["Admin: add input to Add/Edit form"]
    A --> F["Frontend: render it in the project card"]
    F --> D["Docs: update 05-database & 06-api-reference"]
```

1. **Model** (`backend/models/projectModel.js`): add the field to the schema.
2. **Controller** (`backend/controllers/projectController.js`): read it from `req.body` (and parse if it's a list) in `add`/`update`.
3. **Admin form** (`admin/src/pages/AddProject.jsx` and the edit path): add the input and include it in the submitted payload.
4. **Frontend** (`frontend/src/components/Projects.jsx` or card component): render it.
5. **Docs:** update the schema in [05-database](./05-database.md) and the endpoint in [06-api-reference](./06-api-reference.md).

### Add a brand‑new resource (full CRUD)

Mirror an existing one end‑to‑end: `model` → `controller` → `route` (wire `adminAuth` on writes) → register in `server.js` → admin `Add*`/`List*` pages + sidebar entry → frontend section + context wiring. See [Backend §4](./04-backend.md) and [Admin §8](./08-admin-panel.md) for the patterns.

### Re‑seed after content changes

Edit `backend/seed-data/resume.json`, then `npm run seed` (remember it wipes content collections).

---

## 12.9 Code style & conventions

- **Language:** modern **ESM** JavaScript (`"type": "module"`) everywhere; no TypeScript.
- **Linting:** ESLint on the two SPAs (`npm run lint`, `--max-warnings 0`). Backend is unlinted today.
- **Response contract:** every backend handler returns the `{ success, ... }` [envelope](./06-api-reference.md#response-envelope). Keep it.
- **Error handling:** localized `try/catch` per controller method, log + return `{ success:false, message }`. No global error middleware (see [Backend §4.9](./04-backend.md)).
- **Auth header:** the custom **`token`** header (not `Authorization: Bearer`). Keep client and middleware in sync.
- **Naming:** models `xModel.js`, controllers `xController.js`, routes `xRoute.js`; admin pages `AddX.jsx` / `ListX.jsx`.
- **Styling:** Tailwind + HSL CSS variables. Frontend (dark theme) and admin (light theme) have **separate** token sets — don't cross‑import. See [Frontend §7.6](./07-frontend.md) and [Admin §8.7](./08-admin-panel.md).
- **Comments:** explain *why*, not *what*.

---

## 12.10 Contribution guidelines

There is no formal `CONTRIBUTING.md` in the repo; this is the recommended flow.

```mermaid
flowchart LR
    A["Branch from main"] --> B["Make focused change"]
    B --> C["Lint (FE/Admin) + manual test"]
    C --> D["Update docs/ if behavior/contract changed"]
    D --> E["PR → Vercel preview"]
    E --> F["Review → merge → auto-deploy"]
```

1. **Branch** off `main` with a descriptive name (`feat/…`, `fix/…`).
2. Keep changes **scoped to one app/concern** where possible (the three apps are independent).
3. Before pushing: run `npm run lint` in any SPA you touched and run the relevant [manual test plan](./11-testing.md#113-manual-test-plans-todays-qa).
4. **Update the docs** when you change a schema, an endpoint contract, env vars, or a workflow. Treat `docs/` as part of the change.
5. Open a PR. Vercel will create **preview deployments**; verify them.
6. Don't commit secrets. `.env` files are git‑ignored; only update `.env.example` templates.

---

Next: [13 — Maintenance Guide →](./13-maintenance-guide.md)
