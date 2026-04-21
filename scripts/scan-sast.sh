#!/usr/bin/env bash
# Multi-language SAST. Semgrep + language-native analyzers.
source "$(dirname "$0")/_lib.sh"
require_target
enforce_usage_policy_ack

log "Semgrep — curated security packs"
if has semgrep; then
  semgrep \
    --config p/owasp-top-ten \
    --config p/security-audit \
    --config p/cwe-top-25 \
    --config p/command-injection \
    --config p/xss --config p/sqli --config p/jwt --config p/secrets \
    --config p/insecure-transport \
    --config p/github-actions \
    --config "$SEMGREP_RULES_DIR/community" \
    --config "$REPO_ROOT/rules/semgrep" \
    --sarif --output "$REPORTS_DIR/sast-semgrep.sarif" \
    --metrics=off \
    "$TARGET_DIR" 2> "$REPORTS_DIR/sast-semgrep.log" || true
else warn "semgrep missing"; fi

log "Python → bandit"
if [[ -n "$(find "$TARGET_DIR" -name '*.py' -print -quit 2>/dev/null)" ]] && has bandit; then
  bandit -r "$TARGET_DIR" -f sarif -o "$REPORTS_DIR/sast-bandit.sarif" \
    --exit-zero 2>/dev/null || true
fi

log "JS/TS → njsscan + retire"
if [[ -n "$(find "$TARGET_DIR" \( -name '*.js' -o -name '*.ts' -o -name '*.jsx' -o -name '*.tsx' \) -print -quit 2>/dev/null)" ]]; then
  has njsscan && njsscan --sarif -o "$REPORTS_DIR/sast-njsscan.sarif" "$TARGET_DIR" || true
  has retire  && retire --path "$TARGET_DIR" --outputformat jsonsimple \
    --outputpath "$REPORTS_DIR/sast-retire.json" || true
fi

log "Go → gosec + staticcheck"
if [[ -f "$TARGET_DIR/go.mod" ]]; then
  has gosec && ( cd "$TARGET_DIR" && gosec -quiet -fmt sarif -out "$REPORTS_DIR/sast-gosec.sarif" ./... ) || true
  has staticcheck && ( cd "$TARGET_DIR" && staticcheck -f json ./... ) \
    > "$REPORTS_DIR/sast-staticcheck.json" 2>/dev/null || true
fi

log "Rust → clippy (warn-only)"
if [[ -f "$TARGET_DIR/Cargo.toml" ]] && has cargo; then
  # NEVER invoke cargo build — clippy on source via --manifest-path needs compile → skip by default.
  warn "Rust clippy skipped — it requires compilation of target/. Use semgrep rust pack instead."
fi

log "C/C++ → cppcheck + flawfinder"
if [[ -n "$(find "$TARGET_DIR" \( -name '*.c' -o -name '*.cpp' -o -name '*.h' -o -name '*.hpp' \) -print -quit 2>/dev/null)" ]]; then
  has cppcheck   && cppcheck --enable=all --inconclusive --xml --xml-version=2 \
    "$TARGET_DIR" 2> "$REPORTS_DIR/sast-cppcheck.xml" || true
  has flawfinder && flawfinder --dataonly --csv "$TARGET_DIR" \
    > "$REPORTS_DIR/sast-flawfinder.csv" || true
fi

log "Ruby → brakeman"
if [[ -f "$TARGET_DIR/Gemfile" ]] && has brakeman; then
  brakeman -q -o "$REPORTS_DIR/sast-brakeman.json" -f json "$TARGET_DIR" || true
fi

log "PHP → psalm + phpstan"
if [[ -n "$(find "$TARGET_DIR" -name '*.php' -print -quit 2>/dev/null)" ]]; then
  has psalm   && psalm --output-format=sarif --report="$REPORTS_DIR/sast-psalm.sarif" \
    --root="$TARGET_DIR" 2>/dev/null || true
  has phpstan && phpstan analyse --error-format=json --level=max \
    "$TARGET_DIR" > "$REPORTS_DIR/sast-phpstan.json" 2>/dev/null || true
fi

log "Shell → shellcheck"
if [[ -n "$(find "$TARGET_DIR" -name '*.sh' -print -quit 2>/dev/null)" ]] && has shellcheck; then
  find "$TARGET_DIR" -name '*.sh' -print0 | xargs -0 -I{} shellcheck -f json {} \
    > "$REPORTS_DIR/sast-shellcheck.json" 2>/dev/null || true
fi

log "Merging SARIF files…"
if has jq; then
  shopt -s nullglob
  files=( "$REPORTS_DIR"/sast-*.sarif )
  if (( ${#files[@]} > 0 )); then
    jq -s '{version:"2.1.0", runs: ( [.[].runs // []] | add )}' "${files[@]}" \
      > "$REPORTS_DIR/sast-merged.sarif"
  fi
fi

log "done — reports/sast-merged.sarif + per-tool files"
