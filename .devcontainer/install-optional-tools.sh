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
#   sca       — grype, syft, dependency-check (requires java group), cyclonedx-bom, cdxgen
#   iac       — tfsec, terrascan, checkov, kube-score, kubesec, dockle
#   malware   — capa, oletools, binwalk, malwoverview, pefile
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

# ── runtime environment ────────────────────────────────────────────────────
# When running as a non-root user (e.g. the `vscode` devcontainer user),
# redirect package-manager installs to user-writable paths so no sudo is
# needed for pipx, npm -g, or go install.
# apt_install and binary downloads that genuinely need root still use sudo.

if [[ "$(id -u)" == "0" ]]; then
  LOCAL_BIN=/usr/local/bin
  GOINSTALL_GOPATH="${GOPATH:-/usr/local/go-tools}"
else
  LOCAL_BIN="$HOME/.local/bin"
  mkdir -p "$LOCAL_BIN"
  # Override the system-wide PIPX_BIN_DIR set in the Dockerfile so pipx
  # writes to a directory the current user owns.
  export PIPX_BIN_DIR="$LOCAL_BIN"
  # npm global prefix
  export NPM_CONFIG_PREFIX="$HOME/.npm-global"
  mkdir -p "$NPM_CONFIG_PREFIX/bin"
  # go install destination
  GOINSTALL_GOPATH="$HOME/go"
  mkdir -p "$GOINSTALL_GOPATH/bin"
  # Expose the new bins to this script session
  export PATH="$LOCAL_BIN:$NPM_CONFIG_PREFIX/bin:$GOINSTALL_GOPATH/bin:$PATH"
  say "Non-root mode — installing to user-local paths (no sudo required for pipx/npm/go)."
  say "  binaries  → $LOCAL_BIN"
  say "  npm bins  → $NPM_CONFIG_PREFIX/bin"
  say "  go bins   → $GOINSTALL_GOPATH/bin"
  say "Persist on PATH by adding to your shell profile:"
  say "  export PATH=\"\$HOME/.local/bin:\$HOME/.npm-global/bin:\$HOME/go/bin:\$PATH\""
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
    GO111MODULE=on GOPATH="$GOINSTALL_GOPATH" go install "$mod" \
      || warn "go install $mod skipped"
  done
}

cargo_install() {
  for crate in "$@"; do
    cargo install --locked "$crate" || warn "cargo install $crate skipped"
  done
}

# Download a single binary release to LOCAL_BIN (no sudo needed when non-root).
bin_download() {
  local url="$1" name="$2"
  curl -fsSL "$url" -o "$LOCAL_BIN/$name" && chmod +x "$LOCAL_BIN/$name"
}

# ── groups ─────────────────────────────────────────────────────────────────

install_secrets() {
  say "Group: secrets"
  # trufflehog — installer writes to LOCAL_BIN (user-writable when non-root)
  if ! command -v trufflehog &>/dev/null; then
    curl -fsSL https://raw.githubusercontent.com/trufflesecurity/trufflehog/main/scripts/install.sh \
      | sh -s -- -b "$LOCAL_BIN"
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
  # JS/TS audit tooling — npm prefix already set to user-local when non-root
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
  # Extra Go analysis tools — installs to GOINSTALL_GOPATH
  go_install \
    honnef.co/go/tools/cmd/staticcheck@latest \
    github.com/kisielk/errcheck@latest \
    github.com/go-critic/go-critic/cmd/gocritic@latest
  ok "staticcheck, errcheck, gocritic"
}

