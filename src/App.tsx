import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { EmergencyModal } from './components/layout/EmergencyModal';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { InteractiveAtmosphereBackground } from './components/layout/InteractiveAtmosphereBackground';

import { HomeView } from './components/home/HomeView';
import { MonitoringView } from './components/monitoring/MonitoringView';
import { MapView } from './components/map/MapView';
import { EducationView } from './components/education/EducationView';
import { MitigationView } from './components/mitigation/MitigationView';
import { Simulation3DView } from './components/simulation3d/Simulation3DView';
import { GamesHubView } from './components/games/GamesHubView';
import { AboutView } from './components/about/AboutView';

export const App: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-earth-dark text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-200 relative">
      {/* Dynamic Interactive Animated Background (Requirement #2) */}
      <InteractiveAtmosphereBackground />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Routed Content Body */}
      <main className="flex-1 relative z-10">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'monitoring' && <MonitoringView />}
        {activeTab === 'map' && <MapView />}
        {activeTab === 'education' && <EducationView />}
        {activeTab === 'mitigation' && <MitigationView />}
        {activeTab === 'simulation' && <Simulation3DView />}
        {activeTab === 'games' && <GamesHubView />}
        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Global Modals */}
      <EmergencyModal />
      <GlobalSearchModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
