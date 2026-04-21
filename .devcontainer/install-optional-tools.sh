#!/usr/bin/env bash
# coldvault.dev — ZONOVA RESEARCH
# install-optional-tools.sh
#
# Installs optional security tools that are NOT baked into the minimal core
# devcontainer image.  Run this inside a running Codespace / container.
#
# Usage:
#   bash .devcontainer/install-optional-tools.sh          # install ALL groups
#   bash .devcontainer/install-optional-tools.sh secrets  # specific group(s)
#   bash .devcontainer/install-optional-tools.sh sast sca # multiple groups
#
# Available groups:
#   secrets   — trufflehog, ggshield
#   sast      — njsscan, dlint, safety, pip-audit, cfn-lint, sqlfluff,
#               eslint + security plugins, retire, snyk,
#               staticcheck, errcheck, gocritic
#   sca       — grype, syft, dependency-check, cyclonedx-bom, cdxgen
#   iac       — tfsec, terrascan, checkov, kube-score, kubesec, dockle
#   malware   — capa, oletools, binwalk, malwoverview, pefile, clamav
#   rust      — Rust toolchain + cargo-audit, cargo-deny, cargo-geiger,
#               cargo-outdated, yara-x-cli
#   java      — default-jdk, maven, gradle
#   php       — php-cli, composer, psalm, phpstan, enlightn/security-checker
#   ruby      — ruby, brakeman, bundler-audit, ruby_audit
#   cpp       — clang, clang-tools, clang-tidy, cppcheck, flawfinder, splint
#   reverse   — radare2, gdb, strace, ltrace
#   all       — every group above (default when no argument given)

set -euo pipefail

say()  { printf "\033[1;36m[optional-tools]\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[warn]\033[0m %s\n" "$*"; }
ok()   { printf "  \033[1;32m✓\033[0m %s\n" "$*"; }

