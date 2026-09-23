import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, ExternalLink, Menu, MonitorPlay, X } from 'lucide-react';
import { SECTIONS } from '../data/sections';
import { scrollToSection } from '../hooks/usePresentation';
import { REGISTER, SOURCES } from '../data/assumptions';

/* ---------------- Top bar ---------------- */
export function TopBar({ active, onPresent, present, onSources }: { active: string; onPresent: () => void; present: boolean; onSources: () => void }) {
  const [menu, setMenu] = useState(false);
  const idx = SECTIONS.findIndex((s) => s.id === active);
  const dark = active === 'hero';
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors ${dark ? 'bg-transparent' : 'border-b border-paper-line bg-white/90 backdrop-blur'}`} style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="wrap flex h-14 items-center gap-3">
        <button onClick={() => scrollToSection('hero')} className="flex items-center gap-2" aria-label="Back to top">
          <PrismMark />
          <span className={`font-display text-[20px] font-extrabold tracking-[0.12em] ${dark ? 'text-white' : 'text-aubergine'}`}>PRISM</span>
          <span className={`hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-widest md:inline 2xl:hidden ${dark ? 'text-white/50' : 'text-ink-3'}`}>Team Rayquaza · Chain Reaction</span>
        </button>
        {idx > 0 && <span className={`ml-auto hidden items-center gap-2 rounded-full border px-3 py-1 text-[12.5px] font-semibold lg:flex 2xl:hidden ${dark ? 'border-white/20 text-white/80' : 'border-paper-line text-aubergine'}`}><span className="font-mono text-[10.5px] text-vermilion">{String(idx + 1).padStart(2, '0')}</span>{SECTIONS[idx].label}</span>}
        <nav className="ml-auto hidden items-center gap-0.5 2xl:flex" aria-label="Sections">
          {SECTIONS.slice(1).map((s) => (
            <button key={s.id} onClick={() => scrollToSection(s.id)}
              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[12.5px] font-semibold transition-colors ${active === s.id ? (dark ? 'bg-white text-aubergine' : 'bg-aubergine text-white') : dark ? 'text-white/70 hover:text-white' : 'text-ink-3 hover:text-aubergine'}`}>
              {s.short}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-3 2xl:ml-2">
          <button onClick={onSources} className={`hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold sm:inline-flex ${dark ? 'border-white/25 text-white/85 hover:bg-white/10' : 'border-paper-line text-ink-2 hover:border-violet hover:text-violet'}`}>
            <BookOpen size={14} /> Assumptions
          </button>
          <button onClick={onPresent} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold ${present ? 'bg-saffron text-aubergine' : dark ? 'bg-white text-aubergine' : 'bg-aubergine text-white'}`} title="Presentation mode (P)">
            <MonitorPlay size={14} /> <span className="hidden sm:inline">{present ? 'Exit present' : 'Present'}</span>
          </button>
          <button className={`2xl:hidden rounded-full p-2 ${dark ? 'text-white' : 'text-aubergine'}`} onClick={() => setMenu(true)} aria-label="Open section menu"><Menu size={20} /></button>
        </div>
      </div>
      {!dark && <div className="h-[3px] w-full bg-paper-2"><div className="ribbon h-full transition-all duration-500" style={{ width: `${((idx + 1) / SECTIONS.length) * 100}%` }} /></div>}
      <AnimatePresence>
        {menu && (
          <motion.div className="fixed inset-0 z-50 bg-aubergine-deep/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)}>
            <motion.nav initial={{ x: 40 }} animate={{ x: 0 }} exit={{ x: 40 }} className="absolute right-0 top-0 h-full w-[280px] max-w-[85vw] overflow-y-auto bg-white p-4" onClick={(e) => e.stopPropagation()} aria-label="Sections">
              <div className="mb-3 flex items-center justify-between"><span className="eyebrow">Sections</span><button onClick={() => setMenu(false)} aria-label="Close menu"><X size={20} /></button></div>
              {SECTIONS.map((s, i) => (
                <button key={s.id} onClick={() => { setMenu(false); scrollToSection(s.id); }} className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[14px] ${active === s.id ? 'bg-violet-soft font-semibold text-violet' : 'text-ink-2'}`}>
                  <span className="font-mono text-[11px] text-ink-4">{String(i + 1).padStart(2, '0')}</span>{s.label}
                </button>
              ))}
              <button onClick={() => { setMenu(false); onSources(); }} className="btn-ghost mt-3 w-full justify-center"><BookOpen size={14} /> Assumptions & notes</button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Abstract prism glyph — our own mark, not a brand logo. */
export function PrismMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <path d="M16 3 L29 27 L3 27 Z" fill="none" stroke="url(#pm)" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M1 18 L13 18" stroke="#B9AFCB" strokeWidth="2" />
      <path d="M19 16 L31 9" stroke="#7C3AED" strokeWidth="1.6" /><path d="M19 17 L31 14" stroke="#2563EB" strokeWidth="1.6" />
      <path d="M19 18 L31 19" stroke="#0F8A73" strokeWidth="1.6" /><path d="M19 19 L31 24" stroke="#EA580C" strokeWidth="1.6" />
      <path d="M19 20 L31 29" stroke="#C21E2B" strokeWidth="1.6" />
      <defs><linearGradient id="pm" x1="0" x2="1"><stop offset="0" stopColor="#8B5CF6" /><stop offset="1" stopColor="#F6A623" /></linearGradient></defs>
    </svg>
  );
}

