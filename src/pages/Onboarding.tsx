import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Terminal } from 'lucide-react';

export default function Onboarding() {
  const { login } = useUser();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 1) {
      login(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800 p-8 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-slate-700 leading-none">
          SECURE CONNECTION<br/>INITIALIZATION
        </div>
        
        <div className="mb-8 flex flex-col items-center text-center mt-4">
          <div className="w-16 h-16 bg-black border border-slate-800 rounded-full flex items-center justify-center mb-4">
            <Terminal className="w-8 h-8 text-cyan-500" />
          </div>
          <div className="text-xs tracking-[0.3em] text-cyan-500 font-bold mb-1">PROJECT X</div>
          <h1 className="text-2xl font-light text-white tracking-tight">Добро пожаловать в Академию</h1>
          <p className="text-sm text-slate-400 mt-2">Введите ваш позывной для доступа к терминалу.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">ПОЗЫВНОЙ (NICKNAME)</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-slate-800 rounded p-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="Например: WhaleHunter"
              autoFocus
            />
          </div>
          
          <button 
            type="submit"
            disabled={name.trim().length < 2}
            className="w-full py-3 bg-slate-200 text-black font-bold text-xs rounded hover:bg-white transition-all tracking-widest disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          >
            Инициировать вход
          </button>
        </form>
      </div>
    </div>
  );
}
