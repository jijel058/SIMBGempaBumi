export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarSeed: string;
  level: number;
  xp: number;
  badges: string[];
  completedChecklists: string[];
  gameScores: {
    quizHighscore: number;
    emergencyMissionHighscore: number;
    safePlaceHighscore: number;
    emergencyBagHighscore: number;
    tectonicPuzzleHighscore: number;
  };
  notificationSettings: {
    enabled: boolean;
    minMagnitude: number;
    radiusKm: number;
    tsunamiAlertsOnly: boolean;
    soundEnabled: boolean;
  };
  savedArticles: string[];
  createdAt: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'mitigation' | 'knowledge' | 'simulation' | 'master';
  unlockedAt?: string;
}

