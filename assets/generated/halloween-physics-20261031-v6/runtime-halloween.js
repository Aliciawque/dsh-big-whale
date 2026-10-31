import {reviewLayerVisible} from './review-groups.js';
import {deformHalloween} from './deform.js';
const he = (t, e, n) => {
  (typeof t != "number" || !Number.isFinite(t)) && n.push(`${e}: expected a finite number`);
}, de = (t, e, n) => {
  he(t, e, n), typeof t == "number" && t <= 0 && n.push(`${e}: must be positive`);
}, je = (t, e, n) => {
  de(t, e, n), typeof t == "number" && !Number.isInteger(t) && n.push(`${e}: expected an integer`);
}, rt = (t, e, n) => {
  he(t, e, n), typeof t == "number" && !Number.isInteger(t) && n.push(`${e}: expected an integer`);
}, Le = (t, e, n) => {
  (typeof t != "string" || !t.trim()) && n.push(`${e}: expected a non-empty string`);
}, He = (t, e, n) => {
  typeof t != "boolean" && n.push(`${e}: expected a boolean`);
}, we = (t, e = 0, n = 1 / 0) => (a, o, i) => {
  if (!Array.isArray(a)) {
    i.push(`${o}: expected an array`);
    return;
  }
  (a.length < e || a.length > n) && i.push(`${o}: expected ${e}..${n} items`), a.forEach((l, h) => t(l, `${o}[${h}]`, i));
}, Ee = we(he, 2, 2), Se = (t, e, n) => {
  Ee(t, e, n), Array.isArray(t) && t.length === 2 && t[0] >= t[1] && n.push(`${e}: start must be less than end`);
}, me = (t, e = []) => (n, a, o) => {
  if (!n || typeof n != "object" || Array.isArray(n)) {
    o.push(`${a}: expected an object`);
    return;
  }
  const i = n;
  for (const [l, h] of Object.entries(t))
    i[l] === void 0 && e.includes(l) || h(i[l], `${a}.${l}`, o);
}, pt = { cx: he, cy: he, rx: de, ry: de }, $e = me(pt), xt = we(Ee, 3), bn = we(Ee, 2), _e = (t, e, n) => {
  he(t, e, n), typeof t == "number" && (t < 0 || t > 1) && n.push(`${e}: must be between 0 and 1`);
}, vn = (...t) => (e, n, a) => {
  t.includes(e) || a.push(`${n}: expected one of ${t.join(", ")}`);
}, it = me({ top: he, bottom: he, left: we(he, 33, 33), right: we(he, 33, 33), axis: we(he, 33, 33), featureY: he }), ma = (t) => me({
  version: (e, n, a) => {
    e !== 1 && a.push(`${n}: only version 1 is supported`);
  },
  image: me({ width: je, height: je }),
  head: me({
    ...pt,
    shiftX: he,
    shiftY: he,
    pivotX: he,
    pivotY: he,
    maxRoll: he,
    weightBand: Se,
    turnBand: Se
  }),
  body: me({
    pivotX: he,
    pivotY: he,
    maxRoll: he,
    breathBand: Se,
    rollBand: Se,
    chest: $e,
    shoulders: we($e)
  }),
  face: me({
    nose: $e,
    mouth: $e,
    eyeA: $e,
    eyeB: $e,
    earL: $e,
    earR: $e,
    brow: me({ ...pt, band: Se }),
    jaw: me({ ...pt, band: Se })
  }),
  buns: me({ bunL: $e, bunR: $e }, ["bunL", "bunR"]),
  eyes: we(me({
    opening: xt,
    roi: xt,
    x0: he,
    x1: he,
    top: we(he, 24, 24),
    bot: we(he, 24, 24)
  }, t ? ["x0", "x1", "top", "bot"] : []), 2, 2),
  mouth: me({
    cx: he,
    cy: he,
    angle: he,
    halfLen: de,
    bow: he,
    area: me({ ...pt, angle: he })
  }),
  cheeks: we(Ee, 2, 2),
  strands: we(me({
    name: Le,
    nodes: bn,
    sigma: de,
    k: de,
    max: de,
    anchorPart: Le,
    damping: de,
    inertia: _e
  }, ["anchorPart", "damping", "inertia"])),
  accessories: we(me({
    name: Le,
    pivot: Ee,
    tip: Ee,
    split: _e,
    box: we(rt, 4, 4),
    color: me({ redness: _e, minRed: he })
  })),
  hand: me({
    outline: xt,
    jaw: bn,
    jawRange: Se,
    background: xt,
    elbow: Ee,
    wrist: Ee,
    knuckle: Ee,
    contact: Ee,
    forearmShare: _e,
    armBand: Se,
    wristBand: Se,
    handBand: Se,
    fingerXBand: Se,
    fingerYBand: Se,
    pinBand: Se
  }),
  layered: me({
    center: Ee,
    neckBand: Se,
    parts: we(me({
      name: Le,
      kind: vn("body", "face", "hair", "ear", "decoration"),
      stage: vn("back", "front"),
      depth: he,
      followBand: Se,
      pivot: Ee,
      sway: he,
      meshCell: je,
      strandNames: we(Le, 1),
      bone: Le,
      opacityParameter: Le,
      bodyFollowBand: Se,
      translationAnchor: Ee,
      motionMask: Le,
      faceAttachment: He,
      secondary: me({
        tip: Ee,
        frequency: de,
        damping: de,
        inertia: he,
        tilt: he,
        wind: he,
        angleLimit: de
      })
    }, ["strandNames", "bone", "opacityParameter", "bodyFollowBand", "translationAnchor", "motionMask", "secondary", "faceAttachment"]), 2, 128),
    independentFringe: He,
    bones: we(me({ name: Le, parent: Le, pivot: Ee, parameter: Le, range: Se }, ["parent"]), 1, 128),
    bodyAnchor: Ee,
    bodyFollow: me({ shift: he, lean: he, frequency: de, damping: de, instant: He }, ["instant"]),
    eyeTurn: me({ compression: _e, farCompression: _e, vertical: _e, eyeLayersOnly: He }, ["eyeLayersOnly"]),
    eyeSpring: me({
      frequency: de,
      damping: de,
      inertia: _e,
      blinkKick: he,
      max: de,
      reopenOnly: He,
      blinkSquash: _e,
      components: me({ iris: de, pupil: de, highlight: de, highlight_low: de, lash: _e })
    }, ["reopenOnly", "blinkSquash", "components"]),
    faceTurn: me({ parallax: he, eyePerspective: he, shadow: he, contour: he }, ["contour"]),
    faceShade: me({ band: Se, color: we(_e, 3, 3), strength: _e, skinCutoutLayers: we(Le) }, ["skinCutoutLayers"]),
    faceProjection: me({
      front: it,
      left: it,
      right: it,
      up: it,
      down: it,
      eye: me({
        nearScale: de,
        farScale: de,
        pitchScale: de,
        shear: he,
        irisCover: _e,
        nearWidthScale: de,
        farWidthScale: de,
        farInset: he,
        baseScale: de,
        smileDrop: _e
      }, ["irisCover", "nearWidthScale", "farWidthScale", "farInset", "baseScale", "smileDrop"]),
      browsBehindHair: He
    }, ["browsBehindHair"]),
    cleanEyeTransitions: He,
    stablePhysics: He
  }, ["independentFringe", "bones", "bodyAnchor", "bodyFollow", "faceTurn", "faceShade", "faceProjection", "cleanEyeTransitions", "eyeTurn", "eyeSpring", "stablePhysics"]),
  mesh: me({
    baseCell: je,
    fine: me({
      x0: rt,
      x1: rt,
      y0: rt,
      y1: rt,
      cell: je
    }),
    handCell: je,
    tasselCell: je,
    eyeBallCell: je,
    eyeCell: je,
    spriteCell: je
  }),
  view: me({ padTop: he, padSide: he, gazeCenter: Ee }, ["gazeCenter"])
}, ["buns", "strands", "accessories", "hand", "layered"]);
function Pn(t, e = {}) {
  const n = [];
  if (ma(e.draft ?? !1)(t, "rig", n), n.length) return n;
  const a = t;
  a.eyes.forEach((o, i) => {
    const l = ["x0", "x1", "top", "bot"];
    if (!(e.draft && l.every((h) => o[h] === void 0))) {
      if (l.some((h) => o[h] === void 0)) {
        n.push(`rig.eyes[${i}]: supply all x0/x1/top/bot fields or omit all in a draft`);
        return;
      }
      o.x0 >= o.x1 && n.push(`rig.eyes[${i}].x1: must exceed x0`), o.top.some((h, d) => h > o.bot[d]) && n.push(`rig.eyes[${i}].top: must not exceed bottom curve`);
    }
  }), (a.mesh.fine.x0 >= a.mesh.fine.x1 || a.mesh.fine.y0 >= a.mesh.fine.y1) && n.push("rig.mesh.fine: rectangle must have positive area"), (a.view.padTop <= -1 || a.view.padTop >= 1 || a.view.padSide <= -0.5) && n.push("rig.view: margins must leave a positive viewport");
  for (const [o, i] of (a.strands ?? []).entries())
    i.nodes.some((l, h) => h > 0 && l[0] === i.nodes[h - 1][0] && l[1] === i.nodes[h - 1][1]) && n.push(`rig.strands[${o}].nodes: consecutive nodes must differ`);
  for (const [o, i] of (a.accessories ?? []).entries())
    (i.box[0] < 0 || i.box[1] < 0 || i.box[2] > a.image.width || i.box[3] > a.image.height) && n.push(`rig.accessories[${o}].box: rectangle must stay inside the image`), (i.split <= 0 || i.split >= 1) && n.push(`rig.accessories[${o}].split: must be strictly between 0 and 1`), i.pivot.every((l, h) => l === i.tip[h]) && n.push(`rig.accessories[${o}].tip: must differ from pivot`), (i.box[0] >= i.box[2] || i.box[1] >= i.box[3]) && n.push(`rig.accessories[${o}].box: rectangle must have positive area`);
  if (a.layered) {
    const o = a.layered.faceProjection;
    if (o) {
      for (const f of ["front", "left", "right", "up", "down"]) {
        const w = o[f];
        (w.top >= w.bottom || Math.abs(w.featureY) > 20 || w.left.some((A, u) => A >= w.axis[u] || w.axis[u] >= w.right[u])) && n.push(`rig.layered.faceProjection.${f}: expected ordered contours and an interior axis`);
      }
      const c = o.eye;
      c.baseScale !== void 0 && (c.baseScale < 0.8 || c.baseScale > 1.05) && n.push("rig.layered.faceProjection.eye.baseScale: must be between 0.8 and 1.05"), (c.irisCover ?? 0) > 0.25 && n.push("rig.layered.faceProjection.eye.irisCover: must not exceed 0.25"), ([c.nearWidthScale, c.farWidthScale].some((f) => f !== void 0 && (f < 0.65 || f > 1.05)) || Math.abs(c.farInset ?? 0) > 8) && n.push("rig.layered.faceProjection.eye: exceeds bounded horizontal perspective limits"), ([c.nearScale, c.farScale, c.pitchScale].some((f) => f < 0.65 || f > 1.05) || Math.abs(c.shear) > 0.1) && n.push("rig.layered.faceProjection.eye: exceeds bounded perspective limits");
    }
    const i = a.layered.eyeTurn, l = a.layered.eyeSpring;
    i && (i.compression + i.farCompression > 0.3 || i.vertical > 0.15) && n.push("rig.layered.eyeTurn: compression exceeds subtle projection limits"), l && (l.frequency > 8 || l.damping > 2 || l.max > 5 || l.blinkKick < 0 || l.blinkKick > 2) && n.push("rig.layered.eyeSpring: spring tuning exceeds stable limits"), l?.blinkSquash !== void 0 && l.blinkSquash > 0.15 && n.push("rig.layered.eyeSpring.blinkSquash: must not exceed 0.15"), l?.components && Object.values(l.components).some((c) => c > 1.5) && n.push("rig.layered.eyeSpring.components: gains must not exceed 1.5");
    const h = a.layered.bodyFollow, d = a.layered.faceTurn;
    h && (Math.abs(h.shift) > 10 || Math.abs(h.lean) > 10 || h.frequency > 8 || h.damping > 2) && n.push("rig.layered.bodyFollow: tuning exceeds stable limits"), d && (Math.abs(d.parallax) > 50 || Math.abs(d.eyePerspective) > 0.3 || d.shadow < 0 || d.shadow > 0.25) && n.push("rig.layered.faceTurn: tuning exceeds subtle projection limits"), d?.contour !== void 0 && (d.contour < 0 || d.contour > 8) && n.push("rig.layered.faceTurn.contour: expected a subtle offset between 0 and 8");
    const v = new Map((a.layered.bones ?? []).map((c) => [c.name, c]));
    v.size !== (a.layered.bones ?? []).length && n.push("rig.layered.bones: duplicate bone name");
    for (const c of v.values()) {
      /^[A-Za-z0-9_-]+$/.test(c.name) || n.push("rig.layered.bones: expected a safe bone name"), c.parent && !v.has(c.parent) && n.push(`rig.layered.bones.${c.name}: missing parent`);
      const f = /* @__PURE__ */ new Set();
      let w = c;
      for (; w; ) {
        if (f.has(w.name)) {
          n.push(`rig.layered.bones.${c.name}: cycle`);
          break;
        }
        f.add(w.name), w = v.get(w.parent ?? "");
      }
    }
    const p = /* @__PURE__ */ new Set([
      "base",
      "hairmask",
      "hand",
      ...(a.accessories ?? []).map((c) => c.name),
      ...a.eyes.flatMap((c, f) => ["ball", "low", "crease", "lash"].map((w) => `eye${f}_${w}`))
    ]);
    for (const [c, f] of a.layered.parts.entries()) {
      if (/^[A-Za-z0-9_-]+$/.test(f.name) || n.push(`rig.layered.parts[${c}].name: expected a safe layer name`), p.has(f.name) && n.push(`rig.layered.parts[${c}].name: duplicate or reserved layer name`), p.add(f.name), f.motionMask && !/^[A-Za-z0-9_-]+$/.test(f.motionMask) && n.push(`rig.layered.parts[${c}].motionMask: expected a safe layer name`), f.secondary) {
        const w = f.secondary;
        (w.frequency > 8 || w.damping > 2 || w.inertia < 0 || w.inertia > 2 || w.wind < 0 || w.angleLimit > 0.5) && n.push(`rig.layered.parts[${c}].secondary: spring tuning exceeds stable limits`), w.tip.every((A, u) => A === f.pivot[u]) && n.push(`rig.layered.parts[${c}].secondary.tip: must differ from pivot`);
      }
      f.bone && !v.has(f.bone) && n.push(`rig.layered.parts[${c}].bone: missing bone`), f.strandNames?.some((w) => !(a.strands ?? []).some((A) => A.name === w)) && n.push(`rig.layered.parts[${c}].strandNames: every name must reference an existing strand`);
    }
    a.layered.parts.filter((c) => c.kind === "face" && c.stage === "back").length !== 1 && n.push("rig.layered.parts: expected exactly one back face layer");
    for (const [c, f] of (a.strands ?? []).entries())
      f.anchorPart && !a.layered.parts.some((w) => w.name === f.anchorPart) && n.push(`rig.strands[${c}].anchorPart: missing layered part`), f.damping !== void 0 && f.damping > 2 && n.push(`rig.strands[${c}].damping: exceeds stable limits`);
    a.layered.parts.some((c) => c.kind === "body") || n.push("rig.layered.parts: expected a body layer");
  }
  return n;
}
function cn(t) {
  const e = Pn(t);
  if (e.length) throw new Error(`Invalid rig:
${e.join(`
`)}`);
  return structuredClone(t);
}
const pa = (t, e, n) => Math.max(e, Math.min(n, t)), Bt = (t, e, n) => (n = pa((n - t) / (e - t), 0, 1), n * n * (3 - 2 * n));
function da(t, e) {
  let n = null, a = 0;
  return {
    before(o, i, l, h) {
      const d = h.bodyMotion?.[l.bodySpring];
      if (!d || !h.gain) return;
      let v = 1, p;
      if (l.legSide)
        p = l.legSide === "l" ? [437, 1e3] : [524, 1e3], v = Bt(1050, 1540, i[1]);
      else {
        p = l.bodySpringRoot;
        const y = i[0] - p[0], m = i[1] - p[1], r = l.bodySpringAxis, s = Math.hypot(...r);
        v = Bt(0, 1, (y * r[0] + m * r[1]) / (s * s)), Math.abs(l.bowCut ?? 0) > 1.5 && (v = Bt(428, 462, i[1]));
      }
      const c = d[2] * v, f = Math.cos(c), w = Math.sin(c), A = o[0] - p[0], u = o[1] - p[1];
      o[0] = p[0] + A * f - u * w + d[0] * v, o[1] = p[1] + A * w + u * f + d[1] * v;
    },
    after(o, i, l) {
      if (i.tailSafe) {
        if (n !== l) {
          let h = -1 / 0;
          for (const p of t.layered.tailOutline ?? []) for (const c of p.points) {
            const f = e(c, p, l);
            h = Math.max(h, f[0]);
          }
          const d = h - (t.image.width - 14), v = 4;
          a = d <= -v ? 0 : d >= v ? -d : -((d + v) ** 2) / (4 * v), n = l;
        }
        o[0] += a;
      }
    }
  };
}
const Rt = (t, e, n) => Math.max(e, Math.min(n, t)), xn = (t, e, n) => (n = Rt((n - t) / (e - t), 0, 1), n * n * (3 - 2 * n)), Mn = /* @__PURE__ */ new WeakMap();
function ya(t, e, n, a, o) {
  const i = n.finVolume, l = i.root, h = i.tip, d = h[0] - l[0], v = h[1] - l[1], p = Math.hypot(d, v), c = d / p, f = v / p, w = t[0] - l[0], A = t[1] - l[1], u = (w * c + A * f) / p, y = Rt(u, 0, 1), m = -w * f + A * c, r = o?.finMotion?.[n.secondarySource ?? n.name], s = r?.angles ?? [0, 0, 0];
  let x = Mn.get(i);
  if (!x || x.P !== e || x.motion !== r) {
    const ue = [[0, 0]];
    for (let ae = 0; ae < 3; ae++) ue.push([ue[ae][0] + p / 3 * Math.cos(s[ae]), ue[ae][1] + p / 3 * Math.sin(s[ae])]);
    const te = Rt(e.angleX ?? 0, -30, 30) * Math.PI / 180, ie = Rt(e.angleY ?? 0, -30, 30) * Math.PI / 180 * 0.85;
    x = { P: e, motion: r, knots: ue, sx: Math.sin(te), cx: Math.cos(te), sy: Math.sin(ie), cy: Math.cos(ie), cup: 0.36 + (r?.fold ?? 0) }, Mn.set(i, x);
  }
  const g = x.knots, E = 1 - y;
  let M = 3 * E * E * y * g[1][0] + 3 * E * y * y * g[2][0] + y * y * y * g[3][0], k = 3 * E * E * y * g[1][1] + 3 * E * y * y * g[2][1] + y * y * y * g[3][1];
  const Y = 3 * (E * E * (g[1][0] - g[0][0]) + 2 * E * y * (g[2][0] - g[1][0]) + y * y * (g[3][0] - g[2][0])), X = 3 * (E * E * (g[1][1] - g[0][1]) + 2 * E * y * (g[2][1] - g[1][1]) + y * y * (g[3][1] - g[2][1])), F = 1 / Math.max(0.01, Math.hypot(Y, X)), U = Y * F, B = X * F, Z = xn(0, 0.18, Math.max(0, u)), q = (u - y) * p;
  M += q * U, k += q * B;
  const j = x.cup * Z * Math.sin(Math.PI * y * 0.85), D = m * Math.cos(j);
  M -= D * B, k += D * U;
  let P = i.depth * Math.sin(Math.PI * y) * Math.exp(-0.65 * (m / i.width) ** 2) + m * Math.sin(j);
  const ce = Z * (1 - xn(0.8, 1, y));
  n.finRim && (P -= i.thickness * ce);
  const re = M * c - k * f, I = M * f + k * c, Q = re * x.cx + P * x.sx, H = -re * x.sx + P * x.cx, N = I * x.cy - H * x.sy, $ = I * x.sy + H * x.cy, ne = 1e3 / (1e3 - $);
  return t[0] = a[0] + Q * ne, t[1] = a[1] + N * ne + (n.finRim ? 2.8 * ce : 0), t;
}
const _t = (t, e, n) => Math.max(e, Math.min(n, t)), ga = (t, e, n) => (n = _t((n - t) / (e - t), 0, 1), n * n * (3 - 2 * n)), It = (t, e) => {
  let n = 0;
  for (; n < t.length - 2 && t[n + 1][0] < e; ) n++;
  const a = t[n], o = t[n + 1], i = _t((e - a[0]) / Math.max(0.01, o[0] - a[0]), 0, 1);
  return a[1] + (o[1] - a[1]) * i;
};
function ba(t, e) {
  const n = t.layered?.frontHairVolume;
  if (!n || !e) return null;
  const [a, o] = n.center, [i, l] = n.radii, h = n.depth, d = n.focal ?? 1100, v = (u, y) => h * Math.exp(-0.82 * ((u - a) / i) ** 2 - 0.85 * ((y - o) / l) ** 2), p = v(...n.reference ?? [a, o - 90]);
  let c = null, f = null;
  function w(u, y, m) {
    const r = u[0] - a, s = u[1] - o, x = v(u[0], m?.headbandContact ? It(m.headbandContact, u[0]) : u[1]), g = 1 - x / d, E = r * g, M = s * g, k = x - p, Y = E * y.cx + k * y.sx, X = -E * y.sx + k * y.cx, F = M * y.cy - X * y.sy, U = M * y.sy + X * y.cy + p, B = d / Math.max(d * 0.55, d - U);
    return [a + Y * B + y.dx, o + F * B + y.dy];
  }
  function A(u, y) {
    const m = u[0] - 465, r = u[1] - 205, s = 64 * Math.exp(-0.85 * ((m / 180) ** 2 + 0.28 * (r / 165) ** 2));
    return [465 + m * y.cx + (s - 64) * y.sx + y.dx, 205 + r * y.cy - (s - 64) * y.sy + y.dy];
  }
  return (u, y, m = 1, r = null, s = u, x = null) => {
    if (!m) return u;
    if (r?.headbandFit) {
      const M = r.headbandFit;
      u[1] += It(M.target, s[0]) - It(M.original, s[0]);
    }
    if (r?.name?.startsWith("part_bang_")) {
      const M = ga(175, 240, s[1]);
      u[0] = s[0] + (u[0] - s[0]) * M, u[1] = s[1] + (u[1] - s[1]) * M;
    }
    if (!y.angleX && !y.angleY && !r?.finVolume) return u;
    if (c !== y) {
      const M = _t(y.angleX, -30, 30) * Math.PI / 180, k = _t(y.angleY, -30, 30) * Math.PI / 180, Y = e.project([...n.faceAnchor], y);
      f = { sx: Math.sin(M), cx: Math.cos(M), sy: Math.sin(k), cy: Math.cos(k), dx: Y[0] - n.faceAnchor[0], dy: Y[1] - n.faceAnchor[1] }, c = y;
    }
    const g = f;
    if (r?.finVolume) {
      const M = ya([...u], y, r, w(r.pivot, g), x);
      return u[0] += (M[0] - u[0]) * m, u[1] += (M[1] - u[1]) * m, u;
    }
    if (r && ["part_ahoge", "part_ear_l", "part_ear_r", "part_bow"].includes(r.name)) {
      const M = r.pivot, k = w(M, g), Y = A(M, g), X = A(u, g);
      return u[0] += (X[0] + k[0] - Y[0] - u[0]) * m, u[1] += (X[1] + k[1] - Y[1] - u[1]) * m, u;
    }
    const E = w(u, g, r);
    return u[0] += (E[0] - u[0]) * m, u[1] += (E[1] - u[1]) * m, u;
  };
}
const wn = (t) => t * Math.PI / 180, Wn = (t) => Math.max(0, Math.min(1, t)), yt = (t) => (t = Wn(t), t * t * t * (10 + t * (-15 + 6 * t))), hn = { source: { shoulder: [435, 220], elbow: [489, 705], wrist: [510, 1250] }, target: { wrist: [220, 420] }, native: { shoulder: [350, 424], elbow: [336, 576], wrist: [229, 755] } }, ge = hn.native, st = { wrist: [288, 492], tip: [233, 145] }, Jt = 133, Ke = Math.hypot(ge.elbow[0] - ge.shoulder[0], ge.elbow[1] - ge.shoulder[1]), Mt = Math.hypot(ge.wrist[0] - ge.elbow[0], ge.wrist[1] - ge.elbow[1]), va = Math.atan2(152, -14), Zn = Math.atan2(179, -107), qn = Math.atan2(51, -109), xa = (t, e, n) => t.map((a, o) => a + (e[o] - a) * n), Vn = (t, e, n) => {
  const a = t[0] - e[0], o = t[1] - e[1], i = Math.cos(n), l = Math.sin(n);
  return [e[0] + i * a - l * o, e[1] + l * a + i * o];
}, wt = (ge.elbow[0] - ge.shoulder[0]) / (ge.elbow[1] - ge.shoulder[1]), At = (ge.wrist[0] - ge.elbow[0]) / (ge.wrist[1] - ge.elbow[1]), An = (t, e, n, a, o, i) => {
  const l = o * o, h = l * o;
  return (2 * h - 3 * l + 1) * t + (h - 2 * l + o) * i * n + (-2 * h + 3 * l) * e + (h - l) * i * a;
};
function St(t) {
  const e = ge.elbow, n = 65, a = (wt + At) / 2;
  return t < e[1] - n ? e[0] + (t - e[1]) * wt : t > e[1] + n ? e[0] + (t - e[1]) * At : t < e[1] ? An(e[0] - n * wt, e[0], wt, a, (t - e[1] + n) / n, n) : An(e[0], e[0] + n * At, a, At, (t - e[1]) / n, n);
}
let Sn = null, En = null, Yt = /* @__PURE__ */ new Map();
function Gn(t) {
  const e = Wn(t.authoredWaveProgress ?? 0), n = [...ge.shoulder], a = xa(ge.wrist, hn.target.wrist, e);
  a[0] -= 64 * Math.sin(Math.PI * e);
  const o = a[0] - n[0], i = a[1] - n[1], l = Math.min(Ke + Mt - 1e-3, Math.max(Math.abs(Ke - Mt) + 1e-3, Math.hypot(o, i))), h = (Ke * Ke - Mt * Mt + l * l) / (2 * l), d = Math.sqrt(Math.max(0, Ke * Ke - h * h)), v = Math.atan2(i, o), p = Math.cos(v), c = Math.sin(v), f = [n[0] + p * h + c * d, n[1] + c * h - p * d], w = Math.atan2(a[1] - f[1], a[0] - f[0]), A = w + (qn - Zn) * (1 - yt(e / 0.65)) + wn(4 + (t.authoredWaveWrist ?? 0)) * yt(e / 0.65), u = wn((t.poseArmL ?? 0) * (1 - yt(e / 0.15)));
  for (const y of [f, a]) {
    const m = Vn(y, n, u);
    y[0] = m[0], y[1] = m[1];
  }
  return { shoulder: n, elbow: f, wrist: a, fingers: [a[0] + Math.cos(A + u) * Jt, a[1] + Math.sin(A + u) * Jt], handAngle: A + u };
}
function Ma(t, e, n, a) {
  const o = Gn(a);
  if (n === 2) {
    const v = qn, p = t - ge.wrist[0], c = e - ge.wrist[1], f = p * Math.cos(v) + c * Math.sin(v), w = (-p * Math.sin(v) + c * Math.cos(v)) * (a.restPalmWidth ?? 1), A = Math.cos(o.handAngle), u = Math.sin(o.handAngle);
    return [o.wrist[0] + f * A - w * u, o.wrist[1] + f * u + w * A];
  }
  if (Sn !== a) {
    const v = Math.atan2(o.elbow[1] - o.shoulder[1], o.elbow[0] - o.shoulder[0]) - va;
    let p = Math.atan2(o.wrist[1] - o.elbow[1], o.wrist[0] - o.elbow[0]) - Zn;
    for (; p - v > Math.PI; ) p -= 2 * Math.PI;
    for (; p - v < -Math.PI; ) p += 2 * Math.PI;
    En = { upper: v, fore: p, elbow: o.elbow }, Sn = a, Yt = /* @__PURE__ */ new Map();
  }
  let i = Yt.get(e);
  if (!i) {
    const v = En, p = (m) => {
      const r = v.upper + (v.fore - v.upper) * yt((m - 460) / 260), s = Vn([St(m), m], ge.elbow, r);
      return [s[0] + v.elbow[0] - ge.elbow[0], s[1] + v.elbow[1] - ge.elbow[1]];
    }, c = p(e - 0.25), f = p(e + 0.25), w = f[0] - c[0], A = f[1] - c[1], u = Math.hypot(w, A), y = (St(e + 0.25) - St(e - 0.25)) / 0.5;
    i = { center: p(e), x: St(e), m: y, L: Math.hypot(y, 1), tx: w / u, ty: A / u, gain: 1 + 0.12 * (a.authoredWaveProgress ?? 0) * Math.exp(-(((e - 576) / 64) ** 2)) }, Yt.set(e, i);
  }
  const l = t - i.x, h = l * i.m / i.L, d = l / i.L * i.gain;
  return [i.center[0] + i.tx * h + i.ty * d, i.center[1] + i.ty * h - i.tx * d];
}
function wa(t, e, n, a) {
  const o = Gn(a);
  if (n === 2) {
    const r = st.wrist, s = Math.atan2(st.tip[1] - r[1], st.tip[0] - r[0]), x = Jt / Math.hypot(st.tip[0] - r[0], st.tip[1] - r[1]), g = t - r[0], E = e - r[1], M = (g * Math.cos(s) + E * Math.sin(s)) * x, k = 1 - yt((M + 4) / 34), Y = M < 0 ? M * 2.6 : M, X = (-g * Math.sin(s) + E * Math.cos(s)) * x * (1 + 0.35 * k) * ((a.wavePalmWidth ?? 1) + (1 - (a.wavePalmWidth ?? 1)) * k), F = Math.cos(o.handAngle), U = Math.sin(o.handAngle);
    return [o.wrist[0] + Y * F - X * U, o.wrist[1] + Y * U + X * F];
  }
  const i = hn.source, l = n === 0 ? i.shoulder : i.elbow, h = n === 0 ? i.elbow : i.wrist, d = n === 0 ? o.shoulder : o.elbow, v = n === 0 ? o.elbow : o.wrist, p = h[0] - l[0], c = h[1] - l[1], f = Math.hypot(p, c), w = ((t - l[0]) * p + (e - l[1]) * c) / f, A = (-(t - l[0]) * c + (e - l[1]) * p) / f, u = v[0] - d[0], y = v[1] - d[1], m = Math.hypot(u, y);
  return [d[0] + u * w / f - y / m * A * 0.3, d[1] + y * w / f + u / m * A * 0.3];
}
const Ge = (t, e, n) => Math.max(e, Math.min(n, t));
function lt(t, e) {
  const n = Ge(e, 0, 1) * (t.length - 1), a = Math.min(t.length - 2, Math.floor(n)), o = n - a, i = t[Math.max(0, a - 1)], l = t[a], h = t[a + 1], d = t[Math.min(t.length - 1, a + 2)];
  return l + 0.5 * o * (h - i + o * (2 * i - 5 * l + 4 * h - d + o * (3 * (l - h) + d - i)));
}
function Aa(t) {
  if (!t) return null;
  const e = (i) => {
    const l = Ge(i.angleX / 30, -1, 1), h = Ge(i.angleY / 30, -1, 1), d = Math.max(1, Math.abs(l) + Math.abs(h));
    return { ax: l, ay: h, wx: Math.abs(l) / d, wy: Math.abs(h) / d };
  };
  function n(i, l) {
    const { ax: h, ay: d, wx: v, wy: p } = e(l);
    if (!v && !p) return i;
    const c = t.front, f = i[0], w = i[1], A = Ge((w - c.top) / (c.bottom - c.top), 0, 1), u = lt(c.left, A), y = lt(c.right, A), m = Ge(lt(c.axis, A), u + 0.01, y - 0.01), r = f < m ? "left" : "right", s = r === "left" ? u : y, x = (f - m) / (s - m);
    for (const [g, E] of [[h < 0 ? t.left : t.right, v], [d < 0 ? t.down : t.up, p]]) {
      if (!E) continue;
      const M = lt(g.axis, A), k = lt(g[r], A);
      i[0] += E * (M + x * (k - M) - f);
      const Y = g.top + A * (g.bottom - g.top) - (c.top + A * (c.bottom - c.top));
      i[1] += E * (Y + g.featureY * Math.sin(Math.PI * A) * Math.max(0, 1 - x * x));
    }
    return i;
  }
  function a(i, l, h, d, v = !1) {
    const { ax: p, ay: c } = e(d), f = n([...l], d), w = i[0] - l[0], A = i[1] - l[1], u = p * (h === 0 ? -1 : 1) > 0, y = v ? 1 : t.eye.baseScale ?? 1, m = y * (1 - Math.abs(p) * (1 - (u ? t.eye.farScale : t.eye.nearScale))) * (1 - Math.abs(c) * (1 - t.eye.pitchScale)), r = u ? t.eye.farWidthScale : t.eye.nearWidthScale, s = m * (1 - Math.abs(p) * (1 - (r ?? 1))), x = m, g = u ? p * (t.eye.farInset ?? 0) : 0;
    return i[0] = f[0] - g + w * s, i[1] = f[1] + A * x + w * p * (h === 0 ? -1 : 1) * t.eye.shear * y, i;
  }
  function o(i, l, h, d) {
    const v = n([...l], d), p = i[0] - l[0], c = i[1] - l[1], f = Ge(d.angleX, -30, 30) * Math.PI / 180, w = Ge(d.angleY, -30, 30) * Math.PI / 180, A = Math.max(0, h - 1) * 10;
    return i[0] = v[0] + p * Math.cos(f) + c * Math.sin(f) * 0.16 + A * Math.sin(f), i[1] = v[1] + c * Math.cos(w) - A * Math.sin(w), i;
  }
  return { project: n, eye: a, attachment: o };
}
const Et = [
  { id: "angleX", label: "Face angle X", min: -30, max: 30, def: 0, group: "Head and body" },
  { id: "angleY", label: "Face angle Y", min: -30, max: 30, def: 0, group: "Head and body" },
  { id: "angleZ", label: "Face roll", min: -30, max: 30, def: 0, group: "Head and body" },
  { id: "bodyAngleX", label: "Body angle X", min: -10, max: 10, def: 0, group: "Head and body" },
  { id: "bodyAngleZ", label: "Body roll", min: -10, max: 10, def: 0, group: "Head and body" },
  { id: "breath", label: "Breath", min: 0, max: 1, def: 0, group: "Head and body" },
  { id: "eyeScale", label: "Eye size around center", min: 0.8, max: 1.2, def: 1, group: "Eyes and brows" },
  { id: "eyeSpacing", label: "Symmetric eye spacing", min: 0.8, max: 1.2, def: 1, group: "Eyes and brows" },
  { id: "eyeLOpen", label: "Left eye open", min: 0, max: 1.25, def: 1, group: "Eyes and brows" },
  { id: "eyeROpen", label: "Right eye open", min: 0, max: 1.25, def: 1, group: "Eyes and brows" },
  { id: "eyeSmile", label: "Eye smile", min: 0, max: 1, def: 0, group: "Eyes and brows" },
  { id: "gazeX", label: "Gaze X", min: -1, max: 1, def: 0, group: "Eyes and brows" },
  { id: "gazeY", label: "Gaze Y", min: -1, max: 1, def: 0, group: "Eyes and brows" },
  { id: "browY", label: "Brow Y", min: -1, max: 1, def: 0, group: "Eyes and brows" },
  { id: "browAngle", label: "Brow angle", min: -1, max: 1, def: 0, group: "Eyes and brows" },
  { id: "mouthOpen", label: "Mouth open", min: 0, max: 1, def: 0, group: "Mouth and cheeks" },
  { id: "mouthForm", label: "Mouth form (i to o)", min: -1, max: 1, def: 0, group: "Mouth and cheeks" },
  { id: "blush", label: "Blush", min: 0, max: 1, def: 0, group: "Mouth and cheeks" },
  { id: "faceShade", label: "Upper face shade", min: 0, max: 1, def: 0, group: "Mouth and cheeks" },
  { id: "armAngle", label: "Arm angle", min: -10, max: 10, def: 0, group: "Hand" },
  { id: "handAngle", label: "Wrist angle", min: -10, max: 10, def: 0, group: "Hand" },
  { id: "fingerTap", label: "Finger tap", min: 0, max: 1, def: 0, group: "Hand" }
];
function Sa(t) {
  const e = Aa(t.layered?.faceProjection), n = ba(t, e), a = da(t, (R, O, L) => {
    const b = [...R];
    for (const _ of re.get(O.bone) ?? []) {
      const T = Math.min(_.range[1], Math.max(_.range[0], L[_.parameter] ?? 0));
      F(b, ..._.pivot, T * Math.PI / 180);
    }
    return I(b, R[1], L, i(...R, r.chest), 1 - s(...r.breathBand, R[1]), r.shoulders.reduce((_, T) => _ + i(...R, T), 0)), b;
  }), o = { w: t.image.width, h: t.image.height }, i = (R, O, L) => L ? Math.exp(-(((R - L.cx) / L.rx) ** 2 + ((O - L.cy) / L.ry) ** 2)) : 0, l = 24, h = t.eyes;
  function d(R, O) {
    const L = Math.min(1, Math.max(0, O)) * (l - 1), b = Math.min(Math.floor(L), l - 2), _ = L - b;
    return R[b] + (R[b + 1] - R[b]) * _;
  }
  function v(R, O, L, b) {
    O = Math.min(1, Math.max(0, O));
    const _ = d(R.top, O), T = d(R.bot, O), S = 1 - L, z = 4 * O * (1 - O), C = d(R.bot, 0.5) - d(R.top, 0.5), W = R.top[0] + (R.top[l - 1] - R.top[0]) * O - 0.3 * C * z, K = Math.max(_, T + 1 + (W - T - 1) * b), oe = t.layered?.normalClosedEyes ? (1 - s(0.05, 0.36, L)) * (1 - b) : 0, V = d(R.top, 0.5) + C * 0.78 + C * 0.06 * (2 * O - 1) ** 2, ee = K + (V - K) * oe;
    return [(ee - _) * Math.max(S, -0.07), S > 0 ? (ee - T) * S * (b + (1 - b) * oe) : 0];
  }
  const p = [[-2, 1], [-1, 2], [0, 3], [1, 2], [2, 1]], c = 5;
  function f(R, O, L, b) {
    let _ = 0, T = 0;
    for (const [W, K] of p) {
      const [oe, V] = v(R, (O + W * c - R.x0) / (R.x1 - R.x0), L, b);
      _ += oe * K / 9, T += V * K / 9;
    }
    const S = Math.min(1, Math.max(0, (O - R.x0) / (R.x1 - R.x0))), z = d(R.top, S), C = d(R.bot, S);
    return { top: z, bot: C, b: 1 - L, lid: z + _, bc: C + T };
  }
  function w(R, O, L, b, _, T) {
    const S = f(R, L, _, T);
    if (O === "closed_normal") {
      if (_ <= 1e-5) return b;
      const z = f(R, (R.x0 + R.x1) * 0.5, _, T), C = d(R.bot, 0.5) - d(R.top, 0.5);
      return b + z.lid - (d(R.top, 0.5) + C * 0.78);
    }
    if (O === "lash" && t.layered?.continuousBlink) {
      const z = Math.max(0.01, S.bot - S.top), C = Math.min(S.lid - S.top, Math.max(0, z - 0.35));
      return b <= S.top ? b + C : b >= S.bot ? b + (S.bc - S.bot) : S.top + C + (b - S.top) * (S.bc - S.top - C) / z;
    }
    return O === "lash" ? S.lid - (S.top - b) * (t.layered?.continuousBlink ? 1 : 1 - 0.3 * Math.min(1, Math.max(0, S.b))) : O === "low" ? b + (S.bc - S.bot) : O === "crease" ? b + (S.lid - S.top) * 0.22 : b;
  }
  function A(R, O, L) {
    const b = Math.min(1, Math.max(0, 1 - O));
    return R === "low" ? 1 - Math.min(1, b * L * 1.2) : R === "crease" ? 1 - 0.45 * b : 1;
  }
  const u = t.mouth, y = t.cheeks, m = t.head, r = t.body, s = (R, O, L) => {
    const b = Math.min(1, Math.max(0, (L - R) / (O - R)));
    return b * b * (3 - 2 * b);
  };
  function x(R, O) {
    return 1 - s(...m.weightBand, O);
  }
  function g(R, O) {
    return 1 - s(...m.turnBand, O);
  }
  const E = t.strands ?? [];
  function M(R, O, L) {
    let b = 1 / 0, _ = 0;
    const T = L.length - 1;
    for (let S = 0; S < T; S++) {
      const [z, C] = L[S], [W, K] = L[S + 1], oe = W - z, V = K - C, ee = Math.min(1, Math.max(0, ((R - z) * oe + (O - C) * V) / (oe * oe + V * V))), fe = Math.hypot(R - z - oe * ee, O - C - V * ee);
      fe < b && (b = fe, _ = (S + ee) / T);
    }
    return [b, _];
  }
  function k(R, O, L) {
    if (L < 0.02) return [];
    const b = [];
    let _ = 0;
    E.forEach((S, z) => {
      const [C, W] = M(R, O, S.nodes), K = Math.exp(-((C / S.sigma) ** 2));
      K < 0.02 || (b.push([z, K, W]), _ += K);
    });
    const T = Math.max(1, _);
    return b.map(([S, z, C]) => [S, L * z / T * s(0.04, 0.55, C), C]);
  }
  function Y(R, O, L = 1) {
    return {
      head: x(R, O),
      turn: g(R, O),
      strands: k(R, O, L),
      bunL: i(R, O, t.buns?.bunL),
      bunR: i(R, O, t.buns?.bunR),
      brow: i(R, O, t.face.brow) * (1 - s(...t.face.brow.band, O)),
      // chin below the mouth line drops a little when the mouth opens
      jaw: i(R, O, t.face.jaw) * s(...t.face.jaw.band, O),
      // per-feature depth for head turns (nose sticks out most, ears sit at the back)
      nose: i(R, O, t.face.nose),
      mouth: i(R, O, t.face.mouth),
      eyeA: i(R, O, t.face.eyeA),
      eyeB: i(R, O, t.face.eyeB),
      earR: i(R, O, t.face.earR),
      earL: i(R, O, t.face.earL),
      chest: i(R, O, r.chest),
      breath: 1 - s(...r.breathBand, O),
      shoulder: r.shoulders.reduce((b, _) => b + i(R, O, _), 0)
    };
  }
  function X(R, O, L, b) {
    const _ = (R - m.cx) / m.rx, T = (O - m.cy) / m.ry, S = 1 - _ * _ - T * T;
    if (S <= 0) return [0, 0];
    const z = s(0, 0.84, S);
    return [L * m.shiftX * z, -b * m.shiftY * z];
  }
  function F(R, O, L, b) {
    const _ = Math.cos(b), T = Math.sin(b), S = R[0] - O, z = R[1] - L;
    R[0] = O + S * _ - z * T, R[1] = L + S * T + z * _;
  }
  function U(R, O, L, b = O) {
    if (t.layered) {
      B(R, O, L);
      return;
    }
    const _ = X(R[0], R[1], L.angleX / 30, L.angleY / 30);
    R[0] += _[0] * b, R[1] += _[1] * b, !(O <= 0) && F(R, m.pivotX, m.pivotY, -L.angleZ / 30 * m.maxRoll * O);
  }
  function B(R, O, L, b = 1, _ = !1) {
    if (O <= 0) return;
    const [T, S] = t.layered.center, z = L.angleX / 30, C = L.angleY / 30, W = [
      T + (R[0] - T) * (_ ? 1 : 1 - 0.055 * Math.abs(z)) + z * m.shiftX * b,
      S + (R[1] - S) * (_ ? 1 : 1 - 0.025 * Math.abs(C)) - C * m.shiftY * b
    ];
    F(W, m.pivotX, m.pivotY, -L.angleZ / 30 * m.maxRoll), R[0] += (W[0] - R[0]) * O, R[1] += (W[1] - R[1]) * O;
  }
  const Z = t.layered?.bodyAnchor ? Y(...t.layered.bodyAnchor, 0) : null;
  function q(R, O, L = !0) {
    if (e) {
      e.project(R, O);
      return;
    }
    const b = t.layered?.eyeTurn;
    if (b && L) {
      const V = R[0], ee = R[1], fe = Math.min(1, Math.max(-1, O.angleX / 30));
      for (const [pe, Re] of [[t.face.eyeA, 1], [t.face.eyeB, -1]]) {
        const J = Math.exp(-(((V - pe.cx) / (pe.rx * 1.15)) ** 4 + ((ee - pe.cy) / (pe.ry * 1.2)) ** 4)), Me = Math.abs(fe) * b.compression + Math.max(0, fe * Re) * b.farCompression;
        R[0] -= (V - pe.cx) * Me * J, R[1] -= (ee - pe.cy) * Math.abs(fe) * b.vertical * J;
      }
    }
    const _ = t.layered?.faceTurn;
    if (!_) return;
    const T = R[0], S = R[1], z = Math.min(1, Math.max(-1, O.angleX / 30)), [C] = t.layered.center, W = Math.abs(t.face.eyeB.cx - t.face.eyeA.cx) * 1.2, K = (T - C) / W, oe = s(t.face.brow.cy - 35, t.face.brow.cy, S) * (1 - s(t.face.jaw.cy - 15, t.layered.neckBand[0], S));
    if (R[0] += z * _.parallax * Math.max(0, 1 - K * K) ** 2 * oe, _.contour) {
      const V = t.face.jaw, ee = Math.min(1, Math.abs((T - V.cx) / (V.rx * 1.6))), fe = s(V.cy - 27, V.cy + 8, S) * (1 - s(t.layered.neckBand[0], t.layered.neckBand[1], S)), pe = Math.exp(-(((T - V.cx) / (V.rx * 0.7)) ** 4)) * s(t.face.nose.cy - 35, t.face.nose.cy - 10, S) * (1 - s(V.cy - 15, V.cy + 10, S));
      R[0] += z * _.contour * ((1 - ee ** 4) * fe + pe * 0.45);
    }
    for (const [V, ee] of L ? [[t.face.eyeA, 1], [t.face.eyeB, -1]] : []) {
      const fe = Math.exp(-(((T - V.cx) / (V.rx * 1.2)) ** 4 + ((S - V.cy) / (V.ry * 1.4)) ** 4));
      R[0] += (T - V.cx) * z * ee * _.eyePerspective * fe, R[1] += (S - V.cy) * z * ee * _.eyePerspective * 0.3 * fe;
    }
  }
  function j(R, O, L, b, _, T, S) {
    if (S[0] = R, S[1] = O, T.authoredWaveSegment !== void 0 || T.nativeWaveSegment !== void 0 && (b.authoredWaveProgress ?? 0) > 0) {
      const C = T.authoredWaveSegment !== void 0 ? wa(R, O, T.authoredWaveSegment, b) : Ma(R, O, T.nativeWaveSegment, b), W = Y(C[0], C[1], 0);
      return S[0] = C[0], S[1] = C[1], I(S, C[1], b, W.chest, W.breath, W.shoulder), S;
    }
    if (T.translationAnchor) {
      const C = T.translationAnchor, W = [...C], K = Y(...C, 0);
      return I(W, C[1], b, K.chest, K.breath, K.shoulder), S[0] += W[0] - C[0], S[1] += W[1] - C[1], S;
    }
    if (T.kind === "face" || T.faceAttachment)
      return e && T.faceAttachment ? e.attachment(S, T.pivot, T.depth ?? 1, b) : T.name && t.layered?.eyeTurn?.eyeLayersOnly ? t.layered?.faceTurn?.contour !== void 0 && q(S, b, !1) : q(S, b), B(S, 1 - s(...t.layered.neckBand, O), b, 1, !!e), t.layered.bodyAnchor ? P(S, b) : I(S, O, b, 0, 1, 0), S;
    T.bodySpring && a.before(S, [R, O], T, _);
    const z = T.name === "part_rear_head" && t.layered.rearHairVolume;
    if (z) {
      const [C, W] = z.center, [K, oe] = z.radii, V = S[0] - C, ee = S[1] - W, fe = Math.max(-1, Math.min(1, V / K)), pe = Math.max(-1, Math.min(1, ee / oe)), Re = z.depth * (1 - fe * fe) * (1 - 0.45 * pe * pe), J = b.angleX / 30 * Math.PI / 6, Me = b.angleY / 30 * Math.PI / 7;
      S[0] = C + V * Math.cos(J) - Re * Math.sin(J), S[1] = W + ee * Math.cos(Me) + Re * Math.sin(Me);
    }
    if (T.secondary && F(S, ...T.pivot, (_.secondary?.[T.secondarySource ?? T.name] ?? 0) * _.gain * (L.motion ?? 1)), T.kind !== "body") {
      if (T.kind === "hair")
        if (T.rearClump || T.hangingLock) {
          const W = E.findIndex((oe) => oe.name === T.strandNames[0]), K = _.strands?.[W];
          if (K) {
            const oe = Math.max(0, Math.min(1, (O - T.pivot[1]) / ((T.rearClump?.bottom ?? T.hangingLock.bottom) - T.pivot[1]))), V = oe * 3, ee = Math.min(2, Math.floor(V)), fe = V - ee;
            S[0] += (K[ee][0] + (K[ee + 1][0] - K[ee][0]) * fe) * _.gain * T.sway, S[1] += (K[ee][1] + (K[ee + 1][1] - K[ee][1]) * fe) * _.gain * T.sway;
          }
        } else for (const [W, K, oe] of L.strands) {
          if (T.strandNames && !T.strandNames.includes(E[W].name)) continue;
          const V = _.strands?.[W];
          if (!V) continue;
          const ee = oe * 3, fe = Math.min(2, Math.floor(ee)), pe = ee - fe;
          S[0] += (V[fe][0] + (V[fe + 1][0] - V[fe][0]) * pe) * K * _.gain * T.sway * (L.motion ?? 1), S[1] += (V[fe][1] + (V[fe + 1][1] - V[fe][1]) * pe) * K * _.gain * T.sway * (L.motion ?? 1);
        }
      else T.kind === "ear" && !T.finVolume && F(S, ...T.pivot, b.angleX / 30 * 0.035 * T.sway);
      const C = 1 - s(...T.followBand, O);
      T.frontHairHull && n && n(S, b, C, T, [R, O], _), B(S, C, b, T.depth, !!T.frontHairHull);
    }
    for (const C of re.get(T.bone) ?? []) {
      const W = Math.min(C.range[1], Math.max(C.range[0], b[C.parameter] ?? 0));
      F(S, ...C.pivot, W * Math.PI / 180);
    }
    if (t.layered?.bodyAnchor && T.kind !== "body") {
      const C = [...S];
      if (P(C, b), T.bodyFollowBand) {
        const W = s(...T.bodyFollowBand, O);
        I(S, O, b, L.chest, L.breath, L.shoulder), S[0] = C[0] + (S[0] - C[0]) * W, S[1] = C[1] + (S[1] - C[1]) * W;
      } else
        S[0] = C[0], S[1] = C[1];
    } else I(S, O, b, T.kind === "body" ? L.chest : 0, L.breath, T.kind === "body" ? L.shoulder : 0);
    return T.tailSafe && a.after(S, T, b), S;
  }
  let D = null, G = null;
  function P(R, O) {
    const L = t.layered?.bodyAnchor;
    if (!L) {
      I(R, R[1], O);
      return;
    }
    if (D !== O) {
      const S = Z, z = [...L];
      I(z, L[1], O, S.chest, S.breath, S.shoulder);
      const C = -O.bodyAngleZ / 10 * r.maxRoll * (1 - s(...r.rollBand, L[1])), W = [...L];
      F(W, r.pivotX, r.pivotY, C), G = { c: Math.cos(C), s: Math.sin(C), x: z[0] - W[0], y: z[1] - W[1] }, D = O;
    }
    const b = G, _ = R[0] - r.pivotX, T = R[1] - r.pivotY;
    R[0] = r.pivotX + _ * b.c - T * b.s + b.x, R[1] = r.pivotY + _ * b.s + T * b.c + b.y;
  }
  const ce = new Map((t.layered?.bones ?? []).map((R) => [R.name, R])), re = /* @__PURE__ */ new Map();
  for (const R of ce.values()) {
    const O = [], L = /* @__PURE__ */ new Set();
    let b = R;
    for (; b; ) {
      if (L.has(b.name)) throw new Error("Layered bone cycle");
      L.add(b.name), O.push(b), b = ce.get(b.parent);
    }
    re.set(R.name, O);
  }
  function I(R, O, L, b = 0, _ = 1, T = 0) {
    const S = L.breath;
    R[1] -= S * (5 * _ + 4 * T), R[0] += (R[0] - r.chest.cx) * 0.012 * S * b, R[0] += L.bodyAngleX / 10 * (7 + 9 * b), F(R, r.pivotX, r.pivotY, -L.bodyAngleZ / 10 * r.maxRoll * (1 - s(...r.rollBand, O)));
  }
  function Q(R, O, L, b, _, T) {
    if (t.layered) return j(R, O, L, b, _, { kind: "face" }, T);
    const S = T;
    S[0] = R, S[1] = O;
    const z = _.gain;
    for (const [K, oe, V] of L.strands) {
      const ee = _.strands?.[K];
      if (!ee) continue;
      const fe = V * 3, pe = Math.min(2, Math.floor(fe)), Re = fe - pe;
      S[0] += (ee[pe][0] + (ee[pe + 1][0] - ee[pe][0]) * Re) * oe * z, S[1] += (ee[pe][1] + (ee[pe + 1][1] - ee[pe][1]) * Re) * oe * z;
    }
    if (S[0] += (_.bunL[0] * L.bunL + _.bunR[0] * L.bunR) * z, S[1] += (_.bunL[1] * L.bunL + _.bunR[1] * L.bunR) * z, S[1] -= b.browY * 7 * L.brow, L.brow > 0.01) {
      const K = b.browAngle * 0.12 * L.brow;
      S[1] += (R - t.face.brow.cx) * Math.sin(K);
    }
    S[1] += b.mouthOpen * 3.5 * L.jaw;
    const C = b.angleX / 30, W = b.angleY / 30;
    return S[0] += C * (8 * L.nose + 5 * L.mouth) + (R - t.face.eyeA.cx) * 0.12 * C * L.eyeA - (R - t.face.eyeB.cx) * 0.12 * C * L.eyeB - C * 9 * L.earR + C * 4 * L.earL - C * 10 * (L.bunL + L.bunR), S[1] -= W * (6 * L.nose + 3 * L.mouth), S[1] += (O - t.face.eyeA.cy) * -0.06 * Math.abs(W) * L.eyeA + (O - t.face.eyeB.cy) * -0.06 * Math.abs(W) * L.eyeB, U(S, L.head, b, L.turn), I(S, O, b, L.chest, L.breath, L.shoulder), S;
  }
  function H(R, O, L, b, _, T, S, z) {
    if (!e) return Q(O, L, b, _, T, S);
    const C = R === 0 ? t.face.eyeA : t.face.eyeB;
    S[0] = O, S[1] = L;
    const W = t.layered?.eyeSpring?.components;
    if (z && z !== "brow" && W && T.gain !== 0) {
      const oe = h[R], V = Math.min(1, Math.max(0, (O - oe.x0) / (oe.x1 - oe.x0))), ee = Math.sin(Math.PI * V) ** 2, fe = T.eyes?.[R] ?? [0, 0];
      S[1] += (fe[1] + fe[0] * (V - 0.5) * 0.45) * W.lash * ee;
    }
    const K = [C.cx, C.cy];
    if (z !== "brow") {
      const oe = _.eyeScale ?? 1, V = _.eyeSpacing ?? 1;
      if (oe !== 1 || V !== 1) {
        const ee = (C.cx - (t.face.eyeA.cx + t.face.eyeB.cx) / 2) * (V - 1);
        S[0] = C.cx + (S[0] - C.cx) * oe + ee, S[1] = C.cy + (S[1] - C.cy) * oe, K[0] += ee;
      }
    }
    return e.eye(S, K, R, _, z === "brow"), B(S, 1, _, 1, !0), t.layered.bodyAnchor ? P(S, _) : I(S, L, _, 0, 1, 0), S;
  }
  const N = t.hand, $ = N?.elbow ?? [0, 0], ne = N?.wrist ?? [0, 0], ue = N?.knuckle ?? [0, 0], te = N?.contact ?? [0, 0], ie = N?.forearmShare ?? 0;
  function ae(R, O) {
    return N ? {
      arm: 1 - s(...N.armBand, O),
      wrist: 1 - s(...N.wristBand, O),
      hand: 1 - s(...N.handBand, O),
      finger: s(...N.fingerXBand, R) * (1 - s(...N.fingerYBand, O)),
      pinBottom: s(...N.pinBand, O)
    } : { arm: 0, wrist: 0, hand: 0, finger: 0, pinBottom: 0 };
  }
  const se = (R, O, L, b) => {
    const _ = R[0] - O[0], T = R[1] - O[1];
    return [O[0] + _ * L - T * b, O[1] + _ * b + T * L];
  }, le = (R) => Math.atan2(R[1], R[0]);
  function be(R) {
    const O = [...te];
    U(O, x(...te), R, g(...te)), I(O, te[1], R, 0, 1, 0);
    const L = [...$];
    I(L, $[1], R, 0, 0, 0);
    const _ = (le([O[0] - L[0], O[1] - L[1]]) - le([te[0] - $[0], te[1] - $[1]])) * ie, T = Math.cos(_), S = Math.sin(_), z = (V) => {
      const ee = se(V, $, T, S);
      return [ee[0] + L[0] - $[0], ee[1] + L[1] - $[1]];
    }, C = z(ne), W = z(te), K = le([O[0] - C[0], O[1] - C[1]]) - le([W[0] - C[0], W[1] - C[1]]), oe = Math.min(1.03, Math.max(0.97, Math.hypot(O[0] - C[0], O[1] - C[1]) / Math.hypot(W[0] - C[0], W[1] - C[1])));
    return { tr: z, w: C, b: K, k: oe };
  }
  function ve(R, O, L, b, _, T) {
    let S = [R, O];
    S = se(S, ue, Math.cos(b.fingerTap * 0.07 * L.finger), Math.sin(b.fingerTap * 0.07 * L.finger));
    const z = -b.handAngle / 10 * 0.045 * L.wrist, C = -b.armAngle / 10 * 0.015 * L.arm;
    S = se(S, ne, Math.cos(z), Math.sin(z)), S = se(S, $, Math.cos(C), Math.sin(C)), S = _.tr(S);
    const W = _.b * L.hand, K = 1 + (_.k - 1) * L.hand;
    return S = se(S, _.w, Math.cos(W) * K, Math.sin(W) * K), S[1] += (O - S[1]) * L.pinBottom, T[0] = S[0], T[1] = S[1], T;
  }
  const Ae = t.accessories ?? [];
  function Oe(R, O, L, b) {
    const _ = Y(R.pivot[0], R.pivot[1]);
    return Q(R.pivot[0], R.pivot[1], _, O, L, b);
  }
  return { IMG: o, EYES: h, MOUTH: u, CHEEKS: y, STRANDS: E, TASSELS: Ae, headWeight: x, turnWeight: g, baseWeights: Y, deformBase: Q, deformEye: H, deformPart: j, applyHead: U, applyBody: I, applyHeadBody: P, handWeights: ae, handFrame: be, deformHand: ve, eyePartY: w, eyePartAlpha: A, tasselAnchor: Oe };
}
function Ea(t, e, n, a = !1) {
  const o = a ? Math.max(e, n) * 2 : 1, i = new Float32Array(t.length), l = Math.SQRT2;
  for (let h = 0; h < n; h++) for (let d = 0; d < e; d++) {
    const v = h * e + d;
    t[v] <= 3 || (i[v] = Math.min(
      d ? i[v - 1] + 1 : o,
      h ? i[v - e] + 1 : o,
      d && h ? i[v - e - 1] + l : o,
      h && d + 1 < e ? i[v - e + 1] + l : o
    ));
  }
  for (let h = n - 1; h >= 0; h--) for (let d = e - 1; d >= 0; d--) {
    const v = h * e + d;
    !t[v] || t[v] <= 3 || (i[v] = Math.min(
      i[v],
      d + 1 < e ? i[v + 1] + 1 : o,
      h + 1 < n ? i[v + e] + 1 : o,
      d && h + 1 < n ? i[v + e - 1] + l : o,
      d + 1 < e && h + 1 < n ? i[v + e + 1] + l : o
    ));
  }
  return i;
}
function Ut(t, e, n) {
  return Math.exp(-(((t - n.cx) / n.rx) ** 2 + ((e - n.cy) / n.ry) ** 2));
}
function ka(t, e, n) {
  const a = ((t - n.head.cx) / n.head.rx) ** 2 + ((e - n.head.cy) / n.head.ry) ** 2;
  let o = n.head.rx * 0.8 * Math.sqrt(Math.max(0, 1 - a)) + n.body.chest.rx * 0.23 * Ut(t, e, n.body.chest);
  o += n.face.nose.rx * 0.2 * Ut(t, e, n.face.nose);
  for (const [i, l] of n.cheeks) o += n.head.rx * 0.012 * Ut(t, e, { cx: i, cy: l, rx: n.head.rx * 0.3, ry: n.head.ry * 0.16 });
  return o;
}
function Ot(t, e, n, a) {
  const o = new Float32Array(t.length), i = new Float32Array(t.length), l = (h, d, v, p, c, f) => {
    for (let w = 0; w < p; w++) {
      const A = w * f;
      let u = 0, y = 0;
      for (let m = 0; m < Math.min(a, v - 1) + 1; m++)
        u += h[A + m * c], y++;
      for (let m = 0; m < v; m++) {
        d[A + m * c] = u / y;
        const r = m + a + 1, s = m - a;
        r < v && (u += h[A + r * c], y++), s >= 0 && (u -= h[A + s * c], y--);
      }
    }
  };
  return l(t, o, e, n, 1, e), l(o, i, n, e, e, 1), i;
}
function Ta(t, e, n, a) {
  const o = Ot(t, n, a, 1), i = Ot(t, n, a, 6), l = new Float32Array(t.length);
  for (let v = 0; v < l.length; v++) l[v] = e[v] > 128 ? o[v] - i[v] : 0;
  const h = new Float32Array(t.length * 2), d = (v, p) => l[Math.max(0, Math.min(a - 1, p)) * n + Math.max(0, Math.min(n - 1, v))];
  for (let v = 0; v < a; v++) for (let p = 0; p < n; p++) {
    const c = v * n + p;
    e[c] <= 128 || (h[2 * c] = Math.max(-1, Math.min(1, -(d(p + 1, v) - d(p - 1, v)) * 4)), h[2 * c + 1] = Math.max(-1, Math.min(1, -(d(p, v + 1) - d(p, v - 1)) * 4)));
  }
  return h;
}
function Ra(t, e, n, a, o, i = !0, l) {
  const h = !!o && a[0] === 0 && a[1] === 0 && a[2] === o.image.width && a[3] === o.image.height, d = Ea(t, e, n, h), v = new Float32Array(t.length), p = a[2] / e, c = a[3] / n, f = Math.min(p, c), w = Math.min(a[2], a[3]) * 0.08;
  for (let r = 0; r < n; r++) for (let s = 0; s < e; s++) {
    const x = r * e + s;
    v[x] = (i ? Math.sqrt(d[x] * f * w) * 0.55 : 0) + (o ? ka(a[0] + (s + 0.5) * p, a[1] + (r + 0.5) * c, o) : 0);
  }
  const A = Math.max(1, Math.round(Math.min(e, n) * 0.02));
  v.set(Ot(Ot(v, e, n, A), e, n, A));
  const u = l ? Ta(l, t, e, n) : null, y = new Uint8Array(e * n * 4), m = (r, s) => v[Math.max(0, Math.min(n - 1, s)) * e + Math.max(0, Math.min(e - 1, r))];
  for (let r = 0; r < n; r++) for (let s = 0; s < e; s++) {
    const x = -(m(s + 2, r) - m(s - 2, r)) / (4 * p), g = -(m(s, r + 2) - m(s, r - 2)) / (4 * c), E = Math.hypot(x, g, 1), M = (r * e + s) * 4, k = r * e + s;
    y[M] = Math.round((x / E * 0.5 + 0.5) * 255), y[M + 1] = Math.round((g / E * 0.5 + 0.5) * 255), y[M + 2] = Math.round(((u?.[2 * k] ?? 0) * 0.5 + 0.5) * 255), y[M + 3] = Math.round(((u?.[2 * k + 1] ?? 0) * 0.5 + 0.5) * 255);
  }
  return y;
}
const kn = /* @__PURE__ */ new WeakMap();
function _a(t, e, n, a) {
  const o = JSON.stringify([e, n.head, n.body.chest, n.face.nose, n.cheeks, a]), i = kn.get(t);
  if (i?.key === o) return { ...i, computed: !1, ms: 0 };
  const l = performance.now(), h = Math.min(1, 512 / Math.max(t.width, t.height)), d = Math.max(1, Math.round(t.width * h)), v = Math.max(1, Math.round(t.height * h)), p = document.createElement("canvas");
  p.width = d, p.height = v;
  const c = p.getContext("2d", { willReadFrequently: !0 });
  c.drawImage(t, 0, 0, d, v);
  const f = c.getImageData(0, 0, d, v).data, w = new Uint8Array(d * v), A = new Float32Array(d * v);
  for (let y = 0; y < w.length; y++)
    w[y] = f[4 * y + 3], A[y] = (0.2126 * f[4 * y] + 0.7152 * f[4 * y + 1] + 0.0722 * f[4 * y + 2]) / 255;
  const u = { key: o, data: Ra(w, d, v, e, n, a, a ? A : void 0), width: d, height: v };
  return kn.set(t, u), { ...u, computed: !0, ms: performance.now() - l };
}
const tt = Object.freeze({
  enabled: !1,
  x: 0.2,
  y: 0.2,
  z: 0.45,
  color: 16777215,
  strength: 0.8,
  intensity: 0.8,
  ambient: 0.4,
  mode: "soft",
  shadow: !1,
  reach: 1.2,
  ambientColor: 15659256,
  softness: 0.45,
  specular: 0.12,
  rim: 0.3,
  detail: 0.4
}), Tn = {
  x: [0, 1],
  y: [0, 1],
  z: [0.1, 2],
  color: [0, 16777215],
  strength: [0, 1],
  intensity: [0, 2],
  ambient: [0, 1],
  reach: [0.2, 3],
  ambientColor: [0, 16777215],
  softness: [0, 1],
  specular: [0, 1],
  rim: [0, 1],
  detail: [0, 1]
}, Oa = /* @__PURE__ */ new Set(["color", "ambientColor"]);
function Fa(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return null;
  const e = t;
  if (Object.keys(e).length !== Object.keys(tt).length || Object.keys(e).some((a) => !(a in tt)) || ![!0, !1].includes(e.enabled) || ![!0, !1].includes(e.shadow) || !["soft", "cel"].includes(e.mode)) return null;
  const n = { ...tt, enabled: e.enabled, shadow: e.shadow, mode: e.mode };
  for (const a of Object.keys(Tn)) {
    const o = e[a], [i, l] = Tn[a];
    if (typeof o != "number" || !Number.isFinite(o) || Oa.has(a) && !Number.isInteger(o)) return null;
    n[a] = Math.max(i, Math.min(l, o));
  }
  return n;
}
function Zo(t) {
  return `#${t.toString(16).padStart(6, "0")}`;
}
const kt = -0.1, La = 0.9, Ca = 1, Ba = 1.06;
function Ia(t, e) {
  return [(0.5 - t) * 0.12, (0.5 - e) * 0.12];
}
function Ya(t, e, n, a) {
  const o = t * Math.PI / 180, i = e * Math.PI / 180, l = -n / 30 * a, h = Math.cos(o), d = Math.sin(o), v = Math.cos(i), p = Math.sin(i), c = Math.cos(l), f = Math.sin(l);
  return [
    c * h,
    f * h,
    -d,
    c * d * p - f * v,
    f * d * p + c * v,
    h * p,
    c * d * v + f * p,
    f * d * v - c * p,
    h * v
  ];
}
class Ua {
  constructor(e, n) {
    this.gl = e, this.program = n(e, `#version 300 es
      out vec2 vUv;
      void main() { vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); vUv = p; gl_Position = vec4(p * 2.0 - 1.0, 0, 1); }`, `#version 300 es
      precision highp float; in vec2 vUv; out vec4 o;
      uniform sampler2D uTex; uniform vec2 uStep; uniform vec2 uShift; uniform int uPass;
      float alphaAt(vec2 p) { if (any(lessThan(p, vec2(0))) || any(greaterThan(p, vec2(1)))) return 0.0; return texture(uTex, p).a; }
      void main() {
        if (uPass == 2) { o = texture(uTex, vUv); return; }
        vec2 p = vUv - uShift;
        float a = alphaAt(p) * 0.227027;
        a += (alphaAt(p + uStep * 1.384615) + alphaAt(p - uStep * 1.384615)) * 0.316216;
        a += (alphaAt(p + uStep * 3.230769) + alphaAt(p - uStep * 3.230769)) * 0.070270;
        o = uPass == 0 ? vec4(0, 0, 0, a) : vec4(vec3(0.035, 0.045, 0.065) * a * 0.28, a * 0.28);
      }`), this.vao = e.createVertexArray(), this.targets = [];
  }
  target(e, n) {
    const a = this.gl, o = a.createTexture(), i = a.createFramebuffer();
    if (a.bindTexture(a.TEXTURE_2D, o), a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, e, n, 0, a.RGBA, a.UNSIGNED_BYTE, null), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE), a.bindFramebuffer(a.FRAMEBUFFER, i), a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, o, 0), a.checkFramebufferStatus(a.FRAMEBUFFER) !== a.FRAMEBUFFER_COMPLETE) throw new Error("Shadow framebuffer unavailable");
    return { texture: o, framebuffer: i };
  }
  begin(e, n) {
    const a = this.gl;
    (this.width !== e || this.height !== n) && (this.clearTargets(), this.width = e, this.height = n, this.targets = [this.target(e, n), this.target(Math.ceil(e / 2), Math.ceil(n / 2))]), a.bindFramebuffer(a.FRAMEBUFFER, this.targets[0].framebuffer), a.viewport(0, 0, e, n), a.clearColor(0, 0, 0, 0), a.clear(a.COLOR_BUFFER_BIT);
  }
  composite(e) {
    const n = this.gl, { prog: a, u: o } = this.program, i = this.width, l = this.height;
    n.useProgram(a), n.bindVertexArray(this.vao), n.activeTexture(n.TEXTURE0), n.uniform1i(o.uTex, 0), n.disable(n.BLEND), n.bindFramebuffer(n.FRAMEBUFFER, this.targets[1].framebuffer), n.viewport(0, 0, Math.ceil(i / 2), Math.ceil(l / 2)), n.bindTexture(n.TEXTURE_2D, this.targets[0].texture), n.uniform1i(o.uPass, 0), n.uniform2f(o.uShift, 0, 0), n.uniform2f(o.uStep, 3 / i, 0), n.drawArrays(n.TRIANGLES, 0, 3), n.bindFramebuffer(n.FRAMEBUFFER, null), n.viewport(0, 0, i, l), n.clearColor(0, 0, 0, 0), n.clear(n.COLOR_BUFFER_BIT), n.enable(n.BLEND), n.bindTexture(n.TEXTURE_2D, this.targets[1].texture);
    const h = Ia(e.x, e.y);
    n.uniform1i(o.uPass, 1), n.uniform2f(o.uShift, h[0], -h[1]), n.uniform2f(o.uStep, 0, 3 / l), n.drawArrays(n.TRIANGLES, 0, 3), n.bindTexture(n.TEXTURE_2D, this.targets[0].texture), n.uniform1i(o.uPass, 2), n.drawArrays(n.TRIANGLES, 0, 3), n.bindVertexArray(null);
  }
  clearTargets() {
    for (const e of this.targets)
      this.gl.deleteTexture(e.texture), this.gl.deleteFramebuffer(e.framebuffer);
    this.targets = [];
  }
  destroy() {
    this.clearTargets(), this.gl.deleteProgram(this.program.prog), this.gl.deleteVertexArray(this.vao);
  }
}
function ja(t, e) {
  const { IMG: n, EYES: a, MOUTH: o, CHEEKS: i } = t, l = `#version 300 es
  in vec2 aPos; in vec2 aUv;
  uniform vec2 uScale; uniform vec2 uOffset;
  out vec2 vUv;
  void main() { vUv = aUv; gl_Position = vec4(aPos * uScale + uOffset, 0.0, 1.0); }`, h = `#version 300 es
  precision highp float;
  in vec2 vUv; out vec4 outColor;
  uniform sampler2D uTex;
  uniform vec4 uTextureRect;
  uniform sampler2D uEyeClip;
  uniform vec4 uEyeClipRect;
  uniform bool uUseEyeClip;
  uniform vec4 uRect;        // layer rect in source px
  uniform int uFace;
  uniform float uLegRepair;uniform float uShinClear;uniform float uSashSide;uniform float uBowPart;
  uniform float uFrontSeal;uniform vec3 uFrontSealColor;uniform vec3 uRearHairTint;uniform float uCrownClip;uniform float uHwHatSplit;uniform float uHwHairRoof;uniform sampler2D uHwMatte;uniform float uHwHasMatte;uniform float uHwSleeveTrim;uniform vec4 uHwSlice;uniform vec4 uHwSplitAxis;uniform vec4 uHwSourceClip;uniform float uHwClean;uniform float uHwProp;uniform float uHwLampLight;uniform float uHwHandClean;uniform float uHwHandSection;uniform float uHwHandScale;uniform float uFinRim;uniform float uFinSurface;uniform float uFinFold;uniform vec4 uFinAxis;uniform float uHairContact[32];uniform vec2 uHairContactRange;
  uniform float uHairVolumeShade;

 uniform float uIrisFlow;
 uniform vec4 uFlowIris;
 uniform vec3 uFlowPhase;

uniform float uAlpha;
 uniform float uNormalClosedEye;
 uniform vec2 uDetailShift;
 uniform float uPupilDetailScale;
 uniform vec2 uPupilDetailCenter;
  uniform vec4 uEyeBox[2];   // x0, x1, -, -
  uniform float uEyeTop[48]; // 2 eyes x EYE_N samples
  uniform float uEyeBot[48];
  uniform vec4 uEyeState[2]; // open, smile, ballX(px), ballY(px)
  uniform vec2 uEyeBounce;
  uniform vec2 uEyeInertia[2];
  uniform float uEyeElasticGain;
  uniform float uEyeCover;
  uniform vec4 uMouth;       // cx, cy, angle, halfLen
  uniform vec4 uMouthState;  // open, form, bow, -
  uniform vec4 uCheeks;      // x0, y0, x1, y1
  uniform float uCheek;
  uniform vec4 uFaceTurn; // yaw, subtle side shade, face center, radius
  uniform vec3 uExpressionShade; // start, end, amount in source coordinates
  uniform vec3 uExpressionShadeColor;
  uniform float uExpressionSkinClear;
  uniform vec3 uLidDrawingTint;
  uniform float uAuthoredArmPart;
  uniform float uNativeForearm;
  uniform float uEyeSkinClean;
  uniform vec2 uClosedLash;
  uniform float uHoodUnderfill;
  uniform float uClosedDrawing;
  uniform float uWaveFrillFront;

  const int EYE_N = 24;
  float crv(int e, bool top, float u) {
    float f = clamp(u, 0.0, 1.0) * float(EYE_N - 1);
    int i = min(int(floor(f)), EYE_N - 2);
    float t = f - float(i);
    int k = e * EYE_N + i;
    return top ? mix(uEyeTop[k], uEyeTop[k + 1], t) : mix(uEyeBot[k], uEyeBot[k + 1], t);
  }

  // Upper lid line and lower lid line of eye e at column u, for the current open/smile state.
  // Must match eyeLids() in rig.js, which moves the lash meshes to the same lines.
  // Must match eyeLidsRaw() / eyeLids() in rig.js.
  vec2 eyeLidsRaw(int e, float u) {
    u = clamp(u, 0.0, 1.0);
    vec4 st = uEyeState[e];
    float top = crv(e, true, u), bot = crv(e, false, u);
    float b = 1.0 - st.x, smile = st.y, hump = 4.0 * u * (1.0 - u);
    float H = crv(e, false, 0.5) - crv(e, true, 0.5);
    float arc = mix(uEyeTop[e * EYE_N], uEyeTop[e * EYE_N + EYE_N - 1], u) - 0.3 * H * hump;
    float rawClosed=max(top,bot+1.+(arc-bot-1.)*smile),morph=(1.-smoothstep(.05,.36,st.x))*(1.-smile);
    float normalY=crv(e,true,.5)+H*.78+H*.06*pow(2.*u-1.,2.),closed=mix(rawClosed,normalY,morph);
    return vec2((closed - top) * max(b, -0.07), b > 0.0 ? (closed - bot) * b * (smile+(1.-smile)*morph) : 0.0);
  }

  vec2 eyeLids(int e, float u, float top, float bot) {
    vec4 box = uEyeBox[e];
    float du = 5.0 / (box.y - box.x);
    vec2 raw = eyeLidsRaw(e, u);
    vec2 d = (eyeLidsRaw(e, u - 2.0 * du) + 2.0 * eyeLidsRaw(e, u - du) + 3.0 * raw
            + 2.0 * eyeLidsRaw(e, u + du) + eyeLidsRaw(e, u + 2.0 * du)) / 9.0;
    // for hiding the ball take whichever closes more: the smoothed lash can sit a little
    // above the raw lid near the corners, and the gap must show lid skin, not eye white
    return vec2(top + max(d.x, raw.x), bot + min(d.y, raw.y));
  }

  vec4 texAt(vec2 p) { return texture(uTex, uTextureRect.xy + (p - uRect.xy) / uRect.zw * uTextureRect.zw); }

  // Eye white + iris layer: shown only between the lids (the lids cover it, it never squashes);
  // the iris slides inside the opening for the gaze.
  vec4 eyeBall(int e, vec2 p) {
    vec4 box = uEyeBox[e]; vec4 st = uEyeState[e];
    float u = clamp((p.x - box.x) / (box.y - box.x), 0.0, 1.0);
    float top = crv(e, true, u), bot = crv(e, false, u);
    vec2 lids = eyeLids(e, u, top, bot);
    float v = clamp((p.y - top) / max(bot - top, 1.0), 0.0, 1.0);
    float w = sqrt(4.0 * u * (1.0 - u)) * sqrt(4.0 * v * (1.0 - v));
    vec4 c = texAt(p - vec2(st.z, st.w) * w);
      // the lash covers ~2px of the ball's upper edge, so the cut can sit under it (no seam)
    return c * smoothstep(lids.x - 1.0, lids.x + 0.5, p.y) * (1.0 - smoothstep(lids.y - 0.9, lids.y + 0.6, p.y));
  }


 vec4 irisFlow(vec4 color,vec2 q){
  if(uIrisFlow<.5||color.a<.001)return color;
  vec2 r=max(uFlowIris.zw,vec2(1.)),p=(q-uFlowIris.xy)/r;
  float coverage=1.-smoothstep(.91,.985,length(p));
  float light=0.;
  for(int i=0;i<3;i++){
   float phase=uFlowPhase[i],base=i==0?2.75:i==1?.25:.78;
   float radius=(i==0?.76:i==1?.78:.75)+.025*sin(phase*2.);
   vec2 direction=vec2(cos(base+phase),sin(base+phase));
   vec2 center=uFlowIris.xy+r*direction*radius;
   vec2 tangent=normalize(vec2(-direction.y*r.x,direction.x*r.y));
   vec2 d=q-center;
   float size=i==0?1.48:i==1?1.26:1.35;
   float ellipse=length(vec2(dot(d,tangent)/(size*1.24),dot(d,vec2(-tangent.y,tangent.x))/(size*.74)));
   float core=1.-smoothstep(.68,1.05,ellipse),glow=exp(-ellipse*ellipse*1.7)*.22;
   light=max(light,(core*.80+glow)*coverage);
  }
  color.rgb=mix(color.rgb,vec3(.78,.98,1.)*color.a,clamp(light,0.,.94));
  return color;
 }

  vec4 splitEye(int e, vec2 p, bool fixedWhite) {
    vec4 box = uEyeBox[e]; vec4 st = uEyeState[e];
    float u = clamp((p.x - box.x) / (box.y - box.x), 0.0, 1.0);
    vec2 lids = eyeLids(e, u, crv(e, true, u), crv(e, false, u));
    float gazeYLimit = uEyeCover > 0.0 ? .65 : 2.5;
    vec2 q = p - (fixedWhite ? vec2(0.0) : clamp(vec2(st.z, st.w), vec2(-4.0, -gazeYLimit), vec2(4.0, gazeYLimit)));
    if (!fixedWhite && uEyeElasticGain > 0.0) {
      vec2 gaze = vec2(st.z, st.w) - uEyeInertia[e];
      vec2 lag = uEyeInertia[e] * vec2(1.0, .42) * uEyeElasticGain;
      vec2 shift = clamp(gaze, vec2(-4.0, -.65), vec2(4.0, .65)) + lag;
      q = p - clamp(shift, vec2(-5.4, -1.45), vec2(5.4, 1.45));
    }
    if (!fixedWhite && uEyeCover > 0.0) {
      // The complete ball stays proportional and extends slightly behind the lids.
      // Shared coverage avoids cut-edge replication and keeps reflections attached.
      vec2 center = vec2((box.x + box.y) * .5, (crv(e, true, .5) + crv(e, false, .5)) * .5);
      float scale = (1.0 + uEyeCover) * (1.0 + clamp(uEyeBounce[e], -.15, .15) * .2);
      q = center + (q - center) / scale;
    } else if (!fixedWhite && uEyeBounce[e] != 0.0) {
      float bounce = clamp(uEyeBounce[e], -0.15, 0.15);
      vec2 center = vec2((box.x + box.y) * 0.5, (crv(e, true, 0.5) + crv(e, false, 0.5)) * 0.5);
      q = center + (q - center) / vec2(1.0 - bounce * 0.45, 1.0 + bounce);
    }
    q-=uDetailShift;
    if(uPupilDetailScale>1.){vec2 center=uPupilDetailCenter;q=center+(q-center)/uPupilDetailScale;}
    vec2 uv = (q - uRect.xy) / uRect.zw;
    vec4 c = irisFlow(texture(uTex, uv),q);
    float bounds = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
    float clipX = smoothstep(box.x - 0.5, box.x + 0.5, p.x) * (1.0 - smoothstep(box.y - 0.5, box.y + 0.5, p.x));
    float mask = uUseEyeClip ? texture(uEyeClip, (p - uEyeClipRect.xy) / uEyeClipRect.zw).a : 1.0;
    return c * mask * bounds * clipX * smoothstep(lids.x - 1.0, lids.x + 0.5, p.y) * (1.0 - smoothstep(lids.y - 0.9, lids.y + 0.6, p.y));
  }

  vec4 mouth(vec2 p, vec4 base) {
    float open = uMouthState.x;
    if (open < 0.01) return base;
    vec2 d = vec2(cos(uMouth.z), sin(uMouth.z)), n = vec2(-d.y, d.x);
    vec2 r = p - uMouth.xy;
    float s = dot(r, d) / uMouth.w, t = dot(r, n);
    float form = uMouthState.y;                       // -1 wide "i" .. +1 round "o"
    float wf = mix(0.78, 0.46, clamp(form * 0.5 + 0.5, 0.0, 1.0));
    float k = 1.0 - (s / wf) * (s / wf);
    if (k <= 0.0) return base;
    float line = uMouthState.z * (1.0 - s * s);
    float hk = pow(k, mix(0.55, 0.85, clamp(form, 0.0, 1.0)));
    float H = mix(20.0, 26.0, clamp(form, 0.0, 1.0));
    float up = line - 0.6 - open * 2.5 * hk;
    float lo = line + open * H * hk;
    float cov = smoothstep(-0.7, 0.7, t - up) * smoothstep(-0.7, 0.7, lo - t);
    if (cov <= 0.0) return base;
    float tv = clamp((t - up) / max(lo - up, 1.0), 0.0, 1.0);
    vec3 col = mix(vec3(0.24, 0.05, 0.08), vec3(0.48, 0.15, 0.19), tv);
    float tongue = smoothstep(0.5, 0.78, tv) * (1.0 - smoothstep(0.45, 0.8, abs(s) / wf));
    col = mix(col, vec3(0.86, 0.44, 0.47), tongue * 0.9);
    float teeth = (1.0 - smoothstep(0.12, 0.22, tv)) * smoothstep(0.25, 0.45, open) * (1.0 - smoothstep(0.55, 0.85, abs(s) / wf));
    col = mix(col, vec3(0.99, 0.96, 0.94), teeth);
    float rim = 1.0 - smoothstep(0.6, 1.8, lo - t);
    col = mix(col, vec3(0.36, 0.09, 0.11), rim * 0.85);
    return vec4(mix(base.rgb, col, cov), 1.0);
  }


bool bowInside(vec2 p){
 vec2 poly[4]=vec2[4](vec2(463.,396.),vec2(481.,401.),vec2(445.,464.),vec2(400.,443.));
 bool inside=false;for(int i=0,j=3;i<4;j=i++){vec2 a=poly[i],b=poly[j];if(((a.y>p.y)!=(b.y>p.y))&&(p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x))inside=!inside;}return inside;
}
vec4 repairBody(vec4 c,vec2 p){
 if(abs(uBowPart)>1.5)c*=smoothstep(418.,420.,p.y);
 if(uLegRepair!=0.){
  bool left=uLegRepair<0.;float t=clamp((p.y-1402.)/112.,0.,1.),blend=t*t*(3.-2.*t);
  float center=mix(left?449.:532.,left?436.:531.,blend),width=mix(36.,left?40.:49.,blend);
  float sy=mix(1370.,1410.,t),sourceCenter=left?448.5:mix(534.,532.,t),sourceWidth=mix(left?42.:44.,left?35.:37.,t);
  vec2 q=vec2(sourceCenter+(p.x-center)*sourceWidth/width,sy);
  float cover=smoothstep(1402.,1414.,p.y)*(1.-smoothstep(1502.,1514.,p.y));
  c=texAt(q)*cover;
 }
 if(uShinClear>0.)c*=1.-smoothstep(1412.,1422.,p.y)*(1.-smoothstep(1498.,1510.,p.y));
 if(uSashSide!=0.){
  vec2 root=uSashSide<0.?vec2(388.,630.):vec2(548.,630.),tip=uSashSide<0.?vec2(277.,740.):vec2(653.,749.),axis=tip-root;
  float L=length(axis),t=dot(p-root,axis)/(L*L),n=dot(p-root,vec2(-axis.y,axis.x))/L;
  float width=mix(uSashSide<0.?2.5:4.,uSashSide<0.?5.8:7.5,clamp(t,0.,1.))+sin(clamp(t,0.,1.)*3.14159)*1.2;
  float coverage=(1.-smoothstep(width-.6,width+.2,abs(n)))*smoothstep(-.02,.01,t)*(1.-smoothstep(.98,1.015,t));
  float edge=smoothstep(width-1.3,width-.5,abs(n));vec3 cloth=mix(vec3(.73,.71,.79),vec3(.98,.98,1.),clamp(n/width*.5+.55,0.,1.));cloth=mix(cloth,vec3(.14,.15,.22),edge*.92);c=vec4(cloth*coverage,coverage);
 }
 return c;
}

 float authoredArmMask(vec2 p,float part){
   if(part>1.5)return smoothstep(-38.,-30.,492.-p.y)*(1.-smoothstep(410.,414.,p.x));
   float cap=1.-smoothstep(90.,92.,length((p-vec2(489.,705.))*vec2(1.,.9)));
   if(part<.5)return max(1.-smoothstep(700.,708.,p.y),cap);
   return max(smoothstep(700.,708.,p.y),cap)*(1.-smoothstep(1294.,1302.,p.y));
 }

  void main() {
    vec2 p = uRect.xy + vUv * uRect.zw;
    vec4 c;
    if (uFace == 1) {
      c = mouth(p, texAt(p));
      float blush = exp(-dot((p - uCheeks.xy) / vec2(48.0, 22.0), (p - uCheeks.xy) / vec2(48.0, 22.0)))
                  + exp(-dot((p - uCheeks.zw) / vec2(40.0, 20.0), (p - uCheeks.zw) / vec2(40.0, 20.0)));
      c.rgb = mix(c.rgb, c.rgb * vec3(1.0, 0.62, 0.64) , clamp(blush * uCheek * 0.55, 0.0, 1.0) * c.a);
      float side = smoothstep(-0.15, 0.9, (p.x - uFaceTurn.z) / max(1.0, uFaceTurn.w) * sign(uFaceTurn.x));
      c.rgb *= 1.0 - abs(uFaceTurn.x) * uFaceTurn.y * side;
    } else if (uFace >= 4) {
      c = splitEye((uFace - 4) % 2, p, uFace < 6);
    } else if (uFace >= 2) {
      c = eyeBall(uFace - 2, p);
    } else {
      c = texAt(p);
    }
    if(uAuthoredArmPart>-.5){c*=authoredArmMask(p,uAuthoredArmPart);vec3 col=c.rgb/max(c.a,.001);
      if(uAuthoredArmPart>1.5)c*=smoothstep(.02,.07,col.r-col.b);
      else if(uAuthoredArmPart>.5&&p.y>1248.){float skin=smoothstep(.02,.06,col.r-col.b)*smoothstep(.005,.03,col.g-col.b);c*=1.-skin;}
    }
    if(uNativeForearm>0.)c*=smoothstep(235.,240.,p.x)*(1.-smoothstep(716.,720.,p.y));
    if(uEyeSkinClean>0.){vec3 col=c.rgb/max(c.a,.001);float skin=smoothstep(.52,.64,col.r)*smoothstep(.43,.53,dot(col,vec3(.25,.6,.15)))*smoothstep(.025,.06,col.r-col.b);c*=1.-skin*uEyeSkinClean;}
    if(uClosedLash.x>-.5){int e=int(uClosedLash.x);vec4 box=uEyeBox[e];float top=crv(e,true,clamp((p.x-box.x)/(box.y-box.x),0.,1.));float close=1.-smoothstep(.05,.4,uClosedLash.y);c*=1.-close*smoothstep(top-.2,top+1.2,p.y);float sides=smoothstep(box.x,box.x+1.5,p.x)*(1.-smoothstep(box.y-1.5,box.y,p.x));c*=mix(1.,sides,close);}
    if(uHoodUnderfill>0.)c*=1.-smoothstep(220.,240.,p.y);
    if(uClosedDrawing>0.){vec3 ink=c.rgb/max(c.a,.001);c*=1.-smoothstep(.43,.55,dot(ink,vec3(.25,.6,.15)));}
    if(uWaveFrillFront>0.){float along=dot(p-vec2(229.,755.),vec2(-107.,179.))/208.54;c*=1.-smoothstep(-6.,4.,along);}
    c.rgb*=uLidDrawingTint;
    if (uExpressionShade.z > 0.0 && uFace == 1) {
      float upper = 1.0 - smoothstep(uExpressionShade.x, uExpressionShade.y, p.y);
      c.rgb = mix(c.rgb, c.rgb * uExpressionShadeColor, upper * uExpressionShade.z);
    }
    if (uExpressionSkinClear > 0.0) {
      // Reveal the continuous face beneath warm skin islands baked into cutouts.
      // Blue hair and white trim fail this chroma mask and retain their alpha.
      vec3 skinColor = c.rgb / max(c.a, .001);
      float skin = smoothstep(.55, .62, skinColor.r) * smoothstep(.045, .075, skinColor.r - skinColor.b)
        * smoothstep(.01, .025, skinColor.g - skinColor.b);
      // Textures and blending use premultiplied alpha; clear RGB with alpha.
      c *= 1.0 - skin * uExpressionSkinClear;
    }
    if(uHwClean<-.5)c=vec4(c.rgb/max(c.a,.001),1.);
    if(uHwHasMatte>.5&&!(uHwSlice.x>20.5&&uHwSlice.x<21.5))c*=texture(uHwMatte,vUv).a;
    c=repairBody(c,p);
    if(uFrontSeal>0.){float u=clamp((p.x-uHairContactRange.x)/(uHairContactRange.y-uHairContactRange.x),0.,1.)*31.;int k=min(30,int(floor(u)));float line=mix(uHairContact[k],uHairContact[k+1],u-float(k));float cover=smoothstep(line-6.,line-4.,p.y)*(1.-smoothstep(line+8.,line+10.,p.y))*smoothstep(uHairContactRange.x-3.,uHairContactRange.x-1.,p.x)*(1.-smoothstep(uHairContactRange.y+1.,uHairContactRange.y+3.,p.x));vec3 ink=c.a>.02?c.rgb/max(c.a,.001):uFrontSealColor;c=vec4(ink*cover,cover);}
    c.rgb*=uRearHairTint;
    if(abs(uHwHandClean)>.5){bool left=uHwHandClean<0.;vec2 at=left?vec2(229.,755.):vec2(725.,776.),axis=normalize(vec2(left?-.56:.56,.83));float entry=dot(p-at,axis),nearSkin=0.;for(int ix=-1;ix<=1;ix++)for(int iy=-1;iy<=1;iy++){vec4 q=texture(uTex,uTextureRect.xy+(vUv+vec2(float(ix),float(iy))/uRect.zw)*uTextureRect.zw);vec3 ink=q.rgb/max(q.a,.001);float skin=step(.6,ink.r)*step(.38,ink.g)*step(.035,ink.r-ink.b)*step(.3,q.a);nearSkin=max(nearSkin,skin);}c*=smoothstep(-15.,-10.,entry)*nearSkin;}
    if(uHwHairRoof>.5){float roof=180.+.30*(p.x-465.);c*=smoothstep(roof,roof+1.,p.y);}
    if(abs(uHwHatSplit)>.5){vec3 ink=c.rgb/max(c.a,.001);float orange=smoothstep(.12,.22,ink.r-ink.b)*smoothstep(.30,.50,ink.r);c*=uHwHatSplit>0.?orange:1.-orange;float contact=150.+.32*(p.x-450.);if(uHwHatSplit<0.)c*=1.-smoothstep(contact-1.,contact,p.y);}
    if(abs(uHwSleeveTrim)>.5){float end=uHwSleeveTrim<0.?681.:684.;c*=1.-smoothstep(end-2.,end,p.y);}
    if(uHwProp>.5&&uHwProp<1.5){vec2 uv=vUv;float glass=smoothstep(.42,.46,uv.y)*(1.-smoothstep(.76,.80,uv.y))*smoothstep(.20,.23,uv.x)*(1.-smoothstep(.78,.81,uv.x));float sideClip=1.-smoothstep(.61,.64,abs(uv.x-.5)*2.);c*=mix(smoothstep(.34,.60,c.a),.5,glass);if(uv.y>.42&&uv.y<.76)c*=sideClip;c.rgb*=.55+.45*uHwLampLight;}
    if(uHwProp>1.5&&uHwProp<2.5){c*=smoothstep(.06,.22,c.a);c.rgb*=.28+.72*uHwLampLight;c.a*=.65+.35*uHwLampLight;}
    if(uHwProp>2.5){float entry=dot(p-vec2(229.,755.),normalize(vec2(-.56,.83))),lo=uHwSlice.x>21.5&&uHwSlice.x<22.5?uHwSlice.y:-32.,hi=uHwSlice.x>21.5&&uHwSlice.x<22.5?uHwSlice.z:-27.;c*=smoothstep(lo,hi,entry);}
    if(uHwClean>0.)c*=smoothstep(uHwClean*.4,uHwClean,c.a);
    float slice=uHwSlice.x;
    if(slice>.5&&slice<2.5){vec2 axis=uHwSplitAxis.zw,d=p-uHwSplitAxis.xy;float t=dot(d,axis),side=dot(d,vec2(-axis.y,axis.x)),lip=30.+15.*(1.-smoothstep(0.,40.,abs(side))),front=max(max(1.-step(-18.,t),step(lip,t)),step(38.,abs(side)));c*=slice<1.5?1.-front:front;}
    if(slice>3.5&&slice<5.5){float side=smoothstep(474.6,475.4,p.x);c*=slice<4.5?1.-side:side;float collar=smoothstep(389.,392.,p.y);c*=mix(collar,1.,smoothstep(43.,61.,abs(p.x-475.)));}
    if(slice>5.5&&slice<6.5){float sy=vUv.y*1536.;c*=smoothstep(222.,226.,sy);}
    if(slice>6.5&&slice<8.5){vec3 ink=c.rgb/max(c.a,.001);float purple=step(.5,smoothstep(.06,.15,ink.r-ink.g)*smoothstep(.25,.44,ink.r)*smoothstep(.42,.58,ink.b));c*=slice<7.5?1.-purple:purple;}
    if(slice>8.5&&slice<9.5){float lo=uHwSlice.y,hi=uHwSlice.z;c*=step(lo,vUv.y)*(1.-step(hi,vUv.y));}
    if(slice>9.5&&slice<11.5){float side=step(475.,p.x);c*=slice<10.5?1.-side:side;}
    if(uHwSourceClip.z>0.){vec2 source=vUv*vec2(2098.,750.);c*=step(uHwSourceClip.x,source.x)*step(uHwSourceClip.y,source.y)*step(source.x,uHwSourceClip.z)*step(source.y,uHwSourceClip.w);}
    if(slice>13.5&&slice<14.5)c*=smoothstep(392.,396.,p.x)*(1.-smoothstep(554.,558.,p.x))*smoothstep(361.,365.,p.y)*(1.-smoothstep(409.,413.,p.y));
    if(slice>14.5&&slice<15.5){float halfWidth=mix(72.,90.,smoothstep(621.,666.,p.y));c*=1.-smoothstep(halfWidth-1.,halfWidth,abs(p.x-479.));c*=smoothstep(609.,612.,p.y)*(1.-smoothstep(662.,666.,p.y));}
    if(slice>15.5&&slice<17.5){vec2 q=vUv*vec2(1024.,1536.);float lip=130.+15.*max(0.,1.-pow((q.x-511.)/140.,2.)),front=step(lip,q.y);c*=step(380.,q.x)*step(q.x,645.)*step(90.,q.y)*step(q.y,252.);c*=slice<16.5?1.-front:front;}
    if(slice>17.5&&slice<19.5){vec2 q=vUv*vec2(1774.,887.);float dx=q.x-600.,cut=390.+.00011*dx*dx+.1*dx,front=1.-step(cut,q.y);c*=slice<18.5?front:1.-front;}
    if(slice>20.5&&slice<21.5){vec2 q=vUv*vec2(1536.,1024.);float moon=1.-texture(uHwMatte,vUv).a;vec4 fillColor=texture(uTex,uTextureRect.xy+vec2(max(.01,vUv.x-.2),.46)*uTextureRect.zw);vec3 orange=fillColor.rgb/max(fillColor.a,.001);float bowTop=445.-.08*(q.x-900.),bowBottom=550.+.9*(q.x-850.),envelope=step(bowTop,q.y)*step(q.y,bowBottom);c*=mix(1.,envelope,moon)*smoothstep(910.,918.,q.x);c.rgb=mix(c.rgb,orange*c.a,moon);}
    if(abs(uHwHandSection)>.5){bool left=uHwHandClean<-.5||uHwProp>2.5;vec2 at=left?vec2(229.,755.):vec2(725.,776.),axis=normalize(vec2(left?-.56:.56,.83));float d=dot(p-at,axis)*uHwHandScale,front=step(14.,d);c*=uHwHandSection>0.?front:1.-front;}
    if(uCrownClip>.5&&uCrownClip<1.5){float u=clamp((p.x-uHairContactRange.x)/(uHairContactRange.y-uHairContactRange.x),0.,1.)*31.;int k=min(30,int(floor(u)));float line=mix(uHairContact[k],uHairContact[k+1],u-float(k));float inside=smoothstep(uHairContactRange.x,uHairContactRange.x+3.,p.x)*(1.-smoothstep(uHairContactRange.y-3.,uHairContactRange.y,p.x));c*=1.-inside*(1.-smoothstep(line-3.5,line-2.5,p.y));}
    if(uFinRim>0.)c.rgb*=vec3(.53,.59,.74);
    if(uFinSurface>0.){vec2 axis=uFinAxis.zw;vec2 d=p-uFinAxis.xy;float t=clamp(dot(d,axis)/120.,0.,1.),v=dot(d,vec2(-axis.y,axis.x))/35.;float ridge=exp(-pow((v+.05)*1.8,2.))*sin(t*3.14159);float shade=.06+.20*smoothstep(-.1,.85,v)+.12*abs(uFaceTurn.x)*(1.-ridge)+.14*abs(uFinFold)*smoothstep(-.2,.6,v);c.rgb*=1.-shade;c.rgb+=vec3(.040,.065,.10)*ridge*c.a;}
    if(uHairVolumeShade>0.){float yaw=uFaceTurn.x,farSide=smoothstep(-.18,.92,(p.x-465.)/190.*sign(yaw));c.rgb*=1.-abs(yaw)*farSide*.085;}
    outColor = c * uAlpha;
  }`, d = l.replace("out vec2 vUv;", "in float aHeadWeight; out float vHeadWeight; out vec2 vScreen; out vec2 vUv;").replace("vUv = aUv;", "vHeadWeight = aHeadWeight; vScreen = vec2((aPos.x * uScale.x + uOffset.x + 1.0) * 0.5, (1.0 - aPos.y * uScale.y - uOffset.y) * 0.5); vUv = aUv;"), v = h.replace("uniform sampler2D uTex;", `uniform sampler2D uTex;
    uniform sampler2D uNormal; in float vHeadWeight; in vec2 vScreen;
    uniform mat3 uHeadRotation; uniform vec3 uLight; uniform vec3 uLightColor; uniform vec3 uAmbientColor;
    uniform vec4 uLighting; uniform vec4 uSurface; uniform float uAspect; uniform int uCel;`).replace("outColor = c * uAlpha;", `
      // RG hold the smooth surface normal, BA the painting's relief (see lighting/normals.ts).
      vec4 encoded = texture(uNormal, uTextureRect.xy + vUv * uTextureRect.zw);
      vec2 base = encoded.rg * 2.0 - 1.0;
      vec3 n = vec3(base, sqrt(max(0.0, 1.0 - dot(base, base))));
      n = normalize(n + vec3((encoded.ba * 2.0 - 1.0) * uSurface.w * ${La.toFixed(3)}, 0.0));
      n = normalize(mix(n, uHeadRotation * n, vHeadWeight));
      vec2 toLight = (uLight.xy - vScreen) * vec2(uAspect, 1.0);
      vec3 light = normalize(vec3(toLight, uLight.z));
      float ndl = dot(n, light);
      float diffuse;
      if (uCel == 1) {
        float w = 0.01 + uSurface.x * 0.08;
        diffuse = 0.2 + 0.45 * smoothstep(${kt.toFixed(3)} - w, ${kt.toFixed(3)} + w, ndl) + 0.35 * smoothstep(0.55 - w, 0.55 + w, ndl);
      } else {
        float s = 0.05 + uSurface.x * 0.5;
        diffuse = smoothstep(${kt.toFixed(3)} - s, ${kt.toFixed(3)} + s, ndl) * (0.35 + 0.65 * max(0.0, ndl));
      }
      float reach = dot(toLight, toLight) / (uLighting.w * uLighting.w);
      float attenuation = 1.0 / (1.0 + reach);
      vec3 radiance = uLightColor * uLighting.y * attenuation;
      // A light close to the surface may brighten a little, but must not bleach painted colours.
      vec3 irradiance = min(uAmbientColor * uLighting.z + radiance * diffuse, vec3(${Ba.toFixed(3)}));
      // Painted shadows are deeper versions of the base colour, not grey: multiply by the colour
      // itself as the surface turns away from the light.
      vec3 albedo = c.rgb / max(c.a, 1e-4);
      float dark = 1.0 - clamp(dot(irradiance, vec3(0.3333)), 0.0, 1.0);
      vec3 shaded = c.rgb * mix(vec3(1.0), albedo, dark * ${Ca.toFixed(3)}) * irradiance;
      float specular = pow(max(dot(n, normalize(light + vec3(0.0, 0.0, 1.0))), 0.0), 60.0) * uSurface.y;
      if (uCel == 1) specular = smoothstep(0.3, 0.35, specular) * uSurface.y;
      vec2 side = length(n.xy) > 0.001 ? normalize(n.xy) : vec2(0.0);
      float rim = pow(1.0 - max(n.z, 0.0), 4.0) * smoothstep(-0.2, 0.7, dot(side, normalize(toLight + vec2(1e-4)))) * uSurface.z;
      shaded += radiance * (specular * max(0.0, ndl) + rim) * c.a;
      // Strength blends between the original painting and the relit result; alpha is unchanged.
      c.rgb = clamp(mix(c.rgb, shaded, uLighting.x), vec3(0.0), vec3(c.a));
      outColor = c * uAlpha;`), p = `#version 300 es
  in vec2 aPos; uniform vec2 uScale; uniform vec2 uOffset;
  void main() { gl_Position = vec4(aPos * uScale + uOffset, 0.0, 1.0); gl_PointSize = 7.0; }`, c = `#version 300 es
  precision mediump float; uniform vec4 uColor; out vec4 o; void main() { o = uColor; }`;
  function f(y, m, r) {
    const s = y.createProgram();
    for (const [E, M] of [[y.VERTEX_SHADER, m], [y.FRAGMENT_SHADER, r]]) {
      const k = y.createShader(E);
      if (y.shaderSource(k, M), y.compileShader(k), !y.getShaderParameter(k, y.COMPILE_STATUS)) throw new Error(y.getShaderInfoLog(k));
      y.attachShader(s, k), y.deleteShader(k);
    }
    if (y.bindAttribLocation(s, 0, "aPos"), y.bindAttribLocation(s, 1, "aUv"), y.bindAttribLocation(s, 2, "aHeadWeight"), y.linkProgram(s), !y.getProgramParameter(s, y.LINK_STATUS)) throw new Error(y.getProgramInfoLog(s));
    const x = {}, g = y.getProgramParameter(s, y.ACTIVE_UNIFORMS);
    for (let E = 0; E < g; E++) {
      const M = y.getActiveUniform(s, E).name.replace("[0]", "");
      x[M] = y.getUniformLocation(s, M);
    }
    return { prog: s, u: x };
  }
  function w(y, m, r, s) {
    const x = [y];
    let g = y;
    for (; g < y + m - 0.5; ) {
      const E = s && g >= s.from && g < s.to ? s.cell : r;
      g = Math.min(y + m, g + E), x.push(g);
    }
    return x;
  }
  function A(y, m, r, s, x = null) {
    const [g, E, M, k] = y, Y = w(g, M, m, x && { from: x.x0, to: x.x1, cell: x.cell }), X = w(E, k, m, x && { from: x.y0, to: x.y1, cell: x.cell }), F = Y.length - 1, U = X.length - 1, B = (F + 1) * (U + 1), Z = new Float32Array(B * 2), q = new Float32Array(B * 2);
    for (let H = 0; H <= U; H++) for (let N = 0; N <= F; N++) {
      const $ = H * (F + 1) + N;
      Z[$ * 2] = Y[N], Z[$ * 2 + 1] = X[H], q[$ * 2] = (Y[N] - g) / M, q[$ * 2 + 1] = (X[H] - E) / k;
    }
    const j = [], D = [], G = r.length / s, P = s === 1 ? 0 : 1;
    for (let H = 0; H < U; H++) for (let N = 0; N < F; N++) {
      const $ = Math.floor((Y[N] - g) * (s / M)) * P - 2, ne = Math.ceil((Y[N + 1] - g) * (s / M)) * P + 2, ue = Math.floor((X[H] - E) * (G / k)) * P - 2, te = Math.ceil((X[H + 1] - E) * (G / k)) * P + 2;
      let ie = !1;
      for (let ve = Math.max(0, ue); ve < Math.min(G, te) && !ie; ve += 1)
        for (let Ae = Math.max(0, $); Ae < Math.min(s, ne); Ae += 1)
          if (r[ve * s + Ae] > 3) {
            ie = !0;
            break;
          }
      if (!ie) continue;
      const ae = H * (F + 1) + N, se = ae + 1, le = ae + F + 1, be = le + 1;
      j.push(ae, se, le, se, be, le), D.push(ae, se, ae, le, se, le), N === F - 1 && D.push(se, be), H === U - 1 && D.push(le, be);
    }
    const ce = [...new Set(j)].sort((H, N) => H - N), re = new Map(ce.map((H, N) => [H, N])), I = new Float32Array(ce.flatMap((H) => [Z[H * 2], Z[H * 2 + 1]])), Q = new Float32Array(ce.flatMap((H) => [q[H * 2], q[H * 2 + 1]]));
    return { rect: y, cols: F, rows: U, rest: I, uv: Q, pos: new Float32Array(I), tris: new Uint32Array(j.map((H) => re.get(H))), lines: new Uint32Array(D.map((H) => re.get(H))), sourceVertexCount: Z.length / 2 };
  }
  class u {
    // padTop / padSide: margin around the image, as a share of its height / width. A negative
    // padTop pushes the top of the image above the canvas (hides a cut-off top edge).
    constructor(m, { padTop: r = 0, padSide: s = 0, fit: x = "contain" } = {}) {
      this.pad = { top: r, side: s }, this.fit = x;
      const g = m.getContext("webgl2", { premultipliedAlpha: !0, antialias: !0, alpha: !0, preserveDrawingBuffer: !0 });
      if (!g) throw new Error("WebGL2 is not available");
      this.gl = g, this.canvas = m, this.main = f(g, l, h), this.line = f(g, p, c), this.layers = [], this.expressionShadeLevel = 0, this.lighting = tt, this.lightingStats = { normalMs: 0, computedLayers: 0, cachedLayers: 0 }, g.enable(g.BLEND), g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA);
    }
    texture(m) {
      const r = this.gl, s = r.createTexture();
      return r.bindTexture(r.TEXTURE_2D, s), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, m), r.generateMipmap(r.TEXTURE_2D), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR_MIPMAP_LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE), s;
    }
    addLayer(m, r, s, x = {}) {
      const g = this.gl, E = g.createVertexArray();
      g.bindVertexArray(E);
      const M = g.createBuffer();
      g.bindBuffer(g.ARRAY_BUFFER, M), g.bufferData(g.ARRAY_BUFFER, s.pos, g.DYNAMIC_DRAW);
      for (const B of [this.main, this.line]) {
        const Z = g.getAttribLocation(B.prog, "aPos");
        g.enableVertexAttribArray(Z), g.vertexAttribPointer(Z, 2, g.FLOAT, !1, 0, 0);
      }
      const k = g.createBuffer();
      g.bindBuffer(g.ARRAY_BUFFER, k), g.bufferData(g.ARRAY_BUFFER, s.uv, g.STATIC_DRAW);
      const Y = g.getAttribLocation(this.main.prog, "aUv");
      g.enableVertexAttribArray(Y), g.vertexAttribPointer(Y, 2, g.FLOAT, !1, 0, 0);
      const X = g.createBuffer();
      g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, X), g.bufferData(g.ELEMENT_ARRAY_BUFFER, s.tris, g.STATIC_DRAW), g.bindVertexArray(null);
      const F = g.createBuffer();
      g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, F), g.bufferData(g.ELEMENT_ARRAY_BUFFER, s.lines, g.STATIC_DRAW);
      const U = { name: m, image: r, mesh: s, tex: this.texture(r), vao: E, posBuf: M, uvBuf: k, triBuf: X, lineBuf: F, visible: !0, face: !!x.face, eyeBall: x.eyeBall, splitEye: x.splitEye, fixedEye: x.fixedEye, eyeWindows: x.eyeWindows?.map((B) => ({ tex: this.texture(B.image), rect: B.rect })), color: x.color || [1, 1, 1, 1] };
      return U.faceOverlay = !!x.faceOverlay, this.layers.push(U), U;
    }
    destroy() {
      const m = this.gl;
      for (const r of this.layers) {
        m.deleteTexture(r.tex);if(r.sourceMatteTex)m.deleteTexture(r.sourceMatteTex);
        for (const s of r.eyeWindows ?? []) m.deleteTexture(s.tex);
        r.normal && m.deleteTexture(r.normal), r.headBuf && m.deleteBuffer(r.headBuf), m.deleteVertexArray(r.vao);
        for (const s of [r.posBuf, r.uvBuf, r.triBuf, r.lineBuf]) m.deleteBuffer(s);
      }
      m.deleteProgram(this.main.prog), m.deleteProgram(this.line.prog), this.lit && m.deleteProgram(this.lit.prog), this.shadow?.destroy(), this.layers.length = 0;
    }
    setLighting(m) {
      if (this.lighting = Fa({ ...tt, ...m }) ?? tt, !this.lighting.enabled) return;
      const r = this.gl;
      this.lit || (this.lit = f(r, d, v));
      for (const s of this.layers) {
        if (s.normal || s.overlay) continue;
        const x = _a(s.image, s.mesh.rect, e, !/^(eye|mouth)/.test(s.name));
        this.lightingStats.normalMs += x.ms, this.lightingStats[x.computed ? "computedLayers" : "cachedLayers"]++, s.normal = r.createTexture(), r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, s.normal), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, x.width, x.height, 0, r.RGBA, r.UNSIGNED_BYTE, x.data), r.generateMipmap(r.TEXTURE_2D), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR_MIPMAP_LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE);
        const g = new Float32Array(s.mesh.rest.length / 2);
        for (let E = 0; E < g.length; E++) g[E] = t.headWeight(s.mesh.rest[E * 2], s.mesh.rest[E * 2 + 1]);
        s.headBuf = r.createBuffer(), r.bindVertexArray(s.vao), r.bindBuffer(r.ARRAY_BUFFER, s.headBuf), r.bufferData(r.ARRAY_BUFFER, g, r.STATIC_DRAW), r.enableVertexAttribArray(2), r.vertexAttribPointer(2, 1, r.FLOAT, !1, 0, 0);
      }
      r.bindVertexArray(null), this.lighting.shadow && !this.shadow && (this.shadow = new Ua(r, f));
    }
    resize() {
      const m = this.canvas, r = Math.min(window.devicePixelRatio || 1, 2), s = Math.round(m.clientWidth * r), x = Math.round(m.clientHeight * r);
      (m.width !== s || m.height !== x) && (m.width = s, m.height = x);
      const g = (this.fit === "cover" ? Math.max : Math.min)(s / (n.w * (1 + 2 * this.pad.side)), x / (n.h * (1 + this.pad.top))), E = (s - n.w * g) / 2, M = (x - n.h * g) / (this.fit === "cover" ? 2 : 1);
      this.scale = [2 * g / s, -2 * g / x], this.offset = [-1 + 2 * E / s, 1 - 2 * M / x], this.pxScale = g, this.pxOff = [E, M];
    }
    draw(m) {
      const r = this.gl;
      this.hwReviewGroup=m.hwReviewGroup??"all",this.hwLanternLight=m.hwLanternLight??.5,this.eyeDetails = m.eyeDetails, this.finMotion = m.finMotion, this.resize(), r.viewport(0, 0, this.canvas.width, this.canvas.height), r.clearColor(0, 0, 0, 0), r.clear(r.COLOR_BUFFER_BIT);
      const s = this.lighting.enabled, x = s && this.lighting.shadow;
      x && this.shadow.begin(this.canvas.width, this.canvas.height);
      const g = s ? this.lit : this.main;
      if (this.current = g, r.useProgram(g.prog), s) {
        const M = this.lighting;
        r.uniform1i(g.u.uNormal, 1), r.uniform3f(g.u.uLight, M.x, M.y, M.z), r.uniform3f(g.u.uLightColor, (M.color >> 16 & 255) / 255, (M.color >> 8 & 255) / 255, (M.color & 255) / 255), r.uniform3f(g.u.uAmbientColor, (M.ambientColor >> 16 & 255) / 255, (M.ambientColor >> 8 & 255) / 255, (M.ambientColor & 255) / 255), r.uniform4f(g.u.uLighting, M.strength, M.intensity, M.ambient, M.reach), r.uniform4f(g.u.uSurface, M.softness, M.specular, M.rim, M.detail), r.uniform1f(g.u.uAspect, this.canvas.width / this.canvas.height), r.uniform1i(g.u.uCel, M.mode === "cel" ? 1 : 0), r.uniformMatrix3fv(g.u.uHeadRotation, !1, Ya(m.angleX ?? 0, m.angleY ?? 0, m.angleZ ?? 0, e.head.maxRoll));
      }
      r.uniform2fv(g.u.uScale, this.scale), r.uniform2fv(g.u.uOffset, this.offset), r.uniform1i(g.u.uTex, 0), r.uniform4fv(g.u.uEyeBox, a.flatMap((M) => [M.x0, M.x1, 0, 0])), r.uniform1fv(g.u.uEyeTop, a.flatMap((M) => M.top)), r.uniform1fv(g.u.uEyeBot, a.flatMap((M) => M.bot)), r.uniform4fv(g.u.uEyeState, m.eyes), r.uniform2fv(g.u.uEyeBounce, m.eyeBounce ?? [0, 0]), r.uniform2fv(g.u.uEyeInertia, m.eyeInertia ?? [0, 0, 0, 0]), r.uniform4f(g.u.uMouth, o.cx, o.cy, o.angle, o.halfLen), r.uniform4f(g.u.uMouthState, m.mouthOpen, m.mouthForm, o.bow, 0), r.uniform4f(g.u.uCheeks, i[0][0], i[0][1], i[1][0], i[1][1]), r.uniform1f(g.u.uCheek, m.cheek), r.uniform4f(
        g.u.uFaceTurn,
        (m.angleX ?? 0) / 30,
        e.layered?.faceTurn?.shadow ?? 0,
        e.layered?.center[0] ?? e.head.cx,
        Math.abs(a[1].x1 - a[0].x0) * 0.7
      );
      const E = e.layered?.faceShade;
      this.expressionShadeLevel = E ? Math.min(1, Math.max(0, m.faceShade ?? 0)) : 0, r.uniform3f(
        g.u.uExpressionShade,
        E?.band[0] ?? 0,
        E?.band[1] ?? 1,
        E ? this.expressionShadeLevel * E.strength : 0
      ), r.uniform3fv(g.u.uExpressionShadeColor, E?.color ?? [1, 1, 1]), r.activeTexture(r.TEXTURE0);
      for (const M of this.layers)
        !M.visible || M.overlay || M.faceOverlay || this.drawLayer(M, M.alpha ?? 1);
      for (const M of this.layers) M.visible && M.faceOverlay && this.drawLayer(M, M.alpha ?? 1);
      if (this.original && m.originalAlpha > 0 && this.drawLayer(this.original, m.originalAlpha), x && this.shadow.composite(this.lighting), m.showMesh) {
        const M = this.line;
        r.useProgram(M.prog), r.uniform2fv(M.u.uScale, this.scale), r.uniform2fv(M.u.uOffset, this.offset);
        for (const k of this.layers)
          !k.visible || k.overlay || (r.bindVertexArray(k.vao), r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, k.lineBuf), r.uniform4fv(M.u.uColor, k.color), r.drawElements(r.LINES, k.mesh.lines.length, r.UNSIGNED_INT, 0), r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, k.triBuf));
        m.joints?.length && this.drawPoints(m.joints), r.bindVertexArray(null);
      }
    }
    drawLayer(m, r) {
      if(!reviewLayerVisible(this.hwReviewGroup,m.name,e.layered?.parts.find(q=>q.name===m.name)))return;
      const s = this.gl, x = this.current;
      s.useProgram(x.prog), s.bindVertexArray(m.vao), s.bindBuffer(s.ARRAY_BUFFER, m.posBuf), s.bufferSubData(s.ARRAY_BUFFER, 0, m.mesh.pos), this.lighting.enabled && (s.activeTexture(s.TEXTURE1), s.bindTexture(s.TEXTURE_2D, m.normal), s.activeTexture(s.TEXTURE0)), s.bindTexture(s.TEXTURE_2D, m.tex);
      const g = m.eyeWindows?.[m.eyeWindowIndex ?? 0];
      s.uniform1i(x.u.uUseEyeClip, g ? 1 : 0), s.uniform1f(x.u.uEyeCover, m.splitEye !== void 0 && !m.fixedEye ? e.layered?.faceProjection?.eye.irisCover ?? 0 : 0);
      const E = m.name.replace(/^eye[01]_/, "");
      s.uniform1f(x.u.uEyeElasticGain, e.layered?.eyeSpring?.components?.[E] ?? 0), g && (s.activeTexture(s.TEXTURE2), s.bindTexture(s.TEXTURE_2D, g.tex), s.uniform1i(x.u.uEyeClip, 2), s.uniform4fv(x.u.uEyeClipRect, g.rect), s.activeTexture(s.TEXTURE0)), s.uniform4fv(x.u.uRect, m.mesh.rect), s.uniform4fv(x.u.uTextureRect, m.textureRect ?? [0, 0, 1, 1]), s.uniform1i(x.u.uFace, m.splitEye !== void 0 ? (m.fixedEye ? 4 : 6) + m.splitEye : m.eyeBall !== void 0 ? 2 + m.eyeBall : m.face ? 1 : 0), s.uniform1f(x.u.uExpressionSkinClear, e.layered?.faceShade?.skinCutoutLayers?.includes(m.name) ? Math.min(1, Math.max(0, this.expressionShadeLevel ?? 0)) : 0);
      const M = e.layered?.parts.find((q) => q.name === m.name);
      s.uniform1f(x.u.uBowPart, M?.bowCut ?? 0), s.uniform1f(x.u.uSashSide, M?.sashSurface ?? 0), s.uniform1f(x.u.uLegRepair, M?.legRepair ?? 0), s.uniform1f(x.u.uShinClear, M?.shinClear ? 1 : 0);
      const k = e.layered?.parts.find((q) => q.name === m.name)?.finVolume, Y = e.layered?.headBandFit?.target, X = (q, j) => {
        let D = 0;
        for (; D < q.length - 2 && q[D + 1][0] < j; ) D++;
        const G = q[D], P = q[D + 1], ce = Math.max(0, Math.min(1, (j - G[0]) / (P[0] - G[0])));
        return G[1] + (P[1] - G[1]) * ce;
      };
      s.uniform4fv(x.u.uHwSlice,M?.halloween?.split??[0,0,0,0]);
      s.uniform4fv(x.u.uHwSplitAxis,M?.halloween?.splitAxis??[0,0,1,0]);
      s.uniform4fv(x.u.uHwSourceClip,M?.halloween?.sourceClip??[0,0,0,0]);
      s.uniform1f(x.u.uHwClean,M?.halloween?.skinUnderlay?-1:m.name==='part_crown'?.45:M?.halloween?(m.name==='hw_hatAhoge'?.75:.35):0);
      s.uniform1f(x.u.uHwSleeveTrim,m.name==="hw_sleeveL"?-1:m.name==="hw_sleeveR"?1:0);
      s.uniform1f(x.u.uHwLampLight,this.hwLanternLight);
      s.uniform1f(x.u.uHwProp,m.name==="hw_lanternFrame"?1:m.name==="hw_lanternGhost"?2:M?.halloween?.attachment==="hand"?3:0);
      s.uniform1f(x.u.uHwHandSection,(M?.handSection??M?.halloween?.handSection)==="palm"?1:(M?.handSection??M?.halloween?.handSection)==="wrist"?-1:0);
      s.uniform1f(x.u.uHwHasMatte,m.sourceMatteTex?1:0);if(m.sourceMatteTex){s.activeTexture(s.TEXTURE7);s.bindTexture(s.TEXTURE_2D,m.sourceMatteTex);s.uniform1i(x.u.uHwMatte,7);s.activeTexture(s.TEXTURE0);}
      s.uniform1f(x.u.uHwHandScale,M?.halloween?.handScale??1);
      s.uniform1f(x.u.uHwHandClean,m.name.startsWith("part_hand_l")?-1:m.name.startsWith("part_hand_r")?1:0);
      s.uniform1f(x.u.uHwHairRoof,M?.kind==='hair'&&M?.stage==='back'?1:0);
      s.uniform1f(x.u.uHwHatSplit,m.name==="hw_hatCrown"?-1:m.name==="hw_hatBand"?1:0);
      s.uniform1f(x.u.uFrontSeal, m.name === "part_band_contact_seal" ? 1 : 0), s.uniform3fv(x.u.uFrontSealColor, e.layered?.frontSealColor ?? [0.27, 0.39, 0.65]), s.uniform3fv(x.u.uRearHairTint, m.name === "part_rear_head" ? e.layered?.rearHeadTint ?? [1, 1, 1] : [1, 1, 1]), s.uniform1f(x.u.uCrownClip, 0), s.uniform2fv(x.u.uHairContactRange, Y ? [Y[0][0], Y.at(-1)[0]] : [0, 1]), this.hairContactUniform || (this.hairContactUniform = Y ? Array.from({ length: 32 }, (q, j) => X(Y, Y[0][0] + (Y.at(-1)[0] - Y[0][0]) * j / 31)) : Array(32).fill(-1e3)), s.uniform1fv(x.u.uHairContact, this.hairContactUniform), s.uniform1f(x.u.uFinFold, k ? this.finMotion?.[m.name.replace(/_rim$/, "")]?.fold ?? 0 : 0), s.uniform1f(x.u.uFinRim, m.name.endsWith("_rim") && k ? 1 : 0), s.uniform1f(x.u.uFinSurface, k && !m.name.endsWith("_rim") ? 1 : 0);
      const F = k ? [k.tip[0] - k.root[0], k.tip[1] - k.root[1]] : [1, 0], U = Math.hypot(...F);
      s.uniform4fv(x.u.uFinAxis, k ? [...k.root, F[0] / U, F[1] / U] : [0, 0, 1, 0]), s.uniform1f(x.u.uHairVolumeShade, ["part_rear_head", "part_band_contact_seal", "part_crown", "part_bang_l", "part_bang_c", "part_bang_r"].includes(m.name) ? 1 : 0);
      const B = e.layered?.eyeDetails?.flowIris?.[m.splitEye];
      s.uniform1f(x.u.uIrisFlow, E === "iris" && B ? this.eyeDetails?.[m.splitEye]?.flowVisible ?? 1 : 0), s.uniform4fv(x.u.uFlowIris, B ? [...B.center, ...B.radii] : [0, 0, 1, 1]), s.uniform3fv(x.u.uFlowPhase, this.eyeDetails?.[m.splitEye]?.flow ?? [0, 0, 0]);
      const Z = this.eyeDetails?.[m.splitEye];
      s.uniform2fv(x.u.uDetailShift, E === "highlight" ? Z?.highlight ?? [0, 0] : E === "highlight_low" ? Z?.highlightLow ?? [0, 0] : [0, 0]), s.uniform2fv(x.u.uPupilDetailCenter, e.layered?.eyeDetails?.pupilCenters?.[m.splitEye] ?? [0, 0]), s.uniform1f(x.u.uPupilDetailScale, E === "pupil" ? Z?.pupilScale ?? 1 : 1), s.uniform1f(x.u.uNormalClosedEye, /^eye[01]_closed_normal$/.test(m.name) ? Number(m.name[3]) : -1), s.uniform1f(x.u.uWaveFrillFront, m.name === "part_wave_frill_l" ? 1 : 0), s.uniform1f(x.u.uHoodUnderfill, m.name === "part_hood_hair_underfill" ? 1 : 0), s.uniform1f(x.u.uClosedDrawing, /^eyes_closed_[01]$/.test(m.name) ? 1 : 0), s.uniform1f(x.u.uNativeForearm, m.name === "part_forearm_l" ? 1 : 0), s.uniform2fv(x.u.uClosedLash, /^eye[01]_lash$/.test(m.name) ? [Number(m.name[3]), m.blinkOpen ?? 1] : [-1, 1]), s.uniform1f(x.u.uEyeSkinClean, /^eye[01]_(lash|low|crease)$/.test(m.name) ? Math.min(1, Math.max(0, (1 - (m.blinkOpen ?? 1)) / 0.25)) : 0), s.uniform1f(x.u.uAuthoredArmPart, m.name.startsWith("part_authored_wave_") ? Number(m.name.at(-1)) : -1), s.uniform3fv(x.u.uLidDrawingTint, /^eyes_(half|closed)_[01]$/.test(m.name) ? e.layered?.controlRoomEyes?.lidTint ?? [1, 1, 1] : [1, 1, 1]), s.uniform1f(x.u.uAlpha, r), s.drawElements(s.TRIANGLES, m.mesh.tris.length, s.UNSIGNED_INT, 0);
    }
    drawPoints(m) {
      const r = this.gl, s = this.line;
      if (!this.pointBuf) {
        this.pointBuf = r.createBuffer(), this.pointVao = r.createVertexArray(), r.bindVertexArray(this.pointVao), r.bindBuffer(r.ARRAY_BUFFER, this.pointBuf);
        const x = r.getAttribLocation(s.prog, "aPos");
        r.enableVertexAttribArray(x), r.vertexAttribPointer(x, 2, r.FLOAT, !1, 0, 0);
      }
      r.bindVertexArray(this.pointVao), r.bindBuffer(r.ARRAY_BUFFER, this.pointBuf), r.bufferData(r.ARRAY_BUFFER, new Float32Array(m.flat()), r.DYNAMIC_DRAW), r.uniform4f(s.u.uColor, 1, 0.85, 0.2, 1), r.drawArrays(r.POINTS, 0, m.length);
    }
    // canvas CSS px -> source image px
    toImage(m, r) {
      if (!this.pxOff) return null;
      const s = this.canvas.width / this.canvas.clientWidth;
      return [(m * s - this.pxOff[0]) / this.pxScale, (r * s - this.pxOff[1]) / this.pxScale];
    }
  }
  return { Renderer: u, buildGrid: A };
}
const qe = (t, e, n) => Math.max(e, Math.min(n, t)), et = [{ hz: 0.8, damping: 0.48, delay: 0.2, kick: 1.12, follow: 0.032, sign: 1 }, { hz: 0.64, damping: 0.5, delay: 0.32, kick: 1.24, follow: 0.039, sign: -1 }, { hz: 0.5, damping: 0.52, delay: 0.46, kick: 1.32, follow: 0.046, sign: 1 }], jt = () => ({ last: null, speed: [0, 0], open: 1, armed: !1, main: { p: [0, 0], v: [0, 0] }, low: { p: [0, 0], v: [0, 0] }, pupil: 0, pupilV: 0, pending: [], pulse: !1, pupilPulse: !1, flowPulse: !1, flow: et.map(() => ({ p: 0, v: 0, pending: [] })) }), Rn = (t, e) => {
  const n = Math.hypot(...t);
  if (n > e) for (let a = 0; a < 2; a++) t[a] *= e / n;
};
function $a() {
  let t = [jt(), jt()], e = 0;
  return (n, a, o = 1) => {
    const i = qe(a, 0, 0.06), l = a <= 0 || a > 0.12 || o <= 0;
    return e += i, t.map((h, d) => {
      const v = d === 0 ? n.eyeROpen : n.eyeLOpen, p = [(n.gazeX ?? 0) * 5 + (n.angleX ?? 0) * 0.045, -(n.gazeY ?? 0) * 2 + (n.angleY ?? 0) * 0.025], c = (n.eyeHighlightPulse ?? 0) > 0.5, f = (n.eyePupilPulse ?? 0) > 0.5, w = (n.eyeFlowPulse ?? 0) > 0.5;
      if (l || !h.last)
        return h = jt(), h.last = p, h.open = v, h.pulse = c, h.pupilPulse = f, h.flowPulse = w, t[d] = h, { highlight: [0, 0], highlightLow: [0, 0], pupilScale: 1, flow: [0, 0, 0], flowVisible: n.eyeFlowVisible ?? 1 };
      const A = p.map((M, k) => qe((M - h.last[k]) / i, -90, 90)), u = 1 - Math.exp(-i * 16);
      h.speed = h.speed.map((M, k) => M + (A[k] - M) * u), v < 0.2 && (h.armed = !0);
      const y = h.armed && v > 0.6;
      y && (h.armed = !1);
      const m = 2 * Math.PI * 3, r = 2 * Math.PI * 1.75, s = 2 * Math.PI * 2.3;
      if ((y || c && !h.pulse) && (h.main.v[1] -= m * 5.8, h.main.v[0] += (d === 0 ? -1 : 1) * m * 0.25, h.pending.push(e + 0.12)), (y || f && !h.pupilPulse) && (h.pupilV += s * (f ? 0.4 : 0.33)), y || c && !h.pulse || w && !h.flowPulse) for (let M = 0; M < 3; M++) h.flow[M].pending.push(e + et[M].delay);
      h.pending[0] <= e && (h.pending.shift(), h.low.v[1] -= r * 7, h.low.v[0] += (d === 0 ? 1 : -1) * r * 0.35);
      for (let M = 0; M < 3; M++) h.flow[M].pending[0] <= e && (h.flow[M].pending.shift(), h.flow[M].v += 2 * Math.PI * et[M].hz * et[M].kick * et[M].sign);
      const x = Math.max(1, Math.ceil(i * 240)), g = i / x;
      for (let M = 0; M < x; M++) {
        for (const [k, Y, X, F] of [[h.main, m, 0.55, 0.09], [h.low, r, 0.58, 0.13]]) for (let U = 0; U < 2; U++) {
          const B = qe(-h.speed[U] * F, -2.1, 2.1);
          k.v[U] += (-Y * Y * (k.p[U] - B) - 2 * X * Y * k.v[U]) * g, k.p[U] += k.v[U] * g;
        }
        h.pupilV += (-s * s * h.pupil - 2 * 0.62 * s * h.pupilV) * g, h.pupil += h.pupilV * g;
        for (let k = 0; k < 3; k++) {
          const Y = h.flow[k], X = et[k], F = 2 * Math.PI * X.hz, U = qe((-h.speed[0] + h.speed[1] * X.sign * 0.6) * X.follow, -0.6, 0.6);
          Y.v += (-F * F * (Y.p - U) - 2 * X.damping * F * Y.v) * g, Y.p += Y.v * g;
        }
      }
      Rn(h.main.p, 3.2), Rn(h.low.p, 4), h.last = p, h.open = v, h.pulse = c, h.pupilPulse = f, h.flowPulse = w;
      const E = qe(o, 0, 1.5);
      return { highlight: h.main.p.map((M) => M * E), highlightLow: h.low.p.map((M) => M * E), pupilScale: 1 + qe(h.pupil * E, 0, 0.18), flow: h.flow.map((M) => qe(M.p * E, -0.9, 0.9)), flowVisible: n.eyeFlowVisible ?? 1 };
    });
  };
}
function Xa(t) {
  const e = [0, 1].map(() => ({ p: [0, 0], v: [0, 0], anchor: null, speed: [0, 0], open: 1, armed: !1 }));
  return (n, a, o, i = 1) => {
    if (!t) return;
    const l = 2 * Math.PI * t.frequency, h = t.reopenOnly && o > 0.12 ? 0 : Math.min(t.reopenOnly ? 0.12 : 0.05, Math.max(0, o)), d = Math.max(1, Math.ceil(h * 240)), v = h / d;
    return e.map((p, c) => {
      const f = n[c], w = a[c];
      if (!p.anchor || h === 0 || i === 0)
        return p.p = [0, 0], p.v = [0, 0], p.speed = [0, 0], p.anchor = [...f], p.open = w, p.armed = !1, [0, 0];
      const A = f.map((m, r) => (m - p.anchor[r]) / h), u = A.map((m, r) => Math.min(2500, Math.max(-2500, (m - p.speed[r]) / h)));
      t.reopenOnly ? (w < 0.25 && (p.armed = !0), p.armed && w > 0.65 && (p.v[1] += t.blinkKick * l, p.armed = !1)) : p.v[1] += (w - p.open) * t.blinkKick * l;
      for (let m = 0; m < d; m++) for (let r = 0; r < 2; r++)
        p.v[r] += (-l * l * p.p[r] - 2 * t.damping * l * p.v[r] - u[r] * t.inertia) * v, p.p[r] += p.v[r] * v;
      const y = Math.hypot(...p.p);
      return y > t.max && (p.p = p.p.map((m) => m * t.max / y), p.v = p.v.map((m) => m * 0.5)), p.anchor = [...f], p.speed = A, p.open = w, p.p.map((m) => m * Math.min(1, i));
    });
  };
}
const Na = (t, e, n) => Math.max(e, Math.min(n, t)), $t = (t, e) => e * Math.tanh(t / e), za = {
  foot_l: { frequency: 0.92, damping: 0.48, limit: [12, 7, 0.025], gain: 1, phase: 0.3, drive: [0.09, 0.06, 18e-4] },
  foot_r: { frequency: 1.13, damping: 0.56, limit: [11, 8, 0.023], gain: 1, phase: 2.1, drive: [0.078, 0.075, 16e-4] },
  bow_wing_l: { frequency: 2.2, damping: 0.58, limit: [1.1, 0.8, 0.018], gain: 1, phase: 0.5, drive: [9e-3, 8e-3, 6e-4] },
  bow_wing_r: { frequency: 2.05, damping: 0.61, limit: [1.2, 0.7, 0.016], gain: 1, phase: 1.8, drive: [0.01, 7e-3, 7e-4] },
  bow_tail_l: { frequency: 1.35, damping: 0.4, limit: [2.6, 2, 0.035], gain: 3, phase: 1.1, drive: [0.025, 0.025, 11e-4] },
  bow_tail_r: { frequency: 1.55, damping: 0.47, limit: [2.5, 1.8, 0.033], gain: 3, phase: 2.5, drive: [0.023, 0.028, 1e-3] },
  sash_l: { frequency: 0.85, damping: 0.42, limit: [10, 7, 0.06], gain: 1, phase: 0.7, drive: [0.075, 0.055, 15e-4] },
  sash_r: { frequency: 1.06, damping: 0.49, limit: [9, 8, 0.055], gain: 1, phase: 2.3, drive: [0.07, 0.06, 17e-4] }
};
function Da() {
  const t = Object.entries(za).map(([l, h]) => ({ key: l, cfg: h, p: [0, 0, 0], v: [0, 0, 0] }));
  let e = null, n = [0, 0], a = 0, o = 0, i = !1;
  return (l, h, d) => {
    const v = h <= 0 || h > 0.12 || d <= 0 || !i, p = Na(h, 0, 0.08), c = Math.max(1, Math.ceil(p * 240)), f = p / c, w = [(l.bodyAngleX ?? 0) * 2 + (l.angleX ?? 0) * 0.25 + (l.bodyAngleZ ?? 0) * 0.9, (l.angleY ?? 0) * 0.8 + (l.bodyAngleZ ?? 0) * 1.4 + (l.breath ?? 0) * 8];
    if (v)
      n.fill(0), a = 0;
    else {
      const u = 1 - Math.exp(-p * 14);
      n = w.map((y, m) => n[m] + ($t((y - e[m]) / Math.max(p, 1e-3), 180) - n[m]) * u), a += (Math.min(1, d) - a) * (1 - Math.exp(-p / 0.16));
    }
    const A = {};
    for (const u of t) {
      const { cfg: y, key: m } = u;
      v && (u.p.fill(0), u.v.fill(0));
      const r = m.startsWith("foot"), s = Math.sin(o * (r ? 1.18 : 1.45) + y.phase), x = m.endsWith("_l") ? -1 : 1, g = [-n[0] * y.drive[0] + s * (r ? 1.3 : 0.22), -n[1] * y.drive[1] + Math.sin(o * 1.47 + y.phase) * (r ? 0.9 : 0.25), -n[0] * y.drive[2] + x * (l.bodyAngleZ ?? 0) * 8e-4];
      for (let E = 0; E < c && !v; E++) for (let M = 0; M < 3; M++) {
        const k = 2 * Math.PI * y.frequency * [1, 0.86, 1.08][M], Y = $t(g[M], y.limit[M]);
        u.v[M] += (-k * k * (u.p[M] - Y) - 2 * y.damping * k * u.v[M]) * f, u.p[M] += u.v[M] * f;
      }
      A[m] = u.p.map((E, M) => $t(E, y.limit[M]) * y.gain * a);
    }
    return e = w, i = d > 0, o += p, A;
  };
}
const Ha = (t, e, n) => Math.max(e, Math.min(n, t)), ct = (t, e) => e * Math.tanh(t / e);
function Pa(t) {
  const e = t.layered.parts.filter((l) => l.finVolume && !l.finRim).map((l) => ({ name: l.name, side: l.finVolume.side, a: [0, 0, 0, 0], v: [0, 0, 0, 0], blink: 0 }));
  let n = null, a = [0, 0, 0], o = 0, i = !1;
  return (l, h, d) => {
    const v = h <= 0 || h > 0.12 || d <= 0 || !i, p = Ha(h, 0, 0.08), c = Math.max(1, Math.ceil(p * 240)), f = p / c, w = [l.angleX ?? 0, l.angleY ?? 0, l.angleZ ?? 0];
    if (v)
      a.fill(0), o = 0;
    else {
      const u = 1 - Math.exp(-p * 18);
      a = w.map((y, m) => a[m] + (ct((y - n[m]) / Math.max(p, 1e-3), 240) - a[m]) * u), o += (Math.min(1, d) - o) * (1 - Math.exp(-p / 0.12));
    }
    const A = {};
    for (const u of e) {
      const y = u.side < 0 ? l.eyeROpen ?? 1 : l.eyeLOpen ?? 1, m = 1 - y;
      v && (u.a.fill(0), u.v.fill(0), u.blink = m);
      const r = Math.max(0, u.blink - m);
      u.blink = m, v || (u.v[0] += u.side * r * 1.2);
      const s = ct(-a[0] * 62e-4 + u.side * a[1] * 8e-3 + w[2] * 0.025 + u.side * m * 0.12, 0.48), x = ct(a[0] * 35e-4 * u.side + a[1] * 4e-3, 0.48);
      for (let g = 0; g < c && !v; g++) for (let E = 0; E < 4; E++) {
        const M = E === 0 ? s : E === 3 ? x : u.a[E - 1], k = 2 * Math.PI * [1.8, 1.22, 0.86, 1.05][E], Y = [0.38, 0.34, 0.32, 0.39][E];
        u.v[E] += (-k * k * (u.a[E] - M) - 2 * Y * k * u.v[E]) * f, u.a[E] += u.v[E] * f;
      }
      A[u.name] = { angles: u.a.slice(0, 3).map((g, E) => ct(g, [0.46, 0.62, 0.78][E]) * o), fold: ct(u.a[3], 0.48) * o, blend: o };
    }
    return n = w, i = d > 0, A;
  };
}
function Wa(t, e, n) {
  const a = e.layered.parts, o = Pa(e), i = Da(), l = (r, s, x) => t.deformPart(...r, t.baseWeights(...r, 0), s, { gain: 0 }, x, [0, 0]), h = () => ({ at: null, speed: [0, 0], acceleration: [0, 0] }), d = n.map((r) => ({
    ...h(),
    cfg: r,
    lag: [0, 0],
    part: a.find((s) => s.name === r.anchorPart) ?? a.find((s) => s.strandNames?.includes(r.name)) ?? { kind: "hair", depth: 1, followBand: e.layered.neckBand },
    p: Array.from({ length: 4 }, () => [0, 0]),
    v: Array.from({ length: 4 }, () => [0, 0])
  })), v = a.filter((r) => r.secondary).map((r) => ({ ...h(), part: r, angle: 0, velocity: 0 }));
  let p = 0, c = 0, f = !1, w = null, A = 0, u = 1;
  const y = (r, s) => s * Math.tanh(r / s);
  function m(r, s, x, g) {
    if (g || !r.at || Math.hypot(s[0] - r.at[0], s[1] - r.at[1]) > 80)
      return r.at = [...s], r.speed = [0, 0], r.acceleration = [0, 0], !0;
    const E = 1 - Math.exp(-x * 18), M = 1 - Math.exp(-x * 12), k = s.map((Y, X) => r.speed[X] + ((Y - r.at[X]) / x - r.speed[X]) * E);
    return r.acceleration = k.map((Y, X) => r.acceleration[X] + (y((Y - r.speed[X]) / x, 3500) - r.acceleration[X]) * M), r.at = [...s], r.speed = k, !1;
  }
  return (r, s, x, g) => {
    const E = x > 0, M = !E || !f || s <= 0 || s > 0.12, k = Math.max(0, Math.min(s, 0.08)), Y = Math.max(1, Math.ceil(k * 240)), X = k / Y;
    M ? c = 0 : c += (Math.min(1, x) - c) * (1 - Math.exp(-k / 0.14));
    const F = [r.angleX, r.angleY, r.angleZ], U = w && !M ? Math.hypot(...F.map((j, D) => (j - w[D]) / Math.max(k, 1e-3))) : 0;
    A = Math.max(U, A * Math.exp(-k / 0.6)), w = F;
    const B = Math.max(0, Math.min(1, (A - 65) / 55)), Z = 1 - 0.5 * B * B * (3 - 2 * B);
    u += (Z - u) * (1 - Math.exp(-k / 0.07));
    const q = -r.angleZ / 30 * e.head.maxRoll - r.bodyAngleZ / 10 * e.body.maxRoll;
    d.forEach((j, D) => {
      const { cfg: G, part: P } = j, ce = G.nodes[0], re = l(ce, r, P), I = m(j, re, Math.max(k, 1e-3), M);
      I && (j.p.forEach((te) => te.fill(0)), j.v.forEach((te) => te.fill(0)), j.lag.fill(0));
      const Q = l([ce[0] + 1, ce[1]], r, P), H = l([ce[0], ce[1] + 1], r, P), N = [Q[0] - re[0], Q[1] - re[1]], $ = [H[0] - re[0], H[1] - re[1]], ne = N[0] * $[1] - $[0] * N[1], ue = Math.abs(ne) < 0.01 ? [0, 0] : [
        ($[1] * j.acceleration[0] - $[0] * j.acceleration[1]) / ne,
        (-N[1] * j.acceleration[0] + N[0] * j.acceleration[1]) / ne
      ];
      if (G.velocityLag && !I && Math.abs(ne) > 0.01) {
        const te = [($[1] * j.speed[0] - $[0] * j.speed[1]) / ne, (-N[1] * j.speed[0] + N[0] * j.speed[1]) / ne], ie = 1 - Math.exp(-k / (G.lagSmoothing ?? 0.14));
        for (let ae = 0; ae < 2; ae++) j.lag[ae] += (-te[ae] * G.velocityLag - j.lag[ae]) * ie;
      }
      if (!I) for (let te = 0; te < Y; te++) for (let ie = 1; ie < 4; ie++) {
        const ae = Math.sqrt([0, 300, 200, 140][ie] * G.k * 1.7), se = Math.sin((p + te * X) * 1.3 + D * 0.35) * G.max * 0.025 * ie / 3;
        for (let le = 0; le < 2; le++) {
          const be = j.p[ie - 1][le] * 0.3 + (le === 0 ? se : 0);
          j.v[ie][le] += (-ae * ae * (j.p[ie][le] - be) - 2 * (G.damping ?? 0.92) * ae * j.v[ie][le] - ue[le] * (G.inertia ?? 0.12) * ie / 3) * X, j.p[ie][le] += j.v[ie][le] * X;
        }
      }
      g.strands[D] = j.p.map((te, ie) => {
        if (ie === 0) return [0, 0];
        const ae = te.map((R, O) => R + j.lag[O] * (ie / 3) ** 1.5), se = Math.hypot(...ae), le = G.max * 0.7 * ie / 3, be = se < 1e-8 ? c : le * Math.tanh(se / le) / se * c, ve = ae.map((R) => R * be * (G.outputGain ?? 1) * (G.velocityLag ? u : 1)), Ae = Math.hypot(...ve), Oe = G.finalLimit;
        if (Oe && Ae > Oe * 0.75) {
          const R = Oe * 0.75 + Oe * 0.25 * Math.tanh((Ae - Oe * 0.75) / (Oe * 0.25));
          return ve.map((O) => O * R / Ae);
        }
        return ve;
      });
    }), v.forEach((j, D) => {
      const { part: G } = j, P = G.secondary, ce = l(G.pivot, r, G), re = m(j, ce, Math.max(k, 1e-3), M);
      re && (j.angle = 0, j.velocity = 0);
      const I = l(P.tip, r, G), Q = I[0] - ce[0], H = I[1] - ce[1], N = -(j.acceleration[0] * -H + j.acceleration[1] * Q) / Math.max(1, Q * Q + H * H) * P.inertia, $ = G.kind === "body" ? -r.bodyAngleZ / 10 * e.body.maxRoll : q, ne = Math.sin(p * 1.3 + D * 1.9) * P.wind, ue = y(-$ * P.tilt + ne, P.angleLimit * 0.65), te = 2 * Math.PI * P.frequency;
      if (!re) for (let ie = 0; ie < Y; ie++)
        j.velocity += (-te * te * (j.angle - ue) - 2 * P.damping * te * j.velocity + N) * X, j.angle += j.velocity * X;
      g.secondary[G.name] = y(j.angle, P.angleLimit) * c;
    }), g.bodyMotion = i(r, s, x), g.finMotion = o(r, s, x), p += k, f = E;
  };
}
function Za(t, e) {
  const { applyHead: n, applyBody: a, TASSELS: o, tasselAnchor: i } = t, l = (e.strands ?? []).map((r) => {
    if (r.nodes.length === 4) return r;
    const s = Array.from({ length: 4 }, (x, g) => {
      const E = g / 3 * (r.nodes.length - 1), M = Math.min(r.nodes.length - 2, Math.floor(E)), k = E - M;
      return [0, 1].map((Y) => r.nodes[M][Y] + (r.nodes[M + 1][Y] - r.nodes[M][Y]) * k);
    });
    return { ...r, nodes: s };
  }), h = [0, 300, 200, 140], d = 0.9, v = 7, p = { stiff: 1.7, damp: 1.6, couple: 0.85, reach: 0.9, bind: 4 }, c = Math.min(6, l.filter((r) => r.name.startsWith("bang")).length), f = { freq: 0.7, zeta: 0.22, hang: 0.85, inertia: 0.32, wind: 0.03, max: 0.55, smooth: 6 }, w = (r, s) => [r[0] * Math.cos(s) - r[1] * Math.sin(s), r[0] * Math.sin(s) + r[1] * Math.cos(s)], A = (r, s) => {
    const x = Math.hypot(r[0], r[1]);
    if (x < 1e-6) return r;
    const g = s * Math.tanh(x / s) / x;
    return [r[0] * g, r[1] * g];
  }, u = Object.fromEntries(Object.entries(e.buns ?? {}).map(([r, s]) => [r, { at: [s.cx, s.cy], k: 260, c: 11, hang: 3, max: 4 }])), y = (r, s) => {
    const x = Math.hypot(r[0], r[1]);
    x > s && (r[0] *= s / x, r[1] *= s / x);
  };
  class m {
    constructor() {
      this.gain = 1, this.out = { gain: 1, bunL: [0, 0], bunR: [0, 0] }, this.hair = {};
      for (const s of Object.keys(u))
        this.hair[s] = { p: null, v: [0, 0] }, this.out[s] = [0, 0];
      this.strands = l.map(() => ({ p: null, v: [[0, 0], [0, 0], [0, 0], [0, 0]] })), this.out.strands = l.map(() => [[0, 0], [0, 0], [0, 0], [0, 0]]), this.chains = o.map((s) => {
        const x = s.tip[0] - s.pivot[0], g = s.tip[1] - s.pivot[1], E = Math.hypot(x, g), M = [x / E, g / E];
        return { t: s, dir: M, L1: E * s.split, L2: E * (1 - s.split), pts: null, prev: null, phi: [0, 0], anchor: [0, 0] };
      }), this.time = 0, this.eyeSpring = Xa(e.layered?.eyeSpring), this.eyeDetails = e.layered?.eyeDetails ? $a() : null, this.secondary = (e.layered?.parts ?? []).filter((s) => s.secondary).map((s, x) => ({
        part: s,
        index: x,
        angle: 0,
        velocity: 0,
        previous: null,
        speed: [0, 0],
        acceleration: [0, 0]
      })), this.secondary.length && (this.out.secondary = {}), this.stable = e.layered?.stablePhysics ? Wa(t, e, l) : null;
    }
    hairAnchor(s, x) {
      const g = [s[0], s[1]];
      return n(g, 1, x), e.layered?.bodyAnchor ? t.applyHeadBody(g, x) : a(g, s[1], x), g;
    }
    step(s, x) {
      const g = Math.max(1, Math.ceil(x / 0.004166666666666667)), E = Math.min(x, 0.05) / g, M = -s.angleZ / 30 * e.head.maxRoll - s.bodyAngleZ / 10 * e.body.maxRoll, k = this.gain;
      this.stable || l.forEach((F, U) => {
        const B = this.strands[U], Z = this.out.strands[U], q = F.nodes.map((D) => this.hairAnchor(D, s));
        B.p || (B.p = q.map((D) => [...D]));
        const j = U * 1.7;
        for (let D = 0; D < g; D++) {
          const G = this.time + D * E;
          for (let P = 1; P < 4; P++) {
            const ce = Math.hypot(F.nodes[P][0] - F.nodes[0][0], F.nodes[P][1] - F.nodes[0][1]), re = (Math.sin(G * 1.3) * 0.5 + Math.sin(G * 3.1) * 0.3 + Math.sin(G * 4.7 + j) * 0.2) * F.max * 0.1 * P / 3, I = [B.p[P - 1][0] - q[P - 1][0], B.p[P - 1][1] - q[P - 1][1]], Q = q[P][0] + I[0] * d * p.couple - Math.sin(M) * ce * 0.12 + re, H = q[P][1] + I[1] * d * p.couple, N = h[P] * F.k * p.stiff / Math.max(0.35, k), $ = v * p.damp * Math.sqrt(p.stiff) / Math.max(0.5, Math.sqrt(k)), ne = B.v[P], ue = B.p[P];
            ne[0] += (N * (Q - ue[0]) - $ * ne[0]) * E, ne[1] += (N * (H - ue[1]) - $ * ne[1]) * E, ue[0] += ne[0] * E, ue[1] += ne[1] * E;
          }
          B.p[0] = [...q[0]];
        }
        for (let D = 0; D < 4; D++) {
          const G = [B.p[D][0] - q[D][0], B.p[D][1] - q[D][1]];
          Z[D] = A(G, Math.max(0.5, F.max * p.reach * Math.max(1, k) * D / 3));
        }
      });
      for (const [F, U] of Object.entries(u)) {
        const B = this.hair[F], Z = this.hairAnchor(U.at, s), q = Math.sin(this.time * 1.3 + U.at[0] * 0.01) * 0.6 + Math.sin(this.time * 2.9 + U.at[1] * 0.02) * 0.4, j = Z[0] - Math.sin(M) * U.hang + q * U.max * 0.12, D = Z[1];
        B.p || (B.p = [j, D]);
        const G = U.k / Math.max(0.35, k), P = U.c / Math.max(0.5, Math.sqrt(k));
        for (let re = 0; re < g; re++)
          B.v[0] += (G * (j - B.p[0]) - P * B.v[0]) * E, B.v[1] += (G * (D - B.p[1]) - P * B.v[1]) * E, B.p[0] += B.v[0] * E, B.p[1] += B.v[1] * E;
        const ce = [B.p[0] - Z[0], B.p[1] - Z[1]];
        y(ce, U.max * Math.max(1, k)), this.out[F] = ce;
      }
      this.out.gain = k === 0 ? 0 : 1, this.eyeDetails && (this.out.eyeDetails = this.eyeDetails(s, x, k)), e.layered?.eyeSpring && (this.out.eyes = this.eyeSpring(
        [e.face.eyeA, e.face.eyeB].map((F) => this.hairAnchor([F.cx, F.cy], s)),
        [s.eyeROpen, s.eyeLOpen],
        this.stable && x > 0.12 ? 0 : x,
        k
      ));
      const Y = this.out.strands, X = e.layered?.independentFringe ? 0 : p.bind;
      for (let F = 0; F < X; F++) for (let U = 1; U < 4; U++) {
        const B = Y.slice(0, c).map((Z) => [...Z[U]]);
        for (let Z = 0; Z < c; Z++) {
          const q = B[Math.max(0, Z - 1)], j = B[Math.min(c - 1, Z + 1)];
          for (const D of [0, 1]) Y[Z][U][D] = B[Z][D] * 0.5 + (q[D] + j[D]) * 0.25;
        }
      }
      for (const F of this.chains) {
        const U = i(F.t, s, this.out, [0, 0]);
        F.st || (F.st = { th: [0, 0], w: [0, 0], pos: [...U], vel: [0, 0], acc: [0, 0] });
        const B = F.st, Z = f, q = [(U[0] - B.pos[0]) / Math.max(x, 1e-3), (U[1] - B.pos[1]) / Math.max(x, 1e-3)], j = 1 - Math.exp(-x * Z.smooth), D = [(q[0] - B.vel[0]) / Math.max(x, 1e-3), (q[1] - B.vel[1]) / Math.max(x, 1e-3)];
        B.acc = [B.acc[0] + (D[0] - B.acc[0]) * j, B.acc[1] + (D[1] - B.acc[1]) * j], B.vel = [B.vel[0] + (q[0] - B.vel[0]) * j, B.vel[1] + (q[1] - B.vel[1]) * j], B.pos = [...U];
        const G = [-F.dir[1], F.dir[0]], P = -(B.acc[0] * G[0] + B.acc[1] * G[1]) / (F.L1 + F.L2) * Z.inertia, ce = (Math.sin(this.time * 0.9 + F.t.pivot[0]) * 0.6 + Math.sin(this.time * 0.37 + F.t.pivot[1]) * 0.4) * Z.wind, re = -M * Z.hang + ce, I = 2 * Math.PI * Z.freq / Math.sqrt(Math.max(0.4, k)), Q = I * 1.35;
        for (let ne = 0; ne < g; ne++) {
          const ue = -I * I * (B.th[0] - re) - 2 * Z.zeta * I * B.w[0] + P;
          B.w[0] += ue * E, B.th[0] += B.w[0] * E;
          const te = -Q * Q * (B.th[1] - B.th[0]) - 2 * Z.zeta * Q * B.w[1] + P * 0.4 + ue * 0.5;
          B.w[1] += te * E, B.th[1] += B.w[1] * E;
        }
        B.th[0] = Math.max(-0.55, Math.min(Z.max, B.th[0])), B.th[1] = Math.max(-0.55 * 1.4, Math.min(Z.max * 1.4, B.th[1])), F.phi = [B.th[0], B.th[1]];
        const H = w(F.dir, B.th[0]), N = w(F.dir, B.th[1]), $ = [U[0] + H[0] * F.L1, U[1] + H[1] * F.L1];
        F.pts = [[...U], $, [$[0] + N[0] * F.L2, $[1] + N[1] * F.L2]], F.anchor = U;
      }
      for (const F of this.stable ? [] : this.secondary) {
        const U = F.part, B = U.secondary, Z = t.deformPart(
          ...U.pivot,
          t.baseWeights(...U.pivot, 0),
          s,
          { gain: 0 },
          U,
          [0, 0]
        );
        F.previous || (F.previous = [...Z]);
        const q = Math.max(Math.min(x, 0.05), 1e-3), j = 1 - Math.exp(-q * 9);
        for (let $ = 0; $ < 2; $++) {
          const ne = (Z[$] - F.previous[$]) / q, ue = Math.min(5e3, Math.max(-5e3, (ne - F.speed[$]) / q));
          F.acceleration[$] += (ue - F.acceleration[$]) * j, F.speed[$] += (ne - F.speed[$]) * j;
        }
        F.previous = [...Z];
        const D = B.tip[0] - U.pivot[0], G = B.tip[1] - U.pivot[1], P = Math.hypot(D, G), ce = -(F.acceleration[0] * -G + F.acceleration[1] * D) / (P * P) * B.inertia, re = U.kind === "body" ? -s.bodyAngleZ / 10 * e.body.maxRoll : M, I = F.index * 1.9, Q = (Math.sin(this.time * 1.3 + I) * 0.65 + Math.sin(this.time * 0.71 + I * 0.43) * 0.35) * B.wind, H = -re * B.tilt + Q, N = 2 * Math.PI * B.frequency;
        for (let $ = 0; $ < g; $++) {
          F.velocity += (-N * N * (F.angle - H) - 2 * B.damping * N * F.velocity + ce) * E, F.angle += F.velocity * E;
          const ne = B.angleLimit;
          Math.abs(F.angle) > ne && (F.angle = Math.sign(F.angle) * ne, F.velocity *= 0.35);
        }
        this.out.secondary[U.name] = k === 0 ? 0 : F.angle;
      }
      return this.stable && this.stable(s, x, k, this.out), this.time += x, this.out;
    }
  }
  return { Physics: m };
}
function qa(t) {
  let e = [0, 0], n = [0, 0];
  return (a, o) => {
    if (!t) return a;
    const i = Math.min(1, Math.max(0, a.headBodyFollow ?? 1)), l = Math.min(1, Math.max(-1, a.angleX / 30)) * i, h = [l * t.shift, l * t.lean];
    if (t.instant || o <= 0)
      e = h, n = [0, 0];
    else {
      const d = Math.max(1, Math.ceil(Math.min(o, 0.05) * 240)), v = Math.min(o, 0.05) / d, p = 2 * Math.PI * t.frequency;
      for (let c = 0; c < d; c++) for (let f = 0; f < 2; f++)
        n[f] += ((h[f] - e[f]) * p * p - 2 * t.damping * p * n[f]) * v, e[f] += n[f] * v;
    }
    return {
      ...a,
      bodyAngleX: Math.min(10, Math.max(-10, a.bodyAngleX + e[0])),
      bodyAngleZ: Math.min(10, Math.max(-10, a.bodyAngleZ + e[1]))
    };
  };
}
function Va(t, e) {
  let n = "closed", a = n, o = n, i = t, l = t;
  return {
    update(h, d) {
      d <= 0 ? (n = a = o = h, i = l = t) : (h === "closed" && o !== "closed" ? (a = i / l > 0.5 ? o : a, o = "closed", i = 0, l = t * 0.55) : i >= l && h !== n && (a = n, o = h, i = 0, l = t), i = Math.min(l, i + d), i >= l && (n = o));
      const v = Math.min(1, i / l), p = Math.round(v * (e + 1));
      return a === o || p === e + 1 ? { shape: o, from: o, to: o, progress: 1 } : p === 0 ? { shape: a, from: a, to: a, progress: 0 } : { shape: `mix_${a}_${o}_${p}`, from: a, to: o, progress: p / (e + 1) };
    }
  };
}
function Ga(t, e) {
  const { baseWeights: n, deformBase: a, MOUTH: o } = t, i = (g, E, M) => {
    const k = Math.min(1, Math.max(0, (M - g) / (E - g)));
    return k * k * (3 - 2 * k);
  }, l = e.mouth.area, h = {
    a: { sprite: "mouth_a", ref: 0.9, width: 1 },
    aHalf: { sprite: "mouth_a_half", ref: 0.55, width: 1 },
    i: { sprite: "mouth_i", ref: 0.55, width: 1 },
    e: { sprite: "mouth_a_half", ref: 0.65, width: 1.06 },
    o: { sprite: "mouth_o", ref: 0.75, width: 1 },
    u: { sprite: "mouth_o", ref: 0.75, width: 0.78 }
  }, d = 0.16, v = ["angry", "sad"];
  function p(g, E) {
    const k = (F, U, B) => F >= U - (E ? 0.07 : 0) && F < B + (E ? 0.07 : 0), Y = [["i", -9, -0.55], ["e", -0.55, -0.2], ["a", -0.2, 0.35], ["o", 0.35, 0.75], ["u", 0.75, 9]], X = E && Y.find((F) => F[0] === E || E === "aHalf" && F[0] === "a");
    return X && k(g, X[1], X[2]) ? X[0] : Y.find((F) => g >= F[1] && g < F[2])[0];
  }
  const c = 0.75, f = 0.3, w = 0.06, A = ["sad", "surprise"];
  function u(g, E, M = null) {
    return M && g >= f ? M : g >= c ? null : g < f ? E >= 0.5 ? "eyes_smile" : "eyes_closed" : "eyes_half";
  }
  function y(g, E, M = null) {
    if (g < d) return null;
    const k = p(E, M);
    return k === "a" ? g >= 0.6 ? "a" : "aHalf" : k;
  }
  function m(g) {
    return o.cy + (g - o.cx) * Math.tan(o.angle);
  }
  function r() {
    return l.cx;
  }
  function s(g, E) {
    const M = Math.cos(-l.angle), k = Math.sin(-l.angle), Y = g - l.cx, X = E - l.cy, F = (Y * M - X * k) / l.rx, U = (Y * k + X * M) / l.ry;
    return 1 - i(0.55, 0.95, Math.hypot(F, U));
  }
  function x(g, E, M, k, Y) {
    const X = {}, F = (I) => I.startsWith("eyes_closed") || I.startsWith("eyes_smile"), U = (I) => v.some((Q) => I === `mouth_${Q}`), B = (I) => I === "eyes_expression_atlas" ? 2 : F(I) ? 1 : I.startsWith("eyes_") ? 0 : U(I) ? 2 : 3, Z = Object.entries(E.layers).filter(([I]) => !I.endsWith("_hd")).sort((I, Q) => B(I[0]) - B(Q[0]));
    for (const [I, Q] of Z) {
      const H = I === "brows_expression_atlas" && E.browExpressions, N = I === "mouth_morph_atlas" && E.mouthMorph || H || I === "eyes_expression_atlas" && E.eyeExpressions, $ = k(Q, e.mesh.spriteCell, N ? new Uint8Array(Q[2] * Q[3]).fill(255) : Y(M[I]), N ? Q[2] : M[I].width), ne = [], ue = [];
      for (let ae = 0; ae < $.rest.length / 2; ae++) {
        const se = $.rest[ae * 2], le = $.rest[ae * 2 + 1];
        ne.push(n(se, le, 0)), ue.push(I.startsWith("mouth") ? s(se, le) : 0);
      }
      const te = g.addLayer(I, M[`${I}_hd`] ?? M[I], $, { color: [0.4, 1, 0.8, 0.6], faceOverlay: !!H && !e.layered?.faceProjection?.browsBehindHair });
      te.visible = !1;
      const ie = /^eyes_.+_[01]$/.test(I) ? Number(I.at(-1)) : void 0;
      X[I] = { mesh: $, W: ne, inner: ue, layer: te, eyeIndex: ie, eyePair: !!H, smileDrawing: I.startsWith("eyes_smile_") };
    }
    const q = [0, 0];
    let j = null;
    const D = [0, 1].map(() => ({ cur: "open", prev: "open", t: 1 })), G = E.mouthMorph ? Va(E.mouthMorph.duration, E.mouthMorph.steps) : null;
    let P = 0, ce = 0;
    function re(I, Q, H, N, $ = 1) {
      const ne = I.mesh.rest, ue = I.mesh.pos;
      for (let te = 0; te < I.W.length; te++) {
        let ie = ne[te * 2], ae = ne[te * 2 + 1];
        if (I.smileDrawing && I.eyeIndex !== void 0) {
          const le = t.EYES[I.eyeIndex], be = e.layered?.controlRoomEyes;
          if (be) {
            const ve = I.eyeIndex === 0 ? e.face.eyeA : e.face.eyeB;
            ie += (ve.cx - (e.face.eyeA.cx + e.face.eyeB.cx) / 2) * ((be.smileSpacing ?? 1) - 1), ae += (Math.max(...le.bot) - Math.min(...le.top)) * (be.extraSmileDrop ?? 0);
          }
          ae += (Math.max(...le.bot) - Math.min(...le.top)) * (e.layered?.faceProjection?.eye.smileDrop ?? 0);
        }
        const se = I.inner[te];
        if (se > 0) {
          const le = m(ie);
          ae = le + (ae - le) * (1 + (N - 1) * se), ie = r() + (ie - r()) * (1 + ($ - 1) * se);
        }
        I.eyePair && e.layered?.faceProjection ? t.deformEye(ie < (e.face.eyeA.cx + e.face.eyeB.cx) / 2 ? 0 : 1, ie, ae, I.W[te], Q, H, q, "brow") : I.eyeIndex !== void 0 ? t.deformEye(I.eyeIndex, ie, ae, I.W[te], Q, H, q, "lash") : a(ie, ae, I.W[te], Q, H, q), ue[te * 2] = q[0], ue[te * 2 + 1] = q[1];
      }
    }
    return {
      /**
       * Show / hide and deform the sprites for this frame.
       * Returns which eyes are covered by a sprite, so the layered eye parts can be hidden.
       * `mood` (angry / sad / surprise) picks drawn expression eyes (sad, surprise) and closed
       * mouths (angry, sad) when the avatar has them.
       */
      update(I, Q, H = 1 / 60, N = null) {
        for (const T of Object.values(X)) T.layer.visible = !1;
        const $ = [!1, !1], ne = [1, 1], ue = [1, 1], te = [0, 0];
        [
          [I.eyeROpen, I.eyeSmile],
          [I.eyeLOpen, I.eyeSmileL ?? I.eyeSmile]
        ].forEach(([T, S], z) => {
          const C = D[z], W = A.includes(N) && X[`eyes_${N}_${z}`] ? `eyes_${N}` : null;
          if (e.layered?.continuousBlink && S < 0.5) {
            ne[z] = 1, ue[z] = i(0, 0.1, T) * i(0.12, 0.22, T), te[z] = 0, $[z] = !1;
            return;
          }
          const K = u(T, S, W) ?? "open";
          K !== C.cur && (C.prev = C.cur, C.cur = K, C.t = 0), C.t = H > 0 ? Math.min(1, C.t + H / w) : 1;
          const oe = i(0, 1, C.t), V = (fe, pe) => {
            if (fe === "open" || pe <= 1e-3) return;
            const Re = X[`${fe}_${z}`];
            Re && (Re.layer.visible = !0, Re.layer.alpha = pe, re(Re, I, Q, 1));
          }, ee = (fe) => fe === "open" ? -1 : F(fe) ? 1 : 0;
          e.layered?.cleanEyeTransitions ? (V(C.cur, 1), ne[z] = C.cur === "open" ? 1 : 0, ue[z] = C.cur === "open" || E.splitBlink && C.cur === "eyes_half" ? 1 : 0, te[z] = C.cur === "eyes_half" ? 1 : 0) : C.t >= 1 ? V(C.cur, 1) : ee(C.cur) > ee(C.prev) ? (V(C.prev, 1), V(C.cur, oe)) : (V(C.cur, 1), V(C.prev, 1 - oe)), $[z] = C.cur !== "open" && oe >= 0.999;
        });
        const ae = E.browExpressions?.names?.[Math.round(I.browExpression ?? 0)], se = X.brows_expression_atlas, le = E.browExpressions?.frames?.[ae];
        se && le && (se.layer.visible = !0, se.layer.alpha = 1, se.layer.textureRect = le, re(se, I, Q, 1));
        const be = E.eyeExpressions?.names?.[Math.round(I.eyeExpression ?? 0)], ve = X.eyes_expression_atlas, Ae = E.eyeExpressions?.frames?.[be];
        ce = H <= 0 ? Ae ? 1 : 0 : ce + ((Ae ? 1 : 0) - ce) * (1 - Math.exp(-H / 0.08)), ve && ce > 1e-3 && (ve.layer.visible = !0, ve.layer.alpha = ce, Ae && (ve.layer.textureRect = Ae), re(ve, I, Q, 1));
        const Oe = E.mouthMorph?.expressions?.[Math.round(I.mouthExpression ?? 0)], O = (!I.voiceActive && I.mouthOpen < d ? Oe : null) || y(I.mouthOpen, I.mouthForm, j);
        if (j = O, G) {
          const T = E.mouthMorph.smoothOpening;
          P = !T || H <= 0 ? I.mouthOpen : P + (I.mouthOpen - P) * (1 - Math.exp(-H / T));
          const S = G.update(O ?? "closed", H), z = E.mouthMorph.frames?.[S.shape], C = z ? X.mouth_morph_atlas : X[`mouth_${S.shape}`];
          if (C) {
            C.layer.textureRect = z;
            const W = (oe) => oe === "closed" ? 0 : E.mouthMorph.definitions?.[oe]?.ref ?? h[oe]?.ref ?? 0, K = W(S.from) + (W(S.to) - W(S.from)) * S.progress;
            C.layer.visible = !0, C.layer.alpha = 1, re(C, I, Q, K < 0.05 ? 1 : T ? Math.min(1, Math.max(0.08, P / K)) : Math.min(1.1, Math.max(0.45, I.mouthOpen / K)));
          }
          return { eyes: $, openAlpha: ne, ballAlpha: ue, eyeWindowIndex: te, mouth: O };
        }
        let L = O && h[O];
        (O === "e" || O === "u") && X[`mouth_${O}`] && (L = { ...L, sprite: `mouth_${O}`, width: 1 });
        const b = L && X[L.sprite], _ = v.includes(N) && X[`mouth_${N}`] || !O && X.mouth_closed;
        if (_ && (!b || I.mouthOpen < d + 0.04) && (_.layer.visible = !0, _.layer.alpha = 1, re(_, I, Q, 1)), b) {
          b.layer.visible = !0, b.layer.alpha = i(d, d + 0.04, I.mouthOpen);
          const T = Math.min(1.1, Math.max(0.5, I.mouthOpen / L.ref));
          re(b, I, Q, T, L.width);
        }
        return { eyes: $, openAlpha: ne, ballAlpha: ue, eyeWindowIndex: te, mouth: O };
      }
    };
  }
  return { createSprites: x, mouthShape: y, eyeSprite: u };
}
const _n = { angry: "angry", angryTalk: "angry", sad: "sad", sadTalk: "sad", surprise: "surprise", surprisedTalk: "surprise" };
function Ja(t, e) {
  return t && t !== "neutral" ? _n[t] ?? null : (e && _n[e]) ?? null;
}
function un(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) throw new TypeError("lipSync: expected an object");
  const e = t, n = {};
  for (const a of ["granularity", "openness", "closeSpeed"]) {
    const o = e[a];
    if (o !== void 0) {
      if (typeof o != "number" || !Number.isFinite(o) || o < 0 || o > 1)
        throw new RangeError(`lipSync.${a}: expected 0–1`);
      n[a] = o;
    }
  }
  if (e.preset !== void 0) {
    if (!["calm", "default", "lively", "subtle", "big", "custom"].includes(e.preset))
      throw new RangeError("lipSync.preset: expected calm, default, lively, subtle, big or custom");
    n.preset = e.preset;
  }
  return n;
}
function On(t = {}, e = {
  granularity: 0.5,
  openness: 0.5,
  closeSpeed: 0.5
}) {
  const n = un(t);
  return {
    granularity: n.granularity ?? e.granularity,
    openness: n.openness ?? e.openness,
    closeSpeed: n.closeSpeed ?? e.closeSpeed
  };
}
const Pe = (t, e, n, a) => t === 0.5 ? n : t < 0.5 ? e + (n - e) * t * 2 : n + (a - n) * (t - 0.5) * 2;
function Fn(t) {
  return {
    arm: Pe(t.granularity, 0.2, 0.6, 0.9),
    trigger: Pe(t.granularity, 0.65, 0.8, 0.95),
    relax: Pe(t.granularity, 1.5, 5, 12),
    range: Pe(t.granularity, 0.7, 0.3, 0.05),
    risePower: Pe(t.granularity, 0.05, 0.3, 0.8),
    openness: Pe(t.openness, 0.55, 1, 1.25),
    audioRelease: Pe(t.closeSpeed, 6, 32, 45),
    kanaRelease: Pe(t.closeSpeed, 6, 22, 45)
  };
}
const Ka = /* @__PURE__ */ new Set([
  "angleX",
  "angleY",
  "angleZ",
  "bodyAngleX",
  "bodyAngleZ",
  "armAngle",
  "handAngle",
  "gazeX",
  "gazeY"
]), fn = {
  nod: {
    label: "Nod",
    dur: 1.7,
    tracks: {
      angleY: [[0, 0], [0.32, -13], [0.62, 2], [0.95, -9], [1.3, 1], [1.7, 0]],
      angleZ: [[0, 0], [0.4, -2], [1, -1], [1.7, 0]],
      bodyAngleX: [[0, 0], [0.5, -1.5], [1.7, 0]],
      eyeSmile: [[0, 0], [0.3, 0.45], [1.3, 0.45], [1.7, 0]],
      eyeOpen: [[0, 1], [0.3, 0.72], [1.3, 0.72], [1.7, 1]],
      mouthOpen: [[0, 0], [0.3, 0.12], [1.3, 0.12], [1.7, 0]],
      mouthForm: [[0, 0], [0.3, -0.6], [1.7, -0.3]]
    }
  },
  tilt: {
    label: "Head tilt",
    dur: 2.6,
    tracks: {
      angleZ: [[0, 0], [0.55, 17], [2, 15], [2.6, 0]],
      angleX: [[0, 0], [0.6, 8], [2, 7], [2.6, 0]],
      angleY: [[0, 0], [0.6, 4], [2.6, 0]],
      bodyAngleZ: [[0, 0], [0.8, 3], [2, 3], [2.6, 0]],
      gazeX: [[0, 0], [0.4, 0.5], [2.1, 0.4], [2.6, 0]],
      gazeY: [[0, 0], [0.4, 0.35], [2.1, 0.3], [2.6, 0]],
      browAngle: [[0, 0], [0.5, -0.7], [2.1, -0.6], [2.6, 0]],
      browY: [[0, 0], [0.5, 0.35], [2.1, 0.3], [2.6, 0]]
      // closed mouth: a barely open round mouth read as a squashed blob
    }
  },
  think: {
    label: "Thinking",
    dur: 3.6,
    tracks: {
      angleX: [[0, 0], [0.7, -11], [3, -9], [3.6, 0]],
      angleY: [[0, 0], [0.7, 9], [3, 8], [3.6, 0]],
      angleZ: [[0, 0], [0.8, 6], [3, 5], [3.6, 0]],
      gazeX: [[0, 0], [0.35, -0.8], [3.1, -0.7], [3.6, 0]],
      gazeY: [[0, 0], [0.35, 0.7], [3.1, 0.6], [3.6, 0]],
      handAngle: [[0, 0], [0.6, 3], [3, 3], [3.6, 0]],
      fingerTap: [
        [0, 0],
        [0.9, 0],
        [1.05, 1],
        [1.2, 0],
        [1.4, 1],
        [1.55, 0],
        [1.75, 1],
        [1.9, 0],
        [2.3, 0],
        [2.45, 1],
        [2.6, 0],
        [3.6, 0]
      ],
      browY: [[0, 0], [0.6, 0.25], [3, 0.2], [3.6, 0]],
      browAngle: [[0, 0], [0.6, -0.3], [3, -0.3], [3.6, 0]],
      mouthForm: [[0, 0], [0.6, 0.4], [3.6, 0]]
    }
  },
  giggle: {
    label: "Chuckle",
    dur: 2.2,
    tracks: {
      eyeOpen: [[0, 1], [0.2, 0], [1.8, 0], [2.2, 1]],
      eyeSmile: [[0, 0], [0.2, 1], [1.8, 1], [2.2, 0]],
      mouthOpen: [[0, 0], [0.2, 0.5], [0.45, 0.32], [0.7, 0.55], [0.95, 0.34], [1.2, 0.5], [1.8, 0.3], [2.1, 0]],
      mouthForm: [[0, 0], [0.2, -0.8], [2.2, -0.2]],
      blush: [[0, 0], [0.3, 0.7], [1.8, 0.7], [2.2, 0.1]],
      angleY: [[0, 0], [0.2, -5], [0.45, -1], [0.7, -6], [0.95, -2], [1.2, -5], [1.6, -2], [2.2, 0]],
      angleZ: [[0, 0], [0.3, -6], [1.8, -5], [2.2, 0]],
      bodyAngleZ: [[0, 0], [0.25, 2], [0.5, -1], [0.75, 2], [1, -1], [1.3, 1.5], [2.2, 0]],
      browY: [[0, 0], [0.3, 0.3], [1.8, 0.3], [2.2, 0]]
    }
  },
  surprise: {
    label: "Surprise",
    dur: 2,
    tracks: {
      angleY: [[0, 0], [0.12, 10], [0.5, 6], [1.5, 5], [2, 0]],
      angleX: [[0, 0], [0.12, -4], [2, 0]],
      bodyAngleX: [[0, 0], [0.15, -4], [1.5, -3], [2, 0]],
      eyeOpen: [[0, 1], [0.1, 1.25], [1.5, 1.2], [2, 1]],
      browY: [[0, 0], [0.1, 1], [1.5, 0.9], [2, 0]],
      mouthOpen: [[0, 0], [0.12, 0.6], [1.4, 0.45], [2, 0]],
      mouthForm: [[0, 0], [0.12, 0.6], [1.5, 0.55], [2, 0]],
      // o
      armAngle: [[0, 0], [0.15, -4], [1.5, -3], [2, 0]]
    }
  },
  shy: {
    label: "Shy",
    dur: 3.2,
    tracks: {
      angleX: [[0, 0], [0.6, 14], [2.6, 12], [3.2, 0]],
      angleY: [[0, 0], [0.6, -9], [2.6, -8], [3.2, 0]],
      angleZ: [[0, 0], [0.7, -8], [2.6, -7], [3.2, 0]],
      gazeX: [[0, 0], [0.3, 0.8], [1.6, 0.8], [1.9, -0.3], [2.2, 0.8], [2.8, 0.6], [3.2, 0]],
      gazeY: [[0, 0], [0.3, -0.5], [2.8, -0.4], [3.2, 0]],
      eyeOpen: [[0, 1], [0.5, 0.75], [2.7, 0.75], [3.2, 1]],
      eyeSmile: [[0, 0], [0.5, 0.5], [2.7, 0.5], [3.2, 0]],
      blush: [[0, 0], [0.8, 1], [2.7, 1], [3.2, 0]],
      browAngle: [[0, 0], [0.5, -0.6], [2.7, -0.5], [3.2, 0]],
      mouthForm: [[0, 0], [0.5, -0.4], [3.2, 0]],
      handAngle: [[0, 0], [0.8, 4], [2.6, 4], [3.2, 0]]
    }
  },
  no: {
    label: "Shake head",
    dur: 1.9,
    tracks: {
      angleX: [[0, 0], [0.2, 13], [0.45, -13], [0.7, 12], [0.95, -10], [1.2, 5], [1.5, 0]],
      angleY: [[0, 0], [0.2, -3], [1.3, -3], [1.9, 0]],
      bodyAngleX: [[0, 0], [0.3, 1.5], [0.6, -1.5], [0.9, 1], [1.3, 0]],
      eyeOpen: [[0, 1], [0.15, 0], [1.4, 0], [1.9, 1]],
      eyeSmile: [[0, 0], [0.15, 1], [1.4, 1], [1.9, 0]],
      // closed mouth while shaking the head
      browAngle: [[0, 0], [0.2, -0.5], [1.4, -0.5], [1.9, 0]]
    }
  },
  wink: {
    label: "Wink",
    dur: 2,
    tracks: {
      angleZ: [[0, 0], [0.35, -13], [1.5, -12], [2, 0]],
      angleX: [[0, 0], [0.35, 9], [1.5, 8], [2, 0]],
      bodyAngleZ: [[0, 0], [0.5, -2], [1.5, -2], [2, 0]],
      eyeOpenL: [[0, 1], [0.25, 1], [0.4, 0], [1.4, 0], [1.6, 1]],
      eyeSmileL: [[0, 0], [0.3, 1], [1.5, 1], [1.7, 0]],
      mouthOpen: [[0, 0], [2, 0]],
      // wink with a closed smile
      mouthForm: [[0, 0], [0.35, -0.8], [2, 0]],
      blush: [[0, 0], [0.4, 0.5], [1.6, 0.5], [2, 0]]
    }
  },
  greet: {
    label: "Greeting",
    dur: 2.6,
    tracks: {
      angleY: [[0, 0], [0.7, -18], [1.2, -17], [1.9, 2], [2.6, 0]],
      bodyAngleX: [[0, 0], [0.8, 2], [1.8, 0]],
      bodyAngleZ: [[0, 0], [0.8, 1.5], [2, 0]],
      armAngle: [[0, 0], [0.8, 3], [2, 0]],
      eyeOpen: [[0, 1], [0.5, 0], [1.4, 0], [1.8, 1]],
      eyeSmile: [[0, 0], [0.5, 1], [1.6, 1], [2.3, 0.4], [2.6, 0]],
      mouthOpen: [[0, 0], [1.6, 0], [1.8, 0.3], [2.3, 0.2], [2.6, 0]],
      mouthForm: [[0, 0], [1.6, -0.8], [2.6, -0.3]],
      blush: [[0, 0], [1.6, 0.3], [2.6, 0]]
    }
  }
}, mn = {
  lookAround: {
    label: "Look around",
    dur: 5.2,
    idle: !0,
    tracks: {
      gazeX: [[0, 0], [0.25, -0.85], [1.5, -0.8], [1.8, 0.1], [2.1, 0.85], [3.4, 0.8], [3.7, 0], [5.2, 0]],
      gazeY: [[0, 0], [0.25, 0.15], [1.8, 0.25], [2.1, 0.1], [3.7, 0], [5.2, 0]],
      angleX: [[0, 0], [0.7, -20], [1.6, -18], [2.5, 19], [3.5, 17], [4.4, 0], [5.2, 0]],
      angleY: [[0, 0], [0.7, 3], [1.8, 5], [2.5, 3], [4.4, 0]],
      angleZ: [[0, 0], [0.8, 4], [1.8, 0], [2.6, -4], [4.4, 0]],
      bodyAngleX: [[0, 0], [1, -4], [2.8, 4], [4.6, 0]],
      bodyAngleZ: [[0, 0], [1, 1.5], [2.8, -1.5], [4.6, 0]],
      handAngle: [[0, 0], [1, -2], [2.8, 2], [4.6, 0]],
      browY: [[0, 0], [0.5, 0.35], [3.6, 0.3], [4.4, 0]],
      // curious: a quick inhale, held while looking, let out at the end
      breath: [[0, 0.2], [0.6, 0.85], [3.6, 0.7], [4.6, 0], [5.2, 0.1]]
    }
  },
  glance: {
    label: "Side glance",
    dur: 4.6,
    idle: !0,
    tracks: {
      gazeX: [[0, 0], [0.18, 0.9], [2.6, 0.85], [2.9, 0.15], [3.2, 0], [4.6, 0]],
      gazeY: [[0, 0], [0.18, 0.4], [2.6, 0.35], [3.2, 0]],
      angleX: [[0, 0], [0.6, 13], [2.6, 11], [3.6, 0]],
      angleY: [[0, 0], [0.6, 6], [2.6, 5], [3.6, 0]],
      angleZ: [[0, 0], [0.7, -5], [2.6, -4], [3.6, 0]],
      bodyAngleX: [[0, 0], [1, 2.5], [2.8, 2], [4, 0]],
      eyeOpen: [[0, 1], [0.3, 1.06], [2.5, 1.05], [2.8, 0.85], [3.4, 1]],
      browY: [[0, 0], [0.4, 0.4], [2.5, 0.35], [3.4, 0]],
      browAngle: [[0, 0], [0.4, -0.2], [2.5, -0.2], [3.4, 0]],
      breath: [[0, 0], [0.5, 0.6], [2.6, 0.55], [3.8, 0], [4.6, 0.3]]
    }
  },
  sway: {
    label: "Sway",
    dur: 7,
    idle: !0,
    tracks: {
      bodyAngleZ: [[0, 0], [1.6, 6], [3.4, -6], [5.2, 5], [7, 0]],
      bodyAngleX: [[0, 0], [1.6, 3], [3.4, -3], [5.2, 2.5], [7, 0]],
      angleZ: [[0, 0], [1.8, -10], [3.6, 10], [5.4, -8], [7, 0]],
      angleX: [[0, 0], [1.8, 6], [3.6, -6], [5.4, 5], [7, 0]],
      angleY: [[0, 0], [0.9, 3], [1.8, 0], [2.7, 3], [3.6, 0], [4.5, 3], [5.4, 0], [7, 0]],
      armAngle: [[0, 0], [1.6, 3], [3.4, -3], [5.2, 2], [7, 0]],
      handAngle: [[0, 0], [1.8, -4], [3.6, 4], [5.4, -3], [7, 0]],
      gazeX: [[0, 0], [1.8, -0.3], [3.6, 0.3], [5.4, -0.2], [7, 0]],
      eyeOpen: [[0, 1], [0.8, 0.82], [6.2, 0.82], [7, 1]],
      eyeSmile: [[0, 0], [0.8, 0.35], [6.2, 0.35], [7, 0]],
      // slow, even breaths in time with the sway
      breath: [[0, 0], [0.9, 1], [1.8, 0], [2.7, 1], [3.6, 0], [4.5, 1], [5.4, 0], [6.3, 0.8], [7, 0]]
    }
  },
  sigh: {
    label: "Sigh",
    dur: 5.6,
    idle: !0,
    tracks: {
      breath: [[0, 0], [1.3, 1.25], [1.9, 1.25], [3.6, 0], [5.6, 0]],
      angleY: [[0, 0], [1.3, 9], [1.9, 9], [3.3, -9], [4.6, -6], [5.6, 0]],
      angleZ: [[0, 0], [1.3, -3], [3.3, 5], [5.6, 0]],
      bodyAngleX: [[0, 0], [1.3, -2.5], [3.3, 2.5], [5.6, 0]],
      bodyAngleZ: [[0, 0], [1.9, 1], [3.3, -1.5], [5.6, 0]],
      armAngle: [[0, 0], [1.3, -2.5], [3.3, 2], [5.6, 0]],
      gazeY: [[0, 0], [1.2, 0.4], [2, 0.3], [3.2, -0.4], [4.8, -0.2], [5.6, 0]],
      eyeOpen: [[0, 1], [1, 0.95], [1.9, 0.6], [3.4, 0.6], [4.6, 0.78], [5.6, 1]],
      browY: [[0, 0], [1.3, 0.35], [3.2, -0.2], [5.6, 0]],
      browAngle: [[0, 0], [1.9, -0.4], [4.6, -0.35], [5.6, 0]]
    }
  },
  doze: {
    label: "Drowsy",
    dur: 7.2,
    idle: !0,
    tracks: {
      eyeOpen: [[0, 1], [1.8, 0.78], [3.2, 0.62], [4.5, 0.55], [4.75, 1.1], [5.6, 1.05], [7.2, 1]],
      angleY: [[0, 0], [1.8, -6], [3.2, -9], [4.5, -17], [4.75, 5], [5.6, 2], [7.2, 0]],
      angleZ: [[0, 0], [2, 4], [4.5, 10], [4.75, -2], [7.2, 0]],
      angleX: [[0, 0], [4.5, -4], [4.75, 3], [5.4, -6], [6.2, 5], [7.2, 0]],
      bodyAngleZ: [[0, 0], [4.5, 3], [4.8, -2], [7.2, 0]],
      bodyAngleX: [[0, 0], [4.5, 2], [4.8, -1.5], [7.2, 0]],
      armAngle: [[0, 0], [4.5, 3], [4.8, -2], [7.2, 0]],
      handAngle: [[0, 0], [4.5, 5], [4.8, -1], [7.2, 0]],
      gazeY: [[0, 0], [4.5, -0.4], [4.75, 0.2], [7.2, 0]],
      gazeX: [[0, 0], [4.8, 0], [5.3, -0.6], [6.1, 0.6], [6.8, 0]],
      browY: [[0, 0], [4.5, -0.35], [4.75, 0.8], [5.8, 0.3], [7.2, 0]],
      // long, slow, deepening breaths; a sharp inhale on waking
      breath: [[0, 0], [1.1, 0.7], [2.6, 0], [3.8, 0.6], [4.5, 0.2], [4.8, 1.1], [6, 0.2], [7.2, 0]]
    }
  },
  stretch: {
    label: "Stretch",
    dur: 6.2,
    idle: !0,
    tracks: {
      angleZ: [[0, 0], [1.3, -22], [2.3, -21], [3.8, 20], [4.8, 19], [6.2, 0]],
      angleY: [[0, 0], [1.3, 5], [2.3, 7], [3.1, -3], [3.8, 5], [4.8, 6], [6.2, 0]],
      angleX: [[0, 0], [1.3, -5], [3.8, 5], [6.2, 0]],
      bodyAngleZ: [[0, 0], [1.3, 4], [3.8, -4], [6.2, 0]],
      bodyAngleX: [[0, 0], [1.3, -2], [3.8, 2], [6.2, 0]],
      armAngle: [[0, 0], [1.3, 2], [3.8, -2], [6.2, 0]],
      eyeOpen: [[0, 1], [0.8, 0.62], [4.9, 0.62], [5.6, 1]],
      browAngle: [[0, 0], [1, -0.3], [4.9, -0.3], [5.8, 0]],
      breath: [[0, 0], [1.3, 1.1], [2.3, 0.9], [3.1, 0.2], [3.8, 1.1], [4.8, 0.9], [6.2, 0]]
    }
  },
  lean: {
    label: "Peek",
    dur: 4.8,
    idle: !0,
    tracks: {
      bodyAngleX: [[0, 0], [0.9, 6], [3.4, 6], [4.4, 0]],
      bodyAngleZ: [[0, 0], [0.9, -3], [3.4, -3], [4.4, 0]],
      angleX: [[0, 0], [0.9, 9], [2, 7], [2.6, 10], [3.4, 8], [4.4, 0]],
      angleY: [[0, 0], [0.9, -6], [3.4, -5], [4.4, 0]],
      angleZ: [[0, 0], [0.9, 10], [2.2, 12], [3.4, 9], [4.4, 0]],
      armAngle: [[0, 0], [0.9, -3], [3.4, -3], [4.4, 0]],
      handAngle: [[0, 0], [0.9, 3], [3.4, 3], [4.4, 0]],
      gazeY: [[0, 0], [0.6, 0.45], [3.4, 0.4], [4.2, 0]],
      gazeX: [[0, 0], [1.5, 0], [1.8, -0.3], [2.3, 0.2], [2.8, 0], [4.2, 0]],
      eyeOpen: [[0, 1], [0.6, 1.1], [3.4, 1.08], [4.2, 1]],
      browY: [[0, 0], [0.6, 0.45], [3.4, 0.4], [4.2, 0]],
      browAngle: [[0, 0], [0.6, -0.3], [3.4, -0.3], [4.2, 0]],
      blush: [[0, 0], [1.2, 0.25], [3.4, 0.25], [4.4, 0]],
      breath: [[0, 0], [0.8, 0.8], [3.4, 0.6], [4.4, 0], [4.8, 0.2]]
    }
  },
  hum: {
    label: "Listen",
    dur: 5.6,
    idle: !0,
    tracks: {
      angleY: [[0, 0], [0.45, -5], [0.9, 2], [1.35, -5], [1.8, 2], [2.25, -5], [2.7, 2], [3.15, -5], [3.6, 2], [4.05, -4], [4.8, 0]],
      angleZ: [[0, 0], [0.9, 8], [1.8, -8], [2.7, 8], [3.6, -8], [4.6, 0]],
      angleX: [[0, 0], [0.9, 4], [1.8, -4], [2.7, 4], [3.6, -4], [4.6, 0]],
      bodyAngleZ: [[0, 0], [0.9, -3], [1.8, 3], [2.7, -3], [3.6, 3], [4.6, 0]],
      bodyAngleX: [[0, 0], [1.8, 2], [3.6, -2], [4.8, 0]],
      handAngle: [[0, 0], [0.9, 3], [1.8, -3], [2.7, 3], [3.6, -3], [4.6, 0]],
      fingerTap: [[0, 0], [0.45, 1], [0.9, 0], [1.35, 1], [1.8, 0], [2.25, 1], [2.7, 0], [3.15, 1], [3.6, 0], [5.6, 0]],
      gazeX: [[0, 0], [0.9, 0.3], [1.8, -0.3], [2.7, 0.3], [3.6, -0.3], [4.6, 0]],
      eyeOpen: [[0, 1], [0.4, 0.72], [4.6, 0.72], [5.3, 1]],
      eyeSmile: [[0, 0], [0.4, 0.55], [4.6, 0.55], [5.3, 0]],
      blush: [[0, 0], [0.8, 0.3], [4.6, 0.3], [5.6, 0]],
      browY: [[0, 0], [0.5, 0.25], [4.6, 0.25], [5.4, 0]],
      breath: [[0, 0], [0.9, 0.9], [1.8, 0.2], [2.7, 0.9], [3.6, 0.2], [4.6, 0.8], [5.6, 0]]
    }
  },
  tap: {
    label: "Tap",
    dur: 5,
    idle: !0,
    tracks: {
      gazeX: [[0, 0], [0.3, -0.6], [2.2, -0.5], [2.5, -0.1], [2.8, -0.6], [4.2, -0.5], [4.7, 0]],
      gazeY: [[0, 0], [0.3, 0.55], [4.2, 0.5], [4.7, 0]],
      angleX: [[0, 0], [0.8, -11], [2.4, -9], [3, -12], [4.2, -10], [5, 0]],
      angleY: [[0, 0], [0.8, 8], [4.2, 7], [5, 0]],
      angleZ: [[0, 0], [0.8, 6], [2.4, 4], [3, 7], [4.2, 5], [5, 0]],
      bodyAngleX: [[0, 0], [1, -2], [4.2, -2], [5, 0]],
      handAngle: [[0, 0], [0.8, 3], [4.2, 3], [5, 0]],
      fingerTap: [
        [0, 0],
        [0.9, 0],
        [1.05, 1],
        [1.2, 0],
        [1.4, 1],
        [1.55, 0],
        [1.75, 1],
        [1.9, 0],
        [2.6, 0],
        [2.75, 1],
        [2.9, 0],
        [3.1, 1],
        [3.25, 0],
        [5, 0]
      ],
      browY: [[0, 0], [0.6, 0.3], [4.2, 0.25], [5, 0]],
      browAngle: [[0, 0], [0.6, -0.35], [4.2, -0.3], [5, 0]],
      eyeOpen: [[0, 1], [0.6, 0.9], [4.2, 0.9], [5, 1]],
      breath: [[0, 0], [0.8, 0.7], [2.2, 0.4], [3.2, 0.8], [4.4, 0], [5, 0.2]]
    }
  },
  readNote: {
    label: "Read script",
    dur: 2.6,
    idle: !0,
    tracks: {
      // a quick look down at the notes on the desk and back to the camera
      gazeY: [[0, 0], [0.2, -0.85], [1.5, -0.8], [1.75, 0], [2.6, 0]],
      gazeX: [[0, 0], [0.2, -0.15], [1.5, -0.1], [1.75, 0]],
      angleY: [[0, 0], [0.45, -9], [1.5, -8], [2, 1], [2.6, 0]],
      angleZ: [[0, 0], [0.5, 2], [1.6, 2], [2.6, 0]],
      eyeOpen: [[0, 1], [0.3, 0.78], [1.5, 0.78], [1.75, 1]],
      breath: [[0, 0.3], [0.8, 0.5], [1.8, 0.2], [2.6, 0.4]]
    }
  },
  waiting: {
    label: "Fidget",
    dur: 6.4,
    idle: !0,
    tracks: {
      // shifts her weight, checks the viewer, looks away, shifts back
      bodyAngleZ: [[0, 0], [0.9, 5], [2.4, 4], [3.3, -5], [5.2, -4], [6.4, 0]],
      bodyAngleX: [[0, 0], [0.9, 3], [3.3, -3], [5.2, -2], [6.4, 0]],
      angleZ: [[0, 0], [1, -6], [2.4, -4], [3.4, 6], [5.2, 5], [6.4, 0]],
      angleX: [[0, 0], [1.2, -8], [2.2, 2], [3.6, 12], [5, 10], [6.2, 0]],
      angleY: [[0, 0], [1.2, -3], [2.2, 2], [3.6, -2], [6.2, 0]],
      armAngle: [[0, 0], [0.9, 3], [3.3, -3], [5.2, -2], [6.4, 0]],
      handAngle: [[0, 0], [1.2, 3], [3.4, -3], [6.4, 0]],
      fingerTap: [[0, 0], [4.2, 0], [4.35, 1], [4.5, 0], [4.7, 1], [4.85, 0], [6.4, 0]],
      gazeX: [[0, 0], [0.9, -0.7], [1.9, -0.6], [2.1, 0], [2.7, 0], [2.9, 0.8], [5, 0.7], [5.4, 0], [6.4, 0]],
      gazeY: [[0, 0], [0.9, -0.2], [2.1, 0], [2.9, 0.3], [5.4, 0]],
      eyeOpen: [[0, 1], [2, 1], [2.2, 1.06], [2.8, 1.05], [3.1, 0.85], [5.4, 0.85], [6.2, 1]],
      browAngle: [[0, 0], [0.9, -0.35], [2, -0.35], [2.3, 0], [3.1, -0.4], [5.4, -0.35], [6.4, 0]],
      browY: [[0, 0], [2.2, 0.4], [2.8, 0.35], [3.2, 0], [6.4, 0]],
      breath: [[0, 0.3], [0.9, 0.8], [2, 0.3], [2.6, 0.9], [3.4, 0.2], [4.4, 0.8], [5.6, 0], [6.4, 0.2]]
    }
  },
  spaceOut: {
    label: "Daydream",
    dur: 7.4,
    idle: !0,
    tracks: {
      // gaze drifts up and away, breaths get slow and long, one slow blink
      gazeX: [[0, 0], [1.4, -0.55], [4.8, -0.6], [5.6, 0.1], [7, 0]],
      gazeY: [[0, 0], [1.4, 0.6], [4.8, 0.55], [5.6, 0], [7, 0]],
      angleX: [[0, 0], [2, -9], [4.8, -10], [6, 2], [7.4, 0]],
      angleY: [[0, 0], [2, 7], [4.8, 8], [6, -2], [7.4, 0]],
      angleZ: [[0, 0], [2, 9], [4.8, 11], [6, 2], [7.4, 0]],
      bodyAngleZ: [[0, 0], [2.2, 3], [4.8, 3.5], [6.4, 0]],
      bodyAngleX: [[0, 0], [2.2, -2], [4.8, -2], [6.4, 0]],
      handAngle: [[0, 0], [2.2, 4], [4.8, 5], [6.4, 0]],
      armAngle: [[0, 0], [2.2, 2], [4.8, 2], [6.4, 0]],
      eyeOpen: [[0, 1], [1.4, 0.8], [3, 0.8], [3.35, 0.56], [3.8, 0.8], [4.8, 0.8], [5.6, 1.04], [6.4, 1]],
      browY: [[0, 0], [1.6, 0.15], [4.8, 0.15], [5.6, 0.35], [6.6, 0]],
      breath: [[0, 0], [1.6, 0.9], [3.4, 0], [5, 0.9], [6.2, 0.1], [7.4, 0]]
    }
  }
};
function Qa(t, e) {
  if (e <= t[0][0]) return t[0][1];
  const n = t.length - 1;
  if (e >= t[n][0]) return t[n][1];
  let a = 0;
  for (; e > t[a + 1][0]; ) a++;
  const [o, i] = t[a], [l, h] = t[a + 1], d = (u) => u <= 0 || u >= n ? 0 : (t[u + 1][1] - t[u - 1][1]) / (t[u + 1][0] - t[u - 1][0]), v = l - o, p = (e - o) / v, c = d(a) * v, f = d(a + 1) * v, w = p * p, A = w * p;
  return (2 * A - 3 * w + 1) * i + (A - 2 * w + p) * c + (-2 * A + 3 * w) * h + (A - w) * f;
}
const gt = {
  a: { open: 0.9, form: 0, label: "あ" },
  i: { open: 0.5, form: -0.85, label: "い" },
  u: { open: 0.4, form: 0.9, label: "う" },
  e: { open: 0.62, form: -0.4, label: "え" },
  o: { open: 0.75, form: 0.6, label: "お" },
  n: { open: 0, form: null, label: "ん" }
  // closes with the previous shape
}, eo = {
  a: "あかさたなはまやらわがざだばぱぁ",
  i: "いきしちにひみりぎじぢびぴぃ",
  u: "うくすつぬふむゆるぐずづぶぷぅゔ",
  e: "えけせてねへめれげぜでべぺぇ",
  o: "おこそとのほもよろをごぞどぼぽぉ"
}, Jn = {};
for (const [t, e] of Object.entries(eo)) for (const n of e) Jn[n] = t;
const to = /* @__PURE__ */ new Set([..."まみむめもばびぶべぼぱぴぷぺぽ"]), no = /* @__PURE__ */ new Set([..."あいうえおぁぃぅぇぉ"]), Ln = { ゃ: "a", ゅ: "u", ょ: "o" }, ao = /* @__PURE__ */ new Set([..."、。，．,.！？!? 　…"]), oo = (t) => t.replace(/[ァ-ヶ]/g, (e) => String.fromCharCode(e.charCodeAt(0) - 96));
function ro(t, e = 0.14) {
  const n = [];
  for (const a of oo(t)) {
    const o = n[n.length - 1];
    if (Ln[a] && o) {
      o.vowel = Ln[a];
      continue;
    }
    if (a === "ー" && o) {
      o.dur += e;
      continue;
    }
    if (a === "っ") {
      n.push({ vowel: "n", dur: e * 0.8, onset: null });
      continue;
    }
    if (a === "ん") {
      n.push({ vowel: "n", dur: e, onset: null });
      continue;
    }
    if (ao.has(a)) {
      n.push({ vowel: "n", dur: e * 2.2, onset: null });
      continue;
    }
    const i = Jn[a];
    i && n.push({ vowel: i, dur: e, onset: to.has(a) ? "lips" : no.has(a) ? null : "consonant" });
  }
  return n;
}
function io(t, e, n = 0.5) {
  if (n !== 0.5) return so(t, e, n);
  let a = 0;
  for (const o of t) {
    if (e < a + o.dur) {
      const i = (e - a) / o.dur, l = gt[o.vowel], h = o.onset === "lips" ? 0.05 : o.onset === "consonant" ? 0.45 : 1, d = i < 0.35 ? h + (1 - h) * (i / 0.35) : 1;
      return { open: l.open * d, form: l.form, vowel: o.vowel };
    }
    a += o.dur;
  }
  return null;
}
function so(t, e, n) {
  const a = n < 0.5 ? (0.5 - n) * 0.72 : 0;
  let o = 0, i = 0, l = null;
  for (const h of t) {
    let d = h.vowel;
    if (h.vowel === "n" ? a && h.dur <= 0.2 && l ? d = l : (i = 0, l = null) : ((!l || i >= a) && (l = h.vowel, i = 0), i += h.dur, a && (d = l)), e < o + h.dur) {
      const v = gt[d], p = h.onset === "lips" ? 0.05 : h.onset === "consonant" ? 0.45 : 1, c = n < 0.5 ? 1 - (1 - p) * n * 2 : p * (2 - n * 2), f = Math.min(h.dur * 0.35, 0.05), w = (e - o) / f;
      return { open: v.open * (w < 1 ? c + (1 - c) * w : 1), form: v.form, vowel: d };
    }
    o += h.dur;
  }
  return null;
}
const Xt = { ...fn, ...mn }, Cn = { amp: 1, stiff: 1.8 }, lo = /^(angle|bodyAngle|armAngle|handAngle)/, co = /* @__PURE__ */ new Set([
  "eyeOpen",
  "eyeOpenL",
  "eyeSmileL",
  "eyeSmile",
  "mouthOpen",
  "mouthForm",
  "blush",
  "browY",
  "browAngle"
]), Tt = (t, e, n) => {
  const a = Math.min(1, Math.max(0, (n - t) / (e - t)));
  return a * a * (3 - 2 * a);
};
function Bn(t, e) {
  const n = Math.floor(t), a = t - n, o = (l) => {
    const h = Math.sin((l + e * 57.3) * 127.1) * 43758.5453;
    return h - Math.floor(h);
  }, i = a * a * (3 - 2 * a);
  return (o(n) * (1 - i) + o(n + 1) * i) * 2 - 1;
}
const ze = (t, e) => Bn(t, e) * 0.7 + Bn(t * 2.3, e + 9) * 0.3, Ie = (t, e, n) => Math.max(e, Math.min(n, t)), Kn = {
  normal: { label: "Neutral", p: {} },
  smile: { label: "Smile", p: { eyeOpen: 0, eyeSmile: 1, blush: 0.35, browY: 0.2 } },
  shy: { label: "Blush", p: { eyeOpen: 0.78, eyeSmile: 0.5, blush: 1, browAngle: -0.5, browY: -0.1, glance: [0.7, 0.35] } },
  jito: { label: "Half-lidded", p: { eyeOpen: 0.5, browY: -0.5, browAngle: 0.6 } },
  surprise: { label: "Surprise", p: { eyeOpen: 1.22, browY: 1, mouthOpen: 0.6, mouthForm: 0.6 } },
  wink: { label: "Wink", p: { eyeOpenL: 0, eyeSmileL: 1, blush: 0.3 } },
  // talking faces for AITuber OnAir emotion tags: eyes stay mostly open (closed / ^^ eyes are
  // what a single image fakes worst, and they would stay shut for a whole sentence)
  happyTalk: { label: "happy", p: { eyeOpen: 0.8, eyeSmile: 0.45, blush: 0.35, browY: 0.25, mouthForm: -0.5 } },
  sadTalk: { label: "sad", p: { eyeOpen: 0.78, browAngle: -0.8, browY: -0.2, mouthForm: 0.3, glance: [0, -0.35] } },
  angryTalk: { label: "angry", p: { eyeOpen: 0.72, browAngle: 0.85, browY: -0.55, mouthForm: 0.2 } },
  surprisedTalk: { label: "surprised", p: { eyeOpen: 1.18, browY: 0.9, mouthForm: 0.9 } },
  relaxedTalk: { label: "relaxed", p: { eyeOpen: 0.82, eyeSmile: 0.35, blush: 0.15, browY: 0.1 } }
}, In = {
  happy: ["happyTalk", "nod"],
  sad: ["sadTalk", "sigh"],
  angry: ["angryTalk", "no"],
  surprised: ["surprisedTalk", "surprise"],
  relaxed: ["relaxedTalk", "sway"],
  neutral: ["normal", null]
}, ho = {
  gazeX: [260, 0.9],
  gazeY: [260, 0.9],
  angleX: [55, 0.72],
  angleY: [55, 0.72],
  angleZ: [45, 0.75],
  bodyAngleX: [14, 0.9],
  bodyAngleZ: [12, 0.9],
  armAngle: [20, 0.85],
  handAngle: [30, 0.8]
};
class uo {
  /** @param {number[]} gazeCenter */
  constructor(e) {
    this.mode = "auto", this.P = Object.fromEntries(Et.map((n) => [n.id, n.def])), this.manual = { ...this.P }, this.cur = { ...this.P }, this.vel = Object.fromEntries(Et.map((n) => [n.id, 0])), this.expr = "normal", this.exprMix = {}, this.t = 0, this.blink = { t: 0, start: 1.5, double: !1 }, this.gaze = { x: 0, y: 0, next: 0 }, this.tap = { next: 4, until: -1 }, this.pointer = null, this.faceCenter = [...e], this.lipOpen = null, this.lipForm = 0, this.speaking = !1, this.voice = 0, this.mouth = 0, this.vowel = "a", this.vowelForm = 0, this.lipSync = On(), this.lipMotion = Fn(this.lipSync), this.syllableArmed = !0, this.voicePeak = 0, this.voiceTrough = 0, this.kana = null, this.lipHold = null, this.emotionUntil = 0, this.talkGain = 1, this.play = null, this.autoMotion = !0, this.nextAuto = 14, this.autoIdle = !0, this.nextIdle = 3, this.lastAuto = null, this.onMotion = null;
  }
  setExpression(e) {
    this.expr = e;
  }
  hasMotion(e) {
    return e in Xt;
  }
  // ---- speech (driven from outside, e.g. by the TTS audio analyser) ----
  setVoiceLevel(e) {
    this.voice = Math.min(1, Math.max(0, Number(e) || 0));
  }
  setLipSync(e) {
    this.lipSync = On(e, this.lipSync), this.lipMotion = Fn(this.lipSync);
  }
  setSpeaking(e) {
    e !== this.speaking && (this.speaking = !!e, e || (this.emotionUntil = this.t + 1.2, this.voice = 0));
  }
  /** `playMotion: false` changes only the face (a caller that picks motions itself). */
  setEmotion(e, { playMotion: n = !0 } = {}) {
    const a = In[e] ?? In.neutral;
    this.expr = a[0], this.emotionUntil = 1 / 0, a[1] && n && this.playMotion(a[1]);
  }
  /** Mouth shapes from kana text, without audio (preview / tuning). */
  /** @param {string} text @param {{ speed?: number, loop?: boolean }} [options] */
  speakKana(e, { speed: n, loop: a = !1 } = {}) {
    this.lipHold = null;
    const o = ro(e, n === void 0 ? 0.14 : 1 / Ie(Number(n) || 7, 4, 12));
    this.kana = o.length ? { moras: o, t: 0, loop: a, duration: o.reduce((i, l) => i + l.dur, 0) } : null;
  }
  holdMouth(e) {
    this.kana = null, this.lipHold = Object.hasOwn(gt, e) ? e : null;
  }
  stopLipSync() {
    this.kana = null, this.lipHold = null, this.lipOpen = null, this.mouth = 0;
  }
  getLipSyncState() {
    return { active: this.kana !== null || this.lipHold !== null, open: this.P.mouthOpen, form: this.P.mouthForm };
  }
  // Mouth from the TTS loudness. A volume signal has no vowel information, so each syllable
  // (the voice dipping and rising again) gets one vowel at random, weighted towards a, and
  // keeps it until the next syllable: the drawn mouths must not change shape mid-syllable.
  // Syllables are found relative to the recent peak (not an absolute level), and the mouth
  // is scaled by where the voice sits between the recent trough and peak, so it closes in
  // the dip before each mora even when a loud voice never gets quiet.
  speechMouth(e) {
    if (this.kana || this.lipHold) {
      let f;
      if (this.lipHold ? f = gt[this.lipHold] : (this.kana.t += e, this.kana.loop && (this.kana.t %= this.kana.duration), f = io(this.kana.moras, this.kana.t, this.lipSync.granularity)), !f)
        return this.kana = null, this.mouth > 0.01 ? [this.mouth *= this.lipSync.closeSpeed === 0.5 ? 0.6 : Math.exp(-e * this.lipMotion.kanaRelease), this.vowelForm] : null;
      const w = this.lipMotion.openness === 1 ? f.open : Math.min(1, f.open * this.lipMotion.openness), A = w > this.mouth ? 1 - Math.exp(-e * 30) : 1 - Math.exp(-e * this.lipMotion.kanaRelease);
      return this.mouth += (w - this.mouth) * A, f.form !== null && (this.vowelForm = f.form), [this.mouth, this.vowelForm];
    }
    const n = this.speaking ? this.voice : 0, a = 1 - Math.exp(-e * this.lipMotion.relax);
    this.voicePeak = n > this.voicePeak ? n : this.voicePeak + (n - this.voicePeak) * a, this.voiceTrough = n < this.voiceTrough ? n : this.voiceTrough + (n - this.voiceTrough) * a;
    const o = Math.max(this.voicePeak, 0.05);
    if (n < o * this.lipMotion.arm) this.syllableArmed = !0;
    else if (this.syllableArmed && n > o * this.lipMotion.trigger && n > 0.1) {
      this.syllableArmed = !1;
      const f = Math.random();
      this.vowel = f < 0.4 ? "a" : f < 0.58 ? "o" : f < 0.74 ? "e" : f < 0.88 ? "i" : "u";
    }
    const i = this.voicePeak - this.voiceTrough, l = i < o * this.lipMotion.range ? 1 : Math.max(0, (n - this.voiceTrough) / i), h = gt[this.vowel ?? "a"], d = Math.min(1, Math.pow(n, 0.7) * 1.15) * Math.pow(l, this.lipMotion.risePower), v = this.speaking ? Math.min(0.95, d) * (0.45 + 0.55 * h.open / 0.9) : 0, p = this.lipMotion.openness === 1 ? v : Math.min(1, v * this.lipMotion.openness), c = p > this.mouth ? 1 - Math.exp(-e * 40) : 1 - Math.exp(-e * this.lipMotion.audioRelease);
    return this.mouth += (p - this.mouth) * c, this.speaking && (this.vowelForm = h.form), this.speaking || this.mouth > 0.01 ? [this.mouth, this.vowelForm] : null;
  }
  // Breathing: inhale ~40% of the cycle, a slower exhale, a short pause at the bottom,
  // and a period that drifts between ~3.2 and 4.6 s so it never looks metronomic.
  breathValue(e) {
    this.breathPhase = (this.breathPhase ?? 0) + e / (this.breathPeriod ?? 3.8), this.breathPhase >= 1 && (this.breathPhase -= 1, this.breathPeriod = 3.2 + Math.random() * 1.4);
    const n = this.breathPhase;
    return n < 0.4 ? Tt(0, 0.4, n) : n < 0.88 ? 1 - Tt(0.4, 0.88, n) : 0;
  }
  // pick one at random, never the one that just played
  playRandom(e) {
    const n = e.filter((a) => a !== this.lastAuto);
    this.playMotion(n[Math.floor(Math.random() * n.length)]);
  }
  playMotion(e) {
    this.lastAuto = e, this.play = { id: e, t: 0 }, this.onMotion?.(e);
  }
  blinkValue(e) {
    const n = this.blink;
    if (n.t += e, n.t < n.start) return 1;
    const a = (n.t - n.start) / 0.17;
    return a >= 1 ? (n.double ? (n.double = !1, n.start = n.t + 0.07) : (n.start = n.t + 1.8 + Math.random() * 4.2, n.double = Math.random() < 0.18), 1) : a < 0.45 ? 1 - a / 0.45 : (a - 0.45) / 0.55;
  }
  update(e) {
    this.t += e;
    const n = this.t, a = {};
    for (const A of Et) a[A.id] = A.def;
    if (this.mode === "manual")
      Object.assign(a, this.manual);
    else if (this.mode === "auto") {
      if (a.angleX = ze(n * 0.18, 1) * 10 + this.gaze.x * 11, a.angleY = ze(n * 0.15, 2) * 6 - 1 + this.gaze.y * 7, a.angleZ = ze(n * 0.12, 3) * 10, a.bodyAngleX = ze(n * 0.1, 4) * 5, a.bodyAngleZ = ze(n * 0.09, 5) * 4, a.armAngle = ze(n * 0.14, 6) * 5, a.handAngle = ze(n * 0.21, 7) * 5, n > this.gaze.next) {
        const A = Math.random();
        this.gaze.x = A < 0.45 ? 0 : (Math.random() * 2 - 1) * 0.8, this.gaze.y = A < 0.45 ? 0 : (Math.random() * 2 - 1) * 0.5, this.gaze.next = n + 0.8 + Math.random() * 2.5;
      }
      if (a.gazeX = this.gaze.x + a.angleX / 60, a.gazeY = this.gaze.y + a.angleY / 60, n > this.tap.next && (this.tap.until = n + 1.1, this.tap.next = n + 5 + Math.random() * 6), this.speaking) {
        this.nextIdle = Math.max(this.nextIdle, n + 2.5), this.nextAuto = Math.max(this.nextAuto, n + 6);
        const A = this.talkGain;
        this.talkNod = (this.talkNod ?? 0) + (this.voice * 7 * A - (this.talkNod ?? 0)) * Math.min(1, e * 6), a.angleY -= this.talkNod, a.angleX += ze(n * 0.6, 11) * 5 * A, a.angleZ += ze(n * 0.5, 12) * 4 * A;
      }
      !this.speaking && n > this.emotionUntil && (this.expr = "normal", this.emotionUntil = 1 / 0), this.speaking || (!this.play && this.autoMotion && n > this.nextAuto ? (this.playRandom(Object.keys(fn).filter((A) => A !== "surprise")), this.nextAuto = n + 15 + Math.random() * 10, this.nextIdle = Math.max(this.nextIdle, n + 5)) : !this.play && this.autoIdle && n > this.nextIdle && (this.playRandom(Object.keys(mn)), this.nextIdle = n + 5 + Math.random() * 5));
    } else if (this.mode === "mouse" && this.pointer) {
      const A = (this.pointer[0] - this.faceCenter[0]) / 500, u = (this.pointer[1] - this.faceCenter[1]) / 500;
      a.angleX = Ie(A * 30, -30, 30), a.angleY = Ie(-u * 30, -30, 30), a.angleZ = Ie(-A * u * 25, -12, 12), a.bodyAngleX = Ie(A * 10, -10, 10) * 0.6, a.gazeX = Ie(A * 1.4, -1, 1), a.gazeY = Ie(-u * 1.4, -1, 1), a.handAngle = Ie(A * 4, -5, 5);
    }
    this.mode !== "manual" && (a.breath = this.breathValue(e), n < this.tap.until && (a.fingerTap = Math.max(0, Math.sin((this.tap.until - n) * Math.PI * 3.6)) ** 2));
    let o = null, i = 0;
    if (this.play) {
      const A = Xt[this.play.id];
      if (this.play.t += e, this.play.t >= A.dur)
        this.play = null, this.onMotion?.(null);
      else {
        o = {};
        for (const [u, y] of Object.entries(A.tracks))
          o[u] = Qa(y, this.play.t) * (A.idle && lo.test(u) ? Cn.amp : 1);
        i = Tt(0, 0.15, this.play.t) * (1 - Tt(A.dur - 0.25, A.dur, this.play.t));
        for (const [u, y] of Object.entries(o))
          Ka.has(u) ? a[u] += y : u === "breath" ? a[u] += (y - a[u]) * i : co.has(u) || (a[u] = Math.max(a[u], Math.max(0, y)));
      }
    }
    this.mode !== "manual" && (a.angleY += a.breath * 1.6);
    const l = Kn[this.expr].p, h = ["eyeOpen", "eyeOpenL", "eyeSmileL", "eyeSmile", "mouthOpen", "mouthForm", "blush", "browY", "browAngle", "gx", "gy"], d = {
      eyeOpen: l.eyeOpen ?? 1,
      eyeOpenL: l.eyeOpenL ?? l.eyeOpen ?? 1,
      eyeSmileL: l.eyeSmileL ?? l.eyeSmile ?? 0,
      eyeSmile: l.eyeSmile ?? 0,
      mouthOpen: l.mouthOpen ?? 0,
      mouthForm: l.mouthForm ?? 0,
      blush: l.blush ?? 0,
      browY: l.browY ?? 0,
      browAngle: l.browAngle ?? 0,
      gx: l.glance?.[0] ?? 0,
      gy: l.glance?.[1] ?? 0
    }, v = 1 - Math.exp(-e * 9);
    for (const A of h)
      this.exprMix[A] === void 0 && (this.exprMix[A] = d[A]), this.exprMix[A] += (d[A] - this.exprMix[A]) * v;
    const p = this.exprMix, c = {};
    for (const A of Et) {
      const u = A.id;
      if (this.mode === "manual" && !o) {
        c[u] = a[u], this.cur[u] = a[u], this.vel[u] = 0;
        continue;
      }
      let [y, m] = ho[u] ?? [120, 0.95];
      o && /^angle|^body/.test(u) && (Xt[this.play?.id ?? ""]?.idle ? (y *= Cn.stiff, m = 0.8) : /^angle/.test(u) && (y *= 4.5, m = 0.75));
      const r = 2 * Math.sqrt(y) * m;
      this.vel[u] += (y * (a[u] - this.cur[u]) - r * this.vel[u]) * e, this.cur[u] += this.vel[u] * e, c[u] = this.cur[u];
    }
    let f = 1;
    if (this.mode !== "manual" ? (f = this.blinkValue(e), c.eyeROpen = p.eyeOpen * f, c.eyeLOpen = p.eyeOpenL * f, c.eyeSmile = p.eyeSmile, c.eyeSmileL = p.eyeSmileL, c.mouthOpen = p.mouthOpen, c.mouthForm = p.mouthForm, c.blush = p.blush, c.browY = p.browY + (c.angleY > 0 ? c.angleY / 60 : 0) - (1 - f) * 0.18, c.browAngle = p.browAngle, c.gazeX = Ie(c.gazeX + p.gx, -1, 1), c.gazeY = Ie(c.gazeY + p.gy, -1, 1)) : c.eyeSmileL = c.eyeSmile, o) {
      const A = (y, m) => {
        c[y] += (m - c[y]) * i;
      }, u = (y) => Math.min(1.3, Math.max(0, y));
      "eyeOpen" in o && (A("eyeROpen", u(o.eyeOpen) * f), "eyeOpenL" in o || A("eyeLOpen", u(o.eyeOpen) * f)), "eyeOpenL" in o && A("eyeLOpen", u(o.eyeOpenL) * f), "eyeSmile" in o && (A("eyeSmile", o.eyeSmile), "eyeSmileL" in o || A("eyeSmileL", o.eyeSmile)), "eyeSmileL" in o && A("eyeSmileL", o.eyeSmileL);
      for (const y of ["mouthOpen", "mouthForm", "blush", "browY", "browAngle"])
        y in o && A(y, y === "mouthOpen" || y === "blush" ? Math.max(0, o[y]) : o[y]);
    }
    const w = this.speechMouth(e);
    return w ? (this.lipOpen = w[0], this.lipForm = w[1]) : this.lipOpen !== null && !this.speaking && !this.kana && (this.lipOpen = null), this.lipOpen !== null && (c.mouthOpen = Math.max(c.mouthOpen * 0.3, this.lipOpen), c.mouthForm = Ie(this.lipForm, -1, 1)), this.P = c, c;
  }
}
const pn = {
  neutral: "normal",
  smile: "smile",
  shy: "shy",
  surprise: "surprise",
  halfLidded: "jito",
  angry: "angryTalk",
  sad: "sadTalk",
  wink: "wink"
}, fo = { sad: { pitch: -6, gy: -0.45 } }, ht = (t, e, n) => Math.max(e, Math.min(n, t)), ut = Object.freeze({ eyeOpen: 1, eyeOpenL: 1, eyeSmile: 0, eyeSmileL: 0, blush: 0, browY: 0, browAngle: 0, mouthOpen: 0, gx: 0, gy: 0, pitch: 0 });
function mo(t) {
  const e = Kn[pn[t]]?.p ?? {}, n = fo[t] ?? {};
  return {
    eyeOpen: e.eyeOpen ?? 1,
    eyeOpenL: e.eyeOpenL ?? e.eyeOpen ?? 1,
    eyeSmile: e.eyeSmile ?? 0,
    eyeSmileL: e.eyeSmileL ?? e.eyeSmile ?? 0,
    blush: e.blush ?? 0,
    browY: e.browY ?? 0,
    browAngle: e.browAngle ?? 0,
    mouthOpen: e.mouthOpen ?? 0,
    gx: e.glance?.[0] ?? 0,
    gy: n.gy ?? e.glance?.[1] ?? 0,
    pitch: n.pitch ?? 0
  };
}
function po(t, e) {
  const n = { ...t };
  return n.eyeROpen = (t.eyeROpen ?? 1) * e.eyeOpen, n.eyeLOpen = (t.eyeLOpen ?? 1) * e.eyeOpenL, n.eyeSmile = Math.max(t.eyeSmile ?? 0, e.eyeSmile), n.eyeSmileL = Math.max(t.eyeSmileL ?? t.eyeSmile ?? 0, e.eyeSmileL), n.blush = Math.max(t.blush ?? 0, e.blush), n.browY = ht((t.browY ?? 0) + e.browY, -1, 1), n.browAngle = ht((t.browAngle ?? 0) + e.browAngle, -1, 1), n.mouthOpen = Math.max(t.mouthOpen ?? 0, e.mouthOpen), n.gazeX = ht((t.gazeX ?? 0) + e.gx, -1, 1), n.gazeY = ht((t.gazeY ?? 0) + e.gy, -1, 1), n.angleY = ht((t.angleY ?? 0) + e.pitch, -30, 30), n;
}
class yo {
  /** @type {keyof typeof OVERLAY_EXPRESSIONS} */
  name = "neutral";
  mix = { ...ut };
  /** @param {string} name */
  set(e) {
    this.name = Object.hasOwn(pn, e) ? (
      /** @type {keyof typeof OVERLAY_EXPRESSIONS} */
      e
    ) : "neutral";
  }
  /** True while an expression is shown or still fading out. */
  get active() {
    return this.name !== "neutral" || Object.keys(ut).some((e) => Math.abs(this.mix[e] - ut[e]) > 1e-3);
  }
  apply(e, n) {
    if (!this.active)
      return this.mix = { ...ut }, e;
    const a = mo(this.name), o = 1 - Math.exp(-Math.max(0, n) * 12);
    for (const i of Object.keys(ut)) this.mix[i] += (a[i] - this.mix[i]) * o;
    return po(e, this.mix);
  }
}
const Yn = ["sclera", "iris", "pupil", "highlight"];
function Un(t, e) {
  return (Yn.every((n) => t[`eye${e}_${n}`]) ? [...Yn, ...t[`eye${e}_highlight_low`] ? ["highlight_low"] : []] : ["ball"]).concat(["low", "crease", "lash"], t["eye" + e + "_closed_normal"] ? ["closed_normal"] : []);
}
const go = ["ball", "low", "crease", "lash"], Nt = /* @__PURE__ */ new Map(), zt = /* @__PURE__ */ new Map();
async function jn(t) {
  return zt.has(t) || zt.set(t, fetch(t).then((e) => {
    if (!e.ok) throw new Error(`failed to load ${t}`);
    return e.json();
  })), zt.get(t);
}
function Dt(t) {
  if (Nt.has(t)) return Nt.get(t);
  const e = new Promise((n, a) => {
    const o = new Image();
    o.onload = () => n(o), o.onerror = () => a(new Error(`failed to load ${t}`)), o.src = t;
  });
  return Nt.set(t, e), e;
}
function Kt(t, e) {
  const n = document.createElement("canvas");
  n.width = t.width, n.height = t.height;
  const a = n.getContext("2d");
  a.drawImage(t, 0, 0);
  const o = a.getImageData(0, 0, n.width, n.height).data, i = new Uint8Array(n.width * n.height);
  for (let l = 0; l < i.length; l++) i[l] = o[l * 4 + e];
  return i;
}
const Qe = (t) => Kt(t, 3);
function bo(t, e) {
  const [n, a] = t.t.pivot, o = t.dir, i = t.pts, l = (w, A, u) => {
    const y = Math.min(1, Math.max(0, (u - w) / (A - w)));
    return y * y * (3 - 2 * y);
  }, h = Math.cos(t.phi[0]), d = Math.sin(t.phi[0]), v = Math.cos(t.phi[1]), p = Math.sin(t.phi[1]), c = e.rest, f = e.pos;
  for (let w = 0; w < c.length; w += 2) {
    const A = c[w] - n, u = c[w + 1] - a, y = A * o[0] + u * o[1], m = i[0][0] + A * h - u * d, r = i[0][1] + A * d + u * h, s = A - o[0] * t.L1, x = u - o[1] * t.L1, g = i[1][0] + s * v - x * p, E = i[1][1] + s * p + x * v, M = l(t.L1 * 0.55, t.L1 * 1.35, y);
    f[w] = m + (g - m) * M, f[w + 1] = r + (E - r) * M;
  }
}
async function vo(t, e) {
  if (!e.assets && e.assetsBase === void 0)
    throw new Error("createMeshAvatar requires assets or assetsBase.");
  const n = e.rig, a = Sa(n), {
    IMG: o,
    EYES: i,
    baseWeights: l,
    deformBase: h,
    eyePartY: d,
    eyePartAlpha: v,
    handWeights: p,
    handFrame: c,
    deformHand: f,
    TASSELS: w
  } = a, { Renderer: A, buildGrid: u } = ja(a, n), { Physics: y } = Za(a, n), { createSprites: m } = Ga(a, n), r = (e.assetsBase ?? "").replace(/\/?$/, "/"), s = (b, _) => {
    if (e.assets) {
      if (!e.assets[b]) throw new Error(`Missing project asset: ${b}`);
      return e.assets[b];
    }
    return `${r}${b}${_ === void 0 ? "" : `?b=${_}`}`;
  }, x = await jn(s("layers.json")), g = n.layered?.parts ?? [], E = [0, 1].flatMap((b) => [`eye${b}_window`, `eye${b}_window_half`]).filter((b) => x.layers[b]), M = ["base", ...n.hand ? ["hand"] : [], ...w.map((b) => b.name), ...[0, 1].flatMap((b) => [.../* @__PURE__ */ new Set([...go, ...Un(x.layers, b)])].map((_) => `eye${b}_${_}`)), ...E, "hairmask", ...g.map((b) => b.name), ...new Set(g.map((b) => b.motionMask).filter(Boolean)), ...new Set(g.map((b) => b.sourceMatte).filter(Boolean))], k = Object.fromEntries(await Promise.all(M.map(async (b) => [b, await Dt(s(`${b}.png`, x.build))]))), Y = Object.fromEntries(await Promise.all(M.filter((b) => x.layers[`${b}_hd`]).map(async (b) => [b, await Dt(s(`${b}_hd.png`, x.build))]))), X = Kt(k.hairmask, 0), F = (b, _) => X[Math.min(o.h - 1, Math.max(0, Math.round(_))) * o.w + Math.min(o.w - 1, Math.max(0, Math.round(b)))] / 255, U = new A(t, { padTop: e.padTop ?? n.view.padTop, padSide: e.padSide ?? n.view.padSide, fit: e.fit }), B = { base: [0, 0, o.w, o.h], ...x.layers }, Z = u(B.base, n.mesh.baseCell, Qe(k.base), k.base.width, n.mesh.fine), q = [];
  for (let b = 0; b < Z.rest.length / 2; b++) {
    const _ = Z.rest[b * 2], T = Z.rest[b * 2 + 1];
    q.push(l(_, T, F(_, T)));
  }
  const j = U.addLayer("base", k.base, Z, { face: !0 });
  j.visible = !n.layered;
  const D = [];
  function G(b) {
    for (const _ of g.filter((T) => T.stage === b)) {
      const T = u(B[_.name], _.meshCell, _.solidGrid ? new Uint8Array([255]) : Qe(k[_.name]), _.solidGrid ? 1 : k[_.name].width), S = [];
      for (let C = 0; C < T.rest.length; C += 2) S.push(l(T.rest[C], T.rest[C + 1], _.kind === "hair" ? 1 : 0));
      if (_.motionMask) {
        const C = Kt(k[_.motionMask], 0), W = B[_.motionMask], K = k[_.motionMask].width, oe = k[_.motionMask].height;
        for (let V = 0; V < S.length; V++) {
          const ee = Math.min(K - 1, Math.max(0, Math.round((T.rest[V * 2] - W[0]) / W[2] * K))), fe = Math.min(oe - 1, Math.max(0, Math.round((T.rest[V * 2 + 1] - W[1]) / W[3] * oe)));
          S[V].motion = C[fe * K + ee] / 255;
        }
      }
      const z = U.addLayer(_.name, Y[_.name] ?? k[_.name], T, { face: _.kind === "face" });
      if(_.sourceUvRect)z.textureRect=_.sourceUvRect;if(_.sourceMatte)z.sourceMatteTex=U.texture(k[_.sourceMatte]);
      D.push({ part: _, mesh: T, W: S, layer: z });
    }
  }
  G("back");
  const P = [];
  i.forEach((b, _) => {
    for (const T of Un(x.layers, _)) {
      const S = `eye${_}_${T}`, z = ["sclera", "iris", "pupil", "highlight", "highlight_low"].includes(T), C = z ? new Uint8Array(k[S].width * k[S].height).fill(255) : Qe(k[S]), W = u(B[S], T === "ball" || z ? n.mesh.eyeBallCell : n.mesh.eyeCell, C, k[S].width), K = [];
      for (let ee = 0; ee < W.rest.length / 2; ee++) K.push(l(W.rest[ee * 2], W.rest[ee * 2 + 1], 0));
      const oe = z && E.includes(`eye${_}_window_half`) ? ["window", "window_half"].map((ee) => ({ image: k[`eye${_}_${ee}`], rect: B[`eye${_}_${ee}`] })) : void 0, V = U.addLayer(S, Y[S] ?? k[S], W, { eyeBall: T === "ball" ? _ : void 0, splitEye: z ? _ : void 0, fixedEye: T === "sclera", eyeWindows: oe });
      P.push({ e: b, eye: _, part: T, mesh: W, W: K, layer: V });
    }
  });
  let ce = null;
  try {
    {
      const b = await jn(s("sprites/sprites.json")), _ = Object.fromEntries(await Promise.all(Object.keys(b.layers).map(async (T) => [T, await Dt(s(`sprites/${T}.png`, b.build))])));
      ce = m(U, b, _, u, Qe);
    }
  } catch (b) {
    console.warn("eye / mouth sprites not loaded:", b);
  }
  G("front");
  const re = w.map((b) => {
    const _ = u(B[b.name], n.mesh.tasselCell, Qe(k[b.name]), k[b.name].width);
    return U.addLayer(b.name, k[b.name], _);
  }), I = n.hand ? u(B.hand, n.mesh.handCell, Qe(k.hand), k.hand.width) : { rest: [], pos: [] }, Q = [];
  for (let b = 0; b < I.rest.length / 2; b++) Q.push(p(I.rest[b * 2], I.rest[b * 2 + 1]));
  n.hand && U.addLayer("hand", k.hand, I);
  const H = new y(), N = qa(n.layered?.bodyFollow), $ = new uo(n.view.gazeCenter ?? [n.head.cx, n.head.cy]);
  e.lipSync !== void 0 && $.setLipSync(e.lipSync);
  const ne = /* @__PURE__ */ new Set();
  $.onMotion = (b) => {
    for (const _ of ne) _(b);
  };
  let ue = {}, te = 1, ie = {};
  const ae = new yo(), se = [0, 0];
  function le(b) {
    const _ = { ...$.update(b) };
    for (const [S, z] of Object.entries(ue)) _[S] = te === 1 ? z : (_[S] ?? 0) + (z - (_[S] ?? 0)) * te;
    $.lipOpen !== null && (_.mouthOpen = $.P.mouthOpen, (!e.preserveMouthForm || ue.mouthForm === void 0) && (_.mouthForm = $.P.mouthForm));
    const T = ae.apply(_, b);
    return ie = T, T;
  }
  let be = {};
  function ve(b) {
    const _ = performance.now(), T = N(le(b), b), S = H.step(T, b), z = performance.now(), C = Z.pos, W = Z.rest;
    for (let J = 0; j.visible && J < q.length && !n.layered; J++)
      h(W[J * 2], W[J * 2 + 1], q[J], T, S, se), C[J * 2] = se[0], C[J * 2 + 1] = se[1];
    for (const { part: J, mesh: Me, W: Je, layer: at } of D)
      if (at.alpha = J.opacityParameter ? Math.min(1, Math.max(0, T[J.opacityParameter] ?? 1)) : 1, !(at.alpha < 1e-3))
        for (let Ue = 0; Ue < Je.length; Ue++)
          deformHalloween(a, Me.rest[Ue * 2], Me.rest[Ue * 2 + 1], Je[Ue], T, S, J, se), Me.pos[Ue * 2] = se[0], Me.pos[Ue * 2 + 1] = se[1];
    const K = (J) => n.layered?.continuousBlink ? Math.max(0, Math.min(1, J)) : ce ? 1 : J;
    for (const J of P) {
      const Me = K(J.eye === 0 ? T.eyeROpen : T.eyeLOpen), Je = J.eye === 0 ? T.eyeSmile : T.eyeSmileL ?? T.eyeSmile;
      if (J.layer.blinkOpen = Me, J.layer.alpha = v(J.part, Me, Je), n.layered?.continuousBlink) {
        J.part === "crease" && (J.layer.alpha *= Math.max(0, Math.min(1, (Me - 0.65) / 0.3))), J.part === "low" && (J.layer.alpha = 0);
        const Be = Math.max(0, Math.min(1, (Me - 0.12) / 0.1)), ot = (1 - Be * Be * (3 - 2 * Be)) * (1 - Je);
        J.part === "closed_normal" ? J.layer.alpha = ot : J.part === "lash" && (J.layer.alpha *= 1 - ot);
      }
      const at = J.mesh.rest, Ue = J.mesh.pos;
      for (let Be = 0; Be < J.W.length; Be++) {
        const ot = at[Be * 2], fa = at[Be * 2 + 1];
        a.deformEye(J.eye, ot, d(J.e, J.part, ot, fa, Me, Je), J.W[Be], T, S, se, J.part), Ue[Be * 2] = se[0], Ue[Be * 2 + 1] = se[1];
      }
    }
    const oe = ce?.update(T, S, b, Ja(ae.name, $.mode === "manual" ? null : $.expr));
    if (oe) for (const J of P)
      if (n.layered?.cleanEyeTransitions) {
        const Me = J.layer.splitEye !== void 0;
        J.layer.alpha *= Me ? oe.ballAlpha?.[J.eye] ?? oe.openAlpha[J.eye] : oe.openAlpha[J.eye], J.layer.eyeWindowIndex = oe.eyeWindowIndex?.[J.eye] ?? 0;
      } else oe.eyes[J.eye] && (J.layer.alpha = 0);
    const V = I.pos, ee = I.rest, fe = c(T);
    for (let J = 0; J < Q.length; J++)
      f(ee[J * 2], ee[J * 2 + 1], Q[J], T, fe, se), V[J * 2] = se[0], V[J * 2 + 1] = se[1];
    H.chains.forEach((J, Me) => bo(J, re[Me].mesh));
    const pe = 7, Re = performance.now();
    U.draw({
      finMotion: S.finMotion,
      hwReviewGroup:T.hwReviewGroup??"all",
      hwLanternLight:T.hwLanternLight??.5,
      eyeDetails: S.eyeDetails,
      angleX: T.angleX,
      angleY: T.angleY,
      angleZ: T.angleZ,
      eyeBounce: [0, 1].map((J) => (S.eyes?.[J][1] ?? 0) / Math.max(0.01, n.layered?.eyeSpring?.max ?? 1) * (n.layered?.eyeSpring?.blinkSquash ?? 0)),
      eyeInertia: [0, 1].flatMap((J) => S.eyes?.[J] ?? [0, 0]),
      eyes: [
        K(T.eyeROpen),
        T.eyeSmile,
        T.gazeX * pe + (S.eyes?.[0][0] ?? 0),
        -T.gazeY * pe * 0.6 + (S.eyes?.[0][1] ?? 0),
        K(T.eyeLOpen),
        T.eyeSmileL ?? T.eyeSmile,
        T.gazeX * pe * 0.85 + (S.eyes?.[1][0] ?? 0),
        -T.gazeY * pe * 0.6 + (S.eyes?.[1][1] ?? 0)
      ],
      // with sprites the drawn mouths replace the shader-painted one
      mouthOpen: ce ? 0 : T.mouthOpen,
      mouthForm: T.mouthForm,
      cheek: T.blush,
      faceShade: T.faceShade ?? 0,
      showMesh: !1,
      originalAlpha: 0,
      joints: []
    }), be = { physics: z - _, geometry: Re - z, webgl: performance.now() - Re };
  }
  let Ae = 0, Oe = performance.now(), R = !1;
  const O = (b) => {
    const _ = Math.min(0.05, (b - Oe) / 1e3);
    Oe = b, ve(_), Ae = requestAnimationFrame(O);
  };
  return e.manual || (Ae = requestAnimationFrame(O)), {
    motions: [
      ...Object.entries(fn).map(([b, _]) => ({ id: b, label: _.label, idle: !1 })),
      ...Object.entries(mn).map(([b, _]) => ({ id: b, label: _.label, idle: !0 }))
    ],
    setParameters(b, _ = 1) {
      ue = { ...b }, te = Math.min(1, Math.max(0, Number(_) || 0));
    },
    getParameters() {
      return { ...ie };
    },
    /** 0..1 loudness of the voice being played (e.g. normalised RMS). */
    setVoiceLevel(b) {
      $.setVoiceLevel(b);
    },
    /** Partial mouth-movement settings; omitted fields retain their current values. */
    setLipSync(b) {
      $.setLipSync(b);
    },
    /** true while TTS audio is playing: idle motions pause and the head nods along. */
    setSpeaking(b) {
      $.setSpeaking(b);
    },
    /** AITuber OnAir emotion tag: happy / sad / angry / surprised / relaxed / neutral (or null). */
    setEmotion(b, _) {
      $.setEmotion(b, _);
    },
    /** Live expression layered over tracking (see OVERLAY_EXPRESSIONS); 'neutral' clears it. */
    setExpression(b) {
      ae.set(b);
    },
    getExpression() {
      return { name: ae.name, active: ae.active };
    },
    /** How much the head moves with the voice while speaking (1 = default, calmer below). */
    setTalkGain(b) {
      $.talkGain = Math.max(0, Number(b) || 0);
    },
    /** Play a motion or idle motion by id (see `motions`). */
    play(b) {
      $.hasMotion(b) && $.playMotion(b);
    },
    /** Move the mouth through the vowels of kana text (no audio; for previews). */
    speakKana(b, _) {
      $.speakKana(String(b ?? ""), _);
    },
    holdMouth(b) {
      $.holdMouth(b);
    },
    stopLipSync() {
      $.stopLipSync();
    },
    getLipSyncState() {
      return $.getLipSyncState();
    },
    setAutoIdle(b) {
      $.autoIdle = !!b;
    },
    setLighting(b) {
      U.setLighting(b);
    },
    getLightingStats() {
      return { ...U.lightingStats };
    },
    setAutoMotion(b) {
      $.autoMotion = !!b;
    },
    /** Hair / tassel sway multiplier (1 = default). */
    getBodyMotion() {
      return H.out.bodyMotion ?? null;
    },
    getFinMotion() {
      return H.out.finMotion ?? null;
    },
    getEyeDetails() {
      return H.out.eyeDetails ?? null;
    },
    getFrameProfile() {
      return be;
    },
    setSwayGain(b) {
      H.gain = b;
    },
    /** Called with the motion id when a motion starts and with null when it ends. */
    onMotion(b) {
      return ne.add(b), () => ne.delete(b);
    },
    /** Advance the simulation by `sec` and draw (for tests / hidden tabs). */
    advance(b, _ = 60) {
      if (!R)
        if (b === 0) ve(0);
        else for (let T = 0; T < Math.round(b * _); T++) ve(1 / _);
    },
    /** Update motion and lip sync without drawing a hidden preview. */
    advanceParameters(b) {
      R || le(b);
    },
    destroy() {
      R || (R = !0, cancelAnimationFrame(Ae), ne.clear(), U.destroy());
    }
  };
}
const qo = Object.keys(pn);
async function xo(t, e) {
  return vo(t, { ...e, rig: cn(e.rig) });
}
function nt(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error("avatar.json: expected an object");
  const e = t, n = [];
  e.format !== "mesh-avatar" && n.push('avatar.json.format: expected "mesh-avatar"'), e.version !== 1 && n.push(`avatar.json.version: unsupported version ${JSON.stringify(e.version) ?? "missing"} (expected 1)`), (typeof e.name != "string" || !e.name.trim()) && n.push("avatar.json.name: expected a non-empty string");
  const a = { format: "mesh-avatar", version: 1, name: e.name };
  for (const o of ["author", "license", "thumbnail", "source"])
    e[o] !== void 0 && (typeof e[o] != "string" ? n.push(`avatar.json.${o}: expected a string`) : a[o] = e[o]);
  if (e.studio !== void 0) {
    const o = e.studio;
    !o || typeof o != "object" || Array.isArray(o) || !("version" in o) || typeof o.version != "string" || !o.version.trim() ? n.push("avatar.json.studio.version: expected a non-empty string") : a.studio = { version: o.version };
  }
  if (e.lipSync !== void 0)
    try {
      a.lipSync = un(e.lipSync);
    } catch (o) {
      n.push(`avatar.json.lipSync: ${o instanceof Error ? o.message : String(o)}`);
    }
  if (n.length) throw new Error(n.join(`
`));
  return a;
}
function Qn(t) {
  return nt({ format: "mesh-avatar", version: 1, name: t });
}
const Ht = (t) => !!t && typeof t == "object" && !Array.isArray(t), Ve = (t, e) => Array.isArray(t) && t.length === e && t.every((n) => typeof n == "number" && Number.isFinite(n)), Pt = (t, e) => Object.hasOwn(t, e);
function ea(t) {
  const e = [];
  function n(f, w = !0) {
    if (!Pt(t, f)) {
      w && e.push(`${f}: missing file`);
      return;
    }
    const A = t[f];
    if (!(A instanceof Uint8Array)) {
      e.push(`${f}: JSON bytes are required`);
      return;
    }
    let u;
    try {
      u = JSON.parse(new TextDecoder("utf-8", { fatal: !0 }).decode(A));
    } catch {
      e.push(`${f}: invalid UTF-8 JSON`);
      return;
    }
    if (!Ht(u)) {
      e.push(`${f}: expected an object`);
      return;
    }
    return u;
  }
  function a(f, w, A = !0) {
    return f.version === 1 || A && f.version === void 0 ? !0 : (e.push(`${w}.version: unsupported version ${JSON.stringify(f.version) ?? "missing"} (expected 1)`), !1);
  }
  function o(f) {
    if (!Pt(t, f)) {
      e.push(`${f}: missing file`);
      return;
    }
    const w = t[f], A = w instanceof Uint8Array ? w.byteLength : w?.size;
    (!Number.isSafeInteger(A) || A <= 0) && e.push(`${f}: expected a non-empty file`);
  }
  function i(f, w, A, u) {
    if (!Ht(f)) {
      e.push(`${w}.layers: expected a layer rectangle map`);
      return;
    }
    for (const [y, m] of Object.entries(f)) {
      const r = `${w}.layers.${y}`;
      if (!/^[A-Za-z0-9_-]+$/.test(y)) {
        e.push(`${r}: expected a safe layer name (letters, digits, hyphens or underscores)`);
        continue;
      }
      !Ve(m, 4) || !m.every(Number.isInteger) || m[0] < 0 || m[1] < 0 || m[2] <= 0 || m[3] <= 0 ? e.push(`${r}: expected [x, y, width, height] with non-negative integer origins and positive integer dimensions`) : u && (m[0] + m[2] > u[0] || m[1] + m[3] > u[1]) && e.push(`${r}: rectangle must stay inside the image`), o(`${A}/${y}.png`);
    }
    return f;
  }
  function l(f, w) {
    (typeof f.build != "string" || !f.build.trim()) && e.push(`${w}.build: expected a non-empty string`);
  }
  const h = n("avatar.json", !1);
  if (h)
    try {
      nt(h);
    } catch (f) {
      e.push(f.message);
    }
  const d = n("rig.json");
  let v;
  if (d && a(d, "rig.json", !1)) {
    const f = Pn(d);
    e.push(...f.map((w) => `rig.json: ${w}`)), f.length || (v = d);
  }
  o("built/base.png"), o("built/hairmask.png");
  const p = n("built/layers.json");
  if (p && a(p, "built/layers.json")) {
    l(p, "built/layers.json");
    let f;
    !Ve(p.size, 2) || !p.size.every((A) => Number.isInteger(A) && A > 0) ? e.push("built/layers.json.size: expected [width, height] with positive integer dimensions") : (f = p.size, v && (f[0] !== v.image.width || f[1] !== v.image.height) && e.push("built/layers.json.size: must match rig.json.image"));
    const w = i(p.layers, "built/layers.json", "built", f);
    if (v && w) {
      const A = [
        ...v.eyes.flatMap((u, y) => ["ball", "low", "crease", "lash"].map((m) => `eye${y}_${m}`)),
        ...v.hand ? ["hand"] : [],
        ...(v.accessories ?? []).map((u) => u.name),
        ...(v.layered?.parts ?? []).map((u) => u.name)
      ];
      for (const u of A) Pt(w, u) || e.push(`built/layers.json.layers.${u}: missing required layer`);
    }
    !Array.isArray(p.eyes) || p.eyes.length !== 2 ? e.push("built/layers.json.eyes: expected two eye curves") : p.eyes.forEach((A, u) => {
      const y = `built/layers.json.eyes[${u}]`;
      if (!Ht(A)) {
        e.push(`${y}: expected an object`);
        return;
      }
      Ve([A.x0, A.x1], 2) && A.x0 < A.x1 || e.push(`${y}: expected finite x0 < x1`);
      for (const r of ["top", "bot"])
        Ve(A[r], 24) || e.push(`${y}.${r}: expected 24 finite numbers`);
      if (Ve(A.top, 24) && Ve(A.bot, 24) && A.top.some((r, s) => r > A.bot[s]) && e.push(`${y}.top: must not exceed bottom curve`), v) for (const r of ["x0", "x1", "top", "bot"]) {
        const s = A[r], x = v.eyes[u][r];
        (Array.isArray(x) ? Ve(s, x.length) && s.every((E, M) => E === x[M]) : s === x) || e.push(`${y}.${r}: must match rig.json.eyes[${u}].${r}`);
      }
    });
  }
  const c = n("built/sprites/sprites.json", !1);
  return c && a(c, "built/sprites/sprites.json") && (l(c, "built/sprites/sprites.json"), i(c.layers, "built/sprites/sprites.json", "built/sprites", v ? [v.image.width, v.image.height] : void 0)), e;
}
var xe = Uint8Array, Fe = Uint16Array, dn = Int32Array, Lt = new xe([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]), Ct = new xe([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]), Qt = new xe([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), ta = function(t, e) {
  for (var n = new Fe(31), a = 0; a < 31; ++a)
    n[a] = e += 1 << t[a - 1];
  for (var o = new dn(n[30]), a = 1; a < 30; ++a)
    for (var i = n[a]; i < n[a + 1]; ++i)
      o[i] = i - n[a] << 5 | a;
  return { b: n, r: o };
}, na = ta(Lt, 2), aa = na.b, en = na.r;
aa[28] = 258, en[258] = 28;
var oa = ta(Ct, 0), Mo = oa.b, $n = oa.r, tn = new Fe(32768);
for (var ye = 0; ye < 32768; ++ye) {
  var We = (ye & 43690) >> 1 | (ye & 21845) << 1;
  We = (We & 52428) >> 2 | (We & 13107) << 2, We = (We & 61680) >> 4 | (We & 3855) << 4, tn[ye] = ((We & 65280) >> 8 | (We & 255) << 8) >> 1;
}
var Ne = (function(t, e, n) {
  for (var a = t.length, o = 0, i = new Fe(e); o < a; ++o)
    t[o] && ++i[t[o] - 1];
  var l = new Fe(e);
  for (o = 1; o < e; ++o)
    l[o] = l[o - 1] + i[o - 1] << 1;
  var h;
  if (n) {
    h = new Fe(1 << e);
    var d = 15 - e;
    for (o = 0; o < a; ++o)
      if (t[o])
        for (var v = o << 4 | t[o], p = e - t[o], c = l[t[o] - 1]++ << p, f = c | (1 << p) - 1; c <= f; ++c)
          h[tn[c] >> d] = v;
  } else
    for (h = new Fe(a), o = 0; o < a; ++o)
      t[o] && (h[o] = tn[l[t[o] - 1]++] >> 15 - t[o]);
  return h;
}), Ze = new xe(288);
for (var ye = 0; ye < 144; ++ye)
  Ze[ye] = 8;
for (var ye = 144; ye < 256; ++ye)
  Ze[ye] = 9;
for (var ye = 256; ye < 280; ++ye)
  Ze[ye] = 7;
for (var ye = 280; ye < 288; ++ye)
  Ze[ye] = 8;
var bt = new xe(32);
for (var ye = 0; ye < 32; ++ye)
  bt[ye] = 5;
var wo = /* @__PURE__ */ Ne(Ze, 9, 0), Ao = /* @__PURE__ */ Ne(Ze, 9, 1), So = /* @__PURE__ */ Ne(bt, 5, 0), Eo = /* @__PURE__ */ Ne(bt, 5, 1), Wt = function(t) {
  for (var e = t[0], n = 1; n < t.length; ++n)
    t[n] > e && (e = t[n]);
  return e;
}, Ye = function(t, e, n) {
  var a = e / 8 | 0;
  return (t[a] | t[a + 1] << 8) >> (e & 7) & n;
}, Zt = function(t, e) {
  var n = e / 8 | 0;
  return (t[n] | t[n + 1] << 8 | t[n + 2] << 16) >> (e & 7);
}, yn = function(t) {
  return (t + 7) / 8 | 0;
}, vt = function(t, e, n) {
  return (e == null || e < 0) && (e = 0), (n == null || n > t.length) && (n = t.length), new xe(t.subarray(e, n));
}, ko = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
], Te = function(t, e, n) {
  var a = new Error(e || ko[t]);
  if (a.code = t, Error.captureStackTrace && Error.captureStackTrace(a, Te), !n)
    throw a;
  return a;
}, To = function(t, e, n, a) {
  var o = t.length, i = a ? a.length : 0;
  if (!o || e.f && !e.l)
    return n || new xe(0);
  var l = !n, h = l || e.i != 2, d = e.i;
  l && (n = new xe(o * 3));
  var v = function(ae) {
    var se = n.length;
    if (ae > se) {
      var le = new xe(Math.max(se * 2, ae));
      le.set(n), n = le;
    }
  }, p = e.f || 0, c = e.p || 0, f = e.b || 0, w = e.l, A = e.d, u = e.m, y = e.n, m = o * 8;
  do {
    if (!w) {
      p = Ye(t, c, 1);
      var r = Ye(t, c + 1, 3);
      if (c += 3, r)
        if (r == 1)
          w = Ao, A = Eo, u = 9, y = 5;
        else if (r == 2) {
          var E = Ye(t, c, 31) + 257, M = Ye(t, c + 10, 15) + 4, k = E + Ye(t, c + 5, 31) + 1;
          c += 14;
          for (var Y = new xe(k), X = new xe(19), F = 0; F < M; ++F)
            X[Qt[F]] = Ye(t, c + F * 3, 7);
          c += M * 3;
          for (var U = Wt(X), B = (1 << U) - 1, Z = Ne(X, U, 1), F = 0; F < k; ) {
            var q = Z[Ye(t, c, B)];
            c += q & 15;
            var s = q >> 4;
            if (s < 16)
              Y[F++] = s;
            else {
              var j = 0, D = 0;
              for (s == 16 ? (D = 3 + Ye(t, c, 3), c += 2, j = Y[F - 1]) : s == 17 ? (D = 3 + Ye(t, c, 7), c += 3) : s == 18 && (D = 11 + Ye(t, c, 127), c += 7); D--; )
                Y[F++] = j;
            }
          }
          var G = Y.subarray(0, E), P = Y.subarray(E);
          u = Wt(G), y = Wt(P), w = Ne(G, u, 1), A = Ne(P, y, 1);
        } else
          Te(1);
      else {
        var s = yn(c) + 4, x = t[s - 4] | t[s - 3] << 8, g = s + x;
        if (g > o) {
          d && Te(0);
          break;
        }
        h && v(f + x), n.set(t.subarray(s, g), f), e.b = f += x, e.p = c = g * 8, e.f = p;
        continue;
      }
      if (c > m) {
        d && Te(0);
        break;
      }
    }
    h && v(f + 131072);
    for (var ce = (1 << u) - 1, re = (1 << y) - 1, I = c; ; I = c) {
      var j = w[Zt(t, c) & ce], Q = j >> 4;
      if (c += j & 15, c > m) {
        d && Te(0);
        break;
      }
      if (j || Te(2), Q < 256)
        n[f++] = Q;
      else if (Q == 256) {
        I = c, w = null;
        break;
      } else {
        var H = Q - 254;
        if (Q > 264) {
          var F = Q - 257, N = Lt[F];
          H = Ye(t, c, (1 << N) - 1) + aa[F], c += N;
        }
        var $ = A[Zt(t, c) & re], ne = $ >> 4;
        $ || Te(3), c += $ & 15;
        var P = Mo[ne];
        if (ne > 3) {
          var N = Ct[ne];
          P += Zt(t, c) & (1 << N) - 1, c += N;
        }
        if (c > m) {
          d && Te(0);
          break;
        }
        h && v(f + 131072);
        var ue = f + H;
        if (f < P) {
          var te = i - P, ie = Math.min(P, ue);
          for (te + f < 0 && Te(3); f < ie; ++f)
            n[f] = a[te + f];
        }
        for (; f < ue; ++f)
          n[f] = n[f - P];
      }
    }
    e.l = w, e.p = I, e.b = f, e.f = p, w && (p = 1, e.m = u, e.d = A, e.n = y);
  } while (!p);
  return f != n.length && l ? vt(n, 0, f) : n.subarray(0, f);
}, De = function(t, e, n) {
  n <<= e & 7;
  var a = e / 8 | 0;
  t[a] |= n, t[a + 1] |= n >> 8;
}, ft = function(t, e, n) {
  n <<= e & 7;
  var a = e / 8 | 0;
  t[a] |= n, t[a + 1] |= n >> 8, t[a + 2] |= n >> 16;
}, qt = function(t, e) {
  for (var n = [], a = 0; a < t.length; ++a)
    t[a] && n.push({ s: a, f: t[a] });
  var o = n.length, i = n.slice();
  if (!o)
    return { t: ia, l: 0 };
  if (o == 1) {
    var l = new xe(n[0].s + 1);
    return l[n[0].s] = 1, { t: l, l: 1 };
  }
  n.sort(function(g, E) {
    return g.f - E.f;
  }), n.push({ s: -1, f: 25001 });
  var h = n[0], d = n[1], v = 0, p = 1, c = 2;
  for (n[0] = { s: -1, f: h.f + d.f, l: h, r: d }; p != o - 1; )
    h = n[n[v].f < n[c].f ? v++ : c++], d = n[v != p && n[v].f < n[c].f ? v++ : c++], n[p++] = { s: -1, f: h.f + d.f, l: h, r: d };
  for (var f = i[0].s, a = 1; a < o; ++a)
    i[a].s > f && (f = i[a].s);
  var w = new Fe(f + 1), A = nn(n[p - 1], w, 0);
  if (A > e) {
    var a = 0, u = 0, y = A - e, m = 1 << y;
    for (i.sort(function(E, M) {
      return w[M.s] - w[E.s] || E.f - M.f;
    }); a < o; ++a) {
      var r = i[a].s;
      if (w[r] > e)
        u += m - (1 << A - w[r]), w[r] = e;
      else
        break;
    }
    for (u >>= y; u > 0; ) {
      var s = i[a].s;
      w[s] < e ? u -= 1 << e - w[s]++ - 1 : ++a;
    }
    for (; a >= 0 && u; --a) {
      var x = i[a].s;
      w[x] == e && (--w[x], ++u);
    }
    A = e;
  }
  return { t: new xe(w), l: A };
}, nn = function(t, e, n) {
  return t.s == -1 ? Math.max(nn(t.l, e, n + 1), nn(t.r, e, n + 1)) : e[t.s] = n;
}, Xn = function(t) {
  for (var e = t.length; e && !t[--e]; )
    ;
  for (var n = new Fe(++e), a = 0, o = t[0], i = 1, l = function(d) {
    n[a++] = d;
  }, h = 1; h <= e; ++h)
    if (t[h] == o && h != e)
      ++i;
    else {
      if (!o && i > 2) {
        for (; i > 138; i -= 138)
          l(32754);
        i > 2 && (l(i > 10 ? i - 11 << 5 | 28690 : i - 3 << 5 | 12305), i = 0);
      } else if (i > 3) {
        for (l(o), --i; i > 6; i -= 6)
          l(8304);
        i > 2 && (l(i - 3 << 5 | 8208), i = 0);
      }
      for (; i--; )
        l(o);
      i = 1, o = t[h];
    }
  return { c: n.subarray(0, a), n: e };
}, mt = function(t, e) {
  for (var n = 0, a = 0; a < e.length; ++a)
    n += t[a] * e[a];
  return n;
}, ra = function(t, e, n) {
  var a = n.length, o = yn(e + 2);
  t[o] = a & 255, t[o + 1] = a >> 8, t[o + 2] = t[o] ^ 255, t[o + 3] = t[o + 1] ^ 255;
  for (var i = 0; i < a; ++i)
    t[o + i + 4] = n[i];
  return (o + 4 + a) * 8;
}, Nn = function(t, e, n, a, o, i, l, h, d, v, p) {
  De(e, p++, n), ++o[256];
  for (var c = qt(o, 15), f = c.t, w = c.l, A = qt(i, 15), u = A.t, y = A.l, m = Xn(f), r = m.c, s = m.n, x = Xn(u), g = x.c, E = x.n, M = new Fe(19), k = 0; k < r.length; ++k)
    ++M[r[k] & 31];
  for (var k = 0; k < g.length; ++k)
    ++M[g[k] & 31];
  for (var Y = qt(M, 7), X = Y.t, F = Y.l, U = 19; U > 4 && !X[Qt[U - 1]]; --U)
    ;
  var B = v + 5 << 3, Z = mt(o, Ze) + mt(i, bt) + l, q = mt(o, f) + mt(i, u) + l + 14 + 3 * U + mt(M, X) + 2 * M[16] + 3 * M[17] + 7 * M[18];
  if (d >= 0 && B <= Z && B <= q)
    return ra(e, p, t.subarray(d, d + v));
  var j, D, G, P;
  if (De(e, p, 1 + (q < Z)), p += 2, q < Z) {
    j = Ne(f, w, 0), D = f, G = Ne(u, y, 0), P = u;
    var ce = Ne(X, F, 0);
    De(e, p, s - 257), De(e, p + 5, E - 1), De(e, p + 10, U - 4), p += 14;
    for (var k = 0; k < U; ++k)
      De(e, p + 3 * k, X[Qt[k]]);
    p += 3 * U;
    for (var re = [r, g], I = 0; I < 2; ++I)
      for (var Q = re[I], k = 0; k < Q.length; ++k) {
        var H = Q[k] & 31;
        De(e, p, ce[H]), p += X[H], H > 15 && (De(e, p, Q[k] >> 5 & 127), p += Q[k] >> 12);
      }
  } else
    j = wo, D = Ze, G = So, P = bt;
  for (var k = 0; k < h; ++k) {
    var N = a[k];
    if (N > 255) {
      var H = N >> 18 & 31;
      ft(e, p, j[H + 257]), p += D[H + 257], H > 7 && (De(e, p, N >> 23 & 31), p += Lt[H]);
      var $ = N & 31;
      ft(e, p, G[$]), p += P[$], $ > 3 && (ft(e, p, N >> 5 & 8191), p += Ct[$]);
    } else
      ft(e, p, j[N]), p += D[N];
  }
  return ft(e, p, j[256]), p + D[256];
}, Ro = /* @__PURE__ */ new dn([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), ia = /* @__PURE__ */ new xe(0), _o = function(t, e, n, a, o, i) {
  var l = i.z || t.length, h = new xe(a + l + 5 * (1 + Math.ceil(l / 7e3)) + o), d = h.subarray(a, h.length - o), v = i.l, p = (i.r || 0) & 7;
  if (e) {
    p && (d[0] = i.r >> 3);
    for (var c = Ro[e - 1], f = c >> 13, w = c & 8191, A = (1 << n) - 1, u = i.p || new Fe(32768), y = i.h || new Fe(A + 1), m = Math.ceil(n / 3), r = 2 * m, s = function(be) {
      return (t[be] ^ t[be + 1] << m ^ t[be + 2] << r) & A;
    }, x = new dn(25e3), g = new Fe(288), E = new Fe(32), M = 0, k = 0, Y = i.i || 0, X = 0, F = i.w || 0, U = 0; Y + 2 < l; ++Y) {
      var B = s(Y), Z = Y & 32767, q = y[B];
      if (u[Z] = q, y[B] = Z, F <= Y) {
        var j = l - Y;
        if ((M > 7e3 || X > 24576) && (j > 423 || !v)) {
          p = Nn(t, d, 0, x, g, E, k, X, U, Y - U, p), X = M = k = 0, U = Y;
          for (var D = 0; D < 286; ++D)
            g[D] = 0;
          for (var D = 0; D < 30; ++D)
            E[D] = 0;
        }
        var G = 2, P = 0, ce = w, re = Z - q & 32767;
        if (j > 2 && B == s(Y - re))
          for (var I = Math.min(f, j) - 1, Q = Math.min(32767, Y), H = Math.min(258, j); re <= Q && --ce && Z != q; ) {
            if (t[Y + G] == t[Y + G - re]) {
              for (var N = 0; N < H && t[Y + N] == t[Y + N - re]; ++N)
                ;
              if (N > G) {
                if (G = N, P = re, N > I)
                  break;
                for (var $ = Math.min(re, N - 2), ne = 0, D = 0; D < $; ++D) {
                  var ue = Y - re + D & 32767, te = u[ue], ie = ue - te & 32767;
                  ie > ne && (ne = ie, q = ue);
                }
              }
            }
            Z = q, q = u[Z], re += Z - q & 32767;
          }
        if (P) {
          x[X++] = 268435456 | en[G] << 18 | $n[P];
          var ae = en[G] & 31, se = $n[P] & 31;
          k += Lt[ae] + Ct[se], ++g[257 + ae], ++E[se], F = Y + G, ++M;
        } else
          x[X++] = t[Y], ++g[t[Y]];
      }
    }
    for (Y = Math.max(Y, F); Y < l; ++Y)
      x[X++] = t[Y], ++g[t[Y]];
    p = Nn(t, d, v, x, g, E, k, X, U, Y - U, p), v || (i.r = p & 7 | d[p / 8 | 0] << 3, p -= 7, i.h = y, i.p = u, i.i = Y, i.w = F);
  } else {
    for (var Y = i.w || 0; Y < l + v; Y += 65535) {
      var le = Y + 65535;
      le >= l && (d[p / 8 | 0] = v, le = l), p = ra(d, p + 1, t.subarray(Y, le));
    }
    i.i = l;
  }
  return vt(h, 0, a + yn(p) + o);
}, Oo = /* @__PURE__ */ (function() {
  for (var t = new Int32Array(256), e = 0; e < 256; ++e) {
    for (var n = e, a = 9; --a; )
      n = (n & 1 && -306674912) ^ n >>> 1;
    t[e] = n;
  }
  return t;
})(), Fo = function() {
  var t = -1;
  return {
    p: function(e) {
      for (var n = t, a = 0; a < e.length; ++a)
        n = Oo[n & 255 ^ e[a]] ^ n >>> 8;
      t = n;
    },
    d: function() {
      return ~t;
    }
  };
}, Lo = function(t, e, n, a, o) {
  if (!o && (o = { l: 1 }, e.dictionary)) {
    var i = e.dictionary.subarray(-32768), l = new xe(i.length + t.length);
    l.set(i), l.set(t, i.length), t = l, o.w = i.length;
  }
  return _o(t, e.level == null ? 6 : e.level, e.mem == null ? o.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(t.length))) * 1.5) : 20 : 12 + e.mem, n, a, o);
}, sa = function(t, e) {
  var n = {};
  for (var a in t)
    n[a] = t[a];
  for (var a in e)
    n[a] = e[a];
  return n;
}, Xe = function(t, e) {
  return t[e] | t[e + 1] << 8;
}, Ce = function(t, e) {
  return (t[e] | t[e + 1] << 8 | t[e + 2] << 16 | t[e + 3] << 24) >>> 0;
}, Vt = function(t, e) {
  return Ce(t, e) + Ce(t, e + 4) * 4294967296;
}, ke = function(t, e, n) {
  for (; n; ++e)
    t[e] = n, n >>>= 8;
};
function Co(t, e) {
  return Lo(t, e || {}, 0, 0);
}
function Bo(t, e) {
  return To(t, { i: 2 }, e && e.out, e && e.dictionary);
}
var la = function(t, e, n, a) {
  for (var o in t) {
    var i = t[o], l = e + o, h = a;
    Array.isArray(i) && (h = sa(a, i[1]), i = i[0]), ArrayBuffer.isView(i) ? n[l] = [i, h] : (n[l += "/"] = [new xe(0), h], la(i, l, n, a));
  }
}, zn = typeof TextEncoder < "u" && /* @__PURE__ */ new TextEncoder(), an = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), Io = 0;
try {
  an.decode(ia, { stream: !0 }), Io = 1;
} catch {
}
var Yo = function(t) {
  for (var e = "", n = 0; ; ) {
    var a = t[n++], o = (a > 127) + (a > 223) + (a > 239);
    if (n + o > t.length)
      return { s: e, r: vt(t, n - 1) };
    o ? o == 3 ? (a = ((a & 15) << 18 | (t[n++] & 63) << 12 | (t[n++] & 63) << 6 | t[n++] & 63) - 65536, e += String.fromCharCode(55296 | a >> 10, 56320 | a & 1023)) : o & 1 ? e += String.fromCharCode((a & 31) << 6 | t[n++] & 63) : e += String.fromCharCode((a & 15) << 12 | (t[n++] & 63) << 6 | t[n++] & 63) : e += String.fromCharCode(a);
  }
};
function Dn(t, e) {
  var n;
  if (zn)
    return zn.encode(t);
  for (var a = t.length, o = new xe(t.length + (t.length >> 1)), i = 0, l = function(v) {
    o[i++] = v;
  }, n = 0; n < a; ++n) {
    if (i + 5 > o.length) {
      var h = new xe(i + 8 + (a - n << 1));
      h.set(o), o = h;
    }
    var d = t.charCodeAt(n);
    d < 128 || e ? l(d) : d < 2048 ? (l(192 | d >> 6), l(128 | d & 63)) : d > 55295 && d < 57344 ? (d = 65536 + (d & 1047552) | t.charCodeAt(++n) & 1023, l(240 | d >> 18), l(128 | d >> 12 & 63), l(128 | d >> 6 & 63), l(128 | d & 63)) : (l(224 | d >> 12), l(128 | d >> 6 & 63), l(128 | d & 63));
  }
  return vt(o, 0, i);
}
function Uo(t, e) {
  if (e) {
    for (var n = "", a = 0; a < t.length; a += 16384)
      n += String.fromCharCode.apply(null, t.subarray(a, a + 16384));
    return n;
  } else {
    if (an)
      return an.decode(t);
    var o = Yo(t), i = o.s, n = o.r;
    return n.length && Te(8), i;
  }
}
var jo = function(t, e) {
  return e + 30 + Xe(t, e + 26) + Xe(t, e + 28);
}, $o = function(t, e, n) {
  var a = Xe(t, e + 28), o = Xe(t, e + 30), i = Uo(t.subarray(e + 46, e + 46 + a), !(Xe(t, e + 8) & 2048)), l = e + 46 + a, h = Xo(t, l, o, n, Ce(t, e + 20), Ce(t, e + 24), Ce(t, e + 42)), d = h[0], v = h[1], p = h[2];
  return [Xe(t, e + 10), d, v, i, l + o + Xe(t, e + 32), p];
}, Xo = function(t, e, n, a, o, i, l) {
  var h = o == 4294967295, d = i == 4294967295, v = l == 4294967295, p = e + n, c = h + d + v;
  if (a && c) {
    for (; e + 4 < p; e += 4 + Xe(t, e + 2))
      if (Xe(t, e) == 1)
        return [
          h ? Vt(t, e + 4 + 8 * d) : o,
          d ? Vt(t, e + 4) : i,
          v ? Vt(t, e + 4 + 8 * (d + h)) : l,
          1
        ];
    a < 2 && Te(13);
  }
  return [o, i, l, 0];
}, on = function(t) {
  var e = 0;
  if (t)
    for (var n in t) {
      var a = t[n].length;
      a > 65535 && Te(9), e += a + 4;
    }
  return e;
}, Hn = function(t, e, n, a, o, i, l, h) {
  var d = a.length, v = n.extra, p = h && h.length, c = on(v);
  ke(t, e, l != null ? 33639248 : 67324752), e += 4, l != null && (t[e++] = 20, t[e++] = n.os), t[e] = 20, e += 2, t[e++] = n.flag << 1 | (i < 0 && 8), t[e++] = o && 8, t[e++] = n.compression & 255, t[e++] = n.compression >> 8;
  var f = new Date(n.mtime == null ? Date.now() : n.mtime), w = f.getFullYear() - 1980;
  if ((w < 0 || w > 119) && Te(10), ke(t, e, w << 25 | f.getMonth() + 1 << 21 | f.getDate() << 16 | f.getHours() << 11 | f.getMinutes() << 5 | f.getSeconds() >> 1), e += 4, i != -1 && (ke(t, e, n.crc), ke(t, e + 4, i < 0 ? -i - 2 : i), ke(t, e + 8, n.size)), ke(t, e + 12, d), ke(t, e + 14, c), e += 16, l != null && (ke(t, e, p), ke(t, e + 6, n.attrs), ke(t, e + 10, l), e += 14), t.set(a, e), e += d, c)
    for (var A in v) {
      var u = v[A], y = u.length;
      ke(t, e, +A), ke(t, e + 2, y), t.set(u, e + 4), e += 4 + y;
    }
  return p && (t.set(h, e), e += p), e;
}, No = function(t, e, n, a, o) {
  ke(t, e, 101010256), ke(t, e + 8, n), ke(t, e + 10, n), ke(t, e + 12, a), ke(t, e + 16, o);
};
function zo(t, e) {
  e || (e = {});
  var n = {}, a = [];
  la(t, "", n, e);
  var o = 0, i = 0;
  for (var l in n) {
    var h = n[l], d = h[0], v = h[1], p = v.level == 0 ? 0 : 8, c = Dn(l), f = c.length, w = v.comment, A = w && Dn(w), u = A && A.length, y = on(v.extra);
    f > 65535 && Te(11);
    var m = p ? Co(d, v) : d, r = m.length, s = Fo();
    s.p(d), a.push(sa(v, {
      size: d.length,
      crc: s.d(),
      c: m,
      f: c,
      m: A,
      u: f != l.length || A && w.length != u,
      o,
      compression: p
    })), o += 30 + f + y + r, i += 76 + 2 * (f + y) + (u || 0) + r;
  }
  for (var x = new xe(i + 22), g = o, E = i - o, M = 0; M < a.length; ++M) {
    var c = a[M];
    Hn(x, c.o, c, c.f, c.u, c.c.length);
    var k = 30 + c.f.length + on(c.extra);
    x.set(c.c, c.o + k), Hn(x, o, c, c.f, c.u, c.c.length, c.o, c.m), o += 16 + k + (c.m ? c.m.length : 0);
  }
  return No(x, o, a.length, E, g), x;
}
function Do(t, e) {
  for (var n = {}, a = t.length - 22; Ce(t, a) != 101010256; --a)
    (!a || t.length - a > 65558) && Te(13);
  var o = Xe(t, a + 8);
  if (!o)
    return {};
  var i = Ce(t, a + 16), l = Ce(t, a - 20) == 117853008;
  if (l) {
    var h = Ce(t, a - 12);
    l = Ce(t, h) == 101075792, l && (o = Ce(t, h + 32), i = Ce(t, h + 48));
  }
  for (var d = e && e.filter, v = 0; v < o; ++v) {
    var p = $o(t, i, l), c = p[0], f = p[1], w = p[2], A = p[3], u = p[4], y = p[5], m = jo(t, y);
    i = u, (!d || d({
      name: A,
      size: f,
      originalSize: w,
      compression: c
    })) && (c ? c == 8 ? n[A] = Bo(t.subarray(m, m + f), { out: new xe(w) }) : Te(14, "unknown compression type " + c) : n[A] = vt(t, m, m + f));
  }
  return n;
}
const Ft = 200, rn = 64 * 1024 * 1024, sn = new TextDecoder("utf-8", { fatal: !0 });
function gn(t) {
  if (!t || t.startsWith("/") || /^[A-Za-z]:/.test(t) || t.includes("\\") || t.includes("\0") || t.split("/").includes(".."))
    throw new Error(`ZIP entry ${JSON.stringify(t)}: path must be relative, without .. or backslashes`);
}
function ln(t) {
  const e = new DataView(t.buffer, t.byteOffset, t.byteLength), n = (f = "(archive)") => {
    throw new Error(`ZIP entry ${JSON.stringify(f)}: invalid or truncated ZIP`);
  }, a = (f) => f >= 0 && f + 2 <= t.length ? e.getUint16(f, !0) : n(), o = (f) => f >= 0 && f + 4 <= t.length ? e.getUint32(f, !0) : n();
  let i = t.length - 22;
  for (; i >= Math.max(0, t.length - 65557) && !(o(i) === 101010256 && i + 22 + a(i + 20) === t.length); i--)
    ;
  (i < 0 || i < t.length - 65557) && n(), (a(i + 4) || a(i + 6) || a(i + 8) !== a(i + 10)) && n();
  const l = a(i + 10), h = o(i + 16), d = h + o(i + 12);
  d !== i && n();
  const v = [], p = /* @__PURE__ */ new Set();
  let c = h;
  for (let f = 0; f < l; f++) {
    (c + 46 > d || o(c) !== 33639248) && n();
    const w = a(c + 28), A = c + 46 + w + a(c + 30) + a(c + 32);
    A > d && n();
    let u;
    try {
      u = sn.decode(t.subarray(c + 46, c + 46 + w));
    } catch {
      throw new Error("ZIP entry (invalid UTF-8 name): invalid filename");
    }
    if (gn(u), f >= Ft) throw new Error(`ZIP entry ${JSON.stringify(u)}: more than ${Ft} entries`);
    if (p.has(u)) throw new Error(`ZIP entry ${JSON.stringify(u)}: duplicate entry`);
    p.add(u);
    const y = o(c + 24), m = o(c + 20), r = o(c + 42);
    if (y > rn || m > rn) throw new Error(`ZIP entry ${JSON.stringify(u)}: exceeds 64 MB`);
    if (a(c + 10) !== 0) throw new Error(`ZIP entry ${JSON.stringify(u)}: expected stored compression (method 0)`);
    if (a(c + 8) & 1) throw new Error(`ZIP entry ${JSON.stringify(u)}: encrypted entries are not supported`);
    (m !== y || r + 30 > h || o(r) !== 67324752) && n(u);
    const s = r + 30 + a(r + 26) + a(r + 28);
    (s + y > h || a(r + 8) !== 0 || a(r + 6) !== a(c + 8)) && n(u);
    let x;
    try {
      x = sn.decode(t.subarray(r + 30, r + 30 + a(r + 26)));
    } catch {
      n(u);
    }
    x !== u && n(u), v.push({ name: u, offset: r, start: s, size: y, central: c }), c = A;
  }
  return c !== d && n(), { files: v };
}
function Ho(t) {
  const e = t instanceof Uint8Array ? t : new Uint8Array(t), n = ln(e), a = Do(e, { filter: (i) => i.name !== "__proto__" }), o = /* @__PURE__ */ Object.create(null);
  for (const i of n.files) {
    const l = i.name === "__proto__" ? e.slice(i.start, i.start + i.size) : a[i.name];
    if (!(l instanceof Uint8Array) || l.length !== i.size) throw new Error(`ZIP entry ${JSON.stringify(i.name)}: invalid size`);
    o[i.name] = l;
  }
  return o;
}
function Vo(t, e = {}) {
  const n = Object.hasOwn(t, "avatar.json") ? t["avatar.json"] : void 0, a = n ? nt(JSON.parse(sn.decode(n))) : Qn("Avatar"), o = n && !e.manifest ? n : new TextEncoder().encode(JSON.stringify(nt({ ...a, ...e.manifest }), null, 2) + `
`), i = /* @__PURE__ */ Object.create(null);
  i["avatar.json"] = o;
  for (const [f, w] of Object.entries(t)) f !== "avatar.json" && (i[f] = w);
  for (const [f, [w, A]] of Object.entries(i).entries()) {
    if (gn(w), f >= Ft) throw new Error(`ZIP entry ${JSON.stringify(w)}: more than ${Ft} entries`);
    if (A.byteLength > rn) throw new Error(`ZIP entry ${JSON.stringify(w)}: exceeds 64 MB`);
  }
  const l = ea(i);
  if (l.length) throw new Error(l.join(`
`));
  let h = "proto0000";
  for (let f = 0; Object.hasOwn(i, h); f++) h = `proto${String(f + 1).padStart(4, "0")}`;
  const d = Object.fromEntries(Object.entries(i).map(([f, w]) => [f === "__proto__" ? h : f, w])), v = zo(d, { level: 0 });
  if (Object.hasOwn(i, "__proto__")) {
    const f = ln(v).files.find((A) => A.name === h), w = new TextEncoder().encode("__proto__");
    v.set(w, f.offset + 30), v.set(w, f.central + 46);
  }
  const p = ln(v), c = p.files.find((f) => f.name === "avatar.json");
  if (c.offset !== 0) {
    const f = c.start + c.size - c.offset, w = new Uint8Array(v.length);
    w.set(v.subarray(c.offset, c.offset + f)), w.set(v.subarray(0, c.offset), f), w.set(v.subarray(c.offset + f), c.offset + f);
    const A = new DataView(w.buffer);
    for (const u of p.files) A.setUint32(u.central + 42, u === c ? 0 : u.offset < c.offset ? u.offset + f : u.offset, !0);
    return w;
  }
  return v;
}
const Po = (t) => JSON.parse(new TextDecoder("utf-8", { fatal: !0 }).decode(t));
function dt(t, e) {
  try {
    return Po(t);
  } catch {
    throw new Error(`${e}: invalid UTF-8 JSON`);
  }
}
function ca(t, e) {
  return [
    "layers.json",
    "base.png",
    "hairmask.png",
    ...Object.keys(t?.layers ?? {}).map((n) => `${n}.png`),
    ...e ? ["sprites/sprites.json", ...Object.keys(e.layers ?? {}).map((n) => `sprites/${n}.png`)] : []
  ];
}
function ha(t) {
  const e = ea(t);
  if (e.length) throw new Error(e.join(`
`));
}
function ua(t) {
  return !!t && typeof t == "object" && "manifest" in t && "rig" in t && "assets" in t && "release" in t;
}
function Gt(t) {
  const e = Ho(t);
  if (!Object.hasOwn(e, "avatar.json")) throw new Error("avatar.json: missing file in .mavatar archive");
  ha(e);
  const n = nt(dt(e["avatar.json"], "avatar.json")), a = cn(dt(e["rig.json"], "rig.json")), o = ca(
    dt(e["built/layers.json"], "built/layers.json"),
    e["built/sprites/sprites.json"] ? dt(e["built/sprites/sprites.json"], "built/sprites/sprites.json") : void 0
  ), i = {}, l = [], h = () => {
    l.splice(0).forEach((d) => URL.revokeObjectURL(d));
  };
  try {
    for (const d of new Set(o)) {
      const v = URL.createObjectURL(new Blob([new Uint8Array(e[`built/${d}`])], { type: d.endsWith(".json") ? "application/json" : "image/png" }));
      l.push(v), i[d] = v;
    }
  } catch (d) {
    throw h(), d;
  }
  return { manifest: n, rig: a, assets: i, release: h };
}
async function Wo(t, e = {}) {
  if (ua(t)) return t;
  if (t instanceof Blob) return Gt(await t.arrayBuffer());
  if (t instanceof ArrayBuffer || t instanceof Uint8Array) return Gt(t);
  const n = new URL(t, typeof location > "u" ? void 0 : location.href);
  if (/\.mavatar$/i.test(n.pathname)) {
    const u = await fetch(n);
    if (!u.ok) throw new Error(`.mavatar: could not load (${u.status})`);
    return Gt(await u.arrayBuffer());
  }
  n.pathname.endsWith("/") || (n.pathname += "/");
  const a = (u) => {
    const y = new URL(n);
    return y.pathname += u.split("/").map(encodeURIComponent).join("/"), e.version !== void 0 && y.searchParams.set("v", String(e.version)), y.href;
  }, o = {};
  async function i(u, y = !1) {
    const m = await fetch(a(u));
    if (y && (m.status === 404 || m.ok && m.headers.get("content-type")?.includes("text/html"))) return;
    if (!m.ok) throw new Error(`${u}: could not load (${m.status})`);
    const r = new Uint8Array(await m.arrayBuffer());
    return o[u] = r, dt(r, u);
  }
  const l = e.rigFile ?? "rig.json";
  gn(l);
  const [h, d, v, p] = await Promise.all([
    i(l),
    i("built/layers.json"),
    i("avatar.json", !0),
    i("built/sprites/sprites.json", !0)
  ]);
  Array.isArray(h?.eyes) && Array.isArray(d?.eyes) && (h.eyes = h.eyes.map((u, y) => {
    if (!u || typeof u != "object") return u;
    const m = { ...u };
    for (const r of ["x0", "x1", "top", "bot"]) m[r] === void 0 && (m[r] = d.eyes[y]?.[r]);
    return m;
  })), o["rig.json"] = new TextEncoder().encode(JSON.stringify(h));
  const c = ca(d, p);
  for (const u of c) u.endsWith(".png") && (o[`built/${u}`] = { size: 1 });
  ha(o);
  const f = cn(h), w = Object.fromEntries(c.map((u) => [u, a(`built/${u}`)])), A = decodeURIComponent(n.pathname.split("/").filter(Boolean).at(-1) ?? "Avatar");
  return { manifest: v === void 0 ? Qn(A) : nt(v), rig: f, assets: w, release() {
  } };
}
async function Go(t, e, n = {}) {
  const a = !ua(e), o = await Wo(e);
  try {
    const i = n.lipSync === void 0 ? o.manifest.lipSync : { ...o.manifest.lipSync, ...un(n.lipSync) }, l = await xo(t, { ...n, ...i === void 0 ? {} : { lipSync: i }, rig: o.rig, assets: o.assets }), h = l.destroy.bind(l);
    let d = !1;
    return Object.assign(l, { package: o, destroy() {
      if (!d) {
        d = !0;
        try {
          h();
        } finally {
          a && o.release();
        }
      }
    } });
  } catch (i) {
    throw a && o.release(), i;
  }
}
export {
  tt as DEFAULT_LIGHTING,
  qo as LIVE_EXPRESSIONS,
  Et as PARAMS,
  Zo as colorHex,
  xo as createMeshAvatar,
  Go as loadMeshAvatar,
  Wo as openAvatar,
  Vo as packAvatar,
  Fa as parseLighting,
  nt as parseManifest,
  cn as parseRig,
  Ho as unpackAvatar,
  ea as validateAvatarFiles,
  Pn as validateRig
};
