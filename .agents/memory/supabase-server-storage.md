---
name: Server-side Supabase storage
description: Runtime requirements and boundaries for this app's Supabase datastore.
---

The application datastore must be accessed through the Node server using `SUPABASE_URL` and a server-only `SUPABASE_SECRET_KEY` (with the legacy service-role name supported as fallback). The Supabase MCP connection is useful for agent database operations but cannot be called by deployed application code.

**Why:** The browser must not receive privileged database credentials, and Replit's Supabase MCP connection is not an application SDK connection.

**How to apply:** Keep Supabase client creation in server-only modules, expose narrow relative `/api` routes to the browser, and fail startup explicitly when the URL or server key is absent or malformed.