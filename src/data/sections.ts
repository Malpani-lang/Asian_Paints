/** Story order of the site. `short` is used in the nav and presentation HUD. */
export const SECTIONS = [
  { id: 'hero', short: 'PRISM', label: 'PRISM — business case' },
  { id: 'calculator', short: 'Days & cost', label: 'Service, days & holding cost' },
  { id: 'impact', short: 'Impact', label: 'Business impact' },
] as const;
export type SectionId = (typeof SECTIONS)[number]['id'];
