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

The CLI installs the package and adds the entry to your global OpenCode config:

```bash
opencode plugin add 'git+https://github.com/yoAlves/evidence-judge.git#v0.1.0'
```

### Unpinned or exact pin

- **Unpinned:** drop `#v0.1.0`. It resolves to the latest commit at install
  time; it does not auto-update afterwards.
- **Exact:** use the full commit SHA from the release notes
  (`#<sha>`). Tags are never moved, and a fix ships as a new tag.

### Local checkout

Clone the repository, run `npm install`, and point `plugins` at the absolute
path of the clone (OpenCode does not expand `~`):

```jsonc
{
  "plugins": ["/path/to/evidence-judge"]
}
```

Config changes reload plugins automatically. Use `/reload` to force a reload;
a service restart with `opencode service restart` is only needed if a cached git
dependency is stale.

## Verify

- Run `/judge <request>` — the command is the primary check.
- If your client exposes manually loaded skills, load `judge` by id; the SKILL.md
  protocol appears. The skill is registered with `autoinvoke: false`, so it may
  not appear in a list of announced skills.
- A clean profile emits no `[evidence-judge]` warnings on the stderr of the
  serving process (`opencode serve` output or the service's stderr).

## Updating

An unpinned install resolves at install time and does not auto-update. For a
git-spec install, the CLI addresses the **exact configured specifier**, not the
bare package name: `opencode plugin list`/`check` may report no package plugins
even while the git-spec plugin is loaded. Copy the specifier from your config,
including any `#ref` — a near-miss is silently ignored (exit 0, no config
change):

```bash
opencode plugin update 'evidence-judge@git+https://github.com/yoAlves/evidence-judge.git#v0.1.0'
```

An unpinned config omits the `#v0.1.0` suffix. Pinned tags and exact SHAs are
static by design, so check the installed revision after an update rather than
expecting it to move. OpenCode also stores the git dependency in a cache
manifest and lockfile (observed in the 0.1.0 installs), so an update can be a
no-op — clear the OpenCode package cache or reinstall if the new revision does
not appear.

To move to a new release, edit the config and reload, or remove and add again
with the exact specifier from your config:

```bash
opencode plugin remove 'evidence-judge@git+https://github.com/yoAlves/evidence-judge.git#v0.1.0'
opencode plugin add 'git+https://github.com/yoAlves/evidence-judge.git#v0.1.1'
```

Tags are never moved; a fix is a new tag.

## Troubleshooting

### Plugin not loading

1. Check the `plugins` entry in your OpenCode config (valid JSON, correct ref).
2. Check the serve startup log for `loading plugin id=...`. `opencode plugin
   list` and `opencode plugin check` may report nothing for git-backed specs.
3. General server errors go to `opencode.log` in OpenCode's data directory;
   `[evidence-judge]` warnings go to the serving process's stderr.
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
