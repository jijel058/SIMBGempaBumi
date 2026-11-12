import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { EmergencyModal } from './components/layout/EmergencyModal';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { EarthquakeDioramaBackground } from './components/layout/EarthquakeDioramaBackground';

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
  const isHome = activeTab === 'home';

  return (
    <div className="min-h-screen flex flex-col text-slate-900 selection:bg-emerald-500 selection:text-white relative">
      {/* 3D earthquake diorama (fixed, behind everything) */}
      <EarthquakeDioramaBackground />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Routed Content Body */}
      <main id="top" className="flex-1 relative z-10">
        {isHome ? (
          <HomeView />
        ) : (
          <div className="px-3 sm:px-5">
            <div className="max-w-[88rem] mx-auto mt-4 mb-10 rounded-[2rem] bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]">
              {activeTab === 'monitoring' && <MonitoringView />}
              {activeTab === 'map' && <MapView />}
              {activeTab === 'education' && <EducationView />}
              {activeTab === 'mitigation' && <MitigationView />}
              {activeTab === 'simulation' && <Simulation3DView />}
              {activeTab === 'games' && <GamesHubView />}
              {activeTab === 'about' && <AboutView />}
            </div>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <EmergencyModal />
      <GlobalSearchModal />

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default App;
