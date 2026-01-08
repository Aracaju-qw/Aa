
import React, { useState, useEffect } from 'react';
import { theologicalLookup } from '../services/geminiService';
import { TheologicalDefinition } from '../types';
import { BookMarked, Search, Loader2, History, Trash2, X, ScrollText, BookOpen, Quote, ShieldAlert } from 'lucide-react';

interface HistoryItem { id: string; data: TheologicalDefinition; timestamp: string; }

const Dictionary: React.FC = () => {
  const [term, setTerm] = useState('');
  const [data, setData] = useState<TheologicalDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('paulo_theological_history_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('paulo_theological_history_v2', JSON.stringify(history)), [history]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault(); 
    if (!term.trim()) return; 
    setIsLoading(true);
    try {
      const result = await theologicalLookup(term);
      setData(result);
      const newItem = { id: Date.now().toString(), data: result, timestamp: new Date().toLocaleString('pt-BR') };
      setHistory(prev => [newItem, ...prev.filter(h => h.data.term !== term).slice(0, 19)]);
    } catch { 
      alert('Erro na busca acadêmica.'); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-10 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-3 mb-10 uppercase tracking-tighter dark:text-white">
              <BookMarked className="text-emerald-500" /> Dicionário Teológico Acadêmico
            </h2>
            <form onSubmit={handleSearch} className="flex flex-col items-center gap-6">
              <input 
                type="text" 
                value={term} 
                onChange={(e) => setTerm(e.target.value)} 
                placeholder="Ex: Hipóstase, Soteriologia, Escatologia..." 
                className="w-full bg-slate-50 dark:bg-white/5 border border-transparent focus:border-emerald-500/20 rounded-2xl p-6 outline-none font-bold dark:text-white text-xl text-center shadow-inner transition-all" 
              />
              <button 
                type="submit" 
                disabled={isLoading || !term.trim()}
                className="bg-emerald-600 text-white font-black px-10 py-3.5 rounded-xl transition-all shadow-xl active:scale-95 disabled:opacity-50 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Search size={14} />}
                {isLoading ? 'DECODIFICANDO...' : 'PESQUISAR'}
              </button>
            </form>
          </div>
          
          {data && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white dark:bg-[#0A0A0A] p-12 lg:p-16 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden break-words">
                <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12 border-b border-slate-50 dark:border-white/5 pb-8">
                   <h3 className="text-7xl font-black text-emerald-600 capitalize tracking-tighter leading-none">{data.term}</h3>
                   <span className="bg-slate-50 dark:bg-white/5 px-4 py-1 rounded-xl text-[10px] font-black uppercase text-slate-400 mb-2">{data.etymology}</span>
                </div>
                
                <div className="flex flex-col gap-12">
                  <div className="space-y-10">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 flex items-center gap-2"><BookOpen size={14}/> Significado / Definição</h4>
                      <div className="text-2xl font-serif leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-wrap">{data.definition}</div>
                    </div>
                    
                    <div className="pt-10 border-t border-slate-50 dark:border-white/5">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 flex items-center gap-2"><History size={14}/> Desenvolvimento Histórico</h4>
                      <p className="text-2xl font-serif leading-relaxed text-slate-600 dark:text-slate-400">{data.historicalDevelopment}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-50 dark:border-white/5">
                    <div className="bg-rose-500/5 p-8 rounded-[2rem] border border-rose-500/20">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-4 flex items-center gap-2"><ShieldAlert size={14}/> Debates e Divergências</h4>
                      <p className="text-2xl font-serif leading-relaxed text-rose-800 dark:text-rose-200/70">{data.opposingViews}</p>
                    </div>
                    
                    <div className="bg-emerald-600/5 p-8 rounded-[2rem] border border-emerald-500/20">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2"><Quote size={14}/> Base Bíblica</h4>
                      <p className="text-xl font-serif italic text-emerald-900 dark:text-emerald-100">{data.biblicalFoundation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="py-40 text-center animate-pulse">
               <Loader2 size={80} className="mx-auto text-emerald-500 animate-spin mb-6" />
               <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Consultando Academia Teológica...</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-100 dark:border-white/5 p-6 h-[75vh] flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-slate-50 dark:border-white/5 pb-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <History size={14} /> Recentes
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
              {history.length > 0 ? history.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => setData(item.data)} 
                  className="group relative flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-emerald-50 transition-all cursor-pointer border border-transparent hover:border-emerald-100"
                >
                  <p className="text-xs font-black text-slate-700 dark:text-slate-200 truncate pr-4 uppercase">{item.data.term}</p>
                  <button onClick={(e) => deleteHistoryItem(e, item.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"><X size={14}/></button>
                </div>
              )) : (
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

export default Dictionary;
