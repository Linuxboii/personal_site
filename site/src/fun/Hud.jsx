import { useEffect, useRef, useState } from 'react';
import { profile } from '../data.js';
import { useMode } from '../mode.js';
import { useDream } from './fx.jsx';
import { Totem } from './art.jsx';
import { sound, useSound, useWake } from './cinema.jsx';

/* Fixed chrome for the dream: a depth gauge that doubles as navigation, a
   clock that shows how much "dream time" your scrolling has cost, and a
   toast whenever you drop a level. */

function fmtReal(s) {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

function fmtDream(s) {
  if (!Number.isFinite(s)) return '∞';
  if (s < 3600) return fmtReal(s);
  if (s < 86400) return `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}m`;
  if (s < 86400 * 365) return `${Math.floor(s / 86400)} days`;
  return `${(s / (86400 * 365)).toFixed(1)} years`;
}

export function DreamClock({ level }) {
  const [t, setT] = useState({ real: 0, dream: 0 });
  const factor = useRef(level.factor);
  factor.current = level.factor;

  useEffect(() => {
    let last = performance.now();
    let real = 0;
    let dream = 0;
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      real += dt;
      if (Number.isFinite(factor.current)) dream += dt * factor.current;
      setT({ real, dream });
    }, 250);
    return () => clearInterval(id);
  }, []);

  const inf = !Number.isFinite(level.factor);
  return (
    <div className="inc-clock no-print" aria-hidden="true">
      <div className="inc-clock__row">
        <span className="inc-clock__k">REAL</span>
        <span className="inc-clock__v">{fmtReal(t.real)}</span>
      </div>
      <div className="inc-clock__row">
        <span className="inc-clock__k">DREAM</span>
        <span className="inc-clock__v">{inf ? '∞' : fmtDream(t.dream)}</span>
      </div>
      <div className="inc-clock__x">{inf ? 'time stopped meaning things' : `time ×${level.factor.toLocaleString()}`}</div>
    </div>
  );
}

export function LevelToast({ level, dir }) {
  const [shown, setShown] = useState(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    setShown({ ...level, dir, k: Date.now() });
    const id = setTimeout(() => setShown(null), 2200);
    return () => clearTimeout(id);
  }, [level, dir]);
  if (!shown) return null;
  return (
    <div className="inc-toast no-print" key={shown.k} role="status">
      <span className="inc-toast__dir">{shown.dir > 0 ? '▼ going deeper' : '▲ coming up'}</span>
      <span className="inc-toast__name">{shown.label}</span>
      {Number.isFinite(shown.factor) && shown.factor > 1 && (
        <span className="inc-toast__x">time ×{shown.factor.toLocaleString()}</span>
      )}
    </div>
  );
}

export default function Hud({ levels, active }) {
  const { go } = useDream();
  const { toggleFun } = useMode();
  const wake = useWake(toggleFun);
  const [open, setOpen] = useState(false);
  const [horn, setHorn] = useState(false);
  const [soundOn, setSound] = useSound();
  const idx = Math.max(0, levels.findIndex((l) => l.id === active.id));

  const blast = () => {
    if (!sound.on) setSound(true);
    sound.horn();
    setHorn(true);
    document.documentElement.classList.add('inc-shake');
    setTimeout(() => {
      setHorn(false);
      document.documentElement.classList.remove('inc-shake');
    }, 1400);
  };

  return (
    <header className="inc-hud no-print">
      <button type="button" className="inc-hud__id" onClick={() => go('real')} aria-label="Back to reality (top of page)">
        <span className="inc-hud__totem"><Totem id="hud" /></span>
        <span className="inc-hud__name">{profile.name}</span>
        <span className="inc-hud__sticker">dreaming</span>
      </button>

      <nav className="inc-dial" aria-label="Dream levels">
        <div className="inc-dial__track">
          <span className="inc-dial__blob" style={{ left: `${(idx / (levels.length - 1)) * 100}%` }} aria-hidden="true" />
          {levels.map((l, i) => (
            <button
              type="button"
              key={l.id}
              className={`inc-dial__stop ${i === idx ? 'is-on' : ''} ${i < idx ? 'is-past' : ''}`}
              style={{ left: `${(i / (levels.length - 1)) * 100}%` }}
              onClick={() => go(l.id)}
              aria-current={i === idx ? 'true' : undefined}
              title={l.label}
            >
              <span className="inc-dial__tick" aria-hidden="true" />
              <span className="inc-dial__label">{l.short}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="inc-hud__right">
        <div className="inc-hud__now">
          <button type="button" className="inc-chip" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
            <span className="inc-chip__dot" aria-hidden="true" />
            {active.short}
          </button>
          {open && (
            <ul className="inc-hud__menu">
              {levels.map((l) => (
                <li key={l.id}>
                  <button type="button" onClick={() => { setOpen(false); go(l.id); }}>
                    <span>{l.short}</span> {l.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          className={`inc-hbtn ${soundOn ? 'is-on' : ''}`}
          onClick={() => setSound(!soundOn)}
          aria-pressed={soundOn}
          title={soundOn ? 'Sound off' : 'Sound on'}
        >
          <span className="inc-eq" aria-hidden="true"><i /><i /><i /><i /></span>
          <span className="visually-hidden">{soundOn ? 'Turn sound off' : 'Turn sound on'}</span>
        </button>
        <button type="button" className={`inc-hbtn inc-hbtn--horn ${horn ? 'is-blaring' : ''}`} onClick={blast} title="Sound the horn">
          <span aria-hidden="true">◉</span> <span className="inc-hide-sm">Horn</span>
          <span className="visually-hidden">Sound the horn</span>
        </button>
        <button type="button" className="inc-hbtn inc-hbtn--wake" onClick={wake} title="Leave fun mode">
          Wake up <span aria-hidden="true">⏏</span>
        </button>
      </div>
    </header>
  );
}
