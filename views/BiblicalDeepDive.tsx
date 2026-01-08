
import React, { useState, useEffect } from 'react';
import { getBiblicalDeepDive } from '../services/geminiService';
import { DeepDiveResult } from '../types';
import { 
  SearchCode, 
  Search, 
  Loader2, 
  History, 
  Trash2, 
  X,
  ScrollText,
  BookOpen,
  Map,
  Globe,
  Palette,
  Sparkles,
  Link as LinkIcon,
  BookMarked,
  LayoutGrid,
  History as HistIcon,
  ShieldAlert,
  Feather,
  BoxSelect,
  // Added Languages icon to fix the "Cannot find name 'Languages'" error on line 170
  Languages
} from 'lucide-react';

interface HistoryItem { id: string; result: DeepDiveResult; timestamp: string; }

const BiblicalDeepDive: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<DeepDiveResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('paulo_deepdive_history_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('paulo_deepdive_history_v1', JSON.stringify(history)), [history]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const dive = await getBiblicalDeepDive(query);
      setResult(dive);
      const newItem = { id: Date.now().toString(), result: dive, timestamp: new Date().toLocaleString('pt-BR') };
      setHistory(prev => [newItem, ...prev.filter(h => h.result.reference !== dive.reference).slice(0, 19)]);
    } catch { 
      alert('Erro na imersão exegética.'); 
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
              <SearchCode className="text-sky-600" /> Imersão Exegética e Hermenêutica
            </h2>
            <form onSubmit={handleSearch} className="flex flex-col items-center gap-6">
              <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Ex: Livro de Jonas, Efésios 2:8, Gênesis 1-3..." 
                className="w-full bg-slate-50 dark:bg-white/5 border border-transparent focus:border-emerald-500/20 rounded-2xl p-6 outline-none font-bold dark:text-white text-xl text-center shadow-inner transition-all" 
              />
              <button 
                type="submit" 
                disabled={isLoading || !query.trim()}
                className="bg-emerald-600 text-white font-black px-10 py-3.5 rounded-xl transition-all shadow-xl active:scale-95 disabled:opacity-50 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                {isLoading ? 'MERGULHANDO...' : 'INICIAR IMERSÃO'}
              </button>
            </form>
          </div>

          {result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* HEADER DO RESULTADO */}
              <div className="bg-white dark:bg-[#0A0A0A] p-12 lg:p-16 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden break-words">
                <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12 border-b border-slate-50 dark:border-white/5 pb-8">
                   <h3 className="text-4xl font-black text-sky-600 capitalize tracking-tighter leading-tight">{result.reference}</h3>
                   <span className="bg-sky-50 dark:bg-sky-900/20 px-4 py-1 rounded-xl text-[10px] font-black uppercase text-sky-600 mb-2">Análise Multidimensional</span>
                </div>
                
                {/* 1. CONTEXTO INTRODUTÓRIO */}
                <section className="mb-12">
                   <h4 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6"><Feather size={18}/> 1. Contexto Introdutório</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl">
                         <p className="text-[9px] font-black uppercase text-slate-400 mb-2">Autoria</p>
                         <p className="text-sm font-bold dark:text-white">{result.intro.author}</p>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl">
                         <p className="text-[9px] font-black uppercase text-slate-400 mb-2">Datação</p>
                         <p className="text-sm font-bold dark:text-white">{result.intro.dating}</p>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl">
                         <p className="text-[9px] font-black uppercase text-slate-400 mb-2">Destinatários</p>
                         <p className="text-sm font-bold dark:text-white">{result.intro.recipients}</p>
                      </div>
                   </div>
                </section>

                {/* 2. CONTEXTO HISTÓRICO E GEOGRÁFICO */}
                <section className="mb-12 pt-12 border-t border-slate-50 dark:border-white/5">
                   <h4 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6"><Map size={18}/> 2. Contexto Histórico e Geográfico</h4>
                   <div className="space-y-6">
                      <div className="flex gap-6">
                         <div className="w-1.5 h-full bg-orange-400 rounded-full shrink-0"></div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-orange-400 mb-1">Cenário Político</p>
                            <p className="text-lg font-serif italic text-slate-700 dark:text-slate-300 leading-relaxed">{result.histGeo.politics}</p>
                         </div>
                      </div>
                      <div className="flex gap-6">
                         <div className="w-1.5 h-full bg-emerald-500 rounded-full shrink-0"></div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-emerald-500 mb-1">Geografia e Meio Ambiente</p>
                            <p className="text-lg font-serif italic text-slate-700 dark:text-slate-300 leading-relaxed">{result.histGeo.geography}</p>
                         </div>
                      </div>
                   </div>
                </section>

                {/* 3. CONTEXTO CULTURAL E ARQUEOLÓGICO */}
                <section className="mb-12 pt-12 border-t border-slate-50 dark:border-white/5">
                   <h4 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6"><HistIcon size={18}/> 3. Contexto Cultural e Arqueológico</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[2.5rem] border border-amber-200 dark:border-amber-900/30">
                         <p className="text-[10px] font-black uppercase text-amber-600 mb-4">Usos e Costumes</p>
                         <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{result.cultArch.customs}</p>
                      </div>
                      <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-200 dark:border-indigo-900/30">
                         <p className="text-[10px] font-black uppercase text-indigo-600 mb-4">Descobertas Arqueológicas</p>
                         <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{result.cultArch.archaeology}</p>
                      </div>
                   </div>
                </section>

                {/* 4. ANÁLISE LITERÁRIA */}
                <section className="mb-12 pt-12 border-t border-slate-50 dark:border-white/5">
                   <h4 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6"><BoxSelect size={18}/> 4. Análise Literária</h4>
                   <div className="space-y-8">
                      <div>
                         <span className="px-3 py-1 bg-sky-600 text-white text-[9px] font-black uppercase rounded-lg mb-3 inline-block">Gênero Literário: {result.literary.genre}</span>
                         <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/10">
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Estrutura Interna</p>
                            <p className="text-lg font-serif italic text-slate-700 dark:text-slate-200 leading-relaxed">{result.literary.structure}</p>
                         </div>
                      </div>
                   </div>
                </section>

                {/* 5. ANÁLISE LINGUÍSTICA E TEOLÓGICA */}
                <section className="pt-12 border-t border-slate-50 dark:border-white/5">
                   <h4 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8"><Languages size={18}/> 5. Análise Linguística e Teológica</h4>
                   
                   <div className="space-y-10">
                      <div>
                         <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Palavras-Chave (Original)</p>
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {result.lingTheo.keywords.map((kw, i) => (
                               <div key={i} className="p-5 bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm flex flex-col">
                                  <div className="flex justify-between items-center mb-1">
                                     <span className="text-xl font-serif font-black dark:text-white">{kw.term}</span>
                                     <span className="text-[8px] font-black bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-slate-500 uppercase">{kw.lang}</span>
                                  </div>
                                  <span className="text-xs text-emerald-600 font-bold">{kw.meaning}</span>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                         <div className="p-8 bg-sky-600 text-white rounded-[2.5rem] shadow-xl shadow-sky-600/20">
                            <p className="text-[10px] font-black uppercase text-sky-200 mb-4 tracking-widest">Temas Centrais</p>
                            <p className="text-base font-bold leading-relaxed">{result.lingTheo.themes}</p>
                         </div>
                         <div className="p-8 bg-white dark:bg-[#121212] border-2 border-slate-100 dark:border-white/5 rounded-[2.5rem]">
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Relação com o Cânon</p>
                            <p className="text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">{result.lingTheo.canon}</p>
                         </div>
                      </div>
                   </div>
                </section>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="py-40 text-center animate-pulse">
               <Loader2 size={80} className="mx-auto text-sky-600 animate-spin mb-6" />
               <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Escavando Dados Exegéticos...</p>
            </div>
          )}
        </div>

        {/* HISTÓRICO LATERAL */}
        <div className="lg:col-span-1">
           <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-100 dark:border-white/5 p-6 h-[75vh] flex flex-col shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-50 dark:border-white/5 pb-4">Imersões Realizadas</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
                 {history.length > 0 ? history.map(item => (
                   <div key={item.id} onClick={() => setResult(item.result)} className="group relative flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-sky-50 transition-all cursor-pointer border border-transparent hover:border-sky-100">
                     <p className="text-xs font-black dark:text-white truncate flex-1 pr-2 uppercase">{item.result.reference}</p>
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

export default BiblicalDeepDive;
