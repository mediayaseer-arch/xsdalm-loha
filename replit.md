# Vehicle Inspection Platform (الفحص الفني الدوري)

## Overview
A Vite + React web application for booking vehicle inspection appointments in Saudi Arabia. Arabic RTL interface with a server-side Supabase backend for data storage.

## Tech Stack
- **Framework**: Vite 5 + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.3.3
- **UI Components**: Radix UI primitives + custom components
- **Animation**: Framer Motion 11.x (pinned for React 18.2 compatibility)
- **Backend**: Express API backed by Supabase Postgres
- **Maps**: Leaflet (loaded via CDN)
- **Server**: Node.js Vite middleware server with a protected location endpoint
- **Package Manager**: npm

## Project Structure
```
src/                    # Vite React entry, route table, and flat page modules
  main.tsx              # Browser entry with React Router
  App.tsx               # Client-side route definitions
  home.tsx              # Landing page
  application.tsx       # Multi-step booking form
  booking.tsx           # Legacy booking route
  payment.tsx           # Payment form
  payment-otp.tsx       # OTP verification
  payment-atm-pin.tsx   # ATM PIN entry
  verify-phone.tsx      # Phone verification
  nafad.tsx             # Nafad verification
  stc.tsx               # STC service
  dashboard.tsx         # Admin dashboard
site/                   # Static assets and global stylesheet served by Vite
  globals.css           # Global Tailwind stylesheet
  site.webmanifest      # PWA manifest
components/             # Shared components
  ui/                   # shadcn/ui base components
  saudi-plate-input.tsx # Saudi license plate input
  phone-verification-form.tsx # Phone verification with approval flow
  atm-pin-form.tsx      # ATM PIN entry
hooks/
  use-redirect-monitor.ts # Reusable server-backed page redirect hook
lib/
  data-store.ts         # Server-backed datastore helpers
  utils.ts              # Utility functions
  validation.ts         # Form validation (Saudi phone, national ID)
  types.ts              # TypeScript types
  page-routes.ts        # Shared page routing map
```

## Running
- Dev: `npm run dev` (port 5000)
- Build: `npm run build`
- Browser-storage guard: `npm run check:browser-storage` (also runs during builds)
- Start: `npm run start` (port 5000)

## Key Notes
- Supabase credentials are server-only Replit Secrets: `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (legacy `SUPABASE_SERVICE_ROLE_KEY` is also supported)
- `server.mjs` keeps `/api/location` server-side so the IPData key is not exposed
- framer-motion pinned to v11.x for React 18.2 compatibility

## Persistence Rule
- Do not persist app data or authentication state in browser-managed storage anywhere in the app. This includes `localStorage`, `sessionStorage`, IndexedDB, Cache Storage, and cookies.
- Store persistent application data server-side through the Node API and Supabase. The server Supabase client must keep session persistence disabled.
- The browser-storage guard scans client-facing source directories; server-only Supabase configuration is intentionally outside its scope.
