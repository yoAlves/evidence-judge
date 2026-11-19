# evidence-judge 0.1.0 — Git-Spec Release Implementation Plan

> **Status:** Approved 2026-11-19; this supersedes the npm publish runbook.

> **Executed 2026-11-19:** all eight tasks passed. Release commit
> `0336dcd4415a37bc5c7f1cd28e611b70d0727cf4`; annotated tag `v0.1.0` and
> GitHub Release published; `HYGIENE: PASS` before the tag. Git-spec installs by
> full SHA, by tag and via CLI were verified in isolated profiles with no
> `[evidence-judge]` warnings. The checkboxes below are the original plan.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `evidence-judge` 0.1.0 as an OpenCode V2 plugin installed from GitHub via a git-backed package spec, with the `v0.1.0` tag as the release artifact and no npm registry publish.

**Architecture:** No changes to the plugin runtime. The release commit rewrites the public install documentation for the git spec, adds a detailed `.opencode/INSTALL.md`, removes npm-only artifacts (`prepublishOnly` hook and the `releases/` snapshot), and records the final plan. Verification installs the pushed release commit by full SHA in an isolated OpenCode profile; only after that passes is the annotated `v0.1.0` tag created on the same commit and the tag pin re-verified in a fresh profile.

**Tech Stack:** OpenCode V2 plugin API (`@opencode/plugin` 2.x), npm git dependencies, GitHub CLI (`gh`), bash hygiene gate.

**Spec:** the locked decisions from the 2026-11-19 planning session (this
document supersedes the earlier draft).

## Global Constraints

- Distribution is the OpenCode git spec only. No npm registry publish, login, OTP, or npm page. The git tag is the release artifact.
- Package content is EN-US. Conversation is PT-BR.
- `package.json` version must equal the tag without the `v`: `0.1.0` ↔ `v0.1.0`.
- The tag is annotated and never moved. A fix gets a new tag (`v0.1.1`, ...).
- No commit, push, PR, merge, or tag without an explicit execution request. Use branch + PR; never commit directly to `main`.
- The hygiene gate must pass before the tag: `bash scripts/check-hygiene.sh` → `HYGIENE: PASS`.
- The release commit must be verified by full SHA in an isolated profile before the tag is created.
- Do not change `src/index.ts` or `skills/**` unless the end-to-end install proves a packaging failure. Any such change is a new decision, not part of this plan.
- README images stay relative (`docs/images/...`); there is no npm page that would need absolute URLs.
- Windows is declared untested for 0.1.0; the protocol assumes a POSIX shell (`mktemp`).
- No npm name reservation, no CHANGELOG, no version badge, no `docs/images` in the installed package.

## Review Focus

1. **Git install omits `skills/`** — the plugin's `readFile` throws at setup and neither the skill nor the command registers. Check the installed package in the OpenCode cache and the command/skill registration.
2. **TS entry's `import.meta.url` resolves to a compiled/temp path** — `SKILL.md` is not found even though `skills/` shipped. Check the serve stderr and load the skill body.
3. **A foreign `judge` skill/command wins** — the plugin skips registration with a warning. A clean profile must have zero `[evidence-judge]` warnings and the `judge` command present.
4. **Tag points to the wrong commit** — the pinned install does not match the verified SHA. Compare `git rev-parse v0.1.0^{commit}` with the verified release SHA and reinstall from the tag in a fresh profile.
5. **Dead npm instructions survive** — users follow `npm publish`, `prepublishOnly`, or the removed snapshot path. Grep the public docs for the dead commands and paths; expect no hits.
6. **The documented CLI/update commands are wrong** — `opencode plugin add` or `opencode plugin update` fails in practice. Run the exact commands in an isolated config directory before publishing the docs.

## File Structure

- `README.md` — public entry: short install section (pinned git spec, CLI alternative, local checkout), update note, structure/dev sections without npm or snapshot references.
- `.opencode/INSTALL.md` — detailed install/verify/update/troubleshooting guide in the Superpowers style; V2-only; Windows untested.
- `package.json` — `"check": "bash scripts/check-hygiene.sh"`; no `prepublishOnly`.
- `docs/plan/git-spec-release.md` — replace the draft with this approved plan (no open questions).
- `docs/plan/evidence-judge.md` — update the delivered structure (remove `releases/` and `.specs/`, adjust the gate description); keep the distribution note.
- `releases/evidence-judge-0.1.0/` — delete the snapshot (17 files).
- `src/index.ts`, `skills/**`, `LICENSE`, `scripts/check-hygiene.sh` — unchanged.

## Tasks

### Task 1: Rewrite the public install docs

**Files:**
- Modify: `README.md` (Installation, Structure, Development)
- Create: `.opencode/INSTALL.md`

