---
name: Package firewall compatibility
description: Replit package-firewall behavior and safe dependency recovery for this workspace.
---

When npm installation is blocked by the Replit package firewall, update the blocked package to a compatible safe patch release or update the direct parent dependency. Use npm overrides only when the parent range remains compatible, and keep the lockfile aligned.

**Why:** Reinstalling the original lockfile can fail on stale transitive tarballs even when the application itself is valid. Bypassing the firewall is not an acceptable recovery path.

**How to apply:** Check the blocked package and its dependency chain, choose the newest compatible release accepted by the firewall, update `package.json`/`package-lock.json`, then rerun the configured post-merge setup and restart the workflow.