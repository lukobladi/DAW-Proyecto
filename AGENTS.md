# AGENTS.md: A Guide for AI Assistants

This document provides guidelines for AI assistants working on this codebase. It covers project structure, build/lint/test commands, and code style.

## Project Overview

This is a full-stack web application with a Vue.js frontend and a Node.js backend. The project is organized into two main directories: `frontend` and `backend`.

- `frontend`: Contains the Vue.js client-side application.
- `backend`: Contains the Node.js API server.

## Backend (Node.js)

The backend is a Node.js application using the Express framework.

### Commands

- **Run the server:**
  ```bash
  npm start
  ```
  This command starts the server in development mode.

- **Run tests:**
  ```bash
  npm test
  ```
  or
  ```bash
  jest
  ```
  This command runs all tests using Jest.

- **Run a single test:**
  ```bash
  jest <path/to/test/file.spec.js>
  ```

### Code Style

Since there is no explicit linting configuration, please adhere to the following general JavaScript best practices and the existing code style.

- **Imports:** Use `require` for imports.
- **Formatting:** Use 2 spaces for indentation.
- **Types:** This project does not use a static type checker like TypeScript. Pay close attention to data types and ensure they are handled correctly.
- **Naming Conventions:**
  - Use `camelCase` for variables and functions.
  - Use `PascalCase` for classes.
- **Error Handling:** Use `try...catch` blocks for asynchronous operations and handle errors gracefully.

## Frontend (Vue.js)

The frontend is a Vue.js application built with Vue CLI.

### Commands

- **Run the development server:**
  ```bash
  npm run serve
  ```

- **Build for production:**
  ```bash
  npm run build
  ```

- **Lint files:**
  ```bash
  npm run lint
  ```

- **Run unit tests:**
  ```bash
  npm run test:unit
  ```

- **Run a single unit test:**
  ```bash
  npm run test:unit -- <path/to/test/file.spec.js>
  ```

### Code Style

The frontend uses ESLint with the `plugin:vue/vue3-essential` preset.

- **Imports:** Use ES6 `import/export` syntax.
- **Formatting:** Adhere to the Prettier defaults, which are likely configured in the project. Use 2 spaces for indentation.
- **Types:** This project does not use TypeScript. Use JSDoc for documenting component props and events.
- **Naming Conventions:**
  - Components should be named in `PascalCase`.
  - Use `camelCase` for variables and functions.
- **Vue Specifics:**
  - Component names should be multi-word (e.g., `MyComponent.vue`), although this rule is currently disabled in the ESLint configuration. It's still good practice to follow it.
  - Use `v-on` shorthand (`@`) for events and `v-bind` shorthand (`:`) for props.

## General Guidelines

- **Commit Messages:** Follow conventional commit message standards.
- **Dependencies:** When adding new dependencies, use `npm install --save` for production dependencies and `npm install --save-dev` for development dependencies.
- **Secrets:** Do not commit any secrets or API keys to the repository. Use environment variables.
