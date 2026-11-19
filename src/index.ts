import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { Plugin, Skill } from "@opencode/plugin"

const SKILL_ID = "judge"
const COMMAND_NAME = "judge"

// The metadata also lives in the frontmatter of skills/judge/SKILL.md (read by
// other hosts): keep all three in sync. The exact description comparison (and
// path, when present) is what distinguishes a definition owned by this plugin
// from a definition from another source (user or another plugin).
const SKILL_DESCRIPTION =
  "Use when the user explicitly invokes /judge to research a study question from real sources, with isolated critics and a judge gate."
const COMMAND_DESCRIPTION =
  "Research a topic and build a dossier with isolated critics and a judge"

// SKILL.md ships inside the package; resolving from import.meta.url avoids any
// absolute path and keeps the plugin portable across machines.
const skillPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "skills",
  "judge",
  "SKILL.md",
)

const isOwnSkill = (definition) =>
  !!definition &&
  definition.description === SKILL_DESCRIPTION &&
  (!definition.path || resolve(String(definition.path)) === resolve(skillPath))
const isOwnCommand = (definition) =>
  !!definition && definition.description === COMMAND_DESCRIPTION

export default Plugin.define({
  id: "evidence-judge",
  async setup(ctx) {
    // Skill and command are a pair. Definitions from ANOTHER source win: if
    // either exists in the pre-check, the plugin registers nothing. Definitions
    // owned by THIS plugin are re-registered: re-registering our own definition
    // is idempotent and never touches someone else's. A foreign definition only
    // detectable after the pre-check (list() is lazy) skips the command via
    // skillBlocked and leaves the skill as is — a rare race.
    const [skills, commands] = await Promise.all([ctx.skill.list(), ctx.command.list()])
    const foreign = [
      skills.data.some((skill) => String(skill.id) === SKILL_ID && !isOwnSkill(skill))
        ? "skill"
        : undefined,
      commands.data.some(
        (command) => String(command.name) === COMMAND_NAME && !isOwnCommand(command),
      )
        ? "command"
        : undefined,
    ].filter((item): item is string => item !== undefined)

    if (foreign.length > 0) {
      console.warn(
        `[evidence-judge] existing ${foreign.join(" and ")} (${SKILL_ID}) from another source; keeping existing definitions and skipping registration`,
      )
      return
    }

    const raw = await readFile(skillPath, "utf8")
    // Strip the YAML frontmatter: the metadata is registered explicitly below.
    const content = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")

    // The host (v2.3.0) resolves ctx.*.transform(cb) at scheduling time and
    // runs the callback only AFTER setup() returns. The await below is
    // therefore safe — what stalls loading is awaiting the CALLBACK (wrapping
    // it in a Promise), not the transform. Ordering assumption: callbacks run
    // in scheduling order across different registries — the command callback
    // reads skillBlocked; if the host inverts that order, the command may
    // register without the skill.
    let skillBlocked = false
    await ctx.skill.transform((editor) => {
      // Name/description/autoinvoke also live in the SKILL.md frontmatter,
      // read by other hosts; keep the two in sync.
      const current = editor.get(SKILL_ID)
      if (current && current.description === SKILL_DESCRIPTION && !current.path) {
        // Our own definition always carries a path; absence indicates an
        // unverified host shape — re-register and warn.
        console.warn(
          `[evidence-judge] skill '${SKILL_ID}' description matches but has no path; re-registering own definition`,
        )
      }
      if (current && !isOwnSkill(current)) {
        skillBlocked = true
        console.warn(
          `[evidence-judge] existing foreign skill '${SKILL_ID}'; keeping existing definition and skipping registration of the judge skill and command`,
        )
        return
      }
      editor.add({
        id: Skill.ID.make(SKILL_ID),
        name: Skill.Name.make("Judge"),
        description: SKILL_DESCRIPTION,
        path: Skill.Info.fields.path.make(skillPath),
        content,
        autoinvoke: false,
      })
    })

    // A second list() may materialize file commands the first (lazy) call did
    // not see; we never overwrite whatever appears here. The window between
    // this read and the add remains open (CommandEditor does not expose get())
    // and is documented in the README.
    const currentCommands = await ctx.command.list()
    if (
      currentCommands.data.some(
        (command) => String(command.name) === COMMAND_NAME && !isOwnCommand(command),
      )
    ) {
      console.warn(
        `[evidence-judge] existing foreign command '${COMMAND_NAME}'; keeping existing definition and skipping command registration (judge skill stays registered)`,
      )
      return
    }

    await ctx.command.transform((editor) => {
      // The pair is all-or-nothing: if the skill callback found a definition
      // from another source, the command does not go in. CommandEditor does not
      // expose get(); against a foreign command that appears between the
      // pre-check and this callback, the window documented in the README
      // remains.
      if (skillBlocked) return
      editor.add({
        name: COMMAND_NAME,
        description: COMMAND_DESCRIPTION,
        execute: async ({ sessionID, prompt, delivery }) => {
          await ctx.session.prompt({
            ...prompt,
            sessionID,
            text: `Load the ${SKILL_ID} skill and run the protocol for this request:\n\n${prompt.text}`,
            delivery,
          })
        },
      })
    })
  },
})
