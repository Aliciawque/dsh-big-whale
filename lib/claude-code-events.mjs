// Maps Claude Code hook facts to the session events the companion state machine reads (lib/state.mjs).
// Pure and dependency-free: imported by the Claude Code hooks module and by the Node tests.

/** turn.start of the main loop */
export const turnStarted = () => [{ type: 'turn/start' }];

/** tool.call of the main loop, before the tool runs */
export const toolStarted = (tool, callId) => [{ type: 'tool/call', data: { callId: String(callId ?? ''), name: String(tool ?? '') } }];

/**
 * tool.call of the main loop, after it settled. A refusal (the person said no, a rule or hook denied it)
 * is not a tool failure: only an errored result plays the "little snag" line.
 */
export function toolFinished(callId, result, waitedForApproval = false) {
  const id = String(callId ?? '');
  const events = [];
  if (waitedForApproval) events.push({ type: 'approval/decided', data: { id } });
  events.push({ type: 'tool/result', data: { message: { toolCallId: id, isError: result?.deny === undefined && result?.isError === true } } });
  return events;
}

/** tool.check of the main loop: an ask a person will answer means she waits with you */
export const isPersonAsked = (check, verdict) => Boolean(check?.tool_use_id && check?.approver === 'person' && verdict?.decision === 'ask');
export const approvalAsked = callId => [{ type: 'approval/asked', data: { id: String(callId) } }];

/** session.compact of the main conversation (never a precompute): the rice bowl */
export const isRealCompaction = e => e?.agentId === undefined && e?.trigger !== 'precompute';
export const compactionStarted = id => [{ type: 'compaction/start', data: { compactionId: id } }];
export const compactionFinished = (id, failed = false) => [{ type: 'compaction/end', data: { compactionId: id, ...(failed ? { error: true } : {}) } }];

/** turn.complete of the main loop */
export function turnFinished(reason) {
  const kind = reason === 'answer' ? 'completed' : reason === 'error' ? 'error' : 'interrupted';
  return [{ type: 'turn/end', data: { reason: { kind } } }];
}
