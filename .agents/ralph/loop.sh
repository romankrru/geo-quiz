#!/usr/bin/env bash
# Ralph: each iteration runs `claude` (see PROMPT.md) for the PRD until STATUS=done|blocked or MAX_ITERS.
# Usage: bash .agents/ralph/loop.sh <issue# or GitHub issue URL>
# Optional: MAX_ITERS (default 20). Logs under .agents/ralph/logs/.
# Uses --dangerously-skip-permissions so `gh` and other Bash tools are not blocked on every prompt (required for this loop).

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

MAX_ITERS="${MAX_ITERS:-20}"
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

LOG_DIR="$REPO_ROOT/.agents/ralph/logs/$(date +%Y%m%d-%H%M%S)-prd-$PRD"
mkdir -p "$LOG_DIR"
echo "logs: $LOG_DIR"

for i in $(seq 1 "$MAX_ITERS"); do
  echo ""
  echo "── ralph iter $i / $MAX_ITERS — PRD #$PRD ──"
  log="$LOG_DIR/iter-$(printf '%02d' "$i").log"

  if ! claude --dangerously-skip-permissions -p "$PROMPT_BODY" 2>&1 | tee "$log"; then
    echo "claude failed on iter $i; see $log" >&2
    exit 3
  fi

  status="$(grep -oE 'STATUS=(done|progress|blocked)' "$log" | tail -1 || true)"

  case "$status" in
    STATUS=done)
      echo ""
      echo "PRD #$PRD complete after $i iteration(s)."
      exit 0
      ;;
    STATUS=blocked)
      echo ""
      echo "PRD #$PRD blocked after $i iteration(s); see $log"
      exit 2
      ;;
    STATUS=progress) ;;
    *)
      echo ""
      echo "no STATUS=… line in $log" >&2
      exit 3
      ;;
  esac
done

echo ""
echo "hit MAX_ITERS=$MAX_ITERS for PRD #$PRD" >&2
exit 4
