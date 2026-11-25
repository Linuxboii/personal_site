import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { profile, skills, projects, achievements, training, navLinks } from '../data.js';
import { useMode } from '../mode.js';
import { Chars, Pop, Weather, useDream } from './fx.jsx';
import { Skyline, Fortress, Waves, Van, VaultDoor, rng } from './art.jsx';
import { Label, LevelTag, Hand, useT } from './ScenesTop.jsx';
import Hallway from './gl/Hallway.jsx';
import TotemGL from './gl/TotemGL.jsx';
import { useWake } from './cinema.jsx';

/* Scroll-driven readouts write straight to the DOM, so a counter ticking
   every frame never re-renders the section around it. */
function Live({ value, format }) {
  const ref = useRef(null);
  useMotionValueEvent(value, 'change', (v) => {
    if (ref.current) ref.current.textContent = format(v);
  });
  return <span ref={ref}>{format(value.get())}</span>;
}

function useMedia(q) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

/* ================================================================= HOTEL */
const skillMeta = [
  { label: 'Primary', value: 'AI automation' },
  { label: 'Foundation', value: 'Cybersecurity' },
  { label: 'Tools', value: `${skills.tools.length} in rotation` },
];
const BOTTLES = ['amber', 'teal', 'red', 'sky', 'plum', 'lime'];

/* Things that came loose when gravity switched off. */
function Floaters() {
  const items = useMemo(() => {
    const r = rng(12);
    const kinds = ['paper', 'paper', 'pen', 'glass', 'key', 'paper', 'book', 'pen', 'paper', 'glass', 'key', 'book'];
    return kinds.map((k, i) => ({ k, x: 4 + r() * 92, y: 4 + r() * 92, s: 0.7 + r() * 0.8, d: -r() * 20, i }));
  }, []);
  const art = {
    paper: <path d="M4 2 H36 L44 10 V58 H4 Z M36 2 V10 H44 M10 20 H36 M10 28 H38 M10 36 H32 M10 44 H36" />,
    pen: <path d="M4 52 L44 12 L50 18 L10 58 Z M4 52 L2 60 L10 58 M40 16 L46 22" />,
    glass: <path d="M10 8 H40 L36 56 H14 Z M12 30 H38" />,
    key: <path d="M14 30 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 M24 30 H58 M48 30 V38 M54 30 V36" />,
    book: <path d="M4 10 H44 V54 H4 Z M10 10 V54 M16 20 H38 M16 26 H34" />,
  };
  return (
    <div className="inc-floaters" aria-hidden="true">
      {items.map((it) => (
        <svg
          key={it.i}
          className={`inc-floater inc-floater--${it.i % 4}`}
          viewBox="0 0 62 62"
          style={{ left: `${it.x}%`, top: `${it.y}%`, '--s': it.s, animationDelay: `${it.d}s` }}
        >
          {art[it.k]}
        </svg>
      ))}
    </div>
  );
}

