
import React, { useState, useEffect } from 'react';
import { getBiblicalBiography, getSpecificVerseText } from '../services/geminiService';
import { BiographyResult } from '../types';
import { 
  UserCheck, 
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
  ChevronRight,
  BookMarked
} from 'lucide-react';

interface HistoryItem { id: string; result: BiographyResult; timestamp: string; }

const BiblicalBiography: React.FC = () => {
  const [character, setCharacter] = useState('');
  const [result, setResult] = useState<BiographyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para visualização de versículo
  const [viewingVerse, setViewingVerse] = useState<{ book: string; ref: string; text: string } | null>(null);
  const [isVerseLoading, setIsVerseLoading] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('paulo_biography_history_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('paulo_biography_history_v1', JSON.stringify(history)), [history]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!character.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const bio = await getBiblicalBiography(character);
      setResult(bio);
      const newItem = { id: Date.now().toString(), result: bio, timestamp: new Date().toLocaleString('pt-BR') };
      setHistory(prev => [newItem, ...prev.filter(h => h.result.name !== bio.name).slice(0, 19)]);
    } catch { 
      alert('Erro na pesquisa biográfica.'); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleFetchVerse = async (book: string, reference: string) => {
    const cardId = `${book}-${reference}`;
    setIsVerseLoading(cardId);
    try {
      const verseData = await getSpecificVerseText(book, reference);
      setViewingVerse({ book, ref: reference, text: verseData.text });
    } catch (err) {
      alert('Erro ao buscar texto bíblico.');
    } finally {
      setIsVerseLoading(null);
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
              <UserCheck className="text-rose-500" /> Perfil Biográfico de Personagens Bíblicos
            </h2>
            <form onSubmit={handleSearch} className="flex flex-col items-center gap-6">
              <input 
                type="text" 
                value={character} 
                onChange={(e) => setCharacter(e.target.value)} 
                placeholder="Ex: José do Egito, Abigail, Paulo de Tarso..." 
                className="w-full bg-slate-50 dark:bg-white/5 border border-transparent focus:border-emerald-500/20 rounded-2xl p-6 outline-none font-bold dark:text-white text-xl text-center shadow-inner transition-all" 
              />
              <button 
                type="submit" 
                disabled={isLoading || !character.trim()}
                className="bg-emerald-600 text-white font-black px-10 py-3.5 rounded-xl transition-all shadow-xl active:scale-95 disabled:opacity-50 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                {isLoading ? 'PESQUISANDO...' : 'BUSCAR PERFIL'}
              </button>
            </form>
          </div>

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-white dark:bg-[#0A0A0A] p-12 lg:p-16 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden break-words">
                <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12 border-b border-slate-50 dark:border-white/5 pb-8">
                   <h3 className="text-5xl font-black text-rose-500 capitalize tracking-tighter leading-tight">{result.name}</h3>
                   <span className="bg-rose-50 dark:bg-rose-900/20 px-4 py-1 rounded-xl text-[10px] font-black uppercase text-rose-600 mb-2">Análise Histórica</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] space-y-4">
                    <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2"><Map size={18}/> Contexto Histórico</h4>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">{result.historicalContext}</p>
                  </div>
                  <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] space-y-4">
                    <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2"><Palette size={18}/> Contexto Cultural</h4>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">{result.culturalContext}</p>
                  </div>
                  <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] space-y-4">
                    <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2"><Globe size={18}/> Contexto Mundial</h4>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">{result.worldContext}</p>
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-50 dark:border-white/5">
                   <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 flex items-center gap-3"><LinkIcon size={18}/> Principais Passagens Bíblicas</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {result.references.map((ref, i) => {
                        const cardId = `${ref.book}-${ref.reference}`;
                        const isThisLoading = isVerseLoading === cardId;

                        return (
                          <button 
                            key={i} 
                            onClick={() => handleFetchVerse(ref.book, ref.reference)}
                            disabled={isThisLoading}
                            className={`flex flex-col text-left p-5 bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm group hover:border-rose-500/30 transition-all active:scale-95 ${isThisLoading ? 'opacity-50 cursor-wait' : ''}`}
                          >
                             <div className="flex justify-between items-start w-full">
                               <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">{ref.book}</span>
                               {isThisLoading ? (
                                 <Loader2 size={12} className="animate-spin text-rose-500" />
                               ) : (
                                 <ChevronRight size={12} className="text-slate-300 group-hover:text-rose-500 transition-colors" />
                               )}
                             </div>
                             <span className="text-lg font-black dark:text-white">{ref.reference}</span>
                             <span className="text-[8px] font-black uppercase text-slate-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Ver Texto Bíblico</span>
                          </button>
                        );
                      })}
                   </div>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="py-40 text-center animate-pulse">
               <Loader2 size={80} className="mx-auto text-rose-500 animate-spin mb-6" />
               <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Escavando Dados Históricos...</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
           <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-100 dark:border-white/5 p-6 h-[75vh] flex flex-col shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-50 dark:border-white/5 pb-4">Histórico de Pesquisa</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
                 {history.length > 0 ? history.map(item => (
                   <div key={item.id} onClick={() => setResult(item.result)} className="group relative flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-rose-50 transition-all cursor-pointer border border-transparent hover:border-rose-100">
                     <p className="text-xs font-black dark:text-white truncate flex-1 pr-2 uppercase">{item.result.name}</p>
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

      {/* MODAL DE VISUALIZAÇÃO DE VERSÍCULO */}
      {viewingVerse && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0A0A0A] w-full max-w-2xl rounded-[3rem] p-10 border border-white/10 shadow-2xl relative">
            <button 
              onClick={() => setViewingVerse(null)}
              className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                <BookMarked size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-none">{viewingVerse.book}</h3>
                <p className="text-xs font-black text-rose-500 uppercase tracking-widest mt-1">Referência: {viewingVerse.ref}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-8 max-h-[50vh] overflow-y-auto no-scrollbar border border-slate-100 dark:border-white/10">
              <p className="text-xl font-serif italic leading-relaxed text-slate-800 dark:text-slate-200">
                {viewingVerse.text}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 dark:border-white/5 flex justify-end">
              <button 
                onClick={() => setViewingVerse(null)}
                className="px-8 py-3 bg-slate-900 dark:bg-white/10 text-white dark:text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all"
              >
                FECHAR LEITURA
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default BiblicalBiography;