**Interfaces:**
- Produces: the exact install commands and pin policy that Tasks 5–7 verify.

- [ ] **Step 1: Rewrite `README.md` Installation**

Replace the npm/publish wording and the snapshot fallback with:
- Prerequisite: OpenCode V2 (plugin API 2.x; tested on 2.3.0), Git, and network access for the `@opencode/plugin` dependency.
- Primary config:
  ```jsonc
  {
    "plugins": ["evidence-judge@git+https://github.com/yoAlves/evidence-judge.git#v0.1.0"]
  }
  ```
- CLI alternative (global config):
  ```bash
  opencode plugin add 'git+https://github.com/yoAlves/evidence-judge.git#v0.1.0'
  ```
- Unpinned option: drop `#v0.1.0` to install the latest commit at install time.
- Exact pin: use the full commit SHA from the release notes (`#<sha>`); tags are never moved.
- Local checkout for development: clone, `npm install`, then `"plugins": ["/path/to/evidence-judge"]`.
- Save the config; OpenCode reloads plugins. If the command is missing, run `/reload` or `opencode service restart`.
- Link to `.opencode/INSTALL.md` for troubleshooting.

Remove the "Not published yet?" paragraph and the `releases/evidence-judge-0.1.0` paragraph.

- [ ] **Step 2: Create `.opencode/INSTALL.md`**

Use the Superpowers `INSTALL.md` structure, adapted to this plugin:
- **Prerequisites** — OpenCode V2 (2.3.0 tested), Git, network.
- **Installation** — config primary (pinned tag), CLI alternative, local checkout.
- **Verify** — run `/judge <request>`, or load the `judge` skill with the skill tool; a clean profile shows no `[evidence-judge]` warnings.
- **Updating** — unpinned installs resolve at install time and do not auto-update; `opencode plugin update` updates non-exact revisions; exact tags/SHAs are skipped, so edit the config and reload (or remove/add) to move to a new tag; tags are never moved.
- **Troubleshooting** — plugin not loading (check the config, the server log, `/reload`, `opencode service restart`); skill/command missing (foreign `judge` definition wins; remove or rename it); Windows untested (the protocol uses a POSIX shell and `mktemp`).
- **Note** — V2 only; the plugin registers the `judge` skill and `/judge` command, no agent files.

- [ ] **Step 3: Update `README.md` Structure and Development**

- Remove the `releases/<version>/` line from the structure.
- Rename the gate description from "pre-publish" to "release".
- Replace the `npm publish`/`prepublishOnly` paragraph with: run `npm run check` (or `bash scripts/check-hygiene.sh`) before creating a release tag; the gate is a dev tool and is not shipped.

- [ ] **Step 4: Verify no dead npm instructions remain**

Run:
```bash
grep -nE 'prepublishOnly|Not published yet|releases/evidence-judge' README.md .opencode/INSTALL.md
```
Expected: no output. (The phrase "no npm registry publish" is allowed; the dead commands are not.)

- [ ] **Step 5: Commit**

```bash
git add README.md .opencode/INSTALL.md
git commit -m "docs: install via git spec and add OpenCode install guide"
```

### Task 2: Remove npm-only config and snapshot

**Files:**
- Modify: `package.json`
- Delete: `releases/evidence-judge-0.1.0/` (17 files)
- Modify: `docs/plan/evidence-judge.md` (delivered structure)

- [ ] **Step 1: Rename the gate script**

In `package.json`, replace:
```json
"prepublishOnly": "bash scripts/check-hygiene.sh"
```
with:
```json
"check": "bash scripts/check-hygiene.sh"
```

- [ ] **Step 2: Delete the snapshot**

```bash
git rm -r releases/evidence-judge-0.1.0
```
Expected: 17 files deleted; `releases/` disappears if empty.

- [ ] **Step 3: Update the historical plan structure**

In `docs/plan/evidence-judge.md`, remove the `releases/` and `.specs/` lines from the delivered structure (neither is part of the public repo) and change the gate description from "pre-publish" to "release". Keep the distribution note pointing to `docs/plan/git-spec-release.md`.

- [ ] **Step 4: Verify**

```bash
grep -RInE 'prepublishOnly|releases/evidence-judge-0.1.0' --exclude-dir=.git --exclude-dir=node_modules .
```
Expected: no output (the plan draft is replaced in Task 3; if it still mentions these, finish Task 3 before re-running).

- [ ] **Step 5: Commit**

```bash
git add package.json docs/plan/evidence-judge.md
git commit -m "chore: drop npm publish hook and pinned snapshot"
```

### Task 3: Verify the release plan in the repo

**Files:**
- Modify: `docs/plan/git-spec-release.md` (already written during the planning handoff)

