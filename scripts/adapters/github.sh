#!/usr/bin/env bash
# coldvault.dev — GitHub raw-repo ecosystem adapter (ZONOVA RESEARCH).
# Contract: github_detect / github_resolve / github_materialize / github_signals
#
# Clones a repo at an EXACT commit (never a mutable branch/tag), records the
# resolved SHA as the pin, and audits the source tree as-is. There is no registry
# closure here — the Python analyzer detects the inner ecosystem (npm/pypi/…) and
# notes that the dependency closure is NOT certified unless a committed lockfile
# exists. The .git directory and any hooks are dropped during materialisation.

# spec: "owner/repo@<sha>"  (ref may also come from COLDVAULT_REF)
github_detect() { [[ "$1" == */* ]]; }

github_resolve() {
  local spec="$1" staging="$2"
  has git || { err "git not found in container."; exit 30; }
  local repo="${spec%@*}" ref=""
  [[ "$spec" == *@* ]] && ref="${spec##*@}"
  [[ -z "$ref" && -n "${COLDVAULT_REF:-}" ]] && ref="$COLDVAULT_REF"
  [[ -n "$ref" ]] || { err "github audits require an exact ref/SHA: github:owner/repo@<sha>"; exit 30; }

  mkdir -p "$staging"
  log "github: cloning $repo @ $ref (no checkout of hooks, no scripts)"
  if ! scrubbed_env git -c core.hooksPath=/dev/null clone --no-checkout --quiet \
        "https://github.com/$repo.git" "$staging/repo" >"$staging/git.log" 2>&1; then
    err "git clone failed for '$repo'. See $staging/git.log"; tail -20 "$staging/git.log" >&2 || true; exit 31
  fi
  ( cd "$staging/repo"
    if ! scrubbed_env git -c advice.detachedHead=false -c core.hooksPath=/dev/null \
          checkout --quiet "$ref" >>"$staging/git.log" 2>&1; then
      err "git checkout '$ref' failed (must be a reachable commit/tag). See $staging/git.log"; exit 31
    fi
    git rev-parse HEAD > "$staging/resolved-sha.txt"
  )
  log "github: resolved SHA $(cat "$staging/resolved-sha.txt" 2>/dev/null || echo '?')"
}

github_materialize() {
  local staging="$1" target="$2"
  mkdir -p "$target"
  # Copy everything EXCEPT .git — we never want history, hooks, or a live remote.
  ( cd "$staging/repo" && tar --exclude='./.git' -cf - . ) | ( cd "$target" && tar -xf - )
  cp -a "$staging/resolved-sha.txt" "$target/.coldvault-pinned-sha" 2>/dev/null || true
  cp -a "$staging/git.log" "$target/git-resolve.log" 2>/dev/null || true
  log "github: source materialised under $target (at pinned SHA, .git dropped)"
}

github_signals() {
  local target="$1" out="$2"
  local sha; sha="$(cat "$target/.coldvault-pinned-sha" 2>/dev/null || echo 'unknown')"
  cat > "$out" <<JSON
{
  "ecosystem": "github",
  "resolver": "git clone + checkout <sha>",
  "pinned_sha": "$sha",
  "manifest": "(repo source)",
  "lockfile": "(committed lockfile, if any)",
  "installed_tree": ".",
  "integrity_field": "commit SHA",
  "scripts_executed": false,
  "closure_certified": false
}
JSON
}
