import { Play, TrendingUp, ShieldAlert, Crosshair } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { courseModules } from '../data/modules';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();

  // Find next uncompleted module
  const nextModule = courseModules.find(m => !(user?.completedModules || []).includes(m.id)) || courseModules[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row gap-6 items-start pb-6 border-b border-slate-800/50">
        <div className="flex-1">
          <div className="text-cyan-500 text-[10px] font-bold tracking-[0.4em] mb-2 uppercase">СТАТУС: ПОДКЛЮЧЕНО</div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">С возвращением, {user?.username}.</h1>
          <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
            Рынок не ждет. Твоя следующая цель: "{nextModule.title}". Пройди инструктаж, чтобы пополнить счет знаниями и приблизиться к рангу "Элита".
          </p>
        </div>
        
        <button 
          onClick={() => navigate(`/lesson/${nextModule.id}`)}
          className="flex-shrink-0 group relative px-6 py-3 rounded bg-slate-200 text-black font-medium font-mono text-sm uppercase tracking-wide hover:bg-white transition-all disabled:opacity-50"
        >
          <span className="flex items-center gap-2">
            <Play className="w-4 h-4 fill-black text-black" />
            Продолжить Обучение
          </span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Пройдено модулей', value: `${user?.completedModules.length || 0} / ${courseModules.length}`, icon: TrendingUp, color: 'text-cyan-500' },
          { label: 'Баллы Опыта (XP)', value: user?.xp.toLocaleString() || '0', icon: Crosshair, color: 'text-emerald-400' },
          { label: 'Ранг', value: user?.rank || 'Новичок', icon: ShieldAlert, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-xl relative overflow-hidden p-5">
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-mono text-slate-500 uppercase">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color} opacity-70`} />
            </div>
            <div className="text-2xl font-light text-slate-100">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        
        {/* Next Objectives */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest pl-1">Текущий курс</h2>
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-1">
            <div className="p-4 flex items-center justify-between border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => navigate(`/lesson/${nextModule.id}`)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-cyan-950/20 border border-cyan-900/30 flex items-center justify-center text-cyan-500 font-mono text-sm uppercase tracking-wide">NEW</div>
                <div>
                  <div className="text-sm font-medium text-slate-200">{nextModule.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{nextModule.subtitle}</div>
                </div>
              </div>
              <div className="text-xs font-mono text-cyan-500 px-2 py-1 rounded bg-cyan-950/20 border border-cyan-900/30">ПРИСТУПИТЬ</div>
            </div>
          </div>
        </div>

        {/* Mini Leaderboard / Status */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest pl-1">Лента Рынка</h2>
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex gap-3 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
              <div>
                <div className="text-slate-300">Биткоин пробил $70,000. Шортистов уничтожено на $200 млн.</div>
                <div className="text-xs font-mono text-slate-600 mt-1">10 МИН НАЗАД</div>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
              <div>
                <div className="text-slate-300">ФРС оставила ставку без изменений.</div>
                <div className="text-xs font-mono text-slate-600 mt-1">2 ЧАСА НАЗАД</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
