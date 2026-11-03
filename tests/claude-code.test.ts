// Claude Code plugin test (run: claude plugin test .). The hooks here stand for the engine: they answer
// the module's $ calls and record what it sends to the companion.
import { expect, test } from 'claude-code/testing'

const TRANSCRIPT = [{ role: 'user' as const, text: 'refactor the parser', toolUses: [] }]
const SUMMARY = [{ role: 'user' as const, text: 'Summary: parser refactor in progress', toolUses: [] }]
const RUNTIME = { pid: 1, origin: 'http://127.0.0.1:4555', token: 't0k', version: 'test', page: 'http://127.0.0.1:4555/page' }

function companion(on: Parameters<Parameters<typeof test>[1]>[1]) {
  const sent: Array<{ type: string; data?: Record<string, unknown> }> = []
  const headers: string[] = []
  on('env.get', () => ({ value: '/home/test' }))
  on('env.set', () => ({ value: {} }))
  on('fs.read', () => ({ value: JSON.stringify(RUNTIME) }))
  on('session.id', () => ({ value: 'session-1' }))
  on('command.register', () => ({ value: { command: 'big-whale' } }))
  on('http.fetch', ($, e) => {
    if (e.url.endsWith('/whale-companion/event')) {
      headers.push(String((e.init?.headers as Record<string, string> | undefined)?.['x-whale-token']))
      const body = JSON.parse(String(e.init?.body))
      sent.push(...body.events)
      return { value: { status: 204, ok: true, headers: {}, text: '' } }
    }
    return { value: { status: 200, ok: true, headers: {}, text: JSON.stringify({ desktop: { available: false, running: false } }) } }
  })
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('clock.every', () => ({ value: {} }))
  on('clock.sleep', async () => { await new Promise(resolve => setTimeout(resolve, 20)); return { value: undefined } })
  return { sent, headers }
}

test('a compaction raises and lowers the rice bowl, and never changes the compaction', async ($, on) => {
  const { sent, headers } = companion(on)
  on('session.compact', () => ({ messages: SUMMARY }))
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })

  const result = await $.session.compact({ trigger: 'manual', instructions: 'keep the plan', messages: TRANSCRIPT })

  expect(result.messages).toEqual(SUMMARY)
  const types = sent.map(event => event.type)
  expect(types).toContain('compaction/start')
  expect(types.indexOf('compaction/start')).toBeLessThan(types.indexOf('compaction/end'))
  expect(headers.every(token => token === 't0k')).toBe(true)
})

test('a tool call is reported before and after it runs, and its result passes through untouched', async ($, on) => {
  const { sent } = companion(on)
  on('tool.call', () => ({ result: { stdout: 'boom' }, isError: true }))
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })

  const result = await $.tool.call({ tool: 'Bash', command: 'false' })

  expect(result.isError).toBe(true)
  const calls = sent.filter(event => event.type.startsWith('tool/'))
  expect(calls.map(event => event.type)).toEqual(['tool/call', 'tool/result'])
  expect((calls[1]?.data?.message as { isError: boolean }).isError).toBe(true)
})

test('a refused tool call is not reported as a failure', async ($, on) => {
  const { sent } = companion(on)
  on('tool.call', () => ({ deny: 'no thanks' }))
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })

  const result = await $.tool.call({ tool: 'Bash', command: 'rm -rf build' })

  expect(result.deny).toBe('no thanks')
  const finished = sent.find(event => event.type === 'tool/result')
  expect((finished?.data?.message as { isError: boolean }).isError).toBe(false)
})

test('with no companion running, tools and compactions still run normally', async ($, on) => {
  on('env.get', () => ({ value: '/home/test' }))
  on('env.set', () => ({ value: {} }))
  on('fs.read', () => { throw new Error('ENOENT') })
  on('session.id', () => ({ value: 'session-2' }))
  on('command.register', () => ({ value: { command: 'big-whale' } }))
  on('process.spawn', async function* () { throw new Error('node: not found') })
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('clock.every', () => ({ value: {} }))
  on('clock.sleep', async () => { await new Promise(resolve => setTimeout(resolve, 20)); return { value: undefined } })
  on('tool.call', () => ({ result: { stdout: 'ok' } }))
  on('session.compact', () => ({ messages: SUMMARY }))
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })

  expect((await $.tool.call({ tool: 'Bash', command: 'ls' })).result).toEqual({ stdout: 'ok' })
  expect((await $.session.compact({ trigger: 'manual', messages: TRANSCRIPT })).messages).toEqual(SUMMARY)
})
