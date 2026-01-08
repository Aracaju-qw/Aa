
import React, { useState, useEffect } from 'react';
import { getBiblicalCommentary } from '../services/geminiService';
import { CommentaryResult } from '../types';
import { 
  MessageSquare, 
  Search, 
  Loader2, 
  History, 
  Trash2, 
  X,
  ScrollText,
  BookOpen,
  Map,
  Link,
  ListOrdered,
  Sparkles
} from 'lucide-react';

interface HistoryItem { id: string; result: CommentaryResult; timestamp: string; }

const BiblicalCommentary: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<CommentaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('paulo_commentary_history_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('paulo_commentary_history_v2', JSON.stringify(history)), [history]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const commentary = await getBiblicalCommentary(query);
      setResult(commentary);
      const newItem = { id: Date.now().toString(), result: commentary, timestamp: new Date().toLocaleString('pt-BR') };
      setHistory(prev => [newItem, ...prev.filter(h => h.result.passage !== query).slice(0, 19)]);
    } catch { 
      alert('Erro na análise acadêmica.'); 
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
            <h2 className="text-xl font-black flex items-center gap-3 mb-10 uppercase tracking-tighter dark:text-white">
              <MessageSquare className="text-emerald-500" /> Comentário Exegético Profundo
            </h2>
            <form onSubmit={handleSearch} className="flex flex-col items-center gap-6">
              <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Referência Bíblica ou Assunto (ex: João 3:16, Redenção)..." 
                className="w-full bg-slate-50 dark:bg-white/5 border border-transparent focus:border-emerald-500/20 rounded-2xl p-6 outline-none font-bold dark:text-white text-xl text-center shadow-inner transition-all" 
              />
              <button 
                type="submit" 
                disabled={isLoading || !query.trim()}
                className="bg-emerald-600 text-white font-black px-10 py-3.5 rounded-xl transition-all shadow-xl active:scale-95 disabled:opacity-50 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                {isLoading ? 'ANALISANDO...' : 'BUSCAR COMENTÁRIO'}
              </button>
            </form>
          </div>

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-white dark:bg-[#0A0A0A] p-12 lg:p-16 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden break-words">
                <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12 border-b border-slate-50 dark:border-white/5 pb-8">
                   <h3 className="text-2xl font-black text-emerald-600 capitalize tracking-tighter leading-tight break-words">{result.passage}</h3>
                   <span className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-1 rounded-xl text-[10px] font-black uppercase text-emerald-600 mb-2 whitespace-nowrap">Análise Profética</span>
                </div>
                
                <div className="flex flex-col gap-12">
                  <div className="space-y-10">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 flex items-center gap-2"><BookOpen size={14}/> Análise Exegética</h4>
                      <div className="text-xl font-serif leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-wrap">{result.analysis}</div>
                    </div>
                    
                    <div className="pt-10 border-t border-slate-50 dark:border-white/5">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 flex items-center gap-2"><Map size={14}/> Contexto Histórico e Geográfico</h4>
                      <p className="text-xl font-serif leading-relaxed text-slate-600 dark:text-slate-400">{result.historicalContext}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-50 dark:border-white/5">
                    <div className="bg-indigo-500/5 p-8 rounded-[2rem] border border-indigo-500/20 overflow-hidden break-words">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-4 flex items-center gap-2"><Link size={16}/> Intertextualidade</h4>
                      <p className="text-sm font-serif leading-relaxed text-indigo-900 dark:text-indigo-200/70">{result.intertextuality}</p>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl overflow-hidden break-words">
                       <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-6"><ListOrdered size={14}/> Esboço Sugerido</h4>
                       <div className="space-y-4">
                          {result.suggestedOutline.map((point, i) => (
                            <div key={i} className="flex gap-4 items-start group">
                              <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-all shrink-0 text-[10px]">{i+1}</div>
                              <p className="text-xs font-bold tracking-tight leading-snug">{point}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="py-40 text-center animate-pulse">
               <Loader2 size={80} className="mx-auto text-emerald-500 animate-spin mb-6" />
               <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Processando Análise Bíblica...</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
           <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-100 dark:border-white/5 p-6 h-[75vh] flex flex-col shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-50 dark:border-white/5 pb-4">Histórico</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
                 {history.length > 0 ? history.map(item => (
                   <div key={item.id} onClick={() => setResult(item.result)} className="group relative flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-emerald-50 transition-all cursor-pointer border border-transparent hover:border-emerald-100">
                     <p className="text-xs font-black dark:text-white truncate flex-1 pr-2 uppercase">{item.result.passage}</p>
                     <button 
                        onClick={(e) => deleteHistoryItem(e, item.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
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

export default BiblicalCommentary;
