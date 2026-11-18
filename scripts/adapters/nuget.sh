#!/usr/bin/env bash
# coldvault.dev — .NET / NuGet ecosystem adapter (ZONOVA RESEARCH).
# Contract: nuget_detect / nuget_resolve / nuget_materialize / nuget_signals
#
# `dotnet restore --use-lock-file` (NEVER build) resolves the closure and writes
# packages.lock.json (contentHash per package). Packages are restored (extracted)
# into a staging-local global-packages folder, so scanners see the real assemblies
# and any MSBuild .targets/.props (reported as a restore/build-time exec surface).

# spec: "Newtonsoft.Json@13.0.3" or bare "Newtonsoft.Json"
nuget_detect() { [[ -n "$1" ]]; }

nuget_resolve() {
  local spec="$1" staging="$2"
  has dotnet || { err "dotnet SDK not found in container. Cannot resolve NuGet closure."; exit 30; }
  local name="${spec%@*}" ver=""
  [[ "$spec" == *@* ]] && ver="${spec##*@}"
  [[ -n "$name" ]] || { err "could not parse package name from '$spec'"; exit 30; }

  mkdir -p "$staging"
  export NUGET_PACKAGES="$staging/packages" DOTNET_CLI_TELEMETRY_OPTOUT=1 DOTNET_NOLOGO=1
  log "nuget: creating ephemeral project and restoring '$spec' (no build)"
  (
    cd "$staging"
    scrubbed_env dotnet new classlib -o subject --no-restore >"$staging/dotnet.log" 2>&1 \
      || { err "dotnet new failed. See $staging/dotnet.log"; tail -20 "$staging/dotnet.log" >&2 || true; exit 31; }
    cd subject
    if [[ -n "$ver" ]]; then
      scrubbed_env dotnet add package "$name" --version "$ver" --no-restore >>"$staging/dotnet.log" 2>&1 \
        || { err "dotnet add package failed"; tail -20 "$staging/dotnet.log" >&2 || true; exit 31; }
    else
      scrubbed_env dotnet add package "$name" --no-restore >>"$staging/dotnet.log" 2>&1 \
        || { err "dotnet add package failed"; tail -20 "$staging/dotnet.log" >&2 || true; exit 31; }
    fi
    scrubbed_env dotnet restore --use-lock-file >>"$staging/dotnet.log" 2>&1 \
      || { err "dotnet restore failed"; tail -20 "$staging/dotnet.log" >&2 || true; exit 31; }
  )
  log "nuget: closure resolved"
}

nuget_materialize() {
  local staging="$1" target="$2"
  mkdir -p "$target"
  # project (with packages.lock.json) + the restored/extracted packages
  cp -a "$staging/subject" "$target/project" 2>/dev/null || true
  [[ -d "$staging/packages" ]] && cp -a "$staging/packages" "$target/packages" 2>/dev/null || true
  cp -a "$staging/dotnet.log" "$target/dotnet-resolve.log" 2>/dev/null || true
  log "nuget: closure materialised under $target (project/ + packages/)"
}

nuget_signals() {
  local target="$1" out="$2"
  cat > "$out" <<JSON
{
  "ecosystem": "nuget",
  "resolver": "dotnet restore --use-lock-file",
  "manifest": "project/*.csproj",
  "lockfile": "project/packages.lock.json",
  "installed_tree": "packages/",
  "integrity_field": "contentHash (sha512)",
  "scripts_executed": false
}
JSON
}
