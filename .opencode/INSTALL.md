# Installing evidence-judge for OpenCode

## Prerequisites

- OpenCode V2 with plugin API 2.x (tested on 2.3.0)
- Git
- Network access at install time (the plugin declares `@opencode/plugin` as a
  dependency)
- A POSIX shell for a judge run (`mktemp`); Windows is untested for 0.1.0

## Installation

### Config (recommended)

Add the pinned git spec to your OpenCode config:

```jsonc
{
  "plugins": ["evidence-judge@git+https://github.com/yoAlves/evidence-judge.git#v0.1.0"]
}
```

### CLI alternative

The CLI writes the global configuration for you:

```bash
opencode plugin add 'git+https://github.com/yoAlves/evidence-judge.git#v0.1.0'
```

### Unpinned or exact pin

- **Unpinned:** drop `#v0.1.0`. It resolves to the latest commit at install
  time; it does not auto-update afterwards.
- **Exact:** use the full commit SHA from the release notes
  (`#<sha>`). Tags are never moved, and a fix ships as a new tag.

### Local checkout

Clone the repository, run `npm install`, and point `plugins` at the clone — a
local path resolves relative to the config file:

```jsonc
{
  "plugins": ["/path/to/evidence-judge"]
}
```

Save the config and OpenCode reloads plugins. If the command does not appear,
run `/reload`, or restart the service with `opencode service restart`.

## Verify

- Run `/judge <request>` — the command should start a judge run.
- Or load the `judge` skill with the skill tool; the SKILL.md protocol appears.
- A clean profile shows no `[evidence-judge]` warnings in the server log.

## Updating

An unpinned install resolves at install time and does not auto-update.

- `opencode plugin update evidence-judge` updates non-exact revisions.
- Exact tags and SHAs are skipped, so moving to a new release means editing the
  config and reloading, or removing and adding the plugin again:

```bash
opencode plugin remove evidence-judge
opencode plugin add 'git+https://github.com/yoAlves/evidence-judge.git#v0.1.1'
```

Tags are never moved; a fix is a new tag.

## Troubleshooting

### Plugin not loading

1. Check that the `plugins` entry is valid JSON in your OpenCode config.
2. Run `opencode plugin list` and look for `evidence-judge`.
3. Check the server log (`opencode.log` in OpenCode's data directory) for
   `[evidence-judge]` lines.
4. Reload with `/reload`, or restart with `opencode service restart`.

### Skill or command missing

If a `judge` skill or command from another source already exists (your own
files or another plugin), the plugin **does not overwrite it**: the existing
definition wins and, in most cases, the whole pair is left out. In a rare race,
the plugin's skill may be registered without the command. Remove or rename the
old definition, then reload.

Definitions owned by the plugin itself are re-registered without warning — the
host may call the plugin setup more than once per load.

### Windows

Windows is untested for 0.1.0. The judge protocol uses a POSIX shell and
`mktemp`, so a run needs a POSIX-compatible environment.

## Note

This guide is for OpenCode V2 only. The plugin registers the `judge` skill and
the `/judge` command; it creates no agent, skill, or command files on disk.
