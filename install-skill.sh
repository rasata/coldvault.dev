#!/usr/bin/env bash
# coldvault.dev — install the portable `coldvault-audit` skill (ZONOVA RESEARCH).
#
# Makes `/coldvault-audit` available from ANY project by linking the skill and
# command into your user-level Claude config (~/.claude). The audit itself always
# runs in a disposable GitHub container against your coldvault fork — this just
# installs the invocation entry points on your machine.
#
# Usage:
#   ./install-skill.sh [--copy] [--fork <owner>/coldvault.dev] [--uninstall]
#
#   --copy       Copy files instead of symlinking (default: symlink to this repo).
#   --fork SLUG  Record which GitHub fork hosts the sandbox (owner/repo).
#   --uninstall  Remove the installed skill/command links.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_HOME="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
SKILL_SRC="$REPO_ROOT/.claude/skills/coldvault-audit"
CMD_SRC="$REPO_ROOT/.claude/commands/coldvault-audit.md"
SKILL_DST="$CLAUDE_HOME/skills/coldvault-audit"
CMD_DST="$CLAUDE_HOME/commands/coldvault-audit.md"
FORK_FILE="$CLAUDE_HOME/coldvault-audit.fork"

MODE="symlink"; FORK=""; ACTION="install"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --copy) MODE="copy"; shift ;;
    --fork) FORK="${2:-}"; shift 2 ;;
    --uninstall) ACTION="uninstall"; shift ;;
    -h|--help) grep -E '^#( |$)' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 2 ;;
  esac
done

info() { printf '\033[1;36m[install]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[warn]\033[0m    %s\n' "$*"; }

if [[ "$ACTION" == "uninstall" ]]; then
  rm -rf "$SKILL_DST"; rm -f "$CMD_DST"
  info "Removed $SKILL_DST and $CMD_DST (fork note kept at $FORK_FILE)."
  exit 0
fi

[[ -d "$SKILL_SRC" ]] || { echo "Skill source not found: $SKILL_SRC" >&2; exit 1; }

mkdir -p "$CLAUDE_HOME/skills" "$CLAUDE_HOME/commands"

link_or_copy() {
  local src="$1" dst="$2"
  rm -rf "$dst"
  if [[ "$MODE" == "copy" ]]; then
    cp -a "$src" "$dst"
  else
    ln -s "$src" "$dst"
  fi
}

link_or_copy "$SKILL_SRC" "$SKILL_DST"
link_or_copy "$CMD_SRC" "$CMD_DST"
info "Installed skill  -> $SKILL_DST ($MODE)"
info "Installed command -> $CMD_DST ($MODE)"

# Record / detect the sandbox fork used for `gh workflow run -R <fork>`.
if [[ -z "$FORK" ]] && command -v gh >/dev/null 2>&1; then
  FORK="$(gh repo list --fork --json nameWithOwner,parent \
          -q '.[] | select(.parent.name=="coldvault.dev") | .nameWithOwner' 2>/dev/null | head -1 || true)"
fi
if [[ -n "$FORK" ]]; then
  printf '%s\n' "$FORK" > "$FORK_FILE"
  info "Sandbox fork recorded: $FORK  (-> $FORK_FILE)"
else
  warn "No coldvault fork detected. Fork coldvault.dev on GitHub, then re-run with:"
  warn "    ./install-skill.sh --fork <owner>/coldvault.dev"
fi

cat <<EOF

Next:
  1. Ensure a GitHub account is connected:   gh auth status
  2. From any project, ask Claude:           /coldvault-audit npm:lodash@4.17.21
  The audit runs in a disposable container on your fork; results come back here.
EOF
