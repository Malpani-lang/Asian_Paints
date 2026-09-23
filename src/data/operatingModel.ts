/** PRISM PROPOSED — governance, KPIs, roadmap, data architecture, glossary. */

export const CADENCE = [
  {
    id: 'weekly', name: 'Weekly', tag: 'leading', title: 'Exception monitoring',
    items: ['Demand −30% in 3 months (R1 threshold — illustrative)', 'Stock ageing > 180 days (R1 threshold — illustrative)', 'Successor goes live / adoption milestone', 'Service-floor breach on a C2/C3 SKU', 'Project completion or call-off slippage', 'Warranty-linked demand share shift'],
  },
  { id: 'monthly', name: 'Monthly', tag: 'decision', title: 'Lifecycle re-score — in the demand review, before supply balancing', items: ['Run the cascade per SKU × region', 'Confidence score; low confidence → HOLD + planner review', 'Refresh criticality tier + override sunset dates', 'Publish parameter file (z, σ window, T, n, α) to the optimiser'] },
  { id: 'quarterly', name: 'Quarterly', tag: 'lagging', title: 'Performance & calibration', items: ['Inventory turns, fill rate, write-off %', 'Stage stability (reversals, time in stage)', 'Threshold recalibration from back-test', 'Re-validate every active override (evidence still true?)'] },
  { id: 'annual', name: 'Annually', tag: 'portfolio', title: 'Portfolio review', items: ['Confirm exits and delists', 'Close residual write-off exposure', 'Retire expired obligations; review successor certifications'] },
];

export const LOOP = [
  { k: 'SIGNAL', d: 'A trigger fires (weekly exception or monthly re-score).' },
  { k: 'CONFIRM', d: 'Two-cycle validation + owner check. A trigger opens a review — it never changes policy on its own.' },
  { k: 'POLICY', d: 'Stage / tier updated in master data; parameter file regenerated for the optimiser.' },
  { k: 'MONITOR', d: 'Service vs floor, days vs target, stage stability — fed into next cycle.' },
];

export const ROLES = [
  { role: 'Demand Planning', owns: 'Lifecycle stage & confidence', icon: 'LineChart' },
  { role: 'Supply Planning', owns: 'Inventory variables (z, T, lot, α)', icon: 'Settings2' },
  { role: 'Distribution', owns: 'Network footprint & glide paths', icon: 'Network' },
  { role: 'Sales', owns: 'Regional / dealer / applicator evidence', icon: 'Store' },
  { role: 'Finance', owns: 'Capital, write-off provisioning, value tracking', icon: 'Wallet' },
  { role: 'Business / Product owners', owns: 'System, warranty & successor decisions', icon: 'BadgeCheck' },
] as const;

export const OVERRIDE_APPROVALS = [
  { override: 'Warranty override (C3)', who: 'Supply Chain + Business / Sales confirmation', plus: 'Technical sign-off for successor equivalence', evidence: 'Warranty-linked demand, obligation end date', sunset: 'Obligation end or successor certification' },
  { override: 'Project-critical SKU (C3)', who: 'Supply Chain + Project / Commercial confirmation', plus: '—', evidence: 'Named site, call-off schedule, remaining BoQ', sunset: 'Site completion' },
  { override: 'System component (C2)', who: 'Supply Chain + Category / Product owner', plus: '—', evidence: 'Anchor SKU, attach ratio', sunset: 'Anchor exits / alternative approved' },
  { override: 'Applicator / dealer influence (C1)', who: 'Supply Chain + Regional Sales', plus: '—', evidence: 'Region-level momentum, programme signals', sunset: 'Quarterly re-validation' },
];

export const KPI_LAYERS = [
  { layer: 'Customer', color: '#2563EB', items: ['Fill rate', 'OTIF', 'Stock-out days', 'Line availability'] },
  { layer: 'Capital', color: '#0F8A73', items: ['Inventory days', 'Working capital', 'Ageing', 'Write-offs', 'Inventory turns'] },
  { layer: 'PRISM health', color: '#6B2FD6', items: ['Back-test accuracy', 'Stage reversals', 'Time in stage', '% SKUs on correct policy', 'Active overrides past sunset'] },
];

