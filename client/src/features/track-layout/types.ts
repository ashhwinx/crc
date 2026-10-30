export type TrackLayoutPreset =
  | 'single-spur'
  | 'double-ended'
  | 'multi-transload'
  | 'warehouse-dock';

export type RailcarCategoryKey =
  | 'boxcars'
  | 'covered-hoppers'
  | 'open-top-hoppers'
  | 'gondolas'
  | 'centerbeam-flatcars'
  | 'bulkhead-flatcars'
  | 'tank-cars';

export type CameraViewMode = 'orbit' | 'top-down' | 'conductor';
export type LightingMode = 'day' | 'dusk' | 'night';

export interface LayoutPresetConfig {
  id: TrackLayoutPreset;
  name: string;
  badge: string;
  description: string;
  defaultFootage: number;
  minFootage: number;
  maxFootage: number;
  hasLoadingDock: boolean;
  hasSilos: boolean;
  tracksCount: number;
}

export interface RailcarProfile {
  key: RailcarCategoryKey;
  name: string;
  defaultLengthFt: number;
  avgPayloadTons: number;
  trucksOffset: number;
  primaryColor: string;
  accentColor: string;
  description: string;
}

export interface SidingEngineeringMetrics {
  totalTrackFt: number;
  usableSpottingFt: number;
  foulingClearanceFt: number;
  maxSpottingCars: number;
  currentPlacedCars: number;
  totalPayloadTons: number;
  highwayTrucksReplaced: number;
  turnoutType: string;
}
