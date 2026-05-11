# Ralph

A simple loop that takes a PRD on the project tracker and drives its child issues to merged code.

## Idea

Ralph is a `while not done: agent_step()` loop. Each iteration the agent re-reads GitHub from scratch, picks **one** ready child issue of the PRD, and either implements it (via the `implement-issue` skill) or babysits an in-flight PR. State lives in issues and PRs, never in memory.

This works because the inner skills (`implement-issue`, `babysit`) are already idempotent: if you run them twice on the same issue or PR, the second run notices the work is in progress and continues from there.

## Prerequisites

- `gh` CLI authenticated (`gh auth status` is green).
- Claude Code CLI `claude` on `PATH`.
- The PRD lives in this repo and uses one of the supported child-discovery formats (see below).
- All children you want ralph to work on carry the `ready-for-agent` label. Anything HITL stays unlabeled or carries `ready-for-human` and ralph leaves it alone.

## Run

```bash
bash .agents/ralph/loop.sh 13
# or
bash .agents/ralph/loop.sh https://github.com/romankrru/geo-quiz/issues/13
```

Each iteration is logged to `.agents/ralph/logs/<timestamp>-prd-<n>/iter-NN.log`. The folder is gitignored.

The loop invokes `claude --dangerously-skip-permissions -p …` so GitHub CLI and other tools are not stuck behind permission prompts every step. Only run Ralph on repos you trust.

### Knobs

- `MAX_ITERS=N` — hard cap on iterations. Default 20.

### Exit codes

| Code | Meaning                                                                                         |
| ---- | ----------------------------------------------------------------------------------------------- |
| 0    | PRD finished — all children merged, PRD closed.                                                 |
| 2    | Blocked. A child needs human attention; see the last log and the comment ralph left on the PRD. |
| 3    | Agent returned without a `STATUS=...` line. Bug in the prompt or agent crash.                   |
| 4    | Hit `MAX_ITERS`. Either raise the cap or investigate why progress is slow.                      |
| 5    | Bad usage / preconditions failed (no `gh`, no auth, can't parse issue number, …).               |

## How children are discovered

Two routing labels, set up by the `to-issues` skill (see its step 5):

- `prd` — applied only to the parent PRD issue.
- `prd-<n>` — applied to the PRD **and** every child slice, where `<n>` is the PRD's issue number.

Ralph runs `gh issue list --label "prd-<n>" --state all`, filters out the PRD itself, and orders the remainder by issue number ascending. That ordered list is the work queue.

If the PRD or its children are missing these labels, ralph leaves a comment asking the maintainer to (re-)run `to-issues` and exits with code 2. Don't add the labels by hand — let `to-issues` own that contract end-to-end.

## What ralph **does not** do

- Implement HITL slices. Anything without `ready-for-agent` is left for a human.
- Edit the PRD body. The `## Tasks` checklist is owned by `to-issues` and humans. GitHub itself ticks the boxes when child issues close.
- Resolve merge conflicts of substance. `babysit` resolves trivial conflicts; anything with conflicting _intent_ gets `STATUS=blocked`.
- Run in parallel. Sequential is intentional — concurrent ralph runs on the same PRD will fight over branches and CI.
- Persist state between iterations. If a run dies mid-way, just start it again.

## Failure recovery

- **Stuck on the same child for many iterations** — kill the loop, look at the latest log, fix the brief on the issue (more acceptance criteria, ADR pointer, clarified vocabulary), re-run.
- **PR review left a substantive comment** — ralph stops with `blocked`. Address it (or have a human do so), then re-run.
- **CI flake** — `babysit` retries small fixes a few times, then gives up with `blocked`. Re-run after the flake clears.

## Related

- `.agents/skills/to-issues/SKILL.md` — the upstream of this loop. Breaks a PRD into the children ralph then chews through.
- `.agents/skills/implement-issue/SKILL.md` — the per-issue worker called by ralph.
- `.agents/skills/babysit/SKILL.md` (or the cursor-level `babysit` skill) — used to land an open PR.
- `docs/agents/issue-tracker.md` — `gh` conventions.
- `docs/agents/triage-labels.md` — label vocabulary.
