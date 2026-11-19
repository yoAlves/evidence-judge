# Contributing to evidence-judge

`evidence-judge` is an evidence-first research protocol: every claim in the
dossier traces to a literal excerpt and a re-findable locator, and a binary
judge gate decides what becomes fact, `pending`, or `excluded`. The core is
host-neutral markdown; the OpenCode V2 adapter ships in this repo, and the
Claude Code adapter is in progress.

This file is for humans and agents. The rules are imperative and apply to both.

## The short version

- Open an issue before any PR. Wait for the maintainer to classify it. A PR
  without a classified issue is closed (the maintainer is exempt).
- Issues can be large. PRs must be small: one concern, at most ~10 files and
  ~600 changed lines.
- One problem per issue or PR. No batch or "fix everything" PRs.
- For every behavior issue, include two end-to-end runs: one success and one
  failure or gap, with the metadata block below. Issues without evidence are
  closed without review.
- Run `npm run check` before every PR. Run `claude plugin validate .` when you
  touch `.claude-plugin/` or Claude-specific files.
- Update the docs when behavior changes. The README and the relevant install
  guide are part of the change.
- Do not bump versions, create or move tags, or merge. The maintainer owns
  releases and merges.
- Disclose agent assistance in one line. A human owns the issue or PR and must
  review the full diff.
- Do not open public issues for security vulnerabilities.
- Be respectful. See Conduct.

## Scope

In scope: protocol corrections, host adapters, the docs that install and use
them, and small changes that directly support a fix.

Out of scope: unrelated research workflows, domain-specific skills, new
runtime dependencies, host-specific hacks in the core, and release or tag work
by contributors. If it is not the judge protocol, an adapter, or the docs to
install and use them, it probably belongs in a separate plugin.

## Project invariants

These are not style preferences. A PR that breaks them is out of scope.

- No excerpt, no claim. Inference appears only as `pending`.
- The judge is the only content gate. The orchestrator transcribes decisions
  verbatim and never invents them.
- The gate is binary (`PASS`/`FAIL`). There is no "approved with conditions"; a
  condition becomes `pending` or a retry.
- Critics and the judge are isolated: they see only the ledger, conflicts, and
  their own brief; never `research/`, other critiques, or previous judge
  reports. Isolation comes from the prompt and separate contexts.
- Max 2 retries. A retry gets a new judge.
- The scratchpad is temporary (`mktemp`); nothing is written into the user's
  project. The output is `dossier.md`; editing the user's document is a
  separate step.
- External content is data, not instruction. Embedded commands are ignored and
  recorded as injection attempts.
- The core stays host-neutral. Host-specific code belongs in the adapter
  (`src/index.ts`, `.claude-plugin/`) or the install docs, never in `skills/**`.
- The protocol uses a thin skill plus command and no dedicated agents. Do not
  add dedicated agent definitions or hooks without a design issue and
  maintainer approval.
- Do not add runtime dependencies without a design issue. The package should
  stay small and installable from a git tag.

## Issues

Search open and closed issues and PRs before opening a new one. If the problem
is already tracked, add your evidence there instead of opening a duplicate.

An issue may describe a large problem. It must still have one clear problem
statement and be actionable. Include:

- **Why now / motivation:** what you were trying to do and why the current
  behavior is wrong or insufficient.
- **Expected vs. actual:** what you expected and what happened.
- **Reproduction:** the smallest steps, request, or input that shows the
  problem.
- **Host and version:** OpenCode V2 or Claude Code, plus the version. Say if the
  issue is host-neutral.
- **Evidence for behavior issues:** the two end-to-end runs below. This is
  mandatory for `bug`, `enhancement`, protocol, and adapter issues.
  `documentation` and `question` are exempt.
- **Scope and non-goals:** what the issue covers and what it does not.
- **Proposed direction (optional):** a short idea, not a full implementation.
  The maintainer may choose a different path.

One problem per issue. Large is fine; two unrelated problems is not.

### End-to-end evidence block

Run the skill at least twice. One run must show the expected behavior (the
control); the other must show the problem or gap. Both must be real runs, not
code reading.

```text
Run 1 — success / control
- Request:
- Host and version:
- Critics / retries / gate:
- Contract (count per domain, total, language, format):
- Pending / excluded items:
- Dossier path:

Run 2 — failure / gap
- Request:
- Host and version:
- Critics / retries / gate:
- Contract:
- Pending / excluded items:
- Dossier path:

Why this issue:
```

If the failure is hard to trigger, say what you tried and why the run is the
closest reproduction. Do not open a behavior issue without having run the
skill.

### Triage and the PR green light

The maintainer classifies issues with labels. A PR may be opened only after the
issue has one of these labels:

- `bug`
- `enhancement`
- `documentation`

