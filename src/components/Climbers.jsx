import { useEffect, useRef } from 'react';

// Animated alpine ridge with a roped team of climbers (ice axes, helmets, backpacks) heading for the summit.
// Driven by requestAnimationFrame + SVG path geometry (no SMIL), so it runs the same in Safari / iOS / Android / desktop.

const ROUTE = 'M430 214 L560 232 L700 146 L780 166 L880 76';
const TEAM = 4;
const GAP = 38;            // distance between climbers along the route (rope length)
const WALK = 17000;        // ms walking
const HOLD = 3200;         // ms celebrating on the summit
const FADE = 900;          // ms fade out / in
const CYCLE = WALK + HOLD + FADE;
const HELMETS = ['#f0a3b6', '#7fd8c6', '#c4a8ff', '#f2c46d'];
const SCALE = [1.5, 1.45, 1.42, 1.4];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rad = (d) => (d * Math.PI) / 180;
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const f = (n) => n.toFixed(1);

// two-bone leg: knee found by simple IK, bending forward
function leg(hx, hy, fx, fy, l = 9.2) {
  const dx = fx - hx, dy = fy - hy;
  let d = Math.hypot(dx, dy);
  if (d > 2 * l - 0.01) d = 2 * l - 0.01;
  const mx = hx + dx / 2, my = hy + dy / 2;
  const h = Math.sqrt(l * l - (d / 2) * (d / 2));
  const nx = -dy / (Math.hypot(dx, dy) || 1), ny = dx / (Math.hypot(dx, dy) || 1);
  // choose the perpendicular that points forward (+x)
  const sgn = nx >= 0 ? 1 : -1;
  return `M${f(hx)} ${f(hy)} L${f(mx + nx * h * sgn)} ${f(my + ny * h * sgn)} L${f(fx)} ${f(fy)} l3 0`;
}

// local pose of one climber (feet at 0,0, facing +x)
function pose(phase, lean, celebrate, t) {
  const hip = { x: 0, y: -18 };
  const swingA = Math.sin(phase), swingB = Math.sin(phase + Math.PI);
  const footA = { x: swingA * 6.5, y: -Math.max(0, Math.cos(phase)) * 2.6 };
  const footB = { x: swingB * 6.5, y: -Math.max(0, Math.cos(phase + Math.PI)) * 2.6 };
  const th = rad(lean);
  const sh = { x: hip.x + Math.sin(th) * 13, y: hip.y - Math.cos(th) * 13 };
  const head = { x: sh.x + Math.sin(th) * 5.2 + 0.8, y: sh.y - Math.cos(th) * 5.2 };
  // backpack: a box behind the torso
  const bx = -Math.cos(th), by = -Math.sin(th);
  const p1 = { x: hip.x + Math.sin(th) * 3 + bx * 1, y: hip.y - Math.cos(th) * 3 + by * 1 };
  const p2 = { x: sh.x + bx * 1, y: sh.y + by * 1 };
  const pack = `M${f(p1.x)} ${f(p1.y)} L${f(p2.x)} ${f(p2.y)} L${f(p2.x + bx * 6)} ${f(p2.y + by * 6 + 1)} L${f(p1.x + bx * 5.5)} ${f(p1.y + by * 5.5)}Z`;
  // ice-axe arm
  let hand, axe;
  if (celebrate) {
    const wave = Math.sin(t / 140) * 2;
    hand = { x: sh.x + 3 + wave, y: sh.y - 11 };
    axe = `M${f(hand.x)} ${f(hand.y + 3)} L${f(hand.x + 1)} ${f(hand.y - 10)} M${f(hand.x - 3)} ${f(hand.y - 9)} L${f(hand.x + 5)} ${f(hand.y - 11)}`;
  } else {
    const a = rad(32 + Math.sin(phase + Math.PI) * 18);
    hand = { x: sh.x + Math.sin(a) * 10.5, y: sh.y + Math.cos(a) * 10.5 };
    // axe held by the head, spike towards the slope (like a cane)
    const tipx = hand.x + 4 + Math.sin(phase + Math.PI) * 2, tipy = hand.y + 11;
    axe = `M${f(hand.x)} ${f(hand.y)} L${f(tipx)} ${f(tipy)} M${f(hand.x - 3)} ${f(hand.y - 0.5)} L${f(hand.x + 4)} ${f(hand.y - 1.6)} L${f(hand.x + 3)} ${f(hand.y + 0.6)}`;
  }
  const elbow = { x: (sh.x + hand.x) / 2 + 1.5, y: (sh.y + hand.y) / 2 + 1 };
  const arm = `M${f(sh.x)} ${f(sh.y)} Q${f(elbow.x)} ${f(elbow.y)} ${f(hand.x)} ${f(hand.y)}`;
  const back = `M${f(sh.x)} ${f(sh.y)} L${f(sh.x - 2 + Math.sin(phase) * 2.5)} ${f(sh.y + 9.5)}`;
  return {
    legA: leg(hip.x, hip.y, footA.x, footA.y),
    legB: leg(hip.x, hip.y, footB.x, footB.y),
    body: `M${f(hip.x)} ${f(hip.y)} L${f(sh.x)} ${f(sh.y)}`,
    head, pack, arm, back, axe,
    harness: { x: hip.x + Math.sin(th) * 1.5, y: hip.y - 1 },
  };
}

