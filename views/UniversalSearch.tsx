
import React, { useState, useEffect } from 'react';
import { universalSearch } from '../services/geminiService';
import { 
  Globe, 
  Search, 
  Loader2, 
  History, 
  Trash2, 
  ExternalLink, 
  X, 
  Sparkles, 
  Link as LinkIcon,
  MessageSquare
} from 'lucide-react';

interface SearchHistoryItem {
  id: string;
  query: string;
  result: { text: string; sources: any[] };
  timestamp: string;
}

const UniversalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    const saved = localStorage.getItem('paulo_universal_search_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('paulo_universal_search_v2', JSON.stringify(history));
  }, [history]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const response = await universalSearch(query);
      setResult(response);
      const newItem = {
        id: Date.now().toString(),
        query,
        result: response,
        timestamp: new Date().toLocaleString('pt-BR'),
      };
      setHistory(prev => [newItem, ...prev.filter(h => h.query !== query).slice(0, 14)]);
    } catch (err) {
      alert('Houve um erro na busca. Tente novamente.');
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
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LADO ESQUERDO: BUSCA E RESULTADO */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-10 shadow-sm transition-all">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20">
                <Globe size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-none">Oráculo IA</h2>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mt-2">Powered by Gemini & Google Search</p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={24} />
                <input 
                  type="text" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="Pesquise sobre teologia, história, eventos ou fatos atuais..." 
                  className="w-full bg-slate-50 dark:bg-white/5 border border-transparent focus:border-emerald-500/20 rounded-3xl p-6 pl-16 outline-none font-bold text-xl dark:text-white transition-all shadow-inner" 
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 md:px-12 py-4 md:py-0 rounded-[1.5rem] transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 self-center md:self-stretch w-fit md:w-auto text-[10px] md:text-xs"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {isLoading ? 'PESQUISANDO...' : 'CONSULTAR'}
              </button>
            </form>
          </div>

          {result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="bg-white dark:bg-[#0A0A0A] p-16 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-4 mb-12 text-emerald-600">
                  <MessageSquare size={24} />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em]">Resposta da Inteligência</h3>
                </div>
                
                <div className="prose prose-2xl dark:prose-invert max-w-none">
                  <div className="text-xl lg:text-2xl font-serif leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                    {result.text}
                  </div>
                </div>

                {result.sources && result.sources.length > 0 && (
                  <div className="mt-20 pt-10 border-t border-slate-50 dark:border-white/5">
                    <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                      <LinkIcon size={16} /> Fontes de Grounding
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.sources.map((chunk: any, i: number) => {
                        const web = chunk.web;
                        if (!web) return null;
                        return (
                          <a 
                            key={i} 
                            href={web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/10 border border-transparent hover:border-emerald-100 transition-all group"
                          >
                            <span className="text-xs font-black text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 truncate mr-4">
                              {web.title || web.uri}
                            </span>
                            <ExternalLink size={14} className="text-slate-300 group-hover:text-emerald-500 shrink-0" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="py-40 text-center animate-pulse">
               <Loader2 size={80} className="mx-auto text-emerald-500 animate-spin mb-6" />
               <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Consultando Fontes Globais...</p>
            </div>
          )}
        </div>

        {/* LADO DIREITO: HISTÓRICO */}
        <div className="lg:col-span-1">
           <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-8 h-[85vh] flex flex-col shadow-sm sticky top-14">
              <div className="flex items-center justify-between mb-8 border-b border-slate-50 dark:border-white/5 pb-6">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                   <History size={16} /> Pesquisas Recentes
                 </h3>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                 {history.length > 0 ? history.map(item => (
                   <div 
                      key={item.id} 
                      onClick={() => { setQuery(item.query); setResult(item.result); }} 
                      className="group relative p-5 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all cursor-pointer border border-transparent hover:border-emerald-100"
                   >
                     <p className="text-xs font-black dark:text-white truncate mb-1 pr-6">{item.query}</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.timestamp}</p>
                     <button 
                        onClick={(e) => deleteHistoryItem(e, item.id)}
                        className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                   </div>
                 )) : (
                   <div className="text-center py-32 opacity-20">
                     <Search size={48} className="mx-auto mb-4" />
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

export default UniversalSearch;
