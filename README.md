# Adal Uganda Company Limited

A Vite + React + Express + PostgreSQL website for Adal Uganda Company Limited, focused on LPG cooking gas distribution, product catalogue management and delivery ordering.

## Full-stack architecture

- `src/` – React frontend
- `routes/` – Express API route definitions
- `controllers/` – API/business logic
- `middleware/adminAuth.js` – protected administrator sessions
- `db/postgres.js` – PostgreSQL connection and schema initialization
- `public/uploads/` – uploaded product images served by Express
- `server.js` – production Express server that serves both the API and built React app

The public catalogue reads from `GET /api/products`. The admin dashboard writes product details through the protected product APIs. Uploaded images are stored by the Express upload endpoint and the selected image is synchronized to the matching product record, so the public catalogue receives the same image, price and description from the database.

## Scripts

```bash
npm install
npm run dev
npm run build
npm start
npm run test:e2e
npm run lint
```

For local development, Vite runs the frontend on port 3000 and proxies API requests to Express on port 3001. For production, Express serves the compiled `dist` directory and the `/api` endpoints from the same origin.

## Administrator login

Set these environment variables on the production server before logging in:

```text
ADMIN_USERNAME=<your-admin-username>
ADMIN_PASSWORD=<your-strong-admin-password>
DATABASE_URL=<your-postgresql-connection-string>
NODE_ENV=production
```

Open the website's Admin Portal, enter the configured username and password, and sign in. The session token expires after 8 hours. Do not commit production credentials to GitHub.

If production credentials are missing, the API intentionally returns a clear configuration error instead of allowing the default development password.

## Admin stock workflow

1. Sign in to the Admin Portal.
2. Open **Inventory** → **Add new stock**.
3. Enter product code, name, size, category, price and description.
4. Select a JPEG, PNG or WebP product image (maximum 5 MB), or provide an image URL.
5. Save the stock item.
6. The backend stores the product in PostgreSQL and the image in the upload directory; the public catalogue then reads the updated product through `GET /api/products`.
7. Use **Edit** to update stock or **Delete** to remove it.

## Deployment

Use a Node/Express web service rather than a static-only hosting service because the application needs the Express API, PostgreSQL connection and authenticated image uploads.

A typical production configuration is:

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Environment: `NODE_ENV=production`
- Required secrets: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`

The included CI workflow runs TypeScript checking, the frontend build and an end-to-end PostgreSQL API smoke test.
