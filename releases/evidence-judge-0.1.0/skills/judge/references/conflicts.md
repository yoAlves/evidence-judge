# Conflicts

The judge emits a `## Conflicts` table in `judge-reports/R.md`; the orchestrator transcribes it verbatim into `conflicts.md`.

| idA | idB | relation | status | reason |
| --- | --- | --- | --- | --- |

- `relation`: `factual_clash` (sources disagree), `scope_clash` (same term in different domains), `duplicate` (same excerpt/term), `dead_reference`.
- `status`: `open`, `resolved_both`, `resolved_one`, `pending`.
- **Dead id** (does not exist in the ledger): the judge removes the conflict row from the report and marks the claim as `pending`; the orchestrator transcribes the removal and the `pending` status verbatim. **Dead URL/source** (id exists): the judge keeps the ids and marks `pending`.
- `open`/`pending`: the rows involved cannot be `included`.
- `resolved_both`: both rows can be included with a "two versions" note and a distinguishing `reason`.
- `resolved_one`: the winner can be included; the loser becomes `excluded` with a reason.
- The judge resolves and records; the orchestrator does not decide.
- Scope clash is not a factual contradiction: it can be `resolved_both` with a `reason` distinguishing the domains.
