import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, transform } from 'framer-motion';
import { profile, facts, projects, services, education } from '../data.js';
import { Chars, Pop, Flap, Weather, useDream } from './fx.jsx';
import { Skyline, Maze, Train, rng } from './art.jsx';
import CityFold from './gl/CityFold.jsx';
import TotemGL from './gl/TotemGL.jsx';

const featured = projects.filter((p) => p.featured);

/* ---------------------------------------------------------------- SHARED */
export function Label({ children, className = '' }) {
  return <p className={`inc-label ${className}`}>{children}</p>;
}

export function LevelTag({ n, name, factor }) {
  return (
    <p className="inc-level">
      <span className="inc-level__n">{n}</span>
      <span className="inc-level__rule" aria-hidden="true" />
      <span className="inc-level__name">{name}</span>
      {factor && <span className="inc-level__x">time ×{factor}</span>}
    </p>
  );
}

export function Hand({ children, className = '' }) {
  return <p className={`inc-hand ${className}`}>{children}</p>;
}

/* Function-form useTransform on purpose: framer can hand plain array maps
   to native ScrollTimeline, whose range drifts from ours on sticky stages.
   A JS mapper keeps every scene frame-exact. */
export function useT(reduced, value, input, output, still) {
  const map = useMemo(() => transform(input, output), [input.join(), output.join()]); // eslint-disable-line react-hooks/exhaustive-deps
  const v = useTransform(value, (x) => map(x));
  return reduced ? still : v;
}

/* ================================================================ REALITY */
export function Reality() {
  const ref = useRef(null);
  const { go, reduced } = useDream();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const copyOp = useT(reduced, p, [0, 0.1, 0.22], [1, 1, 0], 1);
  const copyY = useT(reduced, p, [0, 0.22], [0, -90], 0);
  const b1 = useT(reduced, p, [0.26, 0.34, 0.5, 0.58], [0, 1, 1, 0], 0);
  const b1s = useT(reduced, p, [0.26, 0.58], [0.9, 1.08], 1);
  const b2 = useT(reduced, p, [0.64, 0.72, 0.9, 1], [0, 1, 1, 0], 0);
  const factsOp = useT(reduced, p, [0, 0.14, 0.22], [1, 1, 0], 1);

  const [first, ...rest] = profile.name.split(' ');

  return (
    <section id="inc-real" ref={ref} className={`inc-scene inc-real ${reduced ? 'is-still' : ''}`} aria-label="Reality — home">
      <div className="inc-real__stage">
        <CityFold progress={reduced ? null : p} className="inc-real__gl" />
        <div className="inc-real__scrim" aria-hidden="true" />

        <motion.div className="inc-real__copy" style={{ opacity: copyOp, y: copyY }}>
          <Label>{profile.tagline}</Label>
          <h1 className="inc-real__name">
            <span className="inc-real__line">{first}</span>
            <span className="inc-real__line inc-real__line--b">{rest.join(' ')}.</span>
          </h1>
          <p className="inc-real__role">Founder, AvlokAI.</p>
          <p className="inc-real__pitch">{profile.pitch}</p>
          <div className="inc-actions">
            <button type="button" className="inc-cbtn inc-cbtn--solid" onClick={() => go('hall')}>
              See selected work <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="inc-cbtn" onClick={() => go('limbo')}>
              Get in touch
            </button>
          </div>
        </motion.div>

        <motion.div className="inc-real__totem" style={{ opacity: copyOp }}>
          <TotemGL />
          <Hand className="inc-real__totem-note">is this real? watch the top.</Hand>
        </motion.div>

        <motion.div className="inc-real__beat" style={{ opacity: b1, scale: b1s }} aria-hidden="true">
          <span className="inc-real__beat-big">The city folds.</span>
          <span className="inc-hand">the architect bends the street over your head. keep going.</span>
        </motion.div>
        <motion.div className="inc-real__beat" style={{ opacity: b2 }} aria-hidden="true">
          <span className="inc-real__beat-big inc-real__beat-big--sm">Nothing here is real.<br />Everything here is true.</span>
        </motion.div>

        <motion.dl className="inc-real__facts" style={{ opacity: factsOp }}>
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </motion.dl>

        <button type="button" className="inc-real__cue" onClick={() => go('brief')}>
          <span>Scroll to go under</span>
          <span className="inc-real__cue-line" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

/* ================================================================ DEBRIS */
/* The café moment: an explosion stopped dead. Shards of glass, plaster and
   paper hang in the air and drift — slowly — as you move. */
function Shard({ s, p }) {
  const y = useTransform(p, [0, 1], [s.depth * 260, -s.depth * 420]);
  const r = useTransform(p, [0, 1], [s.rot, s.rot + s.spin]);
  return (
    <motion.span
      className={`inc-shard inc-shard--${s.kind}`}
      style={{
        left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size * s.ar,
        y, rotate: r, clipPath: s.clip, '--d': s.depth, opacity: 0.35 + s.depth * 0.6,
        zIndex: s.depth > 0.8 ? 3 : 0,
      }}
    />
  );
}

const KINDS = ['glass', 'glass', 'plaster', 'paper', 'dark'];
export function Debris({ count = 26, seed = 3, kinds = KINDS }) {
  const ref = useRef(null);
  const { reduced } = useDream();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const shards = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, () => {
      const n = 3 + Math.floor(r() * 3);
      const pts = Array.from({ length: n }, (_, i) => {
        const ang = (i / n) * Math.PI * 2 + r() * 0.8;
        const rad = 30 + r() * 20;
        return `${50 + Math.cos(ang) * rad}% ${50 + Math.sin(ang) * rad}%`;
      });
      return {
        x: r() * 100, y: r() * 100, size: 10 + r() * 60, ar: 0.5 + r(), depth: 0.15 + r() * 0.95,
        rot: r() * 360, spin: (r() - 0.5) * 120, clip: `polygon(${pts.join(',')})`,
        kind: kinds[Math.floor(r() * kinds.length)],
      };
    });
  }, [count, seed, kinds]);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--mx', (e.clientX / window.innerWidth - 0.5).toFixed(3));
    el.style.setProperty('--my', (e.clientY / window.innerHeight - 0.5).toFixed(3));
  };

  return (
    <div ref={ref} className="inc-debris" aria-hidden="true" onPointerMove={onMove}>
      {!reduced && shards.map((s, i) => <Shard key={i} s={s} p={p} />)}
    </div>
  );
}

