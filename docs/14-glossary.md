# 14 — Glossary

[← Maintenance Guide](./13-maintenance-guide.md) · [Docs index](./README.md)

---

Plain‑language definitions of every concept, library, service, and project‑specific term used across these docs. Assumes no prior knowledge. Terms are grouped by theme; within each group they're alphabetical.

## Table of contents

- [Project-specific terms](#project-specific-terms)
- [Architecture & design](#architecture--design)
- [Backend & API](#backend--api)
- [Database](#database)
- [Frontend & UI](#frontend--ui)
- [Security & auth](#security--auth)
- [DevOps & infrastructure](#devops--infrastructure)
- [Libraries & services](#libraries--services)

---

## Project-specific terms

| Term | Definition |
|------|------------|
| **The three apps** | The repo contains three independent applications: `backend/` (the API), `frontend/` (public site), and `admin/` (the CMS). They share the API but build and deploy separately. See [Architecture](./02-architecture.md). |
| **Public site / Frontend** | The visitor‑facing portfolio SPA in `frontend/`. Read‑only; consumes the API. |
| **Admin / CMS** | The owner‑facing content management SPA in `admin/`. Authenticated; performs writes. |
| **Owner** | The single person who runs the portfolio and logs into the admin. There is exactly one admin account. |
| **Envelope (response envelope)** | The uniform JSON shape every API endpoint returns: `{ success: boolean, ... }` (plus a `message` on errors, or a named data field on success). See [API §6](./06-api-reference.md#response-envelope). |
| **Singleton profile** | The `profiles` collection holds a **single** document representing the owner's bio/contact/about data. Treated as one aggregate, written whole. See [Database §5.2](./05-database.md). |
| **Seeding** | Loading canonical content into the DB from `backend/seed-data/resume.json` via `npm run seed`. Wipes & repopulates content collections (not `contacts`/`media`). |
| **`resume.json`** | The canonical content snapshot (`backend/seed-data/resume.json`) used by the seeder; mirrors the data the public site displays. |
| **Content collections** | The DB collections that hold portfolio content: `profiles`, `projects`, `experiences`, `skills`, `achievements`, `educations`. (Distinct from runtime collections `contacts`, `media`.) |
| **`token` header** | This project sends the admin JWT in a **custom HTTP header literally named `token`**, not the standard `Authorization: Bearer`. Client and `adminAuth` middleware must agree. |
| **Best‑effort email** | The contact form saves the message regardless of whether the notification email succeeds; if `RESEND_API_KEY` is unset, email is **skipped** (not an error). |

---

## Architecture & design

| Term | Definition |
|------|------------|
| **SPA (Single Page Application)** | A web app that loads one HTML page and updates content via JavaScript instead of full page reloads. Both `frontend/` and `admin/` are SPAs. |
| **Client–server** | Architecture where clients (browsers/SPAs) request data from a server (the backend API). |
| **REST** | An API style organizing endpoints around resources (projects, skills…) using HTTP verbs. This API is REST‑ish (see the [HTTP‑method quirk](./06-api-reference.md)). |
| **Layered architecture** | Separating code into layers (routes → controllers → models). Keeps responsibilities isolated. See [System Design §3.4](./03-system-design.md). |
| **Controller** | A backend function holding the business logic for a request (validate input, call the model, return the envelope). |
| **Middleware** | A function that runs **between** the request and the handler — e.g. `adminAuth` (checks the token) or `multer` (parses uploads). |
| **Repository pattern** | Data access abstracted behind a model object (here, Mongoose models) so controllers don't write raw queries. |
| **Adapter / utility module** | A small module that wraps an external concern (e.g. `cloudinaryUpload.js`, `contactMail.js`) so the rest of the code stays clean. |
| **Optimistic UX** | UI that assumes an action will succeed (e.g. shows a success toast) for snappiness, reconciling on response. |
| **HLD / LLD** | High‑Level Design (the big picture, components) vs Low‑Level Design (specific algorithms/flows). See [System Design](./03-system-design.md). |
| **Domain model** | The set of business entities (Project, Skill, Experience…) and their relationships. See [Database §5.3](./05-database.md). |
| **Scroll‑spy** | UI technique where the nav highlights the section currently in view as the user scrolls. Implemented in the frontend header. |
| **Code splitting / lazy loading** | Splitting the JS bundle so parts load on demand, improving initial load. Used in both SPAs via Vite/React. |

---

## Backend & API

| Term | Definition |
|------|------------|
| **Node.js** | The JavaScript runtime the backend runs on (and the tool that builds the SPAs). |
| **Express** | The web framework that defines routes and middleware for the backend API. |
| **ESM (ES Modules)** | The `import`/`export` module system. All three apps use it (`"type": "module"`). |
| **Route** | A URL + method mapping to a controller (e.g. `POST /api/project/add`). Defined in `backend/routes/*.js`. |
| **Endpoint** | A specific callable API URL. Catalogued in [API Reference](./06-api-reference.md). |
| **Resource** | A content type exposed by the API (project, skill, experience, etc.). |
| **Request body / payload** | The JSON (or multipart form) data a client sends; read from `req.body` (files from `req.file`/`req.files`). |
| **List‑field parsing** | Controllers that accept comma/newline‑separated strings and split them into arrays before saving. |
| **Health check** | `GET /` returning `API Working` — a simple "is the server alive?" probe. |
| **CORS (Cross‑Origin Resource Sharing)** | Browser security controlling which sites may call the API. This backend allows all origins (`cors()`). |
| **Serverless function** | Code that runs on demand per request without a long‑lived server. On Vercel the backend runs this way; `server.js` skips `listen()` when `VERCEL` is set. |
| **Cold start** | The first‑request latency when a serverless function spins up (and opens a fresh DB connection). |

---

## Database

| Term | Definition |
|------|------------|
| **MongoDB** | A document database storing JSON‑like records (documents) in collections. |
| **MongoDB Atlas** | MongoDB's managed cloud hosting. The production database. |
| **Mongoose** | The Node library (ODM) that defines schemas and talks to MongoDB. |
| **ODM (Object‑Document Mapper)** | Maps code objects to database documents — Mongoose's job. |
| **Collection** | A group of documents (like a SQL table). E.g. `projects`, `skills`. |
| **Document** | A single record (like a SQL row), stored as BSON/JSON. |
| **Schema** | The shape/rules for documents in a collection, defined via Mongoose. See [Database §5.2](./05-database.md). |
| **`_id`** | The unique primary key MongoDB assigns each document; automatically indexed. |
| **Index** | A structure that speeds up queries. This project relies on the default `_id` index only (see [Database §5.4](./05-database.md)). |
| **Migration** | A controlled change to data/schema, done here via seed/one‑off scripts in `backend/scripts/`. |
| **PII (Personally Identifiable Information)** | Data identifying a person — e.g. contact form name/email. Handled in the `contacts` collection. |

---

## Frontend & UI

| Term | Definition |
|------|------------|
| **React** | The UI library both SPAs are built with (components + state). |
| **Vite** | The dev server and build tool for both SPAs (fast HMR, bundling). |
| **Component** | A reusable UI building block (a function returning JSX). |
| **JSX** | The HTML‑like syntax used inside React components. |
| **Props** | Inputs passed into a component. |
| **State** | Data a component/app holds that can change over time and triggers re‑render. |
| **Context (React Context)** | A way to share state across components without prop‑drilling. The frontend uses `PortfolioContext`. See [Frontend §7.2](./07-frontend.md). |
| **HMR (Hot Module Replacement)** | Vite feature that updates code in the browser without a full reload during dev. |
| **Router (react‑router‑dom)** | Library managing client‑side navigation. The frontend uses it minimally (anchors); the admin uses real routes. |
| **Tailwind CSS** | A utility‑class CSS framework used for styling both SPAs. |
| **HSL token / CSS variable** | A named color/spacing value (e.g. `--ui-bg`) defined in CSS and consumed by Tailwind. Frontend (dark) and admin (light) have separate sets. |
| **Toast** | A small transient notification (via `react-toastify`) for success/error feedback. |
| **Skeleton** | A placeholder UI shown while data loads, preventing layout shift. |
| **LCP (Largest Contentful Paint)** | A web performance metric: time for the largest visible element to render. Optimized on the public site. |
| **Smooth scroll (Lenis)** | A library giving the public site eased, smooth scrolling. |

---

## Security & auth

| Term | Definition |
|------|------------|
| **Authentication (authn)** | Verifying *who* you are (admin login). |
| **Authorization (authz)** | Verifying *what* you may do (admin‑only routes via `adminAuth`). |
| **JWT (JSON Web Token)** | A signed token proving the holder logged in. Issued on admin login, sent back in the `token` header. See [Security §9.2](./09-security.md). |
| **`JWT_SECRET`** | The server‑side secret used to sign/verify JWTs. Changing it invalidates all existing tokens. |
| **bcrypt** | A password‑hashing library (a backend dependency). Currently not used for the login compare (plaintext compare) — a recommended hardening. |
| **Plaintext credential compare** | Login checks the submitted password directly against the env value, without hashing. A known trade‑off. |
| **`localStorage`** | Browser storage where the admin keeps its JWT. Persists across reloads; readable by JS (hence XSS‑sensitive). |
| **XSS (Cross‑Site Scripting)** | An attack injecting malicious scripts into a page. Mitigated by React's escaping and HTML‑escaping in emails. |
| **HTTPS / TLS** | Encrypted transport. Provided by Vercel/Atlas in production. |
| **Trust boundary** | A line where data crosses from less‑trusted to more‑trusted (e.g. browser → API). See [Security §9.1](./09-security.md). |
| **Rate limiting** | Capping how often an endpoint can be called to prevent abuse. Not implemented yet (recommended). |

---

## DevOps & infrastructure

| Term | Definition |
|------|------------|
| **Vercel** | The hosting platform: serves the static SPAs and runs the backend as a serverless function. |
| **Deployment** | A built, live version of an app. Vercel creates one per push. |
| **Preview deployment** | A temporary deploy Vercel creates for a branch/PR, used for review/testing. |
| **Rollback** | Reverting to a previous deployment (one click on Vercel). |
| **CI/CD** | Continuous Integration / Continuous Deployment — automated build/test/deploy. Here, Vercel auto‑deploys; CI tests are recommended. See [DevOps §10.8](./10-devops-infrastructure.md). |
| **Environment variable (env var)** | A configuration value injected at runtime/build (e.g. `MONGODB_URI`, `VITE_BACKEND_URL`). Stored in `.env` locally and Vercel settings in prod. |
| **`VITE_*` variable** | An env var Vite **inlines into the build** — changing it requires a rebuild. Used for `VITE_BACKEND_URL`. |
| **`.env` / `.env.example`** | The actual secrets file (git‑ignored) vs the committed template. |
| **Root Directory** | The Vercel setting selecting which subfolder (`backend/`/`frontend/`/`admin/`) a project builds from. |
| **`vercel.json`** | Per‑app Vercel config (build/route/rewrite rules). |
| **SPA rewrite** | A rule sending all unmatched paths to `index.html` so client‑side routing works on deep links. |
| **Containerization / Docker** | Packaging an app with its runtime into a portable image. Not used in‑repo; example provided for self‑hosting. |
| **Disaster recovery (DR)** | Plans for restoring after data loss/outage (backups, re‑seed, rollback). See [DevOps §10.10](./10-devops-infrastructure.md). |
| **RPO / RTO** | Recovery Point Objective (how much data you can afford to lose) / Recovery Time Objective (how fast you must recover). |

---

## Libraries & services

| Name | Type | Role in this project |
|------|------|----------------------|
| **Express** | backend framework | routing + middleware for the API |
| **Mongoose** | backend library | MongoDB schemas/queries |
| **jsonwebtoken** | backend library | create/verify admin JWTs |
| **bcrypt** | backend library | password hashing (installed; not yet used at login) |
| **validator** | backend library | input validation (e.g. email format) |
| **multer** | backend library | parse file uploads (**memory storage** here) |
| **cloudinary** | backend SDK + service | store/serve images, videos, PDFs via CDN |
| **resend** | backend SDK + service | send contact‑form notification emails |
| **cors** | backend middleware | allow cross‑origin API calls |
| **dotenv** | backend library | load `.env` into `process.env` |
| **React** | frontend/admin library | UI components & state |
| **Vite** | frontend/admin tool | dev server + production build |
| **react‑router‑dom** | frontend/admin library | navigation (anchors on FE, routes on admin) |
| **axios** | frontend/admin library | HTTP client for API calls |
| **framer‑motion** | frontend library | animations on the public site |
| **lenis** | frontend library | smooth scrolling |
| **lucide‑react** | frontend library | icon set |
| **react‑toastify** | frontend/admin library | toast notifications |
| **Tailwind CSS** | frontend/admin tool | utility‑class styling |
| **ffmpeg‑static** | frontend dev tool | media optimization script (`optimize:media`) |
| **ESLint** | frontend/admin dev tool | linting (`npm run lint`) |
| **nodemon** | backend dev tool | auto‑restart the API on file changes |
| **MongoDB Atlas** | service | managed database hosting |
| **Cloudinary** | service | media storage + delivery CDN |
| **Resend** | service | transactional email delivery |
| **Vercel** | service | hosting, CDN, serverless functions, CI/CD |

---

[← Maintenance Guide](./13-maintenance-guide.md) · [Back to docs index](./README.md)
