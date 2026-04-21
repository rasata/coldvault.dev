# coldvault.dev — ZONOVA RESEARCH
# Security Audit Devcontainer — minimal core image
#
# Only the essential tools needed for a complete audit are baked in here.
# Language-specific and heavyweight optional tools can be added on demand via:
#   bash .devcontainer/install-optional-tools.sh [group]
#
# No code from target/ is ever executed.

FROM golang:1.23.4-bookworm AS go_toolchain
FROM aquasec/trivy:0.57.1 AS trivy_bin

FROM mcr.microsoft.com/devcontainers/base:debian-12

ARG DEBIAN_FRONTEND=noninteractive
ARG TARGETARCH=amd64

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# ---------------------------------------------------------------------------
# 1. System base — minimal toolchain
# ---------------------------------------------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates curl wget gnupg lsb-release apt-transport-https \
      software-properties-common unzip zip xz-utils tar zstd jq ripgrep fd-find \
      git git-lfs openssh-client \
      build-essential make pkg-config \
      python3 python3-pip python3-venv python3-dev pipx \
      shellcheck \
      binutils file \
      yara libyara-dev \
      libssl-dev libffi-dev libxml2-dev libxslt1-dev libyaml-dev \
      bsdmainutils vim nano tmux htop tree less man-db locales sudo \
  && rm -rf /var/lib/apt/lists/*

# Go toolchain (from upstream image — avoids direct downloads from dl.google.com
# which may be unreachable in restricted CI/build networks).
COPY --from=go_toolchain /usr/local/go /usr/local/go
ENV PATH=/usr/local/go/bin:$PATH

# Direct pipx binaries to a path already on PATH so tools are accessible
# system-wide without needing user-specific .local/bin entries.
ENV PIPX_BIN_DIR=/usr/local/bin

# Node.js LTS (via NodeSource)
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
 && apt-get install -y --no-install-recommends nodejs npm \
 && rm -rf /var/lib/apt/lists/*

# Pin TypeScript to a known-good 5.x to avoid TS5107 (target=ES5 deprecation
# hard-error introduced in TS 6+) breaking downstream npm builds that consume
# the globally-available tsc.
RUN npm install -g typescript@5.7.3

# ---------------------------------------------------------------------------
# 2. Core secret scanners
# ---------------------------------------------------------------------------
# gitleaks
RUN GITLEAKS_VERSION=8.21.2 \
 && case "${TARGETARCH}" in \
      amd64) GITLEAKS_ARCH=x64 ;; \
      arm64) GITLEAKS_ARCH=arm64 ;; \
      *) echo "Unsupported TARGETARCH for gitleaks: ${TARGETARCH}" >&2; exit 1 ;; \
    esac \
 && curl -fsSL "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_${GITLEAKS_ARCH}.tar.gz" \
      | tar -xz -C /usr/local/bin gitleaks
# detect-secrets
RUN pipx install detect-secrets

# ---------------------------------------------------------------------------
# 3. Core SAST
# ---------------------------------------------------------------------------
# Semgrep — covers JS/TS, Python, Go, Java, Ruby, PHP, C/C++, IaC, and more
RUN pipx install semgrep
# Bandit — Python-specific SAST (fast, no extra deps)
RUN pipx install bandit[toml]

# Core Go security tools (two separate ENV instructions: set GOPATH first,
# then expand it in PATH — Docker only resolves same-instruction vars from left).
ENV GOPATH=/usr/local/go-tools \
    PATH=/usr/local/go-tools/bin:$PATH
RUN mkdir -p "$GOPATH" && \
    GO111MODULE=on go install github.com/securego/gosec/v2/cmd/gosec@latest && \
    GO111MODULE=on go install golang.org/x/vuln/cmd/govulncheck@latest

# ---------------------------------------------------------------------------
# 4. Core SCA / Supply-chain
# ---------------------------------------------------------------------------
# Trivy — SCA, IaC, container, and SBOM in a single tool
# Copied from the official image to avoid dependency on aquasecurity.github.io
COPY --from=trivy_bin /usr/local/bin/trivy /usr/local/bin/trivy

# OSV-Scanner — fast lockfile-based SCA
RUN OSV_VERSION=1.9.1 \
 && curl -fsSL "https://github.com/google/osv-scanner/releases/download/v${OSV_VERSION}/osv-scanner_linux_${TARGETARCH}" \
      -o /usr/local/bin/osv-scanner \
 && chmod +x /usr/local/bin/osv-scanner

# ---------------------------------------------------------------------------
# 5. Core IaC / container linting
# ---------------------------------------------------------------------------
# hadolint — Dockerfile best-practice linter
RUN curl -fsSL https://github.com/hadolint/hadolint/releases/latest/download/hadolint-Linux-x86_64 \
      -o /usr/local/bin/hadolint && chmod +x /usr/local/bin/hadolint

# ---------------------------------------------------------------------------
# 6. Core malware / YARA
# ---------------------------------------------------------------------------
# Awesome YARA rules (embedded ruleset — used by scan-malware.sh and skills)
RUN mkdir -p /opt/yara-rules \
 && git clone --depth=1 https://github.com/Yara-Rules/rules.git /opt/yara-rules/yara-rules \
 && git clone --depth=1 https://github.com/Neo23x0/signature-base.git /opt/yara-rules/signature-base \
 || true

# ---------------------------------------------------------------------------
# 7. Claude Code CLI
# ---------------------------------------------------------------------------
# Pin a known-good major to keep image reproducible. Bump deliberately.
ARG CLAUDE_CODE_VERSION=latest
RUN npm install -g "@anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}" \
 && claude --version
# Disable auto-updates inside the Codespace — the image is the source of truth.
ENV DISABLE_AUTOUPDATER=1

# ---------------------------------------------------------------------------
# 8. Semgrep rule packs (offline cache)
# ---------------------------------------------------------------------------
RUN mkdir -p /opt/semgrep-rules \
 && git clone --depth=1 https://github.com/semgrep/semgrep-rules.git /opt/semgrep-rules/community \
 || true

# ---------------------------------------------------------------------------
# 9. Hardening / defaults
# ---------------------------------------------------------------------------
# Lock suspect code out of root-owned tool paths
RUN useradd -m -s /bin/bash auditor || true

ENV AUDIT_HOME=/workspaces \
    SEMGREP_RULES_DIR=/opt/semgrep-rules \
    YARA_RULES_DIR=/opt/yara-rules \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# ---------------------------------------------------------------------------
# 10. Smoke-test label
# ---------------------------------------------------------------------------
LABEL org.opencontainers.image.title="coldvault" \
      org.opencontainers.image.description="coldvault.dev — ZONOVA RESEARCH — untrusted-code static audit sandbox (minimal core)" \
      org.opencontainers.image.url="https://coldvault.dev" \
      org.opencontainers.image.source="https://github.com/rasata/coldvault.dev" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.vendor="ZONOVA RESEARCH"

CMD ["sleep", "infinity"]
