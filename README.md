# Adal Uganda Company Limited

A Vite + React + TypeScript website for Adal Uganda Company Limited, focused on LPG cooking gas distribution and delivery ordering for Mbarara, Uganda.

## Project structure

- `src/` – React UI source files
- `src/data/products.ts` – product catalog, delivery zones, and product metadata
- `src/components/` – reusable UI sections such as the order form, product catalog, contact section, and footer
- `public/assets/` – static assets used by the frontend

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Current frontend stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Lucide icons
- local product and delivery zone data

## Order flow

The frontend currently supports a product catalog, a delivery zone selector, a customer order form, and a WhatsApp order flow.

The expected future backend structure should include:

- Express API to accept order submissions
- PostgreSQL tables for products, customers, orders, order items, and delivery zones
- order validation and persistence

## Local development

```bash
cd adal-ug
npm install
npm run dev
```

## Production build

```bash
cd adal-ug
npm run build
```
