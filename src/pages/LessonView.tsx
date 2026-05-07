import { useState } from 'react';
import { ArrowLeft, CheckCircle, ChevronRight, Database, BarChart, FileCode2, BotMessageSquare, ImageIcon, BrainCircuit } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseModules, moduleData } from '../data/modules';
import { useUser } from '../context/UserContext';
import CandlestickChart from '../components/CandlestickChart';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { completeModule, openChatWithPrompt } = useUser();
  const [testCompleted, setTestCompleted] = useState(false);
  const [wrongAnswerIndex, setWrongAnswerIndex] = useState<number | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const moduleInfo = courseModules.find(m => m.id === id) || courseModules[0];
  const data = moduleData[id as string] || moduleData['m1']; 
  const isGold = moduleInfo.tier === 'gold';
  
  const quizzes = Array.isArray(data.quiz) ? data.quiz : (data.quiz ? [data.quiz] : []);
  const currentQuiz = quizzes[currentQuestionIdx];

  const handleTestPass = () => {
    if (currentQuestionIdx < quizzes.length - 1) {
       setCurrentQuestionIdx(prev => prev + 1);
       setWrongAnswerIndex(null);
    } else {
       setTestCompleted(true);
       completeModule(moduleInfo.id, isGold ? 1000 : 250);
       setWrongAnswerIndex(null);
    }
  };

  const handleWrongAnswer = (idx: number) => {
    setWrongAnswerIndex(idx);
    setTimeout(() => setWrongAnswerIndex(null), 800);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in slide-in-from-bottom-4 duration-700">
      <button onClick={() => navigate('/curriculum')} className="text-slate-500 hover:text-cyan-400 flex items-center gap-2 text-xs font-mono mb-8 uppercase tracking-widest transition-colors">
        <ArrowLeft className="w-4 h-4" /> Вернуться в базу данных
      </button>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className={`px-2 py-0.5 rounded text-xs font-mono uppercase tracking-widest border ${isGold ? 'bg-amber-900/20 text-amber-400 border-amber-900/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-cyan-900/20 text-cyan-500 border-cyan-900/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'}`}>
            {isGold ? 'ЭЛИТНЫЙ ДОСТУП' : 'БАЗОВЫЙ МОДУЛЬ'}
          </div>
          <div className="px-2 py-0.5 rounded text-xs font-mono uppercase tracking-widest border border-slate-800 bg-black text-slate-400">
            {moduleInfo.phaseName}
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-500 tracking-tight leading-tight mb-4">
          {moduleInfo.title}
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed font-light max-w-2xl">
          {moduleInfo.subtitle}
        </p>
      </div>

      <div className="space-y-12 text-slate-300">
        
        {/* Theory Sections */}
        {Array.isArray(data.theory) ? (
           <div className="space-y-12">
             {data.theory.map((block: any, idx: number) => (
                <section key={idx} className="bg-black/80 backdrop-blur-md border border-slate-800/50 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                  {isGold && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] pointer-events-none"></div>}
                  {!isGold && <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] pointer-events-none"></div>}
                  
                  <h2 className="text-xl font-light text-slate-100 mb-6 border-b border-slate-800 pb-4 flex items-center gap-3">
                    <Database className="w-5 h-5 text-cyan-500" /> {block.title}
                  </h2>
                  
                  <div className="prose prose-invert prose-slate max-w-none prose-headings:text-slate-100 prose-headings:font-light text-slate-300 leading-relaxed 
                    prose-strong:text-slate-200 mb-8">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {block.content}
                    </ReactMarkdown>
                  </div>

                  {block.imageUrl && (
                    <div className="w-full flex justify-center items-center bg-[#050505] border border-slate-800 rounded-lg p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={block.imageUrl} alt="Infographic" className="w-full object-cover rounded max-h-[400px] opacity-90" />
                    </div>
                  )}
                </section>
             ))}
           </div>
        ) : (
          <section className="bg-black/80 backdrop-blur-md border border-slate-800/50 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
            {isGold && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] pointer-events-none"></div>}
            {!isGold && <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] pointer-events-none"></div>}
            
            <h2 className="text-xs font-mono text-cyan-500 mb-8 border-b border-slate-800 pb-4 tracking-widest uppercase flex items-center gap-2">
              <Database className="w-4 h-4" /> ИНФОРМАТИОННАЯ МАТРИЦА
            </h2>
            
            <div className="prose prose-invert prose-slate max-w-none prose-headings:text-slate-100 prose-headings:font-light prose-h1:text-3xl prose-h2:text-2xl prose-h2:text-cyan-400 prose-h2:font-mono prose-h3:text-slate-300 prose-a:text-cyan-400 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 text-slate-300 leading-relaxed 
              prose-code:text-emerald-400 prose-code:bg-emerald-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-li:marker:text-cyan-500 prose-strong:text-slate-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.theory}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {/* Visual Example (Candlesticks or Image) */}
        {data.chartData && (
          <section className="bg-[#050505] border border-slate-800 p-6 rounded-2xl overflow-hidden shadow-2xl">
             <h2 className="text-xs font-mono text-slate-500 tracking-widest mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
               <BarChart className="w-4 h-4 text-cyan-500"/> ВИЗУАЛЬНЫЙ АНАЛИЗ
             </h2>
             
             <div className="w-full bg-black/50 border border-slate-800 rounded-lg pt-4 pb-2 px-2 mb-6 pointer-events-none">
               <CandlestickChart data={data.chartData} height={300} />
             </div>
             <p className="text-xs text-slate-500 font-mono text-center">ИСТОРИЧЕСКИЕ ДАННЫЕ / СИМУЛЯЦИЯ</p>
          </section>
        )}
        
        {data.imageUrl && !Array.isArray(data.theory) && (
          <section className="bg-[#050505] border border-slate-800 p-6 rounded-2xl overflow-hidden shadow-2xl">
             <h2 className="text-xs font-mono text-slate-500 tracking-widest mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
               <ImageIcon className="w-4 h-4 text-cyan-500"/> ИНФОГРАФИКА
             </h2>
             
             <div className="w-full flex justify-center items-center bg-black/50 border border-slate-800 rounded-lg p-6 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={data.imageUrl} alt="Infographic" className="max-h-[400px] object-contain rounded-lg opacity-90" />
             </div>
             <p className="text-xs text-slate-500 font-mono text-center">ВИЗУАЛИЗАЦИЯ КОНЦЕПТА</p>
          </section>
        )}

        {/* Practical Task */}
        {data.practicalTask && (
           <section className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 p-8 rounded-2xl relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-500"></div>
             <h2 className="text-xs font-mono text-cyan-500 tracking-widest mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
               <FileCode2 className="w-4 h-4"/> УЧЕБНАЯ ЗАДАЧА
             </h2>
             <h3 className="text-xl font-light text-slate-100 mb-4">{data.practicalTask.title}</h3>
             <div className="prose prose-invert prose-sm text-slate-400 mb-8 max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.practicalTask.description}</ReactMarkdown>
             </div>
             
             <button 
                onClick={() => openChatWithPrompt(data.practicalTask.botPrompt)}
                className="w-full md:w-auto px-8 py-4 bg-cyan-950/50 hover:bg-cyan-900 border border-cyan-800/50 text-cyan-300 text-sm font-mono tracking-wide rounded-lg flex items-center justify-center gap-3 transition-all group"
             >
               <BotMessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" /> ОТПРАВИТЬ АНАЛИЗ ИИ-КУРАТОРУ
             </button>
           </section>
        )}

        {/* Quiz / Mini-Game */}
        {quizzes.length > 0 && currentQuiz && (
          <section className="bg-black border border-slate-800 p-8 rounded-2xl text-center relative overflow-hidden shadow-2xl mt-12">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent to-cyan-900/5 pointer-events-none"></div>
            {!testCompleted ? (
              <div className="animate-in fade-in relative z-10">
                <div className="flex justify-between items-center mb-8">
                   <div className="inline-block px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs font-mono text-cyan-500 tracking-widest uppercase flex items-center gap-2">
                     <BrainCircuit className="w-4 h-4" /> ВОПРОС {currentQuestionIdx + 1} ИЗ {quizzes.length}
                   </div>
                   <div className="text-xs font-mono text-slate-500">ПРОГРЕСС: {Math.round(((currentQuestionIdx)/quizzes.length)*100)}%</div>
                </div>
                
                <h2 className="text-2xl text-slate-100 mb-4 font-light">Аналитический срез</h2>
                <p className="text-lg text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">{currentQuiz.question}</p>
                
                <div className="space-y-4 max-w-xl mx-auto text-left">
                  {currentQuiz.options.map((opt: string, idx: number) => {
                    const isWrong = wrongAnswerIndex === idx;
                    return (
                      <button 
                        key={idx}
                        onClick={() => {
                          if (idx === currentQuiz.correctIndex) {
                            handleTestPass();
                          } else {
                            handleWrongAnswer(idx);
                          }
                        }} 
                        className={`w-full p-5 border rounded-xl text-sm transition-all text-slate-300 text-left relative overflow-hidden group
                          ${isWrong 
                            ? 'border-rose-500/50 bg-rose-950/20 text-rose-300 translate-x-2' 
                            : 'border-slate-800 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-cyan-950/20 hover:text-cyan-100'
                          }
                        `}
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-800 group-hover:bg-cyan-500 transition-colors"></div>
                        <span className="ml-2 relative z-10">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="animate-in zoom-in-95 duration-500 py-8 relative z-10">
                <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full"></div>
                <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                <h2 className="text-3xl text-slate-100 mb-4 font-light tracking-tight">СИНХРОНИЗАЦИЯ УСПЕШНА</h2>
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl max-w-2xl mx-auto mb-8">
                   <p className="text-sm text-slate-300 leading-relaxed">{quizzes[quizzes.length-1]?.explanation || "Модуль завершен."}</p>
                </div>
                
                <div className="flex flex-col items-center gap-2 mb-10">
                   <div className="text-sm text-cyan-400 font-mono tracking-widest uppercase">НАЧИСЛЕНИЕ XP</div>
                   <div className="text-4xl font-light text-white">+{isGold ? 1000 : 250} <span className="text-slate-500 text-xl">XP</span></div>
                </div>
                
                <button 
                  onClick={() => navigate('/curriculum')}
                  className="px-8 py-4 bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-widest rounded-lg inline-flex items-center gap-3 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  Следующий модуль <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}
