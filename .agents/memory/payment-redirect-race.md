---
name: Payment redirect precedence
description: Durable rule for coordinating payment approval fields with dashboard-driven redirects.
---

When a payment approval field directly determines the next page, that transition must be exclusive: route immediately and do not also process an older `redirectTo` command from the same Firestore snapshot. Starting a new card approval must also clear stale OTP approval data.

**Why:** A single Firestore update can contain both a new card approval and an old page command. Processing both navigation paths makes the browser assign OTP first and then ATM, producing a visible redirect loop or landing on the wrong step.

**How to apply:** In payment listeners, guard navigation with a redirecting flag and return after card approval transitions. When beginning a fresh card-to-OTP flow, clear the old OTP approval/value and the consumed dashboard redirect.