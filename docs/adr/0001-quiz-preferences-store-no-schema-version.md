# Quiz preferences store has no schema-version envelope

The **Statistics store** persists **Quiz session records** under a versioned envelope (`Statistics store schema version`) with an `outdated-client (statistics)` read state, because losing or silently rewriting historical play data is costly. The **Quiz preferences store** holds only forward-looking UI preferences (today: **Configured round size**); the worst case from a corrupt or unrecognised blob is one round at the default length, and there is no historical data to corrupt.

We deliberately ship the **Quiz preferences store** as a plain `localStorage` JSON blob with parse-and-default semantics — no `schemaVersion`, no outdated-client handshake. Future readers should not "fix" the asymmetry by porting the statistics envelope here; if a preference field ever needs a non-trivial migration, introducing versioning at that point is a small, local change.

## Considered options

- **Mirror the Statistics store** (versioned envelope + `outdated-client` UX). Rejected: ceremony disproportionate to the data; a stale tab refusing to save a round-length preference is worse UX than silently using the default for that tab.
- **Try/catch with a default, plus a `schemaVersion` field "just in case".** Rejected: an unused version field invites cargo-culted handling code and gives the false impression that older formats are supported when they aren't.