export const PHASES = [
  {
    n: 1, name: 'Back-test & calibrate', body: 'Replay 24–36 months of history through PRISM.',
    validate: ['Lifecycle calls', 'Stage stability', 'Service response', 'Inventory opportunity', 'Strategic overrides', 'Regional variation'],
    gate: 'Stable and predictive decisions',
  },
  {
    n: 2, name: 'Shadow pilot', body: 'PRISM runs in parallel to current planning. No automatic policy changes.',
    validate: ['Pilot category × region', 'Planner reviews every PRISM call', 'Track would-be parameters vs actual'],
    gate: 'Service floor holds · decision quality acceptable · planner confidence improves · value directionally proven',
  },
  {
    n: 3, name: 'Controlled rollout', body: 'Category × region waves through the existing planning engine.',
    validate: ['Parameter file feeds the optimiser', 'Exceptions in S&OP', 'Master-data attributes live'],
    gate: 'Scale only when value persists',
  },
];

export const DATA_MVP = ['SKU-node demand', 'Stock', 'Forecast', 'COGS', 'Margin', 'Write-offs', 'Lead times', 'Node costs', 'Dealer reach (% target dealers billed)', 'Volume vs peer benchmark', 'Shelf life'];
export const DATA_ADV = ['Demand correlation (ρ)', 'Project dependency', 'Warranty dependency', 'Successor mapping', 'Painter / contractor signals', 'Promotion flags', 'Regional demand', 'Cannibalisation links', 'Manufacturing footprint (sites per SKU)'];

export const MASTER_DATA = ['lifecycle_stage', 'stage_confidence', 'criticality_tier', 'override_reason', 'override_sunset_date', 'anchor_sku', 'successor_sku', 'obligation_end_date'];

export const CHANGE_MGMT = [
  'Planner exception cockpit — PRISM proposes, planner confirms',
  'Explainable calls: every stage shows the rule that fired + confidence',
  'Sales & dealers told “availability moves before it stops” — no silent delistings',
  'Planner scorecards on service productivity, not raw inventory cut',
];

export const GLOSSARY: Record<string, string> = {
  WMAPE: 'Weighted Mean Absolute Percentage Error — forecast error weighted by volume, so big SKUs count more. Lower = more predictable.',
  ADI: 'Average Demand Interval — average number of periods between non-zero demands. ADI > 1.32 signals intermittent demand.',
  CV: 'Coefficient of Variation — σ ÷ mean. CV² > 0.49 signals erratic demand sizes.',
  'CV²': 'Squared coefficient of variation of non-zero demand sizes. With ADI, classifies demand as smooth, erratic, intermittent or lumpy.',
  'Safety Stock': 'Buffer held against demand and lead-time uncertainty: SS = z × σ(DDLT).',
  SS: 'Safety stock: SS = z × σ(DDLT).',
  ROP: 'Reorder Point — stock level that triggers replenishment: ROP = D̄ × L + SS.',
  'Order-up-to': 'Periodic-review target level S = D̄(T+L) + z·σ(D)·√(T+L). Each review, order up to S.',
  MEIO: 'Multi-Echelon Inventory Optimisation — sets buffers jointly across plant, hub and depot instead of node by node.',
  OTIF: 'On Time In Full — share of orders delivered complete by the promised date.',
  Newsvendor: 'Single-period economics: the optimal service level is SL* = Cu ÷ (Cu + Co), where Cu = cost of a stock-out and Co = cost of excess.',
  'Pooling Law': 'Square-root law (Maister, 1976): with independent demand and equal service, system safety stock scales with √n stocking nodes.',
  'Croston/SBA': 'Forecasting methods for intermittent demand — forecast size and interval separately (SBA adds a bias correction).',
  EWMA: 'Exponentially Weighted Moving Average — recent periods weigh more; lets σ react fast in Growth.',
  EOQ: 'Economic Order Quantity — lot size that balances ordering and holding cost.',
  MOQ: 'Minimum Order Quantity — the smallest lot a supplier / plant will run.',
  'σ(DDLT)': 'Standard deviation of demand during lead time: √(L·σ(D)² + D̄²·σ(L)²).',
  z: 'Service factor — standard normal quantile of the target cycle service level (1.28 ≈ 90%, 1.65 ≈ 95%, 2.05 ≈ 98%).',
  α: 'Shelf-life cap — maximum share of remaining shelf life that stock cover may use.',
  'Fill rate': 'Share of demand (units or lines) met immediately from stock.',
  Transshipment: 'Moving stock sideways between nodes at the same echelon (depot → depot) to meet demand where it is.',
  OPC: 'Outsourced Processing Centre — contract manufacturing / processing site (case term).',
};
