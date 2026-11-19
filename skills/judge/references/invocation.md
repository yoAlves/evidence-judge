# Invocation and delivery contract

## Input

- `/judge <request>`: command registered by the plugin; loads the skill by the ID `judge`; requires subagent, shell, and write capability.
- Prose without `/judge`: does not load the skill.
- Without enough question/context: ask a single question and stop.

## Scope

- Fix the question, the sub-questions, the source types, and the initial estimate of N.
- Session context is a valid source; URLs, paths, and attachments are optional.
- Without links: plan the search and reading of sources.
- With links: read those links + search for gaps.
- Final language: the user's.

## Delivery contract (mandatory)

Extract from the request everything that is verifiable: count per domain, total, language, snippet size/format, required fields, and output format. Write it in the `ledger.md` header and in every brief.

Example:

```text
deliver: 8–10 items/domain; EN + snippet ≤12 words; total 56–70; short evidence quote; grouped by domain
```

If the request does not specify, the default contract is: answer each sub-question, cite every claim, no fixed count.

The contract is a gate requirement; the judge cannot approve with an incomplete contract.

## Limits

- The skill does not edit the user's document; it produces `dossier.md`.
- If the user asks for an edit later, it is a separate step, with explicit confirmation and use of `dossier.md`.
