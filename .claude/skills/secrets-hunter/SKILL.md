---
name: secrets-hunter
description: Find credentials, API keys, tokens, private keys, and high-entropy strings in target/. Combines gitleaks, trufflehog, detect-secrets, ggshield, and manual entropy grep. Triages each hit for live vs. test vs. revoked.
license: MIT (ZONOVA RESEARCH — coldvault.dev)
---

# secrets-hunter

## Run

```bash
# 1. gitleaks — rules are pattern-based, fast, covers git history too
gitleaks detect --source target --no-git --report-format sarif \
  --report-path reports/secrets-gitleaks.sarif

gitleaks detect --source target --report-format sarif \
  --report-path reports/secrets-gitleaks-history.sarif || true

# 2. trufflehog — can verify AWS / GitHub / Slack / Stripe tokens against the
#    provider's API. DISABLE verification unless the analyst opts in, to avoid
#    telemetry / beacons.
trufflehog filesystem target --json --no-verification > reports/secrets-trufflehog.json

# 3. detect-secrets — Python-first, lower FP rate for private keys
detect-secrets scan target > reports/secrets-detect.json

# 4. ggshield — GitGuardian rules (very broad)
ggshield secret scan path -r --json target > reports/secrets-ggshield.json || true
```

## Triage rubric

For every candidate secret:

| Signal                                        | Severity |
|-----------------------------------------------|----------|
| Matches a real regex + high entropy + in a non-test path | HIGH     |
| Matches a real regex + in a test / example    | LOW (report anyway) |
| Verified live (trufflehog `--verification`)   | CRITICAL |
| In git history but not in HEAD                | MEDIUM (rotation still required) |
| `.env.example`, fake-looking                  | INFO (don't report) |

## Categories to surface

- AWS / GCP / Azure access keys
- GitHub PATs (`ghp_…`), GitLab tokens, SSH private keys (`-----BEGIN …`)
- Database connection strings with password
- JWT signing secrets
- Stripe, Twilio, SendGrid, Slack webhook URLs
- `.npmrc` `//registry.npmjs.org/:_authToken`
- Container registry creds in `~/.docker/config.json`
- Hardcoded cryptographic keys in source

## Never do this

- **Never** run verification (`trufflehog --only-verified` without `--no-verification`)
  without explicit analyst consent — it can tip off the attacker (telemetry),
  and can cost real money on some providers.
- **Never** copy the actual secret value into `reports/` — redact to first/last
  4 chars: `ghp_ABCD…WXYZ`.
- **Never** commit `reports/` (enforced by `.gitignore`).
