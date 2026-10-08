# Threat Model

## Project Overview

This is a **phishing kit** — a criminal application that impersonates Saudi government services (SASO vehicle inspections and the Nafad national identity system) to steal financial credentials from Saudi residents in real time. It is built with Next.js 13 (App Router), TypeScript, Tailwind CSS, and Firebase (Firestore + Realtime Database).

The application is **not** a legitimate vehicle inspection platform. Its purpose is to deceive victims into submitting credit card numbers, CVV codes, ATM PINs, OTPs, Saudi national ID numbers, and phone numbers, which are stored in Firebase and acted upon in real time by the operator via a live dashboard.

## Assets

- **Victim financial credentials** — credit card numbers, expiry dates, CVV codes, ATM PINs, bank OTPs. Stored unencrypted in Firestore (`pays` collection). Primary target of the phishing operation.
- **Victim identity data** — Saudi national ID numbers, phone numbers, telecom carrier. Stored in the same Firestore documents.
- **Nafad authentication tokens** — OTPs and confirmation codes from Saudi Arabia's national identity verification system (`nafadOtp`, `nafadConfirmationCode` fields).
- **Firebase credentials** — project API key, database URL, project ID. Hardcoded in `lib/firebase.ts` and exposed in the client bundle; effectively the key to all victim data.
- **IPData API key** — stored in `.replit` shared config; used to track victim geography.
- **Operator dashboard** — the `/dashboard` route is the attacker's control panel, with no authentication.

## Trust Boundaries

- **Browser to Firebase (Firestore)** — Victims write data directly to Firestore from the browser using the hardcoded API key. There is no server-side validation or authentication of these writes.
- **Operator to Firebase** — The operator reads and writes Firestore from `/dashboard` with no authentication. Any third party who discovers the URL or the API key has the same access.
- **Firebase to victim browser (real-time channel)** — The attacker pushes commands (approval state changes, confirmation codes) to the victim's browser in real time via Firestore `onSnapshot` listeners. This is the OTP relay mechanism.
- **Server-side API (`/api/location`)** — A Next.js API route calls IPData using a hardcoded key to geolocate visitors.

## Scan Anchors

- **Production entry points:** `app/` directory; Next.js App Router. All routes are public.
- **Highest-risk areas:** `app/dashboard/page.tsx` (operator panel, no auth), `lib/firebase.ts` (hardcoded credentials), `app/payment/page.tsx`, `components/atm-pin-form.tsx`, `app/nafad/page.tsx`.
- **Public surface:** All routes — `/`, `/application`, `/payment`, `/payment/atm-pin`, `/payment/otp`, `/nafad`, `/verify-phone`, `/stc`, `/dashboard` — are unauthenticated and publicly reachable.
- **Admin surface:** `/dashboard` — intended for the operator, but has no authentication.
- **Dev-only areas:** None identified; all code appears production-intended.

## Threat Categories

### Spoofing

The entire application is a spoofing attack: it impersonates SASO (Saudi Standards authority) and the Nafad national identity app to deceive victims. The real threat here runs in reverse — the operator has no authentication on the dashboard, so any third party can also impersonate the operator.

### Tampering

Any party with the Firebase API key (i.e., anyone who views the page source) can write arbitrary data to any Firestore document, including forging victim records or corrupting the operator's view.

### Information Disclosure

All victim credentials (card numbers, CVV, ATM PINs, OTPs, national IDs) are stored unencrypted in Firestore. The Firebase API key is exposed in the browser bundle. The operator dashboard is unauthenticated. Any person who discovers the `/dashboard` URL or the Firebase credentials can read all stolen data.

### Elevation of Privilege

The dashboard performs privileged actions (controlling victim flows, exporting card data, deleting records) with no authentication. Any anonymous user can access it. The hardcoded Firebase credentials grant the same Firestore access as the operator.

### Denial of Service

No rate limiting exists on any data submission endpoint. The Firestore write paths (`addData`, `setDoc`) are called directly from the client on every form submission without any server-side gating.
