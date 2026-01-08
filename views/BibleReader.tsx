
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  BookOpen, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Sparkles,
  Info,
  Type,
  Zap,
  BookMarked,
  LayoutGrid,
  X,
  CheckCircle2,
  RefreshCcw,
  CloudOff,
  ShieldCheck
} from 'lucide-react';
import { getBibleChapter } from '../services/geminiService';

const BibleReader: React.FC = () => {
  const [book, setBook] = useState('Gênesis');
  const [chapter, setChapter] = useState('1');
  const [version, setVersion] = useState('Almeida Corrigida Fiel (ACF)');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState(20);
  const [isChapterListOpen, setIsChapterListOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const versions = [
    'Almeida Corrigida Fiel (ACF)',
    'Nova Versão Internacional (NVI)',
    'Nova Almeida Atualizada (NAA)',
    'Nova Tradução na Linguagem de Hoje (NTLH)'
  ];

  const bookChapters: Record<string, number> = {
    "Gênesis": 50, "Êxodo": 40, "Levítico": 27, "Números": 36, "Deuteronômio": 34, "Josué": 24, "Juízes": 21, "Rute": 4, "1 Samuel": 31, "2 Samuel": 24, "1 Reis": 22, "2 Reis": 25, "1 Crônicas": 29, "2 Crônicas": 36, "Esdras": 10, "Neemias": 13, "Ester": 10, "Jó": 42, "Salmos": 150, "Provérbios": 31, "Eclesiastes": 12, "Cânticos": 8, "Isaías": 66, "Jeremias": 52, "Lamentações": 5, "Ezequiel": 48, "Daniel": 12, "Oseias": 14, "Joel": 3, "Amós": 9, "Obadias": 1, "Jonas": 4, "Miqueias": 7, "Naum": 3, "Habacuque": 3, "Sofonias": 3, "Ageu": 2, "Zacarias": 14, "Malaquias": 4,
    "Mateus": 28, "Marcos": 16, "Lucas": 24, "João": 21, "Atos": 28, "Romanos": 16, "1 Coríntios": 16, "2 Coríntios": 13, "Gálatas": 6, "Efésios": 6, "Filipenses": 4, "Colossenses": 4, "1 Tessalonicenses": 5, "2 Tessalonicenses": 3, "1 Timóteo": 6, "2 Timóteo": 4, "Tito": 3, "Filemom": 1, "Hebreus": 13, "Tiago": 5, "1 Pedro": 5, "2 Pedro": 3, "1 João": 5, "2 João": 1, "3 João": 1, "Judas": 1, "Apocalipse": 22
  };

  const books = Object.keys(bookChapters);
  const currentMaxChapters = bookChapters[book] || 1;

  const handleFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getBibleChapter(book, chapter, version);
      setData(result);
    } catch (err) {
      console.error("Erro ao buscar capítulo:", err);
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [book, chapter, version]);

  useEffect(() => {
    handleFetch();
  }, [book, chapter, version, handleFetch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(event.target as Node)) {
        setIsChapterListOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectChapter = (num: number) => {
    setChapter(String(num));
    setIsChapterListOpen(false);
  };

  const nextChapter = () => {
    const current = parseInt(chapter);
    if (current < currentMaxChapters) setChapter(String(current + 1));
  };

  const prevChapter = () => {
    const current = parseInt(chapter);
    if (current > 1) setChapter(String(current - 1));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-1">
      {/* BANNER DE STATUS DA BÍBLIA DIGITAL */}
      <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-[2.5rem] p-8 flex items-center gap-8 shadow-sm overflow-hidden">
         <div className="w-16 h-16 bg-emerald-600/20 text-emerald-600 rounded-3xl flex items-center justify-center shrink-0 shadow-inner">
            <Sparkles size={32} />
         </div>
         <div className="flex-1">
            <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-1">Acesso Online Ativo</h3>
            <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-[0.2em]">
               Consultando Escrituras via Inteligência Artificial
            </p>
         </div>
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-6 shadow-sm flex flex-wrap items-center gap-4 lg:gap-6 sticky top-4 z-30 backdrop-blur-xl bg-white/80 dark:bg-[#0A0A0A]/80 transition-all">
        <div className="flex-1 min-w-[160px] max-w-[220px] relative">
          <select 
            value={book} 
            onChange={(e) => { setBook(e.target.value); setChapter('1'); }}
            className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl py-4 pl-4 pr-10 font-black text-emerald-600 outline-none cursor-pointer appearance-none transition-all"
          >
            {books.map(b => <option key={b} value={b} className="bg-white dark:bg-[#0A0A0A]">{b}</option>)}
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={prevChapter}
            disabled={chapter === '1' || isLoading}
            className="w-12 h-14 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="relative" ref={gridRef}>
            <button 
              onClick={() => setIsChapterListOpen(!isChapterListOpen)}
              className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 px-8 py-4 rounded-2xl font-black text-lg dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all min-w-[100px] justify-center"
            >
              {chapter}
              <ChevronDown size={18} className={`transition-transform duration-300 ${isChapterListOpen ? 'rotate-180' : ''}`} />
            </button>

            {isChapterListOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 md:w-80 bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 z-50 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-white/5 pb-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><LayoutGrid size={14}/> Capítulos</h4>
                    <button onClick={() => setIsChapterListOpen(false)} className="text-slate-400 hover:text-rose-500"><X size={16}/></button>
                </div>
                <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {Array.from({ length: currentMaxChapters }, (_, i) => i + 1).map(num => (
                      <button 
                        key={num} 
                        onClick={() => selectChapter(num)}
                        className={`h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all ${String(num) === chapter ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600'}`}
                      >
                        {num}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={nextChapter}
            disabled={chapter === String(currentMaxChapters) || isLoading}
            className="w-12 h-14 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex-1 min-w-[200px] relative">
          <select 
            value={version} 
            onChange={(e) => setVersion(e.target.value)}
            className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl py-4 pl-4 pr-10 font-bold text-slate-500 outline-none cursor-pointer appearance-none"
          >
            {versions.map(v => <option key={v} value={v} className="bg-white dark:bg-[#0A0A0A]">{v}</option>)}
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <button 
          onClick={handleFetch}
          disabled={isLoading}
          className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 active:scale-90 transition-all disabled:opacity-50"
          title="Recarregar Capítulo"
        >
           {isLoading ? <RefreshCcw size={20} className="animate-spin" /> : <Sparkles size={20} />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        <div className="lg:col-span-3">
          {data ? (
            <div className={`bg-white dark:bg-[#0A0A0A] rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-sm p-12 lg:p-24 relative overflow-hidden transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              <div className="max-w-3xl mx-auto">
                <header className="mb-16 border-b border-slate-50 dark:border-white/5 pb-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-emerald-600">
                      <Bookmark size={24} />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em]">{data.version}</span>
                    </div>
                  </div>
                  <h1 className="text-6xl font-black dark:text-white uppercase tracking-tighter leading-none">{data.book} {data.chapter}</h1>
                </header>

                <div className="space-y-5" style={{ fontSize: `${fontSize}px` }}>
                  {data.verses.map((v: any) => (
                    <div key={v.number} className="group flex gap-8">
                       <span className="text-emerald-500 font-black text-sm pt-1.5 shrink-0 w-8">{v.number}</span>
                       <p className="font-serif leading-relaxed text-slate-700 dark:text-slate-200 font-medium">{v.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="py-60 text-center">
               <Zap size={80} className="mx-auto text-emerald-500 animate-pulse mb-6" />
               <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Invocando Escrituras Digitais...</p>
            </div>
          ) : (
            <div className="py-60 text-center bg-white dark:bg-[#0A0A0A] rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-white/5">
               <BookMarked size={120} className="mx-auto mb-10 text-slate-200 dark:text-white/5" />
               <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-4">Pronto para leitura</h3>
               <p className="max-w-md mx-auto text-slate-400 font-medium px-10">Selecione o livro e capítulo acima para iniciar a leitura online via Inteligência Artificial.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6 sticky top-32">
          {data && (
             <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-emerald-600/30 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-10"><Sparkles size={160} /></div>
                <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest mb-6"><Info size={16}/> Resumo do Capítulo</h4>
                <p className="text-lg font-serif italic leading-relaxed text-white/90">{data.summary}</p>
             </div>
          )}

          <div className="bg-white dark:bg-[#0A0A0A] p-10 rounded-[3rem] border border-slate-100 dark:border-white/5">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Ajustes</h4>
             <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Fonte</span>
                  <div className="flex items-center gap-3">
                     <button onClick={() => setFontSize(Math.max(16, fontSize - 2))} className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center dark:text-white"><Type size={14}/></button>
                     <span className="text-xs font-black dark:text-white">{fontSize}</span>
                     <button onClick={() => setFontSize(Math.min(40, fontSize + 2))} className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center dark:text-white"><Type size={20}/></button>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
      `}</style>
    </div>
  );
};

export default BibleReader;
