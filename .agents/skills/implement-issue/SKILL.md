---
name: implement-issue
description: Take a single ready-for-agent issue from the project tracker to a merged PR. Use when the user says "implement #N", "do issue #N", or as the per-issue worker called from the ralph loop.
---

# Implement Issue

Drive **one** issue end-to-end: branch → tests → implementation → PR → merged. Stop on the first sign that human judgement is needed.

## Invocation

The user (or ralph) passes an issue number, URL, or `gh` reference. Everything else is recovered from the tracker.

## Reference docs

- `docs/agents/issue-tracker.md` — `gh` CLI conventions for this repo.
- `docs/agents/triage-labels.md` — label vocabulary.
- `AGENTS.md` — stack, scripts, codebase conventions.
- `CONTEXT.md` — domain glossary; titles, commits and PR bodies must use this vocabulary.
- `docs/adr/` — respect prior decisions in the area you are touching.
- Sibling skills: `tdd` for the inner loop, `grill-with-docs` if the brief is ambiguous, `loop-on-ci` to make the PR checks green.

## Process

### 1. Read the brief, decide if you should act

```bash
gh issue view <n> --comments --json number,title,body,labels,state
```

Stop and report back to the caller (do **not** start work) if any of these is true:

- `state` is not `OPEN`.
- Labels do **not** include `ready-for-agent`.
- Labels include `needs-info`, `needs-triage`, `ready-for-human`, or `wontfix`.
- The body lists "Blocked by" issues that are still open.

When stopping, leave a one-line comment on the issue explaining why and exit. Don't silently skip.

If an open PR already exists with `Closes #<n>` in its body, check out its head with `gh pr checkout <pr>` and resume at step 6 with that PR instead of creating another one.

If a `ralph/<n>-*` branch already exists locally or on origin (a previous iteration crashed mid-run) but has no associated PR, check it out, push it if not yet on origin, and jump straight to step 5 to open the PR. Don't redo the TDD work.

### 2. Sync with the domain

Read `CONTEXT.md` and the relevant ADRs. The issue body uses domain terms — your branch name, commit messages, PR title, and code identifiers should reuse those terms verbatim (e.g. **Quiz preferences store**, **Configured round size**).

If the brief contradicts an ADR or invents new vocabulary, treat it as ambiguous: post a comment with your concern, set `needs-info`, and stop. Do not "fix" the brief by writing code.

### 3. Prepare the branch

Look up the epic integration branch from the issue's `prd-<P>` routing label. The epic is the only open PR carrying `prd-<P>` whose base is `main`:

```bash
prd="$(gh issue view <n> --json labels \
  --jq '[.labels[].name | select(startswith("prd-"))][0] // "" | sub("^prd-"; "")')"
epic="$(gh pr list --label "prd-$prd" --base main --state open \
  --json headRefName --jq '.[0].headRefName // "main"')"
```

Branch off the epic, **never off `main`** when called from ralph:

```bash
git fetch origin
git switch "$epic" && git pull --ff-only origin "$epic"
git switch -c ralph/<n>-<short-slug>
```

Slug: lowercase kebab from issue title, ≤ 5 words. Example: `ralph/14-preferences-store-and-resolution`.

Solo invocation (issue carries no `prd-<P>` label) — `epic` falls back to `"main"`. That's fine; work the issue solo. Skip the squash-into-epic step at the end and merge into `main` directly per project policy.

### 4. Implement via TDD

Follow the `tdd` skill. One test → one implementation → repeat. Vertical slices, never horizontal.

The "Acceptance criteria" checklist in the issue body is your test list. Each criterion becomes at least one test. Do not check items off in the issue body — GitHub auto-progress lives on the PRD-level Tasks list, not on per-issue criteria.

Local checks before opening the PR (these mirror what CI will run):

```bash
npm run lint
npm run prettier
npm run build
npx vitest run
```

Fix everything red before pushing.

### 5. Open the PR

```bash
git push -u origin HEAD
gh pr create \
  --base "$epic" \
  --title "<issue title>" \
  --label "prd-$prd" \
  --body "$(cat <<'EOF'
Closes #<n>
Refs #<prd>

## Summary

<2-4 bullets describing observable behaviour, in domain vocabulary>

## Test plan

- [ ] <how to verify each acceptance criterion>
EOF
)"
```

Title mirrors the issue title (so the merge commit stays grep-able). Body must contain `Closes #<n>` so GitHub auto-closes the issue when the **epic** PR eventually merges into `main` (it does not fire when the child PR merges into the epic branch — that's expected). The `--label "prd-$prd"` keeps the child PR discoverable from the same routing label as the epic.

### 6. Make CI green and squash-merge into the epic

Read the PR's actual base branch, then follow `.agents/skills/loop-on-ci/SKILL.md` on the checked-out PR:

```bash
epic="$(gh pr view <pr> --json baseRefName --jq .baseRefName)"
```

Loop until every PR-attached check is green. CI is the landing gate; do not wait for or process review comments. When the skill refers to updating from `main`, use `$epic` instead.

Confirm the PR is mergeable after CI passes. If GitHub reports `UNKNOWN`, wait briefly and retry up to three times:

```bash
gh pr view <pr> --json mergeable,mergeStateStatus
```

If it conflicts with its base branch, stop and report the conflict instead of resolving it automatically.

Then squash-merge into the epic branch:

```bash
gh pr merge <pr> --squash --delete-branch
```

Squash keeps the epic-branch history one-commit-per-issue, which makes the eventual epic→main diff readable for QA. `--delete-branch` cleans up `ralph/<n>-*` on origin.

If `loop-on-ci` reports a blocker it cannot resolve (a repeated failure, an unrelated failure, or a persistent CI flake), stop. Add `needs-info` to the **issue** (not the PR), comment on the issue with the blocker, and exit.

### 7. Comment, do not close

After squash-merge into the epic, the issue stays **open** — it's only merged into the integration branch, not `main`. Do not try to close it. GitHub auto-closes it when the maintainer eventually merges the epic PR into `main` (your `Closes #<n>` body line fires then).

Post a one-line comment so the issue timeline reflects what happened:

```bash
gh issue comment <n> --body "Merged into epic branch \`$epic\` via #<pr>."
```

Do not edit the parent PRD. The epic PR's summary (managed by ralph in its `STATUS=done` action) is the single source of truth for what landed under each PRD.

## Anti-patterns

- **Speculative scope**: implementing things "while we're here" that aren't in the acceptance criteria. Open a follow-up issue instead.
- **Squashing two issues into one PR**: each PR closes exactly one issue. If you discover hidden coupling, stop and report — let a human decide.
- **Hiding blockers**: if you're stuck, say so on the issue. Silent skips break the ralph loop's mental model.
- **Touching the parent PRD body**: ralph may post a summary there at the end; the per-issue worker must not.
