import { useMode } from '../mode.js';

/* The door into fun mode. Deliberately its own button rather than a third
   state on ModeToggle: min/max are siblings, fun is a different site.
   Hovering (or keyboard-focusing) unfurls a colour-cycling "FUN MODE" label
   so nobody mistakes it for a serious setting. */

const LABEL = 'FUN MODE';

export function TotemIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="fun-totem">
      <rect x="10.6" y="1.5" width="2.8" height="6" rx="1.2" fill="currentColor" />
      <path
        d="M3.5 9.2c0-1.3 3.8-2.4 8.5-2.4s8.5 1.1 8.5 2.4c0 3.2-4.4 7.9-8.5 13.3C7.9 17.1 3.5 12.4 3.5 9.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M5 10.6c2.2 1 11.8 1 14 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function FunToggle() {
  const { mode, toggleFun } = useMode();
  const isFun = mode === 'fun';

  return (
    <span className="fun-toggle-wrap">
      <button
        type="button"
        aria-pressed={isFun}
        aria-label={isFun ? 'Leave fun mode' : 'Enter fun mode: a dream-heist version of this site'}
        onClick={toggleFun}
        className="fun-toggle grid h-9 w-9 place-items-center rounded-full border border-line text-ink"
      >
        <span className="fun-toggle__ring" aria-hidden="true" />
        <TotemIcon size={17} />
      </button>
      <span className="fun-tip" role="presentation" aria-hidden="true">
        <span className="fun-tip__word">
          {LABEL.split('').map((c, i) => (
            <span key={i} style={{ '--i': i }}>{c === ' ' ? ' ' : c}</span>
          ))}
        </span>
        <span className="fun-tip__sub">just for fun · go deeper ↓</span>
      </span>
    </span>
  );
}
