import { useEffect, useRef } from 'react';
import { WebGLRenderer } from 'three';

/* One small harness for every WebGL set piece in fun mode.
   - sizes the canvas to its box (ResizeObserver), capped DPR
   - only renders while on screen (IntersectionObserver)
   - hands `setup` a renderer; setup returns { frame(t, dt), resize(w,h), dispose() }
   If WebGL is unavailable the canvas simply stays empty and the CSS
   fallback behind it shows through. */
export function useGL(setup, deps = [], { maxDpr = 1.5, antialias = true } = {}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let renderer;
    try {
      renderer = new WebGLRenderer({ canvas, antialias, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return undefined;
    }
    const dpr = () => Math.min(window.devicePixelRatio || 1, document.documentElement.classList.contains('inc-lite') ? 1 : maxDpr);
    renderer.setPixelRatio(dpr());
    const api = setup(renderer) || {};

    let w = 0;
    let h = 0;
    const size = () => {
      const r = canvas.getBoundingClientRect();
      const nw = Math.max(1, Math.round(r.width));
      const nh = Math.max(1, Math.round(r.height));
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      renderer.setSize(w, h, false);
      api.resize?.(w, h);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const onLite = () => {
      renderer.setPixelRatio(dpr());
      w = 0;
      size();
    };
    window.addEventListener('inc-lite', onLite);

    let visible = false;
    let raf = 0;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      api.frame?.(now / 1000, dt);
      if (visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(canvas);

    return () => {
      window.removeEventListener('inc-lite', onLite);
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
      api.dispose?.();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return canvasRef;
}

export function seeded(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
