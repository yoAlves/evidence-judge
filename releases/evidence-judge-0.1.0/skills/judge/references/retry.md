# Retry and gate

## Types

- **Evidence**: ids with inconclusive evidence, an `open` conflict, or a contract gap.
- **Assembly-check correction**: 1 correction + 1 re-check.

Both consume the global counter; maximum **2**.

## Evidence sequence

1. The judge lists the ids in the `retry list` field of `judge-reports/R.md` and what is missing.
2. A new researcher searches **only those ids**; writes `research/retryK.md`, where K is the retry number (1–2), with literal excerpts + source + locator.
3. **Merge before the critics**: upsert by id. Update `claim`/`type`/`quote`/`source`/`locator`/`provisional_score` and add `retry_note`; do not decide or change `final_score`/`final_status`/`reason`. New id = new row. Never duplicate; everything inside the table.
4. Validate one by one against the `retry list`: each id needs new evidence (quote/locator changed). If unchanged, record `retry_note: failed`; the judge marks `pending`. Do not ask the judge to "re-run" the same row.
5. Increment `ledger_version` (new evidence `rev`).
6. New critics review only the new/updated rows; they declare the current `ledger_version`.
7. A new judge receives ledger + conflicts + **only the new/updated critiques** + `research/retryK.md`; never the previous report or the old critiques.
8. Increment the counter on dispatch.

## Gate and exhaustion

- Binary: `PASS`/`FAIL`. No "approved with conditions".
- `PASS` only with a met delivery contract, resolved/pending conflicts, and a validated ledger.
- `FAIL` lists `pending`/retry; it does not publish.
- Assembly-check failure: consumes 1 retry; 1 correction + 1 re-check; a second failure → `pending`. If the counter is already at 2, do not correct.
- **Exhaustion:** when the counter reaches 2 and the item still lacks sufficient evidence, the judge emits the final `pending` decision; the orchestrator only transcribes. No status is decided by the orchestrator.
- After 2 retries, the item becomes `pending`; never silently deleted.
