# AGENTS.md: A Guide for AI Assistants

Guidelines for AI assistants working on this codebase. Covers project structure,
build/lint/test commands, code style, and architecture.

## Project Overview

**Ekonsumo** -- a full-stack web app for managing a local ecological consumer group.
Monorepo using **npm workspaces** with two packages: `backend/` and `frontend/`.

- **Backend:** Node.js + Express 5, PostgreSQL (raw SQL via `pg`), JWT auth.
- **Frontend:** Vue.js 3 + Vite, Pinia, Vue Router 4, Bootstrap 5, Axios.
- **No TypeScript.** Plain JavaScript throughout.

## Root Workspace Commands

Run from the repository root (`/`):

```bash
npm run start:backend       # Start backend server
npm run test:backend        # Run backend tests (Jest)
npm run lint:frontend       # Lint frontend (ESLint)
```

## Backend (Node.js + Express 5)

Working directory: `backend/`

### Commands

```bash
npm start                   # Start server (node index.js), port 3000
npm test                    # Run all tests (Jest + Supertest)
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage report
npm run lint                # Lint with ESLint
npm run format              # Format with Prettier
```

**Run a single test file:**
```bash
npx jest tests/models/usuarioModel.test.js
npx jest tests/routes/proveedorRoutes.test.js
```

Test files live in `backend/tests/` and match the pattern `**/*.test.js`.
Tests run against a **real PostgreSQL database** (configured via `.env`).
A running PostgreSQL instance is required.

### Architecture

Layered MVC: **Routes -> Controllers -> Models -> Database (pg Pool)**

```
backend/
  index.js                          # Express app setup, exports app for tests
  swagger.js                        # OpenAPI 3.0 / Swagger config
  src/
    config/
      db.js                         # PostgreSQL pool (pg, max 20 connections)
      logger.js                     # Winston logger
      multer.js                     # File upload config (5MB, images only)
    controllers/*Controller.js      # Request handling, call models
    models/*.js                     # Raw SQL queries via pg pool (no ORM)
    middlewares/
      auth.js                       # JWT Bearer token verification
      admin.js                      # Role check (req.user.rol === 'admin')
      validators.js                 # express-validator rules
    routes/*Routes.js               # Route definitions with Swagger JSDoc
    services/
      emailService.js               # Nodemailer (Gmail)
  tests/
    setup.js                        # Loads .env via dotenv
    testUtils.js                    # Helper: create admin user, get auth token
    models/*.test.js                # Unit tests for models
    routes/*.test.js                # Integration tests for routes (Supertest)
```

### Code Style

**Linting:** ESLint (`eslint:recommended` + `plugin:prettier/recommended`).
**Formatting:** Prettier with: semicolons, single quotes, trailing commas (es5).

- **Imports:** Use `require()` (CommonJS).
- **Indentation:** 2 spaces.
- **Semicolons:** Always.
- **Quotes:** Single quotes.
- **Naming:**
  - `camelCase` for variables, functions, and file names (except model/controller files).
  - `PascalCase` for model and controller files (e.g., `Usuario.js`, `PedidoController.js`).
  - Database table/column names use `snake_case` in Spanish (e.g., `id_usuario`, `fecha_creacion`).
- **Error handling:** Use `try...catch` in all async controller methods. Return
  consistent JSON error responses: `{ error: 'message' }` with appropriate HTTP status codes.
- **Models:** All database access goes through model files using parameterized
  queries (`pool.query(sql, [params])`). Never concatenate user input into SQL.
- **Auth:** Protected routes use `auth` middleware. Admin-only routes add `admin` middleware.
- **Validation:** Use `express-validator` for request body/param validation in routes.

### Environment Variables (backend/.env)

Required: `PORT`, `NODE_ENV`, `JWT_SECRET`, `DB_HOST`, `DB_PORT`, `DB_USER`,
`DB_PASSWORD`, `DB_NAME`, `EMAIL_USER`, `EMAIL_PASS`, `FRONTEND_URL`.

