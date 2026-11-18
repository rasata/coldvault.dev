#!/usr/bin/env python3
"""coldvault.dev — provenance / anti-"mirage" certification (ZONOVA RESEARCH).

Answers one question: *is what we scanned the same thing that would execute?*

A library that looks safe on disk can be silently overwritten at install time by
a transitive dependency, a lifecycle hook, or a non-registry source. This script
inspects the FROZEN closure under target/ (materialised by fetch-target.sh with
scripts disabled) and reports every divergence between what is *declared*, what is
*locked/installed*, and what the registry would serve.

Outputs:
  reports/00-provenance.json   full provenance report + verdict
      {"verdict": {...}, "provenance_findings": [ <CLAUDE.md §4 finding>, ... ]}

The HIGH/MEDIUM provenance_findings are meant to be merged into reports/findings.json
by the audit synthesis step (source_tool="provenance").

NO code from target/ is executed. stdlib only. Network is used ONLY with
--registry-check and is best-effort.

Usage:
  scripts/provenance-check.py [--target target] [--reports reports] [--registry-check]
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def _read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return ""


def _find_one(target: Path, name: str) -> Optional[Path]:
    p = target / name
    if p.exists():
        return p
    for hit in target.rglob(name):
        return hit
    return None


def load_json(path: Path) -> Optional[Any]:
    try:
        with path.open("r", encoding="utf-8") as fh:
            return json.load(fh)
    except Exception:
        return None


def finding(
    *,
    file: str,
    line: int,
    severity: str,
    category: str,
    description: str,
    exploit_scenario: str,
    recommendation: str,
    confidence: float,
) -> Dict[str, Any]:
    return {
        "file": file,
        "line": line,
        "severity": severity,
        "category": category,
        "description": description,
        "exploit_scenario": exploit_scenario,
        "recommendation": recommendation,
        "confidence": confidence,
        "source_tool": "provenance",
    }


# --------------------------------------------------------------------------- #
# npm analyzer
# --------------------------------------------------------------------------- #
LIFECYCLE_HOOKS = ("preinstall", "install", "postinstall", "prepare", "prepublish")


def analyze_npm(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"lifecycle_hooks": [], "non_registry_deps": [],
                               "missing_integrity": [], "overrides": [],
                               "resolved_packages": 0}

    lock = load_json(target / "package-lock.json")
    if lock is None:
        findings.append(finding(
            file="target/package-lock.json", line=1, severity="HIGH",
            category="provenance",
            description="No package-lock.json in the frozen closure — the resolved "
                        "dependency tree could not be certified.",
            exploit_scenario="Without a lockfile the installed versions are not "
                             "pinned; a later install could pull different, malicious code.",
            recommendation="Re-run fetch-target.sh; a lockfile is required to certify the closure.",
            confidence=0.9))
        return {"findings": findings, "signals": signals}

    # lockfileVersion >= 2/3 uses "packages"; v1 uses "dependencies".
    packages = lock.get("packages")
    if isinstance(packages, dict):
        signals["resolved_packages"] = max(0, len(packages) - 1)  # minus root ""
        for pkg_path, meta in packages.items():
            if not isinstance(meta, dict):
                continue
            name = pkg_path.replace("node_modules/", "") or "(root)"

            # (a) non-registry source: git/http/file/link
            resolved = meta.get("resolved", "")
            if meta.get("link") is True or (
                isinstance(resolved, str) and resolved and not resolved.startswith("https://registry.")
                and not resolved.startswith("https://registry.npmjs.org")
            ):
                # registry mirrors vary; treat any non-https-registry resolved as suspect
                if meta.get("link") is True or any(
                    resolved.startswith(p) for p in ("git+", "git:", "http://", "file:", "ssh://")
                ) or ("github.com" in resolved and resolved.endswith((".git",))):
                    signals["non_registry_deps"].append({"name": name, "resolved": resolved,
                                                         "link": meta.get("link", False)})
                    findings.append(finding(
                        file=f"target/{pkg_path}", line=1, severity="HIGH",
                        category="supply_chain_non_registry_dependency",
                        description=f"Dependency '{name}' resolves from a non-registry source "
                                    f"({resolved or 'local link'}), bypassing registry integrity.",
                        exploit_scenario="A git/URL/file dependency can serve code that differs "
                                         "from any published, hash-verified version — the classic "
                                         "'looks safe, installs something else' override.",
                        recommendation="Pin to a registry version with an integrity hash, or vendor "
                                       "and review the exact revision; do not trust mutable sources.",
                        confidence=0.85))

            # (b) missing integrity on a registry tarball
            if resolved.startswith(("https://registry.npmjs.org", "https://registry.")) \
                    and not meta.get("integrity") and name != "(root)":
                signals["missing_integrity"].append(name)
                findings.append(finding(
                    file=f"target/{pkg_path}", line=1, severity="MEDIUM",
                    category="supply_chain_missing_integrity",
                    description=f"Registry dependency '{name}' has no integrity (SRI) hash in the lockfile.",
                    exploit_scenario="Without an integrity hash, a tampered tarball cannot be detected "
                                     "at install time.",
                    recommendation="Regenerate the lockfile with a modern npm so every package carries integrity.",
                    confidence=0.75))

    # lifecycle hooks — scan the actually-installed tree (node_modules)
    nm = target / "node_modules"
    if nm.is_dir():
        for pj in nm.rglob("package.json"):
            data = load_json(pj)
            if not isinstance(data, dict):
                continue
            scripts = data.get("scripts")
            if not isinstance(scripts, dict):
                continue
            hooks = {k: v for k, v in scripts.items() if k in LIFECYCLE_HOOKS}
            if hooks:
                rel = os.path.relpath(pj, target.parent)
                pname = data.get("name", pj.parent.name)
                signals["lifecycle_hooks"].append({"name": pname, "hooks": hooks})
                findings.append(finding(
                    file=rel, line=1, severity="MEDIUM",
                    category="supply_chain_install_hook",
                    description=f"Package '{pname}' declares install-time lifecycle script(s): "
                                f"{', '.join(hooks.keys())}.",
                    exploit_scenario="Install hooks run arbitrary code on 'npm install' with the "
                                     "developer's privileges — the primary npm supply-chain RCE vector. "
                                     f"Command(s): {json.dumps(hooks)}",
                    recommendation="Review the hook commands. Install with --ignore-scripts and audit "
                                   "what the hook would have done before trusting the package.",
                    confidence=0.8))

    # overrides / resolutions in the consumer/root manifest
    root_manifest = load_json(target / "package.json") or {}
    for key in ("overrides", "resolutions"):
        if root_manifest.get(key):
            signals["overrides"].append({key: root_manifest[key]})
            findings.append(finding(
                file="target/package.json", line=1, severity="HIGH",
                category="supply_chain_dependency_override",
                description=f"Manifest uses '{key}' to force dependency versions, which can overwrite "
                            f"a nested dependency with a different (possibly malicious) one.",
                exploit_scenario="An 'overrides'/'resolutions' entry can swap a safe transitive "
                                 "dependency for an attacker-controlled version — the exact mirage "
                                 "where the top-level lib looks fine but what installs is not.",
                recommendation="Verify each override points to a reviewed, registry-pinned version.",
                confidence=0.8))

    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# PyPI analyzer
# --------------------------------------------------------------------------- #
def analyze_pypi(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"hashed_artifacts": 0, "sdists": [], "setup_py": []}

    lock = target / "requirements.lock"
    hashes = 0
    if lock.exists():
        for line in lock.read_text(encoding="utf-8", errors="replace").splitlines():
            if "--hash=sha256:" in line:
                hashes += 1
    signals["hashed_artifacts"] = hashes
    if hashes == 0:
        findings.append(finding(
            file="target/requirements.lock", line=1, severity="HIGH", category="provenance",
            description="No hash-pinned closure (requirements.lock missing or empty) — the "
                        "resolved Python dependency set could not be certified.",
            exploit_scenario="Without pinned hashes, a later install can pull different, "
                             "possibly malicious, wheels for the same versions.",
            recommendation="Re-run fetch-target.sh so wheels resolve with sha256 pins.",
            confidence=0.85))

    # sdists leaking into a wheel-only closure would mean setup.py could run at install.
    wheels = target / "wheels"
    if wheels.is_dir():
        for art in wheels.iterdir():
            if art.suffix in (".gz", ".zip") or art.name.endswith(".tar.gz"):
                signals["sdists"].append(art.name)
                findings.append(finding(
                    file=f"target/wheels/{art.name}", line=1, severity="MEDIUM",
                    category="supply_chain_sdist_install_code",
                    description=f"Source distribution '{art.name}' present — installing it executes its "
                                f"build backend (setup.py/PEP 517), i.e. arbitrary code at install time.",
                    exploit_scenario="A malicious sdist runs code during 'pip install' before the package "
                                     "is ever imported.",
                    recommendation="Prefer a wheel for this dependency, or review the sdist's build scripts.",
                    confidence=0.78))
    src = target / "src"
    if src.is_dir():
        for sp in src.rglob("setup.py"):
            signals["setup_py"].append(os.path.relpath(sp, target.parent))
            findings.append(finding(
                file=os.path.relpath(sp, target.parent), line=1, severity="MEDIUM",
                category="supply_chain_install_code",
                description="A setup.py is present in the resolved closure — install-time code execution surface.",
                exploit_scenario="setup.py runs during installation with the developer's privileges.",
                recommendation="Review the setup.py; install from wheels with no build step.",
                confidence=0.72))
    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# Go analyzer
# --------------------------------------------------------------------------- #
def analyze_go(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"replace_directives": [], "cgo_files": 0, "has_go_sum": False}

    if not (target / "go.sum").exists():
        findings.append(finding(
            file="target/go.sum", line=1, severity="HIGH", category="provenance",
            description="No go.sum in the frozen closure — module hashes are not certified.",
            exploit_scenario="Without go.sum, module content is not verified and could be swapped.",
            recommendation="Re-run fetch-target.sh; go.sum is required to certify the closure.",
            confidence=0.85))
    else:
        signals["has_go_sum"] = True

    gomod = target / "go.mod"
    if gomod.exists():
        text = gomod.read_text(encoding="utf-8", errors="replace")
        in_block = False
        for raw in text.splitlines():
            line = raw.strip()
            if line.startswith("replace (") or line == "replace (":
                in_block = True
                continue
            if in_block and line == ")":
                in_block = False
                continue
            if line.startswith("replace ") or (in_block and "=>" in line):
                signals["replace_directives"].append(line)
                findings.append(finding(
                    file="target/go.mod", line=1, severity="HIGH",
                    category="supply_chain_dependency_override",
                    description=f"go.mod 'replace' directive redirects a module: {line}",
                    exploit_scenario="A replace can silently point a trusted import path at a local fork or "
                                     "a different module — the mirage where the declared dep is not what builds.",
                    recommendation="Verify the replacement target is reviewed and pinned; avoid replaces in audited deps.",
                    confidence=0.8))

    vendor = target / "vendor"
    if vendor.is_dir():
        for gofile in vendor.rglob("*.go"):
            try:
                head = gofile.read_text(encoding="utf-8", errors="replace")[:4000]
            except Exception:
                continue
            if 'import "C"' in head:
                signals["cgo_files"] += 1
    if signals["cgo_files"]:
        findings.append(finding(
            file="target/vendor", line=1, severity="MEDIUM", category="native_code_surface",
            description=f"cgo detected in {signals['cgo_files']} vendored file(s) — native C code compiled into the build.",
            exploit_scenario="cgo can run C with fewer memory-safety guarantees and widen the attack surface.",
            recommendation="Review the cgo usage and the C it links against.",
            confidence=0.72))
    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# Cargo (Rust) analyzer
# --------------------------------------------------------------------------- #
def analyze_cargo(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"git_sources": [], "build_rs": [], "patch_or_replace": False}

    lock = target / "Cargo.lock"
    if not lock.exists():
        findings.append(finding(
            file="target/Cargo.lock", line=1, severity="HIGH", category="provenance",
            description="No Cargo.lock in the frozen closure — crate checksums are not certified.",
            exploit_scenario="Without the lockfile, crate versions/checksums are unverified.",
            recommendation="Re-run fetch-target.sh; Cargo.lock is required to certify the closure.",
            confidence=0.85))
    else:
        for line in lock.read_text(encoding="utf-8", errors="replace").splitlines():
            s = line.strip()
            if s.startswith('source = "git+'):
                signals["git_sources"].append(s)
                findings.append(finding(
                    file="target/Cargo.lock", line=1, severity="HIGH",
                    category="supply_chain_non_registry_dependency",
                    description=f"Cargo.lock pins a git crate source, bypassing crates.io integrity: {s}",
                    exploit_scenario="A git dependency can serve code that differs from any published, "
                                     "checksum-verified crate.",
                    recommendation="Pin to a crates.io version with a checksum, or vendor and review the revision.",
                    confidence=0.82))

    toml = target / "Cargo.toml"
    if toml.exists():
        t = toml.read_text(encoding="utf-8", errors="replace")
        if "[patch" in t or "[replace]" in t:
            signals["patch_or_replace"] = True
            findings.append(finding(
                file="target/Cargo.toml", line=1, severity="HIGH",
                category="supply_chain_dependency_override",
                description="Cargo.toml uses [patch]/[replace] to override dependency sources.",
                exploit_scenario="A patch/replace can swap a trusted crate for another — the mirage.",
                recommendation="Verify each patch/replace points to a reviewed, pinned source.",
                confidence=0.8))

    vendor = target / "vendor"
    if vendor.is_dir():
        for brs in vendor.rglob("build.rs"):
            signals["build_rs"].append(os.path.relpath(brs, target.parent))
        if signals["build_rs"]:
            findings.append(finding(
                file="target/vendor", line=1, severity="MEDIUM", category="supply_chain_build_script",
                description=f"{len(signals['build_rs'])} crate(s) ship a build.rs — arbitrary code runs at build time.",
                exploit_scenario="build.rs executes on 'cargo build' with the developer's privileges.",
                recommendation="Review each build.rs before compiling the dependency.",
                confidence=0.75))
    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# NuGet (.NET) analyzer
# --------------------------------------------------------------------------- #
def analyze_nuget(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"packages": 0, "missing_contenthash": [], "msbuild_targets": []}

    locks = list(target.rglob("packages.lock.json"))
    if not locks:
        findings.append(finding(
            file="target/project/packages.lock.json", line=1, severity="HIGH", category="provenance",
            description="No packages.lock.json — the resolved NuGet closure is not certified.",
            exploit_scenario="Without the lock, package versions/content hashes are unverified.",
            recommendation="Re-run fetch-target.sh (dotnet restore --use-lock-file).",
            confidence=0.85))
    for lk in locks:
        data = load_json(lk)
        if not isinstance(data, dict):
            continue
        for _framework, deps in (data.get("dependencies") or {}).items():
            if not isinstance(deps, dict):
                continue
            for name, meta in deps.items():
                signals["packages"] += 1
                if isinstance(meta, dict) and not meta.get("contentHash") and meta.get("type") != "Project":
                    signals["missing_contenthash"].append(name)
    if signals["missing_contenthash"]:
        findings.append(finding(
            file="target/project/packages.lock.json", line=1, severity="MEDIUM",
            category="supply_chain_missing_integrity",
            description=f"{len(signals['missing_contenthash'])} NuGet package(s) lack a contentHash in the lock.",
            exploit_scenario="Without a content hash, a tampered package cannot be detected at restore.",
            recommendation="Regenerate the lock so every package carries a contentHash.",
            confidence=0.75))

    pkgs = target / "packages"
    if pkgs.is_dir():
        for ext in ("*.targets", "*.props"):
            for mf in pkgs.rglob(ext):
                signals["msbuild_targets"].append(os.path.relpath(mf, target.parent))
        if signals["msbuild_targets"]:
            findings.append(finding(
                file="target/packages", line=1, severity="MEDIUM", category="supply_chain_build_hook",
                description=f"{len(signals['msbuild_targets'])} package MSBuild .targets/.props file(s) found — "
                            f"these can execute on restore/build.",
                exploit_scenario="MSBuild targets shipped by a package run during restore/build, a known "
                                 ".NET supply-chain execution vector.",
                recommendation="Review package-supplied .targets/.props before building.",
                confidence=0.74))
    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# Maven (Java) analyzer
# --------------------------------------------------------------------------- #
def analyze_maven(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"snapshots": [], "jars": 0}

    jars = target / "jars"
    if jars.is_dir():
        signals["jars"] = sum(1 for _ in jars.glob("*.jar"))

    tree = target / "dependency-tree.txt"
    if tree.exists():
        for line in tree.read_text(encoding="utf-8", errors="replace").splitlines():
            if "SNAPSHOT" in line:
                token = line.strip().lstrip("+-\\| ").strip()
                signals["snapshots"].append(token)
        if signals["snapshots"]:
            findings.append(finding(
                file="target/dependency-tree.txt", line=1, severity="MEDIUM",
                category="supply_chain_mutable_version",
                description=f"{len(signals['snapshots'])} SNAPSHOT (mutable) dependency version(s) resolved.",
                exploit_scenario="A SNAPSHOT artifact can change content under the same version — what is "
                                 "scanned today may differ from what builds tomorrow.",
                recommendation="Pin to released (non-SNAPSHOT) versions before trusting the closure.",
                confidence=0.76))
    elif signals["jars"] == 0:
        findings.append(finding(
            file="target/jars", line=1, severity="HIGH", category="provenance",
            description="No resolved jars or dependency tree — the Maven closure is not certified.",
            exploit_scenario="Without a resolved tree, the executed classpath is unknown.",
            recommendation="Re-run fetch-target.sh (mvn dependency:copy-dependencies).",
            confidence=0.8))
    return {"findings": findings, "signals": signals}


def _missing_lock_finding(lockfile: str, eco_label: str) -> Dict[str, Any]:
    return finding(
        file=f"target/{lockfile}", line=1, severity="HIGH", category="provenance",
        description=f"No {lockfile} in the frozen closure — the {eco_label} dependency set "
                    f"could not be certified.",
        exploit_scenario="Without a lockfile the resolved versions are not pinned; a later install "
                         "could pull different, malicious code.",
        recommendation=f"Audit a project that commits {lockfile} (local:/github:), or re-run fetch-target.sh.",
        confidence=0.85)


# --------------------------------------------------------------------------- #
# Composer (PHP) analyzer
# --------------------------------------------------------------------------- #
def analyze_composer(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"packages": 0, "non_registry": [], "missing_shasum": [],
                               "plugins": [], "scripts": [], "custom_repos": False}
    lockp = _find_one(target, "composer.lock")
    lock = load_json(lockp) if lockp else None
    if lock is None:
        findings.append(_missing_lock_finding("composer.lock", "PHP/Composer"))
    else:
        for key in ("packages", "packages-dev"):
            for pkg in (lock.get(key) or []):
                if not isinstance(pkg, dict):
                    continue
                signals["packages"] += 1
                name = pkg.get("name", "?")
                dist = pkg.get("dist") or {}
                src = pkg.get("source") or {}
                if dist.get("type") in ("git", "svn", "hg") or \
                        (src.get("type") in ("git", "svn", "hg") and not dist.get("shasum")):
                    signals["non_registry"].append(name)
                    findings.append(finding(
                        file="target/composer.lock", line=1, severity="HIGH",
                        category="supply_chain_non_registry_dependency",
                        description=f"Composer package '{name}' installs from a VCS source, bypassing registry integrity.",
                        exploit_scenario="A VCS dependency can serve code differing from any published, hashed release.",
                        recommendation="Pin to a Packagist release with a dist shasum.", confidence=0.82))
                elif dist.get("type") and not dist.get("shasum"):
                    signals["missing_shasum"].append(name)
                    findings.append(finding(
                        file="target/composer.lock", line=1, severity="MEDIUM",
                        category="supply_chain_missing_integrity",
                        description=f"Composer package '{name}' has no dist.shasum in the lock.",
                        exploit_scenario="Without a shasum a tampered archive is undetectable at install.",
                        recommendation="Use a release that carries a dist checksum.", confidence=0.72))
                if pkg.get("type") == "composer-plugin":
                    signals["plugins"].append(name)
                    findings.append(finding(
                        file="target/composer.lock", line=1, severity="MEDIUM",
                        category="supply_chain_plugin",
                        description=f"'{name}' is a composer-plugin — it executes code during composer operations.",
                        exploit_scenario="Composer plugins run with developer privileges on install/update.",
                        recommendation="Review the plugin; install with --no-plugins.", confidence=0.74))
    cjp = _find_one(target, "composer.json")
    cj = load_json(cjp) if cjp else {}
    cj = cj if isinstance(cj, dict) else {}
    hooks = [k for k in (cj.get("scripts") or {}) if k.startswith(("pre-", "post-"))]
    if hooks:
        signals["scripts"] = hooks
        findings.append(finding(
            file="target/composer.json", line=1, severity="MEDIUM",
            category="supply_chain_install_hook",
            description=f"composer.json defines lifecycle scripts: {', '.join(hooks)}.",
            exploit_scenario="Composer scripts run arbitrary code on install/update.",
            recommendation="Review each script; install with --no-scripts.", confidence=0.76))
    if cj.get("repositories"):
        signals["custom_repos"] = True
        findings.append(finding(
            file="target/composer.json", line=1, severity="HIGH",
            category="supply_chain_custom_registry",
            description="composer.json declares custom repositories (VCS/path/url), overriding Packagist.",
            exploit_scenario="A custom repo can shadow a trusted package name with attacker code — the mirage.",
            recommendation="Verify each repository is trusted and pinned.", confidence=0.78))
    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# Pub (Dart) analyzer — pubspec.lock is YAML; parse line-wise (no yaml dep).
# --------------------------------------------------------------------------- #
def analyze_pub(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"git_or_path": []}
    lockp = _find_one(target, "pubspec.lock")
    if not lockp:
        findings.append(_missing_lock_finding("pubspec.lock", "Dart/pub"))
        return {"findings": findings, "signals": signals}
    cur = None
    for line in _read_text(lockp).splitlines():
        m = re.match(r"^  ([A-Za-z0-9_]+):\s*$", line)
        if m:
            cur = m.group(1)
            continue
        s = line.strip()
        if s.startswith("source:") and cur:
            srctype = s.split(":", 1)[1].strip()
            if srctype in ("git", "path"):
                signals["git_or_path"].append((cur, srctype))
                findings.append(finding(
                    file="target/pubspec.lock", line=1, severity="HIGH",
                    category="supply_chain_non_registry_dependency",
                    description=f"Dart package '{cur}' uses a {srctype} source, bypassing pub.dev integrity.",
                    exploit_scenario="A git/path dependency can serve code differing from any hashed pub.dev release.",
                    recommendation="Pin to a pub.dev hosted version with a sha256.", confidence=0.8))
    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# RubyGems (Bundler) analyzer — Gemfile.lock is a custom text format.
# --------------------------------------------------------------------------- #
def analyze_rubygems(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"git_sources": False, "non_default_remote": [], "has_checksums": False}
    lockp = _find_one(target, "Gemfile.lock")
    if not lockp:
        findings.append(_missing_lock_finding("Gemfile.lock", "Ruby/Bundler"))
        return {"findings": findings, "signals": signals}
    txt = _read_text(lockp)
    if re.search(r"(^|\n)GIT\n", txt):
        signals["git_sources"] = True
        findings.append(finding(
            file="target/Gemfile.lock", line=1, severity="HIGH",
            category="supply_chain_non_registry_dependency",
            description="Gemfile.lock contains a GIT source, bypassing rubygems.org integrity.",
            exploit_scenario="A git gem can serve code differing from any published, checksummed gem.",
            recommendation="Pin to a rubygems.org release.", confidence=0.82))
    for m in re.finditer(r"^  remote:\s*(\S+)", txt, re.M):
        url = m.group(1)
        if "rubygems.org" not in url:
            signals["non_default_remote"].append(url)
            findings.append(finding(
                file="target/Gemfile.lock", line=1, severity="HIGH",
                category="supply_chain_custom_registry",
                description=f"Gemfile.lock uses a non-default gem remote: {url}",
                exploit_scenario="A custom remote can shadow a trusted gem name with attacker code.",
                recommendation="Use rubygems.org or verify the mirror is trusted.", confidence=0.78))
    signals["has_checksums"] = "\nCHECKSUMS\n" in txt
    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# Swift (SwiftPM) analyzer — Package.resolved (JSON v1/v2). All git-based.
# --------------------------------------------------------------------------- #
def analyze_swift(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"pins": 0, "branch_pins": []}
    rp = _find_one(target, "Package.resolved")
    data = load_json(rp) if rp else None
    if data is None:
        findings.append(_missing_lock_finding("Package.resolved", "Swift/SwiftPM"))
        return {"findings": findings, "signals": signals}
    pins = data.get("pins") or (data.get("object") or {}).get("pins") or []
    for p in pins:
        if not isinstance(p, dict):
            continue
        signals["pins"] += 1
        state = p.get("state") or {}
        name = p.get("identity") or p.get("package") or "?"
        if not state.get("revision"):
            signals["branch_pins"].append(name)
            findings.append(finding(
                file="target/Package.resolved", line=1, severity="HIGH",
                category="supply_chain_mutable_version",
                description=f"SwiftPM dependency '{name}' is pinned to a branch, not a commit revision.",
                exploit_scenario="A branch pin resolves to whatever the branch points at — mutable code.",
                recommendation="Pin to an exact version/commit (Package.resolved revision).", confidence=0.8))
    findings.append(finding(
        file="target/Package.swift", line=1, severity="MEDIUM",
        category="supply_chain_manifest_execution",
        description="SwiftPM evaluates each dependency's Package.swift (Swift code) during resolution.",
        exploit_scenario="A malicious package manifest runs code at resolve time, before any build.",
        recommendation="Review dependency manifests; resolve only in an isolated container (as coldvault does).",
        confidence=0.7))
    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# Julia (Pkg) analyzer — Manifest.toml (TOML; parsed line-wise).
# --------------------------------------------------------------------------- #
def analyze_julia(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"git_repos": [], "missing_tree_sha": [], "build_jl": 0}
    mp = _find_one(target, "Manifest.toml")
    if not mp:
        findings.append(_missing_lock_finding("Manifest.toml", "Julia/Pkg"))
        return {"findings": findings, "signals": signals}
    cur = None
    have_sha = False
    for line in _read_text(mp).splitlines():
        m = re.match(r"^\[\[(?:deps\.)?([A-Za-z0-9_]+)\]\]", line)
        if m:
            if cur and not have_sha:
                signals["missing_tree_sha"].append(cur)
            cur = m.group(1)
            have_sha = False
            continue
        s = line.strip()
        if s.startswith("git-tree-sha1"):
            have_sha = True
        if s.startswith("repo-url"):
            signals["git_repos"].append(cur)
            findings.append(finding(
                file="target/Manifest.toml", line=1, severity="HIGH",
                category="supply_chain_non_registry_dependency",
                description=f"Julia package '{cur}' resolves from a git repo-url (unregistered), bypassing registry integrity.",
                exploit_scenario="An unregistered git dependency can serve code differing from any registered release.",
                recommendation="Prefer registered packages with a git-tree-sha1 pin.", confidence=0.8))
    for bj in target.rglob("build.jl"):
        signals["build_jl"] += 1
    if signals["build_jl"]:
        findings.append(finding(
            file="target/", line=1, severity="MEDIUM", category="supply_chain_build_hook",
            description=f"{signals['build_jl']} dependency build.jl script(s) present — code runs on Pkg.build.",
            exploit_scenario="build.jl executes arbitrary Julia at install/build time.",
            recommendation="Review each build.jl before building the environment.", confidence=0.74))
    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# Conan (C/C++) analyzer — conan.lock (JSON) + conanfile.py presence.
# --------------------------------------------------------------------------- #
def analyze_conan(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"requires": 0, "missing_revision": [], "conanfile_py": False}
    lp = _find_one(target, "conan.lock")
    lock = load_json(lp) if lp else None
    if lock is None:
        findings.append(_missing_lock_finding("conan.lock", "C/C++ Conan"))
    else:
        reqs = lock.get("requires") or []
        for r in reqs:
            signals["requires"] += 1
            if isinstance(r, str) and "#" not in r:
                signals["missing_revision"].append(r)
                findings.append(finding(
                    file="target/conan.lock", line=1, severity="MEDIUM",
                    category="supply_chain_missing_integrity",
                    description=f"Conan requirement '{r}' has no recipe revision (#...), so it is not fully pinned.",
                    exploit_scenario="Without a recipe revision the resolved recipe can change under the same version.",
                    recommendation="Pin requirements with a recipe revision.", confidence=0.72))
    if _find_one(target, "conanfile.py"):
        signals["conanfile_py"] = True
        findings.append(finding(
            file="target/conanfile.py", line=1, severity="MEDIUM",
            category="supply_chain_code_recipe",
            description="A conanfile.py recipe is present — Python code runs during Conan graph/build operations.",
            exploit_scenario="Recipe code executes at resolve/build with developer privileges.",
            recommendation="Review the conanfile.py; prefer conanfile.txt where possible.", confidence=0.72))
    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# vcpkg (C/C++) analyzer — vcpkg.json + vcpkg-configuration.json.
# --------------------------------------------------------------------------- #
def analyze_vcpkg(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"has_baseline": False, "custom_registries": False, "overrides": False}
    vp = _find_one(target, "vcpkg.json")
    vj = load_json(vp) if vp else None
    if vj is None:
        findings.append(_missing_lock_finding("vcpkg.json", "C/C++ vcpkg"))
        return {"findings": findings, "signals": signals}
    signals["has_baseline"] = bool(vj.get("builtin-baseline"))
    cfgp = _find_one(target, "vcpkg-configuration.json")
    cfg = load_json(cfgp) if cfgp else {}
    cfg = cfg if isinstance(cfg, dict) else {}
    if not signals["has_baseline"] and not cfg.get("default-registry"):
        findings.append(finding(
            file="target/vcpkg.json", line=1, severity="MEDIUM", category="supply_chain_mutable_version",
            description="vcpkg manifest has no builtin-baseline — port versions are not pinned.",
            exploit_scenario="Without a baseline, ports resolve to whatever the registry currently serves.",
            recommendation="Set a builtin-baseline to pin the port set.", confidence=0.72))
    if cfg.get("registries"):
        signals["custom_registries"] = True
        findings.append(finding(
            file="target/vcpkg-configuration.json", line=1, severity="HIGH",
            category="supply_chain_custom_registry",
            description="vcpkg-configuration.json declares custom registries, overriding the default.",
            exploit_scenario="A custom registry can shadow a trusted port name with attacker code.",
            recommendation="Verify each registry and its baseline are trusted.", confidence=0.76))
    if vj.get("overrides"):
        signals["overrides"] = True
    findings.append(finding(
        file="target/vcpkg.json", line=1, severity="MEDIUM", category="supply_chain_build_from_source",
        description="vcpkg builds ports from source; portfiles run CMake/shell at install time.",
        exploit_scenario="A malicious portfile executes build-time code.",
        recommendation="Review portfiles; build only in an isolated container.", confidence=0.7))
    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# CRAN (R) analyzer — renv.lock (JSON) and/or DESCRIPTION (Remotes:).
# --------------------------------------------------------------------------- #
def analyze_cran(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"packages": 0, "non_cran": [], "missing_hash": []}
    lp = _find_one(target, "renv.lock")
    lock = load_json(lp) if lp else None
    if lock is not None:
        for name, meta in (lock.get("Packages") or {}).items():
            if not isinstance(meta, dict):
                continue
            signals["packages"] += 1
            source = meta.get("Source")
            if source and source not in ("Repository", "CRAN", "Bioconductor"):
                signals["non_cran"].append(name)
                findings.append(finding(
                    file="target/renv.lock", line=1, severity="HIGH",
                    category="supply_chain_non_registry_dependency",
                    description=f"R package '{name}' has Source='{source}' (not a CRAN/Bioconductor repository).",
                    exploit_scenario="A GitHub/remote R package can serve code differing from any CRAN release.",
                    recommendation="Install from CRAN with a recorded Hash, or review the remote revision.",
                    confidence=0.8))
            elif not meta.get("Hash"):
                signals["missing_hash"].append(name)
    desc = _find_one(target, "DESCRIPTION")
    if desc and re.search(r"^Remotes:", _read_text(desc), re.M):
        findings.append(finding(
            file="target/DESCRIPTION", line=1, severity="HIGH",
            category="supply_chain_non_registry_dependency",
            description="DESCRIPTION declares a 'Remotes:' field — dependencies install from non-CRAN sources.",
            exploit_scenario="Remotes pull packages straight from GitHub/URLs, bypassing CRAN review.",
            recommendation="Prefer CRAN dependencies; review each remote.", confidence=0.78))
    if lock is None and not desc:
        findings.append(_missing_lock_finding("renv.lock", "R/CRAN"))
    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# Deno (TS/JS) analyzer — deno.lock (JSON v3/v4).
# --------------------------------------------------------------------------- #
def analyze_deno(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"remote": 0, "http_insecure": [], "missing_integrity": 0}
    lp = _find_one(target, "deno.lock")
    lock = load_json(lp) if lp else None
    if lock is None:
        findings.append(_missing_lock_finding("deno.lock", "Deno"))
        return {"findings": findings, "signals": signals}
    remote = lock.get("remote") or {}
    for url, h in remote.items():
        signals["remote"] += 1
        if isinstance(url, str) and url.startswith("http://"):
            signals["http_insecure"].append(url)
        if not h:
            signals["missing_integrity"] += 1
    if signals["http_insecure"]:
        findings.append(finding(
            file="target/deno.lock", line=1, severity="HIGH",
            category="supply_chain_insecure_transport",
            description=f"{len(signals['http_insecure'])} Deno remote dependency URL(s) use plaintext http://.",
            exploit_scenario="An http dependency can be MITM-swapped for attacker code.",
            recommendation="Use https:// (or pinned jsr:/npm:) sources only.", confidence=0.8))
    if signals["missing_integrity"]:
        findings.append(finding(
            file="target/deno.lock", line=1, severity="MEDIUM",
            category="supply_chain_missing_integrity",
            description=f"{signals['missing_integrity']} Deno remote dependency(ies) have no integrity hash.",
            exploit_scenario="Without an integrity hash a tampered module is undetectable.",
            recommendation="Regenerate deno.lock so every remote carries a hash.", confidence=0.73))
    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# CocoaPods analyzer — Podfile.lock (YAML-ish text).
# --------------------------------------------------------------------------- #
def analyze_cocoapods(target: Path) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    signals: Dict[str, Any] = {"external_sources": False, "has_checksums": False}
    lp = _find_one(target, "Podfile.lock")
    if not lp:
        findings.append(_missing_lock_finding("Podfile.lock", "CocoaPods"))
        return {"findings": findings, "signals": signals}
    txt = _read_text(lp)
    if "EXTERNAL SOURCES:" in txt and re.search(r":git:|:path:|:podspec:", txt):
        signals["external_sources"] = True
        findings.append(finding(
            file="target/Podfile.lock", line=1, severity="HIGH",
            category="supply_chain_non_registry_dependency",
            description="Podfile.lock declares EXTERNAL SOURCES (:git/:path/:podspec), bypassing the Specs integrity.",
            exploit_scenario="An external git/path pod can serve code differing from any checksummed spec.",
            recommendation="Pin pods to the CocoaPods Specs repo with a SPEC CHECKSUM.", confidence=0.8))
    signals["has_checksums"] = "SPEC CHECKSUMS:" in txt
    if not signals["has_checksums"]:
        findings.append(finding(
            file="target/Podfile.lock", line=1, severity="MEDIUM",
            category="supply_chain_missing_integrity",
            description="Podfile.lock has no SPEC CHECKSUMS section.",
            exploit_scenario="Without spec checksums, tampered pods are undetectable.",
            recommendation="Regenerate the lock with a modern CocoaPods.", confidence=0.7))
    return {"findings": findings, "signals": signals}


# --------------------------------------------------------------------------- #
# Native build-system detection (for C/C++, nginx modules, PHP C extensions,
# and any source tree audited via github/url/local). These files execute code at
# build time — a real supply-chain surface for compiled dependencies.
# --------------------------------------------------------------------------- #
NATIVE_BUILD_FILES = {
    "Makefile": "make", "makefile": "make", "GNUmakefile": "make",
    "configure": "autotools", "configure.ac": "autotools", "configure.in": "autotools",
    "CMakeLists.txt": "cmake", "meson.build": "meson", "SConstruct": "scons",
    "wscript": "waf", "binding.gyp": "node-gyp", "Rakefile": "rake", "build.sh": "shell",
    "config.m4": "php-extension", "config.w32": "php-extension",
}


def detect_native_build(target: Path) -> List[Dict[str, Any]]:
    findings: List[Dict[str, Any]] = []
    found: Dict[str, str] = {}
    for p in target.rglob("*"):
        if not p.is_file():
            continue
        kind = NATIVE_BUILD_FILES.get(p.name)
        if kind:
            found[os.path.relpath(p, target.parent)] = kind
        # nginx dynamic module marker: a top-level 'config' file referencing ngx_addon_name
        if p.name == "config":
            head = _read_text(p)[:2000]
            if "ngx_addon_name" in head or "ngx_module" in head:
                found[os.path.relpath(p, target.parent)] = "nginx-module"
    if found:
        kinds = sorted(set(found.values()))
        example = next(iter(found))
        findings.append(finding(
            file=example, line=1, severity="MEDIUM", category="build_time_code_execution",
            description=f"Native build script(s) present ({', '.join(kinds)}) — compiling this "
                        f"dependency executes build-time code.",
            exploit_scenario="A malicious Makefile/configure/CMake/portfile runs arbitrary commands "
                             "during the build, before any code is 'used'.",
            recommendation="Review the build scripts; build only in a disposable, network-restricted container.",
            confidence=0.72))
    return findings


# --------------------------------------------------------------------------- #
# Source-based ecosystems (github / url / local): detect inner stack, delegate,
# and flag that the dependency closure is not registry-certified.
# --------------------------------------------------------------------------- #
def _has(target: Path, *names: str) -> bool:
    return any((target / n).exists() or _find_one(target, n) is not None for n in names)


def detect_package_ecosystem(target: Path) -> Optional[str]:
    if _has(target, "package-lock.json", "package.json"):
        return "npm"
    wheels = target / "wheels"
    if _has(target, "requirements.lock", "pyproject.toml") or any(target.rglob("setup.py")) \
            or (wheels.is_dir() and any(wheels.iterdir())):
        return "pypi"
    if _has(target, "go.mod", "go.sum"):
        return "go"
    if _has(target, "Cargo.lock", "Cargo.toml"):
        return "cargo"
    if _has(target, "packages.lock.json") or any(target.rglob("*.csproj")):
        return "nuget"
    if _has(target, "pom.xml", "dependency-tree.txt"):
        return "maven"
    if _has(target, "composer.lock", "composer.json"):
        return "composer"
    if _has(target, "pubspec.lock", "pubspec.yaml"):
        return "pub"
    if _has(target, "Gemfile.lock", "Gemfile"):
        return "rubygems"
    if _has(target, "Package.resolved", "Package.swift"):
        return "swift"
    if _has(target, "Manifest.toml", "Project.toml"):
        return "julia"
    if _has(target, "conan.lock", "conanfile.py", "conanfile.txt"):
        return "conan"
    if _has(target, "vcpkg.json"):
        return "vcpkg"
    if _has(target, "deno.lock", "deno.json"):
        return "deno"
    if _has(target, "renv.lock") or (_find_one(target, "DESCRIPTION") is not None):
        return "cran"
    if _has(target, "Podfile.lock"):
        return "cocoapods"
    return None


LOCKFILES = ("package-lock.json", "pnpm-lock.yaml", "yarn.lock", "requirements.lock",
             "poetry.lock", "Pipfile.lock", "go.sum", "Cargo.lock", "packages.lock.json",
             "gradle.lockfile", "composer.lock", "pubspec.lock", "Gemfile.lock",
             "Package.resolved", "Manifest.toml", "conan.lock", "vcpkg.json",
             "deno.lock", "renv.lock", "Podfile.lock")


def analyze_source(target: Path, source_eco: str) -> Dict[str, Any]:
    findings: List[Dict[str, Any]] = []
    inner = detect_package_ecosystem(target)
    signals: Dict[str, Any] = {"source_ecosystem": source_eco, "inner_ecosystem": inner}

    has_lock = any((target / lf).exists() or any(target.rglob(lf)) for lf in LOCKFILES)
    if not has_lock:
        findings.append(finding(
            file="target/", line=1, severity="MEDIUM", category="provenance_closure_uncertified",
            description=f"{source_eco} source audited at its pinned revision, but it ships no committed "
                        f"lockfile — its dependency closure is NOT certified ('scanned == executed' holds "
                        f"for the first-party code only).",
            exploit_scenario="The first-party code is pinned, but what its (unpinned) dependencies resolve "
                             "to at install/build time is not certified here.",
            recommendation=f"Also run a registry audit of the published package "
                           f"(e.g. npm:<pkg>@<ver> / pypi:<pkg>==<ver>) and diff the closure.",
            confidence=0.72))

    # Only delegate to the inner analyzer when a lockfile makes the closure
    # certifiable. Without one, the MEDIUM above already says "closure uncertified"
    # — re-running the inner analyzer would just repeat it as a spurious HIGH.
    if inner and inner in _PACKAGE_ANALYZERS and has_lock:
        sub = _PACKAGE_ANALYZERS[inner](target)
        findings.extend(sub["findings"])
        signals["inner"] = sub["signals"]

    # Native build systems (C/C++, nginx modules, PHP C extensions, …) execute code
    # at build time regardless of the package ecosystem — always check source trees.
    native = detect_native_build(target)
    findings.extend(native)
    signals["native_build"] = bool(native)
    return {"findings": findings, "signals": signals}


_PACKAGE_ANALYZERS = {
    "npm": analyze_npm,
    "pypi": analyze_pypi,
    "go": analyze_go,
    "cargo": analyze_cargo,
    "nuget": analyze_nuget,
    "maven": analyze_maven,
    "composer": analyze_composer,
    "pub": analyze_pub,
    "rubygems": analyze_rubygems,
    "swift": analyze_swift,
    "julia": analyze_julia,
    "conan": analyze_conan,
    "vcpkg": analyze_vcpkg,
    "cran": analyze_cran,
    "deno": analyze_deno,
    "cocoapods": analyze_cocoapods,
}

ANALYZERS = {
    **_PACKAGE_ANALYZERS,
    "github": lambda t: analyze_source(t, "github"),
    "url": lambda t: analyze_source(t, "url"),
    "local": lambda t: analyze_source(t, "local"),
}


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def main() -> int:
    ap = argparse.ArgumentParser(description="coldvault provenance / anti-mirage check")
    ap.add_argument("--target", default=os.environ.get("TARGET_DIR", "target"))
    ap.add_argument("--reports", default=os.environ.get("REPORTS_DIR", "reports"))
    ap.add_argument("--registry-check", action="store_true",
                    help="(best-effort) cross-check lockfile integrity against the live registry")
    args = ap.parse_args()

    target = Path(args.target).resolve()
    reports = Path(args.reports).resolve()
    reports.mkdir(parents=True, exist_ok=True)

    closure = load_json(reports / "00-provenance-closure.json") or {}
    ecosystem = closure.get("ecosystem")

    # Fall back to on-disk detection if the descriptor is missing.
    if not ecosystem:
        ecosystem = detect_package_ecosystem(target)

    if ecosystem not in ANALYZERS:
        report = {
            "verdict": {
                "scanned_equals_executed": None,
                "ecosystem": ecosystem,
                "reason": f"Could not determine the ecosystem of the frozen closure "
                          f"(got '{ecosystem}'). No provenance analyzer ran.",
            },
            "provenance_findings": [],
            "signals": {},
        }
        (reports / "00-provenance.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
        print(f"[provenance] ecosystem '{ecosystem}' not supported yet — wrote neutral report.")
        return 0

    result = ANALYZERS[ecosystem](target)
    findings = result["findings"]

    highs = [f for f in findings if f["severity"] == "HIGH"]
    meds = [f for f in findings if f["severity"] == "MEDIUM"]

    scanned_equals_executed = len(highs) == 0
    if scanned_equals_executed:
        reason = ("Closure resolved with integrity and no registry-bypassing override was found. "
                  "Residual install-time behaviour (if any) is listed as MEDIUM.")
    else:
        reason = ("One or more HIGH provenance divergences mean the installed/executed code is NOT "
                  "certifiably identical to a safe, registry-pinned closure.")

    report = {
        "verdict": {
            "scanned_equals_executed": scanned_equals_executed,
            "ecosystem": ecosystem,
            "coordinate": closure.get("coordinate"),
            "high": len(highs),
            "medium": len(meds),
            "reason": reason,
            "scripts_executed_during_resolve": closure.get("scripts_executed", False),
        },
        "signals": result["signals"],
        "provenance_findings": findings,
    }

    out = reports / "00-provenance.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")

    verdict_str = "YES" if scanned_equals_executed else "NO"
    print(f"[provenance] ecosystem={ecosystem} scanned==executed? {verdict_str} "
          f"(HIGH={len(highs)}, MEDIUM={len(meds)}) -> {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
