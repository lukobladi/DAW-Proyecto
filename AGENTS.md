# AGENTS.md - Ekonsumo Development Guide

## Project Overview

Ekonsumo is a full-stack web application for managing local consumption groups. It uses a monorepo structure with npm workspaces.

```
DAW-Proyecto/
├── backend/          # Express.js REST API (Node.js)
├── frontend/        # Vue.js 3 SPA with Vite
├── docs/            # Documentation
└── package.json     # Root workspace config
```

**Tech Stack:**
- Backend: Node.js, Express 5.2.1, PostgreSQL, JWT auth, Jest testing
- Frontend: Vue.js 3.5.30, Vite, Pinia, Vue Router, Vitest

**Node Version:** 22.12.0 (see `.nvmrc`)

---

## Build Commands

### Root Commands (npm workspaces)
```bash
npm run start:backend      # Start backend server
npm run start:frontend    # Start frontend dev server
npm run test:backend      # Run all backend tests
npm run test:frontend     # Run all frontend tests
npm run lint:backend      # Lint backend code
npm run lint:frontend     # Lint frontend code
```

### Backend Commands (from /backend)
```bash
npm start                 # Start server (node index.js)
npm run lint              # ESLint + Prettier check
npm run format            # Auto-format with Prettier
npm run liquidacion:mensual  # Run monthly settlement job
```

### Frontend Commands (from /frontend)
```bash
npm run dev               # Start Vite dev server
npm run build             # Production build
npm run build:dev         # Development build
npm run build:prod        # Production build
npm run preview           # Preview production build
npm run clean             # Remove dist and node_modules
npm run reinstall         # Clean reinstall
```

---

## Testing

### Running Tests

#### Backend (Jest)
```bash
# All tests
npm test --workspace=backend

# Single test file
npm test --workspace=backend -- tests/models/usuarioModel.test.js

# Single test with name pattern
npm test --workspace=backend -- --testNamePattern="Deberia crear un nuevo usuario"

# Watch mode
npm test --workspace=backend -- --watch

# Coverage
npm test --workspace=backend -- --coverage --runInBand
```

#### Frontend (Vitest)
```bash
# All tests
npm test --workspace=frontend

# Single test file
npm test --workspace=frontend -- src/store/index.test.js

# Watch mode
npm test --workspace=frontend -- --watch src/store/index.test.js
```

### Test Configuration
- Backend: `backend/jest.config.js` - setup file at `backend/tests/setup.js`
- Frontend: Configured in `frontend/vite.config.mjs`, globals enabled

---

## Code Style

### General
- **Line endings:** LF
- **Indentation:** 2 spaces (Vue files may vary)
- **Encoding:** UTF-8

### Formatting (Prettier)
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

### Backend (Node.js/Express)

**Imports:** CommonJS module syntax
```javascript
const express = require('express');
const { validationResult } = require('express-validator');
```

**File Naming:**
- Models: PascalCase (e.g., `Usuario.js`, `Pedido.js`)
- Controllers: PascalCase (e.g., `UsuarioController.js`)
- Routes: kebab-case or PascalCase
- Middlewares: kebab-case (e.g., `auth-middleware.js`)

**Variables/Functions:** camelCase
```javascript
const usuarioData = req.body;
async function crearUsuario() { }
```

**Database Columns:** snake_case
```sql
id_usuario, fecha_creacion, fecha_modificacion
```

**Response Patterns:**
```javascript
// Success
res.status(201).json(data);
res.status(200).json(data);
res.status(204).send();  // Delete operations

// Error
res.status(404).json({ message: 'Not found' });
res.status(500).json({ message: 'Error message' });
```

**Error Handling:**
```javascript
try {
  const result = await someAsyncOperation();
  res.status(200).json(result);
} catch (err) {
  logger.error('Operation failed:', err);
  res.status(500).json({ message: 'Error description' });
}
```

### Frontend (Vue.js 3)

**Script Setup:** Use Composition API with `<script setup>`
```javascript
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store';

const authStore = useAuthStore();
const count = ref(0);
const doubled = computed(() => count.value * 2);

onMounted(() => { });
</script>
```

**Options API (when not using setup):**
```javascript
export default {
  name: 'ComponentName',
  components: { Component1, Component2 },
  setup() {
    // ...
    return { /* returned vars and functions */ };
  },
};
```

**Store (Pinia):**
```javascript
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: null, user: null }),
  actions: {
    async login(credentials) { /* ... */ }
  },
});
```

**Template Shorthands:**
- Bindings: `:` instead of `v-bind:`
- Events: `@` instead of `v-on:`
- Conditionals: `v-if`, `v-show`, `v-for`

**API Service Pattern:**
```javascript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});
```

---

## Linting

### Backend
```bash
npm run lint --workspace=backend    # Check
npm run format --workspace=backend  # Fix
```

ESLint extends: `eslint:recommended`, `plugin:prettier/recommended`
Rules: `prettier/prettier: warn`, `no-unused-vars: warn`, `no-undef: error`

### Frontend
```bash
npm run lint --workspace=frontend    # Check and fix
```

ESLint uses: `@eslint/js` + `eslint-plugin-vue`
Disabled rules: `vue/multi-word-component-names: off`

---

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Vue Components | PascalCase | `UserProfile.vue` |
| Store | camelCase | `useAuthStore` |
| Composables | camelCase | `useFormatter.js` |
| API Services | camelCase | `userService.js` |
| CSS Classes | kebab-case | `.user-profile` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Database tables | snake_case (plural) | `usuarios`, `pedidos` |
| Database columns | snake_case | `id_usuario`, `fecha_alta` |

---

## Error Handling

### Backend
- Always use try/catch for async operations
- Log errors with winston logger before sending response
- Return appropriate HTTP status codes
- Never expose internal error details in production

```javascript
try {
  await db.query('SELECT ...');
} catch (err) {
  logger.error('Database query failed:', err);
  res.status(500).json({ message: 'Error interno' });
}
```

### Frontend
- Use try/catch in async actions
- Handle API errors gracefully with user feedback
- Log errors to console in development

---

## Git Conventions

- Branch naming: `feature/`, `fix/`, `refactor/`
- Commit messages: Spanish, imperative mood ("Agregar validación")
- PR descriptions: Spanish

---

## Environment Variables

### Backend (`.env`)
```
PORT=3000
DB_HOST=localhost
DB_NAME=ekonsumo
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-secret
```

### Frontend (`.env.development`)
```
VITE_API_URL=http://localhost:3000
```

---

## Common Tasks

### Adding a new model (backend)
1. Create file in `backend/src/models/Nombre.js`
2. Define schema with `pg` pool
3. Export methods for CRUD
4. Add tests in `backend/tests/models/`

### Adding a new Vue component
1. Create in `frontend/src/components/` as `Nombre.vue`
2. Use `<script setup>` with Composition API
3. Import in parent view or register globally

### Adding a new API route
1. Create controller in `backend/src/controllers/`
2. Add route in `backend/src/routes/`
3. Register in `backend/src/routes/index.js`
4. Add middleware if needed (auth, validation)

### Running database migrations
Manual SQL scripts in `backend/src/config/` - no automated migration tool.
