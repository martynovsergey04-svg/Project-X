import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, X, MessageSquare, Loader2, Paperclip } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useUser } from '../context/UserContext';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string; // base64 string
  mimeType?: string;
}

export default function MiserAIChat() {
  const { chatOpen, setChatOpen, initialChatPrompt, openChatWithPrompt } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Привет! Я MiserAI, твой персональный ассистент по курсу. Я могу объяснить сложные термины научным, но понятным языком, а также проверить твои домашние задания.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{data: string, mimeType: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatOpen, selectedImage]);

  // Handle Ctrl+V paste globally when chat is open
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (chatOpen) {
        const items = e.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              const file = items[i].getAsFile();
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setSelectedImage({
                    data: (reader.result as string).split(',')[1],
                    mimeType: file.type
                  });
                };
                reader.readAsDataURL(file);
              }
            }
          }
        }
      }
    };
    
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [chatOpen]);

  useEffect(() => {
    if (initialChatPrompt) {
      setInput(initialChatPrompt);
    }
  }, [initialChatPrompt]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage({
        data: (reader.result as string).split(',')[1],
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userText = input.trim();
    const currentImage = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { 
      role: 'user', 
      text: userText, 
      image: currentImage ? `data:${currentImage.mimeType};base64,${currentImage.data}` : undefined 
    }]);
    setIsLoading(true);

    try {
      const contents = messages.map(m => {
        const parts: any[] = [];
        if (m.text) parts.push({ text: m.text });
        if (m.image) {
          parts.push({
            inlineData: {
              data: m.image.split(',')[1],
              mimeType: m.image.split(';')[0].split(':')[1]
            }
          });
        }
        return { role: m.role, parts };
      });

      // Add current message
      const currentParts: any[] = [];
      if (userText) currentParts.push({ text: userText });
      if (currentImage) {
        currentParts.push({
          inlineData: {
            data: currentImage.data,
            mimeType: currentImage.mimeType
          }
        });
      }
      contents.push({ role: 'user', parts: currentParts });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: 'Ты MiserAI, строгий и профессиональный куратор. ОТВЕЧАЙ КРАТКО, не более 2-3 абзацев. БЕЗ ВОДЫ. Если студент скидывает скриншот (график), ВНИМАТЕЛЬНО ИЗУЧИ ЕГО. Если студент не прав или ошибся, скажи ПРЯМО "Ты не прав" и объясни ошибку. Если прав - похвали, но укажи, на что еще обратить внимание. Пиши уверенно, используй термины, но объясняй суть. Отвечай на русском языке.',
        }
      });

      const modelReply = response.text || 'Извини, связь с биржей прервалась...';
      setMessages(prev => [...prev, { role: 'model', text: modelReply }]);
    } catch (error) {
      console.error('MiserAI error:', error);
      let errorText = 'Ошибка сети. Терминал не смог обработать запрос.';
      if (error instanceof Error && error.message.includes('API key not valid')) {
          errorText = 'Ошибка: Неверный или отсутствующий API-ключ Gemini. Пожалуйста, укажите валидный ключ.';
      }
      setMessages(prev => [...prev, { role: 'model', text: errorText }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all z-50 flex items-center justify-center animate-bounce"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-slate-900 border-l border-slate-800 flex flex-col z-50 transition-transform duration-300 transform ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-black">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-cyan-500/30 bg-cyan-900/20 rounded">
              <Bot className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200">MiserAI</div>
              <div className="text-[10px] text-cyan-500 font-mono tracking-widest">КУРАТОР КУРСА</div>
            </div>
          </div>
          <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-white p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans bg-[#050505]">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className="flex-shrink-0 mt-1">
                {m.role === 'model' ? (
                  <Bot className="w-6 h-6 text-cyan-500" />
                ) : (
                  <User className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className={`p-3 rounded-lg text-sm leading-relaxed ${m.role === 'user' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-slate-900/80 border border-slate-800 text-slate-300 rounded-tl-none'}`}>
                {m.image && (
                  <img src={m.image} alt="User attachment" className="max-w-full rounded-md mb-2 object-cover max-h-[200px]" />
                )}
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="flex-shrink-0 mt-1">
                <Bot className="w-6 h-6 text-cyan-500" />
              </div>
              <div className="p-3 border border-slate-800 bg-slate-900/80 rounded-lg text-sm rounded-tl-none text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-500" /> 
                Анализирую данные...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-slate-800 bg-black flex flex-col gap-2">
           {selectedImage && (
              <div className="relative inline-block w-16 h-16 rounded overflow-hidden border border-slate-700">
                <img src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} alt="preview" className="w-full h-full object-cover" />
                <button onClick={() => setSelectedImage(null)} className="absolute top-0 right-0 bg-black/50 text-white p-0.5 rounded-bl">
                   <X className="w-3 h-3" />
                </button>
              </div>
           )}
          <div className="relative flex items-center gap-2">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-500 hover:text-cyan-400 transition-colors"
                title="Прикрепить скриншот графика (TradingView, Bybit)"
            >
                <Paperclip className="w-5 h-5" />
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
            />
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              onPaste={(e) => {
                const items = e.clipboardData?.items;
                if (items) {
                  for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                      e.preventDefault();
                      const file = items[i].getAsFile();
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setSelectedImage({
                            data: (reader.result as string).split(',')[1],
                            mimeType: file.type
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                      break;
                    }
                  }
                }
              }}
              placeholder="Спроси о рынке или скинь ДЗ..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className="p-2 text-cyan-500 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-800 rounded-lg"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