export function Hotel() {
  const ref = useRef(null);
  const { reduced } = useDream();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const tilt = useT(reduced, p, [0, 0.5, 1], [-4, 4, -2], 0);
  const wall = useT(reduced, p, [0, 1], [0, -160], 0);
  const grav = useT(reduced, p, [0, 1], [-30, 30], 0);

  return (
    <section id="inc-l2" ref={ref} className="inc-scene inc-l2" aria-label="Level 2, the hotel — skills">
      <motion.div className="inc-l2__wall" style={{ y: wall }} aria-hidden="true" />
      <div className="inc-l2__glow" aria-hidden="true" />
      <Floaters />
      <div className="inc-gravity" aria-hidden="true">
        <motion.span className="inc-gravity__needle" style={{ rotate: grav }} />
        <span className="inc-gravity__k">Gravity</span>
        <span className="inc-gravity__v">{reduced ? '0°' : <Live value={p} format={(v) => `${Math.round(-30 + v * 60)}°`} />}</span>
      </div>
      <motion.div className="inc-wrap" style={{ rotate: tilt }}>
        <LevelTag n="02" name="The hotel" factor="400" />
        <Label>Skills</Label>
        <Chars text="What I build with." className="inc-h2" />
        <p className="inc-lede">
          Two practices, one operator. AI automation pays the bills today; cybersecurity is how I learned to think about
          systems.
        </p>
        <dl className="inc-plaques">
          {skillMeta.map((m) => (
            <div key={m.label} className="inc-plaque">
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
        <Hand>gravity up here is a suggestion. everything floats a little.</Hand>

        <div className="inc-group">
          <div className="inc-group__head">
            <h3 className="inc-h3">AI Automation</h3>
            <span className="inc-mono">Primary · room keys</span>
          </div>
          <div className="inc-keys">
            {skills.aiAutomation.map((s, i) => (
              <Pop key={s.name} className="inc-key" delay={(i % 3) * 90} style={{ '--bob': `${(i % 4) * -1.3}s` }}>
                <span className="inc-key__fob" aria-hidden="true">
                  <span className="inc-key__hole" />
                  <span className="inc-key__num">2{String(i + 1).padStart(2, '0')}</span>
                </span>
                <span className="inc-key__body">
                  <span className="inc-key__name">{s.name}</span>
                  <span className="inc-key__detail">{s.detail}</span>
                </span>
              </Pop>
            ))}
          </div>
        </div>

        <div className="inc-group">
          <div className="inc-group__head">
            <h3 className="inc-h3">Cybersecurity</h3>
            <span className="inc-mono">Foundation · safe deposit</span>
          </div>
          <div className="inc-boxes">
            {skills.cybersecurity.map((s, i) => (
              <Pop key={s.name} className="inc-box" delay={(i % 3) * 90} style={{ '--bob': `${(i % 3) * -1.7}s` }}>
                <span className="inc-box__num" aria-hidden="true">Box {String(i + 1).padStart(2, '0')}</span>
                <span className="inc-box__keyhole" aria-hidden="true" />
                <span className="inc-box__name">{s.name}</span>
                <span className="inc-box__detail">{s.detail}</span>
              </Pop>
            ))}
          </div>
        </div>

        <div className="inc-group">
          <div className="inc-group__head">
            <h3 className="inc-h3">Tools &amp; Stack</h3>
            <span className="inc-mono">the chemist's shelf · {skills.tools.length} in rotation</span>
          </div>
          <ul className="inc-shelf">
            {skills.tools.map((t, i) => (
              <li key={t} className={`inc-bottle inc-bottle--${BOTTLES[i % BOTTLES.length]}`} style={{ '--i': i }}>
                <span className="inc-bottle__glass" aria-hidden="true"><span className="inc-bottle__liquid" /></span>
                <span className="inc-bottle__label">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

/* ============================================================== CORRIDOR */
const projMeta = [
  { label: 'Projects', value: `${projects.length} listed` },
  { label: 'Products', value: 'OncoLens · Mula Map · Consensus Engine · Gatecheck · Speak · Mantrana · Baaki · Lekha Khata' },
  { label: 'Focus', value: 'AI automation · Security' },
];

function tone(p) {
  if (p.role === 'Playground' || p.role === 'Tool') return 'teal';
  if (p.role === 'Product' || p.role === 'Founder') return 'amber';
  if (p.role === 'Security build' || p.role === 'Training engagements') return 'steel';
  return 'red';
}

function Door({ p, i }) {
  return (
    <article className={`inc-door inc-door--${tone(p)}`} style={{ '--bob': `${(i % 5) * -1.1}s`, '--sway': `${((i % 3) - 1) * 1.4}deg` }}>
      <div className="inc-door__plaque" aria-hidden="true">
        <span>Room</span>
        <b>{String(201 + i)}</b>
      </div>
      <div className="inc-door__meta">
        <span className="inc-mono">{p.role}</span>
        {p.year && <span className="inc-mono">{p.year}</span>}
      </div>
      <h3 className="inc-door__title">{p.title}</h3>
      {p.sanskrit ? (
        <p className="inc-door__kicker">
          <span lang="sa">{p.sanskrit}</span> <span className="inc-door__meaning">· {p.meaning}</span>
        </p>
      ) : (
        p.kicker && <p className="inc-door__kicker">{p.kicker}</p>
      )}
      <p className="inc-door__short">{p.short || p.summary}</p>
      <ul className="inc-chips inc-chips--door">
        {p.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div className="inc-door__foot">
        <span className="inc-door__knob" aria-hidden="true" />
        {p.link ? (
          <a className="inc-cbtn inc-cbtn--sm" href={p.link} target="_blank" rel="noreferrer" aria-label={`Open ${p.title}`}>
            Open the door <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="inc-door__locked">Do not disturb</span>
        )}
      </div>
    </article>
  );
}

export function Hallway3() {
  const { reduced } = useDream();
  const wide = useMedia('(min-width: 900px)') && !reduced;
  const runRef = useRef(null);
  const stackRef = useRef(null);
  const trackRef = useRef(null);
  const [dims, setDims] = useState({ max: 0, h: 0 });

  useLayoutEffect(() => {
    if (!wide) return undefined;
    const measure = () => {
      const t = trackRef.current;
      if (!t) return;
      const max = Math.max(0, t.scrollWidth - window.innerWidth);
      setDims({ max, h: max + window.innerHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [wide]);

  const { scrollYProgress: p } = useScroll({ target: wide ? runRef : stackRef, offset: wide ? ['start start', 'end end'] : ['start end', 'end start'] });
  const x = useTransform(p, (v) => -v * dims.max);
  const sway = useTransform(p, (v) => Math.sin(v * Math.PI * 6) * 2.5);

  const intro = (
    <div className="inc-hall__intro">
      <LevelTag n="02½" name="The corridor" factor="400" />
      <Label>Projects</Label>
      <Chars text="Selected work." className="inc-h2" />
      <p className="inc-lede">
        A mix of AvlokAI products, AI automation builds, and cybersecurity labs. Client projects are anonymized or
        omitted; everything below is mine to talk about.
      </p>
      <dl className="inc-plaques inc-plaques--stack">
        {projMeta.map((m) => (
          <div key={m.label} className="inc-plaque">
            <dt>{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>
      {wide && <Hand>keep scrolling. the hallway handles the rest. it rotates. hold on.</Hand>}
    </div>
  );

  if (!wide) {
    return (
      <section id="inc-hall" ref={stackRef} className="inc-scene inc-hall inc-hall--stack" aria-label="The corridor — projects">
        <div className="inc-hall__bg" aria-hidden="true">
          <Hallway progress={reduced ? null : p} />
        </div>
        <div className="inc-wrap">
          {intro}
          <div className="inc-hall__list">
            {projects.map((pr, i) => (
              <Pop key={pr.title} delay={(i % 2) * 80}>
                <Door p={pr} i={i} />
              </Pop>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="inc-hall" className="inc-scene inc-hall" aria-label="The corridor — projects">
      <div ref={runRef} className="inc-hall__run" style={{ height: dims.h || '400vh' }}>
        <div className="inc-hall__stage">
          <Hallway progress={p} className="inc-hall__gl" />
          <div className="inc-hall__vignette" aria-hidden="true" />
          <motion.div ref={trackRef} className="inc-hall__track" style={{ x, rotate: sway }}>
            {intro}
            {projects.map((pr, i) => (
              <Door key={pr.title} p={pr} i={i} />
            ))}
            <div className="inc-hall__end" aria-hidden="true">
              <span className="inc-hand">end of the hall.</span>
              <span className="inc-hand">the stairs go down. further down.</span>
            </div>
          </motion.div>
          <div className="inc-hall__hud" aria-hidden="true">
            <span>
              Room <Live value={p} format={(v) => String(Math.min(projects.length, Math.max(1, Math.round(v * (projects.length - 1)) + 1))).padStart(2, '0')} /> / {projects.length}
            </span>
            <span>Roll ↻ <Live value={p} format={(v) => `${Math.round(v * 360) % 360}°`} /></span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================== FORTRESS */
export function Fortress3() {
  const vaultRef = useRef(null);
  const { reduced } = useDream();
  const { scrollYProgress: p } = useScroll({ target: vaultRef, offset: ['start 85%', 'center 45%'] });
  const wheel = useT(reduced, p, [0, 0.55], [0, 540], 540);
  const door = useT(reduced, p, [0.5, 1], [0, -108], -108);
  const glow = useT(reduced, p, [0.55, 1], [0, 1], 1);

  return (
    <section id="inc-l3" className="inc-scene inc-l3" aria-label="Level 3, the fortress — highlights and training">
      <Weather kind="snow" />
      <div className="inc-l3__fog" aria-hidden="true" />
      <div className="inc-l3__peaks" aria-hidden="true">
        <Fortress />
      </div>
      <div className="inc-wrap">
        <LevelTag n="03" name="The fortress" factor="8,000" />
        <Label>Highlights · 2026</Label>
        <Chars text="The vault." className="inc-h2" />
        <Hand>whatever sits in the safe at the bottom is the idea that sticks.</Hand>

        <div className="inc-vault" ref={vaultRef}>
          <motion.div className="inc-vault__inside">
            <motion.div className="inc-vault__light" style={{ opacity: glow }} aria-hidden="true" />
            <h3 className="inc-vault__title">Highlights</h3>
            <ul className="inc-vault__list">
              {achievements.map((a, i) => (
                <li key={a} style={{ '--i': i }}>
                  <span className="inc-vault__star" aria-hidden="true">✦</span>
                  {a}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div className="inc-vault__door" style={{ rotateY: door }} aria-hidden="true">
            <VaultDoor wheel={false} />
            <motion.div className="inc-vault__wheel" style={{ rotate: wheel }}>
              <svg viewBox="-130 -130 260 260">
                <circle r="74" fill="none" stroke="#0b0f15" strokeWidth="12" />
                <circle r="74" fill="none" stroke="#c9a15a" strokeWidth="6" />
                {[0, 60, 120].map((r) => (
                  <g key={r} transform={`rotate(${r})`}>
                    <path d="M-112 0 H112" stroke="#0b0f15" strokeWidth="14" strokeLinecap="round" />
                    <path d="M-112 0 H112" stroke="#c9a15a" strokeWidth="7" strokeLinecap="round" />
                  </g>
                ))}
                <circle r="26" fill="#c9a15a" stroke="#0b0f15" strokeWidth="6" />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        <div className="inc-group">
          <div className="inc-group__head">
            <h3 className="inc-h3">Training</h3>
            <span className="inc-mono">lift passes · valid all season</span>
          </div>
          <div className="inc-tickets">
            {training.map((t, i) => (
              <Pop key={t.title} className="inc-ticket" delay={i * 120}>
                <span className="inc-ticket__stub" aria-hidden="true">
                  <b>Pass</b>
                  <span>0{i + 1}</span>
                </span>
                <span className="inc-ticket__body">
                  <span className="inc-mono">{t.period}</span>
                  <span className="inc-ticket__title">
                    {t.title} · <span className="inc-ticket__org">{t.org}</span>
                  </span>
                  <span className="inc-ticket__detail">{t.detail}</span>
                </span>
              </Pop>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================= LIMBO */
const contactMeta = [
  { label: 'Reply time', value: 'Within one working day' },
  { label: 'Based', value: `${profile.location} · IST` },
  { label: 'Open to', value: 'Automation builds · Security reviews' },
];

const nextSteps = [
  { step: '01', title: 'You send the mess', body: 'The process, the spreadsheet, the inbox. Rough notes are fine.' },
  { step: '02', title: 'I reply with a read', body: 'What is worth automating, what is not, and roughly what it takes.' },
  { step: '03', title: 'We scope it', body: 'A short call, then a fixed scope with a delivery date attached.' },
];

function handleSubmit(e) {
  e.preventDefault();
  const f = e.currentTarget;
  const name = f.name_field.value.trim();
  const email = f.email.value.trim();
  const subject = f.subject.value.trim() || `Inbound from ${name || 'portfolio'}`;
  const message = f.message.value.trim();
  const body = `${message}\n\n- ${name}\n${email}`;
  const to = profile.emailPrimary;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(gmailUrl, '_blank', 'noopener,noreferrer');
}

/* Stairs that only ever go up: a treadmill of steps under a climber. */
function EndlessStairs() {
  return (
    <svg className="inc-endless" viewBox="0 0 220 160" aria-hidden="true">
      <defs>
        <clipPath id="inc-stair-clip"><rect x="0" y="0" width="220" height="160" /></clipPath>
        <linearGradient id="inc-stair-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c9d6dc" />
          <stop offset="1" stopColor="#7d939c" />
        </linearGradient>
      </defs>
      <g clipPath="url(#inc-stair-clip)">
        <g className="inc-endless__steps">
          {Array.from({ length: 10 }, (_, i) => (
            <path key={i} d={`M${-40 + i * 32} ${200 - i * 22} h32 v-22`} fill="none" stroke="url(#inc-stair-g)" strokeWidth="3" />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <path key={`f${i}`} d={`M${-40 + i * 32} ${200 - i * 22} h32 v40 h-32 Z`} fill="rgba(201,214,220,.08)" />
          ))}
        </g>
      </g>
      <g className="inc-endless__climber">
        <circle cx="112" cy="72" r="6" fill="#e8a14a" />
        <path d="M112 78 V98 M112 86 L104 94 M112 86 L120 92 M112 98 L106 110 M112 98 L118 108" stroke="#e8a14a" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Crumble({ side }) {
  const bits = useMemo(() => {
    const r = rng(side === 'l' ? 5 : 9);
    return Array.from({ length: 14 }, () => ({ x: r() * 100, s: 4 + r() * 12, d: r() * 6, t: 4 + r() * 4 }));
  }, [side]);
  return bits.map((b, i) => (
    <span key={i} className="inc-crumb" style={{ left: `${b.x}%`, width: b.s, height: b.s, animationDelay: `${b.d}s`, animationDuration: `${b.t}s` }} />
  ));
}

export function Limbo() {
  const ref = useRef(null);
  const { reduced } = useDream();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cliffL = useT(reduced, p, [0, 1], [60, 220], 120);
  const cliffR = useT(reduced, p, [0, 1], [120, 260], 160);
  const tiltL = useT(reduced, p, [0, 1], [-2, -9], -4);
  const tiltR = useT(reduced, p, [0, 1], [3, 11], 5);

  return (
    <section id="inc-limbo" ref={ref} className="inc-scene inc-limbo" aria-label="Limbo — contact">
      <div className="inc-limbo__sky" aria-hidden="true" />
      <div className="inc-limbo__sun" aria-hidden="true" />
      <motion.div className="inc-limbo__cliff inc-limbo__cliff--l" style={{ y: cliffL, rotate: tiltL }} aria-hidden="true">
        <Skyline seed={41} width={700} height={620} crumble palette={['#8ea4a8', '#7a9196', '#a3b5b6']} lit="#f3dcae" unlit="#4f6a70" litChance={0.12} stroke="#22353a" />
        <Crumble side="l" />
      </motion.div>
      <motion.div className="inc-limbo__cliff inc-limbo__cliff--r" style={{ y: cliffR, rotate: tiltR }} aria-hidden="true">
        <Skyline seed={77} width={700} height={620} crumble palette={['#8ea4a8', '#7a9196', '#a3b5b6']} lit="#f3dcae" unlit="#4f6a70" litChance={0.12} stroke="#22353a" />
        <Crumble side="r" />
      </motion.div>

      <div className="inc-wrap inc-limbo__wrap">
        <LevelTag n="∞" name="Limbo" factor="∞" />
        <Label>Contact</Label>
        <Chars text="Let's talk." className="inc-h2 inc-h2--giant" />
        <p className="inc-lede">
          Tell me what's slowing your team down. Manual ops, fragile spreadsheets, an inbox you can't keep up with. I'll
          tell you whether it's worth automating.
        </p>
        <dl className="inc-msgs">
          {contactMeta.map((m, i) => (
            <Pop key={m.label} className="inc-msg" delay={i * 100}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </Pop>
          ))}
        </dl>

        <div className="inc-limbo__grid">
          <div className="inc-limbo__left">
            <ul className="inc-ashore">
              <li>
                <span className="inc-ashore__k">Email</span>
                <a href={`mailto:${profile.emailPrimary}`}>{profile.emailPrimary}</a>
                <span className="inc-ashore__or">
                  Or <a href={`mailto:${profile.emailFallback}`}>{profile.emailFallback}</a>
                </span>
              </li>
              <li>
                <span className="inc-ashore__k">Phone</span>
                <a href={`tel:${profile.phone.replace(/\s+/g, '')}`}>{profile.phone}</a>
              </li>
              <li>
                <span className="inc-ashore__k">Location</span>
                <span>{profile.location}</span>
              </li>
            </ul>
            <div className="inc-buoys">
              <a className="inc-cbtn inc-cbtn--sm" href={profile.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="inc-cbtn inc-cbtn--sm" href={profile.socials.github} target="_blank" rel="noreferrer">GitHub</a>
              <a className="inc-cbtn inc-cbtn--sm" href={profile.socials.website} target="_blank" rel="noreferrer">AvlokAI</a>
            </div>

            <div className="inc-stairs">
              <div className="inc-stairs__head">
                <p className="inc-stairs__title">What happens next</p>
                <EndlessStairs />
              </div>
              <ol>
                {nextSteps.map((s, i) => (
                  <Pop as="li" key={s.step} className="inc-stair" delay={i * 120} style={{ '--i': i }}>
                    <span className="inc-stair__n">{s.step}</span>
                    <span>
                      <b>{s.title}</b>
                      <span>{s.body}</span>
                    </span>
                  </Pop>
                ))}
              </ol>
              <Hand>a staircase that only goes up. paradox, but it gets you there.</Hand>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="inc-postcard">
            <div className="inc-postcard__top" aria-hidden="true">
              <span className="inc-postcard__air">Message from limbo</span>
              <span className="inc-postcard__stamp">
                <svg viewBox="0 0 40 50"><path d="M20 6c-6 0-11 2-11 4 0 6 5 14 11 30 6-16 11-24 11-30 0-2-5-4-11-4Z" fill="#c9d3de" stroke="#0b0f15" strokeWidth="2" /><rect x="17.5" y="0" width="5" height="9" rx="2" fill="#c9d3de" stroke="#0b0f15" strokeWidth="1.6" /></svg>
              </span>
            </div>
            <p className="inc-postcard__lead">Plant an idea</p>
            <div className="inc-postcard__row">
              <label>
                <span className="visually-hidden">Your name</span>
                <input name="name_field" placeholder="Your name" required />
              </label>
              <label>
                <span className="visually-hidden">Your email</span>
                <input name="email" type="email" placeholder="Your email" required />
              </label>
            </div>
            <label>
              <span className="visually-hidden">Subject</span>
              <input name="subject" placeholder="Subject" />
            </label>
            <label>
              <span className="visually-hidden">Message</span>
              <textarea name="message" rows={8} placeholder="What are you trying to automate, ship, or secure?" required />
            </label>
            <button type="submit" className="inc-cbtn inc-cbtn--solid">
              Send message <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </div>

      <div className="inc-limbo__sea" aria-hidden="true">
        <Waves className="inc-waves--back" fill="#2e6f73" crest="#bfe3df" />
        <Waves fill="#1d5559" crest="#d8f0ec" />
      </div>
    </section>
  );
}

/* ================================================================== KICK */
const featured = projects.filter((p) => p.featured);
const pageTarget = { '/': 'real', '/about': 'l1', '/skills': 'l2', '/projects': 'hall', '/contact': 'limbo' };

export function Kick() {
  const dropRef = useRef(null);
  const { go, reduced } = useDream();
  const { toggleFun } = useMode();
  const wake = useWake(toggleFun);
  const { scrollYProgress: p } = useScroll({ target: dropRef, offset: ['start 90%', 'end 60%'] });
  const vanY = useT(reduced, p, [0, 1], ['-20%', '235%'], '200%');
  const vanR = useT(reduced, p, [0, 1], [-6, 28], 24);
  const splash = useT(reduced, p, [0.84, 0.92, 1], [0, 1, 1], 1);
  const splashS = useT(reduced, p, [0.84, 1], [0.2, 1], 1);

  const rewind = () => {
    document.documentElement.classList.add('inc-rewinding');
    go('real', { duration: 2.6 });
    setTimeout(() => document.documentElement.classList.remove('inc-rewinding'), 2700);
  };

  return (
    <footer id="inc-kick" className="inc-scene inc-kick" aria-label="The kick — footer">
      <div className="inc-kick__drop" ref={dropRef} aria-hidden="true">
        <div className="inc-kick__rail" />
        <motion.div className="inc-kick__van" style={{ y: vanY, rotate: vanR }}>
          <Van />
          <span className="inc-kick__trail" />
        </motion.div>
        <motion.div className="inc-kick__splash" style={{ opacity: splash, scale: splashS }}>
          {Array.from({ length: 9 }, (_, i) => <span key={i} style={{ '--i': i }} />)}
        </motion.div>
        <div className="inc-kick__water" />
        <p className="inc-kick__slow">slow motion · 1/20 speed</p>
      </div>

      <div className="inc-wrap">
        <LevelTag n="↑" name="The kick" />
        <Chars text="Time for the kick." className="inc-h2" />
        <p className="inc-lede">
          Same site, dreamt louder. When you're ready, wake up, or go back under for another round.
        </p>
        <div className="inc-actions">
          <button type="button" className="inc-cbtn inc-cbtn--solid" onClick={wake}>
            Wake up <span aria-hidden="true">⏏</span>
          </button>
          <button type="button" className="inc-cbtn" onClick={rewind}>
            Go back under <span aria-hidden="true">↺</span>
          </button>
        </div>

        <div className="inc-foot">
          <div>
            <p className="inc-foot__name">{profile.name}</p>
            <p className="inc-foot__tag">{profile.tagline}</p>
          </div>
          <nav aria-label="Pages">
            <p className="inc-foot__k">Pages</p>
            <ul>
              {navLinks.map((l) => (
                <li key={l.to}>
                  <button type="button" onClick={() => go(pageTarget[l.to])}>{l.label}</button>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="inc-foot__k">Products</p>
            <ul>
              {featured.map((pr) => (
                <li key={pr.title}>
                  <a href={pr.link} target="_blank" rel="noreferrer">{pr.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="inc-foot__k">Elsewhere</p>
            <ul>
              <li><a href={`mailto:${profile.emailPrimary}`}>{profile.emailPrimary}</a></li>
              <li><a href={profile.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
              <li><a href={profile.socials.github} target="_blank" rel="noreferrer">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="inc-ending">
          <div className="inc-ending__stage" aria-hidden="true">
            <TotemGL mode="ending" />
            <div className="inc-ending__cut"><span>cut to black</span></div>
          </div>
          <div className="inc-ending__legal">
            <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
            <p className="inc-mono">{profile.role} · {profile.location}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
