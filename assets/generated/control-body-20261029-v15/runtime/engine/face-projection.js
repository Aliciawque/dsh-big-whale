const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Smooth authored contour rows instead of bending each eye with a Gaussian field.
function sample(values, t) {
  const f = clamp(t, 0, 1) * (values.length - 1), i = Math.min(values.length - 2, Math.floor(f)), u = f - i;
  const a = values[Math.max(0, i - 1)], b = values[i], c = values[i + 1], d = values[Math.min(values.length - 1, i + 2)];
  return b + .5 * u * (c - a + u * (2 * a - 5 * b + 4 * c - d + u * (3 * (b - c) + d - a)));
}

/** @param {import('../rig/types').FaceProjection | undefined} config */
export function createFaceProjection(config) {
  if (!config) return null;
  const weights = P => {
    const ax = clamp(P.angleX / 30, -1, 1), ay = clamp(P.angleY / 30, -1, 1);
    const norm = Math.max(1, Math.abs(ax) + Math.abs(ay));
    return { ax, ay, wx: Math.abs(ax) / norm, wy: Math.abs(ay) / norm };
  };
  function project(p, P) {
    const { ax, ay, wx, wy } = weights(P);
    if (!wx && !wy) return p;
    const base = config.front, x = p[0], y = p[1], t = clamp((y - base.top) / (base.bottom - base.top), 0, 1);
    const lo = sample(base.left, t), hi = sample(base.right, t), axis = clamp(sample(base.axis, t), lo + .01, hi - .01);
    const side = x < axis ? 'left' : 'right', edge = side === 'left' ? lo : hi;
    const u = (x - axis) / (edge - axis);
    for (const [pose, w] of [[ax < 0 ? config.left : config.right, wx], [ay < 0 ? config.down : config.up, wy]]) {
      if (!w) continue;
      const targetAxis = sample(pose.axis, t), targetEdge = sample(pose[side], t);
      p[0] += w * (targetAxis + u * (targetEdge - targetAxis) - x);
      const yOffset = pose.top + t * (pose.bottom - pose.top) - (base.top + t * (base.bottom - base.top));
      p[1] += w * (yOffset + pose.featureY * Math.sin(Math.PI * t) * Math.max(0, 1 - u * u));
    }
    return p;
  }
  function eye(p, center, index, P, preserveSize = false) {
    const { ax, ay } = weights(P), c = project([...center], P), dx = p[0] - center[0], dy = p[1] - center[1];
    const far = ax * (index === 0 ? -1 : 1) > 0;
    const baseScale = preserveSize ? 1 : (config.eye.baseScale ?? 1);
    const size = baseScale
      * (1 - Math.abs(ax) * (1 - (far ? config.eye.farScale : config.eye.nearScale)))
      * (1 - Math.abs(ay) * (1 - config.eye.pitchScale));
    const width = far ? config.eye.farWidthScale : config.eye.nearWidthScale;
    const sx = size * (1 - Math.abs(ax) * (1 - (width ?? 1))), sy = size;
    const inset = far ? ax * (config.eye.farInset ?? 0) : 0;
    p[0] = c[0] - inset + dx * sx;
    p[1] = c[1] + dy * sy + dx * ax * (index === 0 ? -1 : 1) * config.eye.shear * baseScale;
    return p;
  }
  function attachment(p, center, depth, P) {
    const c = project([...center], P), dx = p[0] - center[0], dy = p[1] - center[1];
    const yaw = clamp(P.angleX, -30, 30) * Math.PI / 180, pitch = clamp(P.angleY, -30, 30) * Math.PI / 180;
    const relief = Math.max(0, depth - 1) * 10;
    p[0] = c[0] + dx * Math.cos(yaw) + dy * Math.sin(yaw) * .16 + relief * Math.sin(yaw);
    p[1] = c[1] + dy * Math.cos(pitch) - relief * Math.sin(pitch);
    return p;
  }
  return { project, eye, attachment };
}