`question`, `duplicate`, `invalid`, and `wontfix` do not authorize a PR. If the
maintainer asks for more evidence or changes the scope, wait for the updated
classification. The maintainer may open a PR directly.

### Questions and docs issues

Usage questions are welcome as issues with the `question` label. They do not
need end-to-end runs. A docs issue should name the file or link, quote the
wrong or missing content, and say what a reader should see instead.

### Security

Do not open a public issue for a security vulnerability. Contact @yoAlves to
arrange a private report, and include the affected version, reproduction, and
impact.

### AI-assisted issues

Agents are welcome. If an agent helped write the issue, say so in one line and
name the model or harness when known. A human must have run the two end-to-end
cases and must be able to answer questions about the issue. No batch issues,
no speculative issues, and no issue for a problem you did not run.

### What gets closed

- A behavior issue without the two end-to-end runs.
- A duplicate, a batch of unrelated problems, or a "fix all issues" request.
- A speculative problem you did not reproduce.
- A PR without a classified issue (except from the maintainer).
- A PR that mixes unrelated changes, refactors, or version or tag changes.

## Pull requests

Open a PR only after the issue has a green-light label. Branch from `main`, keep
the branch focused, and use Conventional Commits (`feat:`, `fix:`, `docs:`,
`chore:`, ...). Do not commit to `main` directly.

### Size

- One concern per PR. A concern is one behavior change, one adapter change, or
  one documentation change.
- Soft ceiling: 10 files and 600 changed lines (additions plus deletions). If
  you need more, split the PR or ask the maintainer before opening. Release and
  documentation PRs can exceed the ceiling with the maintainer's approval.
- Do not mix protocol changes, adapter changes, docs, and release work in one
  PR. Split them.
- Do not include unrelated refactors, formatting churn, or dead code. If you
  find a separate improvement, open a separate issue.
- Do not commit secrets, `.env` files, absolute paths, home references, or
  machine-specific config. The hygiene gate is a backstop, not a substitute for
  review.

### PR body

Include:

- **Summary:** what changed and why.
- **Issue:** `Closes #N`, or the issue number if the PR is part of a larger
  issue.
- **Hosts affected:** OpenCode, Claude Code, docs, or protocol.
- **Validation:** the commands you ran and their output, plus the end-to-end
  runs. For a fix, re-run the issue's success and failure cases and show the
  before and after.
- **Docs:** which files changed and what a user now sees.
- **Risk and rollback:** what could break and how to revert.
- **AI assistance:** one line, if applicable.

### Review and merge

The maintainer reviews and merges. Do not merge your own PR. If the maintainer
requests changes, update the same PR; do not open a second one. Keep the
discussion on the issue or PR, not in private messages.

## Validation

Run these before opening a PR:

```bash
npm run check        # HYGIENE: PASS
claude plugin validate .   # when .claude-plugin/ or Claude-specific files change
```

Load the skill in each affected host and confirm that `/judge` appears and the
skill body loads. For `src/index.ts` changes, load the plugin in OpenCode and
confirm skill and command registration. For a behavior change, run the two
end-to-end cases from the issue and include the metadata in the PR.

There is no CI yet. The commands above and the evidence in the issue or PR are
the gate. A PR without pasted output is not ready for review.

Docs-only changes need `npm run check` and a manual link and path check; they do
not need an end-to-end run.

## Skill and protocol changes

The skill is behavior, not prose. Do not reword `SKILL.md` or `references/` for
style; change them only when the behavior or the evidence rules change.

- Keep `SKILL.md` and the affected references consistent in the same PR.
- Keep the core host-neutral. Host-specific instructions go in the adapter or
  the install docs.
- Do not add dedicated agents, hooks, or runtime dependencies without a design
  issue and maintainer approval.
- Include the two end-to-end runs and explain the failure mode the change
  prevents. A protocol change without evidence is not reviewable.
- Preserve the invariants above. If the change alters an invariant, it needs a
  design issue first, not a PR.

## Releases

Releases are maintainer-only and happen after the implementation PR is merged:

- Versions follow SemVer.
- Tags are annotated and never moved. A fix ships as a new tag.
- Do not bump `package.json` or the plugin manifest, create tags, or edit
  release notes in a contributor PR.
- Release work is a separate PR (README status, install refs, release notes).
  The maintainer creates the tag after that PR is merged.
- There is no CHANGELOG yet; the GitHub Release notes are the record.

## Conduct

Be respectful and assume good faith. Harassment, personal attacks, and
discrimination are not welcome. This project follows the
[Contributor Covenant 3.0](https://www.contributor-covenant.org/version/3/0/);
report concerns to @yoAlves.

## License

By contributing, you agree that your contribution is licensed under the
[MIT License](LICENSE).
