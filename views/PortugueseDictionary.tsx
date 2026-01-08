
import React, { useState, useEffect } from 'react';
import { portugueseDictionaryLookup } from '../services/geminiService';
import { Book, Search, Loader2, History, Trash2, Clock, ScrollText, X, Bookmark, Languages, Info } from 'lucide-react';

interface HistoryItem { id: string; word: string; data: any; timestamp: string; }

const PortugueseDictionary: React.FC = () => {
  const [word, setWord] = useState('');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('paulo_portuguese_history_v2');
    try { return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
  });

  useEffect(() => localStorage.setItem('paulo_portuguese_history_v2', JSON.stringify(history)), [history]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault(); 
    if (!word.trim()) return; 
    setIsLoading(true);
    try {
      const result = await portugueseDictionaryLookup(word);
      setData(result);
      const newItem = { id: Date.now().toString(), word, data: result, timestamp: new Date().toLocaleString('pt-BR') };
      setHistory(prev => [newItem, ...prev.filter(h => h.word !== word).slice(0, 19)]);
    } catch { 
      alert('Erro na pesquisa léxica.'); 
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
              <Book className="text-emerald-500" /> Dicionário Vernáculo (PT-BR)
            </h2>
            <form onSubmit={handleSearch} className="flex flex-col items-center gap-6">
              <input 
                type="text" 
                value={word} 
                onChange={(e) => setWord(e.target.value)} 
                placeholder="Ex: Benevolência, Paradoxal, Exegese..." 
                className="w-full bg-slate-50 dark:bg-white/5 border border-transparent focus:border-emerald-500/20 rounded-2xl p-6 outline-none font-bold dark:text-white text-xl text-center shadow-inner transition-all" 
              />
              <button 
                type="submit" 
                disabled={isLoading || !word.trim()}
                className="bg-emerald-600 text-white font-black px-10 py-3.5 rounded-xl transition-all shadow-xl active:scale-95 disabled:opacity-50 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Search size={14} />}
                {isLoading ? 'BUSCANDO...' : 'BUSCAR'}
              </button>
            </form>
          </div>

          {data && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white dark:bg-[#0A0A0A] p-16 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12">
                   <h3 className="text-7xl font-black text-emerald-600 capitalize tracking-tighter leading-none">{word}</h3>
                   <span className="bg-slate-50 dark:bg-white/5 px-4 py-1 rounded-xl text-[10px] font-black uppercase text-slate-400 mb-2">{data.class}</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-10">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 flex items-center gap-2"><Bookmark size={14}/> Significado</h4>
                      <div className="text-2xl font-serif leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-wrap">{data.definition}</div>
                    </div>
                    
                    <div className="pt-10 border-t border-slate-50 dark:border-white/5">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 flex items-center gap-2"><Languages size={14}/> Etimologia</h4>
                      <p className="text-lg font-serif italic text-slate-500">{data.etymology}</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-slate-50 dark:bg-white/[0.02] p-8 rounded-[2rem] border border-slate-100 dark:border-white/5">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-4">Sinônimos</h4>
                      <div className="flex flex-wrap gap-2">
                        {data.synonyms?.map((s: string) => <span key={s} className="bg-white dark:bg-white/5 px-3 py-1.5 rounded-lg text-xs font-bold dark:text-slate-300 border border-slate-100 dark:border-white/5">{s}</span>)}
                      </div>
                    </div>
                    {data.notes && (
                      <div className="bg-amber-500/5 p-8 rounded-[2rem] border border-amber-500/20">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-2"><Info size={14}/> Nota de Uso</h4>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200/70">{data.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#0A0A0A] p-12 rounded-[3rem] border border-slate-100 dark:border-white/5">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">Exemplos Práticos</h4>
                <div className="space-y-6">
                  {data.examples?.map((ex: string, i: number) => (
                    <div key={i} className="flex gap-6 items-start">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-black text-xs shrink-0">{i+1}</div>
                      <p className="text-xl font-serif italic text-slate-600 dark:text-slate-400">"{ex}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-100 dark:border-white/5 p-6 h-[75vh] flex flex-col">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-50 dark:border-white/5 pb-4">Histórico</h3>
             <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                {history.map(item => (
                  <div key={item.id} onClick={() => { setWord(item.word); setData(item.data); }} className="group relative flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-emerald-50 transition-all cursor-pointer border border-transparent hover:border-emerald-100">
                    <p className="text-xs font-black dark:text-white truncate flex-1 pr-2 uppercase">{item.word}</p>
                    <button 
                      onClick={(e) => deleteHistoryItem(e, item.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="py-20 text-center opacity-20">
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

export default PortugueseDictionary;
