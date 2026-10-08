---
name: Vite toolchain compatibility
description: Version choice for Vite migrations in this workspace.
---

Vite 5 with the React plugin 4 is the compatible baseline for this project’s current React 18 and Node type versions. Newer Vite releases may require a newer `@types/node` peer range.

**Why:** The latest Vite install was blocked by the existing pinned Node types, while the Vite 5 toolchain installed and built cleanly without forcing peer resolution.

**How to apply:** Prefer the Vite 5-compatible package set for follow-up work unless the Node type baseline is intentionally upgraded first.