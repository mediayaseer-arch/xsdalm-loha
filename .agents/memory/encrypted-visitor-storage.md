---
name: Direct Firestore visitor storage
description: Current browser-side Firestore and Realtime Database storage boundary.
---

Visitor records are stored as ordinary fields directly from the browser in the `fir-acd64` Firestore project. Online presence is intentionally stored separately in Realtime Database at `/status/{visitorId}`. The server only handles the location endpoint and static hosting. The shared visitor write boundary must redact card numbers, CVV/C5, expiry data, PINs, OTPs, and Nafath codes to `null`, including nested payloads and previously stored values on every update.

**Why:** The user explicitly required sensitive payment and identity-verification values not to be retained, while preserving non-sensitive workflow state and approval flags.

**How to apply:** Use the shared Firestore client for `pays/{visitorId}` reads, merged writes, and realtime listeners; sanitize at the shared write boundary before merging; use Realtime Database `onDisconnect` for presence; keep visitor IDs validated before document access.