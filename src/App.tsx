import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import MiserAIChat from './components/MiserAIChat';
import { useEffect, useState } from 'react';

import Dashboard from './pages/Dashboard';
import Curriculum from './pages/Curriculum';
import LessonView from './pages/LessonView';
import Simulator from './pages/Simulator';
import Onboarding from './pages/Onboarding';
import { UserProvider, useUser } from './context/UserContext';

const EasterEggListener = () => {
  const { addXp } = useUser();
  const [konamiActivated, setKonamiActivated] = useState(false);

  useEffect(() => {
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          if (!konamiActivated) {
            setKonamiActivated(true);
            alert("MATRIX PROTOCOL UNLOCKED: РЕЖИМ БОГА АКТИВИРОВАН! Начислено +10,000 XP");
            addXp(10000);
          }
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };
    
    window.addEventListener('keydown', keydownHandler);
    return () => window.removeEventListener('keydown', keydownHandler);
  }, [addXp, konamiActivated]);

  return null;
};

function AppContent() {
  const { user } = useUser();

  if (!user) {
    return <Onboarding />;
  }

  return (
    <BrowserRouter>
      <EasterEggListener />
      <div className="flex h-screen bg-[#050505] text-slate-300 font-sans overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full relative z-10 w-full overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-32">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/lesson/:id" element={<LessonView />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
        <MiserAIChat />
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
