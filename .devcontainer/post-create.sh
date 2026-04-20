#!/usr/bin/env bash
# coldvault.dev — ZONOVA RESEARCH
# post-create: warm caches, refresh signatures, verify stack
set -euo pipefail

say() { printf "\033[1;36m[post-create]\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[warn]\033[0m %s\n" "$*"; }

say "Refreshing ClamAV signatures (best-effort, may fail offline)…"
sudo systemctl stop clamav-freshclam 2>/dev/null || true
sudo freshclam --quiet || warn "ClamAV signature refresh failed — re-run later with: sudo freshclam"

say "Warming Semgrep registry cache…"
semgrep --version >/dev/null 2>&1 || warn "semgrep not on PATH"

say "Warming Trivy DB (best-effort)…"
trivy image --download-db-only 2>/dev/null || warn "Trivy DB refresh skipped"

say "Warming OSV-Scanner db…"
osv-scanner --version >/dev/null || true

say "Checking Claude Code CLI…"
if command -v claude >/dev/null 2>&1; then
  printf "  \033[1;32m✓\033[0m claude %s\n" "$(claude --version 2>/dev/null || echo '?')"
else
  printf "  \033[1;31m✗\033[0m claude CLI missing — image build did not bake it in correctly.\n"
  exit 1
fi

say "Verifying core tools…"
for bin in \
    claude gitleaks trufflehog semgrep bandit safety pip-audit \
    gosec govulncheck staticcheck cppcheck flawfinder \
    cargo-audit cargo-deny \
    trivy grype syft osv-scanner dependency-check \
    tfsec terrascan checkov hadolint dockle kubesec \
    yara capa binwalk clamscan \
    npm retire snyk eslint
do
  if command -v "$bin" >/dev/null 2>&1; then
    printf "  \033[1;32m✓\033[0m %s\n" "$bin"
  else
    printf "  \033[1;31m✗\033[0m %s (missing)\n" "$bin"
  fi
done

say "Ensuring reports/ exists and is gitignored…"
mkdir -p reports
touch reports/.gitkeep

say "Done. Next steps:"
cat <<'EOF'

  1) Authenticate GitHub:     gh auth login
  2) Authenticate Claude:     claude login
  3) Add suspect repo:        git submodule add <url> target/
  4) Launch Claude audit:     claude
     → then: /audit

EOF
