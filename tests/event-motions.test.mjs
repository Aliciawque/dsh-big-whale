import assert from 'node:assert/strict';
import test from 'node:test';
import { createEventMotion } from '../assets/generated/dsh-companion-20261030/event-motions.js';
import * as hooks from '../lib/claude-code-events.mjs';
import { createCompanionState } from '../lib/state.mjs';

test('compaction keeps its pose until completion and the next event replaces it', () => {
  let now = 1000;
  const store = createCompanionState(() => now);
  const motion = createEventMotion();
  const dispatch = events => {
    for (const event of events) store.dispatch('main', event);
    motion.ingest(store.snapshot(), now);
    return motion.sample(now)?.kind;
  };

  assert.equal(dispatch([...hooks.turnStarted(), ...hooks.compactionStarted('compact-1')]), 'compacting');
  now += 3000;
  assert.equal(dispatch([]), 'compacting');
  assert.equal(dispatch([...hooks.compactionFinished('compact-1'), ...hooks.turnFinished('answer')]), 'success');

  now += 100;
  assert.equal(dispatch([...hooks.turnStarted(), ...hooks.turnFinished('error')]), 'error');
  now += 2201;
  assert.equal(dispatch([]), undefined);
  assert.equal(store.snapshot().status, 'error');
});

test('refreshing or reloading a terminal snapshot does not replay an expired pose', () => {
  let now = 1000;
  const store = createCompanionState(() => now);
  for (const event of [...hooks.turnStarted(), ...hooks.turnFinished('answer')]) store.dispatch('main', event);
  const motion = createEventMotion();
  motion.ingest(store.snapshot(), now);
  assert.equal(motion.sample(now)?.kind, 'success');

  now += 2100;
  motion.ingest(store.snapshot(), now);
  assert.equal(motion.sample(now)?.kind, 'success');
  now += 101;
  assert.equal(motion.sample(now), null);

  const reloaded = createEventMotion();
  reloaded.ingest(store.snapshot(), now);
  assert.equal(reloaded.sample(now), null);
});
