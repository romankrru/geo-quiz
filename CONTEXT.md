# Geo Quiz

A flag-to-country quiz in the browser: each round asks the player to match flags to country names.

## Language

**Statistics store**:
Quiz-related aggregates and per-session records persisted in the browser’s `localStorage` on the user’s device. There is no server-side statistics sync in the current product scope.

_Avoid_: implying cloud backup or multi-device continuity unless that becomes explicit scope.

**Completed quiz (recorded)**:
A quiz round that counts toward statistics only after the player reaches the results screen following the last question. Abandoned rounds (tab closed, navigation away before results) are not recorded.

_Avoid_: counting partial rounds as full games.

**Best streak**:
The longest chain of consecutive **Completed quiz (recorded)** entries when ordered by completion time, such that every quiz in the chain achieved the maximum score for that round (every question answered correctly).

_Avoid_: using “streak” for daily login habits or for in-round runs of correct answers unless those become separate, named metrics.

**Quiz session record**:
One persisted row in the **Statistics store** for a **Completed quiz (recorded)**. It includes: when the quiz finished, the score (number of correct answers), how many questions were in that round, and the **Round duration (recorded)**.

_Avoid_: omitting **question count per round** — round length may change over time, and old rows must stay interpretable.

**Round duration (recorded)**:
Elapsed time from the start of the quiz round until the player reaches the results screen. Time spent on the results screen itself does not count.

_Avoid_: treating post-game browsing or time on the home screen as part of round duration.

**Average score (statistics)**:
The mean, across **Quiz session records**, of each session’s score divided by that session’s question count — expressed as a percentage. Each completed quiz contributes equally to this average.

_Avoid_: using this label for the aggregate “all correct ÷ all questions” ratio — that is **Overall accuracy (statistics)**.

**Overall accuracy (statistics)**:
The ratio of total correct answers to total questions attempted, summed across all **Quiz session records** — expressed as a percentage. Longer rounds contribute more answers than shorter rounds.

_Avoid_: conflating it with **Average score (statistics)** when rounds can have different lengths.

**Statistics percentage display**:
Percentage values shown for **Average score (statistics)** and **Overall accuracy (statistics)** are rounded for display to **two** digits after the decimal separator (e.g. `12.34%`).

_Avoid_: showing raw floating output without a fixed decimal precision in the statistics UI.

**Best score (statistics)**:
The **Quiz session record** with the highest score-to-question-count ratio (accuracy for that session). The UI shows that session’s score and question count as “score / question count”. If two sessions tie on accuracy, the one with the **larger question count** wins (a perfect longer round outranks an equally accurate shorter round).

_Avoid_: ranking by raw score alone when question counts may differ — that can rank a weaker percentage above a stronger one.

**Statistics empty state**:
When there are no **Quiz session records**, the statistics screen shows a short message explaining that nothing is recorded yet and that the player should finish a quiz to see aggregates — instead of the grid of numeric statistic cards.

_Avoid_: presenting **0%** or similar placeholders as if they reflected poor performance before any **Completed quiz (recorded)** exists.

**Statistics reset**:
A deliberate user action on the statistics screen that removes every **Quiz session record** from the **Statistics store** on this device. The flow requires explicit confirmation, because the change is irreversible in the app and only affects local device storage.

_Avoid_: implying recovery from backup or cross-device sync after a reset — there is none in current scope.

**Statistics store schema version**:
A number persisted with the **Statistics store** so the app can recognize the on-disk shape of **Quiz session records**, run forward migrations when the format changes, and avoid treating incompatible legacy blobs as valid data.

_Avoid_: reading unparsed or older-format storage as if it were the current **Quiz session record** contract.

**Outdated client (statistics)**:
Situation where persisted **Statistics store schema version** is **higher** than the running build understands (e.g. another tab wrote a newer format). The client must **not** write back over that storage; it should prompt the user to reload or refresh so a current build owns the file — rather than showing guessed metrics or corrupting newer-format rows.

_Avoid_: silently wiping or downgrading on-disk statistics written by a newer version.

**Configured round size**:
The player’s persisted preference, on this device, for how many questions the **next** **Completed quiz (recorded)** should contain. A setting about future rounds — distinct from a record’s historical **question count per round**. It may be either a **fixed** positive integer (within the catalog size) or the intent **All countries in catalog** — meaning “use everyone currently in the deck”, which tracks the catalog if country rows are added or removed later. Once a round has begun (questions generated), changing this preference does not alter that in-flight round — only the **next** round reads the saved value again.

_Avoid_: calling this “session settings” or reusing **question count per round** for it — that term is reserved for the count stored on a finished record.

**Quiz preferences store**:
Device-local persisted quiz UI preferences (including **Configured round size**) in `localStorage`, separate from the **Statistics store**. There is no schema-version envelope for this blob in current scope — unreadable or corrupt preference JSON falls back to the **Configured round size** default (fixed **10**).

