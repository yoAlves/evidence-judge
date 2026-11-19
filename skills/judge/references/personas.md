# Critic panel

## Lenses

Always present:

1. **Source auditor** — fidelity/excerpt, verbatim term, locator, contradiction.
2. **Study reader** — coverage, usefulness, and what will not be verifiable later.

Additional, in this order:

3. **Skeptic** — gaps, conflicts, what the material avoids saying.
4. **Didactics reviewer** — prerequisites, clarity, examples, progression.
5. **Synthesis editor** — structure, cohesion, distortion of sources.

## N (2–5)

- Initial estimate at scope time: sub-questions, areas, risk, didactic size.
- Final N **after fan-in**, with actual counts of sources/conflicts.
- Record `critics: N` + reason in the ledger header; the gate report carries `critics: N`.
- 2 = 1 sub-question, ≤3 sources, no conflict; 3 = 2–3 sub-questions, 4–6 sources or 1 conflict; 4 = 4+ sub-questions, 7–9 sources, 2 conflicts, or long material; 5 = 10+ sources, multiple areas, 3+ conflicts, or high risk.
- Explicit user request: respect 2–5.

## Version

Each critic declares `ledger_version: rev=<n> (lines=<m>)` at the top of the critique. Divergence in `rev` or `lines` = gate FAIL; the judge does not adjudicate different versions.

## Critic brief

Question, delivery contract, `ledger_version`, `SCRATCH`, path to `ledger.md` and `conflicts.md`, lens, advisory 0–5 scale, and output path.

Rule: "Read only the ledger, conflicts, and this brief; do not read `research/`, other critics' `critiques/`, or reports."

## Judge brief

Ledger + conflicts + critiques **of the current version** (after retry: only the new/updated ones) + `research/retryK.md` (if any) + delivery contract.

Never the previous judge report or orchestrator commentary.

Output: decision table, `gate: PASS|FAIL`, `contract: <count>`, `critics: N`, `ledger_version`, `## Conflicts`, and retry list.

## Contract at the gate

- **Short** of the contract: retry or `pending`.
- **Over** the contract: the judge marks `excluded` with reason `contract`; it is not a retry.
- The judge counts by `domain` before emitting `PASS`; a `PASS` without a count is invalid.
