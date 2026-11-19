# Assembly and delivery

## Contract

Read the delivery contract from the ledger header. It is a `PASS` requirement, not "form".

- **Short** of the contract: retry or `pending`.
- **Over** the contract: the judge marks `excluded` with reason `contract`; it is not a retry.

## Deterministic assembly

1. Validate the ledger with `references/validation.md`.
2. Body: iterate the rows with `final_status=included`, group by `domain` in first-appearance order in the ledger; within the group, preserve ledger order; every sentence with `[id]`; do not create a new claim.
3. Pending items: `final_status=pending` as `id | reason`; do not state them as fact.
4. Conflicts: `resolved_both` → cite both included rows with "two versions"; `resolved_one` → only the winner; `open`/`pending` → pending items.
5. Sources: only rows cited in the ledger.
6. **Never** use index mapping (position in a list, automatic label, generated file) or reorder on your own.

## `dossier.md` structure

Title; delivery contract; answer by domain (first-appearance order); key concepts; conflicts; pending items; sources.

Key concepts: synthesis only of rows with `final_status=included`, with `[id]` per sentence; do not introduce a new claim.

Every sentence in the body (including key concepts) with `[id]`.

## Assembly check (mechanical)

This check **does not approve content**; it only verifies form. The final `PASS` is judge `PASS` + check `PASS`. If the check fails, the orchestrator goes back to the judge/retry; it does not fix content on its own.

- `[id]` present; id exists; `final_status=included`.
- The sentence does not add/remove a qualifier or certainty vs. the `claim`/quote.
- Every sentence in the body has an id.
- Sources only from the ledger.
- Contract: count per domain/total, language, snippet/format.
- Pending items: each entry is a `pending` row, without fact.
- Conflicts: status compatible with `conflicts.md`; valid ids.
- `ledger_version` of current evidence in the header and in the gate critiques.
- Report violations by row/id; fix only what was pointed out.

## Document

The skill does not edit the document. If the user asks after `PASS`, it is a separate step using `dossier.md`, with explicit confirmation.
