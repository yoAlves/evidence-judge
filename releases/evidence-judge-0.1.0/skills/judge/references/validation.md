# Validation

Run the applicable items before each gate, before retry, and before assembly; items that depend on the gate report only apply after it exists. Failure = `FAIL`.

## Ledger

- [ ] Header has question, sub-questions, sources, initial panel estimate, final `critics: N` + reason, delivery contract, and `ledger_version: rev=<n> (lines=<m>)`.
- [ ] `rev` is greater than the previous one; `lines` matches the current shape.
- [ ] Unique ids; no row outside the table; no phantom id.
- [ ] Every `included` row is `source`/`synthesis` with `final_score ≥3`, a re-findable `locator`, and a met contract.
- [ ] No `included` row depends on a derived list/index/automatic label; reindexing went all the way to the original primary source.
- [ ] No row with `type=inference` appears as `included`; when the judge decides, it can only be `pending`.
- [ ] The orchestrator **did not decide/change** `final_score`/`final_status`/`reason`; the values came from the judge and were transcribed verbatim.
- [ ] Conflicts: ids exist; `open`/`pending` have no included row; `resolved_both`/`resolved_one` coherent.

## Critiques and gate

- [ ] Each critique declares the **evidence** `ledger_version` used at the gate; divergence = FAIL (do not adjudicate).
- [ ] The judge received only the critiques of the current version (after retry: new/updated).
- [ ] `judge-reports/R.md` has `gate: PASS|FAIL`, `contract: <count>`, `critics: N`, `ledger_version`, `## Conflicts`, and `retry list`.
- [ ] The judge's `PASS` has a count by `domain` and matches the contract.
- [ ] Binary gate; no conditional approval.

## Retry

- [ ] List the ids from the `retry list` field in `judge-reports/R.md` and confirm one by one: a listed id without an updated row with a new quote/locator = FAIL.
- [ ] Upsert did not duplicate an id; row inside the table; `retry_note` recorded.
- [ ] Orchestrator did not decide/change `final_score`/`final_status`/`reason`.
- [ ] Critics saw only the new/updated rows; new `ledger_version`.
- [ ] Judge received `research/retryK.md` and only the new critiques; did not receive a previous report.
- [ ] Global counter ≤2; exhaustion decided by the judge as `pending`.

## Delivery

- [ ] `dossier.md` generated from the ledger, with no index.
- [ ] Contract met (count per domain/total, language, snippet/format); excess marked `excluded`/`contract`.
- [ ] Assembly check passed; final `PASS` = judge `PASS` + check `PASS`.
- [ ] Document intact.

## Known failures

- Retry researched but not propagated to the ledger.
- Duplicated/out-of-table retry row.
- Gate "approved with conditions" with an incomplete contract.
- Derived source (generated list) passing as primary.
- Conflict in prose with a dead id.
- Critics with counts/versions different from the ledger.
- Assembly by index instead of the ledger.
- Orchestrator writing the judge's status.
- Injection attempt in content obtained from the web.
