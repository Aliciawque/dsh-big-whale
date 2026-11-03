import { readFile, realpath, stat } from 'node:fs/promises';
import { timingSafeEqual } from 'node:crypto';
import path from 'node:path';

const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.mavatar':'application/octet-stream', '.wav':'audio/wav', '.mp3':'audio/mpeg', '.ogg':'audio/ogg', '.css':'text/css; charset=utf-8' };
const sameToken = (given, expected) => typeof given === 'string' && given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));

async function readJson(req, limit) {
  let body = '';
  for await (const chunk of req) { body += chunk; if (body.length > limit) throw Error('Request too large'); }
  return JSON.parse(body);
}

// The /whale-companion routes shared by the DSH host and the standalone Claude Code companion.
// `onEvent` and `eventToken` enable POST /whale-companion/event for a local, token-holding client (no browser origin).
export async function createCompanionRoutes({ assetsRoot, getOrigin, state, voices, desktop, version, onEvent, eventToken }) {
  const root = await realpath(assetsRoot);
  return async function handler(req, res) {
    const origin = getOrigin();
    if (req.headers.host !== new URL(origin).host || (req.headers.origin && req.headers.origin !== origin) || req.headers['sec-fetch-site'] === 'cross-site') { res.writeHead(403).end(); return; }
    res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff');
    const pathname = new URL(req.url, origin).pathname;
    if (req.method === 'POST' && pathname === '/whale-companion/event' && onEvent && eventToken) {
      if (req.headers.origin || !sameToken(req.headers['x-whale-token'], eventToken)) { res.writeHead(403).end(); return; }
      try { onEvent(await readJson(req, 16384)); res.writeHead(204).end(); } catch { res.writeHead(400).end(); }
      return;
    }
    if (req.method === 'POST' && /^\/whale-companion\/voice\/(claim|heartbeat|release)$/.test(pathname)) {
      if (req.headers.origin !== origin) { res.writeHead(403).end(); return; }
      try { const request = await readJson(req, 4096); const operation = pathname.split('/').at(-1), result = operation === 'claim' ? voices.claim(request, desktop.snapshot().running) : voices[operation](request); res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(result)); } catch { res.writeHead(400).end(); }
      return;
    }
    if (req.method === 'POST' && pathname === '/whale-companion/desktop/start') {
      if (req.headers.origin !== origin) { res.writeHead(403).end(); return; }
      req.resume(); desktop.start(); res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.writeHead(202).end(JSON.stringify(desktop.snapshot())); return;
    }
    if (req.method !== 'GET') { res.writeHead(405).end(); return; }
    if (pathname === '/whale-companion/state') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify({ ...state.snapshot(), plugin: 'dsh-big-whale', version, desktop: desktop.snapshot(), voice: voices.snapshot(), workspaceReady: false })); return;
    }
    if (!pathname.startsWith('/whale-companion/assets/')) { res.writeHead(404).end(); return; }
    let relative;
    try { relative = decodeURIComponent(pathname.slice('/whale-companion/assets/'.length)); } catch { res.writeHead(400).end(); return; }
    const candidate = path.resolve(root, relative), ext = path.extname(candidate).toLowerCase();
    if (!candidate.startsWith(root + path.sep) || !mime[ext] || relative.split(/[\\/]/).some(part => part.startsWith('.') || ['work', 'review'].includes(part))) { res.writeHead(403).end(); return; }
    try {
      const resolved = await realpath(candidate);
      if (!resolved.startsWith(root + path.sep) || (await stat(resolved)).isDirectory()) { res.writeHead(403).end(); return; }
      res.setHeader('Content-Type', mime[ext]); res.end(await readFile(resolved));
    } catch { res.writeHead(404).end(); }
  };
}