_Avoid_: lumping preference persistence into the **Statistics store** envelope — preferences evolve independently from **Quiz session records**.

_Avoid_: expecting **Outdated client (statistics)**-style behaviour for the **Quiz preferences store** — preference blobs use parse-and-default without a separate schema-version handshake.

## Relationships

- One **Completed quiz (recorded)** appends one **Quiz session record** to the **Statistics store** when the player finishes the final question and sees results.
- **Best streak** is derived from the ordered list of **Quiz session records** and each record’s score relative to that record’s question count (not stored separately as its own aggregate).
- **Average score (statistics)** and **Overall accuracy (statistics)** are both derived from the same **Quiz session records** but use different aggregation rules; they need not match when question counts differ between sessions. When shown as percentages, both follow **Statistics percentage display**.
- **Best score (statistics)** picks a single **Quiz session record** using accuracy-first ordering, then breaks ties by larger question count.
- The **Statistics empty state** applies exactly when the **Statistics store** contains zero **Quiz session records**.
- A **Statistics reset** empties the **Statistics store**, after which the UI returns to the **Statistics empty state** until new **Completed quiz (recorded)** rows exist.
- The persisted **Statistics store** carries a **Statistics store schema version** together with its **Quiz session records**.
- An **Outdated client (statistics)** treats the **Statistics store** as read-only from that bundle’s perspective until the user loads a build that understands the on-disk **Statistics store schema version**.
- The **Configured round size** is read at the start of a new round to decide how many questions to generate; it does not retroactively change any existing **Quiz session record**, whose **question count per round** stays as recorded.
- Changing **Configured round size** while a round is in progress does not resize or regenerate that round’s question list; only the **next** round uses the newly saved preference.
- When **Configured round size** is **All countries in catalog**, the implemented question count for that round is the current catalog length at **start of round** time; **Quiz session records** still store that concrete **question count per round** for history.
- **Quiz preferences store** is independent of **Statistics store**; resetting statistics does not reset **Configured round size**. Corrupt or unreadable preference JSON yields the **Configured round size** default until valid preferences are saved again.

## Example dialogue

> **Dev:** "Where do statistics live?"
> **Domain expert:** "On the device only — `localStorage`. Nothing is sent to a server for stats."

> **Dev:** "Does closing the tab mid-quiz count as a played game?"
> **Domain expert:** "No — only a **Completed quiz (recorded)** after the results screen counts."

> **Dev:** "What does **Best streak** measure?"
> **Domain expert:** "The longest run of back-to-back perfect rounds — each recorded quiz in the chain must be flawless."

> **Dev:** "What do we store per finished quiz?"
> **Domain expert:** "Finish time, score, how many questions were in that round, and how long the round took — from start until the results screen, not while reading results."

> **Dev:** "We show both average score and overall accuracy — aren’t those the same?"
> **Domain expert:** "Not when rounds have different lengths: one weights each **game** equally, the other weights every **answer** equally."

> **Dev:** "How do we pick **Best score** if some quizzes had more questions than others?"
> **Domain expert:** "Rank by accuracy first — score ÷ questions — and show that quiz’s **score / question count**. If it’s a tie, the longer quiz wins."

> **Dev:** "What if the player opens statistics before playing once?"
> **Domain expert:** "Show a **Statistics empty state** — a short note that there’s nothing yet — not a wall of fake zeros that looks like failure."

> **Dev:** "Can the player wipe their history?"
> **Domain expert:** "Yes — **Statistics reset** from the statistics screen, with a confirmation step. Gone on this device only; no undo."

> **Dev:** "What if we change what gets saved later?"
> **Domain expert:** "Ship a **Statistics store schema version** — bump it when the row shape changes so we migrate or reject old blobs on purpose."

> **Dev:** "Stale bundle open — disk already has a newer schema. Now what?"
> **Domain expert:** "**Outdated client (statistics)** — don’t overwrite their file; ask for a reload. Never fake stats or trash data from the newer tab."

> **Dev:** "How many decimals on the percentage tiles?"
> **Domain expert:** "**Statistics percentage display** — **two** digits after the point."

> **Dev:** "If the player changes how many questions a round has, do old recorded games update?"
> **Domain expert:** "No — **Configured round size** only affects the **next** round. The historical **question count per round** on each **Quiz session record** is frozen."

> **Dev:** "Does wiping statistics reset round length?"
> **Domain expert:** "No — **Statistics reset** clears **Quiz session records** only. **Configured round size** lives in the **Quiz preferences store**."

> **Dev:** "Player changes round length mid-quiz — does the current round jump?"
> **Domain expert:** "No — **Configured round size** applies when the **next** round starts. The round already underway keeps its generated question list."

> **Dev:** "If `localStorage` for preferences is garbage, do we still play?"
> **Domain expert:** "We fall back to the default **Configured round size** (10) and keep going — we don’t version the **Quiz preferences store** like the **Statistics store**."

## Flagged ambiguities

- (none yet)