- [ ] **Step 1: Confirm the approved plan is in place**

`docs/plan/git-spec-release.md` already contains the approved plan (written during the planning handoff). Confirm it matches the approved content and has the status line "Approved 2026-11-19; this supersedes the npm publish runbook." Do not rewrite it; if it differs, stop and report.

- [ ] **Step 2: Verify the plan is complete**

The file must contain: the install spec (pinned/unpinned/SHA), the update policy, the release sequence (SHA-first), the hygiene gate, the acceptance criteria, and the out-of-scope list. No "draft" or "to refine" language remains.

- [ ] **Step 3: Commit**

```bash
git add docs/plan/git-spec-release.md
git commit -m "docs: finalize git-spec release plan"
```

### Task 4: Pre-tag gate and PR

**Files:** none.

- [ ] **Step 1: Run the gate**

```bash
bash scripts/check-hygiene.sh
```
Expected: `HYGIENE: PASS`.

- [ ] **Step 2: Check the working tree**

```bash
git status --short
```
Expected: only the intended release files; no `.specs`, no `node_modules`, no generated artifacts.

- [ ] **Step 3: Fresh review of the whole change set**

Dispatch `@reviewer` read-only on the full diff (README, `.opencode/INSTALL.md`, `package.json`, the plan updates, the snapshot deletion). Fix `critical`/`important` findings; re-review only the fixes once. Report `suggestion` findings without another fix/review round.

- [ ] **Step 4: Create the branch and PR**

```bash
git switch release/git-spec-0.1.0   # created at setup, before Tasks 1–3
git push -u origin release/git-spec-0.1.0
gh pr create --assignee @me --title "release: 0.1.0 via git spec" --body "Ships the git-spec install docs, removes npm-only artifacts, and records the release plan."
```
Wait for checks in one executor dispatch:
```bash
gh pr checks <PR> --watch --fail-fast --interval 15
```
If the repo has no checks, confirm the PR is mergeable and proceed.

- [ ] **Step 5: Merge and record the release SHA**

Merge per the repo default, then:
```bash
git switch main
git pull
git rev-parse HEAD
```
Expected: the merge commit that contains the release changes. Record it as `<release-sha>`.

- [ ] **Step 6: Re-run the gate on `main`**

```bash
bash scripts/check-hygiene.sh
```
Expected: `HYGIENE: PASS`.

### Task 5: Verify the install by SHA (before the tag)

**Files:** none in the repo; use an isolated profile outside the repo.

- [ ] **Step 1: Create a fresh profile**

Use a temporary directory with fresh `HOME`, `XDG_CONFIG_HOME`, `XDG_DATA_HOME`, `XDG_CACHE_HOME`, and `XDG_STATE_HOME`. Add the plugin to the isolated config:
```jsonc
{
  "plugins": ["evidence-judge@git+https://github.com/yoAlves/evidence-judge.git#<release-sha>"]
}
```

- [ ] **Step 2: Start a dedicated server**

Check the port first (`lsof -i :<port>`), then start `opencode serve --port <port>` with the isolated environment. Capture stderr to a log.

- [ ] **Step 3: Verify registration**

```bash
curl -s http://127.0.0.1:<port>/api/command
```
Expected: `judge` appears with the plugin description. Load the `judge` skill by id and confirm the body matches `skills/judge/SKILL.md` (frontmatter stripped).

- [ ] **Step 4: Verify the installed package**

Inspect the OpenCode cache under the isolated `XDG_CACHE_HOME` (or `~/.cache/opencode/npm/git-evidence-judge-*/<timestamp>/node_modules/evidence-judge/` if `XDG_CACHE_HOME` is unset). Expected:
- `src/index.ts`, `skills/judge/SKILL.md`, the 8 references, `package.json` version `0.1.0`.
- No `.specs`, `docs/plan`, `releases`, or `scripts` directories.

- [ ] **Step 5: Verify the warnings**

Check the serve stderr. Expected: no `[evidence-judge]` warnings.

- [ ] **Step 6: Verify the CLI install command**

In an isolated config directory, run the CLI form of the documented spec with the release SHA substituted for the not-yet-existing tag:
```bash
opencode plugin add 'git+https://github.com/yoAlves/evidence-judge.git#<release-sha>'
```
Confirm which config file received the entry and that the entry loads (server registration as in Steps 3–5). The exact README CLI form with `#v0.1.0` is verified in Task 7, after the tag exists.

- [ ] **Step 7: Verify the unpinned spec and the update command**

