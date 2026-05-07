import { Lock, Unlock, Play, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { courseModules } from '../data/modules';
import { useUser } from '../context/UserContext';

export default function Curriculum() {
  const navigate = useNavigate();
  const { user } = useUser();
  const completed = user?.completedModules || [];

  // Group modules by phaseName
  const phases = courseModules.reduce((acc, mod) => {
    if (!acc[mod.phaseName]) acc[mod.phaseName] = [];
    acc[mod.phaseName].push(mod);
    return acc;
  }, {} as Record<string, typeof courseModules>);

  return (
    <div className="max-w-7xl mx-auto pb-20 fade-in animate-in duration-500 relative">
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4 tracking-tight">Операционная Матрица</h1>
        <p className="text-slate-400 font-light text-sm max-w-2xl mx-auto">
          Пройдите 5 этапов эволюции трейдера. От базовых алгоритмов до абсолютного доминирования (Phantom Mastery). 50 премиум-фрагментов.
        </p>
      </div>

      <div className="relative border-l border-slate-800/50 pl-4 md:pl-12 ml-4 md:ml-0 space-y-24">
        {Object.entries(phases).map(([phaseName, modulesInPhase], phaseIdx) => {
           return (
             <div key={phaseName} className="relative">
                {/* Timeline node */}
                <div className="absolute -left-[21px] md:-left-[53px] top-0 w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] z-10" />
                <div className="absolute -left-[30px] md:-left-[62px] top-0 text-xs font-mono origin-left rotate-[-90deg] text-slate-600 tracking-widest whitespace-nowrap">
                   ФАЗА {(phaseIdx + 1).toString().padStart(2, '0')}
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-light text-white mb-2">{phaseName}</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                  {modulesInPhase.map((module, i) => {
                    const isCompleted = completed.includes(module.id);
                    const isGold = module.tier === 'gold';
                    const xpReward = isGold ? 500 : 100;
                    
                    return (
                      <div 
                        key={module.id} 
                        onClick={() => navigate(`/lesson/${module.id}`)}
                        className={`
                          bg-[#050505] border rounded-2xl p-6 relative overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col h-full
                          ${isGold ? 'border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]' : 'border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]'}
                        `}
                      >
                        {isGold && (
                          <div className="absolute top-0 right-0 p-3 font-mono text-[8px] text-amber-500 leading-none opacity-50 tracking-widest pointer-events-none">
                            ЭЛИТНЫЕ ДАННЫЕ
                          </div>
                        )}
                        {isGold && <div className="absolute inset-0 bg-amber-500/5 pointer-events-none" />}
                        
                        <div className="flex items-center justify-between mb-4 relative z-10">
                          <span className={`text-[10px] uppercase tracking-widest font-mono ${isGold ? 'text-amber-500' : 'text-cyan-500'}`}>
                            {isGold ? 'ЗОЛОТАЯ КАРТА' : `М-${(modulesInPhase.indexOf(module) + 1).toString().padStart(2, '0')}`}
                          </span>
                          {isCompleted ? <span className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-1 rounded">ПРОЙДЕНО</span> : null}
                        </div>
                        
                        <h3 className="text-xl font-light text-slate-100 mb-1 group-hover:text-white transition-colors relative z-10 leading-tight">{module.title}</h3>
                        <div className="text-xs text-slate-500 mb-4 font-serif italic relative z-10">{module.subtitle}</div>
                        
                        <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1 relative z-10">
                          {module.description}
                        </p>
                        
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/80 group-hover:border-slate-600 transition-colors relative z-10">
                          <span className={`text-[11px] font-mono ${isGold ? 'text-amber-500/70' : 'text-cyan-500/70'}`}>+{xpReward} XP</span>
                          <Play className={`w-5 h-5 ${isGold ? 'text-amber-400' : 'text-slate-500'} group-hover:scale-110 group-hover:text-cyan-400 transition-all`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
           )
        })}
      </div>
    </div>
  );
}
