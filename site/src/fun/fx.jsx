import { Fragment, createContext, useContext, useEffect, useRef, useState } from 'react';

/* ---------------------------------------------------------------- CONTEXT */
export const DreamContext = createContext({ go: () => {}, reduced: false, lenis: { current: null } });
export const useDream = () => useContext(DreamContext);

/* ------------------------------------------------------------ BOIL FILTER */
/* Three slightly different displacement maps, cycled ~8 times a second, so
   outlines shimmer like hand-inked cels. Used only on small illustrations. */
export function BoilDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        {[11, 37, 73].map((seed, i) => (
          <filter id={`inc-boil-${i}`} key={seed} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        ))}
      </defs>
    </svg>
  );
}

/* --------------------------------------------------------------- IN VIEW */
export function useInView(ref, { once = true, margin = '0px 0px -12% 0px', threshold = 0.15 } = {}) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setOn(true); return undefined; }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          if (once) io.disconnect();
        } else if (!once) setOn(false);
      },
      { rootMargin: margin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, margin, threshold]);
  return on;
}

/* ------------------------------------------------------------ CHAR TITLES */
/* Splits a heading into words → chars so each letter can pop in on its own
   beat, while words still wrap as words. Screen readers get the plain text. */
export function Chars({ text, as: Tag = 'h2', className = '', step = 28 }) {
  const ref = useRef(null);
  const on = useInView(ref);
  let n = 0;
  return (
    <Tag ref={ref} className={`inc-chars ${on ? 'is-on' : ''} ${className}`} aria-label={text}>
      {text.split(' ').map((w, wi, all) => (
        <Fragment key={wi}>
          <span className="inc-chars__w" aria-hidden="true">
            {w.split('').map((c, ci) => {
              n += 1;
              return (
                <span className="inc-chars__c" style={{ animationDelay: `${n * step}ms` }} key={ci}>
                  {c}
                </span>
              );
            })}
          </span>
          {wi < all.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  );
}

/* Generic "appear when scrolled to" wrapper using a CSS class, cheaper than
   a motion component per card. */
export function Pop({ as: Tag = 'div', className = '', children, delay = 0, style, ...rest }) {
  const ref = useRef(null);
  const on = useInView(ref);
  return (
    <Tag
      ref={ref}
      className={`inc-pop ${on ? 'is-on' : ''} ${className}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------- SPLIT FLAP */
const FLAP_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·—';
export function Flap({ text, className = '' }) {
  const ref = useRef(null);
  const on = useInView(ref);
  const target = text.toUpperCase();
  const [shown, setShown] = useState(target);

  useEffect(() => {
    if (!on) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(target); return undefined; }
    let f = 0;
    const id = setInterval(() => {
      f += 1;
      let done = true;
      const next = target
        .split('')
        .map((c, i) => {
          if (c === ' ' || f > 4 + i * 0.9) return c;
          done = false;
          return FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)];
        })
        .join('');
      setShown(next);
      if (done) clearInterval(id);
    }, 42);
    return () => clearInterval(id);
  }, [on, target]);

  return (
    <span ref={ref} className={`inc-flap ${className}`} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}

/* -------------------------------------------------------------- PARTICLES */
/* Rain (level 1) or snow (level 3). Runs only while its section is on screen
   and drops to a handful of particles under reduced motion. */
export function Weather({ kind = 'rain' }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = reduced ? 30 : kind === 'rain' ? Math.min(260, Math.floor(w / 5)) : Math.min(180, Math.floor(w / 8));
    const ps = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: 0.4 + Math.random() * 0.9,
      s: Math.random() * Math.PI * 2,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      if (kind === 'rain') {
        ctx.strokeStyle = 'rgba(200,220,240,.55)';
        ctx.lineCap = 'round';
        for (const p of ps) {
          ctx.lineWidth = 1.4 * p.z;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 4 * p.z, p.y + 22 * p.z);
          ctx.stroke();
          if (!reduced) {
            p.y += 16 * p.z;
            p.x -= 3 * p.z;
          }
          if (p.y > h) { p.y = -30; p.x = Math.random() * (w + 60); }
        }
      } else {
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = 'rgba(20,22,28,.55)';
        ctx.lineWidth = 1.5;
        for (const p of ps) {
          const r = 2.2 * p.z + 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          if (!reduced) {
            p.s += 0.02;
            p.y += 1.1 * p.z;
            p.x += Math.sin(p.s) * 0.7 - 0.5 * p.z;
          }
          if (p.y > h + 6) { p.y = -6; p.x = Math.random() * w; }
          if (p.x < -6) p.x = w + 6;
        }
      }
      if (visible && !reduced) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);
    window.addEventListener('resize', resize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [kind]);

  return (
    <div className="inc-weather" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}

/* ----------------------------------------------------------------- BRAAAM */
/* A synthesized brass foghorn. No samples, no score: three detuned saws
   through a distorted, slowly-opening low-pass, plus a sub. Only ever plays
   on a click. */
let audioCtx = null;
export function braaam() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = audioCtx || new AC();
    const ctx = audioCtx;
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime + 0.02;
    const dur = 3.2;

    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(0.5, t + 0.12);
    out.gain.setValueAtTime(0.5, t + 2.1);
    out.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      const x = (i / 1023) * 2 - 1;
      curve[i] = Math.tanh(x * 3.2);
    }
    shaper.curve = curve;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.Q.value = 6;
    lp.frequency.setValueAtTime(140, t);
    lp.frequency.exponentialRampToValueAtTime(900, t + 0.45);
    lp.frequency.exponentialRampToValueAtTime(420, t + dur);

    const master = ctx.createGain();
    master.gain.value = 0.6;

    shaper.connect(lp).connect(out).connect(master).connect(ctx.destination);

    const voice = (freq, type, gain, detune = 0) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq * 1.03, t);
      o.frequency.exponentialRampToValueAtTime(freq, t + 0.3);
      o.detune.value = detune;
      g.gain.value = gain;
      o.connect(g).connect(shaper);
      o.start(t);
      o.stop(t + dur + 0.1);
    };
    voice(55, 'sawtooth', 0.35, -9);
    voice(55, 'sawtooth', 0.35, 8);
    voice(110, 'sawtooth', 0.18, 3);
    voice(82.4, 'square', 0.08, 0);

    const sub = ctx.createOscillator();
    const sg = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.value = 27.5;
    sg.gain.setValueAtTime(0.0001, t);
    sg.gain.exponentialRampToValueAtTime(0.5, t + 0.2);
    sg.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    sub.connect(sg).connect(master);
    sub.start(t);
    sub.stop(t + dur + 0.1);
  } catch {
    /* audio is a garnish; never let it break the page */
  }
}
