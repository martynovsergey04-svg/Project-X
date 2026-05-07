import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Activity, LogOut } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Командный Центр', path: '/dashboard' },
  { icon: BookOpen, label: 'База Знаний', path: '/curriculum' },
  { icon: Activity, label: 'Мини-игры', path: '/simulator' },
];

export default function Sidebar() {
  const { user, logout } = useUser();

  return (
    <aside className="w-64 border-r border-slate-800 flex flex-col p-6 bg-black z-20">
      <div className="mb-10">
        <div className="text-xs tracking-[0.3em] text-cyan-500 font-bold mb-1">PROJECT X</div>
        <div className="text-xl font-light text-white tracking-tight">АКУЛА РЫНКА</div>
      </div>
      
      <nav className="flex-1 space-y-6">
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Главный Терминал</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center space-x-3 px-2 py-1.5 transition-colors cursor-pointer group",
                isActive 
                  ? "text-cyan-400" 
                  : "text-slate-400 hover:text-white opacity-80"
              )}
            >
              {({ isActive }) => (
                <>
                  <div className={cn("w-1 h-4 transition-all duration-200", isActive ? "bg-cyan-400" : "bg-transparent group-hover:bg-slate-700")} />
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded border border-slate-700 flex items-center justify-center text-white font-bold uppercase">
            {user?.username.substring(0, 2)}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs text-white font-bold truncate">{user?.username}</div>
            <div className="text-[10px] text-cyan-500 tracking-tighter uppercase">{user?.rank}</div>
          </div>
        </div>
        
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${Math.min(100, (user?.xp || 0) / 5000 * 100)}%` }}></div>
        </div>
        <div className="flex justify-between text-[9px] text-slate-500 tracking-widest">
          <span>XP: {user?.xp}</span>
        </div>

        <button 
          onClick={logout}
          className="mt-6 w-full flex items-center justify-center space-x-2 text-[10px] text-slate-500 hover:text-white uppercase tracking-widest transition-colors py-2 border border-transparent hover:border-slate-800 rounded"
        >
          <LogOut className="w-3 h-3" />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}