/* =============================================================== BRIEFING */
const TILTS = [-1.6, 1.2, -0.8];

export function Briefing() {
  const boardRef = useRef(null);
  const { go, reduced } = useDream();
  const { scrollYProgress: p } = useScroll({ target: boardRef, offset: ['start 85%', 'start 25%'] });
  const draw = useT(reduced, p, [0, 1], [0, 1], 1);

  return (
    <section id="inc-brief" className="inc-scene inc-brief" aria-label="The briefing — shipping now and services">
      <div className="inc-brief__spot" aria-hidden="true" />
      <Debris />
      <div className="inc-wrap">
        <div className="inc-head">
          <div>
            <LevelTag n="00" name="The briefing" factor="1" />
            <Label>Shipping now</Label>
            <Chars text="The job." className="inc-h2" />
            <Hand>three targets, one red string. the moment before it all goes off.</Hand>
          </div>
          <button type="button" className="inc-link" onClick={() => go('hall')}>All projects →</button>
        </div>

        <div className="inc-board" ref={boardRef}>
          <svg className="inc-board__string" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
            <motion.path
              d="M16.6 2 Q33.3 9 50 2 Q66.6 9 83.3 2"
              fill="none"
              stroke="#c4302b"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: draw }}
            />
          </svg>
          {featured.map((pr, i) => (
            <Pop key={pr.title} className="inc-dossier" delay={i * 110} style={{ '--tilt': `${TILTS[i % 3]}deg` }}>
              <span className="inc-pin" aria-hidden="true" />
              <span className="inc-dossier__clip" aria-hidden="true" />
              <div className="inc-dossier__top">
                <span className="inc-dossier__stamp" aria-hidden="true">Target 0{i + 1}</span>
                <span className="inc-mono">{pr.year}</span>
              </div>
              <h3 className="inc-h3">{pr.title}</h3>
              <p className="inc-dossier__kicker">{pr.kicker}</p>
              <p className="inc-dossier__summary">{pr.summary}</p>
              <ul className="inc-ticks">
                {pr.detail.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <ul className="inc-chips">
                {pr.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <a className="inc-cbtn inc-cbtn--ink" href={pr.link} target="_blank" rel="noreferrer">
                Open {pr.title} <span aria-hidden="true">↗</span>
              </a>
            </Pop>
          ))}
        </div>

        <div className="inc-head inc-head--plan">
          <div>
            <Label>What I do</Label>
            <Chars text="The plan." className="inc-h2" />
            <Hand>three layers. each one goes a little deeper.</Hand>
          </div>
          <button type="button" className="inc-link" onClick={() => go('l2')}>All skills →</button>
        </div>
        <div className="inc-blueprints">
          {services.map((s, i) => (
            <Pop key={s.title} className="inc-blueprint" delay={i * 120}>
              <svg className="inc-blueprint__draw" viewBox="0 0 200 120" aria-hidden="true">
                {i === 0 && <path d="M10 100 H190 M30 100 V40 H90 V100 M110 100 V20 H170 V100 M30 40 L60 15 L90 40 M120 35 H160 M120 55 H160 M120 75 H160" />}
                {i === 1 && <path d="M100 15 L170 55 L100 95 L30 55 Z M100 15 V95 M30 55 H170 M65 35 L135 75 M135 35 L65 75" />}
                {i === 2 && <path d="M100 10 L160 30 V65 C160 90 130 108 100 115 C70 108 40 90 40 65 V30 Z M75 62 L94 80 L128 44" />}
              </svg>
              <span className="inc-blueprint__layer" aria-hidden="true">Layer 0{i + 1}</span>
              <h3 className="inc-h3">{s.title}</h3>
              <p>{s.body}</p>
            </Pop>
          ))}
        </div>

        <Pop className="inc-cta">
          <p className="inc-cta__q">Have a workflow that feels like it should be automated? It probably can be.</p>
          <button type="button" className="inc-cbtn inc-cbtn--solid" onClick={() => go('limbo')}>
            Start a conversation <span aria-hidden="true">↗</span>
          </button>
        </Pop>
      </div>
    </section>
  );
}

