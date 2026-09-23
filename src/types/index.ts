export type StageId = 'intro' | 'growth' | 'maturity' | 'decline' | 'exit';
export type StageOrHold = StageId | 'hold';

/** Provenance label shown next to every figure / statement that needs one. */
export type Provenance =
  | 'case' // Round 2 case PDF (or Round 1 case as cited in the PRISM deck)
  | 'mentor' // Asian Paints mentor session
  | 'prism' // our proposed policy / logic
  | 'public' // publicly verified Asian Paints context
  | 'illustrative' // illustrative mechanism, not an Asian Paints estimate
  | 'assumption' // adjustable assumption
  | 'calibrate'; // requires calibration on SKU-node data

export interface Stage {
  id: StageId;
  name: string;
  color: string;
  soft: string;
  question: string;
  risk: string;
  skuShare: number; // CASE §3
  fgValueShare: number; // CASE §3
  invCostShare: number; // CASE §4
  obsolescence: 'Very Low' | 'Low' | 'High' | 'Very High'; // CASE §3
  prismVerb: 'Launch-guard' | 'Protect' | 'Release' | 'Pool' | 'Prevent';
  oneLiner: string; // R1 slide 3
}

export type CriticalityTier = 0 | 1 | 2 | 3;

export type DriverId = 'system' | 'warranty' | 'painter' | 'dealer' | 'project' | 'preference';

export interface EcosystemDriver {
  id: DriverId;
  name: string;
  short: string;
  caseText: string; // verbatim CASE §2 table
  what: string;
  responses: string[];
  risk: string;
  signal: string[]; // how PRISM senses it
  kind: 'obligation' | 'dependency' | 'influence';
  approval: string;
  publicContext?: { text: string; sourceId: string }[];
}

export interface Direction {
  service: 'up' | 'hold' | 'down';
  days: 'up' | 'hold' | 'down';
  serviceNote: string;
  daysNote: string;
}

export interface CaseProduct {
  id: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  usage: string; // CASE
  stage: StageId; // CASE
  driverText: string; // CASE (verbatim)
  drivers: DriverId[];
  volume: string; // CASE
  volumeRank: number; // 1 very small .. 4 medium, for charts only
  invDays: [number, number]; // CASE
  service: [number, number]; // CASE
  extra?: string; // CASE additional condition
  pack: 'tub' | 'sachet' | 'can' | 'bucket' | 'drum' | 'bag';
  diagnosis: {
    direction: string;
    criticality: CriticalityTier;
    criticalityWhy: string;
    serviceRisk: 'Low' | 'Medium' | 'High' | 'Very High';
    obsolescenceRisk: 'Low' | 'Medium' | 'High' | 'Very High';
    successor: string;
    networkFlex: string;
    regional: string;
    confidence: 'High' | 'Medium' | 'Low';
    confidenceWhy: string;
  };
  naive: string;
  defaultPolicy: string;
  override: string;
  networkFeasibility: string;
  economics: string;
  final: {
    serviceFloor: string;
    inventory: string;
    replenishment: string;
    network: string;
    reviewTrigger: string;
    exitCondition: string;
  };
  rationale: string;
  direction: Direction;
  headline: string;
  contradiction?: { naive: string; because: string; therefore: string[] };
  ecosystemRef: { family: string; note: string; sourceIds: string[] };
}

export interface Source {
  id: string;
  title: string;
  url: string;
  retrieved: string;
  supports: string;
  publisher: string;
}
