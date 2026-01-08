
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Theme as SermonTheme, Sermon } from '../types';
import { generateSpeech } from '../services/geminiService';
import { 
  Search, 
  Calendar, 
  ChevronRight, 
  Trash2, 
  Maximize, 
  Sun, 
  Moon,
  ChevronLeft,
  X,
  Volume2,
  Loader2,
  Square
} from 'lucide-react';

interface GalleryProps {
  theme: SermonTheme;
  sermons: Sermon[];
  onDelete: (id: string) => void;
  onEdit: (sermon: Sermon) => void;
}

const Gallery: React.FC<GalleryProps> = ({ theme, sermons, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const [readingTheme, setReadingTheme] = useState<'light' | 'dark' | 'sepia'>('dark');
  
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const filteredSermons = sermons
    .filter(s => (theme === 'Geral' || s.theme === theme))
    .filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const getThemeStyles = (themeName: string) => {
    switch (themeName) {
      case 'Ofertório':
        return { 
          bg: 'bg-rose-500', 
          text: 'text-rose-500', 
          border: 'hover:border-rose-500/30', 
          lightBg: 'bg-rose-500/5' 
        };
      case 'Doutrina':
        return { 
          bg: 'bg-blue-500', 
          text: 'text-blue-500', 
          border: 'hover:border-blue-500/30', 
          lightBg: 'bg-blue-500/5' 
        };
      case 'Sexta Profética':
        return { 
          bg: 'bg-amber-500', 
          text: 'text-amber-500', 
          border: 'hover:border-amber-500/30', 
          lightBg: 'bg-amber-500/5' 
        };
      case 'Celebrando em Família':
        return { 
          bg: 'bg-emerald-500', 
          text: 'text-emerald-500', 
          border: 'hover:border-emerald-500/30', 
          lightBg: 'bg-emerald-500/5' 
        };
      case 'Círculo de Oração':
        return { 
          bg: 'bg-indigo-500', 
          text: 'text-indigo-500', 
          border: 'hover:border-indigo-500/30', 
          lightBg: 'bg-indigo-500/5' 
        };
      case 'Geral':
      default:
        return { 
          bg: 'bg-sky-500', 
          text: 'text-sky-500', 
          border: 'hover:border-sky-500/30', 
          lightBg: 'bg-sky-500/5' 
        };
    }
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch(e) {}
      audioSourceRef.current = null;
    }
    setIsPlaying(null);
  };

  const handleListen = async (e: React.MouseEvent, sermon: Sermon) => {
    e.preventDefault(); e.stopPropagation();
    if (isPlaying === sermon.id) { stopAudio(); return; }
    stopAudio(); setIsAudioLoading(true); setIsPlaying(sermon.id);
    try {
      const base64Audio = await generateSpeech(sermon.content);
      const audioData = atob(base64Audio || '');
      const uint8Array = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) uint8Array[i] = audioData.charCodeAt(i);
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      const ctx = audioContextRef.current;
      const dataInt16 = new Int16Array(uint8Array.buffer);
      const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
      const source = ctx.createBufferSource();
      source.buffer = buffer; source.connect(ctx.destination);
      source.onended = () => setIsPlaying(null);
      source.start(); audioSourceRef.current = source;
    } catch { setIsPlaying(null); } finally { setIsAudioLoading(false); }
  };

  const readingModeUI = isReadingMode && selectedSermon && createPortal(
    <div className="fixed inset-0 z-[99999] flex flex-col bg-black text-white overflow-hidden">
      <div className="px-6 py-2 flex items-center justify-between border-b border-white/10 bg-black min-h-[48px]">
        <div className="flex items-center gap-8">
          <button onClick={() => { stopAudio(); setIsReadingMode(false); }} className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] text-white">
            <X size={14} strokeWidth={4} /> FINALIZAR LEITURA
          </button>
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40 truncate max-w-md">{selectedSermon.title}</h2>
        </div>
        <div className="flex items-center gap-6">
           <button onClick={(e) => handleListen(e, selectedSermon)} className={`p-1.5 ${isPlaying === selectedSermon.id ? 'text-emerald-500' : 'text-white opacity-40'}`}>
              {isAudioLoading ? <Loader2 className="animate-spin" size={16}/> : isPlaying === selectedSermon.id ? <Square size={16}/> : <Volume2 size={16}/>}
           </button>
           <div className="flex items-center gap-4">
              <button onClick={() => setFontSize(Math.max(16, fontSize - 2))} className="text-[10px] font-black opacity-40">T</button>
              <span className="text-[10px] font-black opacity-20">{fontSize}</span>
              <button onClick={() => setFontSize(Math.min(48, fontSize + 2))} className="text-[14px] font-black opacity-40">T</button>
              <div className="w-px h-4 bg-white/10 mx-2"></div>
              <button onClick={() => setReadingTheme('light')} className={`transition-all ${readingTheme === 'light' ? 'text-emerald-500' : 'text-white opacity-40'}`}><Sun size={14}/></button>
              <button onClick={() => setReadingTheme('sepia')} className={`w-3.5 h-3.5 rounded-sm bg-[#433422] border ${readingTheme === 'sepia' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'opacity-40'}`} />
              <button onClick={() => setReadingTheme('dark')} className={`transition-all ${readingTheme === 'dark' ? 'text-emerald-500' : 'text-white opacity-40'}`}><Moon size={14}/></button>
           </div>
        </div>
      </div>
      <div className={`flex-1 overflow-y-auto no-scrollbar pt-6 pb-24 px-10 transition-colors duration-500 ${readingTheme === 'sepia' ? 'bg-[#F4EADA] text-[#433422]' : readingTheme === 'light' ? 'bg-white text-slate-900' : 'bg-black text-white'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 border-b border-white/5 pb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-2">{selectedSermon.theme}</p>
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-black uppercase tracking-tighter text-white">{selectedSermon.title}</h1>
              <div className="flex-1 h-px bg-white/10"></div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-50 whitespace-nowrap">PREPARADO PARA MINISTRAÇÃO</p>
            </div>
          </div>
          <article className="reading-article font-serif" style={{ fontSize: `${fontSize}px` }} dangerouslySetInnerHTML={{ __html: selectedSermon.content }} />
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <div className="space-y-10">
      <div className="max-w-2xl mx-auto">
        <div className="relative group">
          <div className="absolute left-7 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Pesquisar por tema ou título..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-white dark:bg-[#0A0A0A] border border-slate-100 dark:border-white/5 rounded-full pl-16 pr-8 py-5 outline-none font-bold text-lg shadow-sm focus:shadow-xl transition-all" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {filteredSermons.map((sermon) => {
          const styles = getThemeStyles(sermon.theme);
          return (
            <div 
              key={sermon.id} 
              onClick={() => setSelectedSermon(sermon)} 
              className={`group bg-white dark:bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 transition-all hover:-translate-y-2 flex flex-col min-h-[320px] shadow-sm relative overflow-hidden ${styles.border}`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-10 ${styles.bg}`}></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <span className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.25em] text-white shadow-md ${styles.bg}`}>
                  {sermon.theme}
                </span>
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => handleListen(e, sermon)} 
                    className={`p-2 rounded-lg transition-all ${isPlaying === sermon.id ? styles.bg + ' text-white' : 'text-slate-300 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}`}
                  >
                    {isAudioLoading && isPlaying === sermon.id ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(sermon.id); }} 
                    className="p-2 rounded-lg transition-all text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-black mb-5 dark:text-white uppercase line-clamp-3 leading-tight tracking-tight relative z-10">
                {sermon.title}
              </h3>

              <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase mt-auto mb-8 relative z-10">
                <Calendar size={16} className={styles.text} /> 
                {sermon.date}
              </div>

              <div className={`flex items-center justify-between font-black text-[10px] pt-6 border-t dark:border-white/5 transition-all group-hover:pl-1 ${styles.text}`}>
                <span className="tracking-[0.3em] uppercase">ACESSAR ESBOÇO</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${styles.lightBg} group-hover:scale-110`}>
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {readingModeUI}

      {selectedSermon && !isReadingMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#050505] w-full max-w-7xl max-h-[92vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border dark:border-white/5">
            <div className="p-6 border-b dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button onClick={() => setSelectedSermon(null)} className="p-3 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl transition-colors">
                  <ChevronLeft size={24} />
                </button>
                <div>
                  <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-none">{selectedSermon.title}</h2>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">{selectedSermon.theme} • {selectedSermon.date}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={(e) => handleListen(e, selectedSermon)} 
                  className={`p-4 rounded-2xl transition-all ${isPlaying === selectedSermon.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}
                >
                  {isAudioLoading ? <Loader2 className="animate-spin" size={24}/> : isPlaying === selectedSermon.id ? <Square size={24}/> : <Volume2 size={24}/>}
                </button>
                <button 
                  onClick={() => setIsReadingMode(true)} 
                  className="px-8 py-2 bg-emerald-600 text-white rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  FOCO TOTAL
                </button>
                <button onClick={() => onEdit(selectedSermon)} className="px-8 py-2 bg-slate-100 dark:bg-white/5 dark:text-white rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all">EDITAR</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 lg:p-20 bg-white dark:bg-[#050505]">
              <article className="reading-article prose prose-2xl dark:prose-invert max-w-none text-slate-800 dark:text-slate-200" dangerouslySetInnerHTML={{ __html: selectedSermon.content }} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .reading-article h1 { font-size: 1.3em; font-weight: 900; margin-bottom: 0.6em; border-bottom: 4px solid currentColor; padding-bottom: 0.2em; text-transform: uppercase; margin-top: 0; }
        .reading-article h2 { font-size: 1.1em; font-weight: 800; color: #10b981; text-transform: uppercase; margin-top: 1.4em; margin-bottom: 0.4em; }
        .reading-article p { margin-bottom: 0.8em; }
        .reading-article strong { font-weight: 900; }
      `}</style>
    </div>
  );
};

export default Gallery;