export default function Climbers() {
  const routeRef = useRef(null);
  const teamRef = useRef(null);
  const ropeRef = useRef(null);
  const parts = useRef([]);

  useEffect(() => {
    const route = routeRef.current;
    if (!route) return;
    const L = route.getTotalLength();
    const startS = (TEAM - 1) * GAP;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf, visible = true, t0 = performance.now();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(route.ownerSVGElement);

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = reduced ? WALK + 500 : (now - t0) % CYCLE;
      const walkP = ease(clamp(t / WALK, 0, 1));
      const celebrating = t > WALK && t < WALK + HOLD;
      // fade the team in at start and out at the end of a cycle
      const op = t < FADE ? t / FADE : t > WALK + HOLD ? 1 - (t - WALK - HOLD) / FADE : 1;
      teamRef.current.setAttribute('opacity', f(clamp(op, 0, 1)));

      const harness = [];
      for (let i = 0; i < TEAM; i++) {
        const s = clamp(startS + (L - startS) * walkP - i * GAP, 0, L);
        const pt = route.getPointAtLength(s);
        const a = route.getPointAtLength(clamp(s - 2, 0, L)), b = route.getPointAtLength(clamp(s + 2, 0, L));
        const slope = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI; // negative = uphill
        const lean = clamp(-slope * 0.45 + 5, -6, 24);
        const moving = !celebrating && walkP < 1;
        const phase = s * 0.32;
        const P = pose(moving ? phase : Math.PI / 2, lean, celebrating && i === 0, now);
        const el = parts.current[i];
        const k = SCALE[i];
        el.g.setAttribute('transform', `translate(${f(pt.x)} ${f(pt.y)}) scale(${k})`);
        el.legA.setAttribute('d', P.legA);
        el.legB.setAttribute('d', P.legB);
        el.body.setAttribute('d', P.body);
        el.pack.setAttribute('d', P.pack);
        el.arm.setAttribute('d', P.arm);
        el.back.setAttribute('d', P.back);
        el.axe.setAttribute('d', P.axe);
        el.head.setAttribute('cx', f(P.head.x));
        el.head.setAttribute('cy', f(P.head.y));
        el.helmet.setAttribute('d', `M${f(P.head.x - 4.3)} ${f(P.head.y - 0.2)} a4.3 4.4 0 0 1 8.6 0z`);
        harness.push({ x: pt.x + P.harness.x * k, y: pt.y + P.harness.y * k });
      }
      // rope between harnesses, sagging a little between climbers
      let d = '';
      for (let i = 0; i < harness.length - 1; i++) {
        const A = harness[i], B = harness[i + 1];
        const sag = 4 + Math.abs(A.x - B.x) * 0.06;
        d += `M${f(A.x)} ${f(A.y)} Q${f((A.x + B.x) / 2)} ${f((A.y + B.y) / 2 + sag)} ${f(B.x)} ${f(B.y)} `;
      }
      ropeRef.current.setAttribute('d', d);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  return (
    <svg className="ridge" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="ridgeFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--ridge-far)" stopOpacity=".55" />
          <stop offset="1" stopColor="var(--ridge-far)" stopOpacity=".95" />
        </linearGradient>
      </defs>

      {/* far range */}
      <path fill="url(#ridgeFar)" d="M0 420 L0 250 L120 200 L240 236 L380 150 L520 210 L640 120 L760 180 L900 40 L1010 150 L1130 96 L1260 170 L1360 130 L1440 170 L1440 420Z" />
      {/* near ridge */}
      <path className="ridge__near" d="M0 420 L0 300 L180 252 L300 282 L430 214 L560 232 L700 146 L780 166 L880 76 L960 136 L1080 116 L1200 204 L1320 172 L1440 232 L1440 420Z" />
      <path className="ridge__snow" d="M880 76 L858 104 L872 98 L884 110 L898 96 L912 104Z M700 146 L684 166 L696 162 L706 170 L716 160Z" />

      {/* route (footpath along the ridge) */}
      <path ref={routeRef} className="ridge__route" d={ROUTE} />

      {/* summit flag */}
      <g transform="translate(880 76)">
        <line x1="0" y1="0" x2="0" y2="-38" className="ridge__pole" />
        <path className="ridge__flag" d="M0 -38 L24 -32 L0 -25Z" />
        <circle r="5" className="ridge__summit-dot" />
        <circle r="5" className="ridge__summit-ping" />
      </g>

      {/* roped team */}
      <g ref={teamRef} opacity="0">
        <path ref={ropeRef} className="rope" />
        {Array.from({ length: TEAM }, (_, i) => (
          <g key={i} className="climber" ref={(g) => {
            if (!g) return;
            const q = (s) => g.querySelector(s);
            parts.current[i] = { g, legA: q('.c-legA'), legB: q('.c-legB'), body: q('.c-body'), pack: q('.c-pack'), arm: q('.c-arm'), back: q('.c-back'), axe: q('.c-axe'), head: q('.c-head'), helmet: q('.c-helmet') };
          }}>
            <path className="c-legB c-limb c-far" />
            <path className="c-back c-limb c-far" />
            <path className="c-pack" />
            <path className="c-legA c-limb" />
            <path className="c-body c-limb c-torso" />
            <circle className="c-head" r="3.7" />
            <path className="c-helmet" style={{ fill: HELMETS[i] }} />
            <path className="c-axe" />
            <path className="c-arm c-limb" />
          </g>
        ))}
      </g>
    </svg>
  );
}
