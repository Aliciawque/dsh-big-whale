#!/usr/bin/env node
// Standalone Big Whale companion for Claude Code. One per machine: Claude Code sessions post their
// events here (POST /whale-companion/event with the token from the runtime file); the companion page
// and the Windows desktop window read /whale-companion/state exactly as they do under DSH.
import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { closeSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCompanionState } from '../lib/state.mjs';
import { createAudioCoordinator } from '../lib/audio-coordinator.mjs';
import { createDesktopController, companionDataPath } from '../lib/desktop.mjs';
import { createCompanionRoutes } from '../lib/routes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const dataPath = companionDataPath(), runtimeFile = path.join(dataPath, 'claude-code.json'), lockFile = path.join(dataPath, 'claude-code.lock');
const IDLE_EXIT_MS = Number(process.env.BIG_WHALE_IDLE_EXIT_MS) || 120000;
const log = message => process.stderr.write(`[big-whale] ${message}\n`);
const alive = pid => { try { process.kill(pid, 0); return true; } catch (error) { return error.code === 'EPERM'; } };

// One companion per machine: a live lock holder wins, a stale lock is taken over.
mkdirSync(dataPath, { recursive: true });
function lock() {
  for (let attempt = 0; attempt < 2; attempt++) {
    try { const fd = openSync(lockFile, 'wx', 0o600); writeFileSync(fd, String(process.pid)); closeSync(fd); return true; }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const holder = Number(readFileSync(lockFile, 'utf8')) || 0;
      if (holder && holder !== process.pid && alive(holder)) return false;
      rmSync(lockFile, { force: true });
    }
  }
  return false;
}
if (!lock()) { log('another companion is already running'); process.exit(3); }

const state = createCompanionState(), voices = createAudioCoordinator(), token = randomBytes(24).toString('hex');
let origin = 'http://127.0.0.1:0', lastClientAt = Date.now();
const desktop = createDesktopController(root, () => origin);

// Events from Claude Code: { session, events: [{ type, data? }] }; an empty list is a keep-alive.
function onEvent(body) {
  if (!body || typeof body.session !== 'string' || !body.session || body.session.length > 200 || !Array.isArray(body.events) || body.events.length > 8) throw Error('Invalid event');
  lastClientAt = Date.now();
  for (const event of body.events) {
    if (!event || typeof event.type !== 'string' || event.type.length > 40 || (event.data !== undefined && (typeof event.data !== 'object' || event.data === null))) throw Error('Invalid event');
    state.dispatch(body.session, { type: event.type, data: event.data ?? {} }, {});
    if (process.env.BIG_WHALE_LOG_EVENTS === '1') log(`event ${event.type} → ${state.snapshot().status}`);
  }
}

const handler = await createCompanionRoutes({ assetsRoot: path.join(root, 'assets'), getOrigin: () => origin, state, voices, desktop, version, onEvent, eventToken: token });
const server = http.createServer((req, res) => handler(req, res).catch(() => { if (!res.headersSent) res.writeHead(500); res.end(); }));
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(Number(process.env.BIG_WHALE_PORT) || 0, '127.0.0.1', resolve); });
origin = `http://127.0.0.1:${server.address().port}`;

const runtime = { pid: process.pid, origin, token, version, page: `${origin}/whale-companion/assets/generated/desktop-companion-20261030/shell.html`, startedAt: new Date().toISOString() };
writeFileSync(runtimeFile + '.tmp', JSON.stringify(runtime, null, 2), { mode: 0o600 }); renameSync(runtimeFile + '.tmp', runtimeFile);
process.stdout.write(JSON.stringify({ ready: true, origin, page: runtime.page, pid: process.pid }) + '\n');
log(`ready on ${origin}`);

const desktopTimer = process.env.BIG_WHALE_NO_DESKTOP === '1' ? null : setTimeout(() => desktop.start(), 750);
// No Claude Code session has spoken for a while (all closed, or the parent died): leave.
const idleTimer = setInterval(() => { if (Date.now() - lastClientAt > IDLE_EXIT_MS) shutdown('idle'); }, Math.min(15000, IDLE_EXIT_MS / 4));

let closing = false;
function shutdown(reason) {
  if (closing) return; closing = true; log(`closing (${reason})`);
  clearTimeout(desktopTimer); clearInterval(idleTimer); desktop.stop(); server.close();
  for (const file of [runtimeFile, lockFile]) {
    try { const text = readFileSync(file, 'utf8'); if (text.includes(String(process.pid))) rmSync(file, { force: true }); } catch {}
  }
  setTimeout(() => process.exit(0), 300).unref();
}
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(signal, () => shutdown(signal));
