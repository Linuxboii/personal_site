import { Sparkles, Minus } from 'lucide-react';
import { useMode } from '../mode.js';

export default function ModeToggle() {
  const { mode, toggleMode } = useMode();
  const isMax = mode === 'max';

  return (
    <button
      type="button"
      aria-pressed={isMax}
      aria-label={isMax ? 'Switch to minimalist design' : 'Switch to maximalist design'}
      title={isMax ? 'Minimalist' : 'Maximalist'}
      onClick={toggleMode}
      className="mx-toggle grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition hover:border-ink"
    >
      {isMax ? <Minus size={15} /> : <Sparkles size={15} />}
    </button>
  );
}
