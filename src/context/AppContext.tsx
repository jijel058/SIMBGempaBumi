import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Earthquake, EarthquakeStats, UserLocation } from '../types/earthquake';
import { UserProfile } from '../types/user';
import { fetchEarthquakes, computeStats, calculateDistance } from '../services/earthquakeApi';
import { loadUserProfile, saveUserProfile, addXpAndCheckLevel, unlockBadge } from '../services/storageService';
import { audio } from '../services/audioService';

export type NavigationTab = 
  | 'home' 
  | 'monitoring' 
  | 'map' 
  | 'education' 
  | 'mitigation' 
  | 'simulation' 
  | 'games' 
  | 'about';

interface AppContextType {
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isSoundMuted: boolean;
  toggleSound: () => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  earthquakes: Earthquake[];
  stats: EarthquakeStats | null;
  isLive: boolean;
  lastUpdated: Date;
  isLoading: boolean;
  apiError?: string;
  selectedQuake: Earthquake | null;
  setSelectedQuake: (quake: Earthquake | null) => void;
  userLocation: UserLocation | null;
  requestUserLocation: () => void;
  refreshEarthquakes: (timeRange?: '24h' | '7d' | '30d') => Promise<void>;
  userProfile: UserProfile;
  addXp: (amount: number) => { leveledUp: boolean };
  awardBadge: (badgeId: string) => boolean;
  toggleChecklist: (itemId: string) => void;
  updateGameScore: (gameKey: keyof UserProfile['gameScores'], score: number) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  
  // Two-way synchronization bridge between 3D Globe and 2D Map
  globeTargetCoords: { lat: number; lng: number } | null;
  setGlobeTargetCoords: (coords: { lat: number; lng: number } | null) => void;
  mapTargetCoords: { lat: number; lng: number } | null;
  setMapTargetCoords: (coords: { lat: number; lng: number } | null) => void;
  viewOn3DGlobe: (quake: Earthquake) => void;
  viewOnMap: (quake: Earthquake) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [stats, setStats] = useState<EarthquakeStats | null>(null);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | undefined>();
  const [selectedQuake, setSelectedQuake] = useState<Earthquake | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile());
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // Targets for two-way camera flying
  const [globeTargetCoords, setGlobeTargetCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapTargetCoords, setMapTargetCoords] = useState<{ lat: number; lng: number } | null>(null);
  const activeTimeRangeRef = React.useRef<'24h' | '7d' | '30d'>('24h');

  // Sync dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle sound mute
  const toggleSound = () => {
    const next = !isSoundMuted;
    setIsSoundMuted(next);
    audio.setMuted(next);
    if (!next) {
      audio.playClick();
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Two-way navigation bridge actions
  const viewOn3DGlobe = (quake: Earthquake) => {
    audio.playClick();
    setSelectedQuake(quake);
    setGlobeTargetCoords({ lat: quake.latitude, lng: quake.longitude });
    setActiveTab('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewOnMap = (quake: Earthquake) => {
    audio.playClick();
    setSelectedQuake(quake);
    setMapTargetCoords({ lat: quake.latitude, lng: quake.longitude });
    setActiveTab('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch real earthquake data
  const loadData = async (timeRange: '24h' | '7d' | '30d' = activeTimeRangeRef.current, force = false) => {
    activeTimeRangeRef.current = timeRange;
    setIsLoading(true);
    try {
      const res = await fetchEarthquakes(timeRange, force);
      let quakes = res.earthquakes;

      // Compute distances if user location is already known
      if (userLocation) {
        quakes = quakes.map(q => ({
          ...q,
          distanceFromUser: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            q.latitude,
            q.longitude
          )
        }));
      }

      setEarthquakes(quakes);
      setStats(computeStats(quakes));
      setIsLive(res.isLive);
      setLastUpdated(res.lastUpdated);
      setApiError(res.error);
    } catch (e: any) {
      setApiError(e?.message || 'Failed to load earthquakes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData('24h', false);
    // Auto-refresh every 2.5 minutes using the currently selected timeRange
    const interval = setInterval(() => {
      loadData(activeTimeRangeRef.current, false);
    }, 150000);
    return () => clearInterval(interval);
  }, []);

  // Request user GPS location
  const requestUserLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const loc: UserLocation = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          };
          setUserLocation(loc);

          // Update earthquakes with distance
          setEarthquakes(prev =>
            prev.map(q => ({
              ...q,
              distanceFromUser: calculateDistance(
                loc.latitude,
                loc.longitude,
                q.latitude,
                q.longitude
              )
            }))
          );
        },
        err => {
          console.warn('Geolocation denied or unavailable:', err.message);
          // Default fallback location (Jakarta / Indonesia central)
          const fallbackLoc: UserLocation = {
            latitude: -6.2088,
            longitude: 106.8456,
            city: 'Jakarta (Perkiraan)',
            country: 'Indonesia'
          };
          setUserLocation(fallbackLoc);
        },
        { enableHighAccuracy: false, timeout: 8000 }
      );
    }
  };

  // Profile XP and Badges
  const addXp = (amount: number) => {
    const result = addXpAndCheckLevel(amount);
    setUserProfile(result.profile);
    if (result.leveledUp) {
      audio.playSuccessChime();
    }
    return result;
  };

  const awardBadge = (badgeId: string) => {
    const newly = unlockBadge(badgeId);
    if (newly) {
      setUserProfile(loadUserProfile());
      audio.playSuccessChime();
    }
    return newly;
  };

  const toggleChecklist = (itemId: string) => {
    setUserProfile(prev => {
      const exists = prev.completedChecklists.includes(itemId);
      const updated = exists
        ? prev.completedChecklists.filter(id => id !== itemId)
        : [...prev.completedChecklists, itemId];
      
      const newProfile = { ...prev, completedChecklists: updated };
      saveUserProfile(newProfile);
      return newProfile;
    });
    audio.playClick();
  };

  const updateGameScore = (gameKey: keyof UserProfile['gameScores'], score: number) => {
    setUserProfile(prev => {
      const current = prev.gameScores[gameKey];
      if (score > current) {
        const newProfile = {
          ...prev,
          gameScores: {
            ...prev.gameScores,
            [gameKey]: score
          }
        };
        saveUserProfile(newProfile);
        return newProfile;
      }
      return prev;
    });
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        isSoundMuted,
        toggleSound,
        activeTab,
        setActiveTab,
        earthquakes,
        stats,
        isLive,
        lastUpdated,
        isLoading,
        apiError,
        selectedQuake,
        setSelectedQuake,
        userLocation,
        requestUserLocation,
        refreshEarthquakes: loadData,
        userProfile,
        addXp,
        awardBadge,
        toggleChecklist,
        updateGameScore,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        globeTargetCoords,
        setGlobeTargetCoords,
        mapTargetCoords,
        setMapTargetCoords,
        viewOn3DGlobe,
        viewOnMap
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
