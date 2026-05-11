#!/usr/bin/env bash
# Ralph (single shot): runs exactly one `claude` iteration (see PROMPT.md) for the PRD.
# Usage: bash .agents/ralph/loop-once.sh <issue# or GitHub issue URL>
# Logs under .agents/ralph/logs/.
# Uses --allowed-tools to explicitly allow Bash + file/search tools so `gh` and other commands are not blocked on every prompt (required for this loop).

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <prd-issue-number-or-url>" >&2
  exit 5
fi

PRD_RAW="$1"
PRD="${PRD_RAW##*/}"
if ! [[ "$PRD" =~ ^[0-9]+$ ]]; then
  echo "could not parse issue number from '$PRD_RAW'" >&2
  exit 5
fi

PROMPT_BODY="Follow .agents/ralph/PROMPT.md for PRD=$PRD. End your response with exactly one line: STATUS=done | STATUS=progress | STATUS=blocked."

if ! command -v claude >/dev/null 2>&1; then
  echo "claude not found on PATH" >&2
  exit 5
fi

if ! command -v gh >/dev/null 2>&1 || ! gh auth status >/dev/null 2>&1; then
  echo "need gh installed and authenticated (gh auth login)" >&2
  exit 5
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

LOG_DIR="$REPO_ROOT/.agents/ralph/logs/$(date +%Y%m%d-%H%M%S)-prd-$PRD-once"
mkdir -p "$LOG_DIR"
echo "logs: $LOG_DIR"

echo ""
echo "── ralph single iter — PRD #$PRD ──"
log="$LOG_DIR/iter-01.log"

if ! claude --allowed-tools=Bash,Read,Edit,Write,MultiEdit,Grep,Glob "$PROMPT_BODY"; then
  echo "claude failed; see $log" >&2
  exit 3
fi

status="$(grep -oE 'STATUS=(done|progress|blocked)' "$log" | tail -1 || true)"

case "$status" in
  STATUS=done)
    echo ""
    echo "PRD #$PRD complete."
    exit 0
    ;;
  STATUS=blocked)
    echo ""
    echo "PRD #$PRD blocked; see $log"
    exit 2
    ;;
  STATUS=progress)
    echo ""
    echo "PRD #$PRD made progress; more iterations needed. See $log"
    exit 4
    ;;
  *)
    echo ""
    echo "no STATUS=… line in $log" >&2
    exit 3
    ;;
esac
