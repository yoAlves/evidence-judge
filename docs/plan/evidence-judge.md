# Plan — evidence-judge (isolated OpenCode plugin)

> **Distribution update (2026-11-19):** npm publish was abandoned in favor of
> an OpenCode git-backed plugin spec. See `docs/plan/git-spec-release.md`.
> The npm-specific parts below remain as historical context only.

## Context and locked decisions

- **Goal:** publish the `judge` approach (research with real sources, isolated critics, judge as a binary gate) to npm as an installable plugin, for others to actually use and to show fluency in agent engineering.
- **Name:** `evidence-judge` (npm + folder). Names checked in the registry: `judge` taken/deprecated; `judge-plugin`, `opencode-judge`, `evidence-judge`, `source-judge` available. `opencode-judge` was avoided because it ties the plugin to the tool (plan to expand to Claude Code later).
- **User command:** `/judge` (short, stable).
- **Architecture:** **thin** plugin — registers a skill + command; **no new agent** (the `AgentEditor` API has no `add`; agents are created via file/config, which would break the "just install" premise). Core = markdown with progressive disclosure (`SKILL.md` + one step reference at a time); adapter = `src/index.ts`.
- **Future expansion:** Claude Code swaps only the adapter; the markdown core is written neutrally ("available shell tool", "subagent").

## Hard constraint (highest priority)

**DO NOT modify anything that exists today.** Specifically:
- Do not edit, move, rename, or delete anything in the author's original project (outside this repository).
- Do not edit the original skill/command sources outside this repository — they served only as **read sources** to copy/adapt.
- All output lives in this repository. Copy, never cut.
- Do not touch the user's `opencode.json`, `agents/**`, `commands/**`, plugins, DB, or sessions.

## Delivered structure

```
evidence-judge/
├── package.json              # name: evidence-judge; exports "."; files ["src","skills","README.md","LICENSE"]
├── src/index.ts              # Plugin.define → ctx.skill.transform + ctx.command.transform
├── skills/judge/
│   ├── SKILL.md              # neutral core + hard rules
│   └── references/           # the 8 step references, loaded on demand
├── scripts/check-hygiene.sh  # release hygiene gate
├── docs/                     # versioned plan + SVG diagrams
├── README.md                 # installation + usage
├── LICENSE
└── .gitignore
```

End-user install: the git spec in `plugins` (see
`docs/plan/git-spec-release.md`). The `/judge` command does `ctx.session.prompt`
instructing to load the `judge` skill — without depending on `@judge`
(documented fragility).

## Hygiene gate (per copied file)

Apply to every file that enters the folder:

1. No `/Users/...`, `~/...`, `/tmp`, `/var/folders`, `${HOME}`.
2. No `@executor` or model/provider names.
3. No author/client-specific dates or phrases.
4. No author-specific simulation IDs or artifacts.
5. Every file reference is **relative to the folder** and the file exists in it.
6. `scratchpad.md`: plain `mktemp -d` (no path literal) and remove the macOS `/var/folders/...` sentence.
7. Mechanical validation at the end: grep the forbidden patterns with `exit 1` if found.

## Tasks

1. Create the folder and directory structure (nothing existing is touched).
2. Copy and generalize `SKILL.md` + 8 references applying the hygiene gate.
3. Write `src/index.ts`, `package.json`, `README.md`, `LICENSE`, `.gitignore`.
4. Run the hygiene gate (grep with `exit 1`) and local validation.
5. **Review via fresh subagent** — see below.

## Final review via subagent (mandatory gate before pushing to git)

Dispatch `@reviewer` with fresh context, **read-only**, after tasks 1–4. Prompt scope:

- **Conformance:** confirm that each decision in this plan was adopted (name, thin plugin skill+command, no agent, neutral core, folder structure).
- **Intangibility:** confirm that **no preexisting file** was changed — compare the original skill/command sources and the author's original project outside this repository against their original state (without modifying anything; read/compare only).
- **Pre-git hygiene:** hunt for absolute paths, `~`, `/tmp`, `/var/folders`, custom agent/model/provider names, dates/clients, and simulation IDs/artifacts in **all** files of the folder.
- **Reference integrity:** every relative repo reference (e.g., `references/validation.md`) points to a file that exists in the folder; runtime scratchpad paths (e.g., `research/retryK.md`) are protocol artifacts, not repo files.
- Report findings by severity (`critical`/`important`/`suggestion`), without fixing. `critical`/`important` findings trigger a fix and a focused re-review, per the repository budget.

Note: this plan now lives at `docs/plan/evidence-judge.md` (versioned in the repo); the "no absolute paths" constraint applies to the **package content**, not to this document.

## Handoff

This plan was written in plan mode; implementation happens in a new build session (`#high`). The build executes directly, without reopening the design or asking for new confirmation.
