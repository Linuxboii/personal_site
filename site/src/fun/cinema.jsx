import { useEffect, useRef, useState } from 'react';
import { braaam } from './fx.jsx';
import TotemGL from './gl/TotemGL.jsx';

/* Everything that makes fun mode feel like a film rather than a page:
   grain, a custom cursor, the opening title sequence, the level cut-cards,
   an ambient drone, and the flood that wakes you up. */

/* ------------------------------------------------------------------ SOUND */
let ctx = null;
let drone = null;
function ac() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = ctx || new AC();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export const sound = {
  on: false,
  listeners: new Set(),
  set(v) {
    this.on = v;
    if (v) startDrone();
    else stopDrone();
    this.listeners.forEach((f) => f(v));
  },
  horn() {
    if (this.on) braaam();
  },
  depth(level) {
    if (!drone || !ctx) return;
    const t = ctx.currentTime;
    drone.filter.frequency.setTargetAtTime(180 + level * 70, t, 1.5);
    drone.a.frequency.setTargetAtTime(55 - level * 2.5, t, 2);
    drone.b.frequency.setTargetAtTime(55.35 - level * 2.5, t, 2);
  },
};

function startDrone() {
  const c = ac();
  if (!c || drone) return;
  const out = c.createGain();
  out.gain.setValueAtTime(0.0001, c.currentTime);
  out.gain.exponentialRampToValueAtTime(0.14, c.currentTime + 3);
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 220;
  filter.Q.value = 4;
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 120;
  lfo.connect(lfoGain).connect(filter.frequency);
  const a = c.createOscillator();
  const b = c.createOscillator();
  const s = c.createOscillator();
  a.type = 'sawtooth';
  b.type = 'sawtooth';
  s.type = 'sine';
  a.frequency.value = 55;
  b.frequency.value = 55.35;
  s.frequency.value = 27.5;
  const sg = c.createGain();
  sg.gain.value = 0.6;
  a.connect(filter);
  b.connect(filter);
  s.connect(sg).connect(out);
  filter.connect(out).connect(c.destination);
  [a, b, s, lfo].forEach((o) => o.start());
  drone = { out, filter, a, b, s, lfo };
}

function stopDrone() {
  if (!drone || !ctx) return;
  const d = drone;
  drone = null;
  const t = ctx.currentTime;
  d.out.gain.cancelScheduledValues(t);
  d.out.gain.setTargetAtTime(0.0001, t, 0.4);
  setTimeout(() => [d.a, d.b, d.s, d.lfo].forEach((o) => { try { o.stop(); } catch { /* already */ } }), 1800);
}

export function useSound() {
  const [on, setOn] = useState(sound.on);
  useEffect(() => {
    sound.listeners.add(setOn);
    return () => sound.listeners.delete(setOn);
  }, []);
  return [on, (v) => sound.set(v)];
}

/* ------------------------------------------------------------------ GRAIN */
/* One noise tile, painted once; CSS jumps it around in steps. That is a
   compositor-only animation, unlike repainting a canvas every frame. */
let grainUrl = null;
function grainTile() {
  if (grainUrl) return grainUrl;
  const c = document.createElement('canvas');
  c.width = c.height = 200;
  const g = c.getContext('2d');
  const img = g.createImageData(200, 200);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = Math.random() * 60;
  }
  g.putImageData(img, 0, 0);
  grainUrl = c.toDataURL('image/png');
  return grainUrl;
}

export function Grain() {
  const [url, setUrl] = useState(null);
  useEffect(() => setUrl(grainTile()), []);
  return (
    <div className="inc-film" aria-hidden="true">
      <div className="inc-film__grain" style={url ? { backgroundImage: `url(${url})` } : undefined} />
      <div className="inc-film__vignette" />
      <div className="inc-film__bars"><span /><span /></div>
    </div>
  );
}

/* ----------------------------------------------------------------- CURSOR */
export function Cursor() {
  const ring = useRef(null);
  const dot = useRef(null);
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setFine(mq.matches);
  }, []);
  useEffect(() => {
    if (!fine) return undefined;
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf;
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      const hot = e.target.closest?.('a, button, input, textarea, label');
      ring.current?.classList.toggle('is-hot', !!hot);
    };
    const tick = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move);
    raf = requestAnimationFrame(tick);
    document.documentElement.classList.add('inc-has-cursor');
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('inc-has-cursor');
    };
  }, [fine]);
  if (!fine) return null;
  return (
    <>
      <div ref={ring} className="inc-cursor" aria-hidden="true"><span /></div>
      <div ref={dot} className="inc-cursor-dot" aria-hidden="true" />
    </>
  );
}

