/* Hand-drawn-ish cartoon illustrations for fun mode. All original, all SVG,
   all decorative (aria-hidden). Shapes are thick-outlined and flat-filled so
   the "boil" filter (fx.jsx) can wobble them like a cel animation.

   Anything with lots of repetition (skylines, mazes, corridors) is generated
   from a seeded random so it is stable between renders. */

import { useMemo } from 'react';

const INK = '#14161c';

export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ TOTEM */
/* A spinning top. The spin is faked the way cel animators do it: highlight
   bands slide across a clipped body while the whole thing precesses around
   its tip. Pass `still` for a static one. */
export function Totem({ className = '', still = false, id = 't' }) {
  const bands = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg className={`inc-totem ${still ? 'is-still' : ''} ${className}`} viewBox="0 0 220 310" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#4e5a69" />
          <stop offset=".28" stopColor="#c9d3de" />
          <stop offset=".42" stopColor="#f4f7fb" />
          <stop offset=".62" stopColor="#97a6b7" />
          <stop offset="1" stopColor="#3e4855" />
        </linearGradient>
        <clipPath id={`${id}-body`}>
          <path d="M28 96 C28 74 192 74 192 96 C192 144 150 200 110 282 C70 200 28 144 28 96 Z" />
        </clipPath>
      </defs>

      <ellipse className="inc-totem__shadow" cx="110" cy="292" rx="46" ry="8" fill={INK} opacity=".28" />

      <g className="inc-totem__precess">
        {/* body */}
        <path
          d="M28 96 C28 74 192 74 192 96 C192 144 150 200 110 282 C70 200 28 144 28 96 Z"
          fill={`url(#${id}-metal)`}
        />
        <g clipPath={`url(#${id}-body)`}>
          <g className="inc-totem__bands">
            {bands.map((b) => (
              <rect key={b} x={-40 + b * 46} y="60" width="12" height="240" fill="#fff" opacity=".45" />
            ))}
            {bands.map((b) => (
              <rect key={`d${b}`} x={-18 + b * 46} y="60" width="6" height="240" fill={INK} opacity=".18" />
            ))}
          </g>
          <path d="M20 128 C70 150 150 150 200 128" stroke={INK} strokeWidth="4" fill="none" opacity=".55" />
          <path d="M40 170 C80 186 140 186 180 170" stroke={INK} strokeWidth="3" fill="none" opacity=".35" />
        </g>
        <path
          d="M28 96 C28 74 192 74 192 96 C192 144 150 200 110 282 C70 200 28 144 28 96 Z"
          fill="none"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* top face */}
        <ellipse cx="110" cy="94" rx="80" ry="17" fill="#e9eef4" stroke={INK} strokeWidth="4.5" />
        <ellipse cx="110" cy="94" rx="46" ry="9" fill="none" stroke={INK} strokeWidth="2.5" opacity=".4" />
        {/* stem */}
        <rect x="97" y="22" width="26" height="72" rx="10" fill={`url(#${id}-metal)`} stroke={INK} strokeWidth="4.5" />
        <ellipse cx="110" cy="24" rx="13" ry="5" fill="#f4f7fb" stroke={INK} strokeWidth="3.5" />
        {/* speed lines */}
        <g className="inc-totem__whoosh" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d="M8 104 C2 124 6 140 16 156" />
          <path d="M212 104 C218 124 214 140 204 156" />
          <path d="M22 186 C26 198 34 208 44 216" opacity=".6" />
          <path d="M198 186 C194 198 186 208 176 216" opacity=".6" />
        </g>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- SKYLINE */
/* A row of buildings with lit windows. `crumble` breaks the roofs into
   jagged edges and leans them (limbo). Windows are batched into two paths
   (lit / unlit) so a city of hundreds of windows is still two DOM nodes. */