GROUPS=("$@")
if [[ ${#GROUPS[@]} -eq 0 ]]; then
  GROUPS=(secrets sast sca iac malware rust java php ruby cpp reverse)
fi

# ── helpers ────────────────────────────────────────────────────────────────

apt_install() {
  sudo apt-get update -q && sudo apt-get install -y --no-install-recommends "$@" \
    && sudo rm -rf /var/lib/apt/lists/*
}

pipx_has_package() {
  local pkg="$1"
  pipx list --short 2>/dev/null | grep -Fxq "$pkg"
}

pipx_install() {
  for pkg in "$@"; do
    if pipx_has_package "$pkg"; then
      ok "$pkg already installed via pipx"
      continue
    fi

    pipx install "$pkg" || warn "pipx install $pkg failed (non-fatal)"
  done
}

npm_g() {
  npm install -g --omit=dev "$@" || warn "npm install -g $* had errors (non-fatal)"
}

go_install() {
  for mod in "$@"; do
    GO111MODULE=on go install "$mod" || warn "go install $mod skipped"
  done
}

cargo_install() {
  for crate in "$@"; do
    cargo install --locked "$crate" || warn "cargo install $crate skipped"
  done
}

# ── groups ─────────────────────────────────────────────────────────────────

install_secrets() {
  say "Group: secrets"
  # trufflehog
  if ! command -v trufflehog &>/dev/null; then
    curl -fsSL https://raw.githubusercontent.com/trufflesecurity/trufflehog/main/scripts/install.sh \
      | sudo sh -s -- -b /usr/local/bin
    ok "trufflehog"
  fi
  # ggshield
  pipx_install ggshield
  ok "ggshield"
}

install_sast() {
  say "Group: sast"
  # Python extras
  pipx_install njsscan dlint safety pip-audit cfn-lint sqlfluff
  # JS/TS audit tooling
  npm_g eslint \
        @microsoft/eslint-formatter-sarif \
        eslint-plugin-security \
        eslint-plugin-no-unsanitized \
        eslint-plugin-no-secrets \
        retire \
        npm-audit-html \
        better-npm-audit \
        snyk
  ok "eslint + security plugins, retire, snyk"
  # Extra Go analysis tools
  go_install \
    honnef.co/go/tools/cmd/staticcheck@latest \
    github.com/kisielk/errcheck@latest \
    github.com/go-critic/go-critic/cmd/gocritic@latest
  ok "staticcheck, errcheck, gocritic"
}

install_sca() {
  say "Group: sca"
  # Grype
  if ! command -v grype &>/dev/null; then
    curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh \
      | sudo sh -s -- -b /usr/local/bin
    ok "grype"
  fi
  # Syft
  if ! command -v syft &>/dev/null; then
    curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh \
      | sudo sh -s -- -b /usr/local/bin
    ok "syft"
  fi
  # CycloneDX
  pipx_install cyclonedx-bom
  npm_g @cyclonedx/cyclonedx-npm @cyclonedx/cdxgen
  ok "cyclonedx-bom, cdxgen"
  # OWASP Dependency-Check
  if ! command -v dependency-check &>/dev/null; then
    DC_VERSION=10.0.4
    curl -fsSL "https://github.com/jeremylong/DependencyCheck/releases/download/v${DC_VERSION}/dependency-check-${DC_VERSION}-release.zip" \
      -o /tmp/dc.zip
    sudo unzip -q /tmp/dc.zip -d /opt/
    sudo ln -sf /opt/dependency-check/bin/dependency-check.sh /usr/local/bin/dependency-check
    rm /tmp/dc.zip
    ok "dependency-check ${DC_VERSION}"
  fi
}

install_iac() {
  say "Group: iac"
  # tfsec
  if ! command -v tfsec &>/dev/null; then
    TFSEC_VERSION=1.28.14
    sudo curl -fsSL \
      "https://github.com/aquasecurity/tfsec/releases/download/v${TFSEC_VERSION}/tfsec-linux-amd64" \
      -o /usr/local/bin/tfsec
    sudo chmod +x /usr/local/bin/tfsec
    ok "tfsec ${TFSEC_VERSION}"
  fi
  # terrascan
  if ! command -v terrascan &>/dev/null; then
    TS_VERSION=1.19.9
    curl -fsSL \
      "https://github.com/tenable/terrascan/releases/download/v${TS_VERSION}/terrascan_${TS_VERSION}_Linux_x86_64.tar.gz" \
      | sudo tar -xz -C /usr/local/bin terrascan
    ok "terrascan ${TS_VERSION}"
  fi
  # checkov
  pipx_install checkov
  ok "checkov"
  # kube-score
  if ! command -v kube-score &>/dev/null; then
    KS_VERSION=1.18.0
    curl -fsSL \
      "https://github.com/zegl/kube-score/releases/download/v${KS_VERSION}/kube-score_${KS_VERSION}_linux_amd64.tar.gz" \
      | sudo tar -xz -C /usr/local/bin kube-score
    ok "kube-score ${KS_VERSION}"
  fi
  # kubesec
  if ! command -v kubesec &>/dev/null; then
    curl -fsSL https://github.com/controlplaneio/kubesec/releases/latest/download/kubesec_linux_amd64.tar.gz \
      | sudo tar -xz -C /usr/local/bin kubesec
    ok "kubesec"
  fi
  # dockle
  if ! command -v dockle &>/dev/null; then
    DOCKLE_VERSION=0.4.14
    curl -fsSL \
      "https://github.com/goodwithtech/dockle/releases/download/v${DOCKLE_VERSION}/dockle_${DOCKLE_VERSION}_Linux-64bit.tar.gz" \
      | sudo tar -xz -C /usr/local/bin dockle
    ok "dockle ${DOCKLE_VERSION}"
  fi
}

install_malware() {
  say "Group: malware"
  pipx_install flare-capa oletools binwalk
  pipx install malwoverview || warn "malwoverview install skipped"
  python3 -m pip install --no-cache-dir --break-system-packages pefile \
    || warn "pefile install skipped"
  ok "capa, oletools, binwalk, pefile"
  # clamav
  apt_install clamav clamav-freshclam
  say "Refreshing ClamAV signatures…"
  sudo systemctl stop clamav-freshclam 2>/dev/null || true
  sudo freshclam --quiet || warn "ClamAV signature refresh failed — retry with: sudo freshclam"
  ok "clamav"
}

install_rust() {
  say "Group: rust"
  if ! command -v cargo &>/dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
      | sh -s -- -y --default-toolchain stable --profile minimal
    # shellcheck source=/dev/null
    source "$HOME/.cargo/env"
    rustup component add clippy rustfmt rust-src
    ok "Rust toolchain (stable)"
  fi
  cargo_install cargo-audit cargo-deny cargo-geiger cargo-outdated
  ok "cargo-audit, cargo-deny, cargo-geiger, cargo-outdated"
  # YARA-X
  cargo_install yara-x-cli
  ok "yara-x-cli"
}

install_java() {
  say "Group: java"
  apt_install default-jdk maven gradle
  ok "JDK, Maven, Gradle"
}

install_php() {
  say "Group: php"
  apt_install php-cli composer
  COMPOSER_HOME=/usr/local/composer
  sudo mkdir -p "$COMPOSER_HOME"
  sudo composer global require --no-interaction \
    vimeo/psalm phpstan/phpstan enlightn/security-checker \
    || warn "Some PHP tools skipped"
  ok "php-cli, composer, psalm, phpstan"
}

install_ruby() {
  say "Group: ruby"
  apt_install ruby ruby-dev
  sudo gem install --no-document brakeman bundler-audit ruby_audit || warn "Some Ruby gems skipped"
  ok "ruby, brakeman, bundler-audit, ruby_audit"
}

install_cpp() {
  say "Group: cpp"
  apt_install clang clang-tools clang-tidy clang-format lld llvm cppcheck flawfinder splint
  ok "clang, cppcheck, flawfinder, splint"
}

install_reverse() {
  say "Group: reverse"
  apt_install gdb strace ltrace
  # radare2 — try apt first, fall back to source build
  if ! command -v r2 &>/dev/null; then
    R2_VERSION=5.9.8
    if apt-cache policy radare2 2>/dev/null | grep -qE '^  Candidate: [^(]'; then
      apt_install radare2
    else
      ( git clone --depth=1 --branch "${R2_VERSION}" https://github.com/radareorg/radare2.git /tmp/radare2 \
          || git clone --depth=1 https://github.com/radareorg/radare2.git /tmp/radare2 ) \
        && ( cd /tmp/radare2 && sys/install.sh ) \
        || warn "radare2 source build failed — continuing without r2"
      rm -rf /tmp/radare2
    fi
    ok "radare2"
  fi
  ok "gdb, strace, ltrace"
}

# ── dispatch ───────────────────────────────────────────────────────────────

for group in "${GROUPS[@]}"; do
  case "$group" in
    secrets)  install_secrets  ;;
    sast)     install_sast     ;;
    sca)      install_sca      ;;
    iac)      install_iac      ;;
    malware)  install_malware  ;;
    rust)     install_rust     ;;
    java)     install_java     ;;
    php)      install_php      ;;
    ruby)     install_ruby     ;;
    cpp)      install_cpp      ;;
    reverse)  install_reverse  ;;
    all)
      install_secrets
      install_sast
      install_sca
      install_iac
      install_malware
      install_rust
      install_java
      install_php
      install_ruby
      install_cpp
      install_reverse
      ;;
    *) warn "Unknown group: '$group'. Valid groups: secrets sast sca iac malware rust java php ruby cpp reverse all" ;;
  esac
done

say "Done. Re-run with any group name(s) to install more tools. See the header comment for the full list."
