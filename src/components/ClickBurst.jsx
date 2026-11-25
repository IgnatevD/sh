import { useEffect } from 'react';

// Tiny alpine "snow burst" when tapping buttons — subtle, works with mouse and touch
export default function ClickBurst() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onDown = (e) => {
      const el = e.target.closest('.btn, .round, .fab__main, .messenger, .filters button, .cal__day.has, .story');
      if (!el) return;
      const x = e.clientX, y = e.clientY;
      if (!x && !y) return;
      const host = document.createElement('span');
      host.className = 'burst';
      host.style.left = x + 'px';
      host.style.top = y + 'px';
      const n = 7;
      for (let i = 0; i < n; i++) {
        const p = document.createElement('i');
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.5;
        const d = 18 + Math.random() * 16;
        p.style.setProperty('--x', Math.cos(a) * d + 'px');
        p.style.setProperty('--y', Math.sin(a) * d - 6 + 'px');
        p.className = i % 3 === 0 ? 'peak' : 'flake';
        host.appendChild(p);
      }
      document.body.appendChild(host);
      setTimeout(() => host.remove(), 700);
    };
    document.addEventListener('pointerdown', onDown, { passive: true });
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);
  return null;
}
