const eventKinds = { compacting: 'compaction', success: 'success', error: 'error' };
const terminalDurationMs = 2200;

export function createEventMotion() {
  let active = null;
  return {
    ingest(state, now = Date.now()) {
      const kind = state.compactionActive ? 'compacting' : state.status;
      if (!Object.hasOwn(eventKinds, kind)) {
        active = null;
        return;
      }
      const signal = state.signals?.findLast(item => item.kind === eventKinds[kind]);
      const key = JSON.stringify([state.bootId, state.sessionKey, kind, signal?.id]);
      if (active?.key === key) return;
      const startedAt = Number.isFinite(signal?.at) ? Math.min(now, signal.at) : now;
      active = { key, kind, startedAt };
    },
    sample(now = Date.now()) {
      if (!active) return null;
      const elapsedMs = Math.max(0, now - active.startedAt);
      if (active.kind !== 'compacting' && elapsedMs >= terminalDurationMs) return null;
      return { kind: active.kind, seconds: elapsedMs / 1000 };
    },
  };
}

export function applyEventMotion(pose, motion, blink, autoExpression) {
  if (!motion) return;
  const { kind, seconds } = motion;
  if (kind === 'compacting') {
    const nod = Math.sin(Math.PI * Math.min(1, seconds / 1.15));
    Object.assign(pose, { angleY: -3 - 10 * nod, angleZ: 1, gazeY: .38 });
  } else if (kind === 'success') {
    Object.assign(pose, { angleZ: -5, angleX: 2, bodyAngleZ: -2, gazeY: 0 });
    if (autoExpression) {
      Object.assign(pose, { eyeLOpen: .12 * blink, eyeROpen: .12 * blink, eyeSmile: 1, eyeSmileL: 1 });
    }
  } else {
    const recoil = Math.exp(-seconds * 5);
    Object.assign(pose, {
      angleY: -6 + 3 * recoil,
      angleZ: 5 - 2 * recoil,
      angleX: -7,
      bodyAngleZ: 2 + 1.5 * recoil,
      poseArmL: -6 - 4 * recoil,
      poseArmR: 6 + 4 * recoil,
      poseTail: -2,
      gazeY: .22,
      gazeX: -.24,
    });
    if (autoExpression) {
      Object.assign(pose, { eyeLOpen: .74 * blink, eyeROpen: .74 * blink, browExpression: 2, faceShade: 0 });
    }
  }
}

export function drawFailureSweat(context, frame, focus) {
  if (!frame || !focus) return;
  const { width, height } = context.canvas;
  const size = .64 * Math.max(width * .13, Math.min(width * .27, 128 * frame.width / 1080));
  const x = Math.max(size * .6, Math.min(width - size * .6, frame.x + (focus[0] - 132) * frame.width / 1080));
  const y = Math.max(size * .65, Math.min(height - size * .65, frame.y + (focus[1] - 102) * frame.height / 1920));
  context.save();
  context.translate(x, y);
  context.scale(size / 64, size / 64);
  context.lineCap = 'round';
  const blue = context.createLinearGradient(-18, -30, 20, 30);
  blue.addColorStop(0, '#a7edff');
  blue.addColorStop(.4, '#55b6ed');
  blue.addColorStop(1, '#246596');
  context.beginPath();
  context.moveTo(0, -29);
  context.bezierCurveTo(-6, -12, -25, 4, -14, 21);
  context.bezierCurveTo(-2, 38, 22, 22, 15, 7);
  context.bezierCurveTo(11, -3, 4, -17, 0, -29);
  context.fillStyle = blue;
  context.strokeStyle = '#fff';
  context.lineWidth = 4;
  context.fill();
  context.stroke();
  context.beginPath();
  context.moveTo(-8, 8);
  context.quadraticCurveTo(-11, 16, -5, 20);
  context.strokeStyle = '#edfaff';
  context.lineWidth = 3;
  context.stroke();
  context.restore();
}
