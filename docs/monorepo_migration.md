# Monorepo Migration Guide

We have successfully migrated the project to an **npm workspaces** monorepo setup.

## Folder Structure Changes
1. Created an `apps` directory at the root.
2. Moved the **Node.js backend** files (e.g., `index.js`, `prisma`, `src`, etc.) to `apps/backend/`.
3. Moved the **React Native app** (`bsa`) to `apps/mobile/`.
4. A new root `package.json` was created to manage dependencies and define the monorepo workspaces (`apps/*`).

## How to Run Your Project

Since the project is now a monorepo, you can start your apps directly from the **root directory** using the new npm scripts.

**Important:** Before you run for the first time, make sure your old local servers are completely stopped (press `Ctrl+C` in any terminals that were running them), and install the dependencies from the root.

### 1. Install Dependencies
Run this command from the **root directory** (`c:\MOB\BSA`):
```bash
npm install
```
*npm will automatically install and link packages for both the backend and mobile apps.*

### 2. Start Both Apps (Dev Mode)
To start both the backend server and the mobile app simultaneously:
```bash
npm run dev
```

### 3. Start Apps Individually
If you want to start them in separate terminals:
- **Start Backend:** `npm run start:backend`
- **Start Mobile:** `npm run start:mobile`

## Troubleshooting
If you encounter any module resolution errors or "port already in use" errors:
1. Ensure no old terminal tabs are still running the old node processes.
2. Delete `node_modules` folders manually if you encounter strange errors:
   - Delete `node_modules` in root, `apps/backend`, and `apps/mobile`.
   - Run `npm install` again at the root.
