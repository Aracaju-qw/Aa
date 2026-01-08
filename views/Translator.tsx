
import React, { useState, useEffect } from 'react';
import { translateBiblical } from '../services/geminiService';
import { TranslationResult } from '../types';
import { 
  Languages, 
  History, 
  Trash2, 
  Search,
  Hash,
  Activity,
  GitBranch,
  ArrowRight,
  Loader2
} from 'lucide-react';

interface HistoryItem { id: string; result: TranslationResult; direction: string; timestamp: string; }

const Translator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [direction, setDirection] = useState<'pt-gr' | 'gr-pt' | 'pt-he' | 'he-pt'>('pt-gr');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('paulo_translator_history_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('paulo_translator_history_v2', JSON.stringify(history)), [history]);

  const handleTranslate = async () => {
    if (!inputText) return;
    setIsLoading(true);
    setResult(null);
    try {
      const translation = await translateBiblical(inputText, direction);
      setResult(translation);
      const newItem = { id: Date.now().toString(), result: translation, direction, timestamp: new Date().toLocaleString('pt-BR') };
      setHistory(prev => [newItem, ...prev.filter(h => h.result.original !== inputText).slice(0, 19)]);
    } catch (err) { 
      console.error(err);
      alert('Erro na análise linguística. Verifique sua conexão ou tente outro termo.'); 
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-100 dark:border-white/5 p-10 shadow-sm">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter dark:text-white">
              <Languages className="text-emerald-500" /> Tradutor e Analista Koiné/Hebraico
            </h2>

            <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
              {[
                {id: 'pt-gr', l: 'Português ➔ Grego'}, {id: 'gr-pt', l: 'Grego ➔ Português'}, 
                {id: 'pt-he', l: 'Português ➔ Hebraico'}, {id: 'he-pt', l: 'Hebraico ➔ Português'}
              ].map(d => (
                <button 
                  key={d.id} 
                  onClick={() => setDirection(d.id as any)}
                  className={`px-5 py-2.5 rounded-xl text-[9px] font-black tracking-widest transition-all whitespace-nowrap ${direction === d.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-slate-100'}`}
                >
                  {d.l}
                </button>
              ))}
            </div>

            <div className="relative mb-6 flex flex-col gap-6 md:block">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Insira o termo ou versículo para análise exegética..."
                className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-3xl p-6 md:p-8 h-48 md:h-40 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-xl md:text-2xl resize-none dark:text-white"
              />
              <div className="flex justify-center md:block">
                <button 
                  onClick={handleTranslate}
                  disabled={isLoading || !inputText}
                  className="md:absolute md:bottom-6 md:right-6 bg-emerald-600 text-white font-black px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2 md:gap-3 uppercase text-[8px] md:text-xs tracking-widest disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Search size={14} />}
                  {isLoading ? 'DECODIFICANDO...' : 'ANALISAR TEXTO'}
                </button>
              </div>
            </div>
          </div>

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white dark:bg-[#0A0A0A] rounded-[3rem] border border-slate-100 dark:border-white/5 p-12 shadow-sm flex flex-col md:flex-row gap-12 items-center">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Original</p>
                  <p className="text-6xl font-serif text-slate-900 dark:text-white leading-none">{result.original}</p>
                </div>
                <div className="hidden md:block text-slate-200 dark:text-white/10"><ArrowRight size={48} /></div>
                <div className="text-center md:text-left flex-1">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Tradução / Transliteração</p>
                  <p className="text-6xl font-black text-emerald-600 tracking-tighter leading-none">{result.translated}</p>
                  <p className="text-2xl font-serif text-slate-400 mt-4 italic">[{result.transliteration}]</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#0A0A0A] p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                  <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-6"><Activity size={18}/> Morfologia</h4>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{result.morphology}</p>
                </div>
                <div className="bg-white dark:bg-[#0A0A0A] p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                  <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-sky-500 mb-6"><GitBranch size={18}/> Raiz Lexical</h4>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{result.lexicalRoot}</p>
                </div>
                <div className="bg-white dark:bg-[#0A0A0A] p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                  <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-amber-500 mb-6"><Hash size={18}/> Campo Semântico</h4>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{result.meanings}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#0A0A0A] p-12 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-10">
                <div>
                   <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">Análise Exegética</h4>
                   <p className="text-lg font-serif leading-relaxed text-slate-600 dark:text-slate-400">{result.exegesis}</p>
                </div>
                <div className="pt-10 border-t border-slate-50 dark:border-white/5">
                   <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">Interpretação Hermenêutica</h4>
                   <p className="text-lg font-serif leading-relaxed text-slate-600 dark:text-slate-400">{result.hermeneutics}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-100 dark:border-white/5 p-6 flex flex-col h-[75vh]">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-white/5 pb-4 mb-4">Histórico</h3>
             <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                {history.map(item => (
                  <div key={item.id} onClick={() => setResult(item.result)} className="group relative flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-emerald-50 transition-all cursor-pointer border border-transparent hover:border-emerald-100">
                    <div className="truncate flex-1">
                      <p className="text-xs font-black dark:text-white truncate">{item.result.original}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{item.direction}</p>
                    </div>
                    <button 
                      onClick={(e) => deleteHistoryItem(e, item.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translator;
