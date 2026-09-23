import { useCallback, useEffect, useState } from 'react';
import { SECTIONS } from '../data/sections';

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Presentation mode: ←/→ (and PgUp/PgDn, Space) step section-by-section; P toggles; Esc exits. */
export function usePresentation(active: string) {
  const [on, setOn] = useState(false);
  const idx = Math.max(0, SECTIONS.findIndex((s) => s.id === active));
  const go = useCallback((d: number) => {
    const next = SECTIONS[Math.min(SECTIONS.length - 1, Math.max(0, idx + d))];
    scrollToSection(next.id);
  }, [idx]);

  useEffect(() => {
    document.documentElement.classList.toggle('present', on);
  }, [on]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
      if (e.key === 'p' || e.key === 'P') { setOn((v) => !v); return; }
      if (e.key === 'Escape') { setOn(false); return; }
      if (!on) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [on, go]);

  return { on, setOn, idx, go };
}