export function Skyline({
  seed = 7,
  width = 1600,
  height = 360,
  minH = 0.35,
  maxH = 0.95,
  palette = ['#24344d', '#1c2a40', '#2e4060'],
  lit = '#f4b04a',
  unlit = '#0f1828',
  litChance = 0.35,
  crumble = false,
  stroke = INK,
  className = '',
}) {
  const city = useMemo(() => {
    const r = rng(seed);
    const blds = [];
    let x = -10;
    while (x < width + 10) {
      const w = 60 + r() * 110;
      const h = height * (minH + r() * (maxH - minH));
      const top = height - h;
      const roof = r();
      let d;
      if (crumble) {
        const steps = 5 + Math.floor(r() * 4);
        let p = `M${x} ${height} L${x} ${top + r() * 30}`;
        for (let i = 1; i <= steps; i++) {
          const px = x + (w * i) / steps;
          p += ` L${px} ${top + r() * 60}`;
        }
        d = `${p} L${x + w} ${height} Z`;
      } else if (roof < 0.25) {
        // stepped tower
        const s = w * 0.22;
        d = `M${x} ${height} V${top + 40} H${x + s} V${top + 16} H${x + w - s} V${top + 40} H${x + w} V${height} Z`;
      } else if (roof < 0.4) {
        // spire
        d = `M${x} ${height} V${top + 30} L${x + w / 2} ${top - 40} L${x + w} ${top + 30} V${height} Z`;
      } else {
        d = `M${x} ${height} V${top} H${x + w} V${height} Z`;
      }
      blds.push({ d, fill: palette[Math.floor(r() * palette.length)], x, w, top, antenna: !crumble && roof > 0.82 });
      x += w + 4 + r() * 18;
    }
    // windows
    let litD = '';
    let unlitD = '';
    for (const b of blds) {
      const cols = Math.max(2, Math.floor((b.w - 16) / 18));
      const gap = (b.w - cols * 10) / (cols + 1);
      for (let row = b.top + 50; row < height - 30; row += 26) {
        for (let c = 0; c < cols; c++) {
          const wx = b.x + gap + c * (10 + gap);
          const seg = `M${wx.toFixed(1)} ${row.toFixed(1)}h10v14h-10Z`;
          if (r() < litChance) litD += seg;
          else unlitD += seg;
        }
      }
    }
    return { blds, litD, unlitD };
  }, [seed, width, height, minH, maxH, crumble, litChance, palette]);

  return (
    <svg
      className={`inc-skyline ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {city.blds.map((b, i) => (
        <g key={i}>
          {b.antenna && (
            <path d={`M${b.x + b.w / 2} ${b.top} V${b.top - 46}`} stroke={stroke} strokeWidth="4" strokeLinecap="round" />
          )}
          <path d={b.d} fill={b.fill} stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
        </g>
      ))}
      <path d={city.unlitD} fill={unlit} />
      <path className="inc-skyline__lit" d={city.litD} fill={lit} />
    </svg>
  );
}

/* ------------------------------------------------------------------ TRAIN */
/* A freight locomotive that has no business being on a city street. */
export function Train({ className = '' }) {
  const wheel = (cx, r = 30) => (
    <g key={cx} transform={`translate(${cx} 160)`}>
      <circle r={r} fill="#3a4d66" stroke={INK} strokeWidth="5" />
      <g className="inc-wheel">
        <path d={`M${-r + 6} 0H${r - 6}M0 ${-r + 6}V${r - 6}`} stroke={INK} strokeWidth="4" />
        <path d={`M${-(r - 8) * 0.7} ${-(r - 8) * 0.7}L${(r - 8) * 0.7} ${(r - 8) * 0.7}`} stroke={INK} strokeWidth="3" />
      </g>
      <circle r="7" fill="#f4b04a" stroke={INK} strokeWidth="3" />
    </g>
  );
  return (
    <svg className={`inc-train ${className}`} viewBox="0 0 1000 210" aria-hidden="true">
      {/* headlight beam */}
      <path className="inc-train__beam" d="M86 92 L-260 40 L-260 170 Z" fill="#f4b04a" opacity=".22" />
      {/* cowcatcher */}
      <path d="M60 182 L118 110 L130 182 Z" fill="#d9483b" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      {/* boiler */}
      <rect x="100" y="70" width="270" height="92" rx="40" fill="#24344d" stroke={INK} strokeWidth="5" />
      <path d="M150 74 V158 M220 72 V160 M290 72 V160" stroke={INK} strokeWidth="3" opacity=".5" />
      {/* chimney + dome */}
      <path d="M150 72 L140 22 H190 L180 72 Z" fill="#3a4d66" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M240 72 C240 44 290 44 290 72" fill="#f4b04a" stroke={INK} strokeWidth="5" />
      {/* headlight */}
      <circle cx="96" cy="96" r="18" fill="#fff4c9" stroke={INK} strokeWidth="5" />
      {/* cab */}
      <rect x="360" y="26" width="130" height="140" rx="12" fill="#d9483b" stroke={INK} strokeWidth="5" />
      <rect x="384" y="50" width="82" height="50" rx="8" fill="#f4b04a" stroke={INK} strokeWidth="4" />
      <path d="M350 26 H500" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      {wheel(170)}
      {wheel(250)}
      {wheel(330)}
      {wheel(440, 24)}
      <path className="inc-train__rod" d="M170 160 H330" stroke="#c9d3de" strokeWidth="8" strokeLinecap="round" />
      {/* box car */}
      <path d="M500 150 H520" stroke={INK} strokeWidth="8" />
      <rect x="520" y="40" width="460" height="124" rx="10" fill="#a8693b" stroke={INK} strokeWidth="5" />
      <path d="M600 44 V160 M690 44 V160 M810 44 V160 M900 44 V160" stroke={INK} strokeWidth="3" opacity=".45" />
      <text x="750" y="114" textAnchor="middle" className="inc-train__text">AVLOK · FREIGHT</text>
      {wheel(580, 24)}
      {wheel(650, 24)}
      {wheel(850, 24)}
      {wheel(920, 24)}
      {/* steam */}
      <g className="inc-train__steam" fill="#e9eef4" stroke={INK} strokeWidth="4">
        <circle cx="168" cy="6" r="16" />
        <circle cx="196" cy="-14" r="22" />
        <circle cx="234" cy="-30" r="28" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------- MAZE */
/* A circular test maze, the kind an architect sketches on a napkin to see
   whether you can think in loops. Procedural: rings with gaps + spokes. */
export function Maze({ rings = 11, seed = 4, className = '', stroke = INK }) {
  const d = useMemo(() => {
    const r = rng(seed);
    const pt = (rad, a) => `${(rad * Math.cos(a)).toFixed(2)} ${(rad * Math.sin(a)).toFixed(2)}`;
    let out = '';
    for (let i = 1; i <= rings; i++) {
      const rad = i * 22;
      const gaps = 1 + Math.floor(r() * 2);
      const start = r() * Math.PI * 2;
      const seg = (Math.PI * 2) / gaps;
      for (let g = 0; g < gaps; g++) {
        const a1 = start + g * seg + 0.32;
        const a2 = start + (g + 1) * seg - 0.04;
        const large = a2 - a1 > Math.PI ? 1 : 0;
        out += `M${pt(rad, a1)} A${rad} ${rad} 0 ${large} 1 ${pt(rad, a2)} `;
      }
      if (i < rings) {
        const spokes = 1 + Math.floor(r() * 3);
        for (let s = 0; s < spokes; s++) {
          const a = r() * Math.PI * 2;
          out += `M${pt(rad, a)} L${pt(rad + 22, a)} `;
        }
      }
    }
    return out;
  }, [rings, seed]);
  const R = rings * 22 + 10;
  return (
    <svg className={`inc-maze ${className}`} viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`} aria-hidden="true">
      <path d={d} pathLength="1" fill="none" stroke={stroke} strokeWidth="4.5" strokeLinecap="round" />
      <circle r="7" fill="#d9483b" stroke={stroke} strokeWidth="3" />
    </svg>
  );
}

