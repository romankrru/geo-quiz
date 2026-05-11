#!/usr/bin/env bash
# Ralph loop driver.
#
# Universal: pass any PRD-style issue (number or URL) on the project tracker;
# the loop calls the agent once per iteration with .agents/ralph/PROMPT.md
# until the PRD is done or a human is needed.
#
# Usage:
#   bash .agents/ralph/loop.sh <prd-issue-number-or-url>
#
# Environment:
#   MAX_ITERS    hard cap on iterations (default: 20)
#   AGENT_CMD    agent command, must accept '-p <prompt>' (default: cursor-agent)
#   AGENT_ARGS   extra args inserted before '-p' (whitespace-split, no nested quotes)
#                e.g. AGENT_ARGS="--dangerously-skip-permissions" for Claude Code
#   DRY_RUN      if set to '1', print what would happen and exit before calling the agent
#
# Exit codes:
#   0 — STATUS=done observed; PRD closed.
#   2 — STATUS=blocked observed; human attention needed.
#   3 — agent returned no STATUS sentinel (treat as bug in PROMPT.md or agent crash).
#   4 — hit MAX_ITERS without reaching done/blocked.
#   5 — bad usage / preconditions failed.

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
AGENT_CMD="${AGENT_CMD:-cursor-agent}"
AGENT_ARGS="${AGENT_ARGS:-}"
DRY_RUN="${DRY_RUN:-0}"

read -ra AGENT_ARGS_ARR <<< "$AGENT_ARGS"

PROMPT_BODY="Follow .agents/ralph/PROMPT.md for PRD=$PRD. End your response with exactly one line: STATUS=done | STATUS=progress | STATUS=blocked."

if [[ "$DRY_RUN" = "1" ]]; then
  echo "[dry-run] PRD=$PRD MAX_ITERS=$MAX_ITERS AGENT_CMD=$AGENT_CMD AGENT_ARGS='$AGENT_ARGS'"
  echo "[dry-run] would call: $AGENT_CMD ${AGENT_ARGS_ARR[*]+${AGENT_ARGS_ARR[*]}} -p \"<prompt>\""
  echo "[dry-run] prompt:"
  printf '%s\n' "$PROMPT_BODY" | sed 's/^/  /'
  exit 0
fi

if ! command -v "$AGENT_CMD" >/dev/null 2>&1; then
  echo "agent command not found on PATH: $AGENT_CMD" >&2
  exit 5
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found on PATH" >&2
  exit 5
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "gh is not authenticated; run 'gh auth login'" >&2
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

  if ! "$AGENT_CMD" ${AGENT_ARGS_ARR[@]+"${AGENT_ARGS_ARR[@]}"} -p "$PROMPT_BODY" 2>&1 | tee "$log"; then
    echo "agent command failed on iter $i; see $log" >&2
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
      echo "PRD #$PRD blocked after $i iteration(s); human attention needed."
      echo "Last log: $log"
      exit 2
      ;;
    STATUS=progress)
      ;;
    *)
      echo ""
      echo "no STATUS sentinel found in $log; aborting." >&2
      exit 3
      ;;
  esac
done

echo ""
echo "hit MAX_ITERS=$MAX_ITERS without finishing PRD #$PRD." >&2
exit 4
