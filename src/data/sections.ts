/** Story order of the site. `short` is used in the nav and presentation HUD. */
export const SECTIONS = [
  { id: 'hero', short: 'PRISM', label: 'PRISM — business case' },
  { id: 'today', short: 'Today', label: 'One policy for every SKU' },
  { id: 'calculator', short: 'Days & cost', label: 'Service, days & holding cost' },
  { id: 'network', short: 'Network test', label: 'Network stress test' },
  { id: 'impact', short: 'Impact', label: 'Business impact' },
  { id: 'edge', short: 'Edge cases', label: 'Edge cases & protocols' },
  { id: 'run', short: 'Implement', label: 'How it runs' },
] as const;
export type SectionId = (typeof SECTIONS)[number]['id'];
