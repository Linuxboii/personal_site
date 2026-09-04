import { createContext, createElement, useCallback, useContext, useEffect, useState } from 'react';

/* Two design modes over the same content and the same light/dark palettes.
   'min' is the site as designed: quiet, editorial, lots of air.
   'max' is the same information turned up — acid palette, tiled patterns,
   hard offset shadows, rotated stickers, a marquee. Nothing is added or
   removed, only dressed differently, so either mode reads the whole site.

   The mode lives on <html data-mode> so it can be styled entirely in CSS
   (src/max.css) rather than branched through every component. */

export const MODE_KEY = 'sk-mode';
export const MODES = ['min', 'max'];

const ModeContext = createContext({ mode: 'min', setMode: () => {}, toggleMode: () => {} });

function read() {
  if (typeof window === 'undefined') return 'min';
  // ?mode=max wins once, so a maximalist view can be linked to directly.
  const param = new URLSearchParams(window.location.search).get('mode');
  if (MODES.includes(param)) return param;
  const stored = localStorage.getItem(MODE_KEY);
  return MODES.includes(stored) ? stored : 'min';
}

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(read);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  const toggleMode = useCallback(() => setMode((m) => (m === 'max' ? 'min' : 'max')), []);

  return createElement(ModeContext.Provider, { value: { mode, setMode, toggleMode } }, children);
}

export function useMode() {
  return useContext(ModeContext);
}
