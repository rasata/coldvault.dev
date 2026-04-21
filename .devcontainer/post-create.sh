#!/usr/bin/env bash
# coldvault.dev — ZONOVA RESEARCH
# post-create: warm caches, verify core tool stack
set -euo pipefail

say() { printf "\033[1;36m[post-create]\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[warn]\033[0m %s\n" "$*"; }

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
    claude gitleaks detect-secrets \
    semgrep bandit \
    gosec govulncheck \
    trivy osv-scanner \
    hadolint \
    yara \
    npm
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

  Optional tools (Rust, Java, PHP, Ruby, C/C++, extra scanners):
     bash .devcontainer/install-optional-tools.sh           # install all
     bash .devcontainer/install-optional-tools.sh rust sca  # specific groups

EOF