/* --------------------------------------------------------------- CORRIDOR */
/* One-point-perspective hotel hallway, square so it can spin a full turn and
   still cover any viewport. */
export function Corridor({ className = '' }) {
  const g = useMemo(() => {
    const depths = [1, 0.74, 0.55, 0.41, 0.3, 0.22, 0.16, 0.115, 0.08];
    const H = 500;
    const lerp = (a, b, t) => a + (b - a) * t;
    const doors = [];
    const lamps = [];
    const frames = [];
    for (let k = 0; k < depths.length - 1; k++) {
      const s0 = depths[k];
      const s1 = depths[k + 1];
      const at = (t) => lerp(s0, s1, t) * H;
      const [t1, t2] = [0.28, 0.72];
      for (const side of [-1, 1]) {
        const x1 = side * at(t1);
        const x2 = side * at(t2);
        doors.push({
          d: `M${x1} ${at(t1)} L${x1} ${-at(t1) * 0.42} L${x2} ${-at(t2) * 0.42} L${x2} ${at(t2)} Z`,
          knob: [lerp(x1, x2, 0.8), lerp(at(t1), at(t2), 0.8) * 0.25],
          kr: Math.max(2, s0 * 9),
          plaque: [lerp(x1, x2, 0.5), -lerp(at(t1), at(t2), 0.5) * 0.3],
          pr: s0 * 14,
        });
      }
      lamps.push({ cx: 0, cy: -at(0.5) * 0.97, rx: s0 * 60, ry: s0 * 10 });
      frames.push(s0 * H);
    }
    return { doors, lamps, frames, inner: depths[depths.length - 1] * H };
  }, []);
  const H = 500;
  const i = g.inner;
  return (
    <svg className={`inc-corridor ${className}`} viewBox="-500 -500 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="inc-hall-glow">
          <stop offset="0" stopColor="#fff4c9" />
          <stop offset="1" stopColor="#f4a83a" />
        </radialGradient>
        <pattern id="inc-carpet" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#7b2d26" />
          <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="#94392f" />
          <circle cx="20" cy="20" r="4" fill="#d99a3a" />
        </pattern>
        <pattern id="inc-paper" width="36" height="36" patternUnits="userSpaceOnUse">
          <rect width="36" height="36" fill="#c98b4a" />
          <path d="M18 4 C26 12 26 24 18 32 C10 24 10 12 18 4Z" fill="#b97a3c" />
        </pattern>
      </defs>
      {/* ceiling, floor, walls */}
      <path d={`M${-H} ${-H} H${H} L${i} ${-i} H${-i} Z`} fill="#ecd7aa" stroke={INK} strokeWidth="5" />
      <path d={`M${-H} ${H} H${H} L${i} ${i} H${-i} Z`} fill="url(#inc-carpet)" stroke={INK} strokeWidth="5" />
      <path d={`M${-H} ${-H} L${-i} ${-i} V${i} L${-H} ${H} Z`} fill="url(#inc-paper)" stroke={INK} strokeWidth="5" />
      <path d={`M${H} ${-H} L${i} ${-i} V${i} L${H} ${H} Z`} fill="url(#inc-paper)" stroke={INK} strokeWidth="5" />
      {/* wainscot line */}
      <path d={`M${-H} ${H * 0.35} L${-i} ${i * 0.35} M${H} ${H * 0.35} L${i} ${i * 0.35}`} stroke={INK} strokeWidth="4" opacity=".6" />
      {/* frames receding */}
      {g.frames.map((f, k) => (
        <rect key={k} x={-f} y={-f} width={f * 2} height={f * 2} fill="none" stroke={INK} strokeWidth={Math.max(1.5, 5 * (f / H))} opacity=".55" />
      ))}
      {g.doors.map((d, k) => (
        <g key={k}>
          <path d={d.d} fill="#6b3a22" stroke={INK} strokeWidth={Math.max(1.5, d.kr * 0.6)} strokeLinejoin="round" />
          <circle cx={d.knob[0]} cy={d.knob[1]} r={d.kr} fill="#f4b04a" />
          <ellipse cx={d.plaque[0]} cy={d.plaque[1]} rx={d.pr * 0.5} ry={d.pr * 0.35} fill="#f4b04a" opacity=".85" />
        </g>
      ))}
      {g.lamps.map((l, k) => (
        <ellipse key={k} {...l} fill="#fff4c9" stroke={INK} strokeWidth={Math.max(1, l.ry * 0.3)} />
      ))}
      {/* the far end glows */}
      <rect x={-i} y={-i} width={i * 2} height={i * 2} fill="url(#inc-hall-glow)" stroke={INK} strokeWidth="3" />
    </svg>
  );
}