/* =================================================================== DIVE */
export function Dive() {
  const ref = useRef(null);
  const { reduced } = useDream();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const draw = useT(reduced, p, [0.02, 0.45], [1, 0], 0);
  const scale = useT(reduced, p, [0.45, 1], [0.8, 14], 1);
  const rot = useT(reduced, p, [0, 1], [0, 160], 0);
  const n3 = useT(reduced, p, [0.02, 0.06, 0.13, 0.16], [0, 1, 1, 0], 0);
  const n2 = useT(reduced, p, [0.16, 0.2, 0.27, 0.3], [0, 1, 1, 0], 0);
  const n1 = useT(reduced, p, [0.3, 0.34, 0.41, 0.44], [0, 1, 1, 0], 0);
  const c2 = useT(reduced, p, [0.46, 0.52, 0.64, 0.7], [0, 1, 1, 0], 0);
  const c3 = useT(reduced, p, [0.74, 0.84, 1], [0, 1, 1], 1);
  const c3s = useT(reduced, p, [0.74, 0.9], [1.3, 1], 1);
  const ls = useT(reduced, p, [0.45, 1], [1, 0.4], 1);

  return (
    <section ref={ref} className={`inc-dive ${reduced ? 'is-still' : ''}`} aria-label="Going under">
      <div className="inc-dive__stage">
        <motion.div className="inc-dive__maze" style={{ scale, rotate: rot, '--draw': draw }} aria-hidden="true">
          <Maze rings={14} seed={5} stroke="#e8a14a" />
        </motion.div>
        <motion.div className="inc-dive__glow" style={{ opacity: ls }} aria-hidden="true" />
        <div className="inc-dive__captions">
          <motion.span className="inc-dive__num" style={{ opacity: n3 }} aria-hidden="true">3</motion.span>
          <motion.span className="inc-dive__num" style={{ opacity: n2 }} aria-hidden="true">2</motion.span>
          <motion.span className="inc-dive__num" style={{ opacity: n1 }} aria-hidden="true">1</motion.span>
          <motion.p className="inc-dive__c" style={{ opacity: c2 }}>
            Down here, a minute
            <br />
            stretches into an hour.
          </motion.p>
          <motion.div className="inc-dive__c inc-dive__c--big" style={{ opacity: c3, scale: c3s }}>
            <span className="inc-dive__lvl">Level 01</span>
            <span className="inc-dive__name">The City</span>
            <span className="inc-hand">it is raining. it is always raining.</span>
          </motion.div>
        </div>
        <p className="inc-dive__sedation" aria-hidden="true">sedation · counting down</p>
      </div>
    </section>
  );
}

/* ================================================================== CITY */
const aboutMeta = [
  { label: 'Based', value: profile.location, color: 'pink' },
  { label: 'Studying', value: 'B.Sc Cognitive Systems, Loyola Academy', color: 'teal' },
  { label: 'Practices', value: 'AI automation · VAPT · SOC · Forensics', color: 'amber' },
];

