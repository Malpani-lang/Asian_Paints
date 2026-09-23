import type { Stage, StageId } from '../types';

/**
 * CASE DATA — every number in this file is taken from the Round 2 case PDF
 * ("Chain Reaction 2026 — Round 2 Finalist Deep Dive") or, where marked, from the
 * Round 1 case as cited in our PRISM deck. Do not edit without re-checking the PDF.
 */
export const STAGES: Stage[] = [
  {
    id: 'intro', name: 'Introduction', color: '#7C3AED', soft: '#F1EAFE',
    question: 'How much stock before demand is known?', risk: 'Obsolescence',
    skuShare: 8, fgValueShare: 12, invCostShare: 15, obsolescence: 'Low',
    prismVerb: 'Launch-guard', oneLiner: 'Push to dealer shelf, small lots, value-at-risk cap',
  },
  {
    id: 'growth', name: 'Growth', color: '#2563EB', soft: '#E8EFFD',
    question: 'How fast should the network scale?', risk: 'Stock-out',
    skuShare: 18, fgValueShare: 22, invCostShare: 25, obsolescence: 'Low',
    prismVerb: 'Protect', oneLiner: 'Fast-reset buffers, wider reach',
  },
  {
    id: 'maturity', name: 'Maturity', color: '#0F8A73', soft: '#E3F4F0',
    question: 'How to free capital without losing service?', risk: 'Carrying cost',
    skuShare: 45, fgValueShare: 48, invCostShare: 40, obsolescence: 'Very Low',
    prismVerb: 'Release', oneLiner: 'Optimised buffer, broad reach',
  },
  {
    id: 'decline', name: 'Decline', color: '#EA580C', soft: '#FDEDE3',
    question: 'What should be centralised and what should be delisted?', risk: 'Slow-moving inventory',
    skuShare: 20, fgValueShare: 13, invCostShare: 15, obsolescence: 'High',
    prismVerb: 'Pool', oneLiner: 'Centralise; cut cover and reach',
  },
  {
    id: 'exit', name: 'Exit', color: '#C21E2B', soft: '#FBE6E8',
    question: 'How do we maintain selective service while exiting?', risk: 'Write-off',
    skuShare: 9, fgValueShare: 5, invCostShare: 5, obsolescence: 'Very High',
    prismVerb: 'Prevent', oneLiner: 'Stop replenishing; redeploy',
  },
];

export const STAGE: Record<StageId, Stage> = Object.fromEntries(STAGES.map((s) => [s.id, s])) as Record<StageId, Stage>;
export const HOLD_COLOR = '#7E7892';

/** Round 1 case facts as cited on PRISM deck slide 2 ("CASE FACT §4"). */
export const SCALE = [
  { value: '3,000+', label: 'SKUs in inventory' },
  { value: '70+', label: 'plants & OPCs' },
  { value: '160+', label: 'depots & DCs' },
  { value: '100,000+', label: 'retailers & dealers' },
] as const;
/** 3,000 SKUs × 160 nodes — indicative, as stated in the PRISM deck. */
export const SKU_NODE_DECISIONS = '≈ 480,000';

export const CASE_FACTS = {
  inventoryDaysRange: [35, 70] as [number, number],
  declineExitSku: 29, // 20 + 9
  declineExitFg: 18, // 13 + 5
  declineExitCost: 20, // 15 + 5
  scope: 'paints, waterproofing solutions, wall coverings and adhesives',
  keyObservation:
    'Decline and Exit products represent only 18% of finished goods value but account for 29% of the portfolio, carry the highest inventory days, and face the greatest risk of obsolescence and write-offs.',
  workingCapital:
    'Centralizing or aggregating inventory can improve control over slow-moving stock but may also increase logistics cost and response time; these trade-offs should be considered while designing the overall network.',
  dealerExpectation:
    'Dealer service expectations often remain relatively consistent across lifecycle stages, even when the SKU’s volume, maturity or strategic relevance changes.',
  footprint:
    'While some SKUs are produced across multiple sites, others are linked to only one or two manufacturing locations, creating different levels of supply flexibility and network dependency.',
  finalQuestion:
    'Design a lifecycle-driven supply chain operating model that improves inventory productivity and reduces obsolescence risk without compromising the service promise of the business.',
};

export const GROUND_RULES = [
  'Network reduction for a SKU requires time and cannot be executed instantaneously.',
  'Obsolete inventory disposal carries liquidation, write-off and environmental costs.',
  'Customers continue to expect reasonable service levels even for products approaching end-of-life.',
  'Any recommendation must balance customer experience, working capital, service reliability and operational feasibility.',
];

export const RUBRIC = [
  { dim: 'Business understanding', w: 20, signal: 'Lifecycle behaviour, network reality, service expectations' },
  { dim: 'Analytical rigor', w: 25, signal: 'Objective classification, measurement discipline, sensible assumptions' },
  { dim: 'Supply chain design', w: 25, signal: 'Inventory, replenishment and network policies by stage' },
  { dim: 'Implementation feasibility', w: 15, signal: 'Roadmap, governance, systems integration, stakeholders' },
  { dim: 'Communication quality', w: 15, signal: 'Simple, structured, boardroom-ready, clear trade-offs' },
];

/** Case §7 deliverables -> where the site answers them. */
export const DELIVERABLES = [
  { d: 'Lifecycle Management Framework', where: ['tower'] },
  { d: 'Cost and working capital impact', where: ['calculator', 'tower'] },
  { d: 'Distribution and network strategy', where: ['network'] },
  { d: 'Service and risk impact', where: ['tower', 'network'] },
];
