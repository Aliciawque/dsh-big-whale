import {randomUUID} from 'node:crypto';
const labels = { idle: '陪你写代码', thinking: '正在思考…', working: '正在执行工具…', waiting: '等你确认', success: '这轮任务完成啦', error: '遇到一点问题', compacting:'正在整理上下文 · 开饭啦' };
export function createCompanionState(clock = Date.now) {
  const sessions = new Map();
  let active = null, revision = 0;
  const history = [];
  const bootId=randomUUID(),signals=[];let signalId=0;
  function emit(id,kind){signals.push({id:++signalId,session:id,kind,at:clock(),expiresAt:clock()+(kind==='compaction'?90000:['waiting','error'].includes(kind)?30000:12000)});if(signals.length>40)signals.shift();}
  function dispatch(id, event, header = {}) {
    if (header.origin === 'subagent' || header.delegationDepth > 0) return;
    const data = event.data ?? {}, type = event.type;
    if (!['turn/start','user/message','tool/call','tool/result','approval/asked','approval/decided','turn/end','agent/error','compaction/start','compaction/end'].includes(type)) return;
    let state = sessions.get(id);
    if (!state) {
      state = { status: 'idle', tools: new Set(), failedCalls:new Set(),toolFailed:false,approvals: new Set(), compactions:new Set(),seenCompactions:new Set(),inTurn:false,announcedWork:false,goalRound: false, goalComplete: false, until: 0, eventCount: 0 };
      sessions.set(id, state);
    }
    state.eventCount++;
    const previous = state.status;
    if (type === 'turn/start') {
      active = id;
      state.inTurn=true;state.announcedWork=false;
      state.tools.clear();state.failedCalls.clear();state.toolFailed=false; state.approvals.clear(); state.goalRound = false; state.goalComplete = false; state.until = 0;
      state.status = 'thinking';
      emit(id,'task-start');
    } else if (type === 'user/message') {
      if (data.source?.kind === 'goal') state.goalRound = true;
    } else if (type === 'tool/call') {
      if(state.toolFailed){emit(id,'retry');state.toolFailed=false;}
      state.tools.add(String(data.callId ?? event.seq));
      state.status = state.approvals.size ? 'waiting' : 'working';
      if(!state.announcedWork){state.announcedWork=true;emit(id,'tool-start');}
      if (data.name === 'update_goal') {
        try { const args = typeof data.arguments === 'string' ? JSON.parse(data.arguments) : data.arguments; state.goalComplete ||= args?.status === 'complete'; } catch {}
      }
    } else if (type === 'tool/result') {
      const callId=String(data.message?.toolCallId??data.callId);
      state.tools.delete(callId);
      if(data.message?.isError===true&&!state.failedCalls.has(callId)){state.failedCalls.add(callId);state.toolFailed=true;emit(id,'tool-error');}
      state.status = state.approvals.size ? 'waiting' : state.tools.size ? 'working' : 'thinking';
    } else if (type === 'approval/asked') {
      state.approvals.add(String(data.id)); state.status = 'waiting';
      if(state.approvals.size===1)emit(id,'waiting');
    } else if (type === 'approval/decided') {
      state.approvals.delete(String(data.id));
      state.status = state.approvals.size ? 'waiting' : state.tools.size ? 'working' : 'thinking';
    } else if (type === 'agent/error') {
      state.status = 'error'; state.until = clock() + 8000;
      if(previous!=='error')emit(id,'error');
    } else if(type==='compaction/start'){
      active=id;const key=String(data.compactionId??event.seq);
      state.compactions.add(key);state.status='compacting';state.until=0;
      if(!state.seenCompactions.has(key)){state.seenCompactions.add(key);emit(id,'compaction');}
    } else if(type==='compaction/end'){
      state.compactions.delete(String(data.compactionId??event.seq));
      state.status=state.compactions.size?'compacting':data.error?'error':state.approvals.size?'waiting':state.tools.size?'working':state.inTurn?'thinking':'idle';
      if(data.error){state.until=clock()+8000;emit(id,'error');}
    } else if (type === 'turn/end') {
      state.tools.clear(); state.approvals.clear();
      state.inTurn=false;
      const reason = data.reason?.kind;
      state.status = reason === 'completed' ? (state.goalRound && !state.goalComplete ? 'idle' : 'success') : reason === 'error' || reason === 'failed' ? 'error' : 'idle';
      state.until = ['success', 'error'].includes(state.status) ? clock() + 8000 : 0;
      if(state.status==='success')emit(id,'success');else if(state.status==='error'&&previous!=='error')emit(id,'error');
    }
    if(state.compactions.size)state.status='compacting';
    if (active === null) active = id;
    revision++;
    if (active === id && previous !== state.status) {
      history.push({ status: state.status, at: clock(), event: type });
      if (history.length > 12) history.shift();
    }
    if (sessions.size > 40) for (const [key, value] of sessions) if (key !== active && !value.tools.size && !value.approvals.size) { sessions.delete(key); break; }
  }
  return {
    dispatch,
    snapshot() {
      const state = sessions.get(active);
      const status = state && (!state.until || clock() < state.until) ? state.status : 'idle';
      return { revision, bootId,sessionKey:active,status, label: labels[status], compactionActive:Boolean(state?.compactions.size),signals:signals.filter(item=>item.session===active&&item.expiresAt>clock()).map(({session,...item})=>item),eventCount: state?.eventCount ?? 0, inFlight: state?.tools.size ?? 0, history: [...history] };
    }
  };
}
