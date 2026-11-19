#!/usr/bin/env bash
# Pre-publish hygiene gate: fails if the folder contains absolute paths,
# local environment references, author customizations, or foreign project
# names.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

fail=0

# The path list below covers what is published via package.json#files, plus
# package.json and .gitignore, included in the check as a precaution.
check() {
  local label="$1" pattern="$2"
  shift 2
  local hits
  hits="$(grep -rInE "$pattern" "$@" 2>/dev/null || true)"
  if [ -n "$hits" ]; then
    printf 'HYGIENE FAIL [%s]:\n%s\n' "$label" "$hits"
    fail=1
  fi
}

# Absolute paths from any file system
check 'absolute-path' '/Users/|/home/|/private/var/|/var/folders/|(^|[^[:alnum:]_])/tmp/' \
  src skills README.md package.json .gitignore LICENSE 2>/dev/null || true
# Home referenced by expansion or literal
check 'home-ref' '\$\{HOME\}|\$HOME|~/|\$TMPDIR|\$\{TMPDIR' \
  src skills README.md package.json .gitignore LICENSE 2>/dev/null || true
# Author customizations / foreign project names
check 'custom-ref' '@executor|opencode-go|deepseek|glm-|on my client|verified on the client' \
  src skills README.md package.json .gitignore LICENSE 2>/dev/null || true

if [ "$fail" -ne 0 ]; then
  echo 'HYGIENE: FAIL'
  exit 1
fi

echo 'HYGIENE: PASS'
