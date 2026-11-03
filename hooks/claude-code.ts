// Big Whale for Claude Code: forwards the main conversation's turns, tool calls, permission asks and
// compactions to the local companion (bin/claude-code-companion.mjs), which drives the same
// expressions, voices and rice pose as the DSH plugin. The companion is shared by every session.
import type { EngineInterface, Register } from 'claude-code'
import {
  approvalAsked, compactionFinished, compactionStarted, isPersonAsked, isRealCompaction,
  toolFinished, toolStarted, turnFinished, turnStarted,
} from '../lib/claude-code-events.mjs'

type $ = EngineInterface
type Runtime = { pid: number; origin: string; token: string; page: string; version: string }
type CompanionEvent = { type: string; data?: Record<string, unknown> }

const KEEPALIVE_MS = 30_000
const POST_WAIT_MS = 400
const START_WAIT_MS = 6_000

// Module state: starts over when the module reloads.
let runtime: Runtime | undefined
let session = ''
let compactions = 0
let starting: Promise<void> | undefined
let lastError = ''
const asked = new Set<string>()

async function runtimeFile($: $): Promise<string> {
  const dsh = (await $.env.get('DSH_HOME'))?.trim()
  // As Node's os.homedir() picks it: USERPROFILE on Windows, HOME elsewhere.
  const home = (await $.env.get('USERPROFILE')) || (await $.env.get('HOME')) || ''
  return `${dsh || `${home}/.dsh`}/plugin-data/big-whale/claude-code.json`
}

async function readRuntime($: $): Promise<Runtime | undefined> {
  try {
    const value = JSON.parse(await $.fs.read(await runtimeFile($)))
    return typeof value?.origin === 'string' && /^http:\/\/127\.0\.0\.1:\d+$/.test(value.origin) && typeof value.token === 'string' ? value : undefined
  } catch { return undefined }
}

async function post($: $, events: CompanionEvent[], target = runtime): Promise<boolean> {
  if (!target) return false
  try {
    const response = await $.http.fetch(`${target.origin}/whale-companion/event`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-whale-token': target.token },
      body: JSON.stringify({ session, events }),
    })
    return response.ok
  } catch { return false }
}

// Resolves after ms, or never when the clock refuses: a bound on a wait, never a reason to stop waiting.
function bound($: $, ms: number): Promise<void> {
  return $.clock.sleep(ms).catch(() => new Promise<void>(() => {}))
}

// Waits a moment for the event to land, never holding the tool or the turn for long.
async function send($: $, events: CompanionEvent[]) {
  if (!runtime) return
  await Promise.race([post($, events), bound($, POST_WAIT_MS)])
}

// Joins a running companion, or starts one that lives as long as this session's module.
async function ensure($: $): Promise<void> {
  if (runtime && await post($, [])) return
  const found = await readRuntime($)
  if (found && await post($, [], found)) { runtime = found; return }
  runtime = undefined
  starting ??= (async () => {
    try {
      const child = $.process.spawn({ argv: ['node', `${$.plugin.root}/bin/claude-code-companion.mjs`] })
      void (async () => {
        try {
          for await (const { text } of child) $.ui.log(text.trim(), { to: 'debug' })
        } catch (error) {
          lastError = 'Node.js 22.17+ is needed on PATH to run Big Whale.'
          $.ui.log(`big-whale: companion did not start: ${String(error)}`, { to: 'debug' })
        }
      })()
      for (let i = 0; i < 20 && !runtime; i++) {
        await $.clock.sleep(250)
        const next = await readRuntime($)
        if (next && await post($, [], next)) runtime = next
      }
    } finally { starting = undefined }
  })()
  await starting
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const started = await next(e)
    session = await $.session.id()
    await $.command.register({ name: 'big-whale', description: 'Show Big Whale, your desktop companion: status and the companion page.' })
    // Awaited (briefly) so the first turn already has a companion to talk to.
    await Promise.race([ensure($).catch(() => {}), bound($, START_WAIT_MS)])
    $.clock.every(KEEPALIVE_MS, () => { void ensure($) })
    return started
  })

  on('command.run', { command: 'big-whale' }, async $ => {
    await ensure($)
    if (!runtime) return { text: `Big Whale is not running. ${lastError || 'Run claude --debug for the companion log.'}` }
    let desktop = ''
    try {
      const { text } = await $.http.fetch(`${runtime.origin}/whale-companion/state`)
      const snapshot = JSON.parse(text)
      desktop = snapshot.desktop?.running ? 'The desktop window is open.' : snapshot.desktop?.available ? 'The desktop window is starting.' : 'Desktop mode is Windows only: open the page below in a browser.'
    } catch {}
    return { text: [`Big Whale ${runtime.version} is with you. ${desktop}`, `Companion page: ${runtime.page}`].join('\n') }
  })

  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) await send($, turnStarted())
    return next(e)
  })

  on('tool.check', async ($, e, next) => {
    const verdict = await next(e)
    if (e.agentId === undefined && isPersonAsked(e, verdict) && e.tool_use_id) {
      asked.add(e.tool_use_id)
      await send($, approvalAsked(e.tool_use_id))
    }
    return verdict
  }).catch(($, e, next) => next(e)) // observe only: a failure here never blocks the call

  on('tool.call', async ($, e, next) => {
    if (e.agentId !== undefined) return next(e)
    const id = e.tool_use_id ?? ''
    await send($, toolStarted(e.tool, id))
    const result = await next(e)
    const waited = asked.delete(id)
    await send($, toolFinished(id, result, waited))
    return result
  }).catch(($, e, next) => next(e)) // observe only: a failure here never blocks the call

  on('session.compact', async ($, e, next) => {
    if (!isRealCompaction(e)) return next(e)
    const id = `${session}:${++compactions}`
    await send($, compactionStarted(id))
    try {
      const result = await next(e)
      await send($, compactionFinished(id))
      return result
    } catch (error) {
      await send($, compactionFinished(id, true))
      throw error
    }
  }).catch(($, e, next) => next(e)) // observe only: a failure here never blocks the call

  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined) await send($, turnFinished(e.reason))
    return next(e)
  })
}