## Frontend (Vue.js 3 + Vite)

Working directory: `frontend/`

### Commands

```bash
npm run dev                 # Start Vite dev server, port 8080 (auto-opens browser)
npm run build               # Production build (outputs to dist/)
npm run build:dev           # Development build
npm run build:prod          # Production build (explicit)
npm run lint                # Lint .vue, .js, .jsx, .cjs, .mjs files (auto-fix)
npm run preview             # Preview production build locally
npm run clean               # Remove dist/ and node_modules/
npm run reinstall           # Clean + npm install
```

**Frontend tests are not yet implemented.** No test runner is configured.

### Architecture

```
frontend/
  index.html                        # HTML entry point
  vite.config.js                    # Vite config (@ alias, proxy /api -> :3000)
  src/
    main.js                         # App bootstrap (Vue, Router, Pinia, Bootstrap)
    App.vue                         # Root component (NavBar, router-view, Footer, alerts)
    router/index.js                 # 17 routes with auth guards
    store/
      index.js                      # Pinia setup + auth store (isAuthenticated, user)
      alertStore.js                 # Reactive alert store (Vue reactive())
    services/
      api.js                        # Axios client with JWT interceptor
    components/
      NavBar.vue, FooterBar.vue     # Layout components
    views/*Page.vue                 # Page-level components (PascalCase + Page suffix)
    assets/styles/global.css        # Global fonts (Open Sans, Roboto)
```

### Code Style

**Linting:** ESLint with `plugin:vue/vue3-essential`. No Prettier configured for frontend.

- **Imports:** ES6 `import/export` syntax.
- **Indentation:** 2 spaces.
- **Component API:** Predominantly **Options API** (`data()`, `methods`, `computed`).
  Some Composition API usage (`setup()` with `computed` from vue).
- **Naming:**
  - Component files: `PascalCase` (e.g., `NavBar.vue`, `LoginPage.vue`).
  - View files: `*Page.vue` convention.
  - Variables/functions: `camelCase`.
- **Path alias:** `@` maps to `src/` (configured in `vite.config.js` and `jsconfig.json`).
- **Vue shorthands:** Use `@` for `v-on` and `:` for `v-bind`.
- **State management:** Pinia for auth state; `alertStore.js` uses Vue 3 `reactive()` directly.
- **API calls:** All HTTP requests go through `services/api.js` (Axios instance).
  JWT token is read from `localStorage` and attached via request interceptor.
- **Styling:** Bootstrap 5 (imported in `main.js`), Bootstrap Icons, scoped
  `<style scoped>` per component, SASS available via `sass` dependency.
- **Routing:** Auth-guarded routes use `meta: { requiresAuth: true }`.
  Navigation guard in `router/index.js` checks Pinia `authStore.isAuthenticated`.

### Environment Variables (frontend/.env.development)

Uses `VUE_APP_` prefix (legacy Vue CLI convention; note: Vite requires `VITE_` prefix
for client-side exposure, but the API URL is currently hardcoded in `api.js`).

## Database (PostgreSQL)

- Database: `ekonsumo`, User: `ekonsumo_user`
- Schema: `scripts/crearBaseDatos.sql`
- Seed data: `scripts/datosPrueba.sql`
- Reset script: `sql/reset_database.sh`
- Tables: `Usuario`, `Proveedor`, `Producto`, `Pedido`, `Detalle_Pedido`,
  `Usuario_Proveedor`, `Pedido_Periodico`, `Pago`, `Notificacion`

## General Guidelines

- **Commit messages:** Follow conventional commit standards.
- **Dependencies:** `npm install --save` for production, `npm install --save-dev` for dev.
- **Secrets:** Never commit `.env` files or credentials. Use environment variables.
- **API docs:** Swagger UI available at `/api-docs` when the backend is running.
- **CORS:** Backend allows origins `localhost:8080` and `127.0.0.1:8080`.
- **Rate limiting:** 100 requests per 15 minutes on `/api/` routes.
