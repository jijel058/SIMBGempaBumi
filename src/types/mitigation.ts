export interface MitigationItem {
  id: string;
  category: 'before' | 'during' | 'after';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  subtitle: string;
  locationType: 'home' | 'highrise' | 'school' | 'outdoor' | 'vehicle';
  magnitude: number;
  depthKm: number;
  shakingDurationSec: number;
  description: string;
  initialSituation: string;
  phases: {
    phase: 'warning' | 'shaking' | 'post_quake' | 'evacuation';
    prompt: string;
    options: {
      text: string;
      isBest: boolean;
      consequence: string;
      points: number;
    }[];
  }[];
}

