#!/usr/bin/env bash
set -euo pipefail

AUDIT_FILE="yarn-audit-current"
KNOWN_FILE="yarn-audit-known-issues"

command -v yarn >/dev/null 2>&1 || { echo "yarn missing"; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "jq missing"; exit 1; }

yarn npm audit --recursive --environment production --json > "$AUDIT_FILE" || true

normalize () {
  jq -s -c '
    .[]
    | .. | objects
    | select(has("children"))
  ' "$1" | sort -u
}

normalize "$AUDIT_FILE" > current.txt

if [ -f "$KNOWN_FILE" ]; then
  normalize "$KNOWN_FILE" > known.txt
else
  : > known.txt
fi

comm -23 current.txt known.txt > new.txt

if [ -s new.txt ]; then
  echo "❌ New vulnerabilities detected:"
  cat new.txt
  exit 1
fi

echo "✅ No new vulnerabilities"