install_sca() {
  say "Group: sca"
  # Note: dependency-check requires a Java runtime.
  # Install the 'java' group first if it is not already present:
  #   bash .devcontainer/install-optional-tools.sh java sca
  # Grype — installer honours -b flag; LOCAL_BIN is user-writable when non-root
  if ! command -v grype &>/dev/null; then
    curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh \
      | sh -s -- -b "$LOCAL_BIN"
    ok "grype"
  fi
  # Syft
  if ! command -v syft &>/dev/null; then
    curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh \
      | sh -s -- -b "$LOCAL_BIN"
    ok "syft"
  fi
  # CycloneDX
  pipx_install cyclonedx-bom
  npm_g @cyclonedx/cyclonedx-npm @cyclonedx/cdxgen
  ok "cyclonedx-bom, cdxgen"
  # OWASP Dependency-Check (requires Java — install 'java' group first)
  if ! command -v dependency-check &>/dev/null; then
    DC_VERSION=10.0.4
    DC_ZIP="/tmp/dc-${DC_VERSION}.zip"
    DC_DIR="$HOME/.local/opt/dependency-check"
    DC_BIN="$LOCAL_BIN/dependency-check"
    curl -fsSL \
      "https://github.com/jeremylong/DependencyCheck/releases/download/v${DC_VERSION}/dependency-check-${DC_VERSION}-release.zip" \
      -o "$DC_ZIP"
    mkdir -p "$HOME/.local/opt"
    unzip -q "$DC_ZIP" -d "$HOME/.local/opt/"
    ln -sf "$DC_DIR/bin/dependency-check.sh" "$DC_BIN"
    rm "$DC_ZIP"
    ok "dependency-check ${DC_VERSION} → $DC_BIN"
  fi
}

install_iac() {
  say "Group: iac"
  # tfsec
  if ! command -v tfsec &>/dev/null; then
    TFSEC_VERSION=1.28.14
    bin_download \
      "https://github.com/aquasecurity/tfsec/releases/download/v${TFSEC_VERSION}/tfsec-linux-amd64" \
      tfsec
    ok "tfsec ${TFSEC_VERSION}"
  fi
  # terrascan
  if ! command -v terrascan &>/dev/null; then
    TS_VERSION=1.19.9
    curl -fsSL \
      "https://github.com/tenable/terrascan/releases/download/v${TS_VERSION}/terrascan_${TS_VERSION}_Linux_x86_64.tar.gz" \
      | tar -xz -C "$LOCAL_BIN" terrascan
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
      | tar -xz -C "$LOCAL_BIN" kube-score
    ok "kube-score ${KS_VERSION}"
  fi
  # kubesec
  if ! command -v kubesec &>/dev/null; then
    curl -fsSL \
      https://github.com/controlplaneio/kubesec/releases/latest/download/kubesec_linux_amd64.tar.gz \
      | tar -xz -C "$LOCAL_BIN" kubesec
    ok "kubesec"
  fi
  # dockle
  if ! command -v dockle &>/dev/null; then
    DOCKLE_VERSION=0.4.14
    curl -fsSL \
      "https://github.com/goodwithtech/dockle/releases/download/v${DOCKLE_VERSION}/dockle_${DOCKLE_VERSION}_Linux-64bit.tar.gz" \
      | tar -xz -C "$LOCAL_BIN" dockle
    ok "dockle ${DOCKLE_VERSION}"
  fi
}

install_malware() {
  say "Group: malware"
  # capa, oletools, binwalk — pipx writes to PIPX_BIN_DIR (user-local when non-root)
  pipx_install flare-capa oletools binwalk
  pipx install malwoverview || warn "malwoverview install skipped"
  # pefile is a library (no CLI) needed by capa and oletools.
  # Inject it into both pipx environments so it is available without sudo
  # and without touching system site-packages.
  pipx inject flare-capa pefile || warn "pefile inject into capa skipped"
  pipx inject oletools pefile   || warn "pefile inject into oletools skipped"
  ok "capa, oletools (+ pefile), binwalk"
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
  # COMPOSER_HOME must be exported and passed through sudo so composer writes
  # to the intended directory instead of root's home.
  export COMPOSER_HOME=/usr/local/composer
  sudo mkdir -p "$COMPOSER_HOME"
  sudo env "COMPOSER_HOME=$COMPOSER_HOME" composer global require --no-interaction \
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
  # radare2 — check apt candidacy while package lists are still present
  # (before apt_install cleans them), then fall back to a source build.
  if ! command -v r2 &>/dev/null; then
    R2_VERSION=5.9.8
    sudo apt-get update -q
    if apt-cache policy radare2 2>/dev/null | grep -qE '^  Candidate: [^(]'; then
      apt_install radare2
    else
      ( git clone --depth=1 --branch "${R2_VERSION}" \
            https://github.com/radareorg/radare2.git /tmp/radare2 \
          || git clone --depth=1 https://github.com/radareorg/radare2.git /tmp/radare2 ) \
        && ( cd /tmp/radare2 && sudo sys/install.sh ) \
        || warn "radare2 source build failed — continuing without r2"
      rm -rf /tmp/radare2
    fi
    ok "radare2"
  fi
  apt_install gdb strace ltrace
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
