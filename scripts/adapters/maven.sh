#!/usr/bin/env bash
# coldvault.dev — Java / Maven ecosystem adapter (ZONOVA RESEARCH).
# Contract: maven_detect / maven_resolve / maven_materialize / maven_signals
#
# `mvn dependency:copy-dependencies` downloads the transitive jar closure WITHOUT
# running the dependencies' own build; Maven writes .sha1 checksums alongside each
# artifact in the local repo. We never run the subject's build plugins. (Gradle
# projects can be audited via their Maven coordinates, or added as a sibling
# adapter later.)

# spec: "groupId:artifactId:version" (e.g. com.google.guava:guava:33.0.0-jre)
maven_detect() { [[ "$1" == *:*:* || "$1" == *:* ]]; }

maven_resolve() {
  local spec="$1" staging="$2"
  has mvn || { err "mvn (Maven) not found in container. Cannot resolve Java closure."; exit 30; }
  local g a v
  IFS=':' read -r g a v <<< "$spec"
  [[ -n "$g" && -n "$a" ]] || { err "maven spec must be groupId:artifactId[:version], got '$spec'"; exit 30; }
  [[ -n "$v" ]] || { err "maven audits require an exact version (groupId:artifactId:version)"; exit 30; }

  mkdir -p "$staging"
  cat > "$staging/pom.xml" <<POM
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>dev.coldvault</groupId>
  <artifactId>audit-subject</artifactId>
  <version>0.0.0</version>
  <packaging>pom</packaging>
  <dependencies>
    <dependency>
      <groupId>$(printf '%s' "$g")</groupId>
      <artifactId>$(printf '%s' "$a")</artifactId>
      <version>$(printf '%s' "$v")</version>
    </dependency>
  </dependencies>
</project>
POM

  log "maven: resolving jar closure for '$spec' (copy-dependencies, no build)"
  ( cd "$staging"
    if ! scrubbed_env mvn -q -B -Dmaven.repo.local="$staging/m2" \
          dependency:copy-dependencies \
          -DoutputDirectory="$staging/jars" -DincludeScope=runtime \
          >"$staging/mvn.log" 2>&1; then
      err "mvn dependency:copy-dependencies failed. See $staging/mvn.log"; tail -20 "$staging/mvn.log" >&2 || true; exit 31
    fi
    # Resolved tree for provenance (versions as actually selected).
    scrubbed_env mvn -q -B -Dmaven.repo.local="$staging/m2" \
      dependency:tree -DoutputFile="$staging/dependency-tree.txt" >>"$staging/mvn.log" 2>&1 || true
  )
  log "maven: closure resolved ($(ls -1 "$staging/jars" 2>/dev/null | wc -l | tr -d ' ') jars)"
}

maven_materialize() {
  local staging="$1" target="$2"
  mkdir -p "$target"
  cp -a "$staging/pom.xml" "$target/" 2>/dev/null || true
  [[ -d "$staging/jars" ]] && cp -a "$staging/jars" "$target/" 2>/dev/null || true
  cp -a "$staging/dependency-tree.txt" "$target/" 2>/dev/null || true
  # keep the .sha1/.pom checksums from the local repo for integrity verification
  [[ -d "$staging/m2" ]] && ( cd "$staging" && find m2 -name '*.sha1' -o -name '*.pom' ) >/dev/null 2>&1 \
    && cp -a "$staging/m2" "$target/m2" 2>/dev/null || true
  cp -a "$staging/mvn.log" "$target/mvn-resolve.log" 2>/dev/null || true
  log "maven: closure materialised under $target (jars/ + dependency-tree.txt + m2 checksums)"
}

maven_signals() {
  local target="$1" out="$2"
  cat > "$out" <<JSON
{
  "ecosystem": "maven",
  "resolver": "mvn dependency:copy-dependencies + dependency:tree",
  "manifest": "pom.xml",
  "lockfile": "dependency-tree.txt",
  "installed_tree": "jars/",
  "integrity_field": ".sha1 (local repo)",
  "scripts_executed": false
}
JSON
}
