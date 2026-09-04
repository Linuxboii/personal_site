import { useMode } from '../mode.js';
import { profile, skills } from '../data.js';

/* Maximalist-only furniture. Both pieces are decorative and aria-hidden: the
   ticker only repeats text already on the page, and the grain is texture. */

const TICKER = [...skills.tools, profile.role, profile.location];

export function MaxTicker() {
  const { mode } = useMode();
  if (mode !== 'max') return null;

  // Rendered twice so the loop has a seamless second half to scroll into.
  const run = (key) => (
    <span className="mx-ticker__run" key={key}>
      {TICKER.map((t, i) => (
        <span className="mx-ticker__item" key={`${key}-${t}-${i}`}>
          {t}
          <b className="mx-ticker__sep">/</b>
        </span>
      ))}
    </span>
  );

  return (
    <div className="mx-ticker no-print" aria-hidden="true">
      <div className="mx-ticker__track">
        {run('a')}
        {run('b')}
      </div>
    </div>
  );
}

export function MaxGrain() {
  const { mode } = useMode();
  if (mode !== 'max') return null;
  return <div className="mx-grain no-print" aria-hidden="true" />;
}

export default function MaxDecor() {
  return <MaxGrain />;
}
