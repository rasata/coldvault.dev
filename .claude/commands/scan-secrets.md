---
description: Secrets pass only — gitleaks + trufflehog + detect-secrets + ggshield
---

Invoke `secrets-hunter` skill. Runs `scripts/scan-secrets.sh`.
Output: `reports/secrets-*.{sarif,json}` and a consolidated section in
`reports/SUMMARY.md`.

Never run trufflehog with `--verification` unless the user explicitly asks —
verification beacons the provider.
