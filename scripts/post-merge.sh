#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Reproduce the lockfile exactly after a task merge.
npm ci --no-audit --no-fund