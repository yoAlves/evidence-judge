# Ledger

## Header

Question, sub-questions, sources, initial estimate of the panel, final `critics: N` + reason, delivery contract, and `ledger_version: rev=<n> (lines=<m>)`.

Increment `rev` on every **evidence** write: fan-in and retry upsert (`claim`, `type`, `quote`, `source`, `locator`, `provisional_score`, `retry_note`). Do not increment on the verbatim transcription of judge decisions. `lines` is the current line count; together with `rev`, it detects a stale critique that happens to have the same line count.

## Table

| id | domain | claim | type | quote | source | locator | provisional_score | final_score | final_status | reason | retry_note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Values

- `type`: `source`, `synthesis`, or `inference`. Only `source`/`synthesis` can be `included`; `inference` is never included and its `final_status` can only be `pending`.
- `final_status`: `included`, `excluded`, or `pending`; empty until the judge decides.

## Who writes

- **Orchestrator:** `id`, `domain`, `claim`, `type`, `quote`, `source`, `locator`, `provisional_score`, `retry_note`. On retry, it may update `claim`/`type` along with the evidence. It also transcribes judge decisions verbatim, without changing values.
- **Judge:** `final_score`, `final_status`, `reason`. No other role decides these columns.
- The orchestrator **does not** decide or change `final_score`/`final_status`/`reason`; transitions to `pending` are the judge's decision, including on retry exhaustion.

## 0–5 scale

- 5 = verbatim term in a primary source and a re-findable locator.
- 4 = verbatim term, but imprecise snippet/locator.
- 3 = concept evidenced, term paraphrased OR locator not re-findable.
- 2 = lateral support/plausible inference; does not enter as fact.
- 1 = excerpt unrelated to the term.
- 0 = refuted/irrelevant.

## Inclusion

Only `source`/`synthesis` with `final_score ≥3`, a re-findable `locator`, and a met delivery contract can be `included`.

Derived lists (index, generated file, automatic label) **are not primary sources**: max score 2 or `pending` until reindexed **to the original primary source** (original URL/file + line/section). Indexing the derived file itself does not count.

Without a re-findable locator, do not include.

## Judge decisions

`judge-reports/R.md`: `id | final_score | final_status | reason`, `gate: PASS|FAIL`, `contract: <count>`, `critics: N`, `ledger_version`, `## Conflicts`, and the retry list.

Binary gate; there is no "approved with conditions". Condition = `pending` or retry.

In `judge-reports/R.md`, `R` is the gate round: 1 on the initial run, 2 after the 1st evidence retry, 3 after the 2nd. Assembly-only correction does not create a new report.

## Integrity

- Unique ids; no row outside the table; no phantom id.
- Retry performs an **upsert by id**: if the id exists, replace `claim`/`type`/`quote`/`source`/`locator`/`provisional_score` and add `retry_note`; if it is new, add it. Do not decide or change `final_score`/`final_status`/`reason`. Never duplicate.
- Before each gate, validate with `references/validation.md`.
