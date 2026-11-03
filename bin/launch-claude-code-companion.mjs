#!/usr/bin/env node
// Claude Code owns processes started through its plugin API. Launch a detached
// companion so it can clean up its token file after the Claude session exits.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const companion = fileURLToPath(new URL('./claude-code-companion.mjs', import.meta.url));
const child = spawn(process.execPath, [companion], {
  detached: true,
  stdio: 'ignore',
  windowsHide: true,
});
child.unref();
