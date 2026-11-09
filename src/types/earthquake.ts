export interface Earthquake {
  id: string;
  source: 'USGS' | 'BMKG' | 'EMSC';
  externalId: string;
  magnitude: number;
  location: string;
  latitude: number;
  longitude: number;
  depth: number; // in km
  time: number; // epoch ms
  updatedTime?: number;
  tsunami: boolean | number;
  status?: string;
  alert?: 'green' | 'yellow' | 'orange' | 'red' | null;
  felt?: number | null;
  significance?: number;
  url?: string;
  distanceFromUser?: number; // km
  dirasakan?: string; // BMKG MMI report
  shakemap?: string;
}

export type TimeRangeFilter = '24h' | '7d' | '30d';

export interface QuakeFilters {
  minMagnitude: number;
  maxMagnitude: number;
  timeRange: TimeRangeFilter;
  searchQuery: string;
  source: 'all' | 'USGS' | 'BMKG';
  maxDepth: number;
  tsunamiOnly: boolean;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  accuracy?: number;
}

export interface EarthquakeStats {
  totalToday: number;
  maxMagnitudeToday: number;
  latestQuake: Earthquake | null;
  significantCount: number;
  tsunamiAlertCount: number;
  avgDepth: number;
  regionalCounts: { [region: string]: number };
}