/* --------------------------------------------------------------- FORTRESS */
export function Fortress({ className = '' }) {
  return (
    <svg className={`inc-fortress ${className}`} viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path d="M-20 420 L260 120 L420 260 L620 60 L860 300 L1040 140 L1260 330 L1420 170 L1640 420 Z" fill="#8fb0c9" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M260 120 L210 174 L250 164 L280 186 L312 158 Z M620 60 L556 124 L604 112 L640 136 L684 116 Z M1040 140 L994 190 L1036 180 L1068 200 Z M1420 170 L1376 216 L1414 206 L1448 222 Z" fill="#f3f7fb" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-20 420 L180 300 L380 380 L560 260 L800 400 L1000 300 L1200 390 L1420 290 L1640 420 Z" fill="#dfeaf3" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      {/* the fortress itself, perched mid-slope */}
      <g transform="translate(700 168)">
        <path d="M-150 120 V30 H-90 V0 H90 V30 H150 V120 Z" fill="#3a4d66" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M-20 0 V-60 H20 V0" fill="#24344d" stroke={INK} strokeWidth="5" />
        <path d="M0 -60 V-96" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <circle className="inc-blink" cx="0" cy="-100" r="7" fill="#d9483b" stroke={INK} strokeWidth="3" />
        {[-120, -80, -40, 0, 40, 80, 120].map((x) => (
          <rect key={x} x={x - 10} y="52" width="20" height="14" rx="3" fill="#f4b04a" stroke={INK} strokeWidth="3" />
        ))}
        <path d="M-150 30 H150" stroke={INK} strokeWidth="4" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ WAVES */
export function Waves({ className = '', fill = '#1f6f73', crest = '#e9f7f4' }) {
  const d = useMemo(() => {
    let p = 'M0 40';
    for (let x = 0; x <= 2400; x += 120) p += ` Q${x + 30} 10 ${x + 60} 40 T${x + 120} 40`;
    return `${p} V200 H0 Z`;
  }, []);
  return (
    <svg className={`inc-waves ${className}`} viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
      <g className="inc-waves__run">
        <path d={d} fill={fill} stroke={INK} strokeWidth="5" />
        <path d={d.replace(/V200 H0 Z$/, '')} fill="none" stroke={crest} strokeWidth="3" transform="translate(0 8)" opacity=".7" />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------- VAN */
export function Van({ className = '' }) {
  return (
    <svg className={`inc-van ${className}`} viewBox="0 0 280 170" aria-hidden="true">
      <path d="M20 120 V58 C20 40 32 30 50 30 H190 C214 30 228 44 240 66 L262 100 V120 Z" fill="#e9eef4" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <path d="M190 40 H200 C214 40 222 50 230 66 L242 92 H190 Z" fill="#8fd3e8" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <rect x="40" y="46" width="60" height="38" rx="6" fill="#8fd3e8" stroke={INK} strokeWidth="5" />
      <rect x="112" y="46" width="60" height="38" rx="6" fill="#8fd3e8" stroke={INK} strokeWidth="5" />
      <path d="M20 100 H262" stroke="#d9483b" strokeWidth="10" />
      <rect x="248" y="104" width="18" height="10" rx="3" fill="#f4b04a" stroke={INK} strokeWidth="4" />
      {[70, 210].map((cx) => (
        <g key={cx} transform={`translate(${cx} 124)`}>
          <circle r="26" fill="#3a4d66" stroke={INK} strokeWidth="6" />
          <g className="inc-wheel">
            <path d="M-14 0H14M0 -14V14" stroke={INK} strokeWidth="4" />
          </g>
          <circle r="7" fill="#c9d3de" stroke={INK} strokeWidth="3" />
        </g>
      ))}
    </svg>
  );
}

/* ----------------------------------------------------------- VAULT WHEEL */
export function VaultDoor({ className = '', wheel = true }) {
  const bolts = Array.from({ length: 12 }, (_, k) => (k / 12) * Math.PI * 2);
  return (
    <svg className={`inc-vaultdoor ${className}`} viewBox="-200 -200 400 400" aria-hidden="true">
      <defs>
        <radialGradient id="inc-steel" cx=".35" cy=".3">
          <stop offset="0" stopColor="#eef3f7" />
          <stop offset=".55" stopColor="#a9b8c7" />
          <stop offset="1" stopColor="#5c6b7c" />
        </radialGradient>
      </defs>
      <circle r="190" fill="url(#inc-steel)" stroke={INK} strokeWidth="7" />
      <circle r="160" fill="none" stroke={INK} strokeWidth="4" opacity=".5" />
      {bolts.map((a, k) => (
        <circle key={k} cx={Math.cos(a) * 174} cy={Math.sin(a) * 174} r="8" fill="#5c6b7c" stroke={INK} strokeWidth="3" />
      ))}
      {wheel && (
      <g>
        <circle r="74" fill="none" stroke={INK} strokeWidth="12" />
        <circle r="74" fill="none" stroke="#d9a441" strokeWidth="6" />
        {[0, 60, 120].map((r) => (
          <g key={r} transform={`rotate(${r})`}>
            <path d="M-112 0 H112" stroke={INK} strokeWidth="14" strokeLinecap="round" />
            <path d="M-112 0 H112" stroke="#d9a441" strokeWidth="7" strokeLinecap="round" />
          </g>
        ))}
        <circle r="26" fill="#d9a441" stroke={INK} strokeWidth="6" />
      </g>
      )}
      <text y="128" textAnchor="middle" className="inc-vaultdoor__text">LVL·3 · SECURE</text>
    </svg>
  );
}
