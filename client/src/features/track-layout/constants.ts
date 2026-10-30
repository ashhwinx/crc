import type { LayoutPresetConfig, RailcarProfile, RailcarCategoryKey } from './types';

export const LAYOUT_PRESETS: LayoutPresetConfig[] = [
  {
    id: 'single-spur',
    name: 'Single Industrial Spur',
    badge: 'Standard Siding',
    description: 'Direct single-track industrial siding connecting to a Class I mainline via a standard #10 turnout with end-of-track bumping post.',
    defaultFootage: 650,
    minFootage: 300,
    maxFootage: 1800,
    hasLoadingDock: false,
    hasSilos: false,
    tracksCount: 1,
  },
  {
    id: 'double-ended',
    name: 'Double-Ended Passing Siding',
    badge: 'Runaround Track',
    description: 'Two-ended connection allowing locomotives to uncouple, run around the cut of cars, and switch facing or trailing points without blocking the mainline.',
    defaultFootage: 1200,
    minFootage: 600,
    maxFootage: 2500,
    hasLoadingDock: false,
    hasSilos: false,
    tracksCount: 2,
  },
  {
    id: 'multi-transload',
    name: '3-Track Transload & Staging Yard',
    badge: 'Bulk Transload',
    description: 'Triple-track configuration featuring heavy concrete transload pads, forklift ramps, and trackside mobile conveyor staging for truck-to-rail transfer.',
    defaultFootage: 950,
    minFootage: 450,
    maxFootage: 2000,
    hasLoadingDock: true,
    hasSilos: false,
    tracksCount: 3,
  },
  {
    id: 'warehouse-dock',
    name: 'Distribution Dock & Agri Silos',
    badge: 'Industrial Facility',
    description: 'Dedicated siding built adjacent to an industrial distribution center loading platform and vertical grain/mineral storage silos with covered weather canopies.',
    defaultFootage: 800,
    minFootage: 350,
    maxFootage: 1600,
    hasLoadingDock: true,
    hasSilos: true,
    tracksCount: 1,
  },
];

export const RAILCAR_PROFILES: Record<RailcarCategoryKey, RailcarProfile> = {
  boxcars: {
    key: 'boxcars',
    name: 'Boxcars (50ft / 60ft)',
    defaultLengthFt: 60,
    avgPayloadTons: 90,
    trucksOffset: 3.5,
    primaryColor: '#AA2E1F', // Railroad Red
    accentColor: '#EDE6D4',
    description: 'Fully enclosed steel freight cars for palletized paper, auto parts, packaged foods, and moisture-sensitive cargo.',
  },
  'covered-hoppers': {
    key: 'covered-hoppers',
    name: 'Covered Hoppers',
    defaultLengthFt: 58,
    avgPayloadTons: 100,
    trucksOffset: 4.0,
    primaryColor: '#78716C', // Weathered Stone Grey
    accentColor: '#D6D3D1',
    description: 'Weather-tight top hatches and bottom discharge gates for grain, corn, fertilizers, sand, and cement.',
  },
  'open-top-hoppers': {
    key: 'open-top-hoppers',
    name: 'Open-Top Hoppers',
    defaultLengthFt: 53,
    avgPayloadTons: 105,
    trucksOffset: 4.2,
    primaryColor: '#262626', // Cast Iron Black
    accentColor: '#EAB308',
    description: 'Heavy gauge steel hoppers for aggregate, gravel, crushed stone, coal, and bulk mineral shipments.',
  },
  gondolas: {
    key: 'gondolas',
    name: 'Mill Gondolas',
    defaultLengthFt: 65,
    avgPayloadTons: 102,
    trucksOffset: 4.0,
    primaryColor: '#1E3A8A', // Deep Industrial Navy
    accentColor: '#93C5FD',
    description: 'Low-profile open cars with reinforced sidewalls for scrap metal, steel coils, structural beams, and heavy machinery.',
  },
  'centerbeam-flatcars': {
    key: 'centerbeam-flatcars',
    name: 'Centerbeam Flatcars',
    defaultLengthFt: 73,
    avgPayloadTons: 98,
    trucksOffset: 3.8,
    primaryColor: '#B45309', // Mineral Amber
    accentColor: '#FDE68A',
    description: 'Specialized bulkhead flatcars with center A-frame truss partition designed specifically for packaged lumber and drywall.',
  },
  'bulkhead-flatcars': {
    key: 'bulkhead-flatcars',
    name: 'Bulkhead Flatcars',
    defaultLengthFt: 62,
    avgPayloadTons: 95,
    trucksOffset: 3.7,
    primaryColor: '#15803D', // Forest Green
    accentColor: '#86EFAC',
    description: 'Heavy duty steel flatcars with tall vertical end walls to prevent lengthwise shifting of pipes, rails, and structural poles.',
  },
  'tank-cars': {
    key: 'tank-cars',
    name: 'Tank Cars (DOT-111 / 117)',
    defaultLengthFt: 55,
    avgPayloadTons: 105,
    trucksOffset: 4.0,
    primaryColor: '#171717', // Gloss Black Vessel with Safety Orange Placards
    accentColor: '#F97316',
    description: 'Pressurized and general-purpose cylindrical vessels for chemical, petroleum, biofuel, liquid fertilizer, and corn syrup.',
  },
};
