# Vehicle Inspection Platform

Arabic RTL vehicle inspection booking flow built with Vite, React, TypeScript, Tailwind CSS, and a server-side Supabase datastore.

## Getting Started

Run the development server:

```bash
npm run dev
```

The app is served on port 5000. The Vite/Node server also preserves the server-side `/api/location` endpoint.

## Scripts

- `npm run dev` — start Vite with the Node middleware server
- `npm run build` — create the production bundle in `dist/`
- `npm run start` — serve the production bundle on port 5000
- `npm run lint` — run TypeScript checks

## Structure

- `src/` — Vite entry, React Router route table, and flat page modules
- `site/` — static assets and global stylesheet served by Vite
- `components/` — shared UI and form components
- `lib/` — datastore helpers, validation, route mapping, and navigation helpers