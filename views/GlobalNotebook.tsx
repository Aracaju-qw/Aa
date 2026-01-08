
import React, { useState, useEffect, useRef } from 'react';
import { 
  BookText, 
  X, 
  Trash2, 
  Copy, 
  Check, 
  History, 
  Save, 
  ChevronRight,
  Clock,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Palette,
  Highlighter,
  ChevronDown,
  Eraser
} from 'lucide-react';
import { NotebookHistoryItem } from '../types';

interface GlobalNotebookProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalNotebook: React.FC<GlobalNotebookProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState(() => localStorage.getItem('paulo_notebook_content') || '');
  const [history, setHistory] = useState<NotebookHistoryItem[]>(() => {
    const saved = localStorage.getItem('paulo_notebook_history');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [showHistory, setShowHistory] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);

  const fontColors = [
    { name: 'Automático', color: 'initial' },
    { name: 'Esmeralda', color: '#10b981' },
    { name: 'Rosa', color: '#f43f5e' },
    { name: 'Azul', color: '#3b82f6' },
    { name: 'Âmbar', color: '#f59e0b' },
  ];

  const highlightColors = [
    { name: 'Amarelo', color: '#fef08a' },
    { name: 'Ciano', color: '#cffafe' },
    { name: 'Lima', color: '#dcfce7' },
    { name: 'Pink', color: '#fce7f3' },
  ];

  useEffect(() => {
    localStorage.setItem('paulo_notebook_content', content);
  }, [content]);

  useEffect(() => {
    localStorage.setItem('paulo_notebook_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (isOpen && editorRef.current) {
      if (editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content;
      }
    }
  }, [isOpen, content]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const text = editorRef.current.innerText.trim();
      
      if (text.length === 0) {
        if (content !== '') setContent('');
      } else {
        setContent(html);
      }
    }
  };

  const format = (cmd: string, val: any = undefined) => {
    document.execCommand(cmd, false, val);
    setShowColorPicker(false);
    setShowHighlightPicker(false);
    handleInput();
  };

  const saveToHistory = () => {
    const plainText = editorRef.current?.innerText || '';
    if (!plainText.trim()) {
      alert('Caderno vazio.');
      return;
    }

    // Verifica se é uma duplicata exata do último item arquivado
    if (history.length > 0 && history[0].content === content) {
      setContent('');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
      alert('Este rascunho já consta no histórico. Nova página em branco iniciada.');
      return;
    }
    
    const newItem: NotebookHistoryItem = {
      id: Date.now().toString(),
      content: content,
      preview: plainText.substring(0, 80) + (plainText.length > 80 ? '...' : ''),
      timestamp: new Date().toLocaleString('pt-BR')
    };

    setHistory(prev => [newItem, ...prev.slice(0, 49)]);
    
    // Limpa o conteúdo para abrir uma nova página em branco automaticamente
    setContent('');
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
    
    alert('Rascunho arquivado! Nova página iniciada.');
  };

  const copyToClipboard = async () => {
    const plainText = editorRef.current?.innerText || '';
    if (!plainText.trim()) return;
    
    try {
      await navigator.clipboard.writeText(plainText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const restoreFromHistory = (item: NotebookHistoryItem) => {
    if (content.length > 0 && content !== item.content) {
      if (!window.confirm('Substituir rascunho atual?')) return;
    }
    setContent(item.content);
    setShowHistory(false);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[9998] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#0A0A0A] z-[9999] shadow-[-20px_0_80px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border-l border-slate-100 dark:border-white/5 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#0A0A0A] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <BookText size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tighter dark:text-white leading-none">Caderno de Paulo</h3>
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1">Mesa de Rascunhos</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {!showHistory && (
          <div className="p-3 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-center gap-1">
            <button onClick={() => format('bold')} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-400 transition-all"><Bold size={16}/></button>
            <button onClick={() => format('italic')} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-400 transition-all"><Italic size={16}/></button>
            <button onClick={() => format('underline')} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-400 transition-all"><UnderlineIcon size={16}/></button>
            
            <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1"></div>

            <div className="relative">
              <button 
                onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); }} 
                className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-400 transition-all flex items-center gap-0.5"
              >
                <Palette size={16}/>
                <ChevronDown size={10}/>
              </button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 flex gap-2">
                  {fontColors.map(c => (
                    <button 
                      key={c.name} 
                      onClick={() => format('foreColor', c.color)} 
                      className="w-6 h-6 rounded-full border border-slate-200" 
                      style={{ backgroundColor: c.color === 'initial' ? (document.documentElement.classList.contains('dark') ? 'white' : 'black') : c.color }} 
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); }} 
                className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-400 transition-all flex items-center gap-0.5"
              >
                <Highlighter size={16}/>
                <ChevronDown size={10}/>
              </button>
              {showHighlightPicker && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 flex gap-2">
                  {highlightColors.map(c => (
                    <button 
                      key={c.name} 
                      onClick={() => format('hiliteColor', c.color)} 
                      className="w-6 h-6 rounded-md border border-slate-200" 
                      style={{ backgroundColor: c.color }} 
                    />
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => format('removeFormat')} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/10 text-rose-400 rounded-lg transition-all"><Eraser size={16}/></button>
          </div>
        )}

        <div className="p-4 bg-slate-50/50 dark:bg-white/[0.01] border-b border-slate-100 dark:border-white/5 flex items-center justify-around gap-2">
          <button 
            onClick={copyToClipboard}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all ${isCopied ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 hover:bg-white dark:hover:bg-white/5'}`}
          >
            {isCopied ? <Check size={18} /> : <Copy size={18} />}
            <span className="text-[8px] font-black uppercase tracking-widest">{isCopied ? 'Copiado' : 'Copiar'}</span>
          </button>

          <button 
            onClick={saveToHistory}
            className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl text-slate-500 hover:bg-white dark:hover:bg-white/5 transition-all group"
          >
            <Save size={18} className="group-hover:text-emerald-500" />
            <span className="text-[8px] font-black uppercase tracking-widest group-hover:text-emerald-500">Arquivar</span>
          </button>

          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all ${showHistory ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 hover:bg-white dark:hover:bg-white/5'}`}
          >
            <History size={18} />
            <span className="text-[8px] font-black uppercase tracking-widest">Histórico</span>
          </button>
        </div>

        <div className="flex-1 relative overflow-hidden bg-white dark:bg-[#0A0A0A]">
          <div className={`absolute inset-0 p-8 overflow-y-auto no-scrollbar transition-opacity duration-300 ${showHistory ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div 
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              onBlur={handleInput}
              className="min-h-full outline-none text-lg font-serif leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap"
              data-placeholder="Folha em branco para seus rascunhos..."
            />
          </div>

          <div className={`absolute inset-0 p-6 overflow-y-auto no-scrollbar bg-slate-50 dark:bg-[#080808] transition-all duration-500 ${showHistory ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Arquivados</h4>
              <button onClick={() => setShowHistory(false)} className="text-emerald-500 text-[9px] font-black uppercase flex items-center gap-1 hover:underline">
                 <ChevronRight size={14} className="rotate-180" /> Editor
              </button>
            </div>
            
            <div className="space-y-4 pb-10">
              {history.length > 0 ? history.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white dark:bg-[#0D0D0D] border border-slate-100 dark:border-white/5 rounded-[2rem] p-6 group hover:border-emerald-500/30 transition-all cursor-pointer shadow-sm relative overflow-hidden"
                  onClick={() => restoreFromHistory(item)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={12} className="text-emerald-500" />
                      <span className="text-[8px] font-black uppercase tracking-widest">{item.timestamp}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }}
                      className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 line-clamp-3 font-serif italic mb-6">
                    {item.preview || 'Sem conteúdo...'}
                  </p>
                </div>
              )) : (
                <div className="py-24 text-center opacity-20">
                  <History size={64} className="mx-auto mb-4" />
                  <p className="text-[9px] font-black uppercase tracking-widest">Histórico Vazio</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        [contentEditable]:empty:before { content: attr(data-placeholder); color: #94a3b8; font-style: italic; }
        .dark [contentEditable]:empty:before { color: #475569; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
};

export default GlobalNotebook;
