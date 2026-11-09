import { UserProfile, Badge } from '../types/user';

const USER_KEY = 'seismora_user_profile_v1';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_quiz',
    title: 'Peneliti Pemula',
    description: 'Menyelesaikan Kuis Gempa Bumi pertama kamu',
    icon: 'Brain',
    category: 'knowledge'
  },
  {
    id: 'perfect_bag',
    title: 'Survivor Sejati',
    description: 'Menyusun Tas Siaga Bencana dengan akurasi 100%',
    icon: 'Backpack',
    category: 'mitigation'
  },
  {
    id: 'safe_spotter',
    title: 'Mata Elang Mitigasi',
    description: 'Menemukan seluruh titik aman dalam simulasi ruangan',
    icon: 'ShieldCheck',
    category: 'simulation'
  },
  {
    id: 'mission_hero',
    title: 'Pahlawan Evakuasi',
    description: 'Berhasil menyelesaikan Emergency Mission tanpa cedera',
    icon: 'Award',
    category: 'simulation'
  },
  {
    id: 'tectonic_master',
    title: 'Geologis Handal',
    description: 'Menyelesaikan Puzzle Lempeng Tektonik',
    icon: 'Globe2',
    category: 'knowledge'
  },
  {
    id: 'checklist_done',
    title: 'Siap Siaga 100%',
    description: 'Menuntaskan seluruh checklist mitigasi sebelum gempa',
    icon: 'CheckCircle2',
    category: 'mitigation'
  }
];

export const DEFAULT_USER: UserProfile = {
  id: 'guest-user-1',
  name: 'Warga Siaga Seismora',
  email: 'user@seismora.org',
  avatarSeed: 'seismora-hero',
  level: 1,
  xp: 150,
  badges: ['first_quiz'],
  completedChecklists: ['check-1', 'check-3'],
  gameScores: {
    quizHighscore: 80,
    emergencyMissionHighscore: 120,
    safePlaceHighscore: 100,
    emergencyBagHighscore: 95,
    tectonicPuzzleHighscore: 100,
  },
  notificationSettings: {
    enabled: true,
    minMagnitude: 5.0,
    radiusKm: 500,
    tsunamiAlertsOnly: false,
    soundEnabled: true,
  },
  savedArticles: ['pengertian-gempa', 'megathrust-sunda'],
  createdAt: new Date().toISOString()
};

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_USER, ...parsed };
    }
  } catch (e) {
    console.warn('Storage read error:', e);
  }
  return DEFAULT_USER;
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Storage save error:', e);
  }
}

export function addXpAndCheckLevel(amount: number): { profile: UserProfile; leveledUp: boolean } {
  const profile = loadUserProfile();
  profile.xp += amount;
  
  // 100 XP per level formula
  const currentLevel = Math.floor(profile.xp / 150) + 1;
  const leveledUp = currentLevel > profile.level;
  profile.level = currentLevel;
  
  saveUserProfile(profile);
  return { profile, leveledUp };
}

export function unlockBadge(badgeId: string): boolean {
  const profile = loadUserProfile();
  if (!profile.badges.includes(badgeId)) {
    profile.badges.push(badgeId);
    profile.xp += 100;
    saveUserProfile(profile);
    return true; // Newly unlocked
  }
  return false;
}

