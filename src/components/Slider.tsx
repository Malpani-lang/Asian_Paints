import type { ReactNode } from 'react';

/** Labelled range + number input. Marks (e.g. floor / cap / optimum) are drawn under the track. */
export function Slider({ id, label, value, onChange, min, max, step = 1, unit = '', hint, marks, accent }: {
  id: string; label: ReactNode; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; unit?: string; hint?: ReactNode;
  marks?: { v: number; label: string; color: string }[]; accent?: string;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <label htmlFor={id} className="grid gap-1">
      <span className="flex items-center justify-between gap-2 text-[12.5px] font-semibold text-ink-2">
        <span>{label}</span>
        <span className="flex items-center gap-1">
          <input aria-label={typeof label === 'string' ? label : id} type="number" value={value} min={min} max={max} step={step}
            onChange={(e) => { const v = Number(e.target.value); if (!Number.isNaN(v)) onChange(Math.min(max, Math.max(min, v))); }}
            className="num w-[70px] rounded border border-paper-line bg-white px-1.5 py-0.5 text-right font-mono text-[12.5px] text-aubergine" />
          <span className="w-5 text-[11px] text-ink-3">{unit}</span>
        </span>
      </span>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={accent ? { accentColor: accent } : undefined} />
      {marks && (
        <span className="relative h-4 text-[9.5px]">
          {marks.map((m) => (
            <span key={m.label} className="absolute -translate-x-1/2 whitespace-nowrap font-mono font-semibold" style={{ left: `${pct(m.v)}%`, color: m.color }}>▲{m.label}</span>
          ))}
        </span>
      )}
      {hint && <span className="text-[11.5px] text-ink-3">{hint}</span>}
    </label>
  );
}