/* ---------------- Side rail (desktop, not in present mode) ---------------- */
export function Rail({ active }: { active: string }) {
  return (
    <nav aria-label="Story progress" className="hide-in-present fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 2xl:flex">
      {SECTIONS.map((s) => (
        <button key={s.id} onClick={() => scrollToSection(s.id)} className="group flex items-center gap-2" aria-label={s.label}>
          <span className={`block h-2 rounded-full transition-all ${active === s.id ? 'w-6 bg-violet' : 'w-2 bg-ink-4/50 group-hover:bg-violet/60'}`} />
          <span className="pointer-events-none whitespace-nowrap rounded bg-aubergine px-2 py-0.5 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">{s.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ---------------- Presentation HUD ---------------- */
export function PresentHUD({ idx, go, exit }: { idx: number; go: (d: number) => void; exit: () => void }) {
  const s = SECTIONS[idx];
  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-aubergine-deep/95 px-2 py-1.5 text-white shadow-pop" style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <button onClick={() => go(-1)} disabled={idx === 0} className="rounded-full p-1.5 hover:bg-white/10 disabled:opacity-30" aria-label="Previous section"><ChevronLeft size={18} /></button>
      <div className="min-w-[180px] text-center">
        <div className="font-mono text-[10px] uppercase tracking-widest text-saffron">{String(idx + 1).padStart(2, '0')} / {SECTIONS.length}</div>
        <div className="text-[13px] font-semibold leading-tight">{s.label}</div>
      </div>
      <button onClick={() => go(1)} disabled={idx === SECTIONS.length - 1} className="rounded-full p-1.5 hover:bg-white/10 disabled:opacity-30" aria-label="Next section"><ChevronRight size={18} /></button>
      <span className="mx-1 hidden items-center gap-1 text-[11px] text-white/50 md:flex"><span className="kbd !bg-white/10 !text-white !border-white/20">←</span><span className="kbd !bg-white/10 !text-white !border-white/20">→</span></span>
      <button onClick={exit} className="rounded-full px-2 py-1 text-[11px] font-semibold text-white/70 hover:bg-white/10" aria-label="Exit presentation mode">Esc</button>
    </div>
  );
}

/* ---------------- Assumptions drawer ---------------- */
const SRC_STYLE: Record<string, string> = {
  CASE: 'bg-aubergine text-white', MENTOR: 'bg-[#FFF1E6] text-[#B4500B]', ASSUMPTION: 'bg-saffron-soft text-[#8A5A00]', DERIVED: 'bg-violet-soft text-violet',
};
export function SourcesDrawer({ open, onClose }: { open: boolean; focus?: string; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] bg-aubergine-deep/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.aside role="dialog" aria-modal="true" aria-label="Assumptions and sources" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 60, opacity: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="absolute right-0 top-0 flex h-full w-[560px] max-w-full flex-col bg-white shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-paper-line px-5 py-4">
              <div><div className="eyebrow">Every number, and why</div><div className="h3">Assumptions &amp; sources</div></div>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-paper-2" aria-label="Close"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="mb-4 rounded-lg bg-paper-2 p-3 text-[13px] text-ink-2">Case figures are used as given. Everything else is an assumption, stated with a reason, and editable in the calculators. They are meant to be fair, not precise. Replace them with Asian Paints’ actual values during the back-test.</p>
              {REGISTER.map((g) => (
                <div key={g.group} className="mb-5">
                  <div className="eyebrow mb-2">{g.group}</div>
                  <ul className="grid gap-2">
                    {g.items.map((i) => (
                      <li key={i.k} className="rounded-lg border border-paper-line p-3 text-[13px]">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <b className="text-aubergine">{i.k}</b>
                          <span className="flex items-center gap-2"><span className="num font-mono text-[12px] text-ink-2">{i.v}</span><span className={`rounded px-1.5 py-[1px] font-mono text-[9.5px] font-bold ${SRC_STYLE[i.src]}`}>{i.src}</span></span>
                        </div>
                        <div className="mt-1 text-ink-3">{i.why}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="eyebrow mb-2">Sources</div>
              <ul className="grid gap-2 text-[13px]">
                {SOURCES.map((s) => (
                  <li key={s.t} className="rounded-lg border border-paper-line p-3">
                    {s.u ? <a href={s.u} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1 font-semibold text-aubergine hover:text-violet">{s.t} <ExternalLink size={12} className="mt-1" /></a> : <b className="text-aubergine">{s.t}</b>}
                    <div className="mt-0.5 text-ink-3">{s.n}</div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[12px] text-ink-3">Case-competition submission by Team Rayquaza (Asian Paints Chain Reaction 2026). Not an official Asian Paints tool. No actual Asian Paints rupee figures are claimed: results are shown per ₹100 Cr of FG inventory.</p>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
