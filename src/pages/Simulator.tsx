import { useState, useEffect } from 'react';
import { Target, TrendingUp, ShieldAlert, X, MousePointer2, Database, Briefcase, AlertTriangle, LockIcon } from 'lucide-react';
import { useUser } from '../context/UserContext';
import CandlestickChart, { CandleData } from '../components/CandlestickChart';

const generateRandomCandles = (count: number, startPrice: number): CandleData[] => {
  let price = startPrice;
  return Array.from({ length: count }).map((_, i) => {
    const isUp = Math.random() > 0.5;
    const volatility = Math.random() * 200 + 50;
    const open = price;
    const close = price + (isUp ? volatility : -volatility);
    const high = Math.max(open, close) + Math.random() * 100;
    const low = Math.min(open, close) - Math.random() * 100;
    price = close;
    return { time: i.toString(), open, high, low, close };
  });
};

export default function Simulator() {
  const { addXp } = useUser();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [feedback, setFeedback] = useState<{msg: string, type: 'success'|'error'}|null>(null);
  
  // Elements for connection game
  const [selectedMatch, setSelectedMatch] = useState<{item1: string | null, item2: string | null}>({item1: null, item2: null});
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  
  const connectionItems = [
    { id: 'c1', type: 'concept', text: 'Сбор ликвидности' },
    { id: 'c2', type: 'concept', text: 'Ордерблок' },
    { id: 'c3', type: 'concept', text: 'FVG' },
    { id: 'd1', type: 'def', text: 'Пробой уровня поддержки для сбора стоп-лоссов.' },
    { id: 'd2', type: 'def', text: 'Зона, где крупный игрок оставил след перед импульсом.' },
    { id: 'd3', type: 'def', text: 'Разрыв справедливой стоимости (пустая зона).' },
  ];

  const correctMatches: Record<string, string> = {
    'c1': 'd1', 'c2': 'd2', 'c3': 'd3',
    'd1': 'c1', 'd2': 'c2', 'd3': 'c3'
  };

  useEffect(() => {
    if (activeGame === 'predict') {
      setChartData(generateRandomCandles(15, 60000));
      setFeedback(null);
    } else if (activeGame === 'connect') {
      setMatchedPairs([]);
      setSelectedMatch({item1: null, item2: null});
      setFeedback(null);
    } else if (activeGame === 'stoploss') {
      setChartData(generateRandomCandles(15, 40000));
      setFeedback(null);
    } else if (activeGame === 'whaletrap') {
      setChartData(generateRandomCandles(20, 30000));
      setFeedback(null);
    }
  }, [activeGame]);

  const games = [
    {
      id: 'predict',
      title: 'Trend Sniper',
      desc: 'Анализируйте паттерн свечей и предугадайте, куда пойдет цена. (Бесконечно)',
      icon: Target,
      color: 'text-cyan-500',
    },
    {
      id: 'connect',
      title: 'Connection Matrix',
      desc: 'Свяжите понятия с их правильными определениями в динамической сетке. (Бесконечно)',
      icon: MousePointer2,
      color: 'text-emerald-400',
    },
    {
      id: 'stoploss',
      title: 'Stop-Loss Simulator',
      desc: 'Оцените график и нажмите туда, где нужно установить безопасный стоп-лосс.',
      icon: ShieldAlert,
      color: 'text-amber-400',
      locked: false,
    },
    {
      id: 'whaletrap',
      title: 'Whale Trap Detector',
      desc: 'Найдите зону сбора ликвидности (фейкаут) на графике.',
      icon: Target,
      color: 'text-purple-500',
      locked: false,
    },
    {
      id: 'panic',
      title: 'Panic Simulator',
      desc: 'Симулятор обвала рынка. Попробуйте не продать на дне.',
      icon: TrendingUp,
      color: 'text-red-500',
      locked: true,
      reqRank: 'Advanced'
    },
    {
      id: 'margin',
      title: 'Margin Call Dodge',
      desc: 'Управление кредитным плечом в реальном времени при высокой волатильности.',
      icon: ShieldAlert,
      color: 'text-orange-500',
      locked: true,
      reqRank: 'Elite'
    },
    {
      id: 'fibo',
      title: 'Fibonacci Master',
      desc: 'Натяните правильную сетку на импульс.',
      icon: Target,
      color: 'text-blue-500',
      locked: true,
      reqRank: 'Elite'
    },
    {
      id: 'orderflow',
      title: 'Orderflow X',
      desc: 'Чтение ленты (DOM) и кластерного анализа.',
      icon: Database,
      color: 'text-indigo-500',
      locked: true,
      reqRank: 'Master'
    },
    {
      id: 'portfolio',
      title: 'Hedge Fund Manager',
      desc: 'Распределите $10,000,000 по активам во время кризиса.',
      icon: Briefcase,
      color: 'text-teal-500',
      locked: true,
      reqRank: 'Phantom'
    },
    {
      id: 'blackswan',
      title: 'Black Swan Event',
      desc: 'Выживание во время полного обрушения сети.',
      icon: AlertTriangle,
      color: 'text-rose-600',
      locked: true,
      reqRank: 'X Legend'
    }
  ];

  const handlePredict = (direction: 'up' | 'down') => {
    const currentPrice = chartData[chartData.length - 1].close;
    const isUp = Math.random() > 0.4;
    
    const futureData: CandleData[] = [];
    let price = currentPrice;
    for(let i=0; i<3; i++) {
        const up = isUp;
        const volatility = Math.random() * 300 + 100;
        const open = price;
        const close = price + (up ? volatility : -volatility);
        const high = Math.max(open, close) + Math.random() * 50;
        const low = Math.min(open, close) - Math.random() * 50;
        price = close;
        futureData.push({ time: (chartData.length + i).toString(), open, high, low, close });
    }
    setChartData([...chartData, ...futureData]);

    const won = (direction === 'up' && isUp) || (direction === 'down' && !isUp);
    
    if (won) {
        setFeedback({msg: 'Отличный прогноз! Вы прочитали рынок. +50 XP', type: 'success'});
        addXp(50);
    } else {
        setFeedback({msg: 'Ошибка. Рынок пошел в другую сторону и выбил ваши стопы.', type: 'error'});
    }
  };

  const handleMatchClick = (id: string) => {
    if (matchedPairs.includes(id)) return;

    if (!selectedMatch.item1) {
      setSelectedMatch({ ...selectedMatch, item1: id });
    } else if (selectedMatch.item1 === id) {
       setSelectedMatch({ ...selectedMatch, item1: null }); // Deselect
    } else {
      // Check match
      if (correctMatches[selectedMatch.item1] === id) {
        const newMatched = [...matchedPairs, selectedMatch.item1, id];
        setMatchedPairs(newMatched);
        setSelectedMatch({ item1: null, item2: null });
        if (newMatched.length === connectionItems.length) {
          setFeedback({msg: 'Все верно! +100 XP', type: 'success'});
          addXp(100);
        }
      } else {
        setSelectedMatch({ item1: null, item2: null });
        // Optional error vibration or state
        alert('Неверное совпадение. Попробуйте еще раз.');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 fade-in animate-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-light text-white mb-2 tracking-tight">Мини-игры</h1>
        <p className="text-slate-400 font-light max-w-2xl text-sm">
          Тестируйте гипотезы на исторических графиках и проверяйте свои знания.
        </p>
      </div>

      {!activeGame ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const isLocked = game.locked;
            return (
            <div 
              key={game.id}
              onClick={() => !isLocked && setActiveGame(game.id)}
              className={`border p-6 rounded-xl relative group transition-all duration-300
                ${isLocked 
                  ? 'bg-slate-900/10 border-slate-800/30 cursor-not-allowed grayscale opacity-60' 
                  : 'bg-slate-900/40 border-slate-800 cursor-pointer hover:border-slate-600 hover:bg-slate-900/60 shadow-lg hover:shadow-cyan-900/20'
                }`}
            >
              {isLocked && <div className="absolute top-4 right-4"><LockIcon className="w-4 h-4 text-slate-600" /></div>}
              <div className="flex flex-col items-start gap-4">
                <div className={`p-3 rounded-lg bg-black border ${isLocked ? 'border-slate-800/30' : 'border-slate-800 shadow-inner'}`}>
                  <game.icon className={`w-6 h-6 ${isLocked ? 'text-slate-600' : game.color}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-medium transition-colors ${isLocked ? 'text-slate-500' : 'text-slate-200 group-hover:text-white'}`}>{game.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{game.desc}</p>
                </div>
                {isLocked && (
                   <div className="mt-4 text-xs font-mono text-rose-500 tracking-widest uppercase border border-rose-900/50 bg-rose-950/20 px-2 py-1 rounded">
                     ТРЕБУЕМЫЙ РАНГ: {game.reqRank}
                   </div>
                )}
              </div>
            </div>
          )})}
        </div>
      ) : activeGame === 'predict' ? (
        <div className="border border-slate-800 bg-black rounded-xl p-8 min-h-[500px] flex flex-col relative overflow-hidden">
          <button 
            onClick={() => setActiveGame(null)}
            className="absolute top-4 right-4 flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-white uppercase px-3 py-1 border border-slate-800 rounded bg-slate-900"
          >
            <X className="w-3 h-3" /> ВЫХОД
          </button>
          
          <div className="flex flex-col flex-1 mt-6 animate-in fade-in duration-500">
            <h2 className="text-xl font-mono text-cyan-500 mb-2 uppercase tracking-widest text-center">ПРОГНОЗ ДВИЖЕНИЯ</h2>
            <p className="text-slate-400 mb-6 text-center text-sm">Оцените график и нажмите ВВЕРХ или ВНИЗ.</p>
            
            <div className="w-full flex-1 max-h-[400px] bg-[#050505] border border-slate-800 rounded-lg p-4 mb-8">
               <CandlestickChart data={chartData} height={350} />
            </div>

            {feedback ? (
                <div className={`p-4 border ${feedback.type === 'success' ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400' : 'border-rose-500/50 bg-rose-950/20 text-rose-500'} rounded-lg text-center mb-6 text-sm font-mono`}>
                    {feedback.msg}
                </div>
            ) : null}

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => handlePredict('up')}
                disabled={feedback !== null}
                className="px-8 py-3 bg-emerald-900/30 border border-emerald-500/50 hover:bg-emerald-500 hover:text-black transition-all rounded text-sm font-bold tracking-widest uppercase text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5" /> ЛОНГ (Вверх)
              </button>
              <button 
                onClick={() => handlePredict('down')}
                disabled={feedback !== null}
                className="px-8 py-3 bg-rose-900/30 border border-rose-500/50 hover:bg-rose-500 hover:text-black transition-all rounded text-sm font-bold tracking-widest uppercase text-rose-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5 rotate-180" /> ШОРТ (Вниз)
              </button>
            </div>
            {feedback && (
                <button onClick={() => {setChartData(generateRandomCandles(15, 60000)); setFeedback(null);}} className="mx-auto mt-6 text-xs text-slate-500 hover:text-white underline underline-offset-4">Следующий график</button>
            )}
          </div>
        </div>
      ) : activeGame === 'connect' ? (
         <div className="border border-slate-800 bg-black rounded-xl p-8 min-h-[500px] flex flex-col relative overflow-hidden">
          <button 
            onClick={() => setActiveGame(null)}
            className="absolute top-4 right-4 flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-white uppercase px-3 py-1 border border-slate-800 rounded bg-slate-900"
          >
            <X className="w-3 h-3" /> ВЫХОД
          </button>
          
          <div className="flex flex-col flex-1 mt-6 animate-in fade-in duration-500">
            <h2 className="text-xl font-mono text-emerald-500 mb-2 uppercase tracking-widest text-center">СОЕДИНИ ТЕРМИНЫ</h2>
            <p className="text-slate-400 mb-6 text-center text-sm">Кликните на название, а затем на его определение.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
               <div className="space-y-4">
                 <h3 className="text-sm font-mono text-slate-500 text-center mb-4">ТЕРМИНЫ</h3>
                 {connectionItems.filter(i => i.type === 'concept').map(item => (
                   <button 
                     key={item.id}
                     disabled={matchedPairs.includes(item.id)}
                     onClick={() => handleMatchClick(item.id)}
                     className={`w-full p-4 border rounded-lg text-sm text-center transition-all ${
                       matchedPairs.includes(item.id) 
                         ? 'border-emerald-500/50 bg-emerald-900/20 text-emerald-500 opacity-50' 
                         : selectedMatch.item1 === item.id
                           ? 'border-cyan-500 bg-cyan-900/30 text-white'
                           : 'border-slate-800 bg-slate-900/30 text-slate-300 hover:border-slate-600'
                     }`}
                   >
                     {item.text}
                   </button>
                 ))}
               </div>
               <div className="space-y-4">
                 <h3 className="text-sm font-mono text-slate-500 text-center mb-4">ОПРЕДЕЛЕНИЯ</h3>
                 {connectionItems.filter(i => i.type === 'def').map(item => (
                   <button 
                     key={item.id}
                     disabled={matchedPairs.includes(item.id)}
                     onClick={() => handleMatchClick(item.id)}
                     className={`w-full p-4 border rounded-lg text-sm text-center transition-all ${
                       matchedPairs.includes(item.id) 
                         ? 'border-emerald-500/50 bg-emerald-900/20 text-emerald-500 opacity-50' 
                         : selectedMatch.item1 === item.id
                           ? 'border-cyan-500 bg-cyan-900/30 text-white'
                           : 'border-slate-800 bg-slate-900/30 text-slate-300 hover:border-slate-600'
                     }`}
                   >
                     {item.text}
                   </button>
                 ))}
               </div>
            </div>

            {feedback && (
                <div className={`p-4 border border-emerald-500/50 bg-emerald-950/20 text-emerald-400 rounded-lg text-center mt-auto font-mono`}>
                    {feedback.msg}
                </div>
            )}
          </div>
         </div>
      ) : activeGame === 'stoploss' ? (
         <div className="border border-slate-800 bg-black rounded-xl p-8 min-h-[500px] flex flex-col relative overflow-hidden">
          <button 
            onClick={() => setActiveGame(null)}
            className="absolute top-4 right-4 flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-white uppercase px-3 py-1 border border-slate-800 rounded bg-slate-900"
          >
            <X className="w-3 h-3" /> ВЫХОД
          </button>
          
          <div className="flex flex-col flex-1 mt-6 animate-in fade-in duration-500">
            <h2 className="text-xl font-mono text-amber-400 mb-2 uppercase tracking-widest text-center">STOP-LOSS SIMULATOR</h2>
            <p className="text-slate-400 mb-6 text-center text-sm">Где вы поставите безопасный стоп-лосс на этом лонг-сетапе?</p>
            
            <div className="w-full flex-1 max-h-[400px] bg-[#050505] border border-slate-800 rounded-lg p-4 mb-4">
               <CandlestickChart data={chartData} height={300} />
            </div>

            {feedback ? (
                <div className={`p-4 border ${feedback.type === 'success' ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400' : 'border-rose-500/50 bg-rose-950/20 text-rose-500'} rounded-lg text-center mb-6 text-sm font-mono`}>
                    {feedback.msg}
                </div>
            ) : null}

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => {
                   setFeedback({msg: 'ОШИБКА: Стоп прямо под локальным лоу. Это любимая ликвидность маркетмейкера.', type: 'error'});
                }}
                disabled={feedback !== null}
                className="px-6 py-2 border border-slate-700 hover:border-amber-500 hover:text-amber-500 transition-all rounded text-sm text-slate-300 disabled:opacity-50"
              >
                Чуть ниже текущей свечи
              </button>
              <button 
                onClick={() => {
                   setFeedback({msg: 'УСПЕШНО: Вы спрятали стоп за структурным минимумом (Swing Low). +150 XP', type: 'success'});
                   addXp(150);
                }}
                disabled={feedback !== null}
                className="px-6 py-2 border border-slate-700 hover:border-amber-500 hover:text-amber-500 transition-all rounded text-sm text-slate-300 disabled:opacity-50"
              >
                Под ближайший Orderblock
              </button>
              <button 
                 onClick={() => {
                   setFeedback({msg: 'ОШИБКА: Слишком длинный стоп нарушает ваш Risk/Reward. Вы рискуете потерять много.', type: 'error'});
                 }}
                disabled={feedback !== null}
                className="px-6 py-2 border border-slate-700 hover:border-amber-500 hover:text-amber-500 transition-all rounded text-sm text-slate-300 disabled:opacity-50"
              >
                На 10% ниже цены входа
              </button>
            </div>
             {feedback && (
                <button onClick={() => {setChartData(generateRandomCandles(15, 40000)); setFeedback(null);}} className="mx-auto mt-6 text-xs text-slate-500 hover:text-white underline underline-offset-4">Следующий сетап</button>
            )}
          </div>
         </div>
      ) : activeGame === 'whaletrap' ? (
         <div className="border border-slate-800 bg-black rounded-xl p-8 min-h-[500px] flex flex-col relative overflow-hidden">
          <button 
            onClick={() => setActiveGame(null)}
            className="absolute top-4 right-4 flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-white uppercase px-3 py-1 border border-slate-800 rounded bg-slate-900"
          >
            <X className="w-3 h-3" /> ВЫХОД
          </button>
          
          <div className="flex flex-col flex-1 mt-6 animate-in fade-in duration-500">
            <h2 className="text-xl font-mono text-purple-500 mb-2 uppercase tracking-widest text-center">WHALE TRAP DETECTOR</h2>
            <p className="text-slate-400 mb-6 text-center text-sm">Найдите на графике зону сбора пусти ликвидности (фейкаут).</p>
            
            <div className="w-full flex-1 max-h-[400px] bg-[#050505] border border-slate-800 rounded-lg p-4 mb-4">
               <CandlestickChart data={chartData} height={300} />
            </div>

            {feedback ? (
                <div className={`p-4 border ${feedback.type === 'success' ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400' : 'border-rose-500/50 bg-rose-950/20 text-rose-500'} rounded-lg text-center mb-6 text-sm font-mono`}>
                    {feedback.msg}
                </div>
            ) : null}

            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => {
                   setFeedback({msg: 'ОШИБКА: Это просто консолидация. Здесь киты накапливают, а не сносят стопы.', type: 'error'});
                }}
                disabled={feedback !== null}
                className="px-6 py-2 border border-slate-700 hover:border-purple-500 hover:text-purple-500 transition-all rounded text-sm text-slate-300 disabled:opacity-50"
              >
                Зона Консолидации (Топ)
              </button>
              <button 
                onClick={() => {
                   setFeedback({msg: 'УСПЕШНО: Вы нашли длинную тень свечи, пробивающую уровень. Свип ликвидности пойман! +250 XP', type: 'success'});
                   addXp(250);
                }}
                disabled={feedback !== null}
                className="px-6 py-2 border border-slate-700 hover:border-purple-500 hover:text-purple-500 transition-all rounded text-sm text-slate-300 disabled:opacity-50"
              >
                Резкий пролив (Длинная тень вниз)
              </button>
            </div>
             {feedback && (
                <button onClick={() => {setChartData(generateRandomCandles(20, 30000)); setFeedback(null);}} className="mx-auto mt-6 text-xs text-slate-500 hover:text-white underline underline-offset-4">Следующая аномалия</button>
            )}
          </div>
         </div>
      ) : null}
    </div>
  );
}