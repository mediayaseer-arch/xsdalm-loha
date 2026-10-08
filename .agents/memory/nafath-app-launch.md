---
name: Nafath app launch
description: Decision and fallback behavior for opening the official Nafath mobile app from the web page.
---

The Nafath page should try to open the installed app with `nafath://`; Android additionally uses an Intent targeting the official package. If the app does not open, send iOS users to the official App Store listing, Android users to Google Play, and other devices to the official Nafath download page.

**Why:** The official store listings and download page are available, but no public official documentation was found for a platform-specific deep link or request URL.

**How to apply:** Keep the app-launch action user-initiated, detect iOS/Android from the browser, and use a short visibility-aware fallback timer so an opened app is not redirected to the store.