---
name: git-commit
description: Stages current repo changes and creates a git commit with a message following geo-quiz conventions (short imperative title, no Conventional Commits prefixes). Use when the user asks for a commit, invokes git-commit, or wants changes committed without a separate confirm step.
disable-model-invocation: true
---

# Git commit (geo-quiz)

## Workflow (execute, do not wait for confirmation)

1. Run `git status` and inspect `git diff` plus `git diff --staged` so the commit message matches the actual delta.
2. If there is **nothing** to commit (clean tree), say so and stop.
3. **Stage**: from the repository root, run `git add -A` unless the user **in the same request** named specific paths — then stage only those paths.
4. **Message**: follow [Message format](#message-format) below. Prefer a single `-m` for title only; add a second `-m` for body when needed.
5. Run `git commit` with the chosen message(s). Use shell permissions that allow **git_write** when the environment requires it.
6. **Reply** with the exact commit message used, the short hash from `git log -1 --oneline`, and a one-line summary of what went in (no paste-only instructions unless the commit failed).

If `git commit` fails (e.g. hook, empty message), report stderr and do not claim success.

## Message format

- **Title**: one short **imperative** line, matching recent project style (`Add …`, `Fix …`, `Update …`, etc.).
- **Do not** use Conventional Commits-style prefixes (`fix(hooks):`, `feat:`, `chore:`).
- **Body** (optional): second `-m` only when the title alone would hide important context; plain sentences, no scope tags.

## Quality checks to mention when relevant

- Per **AGENTS.md** (Conventions), mention `npm run prettier:fix` and `npm run lint` when the change touches code style or TypeScript (after commit is fine; do not block the commit on it unless hooks fail).
