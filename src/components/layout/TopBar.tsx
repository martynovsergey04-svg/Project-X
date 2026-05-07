import React from 'react';
import { useUser } from '../../context/UserContext';
import { Flame, Shield, Trophy } from 'lucide-react';

export default function TopBar() {
  const { user } = useUser();

  return (
    <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-black/50 z-30 sticky top-0">
      <div className="flex space-x-8 md:space-x-12">
        <div className="text-center hidden sm:block">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Стрик</div>
          <div className="text-white font-mono text-lg font-bold flex items-center gap-1 justify-center">
            {user?.streak} ДНЕЙ <Flame className="w-4 h-4 text-rose-500 ml-1" />
          </div>
        </div>
        <div className="text-center hidden sm:block">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Ваш Ранг</div>
          <div className="text-cyan-500 font-mono text-lg font-bold uppercase flex items-center justify-center gap-1">
            <Shield className="w-4 h-4 mr-1" /> {user?.rank}
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded text-xs tracking-tighter font-mono hover:bg-slate-800 cursor-pointer text-slate-300">
          СЕТЬ: АКТИВНА
        </div>
      </div>
    </header>
  );
}
