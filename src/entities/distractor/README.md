# Distractor entity

The distractor entity selects three wrong country options for a quiz question.
It makes visually similar flags more likely to appear together while keeping
the result random.

## How selection works

1. Remove the correct country and its forbidden partners from the candidate
   pool.
2. Look up each remaining country's flag similarity to the correct country.
   Missing pairs have a similarity of `0`.
3. Calculate each candidate's weight:

   ```text
   weight = (0.08 + similarity ** 2) * jitter
   ```

   `jitter` is a random value from `0.85` to `1.15`. The base weight keeps
   unrelated countries eligible, while squaring similarity favours close
   matches.

4. Draw three candidates by weighted random sampling without replacement.

`quizService` adds the correct country and shuffles all four answer options.
The similarity data affects only the wrong options, not which countries are
selected as questions.

## Data

- [`model/flag-similarity.data.json`](model/flag-similarity.data.json) contains
  hand-curated `[countryA, countryB, score]` entries. Scores range from `0` to
  `1` and pairs are treated as symmetric.
- [`model/forbidden-pairs.data.json`](model/forbidden-pairs.data.json) contains
  `[countryA, countryB]` pairs that must not be used as distractors for each
  other. Pairs are also treated as symmetric.

Both catalogs use country ISO ids and store each unordered pair once. Update
them manually when adding a confusable or forbidden pair.

## Constraints

- The candidate pool must provide at least three eligible distractors.
  Selection throws otherwise.
- Distractor difficulty is not configurable by the player.
- Regional or game-mode filtering belongs to the caller, which supplies the
  country pool.

See [`CONTEXT.md`](../../../CONTEXT.md) for the domain terminology and entity
relationships.