Repeat Steps 1–5 in a second fresh profile with the unpinned spec:
```jsonc
{
  "plugins": ["evidence-judge@git+https://github.com/yoAlves/evidence-judge.git"]
}
```
Expected: it resolves to the release commit (or the current `main` HEAD) and registers with no warnings. Then run `opencode plugin check` and `opencode plugin update evidence-judge`; record the exact output, whether the target name resolves, and whether the cache/lockfile pins the revision. If either command fails or is a no-op, keep the remove/add fallback in `.opencode/INSTALL.md` and record the accepted target syntax (`name` vs. spec).

- [ ] **Step 8: Stop if anything fails**

Do not create the tag. Report the failing step and the evidence.

### Task 6: Create the tag and GitHub Release

**Files:** none.

- [ ] **Step 1: Confirm the target**

```bash
git rev-parse HEAD
```
Expected: `<release-sha>`. Confirm `package.json` version is `0.1.0`.

- [ ] **Step 2: Create and push the annotated tag**

```bash
git tag -a v0.1.0 -m "evidence-judge 0.1.0" <release-sha>
git push origin v0.1.0
```

- [ ] **Step 3: Verify the tag**

```bash
git rev-parse v0.1.0^{commit}
git ls-remote --tags origin v0.1.0
```
Expected: the commit equals `<release-sha>`; the remote tag exists.

- [ ] **Step 4: Create the GitHub Release**

```bash
gh release create v0.1.0 --title "v0.1.0" --notes "<short notes>"
```
Notes must include: the install line (`plugins: ["evidence-judge@git+...#v0.1.0"]`), three bullets (judge skill + `/judge` command; isolated critics and binary judge gate; git-spec install), and the full release SHA.

### Task 7: Verify the install by tag (after the release)

**Files:** none.

- [ ] **Step 1: Fresh profile with the tag pin**

Repeat Task 5 Steps 1–5 with:
```jsonc
{
  "plugins": ["evidence-judge@git+https://github.com/yoAlves/evidence-judge.git#v0.1.0"]
}
```

- [ ] **Step 2: Confirm the installed revision**

The cache lockfile or installed package must resolve to the tag SHA. If it does not, do not move the tag; report the mismatch.

- [ ] **Step 3: Verify the CLI form with the tag**

In a separate isolated config directory, run the exact README CLI command:
```bash
opencode plugin add 'git+https://github.com/yoAlves/evidence-judge.git#v0.1.0'
```
Confirm the config entry loads and the installed revision is the tag SHA.

- [ ] **Step 4: Final report**

Report: tag, GitHub Release URL, verified SHA, gate result, and the profiles used.

### Task 8: Final consistency check

**Files:** none.

- [ ] **Step 1: Working tree and log**

```bash
git status --short
git log --oneline -5
```
Expected: clean tree; the release merge and docs commits are visible.

- [ ] **Step 2: Dead-path grep**

```bash
grep -RInE 'prepublishOnly|Not published yet|releases/evidence-judge' --exclude-dir=.git --exclude-dir=node_modules .
```
Expected: no output.

- [ ] **Step 3: Gate**

```bash
bash scripts/check-hygiene.sh
```
Expected: `HYGIENE: PASS`.

- [ ] **Step 4: Docs spot-check**

Confirm the README and `.opencode/INSTALL.md` use the tag pin, the CLI alternative, the update section, the foreign-definition note, and the Windows-untested note.

## Acceptance Criteria

- Fresh `HOME`/XDG profile with the git spec in `plugins`; dedicated `opencode serve` on a free port.
- `judge` appears in `/api/command`; the skill loads with the `SKILL.md` body; no `[evidence-judge]` warnings on the serve stderr.
- Both the unpinned spec and the `#v0.1.0` pin work; the update path is documented.
- The installed package contains `src/index.ts`, `skills/judge/SKILL.md`, and the 8 references; it does not contain `.specs`, `docs/plan`, `releases`, or `scripts`.
- `bash scripts/check-hygiene.sh` → `HYGIENE: PASS` before tagging.
- The annotated tag `v0.1.0` points to the verified release commit; the GitHub Release exists with the install line and the SHA.
- The README and `.opencode/INSTALL.md` contain no dead npm instructions.

## Out of Scope

- npm registry publish (revisit only if discovery or `npx` becomes a real requirement).
- Reserving the npm name `evidence-judge`.
- CI, provenance, trusted publishing, CHANGELOG, version badges.
- The Claude Code adapter.
- Windows support; 0.1.0 declares macOS/Linux tested and Windows untested.
- Changes to `src/index.ts` or `skills/**` unless the E2E install proves a packaging failure.

## Execution Handoff

Recommended: **native** (`superpowers:executing-plans`). The tasks are sequential and share one release commit and one tag; parallel subagents would collide on the same files and the release state. Task 4 includes the fresh `@reviewer` gate before the PR; `verification-before-completion` runs before and after the tag.
