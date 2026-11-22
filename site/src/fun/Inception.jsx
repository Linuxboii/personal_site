import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import { DreamContext } from './fx.jsx';
import Hud, { DreamClock } from './Hud.jsx';
import { Reality, Briefing, Dive, City } from './ScenesTop.jsx';
import { Hotel, Hallway3, Fortress3, Limbo, Kick } from './ScenesDeep.jsx';
import { Cursor, Flood, Grain, Intro, LevelCard, sound } from './cinema.jsx';
import './inception.css';

/* FUN MODE — "a dream within a site".
   The whole portfolio told as one long fall through dream levels. Every fact
   from the minimalist pages is here; only the telling changes:

     Reality   → home hero, facts               (3D city that folds over you)
     Briefing  → shipping now, services, CTA    (an explosion, frozen)
     Level 1   → about, education               (rain, infinite mirrors, a train)
     Level 2   → skills                         (zero gravity hotel)
     Corridor  → every project                  (3D hallway rolling a full turn)
     Level 3   → highlights, training           (snow fortress, a vault)
     Limbo     → contact                        (crumbling coast, endless stairs)
     Kick      → footer, and the way back up    (the van, the flood, the top) */

const LEVELS = [
  { id: 'real', n: 'Reality', short: 'REALITY', label: 'Reality', factor: 1 },
  { id: 'brief', n: 'Level 00', short: 'BRIEF', label: 'The briefing', factor: 1 },
  { id: 'l1', n: 'Level 01', short: 'LVL 1', label: 'The city', factor: 20, horn: true },
  { id: 'l2', n: 'Level 02', short: 'LVL 2', label: 'The hotel', factor: 400, horn: true },
  { id: 'hall', n: 'Level 02½', short: 'HALL', label: 'The corridor', factor: 400 },
  { id: 'l3', n: 'Level 03', short: 'LVL 3', label: 'The fortress', factor: 8000, horn: true },
  { id: 'limbo', n: 'Level ∞', short: 'LIMBO', label: 'Limbo', factor: Infinity, horn: true },
  { id: 'kick', n: 'Surface', short: 'KICK', label: 'The kick', factor: 1 },
];

const ROUTE_TO_LEVEL = { '/about': 'l1', '/skills': 'l2', '/projects': 'hall', '/contact': 'limbo' };
const FONTS =
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Gochi+Hand&family=Rethink+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap';

export default function Inception() {
  const reduced = !!useReducedMotion();
  const lenis = useRef(null);
  const rootRef = useRef(null);
  const { pathname } = useLocation();
  const [activeId, setActiveId] = useState('real');
  const [dir, setDir] = useState(1);
  const prevIdx = useRef(0);

  useEffect(() => {
    if (document.getElementById('inc-fonts')) return;
    const l = document.createElement('link');
    l.id = 'inc-fonts';
    l.rel = 'stylesheet';
    l.href = FONTS;
    document.head.appendChild(l);
  }, []);

  useEffect(() => () => sound.set(false), []);

  // Smooth, weighty scrolling, and the "gravity" warp that follows its velocity.
  useEffect(() => {
    if (reduced) return undefined;
    const ln = new Lenis({ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.9 });
    lenis.current = ln;
    let v = 0;
    ln.on('scroll', (e) => {
      v = Math.max(-40, Math.min(40, e.velocity || 0));
      rootRef.current?.style.setProperty('--vel', v.toFixed(2));
    });
    let id = requestAnimationFrame(function raf(t) {
      ln.raf(t);
      if (Math.abs(v) > 0.01 && Math.abs(ln.velocity || 0) < 0.01) {
        v *= 0.85;
        rootRef.current?.style.setProperty('--vel', v.toFixed(2));
      }
      id = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(id);
      ln.destroy();
      lenis.current = null;
    };
  }, [reduced]);

  const go = useCallback(
    (id, opts = {}) => {
      const el = document.getElementById(`inc-${id}`);
      if (!el) return;
      if (lenis.current) {
        lenis.current.scrollTo(id === 'real' ? 0 : el, { offset: 0, duration: opts.duration || 2, immediate: !!opts.immediate });
      } else {
        el.scrollIntoView({ behavior: opts.immediate || reduced ? 'auto' : 'smooth' });
      }
    },
    [reduced],
  );

  useEffect(() => {
    const target = ROUTE_TO_LEVEL[pathname];
    if (!target) return undefined;
    const t = setTimeout(() => go(target, { immediate: true }), 80);
    return () => clearTimeout(t);
  }, [pathname, go]);

  useEffect(() => {
    const els = LEVELS.map((l) => document.getElementById(`inc-${l.id}`)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id.replace('inc-', ''));
        });
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const active = useMemo(() => LEVELS.find((l) => l.id === activeId) || LEVELS[0], [activeId]);
  const idx = LEVELS.indexOf(active);
  useEffect(() => {
    setDir(idx >= prevIdx.current ? 1 : -1);
    prevIdx.current = idx;
  }, [idx]);

  const ctx = useMemo(() => ({ go, reduced, lenis }), [go, reduced]);

  return (
    <DreamContext.Provider value={ctx}>
      <div ref={rootRef} className={`inc inc--${active.id} ${reduced ? 'inc--still' : ''}`}>
        <Intro />
        <a className="inc-skip" href="#inc-limbo" onClick={(e) => { e.preventDefault(); go('limbo'); }}>
          Skip to contact
        </a>
        <Hud levels={LEVELS} active={active} />
        <LevelCard level={active} index={idx} dir={dir} />
        <DreamClock level={active} />
        <main>
          <Reality />
          <Briefing />
          <Dive />
          <City />
          <Hotel />
          <Hallway3 />
          <Fortress3 />
          <Limbo />
        </main>
        <Kick />
        <Grain />
        <Cursor />
        <Flood />
      </div>
    </DreamContext.Provider>
  );
}
