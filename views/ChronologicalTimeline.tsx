
import React, { useState, useEffect } from 'react';
import { getBiblicalTimeline } from '../services/geminiService';
import { TimelineEvent } from '../types';
import { Signpost as TimelineIcon, Search, Loader2, History, Trash2, X, ScrollText, Globe } from 'lucide-react';

interface HistoryItem { id: string; reference: string; events: TimelineEvent[]; timestamp: string; }

const ChronologicalTimeline: React.FC = () => {
  const [reference, setReference] = useState('');
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('paulo_timeline_history_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('paulo_timeline_history_v2', JSON.stringify(history)), [history]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault(); 
    if (!reference) return; 
    setIsLoading(true);
    try {
      const result = await getBiblicalTimeline(reference);
      setEvents(result);
      const newItem = { id: Date.now().toString(), reference, events: result, timestamp: new Date().toLocaleString('pt-BR') };
      setHistory(prev => [newItem, ...prev.filter(h => h.reference !== reference).slice(0, 19)]);
    } catch { 
      alert('Erro ao mapear cronologia.'); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-10 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-3 mb-8 uppercase tracking-tighter dark:text-white">
              <TimelineIcon className="text-emerald-500" /> Cronologia Bíblica & Mundial
            </h2>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={24} />
                <input 
                  type="text" 
                  value={reference} 
                  onChange={(e) => setReference(e.target.value)} 
                  placeholder="Personagem, Povo ou Período (ex: Exílio Babilônico, Davi)..." 
                  className="w-full bg-slate-50 dark:bg-white/5 border border-transparent focus:border-emerald-500/20 rounded-3xl p-6 pl-16 outline-none font-bold text-xl dark:text-white transition-all shadow-inner" 
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-emerald-600 text-white font-black px-6 py-3 md:px-12 md:py-0 rounded-xl md:rounded-3xl transition-all shadow-xl active:scale-95 disabled:opacity-50 self-center md:self-stretch w-fit md:w-auto text-[10px] md:text-xs"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'MAPEAR'}
              </button>
            </form>
          </div>
          
          {events.length > 0 && (
            <div className="p-16 bg-white dark:bg-[#0A0A0A] rounded-[4rem] border border-slate-100 dark:border-white/5 space-y-24 animate-in fade-in relative">
              <div className="absolute left-16 top-24 bottom-24 w-1 bg-emerald-500/10"></div>
              {events.map((ev, i) => (
                <div key={i} className="pl-16 relative group">
                  <div className="absolute left-[-4px] top-2 w-3 h-3 rounded-full bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-white dark:border-[#0A0A0A] z-10" />
                  
                  <div className="flex flex-col lg:flex-row gap-12">
                     <div className="flex-1 space-y-4">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">{ev.period}</p>
                        <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{ev.event}</h4>
                        <p className="text-xl font-serif leading-relaxed text-slate-600 dark:text-slate-400">{ev.description}</p>
                        <div className="pt-4 flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                           <span className="bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-xl">{ev.reference}</span>
                        </div>
                     </div>

                     <div className="lg:w-1/3 bg-blue-500/5 dark:bg-blue-500/10 p-8 rounded-[2.5rem] border border-blue-500/10 self-start">
                        <h5 className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-blue-500 mb-4"><Globe size={14}/> Contexto Mundial</h5>
                        <p className="text-sm font-bold text-blue-900/70 dark:text-blue-200/50 leading-relaxed italic">{ev.globalHistory}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="py-40 text-center animate-pulse">
               <Loader2 size={80} className="mx-auto text-emerald-500 animate-spin mb-6" />
               <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Mapeando Linha do Tempo...</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
           <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-100 dark:border-white/5 p-6 h-[75vh] flex flex-col shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-50 dark:border-white/5 pb-4">Buscas Anteriores</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                 {history.map(item => (
                   <div key={item.id} onClick={() => { setReference(item.reference); setEvents(item.events); }} className="group relative flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-emerald-50 transition-all cursor-pointer border border-transparent hover:border-emerald-100">
                     <p className="text-xs font-black dark:text-white truncate flex-1 pr-2 uppercase">{item.reference}</p>
                     <button 
                        onClick={(e) => deleteHistoryItem(e, item.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                   </div>
                 ))}
                 {history.length === 0 && (
                   <div className="text-center py-20 opacity-20">
                     <ScrollText size={40} className="mx-auto mb-4" />
                     <p className="text-[9px] font-black uppercase">Vazio</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChronologicalTimeline;