const bio = [
  'AvlokAI helps small and mid-sized businesses replace manual, repetitive operations with autonomous AI workflows like lead-gen agents, inbox triage, RAG knowledge assistants, internal copilots, and the integrations that hold them together. I handle discovery, scoping, building, and delivery directly with clients.',
  'Alongside client work I ship my own products. Consensus Engine puts an idea in front of twenty independent AI agents and returns twenty scored opinions with reasoning. Gatecheck audits a research manuscript for citation integrity, novelty, and patent risk before it goes out the door.',
  'Before AvlokAI, I trained in digital forensics and built a full SOC lab from scratch using Wazuh, Suricata, and the ELK stack. That background still shapes how I build: assume things will fail, log everything, and design for observability from day one.',
  "I'm currently pursuing a B.Sc in Cognitive Systems at Loyola Academy. Outside of work I debate, anchor cultural events, and play CTFs. I placed 2nd at the ABP Infocom CTF in 2025 against 300+ participants.",
];
const BIO_TILT = [-1, 0.8, -0.5, 1.1];
const TITLE = 'Builder, founder, blue teamer.';

function Mirrors() {
  const ref = useRef(null);
  const { reduced } = useDream();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const ry = useT(reduced, p, [0, 1], [-22, 22], 0);
  const rx = useT(reduced, p, [0, 1], [6, -6], 0);
  return (
    <div className="inc-mirror" ref={ref}>
      <motion.div className="inc-mirror__room" style={{ rotateY: ry, rotateX: rx }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="inc-mirror__frame" style={{ '--i': i }} aria-hidden={i > 0 ? 'true' : undefined}>
            {i === 0 ? (
              <Chars text={TITLE} className="inc-h2 inc-mirror__title" />
            ) : (
              <span className="inc-mirror__echo">{TITLE}</span>
            )}
          </div>
        ))}
      </motion.div>
      <Hand className="inc-mirror__note">two mirrors, facing. the title goes on forever.</Hand>
    </div>
  );
}

export function City() {
  const streetRef = useRef(null);
  const { reduced } = useDream();
  const { scrollYProgress: p } = useScroll({ target: streetRef, offset: ['start end', 'end start'] });
  const trainX = useT(reduced, p, [0, 1], ['60%', '-120%'], '0%');

  return (
    <section id="inc-l1" className="inc-scene inc-l1" aria-label="Level 1, the city — about">
      <Weather kind="rain" />
      <div className="inc-l1__lightning" aria-hidden="true" />
      <div className="inc-l1__skyline" aria-hidden="true">
        <Skyline seed={21} height={420} litChance={0.4} palette={['#17222f', '#1b2735', '#141d29']} stroke="#05070b" unlit="#0b121b" lit="#e8a14a" />
      </div>

      <div className="inc-wrap inc-l1__intro">
        <LevelTag n="01" name="The city" factor="20" />
        <Label>About</Label>
        <Mirrors />
        <p className="inc-lede">
          I'm Sushanth Kasturi, founder of AvlokAI, an AI automation agency. I started in cybersecurity and moved into AI
          because both come from the same instinct: study a system carefully enough to make it do what you want.
        </p>
        <dl className="inc-neons">
          {aboutMeta.map((m, i) => (
            <Pop key={m.label} className={`inc-neon inc-neon--${m.color}`} delay={i * 140}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </Pop>
          ))}
        </dl>
      </div>

      <div className="inc-street" ref={streetRef} aria-hidden="true">
        <div className="inc-street__wet" />
        <motion.div className="inc-street__train" style={{ x: trainX }}>
          <Train />
        </motion.div>
        <div className="inc-street__rails" />
        <p className="inc-hand inc-street__note">a freight train, in the middle of the street. someone's subconscious is not happy.</p>
      </div>

      <div className="inc-wrap">
        <div className="inc-notes">
          {bio.map((b, i) => (
            <Pop key={i} className="inc-note" delay={(i % 2) * 120} style={{ '--tilt': `${BIO_TILT[i]}deg` }}>
              <span className="inc-note__label" aria-hidden="true">Case note 0{i + 1}</span>
              <p>{b}</p>
            </Pop>
          ))}
        </div>

        <div className="inc-board-flap">
          <div className="inc-board-flap__head">
            <h3 className="inc-board-flap__title">Education</h3>
            <span className="inc-board-flap__sub" aria-hidden="true">Departures · Platform 1</span>
          </div>
          <ol className="inc-board-flap__rows">
            {education.map((e) => (
              <li key={e.title} className="inc-board-flap__row">
                <span className="inc-board-flap__when"><Flap text={e.period} /></span>
                <span className="inc-board-flap__what">
                  <Flap text={e.title} className="inc-flap--title" />
                  <span className="inc-board-flap__org">{e.org}</span>
                </span>
                <span className="inc-board-flap__status" aria-hidden="true">Departed</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
