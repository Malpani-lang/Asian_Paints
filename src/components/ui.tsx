import { createContext, useContext, useId, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, BookOpen } from 'lucide-react';
import type { Provenance, StageOrHold } from '../types';
import { STAGE, HOLD_COLOR } from '../data/caseData';
import { GLOSSARY } from '../data/operatingModel';

/* ---------------- Provenance tag ---------------- */
const PROV: Record<Provenance, { label: string; cls: string; tip: string }> = {
  case: { label: 'Case data', cls: 'bg-aubergine text-white border-aubergine', tip: 'Supplied in the Chain Reaction case (Round 2 PDF, or Round 1 case as cited in the PRISM deck).' },
  prism: { label: 'PRISM policy', cls: 'bg-violet-soft text-violet border-violet-line', tip: 'Team Rayquaza’s proposed logic or policy.' },
  mentor: { label: 'Mentor input', cls: 'bg-[#FFF1E6] text-[#B4500B] border-[#F8C9A0]', tip: 'From the Asian Paints mentor session.' },
  public: { label: 'Public · official', cls: 'bg-[#E3F4F0] text-[#0B6B59] border-[#BfE3D9]', tip: 'Publicly verified Asian Paints context — see Sources. Context only; never replaces case data.' },
  illustrative: { label: 'Illustrative', cls: 'bg-saffron-soft text-[#8A5A00] border-saffron/60', tip: 'Illustrative mechanism — not an Asian Paints estimate or target.' },
  assumption: { label: 'Assumption', cls: 'bg-paper-2 text-ink-2 border-paper-line', tip: 'Adjustable assumption — change it and the result updates.' },
  calibrate: { label: 'Requires calibration', cls: 'bg-white text-vermilion border-vermilion/50 border-dashed', tip: 'Must be calibrated on SKU-node history before use.' },
};
export function Tag({ p, className = '' }: { p: Provenance; className?: string }) {
  const v = PROV[p];
  return (
    <span title={v.tip} className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-[2px] font-mono text-[10px] font-semibold uppercase tracking-[0.08em] ${v.cls} ${className}`}>
      {v.label}
    </span>
  );
}
export const PROVENANCE_LEGEND = PROV;

/* ---------------- Glossary tooltip ---------------- */
export function Term({ k, children }: { k: keyof typeof GLOSSARY | string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const text = GLOSSARY[k];
  if (!text) return <>{children ?? k}</>;
  return (
    <span className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" aria-describedby={id} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onClick={() => setOpen((o) => !o)}
        className="cursor-help border-b border-dotted border-violet/70 text-inherit leading-none">
        {children ?? k}
      </button>
      {open && (
        <span role="tooltip" id={id} className="absolute left-1/2 top-full z-50 mt-2 w-[260px] -translate-x-1/2 rounded-lg bg-aubergine-deep px-3 py-2 text-left font-sans text-[12.5px] font-normal normal-case leading-snug tracking-normal text-white shadow-pop">
          <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-widest text-saffron">{k}</span>
          {text}
        </span>
      )}
    </span>
  );
}

/* ---------------- Lifecycle badge ---------------- */
export function stageColor(s: StageOrHold) { return s === 'hold' ? HOLD_COLOR : STAGE[s].color; }
export function stageName(s: StageOrHold) { return s === 'hold' ? 'Hold' : STAGE[s].name; }
export function LifecycleBadge({ s, size = 'md' }: { s: StageOrHold; size?: 'sm' | 'md' | 'lg' }) {
  const pad = size === 'sm' ? 'px-2 py-[1px] text-[11px]' : size === 'lg' ? 'px-3.5 py-1 text-[14px]' : 'px-2.5 py-0.5 text-[12px]';
  return <span className={`inline-flex items-center rounded-md font-semibold text-white ${pad}`} style={{ background: stageColor(s) }}>{stageName(s)}</span>;
}


/* ---------------- Lifecycle selector ---------------- */
import type { StageId } from '../types';
export function LifecycleSelector({ value, onChange, label = 'Lifecycle stage' }: { value: StageId; onChange: (s: StageId) => void; label?: string }) {
  const ids: StageId[] = ['intro', 'growth', 'maturity', 'decline', 'exit'];
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {ids.map((s) => {
        const on = s === value;
        return (
          <button key={s} role="radio" aria-checked={on} onClick={() => onChange(s)}
            className="rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-all"
            style={on ? { background: STAGE[s].color, borderColor: STAGE[s].color, color: '#fff' } : { borderColor: '#E6E0F0', color: STAGE[s].color, background: '#fff' }}>
            {STAGE[s].name}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Metric ---------------- */
export function MetricCard({ value, label, sub, accent = '#2A0F4F', p }: { value: ReactNode; label: string; sub?: ReactNode; accent?: string; p?: Provenance }) {
  return (
    <div className="card px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="num font-display text-[28px] font-bold leading-none" style={{ color: accent }}>{value}</div>
        {p && <Tag p={p} />}
      </div>
      <div className="mt-1.5 text-[13px] font-semibold text-ink-2">{label}</div>
      {sub && <div className="mt-0.5 text-[12px] text-ink-3">{sub}</div>}
    </div>
  );
}

/* ---------------- Section shell ---------------- */
export function Section({ id, n, eyebrow, title, lede, children, tone = 'paper', tags }: {
  id: string; n: number; eyebrow: string; title: ReactNode; lede?: ReactNode; children: ReactNode; tone?: 'paper' | 'white' | 'dark'; tags?: Provenance[];
}) {
  const bg = tone === 'white' ? 'bg-white' : tone === 'dark' ? 'bg-aubergine-deep text-white' : 'bg-paper';
  return (
    <section id={id} data-section className={`${bg} border-t border-paper-line py-16 sm:py-20`}>
      <div className="wrap">
        <div className="mb-8 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`eyebrow ${tone === 'dark' ? 'text-white/60' : ''}`}><span className="text-vermilion">{String(n).padStart(2, '0')}</span> · {eyebrow}</span>
            {tags?.map((t) => <Tag key={t} p={t} />)}
          </div>
          <h2 className={tone === 'dark' ? 'h2 !text-white' : 'h2'}>{title}</h2>
          {lede && <p className={tone === 'dark' ? 'lede !text-white/75' : 'lede'}>{lede}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ---------------- Callout line (R1 “► ...” bar) ---------------- */
export function Takeaway({ children }: { children: ReactNode }) {
  return <div className="callout mt-8 flex items-start gap-2"><span className="text-vermilion">►</span><span>{children}</span></div>;
}

/* ---------------- Direction arrow ---------------- */
export function Dir({ d, good = true }: { d: 'up' | 'hold' | 'down'; good?: boolean }) {
  const Icon = d === 'up' ? ArrowUp : d === 'down' ? ArrowDown : ArrowRight;
  const c = good ? '#0F8A73' : '#E3342F';
  return <Icon size={16} strokeWidth={2.6} style={{ color: d === 'hold' ? '#6A6180' : c }} aria-label={d} />;
}

/* ---------------- Sources context ---------------- */
const SourcesCtx = createContext<{ open: (id?: string) => void }>({ open: () => {} });
export const SourcesProvider = SourcesCtx.Provider;
export function useSources() { return useContext(SourcesCtx); }
export function Cite({ ids }: { ids: string[] }) {
  const { open } = useSources();
  return (
    <button type="button" onClick={() => open(ids[0])} className="inline-flex items-center gap-1 rounded border border-paper-line bg-white px-1.5 py-[1px] align-middle font-mono text-[10px] text-ink-3 hover:border-violet hover:text-violet" title="Open source notes">
      <BookOpen size={11} /> {ids.length} src
    </button>
  );
}
