import { useEffect, useState } from 'react';
import { SECTIONS } from '../data/sections';

/** Tracks which story section is in view (for the rail + presentation HUD). */
export function useActiveSection() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.1, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}
