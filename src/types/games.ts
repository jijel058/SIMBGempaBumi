export interface QuizQuestion {
  id: string;
  question: string;
  category: 'geology' | 'tectonics' | 'mitigation' | 'seismology';
  difficulty: 'easy' | 'medium' | 'hard';
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface MissionChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  points: number;
  nextStepId?: string;
}

export interface MissionStep {
  id: string;
  scenarioTitle: string;
  environment: 'home' | 'highrise' | 'school' | 'outdoor' | 'vehicle';
  situation: string;
  imageUrl?: string;
  timerSeconds: number;
  choices: MissionChoice[];
}

export interface SafePlaceHotspot {
  id: string;
  name: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  isSafe: boolean;
  reason: string;
  scoreImpact: number;
}

export interface SafePlaceRoom {
  id: string;
  title: string;
  description: string;
  imageTheme: string;
  hotspots: SafePlaceHotspot[];
}

export interface BagItem {
  id: string;
  name: string;
  category: 'hydration_food' | 'first_aid' | 'safety_tools' | 'documents' | 'non_essential';
  isEssential: boolean;
  weightKg: number;
  explanation: string;
  iconName: string;
}

export interface TectonicPlatePiece {
  id: string;
  name: string;
  description: string;
  type: 'oceanic' | 'continental';
  movementDirection: 'north' | 'south' | 'east' | 'west' | 'northwest' | 'northeast';
  targetSlot: string;
  boundaryTypeWithNeighbor: 'convergent' | 'divergent' | 'transform';
}

