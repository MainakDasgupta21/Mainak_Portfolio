# Mainak Dasgupta — Portfolio (Forever Architecture, Mainak Design)

> A full-stack **MERN** rebuild of the original Mainak Dasgupta portfolio site, re-architected on the exact 3-app pattern of the [Forever-website](../Forever-website) reference: a customer-facing **frontend** (React 18 + Vite), a private **admin** panel (React 18 + Vite), and a shared **backend** REST API (Express 4 + Mongoose 8).
>
> The **design** is a 1:1 port of the existing TypeScript portfolio at `src/components/*.tsx` — every section, animation, gradient, glass card, Lenis smooth scroll, hero video and brand monogram has been re-implemented in plain `.jsx`.
> The **architecture** is a 1:1 port of `Forever-website/` — three separate `package.json`s, ESM-only Node, `token` HTTP header for admin auth, Cloudinary uploads via `multer.diskStorage`, no monorepo / no workspaces / no TypeScript.

This document is the **deep reference** for the project. Every folder, every file, and every important contract is explained so it can be used as a long-term reference, exactly like `Forever-website/README.md`.

---

## Table of Contents

1. [What the project does (non-technical overview)](#1-what-the-project-does-non-technical-overview)
2. [Tech stack at a glance](#2-tech-stack-at-a-glance)
3. [High-level architecture](#3-high-level-architecture)
4. [Repository layout](#4-repository-layout)
5. [Backend — file-by-file walkthrough](#5-backend--file-by-file-walkthrough)
6. [Frontend (public portfolio) — file-by-file walkthrough](#6-frontend-public-portfolio--file-by-file-walkthrough)
7. [Admin panel — file-by-file walkthrough](#7-admin-panel--file-by-file-walkthrough)
8. [Complete REST API reference](#8-complete-rest-api-reference)
9. [Data models (MongoDB schemas)](#9-data-models-mongodb-schemas)
10. [End-to-end data flows](#10-end-to-end-data-flows)
11. [Environment variables](#11-environment-variables)
12. [Local installation & development](#12-local-installation--development)
13. [Deployment (Vercel)](#13-deployment-vercel)
14. [Security notes & known issues](#14-security-notes--known-issues)
15. [Suggested improvements](#15-suggested-improvements)
16. [Glossary of concepts used](#16-glossary-of-concepts-used)
17. [Author & license](#17-author--license)

---

## 1. What the project does (non-technical overview)

This project replaces a static, hand-edited portfolio with a small **content-managed portfolio platform**:

- A visitor lands on the public portfolio (`/`), watches the hero video, scrolls through the About, Experience, Projects, Skills, Achievements, Testimonials, and Contact sections — all rendered from data fetched from the backend.
- The owner (Mainak) signs into a separate **admin panel** with a single admin account, and can:
  - edit the singleton **Profile** (name, title, bio, contact info, hero copy, hero media URLs, social links, coursework, section subtitles),
  - CRUD **Projects** (with up to 4 images uploaded to Cloudinary),
  - CRUD **Experience** entries (with an optional logo),
  - CRUD **Skills** (grouped by category),
  - CRUD **Achievements** (icon = `trophy` / `award` / `medal`),
  - CRUD **Testimonials** (with an optional avatar image),
  - CRUD **Education** entries (with `Completed` / `Pursuing` status),
  - upload arbitrary assets (images / videos / PDFs) to Cloudinary via a **Media** page and copy their URLs into the profile editor,
  - read and delete **Contact Messages** submitted via the public form.
- The whole system is split into three deployable apps, exactly like Forever:

| App | Audience | Default port | Type |
|-----|----------|--------------|------|
| `backend/` | both | `4000` | Node + Express REST API |
| `frontend/` | public | `5173` | React + Vite SPA |
| `admin/` | owner only | `5174` | React + Vite SPA |

---

## 2. Tech stack at a glance

### Backend (`backend/package.json`)
- **Express 4** — HTTP server / routing
- **Mongoose 8** — MongoDB ODM
- **jsonwebtoken (JWT)** — single-admin auth tokens
- **bcrypt** — pinned for future use (passwords currently compared plain, like Forever)
- **validator** — email validation in `/api/contact/submit`
- **multer** — multipart/form-data uploads (`diskStorage`)
- **cloudinary v2** — cloud image / video / raw hosting & CDN
- **cors** + **dotenv** + **nodemon** (dev) — standard infrastructure

### Frontend & Admin (`frontend/package.json`, `admin/package.json`)
- **React 18** with **Vite 5** (fast dev server + HMR)
- **react-router-dom 6** — client-side routing
- **axios** — HTTP client
- **react-toastify** — toast notifications
- **Tailwind CSS 3** + **PostCSS** + **Autoprefixer** — styling
- **framer-motion** (frontend) — section animations
- **lucide-react** (frontend & admin) — icons
- **lenis** (frontend) — buttery smooth scroll
- **ESLint** with React plugins — linting

### External services
- **MongoDB Atlas** — managed database (collection prefix: database name is `portfolio`)
- **Cloudinary** — image / video / PDF storage & CDN
- **Vercel** — hosting for all three apps

### Explicitly NOT used
The spec forbids these — none of them appear inside `portfolio-website/`:
- TypeScript anywhere
- shadcn-ui / Radix / `@/` path aliases
- Supabase, Helmet, Pino, Sonner, React Query, react-helmet-async, dnd-kit, lovable-tagger
- Monorepo workspaces / npm workspaces / pnpm workspaces

---

## 3. High-level architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Public site     │     │   Admin Panel    │     │   Mainak (owner) │
│  (React :5173)   │     │  (React :5174)   │     │     (browser)    │
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
         │ axios / JSON           │ axios / JSON          │
         │ no auth                │ token in headers      │
         ▼                        ▼                       ▼
        ┌──────────────────────────────────────────────────────┐
        │           Express REST API  (Node :4000)             │
        │  /api/user  /api/profile  /api/project  /api/skill   │
        │  /api/experience  /api/achievement  /api/testimonial │
        │  /api/education  /api/contact  /api/media            │
        └────────┬───────────────────┬──────────────┬──────────┘
                 │                   │              │
        ┌────────▼──────┐ ┌──────────▼──────┐ ┌─────▼────────┐
        │ MongoDB Atlas │ │   Cloudinary    │ │ (file system │
        │ (mongoose)    │ │ (images/video)  │ │  for multer  │
        │  db=portfolio │ │                 │ │  temp paths) │
        └───────────────┘ └─────────────────┘ └──────────────┘
```

Key cross-cutting decisions (identical to Forever):

- **Stateless admin auth**: the JWT signed with `JWT_SECRET` is the only proof of identity. It is sent in a custom `token` HTTP header (not `Authorization: Bearer …`).
- **Singleton profile**: one document with `_id === "profile"` keeps the hero/about/contact metadata under a single round-trip.
- **Public reads, admin writes**: every `GET /api/<resource>/list` is public, every `POST /api/<resource>/{add,update,remove}` is gated by `adminAuth`.
- **No reverse proxy**: the SPAs hit the backend directly using `VITE_BACKEND_URL`. CORS is wide open (`app.use(cors())`), exactly like Forever.

---

## 4. Repository layout

```
portfolio-website/
├── .gitignore                    # node_modules + *.env
├── README.md                     # ← this document
│
├── backend/                      # Express REST API (Node, ESM)
│   ├── .env.example
│   ├── package.json              # type: module, scripts: start / server / seed
│   ├── server.js                 # app bootstrap (mirrors Forever's server.js)
│   ├── vercel.json               # @vercel/node config — route "/(.*)" → server.js
│   ├── config/
│   │   ├── mongodb.js            # connectDB() — appends "/portfolio" to MONGODB_URI
│   │   └── cloudinary.js         # connectCloudinary()
│   ├── middleware/
│   │   ├── adminAuth.js          # reads req.headers.token, verifies email+password JWT
│   │   └── multer.js             # diskStorage, up to 4 image fields + 1 logo + 1 file
│   ├── models/
│   │   ├── profileModel.js       # singleton (_id: "profile")
│   │   ├── projectModel.js       # CRUD
│   │   ├── experienceModel.js    # CRUD
│   │   ├── skillModel.js         # CRUD (one doc per skill, grouped by category)
│   │   ├── achievementModel.js   # CRUD
│   │   ├── testimonialModel.js   # CRUD
│   │   ├── educationModel.js     # CRUD
│   │   ├── contactModel.js       # public submit → admin read/delete
│   │   └── mediaModel.js         # optional registry of uploaded Cloudinary assets
│   ├── controllers/
│   │   ├── userController.js     # adminLogin only (no public signup)
│   │   ├── profileController.js  # getProfile + updateProfile (upsert "profile")
│   │   ├── projectController.js  # add / update / list / remove (+ image upload)
│   │   ├── experienceController.js
│   │   ├── skillController.js
│   │   ├── achievementController.js
│   │   ├── testimonialController.js
│   │   ├── educationController.js
│   │   ├── mediaController.js    # upload (multer.single) → Cloudinary → registry
│   │   └── contactController.js  # public submit + admin list/delete/status
│   ├── routes/
│   │   ├── userRoute.js          # POST /api/user/admin
│   │   ├── profileRoute.js       # GET /api/profile  POST /api/profile/update
│   │   ├── projectRoute.js       # /api/project/{add,update,list,remove}
│   │   ├── experienceRoute.js
│   │   ├── skillRoute.js
│   │   ├── achievementRoute.js
│   │   ├── testimonialRoute.js
│   │   ├── educationRoute.js
│   │   ├── contactRoute.js
│   │   └── mediaRoute.js
│   ├── scripts/
│   │   └── seed.js               # reads seed-data/resume.json → populates Mongo
│   └── seed-data/
│       └── resume.json           # shape-identical to src/data/resume.json
│
├── frontend/                     # PUBLIC portfolio — React 18 + Vite (port 5173)
│   ├── .env.example
│   ├── .eslintrc.cjs
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js        # ports the dark palette + glass tokens
│   ├── vite.config.js
│   ├── vercel.json               # SPA rewrite "/(.*)" → "/"
│   ├── index.html                # <html lang="en" class="dark scroll-smooth"> + LCP preloads
│   ├── public/                   # back.mp4, back-poster.jpg, me.png/avif/webp, favicon.svg, NIC.png, ONGC.png, robots.txt, my-picture-informal-1.*
│   └── src/
│       ├── main.jsx              # BrowserRouter + PortfolioContextProvider
│       ├── App.jsx               # Header + Hero + lazy sections + Footer
│       ├── index.css             # Tailwind layers + design tokens + utilities (ports src/index.css 1:1)
│       ├── assets/assets.js      # static asset paths (Forever-style)
│       ├── hooks/
│       │   ├── useSmoothScroll.js
│       │   └── useLazyMount.js
│       ├── context/PortfolioContext.jsx  # Promise.all fetch of all resources
│       └── components/
│           ├── Header.jsx        # fixed header, scroll-spy via IntersectionObserver
│           ├── Hero.jsx          # full-screen video, profile circle, glow CTAs
│           ├── About.jsx         # picture + bio + animated education timeline
│           ├── Experience.jsx    # alternating left/right cards with scroll-progress rail
│           ├── Projects.jsx      # grid + framer-motion modal (no Radix)
│           ├── Skills.jsx        # category tabs + animated proficiency bars
│           ├── Achievements.jsx  # 3-card grid with particle background
│           ├── Testimonials.jsx  # auto-advancing carousel
│           ├── Contact.jsx       # form → /api/contact/submit + social grid
│           ├── Footer.jsx        # 3-column footer (brand / quick links / resume)
│           ├── AnimatedBackground.jsx
│           ├── LazySection.jsx
│           └── SectionSkeleton.jsx
│
└── admin/                        # PRIVATE CMS — React 18 + Vite (port 5174)
    ├── .env.example
    ├── .eslintrc.cjs
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    ├── vercel.json
    ├── index.html                # <title>Mainak Dasgupta — Admin Panel</title>
    ├── public/favicon.svg
    └── src/
        ├── main.jsx
        ├── App.jsx               # token gate + routes
        ├── index.css
        ├── assets/
        │   ├── assets.js
        │   ├── logo.svg
        │   ├── add_icon.svg
        │   ├── list_icon.svg
        │   ├── parcel_icon.svg
        │   └── upload_area.svg
        ├── components/
        │   ├── Login.jsx         # POST /api/user/admin
        │   ├── Navbar.jsx        # logo + Logout
        │   └── Sidebar.jsx       # 9 NavLinks
        └── pages/
            ├── ProfileEditor.jsx
            ├── AddProject.jsx + ListProjects.jsx
            ├── AddExperience.jsx + ListExperience.jsx
            ├── AddSkill.jsx + ListSkills.jsx
            ├── AddAchievement.jsx + ListAchievements.jsx
            ├── AddTestimonial.jsx + ListTestimonials.jsx
            ├── AddEducation.jsx + ListEducation.jsx
            ├── Media.jsx
            └── Messages.jsx
```

Every file is `.jsx` / `.js`. Relative imports only. No `@/` aliases.

---

## 5. Backend — file-by-file walkthrough

### `backend/server.js`
The same bootstrap pattern as `Forever-website/backend/server.js`:

```js
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

app.use(express.json({ limit: '5mb' }))
app.use(cors())

app.use('/api/user',        userRouter)
app.use('/api/profile',     profileRouter)
app.use('/api/project',     projectRouter)
app.use('/api/experience',  experienceRouter)
app.use('/api/skill',       skillRouter)
app.use('/api/achievement', achievementRouter)
app.use('/api/testimonial', testimonialRouter)
app.use('/api/education',   educationRouter)
app.use('/api/contact',     contactRouter)
app.use('/api/media',       mediaRouter)

app.get('/', (req, res) => res.send('API Working'))
app.listen(port, () => console.log('Server started on PORT : ' + port))
```

### `backend/config/`
- **`mongodb.js`** — `mongoose.connect(${process.env.MONGODB_URI}/portfolio)` and logs `DB Connected`.
- **`cloudinary.js`** — sets `cloud_name` / `api_key` / `api_secret` from env vars.

### `backend/middleware/`
- **`adminAuth.js`** — reads `req.headers.token`, calls `jwt.verify(token, JWT_SECRET)`, and asserts that the decoded payload equals `process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD`. Identical contract to Forever.
- **`multer.js`** — `multer.diskStorage` that prefixes the original filename with `Date.now()` to avoid collisions. Replace with `multer.memoryStorage()` before deploying to Vercel (see §13).

### `backend/models/`
All models follow the `mongoose.models.X || mongoose.model("X", schema)` idiom. See §9 for the schemas.

### `backend/controllers/`
Every controller returns Forever-style envelopes — `{ success: true, ... }` on success, `{ success: false, message }` on failure — so the admin frontend can use the exact same `if (response.data.success) toast.success(...)` pattern.

Highlights:
- **`profileController.js → getProfile`** auto-creates the singleton on first call so the public site never sees a `null` document.
- **`projectController.js`** mirrors Forever's product controller image handling — `req.files.image1..image4` → `cloudinary.uploader.upload` → array of `secure_url`s saved on the document.
- **`mediaController.js`** auto-detects the right Cloudinary `resource_type` from the mime type (image / video / raw), persists a row in `mediaModel`, and returns `{ url, publicId, type }`.
- **`contactController.js → submitContact`** is the only public POST. It rejects empty fields and invalid emails (via `validator.isEmail`).

### `backend/routes/`
Each router maps URL paths to controller functions, applying `adminAuth` and `multer` middleware where needed:

```js
projectRouter.get ('/list',  listProjects);
projectRouter.post('/add',    adminAuth, imageFields, addProject);
projectRouter.post('/update', adminAuth, imageFields, updateProject);
projectRouter.post('/remove', adminAuth,             removeProject);
```

### `backend/scripts/seed.js`
Reads `backend/seed-data/resume.json` (same JSON shape as the original `src/data/resume.json`), then:
- `findByIdAndUpdate("profile", { ... }, { upsert: true })` — singleton.
- `deleteMany({}) → insertMany([...])` for every other collection (projects, experience, skills, achievements, testimonials, education).
- Skills are flattened — a `{ "Programming Languages": [{ name, proficiency }] }` map becomes one row per skill with a `category` column.
- `contacts` and `media` are NEVER wiped by the seed.

Run with:
```bash
npm run seed
```

### `backend/vercel.json`
Verbatim copy of Forever's serverless config:

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node", "config": { "includeFiles": ["dist/**"] } }],
  "routes":  [{ "src": "/(.*)", "dest": "server.js" }]
}
```

---

## 6. Frontend (public portfolio) — file-by-file walkthrough

### `frontend/index.html`
Builds the dark theme at build time (`<html lang="en" class="dark scroll-smooth">`) and preloads the LCP assets (`me.avif`, `back-poster.jpg`). No EmailJS preconnect because all submissions go through the backend now.

### `frontend/src/index.css`
A 1:1 port of `src/index.css`:
- `:root` light tokens, `.dark` dark tokens.
- Lenis hooks (`html.lenis`, `.lenis.lenis-smooth`, `[data-lenis-prevent]`).
- `.glass-card`, `.hover-glow`, `.cursive-brand`, `.shadow-elegant`, `.shadow-glow`, `.glow-button`, `.glow-button-strong`, `.blink-dot`.
- `@keyframes` for `gradient-shift`, `float-slow`, `float-slow-reverse`, `float-particle`, `pulse-glow`, `glow-pulse`.
- `prefers-reduced-motion` kill-switch.
- A small `.modal-backdrop` / `.modal-card` pair to replace the Radix Dialog used in `Projects.tsx`.

### `frontend/tailwind.config.js`
Maps every HSL CSS variable (`--background`, `--foreground`, `--accent`, `--muted`, …) to a Tailwind color token so classes like `bg-background`, `text-muted-foreground`, `border-border` keep working without shadcn-ui.

### `frontend/src/context/PortfolioContext.jsx`
Mirrors Forever's `ShopContext` pattern:

- One `useEffect` does `Promise.all` for `/api/profile`, `/api/project/list`, `/api/experience/list`, `/api/skill/list`, `/api/achievement/list`, `/api/testimonial/list`, `/api/education/list`.
- The flat `skills` array (one doc per skill) is `useMemo`-grouped into `skillsByCategory` so the Skills component can iterate categories.
- Every response is merged with a default object so a missing nested key never crashes a section.
- Exports `{ backendUrl, loading, profile, projects, experience, skills, skillsByCategory, achievements, testimonials, education }`.

### `frontend/src/hooks/useSmoothScroll.js`
1:1 port of the TypeScript original — Lenis with `lerp: 0.1`, `wheelMultiplier: 1`, `touchMultiplier: 1.2`, `smoothWheel: true`, `syncTouch: false`, `autoRaf: false`. The anchor-click interceptor honors `scroll-margin-top` so the fixed header never covers the destination heading.

### `frontend/src/App.jsx`
- Calls `useSmoothScroll()`.
- Renders `<Header />` and `<Hero />` eagerly (above-the-fold).
- All other sections are `React.lazy` and wrapped in `<LazySection>` (IntersectionObserver-based one-shot mount) so the initial JS bundle stays small.
- `AnimatedBackground` is deferred behind `requestIdleCallback` so it never competes with the LCP image.

### `frontend/src/components/Header.jsx`
- Fixed header, transparent → blurred glass on scroll (threshold 40px), throttled via `requestAnimationFrame`.
- Scroll-spy: one `IntersectionObserver` watches every section, picks the one with the highest visible ratio, drives the underline.
- Mobile drawer with `data-lenis-prevent`, closes on Escape or backdrop click.
- Brand monogram square + cursive brand short name.

### `frontend/src/components/Hero.jsx`
- Full-viewport `<video autoPlay muted loop playsInline preload="auto" poster={…}>` with the dark `bg-black/40 backdrop-blur-[1px]` overlay.
- Profile circle, blink-dot badge, two `hover-glow glow-button` CTAs with staggered delays.
- Animated bouncing chevron at the bottom.

### `frontend/src/components/About.jsx`
- Picture + bio paragraphs (split on blank lines from `profile.bio`).
- Shooting-star education timeline driven by `IntersectionObserver` + framer-motion springs.

### `frontend/src/components/Experience.jsx`
- `useScroll` + `useTransform` drive the height of the central rail with the glowing white "head".
- Cards alternate left/right with a hover-blur effect on the non-hovered cards.
- Logo on the desktop center; on mobile sits on the left rail.

### `frontend/src/components/Projects.jsx`
- 2-column grid of `glass-card` tiles with hover-lift.
- Click opens a custom framer-motion modal (replacing Radix Dialog) with the project description, technologies, key features, and GitHub / Demo buttons.

### `frontend/src/components/Skills.jsx`
- Category buttons (Programming Languages / Version Control / Databases / Technologies & Tools / Web Development / ML & AI…).
- Active category drives a grid of cards with a proficiency bar that animates from 0 → `proficiency%` on enter.

### `frontend/src/components/Achievements.jsx`
- Icon map `{ trophy: Trophy, award: Award, medal: Medal }` from `lucide-react`.
- Floating orbs and particle field in the background.

### `frontend/src/components/Testimonials.jsx`
- Auto-advancing carousel via chained `setTimeout` (pauses on hover).
- 5-star rating row, optional avatar with letter fallback.

### `frontend/src/components/Contact.jsx`
- Form posts to `${backendUrl}/api/contact/submit`.
- On success → `react-toastify` toast and `form.reset()`.
- Side panel of social links pulls from `profile.links`.

### `frontend/src/components/Footer.jsx`
- 3 columns: brand blurb (cursive), Quick Links, Download Resume (uses `profile.media.resumePdf`).

### `frontend/vercel.json`
Standard SPA rewrite — every path is served `index.html` so the React router can resolve it client-side.

---

## 7. Admin panel — file-by-file walkthrough

### `admin/src/App.jsx`
- Stores the token in `useState` initialised from `localStorage.getItem('token')`.
- On `setToken(...)`, `useEffect` persists it back to `localStorage`.
- If the token is empty → render `<Login />`.
- Else → render `<Navbar />`, `<Sidebar />`, and a `<Routes>` block that maps:
  - `/profile`              → `ProfileEditor`
  - `/projects` + `/projects/add`
  - `/experience` + `/experience/add`
  - `/skills` + `/skills/add`
  - `/achievements` + `/achievements/add`
  - `/testimonials` + `/testimonials/add`
  - `/education` + `/education/add`
  - `/media`
  - `/messages`
  - `/` redirects to `/profile`.

### `admin/src/components/Login.jsx`
`axios.post(backendUrl + '/api/user/admin', { email, password })` → on success calls `setToken(response.data.token)`. Identical to Forever.

### `admin/src/components/Navbar.jsx`
Logo + "Logout" button (`setToken('')` clears the token both in state and `localStorage`).

### `admin/src/components/Sidebar.jsx`
Nine `NavLink`s, one per resource. The active link styling is driven by the `.active` class defined in `admin/src/index.css`.

### `admin/src/pages/ProfileEditor.jsx`
A single long form that loads `GET /api/profile`, lets you edit every field of the singleton (including all nested `heroUi`, `media`, `links`, `sectionSubtitles` keys and the multiline `coursework` list), then `POST /api/profile/update` to upsert the document.

### `admin/src/pages/Add*.jsx`
Each follows the same pattern Forever's `Add.jsx` uses:
1. Local `useState` for every form field.
2. On submit, build either a JSON body or a `FormData` (when an image is involved).
3. `axios.post(backendUrl + '/api/<resource>/add', body, { headers: { token } })`.
4. On `success: true` → `toast.success(message)` and reset the form.
5. On `success: false` → `toast.error(message)`.

### `admin/src/pages/List*.jsx`
- `useEffect` runs `axios.get(backendUrl + '/api/<resource>/list')` on mount.
- Renders a Forever-style table/grid with the X button calling `/api/<resource>/remove`.
- A `+ Add` button links to the corresponding `Add*.jsx`.

### `admin/src/pages/Media.jsx`
- Drag-less file picker → `POST /api/media/upload` with `multer.single("file")` (auto-detects image / video / raw).
- Lists every uploaded asset returned from `POST /api/media/list`, with **Copy URL** and **Delete** buttons.
- The owner uses this page to grab Cloudinary URLs for the profile editor's `media.heroVideoSrc`, `media.heroProfileSrc`, `media.resumePdf`, etc.

### `admin/src/pages/Messages.jsx`
Lists every `contactModel` document (newest first), shows parcel icon + name/email/subject/message/date, lets the admin flip `status` between `new` and `read`, or delete the message. Layout mirrors Forever's Orders page.

---

## 8. Complete REST API reference

> **Auth header**: `token: <jwt>`. JWT is `jwt.sign(email + password, JWT_SECRET)` (Forever convention).
> **Response shape**: `{ success: true, ... }` on success, `{ success: false, message }` on failure.

### Health
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/`  | —    | Returns the string `"API Working"`. |

### Auth
| Method | Path             | Auth | Description |
|--------|------------------|------|-------------|
| `POST` | `/api/user/admin`| —    | Body `{ email, password }`. Returns `{ success, token }` if both env vars match. |

### Profile (singleton)
| Method | Path                   | Auth  | Description |
|--------|------------------------|-------|-------------|
| `GET`  | `/api/profile`         | —     | Returns `{ success, profile }`. Auto-creates the doc on first call. |
| `POST` | `/api/profile/update`  | admin | Full upsert of every field of the singleton. |

### Projects
| Method | Path                  | Auth  | Body / form fields |
|--------|-----------------------|-------|-------------------|
| `GET`  | `/api/project/list`   | —     | — |
| `POST` | `/api/project/add`    | admin | `multipart/form-data`: `image1..image4`, `name`, `description`, `technologies` (JSON), `highlights` (JSON), `github`, `demo`, `featured`, `order` |
| `POST` | `/api/project/update` | admin | same fields + `id` |
| `POST` | `/api/project/remove` | admin | `{ id }` |

### Experience
| Method | Path                       | Auth  | Body |
|--------|----------------------------|-------|------|
| `GET`  | `/api/experience/list`     | —     | — |
| `POST` | `/api/experience/add`      | admin | `multipart/form-data`: `logo`, `company`, `role`, `period`, `link`, `certificate`, `highlights` (JSON), `order` |
| `POST` | `/api/experience/update`   | admin | same + `id` |
| `POST` | `/api/experience/remove`   | admin | `{ id }` |

### Skills
| Method | Path                  | Auth  | Body |
|--------|-----------------------|-------|------|
| `GET`  | `/api/skill/list`     | —     | — |
| `POST` | `/api/skill/add`      | admin | `{ category, name, proficiency, order }` |
| `POST` | `/api/skill/update`   | admin | `{ id, category?, name?, proficiency?, order? }` |
| `POST` | `/api/skill/remove`   | admin | `{ id }` |

### Achievements
| Method | Path                          | Auth  | Body |
|--------|-------------------------------|-------|------|
| `GET`  | `/api/achievement/list`       | —     | — |
| `POST` | `/api/achievement/add`        | admin | `{ title, description, icon: "trophy"\|"award"\|"medal", order }` |
| `POST` | `/api/achievement/update`     | admin | same + `id` |
| `POST` | `/api/achievement/remove`     | admin | `{ id }` |

### Testimonials
| Method | Path                          | Auth  | Body |
|--------|-------------------------------|-------|------|
| `GET`  | `/api/testimonial/list`       | —     | — |
| `POST` | `/api/testimonial/add`        | admin | `multipart/form-data`: `image`, `name`, `role`, `company`, `quote`, `rating`, `order` |
| `POST` | `/api/testimonial/update`     | admin | same + `id` |
| `POST` | `/api/testimonial/remove`     | admin | `{ id }` |

### Education
| Method | Path                       | Auth  | Body |
|--------|----------------------------|-------|------|
| `GET`  | `/api/education/list`      | —     | — |
| `POST` | `/api/education/add`       | admin | `{ degree, field, institution, year, grade, status, order }` |
| `POST` | `/api/education/update`    | admin | same + `id` |
| `POST` | `/api/education/remove`    | admin | `{ id }` |

### Contact
| Method | Path                       | Auth  | Body |
|--------|----------------------------|-------|------|
| `POST` | `/api/contact/submit`      | **public** | `{ name, email, subject, message }` — validated server-side |
| `POST` | `/api/contact/list`        | admin | — |
| `POST` | `/api/contact/status`      | admin | `{ id, status: "new"\|"read" }` |
| `POST` | `/api/contact/remove`      | admin | `{ id }` |

### Media
| Method | Path                  | Auth  | Body |
|--------|-----------------------|-------|------|
| `POST` | `/api/media/upload`   | admin | `multipart/form-data` with `file`. Auto-detects image / video / raw and uploads to Cloudinary. Returns `{ url, publicId, type, media }`. |
| `POST` | `/api/media/list`     | admin | — |
| `POST` | `/api/media/remove`   | admin | `{ id, publicId, type }` — also destroys the asset on Cloudinary. |

---

## 9. Data models (MongoDB schemas)

### `profileModel`  (singleton — `_id === "profile"`)
```js
{
  _id: "profile",
  name, title, tagline, bio, email, phone,
  brandShortName, brandMonogram,
  heroUi: {
    badge, introPrefix, role,
    primaryCtaLabel, primaryCtaHref,
    secondaryCtaLabel, secondaryCtaHref,
    scrollHintTop, scrollHintBottom,
  },
  media: { heroVideoSrc, heroPosterSrc, heroProfileSrc, aboutProfileSrc, resumePdf },
  links: { linkedin, github, leetcode, codeforces, geekforgeeks, twitter },
  sectionSubtitles: { about, projects, experience, skills, achievements, testimonials, contact },
  coursework: [String],
}
```

### `projectModel`
```js
{ name, description, technologies: [String], highlights: [String],
  github, demo, image: [String], featured: Boolean, order: Number, date: Number }
```

### `experienceModel`
```js
{ company, role, period, link, logo, certificate, highlights: [String], order: Number }
```

### `skillModel`
```js
{ category, name, proficiency: 0–100, order: Number }
```

### `achievementModel`
```js
{ title, description, icon: "trophy" | "award" | "medal", order: Number }
```

### `testimonialModel`
```js
{ name, role, company, image, quote, rating: 1–5, order: Number }
```

### `educationModel`
```js
{ degree, field, institution, year, grade, status: "Completed" | "Pursuing", order: Number }
```

### `contactModel`
```js
{ name, email, subject, message, date: Number, status: "new" | "read" }
```

### `mediaModel`
```js
{ url, publicId, type: "image" | "video" | "raw", originalName, bytes: Number, uploadedAt: Number }
```

---

## 10. End-to-end data flows

### Visitor flow (read-only, no auth)
1. Browser loads `https://<frontend>/`.
2. Vite ships a JS bundle that mounts `<App />` inside `<PortfolioContextProvider>`.
3. Provider's `useEffect` `Promise.all`s 7 endpoints (`/api/profile` + 6 `/list` endpoints).
4. While the promises resolve, the eager `<Header />` + `<Hero />` render with default values; below-the-fold sections show a `<SectionSkeleton />` placeholder.
5. As the visitor scrolls, `IntersectionObserver` mounts each section's lazy chunk; framer-motion plays its enter animation; the proficiency bars / education timeline / testimonial carousel animate as their refs enter the viewport.
6. When the visitor submits the Contact form → `axios.post('/api/contact/submit')` → server inserts a `contactModel` row → success toast.

### Admin edit flow
1. Owner opens `https://<admin>/`. Empty `localStorage.token` → renders `<Login />`.
2. Submitting the form calls `POST /api/user/admin`. Server compares `email`/`password` against env vars; returns `{ token: jwt.sign(email+password, JWT_SECRET) }`.
3. `setToken(...)` flushes the token to state + `localStorage`. App swaps to `<Navbar />` + `<Sidebar />`.
4. Owner clicks "Projects" → "+ Add project" → fills the form → `POST /api/project/add` with `headers: { token }`. Multer dumps the uploaded images to disk; controller uploads each to Cloudinary; saves doc.
5. Owner refreshes the public site → `PortfolioContext` re-fetches `/api/project/list` → the new project appears.

### Media upload flow
1. Owner opens the **Media** page, selects `back-new.mp4` → submit.
2. Admin sends a multipart POST to `/api/media/upload` with the file under the field name `file`.
3. Server detects `video/mp4` → calls `cloudinary.uploader.upload(file.path, { resource_type: 'video' })` → gets back `secure_url` + `public_id`.
4. Server inserts a `mediaModel` row and returns the URL.
5. Admin shows the new card with **Copy URL**. Owner copies it and pastes it into ProfileEditor's `media.heroVideoSrc`, hits **Save profile**.
6. Next visit to the public site → `Hero.jsx` reads the new URL via `useContext(PortfolioContext)`.

### Contact submission flow
1. Visitor fills the form → `POST /api/contact/submit`.
2. Server validates and inserts a `contactModel` row with `status: "new"`.
3. Admin opens **Messages** → `POST /api/contact/list` (admin-only) → renders the messages.
4. Admin clicks **Mark read** → `POST /api/contact/status` with `{ id, status: "read" }`.

---

## 11. Environment variables

### `backend/.env`
| Key | Required | Purpose |
|-----|----------|---------|
| `PORT` | No (default 4000) | Express port |
| `MONGODB_URI` | **Yes** | MongoDB Atlas URI WITHOUT a trailing slash. Code appends `/portfolio`. |
| `JWT_SECRET` | **Yes** | Long random string for `jwt.sign / jwt.verify`. |
| `ADMIN_EMAIL` | **Yes** | Single admin email (plain compare). |
| `ADMIN_PASSWORD` | **Yes** | Single admin password (plain compare). |
| `CLOUDINARY_NAME` | **Yes** | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | **Yes** | Cloudinary API key. |
| `CLOUDINARY_SECRET_KEY` | **Yes** | Cloudinary API secret. |

A safe template lives in `backend/.env.example`.

### `frontend/.env`
| Key | Required | Purpose |
|-----|----------|---------|
| `VITE_BACKEND_URL` | **Yes** | URL of the running backend, **without** a trailing slash. e.g. `http://localhost:4000`. |

### `admin/.env`
| Key | Required | Purpose |
|-----|----------|---------|
| `VITE_BACKEND_URL` | **Yes** | Same as frontend. |

---

## 12. Local installation & development

```bash
# 1. Backend (terminal 1)
cd portfolio-website/backend
cp .env.example .env          # fill in real values
npm install
npm run seed                  # populates Mongo from seed-data/resume.json
npm run server                # → "Server started on PORT : 4000" + "DB Connected"

# 2. Frontend (terminal 2)
cd portfolio-website/frontend
cp .env.example .env
npm install
npm run dev                   # → http://localhost:5173

# 3. Admin (terminal 3)
cd portfolio-website/admin
cp .env.example .env
npm install
npm run dev                   # → http://localhost:5174
```

Sign into the admin with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `backend/.env`.

Lint each app individually:
```bash
cd portfolio-website/frontend && npm run lint
cd portfolio-website/admin    && npm run lint
```

---

## 13. Deployment (Vercel)

Three independent Vercel projects pointing at the same repo, one per app folder.

### Backend (Vercel "Other" framework, root = `portfolio-website/backend`)
- Uses `backend/vercel.json` as-is.
- Set the env vars from §11 in **Project Settings → Environment Variables**.
- **IMPORTANT**: switch `middleware/multer.js` from `multer.diskStorage` to `multer.memoryStorage()` before deploying. Vercel's serverless filesystem is read-only outside `/tmp`. Then in each controller pipe `file.buffer` into `cloudinary.uploader.upload_stream(...)` instead of `cloudinary.uploader.upload(file.path, ...)`.

### Frontend (Vercel "Vite" framework, root = `portfolio-website/frontend`)
- Build command: `npm run build`. Output: `dist`.
- `frontend/vercel.json` handles the SPA rewrite.
- Set `VITE_BACKEND_URL` to the deployed backend URL, then redeploy.

### Admin (same as frontend, root = `portfolio-website/admin`)
- Same instructions as the frontend. Add an `X-Robots-Tag: noindex` header if you don't want the admin URL indexed.

---

## 14. Security notes & known issues

These all mirror Forever's posture and are intentional:

- **CORS is wide open** (`app.use(cors())`). Lock down to the deployed frontend / admin origins in production.
- **No rate limiting** on `/api/contact/submit`. A spammer can flood the `contacts` collection. Add `express-rate-limit` or Cloudflare protection in production.
- **Admin token in `localStorage`** (not `httpOnly` cookie). Vulnerable to XSS-based exfiltration. Acceptable for a single-admin portfolio CMS but not for multi-tenant production.
- **Plain-string admin credentials**: `email === ADMIN_EMAIL && password === ADMIN_PASSWORD`. Same trade-off as Forever — no DB row for the admin. Move to a hashed `userModel` row if you ever add more than one admin.
- **Custom `token` header** instead of `Authorization: Bearer …`. Kept on purpose to match the Forever middleware contract 1:1.

---

## 15. Suggested improvements

- Bcrypt the admin credentials or move them into a `userModel` row.
- Add `helmet` + `express-rate-limit` to the backend.
- Restrict CORS to known origins.
- Switch multer to `memoryStorage` and stream to Cloudinary so the backend is serverless-ready out of the box.
- Add image variants (AVIF/WebP) using Cloudinary transformations.
- Wire the Media page to show Cloudinary folders and tags.
- Add an edit-in-place pencil button on every `List*.jsx` page that pre-fills the corresponding `Add*.jsx` form via `useState`.
- Add a "Preview" mode that lets the admin see unsaved changes before persisting.

---

## 16. Glossary of concepts used

- **JWT (JSON Web Token)** — a signed string `<header>.<payload>.<signature>`. Verified with `jwt.verify(token, secret)`.
- **Mongoose** — an Object-Document Mapper for MongoDB. Provides schemas, validation, and a query builder.
- **Multer** — Express middleware for `multipart/form-data` uploads. We use `diskStorage` locally for dev parity with Forever.
- **Cloudinary** — image / video / raw asset CDN. `cloudinary.uploader.upload(filePath, { resource_type })` → `{ secure_url, public_id }`.
- **Singleton document** — a collection that holds exactly one document, addressed by a fixed `_id`. Used here for `profile`.
- **Lenis** — a smooth-scroll library that intercepts wheel events and runs an inertial loop in `requestAnimationFrame`.
- **IntersectionObserver** — a browser API that reports when elements enter/leave the viewport. Used for scroll-spy and lazy mounting.
- **framer-motion** — declarative animation library. Used for entrance animations, hover effects, and the carousel's spring transitions.
- **Vite** — modern dev server / bundler. Reads `vite.config.js`, serves on the configured port, supports HMR.

---

## 17. Author & license

- **Author**: Mainak Dasgupta — [GitHub @MainakDasgupta21](https://github.com/MainakDasgupta21)
- **License**: ISC (matching the Forever reference). Replace at will.

---

If anything in this README disagrees with the running code, the running code wins. PRs welcome.
