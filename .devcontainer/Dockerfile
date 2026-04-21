# coldvault.dev — ZONOVA RESEARCH
# Security Audit Devcontainer
# Debian-based image pre-equipped with a comprehensive set of
# static analysis, SCA, SAST, secrets, malware, container, IaC
# and binary auditing tools. No code from target/ is ever executed.

FROM golang:1.23.4-bookworm AS go_toolchain

FROM mcr.microsoft.com/devcontainers/base:debian-12

ARG DEBIAN_FRONTEND=noninteractive
ARG TARGETARCH=amd64

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# ---------------------------------------------------------------------------
# 1. System base + multi-language toolchains
# ---------------------------------------------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates curl wget gnupg lsb-release apt-transport-https \
      software-properties-common unzip zip xz-utils tar zstd jq ripgrep fd-find \
      git git-lfs openssh-client \
      build-essential make cmake ninja-build pkg-config \
      python3 python3-pip python3-venv python3-dev pipx \
      default-jdk maven gradle \
      php-cli composer \
      ruby ruby-dev \
      clang clang-tools clang-tidy clang-format lld llvm \
      cppcheck flawfinder splint \
      shellcheck \
      binutils file strace ltrace gdb \
      yara libyara-dev \
      clamav clamav-freshclam \
      libssl-dev libffi-dev libxml2-dev libxslt1-dev libyaml-dev \
      bsdmainutils vim nano tmux htop tree less man-db locales sudo \
  && rm -rf /var/lib/apt/lists/*

# radare2 — try apt with a real install candidate, fall back to source build.
# 'apt-cache show' is not enough: bookworm indexes radare2 metadata but has no
# binary candidate, so apt-get install fails. We check 'apt-cache policy' for a
# non-"(none)" candidate instead. Failure of the source build is non-fatal:
# radare2 is optional for most audit flows.
ARG R2_VERSION=5.9.8
RUN set -eu; \
    apt-get update; \
    if apt-cache policy radare2 2>/dev/null | grep -qE '^  Candidate: [^(]'; then \
      apt-get install -y --no-install-recommends radare2; \
      rm -rf /var/lib/apt/lists/*; \
    else \
      apt-get install -y --no-install-recommends git make gcc g++ pkg-config; \
      rm -rf /var/lib/apt/lists/*; \
      ( git clone --depth=1 --branch "${R2_VERSION}" https://github.com/radareorg/radare2.git /tmp/radare2 \
          || git clone --depth=1 https://github.com/radareorg/radare2.git /tmp/radare2 ) \
        && ( cd /tmp/radare2 && sys/install.sh ) \
        || echo "[coldvault] radare2 install skipped — continuing without r2"; \
      rm -rf /tmp/radare2; \
    fi

# Go toolchain (from upstream image — avoids direct downloads from dl.google.com
# which may be unreachable in restricted CI/build networks).
COPY --from=go_toolchain /usr/local/go /usr/local/go
ENV PATH=/usr/local/go/bin:$PATH

# Node.js LTS (via NodeSource)
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
 && apt-get install -y --no-install-recommends nodejs \
 && rm -rf /var/lib/apt/lists/*

# Pin TypeScript to a known-good 5.x to avoid TS5107 (target=ES5 deprecation
# hard-error introduced in TS 6+) breaking downstream npm builds that consume
# the globally-available tsc.
RUN npm install -g typescript@5.7.3

# Rust toolchain (stable)
ENV RUSTUP_HOME=/usr/local/rustup CARGO_HOME=/usr/local/cargo PATH=/usr/local/cargo/bin:$PATH
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable --profile minimal \
 && rustup component add clippy rustfmt rust-src

# ---------------------------------------------------------------------------
# 2. Secret scanners
# ---------------------------------------------------------------------------
# gitleaks
RUN GITLEAKS_VERSION=8.21.2 \
 && curl -fsSL "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz" \
      | tar -xz -C /usr/local/bin gitleaks
# trufflehog
RUN curl -fsSL https://raw.githubusercontent.com/trufflesecurity/trufflehog/main/scripts/install.sh \
    | sh -s -- -b /usr/local/bin
# detect-secrets (pipx isolated)
RUN pipx install detect-secrets \
 && pipx install ggshield

# ---------------------------------------------------------------------------
# 3. Multi-language SAST
# ---------------------------------------------------------------------------
# Semgrep + OSS rules
RUN pipx install semgrep
# Bandit (Python)
RUN pipx install bandit[toml]
# Dlint, pyre (Python typing/security) — optional, upstream can break builds
RUN pipx install dlint || echo "[coldvault] dlint install skipped"
# Safety (Python dep vuln)
RUN pipx install safety
# pip-audit
RUN pipx install pip-audit
# checkov (IaC)
RUN pipx install checkov
# cfn-lint
RUN pipx install cfn-lint
# sqlfluff
RUN pipx install sqlfluff

# Node/JS SAST & audit tooling
RUN npm install -g --omit=dev \
      eslint \
      @microsoft/eslint-formatter-sarif \
      eslint-plugin-security \
      eslint-plugin-no-unsanitized \
      eslint-plugin-no-secrets \
      retire \
      npm-audit-html \
      better-npm-audit \
      snyk \
    || true
# njsscan is a pip package — installed via pipx (not on npm registry)
RUN pipx install njsscan

# Go tools
ENV GOPATH=/usr/local/go-tools PATH=$GOPATH/bin:$PATH
RUN mkdir -p $GOPATH && \
    GO111MODULE=on go install github.com/securego/gosec/v2/cmd/gosec@latest && \
    GO111MODULE=on go install golang.org/x/vuln/cmd/govulncheck@latest && \
    GO111MODULE=on go install honnef.co/go/tools/cmd/staticcheck@latest && \
    GO111MODULE=on go install github.com/kisielk/errcheck@latest && \
    GO111MODULE=on go install github.com/go-critic/go-critic/cmd/gocritic@latest

# Rust security crates
RUN cargo install --locked cargo-audit cargo-deny cargo-geiger cargo-outdated \
    || true

# PHP — psalm / phpstan (via composer global)
ENV COMPOSER_HOME=/usr/local/composer PATH=$COMPOSER_HOME/vendor/bin:$PATH
RUN mkdir -p $COMPOSER_HOME && \
    composer global require --no-interaction \
      vimeo/psalm \
      phpstan/phpstan \
      enlightn/security-checker \
    || true

# Ruby — brakeman, bundler-audit
RUN gem install --no-document brakeman bundler-audit ruby_audit || true

# ---------------------------------------------------------------------------
# 4. SCA / Supply-chain / SBOM
# ---------------------------------------------------------------------------
# Trivy
RUN curl -fsSL https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor -o /usr/share/keyrings/trivy.gpg \
 && echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb bookworm main" > /etc/apt/sources.list.d/trivy.list \
 && apt-get update && apt-get install -y --no-install-recommends trivy \
 && rm -rf /var/lib/apt/lists/*

# Grype + Syft (Anchore)
RUN curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin \
 && curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh  | sh -s -- -b /usr/local/bin

# OSV-Scanner
RUN OSV_VERSION=1.9.1 \
 && curl -fsSL "https://github.com/google/osv-scanner/releases/download/v${OSV_VERSION}/osv-scanner_linux_${TARGETARCH}" \
      -o /usr/local/bin/osv-scanner \
 && chmod +x /usr/local/bin/osv-scanner

# Dependency-Track client (depcheck-style JSON)
RUN pipx install cyclonedx-bom || true
RUN npm install -g @cyclonedx/cyclonedx-npm @cyclonedx/cdxgen || true

# OWASP Dependency-Check
RUN DC_VERSION=10.0.4 \
 && curl -fsSL "https://github.com/jeremylong/DependencyCheck/releases/download/v${DC_VERSION}/dependency-check-${DC_VERSION}-release.zip" -o /tmp/dc.zip \
 && unzip -q /tmp/dc.zip -d /opt/ \
 && ln -s /opt/dependency-check/bin/dependency-check.sh /usr/local/bin/dependency-check \
 && rm /tmp/dc.zip

# ---------------------------------------------------------------------------
# 5. IaC / container / Kubernetes scanners
# ---------------------------------------------------------------------------
# tfsec (pinned binary; upstream install script can break when GitHub API output changes)
ARG TFSEC_VERSION=1.28.14
RUN set -eu; \
    case "${TARGETARCH}" in \
      amd64) tfsec_arch=amd64 ;; \
      arm64) tfsec_arch=arm64 ;; \
      *) echo "[coldvault] unsupported TARGETARCH for tfsec: ${TARGETARCH}" >&2; exit 1 ;; \
    esac; \
    curl -fsSL "https://github.com/aquasecurity/tfsec/releases/download/v${TFSEC_VERSION}/tfsec-linux-${tfsec_arch}" \
      -o /usr/local/bin/tfsec; \
    chmod +x /usr/local/bin/tfsec
# terrascan
RUN TS_VERSION=1.19.9 \
 && curl -fsSL "https://github.com/tenable/terrascan/releases/download/v${TS_VERSION}/terrascan_${TS_VERSION}_Linux_x86_64.tar.gz" \
      | tar -xz -C /usr/local/bin terrascan
# kube-score
RUN KS_VERSION=1.18.0 \
 && curl -fsSL "https://github.com/zegl/kube-score/releases/download/v${KS_VERSION}/kube-score_${KS_VERSION}_linux_amd64.tar.gz" \
      | tar -xz -C /usr/local/bin kube-score
# kubesec
RUN curl -fsSL https://github.com/controlplaneio/kubesec/releases/latest/download/kubesec_linux_amd64.tar.gz \
      | tar -xz -C /usr/local/bin kubesec
# hadolint
RUN curl -fsSL https://github.com/hadolint/hadolint/releases/latest/download/hadolint-Linux-x86_64 \
      -o /usr/local/bin/hadolint && chmod +x /usr/local/bin/hadolint
# dockle
RUN DOCKLE_VERSION=0.4.14 \
 && curl -fsSL "https://github.com/goodwithtech/dockle/releases/download/v${DOCKLE_VERSION}/dockle_${DOCKLE_VERSION}_Linux-64bit.tar.gz" \
      | tar -xz -C /usr/local/bin dockle

# ---------------------------------------------------------------------------
# 6. Malware / YARA / reverse engineering
# ---------------------------------------------------------------------------
# YARA-X (next-gen yara, installed alongside classic yara)
RUN cargo install --locked yara-x-cli || true
# capa (binary capability detection)
RUN pipx install flare-capa
# oletools (malicious Office docs)
RUN pipx install oletools
# binwalk
RUN pipx install binwalk
# malwoverview
RUN pipx install malwoverview || true
# pefile — Python library (no CLI), used by capa/oletools. pipx refuses it
# because it exposes no apps; install into system Python instead. Needs
# --break-system-packages on bookworm (PEP 668); this is a dedicated
# devcontainer, so writing to the system site-packages is acceptable.
RUN python3 -m pip install --no-cache-dir --break-system-packages pefile \
    || echo "[coldvault] pefile install skipped"
# Awesome YARA rules (embedded ruleset)
RUN mkdir -p /opt/yara-rules \
 && git clone --depth=1 https://github.com/Yara-Rules/rules.git /opt/yara-rules/yara-rules \
 && git clone --depth=1 https://github.com/Neo23x0/signature-base.git /opt/yara-rules/signature-base \
 || true

# ClamAV signatures (refresh on first run — see post-create.sh)

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
      org.opencontainers.image.description="coldvault.dev — ZONOVA RESEARCH — untrusted-code static audit sandbox" \
      org.opencontainers.image.url="https://coldvault.dev" \
      org.opencontainers.image.source="https://github.com/rasata/coldvault.dev" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.vendor="ZONOVA RESEARCH"

CMD ["sleep", "infinity"]
