#!/usr/bin/env bash
# coldvault.dev — raw tarball/sdist/archive URL adapter (ZONOVA RESEARCH).
# Contract: url_detect / url_resolve / url_materialize / url_signals
#
# Downloads a single artifact, records its sha256 as the pin, and unpacks it
# WITHOUT execution (tar/unzip are data operations). The Python analyzer detects
# the inner ecosystem of the unpacked content. No registry closure is resolved.

# spec: an http(s) URL to a .tgz/.tar.gz/.tar/.zip/.whl/.jar/.nupkg
url_detect() { [[ "$1" == http://* || "$1" == https://* ]]; }

url_resolve() {
  local spec="$1" staging="$2"
  mkdir -p "$staging/unpacked"
  local f="$staging/artifact.bin"

  log "url: downloading artifact (no execution)"
  if has curl; then
    scrubbed_env curl -fsSL --proto '=https' "$spec" -o "$f" \
      || { err "download failed: $spec"; exit 31; }
  elif has wget; then
    scrubbed_env wget -q "$spec" -O "$f" \
      || { err "download failed: $spec"; exit 31; }
  else
    err "neither curl nor wget available."; exit 30
  fi

  sha256sum "$f" | cut -d' ' -f1 > "$staging/artifact.sha256"
  log "url: sha256=$(cat "$staging/artifact.sha256")"

  case "$spec" in
    *.tgz|*.tar.gz|*.tar|*.tar.bz2|*.tar.xz)
      tar -xf "$f" -C "$staging/unpacked" 2>/dev/null || warn "tar extraction incomplete" ;;
    *.zip|*.whl|*.jar|*.nupkg)
      if has unzip; then unzip -q "$f" -d "$staging/unpacked" 2>/dev/null || warn "unzip incomplete"
      elif has python3; then python3 -I -m zipfile -e "$f" "$staging/unpacked" 2>/dev/null || warn "zip extraction incomplete"
      else warn "no unzip/python3 to extract archive"; fi ;;
    *)
      cp "$f" "$staging/unpacked/" ;;
  esac
}

url_materialize() {
  local staging="$1" target="$2"
  mkdir -p "$target"
  cp -a "$staging/unpacked/." "$target/" 2>/dev/null || true
  cp -a "$staging/artifact.sha256" "$target/.coldvault-artifact-sha256" 2>/dev/null || true
  log "url: artifact materialised under $target (unpacked, no execution)"
}

url_signals() {
  local target="$1" out="$2"
  local sha; sha="$(cat "$target/.coldvault-artifact-sha256" 2>/dev/null || echo 'unknown')"
  cat > "$out" <<JSON
{
  "ecosystem": "url",
  "resolver": "download + unpack (no exec)",
  "artifact_sha256": "$sha",
  "manifest": "(unpacked content)",
  "lockfile": "(none)",
  "installed_tree": ".",
  "integrity_field": "sha256 (artifact)",
  "scripts_executed": false,
  "closure_certified": false
}
JSON
}
