import { createContext, createElement, useCallback, useContext, useEffect, useState } from 'react';

/* Three design modes over the same content.
   'min' is the site as designed: quiet, editorial, lots of air.
   'max' is the same information turned up — acid palette, tiled patterns,
   hard offset shadows, a marquee. Nothing is added or removed.
   'fun' is a different animal: one long scrollytelling page, a cartoon dream
   heist told in levels (src/fun). Same information, told as a story instead
   of split across pages.

   The mode lives on <html data-mode> so min/max can be styled entirely in CSS
   (src/max.css); fun swaps the whole shell in App.jsx. */

export const MODE_KEY = 'sk-mode';
export const PREV_KEY = 'sk-mode-prev';
export const MODES = ['min', 'max', 'fun'];

const ModeContext = createContext({
  mode: 'min',
  setMode: () => {},
  toggleMode: () => {},
  toggleFun: () => {},
});

function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* private mode */ }
}

function read() {
  if (typeof window === 'undefined') return 'min';
  // ?mode=max|fun wins once, so any mode can be linked to directly.
  const param = new URLSearchParams(window.location.search).get('mode');
  if (MODES.includes(param)) return param;
  const stored = safeGet(MODE_KEY);
  return MODES.includes(stored) ? stored : 'min';
}

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(read);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    safeSet(MODE_KEY, mode);
    if (mode !== 'fun') safeSet(PREV_KEY, mode);
  }, [mode]);

  // min <-> max. From fun, this lands on max (the "louder" sibling).
  const toggleMode = useCallback(() => setMode((m) => (m === 'max' ? 'min' : 'max')), []);

  // Into the dream, or back out to whichever mode you came from.
  const toggleFun = useCallback(() => {
    setMode((m) => {
      if (m !== 'fun') return 'fun';
      const prev = safeGet(PREV_KEY);
      return prev === 'max' ? 'max' : 'min';
    });
  }, []);

  return createElement(
    ModeContext.Provider,
    { value: { mode, setMode, toggleMode, toggleFun } },
    children,
  );
}

export function useMode() {
  return useContext(ModeContext);
}