/* ------------------------------------------------------------------ INTRO */
const INTRO_KEY = 'inc-intro-seen';
export function Intro({ onDone }) {
  const [phase, setPhase] = useState(() => {
    try { return sessionStorage.getItem(INTRO_KEY) ? 'gone' : 'on'; } catch { return 'on'; }
  });
  const enter = (withSound) => {
    if (withSound) {
      sound.set(true);
      braaam();
    }
    try { sessionStorage.setItem(INTRO_KEY, '1'); } catch { /* ignore */ }
    setPhase('leaving');
    setTimeout(() => { setPhase('gone'); onDone?.(); }, 1500);
  };
  useEffect(() => {
    if (phase !== 'on') return undefined;
    document.documentElement.classList.add('inc-locked');
    const key = (e) => { if (e.key === 'Escape') enter(false); };
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('keydown', key);
      document.documentElement.classList.remove('inc-locked');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  if (phase === 'gone') return null;

  const title = 'A DREAM WITHIN A SITE';
  return (
    <div className={`inc-intro ${phase === 'leaving' ? 'is-leaving' : ''}`} role="dialog" aria-label="Fun mode intro">
      <div className="inc-intro__bar inc-intro__bar--t" />
      <div className="inc-intro__bar inc-intro__bar--b" />
      <div className="inc-intro__flash" />
      <div className="inc-intro__inner">
        <p className="inc-intro__pre">You are about to go under</p>
        <h1 className="inc-intro__title" aria-label={title}>
          {title.split('').map((c, i) => (
            <span key={i} style={{ animationDelay: `${600 + i * 55}ms` }} aria-hidden="true">{c === ' ' ? ' ' : c}</span>
          ))}
        </h1>
        <div className="inc-intro__totem"><TotemGL /></div>
        <p className="inc-intro__sub">Sushanth Kasturi · Founder, AvlokAI · a portfolio in five levels</p>
        <div className="inc-intro__actions">
          <button type="button" className="inc-cbtn inc-cbtn--solid" onClick={() => enter(true)}>
            Go under <span className="inc-cbtn__k">with sound</span>
          </button>
          <button type="button" className="inc-cbtn" onClick={() => enter(false)}>
            Go under quietly
          </button>
        </div>
        <p className="inc-intro__hint">esc to skip · scroll to descend</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- LEVEL CARD */
/* When you drop a level the frame letterboxes, a title card slams in, and
   (with sound on) the horn sounds. Coming back up is quieter. */
export function LevelCard({ level, index, dir }) {
  const [card, setCard] = useState(null);
  const first = useRef(true);
  const lastHorn = useRef(0);
  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    sound.depth(index);
    if (level.id === 'real' || level.id === 'brief') return undefined;
    setCard({ ...level, dir, k: Date.now() });
    const root = document.querySelector('.inc');
    root?.classList.add('inc--cut');
    if (dir > 0 && Date.now() - lastHorn.current > 5000 && level.horn) {
      lastHorn.current = Date.now();
      sound.horn();
    }
    const a = setTimeout(() => root?.classList.remove('inc--cut'), 1300);
    const b = setTimeout(() => setCard(null), 2100);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [level, index, dir]);
  if (!card) return null;
  return (
    <div className="inc-card" key={card.k} role="status">
      <span className="inc-card__dir">{card.dir > 0 ? 'Descending' : 'Ascending'}</span>
      <span className="inc-card__n">{card.n}</span>
      <span className="inc-card__name">{card.label}</span>
      <span className="inc-card__x">
        {Number.isFinite(card.factor) ? (card.factor > 1 ? `Time ×${card.factor.toLocaleString()}` : 'Time ×1') : 'Time · unmeasured'}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ FLOOD */
/* The kick: water rushes up the screen, then you wake in the other site. */
export function useWake(toggleFun) {
  return () => {
    const el = document.querySelector('.inc-flood');
    sound.horn();
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sound.set(false);
      toggleFun();
      return;
    }
    el.classList.add('is-on');
    setTimeout(() => {
      sound.set(false);
      toggleFun();
    }, 1250);
  };
}

export function Flood() {
  return (
    <div className="inc-flood" aria-hidden="true">
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none"><path d="M0 30 Q150 0 300 30 T600 30 T900 30 T1200 30 V60 H0Z" /></svg>
      <span>wake up</span>
    </div>
  );
}
